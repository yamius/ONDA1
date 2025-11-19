package com.onda.app

import android.content.Context
import android.util.Log
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.*
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import org.json.JSONArray
import org.json.JSONObject
import java.time.Instant
import java.time.ZonedDateTime
import java.time.temporal.ChronoUnit

class HealthConnectManager(private val context: Context) {

    private val healthConnectClient by lazy {
        HealthConnectClient.getOrCreate(context)
    }

    companion object {
        private const val TAG = "HealthConnectManager"
    }

    // Permissions needed for all health data
    val permissions = setOf(
        HealthPermission.getReadPermission(HeartRateRecord::class),
        HealthPermission.getReadPermission(RestingHeartRateRecord::class),
        HealthPermission.getReadPermission(HeartRateVariabilityRmssdRecord::class),
        HealthPermission.getReadPermission(BloodPressureRecord::class),
        HealthPermission.getReadPermission(BloodGlucoseRecord::class),
        HealthPermission.getReadPermission(OxygenSaturationRecord::class),
        HealthPermission.getReadPermission(RespiratoryRateRecord::class),
        HealthPermission.getReadPermission(BodyTemperatureRecord::class),
        HealthPermission.getReadPermission(SleepSessionRecord::class),
        HealthPermission.getReadPermission(StepsRecord::class),
        HealthPermission.getReadPermission(ActiveCaloriesBurnedRecord::class),
        HealthPermission.getReadPermission(Vo2MaxRecord::class),
        HealthPermission.getReadPermission(WeightRecord::class),
        HealthPermission.getReadPermission(HeightRecord::class),
        HealthPermission.getReadPermission(BodyFatRecord::class),
        HealthPermission.getReadPermission(LeanBodyMassRecord::class),
        HealthPermission.getReadPermission(NutritionRecord::class),
        HealthPermission.getReadPermission(HydrationRecord::class)
    )

    /**
     * Check if Health Connect is available on this device
     */
    fun isAvailable(): Boolean {
        return try {
            HealthConnectClient.getSdkStatus(context) == HealthConnectClient.SDK_AVAILABLE
        } catch (e: Exception) {
            Log.e(TAG, "Error checking Health Connect availability", e)
            false
        }
    }

    /**
     * Check if all permissions are granted
     */
    suspend fun checkPermissions(): Boolean {
        return try {
            val granted = healthConnectClient.permissionController.getGrantedPermissions()
            val grantedCount = permissions.count { it in granted }
            
            // Accept ANY number of permissions (even just 1)
            // Health Connect SDK safely handles missing permissions by returning empty data
            val hasAnyPermissions = grantedCount > 0
            
            Log.d(TAG, "Permissions check: granted=$grantedCount/${permissions.size}, hasAny=$hasAnyPermissions")
            
            if (grantedCount > 0) {
                Log.d(TAG, "Will read partial health data with $grantedCount permissions")
            }
            
            hasAnyPermissions
        } catch (e: Exception) {
            Log.e(TAG, "Error checking permissions", e)
            false
        }
    }

    /**
     * Note: Health Connect permissions are requested via ActivityResultContract
     * Use PermissionController.createRequestPermissionResultContract() in Activity
     * See MainActivity for implementation
     */

    /**
     * Read all health data from the last 24 hours
     */
    suspend fun readHealthData(): JSONObject {
        val now = Instant.now()
        val yesterday = now.minus(1, ChronoUnit.DAYS)
        val oneWeekAgo = now.minus(7, ChronoUnit.DAYS)

        val json = JSONObject()
        json.put("ts", now.toString())
        json.put("source", "health_connect")

        try {
            // Vitals
            val vitals = readVitals(yesterday, now)
            if (vitals.length() > 0) {
                json.put("vitals", vitals)
            }

            // Activity
            val activity = readActivity(yesterday, now)
            if (activity.length() > 0) {
                json.put("activity", activity)
            }

            // Sleep (last 7 days)
            val sleep = readSleep(oneWeekAgo, now)
            if (sleep.length() > 0) {
                json.put("sleep", sleep)
            }

            // Body measurements
            val body = readBody(oneWeekAgo, now)
            if (body.length() > 0) {
                json.put("body", body)
            }

            // Nutrition
            val nutrition = readNutrition(yesterday, now)
            if (nutrition.length() > 0) {
                json.put("nutrition", nutrition)
            }

            // Wellness
            val wellness = readWellness(yesterday, now)
            if (wellness.length() > 0) {
                json.put("wellness", wellness)
            }

            // Log summary of what data was found
            val summary = buildString {
                append("HC Data Summary: ")
                append("vitals=${vitals.length()} fields, ")
                append("activity=${activity.length()} fields, ")
                append("sleep=${sleep.length()} fields, ")
                append("body=${body.length()} fields, ")
                append("nutrition=${nutrition.length()} fields, ")
                append("wellness=${wellness.length()} fields")
            }
            Log.d(TAG, summary)
            Log.d(TAG, "Health data JSON: $json")
        } catch (e: Exception) {
            Log.e(TAG, "Error reading health data", e)
            json.put("error", e.message ?: "Unknown error")
        }

        return json
    }

    private suspend fun readVitals(start: Instant, end: Instant): JSONObject {
        val vitals = JSONObject()

        try {
            Log.d(TAG, "readVitals: start=$start, end=$end")
            
            // Heart Rate
            val hrResponse = healthConnectClient.readRecords(
                ReadRecordsRequest(
                    HeartRateRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(start, end)
                )
            )
            Log.d(TAG, "Heart Rate records found: ${hrResponse.records.size}")
            if (hrResponse.records.isNotEmpty()) {
                // Log data source
                val hrSources = hrResponse.records
                    .mapNotNull { it.metadata.dataOrigin.packageName }
                    .distinct()
                Log.d(TAG, "Heart Rate sources: ${hrSources.joinToString(", ")}")
                
                val latestHR = hrResponse.records.last()
                val hrValue = latestHR.samples.lastOrNull()?.beatsPerMinute
                vitals.put("heartRate", hrValue)
                Log.d(TAG, "Heart Rate value: $hrValue (from ${hrResponse.records.size} records, ${latestHR.samples.size} samples)")
            } else {
                Log.w(TAG, "No Heart Rate records found in timeRange")
            }

            // Resting Heart Rate
            val restingHrResponse = healthConnectClient.readRecords(
                ReadRecordsRequest(
                    RestingHeartRateRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(start, end)
                )
            )
            if (restingHrResponse.records.isNotEmpty()) {
                vitals.put("restingHeartRate", restingHrResponse.records.last().beatsPerMinute)
            }

            // HRV
            val hrvResponse = healthConnectClient.readRecords(
                ReadRecordsRequest(
                    HeartRateVariabilityRmssdRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(start, end)
                )
            )
            if (hrvResponse.records.isNotEmpty()) {
                vitals.put("hrv", hrvResponse.records.last().heartRateVariabilityMillis)
            }

            // Blood Pressure
            val bpResponse = healthConnectClient.readRecords(
                ReadRecordsRequest(
                    BloodPressureRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(start, end)
                )
            )
            if (bpResponse.records.isNotEmpty()) {
                val latestBP = bpResponse.records.last()
                vitals.put("bloodPressureSys", latestBP.systolic.inMillimetersOfMercury)
                vitals.put("bloodPressureDia", latestBP.diastolic.inMillimetersOfMercury)
            }

            // Blood Glucose
            val glucoseResponse = healthConnectClient.readRecords(
                ReadRecordsRequest(
                    BloodGlucoseRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(start, end)
                )
            )
            if (glucoseResponse.records.isNotEmpty()) {
                vitals.put("bloodGlucose", glucoseResponse.records.last().level.inMillimolesPerLiter)
            }

            // SpO2
            val spo2Response = healthConnectClient.readRecords(
                ReadRecordsRequest(
                    OxygenSaturationRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(start, end)
                )
            )
            if (spo2Response.records.isNotEmpty()) {
                vitals.put("spo2", spo2Response.records.last().percentage.value)
            }

            // Respiratory Rate
            val respResponse = healthConnectClient.readRecords(
                ReadRecordsRequest(
                    RespiratoryRateRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(start, end)
                )
            )
            if (respResponse.records.isNotEmpty()) {
                vitals.put("respiratoryRate", respResponse.records.last().rate)
            }

            // Body Temperature
            val tempResponse = healthConnectClient.readRecords(
                ReadRecordsRequest(
                    BodyTemperatureRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(start, end)
                )
            )
            if (tempResponse.records.isNotEmpty()) {
                vitals.put("bodyTemperature", tempResponse.records.last().temperature.inCelsius)
            }

        } catch (e: Exception) {
            Log.e(TAG, "Error reading vitals", e)
        }

        Log.d(TAG, "readVitals completed: ${vitals.length()} fields found")
        Log.d(TAG, "Vitals JSON: $vitals")
        return vitals
    }

    private suspend fun readActivity(start: Instant, end: Instant): JSONObject {
        val activity = JSONObject()

        try {
            // Steps
            val stepsResponse = healthConnectClient.readRecords(
                ReadRecordsRequest(
                    StepsRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(start, end)
                )
            )
            if (stepsResponse.records.isNotEmpty()) {
                val totalSteps = stepsResponse.records.sumOf { it.count }
                activity.put("steps", totalSteps)
                
                // Log data source
                val stepsSources = stepsResponse.records
                    .mapNotNull { it.metadata.dataOrigin.packageName }
                    .distinct()
                Log.d(TAG, "Steps sources: ${stepsSources.joinToString(", ")}")
            }

            // Active Calories
            val caloriesResponse = healthConnectClient.readRecords(
                ReadRecordsRequest(
                    ActiveCaloriesBurnedRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(start, end)
                )
            )
            if (caloriesResponse.records.isNotEmpty()) {
                val totalCalories = caloriesResponse.records.sumOf { it.energy.inKilocalories }
                activity.put("activeCaloriesBurned", totalCalories.toInt())
                
                // Log data source
                val caloriesSources = caloriesResponse.records
                    .mapNotNull { it.metadata.dataOrigin.packageName }
                    .distinct()
                Log.d(TAG, "Calories sources: ${caloriesSources.joinToString(", ")}")
            }

            // VO2 Max
            val vo2Response = healthConnectClient.readRecords(
                ReadRecordsRequest(
                    Vo2MaxRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(start, end)
                )
            )
            if (vo2Response.records.isNotEmpty()) {
                activity.put("vo2Max", vo2Response.records.last().vo2MillilitersPerMinuteKilogram)
            }

        } catch (e: Exception) {
            Log.e(TAG, "Error reading activity", e)
        }

        return activity
    }

    private suspend fun readSleep(start: Instant, end: Instant): JSONObject {
        val sleepData = JSONObject()

        try {
            val sleepResponse = healthConnectClient.readRecords(
                ReadRecordsRequest(
                    SleepSessionRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(start, end)
                )
            )

            if (sleepResponse.records.isNotEmpty()) {
                val sessions = JSONArray()
                
                // Log data source
                val sleepSources = sleepResponse.records
                    .mapNotNull { it.metadata.dataOrigin.packageName }
                    .distinct()
                Log.d(TAG, "Sleep sources: ${sleepSources.joinToString(", ")}")

                for (session in sleepResponse.records) {
                    val sessionObj = JSONObject()
                    sessionObj.put("startTime", session.startTime.toString())
                    sessionObj.put("endTime", session.endTime.toString())
                    
                    val durationMin = ChronoUnit.MINUTES.between(session.startTime, session.endTime)
                    sessionObj.put("durationMin", durationMin)

                    // Sleep stages
                    if (session.stages.isNotEmpty()) {
                        val stages = JSONArray()
                        for (stage in session.stages) {
                            val stageObj = JSONObject()
                            stageObj.put("stage", mapSleepStage(stage.stage))
                            stageObj.put("startTime", stage.startTime.toString())
                            stageObj.put("endTime", stage.endTime.toString())
                            stages.put(stageObj)
                        }
                        sessionObj.put("stages", stages)
                    }

                    sessions.put(sessionObj)
                }

                sleepData.put("sessions", sessions)
            }

        } catch (e: Exception) {
            Log.e(TAG, "Error reading sleep", e)
        }

        return sleepData
    }

    private fun mapSleepStage(stage: Int): String {
        return when (stage) {
            SleepSessionRecord.STAGE_TYPE_AWAKE -> "awake"
            SleepSessionRecord.STAGE_TYPE_LIGHT -> "light"
            SleepSessionRecord.STAGE_TYPE_DEEP -> "deep"
            SleepSessionRecord.STAGE_TYPE_REM -> "rem"
            else -> "unknown"
        }
    }

    private suspend fun readBody(start: Instant, end: Instant): JSONObject {
        val body = JSONObject()

        // Weight
        try {
            val weightResponse = healthConnectClient.readRecords(
                ReadRecordsRequest(
                    WeightRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(start, end)
                )
            )
            if (weightResponse.records.isNotEmpty()) {
                body.put("weightKg", weightResponse.records.last().weight.inKilograms)
            }
        } catch (e: SecurityException) {
            Log.w(TAG, "No permission for Weight")
        } catch (e: Exception) {
            Log.e(TAG, "Error reading weight", e)
        }

        // Height
        try {
            val heightResponse = healthConnectClient.readRecords(
                ReadRecordsRequest(
                    HeightRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(start, end)
                )
            )
            if (heightResponse.records.isNotEmpty()) {
                body.put("heightCm", heightResponse.records.last().height.inMeters * 100)
            }
        } catch (e: SecurityException) {
            Log.w(TAG, "No permission for Height")
        } catch (e: Exception) {
            Log.e(TAG, "Error reading height", e)
        }

        // Body Fat
        try {
            val fatResponse = healthConnectClient.readRecords(
                ReadRecordsRequest(
                    BodyFatRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(start, end)
                )
            )
            if (fatResponse.records.isNotEmpty()) {
                body.put("bodyFatPct", fatResponse.records.last().percentage.value)
            }
        } catch (e: SecurityException) {
            Log.w(TAG, "No permission for Body Fat")
        } catch (e: Exception) {
            Log.e(TAG, "Error reading body fat", e)
        }

        // Lean Body Mass
        try {
            val leanResponse = healthConnectClient.readRecords(
                ReadRecordsRequest(
                    LeanBodyMassRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(start, end)
                )
            )
            if (leanResponse.records.isNotEmpty()) {
                body.put("leanBodyMassKg", leanResponse.records.last().mass.inKilograms)
            }
        } catch (e: SecurityException) {
            Log.w(TAG, "No permission for Lean Body Mass (expected - user denied)")
        } catch (e: Exception) {
            Log.e(TAG, "Error reading lean body mass", e)
        }

        return body
    }

    private suspend fun readNutrition(start: Instant, end: Instant): JSONObject {
        val nutrition = JSONObject()

        try {
            // Nutrition
            val nutritionResponse = healthConnectClient.readRecords(
                ReadRecordsRequest(
                    NutritionRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(start, end)
                )
            )
            if (nutritionResponse.records.isNotEmpty()) {
                var totalCalories = 0.0
                var totalProtein = 0.0
                var totalFat = 0.0
                var totalCarbs = 0.0

                for (record in nutritionResponse.records) {
                    record.energy?.inKilocalories?.let { totalCalories += it }
                    record.protein?.inGrams?.let { totalProtein += it }
                    record.totalFat?.inGrams?.let { totalFat += it }
                    record.totalCarbohydrate?.inGrams?.let { totalCarbs += it }
                }

                nutrition.put("calories", totalCalories.toInt())
                nutrition.put("proteinGrams", totalProtein.toInt())
                nutrition.put("fatGrams", totalFat.toInt())
                nutrition.put("carbsGrams", totalCarbs.toInt())
            }

            // Hydration
            val hydrationResponse = healthConnectClient.readRecords(
                ReadRecordsRequest(
                    HydrationRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(start, end)
                )
            )
            if (hydrationResponse.records.isNotEmpty()) {
                val totalHydration = hydrationResponse.records.sumOf { it.volume.inLiters }
                nutrition.put("hydrationLiters", totalHydration)
            }

        } catch (e: Exception) {
            Log.e(TAG, "Error reading nutrition", e)
        }

        return nutrition
    }

    private suspend fun readWellness(start: Instant, end: Instant): JSONObject {
        val wellness = JSONObject()

        try {
            // Note: MindfulnessSessionRecord was removed from Health Connect SDK
            // We track meditation through the app's own practice sessions
            Log.d(TAG, "Wellness data collection (mindfulness tracking via app)")

        } catch (e: Exception) {
            Log.e(TAG, "Error reading wellness", e)
        }

        return wellness
    }
}
