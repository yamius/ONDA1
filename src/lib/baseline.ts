/**
 * Baseline data model — ported from the landing tool (`landing/src/lib/baseline.ts`), the SAME
 * mechanic and the SAME card (onda_card_v21), re-sourced: in the app the numbers come from HealthKit
 * (the 14-day `queryBaseline` read) or the camera session, NOT a Shortcut URL fragment.
 *
 * PURE + framework-free.
 *
 * FIREWALL (ONDA_baseline_card_spec §7): names, formats and orders numbers; never judges them — no
 * thresholds, no "normal", no comparisons.
 */
import type { BaselineResult, BaselineSignalStat } from '../plugins/healthKitHeartRate';

/** The three range signals. Temperature is deliberately absent. */
export const BASELINE_SIGNALS = [
  { key: 'rhr', label: 'Resting heart rate', unit: 'bpm', decimals: 0 },
  { key: 'hrv', label: 'Heart rate variability', unit: 'ms', decimals: 0 },
  { key: 'rr', label: 'Respiratory rate', unit: 'breaths/min', decimals: 1 },
] as const;
export type BaselineSignalKey = (typeof BASELINE_SIGNALS)[number]['key'];

/** Single-value figures around the figure (v21): peak, walking pulse, VO2max est., recovery. */
export const BASELINE_EXTRAS = [
  { key: 'hrpeak', label: 'peak' },
  { key: 'whr', label: 'avg pulse, walking' },
  { key: 'vo2', label: 'VO2max, est.' },
  { key: 'hrr', label: 'recovery, first minute' },
] as const;
export type BaselineExtraKey = (typeof BASELINE_EXTRAS)[number]['key'];

export const BASELINE_WINDOW_DAYS = 14;

/** Where the numbers came from — drives the coverage wording ("nights" vs "reading"). */
export type BaselineSource = 'watch' | 'camera';

export interface BaselineReading {
  key: BaselineSignalKey;
  label: string;
  unit: string;
  decimals: number;
  avg: number | null;
  min: number | null;
  max: number | null;
  /** Days (watch) / readings (camera) that carried data. 0 = not recorded on this device. */
  days: number;
}

export type BaselineExtras = Partial<Record<BaselineExtraKey, number>>;

/** Readings + extras together, the shape the card consumes. */
export interface BaselineData {
  readings: BaselineReading[];
  extras: BaselineExtras;
}

/** PURE: display form. Trailing zeros dropped, so 62.0 → "62" and 14.5 stays "14.5". */
export function formatValue(value: number | null, decimals: number): string {
  if (value == null) return '';
  const fixed = value.toFixed(decimals);
  return fixed.includes('.') ? fixed.replace(/\.?0+$/, '') : fixed;
}

/** PURE: where the average sits inside the person's OWN low-to-high span, 0..1. Flat span → middle. */
export function spanPosition(r: BaselineReading): number {
  if (r.avg == null || r.min == null || r.max == null) return 0.5;
  const span = r.max - r.min;
  if (span <= 0) return 0.5;
  return Math.min(Math.max((r.avg - r.min) / span, 0), 1);
}

const def = (key: BaselineSignalKey) => BASELINE_SIGNALS.find((s) => s.key === key)!;

function readingFromStat(key: BaselineSignalKey, stat: BaselineSignalStat | undefined): BaselineReading {
  const s = def(key);
  const avg = stat?.avg ?? null;
  const has = avg != null;
  return {
    key, label: s.label, unit: s.unit, decimals: s.decimals,
    avg: has ? avg : null,
    min: has ? (stat?.min ?? avg) : null,
    max: has ? (stat?.max ?? avg) : null,
    days: has ? Math.max(stat?.days ?? 1, 1) : 0,
  };
}

function emptyReading(key: BaselineSignalKey): BaselineReading {
  const s = def(key);
  return { key, label: s.label, unit: s.unit, decimals: s.decimals, avg: null, min: null, max: null, days: 0 };
}

/** PURE: keep only the extras Health actually returned (drop nullish) — never fabricate a slot. */
function extrasFromNative(raw: BaselineResult['extras']): BaselineExtras {
  const out: BaselineExtras = {};
  if (!raw) return out;
  for (const { key } of BASELINE_EXTRAS) {
    const v = raw[key];
    if (v != null && Number.isFinite(v)) out[key] = v;
  }
  return out;
}

/**
 * PURE: the 14-day HealthKit read → all three readings + the single-value extras
 * (peak / walking / VO2max / recovery) the watch returned. `override` wins for tests.
 */
export function buildFromNative(res: BaselineResult, override?: BaselineExtras): BaselineData {
  return {
    readings: [readingFromStat('rhr', res.rhr), readingFromStat('hrv', res.hrv), readingFromStat('rr', res.rr)],
    extras: override ?? extrasFromNative(res.extras),
  };
}

/** Camera over one practice session: pulse avg/min/max + a breathing estimate. */
export interface CameraPulseSession {
  avg: number | null;
  min: number | null;
  max: number | null;
  /** Breaths/min (a single RSA-derived estimate — no range). */
  breathing?: number | null;
}

/**
 * PURE: the camera session → data. Pulse (avg/min/max of the session) + breathing (a single value,
 * min = max = avg → no range shown). HRV is empty ("NO DATA") — the camera cannot give it honestly;
 * it unlocks with a watch. No extras. `days: 1` = one reading (coverage wording is source-aware).
 */
export function buildFromCamera(session: CameraPulseSession): BaselineData {
  const rs = def('rhr');
  const avg = session.avg ?? null;
  const has = avg != null;
  const rhr: BaselineReading = {
    key: 'rhr', label: rs.label, unit: rs.unit, decimals: rs.decimals,
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
  return { readings: [rhr, emptyReading('hrv'), rr], extras: {} };
}

/** PURE: did anything at all arrive? */
export function hasAnyReading(readings: BaselineReading[]): boolean {
  return readings.some((r) => r.avg != null);
}
