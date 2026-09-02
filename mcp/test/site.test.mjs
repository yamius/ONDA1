/**
 * Site tools — mostly a test of the SSRF defences.
 *
 * This server holds App Store Connect, GA4, Tenjin and RevenueCat credentials.
 * A URL-fetching tool here is an SSRF primitive if the host can be influenced
 * at all, so most of what follows is about proving it cannot be: not through
 * the target, not through the path, and not through a redirect.
 */
import { test } from 'node:test';
import assert from 'node:assert';
import {
  normalisePath, resolveTarget, SiteError, SITE_ALLOWED_HOSTS, TARGETS, ALLOWED_HOSTS,
  extractMeta, extractText,
} from '../lib/site.js';

// ───────────────────────────────────────────────────────────── allowlist ────

test('the allowlist is exactly the three ONDA hosts', () => {
  assert.deepEqual(
    [...ALLOWED_HOSTS].sort(),
    ['onda-life.com', 'ondalife.vercel.app', 'www.onda-life.com'],
  );
  // No wildcards, and nothing that would match a sibling subdomain.
  for (const h of ALLOWED_HOSTS) assert.ok(!h.includes('*'), 'no wildcard hosts');
});

test('a target is chosen from an enum; a host can never be passed in', () => {
  assert.equal(resolveTarget('production').base, 'https://onda-life.com');
  assert.equal(resolveTarget('preview').base, 'https://ondalife.vercel.app');
  assert.throws(() => resolveTarget('http://169.254.169.254'), (e) => e.code === 'bad_target');
  assert.throws(() => resolveTarget('internal'), (e) => e.code === 'bad_target');
  // Every configured target is itself on the allowlist.
  for (const base of Object.values(TARGETS)) {
    assert.ok(ALLOWED_HOSTS.has(new URL(base).hostname));
  }
});

// ────────────────────────────────────────────────────── path smuggling ──────

test('a path cannot smuggle a host', () => {
  const attacks = [
    'http://169.254.169.254/latest/meta-data/',      // absolute URL
    'https://evil.example.com/',                      // absolute URL, https
    '//169.254.169.254/latest/meta-data/',            // protocol-relative
    '//evil.example.com',                             // protocol-relative
    '\\\\evil.example.com\\x',                        // UNC / backslashes
    '/\\evil.example.com',                            // mixed slash
    'file:///etc/passwd',                             // non-http scheme
    '/redirect@evil.example.com',                     // credentials-style host
  ];
  for (const a of attacks) {
    assert.throws(() => normalisePath(a), (e) => e instanceof SiteError && e.code === 'bad_path', `must reject: ${a}`);
  }
});

test('ordinary paths are accepted unchanged', () => {
  for (const p of ['/', '/articles', '/articles/vagus-nerve-master-key', '/sitemap.xml', '/tools?x=1']) {
    assert.equal(normalisePath(p), p);
  }
});

test('a relative path with no leading slash is refused rather than guessed at', () => {
  assert.throws(() => normalisePath('articles'), (e) => e.code === 'bad_path');
});

test('cloud metadata addresses cannot be reached even as a bare path', () => {
  // 169.254.169.254 as a *path segment* is harmless — it resolves under an
  // allowlisted host. The danger is only ever the host, which is why this
  // does not throw and must not: refusing it would be theatre.
  assert.equal(normalisePath('/169.254.169.254'), '/169.254.169.254');
  const url = new URL('/169.254.169.254', TARGETS.production);
  assert.equal(url.hostname, 'onda-life.com', 'still points at the allowlisted host');
});

// ───────────────────────────────────────────────────────────── parsing ──────

const HTML = `<!doctype html><html><head>
<title>ONDA Life — Train your nervous system</title>
<meta name="description" content="Stop tracking stress. Start training it.">
<link rel="canonical" href="https://onda-life.com/">
<meta property="og:title" content="ONDA Life">
<meta property="og:image" content="https://onda-life.com/hero.png">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">{"@type":"WebSite","name":"ONDA"}</script>
<script>window.dataLayer=[];alert('should never appear')</script>
<style>:root{--color-terminal-green:#4ade80}</style>
</head><body><h1>Heading</h1><p>Body text here.</p>
<script>console.log('also stripped')</script></body></html>`;

test('meta, canonical and JSON-LD are extracted', () => {
  const { meta, jsonld } = extractMeta(HTML);
  assert.equal(meta.title, 'ONDA Life — Train your nervous system');
  assert.equal(meta.description, 'Stop tracking stress. Start training it.');
  assert.equal(meta.canonical, 'https://onda-life.com/');
  assert.equal(meta.og.title, 'ONDA Life');
  assert.equal(meta.twitter.card, 'summary_large_image');
  assert.equal(jsonld.length, 1);
  assert.equal(jsonld[0]['@type'], 'WebSite');
});

test('text extraction drops scripts and styles, keeping the prose', () => {
  const { text } = extractText(HTML);
  assert.match(text, /Heading/);
  assert.match(text, /Body text here/);
  assert.ok(!/alert|dataLayer|console\.log/.test(text), 'script contents never reach the output');
  assert.ok(!/--color-terminal-green/.test(text), 'style contents never reach the output');
});

test('malformed JSON-LD is reported, not thrown', () => {
  const { jsonld } = extractMeta('<script type="application/ld+json">{not json}</script>');
  assert.equal(jsonld[0].parse_error, true);
  assert.ok(jsonld[0].raw_preview.length > 0);
});

// ────────────────────────────────────────────────────── tool registration ───

test('the site tools are registered and none of them writes', async () => {
  const { siteFetchSchema, siteStyleSchema, siteHealthSchema, siteMapSchema } =
    await import('../tools/site.js');
  const names = [siteFetchSchema, siteStyleSchema, siteHealthSchema, siteMapSchema].map((s) => s.name);
  assert.deepEqual(names, ['site_fetch', 'site_style', 'site_health', 'site_map']);
  for (const n of names) assert.ok(!/write|update|create|delete|post/.test(n), `${n} is read-only`);
  // The target parameter must be a closed enum on every tool that takes one.
  for (const s of [siteFetchSchema, siteStyleSchema, siteMapSchema]) {
    assert.ok(Array.isArray(s.inputSchema.properties.target.enum), `${s.name} constrains target to an enum`);
    assert.deepEqual(s.inputSchema.properties.target.enum, SITE_ALLOWED_HOSTS.length ? ['production', 'preview'] : []);
  }
  // site_fetch must not accept a url/host parameter at all.
  const props = Object.keys(siteFetchSchema.inputSchema.properties);
  assert.ok(!props.includes('url') && !props.includes('host'), 'no free-form url or host parameter');
});

test('no Authorization header is ever sent to the site', async () => {
  const fs = await import('node:fs');
  const src = fs.readFileSync(new URL('../lib/site.js', import.meta.url), 'utf8');
  const fetchCall = src.slice(src.indexOf('res = await fetch('), src.indexOf('} catch (err) {'));
  // Strip comments first: the block deliberately CONTAINS the word
  // Authorization, in a comment explaining why no such header is sent.
  const code = fetchCall.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
  assert.ok(!/Authorization/i.test(code), 'the outbound request carries no credentials');
  assert.ok(/redirect: 'manual'/.test(fetchCall), 'redirects are not followed automatically');
  assert.ok(/AbortSignal\.timeout/.test(fetchCall), 'the request is bounded by a timeout');
});
