//
//  ContentView.swift
//  OndaWatch Watch App
//
//  Created by user945497 on 12/3/25.
//

import SwiftUI
import HealthKit
import WatchKit
import WatchConnectivity

// MARK: - Localization

enum WatchStrings {
    static let appName = "ONDA"
    static let bpm = "BPM"
    
    // Permission screens
    static let healthAccess = NSLocalizedString("Доступ к здоровью", comment: "Health access title")
    static let allowHeartRate = NSLocalizedString("Разрешите чтение пульса для практик", comment: "Allow heart rate")
    static let allow = NSLocalizedString("Разрешить", comment: "Allow button")
    static let check = NSLocalizedString("Проверить", comment: "Check button")
    static let waitingForPulse = NSLocalizedString("Ожидание пульса...", comment: "Waiting for pulse")
    static let seconds = NSLocalizedString("сек", comment: "Seconds abbreviation")
    static let accessDenied = NSLocalizedString("Доступ запрещён", comment: "Access denied")
    static let openOnIPhone = NSLocalizedString("На iPhone откройте:", comment: "Open on iPhone")
    static let settingsPath = NSLocalizedString("Настройки → Здоровье → Доступ к данным → ONDA", comment: "Settings path")
    
    // Main screen
    static let active = NSLocalizedString("Активна", comment: "Active status")
    static let waiting = NSLocalizedString("Ожидание", comment: "Waiting status")
    static let part = NSLocalizedString("Часть", comment: "Part/Circuit")
    
    // Circuits - matching app localization keys
    static let circuit1 = NSLocalizedString("Я есть", comment: "Circuit 1 - I Am")
    static let circuit2 = NSLocalizedString("Я двигаюсь", comment: "Circuit 2 - I Move")
    static let circuit3 = NSLocalizedString("Я адаптируюсь", comment: "Circuit 3 - I Adapt")
    
    static func circuitName(for part: Int) -> String {
        switch part {
        case 1: return circuit1
        case 2: return circuit2
        case 3: return circuit3
        default: return circuit1
        }
    }
}

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
    @State private var selectedPart: Int = 1
    
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
            Text(WatchStrings.appName)
                .font(.title3)
                .fontWeight(.bold)
                .foregroundColor(.cyan)
            
            ProgressView()
                .progressViewStyle(CircularProgressViewStyle())
        }
    }
    
    private var permissionRequestView: some View {
        VStack(spacing: 10) {
            Image(systemName: "heart.circle")
                .font(.system(size: 40))
                .foregroundColor(.red)
            
            Text(WatchStrings.healthAccess)
                .font(.headline)
                .multilineTextAlignment(.center)
            
            Text(WatchStrings.allowHeartRate)
                .font(.caption2)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
            
            Button(action: requestPermission) {
                HStack(spacing: 4) {
                    Image(systemName: "checkmark.shield")
                        .font(.caption)
                    Text(WatchStrings.allow)
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
            
            Text(WatchStrings.waitingForPulse)
                .font(.headline)
            
            ProgressView()
                .progressViewStyle(CircularProgressViewStyle())
            
            Text("\(5 - waitingSeconds) \(WatchStrings.seconds)")
                .font(.caption2)
                .foregroundColor(.secondary)
        }
        .padding(.horizontal, 8)
    }
    
    private var mainView: some View {
        NavigationView {
        VStack(spacing: 8) {
            // Header with ONDA - aligned with system time
            HStack {
                Text(WatchStrings.appName)
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundColor(.cyan)
                Spacer()
            }
            
            Spacer(minLength: 4)
            
            // Heart rate card
            VStack(spacing: 4) {
                HStack(spacing: 4) {
                    Image(systemName: "heart.fill")
                        .foregroundColor(.red)
                        .font(.system(size: 16))
                    
                    if workoutManager.heartRate > 0 {
                        Text("\(Int(workoutManager.heartRate))")
                            .font(.system(size: 28, weight: .bold, design: .rounded))
                    } else {
                        Text("--")
                            .font(.system(size: 28, weight: .bold, design: .rounded))
                            .foregroundColor(.secondary)
                    }
                    
                    Text(WatchStrings.bpm)
                        .font(.system(size: 10))
                        .foregroundColor(.secondary)
                }
                
                HStack(spacing: 4) {
                    Circle()
                        .fill(workoutManager.isActive ? Color.green : Color.gray)
                        .frame(width: 5, height: 5)
                    Text(workoutManager.isActive ? WatchStrings.active : WatchStrings.waiting)
                        .font(.system(size: 10))
                        .foregroundColor(.secondary)
                }
            }
            .padding(.horizontal, 10)
            .padding(.vertical, 8)
            .background(
                RoundedRectangle(cornerRadius: 10)
                    .fill(Color.black.opacity(0.3))
                    .overlay(
                        RoundedRectangle(cornerRadius: 10)
                            .stroke(Color.white.opacity(0.1), lineWidth: 1)
                    )
            )
            
            Spacer(minLength: 4)
            
            // Circuit selector - shows "Часть X" + circuit name
            NavigationLink {
                List {
                    ForEach(1...3, id: \.self) { part in
                        Button(action: {
                            selectedPart = part
                            sendPartToPhone(part)
                        }) {
                            HStack {
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("\(WatchStrings.part) \(part)")
                                        .font(.system(size: 12))
                                        .foregroundColor(.secondary)
                                    Text(WatchStrings.circuitName(for: part))
                                        .font(.system(size: 14, weight: .medium))
                                }
                                Spacer()
                                if selectedPart == part {
                                    Image(systemName: "checkmark")
                                        .foregroundColor(.cyan)
                                }
                            }
                        }
                        .buttonStyle(.plain)
                    }
                }
            } label: {
                VStack(alignment: .leading, spacing: 1) {
                    Text("\(WatchStrings.part) \(selectedPart)")
                        .font(.system(size: 10))
                        .foregroundColor(.secondary)
                    Text(WatchStrings.circuitName(for: selectedPart))
                        .font(.system(size: 13, weight: .medium))
                }
            }
        }
        .padding(.horizontal, 8)
        .padding(.top, 2)
        }
        .onAppear {
            if !workoutManager.isActive {
                print("[ContentView] Permission granted, starting workout")
                workoutManager.startWorkout()
            }
        }
    }
    
    private func sendPartToPhone(_ part: Int) {
        guard WCSession.default.activationState == .activated else { return }
        let message: [String: Any] = [
            "type": "partChanged",
            "value": part,
            "ts": Date().timeIntervalSince1970
        ]
        if WCSession.default.isReachable {
            WCSession.default.sendMessage(message, replyHandler: nil, errorHandler: nil)
        } else {
            WCSession.default.transferUserInfo(message)
        }
    }
    
    private var deniedView: some View {
        ScrollView {
            VStack(spacing: 8) {
                Image(systemName: "xmark.circle")
                    .font(.system(size: 32))
                    .foregroundColor(.red)
                
                Text(WatchStrings.accessDenied)
                    .font(.headline)
                
                VStack(alignment: .leading, spacing: 4) {
                    Text(WatchStrings.openOnIPhone)
                        .font(.caption2)
                        .foregroundColor(.secondary)
                    Text(WatchStrings.settingsPath)
                        .font(.caption2)
                        .foregroundColor(.cyan)
                }
                .multilineTextAlignment(.leading)
                .padding(.vertical, 4)
                
                Button(action: retryAfterSettingsChange) {
                    HStack(spacing: 4) {
                        Image(systemName: "arrow.clockwise")
                            .font(.caption)
                        Text(WatchStrings.check)
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
