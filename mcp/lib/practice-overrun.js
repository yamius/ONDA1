/**
 * Practice overrun (task 102). The app has no auto-finish by design: a practice
 * left running keeps counting, so results_view.time_percent can be 300, 1000…
 * For ANALYSIS only, any time_percent > 200 is "overrun": flagged per row and
 * excluded from averages (both averages are reported, clearly labeled).
 */
export const OVERRUN_THRESHOLD = 200;
export const OVERRUN_BUCKET = 'overrun (>200%)';
export const OVERRUN_NOTE =
  'time_percent > 200 = practice left running (no auto-finish, by design); excluded from averages';

/** Dimensions that carry a practice time share / duration. */
export function isPracticeTimeDimension(name) {
  const bare = String(name ?? '').replace(/^custom(Event|User):/, '').trim().toLowerCase();
  return bare === 'time_percent';
}

/** 103: strict numeric parse — '', '(empty)', '(not set)' are NOT 0. */
export function toNumericValue(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const s = String(value ?? '').trim();
  if (!/^-?\d+(\.\d+)?([eE][-+]?\d+)?$/.test(s)) return null;
  return Number(s);
}

export function isOverrun(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > OVERRUN_THRESHOLD;
}

/**
 * rows: [{ value, users, events }] where value is the time_percent.
 * Returns the overrun bucket and event-weighted averages with/without overrun.
 */
export function summarizeTimePercent(rows) {
  let wAll = 0, nAll = 0, wClean = 0, nClean = 0;
  const overrun = { bucket: OVERRUN_BUCKET, values: 0, users: 0, events: 0 };
  let nonNumericEvents = 0;
  for (const r of rows) {
    const v = toNumericValue(r.value);
    if (v === null) { nonNumericEvents += Number(r.events) || 0; continue; }
    const w = Number(r.events) || 0;
    wAll += v * w; nAll += w;
    if (v > OVERRUN_THRESHOLD) {
      overrun.values += 1; overrun.users += r.users || 0; overrun.events += w;
    } else {
      wClean += v * w; nClean += w;
    }
  }
  const avg = (s, n) => (n > 0 ? Math.round((s / n) * 10) / 10 : null);
  return {
    threshold: OVERRUN_THRESHOLD,
    overrun,
    avg_time_percent_excl_overrun: avg(wClean, nClean),
    avg_time_percent_incl_overrun: avg(wAll, nAll),
    events_numeric: nAll,
    events_non_numeric: nonNumericEvents,
    ...(nAll === 0 && { summary: 'нет данных (no numeric values)' }),
    weighting: 'event-weighted (one results_view = one practice)',
    note: OVERRUN_NOTE,
  };
}
