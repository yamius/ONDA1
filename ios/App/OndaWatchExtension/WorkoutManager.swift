import Foundation
import HealthKit
import WatchConnectivity
import Combine

final class WorkoutManager: NSObject, ObservableObject {

    @Published var heartRate: Double = 0
    @Published var isRunning: Bool = false

    var heartRateString: String {
        heartRate > 0 ? String(Int(heartRate)) : "--"
    }

    private let healthStore = HKHealthStore()
    private var workoutSession: HKWorkoutSession?
    private var workoutBuilder: HKLiveWorkoutBuilder?

    private let session = WCSession.isSupported() ? WCSession.default : nil

    override init() {
        super.init()
        if let session = session {
            session.delegate = self
            session.activate()
        }
    }

    func activateSession() {
        requestHealthAuthorization()
    }

    private func requestHealthAuthorization() {
        guard HKHealthStore.isHealthDataAvailable() else { return }
        guard let heartRateType = HKObjectType.quantityType(forIdentifier: .heartRate) else { return }

        let typesToShare: Set<HKSampleType> = []
        let typesToRead: Set<HKObjectType> = [heartRateType]

        healthStore.requestAuthorization(toShare: typesToShare, read: typesToRead) { success, error in
            if !success {
                print("HealthKit auth failed: \(error?.localizedDescription ?? "unknown")")
            }
        }
    }

    func startWorkout() {
        guard !isRunning else { return }

        let configuration = HKWorkoutConfiguration()
        configuration.activityType = .other
        configuration.locationType = .indoor

        do {
            let session = try HKWorkoutSession(healthStore: healthStore, configuration: configuration)
            let builder = session.associatedWorkoutBuilder()

            session.delegate = self
            builder.delegate = self

            builder.dataSource = HKLiveWorkoutDataSource(
                healthStore: healthStore,
                workoutConfiguration: configuration
            )

            self.workoutSession = session
            self.workoutBuilder = builder
            self.isRunning = true

            let startDate = Date()
            session.startActivity(with: startDate)
            builder.beginCollection(withStart: startDate) { success, error in
                if let error = error {
                    print("beginCollection error: \(error)")
                }
            }

            sendStatusToPhone(status: "started")
        } catch {
            print("Failed to start workout: \(error)")
        }
    }

    func stopWorkout() {
        guard isRunning else { return }

        isRunning = false
        let endDate = Date()

        workoutSession?.end()
        workoutBuilder?.endCollection(withEnd: endDate) { [weak self] success, error in
            guard let self = self else { return }
            self.workoutBuilder?.finishWorkout { _, error in
                if let error = error {
                    print("finishWorkout error: \(error)")
                }
            }
        }

        sendStatusToPhone(status: "stopped")
    }

    private func sendHeartRateToPhone(_ bpm: Double) {
        guard let session = session else { return }
        
        let message: [String: Any] = [
            "type": "heartRate",
            "value": bpm,
            "timestamp": Date().timeIntervalSince1970
        ]
        
        if session.isReachable {
            session.sendMessage(message, replyHandler: nil) { [weak self] error in
                print("sendMessage error: \(error.localizedDescription)")
                self?.transferHeartRateToPhone(bpm)
            }
        } else {
            transferHeartRateToPhone(bpm)
        }
    }
    
    private func transferHeartRateToPhone(_ bpm: Double) {
        guard let session = session else { return }
        
        let userInfo: [String: Any] = [
            "type": "heartRate",
            "value": bpm,
            "timestamp": Date().timeIntervalSince1970
        ]
        
        session.transferUserInfo(userInfo)
    }

    private func sendStatusToPhone(status: String) {
        guard let session = session else { return }

        let message: [String: Any] = [
            "type": "status",
            "value": status
        ]
        
        if session.isReachable {
            session.sendMessage(message, replyHandler: nil) { [weak self] error in
                print("sendStatus error: \(error.localizedDescription)")
                self?.transferStatusToPhone(status: status)
            }
        } else {
            transferStatusToPhone(status: status)
        }
    }
    
    private func transferStatusToPhone(status: String) {
        guard let session = session else { return }
        
        let userInfo: [String: Any] = [
            "type": "status",
            "value": status
        ]
        
        session.transferUserInfo(userInfo)
    }
}

extension WorkoutManager: HKWorkoutSessionDelegate, HKLiveWorkoutBuilderDelegate {
    func workoutSession(_ workoutSession: HKWorkoutSession,
                        didChangeTo toState: HKWorkoutSessionState,
                        from fromState: HKWorkoutSessionState,
                        date: Date) {}

    func workoutSession(_ workoutSession: HKWorkoutSession,
                        didFailWithError error: Error) {
        print("Workout session failed: \(error)")
    }

    func workoutBuilderDidCollectEvent(_ workoutBuilder: HKLiveWorkoutBuilder) {}

    func workoutBuilder(_ workoutBuilder: HKLiveWorkoutBuilder,
                        didCollectDataOf collectedTypes: Set<HKSampleType>) {

        guard let heartRateType = HKObjectType.quantityType(forIdentifier: .heartRate),
              collectedTypes.contains(heartRateType),
              let stats = workoutBuilder.statistics(for: heartRateType),
              let quantity = stats.mostRecentQuantity() else {
            return
        }

        let unit = HKUnit(from: "count/min")
        let bpm = quantity.doubleValue(for: unit)

        DispatchQueue.main.async {
            self.heartRate = bpm
        }

        sendHeartRateToPhone(bpm)
    }
}

extension WorkoutManager: WCSessionDelegate {
    func session(_ session: WCSession,
                 activationDidCompleteWith activationState: WCSessionActivationState,
                 error: Error?) {
        if let error = error {
            print("WCSession activation error: \(error)")
        } else {
            print("Watch WCSession activated: \(activationState.rawValue)")
        }
    }

    func sessionReachabilityDidChange(_ session: WCSession) {
        print("Watch WCSession reachable: \(session.isReachable)")
    }

    func session(_ session: WCSession,
                 didReceiveMessage message: [String : Any]) {

        guard let type = message["type"] as? String else { return }

        switch type {
        case "start":
            DispatchQueue.main.async { self.startWorkout() }
        case "stop":
            DispatchQueue.main.async { self.stopWorkout() }
        default:
            break
        }
    }
}
