package com.onda.app

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
import android.os.ParcelUuid
import android.util.Log
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
    
    // Callbacks для JavaScript
    var onDeviceFound: ((String, String) -> Unit)? = null  // (deviceId, deviceName)
    var onConnected: (() -> Unit)? = null
    var onDisconnected: (() -> Unit)? = null
    var onHeartRateUpdate: ((Int) -> Unit)? = null
    var onError: ((String) -> Unit)? = null
    
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
        if (!isBluetoothAvailable()) {
            Log.e(TAG, "Bluetooth not available")
            onError?.invoke("Bluetooth not available")
            return
        }
        
        if (isScanning) {
            Log.d(TAG, "Already scanning")
            return
        }
        
        Log.d(TAG, "Starting BLE scan for Heart Rate devices...")
        
        val scanFilter = ScanFilter.Builder()
            .setServiceUuid(ParcelUuid(HEART_RATE_SERVICE_UUID))
            .build()
        
        val scanSettings = ScanSettings.Builder()
            .setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY)
            .build()
        
        bluetoothLeScanner?.startScan(listOf(scanFilter), scanSettings, scanCallback)
        isScanning = true
        
        // Auto-stop scan after 10 seconds
        android.os.Handler(android.os.Looper.getMainLooper()).postDelayed({
            stopScan()
        }, 10000)
    }
    
    /**
     * Останавливает сканирование
     */
    @SuppressLint("MissingPermission")
    fun stopScan() {
        if (!isScanning) return
        
        Log.d(TAG, "Stopping BLE scan")
        bluetoothLeScanner?.stopScan(scanCallback)
        isScanning = false
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
        
        bluetoothGatt = device.connectGatt(context, false, gattCallback)
    }
    
    /**
     * Отключается от устройства
     */
    @SuppressLint("MissingPermission")
    fun disconnect() {
        Log.d(TAG, "Disconnecting from device")
        bluetoothGatt?.disconnect()
        bluetoothGatt?.close()
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
                    gatt.discoverServices()
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
