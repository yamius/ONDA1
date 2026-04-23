package com.onda.app

import android.app.Application
import android.util.Log
import io.airbridge.sdk.android.Airbridge
import io.airbridge.sdk.android.AirbridgeConfig

class OndaApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        val config = AirbridgeConfig.Builder("ondalife", "fc2c61f82d7640bd8ec514a26e8a6926")
            .build()

        Airbridge.init(this, config)

        Log.d("OndaApp", "[Airbridge] Native Android SDK initialized")
    }
}
