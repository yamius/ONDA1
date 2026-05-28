import Foundation
import Capacitor
import StoreKit
import UIKit

/// Capacitor plugin that surfaces Apple's `SKStoreReviewController.
/// requestReview(in:)` to the JS layer.
///
/// JS side lives in `src/plugins/ondaStoreReview.ts`. Call it at a
/// natural "value moment" — we fire after the user's 2nd completed
/// practice (see `onda-level1-demo_27.tsx`). Apple silently caps the
/// prompt to ~3 per user per 365 days, so over-calling is safe-by-
/// default but spammy on the JS side.
///
/// `requestReview(in:)` is the modern (iOS 14+) variant that takes the
/// active `UIWindowScene`. Older `requestReview()` is deprecated.
@objc(OndaStoreReviewPlugin)
public class OndaStoreReviewPlugin: CAPPlugin {

    public override func load() {
        super.load()
        print("[OndaStoreReview] Plugin loaded")
    }

    /// Ask iOS to show the rating prompt. Whether it actually appears
    /// is up to the system — the plugin returns `{ requested: true }`
    /// once the request is dispatched; that does NOT mean the user
    /// saw the dialog.
    @objc func requestReview(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            // Find the active foreground scene. We can't just take the
            // first window scene — on iPad split-view there can be
            // several, and asking on a background scene is a no-op
            // (Apple drops the request silently).
            let scene = UIApplication.shared.connectedScenes
                .first(where: { $0.activationState == .foregroundActive })
                as? UIWindowScene

            guard let windowScene = scene else {
                print("[OndaStoreReview] No foregroundActive window scene; skipping")
                call.resolve(["requested": false, "reason": "no_window_scene"])
                return
            }

            if #available(iOS 14.0, *) {
                SKStoreReviewController.requestReview(in: windowScene)
                print("[OndaStoreReview] requestReview(in:) dispatched ✅")
                call.resolve(["requested": true])
            } else {
                // Fallback for iOS 13 (we still ship iOS 15+ deployment
                // target, so this branch is theoretical — kept defensively).
                SKStoreReviewController.requestReview()
                print("[OndaStoreReview] requestReview() (legacy) dispatched ✅")
                call.resolve(["requested": true, "legacy": true])
            }
        }
    }
}
