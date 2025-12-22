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
        .onAppear {
            checkInitialPermissionState()
        }
        .onChange(of: workoutManager.heartRate) { newValue in
            if newValue > 0 {
                // HR received - permission is working
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
            Spacer()
            
            // Системное время вверху по центру
            Text(Date(), style: .time)
                .font(.title3)
                .fontWeight(.medium)
                .foregroundColor(.white)
            
            Spacer()
            
            // Пульс в центре (крупно)
            VStack(spacing: 4) {
                if workoutManager.heartRate > 0 {
                    HStack(spacing: 6) {
                        Image(systemName: "heart.fill")
                            .font(.system(size: 24))
                            .foregroundColor(.red)
                        Text("\(Int(workoutManager.heartRate))")
                            .font(.system(size: 48, weight: .bold, design: .rounded))
                            .foregroundColor(.white)
                    }
                    Text("BPM")
                        .font(.caption)
                        .foregroundColor(.secondary)
                } else {
                    HStack(spacing: 6) {
                        Image(systemName: "heart.fill")
                            .font(.system(size: 24))
                            .foregroundColor(.gray)
                        Text("--")
                            .font(.system(size: 48, weight: .bold, design: .rounded))
                            .foregroundColor(.secondary)
                    }
                    Text("BPM")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            
            Spacer()
            
            // Статус внизу
            HStack(spacing: 6) {
                Circle()
                    .fill(workoutManager.isActive ? Color.green : Color.gray)
                    .frame(width: 8, height: 8)
                Text(workoutManager.isActive ? "Активна" : "Ожидание")
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }
            .padding(.bottom, 8)
        }
        .padding(.horizontal, 8)
        .onAppear {
            if !workoutManager.isActive {
                print("[ContentView] Permission granted, starting workout")
                workoutManager.startWorkout()
            }
        }
    }
    
    private var deniedView: some View {
        VStack(spacing: 10) {
            Image(systemName: "xmark.circle")
                .font(.system(size: 40))
                .foregroundColor(.red)
            
            Text("Доступ запрещён")
                .font(.headline)
            
            Text("Откройте Настройки > Здоровье > ONDA")
                .font(.caption2)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
            
            Button(action: openHealthSettings) {
                HStack(spacing: 4) {
                    Image(systemName: "gear")
                        .font(.caption)
                    Text("Настройки")
                        .font(.caption)
                }
            }
            .buttonStyle(.borderedProminent)
            .tint(.blue)
            
            Button(action: {
                permissionState = .needsPermission
            }) {
                Text("Повторить")
                    .font(.caption)
            }
            .buttonStyle(.bordered)
        }
        .padding(.horizontal, 8)
    }
    
    // MARK: - Logic
    
    private func checkInitialPermissionState() {
        // Check if we already have heart rate data
        if workoutManager.heartRate > 0 {
            permissionState = .granted
            return
        }
        
        // Check saved permission state
        let wasGranted = UserDefaults.standard.bool(forKey: "healthkit_permission_granted")
        if wasGranted {
            permissionState = .granted
            print("[ContentView] Permission already granted (saved state)")
            return
        }
        
        // Проверяем фактический статус HealthKit
        if workoutManager.isAuthorized {
            permissionState = .granted
            UserDefaults.standard.set(true, forKey: "healthkit_permission_granted")
            print("[ContentView] Permission already granted (HealthKit status)")
            return
        }
        
        // ⏳ Разрешения НЕТ → показываем спиннер (НЕ кнопку!)
        // Кнопка появится только если iPhone не даст разрешения в течение 10 секунд
        print("[ContentView] Permission not granted, waiting for iPhone to request permissions...")
        permissionState = .checking
        
        // Через 10 секунд если ничего не изменилось → показываем кнопку
        DispatchQueue.main.asyncAfter(deadline: .now() + 10.0) {
            if self.permissionState == .checking {
                print("[ContentView] Timeout waiting for iPhone, showing permission button")
                self.permissionState = .needsPermission
            }
        }
    }
    
    private func requestPermission() {
        print("[ContentView] User tapped Allow button")
        
        workoutManager.requestAuthorizationWithCompletion { success in
            DispatchQueue.main.async {
                if success {
                    print("[ContentView] Dialog shown, starting workout and waiting for HR...")
                    // Start workout immediately
                    workoutManager.startWorkout()
                    // Move to waiting state
                    permissionState = .waitingForHR
                    waitingSeconds = 0
                    // Start timer to check if HR arrives
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
                    // HR received - success
                    timer.invalidate()
                    waitingTimer = nil
                    UserDefaults.standard.set(true, forKey: "healthkit_permission_granted")
                    permissionState = .granted
                } else if waitingSeconds >= 5 {
                    // Timeout - no HR received, permission likely denied
                    timer.invalidate()
                    waitingTimer = nil
                    print("[ContentView] No HR after 5 seconds, assuming permission denied")
                    permissionState = .denied
                }
            }
        }
    }
    
    private func openHealthSettings() {
        // Open Health app settings for this app
        if let url = URL(string: "x-apple-health://") {
            WKExtension.shared().openSystemURL(url)
        }
    }
}

#Preview {
    ContentView()
}
