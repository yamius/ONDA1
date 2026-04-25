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
        print("[OndaAirbridge] Plugin loaded — firing self-test event")
        // Self-test: prove the plugin is alive AND that Airbridge.trackEvent
        // delivers from this build. If you see `OndaAirbridge.PluginLoaded`
        // in App Real-time Log, the bridge works end-to-end and any missing
        // events afterwards are JS-side issues, not native.
        // NOTE: SDK v4 trackEvent expects non-optional dicts — pass empty
        // [:] for the semantic side instead of nil.
        Airbridge.trackEvent(
            category: "OndaAirbridge.PluginLoaded",
            semanticAttributes: [:],
            customAttributes: ["source": "self_test"]
        )
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
    ///
    /// Action and label are mirrored into `customAttributes` because the
    /// Airbridge iOS SDK v4 trackEvent signature only takes
    /// `(category, semanticAttributes, customAttributes)`. The dashboard's
    /// Action / Label columns are populated from inside customAttributes
    /// when those keys are present (`action`, `label`).
    @objc func trackEvent(_ call: CAPPluginCall) {
        guard let category = call.getString("category"), !category.isEmpty else {
            call.reject("category is required")
            return
        }
        let action = call.getString("action")
        let label = call.getString("label")
        let value = call.getDouble("value")
        // SDK v4 trackEvent requires non-optional [String: Any] for both
        // attribute dicts. Coerce JSObject? down via empty defaults.
        let semanticAttributes: [String: Any] = call.getObject("semanticAttributes") ?? [:]
        var customAttributes: [String: Any] = call.getObject("customAttributes") ?? [:]

        if let action = action { customAttributes["action"] = action }
        if let label = label { customAttributes["label"] = label }
        if let value = value { customAttributes["value"] = value }

        Airbridge.trackEvent(
            category: category,
            semanticAttributes: semanticAttributes,
            customAttributes: customAttributes
        )

        print("[OndaAirbridge] trackEvent: category=\(category) action=\(action ?? "-") label=\(label ?? "-")")
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
