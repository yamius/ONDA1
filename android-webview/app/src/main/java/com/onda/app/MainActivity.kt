package com.onda.app

import android.Manifest
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.graphics.Color
import android.media.AudioManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.util.Log
import android.webkit.ConsoleMessage
import android.webkit.JavascriptInterface
import android.webkit.PermissionRequest
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.core.graphics.Insets
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.health.connect.client.PermissionController
import androidx.lifecycle.lifecycleScope
import androidx.webkit.WebViewAssetLoader
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var healthConnectManager: HealthConnectManager
    private lateinit var bluetoothManager: BluetoothManager
    private var pendingPermissionRequest: PermissionRequest? = null
    private var hrBroadcastReceiver: BroadcastReceiver? = null
    
    // Store WindowInsets values for edge-to-edge mode
    private var statusBarHeight = 0
    private var navBarHeight = 0

    companion object {
        private const val PERMISSION_REQUEST_CODE = 100
        private const val BLUETOOTH_PERMISSION_REQUEST_CODE = 101
        
        // Singleton instance for NotificationListenerService access
        private var instance: MainActivity? = null
        
        fun getInstance(): MainActivity? = instance
    }

    private val requestHealthPermissions = registerForActivityResult(
        PermissionController.createRequestPermissionResultContract()
    ) { grantedPermissions ->
        Log.d("WebViewConsole", "[HealthConnect] Permission result: ${grantedPermissions.size} granted")
        
        // Check permission result
        lifecycleScope.launch {
            try {
                val hasAllPermissions = healthConnectManager.checkPermissions()
                
                if (hasAllPermissions) {
                    Log.d("WebViewConsole", "[HealthConnect] All permissions granted, reading data")
                    sendHealthDataToWeb()
                } else {
                    Log.d("WebViewConsole", "[HealthConnect] Some permissions denied or not granted")
                    // Notify web app about denied permissions
                    webView.post {
                        webView.evaluateJavascript(
                            "window.dispatchEvent(new CustomEvent('hc-permissions-denied'))",
                            null
                        )
                    }
                }
            } catch (e: Exception) {
                Log.e("WebViewConsole", "[HealthConnect] Error checking permissions after request: ${e.message}")
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Set singleton instance
        instance = this

        webView = WebView(this)
        
        // CRITICAL: Set WebView background to transparent for edge-to-edge (must be before setContentView)
        // This prevents white bar under status bar because WebView defaults to opaque white
        webView.setBackgroundColor(Color.TRANSPARENT)
        webView.isOpaque = false
        
        // Enable edge-to-edge mode (must be after WebView creation)
        setupEdgeToEdge()
        
        setContentView(webView)

        // Initialize Health Connect Manager
        healthConnectManager = HealthConnectManager(this)
        Log.d("WebViewConsole", "[HealthConnect] Manager initialized, available: ${healthConnectManager.isAvailable()}")
        
        // Initialize Bluetooth Manager
        bluetoothManager = BluetoothManager(this)
        Log.d("WebViewConsole", "[Bluetooth] Manager initialized, available: ${bluetoothManager.isBluetoothAvailable()}")
        
        // Setup Bluetooth callbacks
        bluetoothManager.onDeviceFound = { deviceId, deviceName ->
            runOnUiThread {
                val script = """
                    window.dispatchEvent(new CustomEvent('bluetooth-device-found', { 
                        detail: { id: "$deviceId", name: "$deviceName" } 
                    }));
                """.trimIndent()
                webView.evaluateJavascript(script, null)
            }
        }
        
        bluetoothManager.onConnected = {
            runOnUiThread {
                webView.evaluateJavascript(
                    "window.dispatchEvent(new CustomEvent('bluetooth-connected'))",
                    null
                )
            }
        }
        
        bluetoothManager.onDisconnected = {
            runOnUiThread {
                webView.evaluateJavascript(
                    "window.dispatchEvent(new CustomEvent('bluetooth-disconnected'))",
                    null
                )
            }
        }
        
        bluetoothManager.onHeartRateUpdate = { heartRate ->
            runOnUiThread {
                val script = """
                    window.dispatchEvent(new CustomEvent('bluetooth-hr-update', { 
                        detail: { hr: $heartRate, timestamp: ${System.currentTimeMillis()} } 
                    }));
                """.trimIndent()
                webView.evaluateJavascript(script, null)
            }
        }
        
        bluetoothManager.onError = { error ->
            runOnUiThread {
                val script = """
                    window.dispatchEvent(new CustomEvent('bluetooth-error', { 
                        detail: { error: "$error" } 
                    }));
                """.trimIndent()
                webView.evaluateJavascript(script, null)
            }
        }
        
        bluetoothManager.onScanStopped = {
            runOnUiThread {
                webView.evaluateJavascript(
                    "window.dispatchEvent(new CustomEvent('bluetooth-scan-stopped'))",
                    null
                )
            }
        }

        // Раздаём файлы из app/src/main/assets/** по HTTPS
        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler(
                "/",
                WebViewAssetLoader.AssetsPathHandler(this)
            )
            .build()

        val settings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true

        // file:// больше не нужен — всё через https://appassets.androidplatform.net
        settings.allowFileAccess = false
        settings.allowContentAccess = false
        settings.cacheMode = WebSettings.LOAD_DEFAULT
        settings.mediaPlaybackRequiresUserGesture = false
        
        // Критически важно для getUserMedia
        settings.javaScriptCanOpenWindowsAutomatically = true
        settings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        
        // Включаем поддержку getUserMedia
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.JELLY_BEAN_MR1) {
            settings.mediaPlaybackRequiresUserGesture = false
        }

        // Добавляем JavaScript Interface для OAuth
        webView.addJavascriptInterface(WebAppInterface(this), "Android")

        webView.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(
                view: WebView,
                request: WebResourceRequest
            ): WebResourceResponse? {
                return assetLoader.shouldInterceptRequest(request.url)
            }

            @Suppress("OverridingDeprecatedMember")
            override fun shouldInterceptRequest(
                view: WebView,
                url: String
            ): WebResourceResponse? {
                return assetLoader.shouldInterceptRequest(Uri.parse(url))
            }
            
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                
                // Inject CSS variables for safe area insets after page loads
                injectSafeAreaInsets()
                Log.d("WebViewConsole", "[EdgeToEdge] Page loaded, insets injected")
            }
        }

        // Логируем всё из console.log + обрабатываем permissions
        webView.webChromeClient = object : WebChromeClient() {
            override fun onConsoleMessage(message: ConsoleMessage): Boolean {
                Log.d(
                    "WebViewConsole",
                    "${message.message()} (line ${message.lineNumber()} of ${message.sourceId()})"
                )
                return true
            }

            override fun onPermissionRequest(request: PermissionRequest) {
                Log.d("WebViewConsole", "onPermissionRequest called for: ${request.resources.joinToString()}")
                
                // Проверяем, что запрашивается микрофон
                if (request.resources.contains(PermissionRequest.RESOURCE_AUDIO_CAPTURE)) {
                    // Запрашиваем аудио фокус
                    val audioManager = getSystemService(Context.AUDIO_SERVICE) as AudioManager
                    val result = audioManager.requestAudioFocus(
                        null,
                        AudioManager.STREAM_VOICE_CALL,
                        AudioManager.AUDIOFOCUS_GAIN_TRANSIENT
                    )
                    
                    if (result == AudioManager.AUDIOFOCUS_REQUEST_GRANTED) {
                        Log.d("WebViewConsole", "Audio focus granted")
                    } else {
                        Log.d("WebViewConsole", "Audio focus NOT granted")
                    }
                    
                    // Проверяем, есть ли у нас runtime permission
                    if (ContextCompat.checkSelfPermission(
                            this@MainActivity,
                            Manifest.permission.RECORD_AUDIO
                        ) == PackageManager.PERMISSION_GRANTED
                    ) {
                        // Разрешаем WebView использовать микрофон
                        runOnUiThread {
                            request.grant(request.resources)
                            Log.d("WebViewConsole", "Microphone permission granted to WebView immediately")
                        }
                    } else {
                        // Сохраняем запрос и просим runtime permission
                        pendingPermissionRequest = request
                        runOnUiThread {
                            ActivityCompat.requestPermissions(
                                this@MainActivity,
                                arrayOf(Manifest.permission.RECORD_AUDIO),
                                PERMISSION_REQUEST_CODE
                            )
                            Log.d("WebViewConsole", "Requesting microphone permission from user")
                        }
                    }
                } else {
                    request.deny()
                    Log.d("WebViewConsole", "Permission request denied (not audio)")
                }
            }
        }

        // ВАЖНО: грузим как HTTPS, не file://
        // Это откроет файл app/src/main/assets/index.html
        webView.loadUrl("https://appassets.androidplatform.net/index.html")
        
        // Обработка deep link при первом запуске
        handleDeepLink(intent)
        
        // Register broadcast receiver for HR updates from NotificationListener/Service
        setupHRBroadcastReceiver()
    }
    
    /**
     * Enable edge-to-edge fullscreen mode with transparent blurred system bars (like Telegram)
     */
    private fun setupEdgeToEdge() {
        // Enable edge-to-edge (draw behind system bars)
        WindowCompat.setDecorFitsSystemWindows(window, false)
        
        // Make window background transparent (prevents white background before WebView renders)
        window.setBackgroundDrawable(null)
        
        // VERY transparent dark background for frosted glass effect (50% opacity)
        // Less opacity = more transparent = more blur visible
        val transparentDarkColor = Color.parseColor("#80111827")  // 50% opacity for maximum frosted glass
        
        window.statusBarColor = transparentDarkColor
        window.navigationBarColor = transparentDarkColor
        
        // Disable contrast enforcement for cleaner transparency (Android 11+)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            window.isStatusBarContrastEnforced = false
            window.isNavigationBarContrastEnforced = false
        }
        
        // Set light content for system bars (light icons/text on dark background)
        val insetsController = WindowCompat.getInsetsController(window, window.decorView)
        insetsController.isAppearanceLightStatusBars = false  // Light text/icons on dark bg
        insetsController.isAppearanceLightNavigationBars = false  // Light nav buttons on dark bg
        
        // Listen for WindowInsets changes and save values (inject later in onPageFinished)
        ViewCompat.setOnApplyWindowInsetsListener(webView) { view, windowInsets ->
            val insets = windowInsets.getInsets(WindowInsetsCompat.Type.systemBars())
            
            // Save inset values for later injection
            statusBarHeight = insets.top
            navBarHeight = insets.bottom
            
            Log.d("WebViewConsole", "[EdgeToEdge] WindowInsets received: top=$statusBarHeight, bottom=$navBarHeight")
            
            // Return the insets unchanged (don't consume them)
            windowInsets
        }
        
        Log.d("WebViewConsole", "[EdgeToEdge] Enabled fullscreen with transparent blurred system bars")
    }
    
    /**
     * Inject CSS variables for safe area insets (called once after page load)
     */
    private fun injectSafeAreaInsets() {
        val jsCode = """
            (function() {
                const top = '${statusBarHeight}px';
                const bottom = '${navBarHeight}px';
                
                document.documentElement.style.setProperty('--safe-area-inset-top', top);
                document.documentElement.style.setProperty('--safe-area-inset-bottom', bottom);
                
                // Also apply directly to #root to ensure it takes effect
                const root = document.getElementById('root');
                if (root) {
                    root.style.paddingTop = top;
                    root.style.paddingBottom = bottom;
                    console.log('[EdgeToEdge] Direct padding applied to #root:', top, bottom);
                }
                
                console.log('[EdgeToEdge] CSS variables injected:', { top, bottom });
                console.log('[EdgeToEdge] Computed #root padding:', window.getComputedStyle(root || document.documentElement).paddingTop);
            })();
        """.trimIndent()
        
        webView.evaluateJavascript(jsCode, null)
    }
    
    private fun setupHRBroadcastReceiver() {
        hrBroadcastReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context?, intent: Intent?) {
                if (intent?.action == OndaNotificationListener.ACTION_HR_UPDATE) {
                    val hr = intent.getIntExtra("heartRate", 0)
                    val source = intent.getStringExtra("source") ?: "unknown"
                    val timestamp = intent.getLongExtra("timestamp", System.currentTimeMillis())
                    
                    Log.d("WebViewConsole", "[NotificationHR] Broadcast received: $hr bpm from $source")
                    
                    if (hr > 0) {
                        onNotificationHeartRate(hr, source, timestamp)
                    }
                }
            }
        }
        
        val filter = IntentFilter(OndaNotificationListener.ACTION_HR_UPDATE)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(hrBroadcastReceiver, filter, Context.RECEIVER_NOT_EXPORTED)
        } else {
            registerReceiver(hrBroadcastReceiver, filter)
        }
        
        Log.d("WebViewConsole", "[NotificationHR] Broadcast receiver registered")
    }
    
    override fun onDestroy() {
        super.onDestroy()
        
        // Clear singleton reference
        instance = null
        
        // Unregister broadcast receiver
        hrBroadcastReceiver?.let {
            try {
                unregisterReceiver(it)
                Log.d("WebViewConsole", "[NotificationHR] Broadcast receiver unregistered")
            } catch (e: Exception) {
                Log.e("WebViewConsole", "[NotificationHR] Error unregistering receiver: ${e.message}")
            }
        }
    }
    
    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        // Обработка deep link при возврате из браузера
        handleDeepLink(intent)
    }
    
    private fun handleDeepLink(intent: Intent?) {
        val data = intent?.data
        if (data != null && data.scheme == "com.onda.app" && data.host == "callback") {
            Log.d("WebViewConsole", "[OAuth] Deep link received: $data")
            
            // Получаем фрагмент URL с токеном (например: access_token=...&expires_at=...)
            val fragment = data.fragment ?: ""
            
            if (fragment.isNotEmpty() && ::webView.isInitialized) {
                Log.d("WebViewConsole", "[OAuth] Processing auth callback with fragment")
                
                // Передаём URL с токеном в JavaScript через bridge
                val authUrl = "https://qwtdppugdcguyeaumymc.supabase.co/auth/v1/callback#$fragment"
                
                // Парсим токены из fragment
                val params = fragment.split("&").associate {
                    val parts = it.split("=", limit = 2)
                    parts[0] to (parts.getOrNull(1) ?: "")
                }
                
                val accessToken = params["access_token"] ?: ""
                val refreshToken = params["refresh_token"] ?: ""
                
                // Вызываем JavaScript функцию для обработки OAuth callback
                webView.post {
                    // Экранируем токены для безопасной передачи в JavaScript
                    val escapedAccessToken = accessToken.replace("\\", "\\\\").replace("\"", "\\\"")
                    val escapedRefreshToken = refreshToken.replace("\\", "\\\\").replace("\"", "\\\"")
                    
                    val script = """
                        (async function() {
                            console.log('[OAuth] Processing callback from deep link');
                            
                            const accessToken = "$escapedAccessToken";
                            const refreshToken = "$escapedRefreshToken";
                            
                            console.log('[OAuth] Tokens parsed:', {
                                hasAccessToken: !!accessToken,
                                hasRefreshToken: !!refreshToken
                            });
                            
                            if (accessToken && refreshToken && window.handleOAuthCallback) {
                                try {
                                    await window.handleOAuthCallback(accessToken, refreshToken);
                                } catch (e) {
                                    console.error('[OAuth] Error in handleOAuthCallback:', e);
                                }
                            } else {
                                console.error('[OAuth] Missing tokens or handler not registered');
                            }
                        })();
                    """.trimIndent()
                    
                    webView.evaluateJavascript(script) { result ->
                        Log.d("WebViewConsole", "[OAuth] JavaScript executed, result: $result")
                    }
                }
            }
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)

        when (requestCode) {
            PERMISSION_REQUEST_CODE -> {
                val request = pendingPermissionRequest
                if (request != null) {
                    if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                        // Разрешение получено, грантим запрос WebView
                        runOnUiThread {
                            request.grant(request.resources)
                            Log.d("WebViewConsole", "User granted microphone permission - granting to WebView")
                        }
                    } else {
                        // Разрешение отклонено
                        runOnUiThread {
                            request.deny()
                            Log.d("WebViewConsole", "User denied microphone permission")
                        }
                    }
                    pendingPermissionRequest = null
                } else {
                    Log.d("WebViewConsole", "onRequestPermissionsResult: pendingPermissionRequest is null")
                }
            }
            
            BLUETOOTH_PERMISSION_REQUEST_CODE -> {
                val allGranted = grantResults.all { it == PackageManager.PERMISSION_GRANTED }
                
                if (allGranted) {
                    Log.d("WebViewConsole", "[Bluetooth] Runtime permissions granted")
                    // Notify web app that permissions are ready
                    runOnUiThread {
                        webView.evaluateJavascript(
                            "window.dispatchEvent(new CustomEvent('bluetooth-permissions-granted'))",
                            null
                        )
                    }
                } else {
                    Log.d("WebViewConsole", "[Bluetooth] Runtime permissions denied")
                    // Notify web app about denied permissions
                    runOnUiThread {
                        webView.evaluateJavascript(
                            "window.dispatchEvent(new CustomEvent('bluetooth-permissions-denied'))",
                            null
                        )
                    }
                }
            }
        }
    }

    override fun onBackPressed() {
        if (::webView.isInitialized && webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
    
    /**
     * Called by OndaNotificationListener when heart rate is detected in notifications
     * from fitness apps (Mi Fitness, Fitbit, Samsung Health, etc.)
     */
    fun onNotificationHeartRate(heartRate: Int, source: String, timestamp: Long = System.currentTimeMillis()) {
        runOnUiThread {
            if (::webView.isInitialized) {
                val script = """
                    window.dispatchEvent(new CustomEvent('notification-hr-update', {
                        detail: {
                            heartRate: $heartRate,
                            timestamp: $timestamp,
                            source: '$source'
                        }
                    }));
                """.trimIndent()
                
                webView.evaluateJavascript(script) { result ->
                    Log.d("WebViewConsole", "[NotificationHR] Sent to WebView: $heartRate bpm from $source")
                }
            }
        }
    }

    // JavaScript Interface для вызова Android функций из WebView
    inner class WebAppInterface(private val activity: MainActivity) {
        
        @JavascriptInterface
        fun openExternalBrowser(url: String) {
            Log.d("WebViewConsole", "[OAuth] Opening URL in external browser: $url")
            try {
                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                activity.startActivity(intent)
                Log.d("WebViewConsole", "[OAuth] External browser opened successfully")
            } catch (e: Exception) {
                Log.e("WebViewConsole", "[OAuth] Error opening external browser: ${e.message}")
            }
        }

        @JavascriptInterface
        fun isHealthConnectAvailable(): Boolean {
            val available = healthConnectManager.isAvailable()
            Log.d("WebViewConsole", "[HealthConnect] isHealthConnectAvailable called: $available")
            return available
        }

        @JavascriptInterface
        fun requestHealthConnectPermissions() {
            Log.d("WebViewConsole", "[HealthConnect] requestHealthConnectPermissions called")
            
            lifecycleScope.launch {
                try {
                    val hasPermissions = healthConnectManager.checkPermissions()
                    
                    if (hasPermissions) {
                        Log.d("WebViewConsole", "[HealthConnect] Permissions already granted")
                        sendHealthDataToWeb()
                    } else {
                        val permissionsToRequest = healthConnectManager.permissions
                        Log.d("WebViewConsole", "[HealthConnect] Need to request ${permissionsToRequest.size} permissions")
                        Log.d("WebViewConsole", "[HealthConnect] Permissions list: ${permissionsToRequest.joinToString(", ")}")
                        Log.d("WebViewConsole", "[HealthConnect] Launching permission UI on main thread...")
                        
                        // Launch Health Connect permission UI on main thread
                        withContext(Dispatchers.Main) {
                            try {
                                requestHealthPermissions.launch(permissionsToRequest)
                                Log.d("WebViewConsole", "[HealthConnect] Permission UI launched successfully")
                            } catch (e: Exception) {
                                Log.e("WebViewConsole", "[HealthConnect] Error launching permission UI: ${e.message}", e)
                            }
                        }
                    }
                } catch (e: Exception) {
                    Log.e("WebViewConsole", "[HealthConnect] Error checking/requesting permissions: ${e.message}", e)
                    e.printStackTrace()
                }
            }
        }

        @JavascriptInterface
        fun readHealthConnectData() {
            Log.d("WebViewConsole", "[HealthConnect] readHealthConnectData called")
            sendHealthDataToWeb()
        }
        
        // ============ Bluetooth Methods ============
        
        @JavascriptInterface
        fun isBluetoothAvailable(): Boolean {
            val available = bluetoothManager.isBluetoothAvailable()
            Log.d("WebViewConsole", "[Bluetooth] isBluetoothAvailable called: $available")
            return available
        }
        
        @JavascriptInterface
        fun requestBluetoothPermissions() {
            Log.d("WebViewConsole", "[Bluetooth] requestBluetoothPermissions called")
            
            if (hasBluetoothPermissions()) {
                Log.d("WebViewConsole", "[Bluetooth] Permissions already granted")
                // Immediately notify that permissions are ready
                runOnUiThread {
                    webView.evaluateJavascript(
                        "window.dispatchEvent(new CustomEvent('bluetooth-permissions-granted'))",
                        null
                    )
                }
            } else {
                Log.d("WebViewConsole", "[Bluetooth] Requesting runtime permissions")
                activity.requestBluetoothPermissions()
            }
        }
        
        @JavascriptInterface
        fun startBluetoothScan() {
            Log.d("WebViewConsole", "[Bluetooth] startBluetoothScan called")
            
            // Check permissions - fail fast if missing
            if (!hasBluetoothPermissions()) {
                Log.e("WebViewConsole", "[Bluetooth] Cannot scan without permissions")
                runOnUiThread {
                    webView.evaluateJavascript(
                        """window.dispatchEvent(new CustomEvent('bluetooth-error', { 
                            detail: { error: 'Missing Bluetooth permissions. Call requestBluetoothPermissions() first.' } 
                        }))""",
                        null
                    )
                }
                return
            }
            
            bluetoothManager.startScan()
        }
        
        @JavascriptInterface
        fun stopBluetoothScan() {
            Log.d("WebViewConsole", "[Bluetooth] stopBluetoothScan called")
            bluetoothManager.stopScan()
        }
        
        @JavascriptInterface
        fun connectBluetoothDevice(deviceAddress: String) {
            Log.d("WebViewConsole", "[Bluetooth] connectBluetoothDevice called: $deviceAddress")
            
            // Check permissions - fail fast if missing
            if (!hasBluetoothPermissions()) {
                Log.e("WebViewConsole", "[Bluetooth] Cannot connect without permissions")
                runOnUiThread {
                    webView.evaluateJavascript(
                        """window.dispatchEvent(new CustomEvent('bluetooth-error', { 
                            detail: { error: 'Missing Bluetooth permissions. Call requestBluetoothPermissions() first.' } 
                        }))""",
                        null
                    )
                }
                return
            }
            
            bluetoothManager.connectToDevice(deviceAddress)
        }
        
        @JavascriptInterface
        fun disconnectBluetoothDevice() {
            Log.d("WebViewConsole", "[Bluetooth] disconnectBluetoothDevice called")
            bluetoothManager.disconnect()
        }
        
        @JavascriptInterface
        fun isBluetoothConnected(): Boolean {
            val connected = bluetoothManager.isConnected()
            Log.d("WebViewConsole", "[Bluetooth] isBluetoothConnected called: $connected")
            return connected
        }
        
        // ============ Notification Listener Methods ============
        
        @JavascriptInterface
        fun isNotificationListenerEnabled(): Boolean {
            val enabledListeners = Settings.Secure.getString(
                activity.contentResolver,
                "enabled_notification_listeners"
            )
            val isEnabled = enabledListeners?.contains(activity.packageName) == true
            Log.d("WebViewConsole", "[NotificationHR] isNotificationListenerEnabled: $isEnabled")
            return isEnabled
        }
        
        @JavascriptInterface
        fun requestNotificationListenerPermission() {
            Log.d("WebViewConsole", "[NotificationHR] requestNotificationListenerPermission called")
            try {
                val intent = Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)
                activity.startActivity(intent)
                Log.d("WebViewConsole", "[NotificationHR] Settings opened successfully")
            } catch (e: Exception) {
                Log.e("WebViewConsole", "[NotificationHR] Error opening settings: ${e.message}")
            }
        }
        
        @JavascriptInterface
        fun startHeartRateService() {
            Log.d("WebViewConsole", "[NotificationHR] startHeartRateService called")
            
            // CRITICAL: Only start service if notification listener permission is granted
            if (!isNotificationListenerEnabled()) {
                Log.w("WebViewConsole", "[NotificationHR] Permission not granted, skipping service start")
                return
            }
            
            try {
                val serviceIntent = Intent(activity, OndaHeartRateService::class.java).apply {
                    action = OndaHeartRateService.ACTION_START
                }
                
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    activity.startForegroundService(serviceIntent)
                } else {
                    activity.startService(serviceIntent)
                }
                
                Log.d("WebViewConsole", "[NotificationHR] Foreground service started successfully")
            } catch (e: Exception) {
                Log.e("WebViewConsole", "[NotificationHR] Error starting service: ${e.message}", e)
            }
        }
        
        @JavascriptInterface
        fun stopHeartRateService() {
            Log.d("WebViewConsole", "[NotificationHR] stopHeartRateService called")
            try {
                val serviceIntent = Intent(activity, OndaHeartRateService::class.java).apply {
                    action = OndaHeartRateService.ACTION_STOP
                }
                activity.stopService(serviceIntent)
                
                Log.d("WebViewConsole", "[NotificationHR] Foreground service stopped successfully")
            } catch (e: Exception) {
                Log.e("WebViewConsole", "[NotificationHR] Error stopping service: ${e.message}")
            }
        }
        
        @JavascriptInterface
        fun isHeartRateServiceRunning(): Boolean {
            // Check if service is running by checking for active foreground notification
            // This is a simple check - in production you might want a more robust solution
            return try {
                val am = activity.getSystemService(Context.ACTIVITY_SERVICE) as android.app.ActivityManager
                val services = am.getRunningServices(Int.MAX_VALUE)
                services.any { it.service.className == OndaHeartRateService::class.java.name }
            } catch (e: Exception) {
                Log.e("WebViewConsole", "[NotificationHR] Error checking service status: ${e.message}")
                false
            }
        }
    }

    private fun sendHealthDataToWeb() {
        lifecycleScope.launch {
            try {
                Log.d("WebViewConsole", "[HealthConnect] Reading health data...")
                val healthData = healthConnectManager.readHealthData()
                val jsonString = healthData.toString()
                
                Log.d("WebViewConsole", "[HealthConnect] Health data read, size: ${jsonString.length}")
                
                runOnUiThread {
                    // Send data via custom event
                    val script = """
                        (function() {
                            console.log('[HealthConnect] Received health data from Android');
                            const data = $jsonString;
                            window.dispatchEvent(new CustomEvent('hc-update', { detail: data }));
                        })();
                    """.trimIndent()
                    
                    webView.evaluateJavascript(script) { result ->
                        Log.d("WebViewConsole", "[HealthConnect] Data sent to WebView, result: $result")
                    }
                }
            } catch (e: Exception) {
                Log.e("WebViewConsole", "[HealthConnect] Error reading health data: ${e.message}", e)
            }
        }
    }
    
    /**
     * Check if Bluetooth runtime permissions are granted (Android 12+)
     */
    private fun hasBluetoothPermissions(): Boolean {
        return if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) {
            val scanGranted = ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.BLUETOOTH_SCAN
            ) == PackageManager.PERMISSION_GRANTED
            
            val connectGranted = ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.BLUETOOTH_CONNECT
            ) == PackageManager.PERMISSION_GRANTED
            
            scanGranted && connectGranted
        } else {
            // Below Android 12, manifest permissions are sufficient
            true
        }
    }
    
    /**
     * Request Bluetooth runtime permissions (Android 12+)
     */
    private fun requestBluetoothPermissions() {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) {
            val permissionsToRequest = mutableListOf<String>()
            
            if (ContextCompat.checkSelfPermission(
                    this,
                    Manifest.permission.BLUETOOTH_SCAN
                ) != PackageManager.PERMISSION_GRANTED
            ) {
                permissionsToRequest.add(Manifest.permission.BLUETOOTH_SCAN)
            }
            
            if (ContextCompat.checkSelfPermission(
                    this,
                    Manifest.permission.BLUETOOTH_CONNECT
                ) != PackageManager.PERMISSION_GRANTED
            ) {
                permissionsToRequest.add(Manifest.permission.BLUETOOTH_CONNECT)
            }
            
            if (permissionsToRequest.isNotEmpty()) {
                ActivityCompat.requestPermissions(
                    this,
                    permissionsToRequest.toTypedArray(),
                    BLUETOOTH_PERMISSION_REQUEST_CODE
                )
            }
        }
    }
}
