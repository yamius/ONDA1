/**
 * Tenjin Reporting Metrics API — paid attribution by channel.
 *
 * Verified against the official OpenAPI spec (api-docs.tenjin.com,
 * "Reporting Metrics API 2.0.1") on 2026-09-01, after a first implementation
 * that had every one of these details wrong:
 *
 *   Base URL   https://api.tenjin.com/v2        (NOT reporting.tenjin.com — no
 *                                                such host exists, which is why
 *                                                it failed at the DNS layer)
 *   Path       GET /reports/spend
 *   Auth       Authorization: Bearer <access token>   (NOT an api_key query param)
 *   Required   start_date, end_date (YYYY-MM-DD)
 *   group_by   enum: app | channel | country | site | campaign | creative | ...
 *   metrics    comma-separated; spend/installs/clicks/impressions/cpi are valid
 *   Rate limit 100 requests/minute per token, 429 above it
 *
 * Tenjin is the source of truth for "which channel actually delivered an
 * install", against which ad-console numbers get checked: the Google console
 * has shown 90 modelled installs where Tenjin saw 1 real one.
 */

import { getJson } from '../http.js';

const BASE = 'https://api.tenjin.com/v2';

export function tenjinMissing() {
  return process.env.TENJIN_API_KEY ? [] : ['TENJIN_API_KEY'];
}

/**
 * Spend/installs for a window.
 *
 * `granularity: 'totals-daily'` collapses the window into one row per group
 * instead of one row per day — the spec notes such rows carry no `date`. That
 * is what we want: these tools report a window, not a time series.
 */
export async function tenjinSpendReport({ startDate, endDate, groupBy = 'channel', perPage = 1000 }) {
  const qs = new URLSearchParams({
    start_date: startDate,
    end_date: endDate,
    granularity: 'totals-daily',
    group_by: groupBy,
    metrics: 'spend,installs,clicks,impressions,cpi',
    per_page: String(perPage),
  });
  return getJson(`${BASE}/reports/spend?${qs}`, {
    headers: {
      Authorization: `Bearer ${process.env.TENJIN_API_KEY}`,
      Accept: 'application/json',
    },
    source: 'tenjin',
  });
}

/**
 * Flatten `data[].attributes` into channel totals.
 *
 * Shape per the spec: { data: [ { type: 'report', attributes: { name,
 * short_id, ad_network_id, ...requested metrics } } ], links, meta }.
 * Still read defensively — a renamed metric should yield 0, not a crash — but
 * the field names above are from the published schema, not guesswork.
 */
export function summariseByChannel(payload) {
  const rows = Array.isArray(payload?.data) ? payload.data : [];
  const byChannel = {};
  for (const row of rows) {
    const a = row?.attributes ?? {};
    const channel = String(a.name ?? a.short_id ?? 'unknown');
    const entry = (byChannel[channel] ??= { channel, installs: 0, spend: 0, clicks: 0, impressions: 0 });
    entry.installs += Number(a.installs ?? 0);
    entry.spend += Number(a.spend ?? 0);
    entry.clicks += Number(a.clicks ?? 0);
    entry.impressions += Number(a.impressions ?? 0);
  }
  for (const e of Object.values(byChannel)) {
    e.spend = Math.round(e.spend * 100) / 100;
    // Recomputed rather than trusting the API's cpi: after summing rows it must
    // match the totals shown here, or the two numbers contradict each other.
    e.cpi = e.installs > 0 ? Math.round((e.spend / e.installs) * 100) / 100 : null;
  }
  return Object.values(byChannel).sort((a, b) => b.installs - a.installs);
}

export async function tenjinProbe() {
  const end = new Date().toISOString().slice(0, 10);
  const start = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const data = await tenjinSpendReport({ startDate: start, endDate: end });
  return { ok: true, rows_seen: Array.isArray(data?.data) ? data.data.length : 0 };
}
