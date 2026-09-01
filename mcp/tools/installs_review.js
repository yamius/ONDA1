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
import { tenjinSpendReport, tenjinMissing, summariseByChannel } from '../lib/sources/tenjin.js';
import { organicSourceBreakdown } from '../lib/organic-sources.js';

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
      const payload = await tenjinSpendReport({ startDate: win.start_date, endDate: win.end_date });
      channels = summariseByChannel(payload);
      if (args.channel) channels = channels.filter((c) => c.channel === String(args.channel).toLowerCase());
      paid = channels.reduce((s, c) => s + c.installs, 0);
      result.sources.tenjin = { ok: true, paid_installs: paid, channels_seen: channels.length };
    } catch (err) {
      result.sources.tenjin = sourceError('tenjin', err);
    }
  }

  if (view === 'by_channel' || view === 'full') result.by_channel = channels;

  if (total !== null && paid !== null && paid > total) {
    // Paid cannot exceed the total. Reporting 115% and an organic residual of
    // zero would be arithmetic laid over contradictory inputs, stated with a
    // confidence the numbers have not earned. Refuse the derivation instead.
    result.split = {
      inconsistent_sources: true,
      total_installs_app_store_connect: total,
      paid_installs_tenjin: paid,
      excess: paid - total,
      note:
        'Tenjin attributes MORE paid installs than App Store Connect reports in ' +
        'total, which is impossible. No percentage or organic residual is given ' +
        'because both would be meaningless.',
      likely_causes: [
        'Tenjin rows include SKAN-modelled installs, which are estimates and ' +
          'routinely overstate reality - the Google console once showed 90 where ' +
          'Tenjin saw 1 real install; this is the mirror image of that.',
        'Different clocks: Apple sales reports are in Pacific time and closed by ' +
          'day, Tenjin attributes on its own window, so a long window drifts.',
        'App Store Connect counts first-time downloads only, while an attributed ' +
          'install can be a redownload or a reinstall.',
      ],
      how_to_check:
        'Compare a short window (7 days) against the Tenjin dashboard for the same ' +
        'dates, and check whether the Google Ads channel row is SKAN-modelled.',
    };
  } else if (total !== null && paid !== null) {
    const organic = total - paid;
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
  // How people FIND the app in the store, measured by Apple rather than derived.
  // Kept separate from split.organic on purpose: one is a subtraction residual
  // (ASC total minus Tenjin paid), the other is a direct measurement, and they
  // answer different questions. Where they disagree, both are shown.
  result.organic_sources = await organicSourceBreakdown(win, total);

  result.modeled_note =
    'Ad-console install columns (Google/Apple SKAN) are MODELLED and routinely ' +
    'overstate reality; nothing modelled is included above. Tenjin figures here ' +
    'are attributed installs.';

  return ok(result);
}
