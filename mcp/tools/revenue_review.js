/**
 * revenue_review — "are people actually paying".
 *
 * Source of truth for money is RevenueCat, never an ad network's conversion
 * column. Revenue was $0 as of June and has not been checked by anything since;
 * this tool exists so that question stops being answered by hand.
 */

import {
  revenueCatMissing, overviewMetrics, revenueMetric, chartData, chartOptions,
  sumSeries, lastValue, findSegment,
} from '../lib/sources/revenuecat.js';
import { windowFor, ok, notConfigured, sourceError } from '../lib/shared.js';

export const revenueReviewSchema = {
  name: 'revenue_review',
  description:
    'Are people paying? Trials started, trial-to-paid conversion, active ' +
    'subscriptions, MRR, gross and net (proceeds) revenue, refunds and churn ' +
    'from RevenueCat. Read-only, aggregate-only.',
  inputSchema: {
    type: 'object',
    properties: {
      since: { type: 'integer', description: 'Days back. Default 28.', default: 28 },
      view: { type: 'string', enum: ['top', 'full'], default: 'full' },
    },
  },
};

/** One chart, resolved to a windowed number, never failing the whole tool. */
async function chartSafe(name, win, pick) {
  try {
    const chart = await chartData(name, { startDate: win.start_date, endDate: win.end_date });
    return { ok: true, chart, value: pick(chart) };
  } catch (err) {
    return { ok: false, ...sourceError('revenuecat', err), chart_name: name };
  }
}

/** Pull one named metric out of the overview payload, whatever its casing. */
function overviewValue(payload, id) {
  const list = Array.isArray(payload?.metrics) ? payload.metrics : [];
  const hit = list.find((m) =>
    String(m?.id ?? m?.name ?? '').toLowerCase().replace(/[^a-z0-9]/g, '_').includes(id),
  );
  if (!hit) return null;
  return { value: hit.value ?? hit.last_value ?? null, name: hit.display_name ?? hit.name ?? id };
}

/** Ask a chart which segments it supports, rather than guessing one. */
async function breakdown(chartName, win, candidates) {
  try {
    const options = await chartOptions(chartName);
    const { match, available } = findSegment(options, candidates);
    if (!match) {
      return {
        available: false,
        reason: `The ${chartName} chart exposes no segment matching ${candidates.join('/')}.`,
        segments_the_chart_does_support: available,
      };
    }
    const chart = await chartData(chartName, {
      startDate: win.start_date, endDate: win.end_date, segment: match.id,
    });
    const series = (chart?.segments ?? []).map((s, i) => ({
      segment: s?.display_name ?? s?.name ?? s?.id ?? `series_${i}`,
      total: sumSeries(chart, i + 1).total,
    }));
    return { available: true, segment_used: match.id, series };
  } catch (err) {
    return { available: false, reason: 'Segment lookup failed.', ...sourceError('revenuecat', err) };
  }
}

export async function revenueReview(args = {}) {
  const missing = revenueCatMissing();
  if (missing.length) return notConfigured('revenuecat', missing);

  const win = windowFor(args.since);
  const view = args.view || 'full';

  const result = {
    window: win,
    data_lag_note:
      'RevenueCat is near real-time (larger accounts cache 1-2h), but REFUNDS ' +
      'arrive with a delay of several days and rewrite the picture retroactively ' +
      '- a fresh window always looks better than it will settle at. The most ' +
      'recent day is partial when it includes today.',
  };

  try {
    // --- Snapshot: active subs / trials / MRR ------------------------------
    const overview = await overviewMetrics();
    result.snapshot = {
      active_subscriptions: overviewValue(overview, 'active_subscription')?.value ?? null,
      active_trials: overviewValue(overview, 'active_trial')?.value ?? null,
      mrr: overviewValue(overview, 'mrr')?.value ?? null,
      currency: overview?.currency ?? 'USD',
      note:
        'Point-in-time snapshot from the overview endpoint. Its windows are FIXED ' +
        'by the API (28 days) and do NOT follow `since` - only the windowed ' +
        'figures below honour it.',
    };

    // --- Revenue: gross vs proceeds ---------------------------------------
    // proceeds = net of taxes AND store commission, straight from the API.
    // Deliberately not "gross minus 30%": Apple takes 15% under the Small
    // Business Program and after year one of a subscription, so a flat rate
    // would misstate net - probably by about half, for this app.
    const [gross, proceeds] = await Promise.all([
      revenueMetric({ startDate: win.start_date, endDate: win.end_date, revenueType: 'gross' })
        .catch((e) => e),
      revenueMetric({ startDate: win.start_date, endDate: win.end_date, revenueType: 'proceeds' })
        .catch((e) => e),
    ]);
    result.revenue = {
      gross: gross instanceof Error
        ? sourceError('revenuecat', gross)
        : { value: gross?.value ?? null, currency: gross?.currency ?? 'USD' },
      net_proceeds: proceeds instanceof Error
        ? sourceError('revenuecat', proceeds)
        : { value: proceeds?.value ?? null, currency: proceeds?.currency ?? 'USD' },
      net_note:
        'net_proceeds is RevenueCat revenue_type=proceeds (net of taxes and store ' +
        'commission), NOT gross minus a flat 30%.',
    };

    // --- Trials, refunds, churn -------------------------------------------
    const [trialsNew, conv, refunds, churn] = await Promise.all([
      chartSafe('trials_new', win, (c) => sumSeries(c).total),
      chartSafe('trial_conversion_rate', win, (c) => lastValue(c)),
      chartSafe('refund_rate', win, (c) => sumSeries(c).total),
      chartSafe('churn', win, (c) => lastValue(c)),
    ]);

    const started = trialsNew.ok ? trialsNew.value : null;
    result.trials = {
      started: trialsNew.ok ? started : trialsNew,
      conversion: conv.ok
        ? {
            reported_rate: conv.value,
            of_trials_started: started,
            low_data: started === null || started < 30,
            note:
              'Rate as RevenueCat computes it, with the N it applies to beside it. ' +
              'Conversions belong to the cohort that STARTED the trial, so a window ' +
              'shorter than the trial length reports a rate still maturing.',
          }
        : conv,
      cancelled_or_expired: {
        available: false,
        reason:
          'Not derivable without inventing it: started minus converted also counts ' +
          'trials still running. The trials_movement chart carries the real ' +
          'breakdown and is not wired yet.',
      },
    };

    result.refunds = refunds.ok
      ? { count: refunds.value, note: 'From the refund_rate chart (transactions, refunds and rate per period).' }
      : refunds;

    result.churn = churn.ok
      ? { rate: churn.value, note: 'Churn rate at the end of the window, per the churn chart.' }
      : churn;

    // --- Breakdowns: only where the chart says they exist ------------------
    if (view === 'full') {
      result.by_product = await breakdown('revenue', win, ['product', 'sku', 'duration']);
      result.by_channel = await breakdown('revenue', win, ['channel', 'network', 'campaign', 'attribution', 'source']);
    }

    // --- The cross-check the brief asks for -------------------------------
    const anyMoney =
      (Number(result.snapshot.active_subscriptions) || 0) > 0 ||
      (Number(result.snapshot.active_trials) || 0) > 0 ||
      (Number(started) || 0) > 0 ||
      (Number(result.revenue.gross?.value) || 0) > 0;

    result.tenjin_purchase_events_note = {
      revenuecat_sees_activity: anyMoney,
      tenjin_dashboard_state:
        "'Valid Purchase Event: not received' and 'Subscription Event: not received' " +
        'across app versions 1.8.3-1.8.7. This is a dashboard fact supplied by the ' +
        'operator, NOT something read through an API here.',
      verdict: anyMoney
        ? 'CONTRADICTION: RevenueCat sees paying or trialing activity while Tenjin ' +
          'reports no purchase events. The likely cause is that Tenjin has no ' +
          'In-App Purchase credentials filled in (Key ID, Issuer ID, In-App Purchase ' +
          'Key), so it cannot validate purchases at all. Until those are set, Tenjin ' +
          'will report zero however many purchases occur, and any revenue or ROAS ' +
          'read from Tenjin is wrong.'
        : 'NO CONTRADICTION YET: RevenueCat also shows no paying activity in this ' +
          'window, so the two agree. This does NOT prove Tenjin is wired correctly - ' +
          'with empty IAP credentials it would report zero either way. The check only ' +
          'becomes informative once RevenueCat shows a purchase.',
    };

    return ok(result);
  } catch (err) {
    return sourceError('revenuecat', err);
  }
}
