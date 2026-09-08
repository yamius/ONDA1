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
 * User-scoped custom dimensions (e.g. `internal`, the internal-traffic label)
 * are addressed as `customUser:<name>` — pass `scope: 'user'`, or rely on the
 * known-user-dims list below. The scope actually used is reported as scope_used.
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
      dimension: { type: 'string', description: 'Dimension to split by. Bare name → customEvent:<name>, e.g. "metrics_source"; a fully-qualified field with a colon (e.g. "customUser:internal", "country") is used verbatim.' },
      scope: {
        type: 'string', enum: ['event', 'user'], default: 'event',
        description:
          "Custom-dimension scope for a BARE dimension name. 'event' (default) → customEvent:<name>. " +
          "'user' → customUser:<name> — a per-user dimension (e.g. 'internal'), which counts unique " +
          'users all-time rather than events. Known user-scoped dims (internal) resolve to user on ' +
          'their own; an explicit scope overrides that. Ignored when the dimension is already colon-qualified.',
      },
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
 * Custom dimensions known to be USER-scoped in this GA4 property. A bare name
 * matching this list is addressed as customUser: without needing scope='user'.
 * `internal` is the internal-traffic label (7 taps on the version in Menu →
 * user property) that retention filtering depends on.
 */
const KNOWN_USER_DIMS = new Set(['internal']);

/**
 * How GA4 Data API addresses the dimension, and which scope that is.
 *  - A colon means the caller already qualified it (customEvent:, customUser:,
 *    or a built-in) — used verbatim; scope inferred from the prefix.
 *  - A bare name is a custom dimension: user-scoped when an explicit scope says
 *    so or it is a known user-dim, otherwise event-scoped (the default).
 * `explicitScope` is 'event' | 'user' | null (null = caller passed nothing).
 */
function resolveDimension(name, explicitScope) {
  const raw = String(name).trim();
  if (raw.includes(':')) {
    const scope_used = raw.startsWith('customUser:') ? 'user'
      : raw.startsWith('customEvent:') ? 'event'
      : 'other'; // built-in dimension (country, deviceCategory, …)
    return { field: raw, assumed_custom_event: false, scope_used };
  }
  const scope_used = explicitScope
    ? explicitScope
    : KNOWN_USER_DIMS.has(raw.toLowerCase()) ? 'user' : 'event';
  const field = scope_used === 'user' ? `customUser:${raw}` : `customEvent:${raw}`;
  // "assumed" = we defaulted to event-scoped without being told; a user might
  // have meant a user-scoped or built-in dimension.
  return { field, assumed_custom_event: scope_used === 'event' && !explicitScope, scope_used };
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
  const explicitScope = args.scope === 'user' || args.scope === 'event' ? args.scope : null;
  const { field, assumed_custom_event, scope_used } = resolveDimension(dimensionArg, explicitScope);

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
      scope_used,
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
      const scopeHint = scope_used === 'user'
        ? `check that "${dimensionArg}" is a registered USER-scoped custom dimension (then it is ` +
          `customUser:${dimensionArg}); if it is actually event-scoped, drop scope=user`
        : scope_used === 'event'
          ? `check that "${dimensionArg}" is a registered EVENT-scoped custom dimension (then it is ` +
            `customEvent:${dimensionArg}) and that ${event} actually carries it — if it is a ` +
            `per-user dimension, pass scope=user`
          : `check that "${field}" is a valid GA4 field`;
      result.dimension_warning =
        `Every row is "(not set)" for ${field}. The dimension is almost certainly addressed wrong — ` +
        `${scopeHint}. Not presenting this as a real distribution.`;
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
