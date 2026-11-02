/**
 * Task 101: paywall_source attribution + trial_outcome. No health data here —
 * only paywall names, plan, day counts and practice counts.
 *
 * Storage: Capacitor Preferences (native UserDefaults, survives WebView purges)
 * mirrored to localStorage — same pattern as analyticsMarkers.ts.
 *
 * paywall_source: written on every paywall_view. KEPT after a purchase (not
 * cleared): trial_start fires at the purchase moment, but `purchase` for a trial
 * fires days later on the trial→paid flip, and must still name the paywall that
 * started that trial. The next paywall_view simply overwrites it.
 */
import { Preferences } from '@capacitor/preferences';

const PAYWALL_SOURCE_KEY = 'onda_last_paywall_source'; // same key the 1.9.6 modal stash used
const TRIAL_MARKER_KEY = 'onda_trial_marker_v1';
const TRIAL_SENT_KEY = 'onda_trial_outcome_sent'; // claim: '<startedAt>' of the last trial reported
const WATCH_EVER_KEY = 'onda_watch_connected_ever'; // 095 claimFirstWatchConnect marker

const DAY_MS = 86_400_000;

async function read(key: string): Promise<string | null> {
  try { const { value } = await Preferences.get({ key }); if (value != null) return value; } catch { /* noop */ }
  try { return localStorage.getItem(key); } catch { return null; }
}
async function write(key: string, value: string): Promise<void> {
  try { localStorage.setItem(key, value); } catch { /* noop */ }
  try { await Preferences.set({ key, value }); } catch { /* noop */ }
}
async function remove(key: string): Promise<void> {
  try { localStorage.removeItem(key); } catch { /* noop */ }
  try { await Preferences.remove({ key }); } catch { /* noop */ }
}

// One promise chain for every trial-marker mutation → no double send.
let chain: Promise<unknown> = Promise.resolve();
function serialized<T>(fn: () => Promise<T>): Promise<T> {
  const next = chain.then(fn, fn);
  chain = next.catch(() => undefined);
  return next;
}

// ── paywall_source ──────────────────────────────────────────────────────────
export async function recordPaywallSource(source: string | null | undefined): Promise<void> {
  if (!source) return;
  await write(PAYWALL_SOURCE_KEY, source);
}
export async function readPaywallSource(): Promise<string> {
  return (await read(PAYWALL_SOURCE_KEY)) || 'unknown';
}

// ── trial marker ────────────────────────────────────────────────────────────
export interface TrialMarker {
  startedAt: number;       // ms
  productId: string;
  plan: string;            // monthly | yearly
  trialDays: number;
  expectedEndAt: number;   // startedAt + trialDays
  practicesAtStart: number; // practiceHistory length at start (fallback counter)
  dayKeys: string[];       // distinct local days with an app open during the trial
}

export const localDayKey = (ms: number): string => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/** Trial length: product intro offer (price 0) if known, else by plan (7 monthly / 14 yearly). */
export function trialDaysFor(plan: string, introPrice?: { price?: number; periodNumberOfUnits?: number; periodUnit?: string } | null): number {
  if (introPrice && introPrice.price === 0 && introPrice.periodNumberOfUnits) {
    const n = introPrice.periodNumberOfUnits;
    switch (introPrice.periodUnit) {
      case 'DAY': return n;
      case 'WEEK': return n * 7;
      case 'MONTH': return n * 30;
      case 'YEAR': return n * 365;
    }
  }
  return plan === 'yearly' || plan === 'annual' ? 14 : 7;
}

export async function startTrialMarker(args: {
  productId: string; plan: string; trialDays: number; practicesAtStart: number; now?: number;
}): Promise<void> {
  const now = args.now ?? Date.now();
  const m: TrialMarker = {
    startedAt: now,
    productId: args.productId,
    plan: args.plan,
    trialDays: args.trialDays,
    expectedEndAt: now + args.trialDays * DAY_MS,
    practicesAtStart: args.practicesAtStart,
    dayKeys: [localDayKey(now)],
  };
  await serialized(() => write(TRIAL_MARKER_KEY, JSON.stringify(m)));
}

export async function readTrialMarker(): Promise<TrialMarker | null> {
  const raw = await read(TRIAL_MARKER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as TrialMarker; } catch { return null; }
}

/** App open while a trial is running → remember the local day (only days before the trial end). */
export function noteTrialAppOpen(now: number = Date.now()): Promise<void> {
  return serialized(async () => {
    const m = await readTrialMarker();
    if (!m || now > m.expectedEndAt) return;
    const k = localDayKey(now);
    if (m.dayKeys.includes(k)) return;
    m.dayKeys = [...m.dayKeys, k].slice(-60);
    await write(TRIAL_MARKER_KEY, JSON.stringify(m));
  });
}

// ── evaluation (pure) ───────────────────────────────────────────────────────
export type TrialOutcome = 'converted' | 'expired' | 'pending';

/** Minimal view of RevenueCat EntitlementInfo (entitlements.all[ID]). */
export interface EntLike {
  isActive?: boolean;
  periodType?: string | null;
  expirationDateMillis?: number | null;
  expirationDate?: string | null;
}

/**
 * - entitlement on NORMAL (active, or since lapsed after a paid period) → converted
 * - entitlement still TRIAL/INTRO and active (incl. cancelled-but-in-trial) → pending
 * - entitlement inactive/missing after the trial end → expired
 * - anything before the trial end without a NORMAL flip → pending
 */
export function evaluateTrial(marker: TrialMarker, ent: EntLike | null | undefined, now: number): TrialOutcome {
  if (ent && ent.periodType === 'NORMAL') return 'converted';
  if (ent && ent.isActive) return 'pending';
  const exp = ent?.expirationDateMillis ?? (ent?.expirationDate ? Date.parse(ent.expirationDate) : NaN);
  // Inactive entitlement whose own expiry has passed, or no entitlement at all
  // after the expected trial end (customerInfo without the entitlement before
  // the end may be a transient/unsynced state → keep waiting).
  if (ent && Number.isFinite(exp) && now >= (exp as number)) return 'expired';
  if (now >= marker.expectedEndAt) return 'expired';
  return 'pending';
}

export interface PracticeLike { date?: string }
export function countPracticesBetween(history: PracticeLike[], from: number, to: number): number {
  let n = 0;
  for (const s of history) {
    const t = s?.date ? Date.parse(s.date) : NaN;
    if (Number.isFinite(t) && t >= from && t <= to) n++;
  }
  return n;
}

export interface TrialOutcomeParams extends Record<string, string> {
  outcome: 'converted' | 'expired';
  plan: string;
  trial_days: string;
  practices_in_trial: string;
  days_active_in_trial: string;
  watch_connected: 'true' | 'false';
  baseline_filled: 'true' | 'false';
}

/**
 * Evaluate the stored trial and, once it is decided, return the params to send
 * — exactly once per trial (claim on startedAt), clearing the marker.
 * Returns null while pending / no marker / already sent.
 */
export function checkTrialOutcome(args: {
  ent: EntLike | null | undefined;
  now?: number;
  practiceHistory: PracticeLike[];
  watchConnectedNow?: boolean;
}): Promise<TrialOutcomeParams | null> {
  return serialized(async () => {
    const now = args.now ?? Date.now();
    const m = await readTrialMarker();
    if (!m) return null;
    const outcome = evaluateTrial(m, args.ent, now);
    if (outcome === 'pending') return null;
    const sent = await read(TRIAL_SENT_KEY);
    if (sent === String(m.startedAt)) { await remove(TRIAL_MARKER_KEY); return null; }
    await write(TRIAL_SENT_KEY, String(m.startedAt));
    await remove(TRIAL_MARKER_KEY);
    const end = Math.min(now, m.expectedEndAt);
    const byDate = countPracticesBetween(args.practiceHistory, m.startedAt, end);
    const byCounter = Math.max(0, args.practiceHistory.length - m.practicesAtStart);
    const dated = args.practiceHistory.some((s) => s?.date);
    let baselineFilled = false;
    try { baselineFilled = localStorage.getItem('onda_baseline_filled_tracked') === '1'; } catch { /* noop */ }
    const watchEver = (await read(WATCH_EVER_KEY)) === '1' || !!args.watchConnectedNow;
    return {
      outcome,
      plan: m.plan,
      trial_days: String(m.trialDays),
      practices_in_trial: String(dated ? byDate : byCounter),
      days_active_in_trial: String(m.dayKeys.filter((k) => k <= localDayKey(end)).length),
      watch_connected: watchEver ? 'true' : 'false',
      baseline_filled: baselineFilled ? 'true' : 'false',
    };
  });
}
