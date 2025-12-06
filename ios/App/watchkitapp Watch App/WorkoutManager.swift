import Foundation
import HealthKit
import WatchConnectivity
import Combine

final class WorkoutManager: NSObject, ObservableObject {

    @Published var heartRate: Double = 0
    @Published var isRunning: Bool = false
    @Published var connectionStatus: String = "..."
    @Published var errorMessage: String = ""
    @Published var lastSendResult: String = ""
    @Published var sendCount: Int = 0
    @Published var authorizationStatus: AuthStatus = .unknown
    
    enum AuthStatus: String {
        case unknown = "..."
        case requesting = "Requesting"
        case authorized = "OK"
        case denied = "Denied"
        case notAvailable = "N/A"
    }

    var heartRateString: String {
        heartRate > 0 ? String(Int(heartRate)) : "--"
    }
    
    var isAuthorized: Bool {
        authorizationStatus == .authorized
    }

    private let healthStore = HKHealthStore()
    private var heartRateQuery: HKAnchoredObjectQuery?
    private var workoutSession: HKWorkoutSession?
    private var workoutBuilder: HKLiveWorkoutBuilder?
    private var wcSession: WCSession?
    
    private var lastHeartbeatDate: Date?
    private var heartbeatMonitorTimer: Timer?
    private let heartbeatTimeout: TimeInterval = 45.0  // Increased: phone may be backgrounded

    override init() {
        super.init()
        if WCSession.isSupported() {
            wcSession = WCSession.default
            wcSession?.delegate = self
            wcSession?.activate()
            print("[Watch] WCSession init and activating...")
        }
    }

    func activateSession() {
        requestHealthAuthorization()
        updateConnectionStatus()
    }
    
    private func updateConnectionStatus() {
        guard let session = wcSession else {
            connectionStatus = "No"
            return
        }
        connectionStatus = session.isReachable ? "OK" : "..."
    }

    private func requestHealthAuthorization() {
        guard HKHealthStore.isHealthDataAvailable() else {
            print("[Watch] HealthKit not available")
            DispatchQueue.main.async {
                self.authorizationStatus = .notAvailable
                self.errorMessage = "No HK"
            }
            return
        }
        
        guard let heartRateType = HKQuantityType.quantityType(forIdentifier: .heartRate) else {
            print("[Watch] Failed to create HR type")
            DispatchQueue.main.async {
                self.authorizationStatus = .notAvailable
            }
            return
        }
        
        DispatchQueue.main.async {
            self.authorizationStatus = .requesting
        }

        let typesToShare: Set = [HKObjectType.workoutType()]
        let typesToRead: Set<HKObjectType> = [heartRateType]

        healthStore.requestAuthorization(toShare: typesToShare, read: typesToRead) { [weak self] success, error in
            DispatchQueue.main.async {
                if !success {
                    print("[Watch] HealthKit auth failed: \(error?.localizedDescription ?? "unknown")")
                    self?.authorizationStatus = .denied
                    self?.errorMessage = "Auth fail"
                } else {
                    print("[Watch] HealthKit authorized")
                    self?.authorizationStatus = .authorized
                    self?.errorMessage = ""
                }
            }
        }
    }

    func startWorkout() {
        guard !isRunning else {
            print("[Watch] Already running")
            return
        }
        
        print("[Watch] Starting workout session...")
        startWorkoutSession()
        startHeartbeatMonitor()
    }
    
    private func startWorkoutSession() {
        let config = HKWorkoutConfiguration()
        config.activityType = .mindAndBody
        config.locationType = .indoor
        
        do {
            let session = try HKWorkoutSession(healthStore: healthStore, configuration: config)
            let builder = session.associatedWorkoutBuilder()
            
            session.delegate = self
            builder.delegate = self
            
            builder.dataSource = HKLiveWorkoutDataSource(
                healthStore: healthStore,
                workoutConfiguration: config
            )
            
            let startDate = Date()
            session.startActivity(with: startDate)
            builder.beginCollection(withStart: startDate) { [weak self] success, error in
                if success {
                    print("[Watch] Workout collection started")
                    DispatchQueue.main.async {
                        self?.isRunning = true
                        self?.errorMessage = ""
                    }
                    self?.sendStatusToPhone("started")
                } else {
                    print("[Watch] Failed to start collection: \(error?.localizedDescription ?? "unknown")")
                    DispatchQueue.main.async {
                        self?.errorMessage = "Start fail"
                    }
                }
            }
            
            self.workoutSession = session
            self.workoutBuilder = builder
        } catch {
            print("[Watch] Failed to create workout session: \(error)")
            DispatchQueue.main.async {
                self.errorMessage = "Session err"
            }
            startHeartRateQuery()
        }
    }
    
    private func startHeartRateQuery() {
        guard let heartRateType = HKQuantityType.quantityType(forIdentifier: .heartRate) else {
            print("[Watch] Failed to create HR type for query")
            errorMessage = "HR type err"
            return
        }
        
        let devicePredicate = HKQuery.predicateForObjects(from: [HKDevice.local()])
        
        let query = HKAnchoredObjectQuery(
            type: heartRateType,
            predicate: devicePredicate,
            anchor: nil,
            limit: HKObjectQueryNoLimit
        ) { [weak self] query, samples, deletedObjects, anchor, error in
            self?.processHeartRateSamples(samples)
        }
        
        query.updateHandler = { [weak self] query, samples, deletedObjects, anchor, error in
            self?.processHeartRateSamples(samples)
        }
        
        healthStore.execute(query)
        heartRateQuery = query
        
        DispatchQueue.main.async {
            self.isRunning = true
            self.errorMessage = ""
            print("[Watch] Heart rate query started (fallback)")
        }
        
        sendStatusToPhone("started")
    }
    
    private func processHeartRateSamples(_ samples: [HKSample]?) {
        guard let samples = samples as? [HKQuantitySample], !samples.isEmpty else {
            return
        }
        
        guard let lastSample = samples.last else { return }
        
        let unit = HKUnit.count().unitDivided(by: HKUnit.minute())
        let bpm = lastSample.quantity.doubleValue(for: unit)
        
        print("[Watch] Got HR: \(Int(bpm)) bpm")
        
        // Refresh heartbeat on HR sample - local activity keeps session alive
        lastHeartbeatDate = Date()
        
        DispatchQueue.main.async {
            self.heartRate = bpm
        }
        
        sendHeartRateToPhone(bpm)
    }

    func stopWorkout() {
        print("[Watch] Stopping workout...")
        
        stopHeartbeatMonitor()
        
        if let session = workoutSession, let builder = workoutBuilder {
            let endDate = Date()
            session.stopActivity(with: endDate)
            session.end()
            
            builder.endCollection(withEnd: endDate) { success, error in
                builder.finishWorkout { workout, error in
                    DispatchQueue.main.async {
                        self.workoutSession = nil
                        self.workoutBuilder = nil
                        self.heartRate = 0
                    }
                    print("[Watch] Workout finished")
                }
            }
        }
        
        if let query = heartRateQuery {
            healthStore.stop(query)
            heartRateQuery = nil
        }
        
        DispatchQueue.main.async {
            self.isRunning = false
            self.heartRate = 0
        }
        
        sendStatusToPhone("stopped")
    }
    
    private func startHeartbeatMonitor() {
        lastHeartbeatDate = Date()
        heartbeatMonitorTimer?.invalidate()
        heartbeatMonitorTimer = Timer.scheduledTimer(withTimeInterval: 2.0, repeats: true) { [weak self] _ in
            self?.checkHeartbeat()
        }
        if let timer = heartbeatMonitorTimer {
            RunLoop.main.add(timer, forMode: .common)
        }
        print("[Watch] Heartbeat monitor started")
    }
    
    private func stopHeartbeatMonitor() {
        heartbeatMonitorTimer?.invalidate()
        heartbeatMonitorTimer = nil
        lastHeartbeatDate = nil
        print("[Watch] Heartbeat monitor stopped")
    }
    
    private func checkHeartbeat() {
        guard let last = lastHeartbeatDate else { return }
        let delta = Date().timeIntervalSince(last)
        if delta > heartbeatTimeout {
            print("[Watch] Heartbeat timeout (\(Int(delta))s) - auto-stopping workout")
            DispatchQueue.main.async {
                self.stopWorkout()
            }
        }
    }
    
    private func handleHeartbeat() {
        lastHeartbeatDate = Date()
    }

    private func sendHeartRateToPhone(_ bpm: Double) {
        guard let session = wcSession else {
            print("[Watch] No WCSession")
            DispatchQueue.main.async { self.lastSendResult = "NoSess" }
            return
        }
        
        let message: [String: Any] = [
            "type": "heartRate",
            "value": bpm,
            "timestamp": Date().timeIntervalSince1970
        ]
        
        DispatchQueue.main.async {
            self.sendCount += 1
        }
        
        if session.isReachable {
            session.sendMessage(message, replyHandler: { [weak self] reply in
                DispatchQueue.main.async {
                    self?.lastSendResult = "OK"
                }
            }) { [weak self] error in
                print("[Watch] sendMessage error: \(error.localizedDescription)")
                DispatchQueue.main.async {
                    self?.lastSendResult = "Err"
                }
            }
        } else {
            session.transferUserInfo(message)
            DispatchQueue.main.async {
                self.lastSendResult = "Q"
            }
        }
    }
    
    private func sendStatusToPhone(_ status: String) {
        guard let session = wcSession, session.isReachable else {
            return
        }
        
        let message: [String: Any] = [
            "type": "status",
            "value": status
        ]
        
        session.sendMessage(message, replyHandler: nil) { error in
            print("[Watch] sendStatus error: \(error.localizedDescription)")
        }
    }
}

extension WorkoutManager: WCSessionDelegate {
    func session(_ session: WCSession,
                 activationDidCompleteWith activationState: WCSessionActivationState,
                 error: Error?) {
        DispatchQueue.main.async {
            if let error = error {
                print("[Watch] WCSession error: \(error)")
                self.connectionStatus = "Err"
            } else {
                print("[Watch] WCSession activated: \(activationState.rawValue)")
                self.connectionStatus = session.isReachable ? "OK" : "..."
            }
        }
    }

    func sessionReachabilityDidChange(_ session: WCSession) {
        print("[Watch] Reachability: \(session.isReachable)")
        DispatchQueue.main.async {
            self.connectionStatus = session.isReachable ? "OK" : "..."
            // Refresh heartbeat when connectivity restored
            if session.isReachable && self.isRunning {
                self.lastHeartbeatDate = Date()
            }
        }
    }

    func session(_ session: WCSession,
                 didReceiveMessage message: [String : Any]) {
        handleCommand(message)
    }
    
    func session(_ session: WCSession,
                 didReceiveMessage message: [String : Any],
                 replyHandler: @escaping ([String : Any]) -> Void) {
        handleCommand(message)
        replyHandler(["received": true])
    }
    
    func session(_ session: WCSession,
                 didReceiveUserInfo userInfo: [String : Any] = [:]) {
        handleCommand(userInfo)
    }
    
    private func handleCommand(_ data: [String: Any]) {
        guard let type = data["type"] as? String else {
            return
        }
        
        print("[Watch] Command: \(type)")

        switch type {
        case "start":
            DispatchQueue.main.async { self.startWorkout() }
        case "stop":
            DispatchQueue.main.async { self.stopWorkout() }
        case "heartbeat":
            handleHeartbeat()
        default:
            break
        }
    }
}

extension WorkoutManager: HKWorkoutSessionDelegate {
    func workoutSession(_ workoutSession: HKWorkoutSession,
                        didChangeTo toState: HKWorkoutSessionState,
                        from fromState: HKWorkoutSessionState,
                        date: Date) {
        print("[Watch] Workout state: \(fromState.rawValue) -> \(toState.rawValue)")
        
        DispatchQueue.main.async {
            switch toState {
            case .running:
                self.isRunning = true
            case .ended, .stopped:
                self.isRunning = false
            default:
                break
            }
        }
    }
    
    func workoutSession(_ workoutSession: HKWorkoutSession,
                        didFailWithError error: Error) {
        print("[Watch] Workout error: \(error)")
        DispatchQueue.main.async {
            self.errorMessage = "Err"
        }
    }
}

extension WorkoutManager: HKLiveWorkoutBuilderDelegate {
    func workoutBuilderDidCollectEvent(_ workoutBuilder: HKLiveWorkoutBuilder) {}
    
    func workoutBuilder(_ workoutBuilder: HKLiveWorkoutBuilder,
                        didCollectDataOf collectedTypes: Set<HKSampleType>) {
        for type in collectedTypes {
            guard let quantityType = type as? HKQuantityType,
                  quantityType == HKQuantityType.quantityType(forIdentifier: .heartRate) else {
                continue
            }
            
            let statistics = workoutBuilder.statistics(for: quantityType)
            let unit = HKUnit.count().unitDivided(by: HKUnit.minute())
            
            if let value = statistics?.mostRecentQuantity()?.doubleValue(for: unit) {
                print("[Watch] HR: \(Int(value))")
                
                // Refresh heartbeat on HR data - keeps session alive
                lastHeartbeatDate = Date()
                
                DispatchQueue.main.async {
                    self.heartRate = value
                }
                sendHeartRateToPhone(value)
            }
        }
    }
}
