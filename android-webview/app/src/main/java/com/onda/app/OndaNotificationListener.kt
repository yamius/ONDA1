package com.onda.app

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import java.util.regex.Pattern

class OndaNotificationListener : NotificationListenerService() {
    
    companion object {
        private const val TAG = "OndaNotificationListener"
        
        // List of fitness app package names to monitor
        private val FITNESS_APPS = setOf(
            "com.mi.health",                           // Mi Fitness (Xiaomi)
            "com.xiaomi.hm.health",                    // Mi Fit (older Xiaomi app)
            "com.fitbit.FitbitMobile",                 // Fitbit
            "com.samsung.android.app.health",          // Samsung Health
            "com.google.android.apps.fitness",         // Google Fit
            "com.garmin.android.apps.connectmobile",   // Garmin Connect
            "com.huawei.health",                       // Huawei Health
            "polar.com.polarflow",                     // Polar Flow
            "com.sec.android.app.shealth"              // Samsung Health (alternate)
        )
    }
    
    override fun onNotificationPosted(sbn: StatusBarNotification) {
        try {
            // Only process notifications from fitness apps
            if (sbn.packageName !in FITNESS_APPS) {
                return
            }
            
            Log.d(TAG, "Notification from fitness app: ${sbn.packageName}")
            
            // Extract notification text
            val extras = sbn.notification.extras
            val title = extras.getString("android.title") ?: ""
            val text = extras.getCharSequence("android.text")?.toString() ?: ""
            val subText = extras.getCharSequence("android.subText")?.toString() ?: ""
            val bigText = extras.getCharSequence("android.bigText")?.toString() ?: ""
            
            // Combine all text fields for parsing
            val combinedText = "$title $text $subText $bigText"
            
            Log.d(TAG, "Notification text: $combinedText")
            
            // Try to extract heart rate
            val heartRate = extractHeartRate(combinedText)
            
            if (heartRate != null && heartRate in 40..220) {
                Log.d(TAG, "Heart rate extracted: $heartRate bpm from ${sbn.packageName}")
                
                // Send to MainActivity
                MainActivity.getInstance()?.onNotificationHeartRate(
                    heartRate = heartRate,
                    source = sbn.packageName
                )
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error processing notification: ${e.message}", e)
        }
    }
    
    override fun onNotificationRemoved(sbn: StatusBarNotification) {
        // Optional: handle notification removal if needed
    }
    
    /**
     * Extract heart rate from notification text using multiple patterns
     * Supports various formats:
     * - "Heart rate: 72 bpm"
     * - "Пульс: 72"
     * - "HR: 72 bpm"
     * - "72 bpm"
     * - "心率: 72"
     * - "頻率: 72"
     */
    private fun extractHeartRate(text: String): Int? {
        val lowerText = text.lowercase()
        
        // Pattern 1: "heart rate: 72" or "пульс: 72" or "hr: 72"
        val labeledPatterns = listOf(
            Pattern.compile("(?:heart\\s*rate|пульс|hr|частота|心率|頻率)[:\\s]+([0-9]{2,3})"),
            Pattern.compile("([0-9]{2,3})\\s*(?:bpm|уд/мин|beats)"),
            Pattern.compile("([0-9]{2,3})\\s*/\\s*min"),
        )
        
        for (pattern in labeledPatterns) {
            val matcher = pattern.matcher(lowerText)
            if (matcher.find()) {
                val value = matcher.group(1)?.toIntOrNull()
                if (value != null && value in 40..220) {
                    return value
                }
            }
        }
        
        // Pattern 2: Standalone "72 bpm" (more permissive)
        val standalonePattern = Pattern.compile("\\b([0-9]{2,3})\\s*bpm\\b")
        val standaloneMatcher = standalonePattern.matcher(lowerText)
        if (standaloneMatcher.find()) {
            val value = standaloneMatcher.group(1)?.toIntOrNull()
            if (value != null && value in 40..220) {
                return value
            }
        }
        
        return null
    }
}
