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

/* ── Traffic light (Simple mode, task 83 · math fix task 86) ─────────────────
 * A VISUALIZATION of the SAME corridor engine. The counter = consecutive trailing
 * NIGHTS a metric sat outside its corridor (any metric); one night inside resets
 * it. green = 0, yellow = 1 (a specific metric), red = 2+ (the body is out N nights
 * regardless of which metric). Red has two TEXT phases (same colour): 2-3 nights
 * soft (no PDF), 4+ strong (+PDF). One threshold (±1.5 SD) for yellow AND red — the
 * difference is only how many nights it hasn't returned. The corridor is the 90-day
 * window (task 86): a few out-nights are ~a few % of it, so it doesn't drift and red
 * actually accrues (a short 14/30-day window would "learn" the deviation in days).
 */
export type TrafficLight = 'green' | 'yellow' | 'red';
export const RED_PHASE1_NIGHTS = 2;   // 2-3 nights out → red, soft (no PDF)
export const RED_PHASE2_NIGHTS = 4;   // 4+ nights out → red, strong (+PDF)

export interface TrafficState {
  light: TrafficLight;
  metric?: AnomalyMetric;        // the driver metric (longest run); practice picks by it
  metrics?: AnomalyMetric[];     // metrics out on the last night (yellow subtext lists them)
  direction?: AnomalyDirection;
  nights?: number;               // consecutive nights out (the counter)
  redDays?: number;              // = nights, when red (kept for the render)
  redPhase?: 1 | 2;              // red only: 1 = 2-3 nights (soft), 2 = 4+ (strong + PDF)
  anomaly?: Anomaly;             // yellow: the deviation detail
}

/** Is this night's value outside the corridor in the metric's concern direction,
 *  at the ±1.5 SD gate + the metric floor (same strictness as a yellow signal)? */
function isNightOut(value: number, mean: number, sd: number, metric: AnomalyMetric): boolean {
  if (!(sd > 0) || !Number.isFinite(value)) return false;
  const delta = value - mean;
  if (Math.abs(delta) / sd < SD_GATE) return false;
  const rule = RULES[metric];
  if (rule.dir === 'high') return delta > 0 && (rule.absDelta == null || delta >= rule.absDelta);
  const relDrop = mean > 0 ? -delta / mean : 0;
  return delta < 0 && (rule.relDrop == null || relDrop >= rule.relDrop) && (rule.absDelta == null || -delta >= rule.absDelta);
}

/** Consecutive trailing nights this metric sat outside its 90-day corridor. The
 *  corridor is mean±SD over the WHOLE window — with ~90 nights a few out-nights
 *  barely move it, so a sustained deviation accrues (task 86). */
function trailingOut(values: number[], metric: AnomalyMetric): number {
  if (!Array.isArray(values) || values.length < MIN_NIGHTS) return 0;
  const { mean, sd } = meanSd(values);
  if (!(sd > 0)) return 0;
  let count = 0;
  for (let i = values.length - 1; i >= 0; i--) {
    if (isNightOut(values[i], mean, sd, metric)) count++; else break;
  }
  return count;
}

/** Reduce all signals to one traffic-light state. Counter = longest current
 *  out-run across metrics; a night inside any metric doesn't reset the others,
 *  so the counter reflects "the body has been out N nights". */
export function computeTrafficLight(signals: SignalInput[]): TrafficState {
  let counter = 0;
  let driver: AnomalyMetric | undefined;
  const outNow: AnomalyMetric[] = [];   // out on the last night
  for (const s of signals) {
    const c = trailingOut([...s.nights, s.latest], s.metric);
    if (c > counter) { counter = c; driver = s.metric; }
    if (c >= 1) outNow.push(s.metric);
  }
  if (counter === 0 || !driver) return { light: 'green', nights: 0 };
  if (counter === 1) {
    return { light: 'yellow', metric: driver, metrics: outNow.length ? outNow : [driver], direction: RULES[driver].dir, nights: 1 };
  }
  const redPhase: 1 | 2 = counter >= RED_PHASE2_NIGHTS ? 2 : 1;
  return { light: 'red', metric: driver, metrics: outNow.length ? outNow : [driver], direction: RULES[driver].dir, nights: counter, redDays: counter, redPhase };
}

/* ── Throttle + persisted state ─────────────────────────────────────────── */
const STATE_KEY = 'onda_anomaly_state';

/** A raised signal the card is (or was) acting on. */
export interface PendingAnomaly extends Anomaly {
  at: number;              // sync time (morning the deviation was found)
  night: string;           // YYYY-MM-DD of the deviating night
  recorded?: boolean;      // a note has been saved for it (card → state 2)
  recordedAt?: string;     // ISO of that save (sync time shown on the card)
  remindAfter?: number;    // "remind later" — hide until this ms
  signalCount?: number;    // how many signals ever (drives the card's example line)
  simulated?: boolean;     // injected by the internal test mode (task 84 pt3) — never real analytics
}

export interface AnomalyState {
  lastSignalAt?: number;   // when we last raised a signal (throttle)
  signalCount?: number;    // running total of signals raised
  pending?: PendingAnomaly; // the signal to act on, if any
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
