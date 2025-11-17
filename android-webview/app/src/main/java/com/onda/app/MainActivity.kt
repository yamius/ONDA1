package com.onda.app

import android.Manifest
import android.annotation.SuppressLint
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothManager
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.webkit.*
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.*
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.time.Instant
import java.time.temporal.ChronoUnit

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private var healthConnectClient: HealthConnectClient? = null
    private val coroutineScope = CoroutineScope(Dispatchers.Main)

    // Health Connect permissions
    private val healthPermissions = setOf(
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
        HealthPermission.getReadPermission(NutritionRecord::class),
        HealthPermission.getReadPermission(HydrationRecord::class)
    )

    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val allGranted = permissions.entries.all { it.value }
        if (allGranted) {
            Toast.makeText(this, "Health Connect permissions granted", Toast.LENGTH_SHORT).show()
            fetchHealthConnectData()
        } else {
            Toast.makeText(this, "Some permissions denied", Toast.LENGTH_SHORT).show()
        }
    }

    private val requestBluetoothPermissions = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val allGranted = permissions.entries.all { it.value }
        if (allGranted) {
            Toast.makeText(this, "Bluetooth permissions granted", Toast.LENGTH_SHORT).show()
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Initialize Health Connect
        healthConnectClient = HealthConnectClient.getOrCreate(this)

        // Set up WebView
        webView = WebView(this)
        setContentView(webView)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            mediaPlaybackRequiresUserGesture = false
            mixedContentMode = WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE
            
            // Enable modern caching for audio files (Cache API + IndexedDB)
            cacheMode = WebSettings.LOAD_DEFAULT
            
            // Ensure storage APIs are enabled for IndexedDB
            javaScriptCanOpenWindowsAutomatically = false
        }

        // Add JavaScript interface for native bridges
        webView.addJavascriptInterface(HealthConnectBridge(), "Android")

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(
                view: WebView?,
                request: WebResourceRequest?
            ): Boolean {
                return false
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                // Notify web app that native bridge is ready
                webView.evaluateJavascript("window.dispatchEvent(new Event('native-ready'))", null)
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onConsoleMessage(message: ConsoleMessage?): Boolean {
                message?.let {
                    println("WebView Console: ${it.message()} (${it.sourceId()}:${it.lineNumber()})")
                }
                return true
            }

            override fun onPermissionRequest(request: PermissionRequest?) {
                request?.grant(request.resources)
            }
        }

        // Load the app
        webView.loadUrl("file:///android_asset/index.html")
    }

    private inner class HealthConnectBridge {
        @JavascriptInterface
        fun requestHealthConnectPermissions() {
            coroutineScope.launch {
                val granted = healthConnectClient?.permissionController?.getGrantedPermissions()
                val toRequest = healthPermissions - (granted ?: emptySet())

                if (toRequest.isNotEmpty()) {
                    requestPermissionLauncher.launch(toRequest.toTypedArray())
                } else {
                    fetchHealthConnectData()
                }
            }
        }

        @JavascriptInterface
        fun requestBluetoothPermissions() {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val permissions = arrayOf(
                    Manifest.permission.BLUETOOTH_SCAN,
                    Manifest.permission.BLUETOOTH_CONNECT
                )
                requestBluetoothPermissions.launch(permissions)
            }
        }

        @JavascriptInterface
        fun isBluetoothAvailable(): Boolean {
            val bluetoothManager = getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
            return bluetoothManager.adapter != null && bluetoothManager.adapter.isEnabled
        }
    }

    private fun fetchHealthConnectData() {
        coroutineScope.launch {
            try {
                val data = JSONObject()
                data.put("timestamp", System.currentTimeMillis())
                data.put("source", "health_connect")

                // Get time range (last 24 hours)
                val endTime = Instant.now()
                val startTime = endTime.minus(24, ChronoUnit.HOURS)
                val timeRange = TimeRangeFilter.between(startTime, endTime)

                // Fetch vitals
                val vitals = JSONObject()
                fetchHeartRate(timeRange)?.let { vitals.put("heartRate", it) }
                fetchRestingHeartRate(timeRange)?.let { vitals.put("restingHeartRate", it) }
                fetchHRV(timeRange)?.let { vitals.put("hrv", it) }
                fetchSpO2(timeRange)?.let { vitals.put("spo2", it) }
                if (vitals.length() > 0) data.put("vitals", vitals)

                // Fetch activity
                val activity = JSONObject()
                fetchActiveCalories(timeRange)?.let { activity.put("activeCaloriesBurned", it) }
                fetchVO2Max(timeRange)?.let { activity.put("vo2Max", it) }
                if (activity.length() > 0) data.put("activity", activity)

                // Fetch body measurements
                val body = JSONObject()
                fetchWeight(timeRange)?.let { body.put("weightKg", it) }
                fetchHeight(timeRange)?.let { body.put("heightCm", it) }
                fetchBodyFat(timeRange)?.let { body.put("bodyFatPct", it) }
                if (body.length() > 0) data.put("body", body)

                // Fetch sleep
                fetchSleep(timeRange)?.let { data.put("sleep", it) }

                // Send to WebView
                sendHealthDataToWeb(data)

            } catch (e: Exception) {
                e.printStackTrace()
                Toast.makeText(this@MainActivity, "Error fetching health data", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private suspend fun fetchHeartRate(timeRange: TimeRangeFilter): Int? {
        return withContext(Dispatchers.IO) {
            try {
                val response = healthConnectClient?.readRecords(
                    ReadRecordsRequest(HeartRateRecord::class, timeRange)
                )
                response?.records?.lastOrNull()?.samples?.lastOrNull()?.beatsPerMinute?.toInt()
            } catch (e: Exception) {
                null
            }
        }
    }

    private suspend fun fetchRestingHeartRate(timeRange: TimeRangeFilter): Int? {
        return withContext(Dispatchers.IO) {
            try {
                val response = healthConnectClient?.readRecords(
                    ReadRecordsRequest(RestingHeartRateRecord::class, timeRange)
                )
                response?.records?.lastOrNull()?.beatsPerMinute?.toInt()
            } catch (e: Exception) {
                null
            }
        }
    }

    private suspend fun fetchHRV(timeRange: TimeRangeFilter): Double? {
        return withContext(Dispatchers.IO) {
            try {
                val response = healthConnectClient?.readRecords(
                    ReadRecordsRequest(HeartRateVariabilityRmssdRecord::class, timeRange)
                )
                response?.records?.lastOrNull()?.heartRateVariabilityMillis
            } catch (e: Exception) {
                null
            }
        }
    }

    private suspend fun fetchSpO2(timeRange: TimeRangeFilter): Double? {
        return withContext(Dispatchers.IO) {
            try {
                val response = healthConnectClient?.readRecords(
                    ReadRecordsRequest(OxygenSaturationRecord::class, timeRange)
                )
                response?.records?.lastOrNull()?.percentage?.value?.toDouble()
            } catch (e: Exception) {
                null
            }
        }
    }

    private suspend fun fetchActiveCalories(timeRange: TimeRangeFilter): Double? {
        return withContext(Dispatchers.IO) {
            try {
                val response = healthConnectClient?.readRecords(
                    ReadRecordsRequest(ActiveCaloriesBurnedRecord::class, timeRange)
                )
                response?.records?.sumOf { it.energy.inKilocalories }
            } catch (e: Exception) {
                null
            }
        }
    }

    private suspend fun fetchVO2Max(timeRange: TimeRangeFilter): Double? {
        return withContext(Dispatchers.IO) {
            try {
                val response = healthConnectClient?.readRecords(
                    ReadRecordsRequest(Vo2MaxRecord::class, timeRange)
                )
                response?.records?.lastOrNull()?.vo2MillilitersPerMinuteKilogram
            } catch (e: Exception) {
                null
            }
        }
    }

    private suspend fun fetchWeight(timeRange: TimeRangeFilter): Double? {
        return withContext(Dispatchers.IO) {
            try {
                val response = healthConnectClient?.readRecords(
                    ReadRecordsRequest(WeightRecord::class, timeRange)
                )
                response?.records?.lastOrNull()?.weight?.inKilograms
            } catch (e: Exception) {
                null
            }
        }
    }

    private suspend fun fetchHeight(timeRange: TimeRangeFilter): Double? {
        return withContext(Dispatchers.IO) {
            try {
                val response = healthConnectClient?.readRecords(
                    ReadRecordsRequest(HeightRecord::class, timeRange)
                )
                response?.records?.lastOrNull()?.height?.inMeters?.times(100)
            } catch (e: Exception) {
                null
            }
        }
    }

    private suspend fun fetchBodyFat(timeRange: TimeRangeFilter): Double? {
        return withContext(Dispatchers.IO) {
            try {
                val response = healthConnectClient?.readRecords(
                    ReadRecordsRequest(BodyFatRecord::class, timeRange)
                )
                response?.records?.lastOrNull()?.percentage?.value?.toDouble()
            } catch (e: Exception) {
                null
            }
        }
    }

    private suspend fun fetchSleep(timeRange: TimeRangeFilter): JSONObject? {
        return withContext(Dispatchers.IO) {
            try {
                val response = healthConnectClient?.readRecords(
                    ReadRecordsRequest(SleepSessionRecord::class, timeRange)
                )
                val session = response?.records?.lastOrNull() ?: return@withContext null

                val sleepData = JSONObject()
                val mainSleep = JSONObject()
                mainSleep.put("start", session.startTime.toString())
                mainSleep.put("end", session.endTime.toString())
                mainSleep.put("durationMin",
                    ChronoUnit.MINUTES.between(session.startTime, session.endTime))

                sleepData.put("main", mainSleep)
                sleepData
            } catch (e: Exception) {
                null
            }
        }
    }

    private fun sendHealthDataToWeb(data: JSONObject) {
        runOnUiThread {
            val js = """
                (function() {
                    const event = new CustomEvent('hc-update', {
                        detail: ${data}
                    });
                    window.dispatchEvent(event);
                })();
            """.trimIndent()

            webView.evaluateJavascript(js, null)
        }
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
