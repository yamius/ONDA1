import Foundation
import Capacitor
import Airbridge

/// Capacitor plugin that exposes the native Airbridge iOS SDK (v4) to JS.
///
/// We need this because the Web SDK (`window.airbridge('event', …)` loaded
/// from `index.html`) does not actually deliver events when running inside
/// the iOS Capacitor WebView — events go into a queue that never flushes,
/// or land in a separate Web stream that can't be joined with the native
/// Install/Open events by IDFA. By routing every custom event through this
/// plugin, the native SDK delivers them with the same device fingerprint,
/// so they show up in the **App Real-time Log** under the same `IDFA` as
/// the install, and Airbridge attribution works end-to-end.
///
/// The JS layer in `src/lib/airbridge.ts` calls these methods through the
/// `OndaAirbridge` plugin proxy and falls back to the Web SDK on platforms
/// where the native plugin is unavailable (browser builds, web preview).
@objc(OndaAirbridgePlugin)
public class OndaAirbridgePlugin: CAPPlugin {

    public override func load() {
        super.load()
        print("[OndaAirbridge] Plugin loaded")
    }

    /// Track an event via the native Airbridge SDK.
    ///
    /// Expected JS payload:
    ///   { category: string,
    ///     action?: string,
    ///     label?: string,
    ///     value?: number,
    ///     semanticAttributes?: object,
    ///     customAttributes?: object }
    @objc func trackEvent(_ call: CAPPluginCall) {
        guard let category = call.getString("category"), !category.isEmpty else {
            call.reject("category is required")
            return
        }
        let action = call.getString("action")
        let label = call.getString("label")
        let value = call.getDouble("value")
        let semanticAttributes = call.getObject("semanticAttributes") ?? [:]
        var customAttributes = call.getObject("customAttributes") ?? [:]

        // Mirror action/label/value into customAttributes so they remain
        // searchable in the Airbridge dashboard even on SDK builds where
        // the legacy positional fields aren't first-class columns.
        if let action = action { customAttributes["action"] = action }
        if let label = label { customAttributes["label"] = label }
        if let value = value { customAttributes["value"] = value }

        Airbridge.trackEvent(
            category: category,
            semanticAttributes: semanticAttributes,
            customAttributes: customAttributes
        )

        print("[OndaAirbridge] trackEvent: \(category) action=\(action ?? "-") label=\(label ?? "-")")
        call.resolve(["ok": true])
    }

    /// Sets the Airbridge user ID. Pass `null`/empty to clear.
    @objc func setUserID(_ call: CAPPluginCall) {
        let id = call.getString("id")
        if let id = id, !id.isEmpty {
            Airbridge.setUserID(id)
            print("[OndaAirbridge] setUserID: \(id)")
        } else {
            Airbridge.clearUser()
            print("[OndaAirbridge] clearUser")
        }
        call.resolve()
    }

    @objc func setUserEmail(_ call: CAPPluginCall) {
        let email = call.getString("email") ?? ""
        Airbridge.setUserEmail(email)
        print("[OndaAirbridge] setUserEmail: \(email)")
        call.resolve()
    }

    @objc func setUserAlias(_ call: CAPPluginCall) {
        guard let key = call.getString("key"), !key.isEmpty else {
            call.reject("key is required")
            return
        }
        let value = call.getString("value") ?? ""
        Airbridge.setUserAlias(key: key, value: value)
        print("[OndaAirbridge] setUserAlias: \(key)=\(value)")
        call.resolve()
    }

    @objc func clearUser(_ call: CAPPluginCall) {
        Airbridge.clearUser()
        print("[OndaAirbridge] clearUser")
        call.resolve()
    }
}
