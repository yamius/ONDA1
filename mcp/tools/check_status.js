/**
 * check_status — is every source actually answering?
 *
 * Exists because the failure mode that matters here is silent: an expired ASC
 * JWT or a revoked GA4 service account makes a tool return an empty funnel,
 * which reads exactly like "nobody used the app". This separates "no data"
 * from "no access".
 */

import { ok, sourceError, DATA_LAG } from '../lib/shared.js';
import { ga4Missing, ga4Probe } from '../lib/sources/ga4.js';
import { ascMissing, ascProbe } from '../lib/sources/asc.js';
import { tenjinMissing, tenjinProbe } from '../lib/sources/tenjin.js';
import { revenueCatMissing, revenueCatProbe } from '../lib/sources/revenuecat.js';
import { ascAnalyticsMissing, ascAnalyticsProbe } from '../lib/sources/asc-analytics.js';
import { posthogMissing, posthogProbe } from '../lib/sources/posthog.js';

export const checkStatusSchema = {
  name: 'check_status',
  description:
    'Health of every analytics source behind these tools: credentials present, ' +
    'API answering, and how stale each source normally is. Run this first when ' +
    'a number looks wrong or empty.',
  inputSchema: { type: 'object', properties: {} },
};

async function probe(name, missing, fn, lag) {
  if (missing.length) {
    return { source: name, status: 'not_configured', missing, data_lag: lag };
  }
  try {
    const res = await fn();
    if (res.ok) return { source: name, status: 'ok', ...res, ok: undefined, data_lag: lag };
    return { source: name, status: 'error', ...res, ok: undefined, error: undefined, data_lag: lag };
  } catch (err) {
    // Probes may throw (HttpError) — surface the diagnostics rather than a
    // bare message, which is what made the first Tenjin failure undebuggable.
    const detail = sourceError(name, err);
    return { source: name, status: 'error', ...detail, ok: undefined, error: undefined, data_lag: lag };
  }
}

export async function checkStatus() {
  const sources = await Promise.all([
    probe('ga4', ga4Missing(), ga4Probe, DATA_LAG.ga4),
    probe('app_store_connect', ascMissing(), ascProbe, DATA_LAG.asc),
    probe('tenjin', tenjinMissing(), tenjinProbe, DATA_LAG.tenjin),
    probe('revenuecat', revenueCatMissing(), revenueCatProbe, DATA_LAG.revenuecat),
    probe('asc_analytics', ascAnalyticsMissing(), ascAnalyticsProbe, DATA_LAG.asc_analytics),
    probe('posthog', posthogMissing(), posthogProbe, DATA_LAG.posthog),
  ]);

  const healthy = sources.filter((s) => s.status === 'ok').length;
  return ok({
    summary: `${healthy}/${sources.length} sources answering`,
    sources,
    phase_note:
      'funnel_review, installs_review, revenue_review, retention_review and ' +
      'check_status are wired. ads_review is not, so it is absent rather than ' +
      'returning empty results.',
  });
}
