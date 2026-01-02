import Foundation
import Capacitor
import WatchConnectivity
import HealthKit

@objc(OndaWatchPlugin)
public class OndaWatchPlugin: CAPPlugin {

    private let implementation = OndaWatchManager.shared

    public override func load() {
        super.load()
        print("[ONDA Plugin] Loading OndaWatchPlugin")
        implementation.plugin = self
        // Session уже активирована в AppDelegate, но на всякий случай
        implementation.activateSession()
        // ❌ НЕ запускаем HealthKit observer автоматически!
        // Он будет запущен ПОСЛЕ получения разрешений через PermissionsService
        // implementation.startHealthKitObserver() ← УДАЛЕНО
    }

    @objc func getStatus(_ call: CAPPluginCall) {
        let status = implementation.status()
        print("[ONDA Plugin] getStatus: \(status)")
        call.resolve(status)
    }

    @objc func startRealtime(_ call: CAPPluginCall) {
        print("[ONDA Plugin] startRealtime called")
        implementation.sendCommand(type: "start")
        call.resolve()
    }

    @objc func stopRealtime(_ call: CAPPluginCall) {
        print("[ONDA Plugin] stopRealtime called")
        implementation.sendCommand(type: "stop")
        call.resolve()
    }
    
    @objc func sendHeartbeat(_ call: CAPPluginCall) {
        implementation.sendHeartbeat()
        call.resolve()
    }
    
    @objc func requestWatchAppOpen(_ call: CAPPluginCall) {
        print("[ONDA Plugin] requestWatchAppOpen called")
        implementation.requestWatchAppOpen()
        // После оповещения Watch → запускаем HealthKit observer для приёма HR
        implementation.startHealthKitObserver()
        call.resolve()
    }
    
    // 🔥 НОВЫЕ методы для управления accumulation mode
    @objc func pauseRealtime(_ call: CAPPluginCall) {
        print("[ONDA Plugin] pauseRealtime called")
        implementation.sendCommand(type: "pauseRealtime")
        call.resolve()
    }
    
    @objc func resumeRealtime(_ call: CAPPluginCall) {
        print("[ONDA Plugin] resumeRealtime called")
        implementation.sendCommand(type: "resumeRealtime")
        call.resolve()
    }
    
    @objc func getDebugLog(_ call: CAPPluginCall) {
        let log = implementation.debugLog
        let count = implementation.receivedCount
        call.resolve([
            "log": log,
            "receivedCount": count
        ])
    }
}

// MARK: - Менеджер WCSession (iOS ↔ watchOS)

class OndaWatchManager: NSObject, WCSessionDelegate {

    static let shared = OndaWatchManager()

    // НЕ weak - чтобы plugin не терялся пока приложение активно
    var plugin: OndaWatchPlugin?
    
    // Debug log для отображения в UI
    var debugLog: [String] = []
    var receivedCount: Int = 0
    
    // HealthKit для прямого чтения HR с часов
    private let healthStore = HKHealthStore()
    private var heartRateQuery: HKObserverQuery?
    private var anchoredQuery: HKAnchoredObjectQuery?
    private var isHealthKitObserverActive = false

    private var session: WCSession? {
        WCSession.isSupported() ? WCSession.default : nil
    }
    
    private func addDebugLog(_ message: String) {
        let timestamp = DateFormatter.localizedString(from: Date(), dateStyle: .none, timeStyle: .medium)
        let entry = "\(timestamp): \(message)"
        print("[ONDA Debug] \(entry)")
        debugLog.append(entry)
        // Keep only last 20 entries
        if debugLog.count > 20 {
            debugLog.removeFirst()
        }
        // Notify JS about debug update
        DispatchQueue.main.async {
            self.plugin?.notifyListeners("debugLog", data: [
                "log": self.debugLog,
                "receivedCount": self.receivedCount
            ])
        }
    }

    func activateSession() {
        guard let session = session else {
            addDebugLog("WCSession not supported")
            return
        }
        if session.delegate == nil {
            session.delegate = self
            session.activate()
            addDebugLog("WCSession activating...")
        } else {
            addDebugLog("WCSession has delegate")
        }
    }

    func status() -> [String: Any] {
        guard let session = session else {
            return ["supported": false]
        }

        return [
            "supported": WCSession.isSupported(),
            "paired": session.isPaired,
            "watchAppInstalled": session.isWatchAppInstalled,
            "reachable": session.isReachable
        ]
    }

    func sendCommand(type: String) {
        guard let session = session else {
            print("[ONDA Manager] No session for command")
            return
        }
        
        print("[ONDA Manager] Sending command '\(type)', reachable: \(session.isReachable)")
        
        let message: [String: Any] = ["type": type, "ts": Date().timeIntervalSince1970]

        if session.isReachable {
            // Прямая отправка когда часы активны
            session.sendMessage(message, replyHandler: { reply in
                print("[ONDA Manager] Command sent OK")
            }) { error in
                print("[ONDA Manager] sendCommand error: \(error.localizedDescription)")
            }
        } else {
            // Когда часы не активны - используем оба метода для надёжности
            
            // 1. transferUserInfo - разбудит приложение на часах в фоне
            session.transferUserInfo(message)
            print("[ONDA Manager] Command transferred via userInfo")
            
            // 2. updateApplicationContext - данные будут доступны сразу при пробуждении
            do {
                try session.updateApplicationContext(["command": type, "ts": Date().timeIntervalSince1970])
                print("[ONDA Manager] Application context updated")
            } catch {
                print("[ONDA Manager] updateApplicationContext error: \(error.localizedDescription)")
            }
        }
    }
    
    func sendHeartbeat() {
        guard let session = session else {
            return
        }
        
        let message: [String: Any] = [
            "type": "heartbeat",
            "ts": Date().timeIntervalSince1970
        ]
        
        if session.isReachable {
            session.sendMessage(message, replyHandler: nil) { error in
                print("[ONDA Manager] heartbeat error: \(error.localizedDescription)")
            }
        } else {
            // Send via transferUserInfo when not immediately reachable
            // This queues the message and delivers when watch becomes reachable
            session.transferUserInfo(message)
        }
    }
    
    /// Оповещает Watch что нужно открыться и начать мониторинг HR
    func requestWatchAppOpen() {
        guard let session = session else {
            addDebugLog("❌ No session for requestWatchAppOpen")
            return
        }
        
        addDebugLog("📳 Requesting Watch app to open...")
        
        let message: [String: Any] = [
            "type": "REQUEST_OPEN",
            "reason": "permissions_granted",
            "ts": Date().timeIntervalSince1970
        ]
        
        // Отправляем вибрацию на часы через WCSession
        // Часы должны обработать это и показать вибрацию + начать workout
        if session.isReachable {
            // Watch app активно → прямая отправка
            session.sendMessage(message, replyHandler: { reply in
                self.addDebugLog("✅ Watch ответили: \(reply)")
            }) { error in
                self.addDebugLog("❌ requestWatchAppOpen error: \(error.localizedDescription)")
            }
        } else {
            // Watch app неактивно → transferUserInfo (разбудит в фоне)
            session.transferUserInfo(message)
            addDebugLog("📦 Sent via transferUserInfo (watch not reachable)")
        }
    }

    // MARK: - WCSessionDelegate

    func session(_ session: WCSession,
                 activationDidCompleteWith activationState: WCSessionActivationState,
                 error: Error?) {
        if let error = error {
            addDebugLog("Activation error: \(error.localizedDescription)")
        } else {
            addDebugLog("Activated: p=\(session.isPaired) w=\(session.isWatchAppInstalled) r=\(session.isReachable)")
        }
    }

    func sessionDidBecomeInactive(_ session: WCSession) {
        print("[ONDA Manager] Session became inactive")
    }

    func sessionDidDeactivate(_ session: WCSession) {
        print("[ONDA Manager] Session deactivated, reactivating...")
        session.activate()
    }

    func sessionReachabilityDidChange(_ session: WCSession) {
        let reachable = session.isReachable
        addDebugLog("📡 Reachable: \(reachable)")
        
        // Уведомляем JavaScript о изменении состояния
        DispatchQueue.main.async {
            if let p = self.plugin {
                p.notifyListeners("reachabilityChanged", data: [
                    "reachable": reachable,
                    "paired": session.isPaired,
                    "watchAppInstalled": session.isWatchAppInstalled
                ])
            }
        }
    }

    // Получаем данные с часов через sendMessage (реалтайм)
    func session(_ session: WCSession,
                 didReceiveMessage message: [String : Any]) {
        addDebugLog("📨 Msg: \(message.keys.joined(separator: ","))")
        handleReceivedData(message)
    }
    
    // Получаем данные с часов через sendMessage с reply (реалтайм)
    func session(_ session: WCSession,
                 didReceiveMessage message: [String : Any],
                 replyHandler: @escaping ([String : Any]) -> Void) {
        addDebugLog("📨 MsgReply: \(message.keys.joined(separator: ","))")
        handleReceivedData(message)
        replyHandler(["received": true, "timestamp": Date().timeIntervalSince1970])
    }
    
    // Получаем данные с часов через transferUserInfo (фоновая доставка)
    func session(_ session: WCSession,
                 didReceiveUserInfo userInfo: [String : Any] = [:]) {
        addDebugLog("📦 UserInfo: \(userInfo.keys.joined(separator: ","))")
        handleReceivedData(userInfo)
    }
    
    // Получаем обновления applicationContext от часов
    func session(_ session: WCSession,
                 didReceiveApplicationContext applicationContext: [String : Any]) {
        addDebugLog("📋 Context: \(applicationContext.keys.joined(separator: ","))")
        
        // Извлекаем последний HR из контекста
        if let latestHR = applicationContext["lastHeartRate"] as? Double {
            let data: [String: Any] = [
                "type": "heartRate",
                "value": latestHR,
                "timestamp": applicationContext["timestamp"] ?? Date().timeIntervalSince1970
            ]
            handleReceivedData(data)
        }
        
        // 🔥 Обработка диагностики запуска Watch App
        if let startup = applicationContext["watchStartup"] as? [String: Any] {
            var data = startup
            data["type"] = "watchStartup"
            handleReceivedData(data)
        }
        
        // 🔥 Обработка диагностических логов
        if let diagnostic = applicationContext["lastDiagnostic"] as? [String: Any] {
            var data = diagnostic
            if data["type"] == nil {
                data["type"] = "watchDiagnostic"
            }
            handleReceivedData(data)
        }
        
        // 🔥 Прямой лог при старте Watch App
        if let watchAppStarted = applicationContext["watchAppStarted"] as? Bool, watchAppStarted {
            let bundleId = applicationContext["bundleId"] as? String ?? "unknown"
            let target = applicationContext["target"] as? String ?? "unknown"
            addDebugLog("🚀🚀🚀 [Watch App STARTED] bundle=\(bundleId), target=\(target)")
        }
    }
    
    // Общий обработчик данных с часов
    private func handleReceivedData(_ data: [String: Any]) {
        guard let type = data["type"] as? String else {
            addDebugLog("⚠️ No type in data")
            return
        }

        switch type {
        case "heartRate":
            if let value = data["value"] as? Double {
                receivedCount += 1
                
                let timestamp = data["timestamp"] as? TimeInterval ?? Date().timeIntervalSince1970
                let timeAgo = Date().timeIntervalSince1970 - timestamp
                
                addDebugLog("💗 HR#\(receivedCount): \(Int(value)) bpm (\(String(format: "%.1f", timeAgo))s ago)")
                
                DispatchQueue.main.async {
                    if let p = self.plugin {
                        let eventData: [String: Any] = [
                            "value": value,
                            "source": "watch",
                            "timestamp": ISO8601DateFormatter().string(from: Date(timeIntervalSince1970: timestamp))
                        ]
                        p.notifyListeners("heartRate", data: eventData)
                    } else {
                        self.addDebugLog("❌ ERROR: plugin nil!")
                    }
                }
            }

        case "status":
            if let value = data["value"] as? String {
                addDebugLog("ℹ️ Status: \(value)")
                DispatchQueue.main.async {
                    if let p = self.plugin {
                        p.notifyListeners("status", data: ["value": value])
                    }
                }
            }
        
        // 🔥 НОВОЕ: Обработка диагностических логов с Watch
        case "watchDiagnostic":
            if let message = data["message"] as? String {
                let timestamp = data["timestamp"] as? String ?? "unknown"
                let hr = data["heartRate"] as? Double ?? 0
                let isActive = data["isActive"] as? Bool ?? false
                let isAuthorized = data["isAuthorized"] as? Bool ?? false
                
                addDebugLog("🔧 [Watch] \(message) | HR=\(Int(hr)), active=\(isActive), auth=\(isAuthorized)")
                
                // Отправляем в JavaScript для DebugMonitor
                DispatchQueue.main.async {
                    if let p = self.plugin {
                        p.notifyListeners("watchDiagnostic", data: [
                            "message": message,
                            "timestamp": timestamp,
                            "heartRate": hr,
                            "isActive": isActive,
                            "isAuthorized": isAuthorized
                        ])
                    }
                }
            }
        
        // 🔥 Обработка логов запуска Watch App
        case "watchStartup":
            let stage = data["stage"] as? String ?? "unknown"
            let bundleId = data["bundleId"] as? String ?? "unknown"
            let wcState = data["wcState"] as? Int ?? -1
            let isReachable = data["isReachable"] as? Bool ?? false
            let timestamp = data["timestamp"] as? String ?? "unknown"
            
            addDebugLog("🚀 [Watch STARTUP] stage=\(stage), bundle=\(bundleId), wcState=\(wcState), reachable=\(isReachable)")
            
            // Отправляем в JavaScript для DebugMonitor
            DispatchQueue.main.async {
                if let p = self.plugin {
                    p.notifyListeners("watchStartup", data: [
                        "stage": stage,
                        "bundleId": bundleId,
                        "wcState": wcState,
                        "isReachable": isReachable,
                        "timestamp": timestamp
                    ])
                }
            }

        default:
            addDebugLog("❓ Unknown type: \(type)")
        }
    }
    
    // MARK: - HealthKit Direct Observer
    
    /// Запускает наблюдение за HR в HealthKit (прямое чтение с Apple Watch)
    func startHealthKitObserver() {
        guard HKHealthStore.isHealthDataAvailable() else {
            addDebugLog("⚠️ HealthKit not available")
            return
        }
        
        guard let hrType = HKQuantityType.quantityType(forIdentifier: .heartRate) else {
            addDebugLog("⚠️ HR type not available")
            return
        }
        
        // Проверяем/запрашиваем разрешение
        let status = healthStore.authorizationStatus(for: hrType)
        if status == .notDetermined {
            addDebugLog("📋 Requesting HealthKit authorization...")
            healthStore.requestAuthorization(toShare: [], read: [hrType]) { [weak self] success, error in
                if success {
                    self?.addDebugLog("✅ HealthKit authorized")
                    self?.setupHealthKitObserver()
                } else {
                    self?.addDebugLog("❌ HealthKit denied: \(error?.localizedDescription ?? "unknown")")
                }
            }
        } else if status == .sharingAuthorized {
            addDebugLog("✅ HealthKit already authorized")
            setupHealthKitObserver()
        } else {
            addDebugLog("⚠️ HealthKit status: \(status.rawValue)")
        }
    }
    
    private func setupHealthKitObserver() {
        guard !isHealthKitObserverActive else {
            addDebugLog("ℹ️ HealthKit observer already active")
            return
        }
        
        guard let hrType = HKQuantityType.quantityType(forIdentifier: .heartRate) else { return }
        
        // HKObserverQuery - уведомляет о новых данных в HealthKit
        heartRateQuery = HKObserverQuery(sampleType: hrType, predicate: nil) { [weak self] query, completionHandler, error in
            guard let self = self else {
                completionHandler()
                return
            }
            
            if let error = error {
                self.addDebugLog("❌ Observer error: \(error.localizedDescription)")
                completionHandler()
                return
            }
            
            self.addDebugLog("🔔 HealthKit HR updated, fetching...")
            self.fetchLatestHeartRate()
            completionHandler()
        }
        
        if let query = heartRateQuery {
            healthStore.execute(query)
            isHealthKitObserverActive = true
            addDebugLog("👂 HealthKit observer started")
        }
    }
    
    /// Получает последний HR из HealthKit
    private func fetchLatestHeartRate() {
        guard let hrType = HKQuantityType.quantityType(forIdentifier: .heartRate) else { return }
        
        // Получаем только данные за последние 10 секунд
        let now = Date()
        let tenSecondsAgo = now.addingTimeInterval(-10)
        let predicate = HKQuery.predicateForSamples(withStart: tenSecondsAgo, end: now, options: .strictStartDate)
        
        // Сортируем по времени (последний сверху)
        let sortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierEndDate, ascending: false)
        
        let query = HKSampleQuery(
            sampleType: hrType,
            predicate: predicate,
            limit: 1, // Только самый последний
            sortDescriptors: [sortDescriptor]
        ) { [weak self] query, samples, error in
            guard let self = self else { return }
            
            if let error = error {
                self.addDebugLog("❌ Fetch error: \(error.localizedDescription)")
                return
            }
            
            guard let sample = samples?.first as? HKQuantitySample else {
                self.addDebugLog("⚠️ No recent HR samples")
                return
            }
            
            let hrUnit = HKUnit.count().unitDivided(by: .minute())
            let hrValue = sample.quantity.doubleValue(for: hrUnit)
            let timeAgo = now.timeIntervalSince(sample.endDate)
            
            // Проверяем что данные свежие (< 5 секунд)
            if timeAgo < 5 {
                self.receivedCount += 1
                self.addDebugLog("💗 HR#\(self.receivedCount) from HealthKit: \(Int(hrValue)) bpm (\(String(format: "%.1f", timeAgo))s ago)")
                
                // Отправляем в JavaScript
                DispatchQueue.main.async {
                    if let p = self.plugin {
                        let eventData: [String: Any] = [
                            "value": hrValue,
                            "source": "healthkit",
                            "timestamp": ISO8601DateFormatter().string(from: sample.endDate)
                        ]
                        p.notifyListeners("heartRate", data: eventData)
                    }
                }
            } else {
                self.addDebugLog("⚠️ HR too old (\(String(format: "%.1f", timeAgo))s)")
            }
        }
        
        healthStore.execute(query)
    }
    
    deinit {
        // Останавливаем observer при удалении
        if let query = heartRateQuery {
            healthStore.stop(query)
        }
    }
}
