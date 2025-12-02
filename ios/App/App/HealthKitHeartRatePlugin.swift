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
        CAPPluginMethod(name: "queryHeartRate", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "startRealtimeMonitoring", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stopRealtimeMonitoring", returnType: CAPPluginReturnPromise)
    ]
    
    private let healthStore = HKHealthStore()
    private var anchoredQuery: HKAnchoredObjectQuery?
    private var queryAnchor: HKQueryAnchor?
    
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
    
    @objc func startRealtimeMonitoring(_ call: CAPPluginCall) {
        guard HKHealthStore.isHealthDataAvailable() else {
            call.reject("HealthKit is not available")
            return
        }
        
        guard let heartRateType = HKQuantityType.quantityType(forIdentifier: .heartRate) else {
            call.reject("Heart rate type is not available")
            return
        }
        
        // Stop existing query if any
        if let existingQuery = anchoredQuery {
            healthStore.stop(existingQuery)
            anchoredQuery = nil
        }
        
        let unit = HKUnit.count().unitDivided(by: .minute())
        
        // Create anchored query for real-time updates
        let query = HKAnchoredObjectQuery(
            type: heartRateType,
            predicate: nil,
            anchor: queryAnchor,
            limit: HKObjectQueryNoLimit
        ) { [weak self] query, samplesOrNil, deletedObjectsOrNil, newAnchor, errorOrNil in
            guard let self = self else { return }
            
            self.queryAnchor = newAnchor
            
            if let error = errorOrNil {
                print("[HealthKit] Initial query error: \(error.localizedDescription)")
                return
            }
            
            if let samples = samplesOrNil as? [HKQuantitySample], let latestSample = samples.last {
                let bpm = latestSample.quantity.doubleValue(for: unit)
                let timestamp = ISO8601DateFormatter().string(from: latestSample.endDate)
                let sourceName = latestSample.sourceRevision.source.name
                
                DispatchQueue.main.async {
                    self.notifyListeners("heartRateUpdate", data: [
                        "bpm": bpm,
                        "timestamp": timestamp,
                        "sourceName": sourceName,
                        "isRealtime": true
                    ])
                }
            }
        }
        
        // Set up update handler for real-time data
        query.updateHandler = { [weak self] query, samplesOrNil, deletedObjectsOrNil, newAnchor, errorOrNil in
            guard let self = self else { return }
            
            self.queryAnchor = newAnchor
            
            if let error = errorOrNil {
                print("[HealthKit] Update error: \(error.localizedDescription)")
                return
            }
            
            if let samples = samplesOrNil as? [HKQuantitySample] {
                for sample in samples {
                    let bpm = sample.quantity.doubleValue(for: unit)
                    let timestamp = ISO8601DateFormatter().string(from: sample.endDate)
                    let sourceName = sample.sourceRevision.source.name
                    
                    DispatchQueue.main.async {
                        self.notifyListeners("heartRateUpdate", data: [
                            "bpm": bpm,
                            "timestamp": timestamp,
                            "sourceName": sourceName,
                            "isRealtime": true
                        ])
                    }
                }
            }
        }
        
        anchoredQuery = query
        healthStore.execute(query)
        
        call.resolve(["started": true])
    }
    
    @objc func stopRealtimeMonitoring(_ call: CAPPluginCall) {
        if let query = anchoredQuery {
            healthStore.stop(query)
            anchoredQuery = nil
        }
        call.resolve(["stopped": true])
    }
}
