import Foundation
import HealthKit
import WatchConnectivity
import WatchKit
import Combine

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
    
    override init() {
        super.init()
        setupWatchConnectivity()
        startExtendedSession()
    }
    
    private func setupWatchConnectivity() {
        if WCSession.isSupported() {
            WCSession.default.delegate = self
            WCSession.default.activate()
        }
    }
    
    func startExtendedSession() {
        guard extendedSession == nil || extendedSession?.state == .invalid else {
            print("[WorkoutManager] Extended session already active")
            return
        }
        
        extendedSession = WKExtendedRuntimeSession()
        extendedSession?.delegate = self
        extendedSession?.start()
        print("[WorkoutManager] Starting extended runtime session")
    }
    
    func stopExtendedSession() {
        extendedSession?.invalidate()
        extendedSession = nil
        print("[WorkoutManager] Stopped extended session")
    }
    
    func keepAwakeAfterDisconnect() {
        disconnectTime = Date()
        print("[WorkoutManager] Connection lost - starting keep-alive for \(Int(keepAliveDuration))s")
        
        startExtendedSession()
        
        keepAliveTimer?.invalidate()
        keepAliveTimer = Timer.scheduledTimer(withTimeInterval: keepAliveDuration, repeats: false) { [weak self] _ in
            guard let self = self else { return }
            print("[WorkoutManager] Keep-alive timer expired after \(Int(self.keepAliveDuration))s")
            self.disconnectTime = nil
        }
    }
    
    func connectionRestored() {
        if let disconnectTime = disconnectTime {
            let elapsed = Date().timeIntervalSince(disconnectTime)
            print("[WorkoutManager] Connection restored after \(Int(elapsed))s")
        }
        
        keepAliveTimer?.invalidate()
        keepAliveTimer = nil
        disconnectTime = nil
        
        if isWaitingForPermissions {
            print("[WorkoutManager] Connection restored while waiting for permissions - clearing flag")
            endPermissionWait()
        }
        
        if !isActive {
            print("[WorkoutManager] Auto-restarting workout after reconnection")
            startWorkout()
        }
    }
    
    func startPermissionWait() {
        print("[WorkoutManager] Permission dialog opened on phone - entering wait mode")
        isWaitingForPermissions = true
        
        startExtendedSession()
        
        permissionWaitTimer?.invalidate()
        permissionWaitTimer = Timer.scheduledTimer(withTimeInterval: 45.0, repeats: false) { [weak self] _ in
            print("[WorkoutManager] Permission wait timeout (45s) - auto-clearing")
            self?.endPermissionWait()
        }
    }
    
    func endPermissionWait() {
        print("[WorkoutManager] Permission dialog closed - resuming normal mode")
        isWaitingForPermissions = false
        permissionWaitTimer?.invalidate()
        permissionWaitTimer = nil
        
        if !isActive {
            print("[WorkoutManager] Workout not active after permission wait - restarting")
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                self.startWorkout()
            }
        }
    }
    
    func handleAppBecameActive() {
        print("[WorkoutManager] App became active - checking workout state")
        
        if !isActive {
            print("[WorkoutManager] Workout not active on foreground - restarting")
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
            builder?.beginCollection(withStart: startDate) { success, error in
                DispatchQueue.main.async {
                    self.isActive = true
                }
            }
        } catch {
            print("[WorkoutManager] Error starting workout: \(error)")
        }
    }
    
    func stopWorkout() {
        session?.end()
        isActive = false
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
        print("[WorkoutManager] State: \(fromName) → \(toName)")
        
        DispatchQueue.main.async {
            switch toState {
            case .running:
                self.isActive = true
            case .ended, .stopped:
                self.isActive = false
                if self.disconnectTime != nil {
                    print("[WorkoutManager] Workout ended during keep-alive - will auto-restart on reconnect")
                }
            case .paused:
                print("[WorkoutManager] Workout paused")
            default:
                break
            }
        }
    }
    
    func workoutSession(_ workoutSession: HKWorkoutSession, didFailWithError error: Error) {
        print("[WorkoutManager] Error: \(error)")
        
        DispatchQueue.main.async {
            self.isActive = false
            if self.disconnectTime != nil {
                print("[WorkoutManager] Workout failed during keep-alive - scheduling restart")
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
        print("[WorkoutManager] WCSession activated: \(state.rawValue)")
        
        let context = session.receivedApplicationContext
        if let command = context["command"] as? String {
            print("[WorkoutManager] Found pending command in context: \(command)")
            handleCommand(["type": command])
        }
    }
    
    func sessionReachabilityDidChange(_ session: WCSession) {
        print("[WorkoutManager] Reachability changed: \(session.isReachable)")
        
        DispatchQueue.main.async {
            if session.isReachable {
                self.connectionRestored()
            } else {
                self.keepAwakeAfterDisconnect()
            }
        }
    }
    
    func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
        print("[WorkoutManager] Received message: \(message)")
        handleCommand(message)
    }
    
    func session(_ session: WCSession, didReceiveUserInfo userInfo: [String: Any] = [:]) {
        print("[WorkoutManager] Received userInfo (background wake): \(userInfo)")
        handleCommand(userInfo)
    }
    
    func session(_ session: WCSession, didReceiveApplicationContext applicationContext: [String : Any]) {
        print("[WorkoutManager] Received applicationContext: \(applicationContext)")
        if let command = applicationContext["command"] as? String {
            handleCommand(["type": command])
        }
    }
    
    private func handleCommand(_ data: [String: Any]) {
        let command = (data["type"] as? String) ?? (data["command"] as? String)
        
        guard let cmd = command else {
            print("[WorkoutManager] No command found in data")
            return
        }
        
        // Дедупликация: проверяем не обрабатывали ли эту команду недавно
        let timestamp = data["ts"] as? TimeInterval ?? Date().timeIntervalSince1970
        let commandKey = "\(cmd)_\(Int(timestamp))" // Уникальный ключ по команде и времени
        
        if let lastProcessed = lastProcessedCommands[commandKey] {
            let elapsed = Date().timeIntervalSince1970 - lastProcessed
            if elapsed < commandDeduplicationWindow {
                print("[WorkoutManager] Skipping duplicate command '\(cmd)' (processed \(Int(elapsed))s ago)")
                return
            }
        }
        
        // Запоминаем что обработали эту команду
        lastProcessedCommands[commandKey] = Date().timeIntervalSince1970
        
        // Очистка старых записей (старше 30 секунд)
        let now = Date().timeIntervalSince1970
        lastProcessedCommands = lastProcessedCommands.filter { now - $0.value < 30 }
        
        print("[WorkoutManager] Processing command: \(cmd)")
        
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
