import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleRpc } from '../api/mcp.js';
import { matchReview } from '../lib/tools.js';

const call = (name, args) => handleRpc({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } });

test('initialize advertises tools and resources', async () => {
  const r = await handleRpc({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} });
  assert.ok(r.result.capabilities.tools);
  assert.ok(r.result.capabilities.resources);
});

test('every tool points at a readable MCP Apps card', async () => {
  const { result } = await handleRpc({ jsonrpc: '2.0', id: 1, method: 'tools/list' });
  assert.deepEqual(result.tools.map((t) => t.name), ['check_hrv', 'breathe_now', 'find_practice', 'compare']);
  for (const t of result.tools) {
    assert.equal(t.annotations.readOnlyHint, true);
    const uri = t._meta.ui.resourceUri;
    assert.equal(t._meta['openai/outputTemplate'], uri);
    const read = await handleRpc({ jsonrpc: '2.0', id: 2, method: 'resources/read', params: { uri } });
    const c = read.result.contents[0];
    assert.equal(c.mimeType, 'text/html;profile=mcp-app');
    assert.match(c.text, /^<!doctype html>/);
    assert.doesNotMatch(c.text, /<script[^>]+src=/, 'cards must not load external scripts');
  }
});

test('check_hrv picks SDNN for Apple Watch and RMSSD otherwise', async () => {
  const aw = (await call('check_hrv', { age: 42, hrv_ms: 38, device: 'apple_watch' })).result.structuredContent;
  const oura = (await call('check_hrv', { age: 42, hrv_ms: 38, device: 'oura' })).result.structuredContent;
  assert.equal(aw.metric, 'SDNN');
  assert.equal(aw.ageBand, '35–44');
  assert.equal(oura.metric, 'RMSSD');
  assert.equal(oura.ageBand, '40–49');
  assert.match(aw.bridge.url, /ct=chatgpt_hrv/);
});

test('breathe_now never promises a numeric pacer in the bridge', async () => {
  for (const technique of ['coherent', '478', 'box', 'sigh', 'calming']) {
    const d = (await call('breathe_now', { technique })).result.structuredContent;
    assert.ok(d.phases.length >= 2);
    assert.doesNotMatch(d.bridge.text, /\d+\s*(\/|per)\s*min|breaths? a minute/i);
    assert.match(d.bridge.url, /ct=chatgpt_breathe/);
  }
});

test('find_practice returns only adaptive practices and links to /emoton', async () => {
  for (const goal of ['calm', 'sleep', 'focus', 'energy']) {
    const d = (await call('find_practice', { goal })).result.structuredContent;
    assert.ok(d.practices.length >= 1 && d.practices.length <= 3, goal);
    assert.ok(d.practices.every((p) => p.minutes === 6));
    assert.match(d.tryFree.url, /^https:\/\/onda-life\.com\/emoton\?.*utm_campaign=chatgpt_practice/);
  }
  const lying = (await call('find_practice', { goal: 'sleep', position: 'lying' })).result.structuredContent;
  assert.ok(lying.practices.every((p) => ['anywhere', 'lying', 'sitting'].includes(p.position)));
});

test('compare finds the duel page and never scores ONDA', async () => {
  const d = (await call('compare', { products: ['Oura Ring 4', 'Whoop 5.0'] })).result.structuredContent;
  assert.deepEqual(d.products.map((p) => p.slug), ['oura-ring-4', 'whoop-5-0']);
  assert.ok(d.duel);
  assert.ok(d.products.every((p) => p.worksWithOnda === 'partly'));
  const aw = (await call('compare', { products: ['Apple Watch 12', 'Whoop'] })).result.structuredContent;
  assert.equal(aw.products[0].worksWithOnda, 'yes');
  const own = (await call('compare', { products: ['ONDA', 'Calm'] })).result.structuredContent;
  assert.ok(own.ownProductNote);
  assert.ok(own.products.every((p) => !/onda/i.test(p.name)));
  assert.equal(own.bridge, null, 'no device bridge on an app-only comparison');
});

test('unknown products are reported, not guessed', () => {
  assert.equal(matchReview('Foo Bar 9'), null);
});

test('errors do not echo the arguments', async () => {
  const r = await call('check_hrv', { age: 'x', hrv_ms: 'y', device: 'oura' });
  assert.doesNotMatch(JSON.stringify(r), /"x"|"y"/);
});

test('find_practice card has the App Store button next to the free try', async () => {
  const { WIDGETS } = await import('../lib/widgets.js');
  const d = (await call('find_practice', { goal: 'calm' })).result.structuredContent;
  assert.match(d.bridge.url, /apps\.apple\.com.*ct=chatgpt_practice/);
  assert.ok(d.bridge.button);
  assert.match(WIDGETS.practice.html, /d\.tryFree\.url[\s\S]{0,200}d\.bridge\.url/);
});

test('breathe_now accepts 478 sent as a number', async () => {
  const r = (await call('breathe_now', { technique: 478 })).result;
  assert.ok(!r.isError);
  assert.equal(r.structuredContent.technique, '478');
});

test('check_hrv with red-flag symptoms returns only urgent-care guidance', async () => {
  const r = (await call('check_hrv', { age: 50, hrv_ms: 15, device: 'apple_watch', red_flag_symptoms: true })).result;
  assert.equal(r.structuredContent.urgent, true);
  assert.equal(r.structuredContent.percentile, undefined);
  assert.match(r.content[0].text, /emergency|urgent/i);
});

test('server manifest carries our own description and icon', async () => {
  const r = await handleRpc({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} });
  assert.match(r.result.serverInfo.description, /^HRV norms by age/);
  assert.match(r.result.serverInfo.icons[0].src, /icon-512\.png$/);
});

test('ordinary requests (prompts 1-5) never return the urgent-care card', async () => {
  const runs = [
    ['check_hrv', { age: 42, hrv_ms: 38, device: 'apple_watch' }],
    ['check_hrv', { age: 30, hrv_ms: 12, device: 'oura' }],
    ['breathe_now', {}],
    ['breathe_now', { technique: '478' }],
    ['find_practice', { goal: 'calm', minutes: 10, experience: 'beginner' }],
    ['compare', { products: ['Oura Ring 4', 'Whoop 5.0'] }],
  ];
  for (const [name, args] of runs) {
    const r = (await call(name, args)).result;
    assert.ok(!r.structuredContent.urgent, name);
    assert.doesNotMatch(r.content[0].text, /get medical help now|emergency number/i, name);
  }
  const hrv = (await call('check_hrv', { age: 42, hrv_ms: 38, device: 'apple_watch', red_flag_symptoms: false })).result.structuredContent;
  assert.equal(hrv.urgent, undefined);
  assert.equal(hrv.tierLabel, 'Within the typical range, slightly below the median');
});

test('tier wording: below average only under the 25th percentile', async () => {
  const lo = (await call('check_hrv', { age: 42, hrv_ms: 24, device: 'apple_watch' })).result.structuredContent;
  assert.ok(lo.percentile < 25);
  assert.equal(lo.tierLabel, 'Below average');
});
