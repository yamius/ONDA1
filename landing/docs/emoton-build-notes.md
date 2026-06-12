# Emoton — build notes & honesty audit (v1)

Emoton is the deliberate, owned emotional check-in ("I name what I feel") — a new
primary main-menu page at **`/emoton`** on the landing site. Cognitive/affective
front-door that continues into a practice with a live signal. EN-only v1, no
persistence, no free text, agency-never-assessment.

## Files
- `src/lib/emotonCore.ts` — pure, UI-free core (wheel taxonomy, want→branch
  routing, state→direction, tolerance gauge, zone→practice map). Liftable into the app.
- `src/lib/ppgCore.ts` + `src/lib/dsp.ts` — synced copies of the app's shipped
  camera-pulse core (app is the source of truth; landing is a separate Vite build).
- `src/hooks/useCameraPpg.ts` — web-only variant of the app hook (heartRateStore
  coupling removed; self-contained producer of bpm/confidence/fingerOn/status).
- `src/pages/EmotonPage.tsx` — the flow surface.
- `src/components/emoton/EmotonPractice.tsx` — the practice branch (the only sensor branch).
- Wired in `src/main.tsx`, `src/entry-server.tsx` (routes), `src/components/Layout.tsx` (menu).

## Wheel-state → existing-practice mapping (AS IMPLEMENTED — reuse only)
| Zone (window) | Want → branch | Practice (existing id) | Direction |
|---|---|---|---|
| Fight — over | calm down → practice · be with → be-with · set a boundary → release | `body_cocoon` | down |
| Flight — over | calm down / ground → practice · be with → be-with | `earth_pulse` | down |
| Freeze — under | gently come back → practice (after first-move) · be with → be-with | `inner_spark` | gentle-up ⚠ |
| Grief — low/present | be with → be-with · describe → be-with (Gendlin) | — (be-with default) | — |
| Regulated — within | deepen → practice · nothing → release | `earth_breath` | deepen |
| Expansive — within | live it → release · channel into action → practice | `light_inhale` | channel |
| (any) | something else → release | — | — |
| (hopelessness/meaninglessness shade, or Я flooded) | → support off-ramp | — | — |

⚠ **Freeze reuse flag:** the in-app library has NO bespoke energizing/up-regulation
protocol (recon confirmed: all practices are down/neutral). Per the user's
decision, Freeze reuses the closest up-leaning existing practice (`inner_spark`,
Inspiration) as a gentle re-mobilization — NOT a fabricated protocol. The web
pacer for freeze/expansive runs a brisker "rise" (7 s) rather than a calming
12 s settle, so the brief's down/up asymmetry holds on web too.

## Honesty audit (each claim → source)
- **6 zones = window-of-tolerance METAPHOR, not a mechanism.** No physiological
  claim is asserted; zones are felt-states. (Brief honesty gate.)
- **Practices are EXISTING, reused by id — never invented.** Ids verified against
  `AdaptivePracticeModal.tsx` + `utils/eyeScanMetrics.ts` PRACTICE_SETS (recon).
  Where a zone has no fitting practice (grief), it falls back to be-with rather
  than fabricating one (`resolveBranch`).
- **Camera = PULSE ONLY.** Ported `ppgCore` commits a bpm only when its two
  estimators agree + SQI passes, else null; the page shows bpm only while
  `status==='reading'` and blanks otherwise — never smoothed into fake precision.
  Lead visual is the breathing pacer + the responsive pulse trend, not the number.
- **No coherence/HRV from camera.** Stated in UI ("Pulse only — coherence unlocks
  with an Apple Watch"); `ppgCore` produces no coherence; no fabricated metric.
- **"Be with it" is not suppression.** In a normal state the moves are
  witness / grow-the-Self / describe — NO shrink-slider. "Ease it a notch"
  (titration) appears ONLY as Я approaches the danger zone (`beWithMoves`).
- **Support off-ramp is gentle + real, never an alarm.** 988 Suicide & Crisis
  Lifeline (US/EN v1). The Я-proportion gauge is NEVER shown as a % — conveyed
  only by circle region sizes; the ~10% threshold is a backend trigger.
- **No persistence, no free text.** No storage calls anywhere; "describe the
  feeling" is a SELECT from Gendlin quality words, never typed input.
- **Sensor only at the practice branch.** Only `EmotonPractice` mounts
  `useCameraPpg`; wheel / be-with / release / support never touch the camera.

## v1 simplifications (honest scope)
- The web practice is a *simplified* breath pacer + live pulse — the full
  audio-guided, differentiated practice (and coherence) lives in the app.
- EN-only wheel; per-user learning / persistence are explicit later steps.
- `/bio` relocation to `/tools/bio` is DEFERRED (user's call) — `/bio` stays put
  and keeps its own richer engine; Emoton does NOT share the `/bio` engine.

## In-app continuation path
Emoton (web) check-in → simplified practice with live **camera** pulse → download
hook → in-app: the SAME wheel/core → full audio-guided practice with **watch**-
precision pulse + **coherence** + the 8-level journey.

## Verification
`tsc -p tsconfig.app.json --noEmit` clean; `vite build` (client) clean. Page is
SSR-safe (no document/navigator at render; camera starts only on user tap).
