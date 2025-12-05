import Foundation
import HealthKit
import WatchConnectivity

@MainActor
class WorkoutManager: NSObject, ObservableObject {
    @Published var heartRate: Double = 0
    @Published var isActive: Bool = false
    
    private let healthStore = HKHealthStore()
    
    #if os(watchOS)
    private var session: HKWorkoutSession?
    private var builder: HKLiveWorkoutBuilder?
    #endif
    
    override init() {
        super.init()
        requestAuthorization()
        setupWatchConnectivity()
    }
    
    private func requestAuthorization() {
        let typesToShare: Set = [HKQuantityType.workoutType()]
        let typesToRead: Set = [
            HKQuantityType.quantityType(forIdentifier: .heartRate)!
        ]
        
        healthStore.requestAuthorization(toShare: typesToShare, read: typesToRead) { success, error in
            if !success {
                print("HealthKit authorization failed: \(error?.localizedDescription ?? "Unknown error")")
            }
        }
    }
    
    private func setupWatchConnectivity() {
        if WCSession.isSupported() {
            let session = WCSession.default
            session.delegate = self
            session.activate()
        }
    }
    
    func startWorkout() {
        #if os(watchOS)
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
            
            Task {
                try await builder?.beginCollection(at: startDate)
            }
            
            isActive = true
        } catch {
            print("Failed to start workout: \(error)")
        }
        #endif
    }
    
    func stopWorkout() {
        #if os(watchOS)
        session?.end()
        isActive = false
        #endif
    }
    
    private func sendHeartRateToPhone(_ heartRate: Double) {
        guard WCSession.default.isReachable else { return }
        
        let message = ["heartRate": heartRate, "timestamp": Date().timeIntervalSince1970] as [String: Any]
        WCSession.default.sendMessage(message, replyHandler: nil) { error in
            print("Error sending heart rate: \(error)")
        }
    }
}

#if os(watchOS)
extension WorkoutManager: HKWorkoutSessionDelegate {
    nonisolated func workoutSession(_ workoutSession: HKWorkoutSession, didChangeTo toState: HKWorkoutSessionState, from fromState: HKWorkoutSessionState, date: Date) {
        print("Workout state changed to: \(toState.rawValue)")
    }
    
    nonisolated func workoutSession(_ workoutSession: HKWorkoutSession, didFailWithError error: Error) {
        print("Workout session failed: \(error)")
    }
}

extension WorkoutManager: HKLiveWorkoutBuilderDelegate {
    nonisolated func workoutBuilder(_ workoutBuilder: HKLiveWorkoutBuilder, didCollectDataOf collectedTypes: Set<HKSampleType>) {
        for type in collectedTypes {
            guard let quantityType = type as? HKQuantityType,
                  quantityType == HKQuantityType.quantityType(forIdentifier: .heartRate) else { continue }
            
            let statistics = workoutBuilder.statistics(for: quantityType)
            let heartRateUnit = HKUnit.count().unitDivided(by: .minute())
            
            if let value = statistics?.mostRecentQuantity()?.doubleValue(for: heartRateUnit) {
                Task { @MainActor in
                    self.heartRate = value
                    self.sendHeartRateToPhone(value)
                }
            }
        }
    }
    
    nonisolated func workoutBuilderDidCollectEvent(_ workoutBuilder: HKLiveWorkoutBuilder) {}
}
#endif

extension WorkoutManager: WCSessionDelegate {
    nonisolated func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
        print("Watch session activated: \(activationState.rawValue)")
    }
    
    #if os(iOS)
    nonisolated func sessionDidBecomeInactive(_ session: WCSession) {}
    nonisolated func sessionDidDeactivate(_ session: WCSession) {
        session.activate()
    }
    #endif
}
