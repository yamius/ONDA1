/**
 * App Store Connect — install counts via Sales Reports.
 *
 * Two different report families, routinely confused:
 *   - Sales Reports    (used here): simple, daily, one gzipped TSV per day.
 *   - Analytics Reports: asynchronous `analyticsReportRequests`, ongoing
 *     subscriptions, needed for the "how did they find us in the store"
 *     breakdown (App Store Search / Browse / Referrer). NOT implemented yet —
 *     installs_review says so explicitly rather than inventing the split.
 */

import zlib from 'node:zlib';
import jwt from 'jsonwebtoken';
import { sourceError } from '../shared.js';

const API = 'https://api.appstoreconnect.apple.com/v1';

export function ascMissing() {
  const missing = [];
  for (const k of ['ASC_KEY_ID', 'ASC_ISSUER_ID', 'ASC_PRIVATE_KEY', 'ASC_VENDOR_NUMBER']) {
    if (!process.env[k]) missing.push(k);
  }
  return missing;
}

function token() {
  const key = String(process.env.ASC_PRIVATE_KEY || '').replace(/\n/g, '\n');
  return jwt.sign({}, key, {
    algorithm: 'ES256',
    keyid: process.env.ASC_KEY_ID,
    issuer: process.env.ASC_ISSUER_ID,
    audience: 'appstoreconnect-v1',
    expiresIn: '15m',
  });
}

/**
 * One day of the SALES/SUMMARY report. Returns null for a day Apple has no
 * report for — a missing day is normal at the edge of the window (reporting
 * lag) and must not be reported as zero installs.
 */
async function salesReportDay(date, bearer) {
  const qs = new URLSearchParams({
    'filter[frequency]': 'DAILY',
    'filter[reportType]': 'SALES',
    'filter[reportSubType]': 'SUMMARY',
    'filter[vendorNumber]': process.env.ASC_VENDOR_NUMBER,
    'filter[reportDate]': date,
    'filter[version]': '1_0',
  });
  const res = await fetch(`${API}/salesReports?${qs}`, {
    headers: { Authorization: `Bearer ${bearer}`, Accept: 'application/a-gzip' },
  });
  if (res.status === 404) return null; // no report for that day
  if (!res.ok) throw new Error(`ASC salesReports ${res.status} for ${date}`);
  const buf = Buffer.from(await res.arrayBuffer());
  return zlib.gunzipSync(buf).toString('utf8');
}

/**
 * Sum first-time downloads across a window.
 *
 * Product Type Identifier '1F' / '1' = free-app first download on iOS; 'F1'/'1T'
 * and friends are updates or other transaction types and are excluded, so this
 * counts installs rather than all store transactions. Redownloads are NOT
 * separable in the SUMMARY report — noted in the payload.
 */
export async function ascInstalls(startDate, endDate) {
  const bearer = token();
  const days = [];
  for (let d = new Date(startDate); d <= new Date(endDate); d = new Date(d.getTime() + 86400000)) {
    days.push(d.toISOString().slice(0, 10));
  }

  let units = 0;
  const missingDays = [];
  const byDay = {};
  // Small concurrency: Apple rate-limits, and a serial loop over 28 days
  // would risk the function timeout.
  const CHUNK = 5;
  for (let i = 0; i < days.length; i += CHUNK) {
    const slice = days.slice(i, i + CHUNK);
    const texts = await Promise.all(
      slice.map((day) => salesReportDay(day, bearer).then((t) => [day, t]).catch(() => [day, undefined])),
    );
    for (const [day, tsv] of texts) {
      if (tsv === null || tsv === undefined) { missingDays.push(day); continue; }
      const lines = tsv.split('\n').filter(Boolean);
      const header = lines[0].split('\t');
      const iUnits = header.indexOf('Units');
      const iType = header.indexOf('Product Type Identifier');
      let dayUnits = 0;
      for (const line of lines.slice(1)) {
        const cols = line.split('\t');
        const type = (cols[iType] || '').trim();
        if (type === '1F' || type === '1') dayUnits += Number(cols[iUnits] || 0);
      }
      byDay[day] = dayUnits;
      units += dayUnits;
    }
  }
  return { units, by_day: byDay, missing_days: missingDays };
}

export async function ascProbe() {
  try {
    const bearer = token();
    // Two days back: today and yesterday are frequently not published yet, and
    // a 404 there would look like broken credentials when nothing is wrong.
    const day = new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10);
    const tsv = await salesReportDay(day, bearer);
    return { ok: true, probe_date: day, report_present: tsv !== null };
  } catch (err) {
    return sourceError('asc', err);
  }
}
