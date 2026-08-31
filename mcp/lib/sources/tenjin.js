/**
 * Tenjin Reporting API — paid attribution by network/campaign.
 *
 * Tenjin is the source of truth for "which channel actually delivered an
 * install", against which ad-console numbers are checked: the Google console
 * has shown 90 modelled installs where Tenjin saw 1 real one. Anything derived
 * from SKAN modelling is flagged `modeled: true` rather than presented as fact.
 */

import { sourceError } from '../shared.js';

const API = 'https://reporting.tenjin.com/api/v2/reports';

export function tenjinMissing() {
  return process.env.TENJIN_API_KEY ? [] : ['TENJIN_API_KEY'];
}

export async function tenjinReport({ startDate, endDate, groupBy = ['campaign_name', 'ad_network'] }) {
  const qs = new URLSearchParams({
    api_key: process.env.TENJIN_API_KEY,
    start_date: startDate,
    end_date: endDate,
    group_by: groupBy.join(','),
    // Only aggregate columns — nothing user-level is requested, by design.
    metrics: 'installs,cost,clicks,impressions',
    personal_data: 'false',
  });
  const res = await fetch(`${API}?${qs}`, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Tenjin ${res.status}`);
  return res.json();
}

/**
 * Normalise Tenjin rows into channel totals. Tenjin's own field naming varies
 * by account configuration, so each row is read defensively rather than
 * assuming one shape — a renamed column should yield 0, not a crash.
 */
export function summariseByChannel(payload) {
  const rows = payload?.data ?? payload?.reports ?? [];
  const byChannel = {};
  for (const r of Array.isArray(rows) ? rows : []) {
    const channel = String(r.ad_network ?? r.network ?? r.campaign_name ?? 'unknown').toLowerCase();
    const installs = Number(r.installs ?? r.conversions ?? 0);
    const cost = Number(r.cost ?? r.spend ?? 0);
    const entry = (byChannel[channel] ??= { channel, installs: 0, spend: 0 });
    entry.installs += installs;
    entry.spend += cost;
  }
  for (const e of Object.values(byChannel)) {
    e.spend = Math.round(e.spend * 100) / 100;
    e.cpi = e.installs > 0 ? Math.round((e.spend / e.installs) * 100) / 100 : null;
  }
  return Object.values(byChannel).sort((a, b) => b.installs - a.installs);
}

export async function tenjinProbe() {
  try {
    const end = new Date().toISOString().slice(0, 10);
    const start = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
    const data = await tenjinReport({ startDate: start, endDate: end });
    const rows = data?.data ?? data?.reports ?? [];
    return { ok: true, rows_seen: Array.isArray(rows) ? rows.length : 0 };
  } catch (err) {
    return sourceError('tenjin', err);
  }
}
