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

    var heartRateString: String {
        heartRate > 0 ? String(Int(heartRate)) : "--"
    }

    private let healthStore = HKHealthStore()
    private var heartRateQuery: HKAnchoredObjectQuery?
    private var wcSession: WCSession?

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
                self.errorMessage = "No HK"
            }
            return
        }
        
        guard let heartRateType = HKQuantityType.quantityType(forIdentifier: .heartRate) else {
            print("[Watch] Failed to create HR type")
            return
        }

        // Только ЧТЕНИЕ пульса - не нужны разрешения на запись!
        let typesToRead: Set<HKObjectType> = [heartRateType]

        healthStore.requestAuthorization(toShare: nil, read: typesToRead) { [weak self] success, error in
            DispatchQueue.main.async {
                if !success {
                    print("[Watch] HealthKit auth failed: \(error?.localizedDescription ?? "unknown")")
                    self?.errorMessage = "Auth fail"
                } else {
                    print("[Watch] HealthKit authorized for reading")
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
        
        print("[Watch] Starting heart rate monitoring...")
        startHeartRateQuery()
    }
    
    private func startHeartRateQuery() {
        guard let heartRateType = HKQuantityType.quantityType(forIdentifier: .heartRate) else {
            print("[Watch] Failed to create HR type for query")
            errorMessage = "HR type err"
            return
        }
        
        // Predicate для получения данных только с часов
        let devicePredicate = HKQuery.predicateForObjects(from: [HKDevice.local()])
        
        let query = HKAnchoredObjectQuery(
            type: heartRateType,
            predicate: devicePredicate,
            anchor: nil,
            limit: HKObjectQueryNoLimit
        ) { [weak self] query, samples, deletedObjects, anchor, error in
            self?.processHeartRateSamples(samples)
        }
        
        // Обработчик обновлений в реальном времени
        query.updateHandler = { [weak self] query, samples, deletedObjects, anchor, error in
            self?.processHeartRateSamples(samples)
        }
        
        healthStore.execute(query)
        heartRateQuery = query
        
        DispatchQueue.main.async {
            self.isRunning = true
            self.errorMessage = ""
            print("[Watch] Heart rate query started")
        }
        
        sendStatusToPhone("started")
    }
    
    private func processHeartRateSamples(_ samples: [HKSample]?) {
        guard let samples = samples as? [HKQuantitySample], !samples.isEmpty else {
            return
        }
        
        // Берём последний sample
        guard let lastSample = samples.last else { return }
        
        let unit = HKUnit(from: "count/min")
        let bpm = lastSample.quantity.doubleValue(for: unit)
        
        print("[Watch] Got HR: \(Int(bpm)) bpm")
        
        DispatchQueue.main.async {
            self.heartRate = bpm
        }
        
        // Отправляем на телефон
        sendHeartRateToPhone(bpm)
    }

    func stopWorkout() {
        print("[Watch] Stopping heart rate monitoring...")
        
        if let query = heartRateQuery {
            healthStore.stop(query)
            heartRateQuery = nil
        }
        
        DispatchQueue.main.async {
            self.isRunning = false
        }
        
        sendStatusToPhone("stopped")
    }

    // MARK: - WatchConnectivity

    private func sendHeartRateToPhone(_ bpm: Double) {
        guard let session = wcSession else {
            print("[Watch] No WCSession")
            DispatchQueue.main.async { self.lastSendResult = "NoSess" }
            return
        }
        
        print("[Watch] Sending HR \(Int(bpm)), reachable: \(session.isReachable), activationState: \(session.activationState.rawValue)")
        
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
                print("[Watch] HR sent OK, reply: \(reply)")
                DispatchQueue.main.async {
                    self?.lastSendResult = "OK"
                }
            }) { [weak self] error in
                print("[Watch] sendMessage error: \(error.localizedDescription)")
                DispatchQueue.main.async {
                    self?.lastSendResult = "Err:\(error.localizedDescription.prefix(10))"
                }
            }
        } else {
            // Fallback: try transferUserInfo when not reachable
            print("[Watch] Phone not reachable, trying transferUserInfo")
            session.transferUserInfo(message)
            DispatchQueue.main.async {
                self.lastSendResult = "Queue"
            }
        }
    }
    
    private func sendStatusToPhone(_ status: String) {
        guard let session = wcSession, session.isReachable else {
            print("[Watch] Cannot send status - not reachable")
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

// MARK: - WCSessionDelegate

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
        }
    }

    func session(_ session: WCSession,
                 didReceiveMessage message: [String : Any]) {
        print("[Watch] Received message: \(message)")
        handleCommand(message)
    }
    
    func session(_ session: WCSession,
                 didReceiveMessage message: [String : Any],
                 replyHandler: @escaping ([String : Any]) -> Void) {
        print("[Watch] Received message with reply: \(message)")
        handleCommand(message)
        replyHandler(["received": true])
    }
    
    func session(_ session: WCSession,
                 didReceiveUserInfo userInfo: [String : Any] = [:]) {
        print("[Watch] Received userInfo: \(userInfo)")
        handleCommand(userInfo)
    }
    
    private func handleCommand(_ data: [String: Any]) {
        guard let type = data["type"] as? String else {
            print("[Watch] No type in command: \(data)")
            return
        }
        
        print("[Watch] Handling command: \(type)")

        switch type {
        case "start":
            DispatchQueue.main.async { self.startWorkout() }
        case "stop":
            DispatchQueue.main.async { self.stopWorkout() }
        default:
            print("[Watch] Unknown command: \(type)")
        }
    }
}
