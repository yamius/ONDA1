/**
 * Product-structure tools: copy_lookup, analytics_catalog, practice_catalog.
 * READ-ONLY, reading live product source from GitHub (lib/github.js).
 *
 * The line each draws (per the brief): a tool is justified ONLY when it gathers
 * what is SCATTERED — copy_lookup across five locale files, analytics_catalog
 * across a whole source file's call sites, practice_catalog across a large
 * inline array. Anything that sits in one place and reads once stays with
 * read_file; these do not become a wrapper around every file.
 *
 * All three parse SOURCE, so each reports what it could NOT parse rather than
 * presenting a partial result as complete.
 */

import { readFile, readReadableFiles, GithubError } from '../lib/github.js';
import { lookupKey, flattenKeys, parsePractices, parseTrackCalls, resolveKey } from '../lib/productParse.js';
import { ok } from '../lib/shared.js';

const LOCALES = ['en', 'uk', 'ru', 'es', 'zh'];
const MAIN_FILE = 'src/onda-level1-demo_27.tsx';
const FREE_IDS = ['p1-1', 'p1-2', 'p1-3']; // FREE_PRACTICE_IDS in the app

function failure(err) {
  if (err instanceof GithubError) {
    const { message, ...rest } = err;
    return { ok: false, error: err.code ?? 'github_error', message: err.message, ...rest };
  }
  return { ok: false, error: 'tool_failed', message: String(err?.message ?? err).slice(0, 300) };
}

let _localeCache = null;
async function loadLocales() {
  if (_localeCache && Date.now() - _localeCache.at < 60_000) return _localeCache.data;
  const data = {};
  const failed = {};
  await Promise.all(LOCALES.map(async (loc) => {
    try {
      const r = await readFile(`public/locales/${loc}/translation.json`);
      data[loc] = JSON.parse(r.content);
    } catch (err) {
      failed[loc] = err.message;
    }
  }));
  _localeCache = { at: Date.now(), data, failed };
  return data;
}

// ────────────────────────────────────────────────────────── copy_lookup ─────

export const copyLookupSchema = {
  name: 'copy_lookup',
  description:
    'Look up a translation key across all five ONDA locales (en/uk/ru/es/zh) at ' +
    'once, so copy can be compared without opening five files. A key present in ' +
    'some locales but not others is flagged — locale drift is made visible. Pass ' +
    'a key ending in "." or a bare prefix to list matching keys. Read-only.',
  inputSchema: {
    type: 'object',
    properties: {
      key: { type: 'string', description: 'Dotted key, e.g. "practices.result_a", or a prefix like "practice_items.".' },
      locale: { type: 'string', enum: LOCALES, description: 'Restrict to one locale. Default: all five.' },
    },
    required: ['key'],
  },
};

export async function copyLookupTool(args = {}) {
  try {
    const locales = await loadLocales();
    if (Object.keys(locales).length === 0) return { ok: false, error: 'no_locales', message: 'could not load any locale file' };
    const key = String(args.key ?? '');

    // Prefix mode: a trailing dot, or a key that resolves to an object.
    const enResolved = resolveKey(locales.en ?? Object.values(locales)[0], key.replace(/\.$/, ''));
    const isPrefix = key.endsWith('.') || (enResolved && typeof enResolved === 'object');
    if (isPrefix) {
      const base = key.replace(/\.$/, '');
      const ref = locales.en ?? Object.values(locales)[0];
      const sub = base ? resolveKey(ref, base) : ref;
      const keys = (sub && typeof sub === 'object' ? flattenKeys(sub, base) : []).slice(0, 200);
      return ok({
        source: 'github:main (live)',
        mode: 'prefix',
        prefix: base,
        key_count: keys.length,
        keys,
        note: 'Prefix match — call copy_lookup on a specific key to see its values across locales.',
      });
    }

    const wanted = args.locale ? { [args.locale]: locales[args.locale] } : locales;
    const result = lookupKey(wanted, key);
    return ok({
      source: 'github:main (live)',
      mode: 'lookup',
      ...result,
      drift_note: result.fully_localised ? undefined : `Missing in: ${result.missing_in.join(', ')} — locale drift.`,
    });
  } catch (err) {
    return failure(err);
  }
}

// ───────────────────────────────────────────────────── analytics_catalog ────

export const analyticsCatalogSchema = {
  name: 'analytics_catalog',
  description:
    'Map every track()/trackEvent() call in the app source: event name, file and ' +
    'line, and its params with literal values resolved and runtime values marked ' +
    'as expressions. Answers "what does this event actually mean and where does ' +
    'it fire" — e.g. paywall_view fires from TWO sites with different `source`. ' +
    'Not a substitute for funnel_review (which counts events); this shows their ' +
    'shape. Read-only.',
  inputSchema: {
    type: 'object',
    properties: {
      event: { type: 'string', description: 'Filter to one event name, e.g. "paywall_view". Omit for the full catalog.' },
    },
  },
};

export async function analyticsCatalogTool(args = {}) {
  try {
    const files = await readReadableFiles({ pathPrefix: 'src' });
    const all = [];
    const unparsed = [];
    for (const { path, content } of files) {
      if (!/\btrack(Event)?\(/.test(content)) continue;
      const { calls, unparsed: u } = parseTrackCalls(content, path);
      all.push(...calls);
      unparsed.push(...u);
    }

    const filtered = args.event ? all.filter((c) => c.event === args.event) : all;

    // Group by event so the two-paywall shape reads at a glance.
    const byEvent = {};
    for (const c of filtered) {
      (byEvent[c.event] ??= []).push({
        file: c.file,
        line: c.line,
        params: Object.fromEntries(Object.entries(c.params).map(([k, v]) => [k, v.kind === 'literal' ? v.value : `<${v.kind}:${v.value}>`])),
      });
    }

    return ok({
      source: 'github:main (live)',
      files_scanned: files.length,
      event_filter: args.event ?? null,
      event_count: Object.keys(byEvent).length,
      call_count: filtered.length,
      events: byEvent,
      unparsed,
      unparsed_note: unparsed.length
        ? `${unparsed.length} call(s) could not be parsed and are listed above — not silently dropped.`
        : 'Every track() call in scope was parsed.',
      scope_note:
        'Scans track()/trackEvent() in src/ (the System-A path into GA4/Firebase). ' +
        'Tenjin-native sends (trackTenjin*) use a separate name pool and are not included.',
    });
  } catch (err) {
    return failure(err);
  }
}

// ───────────────────────────────────────────────────── practice_catalog ─────

export const practiceCatalogSchema = {
  name: 'practice_catalog',
  description:
    'The practices from the circuits array as a table: id, circuit, element, ' +
    'name (resolved from locales), duration, max OND, and whether the practice is ' +
    'free or behind the paywall. free_only=true returns exactly the three free ' +
    'practices. Read-only.',
  inputSchema: {
    type: 'object',
    properties: {
      practice_id: { type: 'string', description: 'Filter to one practice, e.g. "p1-4".' },
      free_only: { type: 'boolean', description: 'Only the free-tier practices (p1-1..p1-3).' },
    },
  },
};

export async function practiceCatalogTool(args = {}) {
  try {
    const [main, locales] = await Promise.all([readFile(MAIN_FILE), loadLocales()]);
    const { practices, unparsed } = parsePractices(main.content, { freeIds: FREE_IDS });
    const en = locales.en ?? Object.values(locales)[0] ?? {};

    let rows = practices;
    if (args.practice_id) rows = rows.filter((p) => p.id === String(args.practice_id));
    if (args.free_only) rows = rows.filter((p) => p.free);

    const table = rows.map((p) => ({
      id: p.id,
      circuit: p.circuit,
      element: p.element,
      name: resolveKey(en, p.name_key) ?? null,
      name_key: p.name_key,
      duration: resolveKey(en, p.duration_key) ?? null,
      max_ond: p.max_ond,
      free: p.free,
      line: p.line,
    }));

    return ok({
      source: 'github:main (live)',
      total_practices: practices.length,
      returned: table.length,
      free_count: practices.filter((p) => p.free).length,
      practices: table,
      names_from: 'en locale (use copy_lookup on name_key for other languages)',
      unparsed,
      unparsed_note: unparsed.length
        ? `${unparsed.length} practice-shaped line(s) did not match the expected shape and are listed above.`
        : 'Every practice literal in the circuits array was parsed.',
    });
  } catch (err) {
    return failure(err);
  }
}
