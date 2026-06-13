# ONDA Life — Technical Architecture & Product Ecosystem
## Full Deck v2 — drop-in replacement for existing PDF

> Style matched to the existing PDF (English, terse bullet-cards,
> monospace technical references). 15 slides — adds Apple Watch,
> Multi-Channel HR, Sensor Fusion & Life Rhythm; fixes Eye-Scan
> framing; clarifies what actually fuses into the unified score.
> Source: direct inspection of `yamius/ONDA1` repository @ 2026-05-20.

---

## Slide 1 — Title

**ONDA LIFE**
*Technical Architecture & Product Ecosystem*

PROJECT OVERVIEW • ENGINEERING DOCUMENTATION • 2026

---

## Slide 2 — The ONDA Ecosystem: Three Connected Products

> Unified Ecosystem: Shared Supabase backend, common brand identity,
> and seamless cross-platform user profiles.

### IOS & ANDROID — Mobile Application
- **Biofeedback:** Real-time HRV practices and neural optimization.
- **Eye-Scan:** Touchless ANS measurement via the phone camera.
- **Gamification:** OND currency, 8 levels, digital artifacts.
- **Personalization:** AI-driven emotional checks and adaptive sessions.

### WEB / SEO — Landing & Knowledge Site
- **Content Engine:** 68 articles, 216 glossary terms, 11 topic hubs.
- **Editorial:** 28 product reviews + 3 round-ups.
- **SEO Strategy:** 630+ prerendered pages across 5 languages.

### ⌚ APPLE WATCH — Native Companion
- **WatchKit App:** Standalone watchOS interface, not a mirror of the phone.
- **WCSession:** Real-time HR streaming with sub-second latency.
- **Workout Session:** Background-stable HR capture during long practices.

---

## Slide 3 — User Journey: From First Launch to Daily Practice

### THE FIVE-STEP FIRST-RUN FLOW

▸ **Welcome Scene** — Three.js animated intro establishes the biological-
  void visual language (`WelcomeScene.tsx`).

▸ **Language Selection** — Auto-detection of 5 locales (EN, ES, RU, UK, ZH)
  with manual override (`LanguageModal`).

▸ **Permission Setup** — Contextual requests for HealthKit, camera,
  Bluetooth, motion sensors and notifications, each preceded by a primer
  explaining *why* (`PermissionSetupModal`, `NotificationPrimerModal`).

▸ **Connection** — Optional pairing with Apple Watch, BLE chest-strap or
  ring (`ConnectionModal`, `WatchConnectionPrompt`).

▸ **Practice Start** — Direct entry to Level 1. Account creation is
  offered only after the first biometric reading.

> **DESIGN PRINCIPLE:** "No paywall, no account gate, no email capture
> before the first biometric reading. Trust is earned in under 90 seconds."

*Technical Context: Onboarding funnel analytics track conversion from each
permission request to first successful HRV reading.*

---

## Slide 4 — Core Practice Engine: 8 Levels of Progression

### THE LEVEL ARCHITECTURE

| LEVEL 1 — Foundation | Awareness, breath intro, baseline HRV calibration. |
| LEVEL 2 — Calibration | Resonance breathing (0.1 Hz), parasympathetic activation. |
| LEVEL 3 — Synchronization | Coherence training, biofeedback-driven sessions. |
| LEVEL 4 — Stress Architecture | HPA-axis regulation, cortisol-mapping exercises. |
| LEVEL 5 — Emotional Layer | Limbic-system practices, emotional-check protocols. |
| LEVEL 6 — Cognitive Layer | Focus, attention, and flow-state induction. |
| LEVEL 7 — DNA Consciousness | Epigenetic design, advanced longevity protocols. |
| LEVEL 8 — Integration | Master tier: self-directed protocol authoring. |

### PRACTICE ANATOMY

▸ **5–30 min audio** streamed from Supabase CDN, with offline IndexedDB
  cache (`useAudioCache`) for in-flight or low-signal sessions.

▸ **Adaptive cueing** (`AdaptivePracticeModal`) — pace and depth adjusted
  in real time from client-side HRV computation.

▸ **Three.js practice environment** — immersive visual feedback tied to
  the user's coherence state (`@react-three/fiber`).

▸ **Post-practice debrief** — HR curve, OND earned, level progression,
  optional emotional check-in.

*Technical Context: 16 dedicated modal components orchestrate the entire
session flow without page navigation.*

---

## Slide 5 — Live Biofeedback UI: The Vitals Dashboard

### REAL-TIME TELEMETRY (Tile Layout)

```
┌──────────────┐  ┌──────────────┐
│ HEART RATE   │  │ HRV (rMSSD)  │
│   72 BPM     │  │    45 ms     │
└──────────────┘  └──────────────┘
┌──────────────┐  ┌──────────────┐
│ STRESS SCORE │  │ ENERGY SCORE │
│   24 / 100   │  │   88 / 100   │
└──────────────┘  └──────────────┘
```

*Streamed from Apple Watch (WCSession), BLE peripherals or Health
Connect with sub-1-second latency. Client-side HRV computation updates
every 30 s.*

### TOUCHLESS NERVOUS SYSTEM SCAN — *SHIPPING FEATURE*

▸ **MediaPipe Tasks Vision** — pupil oscillation, blink pattern and
  micro-expression analysis directly on the phone camera.

▸ **30-second protocol** — Instant ANS state inference, no wearable required.

▸ **Actionable insight** — App immediately recommends the matching
  practice level based on stress / energy reading.

▸ **Hardware-free entry point** — A user with no watch, no chest-strap
  and no ring can still measure their nervous system.

*Engineering: `NervousSystemScan.tsx` + `useEyeScan.ts` +
`eyeScanMetrics.ts` (tested in `__tests__/eyeScanMetrics.test.ts`).*

---

## Slide 6 — AI Personalization & Companion Chat

### EMOTIONAL CHECK-IN — Structured

▸ **Free-text input** — User describes feelings in 2–3 sentences
  (`EmotionalCheckModal`).

▸ **Edge analysis** — Supabase Deno function invokes **OpenAI GPT-4** for
  valence and arousal mapping.

▸ **Adaptive response** — App surfaces the matching level/practice based
  on the AI-derived emotional state.

```json
{ "emotion": "calm", "valence": 0.8, "arousal": 0.2,
  "recommendation": "Level 2" }
```

### LIZA — Companion Chat — Conversational

▸ **Pattern engine** — Custom flow graphs in `flows.json` (`bot/`),
  ELIZA-style rules for fast, offline-capable dialogue.

▸ **Hybrid logic** — Local flows handle common intents; escalation to
  GPT-4 only for ambiguous cases (cost-efficient).

▸ **Privacy first** — Text processed in-flight; no transcripts persisted,
  only structured analysis results.

```
User: "I feel tired." → Flow: FatigueDetected → Action: Suggest Level 1
```

---

## Slide 7 — Apple Watch + Multi-Channel HR ⚡ *NEW*

> A hardware-agnostic biofeedback layer — works on a $1000 Apple Watch
> Ultra, a $200 Polar H10, *or* a $30 Mi Band.

### THREE INDEPENDENT HR CHANNELS

▸ **Apple Watch — WatchKit native app**
  Standalone watchOS target (`ios/watchkitapp Watch App/`). Own UI,
  `WorkoutManager.swift` keeps the HR session alive in background. Real-
  time stream to the phone via WCSession with sub-second latency.

▸ **BLE direct — Polar, Xiaomi, COROS, Garmin, generic chest-straps**
  `BluetoothManager.kt` (Android) + `useHeartRate.ts` (iOS) speak the
  GATT Heart Rate Service profile. Works with any BLE 5.0 peripheral.

▸ **Notification Listener — Android-only innovation**
  `OndaNotificationListener.kt` + `useNotificationHeartRate.ts` reads
  HR from notifications of third-party fitness apps (Mi Fit, Zepp Life,
  Polar Beat). Unlocks the **low-cost wearable market** that no
  competitor reaches — Whoop, Oura and Apple all require their own
  proprietary device.

### UNIFIED HOOK LAYER

`useVitals.ts` arbitrates between sources, picks the highest-fidelity
signal currently available, and exposes a single stream to the React
practice components. Source switching is transparent to the user.

*Strategic positioning: ONDA is the only HRV-biofeedback product that
works equally well with consumer wearables AND clinical-grade chest-
straps AND any phone with a camera.*

---

## Slide 8 — Sensor Fusion & The Life Rhythm Artifact ⚡ *NEW*

> Multiple raw biosignals → one personalised circadian fingerprint.

### THE FUSION PIPELINE

```
   HR (3 sources)                          ┐
   HRV (rMSSD, SDNN, DFA α1)               │
   Sleep (HealthKit / Health Connect)      ├──► Stress Score (0-100)
   Motion (accelerometer, gyro)            │    Energy Score (0-100)
   Eye-Scan ANS markers (camera)           │    Life Rhythm profile
   Subjective emotional check              ┘
```

### PROPRIETARY LIFE RHYTHM ALGORITHM

▸ **Personal circadian fingerprint** — `useLifeRhythm.ts` builds a
  unique 24-hour energy curve per user from HRV, sleep, motion and
  practice-completion data.

▸ **Practice timing recommendation** — App suggests *when* to practice,
  not just *what*, based on the user's biological rhythm.

▸ **Multi-week longitudinal modeling** — Burnout-risk forecasting from
  trend analysis (early-warning before user feels symptoms).

▸ **Edge-computed** — All fusion happens client-side; raw biosignals
  never leave the device. Only the derived scores are persisted.

*Engineering: `useLifeRhythm.ts`, `ondCalculator.ts`, `sleep/rhythm.ts`,
plus diagnostics panels (`VitalsDiagnostics`) for clinician-facing
inspection.*

---

## Slide 9 — Engagement Layer: Currency, Rewards & Notifications

### OND CURRENCY *(Gamification Loop)*
▸ **Earned rewards** — OND awarded for practices, streaks, level unlocks.
▸ **In-app shop** — `OndShopModal`: cosmetic themes, advanced protocols.
▸ **Digital artifacts** — Visual unlocks per level (no on-chain dependencies).

### SUBSCRIPTIONS *(Revenue Infrastructure)*
▸ **RevenueCat** — Unified entitlements across iOS and Android stores.
▸ **Account-free purchase** — Users can subscribe before signing up;
  account linked retroactively.
▸ **Webhooks** — `revenuecat-webhook` Edge Function handles renewals,
  trials and churn events.

### NOTIFICATIONS *(Retention Strategy)*
▸ **Local reminders** — User-set practice times, persistent across reboots
  (`@capacitor/local-notifications`).
▸ **Push** — OneSignal handles streak protection, new content, coaching
  nudges, A/B-tested re-engagement.
▸ **GDPR wipe** — One-tap account deletion via `delete-account` Edge
  Function (cascading wipe of profile, progress, audio cache, auth record).

---

## Slide 10 — High-Level Architecture: Cross-Platform & Cloud

### IOS (CAPACITOR 7)
- Swift Plugins · HealthKit · WatchKit App · React WebApp

### ANDROID (WEBVIEW + KOTLIN)
- Kotlin Modules · Health Connect · BLE Manager · Foreground Service ·
  Notification Listener

```
                            ▼
```

### BACKEND (SUPABASE ECOSYSTEM)
- Auth + RLS · PostgreSQL · Storage · Edge Functions

```
                            ▼
```

### EXTERNAL SERVICES & INTEGRATIONS
- OpenAI GPT-4 · RevenueCat · Sentry · OneSignal · Tenjin (ATT-compliant)

---

## Slide 11 — Mobile Tech Stack: React, Capacitor, Native Plugins

### SHARED FRONTEND LAYER
React 18 + TypeScript · Vite 5 · TailwindCSS 3 ·
Three.js + @react-three/fiber (3D scenes) · MediaPipe Tasks Vision ·
i18next (5 languages)

### ━━━━ CAPACITOR 7 NATIVE BRIDGE ━━━━

### iOS NATIVE (SWIFT)
- **Custom Swift Plugins:** HealthKit, Apple Watch (WCSession)
- **WatchKit App:** Real-time HR streaming to WebApp; background-stable
  WorkoutSession
- **RevenueCat:** Unified IAP & subscription management
- **ATT & Tenjin:** Privacy-compliant SKAdNetwork attribution

### ANDROID NATIVE (KOTLIN)
- **Health Connect:** Unified Google health data API
- **BLE Manager:** Polar, Xiaomi, chest-strap and ring support
- **Notification Listener:** HR ingestion from third-party fitness apps
- **Foreground Service:** Persistent HR capture during long sessions
- **WebView Architecture:** Optimised for Android API 45+

---

## Slide 12 — Biometric Core: Real-Time Sensor Fusion

### FOUR HARDWARE-AGNOSTIC HR INGESTION CHANNELS

```
┌─────────────────────────────┐  ┌─────────────────────────────┐
│  Apple Ecosystem            │  │  Android Ecosystem          │
│                             │  │                             │
│  Apple Watch (WCSession)    │  │  Health Connect API         │
│  HealthKit (sleep, mind.)   │  │  Notification Listener      │
│                             │  │  Foreground service         │
│  WATCHKIT · HEALTHKIT       │  │  KOTLIN · HEALTH CONNECT    │
└─────────────────────────────┘  └─────────────────────────────┘
            ╲                              ╱
             ╲     ┌─────────────────┐    ╱
              ╲    │  ONDA BioOS     │   ╱
               ╲   │  SENSOR FUSION  │  ╱
                ╲  └─────────────────┘ ╱
                 ╲                    ╱
┌─────────────────────────────┐  ┌─────────────────────────────┐
│  BLE Peripherals            │  │  Eye-Scan (CV)              │
│                             │  │                             │
│  Polar, Xiaomi, COROS,      │  │  Camera-based ANS detection │
│  Garmin, generic GATT 5.0   │  │  via MediaPipe Tasks Vision │
│                             │  │  — touchless biofeedback    │
│  BLE 5.0 · POLAR/XIAOMI     │  │  MEDIAPIPE · COMPUTER VISION│
└─────────────────────────────┘  └─────────────────────────────┘
```

▸ **Fusion output:** Stress Score, Energy Score, Life Rhythm profile.
▸ **Privacy:** Fusion happens client-side; raw biosignals stay on device.
▸ **Source arbitration:** `useVitals.ts` automatically picks the
  highest-fidelity stream currently available.

---

## Slide 13 — Scalable Backend: Supabase, PostgreSQL, Edge Functions

### PostgreSQL & Security
▸ **Schema evolution** — 20+ managed migrations, consistent state across
  environments.
▸ **Core entities** — `user_profiles`, `practice_rewards`,
  `user_progress`, plus localisation and analytics tables.
▸ **RLS policies** — Row-Level Security enforced at the database level,
  isolating user data by `auth.uid()`.

### Serverless Edge Layer
▸ **analyze-emotion** — Deno function invoking OpenAI GPT-4 for
  real-time emotional sentiment analysis.
▸ **revenuecat-webhook** — Automated lifecycle management for trials,
  renewals, and churn events.
▸ **delete-account** — GDPR-compliant cascading deletion of user
  profiles and authentication records.

### Storage & Observability
▸ **Audio bucket** — 5–30 min practice files with TUS resumable uploads
  and CDN-edge caching.
▸ **Sentry** — Crash and error tracking across web, iOS and Android.
▸ **Supabase Events** — First-party analytics for the subscription
  funnel, paywall conversion and onboarding completion.

---

## Slide 14 — Content Engine: 630+ Prerendered Pages, 5 Languages

```
   68              216                 28              11
ARTICLES      GLOSSARY TERMS         REVIEWS       TOPIC HUBS
                                  (HRV, Sleep,
                                   Meditation)

                            630+
                      PRERENDERED URLS
```

### Static Site Generation (SSG) Pipeline

```
  Sharp Optimization  ▸  Git-based Versioning  ▸  Vite 7 Build
        ▸  JSDOM Prerendering  ▸  SEO Validation
```

### Tech Stack
React 19 · TypeScript 5.9 · TailwindCSS 4 · i18next (5 languages) ·
Express + Helmet · sharp · jsdom · react-router-dom 7

### Multi-Market Strategy
EN, ES, RU, UK, ZH — symmetric hreflang clusters, locale-specific URLs,
drip-publish rollout schedule to avoid scaled-content penalties.

---

## Slide 15 — Technical Roadmap: From Shipping to Predictive

> Building the Future of Bio-Responsive Digital Health

### 🤖 AI Personalization Engine — *deepen*
- Move from per-session GPT-4 calls to a fine-tuned domain model.
- Cross-session memory: emotional-state trajectory across weeks.

### 🔬 Predictive Health Modeling — *expand*
- Longitudinal Life Rhythm analysis for burnout 7-day forecasting.
- Establishing clinical-grade standards for digital interventions.
- Validation studies vs gold-standard ECG and PSG.

### 🌐 Cross-Device Synchronisation — *generalise*
- Multi-sensor live fusion (Apple Watch + BLE + Camera simultaneously).
- Web-to-app continuity: BioOS finger-on-camera readings sync to phone.

### 🧬 Therapeutic Personalisation — *new pillar*
- Practice-effectiveness inference per user from longitudinal data.
- Adaptive curriculum: skip levels the user already mastered,
  emphasise weak vectors.

*All capabilities mentioned in earlier slides (Eye-Scan, HRV fusion,
Emotional AI) are **currently shipping in production**. This roadmap
extends them, not delivers them.*

---

# CHANGES vs PREVIOUS DECK

| # | Change | Why |
|---|--------|-----|
| **Slide 2** | Added Apple Watch as a 3rd ecosystem product; mentioned Eye-Scan in mobile-app card | The watch app is a separate native product, not a feature footnote |
| **Slide 5** | Eye-Scan re-labelled "SHIPPING FEATURE" with engineering file references | Removes the ambiguity created by slide 13's roadmap framing |
| **Slide 7 (NEW)** | "Apple Watch + Multi-Channel HR" | Surfaces the Notification Listener — the unique competitive moat |
| **Slide 8 (NEW)** | "Sensor Fusion & Life Rhythm Artifact" | Makes the proprietary fusion algorithm explicit (was hidden in repo docs) |
| **Slide 10/11** | Added Notification Listener under Android Native | Same — was missing |
| **Slide 12** | Sensor-fusion diagram clarifies what specifically fuses | Original said "Sensor Fusion" without showing inputs |
| **Slide 14** | Added "28 reviews" + multi-market positioning | Surfaces the editorial vertical and the 5-language go-to-market |
| **Slide 15** | Removed eye-scan from roadmap; reframed as "extending shipped features" | Aligns positioning: present capabilities ≠ future capabilities |

---

*Generated by direct inspection of `yamius/ONDA1` repository on 2026-05-20.
All file references (`useEyeScan.ts`, `OndaNotificationListener.kt`,
`useLifeRhythm.ts`, etc.) are real code paths verified to exist.*
