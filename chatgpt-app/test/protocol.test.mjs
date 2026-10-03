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

test('every tool points at a readable skybridge card', async () => {
  const { result } = await handleRpc({ jsonrpc: '2.0', id: 1, method: 'tools/list' });
  assert.deepEqual(result.tools.map((t) => t.name), ['check_hrv', 'breathe_now', 'find_practice', 'compare']);
  for (const t of result.tools) {
    assert.equal(t.annotations.readOnlyHint, true);
    const uri = t._meta['openai/outputTemplate'];
    const read = await handleRpc({ jsonrpc: '2.0', id: 2, method: 'resources/read', params: { uri } });
    const c = read.result.contents[0];
    assert.equal(c.mimeType, 'text/html+skybridge');
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
  assert.ok(d.products.every((p) => p.worksWithOnda === 'no'));
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
