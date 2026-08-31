/**
 * GA4 Data API — the only source for the activation funnel.
 *
 * Dimension names this file depends on, verified against the app source
 * (not guessed) on 2026-08-31:
 *   - `customUser:internal`  — user-scoped custom dimension "Internal traffic",
 *     set by AnalyticsService as a Firebase USER property. User-scoped because
 *     first_open / session_start / screen_view are auto-collected and never
 *     pass through track(), so an event param could not mark them.
 *   - `customEvent:source`   — "Event source"; home_view{source:first_run|relaunch|menu}
 *   - `customEvent:action`   — "Paywall action"; paywall_dismiss{action:close|continue_free}
 *   - `appVersion`           — BUILT-IN. Firebase stamps the real marketing
 *     version (CFBundleShortVersionString). Deliberately not a custom param:
 *     the app's own `app_version` field is the CI run number, not 1.8.x.
 */

import { JWT } from 'google-auth-library';
import { sourceError } from '../shared.js';

const SCOPES = ['https://www.googleapis.com/auth/analytics.readonly'];
const API = 'https://analyticsdata.googleapis.com/v1beta';

export function ga4Missing() {
  const missing = [];
  if (!process.env.GA4_PROPERTY_ID) missing.push('GA4_PROPERTY_ID');
  if (!process.env.GA4_SERVICE_ACCOUNT_JSON) missing.push('GA4_SERVICE_ACCOUNT_JSON');
  return missing;
}

let _client = null;
function authClient() {
  if (_client) return _client;
  const creds = JSON.parse(process.env.GA4_SERVICE_ACCOUNT_JSON);
  _client = new JWT({
    email: creds.client_email,
    // Vercel env values commonly carry literal \n instead of real newlines.
    key: String(creds.private_key || '').replace(/\n/g, '\n'),
    scopes: SCOPES,
  });
  return _client;
}

export async function runReport(body) {
  const property = process.env.GA4_PROPERTY_ID;
  const res = await authClient().request({
    url: `${API}/properties/${property}:runReport`,
    method: 'POST',
    data: body,
  });
  return res.data;
}

/**
 * internal filter — the MCP contract, in one place.
 *
 * EXTERNAL is `'false'` OR the property being absent: every event recorded
 * before the marker shipped carries no property at all, and those are real
 * users. Only an explicit 'true' is internal. `exclude` is therefore a
 * NOT(=='true'), never an ==('false'), which would silently drop all history.
 */
export function internalFilter(mode) {
  const isTrue = {
    filter: {
      fieldName: 'customUser:internal',
      stringFilter: { matchType: 'EXACT', value: 'true' },
    },
  };
  if (mode === 'only') return isTrue;
  if (mode === 'include') return null;
  return { notExpression: isTrue }; // 'exclude' (default)
}

export function appVersionFilter(appVersion) {
  if (!appVersion) return null;
  return {
    filter: {
      fieldName: 'appVersion',
      stringFilter: { matchType: 'EXACT', value: String(appVersion) },
    },
  };
}

/** Combine filters, dropping the nulls, without emitting an empty andGroup. */
export function andFilters(...filters) {
  const list = filters.filter(Boolean);
  if (list.length === 0) return undefined;
  if (list.length === 1) return list[0];
  return { andGroup: { expressions: list } };
}

export function eventNameFilter(names) {
  return {
    filter: {
      fieldName: 'eventName',
      inListFilter: { values: names },
    },
  };
}

/** Cheap probe for check_status — one row, minimal cost. */
export async function ga4Probe() {
  try {
    const data = await runReport({
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      metrics: [{ name: 'eventCount' }],
      limit: 1,
    });
    const rows = data?.rowCount ?? 0;
    return { ok: true, rows_seen: rows };
  } catch (err) {
    return sourceError('ga4', err);
  }
}
