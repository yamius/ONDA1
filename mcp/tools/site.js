/**
 * Site inspection tools. READ-ONLY, like everything else here.
 *
 * All four share one guarded reader (lib/site.js): the caller picks a `target`
 * from an enum and supplies only a path, never a host. See the threat model
 * there — this server holds production credentials, so an unconstrained URL
 * parameter would be an SSRF primitive.
 *
 * They live in one file because they share the style and sitemap parsing; the
 * analytics tools are one-per-file because they share nothing.
 */

import {
  siteFetch, extractMeta, extractText, normalisePath, resolveTarget,
  SiteError, SITE_TARGETS, SITE_ALLOWED_HOSTS,
} from '../lib/site.js';
import { ok } from '../lib/shared.js';

const targetProp = {
  type: 'string', enum: SITE_TARGETS, default: 'production',
  description: 'Which host to read. The host is never supplied directly — only chosen from this list.',
};

function failure(err) {
  if (err instanceof SiteError) {
    const { message, ...rest } = err;
    return { ok: false, error: err.code ?? 'site_error', message: err.message, ...rest };
  }
  return { ok: false, error: 'site_error', message: String(err?.message ?? err).slice(0, 300) };
}

// ─────────────────────────────────────────────────────────── site_fetch ─────

export const siteFetchSchema = {
  name: 'site_fetch',
  description:
    'Read one page of the ONDA site: HTTP status, meta tags, canonical, OG/Twitter ' +
    'cards, parsed JSON-LD and the visible text with scripts and styles stripped. ' +
    'Read-only; only the allowlisted ONDA hosts can be reached.',
  inputSchema: {
    type: 'object',
    properties: {
      path: { type: 'string', default: '/', description: 'Path only, e.g. "/" or "/articles/vagus-nerve-master-key".' },
      target: targetProp,
      view: { type: 'string', enum: ['meta', 'content', 'full'], default: 'full' },
    },
  },
};

export async function siteFetchTool(args = {}) {
  try {
    const view = args.view || 'full';
    const res = await siteFetch(args.path ?? '/', args.target);
    const out = {
      status: res.status,
      target_used: res.target_used,
      requested_url: res.requested_url,
      allowlist: SITE_ALLOWED_HOSTS,
    };
    if (res.redirect) {
      out.redirect = res.redirect;
      out.note = 'A redirect was returned and deliberately not followed; nothing was read.';
      return ok(out);
    }
    out.content_type = res.content_type;
    out.bytes = res.bytes;
    if (res.truncated) out.truncated = true;

    const { meta, jsonld } = extractMeta(res.html);
    if (view === 'meta' || view === 'full') {
      out.meta = meta;
      out.jsonld = jsonld;
    }
    if (view === 'content' || view === 'full') {
      const text = extractText(res.html);
      out.text = text.text;
      if (text.truncated) out.text_truncated = true;
    }
    return ok(out);
  } catch (err) {
    return failure(err);
  }
}

// ─────────────────────────────────────────────────────────── site_style ─────

const HEX = /#[0-9a-f]{3,8}\b/gi;

/** CSS custom properties, from :root or Tailwind's @theme block. */
function customProperties(css) {
  const vars = {};
  for (const m of css.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;{}]+)[;}]/gi)) {
    const name = m[1];
    const value = m[2].trim();
    if (!vars[name]) vars[name] = value;
  }
  return vars;
}

function fontFaces(css) {
  const faces = [];
  for (const m of css.matchAll(/@font-face\s*{([^}]*)}/gi)) {
    const block = m[1];
    const family = (block.match(/font-family\s*:\s*([^;]+)/i) ?? [])[1]?.trim().replace(/^["']|["']$/g, '');
    const src = (block.match(/src\s*:\s*([^;]+)/i) ?? [])[1]?.trim();
    const weight = (block.match(/font-weight\s*:\s*([^;]+)/i) ?? [])[1]?.trim();
    faces.push({ family: family ?? null, weight: weight ?? null, src: src ? src.slice(0, 200) : null });
  }
  return faces;
}

export const siteStyleSchema = {
  name: 'site_style',
  description:
    'Palette and typography of the ONDA site: CSS custom properties, @font-face ' +
    'declarations and how fonts are loaded, the font stacks used for headings and ' +
    'body, and the most frequent colours. A summary you can build a matching ' +
    'graphic from — not a dump of the stylesheet.',
  inputSchema: {
    type: 'object',
    properties: { path: { type: 'string', default: '/' }, target: targetProp },
  },
};

export async function siteStyleTool(args = {}) {
  try {
    const page = await siteFetch(args.path ?? '/', args.target);
    if (page.redirect) {
      return ok({ target_used: page.target_used, status: page.status, redirect: page.redirect, note: 'Redirected; no styles read.' });
    }

    // Same-origin stylesheets only. An external href would be refused by the
    // allowlist anyway; it is skipped here and reported instead.
    const hrefs = [];
    const external = [];
    for (const m of page.html.matchAll(/<link\b[^>]*rel\s*=\s*["']stylesheet["'][^>]*>/gi)) {
      const href = (m[0].match(/href\s*=\s*["']([^"']+)["']/i) ?? [])[1];
      if (!href) continue;
      if (/^https?:\/\//i.test(href) || href.startsWith('//')) external.push(href);
      else hrefs.push(href);
    }

    let css = '';
    const read = [];
    for (const href of hrefs.slice(0, 3)) {
      try {
        const sheet = await siteFetch(href.startsWith('/') ? href : `/${href}`, args.target);
        if (!sheet.redirect && sheet.html) { css += `\n${sheet.html}`; read.push(href); }
      } catch {
        // A stylesheet we cannot read is reported by omission, not fatal.
      }
    }

    // Inline <style> blocks count too — Tailwind v4 often inlines @theme.
    for (const m of page.html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) css += `\n${m[1]}`;

    const vars = customProperties(css);

    // Tailwind emits dozens of internal `--tw-*` variables, most of them set to
    // `initial`. They drown the actual palette, which is the whole point of
    // this tool, so they are counted and set aside rather than listed.
    const isFramework = ([k, v]) => k.startsWith('--tw-') || /^(initial|inherit|unset)$/i.test(String(v).trim());
    const brand = Object.entries(vars).filter((e) => !isFramework(e));

    // Tailwind also ships its ENTIRE default palette as --color-<hue>-<step>.
    // Those are the framework's colours, not ours, and listing 80 of them
    // buries the handful of tokens that actually define the brand.
    const TAILWIND_HUES =
      /^--color-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|grey|zinc|neutral|stone)-\d+$/;
    const isDefaultPalette = ([k]) => TAILWIND_HUES.test(k);

    // `--text-*` is Tailwind's TYPE SCALE, not a colour — it belongs with the
    // fonts, where it also answers "what size are the headings".
    const isTypeScale = ([k]) => /^--text-/.test(k);
    const colourish = brand.filter(([k]) => /color|bg|surface|accent|terminal|border/i.test(k) && !isTypeScale([k]));
    const brandColours = Object.fromEntries(colourish.filter((e) => !isDefaultPalette(e)));
    const colourVars = brandColours;
    const fontVars = Object.fromEntries(brand.filter(([k]) => /font/i.test(k)));
    const sizeScale = Object.fromEntries(
      brand.filter(isTypeScale).filter(([k]) => !k.includes('--line-height')),
    );
    const frameworkInternalsSkipped = Object.entries(vars).length - brand.length;
    const defaultPaletteSkipped = colourish.filter(isDefaultPalette).length;

    const counts = {};
    for (const hex of css.match(HEX) ?? []) {
      const h = hex.toLowerCase();
      // Fully transparent values (#0000, #00000000) carry no colour information.
      if (/^#(?:0{4}|0{8})$/.test(h)) continue;
      counts[h] = (counts[h] ?? 0) + 1;
    }
    const topColours = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 15)
      .map(([hex, uses]) => ({ hex, uses }));

    const families = [...new Set((css.match(/font-family\s*:\s*([^;{}]+)/gi) ?? [])
      .map((f) => f.replace(/font-family\s*:\s*/i, '').trim()))].slice(0, 12);

    const faces = fontFaces(css);

    return ok({
      target_used: page.target_used,
      requested_url: page.requested_url,
      fonts: {
        families_declared: families,
        font_variables: fontVars,
        font_faces: faces,
        size_scale: sizeScale,
        loading:
          faces.length
            ? 'Self-hosted @font-face declarations are present — the files are served from our own origin.'
            : external.length
              ? 'No @font-face found in the stylesheets read; fonts may come from an external stylesheet (listed below).'
              : 'No @font-face found and no external stylesheet — fonts are most likely system or already-bundled.',
      },
      colours: { brand_variables: colourVars, most_frequent_hex: topColours },
      css_variables_all: vars,
      framework_internals_skipped: frameworkInternalsSkipped,
      tailwind_default_palette_skipped: defaultPaletteSkipped,
      stylesheets_read: read,
      external_stylesheets_not_read: external,
      note:
        'A summary, not the full stylesheet. CSS variables are the reliable source ' +
        'for brand colours; the hex frequency list includes incidental values too.',
    });
  } catch (err) {
    return failure(err);
  }
}

// ────────────────────────────────────────────────────────── site_health ─────

const DEFAULT_PATHS = ['/', '/articles', '/tools', '/emoton', '/get'];

export const siteHealthSchema = {
  name: 'site_health',
  description:
    'Compare the production domain against the Vercel preview path by path: HTTP ' +
    'status, title and canonical. Flags any mismatch. Exists because a 404 on the ' +
    'live domain while the preview served fine was found by accident, not by ' +
    'monitoring.',
  inputSchema: {
    type: 'object',
    properties: {
      paths: { type: 'array', items: { type: 'string' }, description: `Paths to compare. Default: ${DEFAULT_PATHS.join(', ')}` },
    },
  },
};

async function probe(path, target) {
  try {
    const res = await siteFetch(path, target);
    if (res.redirect) {
      return { status: res.status, redirect_to: res.redirect.to, title: null, canonical: null };
    }
    const { meta } = extractMeta(res.html);
    return { status: res.status, title: meta.title, canonical: meta.canonical };
  } catch (err) {
    return { status: null, error: err.code ?? 'site_error', message: err.message };
  }
}

export async function siteHealthTool(args = {}) {
  const paths = Array.isArray(args.paths) && args.paths.length ? args.paths : DEFAULT_PATHS;
  const rows = [];
  for (const raw of paths.slice(0, 20)) {
    let path;
    try {
      path = normalisePath(raw);
    } catch (err) {
      rows.push({ path: raw, error: 'bad_path', message: err.message });
      continue;
    }
    const [production, preview] = await Promise.all([probe(path, 'production'), probe(path, 'preview')]);

    const reasons = [];
    if (production.status !== preview.status) reasons.push(`status ${production.status} vs ${preview.status}`);
    if (production.title !== preview.title) reasons.push('title differs');
    // Canonicals legitimately differ in host: the preview canonicalises to the
    // production domain on purpose. Compare the path only.
    const pathOf = (u) => { try { return new URL(u).pathname; } catch { return u ?? null; } };
    if (pathOf(production.canonical) !== pathOf(preview.canonical)) reasons.push('canonical path differs');

    rows.push({
      path,
      production,
      preview,
      mismatch: reasons.length > 0,
      ...(reasons.length ? { reasons } : {}),
    });
  }

  const mismatches = rows.filter((r) => r.mismatch).length;
  return ok({
    compared: { production: 'onda-life.com', preview: 'ondalife.vercel.app' },
    paths_checked: rows.length,
    mismatches,
    summary: mismatches
      ? `${mismatches} of ${rows.length} paths differ between the live domain and the preview.`
      : 'Live domain and preview agree on every path checked.',
    results: rows,
    note:
      'While DNS still points away from Vercel the two are EXPECTED to differ — ' +
      'that is the migration in progress, not a regression. After the cutover any ' +
      'mismatch here is a real problem.',
  });
}

// ───────────────────────────────────────────────────────────── site_map ─────

export const siteMapSchema = {
  name: 'site_map',
  description:
    'Read sitemap.xml and list the paths with their last-modified dates, grouped ' +
    'by section. The site has ~89 articles plus levels and parts; this is how to ' +
    'find your way around them.',
  inputSchema: {
    type: 'object',
    properties: {
      target: targetProp,
      limit: { type: 'integer', default: 500, description: 'Maximum URLs to return.' },
    },
  },
};

export async function siteMapTool(args = {}) {
  try {
    const res = await siteFetch('/sitemap.xml', args.target);
    if (res.redirect) {
      return ok({ target_used: res.target_used, status: res.status, redirect: res.redirect, note: 'Redirected; sitemap not read.' });
    }
    if (res.status !== 200) {
      return ok({
        target_used: res.target_used,
        status: res.status,
        available: false,
        reason: `sitemap.xml returned ${res.status}`,
      });
    }

    const limit = Math.min(Math.max(Number(args.limit) || 500, 1), 5000);
    const entries = [];
    for (const m of res.html.matchAll(/<url>([\s\S]*?)<\/url>/gi)) {
      const loc = (m[1].match(/<loc>([\s\S]*?)<\/loc>/i) ?? [])[1]?.trim();
      const lastmod = (m[1].match(/<lastmod>([\s\S]*?)<\/lastmod>/i) ?? [])[1]?.trim() ?? null;
      if (!loc) continue;
      let path = loc;
      try { path = new URL(loc).pathname; } catch { /* keep the raw value */ }
      entries.push({ path, lastmod });
    }

    // Group by first path segment, which is how the site is actually organised.
    const sections = {};
    for (const e of entries) {
      const seg = e.path.split('/').filter(Boolean)[0] ?? '(root)';
      (sections[seg] ??= []).push(e);
    }
    const grouped = Object.entries(sections)
      .map(([section, list]) => ({
        section,
        count: list.length,
        newest_lastmod: list.map((x) => x.lastmod).filter(Boolean).sort().at(-1) ?? null,
        paths: list.slice(0, limit),
      }))
      .sort((a, b) => b.count - a.count);

    return ok({
      target_used: res.target_used,
      total_urls: entries.length,
      returned: Math.min(entries.length, limit),
      sections: grouped,
    });
  } catch (err) {
    return failure(err);
  }
}
