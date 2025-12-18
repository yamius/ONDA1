import UIKit
import Capacitor
import WatchConnectivity

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Initialize WatchConnectivityService singleton as early as possible
        // This ensures WCSession is ready before any UI or alerts appear
        _ = WatchConnectivityService.shared
        print("[ONDA] WatchConnectivityService singleton initialized")
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        print("[ONDA] App will resign active")
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        print("[ONDA] App did enter background")
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        print("[ONDA] App will enter foreground")
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        print("[ONDA] App did become active - WatchConnectivityService will handle reactivation")
    }

    func applicationWillTerminate(_ application: UIApplication) {
        print("[ONDA] App will terminate")
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }
}
