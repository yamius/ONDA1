import Foundation
import HealthKit
import WatchConnectivity
import Combine

final class WorkoutManager: NSObject, ObservableObject {

    @Published var heartRate: Double = 0
    @Published var isRunning: Bool = false
    @Published var connectionStatus: String = "..."

    var heartRateString: String {
        heartRate > 0 ? String(Int(heartRate)) : "--"
    }

    private let healthStore = HKHealthStore()
    private var workoutSession: HKWorkoutSession?
    private var workoutBuilder: HKLiveWorkoutBuilder?

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
            connectionStatus = "No WC"
            return
        }
        connectionStatus = session.isReachable ? "OK" : "..."
    }

    private func requestHealthAuthorization() {
        guard HKHealthStore.isHealthDataAvailable() else { return }
        guard let heartRateType = HKObjectType.quantityType(forIdentifier: .heartRate) else { return }

        let typesToShare: Set<HKSampleType> = []
        let typesToRead: Set<HKObjectType> = [heartRateType]

        healthStore.requestAuthorization(toShare: typesToShare, read: typesToRead) { success, error in
            if !success {
                print("[Watch] HealthKit auth failed: \(error?.localizedDescription ?? "unknown")")
            } else {
                print("[Watch] HealthKit authorized")
            }
        }
    }

    func startWorkout() {
        guard !isRunning else { return }

        let configuration = HKWorkoutConfiguration()
        configuration.activityType = .mindAndBody
        configuration.locationType = .indoor

        do {
            let session = try HKWorkoutSession(healthStore: healthStore, configuration: configuration)
            let builder = session.associatedWorkoutBuilder()

            session.delegate = self
            builder.delegate = self

            builder.dataSource = HKLiveWorkoutDataSource(
                healthStore: healthStore,
                workoutConfiguration: configuration
            )

            self.workoutSession = session
            self.workoutBuilder = builder
            self.isRunning = true

            let startDate = Date()
            session.startActivity(with: startDate)
            builder.beginCollection(withStart: startDate) { success, error in
                if let error = error {
                    print("[Watch] beginCollection error: \(error)")
                } else {
                    print("[Watch] Workout collection started")
                }
            }

            sendStatusToPhone(status: "started")
        } catch {
            print("[Watch] Failed to start workout: \(error)")
        }
    }

    func stopWorkout() {
        guard isRunning else { return }

        isRunning = false
        let endDate = Date()

        workoutSession?.end()
        workoutBuilder?.endCollection(withEnd: endDate) { [weak self] success, error in
            guard let self = self else { return }
            self.workoutBuilder?.finishWorkout { _, error in
                if let error = error {
                    print("[Watch] finishWorkout error: \(error)")
                }
            }
        }

        sendStatusToPhone(status: "stopped")
    }

    private func sendHeartRateToPhone(_ bpm: Double) {
        guard let session = wcSession else {
            print("[Watch] ❌ No WCSession")
            return
        }
        
        // Валидация значения пульса
        guard bpm > 30 && bpm < 220 else {
            print("[Watch] ⚠️ Invalid HR value: \(bpm), skipping")
            return
        }
        
        let roundedBpm = round(bpm)
        print("[Watch] 💗 Sending HR \(Int(roundedBpm)), reachable: \(session.isReachable)")
        
        let message: [String: Any] = [
            "type": "heartRate",
            "value": roundedBpm,
            "timestamp": Date().timeIntervalSince1970
        ]
        
        if session.isReachable {
            // Прямая отправка когда связь активна
            session.sendMessage(message, replyHandler: { reply in
                print("[Watch] ✅ HR sent successfully, reply: \(reply)")
            }) { [weak self] error in
                print("[Watch] ⚠️ sendMessage error: \(error.localizedDescription)")
                // Fallback на фоновую доставку
                self?.transferHeartRateToPhone(roundedBpm)
            }
        } else {
            // Фоновая доставка когда связь недоступна
            transferHeartRateToPhone(roundedBpm)
        }
        
        DispatchQueue.main.async {
            self.updateConnectionStatus()
        }
    }
    
    private func transferHeartRateToPhone(_ bpm: Double) {
        guard let session = wcSession else { return }
        
        let userInfo: [String: Any] = [
            "type": "heartRate",
            "value": bpm,
            "timestamp": Date().timeIntervalSince1970
        ]
        
        // Фоновая доставка - разбудит приложение на iPhone
        session.transferUserInfo(userInfo)
        print("[Watch] 📦 HR queued via transferUserInfo")
        
        // Также обновляем applicationContext для мгновенного доступа
        do {
            try session.updateApplicationContext([
                "latestHeartRate": bpm,
                "timestamp": Date().timeIntervalSince1970,
                "isRunning": isRunning
            ])
            print("[Watch] 📋 Application context updated")
        } catch {
            print("[Watch] ⚠️ Failed to update context: \(error.localizedDescription)")
        }
    }

    private func sendStatusToPhone(status: String) {
        guard let session = wcSession else { return }

        let message: [String: Any] = [
            "type": "status",
            "value": status
        ]
        
        if session.isReachable {
            session.sendMessage(message, replyHandler: nil) { [weak self] error in
                print("[Watch] sendStatus error: \(error.localizedDescription)")
                self?.transferStatusToPhone(status: status)
            }
        } else {
            transferStatusToPhone(status: status)
        }
    }
    
    private func transferStatusToPhone(status: String) {
        guard let session = wcSession else { return }
        
        let userInfo: [String: Any] = [
            "type": "status",
            "value": status
        ]
        
        session.transferUserInfo(userInfo)
    }
}

extension WorkoutManager: HKWorkoutSessionDelegate, HKLiveWorkoutBuilderDelegate {
    func workoutSession(_ workoutSession: HKWorkoutSession,
                        didChangeTo toState: HKWorkoutSessionState,
                        from fromState: HKWorkoutSessionState,
                        date: Date) {
        
        let stateString: String
        switch toState {
        case .notStarted: stateString = "notStarted"
        case .running: 
            stateString = "running"
            DispatchQueue.main.async { self.isRunning = true }
        case .ended: 
            stateString = "ended"
            DispatchQueue.main.async { self.isRunning = false }
        case .paused: stateString = "paused"
        case .prepared: stateString = "prepared"
        @unknown default: stateString = "unknown(\(toState.rawValue))"
        }
        
        print("[Watch] Workout state: \(fromState.rawValue) → \(stateString)")
        
        // Автоматический перезапуск если сессия завершилась неожиданно
        if toState == .ended && isRunning {
            print("[Watch] ⚠️ Workout ended unexpectedly, will restart in 2 seconds...")
            DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) { [weak self] in
                guard let self = self, self.isRunning else { return }
                print("[Watch] 🔄 Restarting workout after unexpected end")
                self.startWorkout()
            }
        }
    }

    func workoutSession(_ workoutSession: HKWorkoutSession,
                        didFailWithError error: Error) {
        print("[Watch] ❌ Workout session failed: \(error.localizedDescription)")
        
        // Попытка перезапуска при ошибке
        if isRunning {
            print("[Watch] 🔄 Attempting to restart workout after error...")
            DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) { [weak self] in
                guard let self = self, self.isRunning else { return }
                self.startWorkout()
            }
        }
    }

    func workoutBuilderDidCollectEvent(_ workoutBuilder: HKLiveWorkoutBuilder) {
        print("[Watch] Workout builder collected event")
    }

    func workoutBuilder(_ workoutBuilder: HKLiveWorkoutBuilder,
                        didCollectDataOf collectedTypes: Set<HKSampleType>) {

        guard let heartRateType = HKObjectType.quantityType(forIdentifier: .heartRate),
              collectedTypes.contains(heartRateType),
              let stats = workoutBuilder.statistics(for: heartRateType),
              let quantity = stats.mostRecentQuantity() else {
            return
        }

        let unit = HKUnit(from: "count/min")
        let bpm = quantity.doubleValue(for: unit)
        
        // Валидация значения пульса
        guard bpm > 30 && bpm < 220 else {
            print("[Watch] ⚠️ Invalid HR value: \(bpm), skipping")
            return
        }

        DispatchQueue.main.async {
            self.heartRate = round(bpm)
        }

        sendHeartRateToPhone(bpm)
    }
}

extension WorkoutManager: WCSessionDelegate {
    func session(_ session: WCSession,
                 activationDidCompleteWith activationState: WCSessionActivationState,
                 error: Error?) {
        
        let stateString: String
        switch activationState {
        case .activated: stateString = "activated"
        case .inactive: stateString = "inactive"
        case .notActivated: stateString = "notActivated"
        @unknown default: stateString = "unknown(\(activationState.rawValue))"
        }
        
        DispatchQueue.main.async {
            if let error = error {
                print("[Watch] ❌ WCSession activation failed: \(error.localizedDescription)")
                self.connectionStatus = "Err"
            } else {
                print("[Watch] ✅ WCSession \(stateString)")
                self.connectionStatus = session.isReachable ? "OK" : "..."
            }
        }
        
        // Проверяем applicationContext при активации
        let context = session.receivedApplicationContext
        if !context.isEmpty, let command = context["command"] as? String {
            print("[Watch] 📋 Found pending command in context: \(command)")
            handleCommand(["type": command])
        }
        
        // Отправляем текущий статус если активна сессия
        if activationState == .activated && isRunning && heartRate > 0 {
            print("[Watch] 💗 Sending current HR after activation: \(Int(heartRate)) bpm")
            sendHeartRateToPhone(heartRate)
        }
    }

    func sessionReachabilityDidChange(_ session: WCSession) {
        let reachable = session.isReachable
        print("[Watch] 📡 Reachability changed: \(reachable)")
        
        DispatchQueue.main.async {
            self.connectionStatus = reachable ? "OK" : "..."
        }
        
        // Если связь восстановилась, отправляем текущий HR
        if reachable && heartRate > 0 {
            print("[Watch] 💗 Connection restored, sending current HR: \(Int(heartRate)) bpm")
            sendHeartRateToPhone(heartRate)
        }
    }

    // Handle realtime messages (when Watch app is in foreground)
    func session(_ session: WCSession,
                 didReceiveMessage message: [String : Any]) {
        print("[Watch] 📨 Received message: \(message.keys.joined(separator: ", "))")
        handleCommand(message)
    }
    
    // Handle realtime messages with reply
    func session(_ session: WCSession,
                 didReceiveMessage message: [String : Any],
                 replyHandler: @escaping ([String : Any]) -> Void) {
        print("[Watch] 📨 Received message with reply: \(message.keys.joined(separator: ", "))")
        handleCommand(message)
        
        // Отправляем ответ с текущим статусом
        replyHandler([
            "received": true,
            "isRunning": isRunning,
            "heartRate": heartRate
        ])
    }
    
    // Handle queued messages (wakes Watch app from background!)
    func session(_ session: WCSession,
                 didReceiveUserInfo userInfo: [String : Any] = [:]) {
        print("[Watch] 📦 Received userInfo (background wake): \(userInfo.keys.joined(separator: ", "))")
        handleCommand(userInfo)
    }
    
    // Handle application context updates
    func session(_ session: WCSession,
                 didReceiveApplicationContext applicationContext: [String : Any]) {
        print("[Watch] 📋 Received applicationContext: \(applicationContext.keys.joined(separator: ", "))")
        
        if let command = applicationContext["command"] as? String {
            handleCommand(["type": command])
        }
    }
    
    // Unified command handler
    private func handleCommand(_ data: [String: Any]) {
        let type = (data["type"] as? String) ?? (data["command"] as? String)
        
        guard let cmd = type else {
            print("[Watch] ⚠️ No command found in data")
            return
        }
        
        print("[Watch] 🎯 Processing command: '\(cmd)'")

        switch cmd {
        case "start":
            print("[Watch] 🟢 START command")
            DispatchQueue.main.async {
                if !self.isRunning {
                    self.startWorkout()
                } else {
                    print("[Watch] ℹ️ Workout already running")
                    // Отправляем текущий HR для подтверждения
                    if self.heartRate > 0 {
                        self.sendHeartRateToPhone(self.heartRate)
                    }
                }
            }
        case "stop":
            print("[Watch] 🔴 STOP command")
            DispatchQueue.main.async { self.stopWorkout() }
        case "heartbeat":
            print("[Watch] 💓 Heartbeat received (keepalive)")
            // Отвечаем текущим HR если активны
            if isRunning && heartRate > 0 {
                sendHeartRateToPhone(heartRate)
            }
        default:
            print("[Watch] ❓ Unknown command: '\(cmd)'")
        }
    }
}
