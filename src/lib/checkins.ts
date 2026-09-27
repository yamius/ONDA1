/**
 * Calm check-ins (task 16) — the RARE, gentle counterpart to anomaly signals.
 *
 * Signals only fire on a DEVIATION, so a person whose metrics are steady hears
 * nothing and concludes the app does nothing. Calm check-ins fix that:
 *  - Segment A (watch data): after 4 STEADY nights (all metrics inside the same
 *    personal corridor the signals use), a gentle "you're in your range" nudge,
 *    alternating A1 (practice) / A2 (diary), plus a one-time A3 (expert-mode tip).
 *  - Segment B (no watch data): every 3 days, alternating B1 (practice) /
 *    B2 (camera check-in → saved to the diary).
 *
 * PURE + deterministic (no framework) so it can be unit-checked like anomaly.ts.
 * Thresholds are REUSED from anomaly.ts (meanSd/isNightOut) so the calm "steady"
 * test and the signal "out" test can never drift apart.
 */
import { meanSd, isNightOut, MIN_NIGHTS, type SignalInput } from './anomaly';

export type CheckinSegment = 'watch' | 'no_watch';
export type CheckinType = 'A1' | 'A2' | 'A3' | 'B1' | 'B2';

const STATE_KEY = 'onda_checkin_state';
const DAY = 24 * 60 * 60 * 1000;
const STEADY_NIGHTS_PER_MESSAGE = 4; // Segment A cadence
const SEGMENT_B_INTERVAL_DAYS = 3;   // Segment B cadence

export interface CheckinState {
  // Segment A (aMilestone/aVariant/a3Sent) is now owned by the NATIVE evaluator
  // (HealthKitHeartRatePlugin) so it fires while the app is closed; these fields
  // remain for the pure decideCheckin reference/tests but are unused by the app.
  aMilestone: number;       // highest floor(steadyNights/4) already messaged (resets when the run breaks)
  aVariant: 0 | 1;          // 0 → A1, 1 → A2 (alternates each A send; A3 does NOT advance it)
  a3Sent: boolean;          // the one-time expert-mode tip has been sent
  bVariant: 0 | 1;          // Segment-B series start variant (0 → B1, 1 → B2); flips each plan day
  lastBDay?: string;        // YYYY-MM-DD of the last Segment-B send (decideCheckin single-send path)
  lastBPlanDay?: string;    // YYYY-MM-DD the B series was last (re)planned (≤ 1 replan/day)
  lastCheckinDay?: string;  // YYYY-MM-DD of the last calm message of ANY kind (max 1/day)
}

const DEFAULT_STATE: CheckinState = { aMilestone: 0, aVariant: 0, a3Sent: false, bVariant: 0 };

export function loadCheckinState(): CheckinState {
  try { const raw = localStorage.getItem(STATE_KEY); if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) }; } catch { /* noop */ }
  return { ...DEFAULT_STATE };
}
export function saveCheckinState(s: CheckinState): void {
  try { localStorage.setItem(STATE_KEY, JSON.stringify(s)); } catch { /* noop */ }
}

/** Local calendar day key (YYYY-MM-DD) — anchors "once per day" / the 3-day cadence to the user's wall clock. */
export function dayKey(ts: number = Date.now()): string {
  const d = new Date(ts);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}
function dayDiff(a: string, b: string): number {
  return Math.round((Date.parse(`${a}T00:00:00`) - Date.parse(`${b}T00:00:00`)) / DAY);
}

/**
 * Consecutive trailing STEADY nights across all metrics — the complement of the
 * signal engine's trailing-out run. A night counts as steady only if NO metric is
 * out of its corridor that night; the first out-night ends the run (that's the
 * "reset on any deviation" rule, for free). Dataless nights are already dropped
 * upstream, so they neither add nor reset. 0 until each metric has a real corridor
 * (≥ MIN_NIGHTS), so we never claim "you're in your range" before a baseline exists.
 */
export function steadyNights(signals: SignalInput[]): number {
  if (!signals.length) return 0;
  let min = Infinity;
  for (const s of signals) {
    const series = [...s.nights, s.latest].filter((v) => Number.isFinite(v));
    if (series.length < MIN_NIGHTS) return 0; // base still building for this metric
    const { mean, sd } = meanSd(series);
    if (!(sd > 0)) return 0;
    let run = 0;
    for (let i = series.length - 1; i >= 0; i--) {
      if (!isNightOut(series[i], mean, sd, s.metric)) run++; else break;
    }
    if (run < min) min = run;
  }
  return min === Infinity ? 0 : min;
}

/** Average resting pulse over the trailing `n` steady nights (rounded) — the {X} in A1. */
export function recentRestingPulse(signals: SignalInput[], n = STEADY_NIGHTS_PER_MESSAGE): number | undefined {
  const rhr = signals.find((s) => s.metric === 'rhr');
  if (!rhr) return undefined;
  const series = [...rhr.nights, rhr.latest].filter((v) => Number.isFinite(v));
  if (!series.length) return undefined;
  const tail = series.slice(-n);
  return Math.round(tail.reduce((a, b) => a + b, 0) / tail.length);
}

export interface DecideInput {
  segment: CheckinSegment;
  signals: SignalInput[];    // corridor signals (Segment A only; ignored for B)
  now: number;
  signalToday: boolean;      // an anomaly signal fired today → suppress calm messages
  activeLast24h: boolean;    // practised or measured in the last 24h → Segment B skips (don't nag the active)
  simpleMode: boolean;       // Segment A3 is simple-mode only
  installAgeDays: number;    // Segment A3 fires only in week 2 (days 8–14)
}

export interface CheckinDecision {
  /** What to schedule now, or null. */
  send: { type: CheckinType; restingPulse?: number } | null;
  /** Always the state to persist (may change even when nothing is sent — e.g. a broken run lowers the milestone). */
  state: CheckinState;
}

/**
 * Decide the single calm message (if any) for this reconcile pass. Common guards:
 * never on a signal day, at most one calm message per calendar day.
 */
export function decideCheckin(inp: DecideInput, prev: CheckinState): CheckinDecision {
  const state = { ...prev };
  const today = dayKey(inp.now);

  if (inp.signalToday) return { send: null, state };
  if (state.lastCheckinDay === today) return { send: null, state };

  if (inp.segment === 'watch') {
    const steady = steadyNights(inp.signals);
    const milestone = Math.floor(steady / STEADY_NIGHTS_PER_MESSAGE);
    // A broken run (deviation) lowers the milestone so the NEXT clean 4-night run
    // re-triggers — persist that even when we don't send.
    if (milestone < state.aMilestone) state.aMilestone = milestone;
    if (milestone < 1 || milestone <= state.aMilestone) return { send: null, state };

    state.aMilestone = milestone;
    // A3: once, simple mode only, week 2 — REPLACES this turn's A1/A2 (variant not advanced,
    // so the replaced message comes next time).
    if (!state.a3Sent && inp.simpleMode && inp.installAgeDays >= 8 && inp.installAgeDays <= 14) {
      state.a3Sent = true;
      state.lastCheckinDay = today;
      return { send: { type: 'A3' }, state };
    }
    const type: CheckinType = state.aVariant === 0 ? 'A1' : 'A2';
    state.aVariant = state.aVariant === 0 ? 1 : 0;
    state.lastCheckinDay = today;
    return { send: { type, restingPulse: recentRestingPulse(inp.signals) }, state };
  }

  // Segment B — no watch data.
  if (inp.activeLast24h) return { send: null, state };
  if (state.lastBDay && dayDiff(today, state.lastBDay) < SEGMENT_B_INTERVAL_DAYS) return { send: null, state };
  const type: CheckinType = state.bVariant === 0 ? 'B1' : 'B2';
  state.bVariant = state.bVariant === 0 ? 1 : 0;
  state.lastBDay = today;
  state.lastCheckinDay = today;
  return { send: { type }, state };
}
