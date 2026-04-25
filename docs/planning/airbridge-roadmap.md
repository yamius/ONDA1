# Airbridge Analytics — Event Roadmap

Proposed events not yet wired up. Companion to [`docs/architecture/airbridge.md`](../architecture/airbridge.md), which documents what is *already* emitted.

Principles we apply when deciding whether to add an event:

- **Attribution / funnel / revenue first.** Airbridge is paid for to answer "did this campaign cause a paying user?" — events that don't help that story belong in the internal Supabase analytics, not here.
- **One event per user-meaningful moment.** Not per re-render, not per debounce tick.
- **Flat scalar payloads only.** No nested objects — dashboards can't slice them.
- **Safe-noop helpers.** Every new event goes through a helper in `src/lib/airbridge.ts` that guards on `typeof window.airbridge === 'function'`.

---

## 1. High priority — activation & core funnel

> **Status: shipped in Sprint 1.** `Sign Up`, `Sign In`, `App Open`,
> `Complete Onboarding`, `First Practice Complete` are all wired up.
> See [`docs/architecture/airbridge.md`](../architecture/airbridge.md) §2
> for triggers, payloads, and gotchas.

---

## 2. Medium priority — paywall funnel detail & permissions

### Paywall funnel

> **Status: shipped in Sprint 2.** `Dismiss Paywall` is live, and `source`
> is attached as an extra on both `View Paywall` and `Dismiss Paywall`
> (we went with the "filter on existing event" route — no separate
> `Paywall Trigger` event). See
> [`docs/architecture/airbridge.md`](../architecture/airbridge.md) §6 for
> the source-value table.

### Permissions

> **Status: shipped in Sprint 3 (HealthKit + Watch Connected).**
> `HealthKit Permission` fires from `useHealthKitData` /
> `useHealthKitHeartRate` after the system prompt resolves.
> `Watch Connected` fires once per app session on the first
> `paired && watchAppInstalled` reading. `Bluetooth Permission` and
> `Notifications Permission` are **deferred** — neither plugin is
> currently invoked from the JS layer, so there's no resolution
> callback to hook into. Revisit when those flows ship. See
> [`docs/architecture/airbridge.md`](../architecture/airbridge.md) §7.

### Progression milestones

> **Status: shipped in Sprint 3.** `Level Unlocked`, `Circuit Complete`,
> and `Artifact Earned` are wired with localStorage-backed idempotency
> (one event per milestone per device). See
> [`docs/architecture/airbridge.md`](../architecture/airbridge.md) §7
> for the storage keys and rationale.

### Recommendations

| Event | Trigger | Label | Extras |
|---|---|---|---|
| `Recommendation Followed` | User starts a practice that was the top recommendation from the emotional check-in result screen | recommended practice name | `emotion` (source emotion) |

Measures whether our recommender actually steers behavior.

---

## 3. Lower priority — nice-to-haves

Only add if a specific dashboard question demands them. Otherwise they're noise.

| Event | Notes |
|---|---|
| `Pause Practice` / `Resume Practice` | Only useful if abandonment analysis shows a pause/resume pattern worth segmenting. Currently speculative. |
| `Language Changed` | One-off; UA/ES/ZH rollout analysis. Safe to emit from the settings toggle. |
| `Notifications Enabled` (in-app toggle, not system permission) | Re-engagement funnel. |
| `Share App` / `Invite Sent` | Only if/when a share feature ships. |

---

## 4. Explicit "won't track" list

To keep the event stream clean, we deliberately do **not** send these to Airbridge:

- Every tab/menu click that doesn't change funnel state.
- Scroll depth, time-on-screen for arbitrary screens.
- Debug / developer-mode toggles.
- Per-second telemetry (HRV sample stream, breathing rate ticks) — that belongs in Supabase analytics with batched inserts, not an attribution SDK.
- Auth-required redirects and purchase failures — covered by internal analytics (`paywall_auth_required`, `purchase_failed`, `purchase_cancelled`).
- Restore Purchases success — not a new conversion; double-counts revenue.

---

## 5. Suggested rollout order

1. ~~**Sprint 1 — close the funnel.** `Sign Up`, `Sign In`, `App Open`, `Complete Onboarding`, `First Practice Complete`.~~ ✅ Shipped.
2. ~~**Sprint 2 — paywall detail.** `source` extra on `View Paywall`, `Dismiss Paywall`.~~ ✅ Shipped.
3. ~~**Sprint 3 — permissions & progression.** HealthKit + Watch Connected, then `Level Unlocked` / `Circuit Complete` / `Artifact Earned`.~~ ✅ Shipped (Bluetooth + Notifications deferred — no JS-layer callsite yet).
4. ~~**Sprint 4 — iOS native bridge.** `OndaAirbridge` Capacitor plugin so custom events land in the App Real-time Log under the same IDFA as Install/Open.~~ ✅ Shipped (iOS only).
5. **Sprint 5 — Android native bridge.** Same problem on Android: `window.airbridge('event', …)` in the WebView never reaches the App stream. Build the Android half of `OndaAirbridge`. **Not started.** See §6 below.

After each sprint: update [`docs/architecture/airbridge.md`](../architecture/airbridge.md) §9 and remove the shipped items from this roadmap.

---

## 6. Sprint 5 plan — Android native bridge for `OndaAirbridge`

iOS shipped a thin Capacitor plugin (`OndaAirbridgePlugin.swift` +
`.m`) that delegates `trackEvent` / `setUserID` / `setUserEmail` /
`setUserAlias` / `clearUser` to the native Airbridge iOS SDK. Android
needs the symmetric implementation. Once it lands, the JS selector in
`src/lib/airbridge.ts` will pick the native path on Android too:

```ts
const _useNativeAirbridge: boolean =
  (Capacitor.getPlatform() === 'ios' || Capacitor.getPlatform() === 'android') &&
  Capacitor.isPluginAvailable('OndaAirbridge');
```

(today only the iOS branch is true; the platform check just needs to
be widened.)

### Files to add

| File | What |
|---|---|
| `android/app/src/main/java/com/onda/app/OndaAirbridgePlugin.kt` (new) | Kotlin class extending `com.getcapacitor.Plugin`, annotated `@CapacitorPlugin(name = "OndaAirbridge")`. Methods: `trackEvent`, `setUserID`, `setUserEmail`, `setUserAlias`, `clearUser`. Each delegates to `co.ab180.airbridge.Airbridge` (or `AirbridgeKotlin` extensions). |
| `android/app/src/main/java/com/onda/app/MainActivity.java` (edit) | Register `OndaAirbridgePlugin::class.java` in `bridge.add()` — same pattern Capacitor docs show. Verify that an existing `registerPlugin` block already exists (used for the Firebase Analytics bridge). |
| `android/app/build.gradle` (edit) | Add the Airbridge Android SDK dependency: `implementation "co.ab180.airbridge:airbridge:4.x.x"`. Pin to the same major version line as the iOS pod (`airbridge-ios-sdk` 4.1.3) so dashboard schemas line up. |
| `android/app/src/main/AndroidManifest.xml` (edit) | If the SDK requires init metadata (app token, name) declare them under `<application>` — mirror the iOS Info.plist setup. Token: `fc2c61f82d7640bd8ec514a26e8a6926`, app name: `ondalife`. |
| `android/app/src/main/.../OndaApplication.kt` or wherever the app's `Application` class lives (edit, or new) | Call `Airbridge.initializeSDK(application, app, token)` in `onCreate()`. **Order:** Firebase first, then Airbridge — same rule as iOS so `first_open` lands cleanly for Google Ads. |
| `src/lib/airbridge.ts` (edit) | Widen the `_useNativeAirbridge` platform check from `'ios'` to also accept `'android'`. No other changes — the public helpers route through `_sendAirbridge()` which already calls the right path. |
| `docs/architecture/airbridge.md` (edit) | Mention Android in §1 (the SDK section). |

### Things to watch for

- **Deep link handling.** Android already routes `ondalife://` and Universal Links through `MainActivity`. Same rule as iOS: don't let one SDK eat the URL — pass it to both Airbridge (`Airbridge.trackDeeplink(intent)`) and the existing Capacitor handler.
- **Install Referrer.** Airbridge Android relies on Google Play Install Referrer for organic-vs-paid attribution. Add the dependency `implementation "com.android.installreferrer:installreferrer:2.x"` if the SDK doesn't pull it transitively. Verify the AndroidManifest includes the `<receiver>` for `INSTALL_REFERRER` (modern SDK does this automatically).
- **ProGuard / R8.** If release builds shrink, add Airbridge keep rules to `android/app/proguard-rules.pro`. The SDK ships its own `consumer-rules.pro`, but verify with a Play Internal Testing build that events fire.
- **Existing Firebase Analytics Android bridge.** The Kotlin code already exposes a `(window as any).Android` interface for Firebase events (`src/lib/analytics-bridge.ts`). Don't reuse that channel — `OndaAirbridge` should be its own Capacitor plugin so the JS selector in `src/lib/airbridge.ts` can probe `Capacitor.isPluginAvailable('OndaAirbridge')` symmetrically with iOS.

### Verification

1. Android Studio → Logcat shows `[OndaAirbridge] Plugin loaded` on app start.
2. After Sign In, Logcat shows `[OndaAirbridge] trackEvent: auth action=Sign In label=email`.
3. Airbridge dashboard → **App Real-time Log** filtered to OS = `Android` shows the event under the same `GAID` as the install.
4. Deep-link smoke test: open `https://onda.life/?airbridge_referrer=...` from another app; both Airbridge attribution and Capacitor JS handler fire.

### Non-goals for Sprint 5

- No new event types — just port the existing iOS coverage to Android.
- No Web SDK changes — the Web SDK in `index.html` keeps serving browser/PWA traffic.

---

## 7. Implementation checklist for a new event

Copy-paste template when promoting an item from this doc to production:

- [ ] Add a helper to `src/lib/airbridge.ts` (guard + `try/catch` + `console.log`).
- [ ] Call it from the component at the exact UX moment (not inside a debounced handler).
- [ ] Verify once-per-user / once-per-session semantics if applicable (persistent flag in Supabase or secure storage).
- [ ] Add a row to the reference table in `docs/architecture/airbridge.md` §8.
- [ ] Remove the item from this roadmap.
- [ ] Verify on device: browser console shows `[Airbridge] …`; Xcode console shows the native bridge call.
