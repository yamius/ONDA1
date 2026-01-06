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
    @State private var showStartButton: Bool = false
    @State private var timeoutTimer: Timer? = nil
    
    var body: some View {
        Group {
            if workoutManager.heartRate > 0 {
                mainView
            } else if showStartButton {
                // After 30 sec without HR — show button
                startView
            } else {
                // First show spinner
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
                startTimeoutTimer()
            }
        }
        .onChange(of: workoutManager.heartRate) { newValue in
            if newValue > 0 {
                // HR получен — сохраняем флаг, останавливаем таймер
                UserDefaults.standard.set(true, forKey: "healthkit_permission_granted")
                showStartButton = false
                timeoutTimer?.invalidate()
                timeoutTimer = nil
                print("[ContentView] ✅ HR received: \(Int(newValue)) bpm")
            }
        }
        .onDisappear {
            timeoutTimer?.invalidate()
            timeoutTimer = nil
        }
    }
    
    // Timer: show "Start" button after 30 sec
    private func startTimeoutTimer() {
        timeoutTimer?.invalidate()
        timeoutTimer = Timer.scheduledTimer(withTimeInterval: 30.0, repeats: false) { _ in
            DispatchQueue.main.async {
                if self.workoutManager.heartRate == 0 {
                    print("[ContentView] ⏰ 30s timeout, showing start button")
                    self.showStartButton = true
                }
            }
        }
    }
    
    // MARK: - Views
    
    // Spinner — shown for first 30 sec
    private var waitingView: some View {
        VStack(spacing: 12) {
            Image(systemName: "heart.circle")
                .font(.system(size: 40))
                .foregroundColor(.cyan)
            
            Text("Starting\nheart rate...")
                .font(.subheadline)
                .multilineTextAlignment(.center)
                .lineLimit(2)
            
            ProgressView()
                .progressViewStyle(CircularProgressViewStyle())
                .scaleEffect(1.2)
        }
        .padding(.horizontal, 8)
    }
    
    // Start button — shown after 30 sec without HR
    private var startView: some View {
        VStack(spacing: 10) {
            Image(systemName: "heart.circle")
                .font(.system(size: 36))
                .foregroundColor(.cyan)
            
            Button(action: {
                print("[ContentView] 🚀 Start button pressed")
                showStartButton = false
                hasStartedInit = false
                startInitialization()
                startTimeoutTimer()
            }) {
                HStack {
                    Image(systemName: "play.fill")
                    Text("Start")
                }
                .font(.body)
            }
            .buttonStyle(.borderedProminent)
            .tint(.cyan)
            
            Spacer()
            
            Text("Settings → Health → ONDA → Heart Rate")
                .font(.caption2)
                .multilineTextAlignment(.center)
                .foregroundColor(.secondary)
        }
        .padding(.horizontal, 8)
        .padding(.top, 8)
    }
    
    private var mainView: some View {
        VStack(spacing: 0) {
            Spacer()
            
            // Heart rate in center (large)
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
            
            // Status at bottom
            HStack(spacing: 6) {
                Circle()
                    .fill(workoutManager.isActive ? Color.green : Color.gray)
                    .frame(width: 8, height: 8)
                Text(workoutManager.isActive ? "Active" : "Waiting")
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
        print("[ContentView] 🔍 === Start button pressed ===")
        print("[ContentView] heartRate: \(workoutManager.heartRate), isActive: \(workoutManager.isActive)")
        
        // Если HR уже работает — всё ок
        if workoutManager.heartRate > 0 {
            print("[ContentView] ✅ HR already working (\(Int(workoutManager.heartRate)) bpm)")
            return
        }
        
        // Запрашиваем разрешения - это покажет системный диалог
        print("[ContentView] 📋 Requesting HealthKit permissions...")
        
        workoutManager.requestAuthorizationWithCompletion { _ in
            DispatchQueue.main.async {
                print("[ContentView] 📋 Authorization callback → recreating workout")
                self.workoutManager.recreateWorkoutSession()
            }
        }
    }
}

#Preview {
    ContentView()
}
