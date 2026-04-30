import Foundation
import Capacitor
import TenjinSDK

/// Capacitor plugin that exposes the native Tenjin iOS SDK to JS.
///
/// JS side lives in `src/lib/tenjin.ts`. Methods are intentionally a thin
/// 1:1 mirror over the underlying Tenjin API — they don't add validation
/// or sanitization beyond the Tenjin SDK's own contract:
///
///   * Event names are free-form strings (Tenjin tolerates spaces, but we
///     prefer snake_case from the JS layer for consistency with Firebase).
///   * Event values, when present, must be coercible to `Int` (Tenjin
///     accepts NSString-encoded integers via `andEventValue:`).
///   * Transactions take Tenjin's revenue schema directly: productName,
///     ISO currencyCode, integer quantity, decimal unitPrice. RevenueCat
///     gives us all four on every package, so the JS layer forwards them
///     verbatim.
///
/// Replaces the old OndaAirbridgePlugin (deleted in the same release).
@objc(OndaTenjinPlugin)
public class OndaTenjinPlugin: CAPPlugin {

    public override func load() {
        super.load()
        print("[OndaTenjin] Plugin loaded")
    }

    /// Track a custom event.
    ///
    /// Expected JS payload:
    ///   { name: string, value?: number }
    ///
    /// Tenjin accepts an event name only (`sendEvent(withName:)`) or a
    /// name + integer value (`sendEvent(withName:andEventValue:)`). For
    /// non-integer values we coerce to int via rounding so callers don't
    /// have to think about it.
    @objc func trackEvent(_ call: CAPPluginCall) {
        guard let name = call.getString("name"), !name.isEmpty else {
            call.reject("name is required")
            return
        }
        if let value = call.getDouble("value") {
            // Tenjin's eventValue is an NSString-encoded integer per their
            // docs. Round to nearest int so callers can pass durations,
            // counts, etc. as plain numbers.
            let intValue = Int(value.rounded())
            TenjinSDK.sendEvent(withName: name, andEventValue: String(intValue))
            print("[OndaTenjin] event: \(name) value=\(intValue)")
        } else {
            TenjinSDK.sendEvent(withName: name)
            print("[OndaTenjin] event: \(name)")
        }
        call.resolve(["ok": true])
    }

    /// Track a purchase / subscription.
    ///
    /// Expected JS payload (matches RevenueCat's `pkg.product` shape):
    ///   { productName: string,
    ///     currencyCode: string (ISO 4217),
    ///     quantity: number (integer, default 1),
    ///     unitPrice: number (decimal — yearly price, monthly price, etc.) }
    @objc func trackTransaction(_ call: CAPPluginCall) {
        guard let productName = call.getString("productName"), !productName.isEmpty else {
            call.reject("productName is required")
            return
        }
        let currencyCode = call.getString("currencyCode") ?? "USD"
        let quantity = call.getInt("quantity") ?? 1
        // unitPrice is a decimal — RevenueCat gives us prices like 9.99,
        // so we go through NSDecimalNumber to keep float precision.
        let unitPriceDouble = call.getDouble("unitPrice") ?? 0
        let unitPrice = NSDecimalNumber(value: unitPriceDouble)

        TenjinSDK.transaction(
            withProductName: productName,
            andCurrencyCode: currencyCode,
            andQuantity: quantity,
            andUnitPrice: unitPrice
        )
        print("[OndaTenjin] transaction: \(productName) \(currencyCode) qty=\(quantity) price=\(unitPriceDouble)")
        call.resolve(["ok": true])
    }
}
