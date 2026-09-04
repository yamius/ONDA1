/**
 * Product parsers. Unit-tested on fixtures so they hold regardless of the live
 * repo, plus the honesty guarantee: what cannot be parsed is reported, never
 * dropped.
 */
import { test } from 'node:test';
import assert from 'node:assert';
import { lookupKey, resolveKey, flattenKeys, parsePractices, parseTrackCalls } from '../lib/productParse.js';

// ── locales ──

const EN = { practices: { result_a: 'You are.' }, practice_items: { micro_breath: 'Micro-Breath' } };
const UK = { practices: { result_a: 'Ти є.' }, practice_items: { micro_breath: 'Мікродих' } };
const RU = { practices: {}, practice_items: { micro_breath: 'Микродых' } }; // result_a MISSING

test('lookupKey returns every locale and flags the ones missing the key', () => {
  const r = lookupKey({ en: EN, uk: UK, ru: RU }, 'practices.result_a');
  assert.equal(r.values.en, 'You are.');
  assert.equal(r.values.uk, 'Ти є.');
  assert.deepEqual(r.missing_in, ['ru'], 'ru is missing result_a');
  assert.equal(r.fully_localised, false);
});

test('resolveKey walks nested keys and returns undefined when absent', () => {
  assert.equal(resolveKey(EN, 'practice_items.micro_breath'), 'Micro-Breath');
  assert.equal(resolveKey(EN, 'practice_items.nope'), undefined);
  assert.equal(resolveKey(EN, 'a.b.c.d'), undefined);
});

test('flattenKeys lists leaf keys under a prefix', () => {
  assert.deepEqual(flattenKeys(EN.practice_items, 'practice_items'), ['practice_items.micro_breath']);
});

// ── practices ──

const CIRCUITS = `
  const circuits = useMemo(() => [
    { id: 1, name: t('circuits.circuit_1_name'), element: 'TERRA', practices: [
      { id: 'p1-1', name: t('practice_items.micro_breath'), duration: t('practice_items.duration_3min'), maxQnt: 10, desc: t('practice_items.micro_breath_desc') },
      { id: 'p1-2', name: t('practice_items.sense_of_being'), duration: t('practice_items.duration_3min'), maxQnt: 10, desc: t('practice_items.sense_of_being_desc') },
      { id: 'p1-4', name: t('practice_items.still_wave'), duration: t('practice_items.duration_3min'), maxQnt: 10, desc: t('practice_items.still_wave_desc') },
    ]},
    { id: 2, name: t('circuits.circuit_2_name'), element: 'AQUA', practices: [
      { id: 'p2-1', name: t('practice_items.tide'), duration: t('practice_items.duration_6min'), maxQnt: 20, desc: t('practice_items.tide_desc') },
    ]},
  ], [i18n.language]);
`;

test('parsePractices reads every practice with its circuit and free flag', () => {
  const { practices, unparsed } = parsePractices(CIRCUITS, { freeIds: ['p1-1', 'p1-2', 'p1-3'] });
  assert.equal(practices.length, 4);
  assert.equal(unparsed.length, 0);
  const p1 = practices.find((p) => p.id === 'p1-1');
  assert.equal(p1.circuit, 1);
  assert.equal(p1.element, 'TERRA');
  assert.equal(p1.max_ond, 10);
  assert.equal(p1.free, true);
  assert.equal(practices.find((p) => p.id === 'p2-1').element, 'AQUA');
  assert.equal(practices.find((p) => p.id === 'p1-4').free, false);
});

test('free-only is exactly the three free practices present', () => {
  const { practices } = parsePractices(CIRCUITS, { freeIds: ['p1-1', 'p1-2', 'p1-3'] });
  const free = practices.filter((p) => p.free);
  assert.deepEqual(free.map((p) => p.id), ['p1-1', 'p1-2']); // p1-3 absent from fixture
});

test('a practice-shaped line that does not match the shape is reported, not dropped', () => {
  const broken = `
    { id: 'p1-1', name: t('practice_items.micro_breath'), duration: t('x'), maxQnt: 10, desc: t('y') },
    { id: 'p9-9', name: SOMETHING_WEIRD, broken },
  `;
  const { practices, unparsed } = parsePractices(broken);
  assert.equal(practices.length, 1);
  assert.equal(unparsed.length, 1, 'the broken practice-shaped line is surfaced');
  assert.match(unparsed[0].text, /p9-9/);
});

// ── track calls ──

test('parseTrackCalls captures event, params, and literal-vs-expr', () => {
  const src = `
    track('app_open', { platform });
    track('home_view', { source: 'first_run', is_first: isFirst });
  `;
  const { calls } = parseTrackCalls(src, 'x.tsx');
  const home = calls.find((c) => c.event === 'home_view');
  assert.equal(home.params.source.kind, 'literal');
  assert.equal(home.params.source.value, 'first_run');
  assert.equal(home.params.is_first.kind, 'expr');
  const open = calls.find((c) => c.event === 'app_open');
  assert.equal(open.params.platform.kind, 'shorthand');
});

test('a comment between params does not swallow the pair after it', () => {
  // This is the real bug found against the live hard-paywall call.
  const src = `
    track('paywall_view', {
      source: 'practice_gate_basic',
      // which attempt they are blocked on
      practice_index: attempts() + 1,
      free_used: used.size,
    });
  `;
  const { calls } = parseTrackCalls(src, 'x.tsx');
  const c = calls.find((x) => x.event === 'paywall_view');
  assert.ok('practice_index' in c.params, 'the param after a comment is not dropped');
  assert.equal(c.params.practice_index.kind, 'expr');
  assert.equal(c.params.source.value, 'practice_gate_basic');
});

test('the two paywall_view sources are both captured', () => {
  const src = `
    track('paywall_view', { source: 'post_first_experience', practice_id: id });
    track('paywall_view', { source: 'practice_gate_basic', practice_id: id });
  `;
  const { calls } = parseTrackCalls(src, 'x.tsx');
  const sources = calls.filter((c) => c.event === 'paywall_view').map((c) => c.params.source.value);
  assert.deepEqual(sources.sort(), ['post_first_experience', 'practice_gate_basic']);
});
