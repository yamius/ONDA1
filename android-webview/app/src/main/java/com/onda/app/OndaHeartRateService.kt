package com.onda.app

import android.app.*
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat

/**
 * Foreground Service to keep the app alive in background
 * Ensures NotificationListenerService continues receiving HR notifications
 * even when MainActivity is not in foreground
 */
class OndaHeartRateService : Service() {
    
    companion object {
        private const val NOTIFICATION_ID = 9001
        private const val CHANNEL_ID = "onda_hr_service"
        const val ACTION_START = "com.onda.app.START_HR_SERVICE"
        const val ACTION_STOP = "com.onda.app.STOP_HR_SERVICE"
    }
    
    private val hrReceiver = OndaHeartRateBroadcastReceiver()
    
    override fun onCreate() {
        super.onCreate()
        
        // Create notification channel (Android 8.0+)
        createNotificationChannel()
        
        // Register broadcast receiver for HR updates
        val filter = IntentFilter(OndaNotificationListener.ACTION_HR_UPDATE)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(hrReceiver, filter, Context.RECEIVER_NOT_EXPORTED)
        } else {
            registerReceiver(hrReceiver, filter)
        }
        
        // Start as foreground service with notification
        val notification = createNotification("Monitoring heart rate...", null)
        startForeground(NOTIFICATION_ID, notification)
        
        android.util.Log.d("OndaHRService", "Service created and started in foreground")
    }
    
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_START -> {
                android.util.Log.d("OndaHRService", "Service start command received")
            }
            ACTION_STOP -> {
                android.util.Log.d("OndaHRService", "Service stop command received")
                stopSelf()
            }
        }
        
        // If service is killed, restart it
        return START_STICKY
    }
    
    override fun onDestroy() {
        super.onDestroy()
        
        try {
            unregisterReceiver(hrReceiver)
        } catch (e: Exception) {
            android.util.Log.e("OndaHRService", "Error unregistering receiver", e)
        }
        
        android.util.Log.d("OndaHRService", "Service destroyed")
    }
    
    override fun onBind(intent: Intent?): IBinder? {
        // This is a started service, not bound
        return null
    }
    
    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Heart Rate Monitoring",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Keeps ONDA app monitoring your heart rate in background"
                setShowBadge(false)
            }
            
            val notificationManager = getSystemService(NotificationManager::class.java)
            notificationManager.createNotificationChannel(channel)
        }
    }
    
    private fun createNotification(text: String, hr: Int?): Notification {
        val contentIntent = PendingIntent.getActivity(
            this,
            0,
            Intent(this, MainActivity::class.java),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        
        val stopIntent = PendingIntent.getService(
            this,
            0,
            Intent(this, OndaHeartRateService::class.java).apply {
                action = ACTION_STOP
            },
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        
        val builder = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("ONDA Life - Heart Rate Monitoring")
            .setContentText(hr?.let { "$it bpm - $text" } ?: text)
            .setSmallIcon(android.R.drawable.ic_menu_compass)
            .setContentIntent(contentIntent)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .addAction(
                android.R.drawable.ic_menu_close_clear_cancel,
                "Stop",
                stopIntent
            )
        
        return builder.build()
    }
    
    /**
     * Update foreground notification with latest HR value
     */
    fun updateNotification(hr: Int, source: String) {
        val notification = createNotification("from $source", hr)
        val notificationManager = getSystemService(NotificationManager::class.java)
        notificationManager.notify(NOTIFICATION_ID, notification)
    }
    
    /**
     * Broadcast receiver to receive HR updates from NotificationListener
     */
    inner class OndaHeartRateBroadcastReceiver : android.content.BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            if (intent?.action == OndaNotificationListener.ACTION_HR_UPDATE) {
                val hr = intent.getIntExtra("heartRate", 0)
                val source = intent.getStringExtra("source") ?: "unknown"
                val timestamp = intent.getLongExtra("timestamp", System.currentTimeMillis())
                
                android.util.Log.d("OndaHRService", "Received HR update: $hr bpm from $source")
                
                // Update foreground notification
                if (hr > 0) {
                    updateNotification(hr, source)
                }
                
                // CRITICAL: Forward to MainActivity's WebView even if activity is backgrounded
                // Send as explicit broadcast to MainActivity
                val broadcastToActivity = Intent(OndaNotificationListener.ACTION_HR_UPDATE).apply {
                    putExtra("heartRate", hr)
                    putExtra("source", source)
                    putExtra("timestamp", timestamp)
                    setPackage(context?.packageName)
                    // Make it explicit for MainActivity
                    setClassName(context?.packageName ?: "com.onda.app", "com.onda.app.MainActivity")
                }
                
                try {
                    // Try to deliver to MainActivity if it exists
                    context?.sendBroadcast(broadcastToActivity)
                    android.util.Log.d("OndaHRService", "Forwarded HR to MainActivity")
                } catch (e: Exception) {
                    android.util.Log.e("OndaHRService", "Error forwarding to MainActivity: ${e.message}")
                }
            }
        }
    }
}
