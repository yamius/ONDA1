import Foundation
import HealthKit
import WatchConnectivity

class WorkoutManager: NSObject, ObservableObject {
    @Published var heartRate: Int = 0
    @Published var isSessionActive: Bool = false
    @Published var authorizationStatus: String = "Unknown"
    
    private let healthStore = HKHealthStore()
    private var session: HKWorkoutSession?
    private var builder: HKLiveWorkoutBuilder?
    private var wcSession: WCSession?
    
    override init() {
        super.init()
        setupWatchConnectivity()
    }
    
    private func setupWatchConnectivity() {
        if WCSession.isSupported() {
            wcSession = WCSession.default
            wcSession?.delegate = self
            wcSession?.activate()
        }
    }
    
    func requestAuthorization() {
        guard HKHealthStore.isHealthDataAvailable() else {
            authorizationStatus = "HealthKit not available"
            return
        }
        
        let typesToRead: Set<HKObjectType> = [
            HKQuantityType.quantityType(forIdentifier: .heartRate)!,
            HKQuantityType.quantityType(forIdentifier: .heartRateVariabilitySDNN)!,
            HKObjectType.workoutType()
        ]
        
        let typesToWrite: Set<HKSampleType> = [
            HKQuantityType.quantityType(forIdentifier: .heartRate)!,
            HKObjectType.workoutType()
        ]
        
        healthStore.requestAuthorization(toShare: typesToWrite, read: typesToRead) { [weak self] success, error in
            DispatchQueue.main.async {
                if success {
                    self?.authorizationStatus = "Authorized"
                } else {
                    self?.authorizationStatus = error?.localizedDescription ?? "Failed"
                }
            }
        }
    }
    
    func startWorkout() {
        let configuration = HKWorkoutConfiguration()
        configuration.activityType = .mindAndBody
        configuration.locationType = .indoor
        
        do {
            session = try HKWorkoutSession(healthStore: healthStore, configuration: configuration)
            builder = session?.associatedWorkoutBuilder()
            
            session?.delegate = self
            builder?.delegate = self
            
            builder?.dataSource = HKLiveWorkoutDataSource(
                healthStore: healthStore,
                workoutConfiguration: configuration
            )
            
            let startDate = Date()
            session?.startActivity(with: startDate)
            builder?.beginCollection(withStart: startDate) { [weak self] success, error in
                DispatchQueue.main.async {
                    self?.isSessionActive = success
                }
            }
        } catch {
            print("Failed to start workout: \(error)")
        }
    }
    
    func stopWorkout() {
        session?.end()
        
        builder?.endCollection(withEnd: Date()) { [weak self] success, error in
            self?.builder?.finishWorkout { workout, error in
                DispatchQueue.main.async {
                    self?.isSessionActive = false
                    self?.heartRate = 0
                }
            }
        }
    }
    
    private func sendHeartRateToPhone(_ heartRate: Int) {
        guard let session = wcSession, session.isReachable else { return }
        
        let message: [String: Any] = [
            "type": "heartRate",
            "bpm": heartRate,
            "timestamp": Date().timeIntervalSince1970
        ]
        
        session.sendMessage(message, replyHandler: nil) { error in
            print("Failed to send heart rate: \(error)")
        }
    }
}

extension WorkoutManager: HKWorkoutSessionDelegate {
    func workoutSession(_ workoutSession: HKWorkoutSession,
                       didChangeTo toState: HKWorkoutSessionState,
                       from fromState: HKWorkoutSessionState,
                       date: Date) {
        DispatchQueue.main.async {
            self.isSessionActive = toState == .running
        }
    }
    
    func workoutSession(_ workoutSession: HKWorkoutSession,
                       didFailWithError error: Error) {
        print("Workout session failed: \(error)")
    }
}

extension WorkoutManager: HKLiveWorkoutBuilderDelegate {
    func workoutBuilder(_ workoutBuilder: HKLiveWorkoutBuilder,
                       didCollectDataOf collectedTypes: Set<HKSampleType>) {
        for type in collectedTypes {
            guard let quantityType = type as? HKQuantityType,
                  quantityType == HKQuantityType.quantityType(forIdentifier: .heartRate) else { continue }
            
            let statistics = workoutBuilder.statistics(for: quantityType)
            let heartRateUnit = HKUnit.count().unitDivided(by: .minute())
            
            if let value = statistics?.mostRecentQuantity()?.doubleValue(for: heartRateUnit) {
                let bpm = Int(value)
                DispatchQueue.main.async {
                    self.heartRate = bpm
                    self.sendHeartRateToPhone(bpm)
                }
            }
        }
    }
    
    func workoutBuilderDidCollectEvent(_ workoutBuilder: HKLiveWorkoutBuilder) {}
}

extension WorkoutManager: WCSessionDelegate {
    func session(_ session: WCSession,
                activationDidCompleteWith activationState: WCSessionActivationState,
                error: Error?) {
        if let error = error {
            print("WCSession activation failed: \(error)")
        }
    }
    
    func session(_ session: WCSession, didReceiveMessage message: [String : Any]) {
        if let command = message["command"] as? String {
            DispatchQueue.main.async {
                switch command {
                case "start":
                    self.startWorkout()
                case "stop":
                    self.stopWorkout()
                default:
                    break
                }
            }
        }
    }
}
