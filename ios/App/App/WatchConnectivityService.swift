import Foundation
import WatchConnectivity
import UIKit

@objc public class WatchConnectivityService: NSObject, WCSessionDelegate {
    
    @objc public static let shared = WatchConnectivityService()
    
    private var session: WCSession?
    private var pendingHeartRateCallback: ((Int) -> Void)?
    private var pendingWorkoutStatusCallback: ((Bool) -> Void)?
    
    private var lastHeartRate: Int = 0
    private var lastWorkoutActive: Bool = false
    private var lastUpdateTime: Date = Date.distantPast
    
    private override init() {
        super.init()
        setupSession()
        
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(appDidBecomeActive),
            name: UIApplication.didBecomeActiveNotification,
            object: nil
        )
        
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(appWillEnterForeground),
            name: UIApplication.willEnterForegroundNotification,
            object: nil
        )
        
        print("[WatchConnectivityService] Singleton initialized")
    }
    
    private func setupSession() {
        guard WCSession.isSupported() else {
            print("[WatchConnectivityService] WCSession not supported")
            return
        }
        
        session = WCSession.default
        session?.delegate = self
        session?.activate()
        print("[WatchConnectivityService] WCSession setup complete")
    }
    
    @objc private func appDidBecomeActive() {
        print("[WatchConnectivityService] App did become active - reactivating session")
        reactivateSessionIfNeeded()
    }
    
    @objc private func appWillEnterForeground() {
        print("[WatchConnectivityService] App will enter foreground - reactivating session")
        reactivateSessionIfNeeded()
    }
    
    private func reactivateSessionIfNeeded() {
        guard let session = session else {
            setupSession()
            return
        }
        
        if session.activationState != .activated {
            print("[WatchConnectivityService] Session inactive (\(session.activationState.rawValue)), reactivating...")
            session.delegate = self
            session.activate()
        } else if session.isReachable {
            print("[WatchConnectivityService] Session active and reachable, sending ping")
            session.sendMessage(["type": "ping"], replyHandler: nil) { error in
                print("[WatchConnectivityService] Ping failed: \(error.localizedDescription)")
            }
        } else {
            print("[WatchConnectivityService] Session active but not reachable")
        }
    }
    
    @objc public func isWatchPaired() -> Bool {
        return session?.isPaired ?? false
    }
    
    @objc public func isWatchReachable() -> Bool {
        return session?.isReachable ?? false
    }
    
    @objc public func isSessionActivated() -> Bool {
        return session?.activationState == .activated
    }
    
    @objc public func getLastHeartRate() -> Int {
        return lastHeartRate
    }
    
    @objc public func isWorkoutActive() -> Bool {
        return lastWorkoutActive
    }
    
    @objc public func startWorkout(completion: @escaping (Bool, String?) -> Void) {
        guard let session = session, session.activationState == .activated else {
            completion(false, "Session not activated")
            return
        }
        
        let message: [String: Any] = ["command": "startWorkout"]
        
        if session.isReachable {
            session.sendMessage(message, replyHandler: { reply in
                let success = reply["success"] as? Bool ?? false
                let error = reply["error"] as? String
                DispatchQueue.main.async {
                    completion(success, error)
                }
            }, errorHandler: { error in
                print("[WatchConnectivityService] startWorkout sendMessage failed: \(error.localizedDescription)")
                self.session?.transferUserInfo(message)
                DispatchQueue.main.async {
                    completion(true, nil)
                }
            })
        } else {
            session.transferUserInfo(message)
            completion(true, nil)
        }
    }
    
    @objc public func stopWorkout(completion: @escaping (Bool, String?) -> Void) {
        guard let session = session, session.activationState == .activated else {
            completion(false, "Session not activated")
            return
        }
        
        let message: [String: Any] = ["command": "stopWorkout"]
        
        if session.isReachable {
            session.sendMessage(message, replyHandler: { reply in
                let success = reply["success"] as? Bool ?? false
                let error = reply["error"] as? String
                DispatchQueue.main.async {
                    completion(success, error)
                }
            }, errorHandler: { error in
                print("[WatchConnectivityService] stopWorkout sendMessage failed: \(error.localizedDescription)")
                self.session?.transferUserInfo(message)
                DispatchQueue.main.async {
                    completion(true, nil)
                }
            })
        } else {
            session.transferUserInfo(message)
            completion(true, nil)
        }
    }
    
    @objc public func pauseRealtime(completion: @escaping (Bool) -> Void) {
        guard let session = session, session.activationState == .activated else {
            completion(false)
            return
        }
        
        let message: [String: Any] = ["command": "pauseRealtime"]
        
        if session.isReachable {
            session.sendMessage(message, replyHandler: { _ in
                DispatchQueue.main.async { completion(true) }
            }, errorHandler: { error in
                print("[WatchConnectivityService] pauseRealtime failed: \(error.localizedDescription)")
                try? session.updateApplicationContext(message)
                DispatchQueue.main.async { completion(true) }
            })
        } else {
            try? session.updateApplicationContext(message)
            completion(true)
        }
    }
    
    @objc public func resumeRealtime(completion: @escaping (Bool) -> Void) {
        guard let session = session, session.activationState == .activated else {
            completion(false)
            return
        }
        
        let message: [String: Any] = ["command": "resumeRealtime", "timestamp": Date().timeIntervalSince1970]
        
        if session.isReachable {
            session.sendMessage(message, replyHandler: { _ in
                DispatchQueue.main.async { completion(true) }
            }, errorHandler: { error in
                print("[WatchConnectivityService] resumeRealtime failed: \(error.localizedDescription)")
                try? session.updateApplicationContext(message)
                DispatchQueue.main.async { completion(true) }
            })
        } else {
            try? session.updateApplicationContext(message)
            completion(true)
        }
    }
    
    @objc public func sendPing() {
        guard let session = session, session.isReachable else { return }
        session.sendMessage(["type": "ping"], replyHandler: nil, errorHandler: nil)
    }
    
    @objc public func setHeartRateCallback(_ callback: @escaping (Int) -> Void) {
        pendingHeartRateCallback = callback
    }
    
    @objc public func setWorkoutStatusCallback(_ callback: @escaping (Bool) -> Void) {
        pendingWorkoutStatusCallback = callback
    }
    
    public func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
        print("[WatchConnectivityService] Activation completed: \(activationState.rawValue), error: \(error?.localizedDescription ?? "none")")
        
        if activationState == .activated {
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                self.sendPing()
            }
        }
    }
    
    public func sessionDidBecomeInactive(_ session: WCSession) {
        print("[WatchConnectivityService] Session became inactive")
    }
    
    public func sessionDidDeactivate(_ session: WCSession) {
        print("[WatchConnectivityService] Session deactivated, reactivating...")
        session.activate()
    }
    
    public func sessionReachabilityDidChange(_ session: WCSession) {
        print("[WatchConnectivityService] Reachability changed: \(session.isReachable)")
        
        if session.isReachable {
            sendPing()
        }
    }
    
    public func session(_ session: WCSession, didReceiveMessage message: [String : Any]) {
        processIncomingMessage(message)
    }
    
    public func session(_ session: WCSession, didReceiveMessage message: [String : Any], replyHandler: @escaping ([String : Any]) -> Void) {
        processIncomingMessage(message)
        replyHandler(["received": true])
    }
    
    public func session(_ session: WCSession, didReceiveApplicationContext applicationContext: [String : Any]) {
        print("[WatchConnectivityService] Received application context: \(applicationContext)")
        processIncomingMessage(applicationContext)
    }
    
    public func session(_ session: WCSession, didReceiveUserInfo userInfo: [String : Any] = [:]) {
        print("[WatchConnectivityService] Received user info: \(userInfo)")
        processIncomingMessage(userInfo)
    }
    
    private func processIncomingMessage(_ message: [String: Any]) {
        lastUpdateTime = Date()
        
        if let heartRate = message["heartRate"] as? Int {
            lastHeartRate = heartRate
            DispatchQueue.main.async {
                self.pendingHeartRateCallback?(heartRate)
            }
        }
        
        if let workoutActive = message["workoutActive"] as? Bool {
            lastWorkoutActive = workoutActive
            DispatchQueue.main.async {
                self.pendingWorkoutStatusCallback?(workoutActive)
            }
        }
        
        if let batchData = message["heartRateBatch"] as? [[String: Any]] {
            for item in batchData {
                if let hr = item["heartRate"] as? Int {
                    lastHeartRate = hr
                    DispatchQueue.main.async {
                        self.pendingHeartRateCallback?(hr)
                    }
                }
            }
        }
    }
    
    deinit {
        NotificationCenter.default.removeObserver(self)
    }
}
