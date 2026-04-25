import UIKit
import Capacitor
import WatchConnectivity
import FirebaseCore
import Airbridge
import AppTrackingTransparency

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    private var attObserver: Any?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // ⚠️ Order matters: Firebase MUST initialize before Airbridge.
        // Firebase fires `first_open` (the conversion event Google Ads keys
        // off) on its first configure call. If Airbridge starts first it can
        // intercept the launch URL or the lifecycle hook and Firebase ends up
        // never seeing a clean cold-start, which is what broke ad attribution.
        FirebaseApp.configure()
        if FirebaseApp.app() != nil {
            print("[ONDA] Firebase configured ✅")
        } else {
            print("[ONDA] ❌ Firebase configuration failed — GoogleService-Info.plist missing?")
        }

        // Airbridge iOS SDK v4 — атрибуция установок через SKAN и Universal Links.
        // Initialized AFTER Firebase so first_open lands cleanly.
        let airbridgeOption = AirbridgeOptionBuilder(
            name: "ondalife",
            token: "fc2c61f82d7640bd8ec514a26e8a6926"
        ).build()
        Airbridge.initializeSDK(option: airbridgeOption)
        print("[ONDA] Airbridge iOS SDK v4 initialized ✅")

        // Sanity probe: fire one event from the main app target right after
        // SDK init. If this doesn't appear in App Real-time Log, the SDK
        // itself isn't delivering custom events — and our plugin can't fix
        // that. If it DOES appear but events from OndaAirbridgePlugin don't,
        // the bug is somewhere between Capacitor's plugin context and the
        // SDK's tracking pipeline.
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            Airbridge.trackEvent(
                category: "AppDelegate.SanityProbe",
                semanticAttributes: [:],
                customAttributes: ["source": "did_finish_launching", "v": "0b38265"]
            )
            print("[ONDA] Airbridge sanity probe sent")
        }

        // Запрашиваем ATT (App Tracking Transparency) — нужно для IDFA на iOS 14+
        attObserver = NotificationCenter.default.addObserver(
            forName: UIApplication.didBecomeActiveNotification,
            object: nil,
            queue: nil
        ) { [weak self] _ in
            if #available(iOS 14, *) {
                ATTrackingManager.requestTrackingAuthorization { status in
                    print("[ONDA] ATT status: \(status.rawValue)")
                }
            }
            if let observer = self?.attObserver {
                NotificationCenter.default.removeObserver(observer)
                self?.attObserver = nil
            }
        }

        // Активируем WCSession рано для получения данных с часов
        if WCSession.isSupported() {
            print("[ONDA] WCSession supported, activating via OndaWatchManager")
            OndaWatchManager.shared.activateSession()
        }
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
    }

    func applicationWillTerminate(_ application: UIApplication) {
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // Both SDKs must see the launch URL — neither is allowed to "eat" it.
        // Airbridge needs it for attribution, Firebase Dynamic Links / Capacitor
        // routing need it to forward the URL into the JS layer. Previously we
        // returned early on `isAirbridgeDeeplink == true` which blocked
        // Capacitor (and therefore Firebase / WebView routing) from seeing
        // ondalife:// links at all.
        let isAirbridgeDeeplink = Airbridge.handleDeeplink(url: url) { convertedUrl in
            print("[ONDA] Airbridge converted deep link: \(convertedUrl)")
        }
        if isAirbridgeDeeplink {
            print("[ONDA] Airbridge captured deep link for attribution: \(url)")
        }
        // Always pass through so Capacitor + Firebase get the URL too.
        let capacitorHandled = ApplicationDelegateProxy.shared.application(app, open: url, options: options)
        return isAirbridgeDeeplink || capacitorHandled
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Same rule for Universal Links: forward to both SDKs.
        var airbridgeHandled = false
        if let universalLinkUrl = userActivity.webpageURL {
            airbridgeHandled = Airbridge.handleDeeplink(url: universalLinkUrl) { convertedUrl in
                print("[ONDA] Airbridge converted Universal Link: \(convertedUrl)")
            }
            if airbridgeHandled {
                print("[ONDA] Airbridge captured Universal Link for attribution: \(universalLinkUrl)")
            }
        }
        let capacitorHandled = ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
        return airbridgeHandled || capacitorHandled
    }
}
