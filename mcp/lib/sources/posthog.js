/**
 * PostHog source — HogQL Query API (us.posthog.com).
 *
 * Why this exists alongside the GA4 tools: GA4 answers "how many", PostHog
 * answers "how many, split by any event property, without sampling". The live
 * question that forced it — what share of results_view fires with metrics_source
 * = watch vs camera vs simulated — is one HogQL line here and a fight in GA4.
 *
 * READ-ONLY BY CONSTRUCTION. Every query passes assertSelectOnly() before it
 * leaves the process; a personal API key's own permissions are NOT relied on.
 * AGGREGATE-ONLY: person_id is used to COUNT unique people, never returned.
 *
 * Request shape (verified against the PostHog Query API docs, not memory):
 *   POST {host}/api/projects/{project}/query/
 *   body   { query: { kind: 'HogQLQuery', query: 'SELECT ...' }, name? }
 *   header Authorization: Bearer <personal api key>
 *   reply  { results: any[][], columns: string[], types: string[], hogql, ... }
 *          results is an array of ROW arrays; columns names them in order.
 */

import { postJson } from '../http.js';

const DEFAULT_HOST = 'https://us.posthog.com';
const DEFAULT_PROJECT = '462907';

function host() {
  return (process.env.POSTHOG_HOST || DEFAULT_HOST).replace(/\/+$/, '');
}
function project() {
  return process.env.POSTHOG_PROJECT_ID || DEFAULT_PROJECT;
}

/**
 * Only the API key is truly required — host and project id both default to the
 * ONDA values, so a key alone is enough to run. Reported so check_status and
 * every tool can say `not_configured` with the exact missing name.
 */
export function posthogMissing() {
  const missing = [];
  if (!process.env.POSTHOG_API_KEY) missing.push('POSTHOG_API_KEY');
  return missing;
}

// ─────────────────────────────────────────────── read-only enforcement ───────

// A single forbidden keyword anywhere (outside strings/comments) rejects the
// query. HogQL has no write surface, but the guard does not trust that — nor the
// key's scopes. The list is a superset of the task's INSERT/UPDATE/DELETE/ALTER/
// DROP so DDL/DML in any form is refused before a byte is sent.
const FORBIDDEN = /\b(INSERT|UPDATE|DELETE|ALTER|DROP|CREATE|TRUNCATE|REPLACE|MERGE|GRANT|REVOKE|ATTACH|DETACH|OPTIMIZE|RENAME|SYSTEM|CALL|EXEC)\b/i;

/** Remove string literals and comments so keywords/;'s inside them don't trip the guard. */
function stripStringsAndComments(sql) {
  let out = '';
  let i = 0;
  const s = String(sql);
  while (i < s.length) {
    const c = s[i];
    const n = s[i + 1];
    if (c === '-' && n === '-') { while (i < s.length && s[i] !== '\n') i++; continue; }
    if (c === '/' && n === '*') { i += 2; while (i < s.length && !(s[i] === '*' && s[i + 1] === '/')) i++; i += 2; continue; }
    if (c === "'" || c === '"' || c === '`') {
      const q = c; i++;
      while (i < s.length) { if (s[i] === '\\') { i += 2; continue; } if (s[i] === q) { i++; break; } i++; }
      out += ' '; // collapse the literal to whitespace
      continue;
    }
    out += c; i++;
  }
  return out;
}

/**
 * Throw unless `query` is a single read-only SELECT (a leading WITH … SELECT is
 * fine). Rejects multiple statements — `SELECT 1; DROP …` must not sneak the
 * second past a "starts with SELECT" check.
 */
export function assertSelectOnly(query) {
  const cleaned = stripStringsAndComments(query).trim().replace(/;\s*$/, '');
  if (!cleaned) throw readOnlyError('empty query');
  if (cleaned.includes(';')) throw readOnlyError('multiple statements are not allowed — send one SELECT');
  if (!/^\s*(with|select)\b/i.test(cleaned)) throw readOnlyError('only SELECT queries are allowed (may start with WITH)');
  const m = cleaned.match(FORBIDDEN);
  if (m) throw readOnlyError(`the keyword "${m[1].toUpperCase()}" is not allowed — this endpoint is read-only`);
}

function readOnlyError(reason) {
  const e = new Error(`read_only_violation: ${reason}`);
  e.read_only_violation = true;
  return e;
}

// ─────────────────────────────────────────────────── identifier safety ───────

// event/property names are interpolated into HogQL, so they are constrained to a
// safe charset rather than escaped. App event and property names are snake_case;
// $ and . cover PostHog's own ($os, $set.x) shapes.
const EVENT_RE = /^[A-Za-z0-9_$.\- ]{1,80}$/;
const PROP_RE = /^[A-Za-z0-9_$]{1,80}$/;

export function safeEvent(name) {
  const v = String(name ?? '');
  if (!EVENT_RE.test(v)) throw new Error(`invalid event name: ${JSON.stringify(v).slice(0, 60)}`);
  return v;
}
export function safeProperty(name) {
  const v = String(name ?? '');
  if (!PROP_RE.test(v)) throw new Error(`invalid property name: ${JSON.stringify(v).slice(0, 60)} (letters, digits, _ and $ only)`);
  return v;
}

// ──────────────────────────────────────────────────────────── runner ─────────

/**
 * Run a HogQL query and return rows both as raw arrays and as objects keyed by
 * the returned column names. Enforces read-only first.
 */
export async function hogql(query, { name } = {}) {
  assertSelectOnly(query);
  const url = `${host()}/api/projects/${project()}/query/`;
  const data = await postJson(
    url,
    { query: { kind: 'HogQLQuery', query }, ...(name ? { name } : {}) },
    { headers: { Authorization: `Bearer ${process.env.POSTHOG_API_KEY}` }, source: 'posthog' },
  );
  const columns = Array.isArray(data.columns) ? data.columns : [];
  const results = Array.isArray(data.results) ? data.results : [];
  const rows = results.map((r) => Object.fromEntries(columns.map((c, i) => [c, r?.[i]])));
  return { columns, results, rows, hogql: data.hogql };
}

/**
 * Relative time filter on events.timestamp. Uses the exact form PostHog's HogQL
 * docs recommend (`now() - interval N day`); n is a clamped integer so nothing
 * is interpolated but a number.
 */
export function sinceClause(days) {
  return `timestamp >= now() - interval ${Math.trunc(days)} day`;
}

/**
 * Cheap liveness probe for check_status: proves the key authenticates and the
 * project answers, without touching event data. `SELECT 1` passes the read-only
 * guard and returns instantly.
 */
export async function posthogProbe() {
  await hogql('SELECT 1', { name: 'mcp check_status probe' });
  return { ok: true, project: project(), host: host() };
}
