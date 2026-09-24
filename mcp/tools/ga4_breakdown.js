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
const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 250;

/**
 * Built-in GA4 fields (no colon) passed through verbatim instead of being
 * turned into customEvent:<name>. Before this, dimension=pagePath became
 * "customEvent:pagePath" and GA4 rejected it.
 */
const STANDARD_DIMS = new Set([
  'pagePath', 'landingPage', 'landingPagePlusQueryString', 'pageTitle', 'pageReferrer',
  'streamName', 'deviceCategory', 'country', 'sessionSource', 'sessionMedium',
  'sessionDefaultChannelGroup',
]);

/**
 * Stream filter on the built-in `platform` field ('web' | 'iOS' | 'Android') —
 * robust to whatever the data streams happen to be named. Without it, app
 * screens (e.g. CustomBridgeViewController) leak into site page reports.
 */
function streamFilter(stream) {
  if (stream === 'website') {
    return { filter: { fieldName: 'platform', stringFilter: { matchType: 'EXACT', value: 'web' } } };
  }
  if (stream === 'app') {
    return { filter: { fieldName: 'platform', inListFilter: { values: ['iOS', 'Android'] } } };
  }
  return null; // 'all'
}

/** Drop one or more countries by ISO code (countryId), e.g. "SG" or "SG,CN". */
function excludeCountryFilter(codes) {
  const list = String(codes ?? '').split(',').map((c) => c.trim().toUpperCase()).filter(Boolean);
  if (list.length === 0) return null;
  return { notExpression: { filter: { fieldName: 'countryId', inListFilter: { values: list } } } };
}

export const ga4BreakdownSchema = {
  name: 'ga4_breakdown',
  description:
    'Distribution of one event across one dimension, from GA4. For each ' +
    'dimension value: unique users (activeUsers) and event count, plus each ' +
    "value's share — by UNIQUE USERS, not events, so one heavy user cannot skew " +
    'it. The cut funnel_review/retention_review cannot give: e.g. ga4_breakdown ' +
    'event=results_view dimension=metrics_source → the watch/camera/simulated ' +
    'split. A bare dimension name is treated as an event-scoped custom dimension ' +
    '(customEvent:<name>), except standard GA4 fields (pagePath, landingPage, ' +
    'landingPagePlusQueryString, pageTitle, pageReferrer, streamName, deviceCategory, ' +
    'country, sessionSource, sessionMedium, sessionDefaultChannelGroup) which pass as-is; ' +
    'a colon-qualified field ("customUser:internal") is used verbatim. Filters: stream ' +
    '(website/app/all), exclude_country, internal. Optional conversion_event adds per-row ' +
    'converting users + rate. Read-only, aggregate-only.',
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
      stream: {
        type: 'string', enum: ['website', 'app', 'all'], default: 'all',
        description: "Data stream, via GA4 platform: 'website' = web only, 'app' = iOS/Android only, 'all' (default) = both.",
      },
      exclude_country: {
        type: 'string',
        description: 'ISO country code(s) to drop, comma-separated (e.g. "SG" — suspected bot desktop traffic).',
      },
      conversion_event: {
        type: 'string',
        description:
          'Optional. For every dimension value also return unique users who fired this event ' +
          '(same filters) and their share of that row’s users — e.g. event=page_view ' +
          'dimension=landingPage conversion_event=app_store_click stream=website → which entry page leads to the store.',
      },
      limit: { type: 'integer', default: DEFAULT_LIMIT, description: `Max rows, sorted by users. Default ${DEFAULT_LIMIT}, max ${MAX_LIMIT}.` },
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
  if (STANDARD_DIMS.has(raw)) {
    return { field: raw, assumed_custom_event: false, scope_used: 'other' };
  }
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
  const stream = ['website', 'app'].includes(args.stream) ? args.stream : 'all';
  const excludeCountry = args.exclude_country ? String(args.exclude_country) : null;
  const conversionEvent = args.conversion_event ? String(args.conversion_event).trim() : null;
  const limit = Math.min(Math.max(parseInt(args.limit ?? DEFAULT_LIMIT, 10) || DEFAULT_LIMIT, 1), MAX_LIMIT);

  const scopeFilters = [internalFilter(internal), streamFilter(stream), excludeCountryFilter(excludeCountry)];
  const reportFor = (eventName, rowLimit) => ({
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }],
    dimensions: [{ name: field }],
    metrics: [{ name: 'activeUsers' }, { name: 'eventCount' }],
    dimensionFilter: andFilters(eventNameFilter([eventName]), ...scopeFilters),
    // activeUsers is not additive across rows, so ordering by it is the closest
    // to "biggest group first"; the sum caveat is documented in the payload.
    orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
    limit: rowLimit,
  });

  try {
    const data = await runReport(reportFor(event, limit));
    // Conversion: same dimension + filters, the conversion event instead. Wider
    // row limit so a converting value outside the top-N is not read as zero.
    let convByValue = null;
    if (conversionEvent) {
      const conv = await runReport(reportFor(conversionEvent, MAX_LIMIT));
      convByValue = new Map((conv.rows ?? []).map((r) => [
        r.dimensionValues[0].value,
        { users: Number(r.metricValues[0].value || 0), events: Number(r.metricValues[1].value || 0) },
      ]));
    }
    const rows = (data.rows ?? []).map((r) => ({
      value: r.dimensionValues[0].value,
      users: Number(r.metricValues[0].value || 0),
      events: Number(r.metricValues[1].value || 0),
    }));

    const totalUsers = rows.reduce((s, r) => s + r.users, 0);
    const totalEvents = rows.reduce((s, r) => s + r.events, 0);
    const denom = metric === 'events' ? totalEvents : totalUsers;

    const breakdown = rows.map((r) => {
      const row = {
        value: r.value === '' ? '(empty)' : r.value,
        users: r.users,
        events: r.events,
        share: rate(metric === 'events' ? r.events : r.users, denom),
      };
      if (convByValue) {
        const c = convByValue.get(r.value) ?? { users: 0, events: 0 };
        row.conversion = { users: c.users, events: c.events, rate: rate(c.users, r.users) };
      }
      return row;
    });

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
      filters: { internal, stream, exclude_country: excludeCountry },
      limit,
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
    if (conversionEvent) {
      result.conversion_event = conversionEvent;
      result.conversion_total_users = [...convByValue.values()].reduce((sum, c) => sum + c.users, 0);
      result.conversion_note =
        `conversion.rate = users with ${conversionEvent} under this value ÷ users with ${event} under it. ` +
        'Session-scoped dimensions (landingPage, sessionSource…) attribute the conversion to the session ' +
        'it happened in; pagePath attributes it to the page the conversion event fired on.';
    }
    if (rows.length === limit) {
      result.truncated = true;
      result.truncated_note = `Showing the top ${limit} values by users; raise limit (max ${MAX_LIMIT}) for more.`;
    }

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
