# Интеграция Google Health Connect для Android

## 📱 Обзор

Это руководство поможет интегрировать Google Health Connect в Android WebView приложение для игры ONDA.

## ⚙️ Требования

- **Android 10 (API 29) или выше** - минимальная версия для Health Connect
- **AndroidX Health Connect SDK** - версия 1.1.0 или выше
- **WebView** - для отображения React приложения

## 🚀 Шаг 1: Добавление зависимостей

Добавьте в `build.gradle` (app level):

```gradle
dependencies {
    // Health Connect SDK
    implementation "androidx.health.connect:connect-client:1.1.0"
    
    // Coroutines для асинхронных операций
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3'
    
    // Lifecycle
    implementation 'androidx.lifecycle:lifecycle-runtime-ktx:2.6.2'
}
```

## 📝 Шаг 2: Манифест

Добавьте permissions и Health Connect provider в `AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    
    <!-- Health Connect permissions -->
    <uses-permission android:name="android.permission.health.READ_HEART_RATE"/>
    <uses-permission android:name="android.permission.health.READ_STEPS"/>
    <uses-permission android:name="android.permission.health.READ_SLEEP"/>
    <uses-permission android:name="android.permission.health.READ_ACTIVE_CALORIES_BURNED"/>
    <uses-permission android:name="android.permission.health.READ_DISTANCE"/>
    <uses-permission android:name="android.permission.health.READ_BODY_FAT"/>
    <uses-permission android:name="android.permission.health.READ_WEIGHT"/>
    <uses-permission android:name="android.permission.health.READ_HYDRATION"/>
    <uses-permission android:name="android.permission.health.READ_NUTRITION"/>
    
    <application>
        <!-- ... -->
        
        <!-- Health Connect Provider -->
        <activity-alias
            android:name="ViewPermissionUsageActivity"
            android:exported="true"
            android:targetActivity=".MainActivity"
            android:permission="android.permission.START_VIEW_PERMISSION_USAGE">
            <intent-filter>
                <action android:name="androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE" />
            </intent-filter>
        </activity-alias>
    </application>
</manifest>
```

## 💻 Шаг 3: Kotlin код для WebView

Создайте `HealthConnectManager.kt`:

```kotlin
package com.onda.app

import android.content.Context
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.*
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.json.JSONObject
import java.time.Instant
import java.time.temporal.ChronoUnit

class HealthConnectManager(private val context: Context) {
    
    private val healthConnectClient by lazy {
        HealthConnectClient.getOrCreate(context)
    }
    
    // Permissions needed
    val permissions = setOf(
        HealthPermission.getReadPermission(HeartRateRecord::class),
        HealthPermission.getReadPermission(StepsRecord::class),
        HealthPermission.getReadPermission(SleepSessionRecord::class),
        HealthPermission.getReadPermission(ActiveCaloriesBurnedRecord::class),
        HealthPermission.getReadPermission(WeightRecord::class),
        HealthPermission.getReadPermission(BodyFatRecord::class),
        HealthPermission.getReadPermission(HydrationRecord::class),
        HealthPermission.getReadPermission(NutritionRecord::class),
        HealthPermission.getReadPermission(DistanceRecord::class),
        HealthPermission.getReadPermission(Vo2MaxRecord::class)
    )
    
    suspend fun checkPermissions(): Boolean {
        val granted = healthConnectClient.permissionController.getGrantedPermissions()
        return permissions.all { it in granted }
    }
    
    suspend fun readHealthData(): JSONObject {
        val now = Instant.now()
        val yesterday = now.minus(1, ChronoUnit.DAYS)
        
        val json = JSONObject()
        json.put("ts", now.toString())
        json.put("source", "health_connect")
        
        try {
            // Витальные показатели
            val vitals = JSONObject()
            
            // Heart Rate
            val hrResponse = healthConnectClient.readRecords(
                ReadRecordsRequest(
                    HeartRateRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(yesterday, now)
                )
            )
            if (hrResponse.records.isNotEmpty()) {
                val latestHR = hrResponse.records.last()
                vitals.put("heartRate", latestHR.samples.last().beatsPerMinute)
            }
            
            // Weight
            val weightResponse = healthConnectClient.readRecords(
                ReadRecordsRequest(
                    WeightRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(yesterday, now)
                )
            )
            if (weightResponse.records.isNotEmpty()) {
                val body = JSONObject()
                body.put("weightKg", weightResponse.records.last().weight.inKilograms)
                json.put("body", body)
            }
            
            // Sleep
            val sleepResponse = healthConnectClient.readRecords(
                ReadRecordsRequest(
                    SleepSessionRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(yesterday, now)
                )
            )
            if (sleepResponse.records.isNotEmpty()) {
                val sleepSession = sleepResponse.records.last()
                val sleepData = JSONObject()
                val mainSleep = JSONObject()
                
                mainSleep.put("date", sleepSession.startTime.toString().substring(0, 10))
                mainSleep.put("sleepStart", sleepSession.startTime.toString())
                mainSleep.put("wakeTime", sleepSession.endTime.toString())
                
                val durationMin = ChronoUnit.MINUTES.between(
                    sleepSession.startTime,
                    sleepSession.endTime
                ).toInt()
                mainSleep.put("durationMin", durationMin)
                
                sleepData.put("main", mainSleep)
                json.put("sleep", sleepData)
            }
            
            // Activity
            val activity = JSONObject()
            
            // Active Calories
            val caloriesResponse = healthConnectClient.readRecords(
                ReadRecordsRequest(
                    ActiveCaloriesBurnedRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(yesterday, now)
                )
            )
            if (caloriesResponse.records.isNotEmpty()) {
                val totalCalories = caloriesResponse.records.sumOf { 
                    it.energy.inKilocalories 
                }
                activity.put("activeCaloriesBurned", totalCalories.toInt())
            }
            
            // VO2 Max
            val vo2Response = healthConnectClient.readRecords(
                ReadRecordsRequest(
                    Vo2MaxRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(yesterday, now)
                )
            )
            if (vo2Response.records.isNotEmpty()) {
                activity.put("vo2Max", vo2Response.records.last().vo2MillilitersPerMinuteKilogram)
            }
            
            if (activity.length() > 0) {
                json.put("activity", activity)
            }
            
            if (vitals.length() > 0) {
                json.put("vitals", vitals)
            }
            
        } catch (e: Exception) {
            e.printStackTrace()
        }
        
        return json
    }
}
```

## 🔗 Шаг 4: Интеграция с WebView

Создайте `MainActivity.kt`:

```kotlin
package com.onda.app

import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebView
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {
    
    private lateinit var webView: WebView
    private lateinit var healthConnectManager: HealthConnectManager
    
    private val requestPermissions = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { granted ->
        if (granted.values.all { it }) {
            // Все permissions получены
            sendHealthDataToWeb()
        }
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        healthConnectManager = HealthConnectManager(this)
        
        webView = findViewById(R.id.webview)
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
        }
        
        // Подключаем JavaScript bridge
        webView.addJavascriptInterface(AndroidBridge(), "Android")
        
        // Загружаем React приложение
        webView.loadUrl("https://your-onda-app.replit.app")
    }
    
    inner class AndroidBridge {
        
        @JavascriptInterface
        fun requestHealthConnectPermissions() {
            lifecycleScope.launch {
                val hasPermissions = healthConnectManager.checkPermissions()
                
                if (hasPermissions) {
                    sendHealthDataToWeb()
                } else {
                    // Request permissions
                    requestPermissions.launch(
                        healthConnectManager.permissions.toTypedArray()
                    )
                }
            }
        }
    }
    
    private fun sendHealthDataToWeb() {
        lifecycleScope.launch {
            try {
                val healthData = healthConnectManager.readHealthData()
                val jsonString = healthData.toString()
                
                runOnUiThread {
                    webView.evaluateJavascript(
                        "window.onHealthConnectUpdate && window.onHealthConnectUpdate($jsonString)",
                        null
                    )
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}
```

## 📱 Шаг 5: Layout

Создайте `res/layout/activity_main.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    
    <WebView
        android:id="@+id/webview"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />
        
</FrameLayout>
```

## 🔄 Как это работает

### 1. **Пользователь нажимает "Connect Health Connect" в React**
```javascript
// В React приложении
window.Android.requestHealthConnectPermissions()
```

### 2. **Android запрашивает permissions**
```kotlin
// В MainActivity.kt
@JavascriptInterface
fun requestHealthConnectPermissions() {
    // Запрос permissions...
}
```

### 3. **После получения permissions, данные отправляются в WebView**
```kotlin
webView.evaluateJavascript(
    "window.onHealthConnectUpdate && window.onHealthConnectUpdate($jsonString)",
    null
)
```

### 4. **React приложение получает данные**
```javascript
// В healthConnectBridge.ts
window.onHealthConnectUpdate = function(data) {
    // Данные автоматически отображаются в UI
    console.log('Received Health Connect data:', data)
}
```

## 🎯 Формат данных

Данные отправляются в следующем формате JSON:

```json
{
  "ts": "2024-01-15T10:30:00Z",
  "source": "health_connect",
  "activity": {
    "activeCaloriesBurned": 320,
    "vo2Max": 42
  },
  "vitals": {
    "heartRate": 78,
    "restingHeartRate": 60,
    "hrv": 55
  },
  "sleep": {
    "main": {
      "date": "2024-01-14",
      "sleepStart": "23:40",
      "wakeTime": "07:05",
      "durationMin": 445
    }
  },
  "body": {
    "weightKg": 72.5,
    "bodyFatPct": 16
  },
  "nutrition": {
    "calories": 2300,
    "proteinGrams": 120
  }
}
```

## ✅ Проверка интеграции

### 1. **Проверьте в Android Studio**
```bash
# Запустите приложение на эмуляторе/устройстве
./gradlew installDebug
```

### 2. **Откройте Chrome DevTools для WebView**
```
chrome://inspect/#devices
```

### 3. **Проверьте консоль**
```javascript
// Должно появиться в консоли
[HC] bridge initialized
[HC] update payload received
```

## 🐛 Решение проблем

### Проблема: "Health Connect недоступен"
**Решение:** Установите Health Connect из Google Play:
```
https://play.google.com/store/apps/details?id=com.google.android.apps.healthdata
```

### Проблема: "Permissions не запрашиваются"
**Решение:** Проверьте `AndroidManifest.xml` и убедитесь что все permissions добавлены.

### Проблема: "Данные не приходят в WebView"
**Решение:** Проверьте:
1. JavaScript enabled в WebView
2. Bridge корректно добавлен: `webView.addJavascriptInterface(AndroidBridge(), "Android")`
3. React приложение загружено полностью

## 📚 Дополнительные ресурсы

- [Health Connect Documentation](https://developer.android.com/guide/health-and-fitness/health-connect)
- [Health Connect SDK Reference](https://developer.android.com/reference/kotlin/androidx/health/connect/client/package-summary)
- [Health Connect Sample App](https://github.com/android/health-samples)

## 🎉 Готово!

После выполнения всех шагов, ваше Android приложение будет:
- ✅ Запрашивать Health Connect permissions
- ✅ Читать данные из Health Connect
- ✅ Отправлять данные в React WebView
- ✅ Автоматически отображать данные в ONDA UI

**Удачи с интеграцией! 🚀**
