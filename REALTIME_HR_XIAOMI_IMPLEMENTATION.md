# Real-Time Heart Rate от Xiaomi Smart Band - План реализации

## 🎯 Цель
Получать real-time пульс от Xiaomi Smart Band во время практик без "специальной команды" в приложении трекера.

---

## 📊 Текущая ситуация

### ✅ Что уже работает:
```kotlin
// BluetoothManager.kt - СТАНДАРТНЫЙ BLE HR протокол
HEART_RATE_SERVICE_UUID = "0000180d-0000-1000-8000-00805f9b34fb"  // Standard HR
HEART_RATE_MEASUREMENT = "00002a37-0000-1000-8000-00805f9b34fb"

// Работает для: Polar H10, Garmin HRM, и других стандартных пульсометров
```

### ❌ Что НЕ работает:
**Xiaomi Smart Band НЕ использует стандартный HR Service (0x180D)**

Xiaomi использует проприетарный протокол:
```
Xiaomi Service UUID: 0xFEE0 или 0xFEE1
Xiaomi HR Characteristic: 0x2A37 (внутри 0xFEE0, не стандартный)
```

---

## 🔧 Решение: Dual-Mode BluetoothManager

### **Вариант 1: MVP - Добавить Xiaomi UUID в сканирование**

Модифицировать `BluetoothManager.kt` для поддержки обоих протоколов:

```kotlin
companion object {
    // Standard BLE Heart Rate Service (Polar, Garmin, etc)
    private val STANDARD_HR_SERVICE = UUID.fromString("0000180d-0000-1000-8000-00805f9b34fb")
    private val STANDARD_HR_CHAR = UUID.fromString("00002a37-0000-1000-8000-00805f9b34fb")
    
    // Xiaomi Mi Band Service (проприетарный)
    private val XIAOMI_SERVICE = UUID.fromString("0000fee0-0000-1000-8000-00805f9b34fb")
    private val XIAOMI_SERVICE_ALT = UUID.fromString("0000fee1-0000-1000-8000-00805f9b34fb") // Mi Band 5+
    
    // Xiaomi Heart Rate Characteristic (внутри Xiaomi Service)
    private val XIAOMI_HR_CONTROL = UUID.fromString("00002a39-0000-1000-8000-00805f9b34fb") // Start/stop HR measurement
    private val XIAOMI_HR_MEASUREMENT = UUID.fromString("00002a37-0000-1000-8000-00805f9b34fb") // HR data
    
    // Xiaomi Authentication (для Mi Band 4+)
    private val XIAOMI_AUTH_CHAR = UUID.fromString("00000009-0000-3512-2118-0009af100700")
    
    // Client Characteristic Config (стандартный для notifications)
    private val CLIENT_CHAR_CONFIG = UUID.fromString("00002902-0000-1000-8000-00805f9b34fb")
    
    // Команды для Xiaomi
    private val START_HR_MEASUREMENT = byteArrayOf(0x15, 0x01, 0x01) // Включить continuous HR
    private val STOP_HR_MEASUREMENT = byteArrayOf(0x15, 0x01, 0x00)  // Выключить continuous HR
}

enum class DeviceType {
    STANDARD_BLE,  // Polar, Garmin, etc
    XIAOMI_MI_BAND,
    UNKNOWN
}

private var currentDeviceType: DeviceType = DeviceType.UNKNOWN
```

---

## 📝 Изменения в BluetoothManager.kt

### **1. Определение типа устройства при подключении**

```kotlin
override fun onServicesDiscovered(gatt: BluetoothGatt, status: Int) {
    if (status == BluetoothGatt.GATT_SUCCESS) {
        Log.d(TAG, "Services discovered")
        
        // Проверяем тип устройства
        currentDeviceType = detectDeviceType(gatt)
        
        when (currentDeviceType) {
            DeviceType.STANDARD_BLE -> setupStandardHR(gatt)
            DeviceType.XIAOMI_MI_BAND -> setupXiaomiHR(gatt)
            DeviceType.UNKNOWN -> {
                Log.e(TAG, "Unknown device type - no HR service found")
                onError?.invoke("Device does not support heart rate monitoring")
            }
        }
    }
}

private fun detectDeviceType(gatt: BluetoothGatt): DeviceType {
    return when {
        gatt.getService(XIAOMI_SERVICE) != null -> {
            Log.d(TAG, "Detected Xiaomi Mi Band device")
            DeviceType.XIAOMI_MI_BAND
        }
        gatt.getService(XIAOMI_SERVICE_ALT) != null -> {
            Log.d(TAG, "Detected Xiaomi Mi Band 5+ device")
            DeviceType.XIAOMI_MI_BAND
        }
        gatt.getService(STANDARD_HR_SERVICE) != null -> {
            Log.d(TAG, "Detected standard BLE HR monitor")
            DeviceType.STANDARD_BLE
        }
        else -> DeviceType.UNKNOWN
    }
}
```

### **2. Setup для стандартных BLE устройств (уже есть)**

```kotlin
@SuppressLint("MissingPermission")
private fun setupStandardHR(gatt: BluetoothGatt) {
    val service = gatt.getService(STANDARD_HR_SERVICE) ?: return
    val characteristic = service.getCharacteristic(STANDARD_HR_CHAR) ?: return
    
    // Enable notifications
    gatt.setCharacteristicNotification(characteristic, true)
    
    val descriptor = characteristic.getDescriptor(CLIENT_CHAR_CONFIG)
    descriptor?.value = BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE
    gatt.writeDescriptor(descriptor)
    
    Log.d(TAG, "Standard HR notifications enabled")
    onConnected?.invoke()
}
```

### **3. Setup для Xiaomi Mi Band (НОВОЕ)**

```kotlin
@SuppressLint("MissingPermission")
private fun setupXiaomiHR(gatt: BluetoothGatt) {
    val service = gatt.getService(XIAOMI_SERVICE) ?: gatt.getService(XIAOMI_SERVICE_ALT)
    if (service == null) {
        Log.e(TAG, "Xiaomi service not found")
        onError?.invoke("Xiaomi service not found")
        return
    }
    
    // 1. Проверяем нужна ли аутентификация (Mi Band 4+)
    val authChar = service.getCharacteristic(XIAOMI_AUTH_CHAR)
    if (authChar != null) {
        Log.w(TAG, "This Mi Band requires authentication - not implemented yet")
        // TODO: Implement authentication for Mi Band 4+
        // Требуется извлечь auth key из Mi Fitness базы данных
    }
    
    // 2. Включаем continuous HR monitoring
    val hrControlChar = service.getCharacteristic(XIAOMI_HR_CONTROL)
    if (hrControlChar != null) {
        Log.d(TAG, "Sending START_HR_MEASUREMENT command to Xiaomi device")
        hrControlChar.value = START_HR_MEASUREMENT
        gatt.writeCharacteristic(hrControlChar)
    }
    
    // 3. Подписываемся на HR notifications
    val hrMeasurementChar = service.getCharacteristic(XIAOMI_HR_MEASUREMENT)
    if (hrMeasurementChar != null) {
        gatt.setCharacteristicNotification(hrMeasurementChar, true)
        
        val descriptor = hrMeasurementChar.getDescriptor(CLIENT_CHAR_CONFIG)
        descriptor?.value = BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE
        gatt.writeDescriptor(descriptor)
        
        Log.d(TAG, "Xiaomi HR notifications enabled")
        onConnected?.invoke()
    } else {
        Log.e(TAG, "Xiaomi HR measurement characteristic not found")
        onError?.invoke("Xiaomi HR characteristic not found")
    }
}
```

### **4. При отключении - остановить continuous HR**

```kotlin
@SuppressLint("MissingPermission")
fun disconnect() {
    Log.d(TAG, "Disconnecting from device")
    
    // Если Xiaomi - отправляем команду STOP для экономии батареи
    if (currentDeviceType == DeviceType.XIAOMI_MI_BAND) {
        bluetoothGatt?.let { gatt ->
            val service = gatt.getService(XIAOMI_SERVICE) ?: gatt.getService(XIAOMI_SERVICE_ALT)
            val hrControlChar = service?.getCharacteristic(XIAOMI_HR_CONTROL)
            if (hrControlChar != null) {
                Log.d(TAG, "Sending STOP_HR_MEASUREMENT to Xiaomi device")
                hrControlChar.value = STOP_HR_MEASUREMENT
                gatt.writeCharacteristic(hrControlChar)
            }
        }
    }
    
    try {
        bluetoothGatt?.disconnect()
        bluetoothGatt?.close()
    } catch (e: SecurityException) {
        Log.e(TAG, "SecurityException disconnecting: ${e.message}")
    }
    
    bluetoothGatt = null
    currentDeviceType = DeviceType.UNKNOWN
}
```

---

## ⚠️ Ограничения и проблемы

### **1. Аутентификация для Mi Band 4+**

Mi Band 4, 5, 6+ требуют **authentication key** для доступа к HR data:

```kotlin
// Требуется получить auth key из Mi Fitness базы данных:
// /data/data/com.mi.health/databases/origin_db_[user_id]
// Таблица: DEVICE, колонка: AUTH_KEY

// Процесс аутентификации (упрощённо):
// 1. Отправить команду запроса challenge
// 2. Получить random bytes от устройства
// 3. Шифровать их с помощью auth key (AES-128)
// 4. Отправить обратно зашифрованный ответ
// 5. Устройство проверяет и разрешает доступ
```

**Проблема:** Получение auth key требует root доступа к Mi Fitness database или reverse-engineering.

**Решение для MVP:** 
- Mi Band 1, 2, 3 НЕ требуют аутентификации - будут работать сразу
- Mi Band 4+ - показывать ошибку "Authentication required - please use standard BLE HR monitor"

### **2. UUID могут отличаться**

Разные модели Mi Band используют разные UUID:

| Модель | Service UUID | HR Control | HR Measurement |
|--------|-------------|------------|----------------|
| Mi Band 1/2 | `0xFEE0` | `0x2A39` | `0x2A37` |
| Mi Band 3/4 | `0xFEE1` | `0x2A39` | `0x2A37` |
| Mi Band 5+ | `0xFEE0` + auth | Custom | Custom |

**Решение:** Попробовать оба service UUID, логировать результаты.

---

## 🚀 План внедрения (поэтапно)

### **Фаза 1: Базовая поддержка Xiaomi (1-2 дня)**

1. ✅ Добавить Xiaomi UUID в `BluetoothManager.kt`
2. ✅ Реализовать `detectDeviceType()` 
3. ✅ Реализовать `setupXiaomiHR()` с START_HR_MEASUREMENT командой
4. ✅ Отправлять STOP при disconnect
5. ✅ Тестировать на Mi Band 1/2/3 (без auth)

**Результат:** Real-time HR от старых Mi Band моделей

### **Фаза 2: Fallback для новых моделей (опционально)**

1. ⚠️ Определять модели требующие auth
2. ⚠️ Показывать пользователю инструкцию:
   ```
   "This Mi Band model requires authentication.
   
   Options:
   1. Use a standard BLE heart rate monitor (Polar H10, Garmin HRM)
   2. Enable continuous HR in Mi Fitness app settings
   3. Wait for authentication support (coming soon)"
   ```

### **Фаза 3: Полная аутентификация (2-3 недели, если нужно)**

Интеграция Gadgetbridge SDK для полной поддержки всех моделей.

---

## 📋 Тестирование

### **Тест 1: Mi Band 2/3 (без auth)**
1. Сканировать устройства
2. Подключиться к Mi Band
3. Проверить логи: "Detected Xiaomi Mi Band device"
4. Проверить: START_HR_MEASUREMENT отправлена
5. Ждать HR updates каждые 1-2 секунды
6. Отключиться - проверить STOP_HR_MEASUREMENT

### **Тест 2: Mi Band 5+ (с auth)**
1. Подключиться
2. Ожидается: "This Mi Band requires authentication"
3. Показать пользователю альтернативы

### **Тест 3: Стандартный BLE (Polar H10)**
1. Убедиться что старая функциональность не сломалась
2. Должен определиться как STANDARD_BLE
3. Continuous HR как раньше

---

## 💡 Альтернатива: Gadgetbridge Integration

Если MVP не сработает, план B:

```gradle
// android-webview/app/build.gradle
dependencies {
    implementation 'com.github.Freeyourgadget:Gadgetbridge:master-SNAPSHOT'
}
```

**Преимущества:**
- ✅ Поддержка всех моделей Mi Band (1-9)
- ✅ Встроенная аутентификация
- ✅ Протестировано сообществом

**Недостатки:**
- ❌ +2-3 MB APK
- ❌ Сложная интеграция (~1 неделя)
- ❌ Требует первого паринга через Mi Fitness для получения auth key

---

## 🎯 Рекомендация

**Начать с Фазы 1** (MVP Xiaomi support):
- ✅ Быстро (1-2 дня)
- ✅ Работает для Mi Band 1/2/3 без изменений APK размера
- ✅ Легко протестировать

Если пользователи требуют поддержку новых моделей → Фаза 3 (Gadgetbridge).

---

## 📊 Ожидаемые результаты

### **Mi Band 1/2/3:**
```
[BluetoothManager] Detected Xiaomi Mi Band device
[BluetoothManager] Sending START_HR_MEASUREMENT command
[BluetoothManager] Xiaomi HR notifications enabled
[BluetoothManager] Heart Rate: 72 bpm  ← Real-time!
[BluetoothManager] Heart Rate: 73 bpm  ← 1-2 секунды обновления
```

### **Mi Band 4+:**
```
[BluetoothManager] Detected Xiaomi Mi Band device
[BluetoothManager] This Mi Band requires authentication
[UI] "Authentication required - use standard BLE monitor or wait for update"
```

---

## ❓ Следующий шаг

**Готов реализовать Фазу 1 (MVP Xiaomi support)?**

Это добавит ~100 строк кода в `BluetoothManager.kt` и даст вам real-time пульс от старых Mi Band без "специальной команды".

Для новых моделей (Mi Band 5+) - покажем пользователю fallback варианты до полной реализации auth.

**Начинаем?** 🚀
