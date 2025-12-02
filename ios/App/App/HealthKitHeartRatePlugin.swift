import Foundation
import Capacitor
import HealthKit

@objc(HealthKitHeartRatePlugin)
public class HealthKitHeartRatePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "HealthKitHeartRatePlugin"
    public let jsName = "HealthKitHeartRate"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "isAvailable", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "requestAuthorization", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "queryHeartRate", returnType: CAPPluginReturnPromise)
    ]
    
    private let healthStore = HKHealthStore()
    
    @objc func isAvailable(_ call: CAPPluginCall) {
        let available = HKHealthStore.isHealthDataAvailable()
        call.resolve(["available": available])
    }
    
    @objc func requestAuthorization(_ call: CAPPluginCall) {
        guard HKHealthStore.isHealthDataAvailable() else {
            call.reject("HealthKit is not available on this device")
            return
        }
        
        guard let heartRateType = HKQuantityType.quantityType(forIdentifier: .heartRate) else {
            call.reject("Heart rate type is not available")
            return
        }
        
        let typesToRead: Set<HKObjectType> = [heartRateType]
        
        healthStore.requestAuthorization(toShare: nil, read: typesToRead) { success, error in
            DispatchQueue.main.async {
                if let error = error {
                    call.reject("Authorization failed: \(error.localizedDescription)")
                    return
                }
                call.resolve(["authorized": success])
            }
        }
    }
    
    @objc func queryHeartRate(_ call: CAPPluginCall) {
        guard HKHealthStore.isHealthDataAvailable() else {
            call.reject("HealthKit is not available")
            return
        }
        
        guard let heartRateType = HKQuantityType.quantityType(forIdentifier: .heartRate) else {
            call.reject("Heart rate type is not available")
            return
        }
        
        let limit = call.getInt("limit") ?? 10
        let minutesAgo = call.getInt("minutesAgo") ?? 30
        
        let now = Date()
        let startDate = Calendar.current.date(byAdding: .minute, value: -minutesAgo, to: now) ?? now
        
        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: now, options: .strictStartDate)
        let sortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierEndDate, ascending: false)
        
        let query = HKSampleQuery(
            sampleType: heartRateType,
            predicate: predicate,
            limit: limit,
            sortDescriptors: [sortDescriptor]
        ) { [weak self] _, samples, error in
            DispatchQueue.main.async {
                if let error = error {
                    call.reject("Query failed: \(error.localizedDescription)")
                    return
                }
                
                guard let samples = samples as? [HKQuantitySample] else {
                    call.resolve(["samples": [], "latestBpm": NSNull()])
                    return
                }
                
                let unit = HKUnit.count().unitDivided(by: .minute())
                var heartRateSamples: [[String: Any]] = []
                var latestBpm: Double? = nil
                
                for sample in samples {
                    let bpm = sample.quantity.doubleValue(for: unit)
                    let timestamp = ISO8601DateFormatter().string(from: sample.endDate)
                    let sourceName = sample.sourceRevision.source.name
                    
                    if latestBpm == nil {
                        latestBpm = bpm
                    }
                    
                    heartRateSamples.append([
                        "bpm": bpm,
                        "timestamp": timestamp,
                        "sourceName": sourceName
                    ])
                }
                
                call.resolve([
                    "samples": heartRateSamples,
                    "latestBpm": latestBpm as Any,
                    "count": heartRateSamples.count
                ])
            }
        }
        
        healthStore.execute(query)
    }
}
