/**
 * Baseline data model — ported from the landing tool (`landing/src/lib/baseline.ts`): the SAME
 * mechanic (three signals, per-signal avg/min/max + honest day coverage), re-sourced. In the app the
 * numbers come from HealthKit (the 14-day `queryBaseline` read) or the camera session, NOT a Shortcut
 * URL fragment — so the fragment parser is dropped and replaced by two builders below.
 *
 * PURE + framework-free (unit-testable without React).
 *
 * FIREWALL (app_baseline_spec §7): this module names, formats and orders numbers. It never judges
 * them — no thresholds, no "normal", no comparisons. Those words are not here and must not arrive.
 */
import type { BaselineResult, BaselineSignalStat } from '../plugins/healthKitHeartRate';

/** The three signals. Temperature is deliberately absent (spec §2). Labels are metadata (the card
 *  uses its own captions), so they stay English and are never rendered directly. */
export const BASELINE_SIGNALS = [
  { key: 'rhr', label: 'Resting heart rate', unit: 'bpm', decimals: 0 },
  { key: 'hrv', label: 'Heart rate variability', unit: 'ms', decimals: 0 },
  { key: 'rr', label: 'Respiratory rate', unit: 'breaths/min', decimals: 1 },
] as const;

export type BaselineSignalKey = (typeof BASELINE_SIGNALS)[number]['key'];

/** The window `queryBaseline` collects. Shown as "n of 14", never a target to hit. */
export const BASELINE_WINDOW_DAYS = 14;

/** Where the numbers came from — drives the coverage wording ("nights" vs "reading") and honesty. */
export type BaselineSource = 'watch' | 'camera';

export interface BaselineReading {
  key: BaselineSignalKey;
  label: string;
  unit: string;
  decimals: number;
  /** null when nothing usable arrived for this signal — rendered as "no data", never hidden. */
  avg: number | null;
  min: number | null;
  max: number | null;
  /** Days (watch) / readings (camera) that actually carried data. 0 = not recorded on this device. */
  days: number;
}

/** PURE: display form. Trailing zeros dropped, so 62.0 → "62" and 14.5 stays "14.5". */
export function formatValue(value: number | null, decimals: number): string {
  if (value == null) return '';
  const fixed = value.toFixed(decimals);
  return fixed.includes('.') ? fixed.replace(/\.?0+$/, '') : fixed;
}

/**
 * PURE: where the average sits inside the person's OWN low-to-high span, 0..1. Their own span, never
 * a population one. A flat span (one reading, or identical values) puts the marker in the middle
 * rather than dividing by zero.
 */
export function spanPosition(r: BaselineReading): number {
  if (r.avg == null || r.min == null || r.max == null) return 0.5;
  const span = r.max - r.min;
  if (span <= 0) return 0.5;
  return Math.min(Math.max((r.avg - r.min) / span, 0), 1);
}

const def = (key: BaselineSignalKey) => BASELINE_SIGNALS.find((s) => s.key === key)!;

/** PURE: one native stat → a reading. min/max default to avg when absent; days floored to 1 when a
 *  value exists (an average IS at least one day of data). */
function readingFromStat(key: BaselineSignalKey, stat: BaselineSignalStat | undefined): BaselineReading {
  const s = def(key);
  const avg = stat?.avg ?? null;
  const has = avg != null;
  return {
    key,
    label: s.label,
    unit: s.unit,
    decimals: s.decimals,
    avg: has ? avg : null,
    min: has ? (stat?.min ?? avg) : null,
    max: has ? (stat?.max ?? avg) : null,
    days: has ? Math.max(stat?.days ?? 1, 1) : 0,
  };
}

/** PURE: the empty reading for a signal a source doesn't carry (rendered "NO DATA", not hidden). */
function emptyReading(key: BaselineSignalKey): BaselineReading {
  const s = def(key);
  return { key, label: s.label, unit: s.unit, decimals: s.decimals, avg: null, min: null, max: null, days: 0 };
}

/** PURE: the 14-day HealthKit read → all three readings, fixed order (watch source). */
export function buildReadingsFromNative(res: BaselineResult): BaselineReading[] {
  return [readingFromStat('rhr', res.rhr), readingFromStat('hrv', res.hrv), readingFromStat('rr', res.rr)];
}

/** Camera over one practice session: pulse avg/min/max + a breathing estimate. */
export interface CameraPulseSession {
  avg: number | null;
  min: number | null;
  max: number | null;
  /** Breaths/min (a single RSA-derived estimate — no range). Makes the camera card feel alive. */
  breathing?: number | null;
}

/**
 * PURE: the camera session → readings. Pulse (avg/min/max of the session) + breathing (a single
 * estimate, so min = max = avg → the card shows the value with no range). HRV comes back empty
 * ("NO DATA") — the camera cannot give it honestly; it unlocks with a watch. `days: 1` = one reading
 * (coverage wording is source-aware).
 */
export function buildReadingsFromCamera(session: CameraPulseSession): BaselineReading[] {
  const rs = def('rhr');
  const avg = session.avg ?? null;
  const has = avg != null;
  const rhr: BaselineReading = {
    key: 'rhr',
    label: rs.label,
    unit: rs.unit,
    decimals: rs.decimals,
    avg: has ? avg : null,
    min: has ? (session.min ?? avg) : null,
    max: has ? (session.max ?? avg) : null,
    days: has ? 1 : 0,
  };
  const bs = def('rr');
  const br = session.breathing ?? null;
  const rr: BaselineReading = br != null
    ? { key: 'rr', label: bs.label, unit: bs.unit, decimals: bs.decimals, avg: br, min: br, max: br, days: 1 }
    : emptyReading('rr');
  return [rhr, emptyReading('hrv'), rr];
}

/** PURE: did anything at all arrive? Distinguishes "opened cold" from "no data". */
export function hasAnyReading(readings: BaselineReading[]): boolean {
  return readings.some((r) => r.avg != null);
}
