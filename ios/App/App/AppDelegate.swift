import UIKit
import Capacitor
import WatchConnectivity
import FirebaseCore
import TenjinSDK
import AppTrackingTransparency

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    private var attObserver: Any?
    private var hasConnectedTenjin = false

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // ⚠️ Order matters: Firebase MUST initialize before any MMP.
        // Firebase fires `first_open` (the conversion event Google Ads keys
        // off) on its first configure call. If a tracking SDK starts first
        // it can intercept the launch URL or the lifecycle hook and Firebase
        // ends up never seeing a clean cold-start, which breaks attribution.
        FirebaseApp.configure()
        if FirebaseApp.app() != nil {
            print("[ONDA] Firebase configured ✅")
        } else {
            print("[ONDA] ❌ Firebase configuration failed — GoogleService-Info.plist missing?")
        }

        // Tenjin SDK — replaces Airbridge as our MMP.
        //
        // ⚠️ ATT ordering: TenjinSDK.connect() MUST run AFTER the ATT prompt
        // resolves (.authorized / .denied), not before. If connect() fires
        // while ATT status is .notDetermined, the install postback goes out
        // without IDFA — Tenjin can't device-match the click and every
        // install lands in Organic. We saw this in production: 19/19 installs
        // mis-attributed across AppLovin + Google Ads.
        //
        // So here we ONLY init the singleton. The actual connect() call
        // happens inside the ATT completion handler below.
        DispatchQueue.main.async {
            TenjinSDK.getInstance("AD2VCZNVQ9HQSDTFKSINIBSWGUVPSBHJ")
            print("[ONDA] Tenjin iOS SDK initialized ✅ (connect deferred until ATT resolves)")
        }

        // App Tracking Transparency.
        //
        // Apple's review team rejected build 1.0.3 (Submission ID 08145570…)
        // on iOS 26.4.1 because the ATT prompt never appeared. The app links
        // AppTrackingTransparency.framework and ships
        // NSUserTrackingUsageDescription in Info.plist, so Apple expects the
        // request to be shown before any tracking-relevant data is collected.
        //
        // Anchored to didBecomeActive because requestTrackingAuthorization
        // only displays the system sheet while the app is foreground-active
        // (iOS will silently no-op the call otherwise). Single-shot — the
        // observer is removed inside the handler.
        attObserver = NotificationCenter.default.addObserver(
            forName: UIApplication.didBecomeActiveNotification,
            object: nil,
            queue: .main
        ) { [weak self] _ in
            // Slight delay so the request lands after the WebView's first
            // frame, not during launch animations.
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                if #available(iOS 14, *) {
                    ATTrackingManager.requestTrackingAuthorization { status in
                        print("[ONDA] ATT status: \(status.rawValue)")
                        // Now that ATT is resolved, fire Tenjin connect() —
                        // on the main thread, once per process. On 2nd+ cold
                        // launches the system returns the cached status
                        // synchronously, so connect() still happens promptly.
                        DispatchQueue.main.async {
                            self?.connectTenjinOnce()
                        }
                    }
                } else {
                    // iOS < 14: no ATT, IDFA available unconditionally.
                    self?.connectTenjinOnce()
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

    /// Calls TenjinSDK.connect() at most once per process lifetime, after the
    /// ATT prompt has been resolved. This is what actually fires the install
    /// postback to Tenjin — and through Tenjin to AppLovin / Google Ads /
    /// Meta. Calling it before ATT resolves means IDFA is unavailable and
    /// every install ends up Organic.
    private func connectTenjinOnce() {
        guard !hasConnectedTenjin else { return }
        hasConnectedTenjin = true
        TenjinSDK.connect()
        print("[ONDA] Tenjin connect() fired post-ATT ✅")
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // Capacitor + Firebase Dynamic Links handle the launch URL. Tenjin's
        // attribution model doesn't require the app delegate to forward the
        // URL — install attribution lives in SKAdNetwork postbacks, not deep
        // links. So we just hand off to Capacitor and let it route the URL
        // into the JS layer / Firebase as before.
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Universal Links pass through unchanged to Capacitor.
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }
}
