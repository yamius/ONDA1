import UIKit
import Capacitor

class CustomBridgeViewController: CAPBridgeViewController {
    
    override open func capacitorDidLoad() {
        // Register custom plugins after Capacitor bridge is loaded.
        // The CAP_PLUGIN macro alone is not enough on this app — Pods are
        // built with `use_frameworks!`, which can break Objective-C `+load`
        // auto-discovery for plugins compiled into the main target. Every
        // custom plugin must be added here explicitly.
        bridge?.registerPluginInstance(HealthKitHeartRatePlugin())
        print("[ONDA] HealthKitHeartRatePlugin registered")

        let ondaWatchPlugin = OndaWatchPlugin()
        bridge?.registerPluginInstance(ondaWatchPlugin)
        print("[ONDA] OndaWatchPlugin registered")

        // Native Tenjin bridge — exposes TenjinSDK.sendEvent / .transaction
        // to JS via src/lib/tenjin.ts. Without this registration the JS
        // helpers fall through to a no-op (web build behavior) and Tenjin
        // gets no events on iOS.
        bridge?.registerPluginInstance(OndaTenjinPlugin())
        print("[ONDA] OndaTenjinPlugin registered")
    }
}
