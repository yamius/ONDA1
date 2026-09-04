/**
 * Parsers over ONDA product source. Pure functions on text — no network, no fs —
 * so they are unit-testable against fixtures and reusable by the tools.
 *
 * These parse SOURCE, not structured data, so they follow the same honesty rule
 * as organic_sources / purchase_attribution: report what was parsed AND what was
 * not, never present a partial table as complete. Every parser returns an
 * `unparsed` list alongside its results.
 */

// ─────────────────────────────────────────────────────────── locales ────────

/** Resolve a dotted key through nested i18next JSON. Returns undefined if absent. */
export function resolveKey(obj, dottedKey) {
  let cur = obj;
  for (const seg of String(dottedKey).split('.')) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = cur[seg];
  }
  return typeof cur === 'string' ? cur : cur === undefined ? undefined : cur;
}

/**
 * One key across every locale. `locales` is { en: obj, uk: obj, ... }.
 * Reports which locales HAVE the key and which are MISSING it — locale drift
 * must be visible, not silently blank.
 */
export function lookupKey(locales, dottedKey) {
  const values = {};
  const missing = [];
  for (const [loc, obj] of Object.entries(locales)) {
    const v = resolveKey(obj, dottedKey);
    if (v === undefined) missing.push(loc);
    else values[loc] = v;
  }
  return { key: dottedKey, values, present_in: Object.keys(values), missing_in: missing, fully_localised: missing.length === 0 };
}

/** Every leaf key under a prefix (or all), as dotted paths — for prefix search. */
export function flattenKeys(obj, prefix = '') {
  const out = [];
  for (const [k, v] of Object.entries(obj ?? {})) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) out.push(...flattenKeys(v, key));
    else out.push(key);
  }
  return out;
}

// ─────────────────────────────────────────────────────────── practices ──────

// One practice literal, all on its own line, e.g.
//   { id: 'p1-1', name: t('practice_items.micro_breath'), duration: t('...'), maxQnt: 10, desc: t('...') }
const PRACTICE_RE =
  /\{\s*id:\s*'(p\d+-\d+)',\s*name:\s*t\('([^']+)'\),\s*duration:\s*t\('([^']+)'\),\s*maxQnt:\s*(\d+),\s*desc:\s*t\('([^']+)'\)\s*\}/;
// A line that is CLEARLY meant to be a practice (starts a practice literal) —
// used to catch lines the strict regex missed, so they surface as unparsed.
const PRACTICE_HINT_RE = /^\s*\{\s*id:\s*'p\d+-\d+'/;
// Circuit header: id + its name/subtitle keys + element.
const CIRCUIT_NAME_RE = /name:\s*t\('(circuits\.circuit_(\d+)_name)'\)/;
const ELEMENT_RE = /element:\s*'([^']+)'/;

/**
 * Parse the circuits array into practices with their circuit context.
 *
 * The circuit number is taken from the practice id (`p<circuit>-<n>`), so the
 * result does not depend on brace-tracking the nested array — robust to
 * reformatting. `freeIds` marks which practices sit before the hard paywall.
 */
export function parsePractices(source, { freeIds = [] } = {}) {
  const lines = source.split('\n');
  const circuits = {}; // number -> { name_key, element }
  let lastElement = null;
  let lastCircuitNum = null;

  const practices = [];
  const unparsed = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const cm = line.match(CIRCUIT_NAME_RE);
    if (cm) { lastCircuitNum = Number(cm[2]); circuits[lastCircuitNum] = { name_key: cm[1], element: null }; }
    const em = line.match(ELEMENT_RE);
    if (em && lastCircuitNum != null && circuits[lastCircuitNum] && !circuits[lastCircuitNum].element) {
      circuits[lastCircuitNum].element = em[1];
      lastElement = em[1];
    }

    const m = line.match(PRACTICE_RE);
    if (m) {
      const [, id, nameKey, durationKey, maxQnt, descKey] = m;
      const circuitNum = Number(id.match(/^p(\d+)-/)[1]);
      practices.push({
        id,
        circuit: circuitNum,
        element: circuits[circuitNum]?.element ?? null,
        name_key: nameKey,
        duration_key: durationKey,
        desc_key: descKey,
        max_ond: Number(maxQnt),
        free: freeIds.includes(id),
        line: i + 1,
      });
    } else if (PRACTICE_HINT_RE.test(line)) {
      // Looks like a practice but the strict shape did not match — surface it.
      unparsed.push({ line: i + 1, text: line.trim().slice(0, 160) });
    }
  }

  return { practices, circuits, unparsed };
}

// ────────────────────────────────────────────────────────── track calls ─────

const CALL_START_RE = /\b(track|trackEvent)\(\s*(['"])([a-z0-9_]+)\2/gi;

/** Classify a value expression as a literal or a runtime expression. */
function classifyValue(raw) {
  const v = raw.trim().replace(/,\s*$/, '');
  const str = v.match(/^(['"])(.*)\1$/);
  if (str) return { kind: 'literal', value: str[2] };
  if (/^-?\d+(\.\d+)?$/.test(v)) return { kind: 'literal', value: Number(v) };
  if (v === 'true' || v === 'false') return { kind: 'literal', value: v === 'true' };
  return { kind: 'expr', value: v.slice(0, 80) };
}

/**
 * Strip // line and block comments, string-aware, so a comment between params
 * does not swallow the pair after it. A `//` inside a string literal is kept.
 */
function stripComments(s) {
  let out = '', inStr = null;
  for (let i = 0; i < s.length; i++) {
    const c = s[i], n = s[i + 1];
    if (inStr) { out += c; if (c === inStr && s[i - 1] !== '\\') inStr = null; continue; }
    if (c === "'" || c === '"' || c === '`') { inStr = c; out += c; continue; }
    if (c === '/' && n === '/') { while (i < s.length && s[i] !== '\n') i++; out += '\n'; continue; }
    if (c === '/' && n === '*') { i += 2; while (i < s.length && !(s[i] === '*' && s[i + 1] === '/')) i++; i++; continue; }
    out += c;
  }
  return out;
}

/**
 * Split the top level of a params object body into key/value pairs, respecting
 * nested braces/brackets/parens and strings so a ternary or a nested object
 * does not break the split.
 */
function splitTopLevel(body) {
  const parts = [];
  let depth = 0, start = 0, inStr = null;
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (inStr) { if (c === inStr && body[i - 1] !== '\\') inStr = null; continue; }
    if (c === "'" || c === '"' || c === '`') { inStr = c; continue; }
    if ('{[('.includes(c)) depth++;
    else if ('}])'.includes(c)) depth--;
    else if (c === ',' && depth === 0) { parts.push(body.slice(start, i)); start = i + 1; }
  }
  if (start < body.length) parts.push(body.slice(start));
  return parts.map((p) => p.trim()).filter(Boolean);
}

/**
 * Extract every track()/trackEvent() call from one source file: event name,
 * line, and its params with literal values resolved and runtime values marked
 * `<expr>`. A call whose params object cannot be brace-matched is reported in
 * `unparsed`, never dropped.
 */
export function parseTrackCalls(source, filePath = '') {
  const calls = [];
  const unparsed = [];
  const lineOf = (idx) => source.slice(0, idx).split('\n').length;

  for (const m of source.matchAll(CALL_START_RE)) {
    const event = m[3];
    const afterName = m.index + m[0].length;
    const rest = source.slice(afterName);
    const comma = rest.match(/^\s*,\s*\{/);
    if (!comma) {
      // No params object — track('x') or track('x', someVar).
      const bare = rest.match(/^\s*,\s*([^)\n]+)\)/);
      calls.push({
        event, file: filePath, line: lineOf(m.index),
        params: bare ? { _value: { kind: 'expr', value: bare[1].trim().slice(0, 80) } } : {},
      });
      continue;
    }
    // Brace-match the params object.
    const objStart = afterName + comma[0].length - 1; // at the '{'
    let depth = 0, end = -1, inStr = null;
    for (let i = objStart; i < source.length; i++) {
      const c = source[i];
      if (inStr) { if (c === inStr && source[i - 1] !== '\\') inStr = null; continue; }
      if (c === "'" || c === '"' || c === '`') { inStr = c; continue; }
      if (c === '{') depth++;
      else if (c === '}') { depth--; if (depth === 0) { end = i; break; } }
    }
    if (end === -1) {
      unparsed.push({ event, file: filePath, line: lineOf(m.index), reason: 'params object not brace-matched' });
      continue;
    }
    const body = stripComments(source.slice(objStart + 1, end));
    const params = {};
    for (const pair of splitTopLevel(body)) {
      const kv = pair.match(/^([A-Za-z0-9_]+|\[[^\]]+\]|(['"]).*?\2)\s*:\s*([\s\S]+)$/);
      if (kv) {
        const key = kv[1].replace(/^['"]|['"]$/g, '');
        params[key] = classifyValue(kv[3]);
      } else if (/^\.\.\./.test(pair)) {
        params[pair.trim().slice(0, 40)] = { kind: 'spread', value: pair.trim().slice(0, 80) };
      } else if (/^[A-Za-z0-9_]+$/.test(pair)) {
        params[pair] = { kind: 'shorthand', value: pair }; // { platform }
      }
    }
    calls.push({ event, file: filePath, line: lineOf(m.index), params });
  }
  return { calls, unparsed };
}
