# ONDA Baseline — Implementation Report

**Feature:** "My Baseline" — a personal baseline opened from HealthKit / camera
**Branch:** `claude/baseline-onboarding` (25 commits ahead of `main`, not yet merged)
**Target release:** iOS 1.8.9
**Status:** built + previewed; awaiting on‑device (TestFlight) sign‑off, then merge

---

## 1. Summary

A watch user's Apple Watch has been writing months of health history to the
iPhone before ONDA is even installed. This feature **opens** a personal baseline
from that history on day 0 instead of asking the user to build one over weeks: on
first connect the app reads ~14 days of Health, aggregates it, and draws a single
calm "figure card" — resting pulse, HRV spread, breathing, plus derived figures —
giving an instant d0 value and an honest reason to come back tomorrow.

This is **retention step 1** from `ONDA_retention_optimization.md` §5. The whole
build follows one product rule: **the card is a mirror, not an advisor** — it
names, formats and orders real numbers and never judges them (no thresholds, no
"normal", no diagnosis).

---

## 2. Goal & strategy

- **Problem:** d1 = 3.4% / d7 = 0.6%, flat since the June onboarding redesign.
- **Insight (measured):** watches are only ~20% of users (`results_view/metrics_source`:
  watch 20% / camera 53% / simulated 27%), but watch users are the ones who
  return and pay. The lever is instant value for them on day 0.
- **Move:** don't *build* a baseline over weeks — **open** it from HealthKit
  history the moment the watch is connected. Camera users get a day‑0 baseline
  from their first reading; watch users get the 14‑day version on connect.
- **Permission by intent:** never ask for Health at launch/onboarding. The first
  practice runs on the camera (no permissions). Health is requested only when the
  user taps "Connect Apple Watch" — consent‑by‑initiative converts far better.

---

## 3. Architecture & data flow

```
Apple Watch ──(watchOS, background)──► iPhone HealthKit store
                                              │
             tap "Connect Apple Watch"        │  read‑only, on‑device
                    │                          ▼
   PermissionSetupModal ──grant──► HealthKitHeartRatePlugin.queryBaseline(days)
                                              │   (native Swift, HKSampleQuery)
                                              ▼
                    { rhr, hrv, rr, extras:{hrpeak,whr,vo2,hrr} }   ← 14‑day
                    + a second days=1 read                          ← "today"
                                              │
                          buildFromNative() → BaselineData          (src/lib/baseline.ts)
                                              │
                          buildCardModel(readings, extras, source,  (src/lib/baseline-card.ts, PURE)
                                        today?, copy)  ──► CardModel
                                              │
                              <BaselineCard/> renders the figure     (src/components/BaselineCard.tsx)
```

Camera path is the same shape, re‑sourced: a practice's committed bpm (avg/min/max)
+ a breathing estimate → `buildFromCamera()` → the same card (source = `camera`).

**Separation of concerns:**
- **Native (Swift):** the only place that touches HealthKit history.
- **`src/lib/*` (pure, framework‑free):** the data model + the card layout logic.
  No React, no i18n, no Capacitor — fully unit‑testable.
- **React (`BaselineCard.tsx`, home):** rendering, theme, i18n, live values.

**Important:** the 14‑day read is a **local iPhone HealthKit query**. It needs
neither the watch app open nor WCSession reachable — the watch syncs its history
to the phone on its own. Only *live* practice HR needs the watch app.

---

## 4. What was built

### 4.1 Native 14‑day read — `ios/App/App/HealthKitHeartRatePlugin.swift`
- `queryBaseline(days:14)` — `HKSampleQuery` over `[startDate, now]`, grouped into
  per‑day means, then avg/min/max + day‑count across those daily values, for
  resting HR, HRV(SDNN) and respiratory rate.
- **Extras** over the same window: `hrpeak` (true `.heartRate` discreteMax),
  `whr` (`.walkingHeartRateAverage`), `vo2` (`.vo2Max`), `hrr`
  (`.heartRateRecoveryOneMinute`, iOS 16+). Each is best‑effort — a nil drops the
  slot, never invents a number.
- Added `.restingHeartRate`, `.respiratoryRate`, `.walkingHeartRateAverage`,
  `.vo2Max`, `.heartRateRecoveryOneMinute` to `requestFullAuthorization` (**8
  read types total**). Registered `queryBaseline` in the Capacitor `pluginMethods`
  array (a missing registration was a shipped bug — see §6).

### 4.2 Data model — `src/lib/baseline.ts`
- `BASELINE_SIGNALS` (rhr/hrv/rr) + `BASELINE_EXTRAS` (hrpeak/whr/vo2/hrr).
- `BaselineReading {avg,min,max,days}`, `BaselineData {readings, extras}`.
- `buildFromNative(res)` (pulls extras from the native result, finite‑only) and
  `buildFromCamera(session)` (pulse avg/min/max + a single breathing estimate;
  HRV stays empty — the camera cannot give it honestly).

### 4.3 Card model — `src/lib/baseline-card.ts` (pure)
- `buildCardModel(readings, extras, source, today?, copy?)` → `CardModel`.
- Two rules: **columns collapse upward** (a missing figure leaves no gap) and a
  caption states the **real coverage** behind its own number (source‑aware:
  nights for watch, readings for camera).
- Shift mode (`today` present): each figure becomes its signed delta from today.
- `CardCopy` interface + `EN_CARD_COPY` fallback keep the model pure while the
  React layer supplies translated strings.

### 4.4 The figure card — `src/components/BaselineCard.tsx`
- The onda_card_v21 design in DOM: the neon body figure with numbers placed
  around it, coral resting‑pulse hero on the chest, variability bar, closing
  lines. Positions/type mirror `onda_card_render.py` (941×1672 frame); sizes in
  **cqw** (container‑query units) so the whole card scales with one dial.
- **Theme‑aware:** dark figure + dark scrims / light text on dark;
  `_Karta_light.png` + light scrims / dark text on light (DARK/LIGHT `Palette`).
- **Always on home** — never gated on data. No data → figure + an invitation, so
  connecting a watch can only *fill* it, never make it vanish.
- **Realtime hero:** with a live pulse (watch/camera) the coral hero shows it in
  real time with a soft pulsing dot, and live breathing appears on the walking‑
  pulse row. "Live" counts only while a source is actively producing (camera
  mid‑read, or a watch HR seen in the last 8 s, re‑checked at 1 Hz) — so on
  disconnect the hero falls back to the historical baseline.
- **Shift view:** signed deltas today − baseline, **blue** for below, **violet**
  for above; the breathing range (a two‑number span) hides in Shift.
- `BaselineClosingFooter` renders the closing "13 / 6" figures *below* the card
  (watch‑only), in the home, on both themes.

### 4.5 Home integration — `src/onda-level1-demo_27.tsx`
- Home **opens on the baseline**: the block is hoisted to the top under the brand
  header — "Мой Базлайн" title + a "come back tomorrow" subtitle + "(between the
  period average and today)" note + a small **Shift** toggle + the card.
- The coherence / connect window moved **below** the card; the "13 / 6" figures
  and a new **"Мои Рекомендации"** intention block sit before the practices.
- **Camera baseline:** a session accumulator collects committed bpm (avg/min/max)
  + breathing while reading and seals a day‑0 card when the reading ends.
- **Connect flow:** the top "Apple Watch" CTA opens `PermissionSetupModal`; its
  `onOutcome` fires the analytics and, on grant, `loadWatchBaseline()` reads the
  14 days + a `days=1` "today" read and sets the `onda_baseline_watching` flag.
- **Auto‑load:** on every launch, **only if `onda_baseline_watching` is set**
  (i.e. the user has connected before), the watch baseline reloads silently. A
  fresh install runs the camera onboarding untouched.

### 4.6 i18n — all 5 languages
- Every card string extracted into `CardCopy`, built from i18next
  (`useCardCopy()`); `buildCardModel` stays pure with English as fallback.
- `public/locales/{en,es,ru,uk,zh}/translation.json` `baseline.*` — hero label/
  sub, column captions, coverage **plurals** (nights/readings; ru/uk with proper
  one/few/many), variability + interpolated spread/across, the closing lines and
  the live label.

---

## 5. Honesty guardrails (ONDA canon)

- Only real Health/camera values — **no fabricated numbers**. Sparse data shows
  "—" (Shift) or an empty slot; it is never smoothed or invented.
- Coherence is **watch‑only** (the camera cannot give it honestly).
- Coverage caption reflects the **true** count — "14 nights" only when it was 14;
  a new/sparse watch says less.
- No thresholds, no "normal", no "deviation" verdicts, no diagnosis. The card
  names and orders figures; it never judges one. Shift shows a neutral,
  color‑coded delta, not a good/bad label.
- Wellness / breathing training only — **not a medical device**.

---

## 6. Bugs found & fixed (regressions caught during the build)

| # | Symptom | Root cause | Fix (commit) |
|---|---|---|---|
| 1 | `queryBaseline() is not implemented on ios` (baseline never loaded) | `@objc` method existed but was **not registered** in the Capacitor `pluginMethods` array | `74db695b` |
| 2 | Watch's workout **start screen** interrupted the Health permission sheet | `setAutoManaged(true)` fired the instant Health was granted, starting the workout on top of the sheet | gated on `!showPermissionModal` + grace delay — `2d799a76` |
| 3 | After onboarding, the **camera baseline was empty** | the startup auto‑load created a watch baseline whenever a watch was merely paired, hiding the camera offer + blocking the camera seal | gate auto‑load on the `onda_baseline_watching` flag — `bc2d552e` |
| 4 | The "open app on your watch" nudge lingered for connected users | it only hid on `reachable && authorized` (reachable flickers) | hide when `isConnected` (paired + app installed) — `d001f02c` |
| 5 | Realtime pulse froze / breathing lingered after disconnect | live values came from stale `displayHeartRate` | freshness gate (camera reading / watch HR < 8 s) + 1 Hz re‑check — `b097ef7d` |
| 6 | Card vanished when a watch was connected on home | the card was conditionally rendered on data | render it always; empty → invitation — `df865ba3` |
| 7 | Closing block appeared on a camera‑only card | it rendered off breathing data | gate the whole block on variability (watch HRV) — `cfc87568` |
| 8 | `VARIABILITY` stayed English after i18n | the title was hardcoded in the render, not wired to `copy` | wired to `copy.variability` — `e26786ff` |
| 9 | Upload rejected: "train 1.8.8 is closed" | 1.8.8 shipped to prod | bump `MARKETING_VERSION` → 1.8.9 — `d37b8eb9` |

---

## 7. File map

**Native / plugin**
- `ios/App/App/HealthKitHeartRatePlugin.swift` — `queryBaseline` + `queryDiscreteMax` + auth set + `pluginMethods` registration
- `src/plugins/healthKitHeartRate.ts` — `BaselineResult`/`BaselineExtrasResult` types + `queryBaseline` interface

**Pure logic**
- `src/lib/baseline.ts` — signals, extras, `buildFromNative` / `buildFromCamera`
- `src/lib/baseline-card.ts` — `buildCardModel`, `CardCopy`, `EN_CARD_COPY`, coverage/spread helpers

**React / UI**
- `src/components/BaselineCard.tsx` — the card + `BaselineClosingFooter` + `useCardCopy` + DARK/LIGHT palettes
- `src/components/PermissionSetupModal.tsx` — added `onOutcome` (additive)
- `src/components/WatchConnectionPrompt.tsx` — added `connected` prop
- `src/onda-level1-demo_27.tsx` — home integration, camera accumulator, auto‑load, Shift/theme wiring, watch‑workout gating

**Assets / copy / analytics**
- `src/assets/baseline-figure.png` (dark = `_Karta.png`), `baseline-figure-light.png` (`_Karta_light.png`)
- `public/locales/{en,es,ru,uk,zh}/translation.json` → `baseline.*`
- `src/services/AnalyticsService.ts` — event names (`watch_connect_tapped`, `baseline_shown`, `baseline_debug`, `baseline_error`)

---

## 8. Analytics & diagnostics

Fires to Supabase (`app_events`, params in the `metadata` JSONB column) and GA4:
- `watch_connect_tapped { source }` — reach → intent, before the prompt.
- `health_permission { granted, source }` — outcome of the permission sheet
  (best‑effort — iOS hides the true deny result).
- `baseline_shown { source, coverage_days }` — the card populated.
- `baseline_debug { rhr_days, rhr_has, …, hrpeak, whr, vo2, hrr, extras_keys }` —
  exactly what the 14‑day read returned, so empty‑data vs missing‑permission is
  diagnosable without a device session.
- `baseline_error { message }` — the read threw.

GA4 custom dimensions to register (console‑side, accrue forward): `source`,
`granted`, `coverage_days`.

---

## 9. Testing & verification

- **Web preview** (dark + light, all 5 languages, watch/camera/empty/live/Shift
  states) via mock injection — layout, colours, i18n, plurals verified.
- **Device‑only** (HealthKit can't be web‑previewed): the 14‑day read, the
  permission sheet (now 8 toggles — a returning tester must allow the new
  Walking HR / VO₂max / Cardio Recovery toggles, or reinstall for a clean sheet),
  the realtime hero, and the watch‑workout timing.
- Clean test = **delete + reinstall** so `onda_baseline_watching` is unset and the
  camera‑first onboarding runs untouched.

---

## 10. Remaining work / next steps

- **Device sign‑off** in TestFlight (Yakiv), then **merge to `main`** + release
  1.8.9. Build number is a fastlane timestamp; only `MARKETING_VERSION` changes.
- Confirm `NSHealthShareUsageDescription` covers the new read types; keep the
  App‑Review note calling out the read‑only, by‑intent Health baseline.
- Diary buttons at the top of home (they replace the Pulse/Breathing tiles) —
  deferred with the Diary feature.
- The closing "13 / 6" figures don't switch to deltas in Shift (poetic line +
  a constant "6") — revisit if wanted.
- Measure **d1 on the watch cohort** before/after via the events above.

**After this step lands (task §6, each a separate task):** deviation beacons
(the regulatory‑sensitive one), the diary (text/photo/voice), the anomaly‑
triggered diary, and week‑2 patterns.

---

## 11. Commit log (branch `claude/baseline-onboarding`, newest first)

```
e26786ff feat(baseline): i18n the whole card in all 5 languages + subtitle note
81e2d9d7 feat(baseline): theme-aware card — light figure + palette on light theme
0558479d fix(baseline): rename the block to "Мои Рекомендации", center it
bc2d552e fix(baseline): don't preempt the camera onboarding with an auto watch baseline
3f74bd1a feat(baseline): Shift view — signed deltas from baseline, blue − / violet +
fc39d271 feat(baseline): home opens on the baseline; reorder + header + Shift button
2d799a76 fix(watch): don't launch the watch workout on top of the permission sheet
b38e7f9e feat(baseline): align numbers to vertical lines; variability lower; 13/6 below card
cfc87568 fix(baseline): the variability closing block is watch-only
b097ef7d feat(baseline): typographic system + realtime fixes from device review
e20f391e feat(baseline): card polish — dim, 2-line captions, bigger closing text, live hero
74db695b fix(healthkit): register queryBaseline in the Capacitor plugin methods
df865ba3 fix(baseline): card is always on home + can't vanish on watch connect
c2ef0d76 fix(baseline): auto-open the card on launch for connected-watch users
b3dcd1c4 feat(baseline): emit a diagnostic of what the 14-day HealthKit read returned
d001f02c fix(watch): hide the "open app on watch" nudge once the watch is connected
bc15411e fix(baseline): size pass 2 — numbers +20%, captions +40%, drop the "68"
31a76eb9 feat(baseline): read the v21 extras over 14 days (peak/walking/VO2max/recovery)
3cb055be fix(baseline): bigger numbers + dark clouds; drop the redundant watch CTA
d37b8eb9 chore(ios): bump MARKETING_VERSION 1.8.8 → 1.8.9
48d5e380 feat(baseline): wire the card into the home flow (phase 2)
dfb74784 feat(baseline): v21 figure card + camera/native data model (phase 2)
fa1e3cbc feat(baseline): port the baseline data model into the app (phase 2)
c2735981 feat(healthkit): native 14-day baseline read + auth for resting HR / respiratory
06b97c05 feat(analytics): instrument the watch-connect → Health-permission funnel (phase 1)
```
