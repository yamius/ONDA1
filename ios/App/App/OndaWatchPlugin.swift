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
}

// MARK: - Менеджер WCSession (iOS ↔ watchOS)

class OndaWatchManager: NSObject, WCSessionDelegate {

    static let shared = OndaWatchManager()

    // НЕ weak - чтобы plugin не терялся пока приложение активно
    var plugin: OndaWatchPlugin?
    
    // Debug log для отображения в UI
    var debugLog: [String] = []
    var receivedCount: Int = 0

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
        if let latestHR = applicationContext["latestHeartRate"] as? Double {
            let data: [String: Any] = [
                "type": "heartRate",
                "value": latestHR,
                "timestamp": applicationContext["timestamp"] ?? Date().timeIntervalSince1970
            ]
            handleReceivedData(data)
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

        default:
            addDebugLog("❓ Unknown type: \(type)")
        }
    }
}
