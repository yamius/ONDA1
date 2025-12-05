import Foundation
import Capacitor
import WatchConnectivity

@objc(OndaWatchPlugin)
public class OndaWatchPlugin: CAPPlugin {

    private let implementation = OndaWatchManager.shared

    public override func load() {
        super.load()
        implementation.plugin = self
        implementation.activateSession()
    }

    // Получить статус связи с Apple Watch
    @objc func getStatus(_ call: CAPPluginCall) {
        let status = implementation.status()
        call.resolve(status)
    }

    // Команда: стартовать realtime-сессию (команда на часы)
    @objc func startRealtime(_ call: CAPPluginCall) {
        implementation.sendCommand(type: "start")
        call.resolve()
    }

    // Команда: остановить realtime-сессию
    @objc func stopRealtime(_ call: CAPPluginCall) {
        implementation.sendCommand(type: "stop")
        call.resolve()
    }
}

// MARK: - Менеджер WCSession (iOS ↔ watchOS)

class OndaWatchManager: NSObject, WCSessionDelegate {

    static let shared = OndaWatchManager()

    weak var plugin: OndaWatchPlugin?

    private var session: WCSession? {
        WCSession.isSupported() ? WCSession.default : nil
    }

    func activateSession() {
        guard let session = session else { return }
        session.delegate = self
        session.activate()
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
        guard let session = session, session.isReachable else {
            print("Watch not reachable")
            return
        }

        let message: [String: Any] = ["type": type]

        session.sendMessage(message, replyHandler: nil) { error in
            print("sendCommand error: \(error.localizedDescription)")
        }
    }

    // MARK: - WCSessionDelegate

    func session(_ session: WCSession,
                 activationDidCompleteWith activationState: WCSessionActivationState,
                 error: Error?) {
        if let error = error {
            print("WCSession activation error: \(error)")
        } else {
            print("WCSession activated: \(activationState.rawValue)")
        }
    }

    func sessionDidBecomeInactive(_ session: WCSession) {}

    func sessionDidDeactivate(_ session: WCSession) {
        session.activate()
    }

    func sessionReachabilityDidChange(_ session: WCSession) {
        print("iOS WCSession reachable: \(session.isReachable)")
    }

    // Получаем данные с часов (пульс и статус) через sendMessage
    func session(_ session: WCSession,
                 didReceiveMessage message: [String : Any]) {
        handleReceivedData(message)
    }
    
    // Получаем данные с часов через transferUserInfo (background/offline)
    func session(_ session: WCSession,
                 didReceiveUserInfo userInfo: [String : Any] = [:]) {
        handleReceivedData(userInfo)
    }
    
    // Общий обработчик данных с часов
    private func handleReceivedData(_ data: [String: Any]) {
        guard let plugin = plugin else { return }
        guard let type = data["type"] as? String else { return }

        switch type {
        case "heartRate":
            if let value = data["value"] as? Double {
                DispatchQueue.main.async {
                    plugin.notifyListeners("heartRate", data: ["value": value])
                }
            }

        case "status":
            if let value = data["value"] as? String {
                DispatchQueue.main.async {
                    plugin.notifyListeners("status", data: ["value": value])
                }
            }

        default:
            break
        }
    }
}
