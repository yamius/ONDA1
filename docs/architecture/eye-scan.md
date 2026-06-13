# Nervous System Scan (Face Check)

A 30-second front-camera "Face Check" that reads blinking, gaze and head micro-movement on-device and turns them into wellness estimates (calm / focus / fatigue) plus a recommended breathing practice.

## Honesty / non-clinical disclaimer

This is a **heuristic wellness signal, not a diagnostic or medical measurement.** This is stated in both code and UI:

- Source comment: "Пороги и веса ниже — эвристики, клинически НЕ валидированы … Это wellness-оценка, не диагностика." (`src/utils/eyeScanMetrics.ts:1-3`).
- `computeScores` is annotated "Чистая функция (эвристики)" and `recommendState`/`recommendedPractices` are annotated "Эвристика" (`src/utils/eyeScanMetrics.ts:99`, `:131`).
- User-facing disclaimer rendered on the result screen: **"This is a wellness estimate, not a medical diagnosis."** (`face_check.disclaimer`, `public/locales/en/translation.json:14`; shown at `src/components/FaceCheckScreen.tsx:217`).
- Subtitle frames it as estimation, not measurement: "On-device facial state estimation" (`face_check.subtitle`, `:5`).

**What is claimed:** a relative, self-reported-style wellness estimate derived from observable facial behaviour, with an explicit `quality` (reliability) score so low-confidence scans are visible.
**What is NOT claimed:** no diagnosis, no medical/clinical interpretation, no physiological measurement (it does not measure HRV, blood pressure, pupillometry, etc.). Thresholds/weights are uncalibrated heuristics awaiting real-data calibration (`src/utils/eyeScanMetrics.ts:1-3`).

## How it works

### Engine — MediaPipe FaceLandmarker (on-device, WASM)
- Uses `@mediapipe/tasks-vision` `FaceLandmarker` (`src/hooks/useEyeScan.ts:1-6`).
- Assets are **bundled locally, no CDN** — comment "MediaPipe-ассеты забандлены локально (public/mediapipe/) — без CDN, офлайн." (`src/hooks/useEyeScan.ts:15`):
  - WASM runtime: `/mediapipe/wasm` (`:16`) → `public/mediapipe/wasm/vision_wasm_internal.{js,wasm}`.
  - Model: `/mediapipe/face_landmarker.task` (`:17`) → `public/mediapipe/face_landmarker.task`.
- Created with `runningMode: 'VIDEO'`, `numFaces: 1`, `outputFaceBlendshapes: true`, GPU delegate with a **CPU fallback** if GPU init throws (`src/hooks/useEyeScan.ts:99-114`).
- The landmarker is preloaded on mount so the scan starts without waiting (`:216-219`), and `close()`d on unmount (`:226-230`).

### Capture loop
- `getUserMedia` front camera (`facingMode: 'user'`, ideal 960×720, 4:3), `audio: false` (`src/hooks/useEyeScan.ts:176-186`).
- A `requestAnimationFrame` loop runs for `SCAN_DURATION_MS = 30_000` ms (`:19`, `:139-160`). `detectForVideo` is called only on new frames (growing `video.currentTime`) (`:156-159`).
- Per-frame sample extracted by `extractSample` (`:46-69`) from FaceLandmarker output.

### Signals read per frame (`ScanSample`, `src/utils/eyeScanMetrics.ts:6-15`)
Read from **blendshape categories** (`blendshape()` helper, `src/hooks/useEyeScan.ts:40-43`) and one landmark:
- `blink` = `max(eyeBlinkLeft, eyeBlinkRight)` — eye closedness 0..1 (`:52,58`).
- `eyeOpenness` = `1 - (eyeBlinkLeft + eyeBlinkRight)/2` (`:65`).
- `gazeX` = `(eyeLookOutLeft - eyeLookInLeft + eyeLookInRight - eyeLookOutRight)/2` (`:59-61`).
- `gazeY` = `(eyeLookUpLeft - eyeLookDownLeft + eyeLookUpRight - eyeLookDownRight)/2` (`:62-64`).
- `headX/headY` = normalized x/y of landmark `face[1]` (nose tip, "опорная точка головы — кончик носа") (`:54,66-67`).
- `faceFound` = whether a face was detected this frame (`:47-49`).

### Aggregation (`aggregateSamples`, `src/utils/eyeScanMetrics.ts:57-97`)
Produces `ScanAggregate`:
- `faceFoundRatio` = faces / total samples (`:71`).
- `blinkRate` (blinks/min): counts rising-edge crossings of `BLINK_THRESHOLD = 0.5` between consecutive face frames, then `(blinks / durationMs) * 60000` (`:36`, `:76-81`, `:92`).
- `gazeStability` = `clamp(1 - gazeStd / GAZE_STD_MAX, 0, 1)`, where `gazeStd` is the mean of stdDev(gazeX) and stdDev(gazeY); `GAZE_STD_MAX = 0.18` (`:37`, `:83-84`, `:93`).
- `headSteadiness` = `clamp(1 - headStd / HEAD_STD_MAX, 0, 1)`, `headStd` = mean of stdDev(headX), stdDev(headY); `HEAD_STD_MAX = 0.05` (`:38`, `:85-86`, `:94`).
- `eyeOpennessAvg` = mean of per-frame `eyeOpenness` (`:95`).
- Empty/face-less/zero-duration scans short-circuit to zeros (`:67-74`).

### Scoring (`computeScores`, `src/utils/eyeScanMetrics.ts:100-126`) → `NervousSystemScores` (0..100)
Constants: `CALM_BLINK_MAX = 18`, `HIGH_BLINK = 32` (`:39-40`).
- `quality` = `round(faceFoundRatio * durationFactor * 100)`, `durationFactor = clamp(durationMs/20000, 0, 1)` (`:101-102`).
- `blinkCalm` = 1 if `blinkRate <= 18`, else linearly ramps to 0 by blinkRate 32 (`:104-107`).
- **`calm`** = `round((blinkCalm*0.5 + gazeStability*0.5) * 100)` (`:108`).
- **`focus`** = `round((gazeStability*0.5 + headSteadiness*0.3 + clamp(eyeOpennessAvg,0,1)*0.2) * 100)` (`:110-115`).
- **`fatigue`** = `round((blinkFatigue*0.6 + opennessFatigue*0.4) * 100)`, where `blinkFatigue` rises 0→1 from blinkRate 18→32 and `opennessFatigue = clamp(1 - eyeOpennessAvg, 0, 1)` (`:117-123`).

### Practice recommendation (`src/utils/eyeScanMetrics.ts:129-162`)
- `recommendState`: `fatigue >= 50 → 'fatigue'`; else `calm < 50 → 'anxiety'`; else `'calmness'` (`:132-136`).
- `recommendedPractices` returns 3 practice ids per state from `PRACTICE_SETS`, whose ids "совпадают с каталогом AdaptivePracticeModal" (match the AdaptivePracticeModal catalog) (`:138-162`).

### Calibration status
**Uncalibrated.** All thresholds and weights are declared heuristics "to be calibrated on real data" (`src/utils/eyeScanMetrics.ts:1-3`). There is no per-user baseline/calibration pass — scores are computed from absolute thresholds on a single 30s session.

## Privacy — on-device only

Face data does **not leave the device**, and frames are not stored. Verified:
- All processing is local WASM/model from `public/mediapipe/` with no CDN (`src/hooks/useEyeScan.ts:15-17`).
- Only derived `ScanSample` numbers (blink/gaze/openness/head floats) are buffered in memory (`samplesRef`, `src/hooks/useEyeScan.ts:87`, pushed at `:159`); no canvas capture, no image upload, no network/`fetch`/storage call in `useEyeScan.ts` or `eyeScanMetrics.ts`.
- The camera `MediaStream` tracks are stopped on finish/reset/unmount via `stopStream()` (`src/hooks/useEyeScan.ts:125-129`, called at `:132`, `:200`, `:207`, `:220`).
- UI promises this to the user: "Frames are never saved." (`face_check.intro`, `public/locales/en/translation.json:6`).

This is the same concern behind the **1.7.4 App Review face-data rejection** — the implementation keeps everything on-device and stores no raw face imagery, which is the posture that addresses that rejection.

## Public API / how FaceCheckScreen drives it

**`useEyeScan()` hook** (`src/hooks/useEyeScan.ts:76-235`) returns `UseEyeScan` (`:28-38`):
- `videoRef` — bind to the on-screen `<video>`.
- `status: 'idle' | 'preparing' | 'scanning' | 'done' | 'error'` (`:21`).
- `progress` (0..1), `result: EyeScanResult | null` (`{ aggregate, scores }`, `:23-26`), `error: string | null`.
- `start()` — opens camera + runs the 30s scan; `reset()` — clears state.

Also exported: `SCAN_DURATION_MS` (`:19`), types `EyeScanStatus`, `EyeScanResult`, `UseEyeScan`.
From `eyeScanMetrics.ts`: `aggregateSamples`, `computeScores`, `recommendState`, `recommendedPractices`, and types `ScanSample`, `ScanAggregate`, `NervousSystemScores`, `RecommendedState`.

**`FaceCheckScreen`** (`src/components/FaceCheckScreen.tsx:18`, default export, lazy-loaded at `src/onda-level1-demo_27.tsx:87`, mounted under `showFaceCheck` at `:8198-8205`):
- Calls `useEyeScan()` and renders per `status`: idle (intro + Start), preparing, scanning (progress bar + countdown), done (`ResultView`), error (retry) (`:97-153`).
- The `<video>` is always in the DOM for `videoRef` but only visible during `scanning`, with a fade-in after a 350ms settle to avoid the iPhone front-camera zoom jump (`:76-95`, `:35-42`).
- `ResultView` shows calm/focus/fatigue bars + `quality`, the disclaimer, and 3 recommended-practice buttons from `recommendedPractices(scores)` that open `AdaptivePracticeModal` (`:168-229`, `:158-163`).
- `onOndEarned` is accepted as a prop and passed to `AdaptivePracticeModal`; the scan itself does not award OND directly.

## Source files
- `src/hooks/useEyeScan.ts` — camera + MediaPipe controller, 30s session, sample extraction.
- `src/utils/eyeScanMetrics.ts` — pure aggregation, scoring heuristics, and practice mapping.
- `src/components/FaceCheckScreen.tsx` — UI screen that drives the hook.
- `public/mediapipe/face_landmarker.task`, `public/mediapipe/wasm/vision_wasm_internal.{js,wasm}` — bundled on-device model + WASM runtime.
- `public/locales/<lang>/translation.json` — `face_check.*` strings (disclaimer, intro "Frames are never saved", subtitle); EN at `public/locales/en/translation.json:2-22`.
