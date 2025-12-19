import Foundation
import HealthKit
import WatchConnectivity
import WatchKit
import Combine
import WidgetKit

class WorkoutManager: NSObject, ObservableObject {
    static let shared = WorkoutManager()
    
    private let healthStore = HKHealthStore()
    private var session: HKWorkoutSession?
    private var builder: HKLiveWorkoutBuilder?
    private var extendedSession: WKExtendedRuntimeSession?
    
    @Published var heartRate: Double = 0
    @Published var isActive = false
    @Published var authorizationStatus: HKAuthorizationStatus = .notDetermined

    // Avoid spamming WidgetKit reloads (HR can arrive very frequently).
    private var lastComplicationReloadAt = Date.distantPast
    private func reloadComplicationIfNeeded() {
        let now = Date()
        guard now.timeIntervalSince(lastComplicationReloadAt) >= 15 else { return }
        lastComplicationReloadAt = now
        WidgetCenter.shared.reloadTimelines(ofKind: "OndaComplication")
    }
    
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
        // Проверка что сессия не запущена уже
        if session?.state == .running {
            print("[WorkoutManager] ℹ️ Workout already running")
            return
        }
        
        let config = HKWorkoutConfiguration()
        config.activityType = .mindAndBody
        config.locationType = .indoor
        
        do {
            let newSession = try HKWorkoutSession(healthStore: healthStore, configuration: config)
            let newBuilder = newSession.associatedWorkoutBuilder()
            
            newBuilder.dataSource = HKLiveWorkoutDataSource(
                healthStore: healthStore, 
                workoutConfiguration: config
            )
            
            newSession.delegate = self
            newBuilder.delegate = self
            
            session = newSession
            builder = newBuilder
            
            let startDate = Date()
            newSession.startActivity(with: startDate)
            newBuilder.beginCollection(withStart: startDate) { [weak self] success, error in
                guard let self = self else { return }
                
                DispatchQueue.main.async {
                    if success {
                        self.isActive = true
                        print("[WorkoutManager] ✅ Workout started successfully")
                        
                        // Убеждаемся что extended session активна
                        self.startExtendedSession()
                    } else {
                        print("[WorkoutManager] ❌ Failed to begin collection: \(error?.localizedDescription ?? "unknown")")
                    }
                }
            }
        } catch {
            print("[WorkoutManager] ❌ Error starting workout: \(error.localizedDescription)")
        }
    }
    
    func stopWorkout() {
        guard let session = session else {
            print("[WorkoutManager] ℹ️ No active session to stop")
            return
        }
        
        print("[WorkoutManager] 🔴 Stopping workout...")
        session.end()
        
        DispatchQueue.main.async {
            self.isActive = false
            self.heartRate = 0
        }
    }
    
    private func sendHeartRateToPhone(_ hr: Double) {
        // Валидация значения пульса
        guard hr > 30 && hr < 220 else {
            print("[WorkoutManager] ⚠️ Invalid HR value: \(hr), skipping")
            return
        }
        
        let roundedHr = round(hr)
        
        let message: [String: Any] = [
            "type": "heartRate",
            "value": roundedHr,
            "timestamp": Date().timeIntervalSince1970
        ]
        
        let wcSession = WCSession.default
        
        if wcSession.isReachable {
            // Прямая отправка когда связь активна
            wcSession.sendMessage(message, replyHandler: { _ in
                print("[WorkoutManager] ✅ HR sent: \(Int(roundedHr)) bpm")
            }) { error in
                print("[WorkoutManager] ⚠️ sendMessage error: \(error.localizedDescription)")
                // Fallback на фоновую доставку
                self.sendViaBackgroundDelivery(hr: roundedHr)
            }
        } else {
            // Фоновая доставка когда связь недоступна
            sendViaBackgroundDelivery(hr: roundedHr)
        }
    }
    
    private func sendViaBackgroundDelivery(hr: Double) {
        let wcSession = WCSession.default
        
        // Отправляем через transferUserInfo - разбудит приложение на iPhone
        let message: [String: Any] = [
            "type": "heartRate",
            "value": hr,
            "timestamp": Date().timeIntervalSince1970
        ]
        
        wcSession.transferUserInfo(message)
        print("[WorkoutManager] 📦 HR queued via transferUserInfo: \(Int(hr)) bpm")
        
        // Также обновляем applicationContext для мгновенного доступа
        do {
            try wcSession.updateApplicationContext([
                "latestHeartRate": hr,
                "timestamp": Date().timeIntervalSince1970,
                "isActive": isActive
            ])
            print("[WorkoutManager] 📋 Application context updated")
        } catch {
            print("[WorkoutManager] ⚠️ Failed to update context: \(error.localizedDescription)")
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
    func workoutSession(_ workoutSession: HKWorkoutSession, 
                       didChangeTo toState: HKWorkoutSessionState, 
                       from fromState: HKWorkoutSessionState, 
                       date: Date) {
        
        let stateString: String
        switch toState {
        case .notStarted: stateString = "notStarted"
        case .running:
            stateString = "running"
            DispatchQueue.main.async { self.isActive = true }
        case .ended:
            stateString = "ended"
            DispatchQueue.main.async { self.isActive = false }
        case .paused: stateString = "paused"
        case .prepared: stateString = "prepared"
        @unknown default: stateString = "unknown(\(toState.rawValue))"
        }
        
        print("[WorkoutManager] Workout state: \(fromState.rawValue) → \(stateString)")
        
        // Автоматический перезапуск если сессия завершилась неожиданно
        if toState == .ended && isActive {
            print("[WorkoutManager] ⚠️ Workout ended unexpectedly, will restart in 2 seconds...")
            DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) { [weak self] in
                guard let self = self, self.isActive else { return }
                print("[WorkoutManager] 🔄 Restarting workout after unexpected end")
                self.startWorkout()
            }
        }
    }
    
    func workoutSession(_ workoutSession: HKWorkoutSession, didFailWithError error: Error) {
        print("[WorkoutManager] ❌ Workout session error: \(error.localizedDescription)")
        
        // Попытка перезапуска при ошибке
        if isActive {
            print("[WorkoutManager] 🔄 Attempting to restart workout after error...")
            DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) { [weak self] in
                guard let self = self, self.isActive else { return }
                self.startWorkout()
            }
        }
    }
    
    func workoutSession(_ workoutSession: HKWorkoutSession,
                       didGenerate event: HKWorkoutEvent) {
        print("[WorkoutManager] Workout event: \(event.type.rawValue)")
    }
}

extension WorkoutManager: HKLiveWorkoutBuilderDelegate {
    func workoutBuilder(_ workoutBuilder: HKLiveWorkoutBuilder, 
                       didCollectDataOf collectedTypes: Set<HKSampleType>) {
        
        for type in collectedTypes {
            guard let quantityType = type as? HKQuantityType,
                  quantityType == HKQuantityType.quantityType(forIdentifier: .heartRate) 
            else { continue }
            
            if let statistics = workoutBuilder.statistics(for: quantityType) {
                let hrUnit = HKUnit.count().unitDivided(by: .minute())
                
                if let value = statistics.mostRecentQuantity()?.doubleValue(for: hrUnit) {
                    // Валидация значения пульса
                    guard value > 30 && value < 220 else {
                        print("[WorkoutManager] ⚠️ Invalid HR value: \(value), skipping")
                        return
                    }
                    
                    DispatchQueue.main.async {
                        let roundedValue = round(value)
                        
                        // Обновляем локальное значение
                        self.heartRate = roundedValue

                        // Ping the complication so watchOS considers us an active provider.
                        self.reloadComplicationIfNeeded()
                        
                        // Отправляем на телефон
                        self.sendHeartRateToPhone(roundedValue)
                        
                        print("[WorkoutManager] 💗 HR: \(Int(roundedValue)) bpm (reachable: \(WCSession.default.isReachable))")
                    }
                }
            }
        }
    }
    
    func workoutBuilderDidCollectEvent(_ workoutBuilder: HKLiveWorkoutBuilder) {
        print("[WorkoutManager] Workout builder collected event")
    }
}

extension WorkoutManager: WCSessionDelegate {
    func session(_ session: WCSession, 
                activationDidCompleteWith state: WCSessionActivationState, 
                error: Error?) {
        
        let stateString: String
        switch state {
        case .activated: stateString = "activated"
        case .inactive: stateString = "inactive"
        case .notActivated: stateString = "notActivated"
        @unknown default: stateString = "unknown(\(state.rawValue))"
        }
        
        if let error = error {
            print("[WorkoutManager] ❌ WCSession activation failed: \(stateString), error: \(error.localizedDescription)")
        } else {
            print("[WorkoutManager] ✅ WCSession \(stateString)")
        }
        
        // Проверяем applicationContext при активации сессии
        let context = session.receivedApplicationContext
        if !context.isEmpty {
            print("[WorkoutManager] 📋 Found pending context: \(context.keys.joined(separator: ", "))")
            
            if let command = context["command"] as? String {
                print("[WorkoutManager] Processing pending command: \(command)")
                handleCommand(["type": command])
            }
        }
        
        // Если есть активная сессия, отправляем текущий статус
        if state == .activated && isActive && heartRate > 0 {
            print("[WorkoutManager] 💗 Sending current HR after activation: \(Int(heartRate)) bpm")
            sendHeartRateToPhone(heartRate)
        }
    }
    
    func sessionReachabilityDidChange(_ session: WCSession) {
        let reachable = session.isReachable
        print("[WorkoutManager] 📡 Reachability changed: \(reachable)")
        
        // Если связь восстановилась, отправляем текущее значение HR
        if reachable && heartRate > 0 {
            print("[WorkoutManager] 💗 Connection restored, sending current HR: \(Int(heartRate)) bpm")
            sendHeartRateToPhone(heartRate)
        }
    }
    
    func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
        print("[WorkoutManager] 📨 Received message: \(message.keys.joined(separator: ", "))")
        handleCommand(message)
    }
    
    func session(_ session: WCSession,
                didReceiveMessage message: [String: Any],
                replyHandler: @escaping ([String: Any]) -> Void) {
        print("[WorkoutManager] 📨 Received message with reply: \(message.keys.joined(separator: ", "))")
        handleCommand(message)
        
        // Отправляем ответ с текущим статусом
        replyHandler([
            "received": true,
            "isActive": isActive,
            "heartRate": heartRate
        ])
    }
    
    func session(_ session: WCSession, didReceiveUserInfo userInfo: [String: Any] = [:]) {
        print("[WorkoutManager] 📦 Received userInfo (background wake): \(userInfo.keys.joined(separator: ", "))")
        handleCommand(userInfo)
    }
    
    func session(_ session: WCSession, didReceiveApplicationContext applicationContext: [String : Any]) {
        print("[WorkoutManager] 📋 Received applicationContext: \(applicationContext.keys.joined(separator: ", "))")
        
        if let command = applicationContext["command"] as? String {
            handleCommand(["type": command])
        }
    }
    
    private func handleCommand(_ data: [String: Any]) {
        let command = (data["type"] as? String) ?? (data["command"] as? String)
        
        guard let cmd = command else {
            print("[WorkoutManager] ⚠️ No command found in data")
            return
        }
        
        print("[WorkoutManager] 🎯 Processing command: '\(cmd)'")
        
        DispatchQueue.main.async {
            switch cmd {
            case "start":
                print("[WorkoutManager] 🟢 START command received")
                
                if self.isActive {
                    print("[WorkoutManager] ℹ️ Workout already active")
                    // Отправляем текущий HR для подтверждения
                    if self.heartRate > 0 {
                        self.sendHeartRateToPhone(self.heartRate)
                    }
                } else {
                    self.startWorkout()
                }
                
            case "stop":
                print("[WorkoutManager] 🔴 STOP command received")
                self.stopWorkout()
                
            case "heartbeat":
                print("[WorkoutManager] 💓 Heartbeat received (keepalive)")
                // Отвечаем текущим HR если активны
                if self.isActive && self.heartRate > 0 {
                    self.sendHeartRateToPhone(self.heartRate)
                }
                
            default:
                print("[WorkoutManager] ❓ Unknown command: '\(cmd)'")
            }
        }
    }
}
