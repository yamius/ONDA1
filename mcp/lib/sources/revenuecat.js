/**
 * RevenueCat REST API v2 — subscriptions, trials and revenue.
 *
 * Verified against the published OpenAPI (Developer API 2.0.0,
 * openapi-v2-charts-and-metrics.yaml) on 2026-09-01. Reading the spec first is
 * now policy here: the Tenjin client was written from memory, aimed at a host
 * that did not exist, and cost a debugging round.
 *
 *   Base   https://api.revenuecat.com/v2
 *   Auth   Authorization: Bearer <secret API key from the RevenueCat dashboard>
 *          (NOT the App Store Connect key named "RevenueCat" — that one is how
 *          RevenueCat reads Apple, the opposite direction.)
 *   Limit  25 requests/minute on the Charts & Metrics domain, 429 above it.
 *   Perms  the key needs charts_metrics:*:read.
 *
 * Endpoints used:
 *   GET /projects/{id}/metrics/overview          fixed-window snapshot
 *   GET /projects/{id}/metrics/revenue           honours [start_date, end_date]
 *   GET /projects/{id}/charts/{chart}            time series / aggregates
 *   GET /projects/{id}/charts/{chart}/options    which segments a chart allows
 */

import { getJson } from '../http.js';

const BASE = 'https://api.revenuecat.com/v2';

export function revenueCatMissing() {
  const missing = [];
  if (!process.env.REVENUECAT_API_KEY) missing.push('REVENUECAT_API_KEY');
  if (!process.env.REVENUECAT_PROJECT_ID) missing.push('REVENUECAT_PROJECT_ID');
  return missing;
}

function headers() {
  return {
    Authorization: `Bearer ${process.env.REVENUECAT_API_KEY}`,
    Accept: 'application/json',
  };
}

function projectPath() {
  return `${BASE}/projects/${encodeURIComponent(process.env.REVENUECAT_PROJECT_ID)}`;
}

/** Fixed-window snapshot: active subs, active trials, MRR, 28-day revenue. */
export async function overviewMetrics() {
  return getJson(`${projectPath()}/metrics/overview?currency=USD`, { headers: headers(), source: 'revenuecat' });
}

/**
 * Allowed `revenue_type` values, verbatim from the spec enum.
 *
 * Note the trap: the prose describes the first one as "gross revenue", but the
 * ENUM VALUE is `revenue`. Sending the literal word `gross` is a 400 — which is
 * exactly what shipped, because the description was read as if it were the
 * value. Hence the local guard below: an invalid type now fails here, with the
 * valid set in the message, instead of as a remote 400.
 */
export const REVENUE_TYPES = ['revenue', 'revenue_net_of_taxes', 'proceeds'];

/**
 * Windowed revenue.
 *
 * `revenue` = gross. `proceeds` = net of taxes AND store commission, the amount
 * actually kept. We ask RevenueCat for proceeds rather than applying a flat
 * 30%: Apple's Small Business Program is 15%, and subscriptions drop to 15%
 * after year one, so a hardcoded rate would silently misstate net.
 */
export async function revenueMetric({ startDate, endDate, revenueType = 'revenue' }) {
  if (!REVENUE_TYPES.includes(revenueType)) {
    throw new Error(`invalid revenue_type '${revenueType}'; allowed: ${REVENUE_TYPES.join(', ')}`);
  }
  const qs = new URLSearchParams({
    start_date: startDate,
    end_date: endDate,
    revenue_type: revenueType,
    currency: 'USD',
  });
  return getJson(`${projectPath()}/metrics/revenue?${qs}`, { headers: headers(), source: 'revenuecat' });
}

export async function chartData(chartName, { startDate, endDate, resolution, segment } = {}) {
  const qs = new URLSearchParams({ start_date: startDate, end_date: endDate, currency: 'USD' });
  if (resolution) qs.set('resolution', resolution);
  if (segment) qs.set('segment', segment);
  return getJson(`${projectPath()}/charts/${encodeURIComponent(chartName)}?${qs}`, {
    headers: headers(),
    source: 'revenuecat',
  });
}

export async function chartOptions(chartName) {
  return getJson(`${projectPath()}/charts/${encodeURIComponent(chartName)}/options`, {
    headers: headers(),
    source: 'revenuecat',
  });
}

/**
 * The numeric cells of one measure of a chart, in time order.
 *
 * Two row shapes exist. The Charts API v2 actually returns `values` as OBJECTS:
 *   { cohort: <unix ts>, measure: <0-based measure index>, value: <n>, incomplete: bool }
 * (one object per period per measure, measures described in `chart.measures`).
 * The tuple form `[timestamp, ...measures]` is kept for compatibility. Reading
 * only tuples silently skipped every object row, so trials_new summed to 0 and
 * the rate charts read null (bug fixed 2026-10-24).
 *
 * `columnIndex` keeps the tuple convention: 1 = first measure (measure 0).
 * Non-numeric cells are skipped rather than coerced - a null means "not
 * reported yet", not 0.
 */
function measureCells(chart, columnIndex = 1) {
  const rows = Array.isArray(chart?.values) ? chart.values : [];
  const measure = columnIndex - 1;
  const out = [];
  for (const row of rows) {
    let v;
    if (Array.isArray(row)) {
      v = row[columnIndex];
    } else if (row && typeof row === 'object') {
      const m = row.measure ?? 0;
      if (Number(m) !== measure) continue;
      v = row.value;
    }
    if (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))) v = Number(v);
    if (typeof v === 'number' && Number.isFinite(v)) out.push({ v, t: Array.isArray(row) ? row[0] : row.cohort });
  }
  if (rows.length && !Array.isArray(rows[0])) out.sort((a, b) => (Number(a.t) || 0) - (Number(b.t) || 0));
  return out.map((c) => c.v);
}

/**
 * Index (tuple convention, 1-based) of the first measure whose name matches,
 * or `fallback` when the chart lists no measures / none match.
 */
export function measureColumn(chart, pattern, fallback = 1) {
  const list = Array.isArray(chart?.measures) ? chart.measures : [];
  const i = list.findIndex((m) => pattern.test(String(m?.display_name ?? m?.name ?? m?.id ?? '')));
  return i >= 0 ? i + 1 : fallback;
}

/**
 * RevenueCat's own window aggregate for a measure, from `chart.summary`:
 *   summary = { total: { "<measure display name>": n }, average: { ... } }
 * (live shape, 2026-10-24). Rates are in PERCENT (unit "%"). Returns null when
 * the chart has no such aggregate - e.g. churn has `average` only.
 */
export function summaryValue(chart, kind, measureName) {
  const v = chart?.summary?.[kind]?.[measureName];
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

/** Sum one measure of a chart over the window. */
export function sumSeries(chart, columnIndex = 1) {
  const cells = measureCells(chart, columnIndex);
  return { total: cells.reduce((a, b) => a + b, 0), points: cells.length };
}

/** The last non-null value of a series - for "as of the end of the window". */
export function lastValue(chart, columnIndex = 1) {
  const cells = measureCells(chart, columnIndex);
  return cells.length ? cells[cells.length - 1] : null;
}

/**
 * Find a usable segment id for a chart without guessing.
 *
 * The spec is explicit that segments vary per chart and that an unsupported one
 * returns 400. So we ask the chart what it supports and match against
 * candidates; if none match we report what IS available rather than inventing
 * a breakdown.
 */
export function findSegment(options, candidates) {
  const list = options?.segments ?? options?.available_segments ?? options?.data?.segments ?? [];
  const flat = (Array.isArray(list) ? list : []).map((s) =>
    typeof s === 'string' ? { id: s, name: s } : { id: s?.id ?? s?.value ?? s?.key, name: s?.display_name ?? s?.name ?? s?.id },
  ).filter((s) => s.id);
  const hit = flat.find((s) => candidates.some((c) => String(s.id).toLowerCase().includes(c) || String(s.name ?? '').toLowerCase().includes(c)));
  return { match: hit ?? null, available: flat.map((s) => s.id) };
}

export async function revenueCatProbe() {
  const data = await overviewMetrics();
  const n = Array.isArray(data?.metrics) ? data.metrics.length : 0;
  return { ok: true, overview_metrics_seen: n };
}
