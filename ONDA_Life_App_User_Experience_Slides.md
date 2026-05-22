# ONDA Life — Mobile App User Experience
## Slide content to insert into the existing Technical Architecture deck
(Suggested position: between Slide 2 "Ecosystem" and Slide 3 "High-Level
Architecture". Style and tone matched to the existing PDF.)

---

## Slide 2A — User Journey: From First Launch to Daily Practice

**A frictionless path from "just installed" to a measurable nervous system check.**

### THE FIVE-STEP FIRST-RUN FLOW

▸ **Welcome Scene** — Three.js animated intro establishes the
   biological-void visual language (`WelcomeScene.tsx`).

▸ **Language Selection** — One of 5 (EN, ES, RU, UK, ZH) detected
   automatically; user can override at any time (`LanguageModal`).

▸ **Permission Setup** — Health (HealthKit / Health Connect), camera,
   notifications, motion sensors, Bluetooth — each requested in context
   with a primer screen explaining *why* (`PermissionSetupModal`,
   `NotificationPrimerModal`). Full analytics funnel tracks drop-off per
   permission.

▸ **Connection** — Optional pairing with Apple Watch, BLE chest-strap, or
   ring; in-app prompt if signal goes silent (`ConnectionModal`,
   `WatchConnectionPrompt`).

▸ **Practice Start** — User enters Level 1, no account required. Sign in
   with Apple / email is offered later, after value is delivered.

> **Design principle:** No paywall, no account gate, no email capture
> before the first biometric reading. Trust is earned in under 90 seconds.

---

## Slide 2B — Core Practice Engine: 8 Levels of Progression

**A structured curriculum from foundational breathing to advanced
neural-self-regulation.**

### THE LEVEL ARCHITECTURE (1 → 8)

▸ **Level 1 — Foundation** *(Purple)*
   Awareness, breath introduction, baseline HRV calibration.

▸ **Level 2 — Calibration** *(Cyan)*
   Resonance breathing (0.1 Hz), parasympathetic activation.

▸ **Level 3 — Synchronization** *(Sky)*
   Coherence training, biofeedback-driven sessions.

▸ **Level 4 — Stress Architecture** *(Amber)*
   HPA-axis regulation, cortisol-mapping exercises.

▸ **Level 5 — Emotional Layer** *(Rose)*
   Limbic-system practices, emotional-check protocols.

▸ **Level 6 — Cognitive Layer** *(Indigo)*
   Focus / attention / flow-state induction.

▸ **Level 7 — DNA Consciousness** *(Emerald)*
   Epigenetic design, advanced longevity protocols.

▸ **Level 8 — Integration / AER II** *(Violet + Gold)*
   Master tier — self-directed protocol authoring.

### PRACTICE SESSION ANATOMY

▸ **5–30 minutes** of audio-guided practice streamed from Supabase Storage
   (TUS-resumable upload pipeline, CDN-cached).

▸ **Adaptive cueing** — `AdaptivePracticeModal` adjusts pace and depth
   based on real-time HRV.

▸ **Pause / resume / abandon** — every interaction event logged for the
   completion-rate funnel.

▸ **Post-practice debrief** — heart-rate curve, OND earned, level
   progress, optional emotional check-in.

---

## Slide 2C — Live Biofeedback UI: The Vitals Dashboard

**Every screen treats the user's nervous system as the primary input
device.**

### REAL-TIME TELEMETRY DISPLAYED ON DEVICE

▸ **Heart Rate** — Streamed from Apple Watch (WCSession), Health Connect
   (Android), or paired BLE device. Latency: under 1 second.

▸ **HRV (rMSSD / DFA α1)** — Computed client-side from RR intervals;
   updated every 30 s during practice.

▸ **Stress Score (0–100)** — Derived from sympathetic-vagal balance; the
   single number users check before deciding which practice to run.

▸ **Energy Score (0–100)** — Combines HRV trend, sleep, and motion data
   into a daily "battery level".

### TOUCHLESS NERVOUS SYSTEM SCAN (NEW)

▸ **Eye-scan biofeedback** — `NervousSystemScan` modal uses MediaPipe
   Tasks Vision on the phone camera to detect pupil oscillation, blink
   pattern, and micro-expressions → ANS state inference without any
   wearable.

▸ **30-second protocol** — User looks at the camera; gets a stress /
   energy reading and a recommended practice. Designed for the friction-
   free moment before a meeting, a call, or sleep.

### DIAGNOSTICS, FOR THE POWER USER

▸ `VitalsDiagnostics`, `DebugMonitor`, `HealthKitCompactPanel`,
   `HealthConnectDataPanel` — opt-in panels surfacing raw sensor streams,
   sample frequency, and signal-quality flags for biohackers and
   clinicians.

---

## Slide 2D — AI Personalization & Companion Chat

**Two complementary AI surfaces: one structured (emotion), one
conversational (companion).**

### EMOTIONAL CHECK-IN (STRUCTURED)

▸ **Modal flow** — `EmotionalCheckModal` invites a 2–3 sentence
   free-text description of how the user feels.

▸ **Server-side analysis** — Text is sent to the `analyze-emotion` Edge
   Function (Supabase, Deno) which invokes **OpenAI GPT-4** under a
   strict schema: dominant emotion, valence, arousal, recommended
   practice.

▸ **Adaptive response** — The app immediately surfaces the matching
   level/practice, optionally with a different audio guide.

▸ **Privacy** — Text is processed in-flight only; no transcript is
   persisted. The structured result is what gets logged.

### LIZA — THE COMPANION CHAT (CONVERSATIONAL)

▸ **In-app companion** — `LizaChatModal` is a lightweight conversational
   agent guiding users through low-friction emotional dialogue.

▸ **Pattern-driven engine** — Custom flow graphs in `src/bot/flows.json`
   (`conversationEngine.ts` + ELIZA-style rules); fast, offline-capable,
   no per-message API cost.

▸ **Hand-off to GPT-4** — When a flow detects ambiguity or open-ended
   intent, the conversation is escalated to the AI emotional-analysis
   pipeline.

### USER INTERFACE PERSONALIZATION

▸ **Theme** — Light / dark via `ThemeToggle`; system-default respected.

▸ **Language** — 5 locales, in-app switchable, persisted in profile.

▸ **Accessibility** — Keep-awake during practice, large-text mode,
   reduced-motion respect for the Three.js scenes.

---

## Slide 2E — Engagement Layer: Currency, Rewards & Notifications

**The gamification loop that turns insights into a daily habit.**

### OND VIRTUAL CURRENCY

▸ **Earned, not bought (primarily)** — Completing practices, hitting
   streaks, unlocking artifacts.

▸ **In-app shop** — `OndShopModal` lets users spend OND on cosmetic
   themes, advanced visualizations, and bonus protocols.

▸ **Artifacts** — Visual / functional unlocks per level (digital
   collectible analogue, no on-chain dependencies).

### SUBSCRIPTIONS — POWERED BY REVENUECAT

▸ **Single paywall, two stores** — `SubscriptionModal` renders the same
   offering on iOS App Store and Google Play; RevenueCat normalises
   entitlements, server-side renewals via `revenuecat-webhook` Edge
   Function.

▸ **Account-free purchase** — User can subscribe before signing up
   (recent product win); account is linked retroactively to preserve
   entitlement.

▸ **Transparent restore** — Cross-device restore via Apple ID / Google
   Account.

### NOTIFICATIONS — TWO CHANNELS

▸ **Local reminders** (`@capacitor/local-notifications`) — User-set
   practice times, persistent across reboots.

▸ **Push** (OneSignal + native push) — Streak protection, new content,
   coaching nudges, A/B-tested re-engagement.

### ACCOUNT & SETTINGS

▸ **`SettingsModal`** — Profile (display name, avatar), language, theme,
   permissions, connected devices, subscription status.

▸ **`UserProfile`** — Practice history, OND ledger, artifact inventory,
   level progression.

▸ **GDPR self-service** — One-tap account deletion routes to the
   `delete-account` Edge Function (cascading wipe of profile, progress,
   audio cache, and auth record).

---

## Optional Slide 2F — Knowledge Site Experience (Companion to the App)

**The web layer that brings the methodology into Google and AI search.**

### WHAT THE READER FINDS AT onda-life.com

▸ **68 long-form articles** — Each a stand-alone deep dive with hero
   imagery, How-To protocol steps, FAQ, and cross-links to the glossary
   and the relevant practice level inside the app.

▸ **216 glossary terms** — Definition + mechanism + ONDA-protocol context
   for every biohacking concept used across the app.

▸ **28 product reviews + 3 round-ups** — Independent editorial
   assessments of HRV wearables, meditation apps, and sleep apps; full
   methodology page, hands-on vs evidence-based testing labels.

▸ **11 topic hubs** — Curated landing pages (HRV, Circadian, Dopamine,
   Metabolic, Breathwork, Neuroplasticity, Cognitive, Spinal, Hormones,
   Longevity, Eye-Scan) clustering related articles and glossary terms.

▸ **Bio OS in the browser** — Live finger-on-camera HRV measurement
   without installing the app, demonstrating the same algorithm that
   powers the mobile product.

### LANGUAGES, ACCESSIBILITY, PERFORMANCE

▸ **5 prerendered languages** — Symmetric hreflang (`en + es + ru + uk
   + zh + x-default`); language switcher preserves the user's reading
   context across articles.

▸ **Sub-second TTFB** — All 630 URLs are static HTML; no SSR latency on
   the request path.

▸ **CWV-clean** — Helmet, compression, image sizes baked at build, alt
   texts optimised for both screen readers and image-search ranking.

---

## Closing Note for the Deck

These five slides complete the picture between the **ecosystem overview**
(Slide 2 of the existing deck) and the **technical architecture**
(Slide 3). They give the reviewer / investor / grant evaluator a concrete
mental model of what the user actually does inside ONDA, before the deck
shifts into infrastructure-level detail.

*Slides drafted from direct inspection of the repository
(`yamius/ONDA1` @ 2026-05-20): 16 modal components, 8 level definitions,
9 dedicated hooks, and the 3 Supabase Edge Functions named in the deck.*
