# ONDA — Facts Source of Truth (for content writing)

**Purpose:** a single, code-verified reference for anyone (human or AI content assistant) writing reviews, comparisons, or landing copy about the ONDA Life app. Use it to keep every claim accurate and consistent across pages.

**Verified against the app code on 2026-09-17. App version 1.9.1 (iOS).**
Scope of verification: the shipping app (`src/`, `ios/`). Where the site currently disagrees with the code, the code wins — those are flagged below.

**Legend:** ✅ verified correct · ⚠️ site currently says something wrong/outdated (fix it) · ➕ real in-app feature not yet covered in articles.

---

## 1. Corrections — what the site currently gets wrong (fix these first)

1. **ℹ️ "8-level / 24-part path" — real, but partially shipped (nuance, not an error).** The 8-level × 3-part curriculum is a genuinely authored program (`levels.ts`) — it is **fine to describe the 8-level path as existing**. Just don't imply every level is fully playable in the app *yet*: today the app populates only about the first **6 circuits = 72 practices**; the later levels are designed and documented but not yet added to the app (`onda-level1-demo_27.tsx` has a 12-circuit array with circuits 7–12 still empty: `practices: []  // Ждём данные`). Safe framing: describe the 8-level path/curriculum, but if you state what's *playable right now*, it's ~72 practices across the early levels — not "all 8 levels live."
2. **⚠️ "Sleep / overnight readiness tracking = —" is wrong.** The app HAS sleep tracking — the **Life Rhythm** feature (Apple Watch → HealthKit `sleepAnalysis`, `src/sleep/rhythm.ts`): sleep regularity %, avg bedtime/wake, avg duration, a good-nights streak, an overall score 0–100, last-night quality. What it lacks is a **single readiness/recovery number** like Oura/WHOOP. Honest mark: **"~" (limited)**, not "—".
3. **⚠️ Homepage "works with Apple Watch, Garmin, or chest strap" / "$1000 watch to $30 band" is false on iOS.** Direct BLE strap/Garmin pairing does not work in the iOS app (no Web Bluetooth in WKWebView; the Bluetooth section is hidden — `showBluetooth = !isIOS`, `ConnectionModal.tsx:86,813`). Real iOS sources: **iPhone camera (PPG) + Apple Watch + any tracker that writes to Apple Health (HealthKit)**. The spec pages ("iPhone camera or Apple Watch only, no chest strap") are correct; the **homepage** overclaims.
4. **⚠️ "Live vitals — heart, breath, stress, energy" is outdated.** The **Stress and Energy tiles were removed** from the UI (`onda-level1-demo_27.tsx:6869`; the waveform is fed `stress={null} energy={null}`). They are still computed internally but not shown. Current live vitals: **pulse, breathing rate, coherence (Apple Watch only)**.
5. **⚠️ Homepage "No paywall" is wrong.** ONDA is **freemium with a paywall**: only the **first 3 practices** are free (`p1-2`, `p1-5`, `p1-9`; `FREE_PRACTICE_IDS`, `onda-level1-demo_27.tsx:106-114`); everything else is behind a subscription. "Free to start" is true; "No paywall" is not.
6. **⚠️ Homepage Google Play button.** Android is not shipped (only a Health Connect bridge scaffold; RevenueCat Android key is a placeholder). Every other page correctly says iOS-only / waitlist.
7. **⚠️ `/measurements` "VO₂max — not measured" is wrong.** VO₂max **is** authorized and read as a baseline extra (`HealthKitHeartRatePlugin.swift:250-277`). The genuinely dormant (queried but not authorized) HealthKit reads are **steps and active energy only**.
8. **⚠️ "Live coherence score ✓" next to "camera ✓" needs a caveat.** Coherence is **Apple Watch only**; on the camera source it is hard-nulled to "--" (`coherenceForSource`, `sensorSource.ts:59-61`). Add "coherence unlocks with an Apple Watch."

---

## 2. Verified parameter map

### Platform
- ✅ iOS (iPhone, iPad, Apple Watch / watchOS). App version **1.9.1**. App ID `com.onda-life.ios`.
- ✅ Android **not shipped** — only bridge scaffolding (Health Connect; RevenueCat Android key placeholder; OneSignal no-op). "Waitlist" is correct.

### Pricing / access
- ✅ Free to start, no account; first reading in ~90 seconds.
- ✅ Freemium: **3 free practices** (`p1-2`, `p1-5`, `p1-9`), then a subscription paywall (RevenueCat / StoreKit, entitlement `ONDA Premium`).
- ✅ Plans: **Monthly + Annual**, with a free trial. Prices come live from RevenueCat; code fallbacks are **$14.99/mo (7-day trial)** and **$64.99/yr ≈ $5.42/mo (14-day trial)**. Do not state exact prices as fixed — they are store-driven.
- ➕ In-app currency **OND** (gamification; artifacts awarded per completed circuit; shop ≈ $0.33/OND).

### Input sources (pulse)
- ✅ iPhone camera (PPG) — no wearable required.
- ✅ Apple Watch (via WCSession / HealthKit) — supplies continuous pulse and the live coherence feedback.
- ✅ Any tracker that writes heart data to Apple Health (via HealthKit).
- ⚠️ Direct BLE chest strap / Garmin on iOS — **not supported** (see Correction 3).

### Live metrics during practice
- ✅ Pulse / heart rate (any source).
- ✅ Breathing rate (breaths/min) — RSA-derived estimate, 6–30 range, shown even on camera. ("breath" as a live vital is correct.)
- ✅ Coherence 0–100 — **Apple Watch only**, camera shows "--". It is a **proprietary RSA peak-concentration score, NOT clinical HRV** — "a feedback metric, not a clinical biomarker."
- ⚠️ Any live "HRV" tile is a **HR standard-deviation surrogate**, not RMSSD/SDNN.
- ⚠️ Stress / Energy tiles — removed from the UI (see Correction 4).

### Breathing guidance
- ✅ Breathing is measured. ⚠️ There is **no fixed numeric pacer/metronome** (no inhale/exhale timer, no "4-7-8") in code — guidance is text + audio + reactive visual. Soften "guided resonance breathing (~6 breaths/min)" toward "guided breathing" unless a real pacer is added. (Site is also internally inconsistent: "about six breaths a minute" vs "roughly 5–6 breaths per minute".)

### Baseline
- ✅ Window **14 days** (`BASELINE_WINDOW_DAYS = 14`). Three range signals: **Resting HR (bpm), HRV/SDNN (ms), Respiratory rate (/min)**. Four single-value extras: peak HR, avg walking pulse, **VO₂max (est.)**, 1-minute recovery.
- ✅ Camera (day-0, no permissions): resting pulse + a breathing estimate only; **HRV is empty ("NO DATA") until an Apple Watch is connected**; no extras.

### Signals / traffic-light (Simple mode)
- ✅ Pure statistics, not AI: a personal corridor of **mean ± SD** (never a population norm), gated by **≥1.5 SD AND a per-metric floor** (resting HR +5 bpm, HRV −15%, breathing +2/min), **minimum 7 nights**, throttled to ≤1 signal / 2 days.
- ✅ Corridor window for the traffic light = **90 days**. Green / Yellow (1 night out) / Red (2+ consecutive nights out); Red has two text phases at the same colour (2–3 nights soft; 4+ nights strong + PDF). Descriptive, never diagnostic.

### Sleep / Life Rhythm (see Correction 2)
- ✅ Exists on iOS (Apple Watch → HealthKit `sleepAnalysis`): regularity %, avg bedtime/wake, duration, good-nights streak (activates at ≥7 days), overall score 0–100, last-night quality. No single readiness/recovery score.

### Program / content (see note 1)
- ✅ **8-level / 24-part path** is the authored curriculum (`levels.ts`) — real and describable. In the app today about **72 practices** are live across the early levels; later levels are designed but not yet populated (12-circuit array, 6 filled). Durations 3–30 min. Practice names are real (Micro-Breath, Still Wave, Warm Pulse, Sense of Being, Inner Listening, First Light, …).
- ➕ **18 adaptive practices** (separate engine, guiding text + ambient audio).
- ✅ Sequential unlock; each completed circuit awards an artifact with an OND bonus.

### Modes
- ➕ **Simple (traffic-light, ~80% of new installs) vs Detailed (expert, ~20%)** — a silent A/B, stable per install, overridable in Settings.

### Diary / export
- ➕ Local-first diary (text / voice / photo), works with no account; syncs to Supabase after sign-in. On-device **PDF** and self-contained **HTML** report (voice embedded, playable). Content is never logged to analytics.

### Notifications
- ➕ Local: daily reminder, streak nudge, lapsed-user series. Anomaly push (time-sensitive, carries no numbers). Promotional push via OneSignal — **opt-in, default off**.

### HealthKit
- ✅ Reads: heart rate, HRV SDNN, resting HR, respiratory rate, walking HR average, **VO₂max**, 1-min recovery, sleep analysis. Dormant (queried but not authorized/read): **steps, active energy** only. "Does not read steps/calories/workouts" is true; "does not read VO₂max" is false (see Correction 7).

### Medical positioning
- ✅ Not a medical device; does not diagnose/treat/monitor. Baseline and signals are descriptive. This is stated correctly across the site — keep it.

---

## 3. In-app but not (or barely) covered in articles

OND currency & artifacts · 18 adaptive practices · Simple/Detailed modes (80/20 A/B) · diary + PDF/HTML export · traffic-light signals + time-sensitive push · Life Rhythm (sleep) · baseline extras (peak/walking HR, VO₂max, 1-min recovery) · first-run coachmarks.

## 4. Honesty caveats to preserve when writing

- Coherence = proprietary RSA score, **not** clinical HRV; **Apple Watch only** (camera blocked).
- Live "HRV" tile = HR std-dev surrogate, not RMSSD/SDNN.
- The "recommendation of the day" shown during the ~30 s "collecting" state is actually **random** from the free set, not personalized.
- Baseline, signals, and the on-device report are **descriptive, never diagnostic**.
- The 8-level / 24-part path is a real authored curriculum, but only the early levels (~72 practices) are populated in the app today — describe the path, don't imply every level is already fully playable.

---

*Maintenance: re-verify against `src/` after any release that changes metrics, sources, pricing, or the level structure. Keep this file the single reference the content assistant reads before writing ONDA claims.*
