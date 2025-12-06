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
}

// MARK: - Менеджер WCSession (iOS ↔ watchOS)

class OndaWatchManager: NSObject, WCSessionDelegate {

    static let shared = OndaWatchManager()

    // НЕ weak - чтобы plugin не терялся пока приложение активно
    var plugin: OndaWatchPlugin?

    private var session: WCSession? {
        WCSession.isSupported() ? WCSession.default : nil
    }

    func activateSession() {
        guard let session = session else {
            print("[ONDA Manager] WCSession not supported")
            return
        }
        if session.delegate == nil {
            session.delegate = self
            session.activate()
            print("[ONDA Manager] WCSession activating...")
        } else {
            print("[ONDA Manager] WCSession already has delegate")
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
        
        let message: [String: Any] = ["type": type]

        if session.isReachable {
            session.sendMessage(message, replyHandler: { reply in
                print("[ONDA Manager] Command sent OK")
            }) { error in
                print("[ONDA Manager] sendCommand error: \(error.localizedDescription)")
            }
        } else {
            // Fallback to transferUserInfo
            session.transferUserInfo(message)
            print("[ONDA Manager] Command transferred via userInfo")
        }
    }

    // MARK: - WCSessionDelegate

    func session(_ session: WCSession,
                 activationDidCompleteWith activationState: WCSessionActivationState,
                 error: Error?) {
        if let error = error {
            print("[ONDA Manager] WCSession activation error: \(error)")
        } else {
            print("[ONDA Manager] WCSession activated: \(activationState.rawValue), paired: \(session.isPaired), watchAppInstalled: \(session.isWatchAppInstalled), reachable: \(session.isReachable)")
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
        print("[ONDA Manager] Reachability changed: \(session.isReachable)")
    }

    // Получаем данные с часов через sendMessage
    func session(_ session: WCSession,
                 didReceiveMessage message: [String : Any]) {
        print("[ONDA Manager] Received message: \(message)")
        handleReceivedData(message)
    }
    
    // Получаем данные с часов через sendMessage с reply
    func session(_ session: WCSession,
                 didReceiveMessage message: [String : Any],
                 replyHandler: @escaping ([String : Any]) -> Void) {
        print("[ONDA Manager] Received message with reply: \(message)")
        handleReceivedData(message)
        replyHandler(["received": true])
    }
    
    // Получаем данные с часов через transferUserInfo
    func session(_ session: WCSession,
                 didReceiveUserInfo userInfo: [String : Any] = [:]) {
        print("[ONDA Manager] Received userInfo: \(userInfo)")
        handleReceivedData(userInfo)
    }
    
    // Общий обработчик данных с часов
    private func handleReceivedData(_ data: [String: Any]) {
        guard let type = data["type"] as? String else {
            print("[ONDA Manager] No type in data: \(data)")
            return
        }

        print("[ONDA Manager] Handling type: \(type)")

        switch type {
        case "heartRate":
            if let value = data["value"] as? Double {
                print("[ONDA Manager] Heart rate: \(value), plugin exists: \(plugin != nil)")
                DispatchQueue.main.async {
                    if let p = self.plugin {
                        print("[ONDA Manager] Notifying JS: heartRate = \(value)")
                        p.notifyListeners("heartRate", data: ["value": value])
                    } else {
                        print("[ONDA Manager] ERROR: plugin is nil, cannot notify JS!")
                    }
                }
            }

        case "status":
            if let value = data["value"] as? String {
                print("[ONDA Manager] Status: \(value), plugin exists: \(plugin != nil)")
                DispatchQueue.main.async {
                    if let p = self.plugin {
                        print("[ONDA Manager] Notifying JS: status = \(value)")
                        p.notifyListeners("status", data: ["value": value])
                    } else {
                        print("[ONDA Manager] ERROR: plugin is nil for status!")
                    }
                }
            }

        default:
            print("[ONDA Manager] Unknown type: \(type)")
        }
    }
}
