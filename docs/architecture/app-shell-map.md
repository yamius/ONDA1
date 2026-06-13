# App Shell Map — `src/onda-level1-demo_27.tsx`

Navigation map of the app's single shell component. It renders the whole iOS/web
experience: the practice hub, the practice runtime, onboarding, the first-run
welcome, and the slide-out menu.

> ⚠️ This is ONE component (`OndaLevel1`, opens at line 116) spanning ~8400
> lines. There is no sub-component split — state, effects, helpers, data, and
> all JSX live in the same function body. Use the line ranges below to jump;
> don't read it top-to-bottom. Ranges marked `~` are approximate.

## Region map

| Region | What it does | Approx lines |
| --- | --- | --- |
| **Imports** | React, lucide icons, i18n, Supabase, all `./components/*` modals + widgets, all `./hooks/*` (vitals, camera-ppg, HealthKit/HealthConnect/Watch HR, permissions, analytics, subscription), Capacitor, plugins, Sentry. `lazy()` imports for `WelcomeScene` / `FaceCheckScreen`. | 1–88 |
| **Module-level constants** | `FREE_PRACTICE_IDS` (`p1-1/2/3`), `CIRCUIT_GLOW_*` style maps. | ~94–114 |
| **Component start + hook wiring** | `OndaLevel1` opens (116). Top-of-body hook calls: `useTranslation`, `useTheme`/`isLight`, `useVitals` (`vitalsData`), `useCameraPpg`, plus camera-offer state. | 116–~145 |
| **Refs for funnel/guards** | `prevActivePracticeIdRef`, `exitPracticeCalledRecentlyRef`, `lastAuthFiredForUserRef`, watch-connection tracking refs; early effects for pending-subscribe and watch/HealthKit refresh. | ~189–250 |
| **State declarations (bulk)** | The large `useState` block: circuit/qnt/artifacts, completed/active practice, practice runtime (`practiceState`, `practiceTime`, `isPaused`, `isMinimalMode`, quality/rating), voice/face-check, recording, language/level/chapter dropdowns, sleep/rhythm, user/profile/gameProgress, every `show*Modal` flag, `showMenu`, `activeView`. | ~256–453 |
| **Onboarding + first-run state** | `showOnboarding`/`onboardingScreen` (legacy 3-screen tutorial, demoted to Menu→Intro), `onboardingStartRef`; `showFirstRun` (LIVE one-screen new-install onboarding, lazy-init from localStorage flags), `firstRunShownAtRef`, `postFirstExperiencePaywallArmedRef`, `cameFromFirstRun`, ATT copy A/B ref. | ~458–525 |
| **Onboarding funnel effects** | Fire `onboarding_*` view/start events: permission-rationale screen views (527), legacy tutorial start (545), and the canonical first-run `onboarding_start` (566). | ~518–572 |
| **Practice-session / coherence state** | `bioMetrics`, guiding-text index, audio reset key, initial/simulated/best vitals, track counters, `maxQualityRef`, coherence baseline/peak refs, `practiceRefs`. | ~574–596 |
| **Artifact-award effects** | One effect per artifact (Life Rhythm, Clear Will, Inner Wave, Transformation Pulse, Echo of Joy, Calm Power, Body Language, Silent Understanding, Echo of Power) + rhythm auto-sync. | ~617–818 |
| **Auth + cloud-load mega-effect** | Supabase session load, profile/game-progress fetch + create-on-conflict, artifact migration, i18n sync, `onAuthStateChange` (`SIGNED_IN` → analytics identify, login event dedupe via `lastAuthFiredForUserRef`). | ~819–1040 |
| **Misc effects** | Practice-stats load for rating modal (debounced cloud save, ~1102), click-outside dropdown close (~1158), addon-view reset on circuit change (~1154), sleep-pattern interval (~1193), notification-primer trigger after 6 practices (~326). | ~1042–1215 |
| **Practice runtime tick effect** | The per-second `setInterval` while `practiceState==='active'`: pulls fresh vitals, drives stress/energy + coherence baseline/peak, advances guiding text, computes quality. | ~1215–1338 |
| **`practiceSpaces`** | `useMemo` map of per-practice runtime config (ambient sound, visual, `targetTime`, guiding texts, final phrase, science info), keyed by practice id. | ~1340–2097 |
| **`circuits`** (OND economy data) | `useMemo` array of the 12 circuits: id, name/subtitle, the `practices` list (id, `maxQnt`, etc.), and per-circuit `artifact`. Source of truth for unlock + reward math. | ~2099–2326 |
| **`isPartUnlocked`** | `useCallback` gate for circuit access. Honors dev flag **`VITE_UNLOCK_ALL_PARTS==='true'`** (all parts open); else part 1 always open, later parts require every practice of the previous part validated. | ~2329–2349 |
| **Unlock side-effects** | Effects firing Airbridge `Level Unlocked` and auto-correcting `activeCircuit` when the active part is locked. | ~2354–2382 |
| **`completePractice`** | Records a completed practice, awards QNT, triggers circuit-artifact unlock. | ~2387–2486 |
| **`finishPractice`** | Async end-of-session: scoring, cloud save, analytics, arms the post-first-experience paywall on the first valid completion. | ~2487–2807 |
| **`exitPractice`** | Async teardown when leaving the runtime: 1800ms guard (`exitPracticeCalledRecentlyRef`), stops sources, consumes the armed paywall, resets `cameFromFirstRun`. | ~2808–~2990 |
| **i18n label helpers** | `getPracticeName`/`getPracticeKey` reverse-lookup maps, achievement-desc map. | ~2990–3240 |
| **Rank / format / streak helpers** | `getPlayerRank`, relative-time formatter, `getTotalTime`, streak calc + streak-notification effect, `checkAchievements`. | ~3242–3483 |
| **Voice/face emotion check** | `startVoiceCheck`, `startRecording`/`stopRecording` (mic level), `analyzeEmotion`. | ~3485–3583 |
| **Derived render vars** | `currentCircuit`, totals, `progress` computed just before the early-returns. | ~3585–3589 |
| **EARLY-RETURN: practice runtime** | `if (activePractice)` — full-screen practice player (intro/active/complete), `DebugMonitor`, exit/finish controls, `CameraPulseWindow`/`MetricsWaveform`. | 3590–4662 |
| **EARLY-RETURN: onboarding screens** | `if (showOnboarding)` — legacy 3-screen tutorial; defines `handleOnboardingNext` (advance / on last screen set `onboarding_completed`, fire complete events). | 4664–~4836 |
| **EARLY-RETURN: first-run welcome** | `if (showFirstRun)` — one-screen live onboarding; defines `dismissFirstRun('cta'|'skip')` (CTA opens featured free practice via `completePractice`, fires `onboarding_complete source:'first_run'`). | 4843–~4920 |
| **EARLY-RETURN(s): secondary views** | Additional full-screen returns (stats/journey-style panels) before the hub. | ~4923–5378 |
| **`renderPracticeCard`** | Helper returning one practice card (lock state, QNT/bonus, free badge, featured variant); used by the hub grid. | 5385–5578 |
| **MAIN RENDER: hub / home** | Final `return (...)` — the practice hub: header, circuit/chapter selectors, metrics block, practice grid (`renderPracticeCard`), and all conditionally-mounted modals. Runs to EOF. | 5580–8410 |
| **Slide-out menu** | `{showMenu && ( ... )}` nav drawer inside the main render (settings, language, connection, profile/login, intro replay, etc.). | ~8224–8406 |

## Dedicated deep-dive docs (don't re-document these here)

- **Practices / runtime / economy** → [`practices.md`](./practices.md)
- **Analytics events & funnel** → [`analytics.md`](./analytics.md)
- **Vitals (stress/energy/coherence, HR sources)** → [`vitals.md`](./vitals.md)
- **Camera PPG pulse path** → [`camera-ppg.md`](./camera-ppg.md)

## Quick facts

- **Dev unlock:** set `VITE_UNLOCK_ALL_PARTS=true` in `.env` to open every
  circuit. Checked inside `isPartUnlocked` (~2329).
- **Free sampler:** `FREE_PRACTICE_IDS` = `p1-1`, `p1-2`, `p1-3` (~94); these run
  without an account.
- **Render path:** the component is a chain of early-returns — practice runtime →
  onboarding → first-run → secondary views → hub. Whichever guard hits first
  wins; the hub at 5580 is the default.

## Source

`src/onda-level1-demo_27.tsx` (~8411 lines, single component `OndaLevel1`).
