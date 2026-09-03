/**
 * funnel_review — "where did they drop off".
 *
 * The activation funnel, as instrumented in the app:
 *
 *   first_open -> onboarding_start -> onboarding_complete -> practice_start
 *   -> practice_complete -> results_view -> paywall_view
 *      |- purchase
 *      \- paywall_dismiss{action} -> home_view{source:first_run}
 *
 * The two post-paywall branches are reported SEPARATELY and never summed into
 * one line: buying and reaching the hub without buying are disjoint outcomes,
 * and a single "conversion" number would hide which one is happening.
 */

import { runReport, internalFilter, appVersionFilter, andFilters, eventNameFilter } from '../lib/sources/ga4.js';
import { windowFor, rate, ok, notConfigured, sourceError, DATA_LAG } from '../lib/shared.js';
import { ga4Missing } from '../lib/sources/ga4.js';

const STEPS = [
  'first_open',
  'onboarding_start',
  'onboarding_complete',
  'practice_start',
  'practice_complete',
  'results_view',
  'paywall_view',
];

/** eventName -> total users, for the given window/filters. */
async function eventUsers(win, baseFilter, names) {
  const data = await runReport({
    dateRanges: [{ startDate: win.start_date, endDate: win.end_date }],
    dimensions: [{ name: 'eventName' }],
    metrics: [{ name: 'totalUsers' }],
    dimensionFilter: andFilters(baseFilter, eventNameFilter(names)),
    limit: 200,
  });
  const out = {};
  for (const row of data.rows ?? []) {
    out[row.dimensionValues[0].value] = Number(row.metricValues[0].value || 0);
  }
  return out;
}

/** Users for one event split by an event-scoped custom dimension. */
async function eventBreakdown(win, baseFilter, eventName, dimension) {
  const data = await runReport({
    dateRanges: [{ startDate: win.start_date, endDate: win.end_date }],
    dimensions: [{ name: dimension }],
    metrics: [{ name: 'totalUsers' }],
    dimensionFilter: andFilters(baseFilter, eventNameFilter([eventName])),
    limit: 50,
  });
  const out = {};
  for (const row of data.rows ?? []) {
    out[row.dimensionValues[0].value] = Number(row.metricValues[0].value || 0);
  }
  return out;
}

export const funnelReviewSchema = {
  name: 'funnel_review',
  description:
    'ONDA activation funnel from GA4: per-step users, completion and drop-off, ' +
    'plus the two disjoint post-paywall branches (purchase vs reaching the hub ' +
    'without buying) and the silent-exit residual. Read-only, aggregate-only.',
  inputSchema: {
    type: 'object',
    properties: {
      since: { type: 'integer', description: 'Days back. Default 28 (daily volume is too low for shorter windows).', default: 28 },
      app_version: { type: 'string', description: 'Filter to one marketing version, e.g. "1.8.7". Omit for all.' },
      internal: {
        type: 'string',
        enum: ['exclude', 'include', 'only'],
        description: "Own devices. 'exclude' (default) drops them; 'only' shows just them, to confirm events fire at all.",
        default: 'exclude',
      },
      view: { type: 'string', enum: ['steps', 'paywall', 'full'], default: 'full' },
    },
  },
};

export async function funnelReview(args = {}) {
  const missing = ga4Missing();
  if (missing.length) return notConfigured('ga4', missing);

  const win = windowFor(args.since);
  const internal = args.internal || 'exclude';
  const view = args.view || 'full';
  const baseFilter = andFilters(internalFilter(internal), appVersionFilter(args.app_version));

  try {
    const counts = await eventUsers(win, baseFilter, [...STEPS, 'purchase', 'paywall_dismiss', 'home_view']);

    const steps = STEPS.map((name, i) => {
      const users = counts[name] ?? 0;
      const prev = i === 0 ? null : counts[STEPS[i - 1]] ?? 0;
      const first = counts[STEPS[0]] ?? 0;
      return {
        step: name,
        users,
        from_previous: i === 0 ? null : rate(users, prev),
        from_top: i === 0 ? null : rate(users, first),
        dropped_from_previous: i === 0 ? null : Math.max(0, (prev ?? 0) - users),
      };
    });

    const result = {
      window: win,
      filters: { internal, app_version: args.app_version ?? null },
      data_lag_note: DATA_LAG.ga4,
      // Spelled out because it is the single most misread thing here.
      metric_note:
        'Counts are TOTAL USERS per event in the window, not sessions and not a ' +
        'strictly ordered path — a user counts toward a step whenever they fired ' +
        'that event in the window, even if they skipped an earlier one.',
    };

    if (view === 'steps' || view === 'full') result.steps = steps;

    if (view === 'paywall' || view === 'full') {
      const paywallView = counts.paywall_view ?? 0;
      const purchase = counts.purchase ?? 0;

      // home_view{source:first_run} only — 'relaunch'/'menu' are returning
      // users and have nothing to do with the post-paywall branch.
      const homeBySource = await eventBreakdown(win, baseFilter, 'home_view', 'customEvent:source');
      const homeFirstRun = homeBySource.first_run ?? 0;
      const dismissByAction = await eventBreakdown(win, baseFilter, 'paywall_dismiss', 'customEvent:action');

      // THE TWO PAYWALLS ARE DIFFERENT PRODUCTS AND MUST NOT BE ONE NUMBER.
      //
      // The app shows a paywall twice, and both have always fired paywall_view,
      // separated only by `source`:
      //   soft — source 'post_first_experience', after the first practice in
      //          onboarding. It is a shop window: it shows what exists and lets
      //          everyone past.
      //   hard — source 'practice_intro', on the fourth practice once the three
      //          free ones are used. This is where the money decision happens.
      // Summing them produced the reading "55 views, 1 purchase, terrible
      // conversion". That number was two different things added together.
      const viewBySource = await eventBreakdown(win, baseFilter, 'paywall_view', 'customEvent:source');
      const dismissBySource = await eventBreakdown(win, baseFilter, 'paywall_dismiss', 'customEvent:source');
      const softView = viewBySource.post_first_experience ?? 0;
      const hardView = viewBySource.practice_intro ?? 0;
      const otherViews = Object.entries(viewBySource)
        .filter(([k]) => k !== 'post_first_experience' && k !== 'practice_intro')
        .reduce((sum, [, v]) => sum + v, 0);

      result.paywall_by_type = {
        soft_onboarding: {
          source_value: 'post_first_experience',
          views: softView,
          dismisses: dismissBySource.post_first_experience ?? 0,
          role: 'Shown after the first practice. Informational — nearly everyone passes it.',
        },
        hard_practice_gate: {
          source_value_on_view: 'practice_intro',
          source_value_on_dismiss: 'practice_gate_basic',
          views: hardView,
          dismisses: dismissBySource.practice_gate_basic ?? 0,
          role: 'Shown on the fourth practice, once the three free ones are used. This is the decision point.',
          label_mismatch_warning:
            'The same paywall reports a DIFFERENT source on view and on dismiss ' +
            "('practice_intro' vs 'practice_gate_basic'), so the two cannot be " +
            'joined on one value and a filter on either alone finds only half. ' +
            'This is an app-side defect, not a reporting choice.',
        },
        other_sources: otherViews ? { views: otherViews, values: Object.keys(viewBySource) } : undefined,
        purchase_attribution: {
          available: false,
          reason:
            'purchase carries no paywall source — it fires from useSubscription on ' +
            'the entitlement change and does not know which paywall preceded it. ' +
            'So conversion CANNOT be split per paywall, and a per-paywall silent-exit ' +
            'residual cannot be computed either. Both would need the source added to ' +
            'the purchase event.',
          total_purchases_in_window: purchase,
        },
        note:
          'Both paywalls have been instrumented all along; only this breakdown was ' +
          'missing. These counts therefore cover the full history, not just events ' +
          'recorded after this change.',
      };

      result.paywall = {
        paywall_view_users: paywallView,
        combined_warning:
          'paywall_view here is the SUM of both paywalls. For anything about ' +
          'conversion read paywall_by_type instead — the soft and hard paywalls ' +
          'answer different questions and their rates are not comparable.',
        // Disjoint branches — reported side by side, never summed.
        branches: {
          purchase: { users: purchase, of_paywall_view: rate(purchase, paywallView) },
          entered_product_without_buying: {
            users: homeFirstRun,
            of_paywall_view: rate(homeFirstRun, paywallView),
            note: 'home_view{source:first_run} — reached the hub after dismissing the paywall.',
          },
        },
        silent_exit: {
          users: Math.max(0, paywallView - purchase - homeFirstRun),
          of_paywall_view: rate(Math.max(0, paywallView - purchase - homeFirstRun), paywallView),
          note:
            'Residual: saw the paywall, neither bought nor reached the hub — i.e. ' +
            'closed the app on the paywall. Derived by subtraction, so any event ' +
            'loss between the three inflates it.',
        },
        dismiss_action: {
          close: { users: dismissByAction.close ?? 0, of_dismiss: rate(dismissByAction.close ?? 0, counts.paywall_dismiss ?? 0) },
          continue_free: { users: dismissByAction.continue_free ?? 0, of_dismiss: rate(dismissByAction.continue_free ?? 0, counts.paywall_dismiss ?? 0) },
          total_dismiss_users: counts.paywall_dismiss ?? 0,
        },
      };
    }

    return ok(result);
  } catch (err) {
    return sourceError('ga4', err);
  }
}
