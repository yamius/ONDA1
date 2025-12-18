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
    
    // Очередь для отправки HR когда связь недоступна
    private var pendingHeartRates: [(value: Double, timestamp: Date)] = []
    private var lastSentHeartRate: Double = 0
    private var lastSentTime: Date = Date.distantPast
    
    // Таймер для периодической проверки и отправки данных
    private var reconnectionTimer: Timer?
    
    @Published var heartRate: Double = 0
    @Published var isActive = false
    @Published var authorizationStatus: HKAuthorizationStatus = .notDetermined
    
    override init() {
        super.init()
        setupWatchConnectivity()
        startExtendedSession()
        startReconnectionMonitor()
    }
    
    deinit {
        reconnectionTimer?.invalidate()
    }
    
    private func setupWatchConnectivity() {
        if WCSession.isSupported() {
            let wcSession = WCSession.default
            wcSession.delegate = self
            wcSession.activate()
            print("[WorkoutManager] WCSession activating...")
        }
    }
    
    // Мониторинг связи и автоматическая отправка накопленных данных
    private func startReconnectionMonitor() {
        reconnectionTimer?.invalidate()
        reconnectionTimer = Timer.scheduledTimer(withTimeInterval: 2.0, repeats: true) { [weak self] _ in
            self?.checkAndSendPendingData()
        }
        print("[WorkoutManager] Reconnection monitor started")
    }
    
    private func checkAndSendPendingData() {
        guard WCSession.default.activationState == .activated else {
            // Попытка переактивировать сессию
            if WCSession.default.activationState == .notActivated {
                print("[WorkoutManager] WCSession not activated, reactivating...")
                WCSession.default.activate()
            }
            return
        }
        
        // Отправка накопленных данных если есть связь
        if WCSession.default.isReachable && !pendingHeartRates.isEmpty {
            print("[WorkoutManager] Connection restored! Sending \(pendingHeartRates.count) pending HR values")
            
            // Отправляем последнее значение
            if let latest = pendingHeartRates.last {
                sendHeartRateToPhone(latest.value, immediate: true)
            }
            
            pendingHeartRates.removeAll()
        }
        
        // Если связь есть, отправляем текущее значение HR периодически
        if WCSession.default.isReachable && heartRate > 0 {
            let timeSinceLastSent = Date().timeIntervalSince(lastSentTime)
            if timeSinceLastSent > 3.0 { // Отправляем каждые 3 секунды минимум
                sendHeartRateToPhone(heartRate, immediate: false)
            }
        }
    }
    
    func startExtendedSession() {
        // Проверяем текущее состояние
        if let currentSession = extendedSession {
            switch currentSession.state {
            case .running:
                print("[WorkoutManager] Extended session already running")
                return
            case .scheduled:
                print("[WorkoutManager] Extended session scheduled")
                return
            case .notStarted, .invalid:
                print("[WorkoutManager] Extended session invalid, creating new")
                extendedSession = nil
            @unknown default:
                print("[WorkoutManager] Extended session unknown state")
            }
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
                    // Note: success here means the dialog was shown, not that permission was granted
                    // We assume permission is granted and will detect if HR data comes through
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
        // Если сессия уже активна, не запускаем повторно
        if session?.state == .running {
            print("[WorkoutManager] Workout already running")
            return
        }
        
        let config = HKWorkoutConfiguration()
        config.activityType = .mindAndBody
        config.locationType = .indoor
        
        do {
            // Создаем новую сессию
            let newSession = try HKWorkoutSession(healthStore: healthStore, configuration: config)
            let newBuilder = newSession.associatedWorkoutBuilder()
            
            // Настраиваем источник данных для автоматического сбора HR
            newBuilder.dataSource = HKLiveWorkoutDataSource(
                healthStore: healthStore, 
                workoutConfiguration: config
            )
            
            // Устанавливаем делегаты
            newSession.delegate = self
            newBuilder.delegate = self
            
            // Сохраняем ссылки
            session = newSession
            builder = newBuilder
            
            // Запускаем сессию
            let startDate = Date()
            newSession.startActivity(with: startDate)
            newBuilder.beginCollection(withStart: startDate) { [weak self] success, error in
                guard let self = self else { return }
                
                DispatchQueue.main.async {
                    if success {
                        self.isActive = true
                        print("[WorkoutManager] Workout started successfully")
                        
                        // Убеждаемся что extended session активна
                        self.startExtendedSession()
                    } else {
                        print("[WorkoutManager] Failed to begin collection: \(error?.localizedDescription ?? "unknown")")
                    }
                }
            }
        } catch {
            print("[WorkoutManager] Error starting workout: \(error.localizedDescription)")
        }
    }
    
    func stopWorkout() {
        guard let session = session else {
            print("[WorkoutManager] No active session to stop")
            return
        }
        
        print("[WorkoutManager] Stopping workout...")
        session.end()
        
        DispatchQueue.main.async {
            self.isActive = false
            self.heartRate = 0
            self.pendingHeartRates.removeAll()
        }
    }
    
    private func sendHeartRateToPhone(_ hr: Double, immediate: Bool = false) {
        let now = Date()
        
        // Избегаем отправки одинаковых значений слишком часто
        if !immediate && abs(hr - lastSentHeartRate) < 1.0 && now.timeIntervalSince(lastSentTime) < 2.0 {
            return
        }
        
        lastSentHeartRate = hr
        lastSentTime = now
        
        let message: [String: Any] = [
            "type": "heartRate",
            "value": hr,
            "timestamp": now.timeIntervalSince1970
        ]
        
        let wcSession = WCSession.default
        
        if wcSession.isReachable {
            // Прямая отправка когда связь активна
            wcSession.sendMessage(message, replyHandler: { _ in
                print("[WorkoutManager] HR sent: \(Int(hr)) bpm")
            }) { error in
                print("[WorkoutManager] sendMessage error: \(error.localizedDescription)")
                // Если прямая отправка не удалась, используем фоновую доставку
                self.sendViaBackgroundDelivery(hr: hr, timestamp: now)
            }
        } else {
            // Используем фоновую доставку когда связь недоступна
            sendViaBackgroundDelivery(hr: hr, timestamp: now)
        }
    }
    
    private func sendViaBackgroundDelivery(hr: Double, timestamp: Date) {
        // Добавляем в очередь
        pendingHeartRates.append((value: hr, timestamp: timestamp))
        
        // Ограничиваем размер очереди (храним только последние 20 значений)
        if pendingHeartRates.count > 20 {
            pendingHeartRates.removeFirst()
        }
        
        // Отправляем через transferUserInfo - это разбудит приложение на iPhone
        let message: [String: Any] = [
            "type": "heartRate",
            "value": hr,
            "timestamp": timestamp.timeIntervalSince1970
        ]
        
        WCSession.default.transferUserInfo(message)
        print("[WorkoutManager] HR queued for background delivery: \(Int(hr)) bpm (pending: \(pendingHeartRates.count))")
        
        // Также обновляем applicationContext для мгновенного доступа при восстановлении связи
        do {
            try WCSession.default.updateApplicationContext([
                "latestHeartRate": hr,
                "timestamp": timestamp.timeIntervalSince1970,
                "isActive": isActive
            ])
            print("[WorkoutManager] Application context updated")
        } catch {
            print("[WorkoutManager] Failed to update context: \(error.localizedDescription)")
        }
    }
}

extension WorkoutManager: WKExtendedRuntimeSessionDelegate {
    func extendedRuntimeSessionDidStart(_ extendedRuntimeSession: WKExtendedRuntimeSession) {
        print("[WorkoutManager] ✅ Extended runtime session started successfully")
    }
    
    func extendedRuntimeSessionWillExpire(_ extendedRuntimeSession: WKExtendedRuntimeSession) {
        print("[WorkoutManager] ⚠️ Extended session will expire, restarting...")
        
        // Перезапускаем сессию до истечения
        DispatchQueue.main.async {
            self.stopExtendedSession()
            self.startExtendedSession()
        }
    }
    
    func extendedRuntimeSession(_ extendedRuntimeSession: WKExtendedRuntimeSession,
                                didInvalidateWith reason: WKExtendedRuntimeSessionInvalidationReason,
                                error: Error?) {
        let reasonString: String
        switch reason {
        case .sessionInProgress:
            reasonString = "sessionInProgress (workout already running)"
            // Это нормально - значит HKWorkoutSession уже держит приложение активным
            print("[WorkoutManager] ℹ️ Extended session invalidated: \(reasonString)")
            return
        case .expired:
            reasonString = "expired"
        case .userRequest:
            reasonString = "userRequest"
        @unknown default:
            reasonString = "unknown(\(reason.rawValue))"
        }
        
        print("[WorkoutManager] ❌ Extended session invalidated: \(reasonString), error: \(error?.localizedDescription ?? "none")")
        
        // Автоматически перезапускаем если есть активная workout сессия
        if isActive {
            print("[WorkoutManager] 🔄 Workout is active, restarting extended session...")
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                self.startExtendedSession()
            }
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
        case .notStarted:
            stateString = "notStarted"
        case .running:
            stateString = "running"
            DispatchQueue.main.async {
                self.isActive = true
            }
        case .ended:
            stateString = "ended"
            DispatchQueue.main.async {
                self.isActive = false
            }
        case .paused:
            stateString = "paused"
        case .prepared:
            stateString = "prepared"
        @unknown default:
            stateString = "unknown(\(toState.rawValue))"
        }
        
        print("[WorkoutManager] Workout state: \(fromState.rawValue) → \(stateString)")
        
        // Если сессия завершилась неожиданно и мы все еще хотим активность
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
                        
                        // Отправляем на телефон (с автоматическим fallback на фоновую доставку)
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
        case .activated:
            stateString = "activated"
        case .inactive:
            stateString = "inactive"
        case .notActivated:
            stateString = "notActivated"
        @unknown default:
            stateString = "unknown(\(state.rawValue))"
        }
        
        if let error = error {
            print("[WorkoutManager] ❌ WCSession activation failed: \(stateString), error: \(error.localizedDescription)")
        } else {
            print("[WorkoutManager] ✅ WCSession \(stateString)")
        }
        
        // Проверяем applicationContext при активации сессии
        let context = session.receivedApplicationContext
        if !context.isEmpty {
            print("[WorkoutManager] Found pending context: \(context.keys.joined(separator: ", "))")
            
            if let command = context["command"] as? String {
                print("[WorkoutManager] Processing pending command: \(command)")
                handleCommand(["type": command])
            }
        }
        
        // Если есть активная сессия, отправляем текущий статус
        if state == .activated && isActive && heartRate > 0 {
            print("[WorkoutManager] Sending current HR after activation: \(Int(heartRate)) bpm")
            sendHeartRateToPhone(heartRate, immediate: true)
        }
    }
    
    func sessionReachabilityDidChange(_ session: WCSession) {
        let reachable = session.isReachable
        print("[WorkoutManager] 📡 Reachability changed: \(reachable)")
        
        // Если связь восстановилась, отправляем накопленные данные
        if reachable {
            checkAndSendPendingData()
            
            // Также отправляем текущее значение HR если оно есть
            if heartRate > 0 {
                print("[WorkoutManager] Connection restored, sending current HR: \(Int(heartRate)) bpm")
                sendHeartRateToPhone(heartRate, immediate: true)
            }
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
    
    // Обработка applicationContext - вызывается когда iPhone обновляет контекст
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
                
                // Проверяем, уже ли активна сессия
                if self.isActive {
                    print("[WorkoutManager] ℹ️ Workout already active, skipping")
                    // Отправляем текущий HR чтобы подтвердить что все работает
                    if self.heartRate > 0 {
                        self.sendHeartRateToPhone(self.heartRate, immediate: true)
                    }
                    return
                }
                
                // Вибрация чтобы пользователь поднял руку и увидел часы
                WKInterfaceDevice.current().play(.notification)
                
                let appState = WKApplication.shared().applicationState
                let stateString: String
                switch appState {
                case .active:
                    stateString = "active"
                case .inactive:
                    stateString = "inactive"
                case .background:
                    stateString = "background"
                @unknown default:
                    stateString = "unknown"
                }
                
                print("[WorkoutManager] App state: \(stateString)")
                
                if appState == .active {
                    // Приложение на переднем плане - запускаем workout сразу
                    print("[WorkoutManager] 🏃 Starting workout (app is active)")
                    self.startWorkout()
                } else {
                    // Приложение в фоне - показываем уведомление и запускаем workout
                    print("[WorkoutManager] 🔔 App not active, showing notification and starting workout")
                    
                    // Дополнительная вибрация для привлечения внимания
                    WKInterfaceDevice.current().play(.start)
                    
                    // Показываем уведомление
                    NotificationManager.shared.showOpenAppNotification()
                    
                    // Запускаем workout даже в фоне - HKWorkoutSession работает в фоне
                    print("[WorkoutManager] 🏃 Starting workout in background")
                    self.startWorkout()
                }
                
            case "stop":
                print("[WorkoutManager] 🔴 STOP command received")
                
                // Вибрация при остановке
                WKInterfaceDevice.current().play(.stop)
                
                self.stopWorkout()
                
            case "heartbeat":
                // Keepalive сообщение от iPhone
                print("[WorkoutManager] 💓 Heartbeat received (connection alive)")
                
                // Отвечаем текущим статусом если активны
                if self.isActive && self.heartRate > 0 {
                    self.sendHeartRateToPhone(self.heartRate, immediate: true)
                }
                
            default:
                print("[WorkoutManager] ❓ Unknown command: '\(cmd)'")
            }
        }
    }
}
