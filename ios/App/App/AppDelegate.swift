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
        FirebaseApp.configure()

        // Airbridge iOS SDK v4 — атрибуция установок через SKAN и Universal Links
        let airbridgeOption = AirbridgeOptionBuilder(
            name: "ondalife",
            token: "fc2c61f82d7640bd8ec514a26e8a6926"
        ).build()
        Airbridge.initializeSDK(option: airbridgeOption)
        print("[ONDA] Airbridge iOS SDK v4 initialized")

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
        // Передаём deep link (ondalife://) в Airbridge SDK для атрибуции
        if Airbridge.handleDeeplink(url) {
            print("[ONDA] Airbridge handled deep link: \(url)")
            return true
        }
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Передаём Universal Links в Airbridge SDK для атрибуции
        if let url = userActivity.webpageURL, Airbridge.handleDeeplink(url) {
            print("[ONDA] Airbridge handled Universal Link: \(url)")
            return true
        }
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }
}
