import Foundation
import Capacitor
import WatchConnectivity

@objc(OndaWatchPlugin)
public class OndaWatchPlugin: CAPPlugin {

    public override func load() {
        super.load()
        // Connect plugin to shared manager
        OndaWatchManager.shared.plugin = self
        print("[ONDA] OndaWatchPlugin loaded and connected to manager")
    }

    // Получить статус связи с Apple Watch
    @objc func getStatus(_ call: CAPPluginCall) {
        let status = OndaWatchManager.shared.status()
        call.resolve(status)
    }

    // Команда: стартовать realtime-сессию (команда на часы)
    @objc func startRealtime(_ call: CAPPluginCall) {
        OndaWatchManager.shared.sendCommand(type: "start")
        call.resolve()
    }

    // Команда: остановить realtime-сессию
    @objc func stopRealtime(_ call: CAPPluginCall) {
        OndaWatchManager.shared.sendCommand(type: "stop")
        call.resolve()
    }
}

// MARK: - Менеджер WCSession (iOS ↔ watchOS)

class OndaWatchManager: NSObject, WCSessionDelegate {

    static let shared = OndaWatchManager()

    weak var plugin: OndaWatchPlugin?
    
    private var pendingHeartRates: [Double] = []
    private var pendingStatuses: [String] = []

    private var session: WCSession? {
        WCSession.isSupported() ? WCSession.default : nil
    }

    func activateSession() {
        guard let session = session else { 
            print("[ONDA] WCSession not supported")
            return 
        }
        session.delegate = self
        session.activate()
        print("[ONDA] WCSession activating...")
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
            print("[ONDA] No WCSession for command")
            return
        }
        
        guard session.isReachable else {
            print("[ONDA] Watch not reachable for command: \(type)")
            return
        }

        let message: [String: Any] = ["type": type]

        session.sendMessage(message, replyHandler: nil) { error in
            print("[ONDA] sendCommand error: \(error.localizedDescription)")
        }
        print("[ONDA] Command sent to watch: \(type)")
    }
    
    private func deliverPendingData() {
        guard let plugin = plugin else { return }
        
        // Deliver pending heart rates
        for hr in pendingHeartRates {
            plugin.notifyListeners("heartRate", data: ["value": hr])
        }
        pendingHeartRates.removeAll()
        
        // Deliver pending statuses
        for status in pendingStatuses {
            plugin.notifyListeners("status", data: ["value": status])
        }
        pendingStatuses.removeAll()
    }

    // MARK: - WCSessionDelegate

    func session(_ session: WCSession,
                 activationDidCompleteWith activationState: WCSessionActivationState,
                 error: Error?) {
        if let error = error {
            print("[ONDA] WCSession activation error: \(error)")
        } else {
            print("[ONDA] WCSession activated: \(activationState.rawValue), reachable: \(session.isReachable)")
        }
    }

    func sessionDidBecomeInactive(_ session: WCSession) {
        print("[ONDA] WCSession became inactive")
    }

    func sessionDidDeactivate(_ session: WCSession) {
        print("[ONDA] WCSession deactivated, reactivating...")
        session.activate()
    }

    func sessionReachabilityDidChange(_ session: WCSession) {
        print("[ONDA] WCSession reachable: \(session.isReachable)")
    }

    // Получаем данные с часов через sendMessage
    func session(_ session: WCSession,
                 didReceiveMessage message: [String : Any]) {
        print("[ONDA] Received message: \(message)")
        handleReceivedData(message)
    }
    
    // Получаем данные с часов через sendMessage with reply
    func session(_ session: WCSession,
                 didReceiveMessage message: [String : Any],
                 replyHandler: @escaping ([String : Any]) -> Void) {
        print("[ONDA] Received message with reply: \(message)")
        handleReceivedData(message)
        replyHandler(["received": true])
    }
    
    // Получаем данные с часов через transferUserInfo (background)
    func session(_ session: WCSession,
                 didReceiveUserInfo userInfo: [String : Any] = [:]) {
        print("[ONDA] Received userInfo: \(userInfo)")
        handleReceivedData(userInfo)
    }
    
    // Общий обработчик данных с часов
    private func handleReceivedData(_ data: [String: Any]) {
        guard let type = data["type"] as? String else { 
            print("[ONDA] No type in received data")
            return 
        }

        switch type {
        case "heartRate":
            if let value = data["value"] as? Double {
                print("[ONDA] Heart rate received: \(Int(value)) BPM")
                DispatchQueue.main.async {
                    if let plugin = self.plugin {
                        plugin.notifyListeners("heartRate", data: ["value": value])
                    } else {
                        // Store for later delivery when plugin connects
                        self.pendingHeartRates.append(value)
                        print("[ONDA] Plugin not ready, queued HR: \(Int(value))")
                    }
                }
            }

        case "status":
            if let value = data["value"] as? String {
                print("[ONDA] Status received: \(value)")
                DispatchQueue.main.async {
                    if let plugin = self.plugin {
                        plugin.notifyListeners("status", data: ["value": value])
                    } else {
                        self.pendingStatuses.append(value)
                        print("[ONDA] Plugin not ready, queued status: \(value)")
                    }
                }
            }

        default:
            print("[ONDA] Unknown message type: \(type)")
        }
    }
}
