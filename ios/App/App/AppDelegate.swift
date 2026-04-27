import UIKit
import Capacitor
import WatchConnectivity
import FirebaseCore
import Airbridge

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

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
        //
        // DEFERRED via DispatchQueue.main.async: SDK 4.9.x does noticeably
        // more setup work in initializeSDK than 4.1 did (lifecycle observers,
        // network queue, device-id resolution). Calling it inline here was
        // adding ~6 seconds to cold-start before WKWebView got its first
        // paint. async-dispatching to the main queue moves the call to the
        // next runloop tick, after the system has handed the WebView time
        // to render. Still on the main thread, still in the first ~ms after
        // launch — attribution is not affected.
        DispatchQueue.main.async {
            let airbridgeOption = AirbridgeOptionBuilder(
                name: "ondalife",
                token: "fc2c61f82d7640bd8ec514a26e8a6926"
            ).build()
            Airbridge.initializeSDK(option: airbridgeOption)
            print("[ONDA] Airbridge iOS SDK v4 initialized ✅ (deferred)")
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
