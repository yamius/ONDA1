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
    
    private var lastHRSendTime: Date = Date.distantPast
    private let minHRInterval: TimeInterval = 0.8
    
    override init() {
        super.init()
        setupWatchConnectivity()
        tryRecoverActiveWorkout()
    }
    
    private func setupWatchConnectivity() {
        if WCSession.isSupported() {
            WCSession.default.delegate = self
            WCSession.default.activate()
            print("[WorkoutManager] WCSession setup complete")
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
                }
            } else if let error = error {
                print("[WorkoutManager] No session to recover: \(error.localizedDescription)")
            } else {
                print("[WorkoutManager] No active session to recover")
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
        sendStatusToPhone("stopped")
        print("[WorkoutManager] Workout stopped")
    }
    
    func ensureWorkoutRunning() {
        if !isActive {
            print("[WorkoutManager] ensureWorkoutRunning: starting workout")
            startWorkout()
        } else {
            print("[WorkoutManager] ensureWorkoutRunning: already active")
        }
    }
    
    private func sendHeartRateToPhone(_ hr: Double) {
        let now = Date()
        guard now.timeIntervalSince(lastHRSendTime) >= minHRInterval else {
            return
        }
        lastHRSendTime = now
        
        let message: [String: Any] = [
            "type": "heartRate",
            "value": hr,
            "ts": now.timeIntervalSince1970
        ]
        
        if WCSession.default.activationState == .activated {
            if WCSession.default.isReachable {
                WCSession.default.sendMessage(message, replyHandler: nil) { error in
                    print("[WorkoutManager] sendMessage error: \(error.localizedDescription)")
                    WCSession.default.transferUserInfo(message)
                }
                connectionStatus = "reachable"
            } else {
                WCSession.default.transferUserInfo(message)
                connectionStatus = "background"
                print("[WorkoutManager] HR sent via transferUserInfo (background)")
            }
        } else {
            print("[WorkoutManager] WCSession not activated, can't send HR")
            connectionStatus = "inactive"
        }
    }
    
    private func sendStatusToPhone(_ status: String) {
        let message: [String: Any] = [
            "type": "status",
            "status": status,
            "isActive": isActive,
            "ts": Date().timeIntervalSince1970
        ]
        
        if WCSession.default.activationState == .activated {
            if WCSession.default.isReachable {
                WCSession.default.sendMessage(message, replyHandler: nil, errorHandler: nil)
            }
            do {
                try WCSession.default.updateApplicationContext(message)
            } catch {
                print("[WorkoutManager] Failed to update app context: \(error)")
            }
        }
    }
}

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
            self.sendStatusToPhone("error")
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
        
        DispatchQueue.main.async {
            if state == .activated {
                self.connectionStatus = session.isReachable ? "reachable" : "background"
            }
        }
    }
    
    func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
        print("[WorkoutManager] Received message: \(message)")
        handleCommand(message)
    }
    
    func session(_ session: WCSession, didReceiveUserInfo userInfo: [String: Any] = [:]) {
        print("[WorkoutManager] Received userInfo: \(userInfo)")
        handleCommand(userInfo)
    }
    
    func session(_ session: WCSession, didReceiveApplicationContext applicationContext: [String : Any]) {
        print("[WorkoutManager] Received applicationContext: \(applicationContext)")
        if let command = applicationContext["command"] as? String {
            handleCommand(["type": command])
        }
    }
    
    func sessionReachabilityDidChange(_ session: WCSession) {
        print("[WorkoutManager] Reachability changed: \(session.isReachable)")
        DispatchQueue.main.async {
            self.connectionStatus = session.isReachable ? "reachable" : "background"
            
            if session.isReachable && self.isActive && self.heartRate > 0 {
                self.sendHeartRateToPhone(self.heartRate)
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
            case "ping":
                self.sendStatusToPhone(self.isActive ? "active" : "idle")
            case "stop":
                self.stopWorkout()
            default:
                print("[WorkoutManager] Unknown command: \(cmd)")
            }
        }
    }
}
