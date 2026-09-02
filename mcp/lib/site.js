/**
 * Guarded reader for the ONDA site.
 *
 * ⚠️ THREAT MODEL. This server holds several sets of production credentials
 * (App Store Connect .p8, a GA4 service account, Tenjin, RevenueCat). A tool
 * that fetches a URL on such a host is an SSRF primitive: given a free-form
 * URL it could be pointed at cloud metadata endpoints or internal addresses.
 *
 * The defences, in order of how much they matter:
 *
 *  1. The caller NEVER supplies a host. It picks a `target` from a fixed enum;
 *     the host comes from a constant in this file. A hostname cannot be
 *     smuggled in through the path — that is checked below and again after the
 *     URL is built.
 *  2. A strict allowlist. Three hosts, no wildcards, no "it's our subdomain
 *     too" exceptions. Everything else is refused.
 *  3. Redirects are NOT followed automatically. A redirect leaving the
 *     allowlist is reported as a fact, never chased.
 *  4. No Authorization header ever leaves this module. The analytics
 *     credentials have nothing to do with reading a public web page, and are
 *     not in scope for these requests.
 *  5. A timeout and a hard byte cap, so a hostile or broken response cannot
 *     hang or exhaust the function.
 */

const TARGETS = {
  production: 'https://onda-life.com',
  preview: 'https://ondalife.vercel.app',
};

/** Hosts we will read from, and the only hosts a redirect may land on. */
const ALLOWED_HOSTS = new Set(['onda-life.com', 'www.onda-life.com', 'ondalife.vercel.app']);

const TIMEOUT_MS = 15000;
const MAX_BYTES = 3_000_000;

export const SITE_TARGETS = Object.keys(TARGETS);
export const SITE_ALLOWED_HOSTS = [...ALLOWED_HOSTS];

export class SiteError extends Error {
  constructor(message, fields) {
    super(message);
    Object.assign(this, fields);
  }
}

/**
 * Validate a caller-supplied path.
 *
 * Rejects anything that could carry a host: a scheme, a protocol-relative
 * `//host`, backslashes (which some parsers fold into `/`), or embedded
 * credentials. The path must be a path.
 */
export function normalisePath(input) {
  const path = String(input ?? '/').trim();
  if (!path.startsWith('/')) {
    throw new SiteError('path must start with "/"', { code: 'bad_path', path });
  }
  if (path.startsWith('//')) {
    throw new SiteError('protocol-relative paths are not allowed — they carry a host', { code: 'bad_path', path });
  }
  if (path.includes('\\')) {
    throw new SiteError('backslashes are not allowed in a path', { code: 'bad_path', path });
  }
  if (/^\/+[a-z][a-z0-9+.-]*:/i.test(path) || /@/.test(path.split('?')[0])) {
    throw new SiteError('the path may not contain a scheme or credentials', { code: 'bad_path', path });
  }
  return path;
}

export function resolveTarget(target) {
  const key = String(target ?? 'production');
  const base = TARGETS[key];
  if (!base) {
    throw new SiteError(`unknown target "${key}"`, { code: 'bad_target', allowed: SITE_TARGETS });
  }
  return { key, base };
}

function assertAllowed(url) {
  if (!ALLOWED_HOSTS.has(url.hostname)) {
    throw new SiteError(`host "${url.hostname}" is not on the allowlist`, {
      code: 'host_not_allowed',
      allowed: [...ALLOWED_HOSTS],
    });
  }
}

/** Read a response body with a hard cap, so a huge page cannot exhaust us. */
async function readCapped(res) {
  const reader = res.body?.getReader();
  if (!reader) return { text: '', bytes: 0, truncated: false };
  const chunks = [];
  let bytes = 0;
  let truncated = false;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > MAX_BYTES) {
      truncated = true;
      await reader.cancel().catch(() => {});
      break;
    }
    chunks.push(value);
  }
  return { text: Buffer.concat(chunks.map(Buffer.from)).toString('utf8'), bytes, truncated };
}

/**
 * Fetch one page. Returns the body plus what actually happened, including a
 * redirect that was deliberately not followed.
 */
export async function siteFetch(path, target = 'production') {
  const safePath = normalisePath(path);
  const { key, base } = resolveTarget(target);

  const url = new URL(safePath, base);
  // Defence in depth: even after validating the path, confirm the URL we built
  // still points where we intended.
  assertAllowed(url);

  let res;
  try {
    res = await fetch(url, {
      redirect: 'manual',
      // Deliberately no Authorization header — see the threat model above.
      headers: { Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8', 'User-Agent': 'onda-mcp-site-reader' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    throw new SiteError(`network error contacting ${url.hostname}`, {
      code: 'network_error',
      status: null,
      target_used: key,
      url: url.toString(),
      cause: String(err?.cause?.code ?? err?.message ?? err).slice(0, 200),
      hint: 'No HTTP status: the request never reached the server.',
    });
  }

  const location = res.headers.get('location');
  if (location) {
    let dest = null;
    let allowed = false;
    try {
      dest = new URL(location, url);
      allowed = ALLOWED_HOSTS.has(dest.hostname);
    } catch {
      dest = null;
    }
    return {
      status: res.status,
      target_used: key,
      requested_url: url.toString(),
      redirect: {
        to: dest ? dest.toString() : location,
        followed: false,
        within_allowlist: allowed,
        note: allowed
          ? 'Redirect not followed automatically; request the destination path directly if you want it.'
          : 'Redirect leaves the allowlist and was NOT followed.',
      },
      html: '',
    };
  }

  const { text, bytes, truncated } = await readCapped(res);
  return {
    status: res.status,
    target_used: key,
    requested_url: url.toString(),
    final_url: url.toString(),
    content_type: res.headers.get('content-type') ?? null,
    bytes,
    truncated,
    html: text,
  };
}

// ─── parsing helpers (no dependencies; the HTML here is our own) ─────────────

const stripTag = (html, tag) =>
  html.replace(new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?</${tag}>`, 'gi'), ' ');

/** Meta tags, canonical and the JSON-LD blocks. */
export function extractMeta(html) {
  const meta = { title: null, description: null, canonical: null, og: {}, twitter: {}, robots: null };

  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (title) meta.title = decode(title[1].trim());

  for (const m of html.matchAll(/<meta\b([^>]*)>/gi)) {
    const attrs = m[1];
    const name = (attrs.match(/\bname\s*=\s*["']([^"']+)["']/i) ?? [])[1];
    const prop = (attrs.match(/\bproperty\s*=\s*["']([^"']+)["']/i) ?? [])[1];
    const content = (attrs.match(/\bcontent\s*=\s*["']([^"']*)["']/i) ?? [])[1];
    if (content == null) continue;
    const value = decode(content);
    if (name === 'description') meta.description = value;
    else if (name === 'robots') meta.robots = value;
    else if (prop?.startsWith('og:')) meta.og[prop.slice(3)] = value;
    else if (name?.startsWith('twitter:')) meta.twitter[name.slice(8)] = value;
  }

  const canonical = html.match(/<link\b[^>]*rel\s*=\s*["']canonical["'][^>]*>/i);
  if (canonical) meta.canonical = decode((canonical[0].match(/href\s*=\s*["']([^"']+)["']/i) ?? [])[1] ?? '') || null;

  const jsonld = [];
  for (const m of html.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      jsonld.push(JSON.parse(m[1].trim()));
    } catch {
      jsonld.push({ parse_error: true, raw_preview: m[1].trim().slice(0, 200) });
    }
  }
  return { meta, jsonld };
}

/** Visible text: scripts and styles removed. ld+json is returned separately. */
export function extractText(html, maxChars = 8000) {
  let out = stripTag(html, 'script');
  out = stripTag(out, 'style');
  out = stripTag(out, 'noscript');
  out = out.replace(/<[^>]+>/g, ' ');
  out = decode(out).replace(/\s+/g, ' ').trim();
  return out.length > maxChars ? { text: out.slice(0, maxChars), truncated: true } : { text: out, truncated: false };
}

function decode(s) {
  return String(s ?? '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&nbsp;/g, ' ');
}

export { TARGETS, ALLOWED_HOSTS, MAX_BYTES, TIMEOUT_MS };
