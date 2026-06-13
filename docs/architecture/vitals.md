# Vitals (stress / energy from heart rate)

How the app turns one resolved heart-rate stream into the live **stress** and
**energy** numbers shown in the tiles and consumed by the OND practice reward.
All logic lives in `src/hooks/useVitals.ts`.

## Inputs

- **HR source** — `useVitals` consumes a single resolved pulse stream, not a raw
  sensor. `resolvePulseSource()` (`src/lib/sensorSource.ts:39`) picks one of
  camera / BLE strap / Apple Watch / HealthKit / Android-notification HR by
  priority (camera overrides when active). The chosen integer is `currentHR`
  (`src/hooks/useVitals.ts:32`).
- **HR buffer** — all derived math reads `heartRateStore.getBuffer()`
  (`useVitals.ts:129`), a shared `{t, hr}` time series. Non-camera/non-BLE
  sources are sampled into it at a steady 1 Hz (`useVitals.ts:98-106`); camera
  and BLE push their own points.
- **Motion** — `activity` from `useMotion()` (`useVitals.ts:16`), used as a
  context signal so movement isn't misread as stress.
- **Baseline** — a per-session adaptive baseline (`useVitals.ts:74-79`), seeded
  at `hrMean=70, hrVar=15, actMean=0.5, actVar=0.5` and learned online (below).

## The baseline

The baseline is a slow EWMA that adapts to the individual user during the first
~120 samples, then freezes its `ready` flag (it keeps updating mean/var either
way for HR/activity, but the warm-up gate is what `ready` marks):

```
// useVitals.ts:112-118 (warm-up, while !ready)
hrMean  = hrMean  * 0.99 + hr       * 0.01
hrVar   = hrVar   * 0.99 + |hr - hrMean|       * 0.01
actMean = actMean * 0.99 + activity * 0.01
actVar  = actVar  * 0.99 + |activity - actMean| * 0.01
ready   = (count > 120)
```

Note `hrVar`/`actVar` are **mean-absolute deviations**, not true variances
(`useVitals.ts:115`). Breathing baseline `brMean/brVar` updates the same way
every cycle from the RSA-derived breathing estimate (`useVitals.ts:188-191`).

## The actual stress / energy formulas

Computed in the 2 s interval (`useVitals.ts:127-299`). It needs ≥10 buffer
points or it nulls everything out (`useVitals.ts:131-144`).

**1. Deviation z-scores** (`useVitals.ts:192-194`) — how far the latest HR /
current activity sit above the learned baseline, scaled by the baseline's MAD:

```
zHr  = (lastHr   - hrMean)  / (hrVar  || 1)
zAct = (activity - actMean) / (actVar || 1)
```

**2. Breath-stability term** (`useVitals.ts:196`) — `bestP` is the strongest
Goertzel power in the respiratory band (0.10–0.50 Hz) of the mean-removed,
EWMA-smoothed 45 s HR window (`useVitals.ts:146-174`):

```
roughBreathStability = min(1, bestP / 200)
```

**3. Stress / energy** (`useVitals.ts:217-218`) — a weighted blend pushed
through a logistic `sigmoid` (`useVitals.ts:383`), then clamped to [0,1]:

```
stress01 = clamp01( 0.6*sigmoid(zHr) + 0.3*sigmoid(zAct) + 0.1*(1 - roughBreathStability) )
energy01 = clamp01( 0.6*(1 - sigmoid(zHr)) + 0.3*(1 - sigmoid(zAct)) + 0.1*roughBreathStability )
```

Energy is essentially the mirror of stress on the HR/activity terms but **adds**
the stability term rather than subtracting it.

**4. Output scaling** (`useVitals.ts:220-223`):

```
stress = round(stress01 * 100)   // 0..100 integer
energy = round(energy01 * 100)   // 0..100 integer
```

### Smoothing / clamping summary

- HR window is mean-removed then EWMA-smoothed at `alpha=0.3` before the spectral
  step (`useVitals.ts:160-163`).
- `sigmoid(x) = 1/(1+e^-x)` maps each z-score into (0,1) (`useVitals.ts:383-385`).
- `clamp01` bounds the final blends to [0,1] (`src/hooks/dsp.ts:5`).
- Stress/energy themselves are **not** EWMA-smoothed — they recompute fresh every
  2 s. (Breathing `br` and `coherence` are EWMA-smoothed; stress/energy are not.)

## Outputs and what the numbers mean

`stress` and `energy` are integers in **0..100**:

- **~50** — at baseline. `sigmoid(0)=0.5`, so when `zHr≈0` and `zAct≈0` and
  stability is mid, both land near the middle. 50 is "neutral / as usual for you".
- **High stress (→100)** — HR (and/or activity) well above your learned baseline
  and/or unstable breathing.
- **High energy (→100)** — HR/activity at or below baseline with stable
  breathing. Because both lean on the same `sigmoid(zHr)` term, high stress
  generally implies low energy and vice-versa (they are not independent).
- **null** — fewer than 10 buffer points / no live source; tiles show "--"
  (`useVitals.ts:131-144`). `hasVitalsData` is true only when a source is live
  **and** both stress and energy are non-null (`useVitals.ts:304-316`).

Stress/energy also feed the **emotional indices** (`arousal/calm/focus/
excitement/fatigue/flow`) via `calculateEmotionalIndices()`
(`useVitals.ts:410-428`), passed in as `energy01`/`stress01`.

## How vitals drive the OND reward + home metrics

`AdaptivePracticeModal` reads `useVitals()` and snapshots stress/energy at start
vs. the best achieved during practice (`src/components/AdaptivePracticeModal.tsx:535,591-603`),
then feeds them to `calculatePracticeOnd()` (`src/utils/ondCalculator.ts:21`):

- **Performance OND** rewards *improvement*: stress going **down** and energy
  going **up** between before/after.
  - `stressChange = (stressBefore - stressAfter)/stressBefore * 100`, scored
    against a **10 %** target, weight **0.40** of `baseOndReward`
    (`ondCalculator.ts:79-82`).
  - `energyChange = (energyAfter - energyBefore)/energyBefore * 100`, **10 %**
    target, weight **0.45** (`ondCalculator.ts:84-87`).
- **Completion OND** is separate — `0.15 * baseOndReward * completionRatio`
  (`ondCalculator.ts:33-34`).
- If real sensor metrics are missing, a simulated ±3 % drift fallback is used and
  `isSimulated`/`hasRealMetrics` flag it (`ondCalculator.ts:42-76,98`).

See `docs/architecture/practices.md` for the full OND-reward flow.

## Honesty note

These are **heuristic wellness estimates, not clinical measurements.** Several
points to be honest about:

- The "z-scores" use mean-absolute deviation, not standard deviation
  (`useVitals.ts:115`), and the baseline is a short per-session EWMA seeded with
  fixed guesses (`hrMean=70`) — not a calibrated personal resting profile.
- The weights (0.6/0.3/0.1) and the `/200` stability scale are hand-tuned
  constants, not derived from validated physiology.
- "Breathing rate" and "coherence" are **RSA estimates from the HR series**, not
  beat-to-beat RR intervals. The app explicitly notes it never receives true RR
  intervals from Apple Watch over WCSession (`useVitals.ts:202-204`), so
  `hrv`/`coherence` are surrogates (HR standard deviation / spectral peak
  concentration), and coherence is hard-nulled for the camera source by
  `coherenceForSource()` (`src/lib/sensorSource.ts:59`).
- Stress/energy are intentionally **anti-correlated** (shared `sigmoid(zHr)`
  term), so they are not two independent measurements.

## Public API / exports

`useVitals()` (`src/hooks/useVitals.ts:11`) returns:

- Vitals: `stress`, `energy`, `br`, `hrv`, `coherence`, `csi`, `recoveryRate`,
  `hrTrendSlope`, `hrAcceleration` (`useVitals.ts:338`).
- Emotional indices: `arousal`, `calm`, `focus`, `excitement`, `fatigue`, `flow`
  (`useVitals.ts:339`).
- Source/HR: `hr`, `hrSource`, `connected`, `hasVitalsData`, `hasHRSource`,
  `stressReady`, `energyReady` (`useVitals.ts:319-335`).
- Per-platform sub-objects: BLE controls, `notificationHR`, `healthKitHR`,
  `watchHR` (`useVitals.ts:341-379`).

Internal-only (not exported): `sigmoid`, `z01`, `mid`,
`calculateEmotionalIndices`.

## Source files

- `src/hooks/useVitals.ts` — all vitals math (baseline, stress/energy, breathing,
  coherence, emotional indices).
- `src/hooks/dsp.ts` — `ewma`, `clamp01`, `goertzelPower` helpers.
- `src/lib/sensorSource.ts` — pulse-source resolution + coherence honesty gate.
- `src/hooks/heartRateStore.ts` — shared HR buffer the math reads from.
- `src/utils/ondCalculator.ts` — converts stress/energy deltas into OND reward.
- `src/components/AdaptivePracticeModal.tsx` — primary consumer (before/after
  snapshot → OND).
