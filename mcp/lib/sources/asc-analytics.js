/**
 * App Store Connect ANALYTICS reports — how people find the app in the store.
 *
 * A different API family from the Sales Reports in asc.js, with a different
 * rhythm: asynchronous, request-then-accumulate.
 *
 *   POST /v1/analyticsReportRequests            (a WRITE — see scripts/, not here)
 *   GET  /v1/analyticsReportRequests?filter[app]=
 *   GET  /v1/analyticsReportRequests/{id}/reports
 *   GET  /v1/analyticsReports/{id}/instances
 *   GET  /v1/analyticsReportInstances/{id}/segments   -> gzipped TSV at .url
 *
 * Verified against Apple's Analytics Reports documentation on 2026-09-01.
 *
 * TWO PROPERTIES OF THIS DATA THAT CHANGE HOW IT MUST BE REPORTED:
 *
 *  1. Apple applies privacy thresholding — rows covering fewer than 5 users or
 *     devices are OMITTED ENTIRELY, and statistical noise is added to the rest.
 *     At ~42 organic installs a month split across six source types, whole
 *     sources can simply be absent. So the visible rows do NOT sum to the true
 *     total, and a share computed against their sum would overstate every
 *     source. Shares here are computed against the visible sum and labelled as
 *     such, with the gap to the App Store Connect total reported openly.
 *  2. An ONGOING report only accumulates from the moment it was registered and
 *     is never backfilled. "No data yet" is therefore the normal first state,
 *     and it is reported as report_pending rather than as an empty result.
 */

import zlib from 'node:zlib';
import jwt from 'jsonwebtoken';
import { getJson } from '../http.js';

const API = 'https://api.appstoreconnect.apple.com/v1';

export function ascAnalyticsMissing() {
  const missing = [];
  for (const k of ['ASC_KEY_ID', 'ASC_ISSUER_ID', 'ASC_PRIVATE_KEY']) {
    if (!process.env[k]) missing.push(k);
  }
  return missing;
}

export function ascAppId() {
  return process.env.ASC_APP_ID || '6755912529';
}

function token() {
  const key = String(process.env.ASC_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  return jwt.sign({}, key, {
    algorithm: 'ES256',
    keyid: process.env.ASC_KEY_ID,
    issuer: process.env.ASC_ISSUER_ID,
    audience: 'appstoreconnect-v1',
    expiresIn: '15m',
  });
}

function authHeaders() {
  return { Authorization: `Bearer ${token()}`, Accept: 'application/json' };
}

/** Report requests registered for this app (created by scripts/, never here). */
export async function listReportRequests() {
  const res = await getJson(`${API}/analyticsReportRequests?filter[app]=${ascAppId()}&limit=200`, {
    headers: authHeaders(),
    source: 'asc_analytics',
  });
  return (res.data ?? []).map((r) => ({
    id: r.id,
    accessType: r.attributes?.accessType,
    stoppedDueToInactivity: !!r.attributes?.stoppedDueToInactivity,
  }));
}

/**
 * Find a report by NAME rather than by guessing a category enum.
 *
 * Same discipline as the RevenueCat segment lookup: ask the API what exists and
 * match, so a renamed report or an unexpected enum yields a clear "here is what
 * is actually available" instead of a 400 or a silent miss.
 */
export async function findReport(requestId, namePatterns) {
  const res = await getJson(`${API}/analyticsReportRequests/${requestId}/reports?limit=200`, {
    headers: authHeaders(),
    source: 'asc_analytics',
  });
  const reports = (res.data ?? []).map((r) => ({
    id: r.id,
    name: r.attributes?.name ?? '',
    category: r.attributes?.category ?? '',
  }));
  const match = reports.find((r) =>
    namePatterns.some((p) => r.name.toLowerCase().includes(p.toLowerCase())),
  );
  return { match: match ?? null, available: reports.map((r) => ({ name: r.name, category: r.category })) };
}

/** Daily instances whose processing date falls inside the window. */
export async function instancesInWindow(reportId, startDate, endDate) {
  const res = await getJson(
    `${API}/analyticsReports/${reportId}/instances?filter[granularity]=DAILY&limit=200`,
    { headers: authHeaders(), source: 'asc_analytics' },
  );
  return (res.data ?? [])
    .map((i) => ({ id: i.id, processingDate: i.attributes?.processingDate ?? '' }))
    .filter((i) => i.processingDate >= startDate && i.processingDate <= endDate)
    .sort((a, b) => a.processingDate.localeCompare(b.processingDate));
}

/** Download and parse one instance's segments into rows of objects. */
export async function segmentRows(instanceId) {
  const res = await getJson(
    `${API}/analyticsReportInstances/${instanceId}/segments?limit=200`,
    { headers: authHeaders(), source: 'asc_analytics' },
  );
  const segments = (res.data ?? []).map((s) => s.attributes?.url).filter(Boolean);

  const rows = [];
  for (const url of segments) {
    // The segment URL is pre-signed; it must NOT carry our Authorization header.
    const resp = await fetch(url);
    if (!resp.ok) continue;
    const buf = Buffer.from(await resp.arrayBuffer());
    let text;
    try {
      text = zlib.gunzipSync(buf).toString('utf8');
    } catch {
      text = buf.toString('utf8'); // some segments arrive already decompressed
    }
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    if (lines.length < 2) continue;
    const header = lines[0].split('\t').map((h) => h.trim());
    for (const line of lines.slice(1)) {
      const cols = line.split('\t');
      const row = {};
      header.forEach((h, i) => { row[h] = (cols[i] ?? '').trim(); });
      rows.push(row);
    }
  }
  return rows;
}

/** Locate a column by fuzzy name, so a renamed header is visible, not fatal. */
export function findColumn(row, candidates) {
  const keys = Object.keys(row ?? {});
  for (const c of candidates) {
    const hit = keys.find((k) => k.toLowerCase().replace(/[^a-z]/g, '') === c.toLowerCase().replace(/[^a-z]/g, ''));
    if (hit) return hit;
  }
  for (const c of candidates) {
    const hit = keys.find((k) => k.toLowerCase().includes(c.toLowerCase()));
    if (hit) return hit;
  }
  return null;
}

const num = (v) => {
  const n = Number(String(v ?? '').replace(/[, ]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

/**
 * Roll up the Discovery and Engagement rows by source type.
 *
 * Returns the raw shape; the tool layer decides how to present it. Counts are
 * summed per (source type, event) so impressions and page views stay separate
 * rather than being added into one meaningless number.
 */
export function rollUpBySource(rows) {
  if (!rows.length) return { bySource: [], columns: [], unrecognised: true };

  const sample = rows[0];
  const colSource = findColumn(sample, ['Source Type', 'SourceType', 'source']);
  const colEvent = findColumn(sample, ['Event', 'Event Type']);
  const colCounts = findColumn(sample, ['Counts', 'Count', 'Unique Counts']);

  if (!colSource || !colCounts) {
    return { bySource: [], columns: Object.keys(sample), unrecognised: true };
  }

  const acc = {};
  for (const r of rows) {
    const source = r[colSource] || 'Unavailable';
    const event = (colEvent ? r[colEvent] : '') || '';
    const n = num(r[colCounts]);
    const e = (acc[source] ??= { source, impressions: 0, product_page_views: 0, taps: 0, other: 0 });
    const ev = event.toLowerCase();
    if (ev.includes('impression')) e.impressions += n;
    else if (ev.includes('page view') || ev.includes('pageview')) e.product_page_views += n;
    else if (ev.includes('tap')) e.taps += n;
    else e.other += n;
  }
  return {
    bySource: Object.values(acc).sort((a, b) => (b.impressions + b.product_page_views) - (a.impressions + a.product_page_views)),
    columns: Object.keys(sample),
    unrecognised: false,
    columns_used: { source: colSource, event: colEvent, counts: colCounts },
  };
}

export async function ascAnalyticsProbe() {
  const requests = await listReportRequests();
  const active = requests.filter((r) => !r.stoppedDueToInactivity);
  return {
    ok: true,
    report_requests: requests.length,
    active_access_types: active.map((r) => r.accessType),
    stopped_due_to_inactivity: requests.filter((r) => r.stoppedDueToInactivity).map((r) => r.accessType),
  };
}
