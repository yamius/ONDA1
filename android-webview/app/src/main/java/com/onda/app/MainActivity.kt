package com.onda.app

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.media.AudioManager
import android.net.Uri
import android.os.Bundle
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
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.webkit.WebViewAssetLoader

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private var pendingPermissionRequest: PermissionRequest? = null

    companion object {
        private const val PERMISSION_REQUEST_CODE = 100
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        webView = WebView(this)
        setContentView(webView)

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
            
            // Получаем фрагмент URL с токеном
            val fragment = data.fragment ?: ""
            val fullUrl = "https://appassets.androidplatform.net/#$fragment"
            
            Log.d("WebViewConsole", "[OAuth] Redirecting to: $fullUrl")
            
            // Перенаправляем WebView на URL с токеном
            if (::webView.isInitialized) {
                webView.loadUrl(fullUrl)
            }
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)

        if (requestCode == PERMISSION_REQUEST_CODE) {
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
    }

    override fun onBackPressed() {
        if (::webView.isInitialized && webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
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
    }
}
