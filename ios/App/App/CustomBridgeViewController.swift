import UIKit
import Capacitor

class CustomBridgeViewController: CAPBridgeViewController {
    
    override open func capacitorDidLoad() {
        // Register custom plugins after Capacitor bridge is loaded
        bridge?.registerPluginInstance(HealthKitHeartRatePlugin())
        print("[ONDA] HealthKitHeartRatePlugin registered successfully")
    }
}
