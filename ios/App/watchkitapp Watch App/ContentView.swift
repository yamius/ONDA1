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
            
            Text("\(15 - waitingSeconds) сек")
                .font(.caption2)
                .foregroundColor(.secondary)
        }
        .padding(.horizontal, 8)
    }
    
    private var mainView: some View {
        VStack(spacing: 0) {
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
        print("[ContentView] 🔍 === Permission Check Started ===")
        print("[ContentView] Current HR: \(workoutManager.heartRate)")
        print("[ContentView] UserDefaults flag: \(UserDefaults.standard.bool(forKey: "healthkit_permission_granted"))")
        print("[ContentView] isAuthorized: \(workoutManager.isAuthorized)")
        
        if workoutManager.heartRate > 0 {
            print("[ContentView] ✅ HR already available → granted")
            permissionState = .granted
            return
        }
        
        let wasGranted = UserDefaults.standard.bool(forKey: "healthkit_permission_granted")
        if wasGranted {
            print("[ContentView] ✅ UserDefaults says granted")
            permissionState = .granted
            print("[ContentView] Permission already granted (saved state)")
            return
        }
        
        // Проверяем фактический статус HealthKit
        if workoutManager.isAuthorized {
            print("[ContentView] ✅ HealthKit says authorized")
            permissionState = .granted
            UserDefaults.standard.set(true, forKey: "healthkit_permission_granted")
            print("[ContentView] Permission already granted (HealthKit status)")
            return
        }
        
        // ⏳ Разрешения НЕТ → показываем спиннер (НЕ кнопку!)
        // Кнопка появится только если iPhone не даст разрешения в течение 3 секунд
        print("[ContentView] ⚠️ No permissions → waiting 3s for iPhone...")
        print("[ContentView] Permission not granted, waiting for iPhone to request permissions...")
        permissionState = .checking
        
        // Через 3 секунды если ничего не изменилось → показываем кнопку
        DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
            if self.permissionState == .checking {
                print("[ContentView] ⏰ Timeout (3s) → showing permission button")
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
        var retryAttempted = false  // Флаг чтобы retry был только 1 раз
        
        waitingTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { timer in
            DispatchQueue.main.async {
                waitingSeconds += 1
                print("[ContentView] Waiting for HR: \(waitingSeconds)s, current HR: \(workoutManager.heartRate), authorized: \(workoutManager.isAuthorized)")
                
                if workoutManager.heartRate > 0 {
                    timer.invalidate()
                    waitingTimer = nil
                    UserDefaults.standard.set(true, forKey: "healthkit_permission_granted")
                    permissionState = .granted
                    print("[ContentView] ✅ HR received, permissions confirmed")
                } else if waitingSeconds >= 8 && !retryAttempted && workoutManager.isAuthorized {
                    // 🔄 После 8 секунд проверяем isAuthorized
                    // Если true → разрешения были даны, но workout не подключился к HR sensor
                    // Перезапускаем workout один раз
                    print("[ContentView] 🔄 Permissions granted but no HR → restarting workout...")
                    retryAttempted = true
                    workoutManager.stopWorkout()
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                        print("[ContentView] 🏃 Starting workout after restart...")
                        workoutManager.startWorkout()
                    }
                    // Сбрасываем таймер на еще 7 секунд
                    waitingSeconds = 0
                } else if waitingSeconds >= 15 {
                    timer.invalidate()
                    waitingTimer = nil
                    print("[ContentView] ❌ No HR after 15 seconds, assuming permission denied")
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
