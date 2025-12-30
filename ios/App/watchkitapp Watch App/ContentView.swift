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
        print("[ContentView] isAuthorized: \(workoutManager.isAuthorized)")
        
        // Если разрешения уже есть — просто запускаем workout (если ещё не запущен)
        if workoutManager.isAuthorized {
            print("[ContentView] ✅ Permissions exist, ensuring workout is running...")
            if !workoutManager.isActive {
                workoutManager.startWorkout()
            }
            return
        }
        
        // Разрешений нет — запрашиваем (системное окно появится автоматически)
        print("[ContentView] ⚠️ No permissions → requesting...")
        
        workoutManager.requestAuthorizationWithCompletion { success in
            DispatchQueue.main.async {
                if success {
                    print("[ContentView] ✅ Permissions granted → starting workout")
                    UserDefaults.standard.set(true, forKey: "healthkit_permission_granted")
                    
                    // Пересоздаём workout session для "пробуждения" HealthKit
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                        self.workoutManager.recreateWorkoutSession()
                    }
                } else {
                    print("[ContentView] ❌ Permission request failed, will retry...")
                    // Повторяем попытку через 3 секунды
                    DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
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
