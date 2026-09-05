/**
 * ga4_breakdown — one event split by one dimension, share by UNIQUE USERS.
 *
 * The gap it fills: funnel_review counts steps and retention_review counts
 * cohorts, but neither can answer "of the people who hit results_view, what
 * share were on an Apple Watch vs camera vs simulated?". That is a distribution
 * over a custom dimension (metrics_source) — a one-minute job in the GA4 Explore
 * UI, previously not reachable through a tool. (PostHog can't do it here either:
 * the app sends no events to PostHog.)
 *
 * TWO RULES, same as retention_review:
 *  - Share is by activeUsers, NOT eventCount. One watch user fires many
 *    results_view; an event-share would inflate watch. eventCount rides along
 *    for reference only.
 *  - Every share carries its N, and the whole breakdown is flagged low_data when
 *    the summed users are under LOW_DATA_N — at ~49 installs/month a percentage
 *    without its N is a trap.
 *
 * Custom event-scoped dimensions are addressed as `customEvent:<name>` (verified
 * against the app source and the funnel_review breakdowns already in this repo).
 */

import { ga4Missing, runReport, eventNameFilter, internalFilter, andFilters } from '../lib/sources/ga4.js';
import { clampSince, rate, ok, notConfigured, sourceError, DATA_LAG, LOW_DATA_N } from '../lib/shared.js';

const DEFAULT_SINCE = 90; // wider than the 28-day house default: August traffic collapse → tiny samples

export const ga4BreakdownSchema = {
  name: 'ga4_breakdown',
  description:
    'Distribution of one event across one dimension, from GA4. For each ' +
    'dimension value: unique users (activeUsers) and event count, plus each ' +
    "value's share — by UNIQUE USERS, not events, so one heavy user cannot skew " +
    'it. The cut funnel_review/retention_review cannot give: e.g. ga4_breakdown ' +
    'event=results_view dimension=metrics_source → the watch/camera/simulated ' +
    'split. A bare dimension name is treated as an event-scoped custom dimension ' +
    '(customEvent:<name>); pass a fully-qualified GA4 field (e.g. "country", ' +
    '"customUser:internal") with its colon to use it verbatim. Read-only, ' +
    'aggregate-only.',
  inputSchema: {
    type: 'object',
    properties: {
      event: { type: 'string', description: 'Event name to break down, e.g. "results_view".' },
      dimension: { type: 'string', description: 'Dimension to split by. Bare name → customEvent:<name>, e.g. "metrics_source".' },
      since: { type: 'integer', description: 'Days back. Default 90 (traffic is thin — a wider window is more honest).', default: DEFAULT_SINCE },
      metric: { type: 'string', enum: ['users', 'events'], default: 'users', description: 'Which metric the shares are computed on. Default users.' },
      internal: {
        type: 'string', enum: ['exclude', 'include', 'only'], default: 'exclude',
        description: "Own devices. 'exclude' (default) drops them.",
      },
    },
    required: ['event', 'dimension'],
  },
};

/**
 * How GA4 Data API addresses the dimension. A colon means the caller already
 * qualified it (customEvent:, customUser:, or a built-in that needs no prefix
 * passed verbatim); a bare name is an event-scoped custom dimension.
 */
function resolveDimension(name) {
  const raw = String(name).trim();
  if (raw.includes(':')) return { field: raw, assumed_custom_event: false };
  return { field: `customEvent:${raw}`, assumed_custom_event: true };
}

export async function ga4Breakdown(args = {}) {
  const missing = ga4Missing();
  if (missing.length) return notConfigured('ga4', missing);

  const event = String(args.event ?? '').trim();
  const dimensionArg = String(args.dimension ?? '').trim();
  if (!event) return { ok: false, error: 'bad_argument', message: 'event is required' };
  if (!dimensionArg) return { ok: false, error: 'bad_argument', message: 'dimension is required' };

  const days = clampSince(args.since ?? DEFAULT_SINCE);
  const metric = args.metric === 'events' ? 'events' : 'users';
  const internal = args.internal || 'exclude';
  const { field, assumed_custom_event } = resolveDimension(dimensionArg);

  const body = {
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
    dimensions: [{ name: field }],
    metrics: [{ name: 'activeUsers' }, { name: 'eventCount' }],
    dimensionFilter: andFilters(eventNameFilter([event]), internalFilter(internal)),
    // activeUsers is not additive across rows, so ordering by it is the closest
    // to "biggest group first"; the sum caveat is documented in the payload.
    orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
    limit: 250,
  };

  try {
    const data = await runReport(body);
    const rows = (data.rows ?? []).map((r) => ({
      value: r.dimensionValues[0].value,
      users: Number(r.metricValues[0].value || 0),
      events: Number(r.metricValues[1].value || 0),
    }));

    const totalUsers = rows.reduce((s, r) => s + r.users, 0);
    const totalEvents = rows.reduce((s, r) => s + r.events, 0);
    const denom = metric === 'events' ? totalEvents : totalUsers;

    const breakdown = rows.map((r) => ({
      value: r.value === '' ? '(empty)' : r.value,
      users: r.users,
      events: r.events,
      share: rate(metric === 'events' ? r.events : r.users, denom),
    }));

    // All rows (not set) ⇒ the dimension is almost certainly mis-addressed —
    // wrong name, or not an event-scoped custom dimension. Say so; do NOT present
    // a single "(not set): 100%" row as if it were the real distribution.
    const nonEmpty = rows.filter((r) => r.value && r.value !== '(not set)');
    const allNotSet = rows.length > 0 && nonEmpty.length === 0;

    const result = {
      source: 'ga4',
      window_days: days,
      event,
      dimension: { requested: dimensionArg, ga4_field: field, assumed_custom_event },
      share_metric: metric,
      filters: { internal },
      total_users: totalUsers,
      total_events: totalEvents,
      breakdown,
      low_data: denom < LOW_DATA_N,
      notes:
        'Shares are of the summed per-value ' + (metric === 'events' ? 'events' : 'activeUsers') +
        '. activeUsers is de-duplicated within each value but not across values, so a user ' +
        'active under two values is counted in both — shares still sum to 100% but the ' +
        'denominator can slightly exceed the true unique total. eventCount is reference-only.',
      data_lag_note: DATA_LAG.ga4,
    };

    if (rows.length === 0) {
      result.empty = true;
      result.empty_note =
        `No rows: either no ${event} events in the last ${days} days, or the event name is wrong. ` +
        'This is "no data", not a zero distribution.';
    }
    if (allNotSet) {
      result.dimension_misconfigured = true;
      result.dimension_warning =
        `Every row is "(not set)" for ${field}. The dimension is almost certainly addressed ` +
        `wrong — check that "${dimensionArg}" is a registered event-scoped custom dimension ` +
        `(then it is customEvent:${dimensionArg}) and that ${event} actually carries it. ` +
        'Not presenting this as a real distribution.';
    }

    return ok(result);
  } catch (err) {
    // Gaxios buries the API's reason in err.response.data — lift it so a bad
    // dimension/filter explains itself instead of a bare 400.
    const status = err?.response?.status ?? err?.status;
    if (status !== undefined) err.status = status;
    const payload = err?.response?.data;
    if (payload && !err.body_snippet) {
      err.body_snippet = (typeof payload === 'string' ? payload : JSON.stringify(payload)).slice(0, 400);
    }
    return sourceError('ga4', err);
  }
}
