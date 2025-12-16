import Foundation
import Capacitor
import WatchConnectivity

@objc(OndaWatchPlugin)
public class OndaWatchPlugin: CAPPlugin {

    private let implementation = OndaWatchManager.shared

    public override func load() {
        super.load()
        print("[ONDA Plugin] Loading OndaWatchPlugin")
        implementation.plugin = self
        // Session уже активирована в AppDelegate, но на всякий случай
        implementation.activateSession()
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
    
    @objc func notifyPermissionStart(_ call: CAPPluginCall) {
        print("[ONDA Plugin] notifyPermissionStart called")
        implementation.sendCommand(type: "permission_start")
        call.resolve()
    }
    
    @objc func notifyPermissionEnd(_ call: CAPPluginCall) {
        print("[ONDA Plugin] notifyPermissionEnd called")
        implementation.sendCommand(type: "permission_end")
        call.resolve()
    }
}

// MARK: - Менеджер WCSession (iOS ↔ watchOS)

// MARK: - Debug Log Entry for Phone
struct PhoneDebugLogEntry {
    let timestamp: Date
    let device: String // "phone" or "watch"
    let event: String
    let details: String
    let correlationId: String?
    
    var formatted: String {
        let tf = DateFormatter()
        tf.dateFormat = "HH:mm:ss.SSS"
        let ts = tf.string(from: timestamp)
        let dev = device == "watch" ? "[W]" : "[P]"
        let corr = correlationId != nil && !correlationId!.isEmpty ? "[\(correlationId!.prefix(6))]" : ""
        return "\(ts)\(dev)\(corr) \(event): \(details)"
    }
    
    var asDict: [String: Any] {
        return [
            "timestamp": timestamp.timeIntervalSince1970,
            "device": device,
            "event": event,
            "details": details,
            "correlationId": correlationId ?? ""
        ]
    }
}

class OndaWatchManager: NSObject, WCSessionDelegate {

    static let shared = OndaWatchManager()

    // НЕ weak - чтобы plugin не терялся пока приложение активно
    var plugin: OndaWatchPlugin?
    
    // Debug log для отображения в UI - теперь структурированный
    var debugLogs: [PhoneDebugLogEntry] = []
    var receivedCount: Int = 0
    private let maxLogs = 100
    
    // Текущий correlation ID
    var currentCorrelationId: String?

    private var session: WCSession? {
        WCSession.isSupported() ? WCSession.default : nil
    }
    
    private func log(_ event: String, _ details: String = "", device: String = "phone") {
        let entry = PhoneDebugLogEntry(
            timestamp: Date(),
            device: device,
            event: event,
            details: details,
            correlationId: currentCorrelationId
        )
        
        debugLogs.append(entry)
        if debugLogs.count > maxLogs {
            debugLogs.removeFirst()
        }
        
        print("[ONDA] \(entry.formatted)")
        
        // Notify JS about debug update
        DispatchQueue.main.async {
            self.plugin?.notifyListeners("debugLog", data: [
                "log": self.debugLogs.map { $0.asDict },
                "receivedCount": self.receivedCount,
                "latestEvent": event,
                "latestDetails": details
            ])
        }
    }
    
    // Legacy method for compatibility
    private func addDebugLog(_ message: String) {
        log("INFO", message)
    }

    func activateSession() {
        guard let session = session else {
            log("WC_INIT", "WCSession not supported")
            return
        }
        if session.delegate == nil {
            session.delegate = self
            session.activate()
            log("WC_INIT", "WCSession activating...")
        } else {
            log("WC_INIT", "WCSession already has delegate")
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
            log("CMD_SEND", "No session for command '\(type)'")
            return
        }
        
        // Генерируем correlation ID для start
        if type == "start" {
            currentCorrelationId = UUID().uuidString
        }
        
        log("CMD_SEND", "'\(type)' reachable:\(session.isReachable)")
        
        let message: [String: Any] = [
            "type": type,
            "ts": Date().timeIntervalSince1970,
            "correlationId": currentCorrelationId ?? ""
        ]
        
        // Критические команды - отправляем через ВСЕ каналы для надёжности
        let isCritical = ["start", "stop", "permission_start", "permission_end"].contains(type)
        
        if isCritical {
            // 1. transferUserInfo - надёжная доставка, работает даже когда app inactive
            session.transferUserInfo(message)
            log("CMD_SEND", "'\(type)' via transferUserInfo")
            
            // 2. applicationContext - данные доступны сразу при пробуждении
            do {
                try session.updateApplicationContext(["command": type, "ts": Date().timeIntervalSince1970])
                log("CMD_SEND", "'\(type)' via applicationContext")
            } catch {
                log("CMD_ERROR", "applicationContext failed: \(error.localizedDescription)")
            }
            
            // 3. sendMessage как "ускоритель" - быстрая доставка если reachable
            if session.isReachable {
                session.sendMessage(message, replyHandler: nil) { error in
                    self.log("CMD_ERROR", "sendMessage failed: \(error.localizedDescription)")
                }
                log("CMD_SEND", "'\(type)' via sendMessage (accelerator)")
            }
        } else {
            // Некритические команды (heartbeat и т.д.) - обычная логика
            if session.isReachable {
                session.sendMessage(message, replyHandler: nil) { error in
                    self.log("CMD_ERROR", "sendMessage failed: \(error.localizedDescription)")
                }
            } else {
                session.transferUserInfo(message)
            }
        }
        
        // Очищаем correlation ID после stop
        if type == "stop" {
            currentCorrelationId = nil
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

    // MARK: - WCSessionDelegate

    func session(_ session: WCSession,
                 activationDidCompleteWith activationState: WCSessionActivationState,
                 error: Error?) {
        let stateNames = ["notActivated", "inactive", "activated"]
        let stateName = activationState.rawValue < stateNames.count ? stateNames[Int(activationState.rawValue)] : "\(activationState.rawValue)"
        
        if let error = error {
            log("WC_ACTIVATE", "Error: \(error.localizedDescription)")
        } else {
            log("WC_ACTIVATE", "State:\(stateName) p:\(session.isPaired) w:\(session.isWatchAppInstalled) r:\(session.isReachable)")
        }
    }

    func sessionDidBecomeInactive(_ session: WCSession) {
        log("WC_LIFECYCLE", "Session became INACTIVE")
    }

    func sessionDidDeactivate(_ session: WCSession) {
        log("WC_LIFECYCLE", "Session DEACTIVATED - reactivating...")
        session.activate()
    }

    func sessionReachabilityDidChange(_ session: WCSession) {
        log("WC_REACH", "Changed to: \(session.isReachable)")
    }

    // Получаем данные с часов через sendMessage
    func session(_ session: WCSession,
                 didReceiveMessage message: [String : Any]) {
        let msgType = message["type"] as? String ?? "?"
        log("WC_RECV", "sendMessage: \(msgType)")
        handleReceivedData(message)
    }
    
    // Получаем данные с часов через sendMessage с reply
    func session(_ session: WCSession,
                 didReceiveMessage message: [String : Any],
                 replyHandler: @escaping ([String : Any]) -> Void) {
        let msgType = message["type"] as? String ?? "?"
        log("WC_RECV", "sendMessage(reply): \(msgType)")
        handleReceivedData(message)
        replyHandler(["received": true])
    }
    
    // Получаем данные с часов через transferUserInfo
    func session(_ session: WCSession,
                 didReceiveUserInfo userInfo: [String : Any] = [:]) {
        let msgType = userInfo["type"] as? String ?? "?"
        log("WC_RECV", "transferUserInfo: \(msgType)")
        handleReceivedData(userInfo)
    }
    
    // Общий обработчик данных с часов
    private func handleReceivedData(_ data: [String: Any]) {
        guard let type = data["type"] as? String else {
            log("WC_RECV", "No type in data")
            return
        }

        switch type {
        case "heartRate":
            if let value = data["value"] as? Double {
                receivedCount += 1
                // Логируем только каждый 10-й HR чтобы не спамить
                if receivedCount == 1 || receivedCount % 10 == 0 {
                    log("HR_RECV", "#\(receivedCount): \(Int(value)) bpm")
                }
                DispatchQueue.main.async {
                    if let p = self.plugin {
                        p.notifyListeners("heartRate", data: ["value": value])
                    } else {
                        self.log("HR_ERROR", "plugin is nil!")
                    }
                }
            }

        case "status":
            if let value = data["value"] as? String {
                log("STATUS", value)
                DispatchQueue.main.async {
                    if let p = self.plugin {
                        p.notifyListeners("status", data: ["value": value])
                    }
                }
            }
            
        case "debugLog":
            // Логи с часов - добавляем в наш список
            if let event = data["event"] as? String,
               let details = data["details"] as? String {
                log(event, details, device: "watch")
            }

        default:
            log("WC_RECV", "Unknown type: \(type)")
        }
    }
}
