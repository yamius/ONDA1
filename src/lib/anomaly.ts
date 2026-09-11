/**
 * Anomaly detection — PURE STATISTICS, not AI (retention step 4).
 *
 * Compares last night's passive metrics against the person's OWN corridor built
 * from their baseline nights (mean ± SD), never a population norm and never a
 * single day. A signal fires only at the STRICT end: it must clear BOTH the SD
 * gate (≥1.5 SD out) AND the metric's absolute/relative floor. One false signal
 * hurts trust more than a missed mild one (task §103), so we err quiet.
 *
 * Guards that kill false positives (task §1): ≥7 valid nights of base, noisy
 * nights excluded upstream (native drops nights with too few samples), and
 * direction-aware (↑ resting-HR / ↓ HRV both read as "on guard", worded gently,
 * never medically). No model here — data is shaped for a future one (§5).
 */
export type AnomalyMetric = 'rhr' | 'hrv' | 'rr';
export type AnomalyDirection = 'high' | 'low';

/** One signal's clean nightly history + the newest night, from the watch. */
export interface SignalInput {
  metric: AnomalyMetric;
  nights: number[]; // clean nightly values over the window (noisy nights already dropped)
  latest: number;   // last night's value
}

export interface Anomaly {
  metric: AnomalyMetric;
  direction: AnomalyDirection;
  mean: number;
  sd: number;
  latest: number;
  delta: number;       // latest − mean (signed)
  magnitudeSd: number; // |delta| / sd — how many SDs out (used to rank + report)
  loBound: number;     // mean − sd (corridor low)
  hiBound: number;     // mean + sd (corridor high)
  nights: number;      // valid nights behind the corridor
}

export const MIN_NIGHTS = 7;   // fewer → "base is still building", stay silent
export const SD_GATE = 1.5;    // must be this many SDs out
export const SIGNAL_COOLDOWN_MS = 2 * 24 * 60 * 60 * 1000; // ≤ 1 signal / 2 days

/** Per-metric signal shape: which direction is a signal + its absolute/relative floor. */
const RULES: Record<AnomalyMetric, { dir: AnomalyDirection; absDelta?: number; relDrop?: number }> = {
  rhr: { dir: 'high', absDelta: 5 },   // resting HR up ≥5 bpm
  hrv: { dir: 'low', relDrop: 0.15 },  // HRV down ≥15%
  rr: { dir: 'high', absDelta: 2 },    // breathing up ≥2 /min
};

const round1 = (n: number) => Math.round(n * 10) / 10;
const round2 = (n: number) => Math.round(n * 100) / 100;

function meanSd(xs: number[]): { mean: number; sd: number } {
  const n = xs.length;
  const mean = xs.reduce((a, b) => a + b, 0) / n;
  const variance = xs.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1); // sample SD
  return { mean, sd: Math.sqrt(variance) };
}

/** Evaluate one signal against its corridor. Null unless it clears the strict gate. */
export function evalSignal(s: SignalInput): Anomaly | null {
  if (!Array.isArray(s.nights) || s.nights.length < MIN_NIGHTS) return null; // base building
  if (!Number.isFinite(s.latest)) return null;
  const { mean, sd } = meanSd(s.nights);
  if (!(sd > 0)) return null; // no spread → can't judge honestly
  const delta = s.latest - mean;
  const magnitudeSd = Math.abs(delta) / sd;
  if (magnitudeSd < SD_GATE) return null;
  const rule = RULES[s.metric];

  let crosses = false;
  if (rule.dir === 'high') {
    crosses = delta > 0 && (rule.absDelta == null || delta >= rule.absDelta);
  } else {
    const relDrop = mean > 0 ? -delta / mean : 0;
    crosses = delta < 0 && (rule.relDrop == null || relDrop >= rule.relDrop) && (rule.absDelta == null || -delta >= rule.absDelta);
  }
  if (!crosses) return null;

  return {
    metric: s.metric, direction: rule.dir,
    mean: round1(mean), sd: round1(sd), latest: round1(s.latest), delta: round1(delta),
    magnitudeSd: round2(magnitudeSd), loBound: round1(mean - sd), hiBound: round1(mean + sd),
    nights: s.nights.length,
  };
}

/**
 * The single most significant anomaly across all signals (by SDs out), or null.
 * If several deviated, we surface ONE — the strongest (task §1).
 */
export function detectAnomaly(signals: SignalInput[]): Anomaly | null {
  const hits = signals.map(evalSignal).filter((a): a is Anomaly => a != null);
  if (hits.length === 0) return null;
  hits.sort((a, b) => b.magnitudeSd - a.magnitudeSd);
  return hits[0];
}

/* ── Throttle + persisted state ─────────────────────────────────────────── */
const STATE_KEY = 'onda_anomaly_state';

export interface AnomalyState {
  lastSignalAt?: number;         // when we last raised a signal (throttle)
  pending?: Anomaly & { at: number; night: string }; // an unanswered signal to act on
}

export function loadAnomalyState(): AnomalyState {
  try { const raw = localStorage.getItem(STATE_KEY); if (raw) return JSON.parse(raw); } catch { /* noop */ }
  return {};
}
export function saveAnomalyState(s: AnomalyState): void {
  try { localStorage.setItem(STATE_KEY, JSON.stringify(s)); } catch { /* noop */ }
}

/** May we raise a new signal now? (≤ 1 per 2 days.) */
export function canSignal(now: number, lastSignalAt?: number): boolean {
  return lastSignalAt == null || now - lastSignalAt >= SIGNAL_COOLDOWN_MS;
}
