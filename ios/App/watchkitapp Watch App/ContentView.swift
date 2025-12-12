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
    static let practices = NSLocalizedString("Практики", comment: "Practices")
    static let endPractice = NSLocalizedString("Завершить", comment: "End practice")
    static let loading = NSLocalizedString("Загрузка...", comment: "Loading")
    
    // All 12 parts - matching app structure
    static let part1 = NSLocalizedString("Я есть", comment: "Part 1 - I Am")
    static let part2 = NSLocalizedString("Я двигаюсь", comment: "Part 2 - I Move")
    static let part3 = NSLocalizedString("Я адаптируюсь", comment: "Part 3 - I Adapt")
    static let part4 = NSLocalizedString("Я маневрирую", comment: "Part 4 - I Maneuver")
    static let part5 = NSLocalizedString("Я охраняю территорию", comment: "Part 5 - I Guard Territory")
    static let part6 = NSLocalizedString("Я в стае", comment: "Part 6 - I Am in the Pack")
    static let part7 = NSLocalizedString("Я различаю", comment: "Part 7 - I Distinguish")
    static let part8 = NSLocalizedString("Я фокусируюсь", comment: "Part 8 - I Focus")
    static let part9 = NSLocalizedString("Я планирую", comment: "Part 9 - I Plan")
    static let part10 = NSLocalizedString("Я говорю", comment: "Part 10 - I Speak")
    static let part11 = NSLocalizedString("Я обмениваюсь", comment: "Part 11 - I Exchange")
    static let part12 = NSLocalizedString("Я сотрудничаю", comment: "Part 12 - I Collaborate")
    
    static func partName(for part: Int) -> String {
        switch part {
        case 1: return part1
        case 2: return part2
        case 3: return part3
        case 4: return part4
        case 5: return part5
        case 6: return part6
        case 7: return part7
        case 8: return part8
        case 9: return part9
        case 10: return part10
        case 11: return part11
        case 12: return part12
        default: return part1
        }
    }
}

// MARK: - Practice Model

struct WatchPractice: Identifiable {
    let id: String
    let name: String
    let duration: String
    let targetTime: Int
    let guidingTexts: [String]
}

// MARK: - States

enum PermissionState {
    case checking
    case needsPermission
    case waitingForHR
    case granted
    case denied
}

enum MainViewState {
    case main
    case practiceSession(WatchPractice)
}

// MARK: - Scroll Tracking

struct ScrollOffsetPreferenceKey: PreferenceKey {
    static var defaultValue: CGFloat = 0
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = nextValue()
    }
}

// MARK: - Content View

struct ContentView: View {
    @StateObject private var workoutManager = WorkoutManager.shared
    @State private var permissionState: PermissionState = .checking
    @State private var waitingTimer: Timer?
    @State private var waitingSeconds: Int = 0
    @State private var selectedPart: Int = 1
    @State private var practices: [WatchPractice] = []
    @State private var mainViewState: MainViewState = .main
    @State private var isLoadingPractices: Bool = false
    @State private var showHRInTitle: Bool = false
    
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
                grantedContent
            case .denied:
                deniedView
            }
        }
        .onAppear {
            checkInitialPermissionState()
            setupWCSessionObserver()
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
    
    @ViewBuilder
    private var grantedContent: some View {
        switch mainViewState {
        case .main:
            mainView
        case .practiceSession(let practice):
            PracticeSessionView(
                practice: practice,
                onEnd: { duration in
                    sendPracticeEnded(practiceId: practice.id, duration: duration)
                    mainViewState = .main
                }
            )
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
            ScrollView {
                VStack(spacing: 8) {
                    // Scroll tracking
                    GeometryReader { geo in
                        Color.clear
                            .preference(key: ScrollOffsetPreferenceKey.self, value: geo.frame(in: .named("scroll")).minY)
                    }
                    .frame(height: 0)
                    
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
                    
                    // Part selector
                    NavigationLink {
                        partSelectorList
                    } label: {
                        HStack {
                            VStack(alignment: .leading, spacing: 2) {
                                Text("\(WatchStrings.part) \(selectedPart)")
                                    .font(.system(size: 11, weight: .medium))
                                    .foregroundColor(.cyan.opacity(0.8))
                                Text(WatchStrings.partName(for: selectedPart))
                                    .font(.system(size: 14, weight: .semibold))
                                    .foregroundColor(.white)
                            }
                            Spacer()
                        }
                        .padding(.horizontal, 12)
                        .padding(.vertical, 10)
                        .background(
                            RoundedRectangle(cornerRadius: 10)
                                .fill(Color.cyan.opacity(0.15))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 10)
                                        .stroke(Color.cyan.opacity(0.4), lineWidth: 1)
                                )
                        )
                    }
                    .buttonStyle(.plain)
                    
                    // Practices section
                    if isLoadingPractices {
                        HStack {
                            ProgressView()
                            Text(WatchStrings.loading)
                                .font(.caption2)
                                .foregroundColor(.secondary)
                        }
                        .padding(.vertical, 8)
                    } else if practices.isEmpty {
                        Text(WatchStrings.practices)
                            .font(.caption2)
                            .foregroundColor(.secondary)
                            .padding(.vertical, 8)
                    } else {
                        VStack(spacing: 4) {
                            ForEach(practices) { practice in
                                PracticeRow(practice: practice) {
                                    startPractice(practice)
                                }
                            }
                        }
                    }
                }
                .padding(.horizontal, 8)
                .padding(.top, 2)
            }
        }
        .coordinateSpace(name: "scroll")
        .onPreferenceChange(ScrollOffsetPreferenceKey.self) { offset in
            withAnimation(.easeInOut(duration: 0.2)) {
                showHRInTitle = offset < -20
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarLeading) {
                if showHRInTitle {
                    // Show heart rate when scrolled
                    HStack(spacing: 2) {
                        Image(systemName: "heart.fill")
                            .foregroundColor(.red)
                            .font(.system(size: 13))
                        Text(workoutManager.heartRate > 0 ? "\(Int(workoutManager.heartRate))" : "--")
                            .font(.system(size: 15, weight: .medium))
                    }
                } else {
                    // Show ONDA at initial position
                    Text(WatchStrings.appName)
                        .font(.system(size: 15, weight: .medium))
                }
            }
        }
        .onAppear {
            if !workoutManager.isActive {
                print("[ContentView] Permission granted, starting workout")
                workoutManager.startWorkout()
            }
            requestPracticesFromPhone()
        }
    }
    
    private var partSelectorList: some View {
        PartSelectorView(
            selectedPart: $selectedPart,
            heartRate: workoutManager.heartRate,
            onSelect: { part in
                sendPartToPhone(part)
                requestPracticesFromPhone()
            }
        )
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
    
    // MARK: - WCSession
    
    private func setupWCSessionObserver() {
        NotificationCenter.default.addObserver(
            forName: Notification.Name("PracticesReceived"),
            object: nil,
            queue: .main
        ) { notification in
            if let practicesData = notification.userInfo?["practices"] as? [[String: Any]] {
                self.practices = practicesData.compactMap { data in
                    guard let id = data["id"] as? String,
                          let name = data["name"] as? String,
                          let duration = data["duration"] as? String,
                          let targetTime = data["targetTime"] as? Int,
                          let guidingTexts = data["guidingTexts"] as? [String] else {
                        return nil
                    }
                    return WatchPractice(id: id, name: name, duration: duration, targetTime: targetTime, guidingTexts: guidingTexts)
                }
                self.isLoadingPractices = false
                print("[ContentView] Received \(self.practices.count) practices")
            }
        }
    }
    
    private func requestPracticesFromPhone() {
        guard WCSession.default.activationState == .activated else { return }
        isLoadingPractices = true
        
        let message: [String: Any] = [
            "type": "requestPractices",
            "partNumber": selectedPart,
            "ts": Date().timeIntervalSince1970
        ]
        
        print("[ContentView] Requesting practices for part \(selectedPart)")
        
        if WCSession.default.isReachable {
            WCSession.default.sendMessage(message, replyHandler: nil) { error in
                print("[ContentView] Request practices error: \(error)")
                DispatchQueue.main.async {
                    self.isLoadingPractices = false
                }
            }
        } else {
            WCSession.default.transferUserInfo(message)
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
    
    private func startPractice(_ practice: WatchPractice) {
        guard WCSession.default.activationState == .activated else { return }
        let message: [String: Any] = [
            "type": "startPractice",
            "practiceId": practice.id,
            "ts": Date().timeIntervalSince1970
        ]
        if WCSession.default.isReachable {
            WCSession.default.sendMessage(message, replyHandler: nil, errorHandler: nil)
        } else {
            WCSession.default.transferUserInfo(message)
        }
        mainViewState = .practiceSession(practice)
    }
    
    private func sendPracticeEnded(practiceId: String, duration: Int) {
        guard WCSession.default.activationState == .activated else { return }
        let message: [String: Any] = [
            "type": "endPractice",
            "practiceId": practiceId,
            "duration": duration,
            "ts": Date().timeIntervalSince1970
        ]
        if WCSession.default.isReachable {
            WCSession.default.sendMessage(message, replyHandler: nil, errorHandler: nil)
        } else {
            WCSession.default.transferUserInfo(message)
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

// MARK: - Part Selector View

struct PartSelectorView: View {
    @Binding var selectedPart: Int
    let heartRate: Double
    let onSelect: (Int) -> Void
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        List {
            ForEach(1...12, id: \.self) { part in
                Button(action: {
                    selectedPart = part
                    onSelect(part)
                    dismiss()
                }) {
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("\(WatchStrings.part) \(part)")
                                .font(.system(size: 12))
                                .foregroundColor(.secondary)
                            Text(WatchStrings.partName(for: part))
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
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarLeading) {
                // Heart rate in same line as clock, same size/style
                HStack(spacing: 2) {
                    Image(systemName: "heart.fill")
                        .foregroundColor(.red)
                        .font(.system(size: 13))
                    Text(heartRate > 0 ? "\(Int(heartRate))" : "--")
                        .font(.system(size: 15, weight: .medium))
                }
            }
        }
    }
}

// MARK: - Practice Row

struct PracticeRow: View {
    let practice: WatchPractice
    let onTap: () -> Void
    
    var body: some View {
        Button(action: onTap) {
            HStack {
                VStack(alignment: .leading, spacing: 3) {
                    Text(practice.name)
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(.white)
                        .lineLimit(1)
                    Text(practice.duration)
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(.white.opacity(0.7))
                }
                Spacer()
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 10)
            .background(
                RoundedRectangle(cornerRadius: 10)
                    .fill(Color.green.opacity(0.15))
                    .overlay(
                        RoundedRectangle(cornerRadius: 10)
                            .stroke(Color.green.opacity(0.4), lineWidth: 1)
                    )
            )
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Practice Session View

struct PracticeSessionView: View {
    let practice: WatchPractice
    let onEnd: (Int) -> Void
    
    @ObservedObject private var workoutManager = WorkoutManager.shared
    
    @State private var elapsedSeconds: Int = 0
    @State private var currentTextIndex: Int = 0
    @State private var textOpacity: Double = 1.0
    @State private var timer: Timer?
    @State private var audioReady = false
    @State private var checkingCache = true
    
    private let textChangeInterval: Int = 15
    
    var body: some View {
        VStack(spacing: 4) {
            // Audio loading indicator
            if workoutManager.isAudioLoading || checkingCache {
                VStack(spacing: 8) {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .cyan))
                    Text(checkingCache ? "Checking audio..." : workoutManager.audioLoadingProgress)
                        .font(.system(size: 12))
                        .foregroundColor(.secondary)
                }
                .padding()
            } else {
                // Guiding text - maximized for readability
                ScrollView {
                    Text(currentGuidingText)
                        .font(.system(size: 18, weight: .medium))
                        .foregroundColor(.white)
                        .multilineTextAlignment(.center)
                        .opacity(textOpacity)
                        .animation(.easeInOut(duration: 0.5), value: textOpacity)
                        .padding(.horizontal, 4)
                        .padding(.vertical, 8)
                }
                
                // Audio playing indicator
                if workoutManager.isAudioPlaying {
                    HStack(spacing: 4) {
                        Image(systemName: "speaker.wave.2.fill")
                            .foregroundColor(.cyan)
                            .font(.system(size: 10))
                        Text("Playing")
                            .font(.system(size: 10))
                            .foregroundColor(.cyan)
                    }
                }
            }
            
            // End button - compact at bottom, cyan color matching Part theme
            Button(action: endPractice) {
                Text(WatchStrings.endPractice)
                    .font(.system(size: 12, weight: .medium))
            }
            .buttonStyle(.borderedProminent)
            .tint(.cyan)
        }
        .padding(.horizontal, 4)
        .padding(.top, 2)
        .padding(.bottom, 4)
        .onAppear {
            checkAudioAndStart()
        }
        .onDisappear {
            timer?.invalidate()
            timer = nil
            workoutManager.stopAudio()
        }
        .onReceive(NotificationCenter.default.publisher(for: Notification.Name("AudioReady"))) { notification in
            if let practiceId = notification.userInfo?["practiceId"] as? String,
               practiceId == practice.id,
               let url = notification.userInfo?["url"] as? URL {
                audioReady = true
                workoutManager.playAudio(from: url)
                startTimer()
            }
        }
    }
    
    private func checkAudioAndStart() {
        // Check if audio is already cached
        if let cachedURL = workoutManager.getCachedAudioURL(practiceId: practice.id) {
            checkingCache = false
            audioReady = true
            workoutManager.playAudio(from: cachedURL)
            startTimer()
        } else {
            // Request audio from iPhone
            checkingCache = false
            workoutManager.requestAudio(practiceId: practice.id)
            // Timer will start when audio arrives
        }
    }
    
    private var currentGuidingText: String {
        guard !practice.guidingTexts.isEmpty else { return "" }
        return practice.guidingTexts[currentTextIndex % practice.guidingTexts.count]
    }
    
    private func startTimer() {
        timer?.invalidate()
        elapsedSeconds = 0
        currentTextIndex = 0
        textOpacity = 1.0
        
        timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { _ in
            DispatchQueue.main.async {
                elapsedSeconds += 1
                
                // Change text every 15 seconds with fade
                if elapsedSeconds > 0 && elapsedSeconds % textChangeInterval == 0 {
                    // Fade out
                    withAnimation(.easeOut(duration: 0.5)) {
                        textOpacity = 0.0
                    }
                    
                    // After fade out, change text and fade in
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                        currentTextIndex += 1
                        withAnimation(.easeIn(duration: 0.5)) {
                            textOpacity = 1.0
                        }
                    }
                }
            }
        }
    }
    
    private func endPractice() {
        timer?.invalidate()
        timer = nil
        onEnd(elapsedSeconds)
    }
}

#Preview {
    ContentView()
}
