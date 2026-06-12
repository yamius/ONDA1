// Synced copy of the app's src/lib/ppgCore.ts — keep in sync; do not diverge.
// The app is the source of truth (shipped + device-validated). This copy exists
// only because the landing site is a separate Vite build that cannot import
// across the app root. Only the dsp import path differs ('./dsp' here).
//
/**
 * ppgCore — pure signal-processing core for camera photoplethysmography (PPG).
 *
 * HEART RATE ONLY. No HRV, no coherence, no stress/energy/emotion inference.
 * Camera PPG at ~30 Hz cannot time individual beats precisely enough for
 * reliable HRV/coherence (those need 100–200 Hz and stay watch-only). This
 * module deliberately delivers a robust, honest *pulse rate* + a confidence so
 * the UI can blank rather than bluff on a weak signal.
 *
 * Method: raw {t,v} red-channel means → resample to a uniform grid (never trust
 * a fixed fps) → linear detrend → zero-phase Butterworth band-pass 0.6–3.5 Hz →
 * PRIMARY estimator = frequency-domain spectral peak (Goertzel sweep + parabolic
 * interpolation + octave/harmonic guard) → CONFIRM with autocorrelation → commit
 * a value only when the two agree and the signal-quality index passes; otherwise
 * return null (hold/blank).
 */

import { goertzelPower, clamp01, ewma } from './dsp';

// ── Configuration (the literature-grounded defaults) ───────────────────────
export const PPG = {
  FS: 30, // uniform analysis grid (Hz). 30 ≫ 8 Hz Nyquist for a 240-bpm (4 Hz) fundamental.
  BAND_LOW_HZ: 0.6, // 36 bpm — margin below the lowest claimed rate so the corner skirt doesn't eat a 50-bpm fundamental
  BAND_HIGH_HZ: 3.5, // 210 bpm
  HR_MIN_HZ: 0.7, // 42 bpm — estimator search floor (relaxed/meditating users sit at 0.83–1.08 Hz)
  HR_MAX_HZ: 3.3, // 198 bpm
  SWEEP_STEP_HZ: 0.02, // ~1.2 bpm raw bins; parabolic interp refines peak LOCATION (resolving power stays ~1/T)
  WINDOW_SEC: 15, // 15 s improves spectral SNR at acceptable latency
  MIN_GOOD_SEC: 10, // require ≥10 s of contiguous good signal before the first commit
  AGREEMENT_BPM: 5, // spectral vs autocorrelation must agree within this to commit
  MIN_CONFIDENCE: 0.5, // composite SQI gate
} as const;

// ── Types ──────────────────────────────────────────────────────────────────
/** One raw frame sample: timestamp in ms (performance.now / rVFC mediaTime) + red-channel spatial mean. */
export interface PpgSample {
  t: number;
  v: number;
}

export interface HrEstimate {
  /** Committed pulse in bpm, or null when the signal is not trustworthy (UI should blank/hold). */
  bpm: number | null;
  /** 0..1 composite signal-quality / confidence. */
  confidence: number;
  /** Diagnostics (not for display). */
  spectralBpm: number | null;
  autocorrBpm: number | null;
  agree: boolean;
  /** spectral peak power / total band power — peak concentration (0..1). */
  concentration: number;
  reason: 'ok' | 'too_short' | 'low_quality' | 'disagree' | 'no_peak';
}

// ── Resampling: raw (jittery) timestamps → uniform grid ─────────────────────
/**
 * Linear-interpolate irregularly-timed samples onto a uniform `fs` Hz grid.
 * Phone cameras deliver variable fps ("30p" ≈ 25–31 fps); converting a sample
 * index to time with a hard-coded fps is a direct multiplicative bpm bias, so
 * EVERY downstream estimator must consume this uniform grid, never raw indices.
 */
export function resampleUniform(samples: PpgSample[], fs = PPG.FS): number[] {
  if (samples.length < 2) return [];
  const t0 = samples[0].t;
  const tEnd = samples[samples.length - 1].t;
  const spanSec = (tEnd - t0) / 1000;
  if (spanSec <= 0) return [];
  const n = Math.floor(spanSec * fs);
  if (n < 2) return [];
  const dtMs = 1000 / fs;
  const out = new Array<number>(n);
  let j = 0;
  for (let i = 0; i < n; i++) {
    const tx = t0 + i * dtMs;
    while (j + 1 < samples.length && samples[j + 1].t < tx) j++;
    const p0 = samples[Math.max(0, j)];
    const p1 = samples[Math.min(samples.length - 1, j + 1)];
    const denom = p1.t - p0.t;
    const frac = denom <= 0 ? 0 : (tx - p0.t) / denom;
    out[i] = p0.v + frac * (p1.v - p0.v);
  }
  return out;
}

// ── Linear detrend (least-squares) ──────────────────────────────────────────
export function linearDetrend(x: number[]): number[] {
  const n = x.length;
  if (n < 2) return x.slice();
  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) {
    sx += i; sy += x[i]; sxx += i * i; sxy += i * x[i];
  }
  const denom = n * sxx - sx * sx;
  const slope = denom === 0 ? 0 : (n * sxy - sx * sy) / denom;
  const intercept = (sy - slope * sx) / n;
  const out = new Array<number>(n);
  for (let i = 0; i < n; i++) out[i] = x[i] - (slope * i + intercept);
  return out;
}

// ── Zero-phase Butterworth-style band-pass (RBJ biquad, filtfilt) ───────────
/**
 * RBJ band-pass biquad (constant 0 dB peak), applied forward then backward for
 * ZERO phase — preserves beat timing so the RSA dip (pulse falling on exhale)
 * stays visible.
 */
export function bandpass(x: number[], fs = PPG.FS, lowHz = PPG.BAND_LOW_HZ, highHz = PPG.BAND_HIGH_HZ): number[] {
  if (x.length < 4) return x.slice();
  const f0 = Math.sqrt(lowHz * highHz);
  const bw = Math.max(0.0001, highHz - lowHz);
  const q = f0 / bw;
  const w0 = (2 * Math.PI * f0) / fs;
  const cosw = Math.cos(w0);
  const alpha = Math.sin(w0) / (2 * q);
  const a0 = 1 + alpha;
  const b0 = alpha / a0;
  const b1 = 0;
  const b2 = -alpha / a0;
  const a1 = (-2 * cosw) / a0;
  const a2 = (1 - alpha) / a0;

  const biquad = (sig: number[]): number[] => {
    const out = new Array<number>(sig.length);
    let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    for (let i = 0; i < sig.length; i++) {
      const xn = sig[i];
      const yn = b0 * xn + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
      x2 = x1; x1 = xn; y2 = y1; y1 = yn;
      out[i] = yn;
    }
    return out;
  };

  const fwd = biquad(x);
  const rev = biquad(fwd.slice().reverse());
  return rev.reverse();
}

// ── Spectral HR (Goertzel sweep + parabolic peak + octave guard) ────────────
interface SpectralResult {
  bpm: number | null;
  concentration: number; // peak band power / total band power
  prominence: number; // peak / median band power
}

export function spectralHr(
  x: number[],
  fs = PPG.FS,
  minHz = PPG.HR_MIN_HZ,
  maxHz = PPG.HR_MAX_HZ,
  stepHz = PPG.SWEEP_STEP_HZ,
): SpectralResult {
  if (x.length < fs * 4) return { bpm: null, concentration: 0, prominence: 0 };
  const freqs: number[] = [];
  const powers: number[] = [];
  let total = 0;
  for (let f = minHz; f <= maxHz + 1e-9; f += stepHz) {
    const p = goertzelPower(x, fs, f);
    freqs.push(f);
    powers.push(p);
    total += p;
  }
  if (total <= 0 || powers.length < 3) return { bpm: null, concentration: 0, prominence: 0 };

  // Peak selection with HPS-style harmonic reinforcement — the octave (2×) guard.
  let peakPowGlobal = 0;
  for (let i = 0; i < powers.length; i++) if (powers[i] > peakPowGlobal) peakPowGlobal = powers[i];
  const denomG = peakPowGlobal || 1e-9;
  let peakIdx = 0;
  let bestScore = -Infinity;
  for (let i = 0; i < powers.length; i++) {
    const twoF = 2 * freqs[i];
    let harmonicSupport = 0;
    if (twoF <= maxHz) {
      const hi = Math.round((twoF - minHz) / stepHz);
      if (hi >= 0 && hi < powers.length) harmonicSupport = powers[hi];
    }
    const score = powers[i] + 2 * powers[i] * (harmonicSupport / denomG);
    if (score > bestScore) { bestScore = score; peakIdx = i; }
  }

  // parabolic interpolation for sub-bin peak LOCATION (precision, not resolving power)
  let refinedFreq = freqs[peakIdx];
  if (peakIdx > 0 && peakIdx < powers.length - 1) {
    const ym = powers[peakIdx - 1], y0 = powers[peakIdx], yp = powers[peakIdx + 1];
    const denom = ym - 2 * y0 + yp;
    const delta = denom !== 0 ? 0.5 * (ym - yp) / denom : 0;
    refinedFreq = freqs[peakIdx] + Math.max(-0.5, Math.min(0.5, delta)) * stepHz;
  }

  // SQI terms: peak concentration over the band, and prominence vs the median bin
  const peakPow = powers[peakIdx];
  let band = peakPow;
  if (peakIdx - 1 >= 0) band += powers[peakIdx - 1];
  if (peakIdx + 1 < powers.length) band += powers[peakIdx + 1];
  const concentration = clamp01(band / total);
  const sorted = powers.slice().sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)] || 1e-9;
  const prominence = peakPow / median;

  return { bpm: refinedFreq * 60, concentration, prominence };
}

// ── Autocorrelation HR (parabolic lag) — independent confirmer ──────────────
export function autocorrHr(
  x: number[],
  fs = PPG.FS,
  minHz = PPG.HR_MIN_HZ,
  maxHz = PPG.HR_MAX_HZ,
): { bpm: number | null; strength: number } {
  const n = x.length;
  if (n < fs * 4) return { bpm: null, strength: 0 };
  let mean = 0;
  for (let i = 0; i < n; i++) mean += x[i];
  mean /= n;
  const xm = new Array<number>(n);
  for (let i = 0; i < n; i++) xm[i] = x[i] - mean;
  let zero = 0;
  for (let i = 0; i < n; i++) zero += xm[i] * xm[i];
  if (zero <= 0) return { bpm: null, strength: 0 };

  const minLag = Math.floor(fs / maxHz);
  const maxLag = Math.ceil(fs / minHz);
  let bestLag = -1;
  let bestVal = -Infinity;
  const acf = new Array<number>(maxLag + 2).fill(0);
  for (let lag = minLag; lag <= maxLag && lag < n; lag++) {
    let s = 0;
    for (let i = 0; i < n - lag; i++) s += xm[i] * xm[i + lag];
    acf[lag] = s / zero;
    if (acf[lag] > bestVal) { bestVal = acf[lag]; bestLag = lag; }
  }
  if (bestLag < 1 || bestVal <= 0) return { bpm: null, strength: 0 };

  // parabolic interpolation of the lag (removes integer-lag bpm quantisation)
  let lag = bestLag;
  if (bestLag > minLag && bestLag < maxLag) {
    const ym = acf[bestLag - 1], y0 = acf[bestLag], yp = acf[bestLag + 1];
    const denom = ym - 2 * y0 + yp;
    const delta = denom !== 0 ? 0.5 * (ym - yp) / denom : 0;
    lag = bestLag + Math.max(-0.5, Math.min(0.5, delta));
  }
  return { bpm: (60 * fs) / lag, strength: clamp01(bestVal) };
}

// ── Orchestrator: raw buffer → committed HR (or null) ───────────────────────
/**
 * The main entry. Feed the rolling raw {t,v} red-mean buffer; get a trustworthy
 * bpm or null. Returns null (and a reason) whenever the window is too short, the
 * SQI is low, or the spectral & autocorrelation estimates disagree — the
 * "blank rather than bluff" rule that makes camera HR honest.
 */
export function estimateHr(samples: PpgSample[], fs = PPG.FS): HrEstimate {
  const base: HrEstimate = {
    bpm: null, confidence: 0, spectralBpm: null, autocorrBpm: null,
    agree: false, concentration: 0, reason: 'too_short',
  };
  if (samples.length < 2) return base;
  const spanSec = (samples[samples.length - 1].t - samples[0].t) / 1000;
  if (spanSec < PPG.MIN_GOOD_SEC) return base;

  const grid = resampleUniform(samples, fs);
  if (grid.length < fs * PPG.MIN_GOOD_SEC) return base;
  const conditioned = bandpass(linearDetrend(grid), fs);

  const spec = spectralHr(conditioned, fs);
  const ac = autocorrHr(conditioned, fs);
  base.spectralBpm = spec.bpm;
  base.autocorrBpm = ac.bpm;
  base.concentration = spec.concentration;

  if (spec.bpm == null) return { ...base, reason: 'no_peak' };

  // composite confidence: spectral concentration + prominence + autocorr strength
  const promScore = clamp01((spec.prominence - 3) / 12); // ~3× median ≈ weak, ~15× ≈ strong
  const confidence = clamp01(0.5 * spec.concentration + 0.3 * promScore + 0.2 * ac.strength);

  const agree = ac.bpm != null && Math.abs(spec.bpm - ac.bpm) <= PPG.AGREEMENT_BPM;
  if (!agree) return { ...base, confidence, reason: 'disagree' };
  if (confidence < PPG.MIN_CONFIDENCE) return { ...base, confidence, agree, reason: 'low_quality' };

  // commit: lean on the spectral estimate, nudged toward autocorr agreement
  const bpm = ac.bpm != null ? 0.6 * spec.bpm + 0.4 * ac.bpm : spec.bpm;
  return { ...base, bpm, confidence, agree: true, reason: 'ok' };
}

// ── Per-frame FINGER-PRESENCE gate (operates on frame RGB stats) ────────────
export interface FrameStats {
  rMean: number;
  gMean: number;
  bMean: number;
  /** fraction of ROI pixels with R≥250 (torch saturation) */
  clipFrac: number;
}

/**
 * FINGER-PRESENCE ONLY — "is there a finger on the lens", NOT a quality filter.
 * Deliberately has NO brightness threshold: a brightness floor is exactly what
 * rejects darker skin and would deny those users the live feedback. Uses only a
 * relative redness ratio + a saturation guard.
 */
export function isGoodContact(s: FrameStats): boolean {
  const sum = s.rMean + s.gMean + s.bMean + 1e-6;
  const redness = s.rMean / sum; // finger over the torch ⇒ red dominates the transmitted light
  const redDominant = s.rMean > s.gMean * 1.3;
  const notBlownOut = s.clipFrac < 0.8;
  return redness > 0.5 && redDominant && notBlownOut;
}

// ── SQI-adaptive smoothing (keeps RSA visible) ──────────────────────────────
/**
 * EMA whose responsiveness RISES with confidence and FALLS on weak signal, with
 * a per-update slew cap. Keep the effective time-constant well under the ~10 s
 * RSA cycle so the exhale dip in pulse stays visible.
 */
export function adaptiveSmooth(prevBpm: number, nextBpm: number, confidence: number): number {
  if (prevBpm <= 0) return nextBpm;
  const alpha = 0.12 + 0.33 * clamp01(confidence); // ~0.12 (weak) … ~0.45 (strong)
  const smoothed = ewma(prevBpm, nextBpm, alpha);
  const maxStep = 8; // bpm per update — reject artifact jumps
  if (smoothed - prevBpm > maxStep) return prevBpm + maxStep;
  if (prevBpm - smoothed > maxStep) return prevBpm - maxStep;
  return smoothed;
}
