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
        implementation.activateSession()
    }

    @objc func getStatus(_ call: CAPPluginCall) {
        let status = implementation.status()
        print("[ONDA Plugin] getStatus: \(status)")
        call.resolve(status)
    }

    @objc func startRealtime(_ call: CAPPluginCall) {
        print("[ONDA Plugin] startRealtime - Watch controls workout, just ping")
        implementation.sendPing()
        call.resolve()
    }

    @objc func stopRealtime(_ call: CAPPluginCall) {
        print("[ONDA Plugin] stopRealtime called")
        implementation.sendCommand(type: "stop")
        call.resolve()
    }
    
    @objc func sendHeartbeat(_ call: CAPPluginCall) {
        implementation.sendPing()
        call.resolve()
    }
}

// MARK: - WCSession Manager (iOS ↔ watchOS)

class OndaWatchManager: NSObject, WCSessionDelegate {

    static let shared = OndaWatchManager()

    var plugin: OndaWatchPlugin?
    
    var debugLog: [String] = []
    var receivedCount: Int = 0
    var lastHeartRate: Double = 0
    var lastHeartRateTime: Date = Date.distantPast
    var watchStatus: String = "unknown"
    
    private var isSessionInactive = false
    private var lastProcessedTimestamp: Double = 0

    private var session: WCSession? {
        WCSession.isSupported() ? WCSession.default : nil
    }
    
    override init() {
        super.init()
        
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(appWillEnterForeground),
            name: UIApplication.willEnterForegroundNotification,
            object: nil
        )
        
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(appDidBecomeActive),
            name: UIApplication.didBecomeActiveNotification,
            object: nil
        )
    }
    
    deinit {
        NotificationCenter.default.removeObserver(self)
    }
    
    @objc private func appWillEnterForeground() {
        print("[ONDA Manager] App will enter foreground - reactivating session")
        reactivateIfNeeded()
    }
    
    @objc private func appDidBecomeActive() {
        print("[ONDA Manager] App did become active - force reactivation")
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            // Force activation check
            let session = WCSession.default
            if session.activationState != .activated {
                print("[ONDA Manager] Force activating WCSession")
                session.activate()
            }
            
            self.isSessionInactive = false
            
            // Check for missed data in receivedApplicationContext
            let lastContext = session.receivedApplicationContext
            if let lastUpdate = lastContext["lastUpdate"] as? [String: Any] {
                self.addDebugLog("Recovered data from context after pause")
                self.handleReceivedData(lastUpdate)
            } else if let heartRate = lastContext["lastHeartRate"] as? Double {
                let data: [String: Any] = [
                    "type": "heartRate",
                    "value": heartRate,
                    "ts": lastContext["timestamp"] as? Double ?? Date().timeIntervalSince1970
                ]
                self.handleReceivedData(data)
            }
            
            self.sendPing()
        }
    }
    
    private func reactivateIfNeeded() {
        guard let session = session else { return }
        
        if session.activationState != .activated || isSessionInactive {
            addDebugLog("Reactivating WCSession...")
            session.activate()
            isSessionInactive = false
        }
    }
    
    private func addDebugLog(_ message: String) {
        let timestamp = DateFormatter.localizedString(from: Date(), dateStyle: .none, timeStyle: .medium)
        let entry = "\(timestamp): \(message)"
        print("[ONDA Debug] \(entry)")
        debugLog.append(entry)
        if debugLog.count > 20 {
            debugLog.removeFirst()
        }
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
            reactivateIfNeeded()
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
            "reachable": session.isReachable,
            "watchStatus": watchStatus,
            "lastHR": lastHeartRate,
            "receivedCount": receivedCount
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
            session.sendMessage(message, replyHandler: nil) { error in
                print("[ONDA Manager] sendCommand error: \(error.localizedDescription)")
            }
        } else {
            session.transferUserInfo(message)
            print("[ONDA Manager] Command transferred via userInfo")
        }
    }
    
    func sendPing() {
        guard let session = session else {
            return
        }
        
        let message: [String: Any] = [
            "type": "ping",
            "ts": Date().timeIntervalSince1970
        ]
        
        if session.isReachable {
            session.sendMessage(message, replyHandler: nil, errorHandler: nil)
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
        isSessionInactive = true
        addDebugLog("Session inactive - will reactivate on foreground")
    }

    func sessionDidDeactivate(_ session: WCSession) {
        print("[ONDA Manager] Session deactivated, reactivating...")
        isSessionInactive = true
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            session.activate()
            self.isSessionInactive = false
        }
    }

    func sessionReachabilityDidChange(_ session: WCSession) {
        addDebugLog("Reachable: \(session.isReachable)")
        DispatchQueue.main.async {
            self.plugin?.notifyListeners("reachability", data: [
                "reachable": session.isReachable
            ])
        }
    }

    func session(_ session: WCSession,
                 didReceiveMessage message: [String : Any]) {
        handleReceivedData(message)
    }
    
    func session(_ session: WCSession,
                 didReceiveMessage message: [String : Any],
                 replyHandler: @escaping ([String : Any]) -> Void) {
        handleReceivedData(message)
        replyHandler(["received": true])
    }
    
    func session(_ session: WCSession,
                 didReceiveUserInfo userInfo: [String : Any] = [:]) {
        addDebugLog("UserInfo received")
        handleReceivedData(userInfo)
    }
    
    func session(_ session: WCSession,
                 didReceiveApplicationContext applicationContext: [String : Any]) {
        addDebugLog("AppContext received")
        
        // Handle nested lastUpdate format from watch
        if let lastUpdate = applicationContext["lastUpdate"] as? [String: Any] {
            addDebugLog("Context: restored data after pause")
            handleReceivedData(lastUpdate)
        } else if let heartRate = applicationContext["lastHeartRate"] as? Double {
            // Direct format fallback
            let data: [String: Any] = [
                "type": "heartRate",
                "value": heartRate,
                "ts": applicationContext["timestamp"] as? Double ?? Date().timeIntervalSince1970
            ]
            handleReceivedData(data)
        } else {
            handleReceivedData(applicationContext)
        }
    }
    
    private func handleReceivedData(_ data: [String: Any]) {
        guard let type = data["type"] as? String else {
            return
        }

        switch type {
        case "heartRate":
            if let value = data["value"] as? Double {
                // Deduplicate by timestamp (data may arrive via multiple channels)
                let timestamp = data["ts"] as? Double ?? Date().timeIntervalSince1970
                if timestamp <= lastProcessedTimestamp {
                    return // Already processed this data
                }
                lastProcessedTimestamp = timestamp
                
                receivedCount += 1
                lastHeartRate = value
                lastHeartRateTime = Date()
                
                if receivedCount % 10 == 1 {
                    addDebugLog("HR#\(receivedCount): \(Int(value)) bpm")
                }
                
                DispatchQueue.main.async {
                    self.plugin?.notifyListeners("heartRate", data: ["value": value])
                }
            }

        case "status":
            if let status = data["status"] as? String {
                watchStatus = status
                addDebugLog("Watch status: \(status)")
                DispatchQueue.main.async {
                    self.plugin?.notifyListeners("watchStatus", data: [
                        "status": status,
                        "isActive": data["isActive"] as? Bool ?? false
                    ])
                }
            }

        default:
            break
        }
    }
}
