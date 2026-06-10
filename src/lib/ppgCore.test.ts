import { describe, it, expect } from 'vitest';
import {
  estimateHr,
  resampleUniform,
  bandpass,
  linearDetrend,
  spectralHr,
  autocorrHr,
  isGoodContact,
  adaptiveSmooth,
  PPG,
  type PpgSample,
} from './ppgCore';

// Deterministic LCG so tests don't depend on Math.random (and stay reproducible).
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

/**
 * Build a realistic-ish synthetic camera-PPG buffer:
 *  - fundamental at `bpm`
 *  - optional 2nd harmonic (sharp pulse / dicrotic)
 *  - slow baseline wander (torch warming / drift)
 *  - white noise
 *  - JITTERED timestamps (variable fps), which the resampler must absorb
 */
function synth(opts: {
  bpm: number;
  seconds?: number;
  nominalFps?: number;
  harmonic?: number;
  noise?: number;
  drift?: number;
  seed?: number;
}): PpgSample[] {
  const { bpm, seconds = 16, nominalFps = 30, harmonic = 0.3, noise = 0.08, drift = 0.4, seed = 7 } = opts;
  const rand = rng(seed);
  const f = bpm / 60;
  const samples: PpgSample[] = [];
  let t = 0;
  while (t < seconds * 1000) {
    const ts = t / 1000;
    const v =
      128 + // DC (red mean baseline)
      6 * Math.sin(2 * Math.PI * f * ts) +
      6 * harmonic * Math.sin(2 * Math.PI * 2 * f * ts) +
      drift * 10 * Math.sin(2 * Math.PI * 0.05 * ts) +
      noise * 12 * (rand() - 0.5);
    samples.push({ t, v });
    // jitter the frame interval ±25% around the nominal period (25–37 fps feel)
    const dt = (1000 / nominalFps) * (0.75 + 0.5 * rand());
    t += dt;
  }
  return samples;
}

describe('ppgCore — resampling & conditioning', () => {
  it('resamples jittery timestamps onto a uniform grid of the right length', () => {
    const s = synth({ bpm: 72, seconds: 10 });
    const grid = resampleUniform(s, PPG.FS);
    // ~10 s * 30 Hz, allow a couple of samples slack at the edge
    expect(grid.length).toBeGreaterThan(PPG.FS * 9);
    expect(grid.length).toBeLessThanOrEqual(PPG.FS * 10 + 1);
    expect(grid.every((v) => Number.isFinite(v))).toBe(true);
  });

  it('linear detrend removes a ramp', () => {
    const x = Array.from({ length: 100 }, (_, i) => 5 + 0.3 * i);
    const d = linearDetrend(x);
    const mean = d.reduce((a, b) => a + b, 0) / d.length;
    expect(Math.abs(mean)).toBeLessThan(1e-6);
    expect(Math.abs(d[0])).toBeLessThan(1e-6);
    expect(Math.abs(d[d.length - 1])).toBeLessThan(1e-6);
  });

  it('bandpass attenuates a slow baseline far more than the cardiac band', () => {
    const fs = PPG.FS;
    const n = fs * 12;
    const slow = Array.from({ length: n }, (_, i) => Math.sin(2 * Math.PI * 0.05 * (i / fs))); // 3 bpm-ish drift
    const card = Array.from({ length: n }, (_, i) => Math.sin(2 * Math.PI * 1.2 * (i / fs))); // 72 bpm
    const amp = (a: number[]) => Math.max(...a.map(Math.abs));
    const slowOut = amp(bandpass(slow, fs));
    const cardOut = amp(bandpass(card, fs));
    expect(slowOut).toBeLessThan(cardOut * 0.3);
  });
});

describe('ppgCore — HR estimators', () => {
  const cases = [54, 66, 72, 90, 120];
  for (const bpm of cases) {
    it(`spectralHr recovers ${bpm} bpm within 2 bpm`, () => {
      const cond = bandpass(linearDetrend(resampleUniform(synth({ bpm, seed: bpm }))));
      const r = spectralHr(cond);
      expect(r.bpm).not.toBeNull();
      expect(Math.abs((r.bpm as number) - bpm)).toBeLessThanOrEqual(2);
    });

    it(`autocorrHr recovers ${bpm} bpm within 3 bpm`, () => {
      const cond = bandpass(linearDetrend(resampleUniform(synth({ bpm, seed: bpm + 1 }))));
      const r = autocorrHr(cond);
      expect(r.bpm).not.toBeNull();
      expect(Math.abs((r.bpm as number) - bpm)).toBeLessThanOrEqual(3);
    });
  }

  it('octave guard: a dominant 2nd harmonic does NOT double the estimate', () => {
    // harmonic stronger than the fundamental — classic 2× failure mode
    const cond = bandpass(linearDetrend(resampleUniform(synth({ bpm: 60, harmonic: 1.4, seed: 99 }))));
    const r = spectralHr(cond);
    expect(r.bpm).not.toBeNull();
    expect(Math.abs((r.bpm as number) - 60)).toBeLessThanOrEqual(3); // ~60, not ~120
  });
});

describe('ppgCore — estimateHr (commit/blank policy)', () => {
  it('commits a confident HR within 2 bpm for a clean signal', () => {
    const est = estimateHr(synth({ bpm: 72, seconds: 16, seed: 3 }));
    expect(est.reason).toBe('ok');
    expect(est.bpm).not.toBeNull();
    expect(Math.abs((est.bpm as number) - 72)).toBeLessThanOrEqual(2);
    expect(est.agree).toBe(true);
    expect(est.confidence).toBeGreaterThan(PPG.MIN_CONFIDENCE);
  });

  it('returns null (too_short) below the minimum window', () => {
    const est = estimateHr(synth({ bpm: 72, seconds: 5 }));
    expect(est.bpm).toBeNull();
    expect(est.reason).toBe('too_short');
  });

  it('blanks (no committed bpm) on pure noise — never bluffs', () => {
    const rand = rng(42);
    const samples: PpgSample[] = [];
    let t = 0;
    while (t < 16000) {
      samples.push({ t, v: 128 + 12 * (rand() - 0.5) });
      t += (1000 / 30) * (0.75 + 0.5 * rand());
    }
    const est = estimateHr(samples);
    expect(est.bpm).toBeNull();
    expect(['low_quality', 'disagree', 'no_peak']).toContain(est.reason);
  });
});

describe('ppgCore — contact gate, smoothing', () => {
  it('isGoodContact accepts a red-dominant finger frame and rejects a bright scene', () => {
    expect(isGoodContact({ rMean: 180, gMean: 40, bMean: 30, clipFrac: 0.01, redVar: 300 })).toBe(true);
    // bright balanced scene (no finger): not red-dominant
    expect(isGoodContact({ rMean: 200, gMean: 200, bMean: 200, clipFrac: 0.2, redVar: 5000 })).toBe(false);
  });

  it('adaptiveSmooth caps artifact jumps and seeds from zero', () => {
    expect(adaptiveSmooth(0, 72, 0.9)).toBe(72); // first reading seeds directly
    const jumped = adaptiveSmooth(70, 140, 0.9); // +70 jump must be slew-capped
    expect(jumped).toBeLessThanOrEqual(70 + 8 + 1e-9);
  });
});
