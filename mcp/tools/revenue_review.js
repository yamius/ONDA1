/**
 * revenue_review — "are people actually paying".
 *
 * Source of truth for money is RevenueCat, never an ad network's conversion
 * column. Revenue was $0 as of June and has not been checked by anything since;
 * this tool exists so that question stops being answered by hand.
 */

import {
  revenueCatMissing, overviewMetrics, revenueMetric, chartData, chartOptions,
  sumSeries, findSegment, measureColumn, summaryValue,
} from '../lib/sources/revenuecat.js';
import { windowFor, ok, notConfigured, sourceError } from '../lib/shared.js';
import { ga4Missing, internalFilter, appVersionFilter, andFilters } from '../lib/sources/ga4.js';
import { internalMislabeledNote } from '../lib/internal-versions.js';
import { paywallBreakdowns } from '../lib/paywall-breakdowns.js';
import { ga4PurchaseByDayVersion, reconcileRows, chartDaily, measureIndex } from '../lib/reconcile.js';

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
      view: {
        type: 'string', enum: ['top', 'full', 'reconcile'], default: 'full',
        description: "'reconcile' (101): GA4 purchase (by day x app_version) vs RevenueCat new paid subs " +
          '(initial purchases + trial conversions) per day; gap = RevenueCat - GA4.',
      },
      app_version: { type: 'string', description: 'GA4 side only: one marketing version, e.g. "1.9.6".' },
      internal: { type: 'string', enum: ['exclude', 'include', 'only'], default: 'exclude', description: 'GA4 side only (RevenueCat has no internal flag; sandbox is excluded there).' },
      debug: { type: 'boolean', description: 'Include chart shapes (measure names, summary, sample aggregate rows). No customer data.', default: false },
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

/**
 * Shape of a chart for debugging: measure/period names, summary, row count and
 * a few rows. Charts are aggregate counts/rates only - no customer data.
 */
function chartShape(c, withRows = false) {
  const names = (l) => (Array.isArray(l) ? l.map((m) => m?.display_name ?? m?.name ?? m?.id ?? null) : null);
  const rows = Array.isArray(c?.values) ? c.values : [];
  return {
    resolution: c?.resolution ?? null,
    yaxis: c?.yaxis ?? null,
    display_type: c?.display_type ?? null,
    measures: names(c?.measures),
    measure_units: Array.isArray(c?.measures) ? c.measures.map((m) => m?.unit ?? null) : null,
    periods: names(c?.periods),
    segments: names(c?.segments),
    summary: c?.summary ?? null,
    rows: rows.length,
    ...(withRows ? { first_rows: rows.slice(0, 6), last_rows: rows.slice(-8) } : {}),
  };
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
  const internal = args.internal || 'exclude';
  const ga4Base = andFilters(internalFilter(internal), appVersionFilter(args.app_version));
  if (view === 'reconcile') return reconcileView(win, ga4Base, internal, args);

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
      // 'revenue' IS the gross figure — the spec's enum value for it. The word
      // 'gross' is prose, not a valid value, and sending it returns 400.
      revenueMetric({ startDate: win.start_date, endDate: win.end_date, revenueType: 'revenue' })
        .catch((e) => e),
      revenueMetric({ startDate: win.start_date, endDate: win.end_date, revenueType: 'proceeds' })
        .catch((e) => e),
    ]);
    result.revenue = {
      gross: gross instanceof Error
        ? sourceError('revenuecat', gross)
        : { value: gross?.value ?? null, currency: gross?.currency ?? 'USD', revenue_type: 'revenue' },
      net_proceeds: proceeds instanceof Error
        ? sourceError('revenuecat', proceeds)
        : { value: proceeds?.value ?? null, currency: proceeds?.currency ?? 'USD' },
      net_note:
        'net_proceeds is RevenueCat revenue_type=proceeds (net of taxes and store ' +
        'commission), NOT gross minus a flat 30%.',
    };

    // --- Trials, refunds, churn -------------------------------------------
    // Live shapes (2026-10-24): values = [{cohort, measure, value, incomplete}],
    // measures by display name, and `summary.total/average` keyed by that name.
    // Window figures come from summary (RevenueCat's own aggregate); the last
    // daily point is NOT a window figure (it read 0 on a quiet last day).
    const [trialsNew, conv, refunds, churn] = await Promise.all([
      chartSafe('trials_new', win, (c) =>
        summaryValue(c, 'total', 'New Trials') ?? sumSeries(c, measureColumn(c, /trial|new/i)).total),
      chartSafe('trial_conversion_rate', win, (c) => {
        const col = (re) => sumSeries(c, measureColumn(c, re, 0)).total;
        const starts = summaryValue(c, 'total', 'Trial Starts') ?? col(/^trial starts$/i);
        const conversions = summaryValue(c, 'total', 'Conversions') ?? col(/^conversions$/i);
        const expirations = summaryValue(c, 'total', 'Expirations') ?? col(/^expirations$/i);
        const pending = summaryValue(c, 'total', 'Pending') ?? col(/^pending$/i);
        const decided = conversions + expirations;
        const ratePct = summaryValue(c, 'total', 'Conversion Rate')
          ?? (starts > 0 ? Math.round((conversions / starts) * 10000) / 100 : null);
        return { starts, conversions, expirations, pending, ratePct,
          decidedRatePct: decided > 0 ? Math.round((conversions / decided) * 10000) / 100 : null };
      }),
      chartSafe('refund_rate', win, (c) => ({
        refunded: summaryValue(c, 'total', 'Refunded Transactions') ?? sumSeries(c, measureColumn(c, /refunded/i, 2)).total,
        transactions: summaryValue(c, 'total', 'Transactions') ?? sumSeries(c, measureColumn(c, /^transactions$/i, 1)).total,
        ratePct: summaryValue(c, 'total', 'Refund Rate'),
      })),
      chartSafe('churn', win, (c) => ({
        churned: sumSeries(c, measureColumn(c, /churned/i, 2)).total,
        avgActives: summaryValue(c, 'average', 'Actives'),
        avgDailyRatePct: summaryValue(c, 'average', 'Churn Rate'),
      })),
    ]);

    const started = trialsNew.ok ? trialsNew.value : null;
    result.trials = {
      started: trialsNew.ok ? started : trialsNew,
      conversion: conv.ok
        ? {
            rate_pct: conv.value.ratePct,
            conversions: conv.value.conversions,
            expirations: conv.value.expirations,
            pending: conv.value.pending,
            of_trials_started: conv.value.starts,
            rate_of_decided_pct: conv.value.decidedRatePct,
            low_data: !(conv.value.starts >= 30),
            note:
              'RevenueCat trial_conversion_rate summary for trials STARTED in the window ' +
              '(percent). Pending trials have not resolved yet, so rate_pct can still rise; ' +
              'rate_of_decided_pct = conversions / (conversions + expirations).',
          }
        : conv,
      cancelled_or_expired: conv.ok
        ? { expired: conv.value.expirations, pending: conv.value.pending,
            note: 'From trial_conversion_rate: trials that ended without converting, and trials still running.' }
        : conv,
    };

    result.refunds = refunds.ok
      ? { count: refunds.value.refunded, of_transactions: refunds.value.transactions, rate_pct: refunds.value.ratePct,
          note: 'refund_rate chart summary over the window.' }
      : refunds;

    result.churn = churn.ok
      ? {
          churned_in_window: churn.value.churned,
          avg_actives: churn.value.avgActives,
          avg_daily_churn_rate_pct: churn.value.avgDailyRatePct,
          window_churn_pct: churn.value.avgActives > 0
            ? Math.round((churn.value.churned / churn.value.avgActives) * 10000) / 100 : null,
          note:
            'Churned Actives summed over the window; RevenueCat gives churn only as a ' +
            'daily average (no window total), so window_churn_pct = churned / average actives.',
        }
      : churn;

    // --- Breakdowns: only where the chart says they exist ------------------
    if (view === 'full') {
      result.by_product = await breakdown('revenue', win, ['product', 'sku', 'duration']);
      result.by_channel = await breakdown('revenue', win, ['channel', 'network', 'campaign', 'attribution', 'source']);
      // 101: GA4 purchase / trial_start by paywall_source, trial_outcome by outcome.
      result.ga4_by_paywall = ga4Missing().length
        ? { available: false, reason: `GA4 not configured (${ga4Missing().join(', ')})` }
        : { ...(await paywallBreakdowns(win, ga4Base)), internal, internal_note: internalMislabeledNote(internal) };
    }

    if (args.debug === true || view === 'full') {
      result._debug = Object.fromEntries(
        [['trials_new', trialsNew], ['trial_conversion_rate', conv], ['refund_rate', refunds], ['churn', churn]]
          .map(([n, r]) => [n, r.ok ? chartShape(r.chart, args.debug === true) : { error: r.error ?? r.message ?? 'failed' }]),
      );
    }

    return ok(result);
  } catch (err) {
    return sourceError('revenuecat', err);
  }
}

/**
 * view=reconcile (task 101). Prepared for ~2 weeks after 1.9.6 ships; see
 * docs/architecture/analytics.md "Purchase reconciliation".
 */
async function reconcileView(win, ga4Base, internal, args) {
  const gm = ga4Missing();
  if (gm.length) return notConfigured('ga4', gm);
  try {
    const [ga4Rows, newPaid, conv] = await Promise.all([
      ga4PurchaseByDayVersion(win, ga4Base),
      chartData('actives_new', { startDate: win.start_date, endDate: win.end_date, resolution: 'day' }),
      chartData('trial_conversion_rate', { startDate: win.start_date, endDate: win.end_date, resolution: 'day' }).catch(() => null),
    ]);
    const rcNewPaid = chartDaily(newPaid, measureIndex(newPaid, /new paid|new actives|actives/i, 0));
    const rcConv = conv ? chartDaily(conv, measureIndex(conv, /^conversions$/i, 1)) : {};
    const out = reconcileRows(ga4Rows, rcNewPaid, rcConv);

    // Per-version RevenueCat counts only if the chart offers an app-version segment.
    let rcByVersion = { available: false, reason: 'actives_new has no app-version segment; per-version gap = GA4 per version vs the per-day RevenueCat total.' };
    try {
      const { match } = findSegment(await chartOptions('actives_new'), ['app_version', 'version']);
      if (match) {
        const seg = await chartData('actives_new', { startDate: win.start_date, endDate: win.end_date, segment: match.id });
        const series = (seg?.segments ?? []).map((sg, i) => ({ app_version: sg?.display_name ?? sg?.name ?? sg?.id ?? `series_${i}`, revenuecat_new_paid: sumSeries(seg, i + 1).total }));
        rcByVersion = { available: true, segment_used: match.id, series };
        for (const v of out.by_version) {
          const hit = series.find((x) => String(x.app_version) === v.app_version);
          if (hit) { v.revenuecat_new_paid = hit.revenuecat_new_paid; v.gap = hit.revenuecat_new_paid - v.ga4_purchase_events; }
        }
      }
    } catch { /* keep available:false */ }

    return ok({
      window: win,
      view: 'reconcile',
      internal,
      internal_note: internalMislabeledNote(internal),
      ...out,
      revenuecat_by_version: rcByVersion,
      method:
        'gap = RevenueCat actives_new (new paid subscriptions = initial purchases + trial conversions) ' +
        "minus GA4 'purchase' events, per day. Positive gap = purchases the app never reported " +
        '(cold-start / closed-app conversions, user never reopened, event loss). Day boundaries differ ' +
        '(GA4 = property timezone, RevenueCat = UTC), so read multi-day totals, not single days. ' +
        'RevenueCat sandbox purchases are excluded there but GA4 TestFlight purchases are only removed by the internal filter.',
      next_step: 'Run docs/architecture/analytics.md "Purchase reconciliation" SQL in Supabase to list RevenueCat events with no same-day GA4 purchase.',
      data_lag_note: 'GA4 lags 24-48h; RevenueCat refunds arrive days later. Exclude the last 2 days.',
    });
  } catch (err) {
    return sourceError('reconcile', err);
  }
}
