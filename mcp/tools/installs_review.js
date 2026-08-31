/**
 * installs_review — "where did the installs come from".
 *
 * Paid attribution from Tenjin, total installs from App Store Connect sales
 * reports. Organic is derived as (ASC total - Tenjin paid) rather than read
 * directly, and that derivation is stated in the payload: the two sources
 * count on different clocks and in different timezones, so the residual is an
 * estimate, not a measurement.
 */

import { windowFor, rate, ok, notConfigured, sourceError, DATA_LAG } from '../lib/shared.js';
import { ascInstalls, ascMissing } from '../lib/sources/asc.js';
import { tenjinReport, tenjinMissing, summariseByChannel } from '../lib/sources/tenjin.js';

export const installsReviewSchema = {
  name: 'installs_review',
  description:
    'Where ONDA installs came from: total installs (App Store Connect sales ' +
    'reports) split into paid channels (Tenjin attribution) and an organic ' +
    'residual, with spend and CPI per channel. Read-only, aggregate-only.',
  inputSchema: {
    type: 'object',
    properties: {
      since: { type: 'integer', description: 'Days back. Default 28.', default: 28 },
      channel: { type: 'string', description: 'Filter to one channel, e.g. "google_ads". Omit for all.' },
      view: { type: 'string', enum: ['top', 'by_channel', 'full'], default: 'full' },
    },
  },
};

export async function installsReview(args = {}) {
  const win = windowFor(args.since);
  const view = args.view || 'full';
  const result = {
    window: win,
    data_lag_note: `${DATA_LAG.asc} ${DATA_LAG.tenjin}`,
    sources: {},
  };

  // Each source degrades on its own: a missing Tenjin key must still leave the
  // ASC total answerable, and vice versa.
  const ascGap = ascMissing();
  const tenjinGap = tenjinMissing();

  let total = null;
  if (ascGap.length) {
    result.sources.app_store_connect = notConfigured('asc', ascGap);
  } else {
    try {
      const asc = await ascInstalls(win.start_date, win.end_date);
      total = asc.units;
      result.sources.app_store_connect = {
        ok: true,
        installs: asc.units,
        missing_days: asc.missing_days,
        ...(view === 'full' ? { by_day: asc.by_day } : {}),
        note:
          'First-time downloads (product type 1F/1) from the SALES/SUMMARY ' +
          'report. Redownloads are not separable in this report. Days Apple has ' +
          'not published yet appear in missing_days and count as unknown, not 0.',
      };
    } catch (err) {
      result.sources.app_store_connect = sourceError('asc', err);
    }
  }

  let paid = null;
  let channels = [];
  if (tenjinGap.length) {
    result.sources.tenjin = notConfigured('tenjin', tenjinGap);
  } else {
    try {
      const payload = await tenjinReport({ startDate: win.start_date, endDate: win.end_date });
      channels = summariseByChannel(payload);
      if (args.channel) channels = channels.filter((c) => c.channel === String(args.channel).toLowerCase());
      paid = channels.reduce((s, c) => s + c.installs, 0);
      result.sources.tenjin = { ok: true, paid_installs: paid, channels_seen: channels.length };
    } catch (err) {
      result.sources.tenjin = sourceError('tenjin', err);
    }
  }

  if (view === 'by_channel' || view === 'full') result.by_channel = channels;

  if (total !== null && paid !== null) {
    const organic = Math.max(0, total - paid);
    result.split = {
      total_installs: total,
      paid: { installs: paid, of_total: rate(paid, total) },
      organic: {
        installs: organic,
        of_total: rate(organic, total),
        derived: true,
        note:
          'Organic is ASC total minus Tenjin paid, NOT a measured figure. The ' +
          'two sources use different timezones and attribution windows, so ' +
          'treat small residuals as noise.',
      },
    };
  } else {
    result.split = {
      available: false,
      reason: 'Needs both App Store Connect and Tenjin; see sources above.',
    };
  }

  // Stated rather than silently omitted — the brief asks for the store-side
  // organic breakdown, and it is not available from the report family used here.
  result.organic_sources = {
    available: false,
    reason:
      'The App Store Search / Browse / Referrer split comes from ASC ANALYTICS ' +
      'reports (asynchronous analyticsReportRequests), not the sales reports ' +
      'used here. Not implemented yet — no substitute is being guessed.',
  };

  result.modeled_note =
    'Ad-console install columns (Google/Apple SKAN) are MODELLED and routinely ' +
    'overstate reality; nothing modelled is included above. Tenjin figures here ' +
    'are attributed installs.';

  return ok(result);
}
