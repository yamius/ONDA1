import Foundation
import HealthKit
import WatchConnectivity
import WatchKit
import Combine
import AVFoundation

class WorkoutManager: NSObject, ObservableObject {
    static let shared = WorkoutManager()
    
    private let healthStore = HKHealthStore()
    private var session: HKWorkoutSession?
    private var builder: HKLiveWorkoutBuilder?
    private var extendedSession: WKExtendedRuntimeSession?
    
    // Audio playback
    private var audioPlayer: AVAudioPlayer?
    private var audioSession: AVAudioSession?
    
    @Published var heartRate: Double = 0
    @Published var isActive = false
    @Published var authorizationStatus: HKAuthorizationStatus = .notDetermined
    @Published var isAudioLoading = false
    @Published var audioLoadingProgress: String = ""
    @Published var isAudioPlaying = false
    
    override init() {
        super.init()
        setupWatchConnectivity()
        startExtendedSession()
    }
    
    private func setupWatchConnectivity() {
        if WCSession.isSupported() {
            WCSession.default.delegate = self
            WCSession.default.activate()
        }
    }
    
    func startExtendedSession() {
        guard extendedSession == nil || extendedSession?.state == .invalid else {
            print("[WorkoutManager] Extended session already active")
            return
        }
        
        extendedSession = WKExtendedRuntimeSession()
        extendedSession?.delegate = self
        extendedSession?.start()
        print("[WorkoutManager] Starting extended runtime session")
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
        
        print("[WorkoutManager] Requesting HealthKit authorization...")
        
        healthStore.requestAuthorization(toShare: typesToShare, read: typesToRead) { success, error in
            DispatchQueue.main.async {
                if success {
                    print("[WorkoutManager] HealthKit authorization dialog shown successfully")
                    if let hrType = HKObjectType.quantityType(forIdentifier: .heartRate) {
                        self.authorizationStatus = self.healthStore.authorizationStatus(for: hrType)
                        print("[WorkoutManager] Updated status: \(self.authorizationStatus.rawValue)")
                    }
                    completion(true)
                } else {
                    print("[WorkoutManager] HealthKit authorization failed: \(error?.localizedDescription ?? "unknown")")
                    completion(false)
                }
            }
        }
    }
    
    var isAuthorized: Bool {
        guard let heartRateType = HKObjectType.quantityType(forIdentifier: .heartRate) else {
            return false
        }
        let status = healthStore.authorizationStatus(for: heartRateType)
        return status != .notDetermined
    }
    
    func startWorkout() {
        let config = HKWorkoutConfiguration()
        config.activityType = .mindAndBody
        config.locationType = .indoor
        
        do {
            session = try HKWorkoutSession(healthStore: healthStore, configuration: config)
            builder = session?.associatedWorkoutBuilder()
            
            builder?.dataSource = HKLiveWorkoutDataSource(healthStore: healthStore, workoutConfiguration: config)
            
            session?.delegate = self
            builder?.delegate = self
            
            let startDate = Date()
            session?.startActivity(with: startDate)
            builder?.beginCollection(withStart: startDate) { success, error in
                DispatchQueue.main.async {
                    self.isActive = true
                }
            }
        } catch {
            print("[WorkoutManager] Error starting workout: \(error)")
        }
    }
    
    func stopWorkout() {
        session?.end()
        isActive = false
    }
    
    // MARK: - Audio Playback
    
    func setupAudioSession() {
        do {
            audioSession = AVAudioSession.sharedInstance()
            try audioSession?.setCategory(.playback, mode: .default, options: [])
            try audioSession?.setActive(true)
            print("[WorkoutManager] Audio session configured")
        } catch {
            print("[WorkoutManager] Audio session error: \(error)")
        }
    }
    
    func playAudio(from url: URL) {
        setupAudioSession()
        
        do {
            audioPlayer = try AVAudioPlayer(contentsOf: url)
            audioPlayer?.delegate = self
            audioPlayer?.numberOfLoops = -1 // Loop indefinitely
            audioPlayer?.prepareToPlay()
            audioPlayer?.play()
            
            DispatchQueue.main.async {
                self.isAudioPlaying = true
                self.isAudioLoading = false
            }
            print("[WorkoutManager] Playing audio (looping): \(url.lastPathComponent)")
        } catch {
            print("[WorkoutManager] Audio play error: \(error)")
            DispatchQueue.main.async {
                self.isAudioLoading = false
            }
        }
    }
    
    func stopAudio() {
        audioPlayer?.stop()
        audioPlayer = nil
        DispatchQueue.main.async {
            self.isAudioPlaying = false
        }
        print("[WorkoutManager] Audio stopped")
    }
    
    func pauseAudio() {
        audioPlayer?.pause()
        DispatchQueue.main.async {
            self.isAudioPlaying = false
        }
    }
    
    func resumeAudio() {
        audioPlayer?.play()
        DispatchQueue.main.async {
            self.isAudioPlaying = true
        }
    }
    
    // Get cached audio file URL
    func getCachedAudioURL(practiceId: String) -> URL? {
        let fileManager = FileManager.default
        let documentsURL = fileManager.urls(for: .documentDirectory, in: .userDomainMask).first!
        let audioURL = documentsURL.appendingPathComponent("audio_\(practiceId).mp3")
        
        if fileManager.fileExists(atPath: audioURL.path) {
            return audioURL
        }
        return nil
    }
    
    // Request audio from iPhone
    func requestAudio(practiceId: String) {
        DispatchQueue.main.async {
            self.isAudioLoading = true
            self.audioLoadingProgress = "Requesting audio..."
        }
        
        let message: [String: Any] = [
            "type": "requestAudio",
            "practiceId": practiceId,
            "ts": Date().timeIntervalSince1970
        ]
        
        if WCSession.default.isReachable {
            WCSession.default.sendMessage(message, replyHandler: nil) { error in
                print("[WorkoutManager] requestAudio error: \(error.localizedDescription)")
            }
            print("[WorkoutManager] Requested audio for: \(practiceId)")
        } else {
            print("[WorkoutManager] iPhone not reachable for audio request")
            DispatchQueue.main.async {
                self.isAudioLoading = false
                self.audioLoadingProgress = "iPhone not connected"
            }
        }
    }
    
    private func sendHeartRateToPhone(_ hr: Double) {
        let message: [String: Any] = [
            "type": "heartRate",
            "value": hr,
            "ts": Date().timeIntervalSince1970
        ]
        
        if WCSession.default.isReachable {
            WCSession.default.sendMessage(message, replyHandler: nil) { error in
                print("[WorkoutManager] sendMessage error: \(error.localizedDescription)")
                // Fallback to transferUserInfo
                WCSession.default.transferUserInfo(message)
            }
        } else {
            // When not reachable, use transferUserInfo for reliable delivery
            WCSession.default.transferUserInfo(message)
            print("[WorkoutManager] HR sent via transferUserInfo")
        }
    }
}

extension WorkoutManager: WKExtendedRuntimeSessionDelegate {
    func extendedRuntimeSessionDidStart(_ extendedRuntimeSession: WKExtendedRuntimeSession) {
        print("[WorkoutManager] Extended runtime session started")
    }
    
    func extendedRuntimeSessionWillExpire(_ extendedRuntimeSession: WKExtendedRuntimeSession) {
        print("[WorkoutManager] Extended session will expire, restarting...")
        startExtendedSession()
    }
    
    func extendedRuntimeSession(_ extendedRuntimeSession: WKExtendedRuntimeSession,
                                didInvalidateWith reason: WKExtendedRuntimeSessionInvalidationReason,
                                error: Error?) {
        print("[WorkoutManager] Extended session invalidated: \(reason.rawValue), error: \(error?.localizedDescription ?? "none")")
        
        if reason == .sessionInProgress {
            return
        }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            self.startExtendedSession()
        }
    }
}

extension WorkoutManager: HKWorkoutSessionDelegate {
    func workoutSession(_ workoutSession: HKWorkoutSession, didChangeTo toState: HKWorkoutSessionState, from fromState: HKWorkoutSessionState, date: Date) {
        print("[WorkoutManager] State: \(toState.rawValue)")
    }
    
    func workoutSession(_ workoutSession: HKWorkoutSession, didFailWithError error: Error) {
        print("[WorkoutManager] Error: \(error)")
    }
}

extension WorkoutManager: HKLiveWorkoutBuilderDelegate {
    func workoutBuilder(_ workoutBuilder: HKLiveWorkoutBuilder, didCollectDataOf collectedTypes: Set<HKSampleType>) {
        for type in collectedTypes {
            guard let quantityType = type as? HKQuantityType,
                  quantityType == HKQuantityType.quantityType(forIdentifier: .heartRate) else { continue }
            
            if let statistics = workoutBuilder.statistics(for: quantityType) {
                let hrUnit = HKUnit.count().unitDivided(by: .minute())
                if let value = statistics.mostRecentQuantity()?.doubleValue(for: hrUnit) {
                    DispatchQueue.main.async {
                        self.heartRate = value
                        self.sendHeartRateToPhone(value)
                    }
                }
            }
        }
    }
    
    func workoutBuilderDidCollectEvent(_ workoutBuilder: HKLiveWorkoutBuilder) {}
}

// MARK: - AVAudioPlayerDelegate

extension WorkoutManager: AVAudioPlayerDelegate {
    func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) {
        print("[WorkoutManager] Audio finished playing, success: \(flag)")
        DispatchQueue.main.async {
            self.isAudioPlaying = false
        }
        // Notify that audio finished
        NotificationCenter.default.post(
            name: Notification.Name("AudioFinished"),
            object: nil
        )
    }
    
    func audioPlayerDecodeErrorDidOccur(_ player: AVAudioPlayer, error: Error?) {
        print("[WorkoutManager] Audio decode error: \(error?.localizedDescription ?? "unknown")")
        DispatchQueue.main.async {
            self.isAudioPlaying = false
        }
    }
}

extension WorkoutManager: WCSessionDelegate {
    func session(_ session: WCSession, activationDidCompleteWith state: WCSessionActivationState, error: Error?) {
        print("[WorkoutManager] WCSession activated: \(state.rawValue)")
        
        let context = session.receivedApplicationContext
        if let command = context["command"] as? String {
            print("[WorkoutManager] Found pending command in context: \(command)")
            handleCommand(["type": command])
        }
    }
    
    func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
        print("[WorkoutManager] Received message: \(message)")
        handleCommand(message)
    }
    
    func session(_ session: WCSession, didReceiveUserInfo userInfo: [String: Any] = [:]) {
        print("[WorkoutManager] Received userInfo (background wake): \(userInfo)")
        handleCommand(userInfo)
    }
    
    func session(_ session: WCSession, didReceiveApplicationContext applicationContext: [String : Any]) {
        print("[WorkoutManager] Received applicationContext: \(applicationContext)")
        if let command = applicationContext["command"] as? String {
            handleCommand(["type": command])
        }
    }
    
    // Handle received audio file from iPhone
    func session(_ session: WCSession, didReceive file: WCSessionFile) {
        print("[WorkoutManager] Received file: \(file.fileURL.lastPathComponent)")
        
        // Get practice ID from metadata
        guard let metadata = file.metadata,
              let practiceId = metadata["practiceId"] as? String else {
            print("[WorkoutManager] No practiceId in file metadata")
            return
        }
        
        // Save to documents directory
        let fileManager = FileManager.default
        let documentsURL = fileManager.urls(for: .documentDirectory, in: .userDomainMask).first!
        let destinationURL = documentsURL.appendingPathComponent("audio_\(practiceId).mp3")
        
        do {
            // Remove existing file if present
            if fileManager.fileExists(atPath: destinationURL.path) {
                try fileManager.removeItem(at: destinationURL)
            }
            
            // Copy received file
            try fileManager.copyItem(at: file.fileURL, to: destinationURL)
            print("[WorkoutManager] Audio saved: \(destinationURL.lastPathComponent)")
            
            DispatchQueue.main.async {
                self.isAudioLoading = false
                self.audioLoadingProgress = "Audio ready"
                
                // Notify that audio is ready
                NotificationCenter.default.post(
                    name: Notification.Name("AudioReady"),
                    object: nil,
                    userInfo: ["practiceId": practiceId, "url": destinationURL]
                )
            }
        } catch {
            print("[WorkoutManager] Error saving audio: \(error)")
            DispatchQueue.main.async {
                self.isAudioLoading = false
                self.audioLoadingProgress = "Save error"
            }
        }
    }
    
    private func handleCommand(_ data: [String: Any]) {
        let command = (data["type"] as? String) ?? (data["command"] as? String)
        
        guard let cmd = command else {
            print("[WorkoutManager] No command found in data")
            return
        }
        
        print("[WorkoutManager] Processing command: \(cmd)")
        
        DispatchQueue.main.async {
            switch cmd {
            case "start":
                if !self.isActive {
                    self.startWorkout()
                } else {
                    print("[WorkoutManager] Workout already active")
                }
            case "stop":
                self.stopWorkout()
            case "heartbeat":
                print("[WorkoutManager] Heartbeat received")
            case "practices":
                // Received practices from iPhone
                if let practices = data["practices"] as? [[String: Any]] {
                    print("[WorkoutManager] Received \(practices.count) practices from iPhone")
                    NotificationCenter.default.post(
                        name: Notification.Name("PracticesReceived"),
                        object: nil,
                        userInfo: ["practices": practices]
                    )
                }
            case "audioProgress":
                // Audio download progress from iPhone
                if let progress = data["progress"] as? String {
                    self.audioLoadingProgress = progress
                }
            default:
                print("[WorkoutManager] Unknown command: \(cmd)")
            }
        }
    }
}
