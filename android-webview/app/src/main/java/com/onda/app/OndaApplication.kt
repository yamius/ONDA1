package com.onda.app

import android.app.Application
import android.util.Log
import io.airbridge.Airbridge
import io.airbridge.AirbridgeOptionBuilder

class OndaApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        val option = AirbridgeOptionBuilder("ondalife", "fc2c61f82d7640bd8ec514a26e8a6926")
            .build()

        Airbridge.initializeSDK(this, option)

        Log.d("OndaApp", "[Airbridge] Native Android SDK v4 initialized")
    }
}
