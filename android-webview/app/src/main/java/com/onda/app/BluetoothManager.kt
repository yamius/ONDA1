package com.onda.app

import android.Manifest
import android.annotation.SuppressLint
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothGatt
import android.bluetooth.BluetoothGattCallback
import android.bluetooth.BluetoothGattCharacteristic
import android.bluetooth.BluetoothGattDescriptor
import android.bluetooth.BluetoothManager as SystemBluetoothManager
import android.bluetooth.BluetoothProfile
import android.bluetooth.le.BluetoothLeScanner
import android.bluetooth.le.ScanCallback
import android.bluetooth.le.ScanFilter
import android.bluetooth.le.ScanResult
import android.bluetooth.le.ScanSettings
import android.content.Context
import android.content.pm.PackageManager
import android.os.Handler
import android.os.Looper
import android.os.ParcelUuid
import android.util.Log
import androidx.core.content.ContextCompat
import java.util.UUID

/**
 * BluetoothManager - управление подключением к BLE пульсометрам
 * Поддерживает стандартный Heart Rate Service (UUID: 0x180D)
 */
class BluetoothManager(private val context: Context) {
    
    companion object {
        private const val TAG = "BluetoothManager"
        
        // Standard Heart Rate Service UUID
        private val HEART_RATE_SERVICE_UUID = UUID.fromString("0000180d-0000-1000-8000-00805f9b34fb")
        private val HEART_RATE_MEASUREMENT_CHAR_UUID = UUID.fromString("00002a37-0000-1000-8000-00805f9b34fb")
        private val CLIENT_CHARACTERISTIC_CONFIG_UUID = UUID.fromString("00002902-0000-1000-8000-00805f9b34fb")
    }
    
    private val bluetoothManager: SystemBluetoothManager = 
        context.getSystemService(Context.BLUETOOTH_SERVICE) as SystemBluetoothManager
    
    private val bluetoothAdapter: BluetoothAdapter? = bluetoothManager.adapter
    private var bluetoothLeScanner: BluetoothLeScanner? = bluetoothAdapter?.bluetoothLeScanner
    private var bluetoothGatt: BluetoothGatt? = null
    private var isScanning = false
    private var autoStopHandler: Handler? = null
    private var autoStopRunnable: Runnable? = null
    
    // Callbacks для JavaScript
    var onDeviceFound: ((String, String) -> Unit)? = null  // (deviceId, deviceName)
    var onConnected: (() -> Unit)? = null
    var onDisconnected: (() -> Unit)? = null
    var onHeartRateUpdate: ((Int) -> Unit)? = null
    var onError: ((String) -> Unit)? = null
    var onScanStopped: (() -> Unit)? = null
    
    /**
     * Проверяет доступность Bluetooth
     */
    fun isBluetoothAvailable(): Boolean {
        val available = bluetoothAdapter != null && bluetoothAdapter.isEnabled
        Log.d(TAG, "Bluetooth available: $available")
        return available
    }
    
    /**
     * Сканирует BLE устройства с Heart Rate Service
     */
    @SuppressLint("MissingPermission")
    fun startScan() {
        // Check runtime permissions (Android 12+)
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) {
            val scanPermission = ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.BLUETOOTH_SCAN
            )
            if (scanPermission != PackageManager.PERMISSION_GRANTED) {
                Log.e(TAG, "BLUETOOTH_SCAN permission not granted")
                onError?.invoke("BLUETOOTH_SCAN permission denied. Please grant permissions first.")
                return
            }
        }
        
        if (!isBluetoothAvailable()) {
            Log.e(TAG, "Bluetooth not available")
            onError?.invoke("Bluetooth not available")
            return
        }
        
        if (isScanning) {
            Log.d(TAG, "Already scanning")
            return
        }
        
        Log.d(TAG, "Starting BLE scan for all BLE devices...")
        
        // Remove strict filter - many devices don't advertise Heart Rate UUID in scan response
        // We'll filter client-side after connection
        val scanSettings = ScanSettings.Builder()
            .setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY)
            .build()
        
        try {
            // Scan all BLE devices without filter to find more heart rate monitors
            bluetoothLeScanner?.startScan(null, scanSettings, scanCallback)
            isScanning = true
            
            // Auto-stop scan after 10 seconds
            autoStopRunnable = Runnable {
                stopScan()
            }
            autoStopHandler = Handler(Looper.getMainLooper())
            autoStopHandler?.postDelayed(autoStopRunnable!!, 10000)
            
        } catch (e: SecurityException) {
            Log.e(TAG, "SecurityException starting scan: ${e.message}")
            onError?.invoke("Permission denied. Cannot start Bluetooth scan.")
            isScanning = false
        }
    }
    
    /**
     * Останавливает сканирование
     */
    @SuppressLint("MissingPermission")
    fun stopScan() {
        if (!isScanning) return
        
        Log.d(TAG, "Stopping BLE scan")
        
        // Cancel auto-stop handler
        autoStopRunnable?.let { runnable ->
            autoStopHandler?.removeCallbacks(runnable)
        }
        autoStopHandler = null
        autoStopRunnable = null
        
        try {
            bluetoothLeScanner?.stopScan(scanCallback)
        } catch (e: SecurityException) {
            Log.e(TAG, "SecurityException stopping scan: ${e.message}")
        }
        
        isScanning = false
        onScanStopped?.invoke()
    }
    
    /**
     * Callback для результатов сканирования
     */
    private val scanCallback = object : ScanCallback() {
        @SuppressLint("MissingPermission")
        override fun onScanResult(callbackType: Int, result: ScanResult) {
            val device = result.device
            val deviceName = device.name ?: "Unknown Device"
            val deviceAddress = device.address
            
            Log.d(TAG, "Found device: $deviceName ($deviceAddress)")
            onDeviceFound?.invoke(deviceAddress, deviceName)
        }
        
        override fun onScanFailed(errorCode: Int) {
            Log.e(TAG, "BLE scan failed with error: $errorCode")
            onError?.invoke("Scan failed: $errorCode")
            isScanning = false
        }
    }
    
    /**
     * Подключается к устройству по адресу
     */
    @SuppressLint("MissingPermission")
    fun connectToDevice(deviceAddress: String) {
        // Check runtime permissions (Android 12+)
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) {
            val connectPermission = ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.BLUETOOTH_CONNECT
            )
            if (connectPermission != PackageManager.PERMISSION_GRANTED) {
                Log.e(TAG, "BLUETOOTH_CONNECT permission not granted")
                onError?.invoke("BLUETOOTH_CONNECT permission denied. Please grant permissions first.")
                return
            }
        }
        
        stopScan()
        
        Log.d(TAG, "Connecting to device: $deviceAddress")
        
        val device = bluetoothAdapter?.getRemoteDevice(deviceAddress)
        if (device == null) {
            Log.e(TAG, "Device not found: $deviceAddress")
            onError?.invoke("Device not found")
            return
        }
        
        // Disconnect previous device if any
        disconnect()
        
        try {
            bluetoothGatt = device.connectGatt(context, false, gattCallback)
        } catch (e: SecurityException) {
            Log.e(TAG, "SecurityException connecting to device: ${e.message}")
            onError?.invoke("Permission denied. Cannot connect to device.")
        }
    }
    
    /**
     * Отключается от устройства
     */
    @SuppressLint("MissingPermission")
    fun disconnect() {
        Log.d(TAG, "Disconnecting from device")
        
        // Cancel auto-stop handler if still running
        autoStopRunnable?.let { runnable ->
            autoStopHandler?.removeCallbacks(runnable)
        }
        autoStopHandler = null
        autoStopRunnable = null
        
        try {
            bluetoothGatt?.disconnect()
            bluetoothGatt?.close()
        } catch (e: SecurityException) {
            Log.e(TAG, "SecurityException disconnecting: ${e.message}")
        }
        
        bluetoothGatt = null
    }
    
    /**
     * Callback для GATT событий
     */
    private val gattCallback = object : BluetoothGattCallback() {
        @SuppressLint("MissingPermission")
        override fun onConnectionStateChange(gatt: BluetoothGatt, status: Int, newState: Int) {
            when (newState) {
                BluetoothProfile.STATE_CONNECTED -> {
                    Log.d(TAG, "Connected to GATT server")
                    try {
                        gatt.discoverServices()
                    } catch (e: SecurityException) {
                        Log.e(TAG, "SecurityException discovering services: ${e.message}")
                        onError?.invoke("Permission denied during service discovery")
                    }
                }
                BluetoothProfile.STATE_DISCONNECTED -> {
                    Log.d(TAG, "Disconnected from GATT server")
                    onDisconnected?.invoke()
                }
            }
        }
        
        @SuppressLint("MissingPermission")
        override fun onServicesDiscovered(gatt: BluetoothGatt, status: Int) {
            if (status == BluetoothGatt.GATT_SUCCESS) {
                Log.d(TAG, "Services discovered")
                
                try {
                    val service = gatt.getService(HEART_RATE_SERVICE_UUID)
                    if (service != null) {
                        val characteristic = service.getCharacteristic(HEART_RATE_MEASUREMENT_CHAR_UUID)
                        if (characteristic != null) {
                            // Enable notifications
                            gatt.setCharacteristicNotification(characteristic, true)
                            
                            val descriptor = characteristic.getDescriptor(CLIENT_CHARACTERISTIC_CONFIG_UUID)
                            descriptor?.value = BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE
                            gatt.writeDescriptor(descriptor)
                            
                            Log.d(TAG, "Heart Rate notifications enabled")
                            onConnected?.invoke()
                        } else {
                            Log.e(TAG, "Heart Rate characteristic not found")
                            onError?.invoke("Heart Rate characteristic not found")
                        }
                    } else {
                        Log.e(TAG, "Heart Rate service not found")
                        onError?.invoke("Heart Rate service not found")
                    }
                } catch (e: SecurityException) {
                    Log.e(TAG, "SecurityException enabling notifications: ${e.message}")
                    onError?.invoke("Permission denied while enabling heart rate notifications")
                }
            } else {
                Log.e(TAG, "Service discovery failed: $status")
                onError?.invoke("Service discovery failed")
            }
        }
        
        @Deprecated("Deprecated in Java")
        override fun onCharacteristicChanged(gatt: BluetoothGatt, characteristic: BluetoothGattCharacteristic) {
            if (characteristic.uuid == HEART_RATE_MEASUREMENT_CHAR_UUID) {
                val heartRate = parseHeartRate(characteristic)
                Log.d(TAG, "Heart Rate: $heartRate bpm")
                onHeartRateUpdate?.invoke(heartRate)
            }
        }
    }
    
    /**
     * Парсит значение пульса из характеристики
     */
    private fun parseHeartRate(characteristic: BluetoothGattCharacteristic): Int {
        val flag = characteristic.properties
        val format = when (flag and 0x01) {
            0x01 -> {
                BluetoothGattCharacteristic.FORMAT_UINT16
            }
            else -> {
                BluetoothGattCharacteristic.FORMAT_UINT8
            }
        }
        return characteristic.getIntValue(format, 1) ?: 0
    }
    
    /**
     * Проверяет подключено ли устройство
     */
    fun isConnected(): Boolean {
        return bluetoothGatt != null
    }
}
