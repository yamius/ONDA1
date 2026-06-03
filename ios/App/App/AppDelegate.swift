import UIKit
import Capacitor
import WatchConnectivity
import FirebaseCore
import TenjinSDK
import AVFoundation

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

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
            print("[ONDA] Tenjin iOS SDK initialized ✅ (connect deferred until JS calls OndaTenjin.connect after ATT)")
        }

        // ATT prompt is no longer fired from the AppDelegate. The JS
        // onboarding flow (screen 1 → Continue) now calls the
        // `AppTrackingTransparency` Capacitor plugin to surface the prompt,
        // then immediately invokes `OndaTenjin.connect()` so the install
        // postback goes out with IDFA when granted. On 2nd+ cold launches
        // (after the user already answered ATT once) the React layer also
        // calls `OndaTenjin.connect()` on mount once it detects the cached
        // status is determined — so attribution still fires every launch.

        // Активируем WCSession рано для получения данных с часов
        if WCSession.isSupported() {
            print("[ONDA] WCSession supported, activating via OndaWatchManager")
            OndaWatchManager.shared.activateSession()
        }

        // Background audio for practices.
        //
        // The practice soundtrack is an HTML5 <audio> element inside the
        // WKWebView. By default WKWebView uses an ambient-style audio session
        // that iOS silences the moment the app leaves the foreground — so a
        // user who backgrounds the app or locks the phone mid-practice loses
        // the music (and, perceptually, the practice). Overriding the shared
        // AVAudioSession category to .playback — together with the `audio`
        // UIBackgroundModes entry in Info.plist — lets that web audio keep
        // playing in the background and over the lock screen, which is the
        // expected behaviour for a guided breathing / meditation app.
        //
        // We set the CATEGORY only, not setActive(true): the session is
        // actually activated by WKWebView when audio starts playing, so other
        // apps' audio (Spotify, etc.) is not interrupted merely by launching
        // ONDA — only when a practice soundtrack actually begins. And because
        // `audio` background execution is sustained only while audio is
        // *playing*, the app still suspends normally once a practice ends,
        // which keeps this consistent with the watch battery-lifecycle fix.
        do {
            try AVAudioSession.sharedInstance().setCategory(.playback, mode: .default, options: [])
            print("[ONDA] AVAudioSession category set to .playback (background practice audio) ✅")
        } catch {
            print("[ONDA] ⚠️ Failed to set AVAudioSession category: \(error.localizedDescription)")
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
