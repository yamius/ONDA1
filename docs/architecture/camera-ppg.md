# Camera PPG (camera heart-rate)

The iOS app's camera photoplethysmography engine: a fingertip on the rear camera + torch yields a live **pulse rate (bpm)**, derived purely from the red-channel brightness pulsation.

## Design contract: HR-only

Camera PPG delivers **heart rate and nothing else** — no HRV, no RMSSD, no coherence, no stress/energy/emotion inference. The rationale is in the module header: a ~30 Hz camera cannot time individual beats precisely enough for reliable HRV/coherence (those need 100–200 Hz and stay watch-only) — see `src/lib/ppgCore.ts:1`.

This is enforced in two independent places:

- **Honesty: commit a number only when confident, else `null`.** `estimateHr` runs two independent estimators — a frequency-domain spectral peak and an autocorrelation lag — and only commits a bpm when (a) the window is long enough, (b) the two estimates agree within `AGREEMENT_BPM` (5 bpm), and (c) a composite SQI clears `MIN_CONFIDENCE` (0.5). Otherwise it returns `bpm: null` with a `reason` (`too_short` | `no_peak` | `disagree` | `low_quality`) so the UI blanks rather than bluffs (`ppgCore.ts:274`–`306`). The "blanks on pure noise" / "too_short below window" behaviour is pinned by tests (`ppgCore.test.ts:120`–`148`).
- **Hard coherence gate.** Even where coherence exists, `coherenceForSource(raw, source)` returns `null` whenever the active source is `'camera'`, regardless of the raw value (`sensorSource.ts:59`). This invariant has its own unit test (`sensorSource.test.ts:53`). The UI mirrors it: for the camera source `CameraPulseWindow` renders a "Pulse" readout (not Coherence) and a "Coherence unlocks with an Apple Watch" line (`CameraPulseWindow.tsx:107`, `:176`).

Note: ppgCore deliberately has **no breathing estimator**. Camera users get breathing the same way the watch does — `useVitals` runs RSA analysis on the HR series pushed into `heartRateStore` (`ppgCore.ts:308`).

## Pipeline / data flow

```
rear-camera <video>  (getUserMedia, facingMode:environment, torch best-effort)
   │  requestVideoFrameCallback (rAF fallback), throttled to ~30 Hz
   ▼
sampleFrame()  → draw to 80×60 canvas, central ROI → {rMean,gMean,bMean,clipFrac}
   │  isGoodContact() finger gate (debounced) → push {t, v:rMean} to rolling buffer
   ▼
estimateHr(buffer)  every 1 s:
   resampleUniform → linearDetrend → bandpass(0.6–3.5 Hz, zero-phase)
     ├─ spectralHr   (Goertzel sweep + parabolic peak + octave/harmonic guard)  PRIMARY
     └─ autocorrHr   (parabolic lag)                                            CONFIRM
   → confidence/SQI gate + agreement → bpm | null
   ▼
adaptiveSmooth() → rounded bpm → component state + heartRateStore (HR + breathing path)
```

### Conditioning & estimation (`ppgCore.ts`)

| Stage | Function | Why |
|-------|----------|-----|
| Resample | `resampleUniform` | Phone "30p" is really ~25–31 fps; index→time with a fixed fps is a multiplicative bpm bias, so every estimator consumes a uniform grid (`ppgCore.ts:72`). |
| Detrend | `linearDetrend` | Least-squares ramp removal before band-pass (`:96`). |
| Band-pass | `bandpass` | RBJ biquad applied forward+backward (zero-phase / filtfilt), 0.6–3.5 Hz, to kill baseline wander and HF/flicker noise that fabricates peaks (`:119`). |
| Spectral HR | `spectralHr` | Goertzel power sweep `HR_MIN_HZ`..`HR_MAX_HZ` @ `SWEEP_STEP_HZ`; parabolic sub-bin peak; HPS-style 2× harmonic reinforcement so a dicrotic/sharp pulse doesn't read as double HR; returns `concentration` + `prominence` SQI terms (`:158`). |
| Autocorr HR | `autocorrHr` | Independent confirmer; parabolic lag interpolation removes integer-lag bpm quantisation; returns `strength` (`:224`). |
| Commit | `estimateHr` | Orchestrates the above; composite `confidence = 0.5·concentration + 0.3·prominence_score + 0.2·ac_strength`; commits `0.6·spectral + 0.4·autocorr` when agree+SQI pass, else `null` (`:274`). |

Configuration constants live in the exported `PPG` object (`ppgCore.ts:31`): `FS=30`, band `0.6–3.5 Hz`, search `0.7–3.3 Hz`, `WINDOW_SEC=15`, `MIN_GOOD_SEC=10`, `AGREEMENT_BPM=5`, `MIN_CONFIDENCE=0.5`.

### Finger-presence gate (`isGoodContact`, `ppgCore.ts:333`)

Decides **finger / no-finger only** — *not* signal quality (that is the estimator's job). It uses a relative redness ratio + a saturation guard and **deliberately has no brightness floor**, because a brightness threshold would reject darker skin (lower transmitted luminance) — an inclusivity invariant pinned by a test that a dim dark-skin finger must pass (`ppgCore.test.ts:155`). Accepts when `redness > 0.5`, R dominates G (`>1.3×`), and `clipFrac < 0.8` (reject only near-total white-out).

### Torch bridge

There is **no native torch bridge** — it is intentionally deferred (`useCameraPpg.ts:27`). The torch is best-effort web only: `track.applyConstraints({ advanced: [{ torch: true }] })`, gated on `getCapabilities().torch` (works on iOS 17+, silently ignored elsewhere). iOS drops the torch after ~30 s, so a keep-alive `setInterval` re-asserts it every 8 s, and teardown turns it back off before releasing the track (`useCameraPpg.ts:243`–`262`, `:114`, `:124`). If the torch can't be enabled, the pipeline still runs torch-off in good light and the UI shows a "couldn't turn on the flash" hint.

### `useCameraPpg` (the producer hook, `src/hooks/useCameraPpg.ts`)

Owns a hidden rear-camera `<video>` + downscaled 80×60 canvas, samples frames, runs `estimateHr` on a 1 Hz interval, and exposes:

| Field | Meaning |
|-------|---------|
| `bpm` | Committed, smoothed, rounded pulse, or `null` when blanking. |
| `confidence` | 0..1 from the latest `estimateHr`. |
| `fingerOn` | Debounced finger-on-lens flag (off after `noFingerFrames ≥ 15`). |
| `torchOn` | Whether the web torch constraint took. |
| `status` | `idle` \| `requesting` \| `denied` \| `searching` \| `reading` \| `error`. |
| `error`, `debug` | Error string; ~1 Hz frame stats (`r`/`clip`/`redness`) for the `VITE_PPG_DEBUG` readout. |
| `start()`, `stop()` | Open/teardown the stream. |

The hook is a **pure producer** for its own state, but it *does* also feed the shared `heartRateStore`: on commit it calls `setCameraHr(bpm)` + `addDataPoint(...)` (so `useVitals` derives breathing from camera HR via the same path as the watch); `start()`/`teardown()` toggle `setCameraActive(...)` and `clear()` (`useCameraPpg.ts:99`, `:213`, `:285`). On a confident tick `status → 'reading'`; when the finger is clearly off or no good reading for >3.5 s it blanks (`bpm=null`, `status='searching'`, `setCameraHr(null)`) rather than holding a stale pulse (`:206`–`229`).

### Source resolution (`src/lib/sensorSource.ts`)

The practice consumes one resolved pulse stream and doesn't care where beats come from. `resolvePulseSource(inputs)` picks the active `PulseSource` from `SourceInputs`:

| Priority | Source | Condition |
|----------|--------|-----------|
| 1 | `camera` | `cameraActive && cameraHr != null` — an **explicit** choice that **overrides** even a present watch (`sensorSource.ts:40`). |
| 2 | `ble` | `bleConnected && bleHr != null` |
| 3 | `watch` | `watchHr != null` |
| 4 | `healthkit` | `healthkitHr != null` (caller already gated on "monitoring") |
| 5 | `notification` | `notificationHr != null` (Android) |
| — | `camera` (searching) | `cameraActive` but no committed bpm → stays `camera`/`hr:null` so the UI shows "searching", not "no sensor". |
| — | `null` | nothing available. |

## Public API / exports

- **`ppgCore.ts`** — `PPG` (config), types `PpgSample` / `HrEstimate` / `FrameStats`; `resampleUniform`, `linearDetrend`, `bandpass`, `spectralHr`, `autocorrHr`, `estimateHr` (main entry), `isGoodContact`, `adaptiveSmooth`.
- **`dsp.ts`** — shared math: `ewma`, `clamp01`, `goertzelPower`.
- **`useCameraPpg.ts`** — `useCameraPpg()` hook; types `CameraPpgStatus`, `CameraPpgState`.
- **`sensorSource.ts`** — `resolvePulseSource`, `coherenceForSource`; types `PulseSource`, `SourceInputs`, `ResolvedSource`.
- **`CameraPulseWindow.tsx`** — `CameraPulseWindow` presentational component (frosted wave window + offer card + source-aware readout), shared by basic/adaptive/onboarding surfaces.

## Gotchas / invariants

- **Blank, don't bluff.** Any of: window < `MIN_GOOD_SEC`, no spectral peak, estimators disagree (>5 bpm), or confidence < 0.5 → `bpm: null`. Stale pulse is dropped >3.5 s after the last commit or when the finger is off.
- **Coherence is never camera-derived** — hard-gated to `null` (`coherenceForSource`) *and* the UI shows "Pulse" instead of "Coherence" for the camera source.
- **No brightness floor in the finger gate** — adding one would reintroduce skin-tone bias. Finger gate = finger/no-finger; estimator = good/null.
- **No native torch + best-effort web torch** — runs torch-off in good light if unavailable.
- **Octave guard** — harmonic reinforcement prevents a 2× HR reading from a sharp/dicrotic pulse (`ppgCore.test.ts:111`).
- **Smoothing keeps RSA visible** — `adaptiveSmooth` uses a confidence-scaled EMA (α ~0.12–0.45) with an 8-bpm/update slew cap; seeds directly from the first reading (`ppgCore.ts:352`).
- **SSR / lifecycle safety** — all DOM/camera access is inside `start()`/frame callbacks (never at import); `teardown` cancels rAF/rVFC/intervals, stops tracks (torch off first), removes the `<video>`, and clears the shared store. The hook stops the camera on `visibilitychange → hidden` and on unmount (`useCameraPpg.ts:95`, `:325`).
- **Hidden but rendered video** — the `<video>` is 2×2 px at `opacity:0.01`, not `display:none`, because hiding it can pause decoding on iOS (`useCameraPpg.ts:268`).

## Landing site: synced copies

The landing site (`/emoton`, `/bio`) keeps **synced copies** of `ppgCore.ts`, `dsp.ts`, and a web variant of `useCameraPpg.ts` (heartRateStore coupling removed). **The app is the source of truth** — if the app engine changes, re-sync the landing copies. See [`../../landing/docs/emoton.md`](../../landing/docs/emoton.md) §4 (Synced-copy maintenance).

## Source files

- `src/lib/ppgCore.ts` (+ `src/lib/ppgCore.test.ts`)
- `src/lib/sensorSource.ts` (+ `src/lib/sensorSource.test.ts`)
- `src/hooks/useCameraPpg.ts`
- `src/hooks/dsp.ts`
- `src/hooks/heartRateStore.ts` (shared pulse buffer / camera channel)
- `src/components/CameraPulseWindow.tsx`
- Landing synced copies: `landing/src/lib/ppgCore.ts`, `landing/src/lib/dsp.ts`, `landing/src/hooks/useCameraPpg.ts`
