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
    @State private var retryAttempted: Bool = false
    @State private var lastHRValue: Double = 0
    @State private var lastHRUpdateTime: Date = Date()
    
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
            print("[ContentView] 🟢 ContentView appeared (app became visible)")
            checkInitialPermissionState()
        }
        .onDisappear {
            print("[ContentView] 🔴 ContentView disappeared (app closing/backgrounding)")
            waitingTimer?.invalidate()
            waitingTimer = nil
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
        .onChange(of: workoutManager.permissionJustGranted) { justGranted in
            guard justGranted else { return }
            
            print("[ContentView] 🎉 Permission granted detected via @Published!")
            
            // 🔥 КЛЮЧЕВОЕ: Останавливаем таймер и переключаем UI state
            waitingTimer?.invalidate()
            waitingTimer = nil
            waitingSeconds = 0
            
            // 🔥 Переключаем в .granted - это вызовет mainView.onAppear
            // который запустит ЧИСТЫЙ startWorkout() (как при перезапуске)
            print("[ContentView] ✅ Setting permissionState = .granted (clean restart)")
            permissionState = .granted
            
            // Сбрасываем флаг
            workoutManager.permissionJustGranted = false
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
            print("[ContentView] 🟢 mainView appeared")
            if !workoutManager.isActive {
                print("[ContentView] 💡 Permission granted, starting workout (isActive=false)")
                workoutManager.startWorkout()
            } else {
                print("[ContentView] ℹ️ Workout already active (isActive=true)")
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
        print("[ContentView] 🔍 === Permission Check Started ===")
        print("[ContentView] UserDefaults flag: \(UserDefaults.standard.bool(forKey: "healthkit_permission_granted"))")
        print("[ContentView] isAuthorized: \(workoutManager.isAuthorized)")
        
        // 🔥 УДАЛЕНА ПРОВЕРКА #1: if workoutManager.heartRate > 0
        // Причина: heartRate > 0 НЕ означает наличие разрешений!
        // Это может быть старое значение из памяти, что позволяет обойти запрос разрешений.
        
        // Check saved permission state
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
        retryAttempted = false  // Сбрасываем флаг при новом старте
        lastHRValue = 0
        lastHRUpdateTime = Date()
        
        waitingTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { timer in
            DispatchQueue.main.async {
                self.waitingSeconds += 1
                
                // 🔥 НОВОЕ: Отслеживаем изменение HR
                if self.workoutManager.heartRate != self.lastHRValue {
                    self.lastHRValue = self.workoutManager.heartRate
                    self.lastHRUpdateTime = Date()
                    print("[ContentView] 💓 HR updated to: \(Int(self.lastHRValue)) bpm")
                }
                
                let timeSinceLastHR = Date().timeIntervalSince(self.lastHRUpdateTime)
                
                print("[ContentView] Waiting for HR: \(self.waitingSeconds)s, current HR: \(Int(self.workoutManager.heartRate)), last update: \(Int(timeSinceLastHR))s ago, authorized: \(self.workoutManager.isAuthorized), retry: \(self.retryAttempted)")
                
                // Если HR получен и продолжает обновляться (< 10 секунд с последнего обновления)
                if self.workoutManager.heartRate > 0 && timeSinceLastHR < 10 {
                    timer.invalidate()
                    self.waitingTimer = nil
                    UserDefaults.standard.set(true, forKey: "healthkit_permission_granted")
                    self.permissionState = .granted
                    print("[ContentView] ✅ HR stable and updating, permissions confirmed")
                }
                // Если HR был, но перестал обновляться больше 10 секунд
                else if self.workoutManager.heartRate > 0 && timeSinceLastHR >= 10 && !self.retryAttempted {
                    print("[ContentView] ⚠️ HR stopped updating (stale for \(Int(timeSinceLastHR))s) → restarting workout...")
                    self.retryAttempted = true
                    self.workoutManager.stopWorkout()
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                        print("[ContentView] 🏃 Starting workout after HR stale...")
                        self.workoutManager.startWorkout()
                    }
                    // Сбрасываем таймер на еще 7 секунд
                    self.waitingSeconds = 0
                    self.lastHRUpdateTime = Date()  // Сбрасываем время последнего обновления
                }
                // Если HR вообще не пришел через 8 секунд
                else if self.waitingSeconds >= 8 && self.workoutManager.heartRate == 0 && !self.retryAttempted && self.workoutManager.isAuthorized {
                    // 🔄 После 8 секунд проверяем isAuthorized
                    // Если true → разрешения были даны, но workout не подключился к HR sensor
                    // Перезапускаем workout один раз
                    print("[ContentView] 🔄 Permissions granted but no HR → restarting workout...")
                    self.retryAttempted = true
                    self.workoutManager.stopWorkout()
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                        print("[ContentView] 🏃 Starting workout after restart...")
                        self.workoutManager.startWorkout()
                    }
                    // Сбрасываем таймер на еще 7 секунд
                    self.waitingSeconds = 0
                    self.lastHRUpdateTime = Date()
                }
                // Timeout - 15 секунд прошло
                else if self.waitingSeconds >= 15 {
                    timer.invalidate()
                    self.waitingTimer = nil
                    print("[ContentView] ❌ No stable HR after 15 seconds, assuming permission denied")
                    self.permissionState = .denied
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
