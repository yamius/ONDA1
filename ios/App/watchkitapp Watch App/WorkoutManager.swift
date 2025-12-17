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
    
    @Published var heartRate: Double = 0
    @Published var isActive = false
    @Published var authorizationStatus: HKAuthorizationStatus = .notDetermined
    @Published var connectionStatus: String = "init"
    @Published var wcSessionState: String = "unknown"
    @Published var lastPingAgo: Int = 0
    @Published var lastHRSentAgo: Int = 0
    
    private var lastHRSendTime: Date = Date.distantPast
    private let minHRInterval: TimeInterval = 0.8
    
    private var lastPingTime: Date = Date()
    private var autoStopTimer: Timer?
    private let autoStopInterval: TimeInterval = 600  // 10 minutes - meditation can be long
    private var lastHRReceived: Date = Date()  // Track when we last got HR data
    private var isInAccumulationMode = false  // True when phone is unreachable but we keep collecting
    
    private var debugUpdateTimer: Timer?
    private var wcReconnectTimer: Timer?
    private var isAuthorizationPending = false
    
    override init() {
        super.init()
        setupWatchConnectivity()
        startDebugUpdateTimer()
        startWCReconnectTimer()
        requestAuthorizationAtLaunch()
        tryRecoverActiveWorkout()
    }
    
    // MARK: - Watch Connectivity with Reconnect
    
    private func setupWatchConnectivity() {
        if WCSession.isSupported() {
            let session = WCSession.default
            session.delegate = self
            session.activate()
            print("[WorkoutManager] WCSession setup complete")
            updateWCState()
        }
    }
    
    func reactivateWCSession() {
        guard WCSession.isSupported() else { return }
        
        let session = WCSession.default
        
        if session.activationState != .activated {
            print("[WorkoutManager] Reactivating WCSession (was: \(session.activationState.rawValue))")
            session.delegate = self
            session.activate()
        }
        
        updateWCState()
    }
    
    private func updateWCState() {
        let session = WCSession.default
        let stateStr: String
        switch session.activationState {
        case .notActivated: stateStr = "notActivated"
        case .inactive: stateStr = "inactive"
        case .activated: stateStr = session.isReachable ? "reachable" : "bg"
        @unknown default: stateStr = "unknown"
        }
        
        DispatchQueue.main.async {
            self.wcSessionState = stateStr
            // connectionStatus uses original values for phone compatibility
            if session.activationState == .activated {
                self.connectionStatus = session.isReachable ? "reachable" : "background"
            } else {
                self.connectionStatus = "inactive"
            }
        }
    }
    
    private func startWCReconnectTimer() {
        wcReconnectTimer?.invalidate()
        wcReconnectTimer = Timer.scheduledTimer(withTimeInterval: 10, repeats: true) { [weak self] _ in
            guard let self = self else { return }
            
            let session = WCSession.default
            if session.activationState != .activated {
                print("[WorkoutManager] WCSession not activated, reconnecting...")
                self.reactivateWCSession()
            }
        }
    }
    
    private func startDebugUpdateTimer() {
        debugUpdateTimer?.invalidate()
        debugUpdateTimer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] _ in
            guard let self = self else { return }
            DispatchQueue.main.async {
                self.lastPingAgo = Int(Date().timeIntervalSince(self.lastPingTime))
                self.lastHRSentAgo = Int(Date().timeIntervalSince(self.lastHRSendTime))
            }
        }
    }
    
    private func tryRecoverActiveWorkout() {
        healthStore.recoverActiveWorkoutSession { recoveredSession, error in
            if let session = recoveredSession {
                print("[WorkoutManager] Recovered active workout session!")
                DispatchQueue.main.async {
                    self.session = session
                    self.builder = session.associatedWorkoutBuilder()
                    session.delegate = self
                    self.builder?.delegate = self
                    self.isActive = true
                    self.sendStatusToPhone("recovered")
                    self.startAutoStopTimer()
                }
            } else if let error = error {
                print("[WorkoutManager] No session to recover: \(error.localizedDescription)")
            } else {
                print("[WorkoutManager] No active session to recover")
            }
        }
    }
    
    // MARK: - Auto-stop Timer
    
    private func startAutoStopTimer() {
        stopAutoStopTimer()
        lastPingTime = Date()
        lastHRReceived = Date()
        isInAccumulationMode = false
        
        autoStopTimer = Timer.scheduledTimer(withTimeInterval: 30, repeats: true) { [weak self] _ in
            self?.checkAutoStop()
        }
        print("[WorkoutManager] Auto-stop timer started (10 min timeout)")
    }
    
    private func stopAutoStopTimer() {
        autoStopTimer?.invalidate()
        autoStopTimer = nil
    }
    
    private func checkAutoStop() {
        if isAuthorizationPending {
            print("[WorkoutManager] Authorization pending, skipping auto-stop check")
            return
        }
        
        let elapsedPing = Date().timeIntervalSince(lastPingTime)
        let elapsedHR = Date().timeIntervalSince(lastHRReceived)
        
        print("[WorkoutManager] Time since ping: \(Int(elapsedPing))s, since HR: \(Int(elapsedHR))s")
        
        // If we're still getting HR data, the workout is working - don't stop!
        // Just switch to accumulation mode if phone is unreachable
        if elapsedHR < 30 {
            // HR sensor is active - workout is working fine
            if elapsedPing > 60 && !isInAccumulationMode {
                // Phone unreachable for >1 min, switch to accumulation mode
                isInAccumulationMode = true
                connectionStatus = "accumulating"
                print("[WorkoutManager] Phone unreachable, switching to accumulation mode")
            }
            return // Don't stop - we're collecting data
        }
        
        // No HR data for 30 seconds - sensor may be off user's wrist
        if elapsedPing >= autoStopInterval {
            print("[WorkoutManager] No ping for 10 minutes and no HR data, stopping workout")
            stopWorkout()
            stopAutoStopTimer()
        }
    }
    
    private func resetPingTimer() {
        lastPingTime = Date()
        isInAccumulationMode = false
        if connectionStatus == "accumulating" {
            connectionStatus = WCSession.default.isReachable ? "reachable" : "background"
        }
        print("[WorkoutManager] Ping received, timer reset")
    }
    
    private func markHRReceived() {
        lastHRReceived = Date()
    }
    
    // MARK: - Authorization
    
    private func requestAuthorizationAtLaunch() {
        guard HKHealthStore.isHealthDataAvailable() else {
            print("[WorkoutManager] HealthKit not available")
            return
        }
        
        guard let hrType = HKObjectType.quantityType(forIdentifier: .heartRate) else { return }
        
        let currentStatus = healthStore.authorizationStatus(for: hrType)
        print("[WorkoutManager] Launch auth status: \(currentStatus.rawValue)")
        
        DispatchQueue.main.async {
            self.authorizationStatus = currentStatus
        }
        
        if currentStatus == .notDetermined {
            print("[WorkoutManager] Requesting HealthKit auth at launch...")
            isAuthorizationPending = true
            
            let typesToShare: Set<HKSampleType> = [HKObjectType.workoutType()]
            let typesToRead: Set<HKObjectType> = [hrType]
            
            healthStore.requestAuthorization(toShare: typesToShare, read: typesToRead) { success, error in
                DispatchQueue.main.async {
                    self.isAuthorizationPending = false
                    self.authorizationStatus = self.healthStore.authorizationStatus(for: hrType)
                    print("[WorkoutManager] Launch auth completed: \(success), status: \(self.authorizationStatus.rawValue)")
                    
                    self.reactivateWCSession()
                }
            }
        }
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
        
        if currentStatus == .notDetermined {
            requestAuthorizationWithCompletion { _ in }
        }
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
        isAuthorizationPending = true
        
        healthStore.requestAuthorization(toShare: typesToShare, read: typesToRead) { success, error in
            DispatchQueue.main.async {
                self.isAuthorizationPending = false
                
                if success {
                    print("[WorkoutManager] HealthKit authorization dialog shown successfully")
                    if let hrType = HKObjectType.quantityType(forIdentifier: .heartRate) {
                        self.authorizationStatus = self.healthStore.authorizationStatus(for: hrType)
                        print("[WorkoutManager] Updated status: \(self.authorizationStatus.rawValue)")
                    }
                    
                    self.reactivateWCSession()
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
    
    // MARK: - App Lifecycle
    
    func handleSceneActivation() {
        print("[WorkoutManager] Scene activated")
        reactivateWCSession()
        
        if isAuthorized && !isActive {
            startWorkout()
        }
    }
    
    func handleSceneDeactivation() {
        print("[WorkoutManager] Scene deactivated")
    }
    
    // MARK: - Workout Control
    
    func startWorkout() {
        if isActive {
            print("[WorkoutManager] Workout already active, skipping start")
            return
        }
        
        if session != nil {
            print("[WorkoutManager] Ending previous session before starting new one")
            session?.end()
            session = nil
            builder = nil
        }
        
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
                    if success {
                        self.isActive = true
                        self.sendStatusToPhone("started")
                        self.startAutoStopTimer()
                        print("[WorkoutManager] Workout started successfully")
                    } else {
                        print("[WorkoutManager] Failed to begin collection: \(error?.localizedDescription ?? "unknown")")
                    }
                }
            }
        } catch {
            print("[WorkoutManager] Error starting workout: \(error)")
        }
    }
    
    func stopWorkout() {
        guard isActive else {
            print("[WorkoutManager] Workout not active, nothing to stop")
            return
        }
        
        stopAutoStopTimer()
        
        session?.end()
        builder?.endCollection(withEnd: Date()) { success, error in
            if success {
                self.builder?.finishWorkout { workout, error in
                    print("[WorkoutManager] Workout saved: \(workout?.uuid.uuidString ?? "nil")")
                }
            }
        }
        
        session = nil
        builder = nil
        isActive = false
        heartRate = 0
        sendStatusToPhone("stopped")
        print("[WorkoutManager] Workout stopped")
    }
    
    func ensureWorkoutRunning() {
        if !isActive {
            print("[WorkoutManager] ensureWorkoutRunning: starting workout")
            startWorkout()
        } else {
            print("[WorkoutManager] ensureWorkoutRunning: already active")
            resetPingTimer()
        }
    }
    
    // MARK: - Data Transmission (Triple-Layer: sendMessage + applicationContext + transferUserInfo)
    
    private func sendHeartRateToPhone(_ hr: Double) {
        let now = Date()
        guard now.timeIntervalSince(lastHRSendTime) >= minHRInterval else {
            return
        }
        lastHRSendTime = now
        
        let session = WCSession.default
        
        guard session.activationState == .activated else {
            connectionStatus = "inactive"
            print("[WorkoutManager] Cannot send HR: WCSession not activated")
            reactivateWCSession()
            return
        }
        
        let message: [String: Any] = [
            "type": "heartRate",
            "value": hr,
            "ts": now.timeIntervalSince1970
        ]
        
        // PRIMARY: updateApplicationContext (most stable - system daemon handles sync)
        // This survives alerts because iOS system process syncs it, not our app
        // We prioritize this over sendMessage to avoid errors that can crash the app
        do {
            try session.updateApplicationContext([
                "lastUpdate": message,
                "lastHeartRate": hr,
                "timestamp": now.timeIntervalSince1970,
                "isWorkoutActive": isActive
            ])
        } catch {
            print("[WorkoutManager] Failed to update context: \(error)")
        }
        
        // SECONDARY: sendMessage only if truly reachable (real-time bonus)
        // Disabled when phone might be showing alerts to avoid WCSession errors
        if session.isReachable && !isInAccumulationMode {
            session.sendMessage(message, replyHandler: { _ in
                DispatchQueue.main.async {
                    self.resetPingTimer()
                }
            }) { error in
                // Error during sendMessage - switch to accumulation mode
                print("[WorkoutManager] sendMessage error, switching to context-only: \(error.localizedDescription)")
                DispatchQueue.main.async {
                    self.isInAccumulationMode = true
                    self.connectionStatus = "accumulating"
                }
            }
            connectionStatus = "reachable"
        } else {
            connectionStatus = isInAccumulationMode ? "accumulating" : "background"
        }
    }
    
    private func sendStatusToPhone(_ status: String) {
        let session = WCSession.default
        
        guard session.activationState == .activated else {
            print("[WorkoutManager] Cannot send status: WCSession not activated")
            return
        }
        
        let message: [String: Any] = [
            "type": "status",
            "status": status,
            "isActive": isActive,
            "ts": Date().timeIntervalSince1970
        ]
        
        if session.isReachable {
            session.sendMessage(message, replyHandler: nil, errorHandler: nil)
        }
        
        do {
            try session.updateApplicationContext(message)
        } catch {
            print("[WorkoutManager] Failed to update app context: \(error)")
        }
    }
}

// MARK: - HKWorkoutSessionDelegate

extension WorkoutManager: HKWorkoutSessionDelegate {
    func workoutSession(_ workoutSession: HKWorkoutSession, didChangeTo toState: HKWorkoutSessionState, from fromState: HKWorkoutSessionState, date: Date) {
        print("[WorkoutManager] Session state: \(fromState.rawValue) -> \(toState.rawValue)")
        
        DispatchQueue.main.async {
            switch toState {
            case .running:
                self.isActive = true
                self.sendStatusToPhone("running")
            case .paused:
                self.sendStatusToPhone("paused")
            case .ended, .stopped:
                self.isActive = false
                self.stopAutoStopTimer()
                self.sendStatusToPhone("ended")
            default:
                break
            }
        }
    }
    
    func workoutSession(_ workoutSession: HKWorkoutSession, didFailWithError error: Error) {
        print("[WorkoutManager] Session error: \(error)")
        DispatchQueue.main.async {
            self.isActive = false
            self.stopAutoStopTimer()
            self.sendStatusToPhone("error")
        }
    }
}

// MARK: - HKLiveWorkoutBuilderDelegate

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
                        self.markHRReceived()  // Track that HR sensor is active
                        self.sendHeartRateToPhone(value)
                    }
                }
            }
        }
    }
    
    func workoutBuilderDidCollectEvent(_ workoutBuilder: HKLiveWorkoutBuilder) {}
}

// MARK: - WCSessionDelegate

extension WorkoutManager: WCSessionDelegate {
    func session(_ session: WCSession, activationDidCompleteWith state: WCSessionActivationState, error: Error?) {
        print("[WorkoutManager] WCSession activated: \(state.rawValue), error: \(error?.localizedDescription ?? "none")")
        
        DispatchQueue.main.async {
            self.updateWCState()
            
            if state == .activated && self.isActive && self.heartRate > 0 {
                self.sendHeartRateToPhone(self.heartRate)
            }
        }
    }
    
    // Note: sessionDidBecomeInactive and sessionDidDeactivate are iOS-only
    // On watchOS, WCSession doesn't deactivate like on iOS
    // We rely on the 10-second watchdog timer for reconnection
    
    func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
        handleCommand(message)
    }
    
    func session(_ session: WCSession, didReceiveUserInfo userInfo: [String: Any] = [:]) {
        handleCommand(userInfo)
    }
    
    func session(_ session: WCSession, didReceiveApplicationContext applicationContext: [String : Any]) {
        if let command = applicationContext["command"] as? String {
            handleCommand(["type": command])
        }
    }
    
    func sessionReachabilityDidChange(_ session: WCSession) {
        print("[WorkoutManager] Reachability changed: \(session.isReachable)")
        DispatchQueue.main.async {
            self.updateWCState()
            
            if session.isReachable {
                self.resetPingTimer()
                if self.isActive && self.heartRate > 0 {
                    self.sendHeartRateToPhone(self.heartRate)
                }
            }
        }
    }
    
    private func handleCommand(_ data: [String: Any]) {
        let command = (data["type"] as? String) ?? (data["command"] as? String)
        
        guard let cmd = command else {
            return
        }
        
        print("[WorkoutManager] Processing command: \(cmd)")
        
        DispatchQueue.main.async {
            switch cmd {
            case "ping", "keepalive":
                self.resetPingTimer()
                self.sendStatusToPhone(self.isActive ? "active" : "idle")
            case "stop":
                self.stopWorkout()
            default:
                break
            }
        }
    }
}
