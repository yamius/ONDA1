//
//  ContentView.swift
//  OndaWatch Watch App
//
//  Created by user945497 on 12/3/25.
//

import SwiftUI
import HealthKit
import WatchKit

enum PermissionState {
    case checking
    case needsPermission
    case waitingForHR
    case granted
    case denied
}

struct ContentView: View {
    @StateObject private var workoutManager = WorkoutManager.shared
    @State private var permissionState: PermissionState = .checking
    @State private var waitingTimer: Timer?
    @State private var waitingSeconds: Int = 0
    
    var body: some View {
        NavigationStack {
            Group {
                switch permissionState {
                case .checking:
                    checkingView
                case .needsPermission:
                    permissionRequestView
                case .waitingForHR:
                    waitingForHRView
                case .granted:
                    mainView
                case .denied:
                    deniedView
                }
            }
        }
        .onAppear {
            checkInitialPermissionState()
        }
        .onChange(of: workoutManager.heartRate) { newValue in
            if newValue > 0 {
                waitingTimer?.invalidate()
                waitingTimer = nil
                if permissionState != .granted {
                    UserDefaults.standard.set(true, forKey: "healthkit_permission_granted")
                    permissionState = .granted
                }
            }
        }
        .onDisappear {
            waitingTimer?.invalidate()
            waitingTimer = nil
        }
    }
    
    // MARK: - Views
    
    private var checkingView: some View {
        VStack(spacing: 12) {
            Image(systemName: "waveform.path.ecg")
                .font(.system(size: 36))
                .foregroundColor(.cyan)
            
            Text("ONDA")
                .font(.title3)
                .fontWeight(.bold)
            
            ProgressView()
                .progressViewStyle(CircularProgressViewStyle())
        }
    }
    
    private var permissionRequestView: some View {
        VStack(spacing: 10) {
            Image(systemName: "heart.circle")
                .font(.system(size: 40))
                .foregroundColor(.red)
            
            Text("Доступ к здоровью")
                .font(.headline)
                .multilineTextAlignment(.center)
            
            Text("Разрешите чтение пульса для практик")
                .font(.caption2)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
            
            Button(action: requestPermission) {
                HStack(spacing: 4) {
                    Image(systemName: "checkmark.shield")
                        .font(.caption)
                    Text("Разрешить")
                        .font(.caption)
                }
            }
            .buttonStyle(.borderedProminent)
            .tint(.green)
        }
        .padding(.horizontal, 8)
    }
    
    private var waitingForHRView: some View {
        VStack(spacing: 10) {
            Image(systemName: "heart.circle")
                .font(.system(size: 40))
                .foregroundColor(.cyan)
            
            Text("Ожидание пульса...")
                .font(.headline)
            
            ProgressView()
                .progressViewStyle(CircularProgressViewStyle())
            
            Text("\(5 - waitingSeconds) сек")
                .font(.caption2)
                .foregroundColor(.secondary)
        }
        .padding(.horizontal, 8)
    }
    
    private var mainView: some View {
        VStack(spacing: 0) {
            // Heart rate card - 20% larger, close to top like "Статистика"
            VStack(spacing: 8) {
                HStack(spacing: 6) {
                    Image(systemName: "heart.fill")
                        .foregroundColor(.red)
                        .font(.system(size: 26))
                    
                    if workoutManager.heartRate > 0 {
                        Text("\(Int(workoutManager.heartRate))")
                            .font(.system(size: 46, weight: .bold, design: .rounded))
                    } else {
                        Text("--")
                            .font(.system(size: 46, weight: .bold, design: .rounded))
                            .foregroundColor(.secondary)
                    }
                    
                    Text("BPM")
                        .font(.footnote)
                        .foregroundColor(.secondary)
                }
                
                HStack(spacing: 5) {
                    Circle()
                        .fill(workoutManager.isActive ? Color.green : Color.gray)
                        .frame(width: 7, height: 7)
                    Text(workoutManager.isActive ? "Активна" : "Ожидание")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 12)
            .background(
                RoundedRectangle(cornerRadius: 14)
                    .fill(Color.black.opacity(0.3))
                    .overlay(
                        RoundedRectangle(cornerRadius: 14)
                            .stroke(Color.white.opacity(0.1), lineWidth: 1)
                    )
            )
        }
        .toolbar {
            ToolbarItem(placement: .topBarLeading) {
                Text("ONDA")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Color(red: 0.4, green: 0.8, blue: 0.5))
            }
        }
        .onAppear {
            if !workoutManager.isActive {
                print("[ContentView] Permission granted, starting workout")
                workoutManager.startWorkout()
            }
        }
    }
    
    private var deniedView: some View {
        ScrollView {
            VStack(spacing: 8) {
                Image(systemName: "xmark.circle")
                    .font(.system(size: 32))
                    .foregroundColor(.red)
                
                Text("Доступ запрещён")
                    .font(.headline)
                
                VStack(alignment: .leading, spacing: 4) {
                    Text("На iPhone откройте:")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                    Text("Настройки → Здоровье → Доступ к данным → ONDA")
                        .font(.caption2)
                        .foregroundColor(.cyan)
                }
                .multilineTextAlignment(.leading)
                .padding(.vertical, 4)
                
                Button(action: retryAfterSettingsChange) {
                    HStack(spacing: 4) {
                        Image(systemName: "arrow.clockwise")
                            .font(.caption)
                        Text("Проверить")
                            .font(.caption)
                    }
                }
                .buttonStyle(.borderedProminent)
                .tint(.green)
            }
            .padding(.horizontal, 8)
        }
    }
    
    // MARK: - Logic
    
    private func checkInitialPermissionState() {
        if workoutManager.heartRate > 0 {
            permissionState = .granted
            return
        }
        
        let wasGranted = UserDefaults.standard.bool(forKey: "healthkit_permission_granted")
        if wasGranted {
            permissionState = .granted
            return
        }
        
        permissionState = .needsPermission
    }
    
    private func requestPermission() {
        print("[ContentView] User tapped Allow button")
        
        workoutManager.requestAuthorizationWithCompletion { success in
            DispatchQueue.main.async {
                if success {
                    print("[ContentView] Dialog shown, starting workout and waiting for HR...")
                    workoutManager.startWorkout()
                    permissionState = .waitingForHR
                    waitingSeconds = 0
                    startWaitingTimer()
                } else {
                    print("[ContentView] Permission request failed")
                    permissionState = .denied
                }
            }
        }
    }
    
    private func startWaitingTimer() {
        waitingTimer?.invalidate()
        waitingTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { timer in
            DispatchQueue.main.async {
                waitingSeconds += 1
                print("[ContentView] Waiting for HR: \(waitingSeconds)s, current HR: \(workoutManager.heartRate)")
                
                if workoutManager.heartRate > 0 {
                    timer.invalidate()
                    waitingTimer = nil
                    UserDefaults.standard.set(true, forKey: "healthkit_permission_granted")
                    permissionState = .granted
                } else if waitingSeconds >= 5 {
                    timer.invalidate()
                    waitingTimer = nil
                    print("[ContentView] No HR after 5 seconds, assuming permission denied")
                    permissionState = .denied
                }
            }
        }
    }
    
    private func retryAfterSettingsChange() {
        print("[ContentView] Retry after settings change - starting workout directly")
        workoutManager.startWorkout()
        permissionState = .waitingForHR
        waitingSeconds = 0
        startWaitingTimer()
    }
    
}

#Preview {
    ContentView()
}
