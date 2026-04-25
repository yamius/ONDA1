# Airbridge Analytics — Event Tracking

Reference for every event currently emitted to Airbridge. This is **paid-attribution and product-analytics telemetry** and is orthogonal to the internal Supabase-backed analytics described in [`analytics.md`](./analytics.md).

- **Helper module:** `src/lib/airbridge.ts`
- **SDK:** `airbridge-capacitor` (native bridge), exposed on web as `window.airbridge`
- **Safety:** every helper silently no-ops when `window.airbridge` is not a function, so the app is safe on web and before the SDK attaches.

---

## 1. Conventions

| Field | Meaning |
|---|---|
| `event_name` | The name surfaced in the Airbridge dashboard (`action` on the SDK's `event` payload). |
| `category` | Internal grouping, not user-visible in dashboards. |
| `label` | Primary free-form string for filtering / grouping (practice name, emotion, plan). |
| `value` / `currency` | Standard Airbridge monetary fields (revenue dashboard picks up automatically). |
| `extra` fields | Any additional payload keys — flat scalars only; no nested objects. |

All strings are in the user's current locale — we translate via `t(key)` at emit time so the label matches what the user saw on screen.

---

## 2. Lifecycle & Activation

Sprint 1 funnel events. All helpers live in `src/lib/airbridge.ts`.

| Event | Category | Trigger | Label | Extras | Source |
|---|---|---|---|---|---|
| `App Open` | `lifecycle` | **Cold start:** first render of the root view (`initAirbridgeAppOpenTracking()`). **Resume:** Capacitor `App.appStateChange` with `isActive: true`. | — | `cold_start: boolean` | `onda-level1-demo_27.tsx` |
| `Sign Up` | `auth` | Supabase `onAuthStateChange` event `SIGNED_IN`, **and** `\|last_sign_in_at − created_at\| < 5s` (new-user heuristic) | `'email'` \| `'apple'` \| `'google'` | — | `onda-level1-demo_27.tsx` |
| `Sign In` | `auth` | Same listener, same event — returning-user branch of the heuristic | `'email'` \| `'apple'` \| `'google'` | — | `onda-level1-demo_27.tsx` |
| `Complete Onboarding` | `onboarding` | `handleOnboardingNext()` when `onboardingScreen === 3` — fires right before `setShowOnboarding(false)` | — | `duration_seconds` | `onda-level1-demo_27.tsx` |
| `First Practice Complete` | `activation` | Fires next to **every** valid `Finish Practice` / `Finish Adaptive Practice` (basic + adaptive). Helper is idempotent via `localStorage.onda_airbridge_first_practice_tracked` so only the first one actually emits. | localized practice name | `surface: 'basic' \| 'adaptive'` | `onda-level1-demo_27.tsx`, `AdaptivePracticeModal.tsx` |

### Gotchas

- **INITIAL_SESSION / TOKEN_REFRESHED** fire on every cold start and hourly token refresh. The auth listener filters on `_event === 'SIGNED_IN'` to avoid double-counting.
- **OAuth method** is read from `session.user.app_metadata.provider` (normalized to `email` / `apple` / `google`). Unknown providers collapse to `email`.
- **First Practice flag is per-device** (localStorage). If a user reinstalls, we'll re-emit — acceptable because Airbridge dedupes by install anyway.
- **Onboarding duration** uses a ref captured on first render while `showOnboarding === true`, so it's accurate for single-session completion but reads as `undefined` if the user kills the app mid-onboarding and resumes later (we don't persist the start time).

---

## 3. Practice Lifecycle — Basic Practices (Parts 1–4)

**Source:** `src/onda-level1-demo_27.tsx` (`completePractice`, `startPractice`, `finishPractice`, `exitPractice`).

| Event | Trigger | `label` | Extra |
|---|---|---|---|
| `View Practice` | `completePractice()` — user taps a practice card and the intro screen opens | localized practice name (`getPracticeName(id)`) | — |
| `Start Practice` | `startPractice()` — user taps Start, practice enters `active` state | localized practice name | — |
| `Finish Practice` | `finishPractice()` — user taps Complete **and** session passes the validity threshold | localized practice name | — |
| `Stop Practice` | **a)** `finishPractice()` when threshold NOT met (user gave up early via Complete button), or **b)** `exitPractice()` when user hits X during an active practice | localized practice name | — |

### Completion threshold (basic)

```ts
const timePercent       = practiceTime / (targetTime || 720);
const minQualityRequired = hasRealMetricsAtFinish ? 70 : 33;
const isValidForArtifact = timePercent >= 0.8 && qualityScore >= minQualityRequired;
```

- **≥80% of target time** **AND** **quality ≥ minQualityRequired** (70 with real sensor data, 33 without) → `Finish Practice`
- Otherwise → `Stop Practice`

### What does NOT fire Stop
- X tapped on the intro screen (user never started — nothing to stop)
- X tapped on the result screen (Finish/Stop was already emitted by `finishPractice`)

---

## 4. Practice Lifecycle — Adaptive Practices

**Source:** `src/components/AdaptivePracticeModal.tsx`.

Adaptive practices are the 7 emotion-routed practices reachable from the emotional check-in (`inner_smile`, `amoeba_dance`, `warm_sphere`, `rest_breath`, `silence_point`, `listen_space`, `still_form`, `body_cocoon`, etc.).

| Event | Trigger | `label` | Extra |
|---|---|---|---|
| `View Adaptive Practice` | `useEffect` fires when the modal opens and the practice object resolves | `t(practice.name)` | — |
| `Start Adaptive Practice` | end of `startPractice()` after `setPracticeState('practice')` | `t(practice.name)` | — |
| `Finish Adaptive Practice` | `completePractice()` — user taps Complete **and** time threshold met | `t(practice.name)` | see below |
| `Stop Adaptive Practice` | **a)** `completePractice()` when threshold NOT met, or **b)** `handleClose()` with `practiceState === 'practice'` | `t(practice.name)` | — |

### Completion threshold (adaptive)

```ts
const isValidForCompletion = practiceTime >= practice.targetTime * 0.8;
```

Mirrors the time component of the basic-practice threshold. Adaptive practices have no separate quality gate (they don't feed the artifact system).

### `Finish Adaptive Practice` extra payload

Session result, added for cohort/outcome analysis in the dashboard:

```ts
{
  duration_seconds:  practiceTime,
  stress_before:     initialMetrics.stress,       // 0–100
  stress_after:      Math.round(finalStress),     // best value during session
  energy_before:     initialMetrics.energy,       // 0–100
  energy_after:      Math.round(finalEnergy),
  has_real_metrics:  hasRealMetrics,              // true = Watch / HRM / HealthKit; false = simulated
  ond_earned:        ondReward.totalOnd,
}
```

> **Filter tip.** Always slice by `has_real_metrics: true` when analyzing stress/energy deltas — simulated sessions use default 50/50 start and synthesize changes.

---

## 5. Emotional Check-In

**Source:** `src/components/EmotionalCheckModal.tsx`.

| Event | Trigger | `label` | Extra |
|---|---|---|---|
| `Start Emotional Check` | `mediaRecorder.start()` — user taps the mic to record | — | — |
| `Finish Emotional Check` | `setRecordingState('result')` — analysis completes in either the real-API path or the mock-fallback path | localized emotion name (`t('emotional_check.calmness')` → "Calmness" / "Спокійність" / …) | — |

Both code paths that resolve an emotion emit exactly one `Finish Emotional Check`.

---

## 6. Paywall — Subscription

**Source:** `src/components/SubscriptionModal.tsx`.

| Event | Trigger | `label` | Extra |
|---|---|---|---|
| `View Paywall` | `useEffect` on `isOpen && !isPremium` — paywall opens to a user who actually needs to convert | — | `source` |
| `Click Paywall Button` | start of `handlePurchase()`, **before** auth check and product availability check | `selectedPlan` ∈ `{'yearly', 'monthly'}` | — |
| `Subscribe` | `if (success)` branch of `await purchase(pkg)` — revenue-qualified event | plan | see below |
| `Dismiss Paywall` | Modal closes WITHOUT a successful Subscribe or Restore. Auto-close-when-already-premium does NOT count. | `selectedPlan` at close time | `source`, `time_on_screen_seconds` |

### `source` values

Propagated from each call site via the `<SubscriptionModal source="…" />` prop.

| Value | Where the user came from |
|---|---|
| `practice_gate_basic` | Locked basic-practice intro CTA in `onda-level1-demo_27.tsx` |
| `practice_gate_adaptive` | Locked adaptive-practice CTA in `AdaptivePracticeModal.tsx` |
| `cta_button` | Floating top-of-screen subscribe button (`onda-level1-demo_27.tsx`) |
| _(unset)_ | Legacy / future entry point — appears in dashboards as no-source |

When adding a new entry point, pick a snake_case slug, set it via `setPaywallSource()` (or `source="…"` directly on the modal), and add a row above.

### `Subscribe` payload

```ts
{
  value:      pkg.product.price,             // number, localized
  currency:   pkg.product.currencyCode ?? 'USD',
  product_id: pkg.product.identifier,        // e.g. 'onda_yearly'
  label:      selectedPlan,                  // 'yearly' | 'monthly'
}
```

Uses Airbridge's standard semantic fields `value` + `currency` so the **Revenue** dashboard picks up the event automatically — no custom mapping needed.

### What does NOT fire Subscribe

- **Restore Purchases** (`handleRestore`) — restoring an existing entitlement is not a new conversion; emitting `Subscribe` would double-count revenue.
- Failed purchases, canceled purchases, auth-required redirects — tracked only in internal Supabase analytics (`purchase_failed`, `purchase_cancelled`, `paywall_auth_required`).

---

## 7. Deep Links (informational)

Handled by `initAirbridgeDeepLinkHandler()` — when an Airbridge deep-link event fires on the native layer, the handler forwards it to the SDK as:

```ts
window.airbridge('event', {
  category: 'airbridge',
  action:   'app_open',
  label:    <url>,
  deeplink: <url>,
  ...query_params,
})
```

Not triggered from product code — pure attribution plumbing.

---

## 8. User identification

**Source:** `identifyAirbridgeUser()` in `src/lib/airbridge.ts`, called from the auth flow.

```ts
window.airbridge('setUserID',    id)
window.airbridge('setUserEmail', email)    // if provided
window.airbridge('setUserAlias', alias)    // if provided
```

Links pre-auth attribution events (deep-link clicks, Store visits) to the authenticated user. No custom events emitted from this function.

---

## 9. Full event reference (one-page table)

| `event_name` | Category | Label | Extras | Source file |
|---|---|---|---|---|
| `App Open` | `lifecycle` | — | `cold_start` | `onda-level1-demo_27.tsx` |
| `Sign Up` | `auth` | method | — | `onda-level1-demo_27.tsx` |
| `Sign In` | `auth` | method | — | `onda-level1-demo_27.tsx` |
| `Complete Onboarding` | `onboarding` | — | `duration_seconds` | `onda-level1-demo_27.tsx` |
| `First Practice Complete` | `activation` | practice name | `surface` | `onda-level1-demo_27.tsx`, `AdaptivePracticeModal.tsx` |
| `View Practice` | `practice` | practice name | — | `onda-level1-demo_27.tsx` |
| `Start Practice` | `practice` | practice name | — | `onda-level1-demo_27.tsx` |
| `Finish Practice` | `practice` | practice name | — | `onda-level1-demo_27.tsx` |
| `Stop Practice` | `practice` | practice name | — | `onda-level1-demo_27.tsx` |
| `View Adaptive Practice` | `practice` | practice name | — | `AdaptivePracticeModal.tsx` |
| `Start Adaptive Practice` | `practice` | practice name | — | `AdaptivePracticeModal.tsx` |
| `Finish Adaptive Practice` | `practice` | practice name | duration, stress/energy before/after, has_real_metrics, ond_earned | `AdaptivePracticeModal.tsx` |
| `Stop Adaptive Practice` | `practice` | practice name | — | `AdaptivePracticeModal.tsx` |
| `Start Emotional Check` | `emotional_check` | — | — | `EmotionalCheckModal.tsx` |
| `Finish Emotional Check` | `emotional_check` | emotion name | — | `EmotionalCheckModal.tsx` |
| `View Paywall` | `paywall` | — | `source` | `SubscriptionModal.tsx` |
| `Click Paywall Button` | `paywall` | plan | — | `SubscriptionModal.tsx` |
| `Subscribe` | `paywall` | plan | value, currency, product_id | `SubscriptionModal.tsx` |
| `Dismiss Paywall` | `paywall` | plan | `source`, `time_on_screen_seconds` | `SubscriptionModal.tsx` |
| `app_open` (deep-link) | `airbridge` | url | deeplink + query params | `airbridge.ts` |

---

## 10. How to add a new event

1. **Add a helper** in `src/lib/airbridge.ts` following the existing pattern (guard `typeof window.airbridge !== 'function'`, wrap in `try/catch`, log to console on emit).
2. **Call it** from the component at the exact UX moment — not inside analytics queues or debounced handlers (that's what the Supabase analytics is for).
3. **Update this document**, both the relevant section and the one-page reference table in §9.
4. **Verify on device.** In the browser console you should see `[Airbridge] … event: <name> <label>` on every emit. On iOS, check Xcode console for the native bridge call.

For the planned additions (sign-up / activation / paywall dismiss / HealthKit permission / …), see [`docs/planning/airbridge-roadmap.md`](../planning/airbridge-roadmap.md).
