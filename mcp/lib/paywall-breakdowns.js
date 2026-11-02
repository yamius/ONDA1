/**
 * Task 101: purchase / trial_start by paywall_source, trial_outcome by outcome.
 *
 * Both params are sent by the app from 1.9.7 (purchase.paywall_source already
 * from 1.9.6, from a localStorage stash). They are only queryable once the
 * matching GA4 custom dimension (EVENT scope) is registered; GA4 rejects an
 * unregistered `customEvent:<name>` with a 400, which is reported as
 * available:false with the exact thing to create instead of a guess.
 */
import { runReport, andFilters, eventNameFilter } from './sources/ga4.js';

export function missingDimensionReason(name) {
  return `create GA4 custom dimension ${name} (event scope)`;
}

/** users + events for one event split by one event-scoped custom dimension. */
export async function dimBreakdown(win, baseFilter, eventName, paramName) {
  try {
    const data = await runReport({
      dateRanges: [{ startDate: win.start_date, endDate: win.end_date }],
      dimensions: [{ name: `customEvent:${paramName}` }],
      metrics: [{ name: 'totalUsers' }, { name: 'eventCount' }],
      dimensionFilter: andFilters(baseFilter, eventNameFilter([eventName])),
      limit: 50,
    });
    const by_value = {};
    for (const row of data?.rows ?? []) {
      by_value[row.dimensionValues[0].value] = {
        users: Number(row.metricValues?.[0]?.value || 0),
        events: Number(row.metricValues?.[1]?.value || 0),
      };
    }
    return { available: true, event: eventName, dimension: paramName, by_value };
  } catch (err) {
    const status = err?.response?.status ?? err?.status;
    return {
      available: false,
      event: eventName,
      dimension: paramName,
      reason: missingDimensionReason(paramName),
      detail: `GA4 rejected customEvent:${paramName}${status ? ` (HTTP ${status})` : ''}: ` +
        String(err?.response?.data?.error?.message ?? err?.message ?? err).slice(0, 200),
    };
  }
}

/** The three task-101 breakdowns, side by side. */
export async function paywallBreakdowns(win, baseFilter) {
  const [purchase, trialStart, trialOutcome] = await Promise.all([
    dimBreakdown(win, baseFilter, 'purchase', 'paywall_source'),
    dimBreakdown(win, baseFilter, 'trial_start', 'paywall_source'),
    dimBreakdown(win, baseFilter, 'trial_outcome', 'outcome'),
  ]);
  return {
    purchase_by_paywall_source: purchase,
    trial_start_by_paywall_source: trialStart,
    trial_outcome_by_outcome: trialOutcome,
    note:
      "paywall_source = the last paywall_view's source before the event ('unknown' = no paywall " +
      'seen on this install; (not set) = builds before the param). purchase.paywall_source exists ' +
      'from 1.9.6, trial_start.paywall_source and trial_outcome from 1.9.7. trial_outcome fires only ' +
      'when the user opens the app after the trial is decided — it UNDERCOUNTS vs RevenueCat.',
  };
}
