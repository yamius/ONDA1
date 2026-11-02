/**
 * Task 101: purchase reconciliation — GA4 `purchase` vs RevenueCat new paid
 * subscriptions (initial purchases + trial conversions), per day and per version.
 *
 * Why: `purchase` fires in the app only on a not-paid → paid transition SEEN BY
 * THE APP. A trial that converts while the app is closed is reported on the
 * next open (another day, or never if the user doesn't come back), and a
 * cold-start/killed-app purchase can be lost entirely. RevenueCat sees all of
 * them server-side, so RevenueCat − GA4 = what the app missed / shifted.
 *
 * Pure helpers here (unit-tested); the queries live in tools/revenue_review.js.
 */
import { runReport, andFilters, eventNameFilter } from './sources/ga4.js';

/** RevenueCat chart cohort (unix seconds or ms) → UTC yyyy-mm-dd. */
export function cohortDay(t) {
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return new Date(n < 1e12 ? n * 1000 : n).toISOString().slice(0, 10);
}

/** Per-day values of one measure (0-based index) of a Charts v2 chart. */
export function chartDaily(chart, measureIndex = 0) {
  const out = {};
  for (const row of Array.isArray(chart?.values) ? chart.values : []) {
    let t; let v;
    if (Array.isArray(row)) { t = row[0]; v = row[measureIndex + 1]; }
    else if (row && typeof row === 'object') {
      if (Number(row.measure ?? 0) !== measureIndex) continue;
      t = row.cohort; v = row.value;
    }
    const day = cohortDay(t);
    const num = Number(v);
    if (!day || v == null || !Number.isFinite(num)) continue;
    out[day] = (out[day] ?? 0) + num;
  }
  return out;
}

/** 0-based index of the first measure whose display name matches, else fallback. */
export function measureIndex(chart, re, fallback = 0) {
  const list = Array.isArray(chart?.measures) ? chart.measures : [];
  const i = list.findIndex((m) => re.test(String(m?.display_name ?? m?.name ?? m?.id ?? m ?? '')));
  return i >= 0 ? i : fallback;
}

/** GA4 yyyymmdd → yyyy-mm-dd. */
export const ga4Day = (d) => `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;

/** GA4 purchase users/events by day × appVersion (internal filter applied by caller). */
export async function ga4PurchaseByDayVersion(win, baseFilter) {
  const data = await runReport({
    dateRanges: [{ startDate: win.start_date, endDate: win.end_date }],
    dimensions: [{ name: 'date' }, { name: 'appVersion' }],
    metrics: [{ name: 'totalUsers' }, { name: 'eventCount' }],
    dimensionFilter: andFilters(baseFilter, eventNameFilter(['purchase'])),
    limit: 10000,
  });
  return (data?.rows ?? []).map((r) => ({
    day: ga4Day(r.dimensionValues[0].value),
    app_version: r.dimensionValues[1].value,
    users: Number(r.metricValues[0].value || 0),
    events: Number(r.metricValues[1].value || 0),
  }));
}

/**
 * Join GA4 rows with RevenueCat daily new-paid counts.
 * gap = revenuecat_new_paid − ga4_purchase_events (positive = GA4 missed some).
 */
export function reconcileRows(ga4Rows, rcNewPaid, rcConversions = {}) {
  const days = new Set([...Object.keys(rcNewPaid), ...ga4Rows.map((r) => r.day)]);
  const by_day = [...days].sort().map((day) => {
    const g = ga4Rows.filter((r) => r.day === day);
    const ga4_events = g.reduce((a, r) => a + r.events, 0);
    const ga4_users = g.reduce((a, r) => a + r.users, 0);
    const rc = rcNewPaid[day] ?? 0;
    return {
      day,
      revenuecat_new_paid: rc,
      revenuecat_trial_conversions: rcConversions[day] ?? 0,
      ga4_purchase_events: ga4_events,
      ga4_purchase_users: ga4_users,
      gap: rc - ga4_events,
      ga4_by_version: Object.fromEntries(g.map((r) => [r.app_version, r.events])),
    };
  });
  const versions = {};
  for (const r of ga4Rows) {
    const v = (versions[r.app_version] ??= { app_version: r.app_version, ga4_purchase_events: 0, ga4_purchase_users: 0, days: 0 });
    v.ga4_purchase_events += r.events; v.ga4_purchase_users += r.users; v.days += 1;
  }
  const rcTotal = Object.values(rcNewPaid).reduce((a, b) => a + b, 0);
  const ga4Total = ga4Rows.reduce((a, r) => a + r.events, 0);
  return {
    totals: {
      revenuecat_new_paid: rcTotal,
      revenuecat_trial_conversions: Object.values(rcConversions).reduce((a, b) => a + b, 0),
      ga4_purchase_events: ga4Total,
      gap: rcTotal - ga4Total,
      ga4_capture_pct: rcTotal > 0 ? Math.round((ga4Total / rcTotal) * 1000) / 10 : null,
    },
    by_day,
    by_version: Object.values(versions).sort((a, b) => a.app_version.localeCompare(b.app_version, undefined, { numeric: true })),
  };
}
