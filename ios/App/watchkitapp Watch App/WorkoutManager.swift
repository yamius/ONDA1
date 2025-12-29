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
    private let minHRInterval: TimeInterval = 0.8 // Минимальный интервал между отправками
    
    // Таймер для периодической проверки и отправки данных
    private var reconnectionTimer: Timer?
    
    // 🔥 Режим накопления - когда phone показывает диалоги (PRIMARY = context only)
    private var isInAccumulationMode = false
    
    @Published var heartRate: Double = 0
    @Published var isActive = false
    @Published var authorizationStatus: HKAuthorizationStatus = .notDetermined
    @Published var permissionJustGranted: Bool = false  // 🔥 НОВОЕ: Флаг для немедленного restart
    
    // 🔥 НОВОЕ: Timestamps для диагностики
    private var workoutStartTime: Date?
    private var extendedSessionStartTime: Date?
    private var lastReachabilityChange: Date?
    
    override init() {
        super.init()
        let bundleId = Bundle.main.bundleIdentifier ?? "unknown"
        logDiagnostic("🚀 WorkoutManager initialized [watchkitapp] bundle: \(bundleId)", important: true)
        setupWatchConnectivity()
        startExtendedSession()
        startReconnectionMonitor()
    }
    
    deinit {
        reconnectionTimer?.invalidate()
        logDiagnostic("💀 WorkoutManager deinitialized")
    }
    
    // 🔥 НОВОЕ: Единый метод логирования с отправкой на iPhone
    private func logDiagnostic(_ message: String, important: Bool = false) {
        let timestamp = DateFormatter.localizedString(from: Date(), dateStyle: .none, timeStyle: .medium)
        let prefix = important ? "🔥" : "📊"
        let fullMessage = "[\(timestamp)] \(prefix) [Watch] \(message)"
        print(fullMessage)
        
        // Отправляем важные логи на iPhone
        if important {
            sendDiagnosticLog(message)
        }
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
        logDiagnostic("🕐 startExtendedSession() called", important: true)
        
        // Проверяем текущее состояние
        if let currentSession = extendedSession {
            let stateStr: String
            switch currentSession.state {
            case .running:
                stateStr = "running"
                logDiagnostic("⏭️ Extended session already running, skipping")
                return
            case .scheduled:
                stateStr = "scheduled"
                logDiagnostic("⏭️ Extended session scheduled, skipping")
                return
            case .notStarted:
                stateStr = "notStarted"
            case .invalid:
                stateStr = "invalid"
            @unknown default:
                stateStr = "unknown"
            }
            logDiagnostic("🔄 Extended session state: \(stateStr), creating new", important: true)
            extendedSession = nil
        }
        
        extendedSession = WKExtendedRuntimeSession()
        extendedSession?.delegate = self
        
        // 🔥 Запускаем сессию на 1 час вперед (3600 секунд)
        let oneHourFromNow = Date().addingTimeInterval(3600)
        extendedSession?.start(at: oneHourFromNow)
        extendedSessionStartTime = Date()
        
        logDiagnostic("✅ Extended session created, scheduled until \(oneHourFromNow)", important: true)
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
        
        guard let hrType = HKObjectType.quantityType(forIdentifier: .heartRate) else {
            print("[WorkoutManager] ❌ Failed to get heart rate type")
            completion(false)
            return
        }
        
        // Запоминаем статус ДО показа диалога
        let statusBefore = healthStore.authorizationStatus(for: hrType)
        print("[WorkoutManager] Requesting HealthKit authorization...")
        print("[WorkoutManager] Status before dialog: \(statusBefore.rawValue)")
        
        healthStore.requestAuthorization(toShare: typesToShare, read: typesToRead) { success, error in
            DispatchQueue.main.async {
                if success {
                    print("[WorkoutManager] ✅ Dialog shown, starting status monitor...")
                    
                    // 🔥 НОВОЕ: Мониторим изменение статуса
                    self.monitorAuthorizationStatus(
                        beforeStatus: statusBefore,
                        hrType: hrType,
                        completion: completion
                    )
                } else {
                    print("[WorkoutManager] ❌ Failed to show dialog: \(error?.localizedDescription ?? "unknown")")
                    completion(false)
                }
            }
        }
    }
    
    // 🔥 НОВЫЙ метод: Отслеживание изменения статуса разрешений
    private func monitorAuthorizationStatus(
        beforeStatus: HKAuthorizationStatus,
        hrType: HKQuantityType,
        completion: @escaping (Bool) -> Void
    ) {
        var attempts = 0
        let maxAttempts = 40  // 40 попыток * 0.5 секунды = 20 секунд
        
        Timer.scheduledTimer(withTimeInterval: 0.5, repeats: true) { timer in
            attempts += 1
            
            let currentStatus = self.healthStore.authorizationStatus(for: hrType)
            
            if attempts % 4 == 0 {  // Логируем каждые 2 секунды
                print("[WorkoutManager] 🔍 Status check #\(attempts): \(currentStatus.rawValue)")
            }
            
            // Если статус изменился на .sharingAuthorized
            if currentStatus == .sharingAuthorized && beforeStatus != .sharingAuthorized {
                print("[WorkoutManager] 🎉 PERMISSION GRANTED! Status: \(beforeStatus.rawValue) → \(currentStatus.rawValue)")
                timer.invalidate()
                self.authorizationStatus = currentStatus
                
                // 🔥 Устанавливаем @Published флаг для немедленного restart
                DispatchQueue.main.async {
                    self.permissionJustGranted = true
                    print("[WorkoutManager] 🚨 permissionJustGranted = true (will trigger restart)")
                }
                
                completion(true)
                return
            }
            
            // Если статус изменился на .sharingDenied
            if currentStatus == .sharingDenied && beforeStatus != .sharingDenied {
                print("[WorkoutManager] ❌ Permission denied! Status: \(currentStatus.rawValue)")
                timer.invalidate()
                self.authorizationStatus = currentStatus
                completion(false)
                return
            }
            
            // Если превысили лимит попыток
            if attempts >= maxAttempts {
                print("[WorkoutManager] ⏰ Timeout waiting for permission decision (20s)")
                timer.invalidate()
                // Предполагаем что разрешения дали (диалог закрылся без явного deny)
                self.authorizationStatus = currentStatus
                completion(true)
            }
        }
    }
    
    var isAuthorized: Bool {
        guard let heartRateType = HKObjectType.quantityType(forIdentifier: .heartRate) else {
            return false
        }
        let status = healthStore.authorizationStatus(for: heartRateType)
        // ✅ Возвращаем true ТОЛЬКО если реально разрешено (не .notDetermined и не .sharingDenied)
        return status == .sharingAuthorized
    }
    
    func startWorkout() {
        logDiagnostic("🏃 startWorkout() called", important: true)
        
        // Если сессия уже активна, не запускаем повторно
        if session?.state == .running {
            logDiagnostic("⏭️ Workout already running, skipping")
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
            workoutStartTime = startDate
            newSession.startActivity(with: startDate)
            newBuilder.beginCollection(withStart: startDate) { [weak self] success, error in
                guard let self = self else { return }
                
                DispatchQueue.main.async {
                    if success {
                        self.isActive = true
                        self.logDiagnostic("✅ Workout started successfully at \(startDate)", important: true)
                        
                        // Убеждаемся что extended session активна
                        self.startExtendedSession()
                    } else {
                        let errorMsg = error?.localizedDescription ?? "unknown"
                        self.logDiagnostic("❌ Failed to begin collection: \(errorMsg)", important: true)
                    }
                }
            }
        } catch {
            logDiagnostic("❌ Error starting workout: \(error.localizedDescription)", important: true)
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
    
    // 🔥 НОВОЕ: Полное пересоздание workout session (агрессивный restart)
    func recreateWorkoutSession() {
        print("[WorkoutManager] 🔥 === FULL WORKOUT RECREATION START ===")
        
        // Отправляем диагностику на iPhone
        sendDiagnosticLog("Recreating workout session (full invalidation)")
        
        // 1. Полностью останавливаем builder
        if let currentBuilder = builder {
            print("[WorkoutManager] 🔥 Ending builder collection...")
            currentBuilder.endCollection(withEnd: Date()) { success, error in
                if let error = error {
                    print("[WorkoutManager] ⚠️ Builder end error: \(error.localizedDescription)")
                } else {
                    print("[WorkoutManager] ✅ Builder ended successfully")
                }
            }
        }
        
        // 2. Полностью останавливаем session
        if let currentSession = session {
            print("[WorkoutManager] 🔥 Ending session...")
            currentSession.end()
        }
        
        // 3. Обнуляем ссылки
        print("[WorkoutManager] 🔥 Invalidating session/builder references...")
        session = nil
        builder = nil
        
        DispatchQueue.main.async {
            self.isActive = false
            self.heartRate = 0
        }
        
        // 4. Даем системе время на очистку (2 секунды)
        print("[WorkoutManager] 🔥 Waiting 2s for HealthKit cleanup...")
        sendDiagnosticLog("Waiting 2s for HealthKit cleanup")
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
            print("[WorkoutManager] 🔥 Starting fresh workout session...")
            self.sendDiagnosticLog("Starting fresh workout after full cleanup")
            self.startWorkout()
            print("[WorkoutManager] 🔥 === FULL WORKOUT RECREATION END ===")
        }
    }
    
    // 🔥 НОВОЕ: Отправка диагностических логов с Watch на iPhone
    private func sendDiagnosticLog(_ message: String) {
        let wcSession = WCSession.default
        guard wcSession.activationState == .activated else { return }
        
        let timestamp = ISO8601DateFormatter().string(from: Date())
        let log: [String: Any] = [
            "type": "watchDiagnostic",
            "message": message,
            "timestamp": timestamp,
            "heartRate": heartRate,
            "isActive": isActive,
            "isAuthorized": isAuthorized
        ]
        
        // Отправляем через context (гарантированная доставка)
        do {
            var currentContext = wcSession.applicationContext
            currentContext["lastDiagnostic"] = log
            try wcSession.updateApplicationContext(currentContext)
            print("[WorkoutManager] 📤 Diagnostic sent: \(message)")
        } catch {
            print("[WorkoutManager] ⚠️ Failed to send diagnostic: \(error.localizedDescription)")
        }
    }
    
    // 🔥 Публичный метод для отправки диагностики запуска
    func sendStartupDiagnostic(stage: String, bundle: String) {
        print("[WorkoutManager] 🚀 Startup diagnostic: \(stage) - \(bundle)")
        
        let wcSession = WCSession.default
        guard WCSession.isSupported() else {
            print("[WorkoutManager] ⚠️ WCSession not supported")
            return
        }
        
        // Активируем сессию если нужно
        if wcSession.activationState != .activated {
            wcSession.activate()
        }
        
        let timestamp = ISO8601DateFormatter().string(from: Date())
        let diagnostic: [String: Any] = [
            "type": "watchStartup",
            "stage": stage,
            "bundleId": bundle,
            "timestamp": timestamp,
            "wcState": wcSession.activationState.rawValue,
            "isReachable": wcSession.isReachable
        ]
        
        // Пробуем отправить через message (быстро, но требует reachable)
        if wcSession.isReachable {
            wcSession.sendMessage(diagnostic, replyHandler: nil) { error in
                print("[WorkoutManager] ⚠️ Message failed: \(error.localizedDescription)")
            }
            print("[WorkoutManager] 📤 Startup sent via message")
        }
        
        // Также через context (гарантированная доставка)
        do {
            var context = wcSession.applicationContext
            context["watchStartup"] = diagnostic
            try wcSession.updateApplicationContext(context)
            print("[WorkoutManager] 📤 Startup sent via context")
        } catch {
            print("[WorkoutManager] ⚠️ Context update failed: \(error.localizedDescription)")
        }
    }
    
    // 🔥 ПЕРЕДЕЛАНО: updateApplicationContext = PRIMARY (как в main 86cd4bc)
    private func sendHeartRateToPhone(_ hr: Double, immediate: Bool = false) {
        let now = Date()
        
        // Минимальный интервал между отправками
        if !immediate && now.timeIntervalSince(lastSentTime) < minHRInterval {
            return
        }
        
        lastSentHeartRate = hr
        lastSentTime = now
        
        let wcSession = WCSession.default
        
        guard wcSession.activationState == .activated else {
            logDiagnostic("❌ Cannot send HR: WCSession not activated", important: true)
            return
        }
        
        let isReachable = wcSession.isReachable
        let message: [String: Any] = [
            "type": "heartRate",
            "value": hr,
            "timestamp": now.timeIntervalSince1970
        ]
        
        // 🔥 PRIMARY: updateApplicationContext (самый стабильный)
        do {
            try wcSession.updateApplicationContext([
                "lastUpdate": message,
                "lastHeartRate": hr,
                "timestamp": now.timeIntervalSince1970,
                "isWorkoutActive": isActive
            ])
            logDiagnostic("📋 Context updated: \(Int(hr)) bpm, reach=\(isReachable)")
        } catch {
            logDiagnostic("❌ Context update failed: \(error.localizedDescription)", important: true)
        }
        
        // 🔥 SECONDARY: sendMessage ТОЛЬКО если реально reachable (realtime БОНУС)
        if wcSession.isReachable && !isInAccumulationMode {
            wcSession.sendMessage(message, replyHandler: { _ in
                self.logDiagnostic("💗 sendMessage SUCCESS: \(Int(hr)) bpm")
            }) { error in
                self.logDiagnostic("⚠️ sendMessage FAILED: \(error.localizedDescription), switching to context-only", important: true)
                DispatchQueue.main.async {
                    self.isInAccumulationMode = true
                }
            }
        } else {
            let reason = !wcSession.isReachable ? "not reachable" : "accumulation mode"
            logDiagnostic("📋 Context-only mode (\(reason))")
        }
    }
    
    // 🔥 Context update после возобновления (после закрытия диалога)
    private func sendContextUpdate() {
        let wcSession = WCSession.default
        
        guard wcSession.activationState == .activated else {
            print("[WorkoutManager] Cannot send context update: not activated")
            return
        }
        
        let context: [String: Any] = [
            "type": "heartRate",
            "value": heartRate,
            "lastHeartRate": heartRate,
            "timestamp": Date().timeIntervalSince1970,
            "isWorkoutActive": isActive,
            "syncAfterResume": true
        ]
        
        do {
            try wcSession.updateApplicationContext(context)
            print("[WorkoutManager] ✅ Sent context update after resume: HR=\(Int(heartRate))")
        } catch {
            print("[WorkoutManager] ⚠️ Context update failed: \(error.localizedDescription)")
        }
    }
}

extension WorkoutManager: WKExtendedRuntimeSessionDelegate {
    func extendedRuntimeSessionDidStart(_ extendedRuntimeSession: WKExtendedRuntimeSession) {
        print("[WorkoutManager] ✅ Extended runtime session started successfully")
    }
    
    func extendedRuntimeSessionWillExpire(_ extendedRuntimeSession: WKExtendedRuntimeSession) {
        print("[WorkoutManager] ⚠️ Extended session will expire in ~30 sec...")
        
        DispatchQueue.main.async {
            if self.isActive {
                // 🔥 ИСПРАВЛЕНО: Нельзя вызывать start(at:) повторно на той же сессии
                // Нужно invalidate старую и создать новую
                print("[WorkoutManager] 🔄 Recreating extended session for another hour...")
                
                // 1. Invalidate старую сессию
                extendedRuntimeSession.invalidate()
                self.extendedSession = nil
                
                // 2. Создать и запустить новую сессию через 0.5 секунды
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                    if self.isActive {
                        self.startExtendedSession()
                        print("[WorkoutManager] ✅ New extended session started")
                    }
                }
            } else {
                // Если воркаут остановлен - завершаем extended session
                print("[WorkoutManager] ℹ️ Workout not active, letting session expire")
                self.stopExtendedSession()
            }
        }
    }
    
    func extendedRuntimeSession(_ extendedRuntimeSession: WKExtendedRuntimeSession,
                                didInvalidateWith reason: WKExtendedRuntimeSessionInvalidationReason,
                                error: Error?) {
        let reasonString: String
        switch reason {
        case .sessionInProgress:
            reasonString = "sessionInProgress (HKWorkoutSession active)"
            logDiagnostic("ℹ️ Extended session invalidated: \(reasonString)")
            return
        case .expired:
            reasonString = "expired"
        @unknown default:
            reasonString = "unknown(\(reason.rawValue))"
        }
        
        print("[WorkoutManager] ❌ Extended session invalidated: \(reasonString), error: \(error?.localizedDescription ?? "none")")
        
        // 🔥 Автоматически перезапускаем только если воркаут активен
        if isActive {
            print("[WorkoutManager] 🔄 Workout is active, restarting extended session for 1 hour...")
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                self.startExtendedSession()
            }
        } else {
            print("[WorkoutManager] ℹ️ Workout not active, not restarting extended session")
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
                        
                        // Отправляем на телефон через WatchConnectivity
                        // HKWorkoutSession автоматически сохраняет HR в HealthKit
                        self.sendHeartRateToPhone(roundedValue)
                        
                        print("[WorkoutManager] 💗 HR: \(Int(roundedValue)) bpm (WC reachable: \(WCSession.default.isReachable))")
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
        let now = Date()
        let timeSinceLast = lastReachabilityChange.map { now.timeIntervalSince($0) } ?? 0
        lastReachabilityChange = now
        
        let activated = session.activationState == .activated
        
        // 🔥 ИСПРАВЛЕНО: isPaired и isWatchAppInstalled недоступны на watchOS (только на iOS)
        logDiagnostic("📡 Reachability changed: \(reachable) (activated=\(activated), Δ\(String(format: "%.1f", timeSinceLast))s)", important: true)
        
        // Если связь восстановилась, отправляем накопленные данные
        if reachable {
            checkAndSendPendingData()
            
            // Также отправляем текущее значение HR если оно есть
            if heartRate > 0 {
                logDiagnostic("💗 Connection restored, sending current HR: \(Int(heartRate)) bpm")
                sendHeartRateToPhone(heartRate, immediate: true)
            }
        } else {
            logDiagnostic("⚠️ Connection lost, will use context-only mode", important: true)
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
            case "REQUEST_OPEN":
                print("[WorkoutManager] 📳 REQUEST_OPEN command received")
                
                // Вибрация для привлечения внимания (3 раза с интервалом)
                WKInterfaceDevice.current().play(.notification)
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                    WKInterfaceDevice.current().play(.notification)
                }
                DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                    WKInterfaceDevice.current().play(.notification)
                }
                
                // Если app активно → запускаем workout сразу
                let appState = WKApplication.shared().applicationState
                if appState == .active {
                    print("[WorkoutManager] 🏃 App active → starting workout immediately")
                    self.startWorkout()
                } else {
                    print("[WorkoutManager] ℹ️ App not active → vibration sent, waiting for user to open")
                    // Пользователь должен открыть app, тогда workout запустится через startWorkout()
                }
                
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
                    print("[WorkoutManager] 🏃 Starting workout (app is active, no vibration)")
                    // ✅ БЕЗ вибрации - пользователь уже смотрит на часы
                    self.startWorkout()
                } else {
                    // Приложение в фоне - нужно привлечь внимание
                    print("[WorkoutManager] 🔔 App in background, vibration + notification + starting workout")
                    
                    // ✅ Вибрация ТОЛЬКО в фоне (привлечь внимание)
                    WKInterfaceDevice.current().play(.notification)
                    
                    // 🔥 ИСПРАВЛЕНО: NotificationManager отсутствует в watchkitapp
                    // Убрано: NotificationManager.shared.showOpenAppNotification()
                    
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
            
            case "pauseRealtime":
                // 🔥 Переключаемся в accumulation mode ПЕРЕД появлением диалога
                print("[WorkoutManager] ⏸️ pauseRealtime - switching to accumulation mode")
                self.isInAccumulationMode = true
            
            case "resumeRealtime":
                // 🔥 Возвращаемся в нормальный режим ПОСЛЕ закрытия диалога
                print("[WorkoutManager] ▶️ resumeRealtime - back to normal mode")
                self.isInAccumulationMode = false
                
                // Отправляем текущий HR для синхронизации
                if self.isActive && self.heartRate > 0 {
                    self.sendHeartRateToPhone(self.heartRate, immediate: true)
                    self.sendContextUpdate()
                }
                
            default:
                print("[WorkoutManager] ❓ Unknown command: '\(cmd)'")
            }
        }
    }
}
