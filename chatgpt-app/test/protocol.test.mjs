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

test('check_hrv: Apple Watch SDNN is not compared; RMSSD uses the nearest Natarajan age point', async () => {
  const aw = (await call('check_hrv', { age: 42, hrv_ms: 38, device: 'apple_watch' })).result.structuredContent;
  const oura = (await call('check_hrv', { age: 42, hrv_ms: 38, device: 'oura', sex: 'female' })).result.structuredContent;
  assert.equal(aw.metric, 'SDNN');
  assert.equal(aw.compared, false);
  assert.equal(aw.verdict, undefined);
  assert.equal(oura.metric, 'RMSSD');
  assert.equal(oura.ageGroup, '40–41');
  assert.equal(oura.verdict, 'middle');
  assert.match(oura.disclaimer, /not a medical norm/);
  assert.match(aw.bridge.url, /ct=chatgpt_hrv/);
});

test('check_hrv (45, no sex, 30) compares with both groups and gives no single verdict', async () => {
  const r = (await call('check_hrv', { age: 45, hrv_ms: 30, device: 'garmin', sex: 'prefer_not_to_say' })).result;
  const d = r.structuredContent;
  console.log('[45, no sex, 30]', r.content[0].text);
  assert.equal(d.compared, true);
  assert.equal(d.verdict, undefined);
  assert.deepEqual(d.comparisons.map((c) => c.group), ['Fitbit women aged 45–46', 'Fitbit men aged 45–46']);
  assert.deepEqual(d.comparisons.map((c) => c.verdict), ['middle', 'middle']);
  assert.match(r.content[0].text, /not a medical norm/);
  assert.match(r.content[0].text, /Fitbit wrist data/);
});

test('check_hrv (70, female, 20): above 64 no verdict, 60–61 for information only', async () => {
  const r = (await call('check_hrv', { age: 70, hrv_ms: 20, device: 'oura', sex: 'female' })).result;
  const d = r.structuredContent;
  console.log('[70, female, 20]', r.content[0].text);
  assert.equal(d.compared, false);
  assert.equal(d.verdict, undefined);
  assert.equal(d.ageGroup, '60–61');
  assert.match(d.ageNote, /published data end at age 61; no comparison is made for your age/);
  assert.ok(d.comparisons.every((c) => c.verdict === undefined));
  assert.match(r.content[0].text, /no verdict/);
  assert.doesNotMatch(r.content[0].text, /Lower than most|Higher than most|Within the middle half/);
  assert.match(d.deviceNote, /Fitbit wrist data/);
});

test('check_hrv (63, male, 30): 62–64 compared with 60–61 with the edge note', async () => {
  const r = (await call('check_hrv', { age: 63, hrv_ms: 30, device: 'whoop', sex: 'male' })).result;
  const d = r.structuredContent;
  console.log('[63, male, 30]', r.content[0].text);
  assert.equal(d.compared, true);
  assert.equal(d.ageGroup, '60–61');
  assert.equal(d.verdict, 'middle');
  assert.match(d.ageNote, /data end at age 61, so you are compared with ages 60–61/);
});

test('check_hrv (42, female, Oura, 38): middle half + device note', async () => {
  const r = (await call('check_hrv', { age: 42, hrv_ms: 38, device: 'oura', sex: 'female' })).result;
  console.log('[42, female, Oura, 38]', r.content[0].text);
  assert.equal(r.structuredContent.verdict, 'middle');
  assert.match(r.content[0].text, /Within the middle half/);
  assert.match(r.content[0].text, /other devices \(Oura, Whoop, Garmin, Polar, Apple\) compute HRV differently/);
});

test('check_hrv (30, male, Garmin, 25): lower than most', async () => {
  const r = (await call('check_hrv', { age: 30, hrv_ms: 25, device: 'garmin', sex: 'male' })).result;
  console.log('[30, male, Garmin, 25]', r.content[0].text);
  assert.equal(r.structuredContent.verdict, 'lower');
  assert.equal(r.structuredContent.ageGroup, '30–31');
  assert.match(r.content[0].text, /Lower than most/);
  assert.match(r.content[0].text, /Fitbit wrist data/);
});

test('check_hrv (42, Apple Watch SDNN 38): not compared', async () => {
  const r = (await call('check_hrv', { age: 42, hrv_ms: 38, device: 'apple_watch' })).result;
  console.log('[42, Apple Watch SDNN 38]', r.content[0].text);
  assert.equal(r.structuredContent.compared, false);
  assert.equal(r.structuredContent.verdict, undefined);
  assert.match(r.content[0].text, /not compared/);
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

test('compare: winner only when the duel page shows one; status, label and ONDA scores as on the page', async () => {
  const run = async (products) => (await call('compare', { products })).result;
  const oura = await run(['oura ring 4', 'whoop 5.0']);
  assert.equal(oura.structuredContent.duel.winner, 'oura-ring-4');
  assert.equal(oura.structuredContent.duel.winnerStatus, 'winner');
  assert.equal(oura.structuredContent.duel.label, 'WINNER: Oura Ring 4');
  assert.match(oura.content[0].text, /WINNER: Oura Ring 4\./);

  const vns = (await run(['pulsetto', 'nurosym', 'apollo neuro'])).structuredContent;
  assert.equal(vns.duel.winner, null);
  assert.equal(vns.duel.winnerStatus, 'depends-on-the-job');
  assert.equal(vns.duel.label, 'Higher ONDA score: Nurosym (7.4 vs 7.1 vs 6.9)');
  assert.deepEqual(vns.duel.onda_scores, { pulsetto: 6.9, nurosym: 7.4, 'apollo-neuro': 7.1 });
  assert.deepEqual(vns.products.map((p) => p.score), [6.9, 7.4, 7.1], 'product scores = the duel page scores');

  const rings = (await run(['ringconn gen 2', 'ultrahuman ring air'])).structuredContent;
  assert.equal(rings.duel.winner, null);
  assert.equal(rings.duel.winnerStatus, 'practically-equal');
  assert.equal(rings.duel.label, 'Practically equal by ONDA score (7.0 and 6.9)');

  // "Depends on the job" duel with a top-two gap <= 0.1: the page shows "practically equal".
  const polar = (await run(['polar h10', 'garmin venu 4'])).structuredContent;
  assert.equal(polar.duel.winnerStatus, 'practically-equal');
  assert.equal(polar.duel.label, 'Practically equal by ONDA score (7.6 and 7.5)');
});

test('compare: an ambiguous brand resolves to the product of an ONDA duel page', async () => {
  const d = (await call('compare', { products: ['omnilux contour face', 'higherdose'] })).result.structuredContent;
  assert.deepEqual(d.products.map((p) => p.slug), ['omnilux-contour-face', 'higherdose-red-light-face-mask']);
  assert.equal(d.duel.winner, 'omnilux-contour-face');
  assert.equal(d.duel.label, 'WINNER: Omnilux Contour Face');
});

test('every duel: winner only with status "winner", label matches status, scores cover its products', async () => {
  const { readFileSync } = await import('node:fs');
  const data = JSON.parse(readFileSync(new URL('../data/reviews.json', import.meta.url), 'utf8'));
  for (const h of data.headToHeads) {
    assert.equal(h.winner !== null, h.winnerStatus === 'winner', h.slug);
    const prefix = { winner: 'WINNER: ', 'practically-equal': 'Practically equal by ONDA score (', 'depends-on-the-job': 'Higher ONDA score: ' }[h.winnerStatus];
    assert.ok(prefix && h.label.startsWith(prefix), h.slug);
    assert.deepEqual(Object.keys(h.onda_scores).sort(), [...h.products].sort(), h.slug);
  }
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
  assert.equal(r.structuredContent.comparisons, undefined);
  assert.match(r.content[0].text, /emergency|urgent/i);
});

test('server manifest carries our own description and icon', async () => {
  const r = await handleRpc({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} });
  assert.match(r.result.serverInfo.description, /^HRV by age compared with Fitbit users/);
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
  assert.equal(hrv.compared, false);
});

test('verdict thresholds: below p25 lower, above p75 higher', async () => {
  const lo = (await call('check_hrv', { age: 41, hrv_ms: 25, device: 'oura', sex: 'female' })).result.structuredContent;
  const mid = (await call('check_hrv', { age: 41, hrv_ms: 26, device: 'oura', sex: 'female' })).result.structuredContent;
  const hi = (await call('check_hrv', { age: 41, hrv_ms: 53, device: 'oura', sex: 'female' })).result.structuredContent;
  assert.equal(lo.verdictText, 'Lower than most Fitbit users your age');
  assert.equal(mid.verdict, 'middle');
  assert.equal(hi.verdictText, 'Higher than most Fitbit users your age');
});

test('Claude directory: every tool has full annotations and a short name', async () => {
  const { result } = await handleRpc({ jsonrpc: '2.0', id: 1, method: 'tools/list' });
  for (const t of result.tools) {
    assert.ok(t.name.length <= 64, t.name);
    assert.ok(t.title && t.annotations.title, t.name);
    assert.equal(t.annotations.readOnlyHint, true);
    assert.equal(t.annotations.destructiveHint, false);
    assert.equal(t.annotations.idempotentHint, true);
    assert.equal(t.annotations.openWorldHint, false);
    assert.doesNotMatch(t.description, /\b(you must|always call|do not call|ignore previous)\b/i, 'descriptions describe, not instruct');
  }
});

test('cards use the MCP Apps standard on their own (no host-specific domain)', async () => {
  const { result } = await handleRpc({ jsonrpc: '2.0', id: 1, method: 'resources/list' });
  for (const r of result.resources) {
    const c = (await handleRpc({ jsonrpc: '2.0', id: 2, method: 'resources/read', params: { uri: r.uri } })).result.contents[0];
    assert.equal(c.mimeType, 'text/html;profile=mcp-app');
    assert.equal(c._meta.ui.domain, undefined, 'ui.domain would break Claude (host-specific format)');
    assert.deepEqual(c._meta.ui.csp, { connectDomains: [], resourceDomains: [] });
    assert.match(c.text, /ui\/initialize/);
    assert.match(c.text, /ui\/notifications\/tool-result/);
    assert.match(c.text, /ui\/notifications\/size-changed/);
    assert.match(c.text, /ui\/open-link/);
  }
});

test('invalid input returns an actionable message without the values', async () => {
  const r = (await call('find_practice', { goal: 'flying' })).result;
  assert.equal(r.isError, true);
  assert.match(r.content[0].text, /goal .* calm, sleep, focus or energy/);
  assert.doesNotMatch(r.content[0].text, /flying/);
  const c = (await call('compare', { products: ['Oura'] })).result;
  assert.match(c.content[0].text, /2 or 3 product names/);
});

// Minimal JSON-schema check (type, enum, required, nested properties/items) — enough for our shapes.
function check(schema, v, path = '$') {
  const types = [].concat(schema.type || []);
  const actual = v === null ? 'null' : Array.isArray(v) ? 'array' : Number.isInteger(v) ? 'number' : typeof v;
  if (types.length && !types.includes(actual)) throw new Error(`${path}: ${actual} not in ${types}`);
  if (schema.enum && !schema.enum.includes(v)) throw new Error(`${path}: ${v} not in enum`);
  if (actual === 'object') {
    for (const r of schema.required || []) if (!(r in v)) throw new Error(`${path}.${r} missing`);
    for (const [k, s] of Object.entries(schema.properties || {})) if (k in v && v[k] !== undefined) check(s, v[k], `${path}.${k}`);
  }
  if (actual === 'array' && schema.items) v.forEach((x, i) => check(schema.items, x, `${path}[${i}]`));
}

test('every tool declares an outputSchema and its structuredContent matches it', async () => {
  const { result } = await handleRpc({ jsonrpc: '2.0', id: 1, method: 'tools/list' });
  const schema = Object.fromEntries(result.tools.map((t) => [t.name, t.outputSchema]));
  for (const t of result.tools) assert.equal(t.outputSchema?.type, 'object', t.name);
  const runs = [
    ['check_hrv', { age: 42, hrv_ms: 38, device: 'apple_watch' }],
    ['check_hrv', { age: 50, hrv_ms: 15, device: 'oura', red_flag_symptoms: true }],
    ['breathe_now', { technique: '478' }],
    ['find_practice', { goal: 'sleep', minutes: 3 }],
    ['compare', { products: ['Oura Ring 4', 'Whoop 5.0'], priority: 'hrv' }],
    ['compare', { products: ['ONDA', 'Calm'] }],
  ];
  for (const [name, args] of runs) check(schema[name], (await call(name, args)).result.structuredContent, name);
});

test('descriptions start with the ONDA Life name and carry one "Use for:" line', async () => {
  const { result } = await handleRpc({ jsonrpc: '2.0', id: 1, method: 'tools/list' });
  for (const t of result.tools) {
    assert.match(t.description, /^ONDA Life — /, t.name);
    assert.equal((t.description.match(/Use for:/g) || []).length, 1, t.name);
    const phrases = t.description.split('Use for:')[1].split(/\.\s/)[0].split(';').length;
    assert.ok(phrases >= 5 && phrases <= 8, `${t.name}: ${phrases} phrases`);
  }
});

test('each suggested practice links to that exact practice on /emoton', async () => {
  const d = (await call('find_practice', { goal: 'calm' })).result.structuredContent;
  for (const p of d.practices) assert.ok(p.playUrl.startsWith('https://onda-life.com/emoton?practice=' + p.id + '&utm_source=chatgpt'), p.playUrl);
  const { WIDGETS } = await import('../lib/widgets.js');
  assert.match(WIDGETS.practice.html, /p\.playUrl/);
});

test('server instructions describe, never instruct the model', async () => {
  const r = await handleRpc({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} });
  const s = r.result.instructions;
  assert.match(s, /^ONDA Life — /);
  assert.doesNotMatch(s, /\b(do not|don't|tell them|you must|always|never call|ignore)\b/i);
});
