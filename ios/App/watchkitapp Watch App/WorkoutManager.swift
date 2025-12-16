import Foundation
import HealthKit
import WatchConnectivity
import WatchKit
import Combine

// MARK: - Debug Log Entry
struct DebugLogEntry: Identifiable {
    let id = UUID()
    let timestamp: Date
    let correlationId: String?
    let event: String
    let details: String
    
    var formatted: String {
        let tf = DateFormatter()
        tf.dateFormat = "HH:mm:ss.SSS"
        let ts = tf.string(from: timestamp)
        let corr = correlationId != nil ? "[\(correlationId!.prefix(8))]" : ""
        return "\(ts)\(corr) \(event): \(details)"
    }
}

class WorkoutManager: NSObject, ObservableObject {
    static let shared = WorkoutManager()
    
    private let healthStore = HKHealthStore()
    private var session: HKWorkoutSession?
    private var builder: HKLiveWorkoutBuilder?
    private var extendedSession: WKExtendedRuntimeSession?
    
    @Published var heartRate: Double = 0
    @Published var isActive = false
    @Published var authorizationStatus: HKAuthorizationStatus = .notDetermined
    
    private var keepAliveTimer: Timer?
    private var disconnectTime: Date?
    private let keepAliveDuration: TimeInterval = 90.0
    
    @Published var isWaitingForPermissions = false
    private var permissionWaitTimer: Timer?
    
    // Дедупликация команд (команда может прийти через несколько каналов)
    private var lastProcessedCommands: [String: TimeInterval] = [:]
    private let commandDeduplicationWindow: TimeInterval = 5.0 // 5 секунд
    
    // MARK: - Debug Logging
    @Published var debugLogs: [DebugLogEntry] = []
    private let maxLogEntries = 100
    private var currentCorrelationId: String?
    private var lastHRTime: Date?
    private var workoutStartTime: Date?
    
    // Watchdog для отслеживания потери HR
    private var watchdogTimer: Timer?
    private let watchdogTimeout: TimeInterval = 20.0
    
    private func log(_ event: String, _ details: String = "") {
        let entry = DebugLogEntry(
            timestamp: Date(),
            correlationId: currentCorrelationId,
            event: event,
            details: details
        )
        
        DispatchQueue.main.async {
            self.debugLogs.append(entry)
            if self.debugLogs.count > self.maxLogEntries {
                self.debugLogs.removeFirst()
            }
        }
        
        // Также отправляем лог на телефон
        sendLogToPhone(entry)
        
        print("[WM] \(entry.formatted)")
    }
    
    private func sendLogToPhone(_ entry: DebugLogEntry) {
        guard WCSession.default.activationState == .activated else { return }
        
        let logData: [String: Any] = [
            "type": "debugLog",
            "device": "watch",
            "event": entry.event,
            "details": entry.details,
            "ts": entry.timestamp.timeIntervalSince1970,
            "correlationId": entry.correlationId ?? ""
        ]
        
        // Используем transferUserInfo для надёжной доставки логов
        WCSession.default.transferUserInfo(logData)
    }
    
    private func dumpState() -> String {
        let wcState = WCSession.default.activationState.rawValue
        let wcReachable = WCSession.default.isReachable
        let hkState = session?.state.rawValue ?? -1
        let extState = extendedSession?.state.rawValue ?? -1
        let hrAge = lastHRTime != nil ? Int(Date().timeIntervalSince(lastHRTime!)) : -1
        let workoutDur = workoutStartTime != nil ? Int(Date().timeIntervalSince(workoutStartTime!)) : -1
        
        return "WC:\(wcState)/R:\(wcReachable) HK:\(hkState) Ext:\(extState) HR_age:\(hrAge)s WO:\(workoutDur)s perm:\(isWaitingForPermissions)"
    }
    
    private func startWatchdog() {
        watchdogTimer?.invalidate()
        watchdogTimer = Timer.scheduledTimer(withTimeInterval: watchdogTimeout, repeats: false) { [weak self] _ in
            guard let self = self else { return }
            self.log("WATCHDOG", "Timeout! State: \(self.dumpState())")
        }
    }
    
    private func resetWatchdog() {
        watchdogTimer?.invalidate()
        watchdogTimer = nil
    }
    
    override init() {
        super.init()
        log("INIT", "WorkoutManager starting")
        setupWatchConnectivity()
        startExtendedSession()
    }
    
    private func setupWatchConnectivity() {
        if WCSession.isSupported() {
            WCSession.default.delegate = self
            WCSession.default.activate()
            log("WC_SETUP", "WCSession activating")
        } else {
            log("WC_SETUP", "WCSession NOT supported")
        }
    }
    
    func startExtendedSession() {
        guard extendedSession == nil || extendedSession?.state == .invalid else {
            log("EXT_SESSION", "Already active, state: \(extendedSession?.state.rawValue ?? -1)")
            return
        }
        
        extendedSession = WKExtendedRuntimeSession()
        extendedSession?.delegate = self
        extendedSession?.start()
        log("EXT_SESSION", "Starting new extended session")
    }
    
    func stopExtendedSession() {
        log("EXT_SESSION", "Stopping")
        extendedSession?.invalidate()
        extendedSession = nil
    }
    
    func keepAwakeAfterDisconnect() {
        disconnectTime = Date()
        log("KEEP_ALIVE", "Connection lost - starting \(Int(keepAliveDuration))s keep-alive")
        
        startExtendedSession()
        startWatchdog()
        
        keepAliveTimer?.invalidate()
        keepAliveTimer = Timer.scheduledTimer(withTimeInterval: keepAliveDuration, repeats: false) { [weak self] _ in
            guard let self = self else { return }
            self.log("KEEP_ALIVE", "Timer expired - state: \(self.dumpState())")
            self.disconnectTime = nil
        }
    }
    
    func connectionRestored() {
        if let disconnectTime = disconnectTime {
            let elapsed = Date().timeIntervalSince(disconnectTime)
            log("CONNECTION", "Restored after \(Int(elapsed))s")
        } else {
            log("CONNECTION", "Restored (no prior disconnect)")
        }
        
        keepAliveTimer?.invalidate()
        keepAliveTimer = nil
        disconnectTime = nil
        resetWatchdog()
        
        if isWaitingForPermissions {
            log("CONNECTION", "Was waiting for permissions - clearing flag")
            endPermissionWait()
        }
        
        if !isActive {
            log("CONNECTION", "Workout not active - auto-restarting")
            startWorkout()
        }
    }
    
    func startPermissionWait() {
        log("PERMISSION", "Dialog opened on phone - entering wait mode. State: \(dumpState())")
        isWaitingForPermissions = true
        
        startExtendedSession()
        startWatchdog()
        
        permissionWaitTimer?.invalidate()
        permissionWaitTimer = Timer.scheduledTimer(withTimeInterval: 45.0, repeats: false) { [weak self] _ in
            guard let self = self else { return }
            self.log("PERMISSION", "Wait timeout (45s) - state: \(self.dumpState())")
            self.endPermissionWait()
        }
    }
    
    func endPermissionWait() {
        log("PERMISSION", "Dialog closed - resuming. State: \(dumpState())")
        isWaitingForPermissions = false
        permissionWaitTimer?.invalidate()
        permissionWaitTimer = nil
        resetWatchdog()
        
        if !isActive {
            log("PERMISSION", "Workout not active - scheduling restart")
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                self.startWorkout()
            }
        }
    }
    
    func handleAppBecameActive() {
        log("LIFECYCLE", "App became active - state: \(dumpState())")
        
        if !isActive {
            log("LIFECYCLE", "Workout not active on foreground - restarting")
            startWorkout()
        }
        
        startExtendedSession()
    }
    
    func checkAndRequestAuthorization() {
        guard let heartRateType = HKObjectType.quantityType(forIdentifier: .heartRate) else {
            print("[WorkoutManager] Heart rate type not available")
            return
        }
        
        let currentStatus = healthStore.authorizationStatus(for: heartRateType)
        print("[WorkoutManager] Current authorization status: \(currentStatus.rawValue)")
        
        DispatchQueue.main.async {
            self.authorizationStatus = currentStatus
        }
        
        requestAuthorization()
    }
    
    func requestAuthorization() {
        requestAuthorizationWithCompletion { _ in }
    }
    
    func requestAuthorizationWithCompletion(completion: @escaping (Bool) -> Void) {
        let typesToShare: Set<HKSampleType> = [HKObjectType.workoutType()]
        let typesToRead: Set<HKObjectType> = [
            HKObjectType.quantityType(forIdentifier: .heartRate)!
        ]
        
        print("[WorkoutManager] Requesting HealthKit authorization...")
        
        healthStore.requestAuthorization(toShare: typesToShare, read: typesToRead) { success, error in
            DispatchQueue.main.async {
                if success {
                    print("[WorkoutManager] HealthKit authorization dialog shown successfully")
                    if let hrType = HKObjectType.quantityType(forIdentifier: .heartRate) {
                        self.authorizationStatus = self.healthStore.authorizationStatus(for: hrType)
                        print("[WorkoutManager] Updated status: \(self.authorizationStatus.rawValue)")
                    }
                    completion(true)
                } else {
                    print("[WorkoutManager] HealthKit authorization failed: \(error?.localizedDescription ?? "unknown")")
                    completion(false)
                }
            }
        }
    }
    
    var isAuthorized: Bool {
        guard let heartRateType = HKObjectType.quantityType(forIdentifier: .heartRate) else {
            return false
        }
        let status = healthStore.authorizationStatus(for: heartRateType)
        return status != .notDetermined
    }
    
    func startWorkout() {
        // Генерируем correlation ID для этой попытки старта
        currentCorrelationId = UUID().uuidString
        workoutStartTime = Date()
        
        log("WORKOUT", "Starting workout attempt")
        
        let config = HKWorkoutConfiguration()
        config.activityType = .mindAndBody
        config.locationType = .indoor
        
        do {
            session = try HKWorkoutSession(healthStore: healthStore, configuration: config)
            builder = session?.associatedWorkoutBuilder()
            
            builder?.dataSource = HKLiveWorkoutDataSource(healthStore: healthStore, workoutConfiguration: config)
            
            session?.delegate = self
            builder?.delegate = self
            
            let startDate = Date()
            session?.startActivity(with: startDate)
            log("WORKOUT", "Activity started, beginning collection")
            
            builder?.beginCollection(withStart: startDate) { success, error in
                DispatchQueue.main.async {
                    if success {
                        self.isActive = true
                        self.log("WORKOUT", "Collection started successfully")
                    } else {
                        self.log("WORKOUT", "Collection failed: \(error?.localizedDescription ?? "unknown")")
                    }
                }
            }
        } catch {
            log("WORKOUT", "ERROR starting: \(error.localizedDescription)")
        }
    }
    
    func stopWorkout() {
        log("WORKOUT", "Stopping workout")
        session?.end()
        isActive = false
        currentCorrelationId = nil
        workoutStartTime = nil
        resetWatchdog()
    }
    
    private func sendHeartRateToPhone(_ hr: Double) {
        let message: [String: Any] = [
            "type": "heartRate",
            "value": hr,
            "ts": Date().timeIntervalSince1970
        ]
        
        if WCSession.default.isReachable {
            WCSession.default.sendMessage(message, replyHandler: nil) { error in
                print("[WorkoutManager] sendMessage error: \(error.localizedDescription)")
                // Fallback to transferUserInfo
                WCSession.default.transferUserInfo(message)
            }
        } else {
            // When not reachable, use transferUserInfo for reliable delivery
            WCSession.default.transferUserInfo(message)
            print("[WorkoutManager] HR sent via transferUserInfo")
        }
    }
}

extension WorkoutManager: WKExtendedRuntimeSessionDelegate {
    func extendedRuntimeSessionDidStart(_ extendedRuntimeSession: WKExtendedRuntimeSession) {
        print("[WorkoutManager] Extended runtime session started")
    }
    
    func extendedRuntimeSessionWillExpire(_ extendedRuntimeSession: WKExtendedRuntimeSession) {
        print("[WorkoutManager] Extended session will expire, restarting...")
        startExtendedSession()
    }
    
    func extendedRuntimeSession(_ extendedRuntimeSession: WKExtendedRuntimeSession,
                                didInvalidateWith reason: WKExtendedRuntimeSessionInvalidationReason,
                                error: Error?) {
        print("[WorkoutManager] Extended session invalidated: \(reason.rawValue), error: \(error?.localizedDescription ?? "none")")
        
        if reason == .sessionInProgress {
            return
        }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            self.startExtendedSession()
        }
    }
}

extension WorkoutManager: HKWorkoutSessionDelegate {
    func workoutSession(_ workoutSession: HKWorkoutSession, didChangeTo toState: HKWorkoutSessionState, from fromState: HKWorkoutSessionState, date: Date) {
        let stateNames = ["notStarted", "running", "ended", "paused", "prepared", "stopped"]
        let toName = toState.rawValue < stateNames.count ? stateNames[Int(toState.rawValue)] : "\(toState.rawValue)"
        let fromName = fromState.rawValue < stateNames.count ? stateNames[Int(fromState.rawValue)] : "\(fromState.rawValue)"
        
        log("HK_STATE", "\(fromName) → \(toName)")
        
        DispatchQueue.main.async {
            switch toState {
            case .running:
                self.isActive = true
            case .ended, .stopped:
                self.isActive = false
                self.log("HK_STATE", "Workout ended/stopped. disconnectTime: \(self.disconnectTime != nil)")
                if self.disconnectTime != nil {
                    self.log("HK_STATE", "Will auto-restart on reconnect")
                }
            case .paused:
                self.log("HK_STATE", "Workout paused")
            default:
                break
            }
        }
    }
    
    func workoutSession(_ workoutSession: HKWorkoutSession, didFailWithError error: Error) {
        log("HK_ERROR", error.localizedDescription)
        
        DispatchQueue.main.async {
            self.isActive = false
            if self.disconnectTime != nil {
                self.log("HK_ERROR", "Failed during keep-alive - scheduling restart in 2s")
                DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                    self.startWorkout()
                }
            }
        }
    }
}

extension WorkoutManager: HKLiveWorkoutBuilderDelegate {
    func workoutBuilder(_ workoutBuilder: HKLiveWorkoutBuilder, didCollectDataOf collectedTypes: Set<HKSampleType>) {
        for type in collectedTypes {
            guard let quantityType = type as? HKQuantityType,
                  quantityType == HKQuantityType.quantityType(forIdentifier: .heartRate) else { continue }
            
            if let statistics = workoutBuilder.statistics(for: quantityType) {
                let hrUnit = HKUnit.count().unitDivided(by: .minute())
                if let value = statistics.mostRecentQuantity()?.doubleValue(for: hrUnit) {
                    DispatchQueue.main.async {
                        // Логируем первый HR и каждый 10-й
                        let isFirst = self.lastHRTime == nil
                        self.lastHRTime = Date()
                        
                        if isFirst {
                            self.log("HR", "First HR received: \(Int(value)) bpm")
                            self.resetWatchdog()
                        }
                        
                        self.heartRate = value
                        self.sendHeartRateToPhone(value)
                    }
                }
            }
        }
    }
    
    func workoutBuilderDidCollectEvent(_ workoutBuilder: HKLiveWorkoutBuilder) {}
}

extension WorkoutManager: WCSessionDelegate {
    func session(_ session: WCSession, activationDidCompleteWith state: WCSessionActivationState, error: Error?) {
        let stateNames = ["notActivated", "inactive", "activated"]
        let stateName = state.rawValue < stateNames.count ? stateNames[Int(state.rawValue)] : "\(state.rawValue)"
        
        if let error = error {
            log("WC_ACTIVATE", "Error: \(error.localizedDescription)")
        } else {
            log("WC_ACTIVATE", "State: \(stateName), reachable: \(session.isReachable)")
        }
        
        let context = session.receivedApplicationContext
        if let command = context["command"] as? String {
            log("WC_ACTIVATE", "Found pending command in context: \(command)")
            handleCommand(["type": command])
        }
    }
    
    func sessionReachabilityDidChange(_ session: WCSession) {
        log("WC_REACH", "Changed to: \(session.isReachable). State: \(dumpState())")
        
        DispatchQueue.main.async {
            if session.isReachable {
                self.connectionRestored()
            } else {
                self.keepAwakeAfterDisconnect()
            }
        }
    }
    
    func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
        let msgType = message["type"] as? String ?? "?"
        log("WC_MSG", "Received via sendMessage: \(msgType)")
        handleCommand(message)
    }
    
    func session(_ session: WCSession, didReceiveUserInfo userInfo: [String: Any] = [:]) {
        let msgType = userInfo["type"] as? String ?? "?"
        log("WC_USERINFO", "Received via transferUserInfo: \(msgType)")
        handleCommand(userInfo)
    }
    
    func session(_ session: WCSession, didReceiveApplicationContext applicationContext: [String : Any]) {
        let cmd = applicationContext["command"] as? String ?? "?"
        log("WC_CONTEXT", "Received applicationContext: \(cmd)")
        if let command = applicationContext["command"] as? String {
            handleCommand(["type": command])
        }
    }
    
    private func handleCommand(_ data: [String: Any]) {
        let command = (data["type"] as? String) ?? (data["command"] as? String)
        
        guard let cmd = command else {
            log("CMD", "No command found in data")
            return
        }
        
        // Дедупликация: проверяем не обрабатывали ли эту команду недавно
        let timestamp = data["ts"] as? TimeInterval ?? Date().timeIntervalSince1970
        let commandKey = "\(cmd)_\(Int(timestamp))" // Уникальный ключ по команде и времени
        
        if let lastProcessed = lastProcessedCommands[commandKey] {
            let elapsed = Date().timeIntervalSince1970 - lastProcessed
            if elapsed < commandDeduplicationWindow {
                log("CMD_DEDUP", "Skipping duplicate '\(cmd)' (processed \(Int(elapsed))s ago)")
                return
            }
        }
        
        // Запоминаем что обработали эту команду
        lastProcessedCommands[commandKey] = Date().timeIntervalSince1970
        
        // Очистка старых записей (старше 30 секунд)
        let now = Date().timeIntervalSince1970
        lastProcessedCommands = lastProcessedCommands.filter { now - $0.value < 30 }
        
        log("CMD", "Processing: \(cmd). State: \(dumpState())")
        
        DispatchQueue.main.async {
            switch cmd {
            case "start":
                if !self.isActive {
                    self.startWorkout()
                } else {
                    print("[WorkoutManager] Workout already active")
                }
            case "stop":
                self.stopWorkout()
            case "heartbeat":
                print("[WorkoutManager] Heartbeat received")
            case "permission_start":
                self.startPermissionWait()
            case "permission_end":
                self.endPermissionWait()
            default:
                print("[WorkoutManager] Unknown command: \(cmd)")
            }
        }
    }
}
