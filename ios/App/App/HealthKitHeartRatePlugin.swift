import Foundation
import Capacitor
import HealthKit
import UserNotifications
import WebKit
import UIKit
import PDFKit

@objc(HealthKitHeartRatePlugin)
public class HealthKitHeartRatePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "HealthKitHeartRatePlugin"
    public let jsName = "HealthKitHeartRate"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "isAvailable", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "requestAuthorization", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "requestFullAuthorization", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getAgeBand", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "queryHeartRate", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "queryAllHealthData", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "querySleepHistory", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "queryBaseline", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "queryBaselineCorridors", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setAnomalyStrings", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "startAnomalyMonitoring", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "scheduleTestPush", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "exportPdf", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "exportHtml", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "startRealtimeMonitoring", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stopRealtimeMonitoring", returnType: CAPPluginReturnPromise)
    ]
    
    private let healthStore = HKHealthStore()
    private var anchoredQuery: HKAnchoredObjectQuery?
    private var queryAnchor: HKQueryAnchor?
    private var anomalyObservers: [HKObserverQuery] = []   // retained for background delivery
    private var anomalyEvaluating = false                  // re-entrancy guard
    // PDF export (timeline report) — retained until the offscreen webview finishes.
    private var pdfWebView: WKWebView?
    private var pdfCall: CAPPluginCall?
    private var pdfFileName: String = "ONDA.pdf"
    private var pdfAttachments: [(name: String, data: Data)] = []   // files to embed in the PDF
    
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
        
        var typesToRead: Set<HKObjectType> = [heartRateType]
        // HRV (SDNN) powers the resting-HRV trend on the home screen. Reading
        // it requires read authorization — otherwise HealthKit returns zero
        // samples (read status is hidden for privacy) and the trend never fills.
        if let hrv = HKQuantityType.quantityType(forIdentifier: .heartRateVariabilitySDNN) {
            typesToRead.insert(hrv)
        }

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
        // HRV (SDNN) for the resting-HRV trend on the home screen.
        if let hrv = HKQuantityType.quantityType(forIdentifier: .heartRateVariabilitySDNN) {
            typesToRead.insert(hrv)
        }
        // Resting HR + respiratory rate: the 14-day baseline opened on first watch connect.
        if let restingHR = HKQuantityType.quantityType(forIdentifier: .restingHeartRate) {
            typesToRead.insert(restingHR)
        }
        if let respiratory = HKQuantityType.quantityType(forIdentifier: .respiratoryRate) {
            typesToRead.insert(respiratory)
        }
        // Baseline extras around the figure (v21): walking pulse, VO2max, 1-min recovery.
        // Peak reuses .heartRate (already added above). Each is best-effort — absent
        // data collapses the card slot, so requesting them never fabricates a number.
        if let walking = HKQuantityType.quantityType(forIdentifier: .walkingHeartRateAverage) {
            typesToRead.insert(walking)
        }
        if let vo2 = HKQuantityType.quantityType(forIdentifier: .vo2Max) {
            typesToRead.insert(vo2)
        }
        if #available(iOS 16.0, *), let recovery = HKQuantityType.quantityType(forIdentifier: .heartRateRecoveryOneMinute) {
            typesToRead.insert(recovery)
        }

        typesToRead.insert(HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!)

        // Date of birth — a CHARACTERISTIC type, so it rides in the SAME already-shown
        // Health dialog as one extra line (no new screen/prompt). Read once, off-device
        // only as a 10-year age BAND (getAgeBand below) — the exact date is never read
        // into JS, stored, or sent. Powers anonymized "by age" aggregates.
        // ⚠️ Adding this means age is read from Health: the privacy policy must cover
        // "anonymized aggregated analytics for research, including age band from Health",
        // and NSHealthShareUsageDescription already covers the Health read. No new
        // App Privacy "Fitness" type — date of birth is not a fitness quantity.
        if let dob = HKObjectType.characteristicType(forIdentifier: .dateOfBirth) {
            typesToRead.insert(dob)
        }

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

    /// Read date of birth from Health ONCE and return only a coarse 10-year age band
    /// (`20-29`, `30-39`, `40-49`, `50-59`, `60+`, `under-20`, or `unknown`). The exact
    /// date and exact age never leave native — only the band string, for anonymized
    /// aggregate analytics. Returns `unknown` when dob is unset, unauthorized, or on any error.
    @objc func getAgeBand(_ call: CAPPluginCall) {
        guard HKHealthStore.isHealthDataAvailable() else {
            call.resolve(["ageBand": "unknown"])
            return
        }
        do {
            let dob = try healthStore.dateOfBirthComponents()
            let calendar = Calendar(identifier: .gregorian)
            guard let birthDate = calendar.date(from: dob) else {
                call.resolve(["ageBand": "unknown"])
                return
            }
            let years = calendar.dateComponents([.year], from: birthDate, to: Date()).year ?? -1
            let band: String
            switch years {
            case ..<0:    band = "unknown"     // unparseable / future date
            case 0..<20:  band = "under-20"    // kept distinct so minors are excludable
            case 20..<30: band = "20-29"
            case 30..<40: band = "30-39"
            case 40..<50: band = "40-49"
            case 50..<60: band = "50-59"
            default:      band = "60+"
            }
            call.resolve(["ageBand": band])
        } catch {
            // Not authorized, dob not set, or read failed → no signal, not an error.
            call.resolve(["ageBand": "unknown"])
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

        // ⚠️ DORMANT FITNESS READS — the steps / active-energy / VO2Max queries
        // below are NOT in typesToRead (requestAuthorization + requestFullAuthorization
        // authorize only heartRate, heartRateVariabilitySDNN and sleepAnalysis),
        // so HealthKit returns nothing for them. Before adding any of these to
        // typesToRead, in the SAME change you MUST update: the App Store App
        // Privacy labels (this adds the "Fitness" data type), NSHealthShareUsageDescription,
        // and privacy policy §1.1 — fitness data must never start flowing
        // off-device silently, past the declarations.
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

    /// Baseline over the last N days (default 14): per signal (resting HR / HRV-SDNN / respiratory
    /// rate) the daily avg / min / max plus the REAL number of days that carried data. Each signal is
    /// aggregated to ONE value per calendar day first (mean of that day's samples), then avg/min/max
    /// are taken over the daily values — so "min" is the calmest day, "max" the most restless, and
    /// `days` is honest coverage (never claimed higher than what HealthKit actually held). Read-only;
    /// nothing leaves the device.
    @objc func queryBaseline(_ call: CAPPluginCall) {
        guard HKHealthStore.isHealthDataAvailable() else {
            call.reject("HealthKit is not available")
            return
        }

        let days = call.getInt("days") ?? 14
        let now = Date()
        let calendar = Calendar.current
        let startDate = calendar.date(byAdding: .day, value: -days, to: calendar.startOfDay(for: now)) ?? now

        let signals: [(key: String, id: HKQuantityTypeIdentifier)] = [
            ("rhr", .restingHeartRate),
            ("hrv", .heartRateVariabilitySDNN),
            ("rr", .respiratoryRate),
        ]

        var result: [String: Any] = [:]
        var extras: [String: Any] = [:]
        let bpm = HKUnit.count().unitDivided(by: .minute())
        let group = DispatchGroup()

        for signal in signals {
            group.enter()
            queryDailyStats(signal.id, from: startDate, to: now) { avg, minV, maxV, dayCount in
                // Marshal every write onto main so the shared dict isn't raced by the background queries.
                DispatchQueue.main.async {
                    var entry: [String: Any] = ["days": dayCount]
                    if let avg = avg { entry["avg"] = avg }
                    if let minV = minV { entry["min"] = minV }
                    if let maxV = maxV { entry["max"] = maxV }
                    result[signal.key] = entry
                    group.leave()
                }
            }
        }

        // Single-value extras (v21 figure surrounds): peak, walking pulse, VO2max, recovery.
        // Best-effort — a nil (no data / not authorized) leaves the slot out; never invented.
        group.enter()
        queryDiscreteMax(.heartRate, from: startDate, to: now) { peak in
            DispatchQueue.main.async {
                if let peak = peak { extras["hrpeak"] = peak }
                group.leave()
            }
        }
        group.enter()
        queryDailyStats(.walkingHeartRateAverage, from: startDate, to: now) { avg, _, _, _ in
            DispatchQueue.main.async {
                if let avg = avg { extras["whr"] = avg }
                group.leave()
            }
        }
        group.enter()
        queryDailyStats(.vo2Max, from: startDate, to: now) { avg, _, _, _ in
            DispatchQueue.main.async {
                if let avg = avg { extras["vo2"] = avg }
                group.leave()
            }
        }
        if #available(iOS 16.0, *) {
            group.enter()
            queryDailyStats(.heartRateRecoveryOneMinute, from: startDate, to: now, unitOverride: bpm) { avg, _, _, _ in
                DispatchQueue.main.async {
                    if let avg = avg { extras["hrr"] = avg }
                    group.leave()
                }
            }
        }

        group.notify(queue: .main) {
            result["extras"] = extras
            call.resolve(result)
        }
    }

    /// Per-NIGHT values for the anomaly corridors (retention step 4). For each
    /// signal returns the clean nightly values (oldest-first) after dropping
    /// NOISY nights — a night with too few samples (watch off / poor contact /
    /// broken data) is excluded, because a noisy night misread as a deviation is
    /// the main source of false alarms (task §1). JS builds mean±SD + evaluates
    /// the latest night against the corridor of the prior ones.
    @objc func queryBaselineCorridors(_ call: CAPPluginCall) {
        guard HKHealthStore.isHealthDataAvailable() else {
            call.reject("HealthKit is not available")
            return
        }
        let days = call.getInt("days") ?? 30
        let now = Date()
        let calendar = Calendar.current
        let startDate = calendar.date(byAdding: .day, value: -days, to: calendar.startOfDay(for: now)) ?? now

        // Per-signal noise floor + whether to restrict to overnight hours.
        //  rhr: Apple's daily resting-HR is one authoritative, rest-derived value
        //       per day → 1 sample/day is valid (no min-count exclusion).
        //  rr:  respiratory rate is only recorded during sleep → already night;
        //       drop nights with < 3 samples (poor coverage).
        //  hrv: SDNN can occur anytime → keep only overnight samples, drop nights
        //       with < 3 (too sparse to trust).
        let signals: [(key: String, id: HKQuantityTypeIdentifier, minSamples: Int, nightOnly: Bool)] = [
            ("rhr", .restingHeartRate, 1, false),
            ("hrv", .heartRateVariabilitySDNN, 3, true),
            ("rr", .respiratoryRate, 3, false),
        ]

        var result: [String: Any] = [:]
        let group = DispatchGroup()
        for signal in signals {
            group.enter()
            queryNightlyValues(signal.id, from: startDate, to: now, minSamples: signal.minSamples, nightOnly: signal.nightOnly) { values in
                DispatchQueue.main.async {
                    result[signal.key] = ["values": values, "validNights": values.count]
                    group.leave()
                }
            }
        }
        group.notify(queue: .main) { call.resolve(result) }
    }

    /// All samples in [from, to] → one mean value per night, keeping only nights
    /// with ≥ minSamples (noise exclusion). `nightOnly` keeps just overnight
    /// samples (local hour < 9), for signals that also fire in daytime (HRV).
    /// Returns the clean nightly means oldest-first.
    private func queryNightlyValues(_ identifier: HKQuantityTypeIdentifier, from: Date, to: Date, minSamples: Int, nightOnly: Bool, completion: @escaping ([Double]) -> Void) {
        guard let type = HKQuantityType.quantityType(forIdentifier: identifier) else {
            completion([])
            return
        }
        let predicate = HKQuery.predicateForSamples(withStart: from, end: to, options: .strictStartDate)
        let query = HKSampleQuery(sampleType: type, predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: nil) { _, samples, _ in
            guard let samples = samples as? [HKQuantitySample], !samples.isEmpty else {
                completion([])
                return
            }
            let unit = self.unitFor(identifier)
            let calendar = Calendar.current
            let dateFormatter = DateFormatter()
            dateFormatter.dateFormat = "yyyy-MM-dd"

            var daySum: [String: Double] = [:]
            var dayN: [String: Int] = [:]
            for sample in samples {
                if nightOnly {
                    let hour = calendar.component(.hour, from: sample.endDate)
                    if hour >= 9 { continue } // keep only overnight → morning
                }
                let day = dateFormatter.string(from: sample.endDate)
                daySum[day, default: 0] += sample.quantity.doubleValue(for: unit)
                dayN[day, default: 0] += 1
            }
            // Keep nights that clear the noise floor, ordered oldest-first.
            let kept = daySum.keys
                .filter { (dayN[$0] ?? 0) >= minSamples }
                .sorted()
                .map { daySum[$0]! / Double(dayN[$0]!) }
            completion(kept)
        }
        healthStore.execute(query)
    }

    // ── Anomaly PUSH (retention step 4, Phase C) ────────────────────────────
    // The JS layer owns the wording (5 languages), so it hands us the current
    // localized template + metric names to store; the background check fills in
    // the numbers. Tokens are i18next-style ({{metric}} {{value}} {{lo}} {{hi}}).
    @objc func setAnomalyStrings(_ call: CAPPluginCall) {
        let d = UserDefaults.standard
        d.set(call.getString("title") ?? "ONDA", forKey: "anomaly_title")
        d.set(call.getString("pushIntro") ?? "", forKey: "anomaly_push_intro")
        d.set(call.getString("pushShort") ?? "", forKey: "anomaly_push_short")
        call.resolve(["ok": true])
    }

    /// Register HealthKit background delivery + observers so the app is woken in
    /// the morning when the night's data syncs; the observer evaluates the
    /// corridor and posts a local notification if it deviates (throttled 2 days).
    @objc func startAnomalyMonitoring(_ call: CAPPluginCall) {
        guard HKHealthStore.isHealthDataAvailable() else { call.resolve(["started": false]); return }
        // NOTE: notification authorization is requested by intent in
        // PermissionSetupModal (JS), NOT here — this only wires up observers so it
        // must never prompt.
        let ids: [HKQuantityTypeIdentifier] = [.restingHeartRate, .heartRateVariabilitySDNN, .respiratoryRate]
        // Clear any previous observers (idempotent across app starts).
        for obs in anomalyObservers { healthStore.stop(obs) }
        anomalyObservers.removeAll()

        for id in ids {
            guard let type = HKQuantityType.quantityType(forIdentifier: id) else { continue }
            let observer = HKObserverQuery(sampleType: type, predicate: nil) { [weak self] _, completion, _ in
                self?.evaluateAnomalyAndNotify { completion() }
            }
            healthStore.execute(observer)
            anomalyObservers.append(observer)
            healthStore.enableBackgroundDelivery(for: type, frequency: .hourly) { _, _ in }
        }
        call.resolve(["started": true])
    }

    /// Background corridor check + local notification. Mirrors src/lib/anomaly.ts
    /// (STRICT gate) — keep the thresholds in sync with that file.
    private func evaluateAnomalyAndNotify(_ done: @escaping () -> Void) {
        if anomalyEvaluating { done(); return }
        anomalyEvaluating = true
        let finish = { [weak self] in self?.anomalyEvaluating = false; done() }

        let now = Date()
        let calendar = Calendar.current
        let start = calendar.date(byAdding: .day, value: -30, to: calendar.startOfDay(for: now)) ?? now
        let signals: [(key: String, id: HKQuantityTypeIdentifier, minSamples: Int, nightOnly: Bool)] = [
            ("rhr", .restingHeartRate, 1, false),
            ("hrv", .heartRateVariabilitySDNN, 3, true),
            ("rr", .respiratoryRate, 3, false),
        ]
        var byKey: [String: [Double]] = [:]
        let group = DispatchGroup()
        for s in signals {
            group.enter()
            queryNightlyValues(s.id, from: start, to: now, minSamples: s.minSamples, nightOnly: s.nightOnly) { values in
                byKey[s.key] = values
                group.leave()
            }
        }
        group.notify(queue: .main) { [weak self] in
            guard let self = self else { finish(); return }
            // Throttle: ≤ 1 push / 2 days.
            let last = UserDefaults.standard.double(forKey: "anomaly_last_signal_at")
            if last > 0 && now.timeIntervalSince1970 - last < 2 * 24 * 60 * 60 { finish(); return }

            var best: (metric: String, latest: Double, lo: Double, hi: Double, mag: Double)? = nil
            for s in signals {
                guard let hit = self.nativeDetectAnomaly(byKey[s.key] ?? [], metric: s.key) else { continue }
                if best == nil || hit.mag > best!.mag { best = hit }
            }
            guard let a = best else { finish(); return }
            UserDefaults.standard.set(now.timeIntervalSince1970, forKey: "anomaly_last_signal_at")
            self.postAnomalyNotification(metric: a.metric, value: a.latest, lo: a.lo, hi: a.hi)
            finish()
        }
    }

    /// STRICT gate (mirror of anomaly.ts): ≥8 nights (7 prior + latest), ≥1.5 SD
    /// out AND the metric floor. Returns nil unless it clears both.
    private func nativeDetectAnomaly(_ values: [Double], metric: String) -> (metric: String, latest: Double, lo: Double, hi: Double, mag: Double)? {
        guard values.count >= 8 else { return nil }
        let latest = values.last!
        let prior = Array(values.dropLast())
        let mean = prior.reduce(0, +) / Double(prior.count)
        let variance = prior.reduce(0) { $0 + pow($1 - mean, 2) } / Double(prior.count - 1)
        let sd = variance.squareRoot()
        guard sd > 0 else { return nil }
        let delta = latest - mean
        let mag = abs(delta) / sd
        guard mag >= 1.5 else { return nil }
        var crosses = false
        switch metric {
        case "rhr": crosses = delta > 0 && delta >= 5
        case "rr": crosses = delta > 0 && delta >= 2
        case "hrv": crosses = delta < 0 && mean > 0 && (-delta / mean) >= 0.15
        default: break
        }
        guard crosses else { return nil }
        return (metric, (latest * 10).rounded() / 10, ((mean - sd) * 10).rounded() / 10, ((mean + sd) * 10).rounded() / 10, mag)
    }

    private func postAnomalyNotification(metric: String, value: Double, lo: Double, hi: Double) {
        let d = UserDefaults.standard
        // The push carries NO numbers (those are in the in-app card). It just
        // varies by how many signals have fired: intro for the first 3, short
        // after (task §4).
        let count = d.integer(forKey: "anomaly_push_count") + 1
        d.set(count, forKey: "anomaly_push_count")
        let intro = d.string(forKey: "anomaly_push_intro") ?? "Your body signalled last night. Take a look."
        let short = d.string(forKey: "anomaly_push_short") ?? "There's a fresh signal."

        let content = UNMutableNotificationContent()
        content.title = d.string(forKey: "anomaly_title") ?? "ONDA"
        content.body = count <= 3 ? intro : short
        content.sound = .default
        content.userInfo = ["anomaly_metric": metric]
        // Time-sensitive → breaks through Focus/DND and shows as prominently and
        // as long as iOS allows an app to make it (the app CANNOT force a banner to
        // stay until tapped — that's the user's "Persistent" banner style — but the
        // notification itself stays in Notification Center until acted on).
        if #available(iOS 15.0, *) { content.interruptionLevel = .timeSensitive }
        let req = UNNotificationRequest(identifier: "onda_anomaly", content: content, trigger: nil) // deliver now
        UNUserNotificationCenter.current().add(req, withCompletionHandler: nil)
    }

    // Post a time-sensitive local notification after a delay — used by the internal
    // signal test mode to verify the background push (foreground code can't show the
    // banner, so schedule it and background the app). Same interruption level as the
    // real anomaly push.
    @objc func scheduleTestPush(_ call: CAPPluginCall) {
        let title = call.getString("title") ?? "ONDA"
        let body = call.getString("body") ?? "Signal"
        let delay = max(1.0, call.getDouble("delaySeconds") ?? 8.0)
        let content = UNMutableNotificationContent()
        content.title = title
        content.body = body
        content.sound = .default
        content.userInfo = ["simulated": true]
        if #available(iOS 15.0, *) { content.interruptionLevel = .timeSensitive }
        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: delay, repeats: false)
        let req = UNNotificationRequest(identifier: "onda_anomaly_test_\(Int(Date().timeIntervalSince1970))", content: content, trigger: trigger)
        UNUserNotificationCenter.current().add(req) { err in
            if let err = err { call.reject("schedule failed: \(err.localizedDescription)") } else { call.resolve(["ok": true]) }
        }
    }

    // ── Timeline PDF export (task 81) ───────────────────────────────────────
    // Render a localized HTML report to a PDF ON-DEVICE (WKWebView → A4 pages,
    // real text so Cyrillic/CJK work), then open the native share sheet. No
    // server, no email collection — the health data never leaves the phone.
    // Export a SELF-CONTAINED HTML report (audio embedded as data: URIs → each
    // voice note has an inline <audio> player). Written to a temp .html file and
    // shared; opening it in a browser plays the recordings in place — the only way
    // to get one file with playable audio on iOS (a PDF cannot play/attach audio).
    @objc func exportHtml(_ call: CAPPluginCall) {
        guard let html = call.getString("html") else { call.reject("Missing html"); return }
        let fileName = call.getString("fileName") ?? "ONDA-report.html"
        DispatchQueue.main.async {
            let url = FileManager.default.temporaryDirectory.appendingPathComponent(fileName)
            do {
                try html.data(using: .utf8)?.write(to: url)
            } catch {
                call.reject("HTML write failed: \(error.localizedDescription)")
                return
            }
            CAPLog.print("[exportHtml] wrote \(fileName), \(html.utf8.count) bytes")
            if let vc = self.bridge?.viewController {
                let av = UIActivityViewController(activityItems: [url], applicationActivities: nil)
                if let pop = av.popoverPresentationController {
                    pop.sourceView = vc.view
                    pop.sourceRect = CGRect(x: vc.view.bounds.midX, y: vc.view.bounds.midY, width: 0, height: 0)
                    pop.permittedArrowDirections = []
                }
                vc.present(av, animated: true, completion: nil)
            }
            call.resolve(["ok": true, "path": url.path])
        }
    }

    @objc func exportPdf(_ call: CAPPluginCall) {
        guard let html = call.getString("html") else { call.reject("Missing html"); return }
        let fileName = call.getString("fileName") ?? "ONDA-timeline.pdf"
        // Optional files (e.g. voice recordings) to ship with the report. Parse
        // robustly: each item is a JSObject ([String: JSValue]); a blanket
        // `as? [[String: Any]]` cast silently fails and drops everything.
        var attachments: [(name: String, data: Data)] = []
        if let arr = call.getArray("attachments") {
            for item in arr {
                guard let obj = item as? JSObject,
                      let name = obj["name"] as? String,
                      let b64 = obj["data"] as? String,
                      let data = Data(base64Encoded: b64), !data.isEmpty else { continue }
                attachments.append((name: name, data: data))
            }
        }
        CAPLog.print("[exportPdf] attachments parsed: \(attachments.count)")
        DispatchQueue.main.async {
            let webView = WKWebView(frame: CGRect(x: 0, y: 0, width: 595, height: 842))
            webView.navigationDelegate = self
            self.pdfWebView = webView
            self.pdfCall = call
            self.pdfFileName = fileName
            self.pdfAttachments = attachments
            webView.loadHTMLString(html, baseURL: nil)
        }
    }

    /// The single peak value over [from, to] (true max sample, not a daily mean).
    private func queryDiscreteMax(_ identifier: HKQuantityTypeIdentifier, from: Date, to: Date, completion: @escaping (Double?) -> Void) {
        guard let type = HKQuantityType.quantityType(forIdentifier: identifier) else {
            completion(nil)
            return
        }
        let predicate = HKQuery.predicateForSamples(withStart: from, end: to, options: .strictStartDate)
        let query = HKStatisticsQuery(quantityType: type, quantitySamplePredicate: predicate, options: .discreteMax) { _, stats, _ in
            let unit = self.unitFor(identifier)
            completion(stats?.maximumQuantity()?.doubleValue(for: unit))
        }
        healthStore.execute(query)
    }

    /// Aggregation helper: all samples in [from, to] → one value per calendar day (mean of the day's
    /// samples), then avg/min/max over those daily values, plus the count of days with data.
    private func queryDailyStats(_ identifier: HKQuantityTypeIdentifier, from: Date, to: Date, unitOverride: HKUnit? = nil, completion: @escaping (Double?, Double?, Double?, Int) -> Void) {
        guard let type = HKQuantityType.quantityType(forIdentifier: identifier) else {
            completion(nil, nil, nil, 0)
            return
        }

        let predicate = HKQuery.predicateForSamples(withStart: from, end: to, options: .strictStartDate)
        let query = HKSampleQuery(sampleType: type, predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: nil) { _, samples, _ in
            guard let samples = samples as? [HKQuantitySample], !samples.isEmpty else {
                completion(nil, nil, nil, 0)
                return
            }

            let unit = unitOverride ?? self.unitFor(identifier)
            let dateFormatter = DateFormatter()
            dateFormatter.dateFormat = "yyyy-MM-dd"

            // Sum + count per calendar day → daily mean.
            var daySum: [String: Double] = [:]
            var dayN: [String: Int] = [:]
            for sample in samples {
                let day = dateFormatter.string(from: sample.endDate)
                let value = sample.quantity.doubleValue(for: unit)
                daySum[day, default: 0] += value
                dayN[day, default: 0] += 1
            }

            let dailyValues = daySum.map { key, sum in sum / Double(dayN[key] ?? 1) }
            guard !dailyValues.isEmpty else {
                completion(nil, nil, nil, 0)
                return
            }

            let avg = dailyValues.reduce(0, +) / Double(dailyValues.count)
            completion(avg, dailyValues.min(), dailyValues.max(), dailyValues.count)
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
        case .heartRate, .restingHeartRate, .respiratoryRate, .walkingHeartRateAverage:
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

// MARK: - Timeline PDF: render the offscreen webview to A4 pages, then share.
extension HealthKitHeartRatePlugin: WKNavigationDelegate {
    public func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        guard webView == pdfWebView else { return }
        // Let late layout / fonts settle before paginating.
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) { [weak self] in
            self?.finishPdf(webView)
        }
    }

    public func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        guard webView == pdfWebView else { return }
        pdfCall?.reject("PDF load failed: \(error.localizedDescription)")
        pdfWebView = nil; pdfCall = nil
    }

    private func finishPdf(_ webView: WKWebView) {
        let call = pdfCall
        let pageSize = CGRect(x: 0, y: 0, width: 595.2, height: 841.8)   // A4 @72dpi
        let printable = pageSize.insetBy(dx: 36, dy: 40)
        let render = UIPrintPageRenderer()
        render.addPrintFormatter(webView.viewPrintFormatter(), startingAtPageAt: 0)
        render.setValue(pageSize, forKey: "paperRect")
        render.setValue(printable, forKey: "printableRect")

        let pdfData = NSMutableData()
        UIGraphicsBeginPDFContextToData(pdfData, pageSize, nil)
        let pages = max(render.numberOfPages, 1)
        for i in 0..<pages {
            UIGraphicsBeginPDFPage()
            render.drawPage(at: i, in: UIGraphicsGetPDFContextBounds())
        }
        UIGraphicsEndPDFContext()

        // Share the report PLUS the voice recordings as SEPARATE playable files in
        // the same share sheet. We do NOT embed audio into the PDF: iOS PDF viewers
        // can neither play embedded audio nor even surface PDF file attachments, so
        // an embedded copy is invisible/unusable to the user — separate .m4a files
        // are the only way the voice is actually reachable and playable on iOS.
        let attachments = pdfAttachments
        let url = FileManager.default.temporaryDirectory.appendingPathComponent(pdfFileName)
        do {
            try (pdfData as Data).write(to: url)
        } catch {
            call?.reject("PDF write failed: \(error.localizedDescription)")
            pdfWebView = nil; pdfCall = nil; pdfAttachments = []
            return
        }

        // The PDF first, then each recording written to its own temp file.
        var items: [Any] = [url]
        do {
            let dir = FileManager.default.temporaryDirectory
            var used = Set<String>()
            for a in attachments {
                var name = a.name.isEmpty ? "voice.m4a" : a.name
                if used.contains(name) {   // keep the extension, prefix a counter
                    var i = 1
                    var candidate = "\(i)-\(name)"
                    while used.contains(candidate) { i += 1; candidate = "\(i)-\(name)" }
                    name = candidate
                }
                used.insert(name)
                let aURL = dir.appendingPathComponent(name)
                do { try a.data.write(to: aURL); items.append(aURL) }
                catch { CAPLog.print("[exportPdf] failed to write \(name): \(error.localizedDescription)") }
            }
        }
        let attached = 0
        CAPLog.print("[exportPdf] sharing \(items.count) item(s): 1 pdf + \(items.count - 1) voice file(s)")

        if let vc = self.bridge?.viewController {
            let av = UIActivityViewController(activityItems: items, applicationActivities: nil)
            if let pop = av.popoverPresentationController {   // iPad
                pop.sourceView = vc.view
                pop.sourceRect = CGRect(x: vc.view.bounds.midX, y: vc.view.bounds.midY, width: 0, height: 0)
                pop.permittedArrowDirections = []
            }
            vc.present(av, animated: true, completion: nil)
        }
        call?.resolve(["ok": true, "path": url.path, "attached": attached, "sharedFiles": items.count])
        pdfWebView = nil; pdfCall = nil; pdfAttachments = []
    }

    // MARK: PDF attachment embedding (incremental update)
    //
    // iOS has NO public API to add embedded-file attachments to a PDF (neither
    // Core Graphics PDF nor PDFKit expose the /EmbeddedFiles name tree). So we
    // append a standards-compliant INCREMENTAL UPDATE by hand: new objects for
    // each file stream + Filespec, an EmbeddedFiles name tree, and a rewritten
    // Catalog that points /Names at it (plus /AF for PDF/A-3 readers). The base
    // bytes are never touched — only appended to — and the caller re-opens the
    // result with PDFDocument to prove it's valid before sharing, falling back to
    // the untouched base PDF otherwise. Returns nil if the base can't be parsed.
    private func embedAttachments(into base: Data, files: [(name: String, data: Data)]) -> Data? {
        let bytes = [UInt8](base)
        func asciiIndexOfLast(_ needle: String, in hay: [UInt8]) -> Int? {
            let n = [UInt8](needle.utf8)
            guard !n.isEmpty, hay.count >= n.count else { return nil }
            var i = hay.count - n.count
            while i >= 0 {
                var ok = true
                for j in 0..<n.count where hay[i + j] != n[j] { ok = false; break }
                if ok { return i }
                i -= 1
            }
            return nil
        }
        // 1) Locate the previous startxref offset and the trailer's /Root + /Size.
        guard let sxIdx = asciiIndexOfLast("startxref", in: bytes) else { return nil }
        let tail = String(decoding: bytes[sxIdx...], as: UTF8.self)
        let tailNums = tail.components(separatedBy: CharacterSet(charactersIn: " \r\n\t"))
            .compactMap { Int($0) }
        guard let prevStartxref = tailNums.first else { return nil }

        guard let trIdx = asciiIndexOfLast("trailer", in: bytes) else { return nil }
        let trailerStr = String(decoding: bytes[trIdx...], as: UTF8.self)
        // /Root n 0 R
        guard let rootRange = trailerStr.range(of: #"/Root\s+(\d+)\s+\d+\s+R"#, options: .regularExpression) else { return nil }
        let rootMatch = String(trailerStr[rootRange])
        let rootObjNum = rootMatch.components(separatedBy: CharacterSet(charactersIn: " \t\r\n"))
            .compactMap { Int($0) }.first
        guard let catalogNum = rootObjNum else { return nil }
        // /Size n
        let sizeVal: Int = {
            if let r = trailerStr.range(of: #"/Size\s+(\d+)"#, options: .regularExpression) {
                return String(trailerStr[r]).components(separatedBy: CharacterSet(charactersIn: " \t\r\n"))
                    .compactMap { Int($0) }.first ?? 0
            }
            return 0
        }()
        guard sizeVal > 0 else { return nil }
        // Optional /ID [<..><..>] — reuse verbatim if present.
        let idString: String? = {
            if let r = trailerStr.range(of: #"/ID\s*\[[^\]]*\]"#, options: .regularExpression) {
                return String(trailerStr[r])
            }
            return nil
        }()

        // 2) Read the existing Catalog object body so we can re-emit it with /Names.
        guard let catBody = objectDictBody(objNum: catalogNum, in: bytes) else { return nil }
        var catInner = catBody
        if !catInner.contains("/Type") { catInner = "/Type /Catalog " + catInner }

        // 3) Assign new object numbers (the catalog reuses its own number).
        var nextObj = sizeVal
        var fileStreamNums: [Int] = []
        var filespecNums: [Int] = []
        for _ in files { fileStreamNums.append(nextObj); nextObj += 1 }
        for _ in files { filespecNums.append(nextObj); nextObj += 1 }
        let nameTreeNum = nextObj; nextObj += 1
        let newSize = nextObj   // highest new object number + 1
        let order = files.indices.sorted { files[$0].name < files[$1].name }

        // 4) Serialize the incremental update (a leading newline separates it from
        //    the base's trailing %%EOF; its length is counted in every offset).
        var appended = Data()
        appended.append(Data("\n".utf8))          // separator after base's %%EOF
        var offsets: [Int: Int] = [:]
        let baseLen = base.count
        func pdfString(_ s: String) -> String {
            var out = "("
            for ch in s.unicodeScalars {
                if ch == "(" || ch == ")" || ch == "\\" { out.append("\\") }
                out.unicodeScalars.append(ch)
            }
            out.append(")")
            return out
        }
        func emit(_ objNum: Int, _ text: String) {
            offsets[objNum] = baseLen + appended.count
            appended.append(Data(text.utf8))
        }
        func emitStream(_ objNum: Int, header: String, payload: Data) {
            offsets[objNum] = baseLen + appended.count
            appended.append(Data("\(objNum) 0 obj\n\(header)\nstream\n".utf8))
            appended.append(payload)
            appended.append(Data("\nendstream\nendobj\n".utf8))
        }
        for (i, file) in files.enumerated() {
            emitStream(fileStreamNums[i], header: "<< /Type /EmbeddedFile /Length \(file.data.count) >>", payload: file.data)
        }
        for (i, file) in files.enumerated() {
            let nm = pdfString(file.name)
            emit(filespecNums[i], "\(filespecNums[i]) 0 obj\n<< /Type /Filespec /F \(nm) /UF \(nm) /EF << /F \(fileStreamNums[i]) 0 R /UF \(fileStreamNums[i]) 0 R >> /AFRelationship /Supplement >>\nendobj\n")
        }
        var namesArr = ""
        for idx in order { namesArr += "\(pdfString(files[idx].name)) \(filespecNums[idx]) 0 R " }
        emit(nameTreeNum, "\(nameTreeNum) 0 obj\n<< /Names [ \(namesArr)] >>\nendobj\n")
        var afRefs = ""
        for idx in order { afRefs += "\(filespecNums[idx]) 0 R " }
        emit(catalogNum, "\(catalogNum) 0 obj\n<< \(catInner) /Names << /EmbeddedFiles \(nameTreeNum) 0 R >> /AF [ \(afRefs)] >>\nendobj\n")

        func entry(_ off: Int) -> String { String(format: "%010d 00000 n \n", off) }
        var xref = "xref\n\(catalogNum) 1\n" + entry(offsets[catalogNum] ?? 0)
        xref += "\(sizeVal) \(newSize - sizeVal)\n"
        for n in sizeVal..<newSize { xref += entry(offsets[n] ?? 0) }
        let xrefOffset = baseLen + appended.count
        var trailer = "trailer\n<< /Size \(newSize) /Root \(catalogNum) 0 R /Prev \(prevStartxref)"
        if let id = idString { trailer += " " + id }
        trailer += " >>\nstartxref\n\(xrefOffset)\n%%EOF\n"

        var out = base
        out.append(appended)
        out.append(Data(xref.utf8))
        out.append(Data(trailer.utf8))
        return out
    }

    /// Extract the inner text of `objNum 0 obj << ... >> endobj` (the dictionary
    /// body without the enclosing << >>). Handles nested << >> by depth-matching.
    private func objectDictBody(objNum: Int, in bytes: [UInt8]) -> String? {
        let marker = [UInt8]("\(objNum) 0 obj".utf8)
        func isDigit(_ b: UInt8) -> Bool { b >= 0x30 && b <= 0x39 }
        // Find the marker (there may be several "N 0 obj"; take the last, which an
        // incremental base won't have but is safe for a single-rev CG PDF). Require
        // a non-digit before it so "1 0 obj" doesn't match inside "11 0 obj".
        var start: Int? = nil
        var i = 0
        while i <= bytes.count - marker.count {
            var ok = true
            for j in 0..<marker.count where bytes[i + j] != marker[j] { ok = false; break }
            if ok && (i == 0 || !isDigit(bytes[i - 1])) { start = i + marker.count }
            i += 1
        }
        guard var p = start else { return nil }
        // Find the first << after the marker.
        while p < bytes.count - 1, !(bytes[p] == 0x3C && bytes[p + 1] == 0x3C) { p += 1 }
        guard p < bytes.count - 1 else { return nil }
        let dictStart = p + 2
        var depth = 1
        p = dictStart
        while p < bytes.count - 1 {
            if bytes[p] == 0x3C && bytes[p + 1] == 0x3C { depth += 1; p += 2; continue }
            if bytes[p] == 0x3E && bytes[p + 1] == 0x3E { depth -= 1; if depth == 0 { break }; p += 2; continue }
            p += 1
        }
        guard depth == 0, p >= dictStart else { return nil }
        return String(decoding: bytes[dictStart..<p], as: UTF8.self)
    }
}
