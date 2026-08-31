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
 * Windowed revenue.
 *
 * `revenue_type`: 'gross' | 'revenue_net_of_taxes' | 'proceeds'. `proceeds` is
 * net of taxes AND store commission — the amount actually kept. We ask
 * RevenueCat for it rather than applying a flat 30%: Apple's Small Business
 * Program is 15%, and subscriptions drop to 15% after year one, so a hardcoded
 * rate would silently misstate net.
 */
export async function revenueMetric({ startDate, endDate, revenueType = 'gross' }) {
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
 * Sum a chart's numeric series over the window.
 *
 * `values` rows are `[timestamp, ...measures]` for the time-series charts used
 * here. Only the requested measure column is summed, and non-numeric cells are
 * skipped rather than coerced — a null in a partial day must not read as 0
 * revenue when it means "not reported yet".
 */
export function sumSeries(chart, columnIndex = 1) {
  const rows = Array.isArray(chart?.values) ? chart.values : [];
  let total = 0;
  let counted = 0;
  for (const row of rows) {
    if (!Array.isArray(row)) continue;
    const v = row[columnIndex];
    if (typeof v === 'number' && Number.isFinite(v)) {
      total += v;
      counted += 1;
    }
  }
  return { total, points: counted };
}

/** The last non-null value of a series — for "as of the end of the window". */
export function lastValue(chart, columnIndex = 1) {
  const rows = Array.isArray(chart?.values) ? chart.values : [];
  for (let i = rows.length - 1; i >= 0; i--) {
    const v = Array.isArray(rows[i]) ? rows[i][columnIndex] : undefined;
    if (typeof v === 'number' && Number.isFinite(v)) return v;
  }
  return null;
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
