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
        CAPPluginMethod(name: "requestFullAuthorization", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "queryHeartRate", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "queryAllHealthData", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "querySleepHistory", returnType: CAPPluginReturnPromise),
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
    
    @objc func requestFullAuthorization(_ call: CAPPluginCall) {
        guard HKHealthStore.isHealthDataAvailable() else {
            call.reject("HealthKit is not available on this device")
            return
        }
        
        var typesToRead: Set<HKObjectType> = []
        
        // Only request essential permissions: Heart Rate and Sleep
        // This keeps the permission dialog simple for users
        
        if let heartRate = HKQuantityType.quantityType(forIdentifier: .heartRate) {
            typesToRead.insert(heartRate)
        }
        
        typesToRead.insert(HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!)
        
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
    
    @objc func queryAllHealthData(_ call: CAPPluginCall) {
        guard HKHealthStore.isHealthDataAvailable() else {
            call.reject("HealthKit is not available")
            return
        }
        
        let now = Date()
        let startOfDay = Calendar.current.startOfDay(for: now)
        let yesterday = Calendar.current.date(byAdding: .day, value: -1, to: startOfDay) ?? startOfDay
        
        var result: [String: Any] = [
            "ts": ISO8601DateFormatter().string(from: now),
            "source": "healthkit"
        ]
        
        let group = DispatchGroup()
        
        var activity: [String: Any] = [:]
        var vitals: [String: Any] = [:]
        var body: [String: Any] = [:]
        var sleep: [String: Any] = [:]
        var wellness: [String: Any] = [:]
        
        // Steps
        group.enter()
        querySum(.stepCount, from: startOfDay, to: now) { value in
            if let v = value { activity["steps"] = Int(v) }
            group.leave()
        }
        
        // Active Calories
        group.enter()
        querySum(.activeEnergyBurned, from: startOfDay, to: now) { value in
            if let v = value { activity["activeCaloriesBurned"] = Int(v) }
            group.leave()
        }
        
        // VO2 Max
        group.enter()
        queryLatest(.vo2Max) { value in
            if let v = value { activity["vo2Max"] = round(v * 10) / 10 }
            group.leave()
        }
        
        // Heart Rate
        group.enter()
        queryLatest(.heartRate) { value in
            if let v = value { vitals["heartRate"] = Int(v) }
            group.leave()
        }
        
        // Resting Heart Rate
        group.enter()
        queryLatest(.restingHeartRate) { value in
            if let v = value { vitals["restingHeartRate"] = Int(v) }
            group.leave()
        }
        
        // HRV
        group.enter()
        queryLatest(.heartRateVariabilitySDNN) { value in
            if let v = value { vitals["hrv"] = Int(v) }
            group.leave()
        }
        
        // Respiratory Rate
        group.enter()
        queryLatest(.respiratoryRate) { value in
            if let v = value { vitals["respiratoryRate"] = Int(v) }
            group.leave()
        }
        
        // SpO2
        group.enter()
        queryLatest(.oxygenSaturation) { value in
            if let v = value { vitals["spo2"] = round(v * 1000) / 10 }
            group.leave()
        }
        
        // Body Temperature
        group.enter()
        queryLatest(.bodyTemperature) { value in
            if let v = value { vitals["bodyTemperature"] = round(v * 10) / 10 }
            group.leave()
        }
        
        // Blood Glucose
        group.enter()
        queryLatest(.bloodGlucose) { value in
            if let v = value { vitals["bloodGlucose"] = round(v * 10) / 10 }
            group.leave()
        }
        
        // Weight
        group.enter()
        queryLatest(.bodyMass) { value in
            if let v = value { body["weightKg"] = round(v * 10) / 10 }
            group.leave()
        }
        
        // Height
        group.enter()
        queryLatest(.height) { value in
            if let v = value { body["heightCm"] = Int(v * 100) }
            group.leave()
        }
        
        // Body Fat
        group.enter()
        queryLatest(.bodyFatPercentage) { value in
            if let v = value { body["bodyFatPct"] = round(v * 1000) / 10 }
            group.leave()
        }
        
        // Sleep
        group.enter()
        querySleep(from: yesterday, to: now) { duration, startTime, endTime in
            if let dur = duration {
                sleep["durationMin"] = Int(dur / 60)
                if let start = startTime, let end = endTime {
                    let formatter = DateFormatter()
                    formatter.dateFormat = "HH:mm"
                    sleep["sleepStart"] = formatter.string(from: start)
                    sleep["wakeTime"] = formatter.string(from: end)
                }
            }
            group.leave()
        }
        
        // Mindfulness
        group.enter()
        queryMindfulness(from: startOfDay, to: now) { minutes, sessions in
            if let m = minutes {
                wellness["mindfulnessMinutes"] = m
                wellness["mindfulnessSessions"] = sessions
            }
            group.leave()
        }
        
        group.notify(queue: .main) {
            if !activity.isEmpty { result["activity"] = activity }
            if !vitals.isEmpty { result["vitals"] = vitals }
            if !body.isEmpty { result["body"] = body }
            if !sleep.isEmpty { result["sleep"] = ["main": sleep] }
            if !wellness.isEmpty { result["wellness"] = wellness }
            
            call.resolve(result)
        }
    }
    
    // Query sleep history for the last N days (for Life Rhythm artifact)
    @objc func querySleepHistory(_ call: CAPPluginCall) {
        guard HKHealthStore.isHealthDataAvailable() else {
            call.reject("HealthKit is not available")
            return
        }
        
        let days = call.getInt("days") ?? 14
        let now = Date()
        let calendar = Calendar.current
        let startDate = calendar.date(byAdding: .day, value: -days, to: calendar.startOfDay(for: now)) ?? now
        
        guard let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis) else {
            call.resolve(["records": []])
            return
        }
        
        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: now, options: .strictStartDate)
        let sortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierEndDate, ascending: false)
        
        let query = HKSampleQuery(sampleType: sleepType, predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: [sortDescriptor]) { _, samples, error in
            DispatchQueue.main.async {
                guard let samples = samples as? [HKCategorySample], !samples.isEmpty else {
                    call.resolve(["records": []])
                    return
                }
                
                // Group samples by date (wake date)
                var dailySleep: [String: (duration: TimeInterval, sleepStart: Date?, wakeTime: Date?)] = [:]
                let dateFormatter = DateFormatter()
                dateFormatter.dateFormat = "yyyy-MM-dd"
                let timeFormatter = DateFormatter()
                timeFormatter.dateFormat = "HH:mm"
                
                for sample in samples {
                    // Skip "awake" periods
                    if sample.value == HKCategoryValueSleepAnalysis.awake.rawValue {
                        continue
                    }
                    
                    // Use wake date as the key (end date of sleep)
                    let wakeDate = dateFormatter.string(from: sample.endDate)
                    let duration = sample.endDate.timeIntervalSince(sample.startDate)
                    
                    if var existing = dailySleep[wakeDate] {
                        existing.duration += duration
                        if existing.sleepStart == nil || sample.startDate < existing.sleepStart! {
                            existing.sleepStart = sample.startDate
                        }
                        if existing.wakeTime == nil || sample.endDate > existing.wakeTime! {
                            existing.wakeTime = sample.endDate
                        }
                        dailySleep[wakeDate] = existing
                    } else {
                        dailySleep[wakeDate] = (duration: duration, sleepStart: sample.startDate, wakeTime: sample.endDate)
                    }
                }
                
                // Convert to array of records
                var records: [[String: Any]] = []
                for (date, data) in dailySleep {
                    if data.duration > 0, let sleepStart = data.sleepStart, let wakeTime = data.wakeTime {
                        records.append([
                            "date": date,
                            "sleepStart": timeFormatter.string(from: sleepStart),
                            "wakeTime": timeFormatter.string(from: wakeTime),
                            "durationMin": Int(data.duration / 60)
                        ])
                    }
                }
                
                // Sort by date descending
                records.sort { ($0["date"] as? String ?? "") > ($1["date"] as? String ?? "") }
                
                call.resolve(["records": records])
            }
        }
        healthStore.execute(query)
    }
    
    private func queryLatest(_ identifier: HKQuantityTypeIdentifier, completion: @escaping (Double?) -> Void) {
        guard let type = HKQuantityType.quantityType(forIdentifier: identifier) else {
            completion(nil)
            return
        }
        
        let sortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierEndDate, ascending: false)
        let query = HKSampleQuery(sampleType: type, predicate: nil, limit: 1, sortDescriptors: [sortDescriptor]) { _, samples, _ in
            guard let sample = samples?.first as? HKQuantitySample else {
                completion(nil)
                return
            }
            
            let unit = self.unitFor(identifier)
            let value = sample.quantity.doubleValue(for: unit)
            completion(value)
        }
        healthStore.execute(query)
    }
    
    private func querySum(_ identifier: HKQuantityTypeIdentifier, from: Date, to: Date, completion: @escaping (Double?) -> Void) {
        guard let type = HKQuantityType.quantityType(forIdentifier: identifier) else {
            completion(nil)
            return
        }
        
        let predicate = HKQuery.predicateForSamples(withStart: from, end: to, options: .strictStartDate)
        let query = HKStatisticsQuery(quantityType: type, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, stats, _ in
            let unit = self.unitFor(identifier)
            let value = stats?.sumQuantity()?.doubleValue(for: unit)
            completion(value)
        }
        healthStore.execute(query)
    }
    
    private func querySleep(from: Date, to: Date, completion: @escaping (Double?, Date?, Date?) -> Void) {
        guard let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis) else {
            completion(nil, nil, nil)
            return
        }
        
        let predicate = HKQuery.predicateForSamples(withStart: from, end: to, options: .strictStartDate)
        let sortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierEndDate, ascending: false)
        
        let query = HKSampleQuery(sampleType: sleepType, predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: [sortDescriptor]) { _, samples, _ in
            guard let samples = samples as? [HKCategorySample], !samples.isEmpty else {
                completion(nil, nil, nil)
                return
            }
            
            var totalDuration: TimeInterval = 0
            var sleepStart: Date? = nil
            var wakeTime: Date? = nil
            
            for sample in samples {
                if sample.value != HKCategoryValueSleepAnalysis.awake.rawValue {
                    totalDuration += sample.endDate.timeIntervalSince(sample.startDate)
                    if sleepStart == nil || sample.startDate < sleepStart! {
                        sleepStart = sample.startDate
                    }
                    if wakeTime == nil || sample.endDate > wakeTime! {
                        wakeTime = sample.endDate
                    }
                }
            }
            
            completion(totalDuration > 0 ? totalDuration : nil, sleepStart, wakeTime)
        }
        healthStore.execute(query)
    }
    
    private func queryMindfulness(from: Date, to: Date, completion: @escaping (Int?, Int) -> Void) {
        guard let mindfulType = HKObjectType.categoryType(forIdentifier: .mindfulSession) else {
            completion(nil, 0)
            return
        }
        
        let predicate = HKQuery.predicateForSamples(withStart: from, end: to, options: .strictStartDate)
        
        let query = HKSampleQuery(sampleType: mindfulType, predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: nil) { _, samples, _ in
            guard let samples = samples as? [HKCategorySample], !samples.isEmpty else {
                completion(nil, 0)
                return
            }
            
            var totalMinutes = 0
            for sample in samples {
                totalMinutes += Int(sample.endDate.timeIntervalSince(sample.startDate) / 60)
            }
            
            completion(totalMinutes, samples.count)
        }
        healthStore.execute(query)
    }
    
    private func unitFor(_ identifier: HKQuantityTypeIdentifier) -> HKUnit {
        switch identifier {
        case .heartRate, .restingHeartRate, .respiratoryRate:
            return HKUnit.count().unitDivided(by: .minute())
        case .heartRateVariabilitySDNN:
            return .secondUnit(with: .milli)
        case .stepCount:
            return .count()
        case .activeEnergyBurned:
            return .kilocalorie()
        case .vo2Max:
            return HKUnit(from: "ml/kg*min")
        case .oxygenSaturation, .bodyFatPercentage:
            return .percent()
        case .bodyTemperature:
            return .degreeCelsius()
        case .bodyMass:
            return .gramUnit(with: .kilo)
        case .height:
            return .meter()
        case .bloodGlucose:
            return HKUnit(from: "mmol/L")
        default:
            return .count()
        }
    }
}
