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

        // Native Airbridge bridge — without this, src/lib/airbridge.ts falls
        // back to the Web SDK and custom events never reach App Real-time Log.
        bridge?.registerPluginInstance(OndaAirbridgePlugin())
        print("[ONDA] OndaAirbridgePlugin registered")
    }
}
