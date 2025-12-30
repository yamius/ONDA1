//
//  ContentView.swift
//  OndaWatch Watch App
//
//  Created by user945497 on 12/3/25.
//

import SwiftUI
import HealthKit
import WatchKit

struct ContentView: View {
    @StateObject private var workoutManager = WorkoutManager.shared
    @State private var hasStartedInit: Bool = false
    
    var body: some View {
        Group {
            // Простая логика: HR > 0 = главный экран, иначе = ожидание
            if workoutManager.heartRate > 0 {
                mainView
            } else {
                waitingView
            }
        }
        .onAppear {
            let bundleId = Bundle.main.bundleIdentifier ?? "unknown"
            print("[ContentView] 🟢 ContentView appeared - bundle: \(bundleId)")
            
            // Отправляем диагностику на iPhone
            workoutManager.sendStartupDiagnostic(stage: "ContentView.onAppear", bundle: bundleId)
            
            // Запускаем инициализацию один раз
            if !hasStartedInit {
                hasStartedInit = true
                startInitialization()
            }
        }
        .onChange(of: workoutManager.heartRate) { newValue in
            if newValue > 0 {
                // HR получен — сохраняем флаг разрешений
                UserDefaults.standard.set(true, forKey: "healthkit_permission_granted")
                print("[ContentView] ✅ HR received: \(Int(newValue)) bpm")
            }
        }
    }
    
    // MARK: - Views
    
    private var waitingView: some View {
        VStack(spacing: 12) {
            Image(systemName: "heart.circle")
                .font(.system(size: 40))
                .foregroundColor(.cyan)
            
            Text("Ожидайте запуска пульса")
                .font(.headline)
                .multilineTextAlignment(.center)
            
            ProgressView()
                .progressViewStyle(CircularProgressViewStyle())
                .scaleEffect(1.2)
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
    
    // MARK: - Logic
    
    private func startInitialization() {
        print("[ContentView] 🔍 === Initialization Started ===")
        
        // Проверяем был ли диалог уже показан в этой сессии
        let wasPermissionRequested = UserDefaults.standard.bool(forKey: "healthkit_permission_requested_v2")
        let isHRWorking = workoutManager.heartRate > 0
        
        print("[ContentView] wasPermissionRequested: \(wasPermissionRequested), isHRWorking: \(isHRWorking)")
        
        // Если HR уже работает — всё ок
        if isHRWorking {
            print("[ContentView] ✅ HR already working, skipping")
            return
        }
        
        // Если разрешения уже запрашивались и workout активен — ждём HR
        if wasPermissionRequested && workoutManager.isActive {
            print("[ContentView] ⏳ Permissions were requested, workout active, waiting for HR...")
            return
        }
        
        // 🔥 ГЛАВНОЕ: Всегда запрашиваем разрешения при первом запуске
        // На watchOS нельзя узнать статус read-разрешений до показа диалога
        print("[ContentView] 📋 Requesting HealthKit permissions (first launch or retry)...")
        
        workoutManager.requestAuthorizationWithCompletion { success in
            DispatchQueue.main.async {
                // Помечаем что запрос был сделан
                UserDefaults.standard.set(true, forKey: "healthkit_permission_requested_v2")
                
                if success {
                    print("[ContentView] ✅ Permissions granted → starting workout")
                    UserDefaults.standard.set(true, forKey: "healthkit_permission_granted")
                    
                    // Пересоздаём workout session для "пробуждения" HealthKit
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                        self.workoutManager.recreateWorkoutSession()
                    }
                } else {
                    print("[ContentView] ❌ Permission request failed, will retry in 5s...")
                    // Повторяем попытку через 5 секунд
                    DispatchQueue.main.asyncAfter(deadline: .now() + 5.0) {
                        // Сбрасываем флаг для повторной попытки
                        UserDefaults.standard.set(false, forKey: "healthkit_permission_requested_v2")
                        self.startInitialization()
                    }
                }
            }
        }
    }
}

#Preview {
    ContentView()
}
