// Links are tagged by the AI host that called the tool: ChatGPT → chatgpt, Claude → claude,
// anything else → ai_app (utm_source, utm_campaign = <client>_<tool>, App Store ct = <client>_<tool>).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import handler, { handleRpc } from '../api/mcp.js';
import { detectClient, linksFor, CLIENTS, LINK_TOOLS } from '../lib/links.js';
import { WIDGETS } from '../lib/widgets.js';

const ua = (s) => ({ headers: s === undefined ? {} : { 'user-agent': s } });

test('detectClient: User-Agent samples', () => {
  const cases = [
    ['openai-mcp/1.0.0', 'chatgpt'],
    ['ChatGPT-User/1.0; +https://openai.com/bot', 'chatgpt'],
    ['Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot', 'chatgpt'],
    ['OpenAI-MCP-Client/2.1', 'chatgpt'],
    ['Claude-User', 'claude'],
    ['Claude-User/1.0 (+Claude-User@anthropic.com)', 'claude'],
    ['claude-ai/0.1.0', 'claude'],
    ['Anthropic/ClaudeAI', 'claude'],
    ['anthropic-mcp-client/1.0', 'claude'],
    ['claude-code/2.0.14', 'claude'],
    ['python-httpx/0.28.1', 'ai_app'],
    ['curl/8.7.1', 'ai_app'],
    ['node', 'ai_app'],
    ['Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'ai_app'],
    ['', 'ai_app'],
    [undefined, 'ai_app'],
    ['bridge-bot (works with ChatGPT and Claude)', 'ai_app'], // names both → not decisive
  ];
  for (const [s, want] of cases) assert.equal(detectClient(ua(s), {}), want, String(s));
});

test('detectClient: no request, no headers, odd params → ai_app', () => {
  assert.equal(detectClient(undefined, undefined), 'ai_app');
  assert.equal(detectClient(null, null), 'ai_app');
  assert.equal(detectClient({}, { _meta: null }), 'ai_app');
  assert.equal(detectClient({ headers: {} }, { _meta: ['openai/locale'] }), 'ai_app');
});

test('detectClient: vendor header names when the User-Agent says nothing', () => {
  const h = (headers) => detectClient({ headers: { 'user-agent': 'python-httpx/0.28.1', ...headers } }, {});
  assert.equal(h({ 'x-openai-session': '1' }), 'chatgpt');
  assert.equal(h({ 'openai-conversation-id': '1' }), 'chatgpt');
  assert.equal(h({ 'anthropic-version': '2023-06-01' }), 'claude');
  assert.equal(h({ 'x-anthropic-request-id': '1' }), 'claude');
  assert.equal(h({ 'x-claude-client': '1' }), 'claude');
  assert.equal(h({ 'x-vercel-id': '1', 'x-forwarded-for': '1.2.3.4', 'mcp-session-id': 'abc' }), 'ai_app');
  assert.equal(h({ 'x-openai-a': '1', 'anthropic-b': '1' }), 'ai_app', 'both vendors → not decisive');
});

test('detectClient: _meta key namespaces as the last source; values are never read', () => {
  const m = (meta, req = { headers: {} }) => detectClient(req, { name: 'check_hrv', arguments: {}, _meta: meta });
  assert.equal(m({ 'openai/locale': 'en-US', 'openai/userAgent': 'Mozilla/5.0', 'openai/subject': 'x' }), 'chatgpt');
  assert.equal(m({ 'anthropic/session': 'x' }), 'claude');
  assert.equal(m({ 'claude/locale': 'en' }), 'claude');
  assert.equal(m({ 'claudeai/x': 1 }), 'claude');
  assert.equal(m({ 'com.anthropic/x': 1 }), 'claude');
  assert.equal(m({ 'claude.ai/x': 1 }), 'claude');
  assert.equal(m({ 'com.openai/x': 1 }), 'chatgpt');
  // A value that mentions a host must not count (the person's own browser user agent can be anything).
  assert.equal(m({ 'openai/userAgent': 'Mozilla/5.0 Claude/0.14 Electron' }), 'chatgpt');
  assert.equal(m({ progressToken: 'claude', locale: 'openai' }), 'ai_app');
  assert.equal(m({ 'io.modelcontextprotocol/related-task': 'x' }), 'ai_app');
  assert.equal(m({ 'openai/locale': 'en', 'anthropic/x': 1 }), 'ai_app', 'both vendors → not decisive');
  // Header sources come first.
  assert.equal(m({ 'openai/locale': 'en' }, ua('Claude-User')), 'claude');
  assert.equal(m({ 'openai/locale': 'en' }, ua('curl/8.7.1')), 'chatgpt');
});

test('detectClient: works with fetch-style Headers too', () => {
  assert.equal(detectClient({ headers: new Headers({ 'User-Agent': 'Claude-User' }) }, {}), 'claude');
  assert.equal(detectClient({ headers: new Headers({ 'User-Agent': 'curl/8', 'X-OpenAI-Session': '1' }) }, {}), 'chatgpt');
  assert.equal(detectClient({ headers: new Headers() }, {}), 'ai_app');
});

test('linksFor: tag format, unknown client → ai_app, unknown tool throws', () => {
  for (const client of CLIENTS) {
    const l = linksFor(client);
    for (const tool of LINK_TOOLS) {
      const store = new URL(l.appStore(tool));
      assert.equal(store.searchParams.get('ct'), `${client}_${tool}`);
      assert.ok(store.searchParams.get('ct').length <= 40);
      const site = new URL(l.site('/tools/hrv?x=1', tool));
      assert.equal(site.searchParams.get('x'), '1');
      assert.equal(site.searchParams.get('utm_source'), client);
      assert.equal(site.searchParams.get('utm_medium'), 'app');
      assert.equal(site.searchParams.get('utm_campaign'), `${client}_${tool}`);
    }
  }
  assert.equal(linksFor('gemini').client, 'ai_app');
  assert.equal(linksFor(undefined).client, 'ai_app');
  assert.throws(() => linksFor('claude').appStore('typo'));
  assert.ok(Object.isFrozen(linksFor('claude')));
});

// ── every link of every tool, per host ────────────────────────────────────

const RUNS = [
  ['check_hrv', 'hrv', { age: 42, hrv_ms: 38, device: 'oura', sex: 'female' }],
  ['check_hrv', 'hrv', { age: 42, hrv_ms: 38, device: 'apple_watch' }],
  ['check_hrv', 'hrv', { age: 70, hrv_ms: 20, device: 'oura' }],
  ['breathe_now', 'breathe', { technique: '478' }],
  ['find_practice', 'practice', { goal: 'sleep' }],
  ['compare', 'compare', { products: ['Oura Ring 4', 'Whoop 5.0'] }],
  ['compare', 'compare', { products: ['Calm', 'Headspace'] }],
];

const REQ = {
  chatgpt: { headers: { 'user-agent': 'openai-mcp/1.0.0' } },
  claude: { headers: { 'user-agent': 'Claude-User' } },
  ai_app: { headers: { 'user-agent': 'python-httpx/0.28.1' } },
};

function urls(x, out = []) {
  if (typeof x === 'string') out.push(...(x.match(/https?:\/\/[^\s"'<>)]+/g) || []));
  else if (Array.isArray(x)) x.forEach((v) => urls(v, out));
  else if (x && typeof x === 'object') Object.values(x).forEach((v) => urls(v, out));
  return out;
}

function assertTagged(u, client, tool, where) {
  const url = new URL(u.replace(/[.,;]+$/, ''));
  const want = `${client}_${tool}`;
  if (url.hostname === 'apps.apple.com') {
    assert.equal(url.searchParams.get('ct'), want, `${where}: ${u}`);
  } else {
    assert.equal(url.hostname, 'onda-life.com', `${where}: ${u}`);
    assert.equal(url.searchParams.get('utm_source'), client, `${where}: ${u}`);
    assert.equal(url.searchParams.get('utm_medium'), 'app', `${where}: ${u}`);
    assert.equal(url.searchParams.get('utm_campaign'), want, `${where}: ${u}`);
  }
}

test('every link in every tool result carries the calling host and the tool', async () => {
  for (const client of CLIENTS) {
    for (const [name, tool, args] of RUNS) {
      const r = (await handleRpc({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }, REQ[client])).result;
      assert.ok(!r.isError, `${client} ${name}`);
      const found = urls(r.structuredContent).concat(urls(r.content));
      assert.ok(found.length > 0, `${client} ${name}: no links`);
      for (const u of found) assertTagged(u, client, tool, `${client} ${name}`);
      const others = CLIENTS.filter((c) => c !== client);
      const blob = JSON.stringify(r);
      for (const o of others) assert.doesNotMatch(blob, new RegExp(`(utm_source=|ct=|utm_campaign=)${o}\\b`), `${client} ${name} leaks ${o}`);
    }
  }
});

test('every tool has an App Store link and a site link for each host', async () => {
  const once = { check_hrv: RUNS[0][2], breathe_now: RUNS[3][2], find_practice: RUNS[4][2], compare: RUNS[5][2] };
  for (const client of CLIENTS) {
    for (const [name, args] of Object.entries(once)) {
      const r = (await handleRpc({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }, REQ[client])).result;
      const found = urls(r.structuredContent);
      assert.ok(found.some((u) => u.startsWith('https://apps.apple.com/')), `${client} ${name}: App Store link`);
      assert.ok(found.some((u) => u.startsWith('https://onda-life.com/')), `${client} ${name}: site link`);
    }
  }
});

test('concurrent requests from different hosts never share tags', async () => {
  const order = Array.from({ length: 30 }, (_, i) => CLIENTS[i % 3]);
  const results = await Promise.all(order.map((client, i) =>
    handleRpc({ jsonrpc: '2.0', id: i, method: 'tools/call', params: { name: 'find_practice', arguments: { goal: 'calm' } } }, REQ[client])));
  results.forEach((r, i) => {
    assert.equal(new URL(r.result.structuredContent.bridge.url).searchParams.get('ct'), `${order[i]}_practice`);
    assert.equal(new URL(r.result.structuredContent.tryFree.url).searchParams.get('utm_source'), order[i]);
  });
});

// ── through the HTTP handler (what Vercel calls) ─────────────────────────────

function fakeRes() {
  return {
    statusCode: 200, headers: {}, body: undefined,
    setHeader(k, v) { this.headers[k] = v; },
    status(c) { this.statusCode = c; return this; },
    json(o) { this.body = o; return this; },
    end() { return this; },
  };
}

test('HTTP handler tags by the request User-Agent, for single and batch calls', async () => {
  const msg = (id, name, args) => ({ jsonrpc: '2.0', id, method: 'tools/call', params: { name, arguments: args } });
  const one = fakeRes();
  await handler({ method: 'POST', headers: { 'user-agent': 'Claude-User', 'content-type': 'application/json' }, body: JSON.stringify(msg(1, 'check_hrv', RUNS[0][2])) }, one);
  assert.equal(one.statusCode, 200);
  assert.equal(new URL(one.body.result.structuredContent.bridge.url).searchParams.get('ct'), 'claude_hrv');
  assert.equal(new URL(one.body.result.structuredContent.learnMore).searchParams.get('utm_source'), 'claude');

  const batch = fakeRes();
  await handler({ method: 'POST', headers: { 'user-agent': 'openai-mcp/1.0.0' }, body: [msg(1, 'breathe_now', {}), msg(2, 'compare', RUNS[5][2])] }, batch);
  assert.equal(new URL(batch.body[0].result.structuredContent.bridge.url).searchParams.get('ct'), 'chatgpt_breathe');
  assert.equal(new URL(batch.body[1].result.structuredContent.duel.url).searchParams.get('utm_campaign'), 'chatgpt_compare');

  const curl = fakeRes();
  await handler({ method: 'POST', headers: { 'user-agent': 'curl/8.7.1' }, body: msg(1, 'find_practice', { goal: 'focus' }) }, curl);
  assert.equal(new URL(curl.body.result.structuredContent.bridge.url).searchParams.get('ct'), 'ai_app_practice');
});

test('server version is 1.8.2', async () => {
  const res = fakeRes();
  await handler({ method: 'GET', headers: {} }, res);
  assert.equal(res.body.server.version, '1.8.2');
});

test('cards hold no link or tag of their own (every href comes from the tool result)', () => {
  for (const [k, w] of Object.entries(WIDGETS)) {
    assert.doesNotMatch(w.html, /utm_|[?&]ct=|apps\.apple\.com|onda-life\.com|chatgpt_|claude_|ai_app/, k);
  }
});
