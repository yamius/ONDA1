// Synced copy of the app's src/hooks/dsp.ts — keep in sync; do not diverge.
// Pure DSP helpers consumed by ppgCore (Goertzel power, EWMA, clamp). The app
// is the source of truth; this copy exists only because the landing site is a
// separate Vite build that cannot import across the app root.

export function ewma(prev: number, next: number, alpha = 0.2) {
  return prev === -1 ? next : prev * (1 - alpha) + next * alpha;
}

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

export function goertzelPower(x: number[], fs: number, f: number) {
  const w = (2 * Math.PI * f) / fs;
  const cos = Math.cos(w), sin = Math.sin(w);
  let s0 = 0, s1 = 0, s2 = 0;
  for (let n = 0; n < x.length; n++) {
    s0 = x[n] + 2 * cos * s1 - s2;
    s2 = s1;
    s1 = s0;
  }
  const real = s1 - s2 * cos;
  const imag = s2 * sin;
  return real * real + imag * imag;
}
