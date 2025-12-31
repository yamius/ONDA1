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
        print("[ContentView] heartRate: \(workoutManager.heartRate), isActive: \(workoutManager.isActive)")
        
        // Если HR уже работает — всё ок
        if workoutManager.heartRate > 0 {
            print("[ContentView] ✅ HR already working (\(Int(workoutManager.heartRate)) bpm)")
            return
        }
        
        // 🔥 Запрашиваем разрешения - это покажет системный диалог (если ещё не показывался)
        print("[ContentView] 📋 Requesting HealthKit permissions...")
        
        workoutManager.requestAuthorizationWithCompletion { _ in
            DispatchQueue.main.async {
                print("[ContentView] 📋 Authorization callback received")
                
                // Запускаем workout сразу после запроса разрешений
                // Диалог уже показан пользователю, он может в любой момент дать разрешения
                self.workoutManager.recreateWorkoutSession()
                
                // Запускаем периодическую проверку HR
                // Если пользователь даст разрешения - HR появится
                self.startHRCheckTimer()
            }
        }
    }
    
    // Периодическая проверка: если HR всё ещё 0 - пересоздаём workout
    private func startHRCheckTimer() {
        // Проверяем каждые 5 секунд в течение 30 секунд
        var checks = 0
        let maxChecks = 6
        
        Timer.scheduledTimer(withTimeInterval: 5.0, repeats: true) { timer in
            checks += 1
            
            if self.workoutManager.heartRate > 0 {
                print("[ContentView] ✅ HR detected: \(Int(self.workoutManager.heartRate)) bpm, stopping timer")
                UserDefaults.standard.set(true, forKey: "healthkit_permission_granted")
                timer.invalidate()
                return
            }
            
            if checks >= maxChecks {
                print("[ContentView] ⏰ HR check timeout (30s), user may need to grant permissions manually")
                timer.invalidate()
                return
            }
            
            print("[ContentView] 🔄 HR still 0, attempt \(checks)/\(maxChecks), recreating workout...")
            self.workoutManager.recreateWorkoutSession()
        }
    }
}

#Preview {
    ContentView()
}
