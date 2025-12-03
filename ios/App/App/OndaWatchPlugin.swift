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

    @objc func getStatus(_ call: CAPPluginCall) {
        let status = implementation.status()
        call.resolve(status)
    }

    @objc func startRealtime(_ call: CAPPluginCall) {
        implementation.sendCommand(type: "start")
        call.resolve()
    }

    @objc func stopRealtime(_ call: CAPPluginCall) {
        implementation.sendCommand(type: "stop")
        call.resolve()
    }
}

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
        guard let session = session, session.isReachable else { return }
        session.sendMessage(["type": type], replyHandler: nil, errorHandler: nil)
    }

    func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {}
    func sessionDidBecomeInactive(_ session: WCSession) {}
    func sessionDidDeactivate(_ session: WCSession) { session.activate() }
    func sessionReachabilityDidChange(_ session: WCSession) {}

    func session(_ session: WCSession, didReceiveMessage message: [String : Any]) {
        guard let plugin = plugin, let type = message["type"] as? String else { return }
        if type == "heartRate", let value = message["value"] as? Double {
            plugin.notifyListeners("heartRate", data: ["value": value])
        }
    }
}
