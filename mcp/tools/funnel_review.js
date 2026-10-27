/**
 * funnel_review — "where did they drop off".
 *
 * The new-user funnel (onboarding is DISABLED since 1.9.x, so new installs land
 * straight on the hub):
 *
 *   first_open -> home_view{source:first_launch} -> practice_start
 *   -> practice_complete -> results_view -> paywall_view
 *
 * home_view{first_launch} exists only from 1.9.6. For older builds a clearly
 * labelled fallback is reported: home_view{relaunch} users whose
 * days_since_first_seen is 0 (only if that GA4 custom dimension is registered).
 *
 * Legacy / secondary line (older versions; ~0 since onboarding was disabled):
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

import { paywallBreakdowns } from '../lib/paywall-breakdowns.js';
import { runReport, internalFilter, appVersionFilter, andFilters, eventNameFilter } from '../lib/sources/ga4.js';
import { windowFor, rate, ok, notConfigured, sourceError, DATA_LAG } from '../lib/shared.js';
import { ga4Missing } from '../lib/sources/ga4.js';
import { internalMislabeledNote } from '../lib/internal-versions.js';

/** New-user funnel (1.9.6+). 'home_view:first_launch' = home_view filtered by source. */
const FIRST_LAUNCH = 'home_view:first_launch';
const NEW_STEPS = [
  'first_open',
  FIRST_LAUNCH,
  'practice_start',
  'practice_complete',
  'results_view',
  'paywall_view',
];

/** Legacy onboarding funnel — older versions only; onboarding disabled since 1.9.x. */
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
    const homeBySource = await eventBreakdown(win, baseFilter, 'home_view', 'customEvent:source');
    counts[FIRST_LAUNCH] = homeBySource.first_launch ?? 0;

    const buildSteps = (list) => list.map((name, i) => {
      const users = counts[name] ?? 0;
      const prev = i === 0 ? null : counts[list[i - 1]] ?? 0;
      const first = counts[list[0]] ?? 0;
      return {
        step: name === FIRST_LAUNCH ? 'home_view{source:first_launch}' : name,
        users,
        from_previous: i === 0 ? null : rate(users, prev),
        from_top: i === 0 ? null : rate(users, first),
        dropped_from_previous: i === 0 ? null : Math.max(0, (prev ?? 0) - users),
      };
    });
    const steps = buildSteps(NEW_STEPS);
    const legacySteps = buildSteps(STEPS);

    // Fallback for builds before 1.9.6 (no first_launch): home_view{relaunch}
    // with days_since_first_seen = 0. Needs that param registered as a GA4
    // custom dimension; if not, say so instead of guessing.
    let preFirstLaunchFallback;
    try {
      const data = await runReport({
        dateRanges: [{ startDate: win.start_date, endDate: win.end_date }],
        dimensions: [{ name: 'customEvent:source' }, { name: 'customEvent:days_since_first_seen' }],
        metrics: [{ name: 'totalUsers' }],
        dimensionFilter: andFilters(baseFilter, eventNameFilter(['home_view'])),
        limit: 200,
      });
      let users = 0;
      let numericRows = 0;
      for (const row of data.rows ?? []) {
        const [src, days] = row.dimensionValues.map((d) => d.value);
        const numeric = /^\d+$/.test(String(days ?? '').trim());
        if (numeric) numericRows += 1;
        if (src === 'relaunch' && numeric && Number(days) === 0) {
          users += Number(row.metricValues[0].value || 0);
        }
      }
      // 103: days_since_first_seen was a NUMBER param, which GA4 shows as
      // "(not set)" — with no numeric value at all, "0 users" would be a lie.
      if (numericRows === 0) {
        preFirstLaunchFallback = {
          available: false,
          users: null,
          label: 'FALLBACK (pre-1.9.6 builds): home_view{relaunch} with days_since_first_seen = 0',
          reason: 'нет данных: days_since_first_seen has no numeric values in GA4 yet (number params arrive as strings only from task-103 app builds)',
        };
      } else preFirstLaunchFallback = {
        available: true,
        users,
        of_first_open: rate(users, counts.first_open ?? 0),
        label:
          'FALLBACK (pre-1.9.6 builds): home_view{source:relaunch} with ' +
          'days_since_first_seen = 0 - proxy for a new install reaching the hub. ' +
          'Includes same-day relaunches (user count, so each user once), and is not the same metric as first_launch.',
      };
    } catch (e) {
      preFirstLaunchFallback = {
        available: false,
        label: 'FALLBACK (pre-1.9.6 builds): home_view{relaunch} with days_since_first_seen = 0',
        reason: 'days_since_first_seen is not queryable as a GA4 custom dimension: ' + String(e?.message || e).slice(0, 200),
      };
    }

    const result = {
      window: win,
      filters: { internal, app_version: args.app_version ?? null },
      ...(internalMislabeledNote(internal) && { internal_note: internalMislabeledNote(internal) }),
      data_lag_note: DATA_LAG.ga4,
      // Spelled out because it is the single most misread thing here.
      metric_note:
        'Counts are TOTAL USERS per event in the window, not sessions and not a ' +
        'strictly ordered path — a user counts toward a step whenever they fired ' +
        'that event in the window, even if they skipped an earlier one.',
    };

    if (view === 'steps' || view === 'full') {
      result.funnel_note =
        'steps = new-user funnel first_open -> home_view{source:first_launch} -> ' +
        'practice_start -> ... (first_launch only exists from app 1.9.6). ' +
        'legacy_onboarding_steps = the old onboarding funnel for older versions; ' +
        'onboarding is disabled since 1.9.x, so its onboarding_* steps are ~0.';
      result.steps = steps;
      result.pre_1_9_6_fallback = preFirstLaunchFallback;
      result.legacy_onboarding_steps = legacySteps;
    }

    if (view === 'paywall' || view === 'full') {
      const paywallView = counts.paywall_view ?? 0;
      const purchase = counts.purchase ?? 0;

      // home_view{source:first_run} only — 'relaunch'/'menu' are returning
      // users and have nothing to do with the post-paywall branch.
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
      // The hard paywall's source value CHANGED: builds before the unification
      // sent 'practice_intro' on view, later ones send 'practice_gate_basic' to
      // match the dismiss side. Both are summed, or fixing the app would break
      // the very series the fix exists to protect. Any window spanning the
      // release legitimately contains both.
      const HARD_VIEW_SOURCES = ['practice_gate_basic', 'practice_intro'];
      const softView = viewBySource.post_first_experience ?? 0;
      const hardBySourceValue = Object.fromEntries(
        HARD_VIEW_SOURCES.map((k) => [k, viewBySource[k] ?? 0]).filter(([, v]) => v > 0),
      );
      const hardView = HARD_VIEW_SOURCES.reduce((sum, k) => sum + (viewBySource[k] ?? 0), 0);
      const otherViews = Object.entries(viewBySource)
        .filter(([k]) => k !== 'post_first_experience' && !HARD_VIEW_SOURCES.includes(k))
        .reduce((sum, [, v]) => sum + v, 0);

      result.paywall_by_type = {
        soft_onboarding: {
          source_value: 'post_first_experience',
          views: softView,
          dismisses: dismissBySource.post_first_experience ?? 0,
          role: 'Shown after the first practice. Informational — nearly everyone passes it.',
        },
        hard_practice_gate: {
          source_value: 'practice_gate_basic',
          views: hardView,
          views_by_source_value: hardBySourceValue,
          dismisses: dismissBySource.practice_gate_basic ?? 0,
          role: 'Shown on the fourth practice, once the three free ones are used. This is the decision point.',
          seam_note:
            "Views are the SUM of 'practice_gate_basic' and the older " +
            "'practice_intro'. Earlier builds labelled the view differently from " +
            'the dismiss of the same paywall, so the two could not be joined; the ' +
            'app now sends one value. views_by_source_value shows how the window ' +
            'splits across that seam.',
        },
        other_sources: otherViews ? { views: otherViews, values: Object.keys(viewBySource) } : undefined,
        // 101: purchase / trial_start by paywall_source, trial_outcome by outcome.
        // Same internal filter (incl. INTERNAL_MISLABELED_VERSIONS) as everything else.
        purchase_attribution: {
          ...(await paywallBreakdowns(win, baseFilter)),
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
