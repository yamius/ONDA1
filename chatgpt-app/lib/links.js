/**
 * Outbound links. Every link names the AI host that called the tool (the "client")
 * and the tool itself, so installs and visits from ChatGPT, Claude and other hosts
 * stay apart: Apple `ct` on App Store links (same format as
 * landing/src/config/appStore.ts) and utm_* on site links.
 *
 *   client    utm_source   utm_campaign and ct   utm_medium
 *   ChatGPT   chatgpt      chatgpt_<tool>        app
 *   Claude    claude       claude_<tool>         app
 *   unknown   ai_app       ai_app_<tool>         app
 *
 * <tool> is one of LINK_TOOLS. The client is detected per request (detectClient) and
 * passed down as a linksFor(client) object — never kept in module state, because one
 * serverless instance can serve requests from different hosts at the same time.
 */
export const SITE = 'https://onda-life.com';
const APP_STORE_ID = '6755912529';
const APP_STORE_PROVIDER = '128331898';

export const CLIENTS = Object.freeze(['chatgpt', 'claude', 'ai_app']);
export const UNKNOWN_CLIENT = 'ai_app';
/** The <tool> part of every tag. */
export const LINK_TOOLS = Object.freeze(['hrv', 'breathe', 'practice', 'compare']);

export function appStoreUrl(ct) {
  return `https://apps.apple.com/app/apple-store/id${APP_STORE_ID}?pt=${APP_STORE_PROVIDER}&ct=${encodeURIComponent(ct.slice(0, 40))}&mt=8`;
}

export function siteUrl(path, source, campaign) {
  const u = new URL(path, SITE);
  u.searchParams.set('utm_source', source);
  u.searchParams.set('utm_medium', 'app');
  u.searchParams.set('utm_campaign', campaign);
  return u.toString();
}

/** Link builders for one request's client. An unknown client value counts as ai_app. */
export function linksFor(client) {
  const source = CLIENTS.includes(client) ? client : UNKNOWN_CLIENT;
  const tag = (tool) => {
    if (!LINK_TOOLS.includes(tool)) throw new Error(`Unknown link tool: ${tool}`);
    return `${source}_${tool}`;
  };
  return Object.freeze({
    client: source,
    appStore: (tool) => appStoreUrl(tag(tool)),
    site: (path, tool) => siteUrl(path, source, tag(tool)),
  });
}

// ─────────────────────────────────────────────────────── client detection ───
//
// Stateless: tools/call carries no clientInfo, and an Mcp-Session-Id cannot be tied
// back to initialize across serverless instances. So each request is judged on its own,
// from three sources in this order; the first that names exactly one host wins:
//   1. the User-Agent header of the host's server (e.g. openai-mcp/1.0.0, Claude-User);
//   2. vendor header names (openai-*, x-openai-*, anthropic-*, x-anthropic-*, claude-*);
//   3. the namespaces of params._meta KEYS (openai/locale → ChatGPT; anthropic/…, claude/…,
//      com.anthropic/… → Claude). Only key names are looked at — never the values (locale,
//      the person's browser user agent, location, identifiers), which the server ignores.
// A source that names both hosts, or neither, is skipped; nothing decisive → ai_app.

const UA_RULES = [
  ['chatgpt', /openai|chatgpt/i],
  ['claude', /claude|anthropic/i],
];

const NAMESPACE_LABELS = {
  openai: 'chatgpt',
  chatgpt: 'chatgpt',
  anthropic: 'claude',
  claude: 'claude',
  claudeai: 'claude',
};

/** The single client a list of hits names, or null when it names none or several. */
function only(hits) {
  const set = new Set(hits.filter(Boolean));
  return set.size === 1 ? [...set][0] : null;
}

const isFetchHeaders = (h) => typeof h?.get === 'function' && typeof h?.keys === 'function';

function headerValue(headers, name) {
  if (!headers) return '';
  const v = isFetchHeaders(headers) ? headers.get(name) : headers[name];
  return Array.isArray(v) ? v.join(' ') : String(v ?? '');
}

function headerNames(headers) {
  if (!headers) return [];
  return (isFetchHeaders(headers) ? [...headers.keys()] : Object.keys(headers)).map((k) => String(k).toLowerCase());
}

/** 'com.anthropic' → claude, 'openai' → chatgpt, anything else → null. */
function namespaceClient(ns) {
  return only(String(ns).toLowerCase().split('.').map((label) => NAMESPACE_LABELS[label]));
}

export function clientFromUserAgent(ua) {
  const s = String(ua ?? '');
  return only(UA_RULES.filter(([, re]) => re.test(s)).map(([client]) => client));
}

export function clientFromHeaderNames(names) {
  return only(names.map((n) => namespaceClient(n.replace(/^x-/, '').split(/[-_]/)[0])));
}

export function clientFromMetaKeys(meta) {
  if (!meta || typeof meta !== 'object' || Array.isArray(meta)) return null;
  return only(Object.keys(meta).filter((k) => k.includes('/')).map((k) => namespaceClient(k.split('/')[0])));
}

/**
 * Which AI host sent this request: 'chatgpt', 'claude' or 'ai_app' (unknown).
 * Pure: reads only req.headers and the key names of params._meta.
 */
export function detectClient(req, params) {
  const headers = req?.headers;
  return (
    clientFromUserAgent(headerValue(headers, 'user-agent')) ??
    clientFromHeaderNames(headerNames(headers)) ??
    clientFromMetaKeys(params?._meta) ??
    UNKNOWN_CLIENT
  );
}
