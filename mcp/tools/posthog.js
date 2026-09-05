/**
 * PostHog tools — property-sliced analytics HogQL can give and GA4 cannot.
 *
 * The five (see the brief):
 *   ph_breakdown  ⭐ one event split by one property — shares by UNIQUE USERS.
 *   ph_retention  cohort d1/d7/d30, optionally split by a property.
 *   ph_funnel     ordered funnel across events, optionally split by a property.
 *   ph_query      raw HogQL, SELECT-only, the escape valve.
 *   ph_events     what events PostHog actually receives, with frequency.
 *
 * House rules held throughout: READ-ONLY, AGGREGATE-ONLY (person_id counts
 * unique people, never leaves), every percentage carries its N, low_data flags a
 * denominator too small to mean anything. These do NOT replace funnel_review /
 * retention_review (GA4) — those stay the cross-cut numbers; these are the
 * property slices, and a divergence between the two sources is itself a signal.
 */

import {
  posthogMissing, hogql, safeEvent, safeProperty, sinceClause,
} from '../lib/sources/posthog.js';
import { clampSince, rate, ok, notConfigured, sourceError, LOW_DATA_N } from '../lib/shared.js';

const DATA_LAG_NOTE =
  'PostHog is near real-time, but autocapture/ingestion can lag a few minutes to ' +
  'an hour, so the current partial day is usually light. Counts are not sampled.';

const AGG_NOTE =
  'Aggregate-only: person_id is used to count unique people and is never returned.';

function phMissing() {
  return posthogMissing();
}

// ─────────────────────────────────────────────────────── ph_breakdown ────────

export const phBreakdownSchema = {
  name: 'ph_breakdown',
  description:
    'Split one event by one of its properties and get, per property value, the ' +
    'event count AND the number of UNIQUE users, with each value\'s share of ' +
    'users. The tool this server was asked for first: ' +
    'ph_breakdown event=results_view property=metrics_source answers "what share ' +
    'of sessions ran on an Apple Watch vs camera vs simulated" — a GA4-awkward ' +
    'cut that is one HogQL line here. Shares are by unique users, not events, so ' +
    'one heavy user cannot skew them. Read-only, aggregate-only.',
  inputSchema: {
    type: 'object',
    properties: {
      event: { type: 'string', description: 'Event name, e.g. "results_view".' },
      property: { type: 'string', description: 'Event property to split by, e.g. "metrics_source".' },
      since: { type: 'integer', description: 'Days back. Default 28.', default: 28 },
    },
    required: ['event', 'property'],
  },
};

export async function phBreakdown(args = {}) {
  const missing = phMissing();
  if (missing.length) return notConfigured('posthog', missing);
  let event, property;
  try { event = safeEvent(args.event); property = safeProperty(args.property); }
  catch (e) { return { ok: false, error: 'bad_argument', message: e.message }; }
  const days = clampSince(args.since);

  const q =
    `SELECT properties.${property} AS value, count() AS events, count(distinct person_id) AS users\n` +
    `FROM events\n` +
    `WHERE event = '${event}' AND ${sinceClause(days)}\n` +
    `GROUP BY value ORDER BY users DESC LIMIT 100`;

  try {
    const { rows } = await hogql(q, { name: `mcp ph_breakdown ${event}/${property}` });
    const totalUsers = rows.reduce((s, r) => s + Number(r.users || 0), 0);
    const totalEvents = rows.reduce((s, r) => s + Number(r.events || 0), 0);
    const breakdown = rows.map((r) => ({
      value: r.value === '' || r.value == null ? '(not set)' : String(r.value),
      users: Number(r.users || 0),
      events: Number(r.events || 0),
      share_of_users: rate(Number(r.users || 0), totalUsers),
    }));
    return ok({
      source: 'posthog',
      window_days: days,
      event,
      property,
      total_users: totalUsers,
      total_events: totalEvents,
      breakdown,
      low_data: totalUsers < LOW_DATA_N,
      notes: `Shares are by unique users. ${AGG_NOTE}`,
      data_lag_note: DATA_LAG_NOTE,
    });
  } catch (err) {
    return sourceError('posthog', err);
  }
}

// ──────────────────────────────────────────────────────── ph_retention ───────

export const phRetentionSchema = {
  name: 'ph_retention',
  description:
    'Cohort retention (d1/d7/d30) computed in PostHog, optionally split by an ' +
    'event property. Cohort day = a person\'s first event in the window; a person ' +
    'is retained at dN if they had a qualifying event exactly N days later. With ' +
    'breakdown=metrics_source you see retention separately for watch / camera / ' +
    'simulated — the cut GA4 will not give. Cohorts too young to have reached dN ' +
    'are excluded from that milestone\'s denominator, never counted as zero. ' +
    'Read-only, aggregate-only.',
  inputSchema: {
    type: 'object',
    properties: {
      since: { type: 'integer', description: 'Days back for the cohort window. Default 28.', default: 28 },
      event: { type: 'string', description: 'Event that counts as activity/return. Default: any event.' },
      breakdown: { type: 'string', description: 'Event property to split cohorts by, e.g. "metrics_source".' },
    },
  },
};

const MILESTONES = [1, 7, 30];

export async function phRetention(args = {}) {
  const missing = phMissing();
  if (missing.length) return notConfigured('posthog', missing);

  let event = null, breakdown = null;
  try {
    if (args.event) event = safeEvent(args.event);
    if (args.breakdown) breakdown = safeProperty(args.breakdown);
  } catch (e) { return { ok: false, error: 'bad_argument', message: e.message }; }
  const days = clampSince(args.since);
  const eventFilter = event ? ` AND event = '${event}'` : '';
  const bdSelect = breakdown ? `argMin(properties.${breakdown}, timestamp) AS value, ` : '';
  const bdGroup = breakdown ? 'value' : `''`;

  // first_seen: cohort day (+ breakdown value) per person.
  // activity: the distinct days each person was active.
  // A milestone dN is only credited to a person whose cohort_day + N has passed
  // (cohort_day <= today() - N), so a fresh cohort is excluded from dN's
  // denominator rather than dragging it to zero.
  const q =
    `WITH first_seen AS (\n` +
    `  SELECT person_id, ${bdSelect}min(toDate(timestamp)) AS cohort_day\n` +
    `  FROM events\n` +
    `  WHERE ${sinceClause(days)}${eventFilter}\n` +
    `  GROUP BY person_id\n` +
    `), activity AS (\n` +
    `  SELECT DISTINCT person_id, toDate(timestamp) AS d\n` +
    `  FROM events\n` +
    `  WHERE ${sinceClause(days)}${eventFilter}\n` +
    `)\n` +
    `SELECT ${breakdown ? 'fs.value AS value, ' : `'' AS value, `}\n` +
    `  count(distinct fs.person_id) AS cohort_size,\n` +
    MILESTONES.map((n) =>
      `  count(distinct if(fs.cohort_day <= today() - ${n}, fs.person_id, NULL)) AS elig_d${n},\n` +
      `  count(distinct if(a.d = fs.cohort_day + ${n}, fs.person_id, NULL)) AS ret_d${n}`,
    ).join(',\n') + `\n` +
    `FROM first_seen fs LEFT JOIN activity a ON fs.person_id = a.person_id\n` +
    `GROUP BY ${breakdown ? 'fs.value' : `''`} ORDER BY cohort_size DESC LIMIT 100`;

  try {
    const { rows } = await hogql(q, { name: 'mcp ph_retention' });
    const groups = rows.map((r) => {
      const g = {
        ...(breakdown ? { value: r.value === '' || r.value == null ? '(not set)' : String(r.value) } : {}),
        cohort_size: Number(r.cohort_size || 0),
      };
      for (const n of MILESTONES) {
        const elig = Number(r[`elig_d${n}`] || 0);
        const ret = Number(r[`ret_d${n}`] || 0);
        g[`d${n}`] = elig === 0
          ? { pct: null, n: null, of: 0, incomplete: true, reason: `no cohort is yet ${n}d old in this window` }
          : rate(ret, elig);
      }
      return g;
    });
    return ok({
      source: 'posthog',
      window_days: days,
      return_event: event ?? '(any event)',
      breakdown: breakdown ?? null,
      definition:
        'Cohort day = first event in window. dN = active exactly N days after cohort day. ' +
        'A milestone counts only cohorts old enough to have reached it (elig_dN).',
      groups,
      notes: AGG_NOTE,
      data_lag_note: DATA_LAG_NOTE,
    });
  } catch (err) {
    return sourceError('posthog', err);
  }
}

// ─────────────────────────────────────────────────────────── ph_funnel ───────

export const phFunnelSchema = {
  name: 'ph_funnel',
  description:
    'Ordered funnel across a list of events, computed with windowFunnel: per ' +
    'person, how far they got through the steps in order within the window. ' +
    'Optionally split by an event property to see whether one group (e.g. ' +
    'metrics_source=camera) drops earlier. Complements funnel_review (GA4) — same ' +
    'shape, but sliceable by property. Reports users reaching each step, plus ' +
    'step-to-step and from-top conversion. Read-only, aggregate-only.',
  inputSchema: {
    type: 'object',
    properties: {
      steps: {
        type: 'array', items: { type: 'string' }, minItems: 2,
        description: 'Ordered event names, e.g. ["results_view","paywall_view","purchase"].',
      },
      since: { type: 'integer', description: 'Days back. Default 28.', default: 28 },
      window_days: { type: 'integer', description: 'Max days from step 1 to the last step, per person. Default 7.', default: 7 },
      breakdown: { type: 'string', description: 'Event property to split by, e.g. "metrics_source".' },
    },
    required: ['steps'],
  },
};

export async function phFunnel(args = {}) {
  const missing = phMissing();
  if (missing.length) return notConfigured('posthog', missing);

  let steps, breakdown = null;
  try {
    if (!Array.isArray(args.steps) || args.steps.length < 2) throw new Error('steps must be an array of at least two event names');
    steps = args.steps.map(safeEvent);
    if (args.breakdown) breakdown = safeProperty(args.breakdown);
  } catch (e) { return { ok: false, error: 'bad_argument', message: e.message }; }
  const days = clampSince(args.since);
  const windowDays = Math.min(Math.max(Math.trunc(Number(args.window_days) || 7), 1), 365);
  const windowSecs = windowDays * 86400;

  const stepConds = steps.map((s) => `event = '${s}'`).join(', ');
  const inList = steps.map((s) => `'${s}'`).join(', ');
  const bdInner = breakdown ? `argMin(properties.${breakdown}, timestamp) AS value, ` : '';
  const levelCounts = steps.map((_, i) => `countIf(level >= ${i + 1}) AS step_${i + 1}`).join(',\n  ');

  const q =
    `SELECT ${breakdown ? 'value, ' : `'' AS value, `}\n  ` + levelCounts + `\n` +
    `FROM (\n` +
    `  SELECT person_id, ${bdInner}windowFunnel(${windowSecs})(timestamp, ${stepConds}) AS level\n` +
    `  FROM events\n` +
    `  WHERE event IN (${inList}) AND ${sinceClause(days)}\n` +
    `  GROUP BY person_id\n` +
    `)\n` +
    `GROUP BY ${breakdown ? 'value' : `''`} ORDER BY step_1 DESC LIMIT 100`;

  try {
    const { rows } = await hogql(q, { name: 'mcp ph_funnel' });
    const groups = rows.map((r) => {
      const counts = steps.map((_, i) => Number(r[`step_${i + 1}`] || 0));
      const top = counts[0] || 0;
      return {
        ...(breakdown ? { value: r.value === '' || r.value == null ? '(not set)' : String(r.value) } : {}),
        steps: steps.map((name, i) => ({
          step: i + 1,
          event: name,
          users: counts[i],
          from_prev: i === 0 ? { pct: 100, n: counts[i], of: counts[i] } : rate(counts[i], counts[i - 1]),
          from_top: rate(counts[i], top),
        })),
      };
    });
    return ok({
      source: 'posthog',
      window_days: days,
      funnel_window_days: windowDays,
      steps,
      breakdown: breakdown ?? null,
      method: 'windowFunnel — steps must occur in order, per person, within funnel_window_days.',
      groups,
      notes:
        `Counts are unique users reaching each step. With a breakdown, a person is ` +
        `bucketed by their earliest value of the property. ${AGG_NOTE}`,
      data_lag_note: DATA_LAG_NOTE,
    });
  } catch (err) {
    return sourceError('posthog', err);
  }
}

// ──────────────────────────────────────────────────────────── ph_query ───────

export const phQuerySchema = {
  name: 'ph_query',
  description:
    'Run a raw HogQL SELECT against the events table and get the rows back. The ' +
    'escape valve for property cuts the other tools do not cover — HogQL is SQL ' +
    'over events, with event properties at properties.<name> and unique people at ' +
    'count(distinct person_id). STRICTLY READ-ONLY: only SELECT (optionally a ' +
    'leading WITH) is accepted; INSERT/UPDATE/DELETE/ALTER/DROP and multiple ' +
    'statements are refused before the request is sent, not left to key scopes. ' +
    'Keep it aggregate — do not select raw person identifiers or emails.',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'A single HogQL SELECT, e.g. "SELECT event, count() FROM events GROUP BY event".' },
    },
    required: ['query'],
  },
};

export async function phQuery(args = {}) {
  const missing = phMissing();
  if (missing.length) return notConfigured('posthog', missing);
  const query = String(args.query ?? '');

  try {
    const { columns, rows } = await hogql(query, { name: 'mcp ph_query' });
    return ok({
      source: 'posthog',
      columns,
      row_count: rows.length,
      rows: rows.slice(0, 1000),
      truncated: rows.length > 1000,
      notes: `Read-only SELECT. ${AGG_NOTE} Prefer aggregates over row-level person data.`,
      data_lag_note: DATA_LAG_NOTE,
    });
  } catch (err) {
    // A read-only violation is a refusal, not a source failure — say so clearly.
    if (err?.read_only_violation) {
      return { ok: false, error: 'read_only_violation', message: err.message, source: 'posthog' };
    }
    return sourceError('posthog', err);
  }
}

// ─────────────────────────────────────────────────────────── ph_events ───────

export const phEventsSchema = {
  name: 'ph_events',
  description:
    'List the event names PostHog is actually receiving in the window, with event ' +
    'count and unique users each. Use it before slicing — PostHog can carry events ' +
    'GA4 does not (its own autocapture), and an event that fires here but appears ' +
    'in no analytics_catalog track() call is a likely gap. Read-only, aggregate-only.',
  inputSchema: {
    type: 'object',
    properties: {
      since: { type: 'integer', description: 'Days back. Default 28.', default: 28 },
    },
  },
};

export async function phEvents(args = {}) {
  const missing = phMissing();
  if (missing.length) return notConfigured('posthog', missing);
  const days = clampSince(args.since);

  const q =
    `SELECT event, count() AS events, count(distinct person_id) AS users\n` +
    `FROM events WHERE ${sinceClause(days)}\n` +
    `GROUP BY event ORDER BY events DESC LIMIT 200`;

  try {
    const { rows } = await hogql(q, { name: 'mcp ph_events' });
    return ok({
      source: 'posthog',
      window_days: days,
      event_count: rows.length,
      events: rows.map((r) => ({ event: r.event, events: Number(r.events || 0), users: Number(r.users || 0) })),
      notes: AGG_NOTE,
      data_lag_note: DATA_LAG_NOTE,
    });
  } catch (err) {
    return sourceError('posthog', err);
  }
}
