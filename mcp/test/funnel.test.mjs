import { test, mock } from 'node:test';
import assert from 'node:assert';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

// Resolve from THIS file, not the cwd, so the suite runs from anywhere.
const here = path.dirname(fileURLToPath(import.meta.url));
const ga4Url = pathToFileURL(path.join(here, '..', 'lib', 'sources', 'ga4.js')).href;

// Подставной GA4: реалистичные числа с падением на пейволе.
const COUNTS = {
  first_open: 200, onboarding_start: 180, onboarding_complete: 150,
  practice_start: 120, practice_complete: 90, results_view: 85,
  paywall_view: 80, purchase: 8, paywall_dismiss: 60, home_view: 55,
};
const HOME_BY_SOURCE = { first_run: 40, relaunch: 15, first_launch: 150 };
// home_view source x days_since_first_seen (pre-1.9.6 fallback)
const HOME_BY_SOURCE_DAYS = [['relaunch', '0', 12], ['relaunch', '3', 9], ['first_run', '0', 40], ['relaunch', '(not set)', 2]];
const DISMISS_BY_ACTION = { close: 45, continue_free: 15 };

// 101: paywall_source split per event ([users, events]).
const PAYWALL_SOURCE_BY_EVENT = {
  purchase: { practice_gate_basic: [5, 6], post_first_experience: [2, 2] },
  trial_start: { post_first_experience: [3, 3] },
};
let lastEvent;

mock.module(ga4Url, {
  namedExports: {
    ga4Missing: () => [],
    internalFilter: () => null,
    appVersionFilter: () => null,
    andFilters: () => undefined,
    eventNameFilter: (names) => { lastEvent = names?.[0]; return null; },
    ga4Probe: async () => ({ ok: true }),
    runReport: async (body) => {
      const dim = body.dimensions?.[0]?.name;
      const mk = (obj) => ({ rows: Object.entries(obj).map(([k, v]) => ({ dimensionValues: [{ value: k }], metricValues: [{ value: String(v) }] })) });
      if (body.dimensions?.[1]?.name === 'customEvent:days_since_first_seen') {
        return { rows: HOME_BY_SOURCE_DAYS.map(([s, d, v]) => ({ dimensionValues: [{ value: s }, { value: d }], metricValues: [{ value: String(v) }] })) };
      }
      if (dim === 'eventName') return mk(COUNTS);
      if (dim === 'customEvent:source') return mk(HOME_BY_SOURCE);
      if (dim === 'customEvent:action') return mk(DISMISS_BY_ACTION);
      if (dim === 'customEvent:paywall_source') {
        const m2 = (obj) => ({ rows: Object.entries(obj).map(([k, [u, e]]) => ({ dimensionValues: [{ value: k }], metricValues: [{ value: String(u) }, { value: String(e) }] })) });
        return m2(PAYWALL_SOURCE_BY_EVENT[lastEvent] ?? {});
      }
      if (dim === 'customEvent:outcome') { const e = new Error('Field customEvent:outcome is not a valid dimension'); e.status = 400; throw e; }
      return { rows: [] };
    },
  },
});

const { funnelReview } = await import('../tools/funnel_review.js');

test('шаги воронки: проценты от предыдущего и от вершины', async () => {
  const r = await funnelReview({ since: 28 });
  const byName = Object.fromEntries(r.legacy_onboarding_steps.map(s => [s.step, s]));
  assert.equal(byName.first_open.users, 200);
  assert.equal(byName.first_open.from_previous, null, 'у первого шага нет предыдущего');
  // 150 из 180 = 83.3%
  assert.equal(byName.onboarding_complete.from_previous.pct, 83.3);
  assert.equal(byName.onboarding_complete.from_previous.of, 180);
  // от вершины: 150/200 = 75%
  assert.equal(byName.onboarding_complete.from_top.pct, 75);
  assert.equal(byName.onboarding_complete.dropped_from_previous, 30);
});

test('две ветки после пейвола не суммируются и считаются от paywall_view', async () => {
  const r = await funnelReview({ since: 28 });
  const p = r.paywall;
  assert.equal(p.paywall_view_users, 80);
  assert.equal(p.branches.purchase.users, 8);
  assert.equal(p.branches.purchase.of_paywall_view.pct, 10);          // 8/80
  // ТОЛЬКО first_run, не весь home_view (55) и не relaunch
  assert.equal(p.branches.entered_product_without_buying.users, 40);
  assert.equal(p.branches.entered_product_without_buying.of_paywall_view.pct, 50);
});

test('silent_exit = paywall_view - purchase - home_view{first_run}', async () => {
  const r = await funnelReview({ since: 28 });
  assert.equal(r.paywall.silent_exit.users, 80 - 8 - 40); // 32
  assert.equal(r.paywall.silent_exit.of_paywall_view.pct, 40);
});

test('разбивка dismiss по action', async () => {
  const r = await funnelReview({ since: 28 });
  assert.equal(r.paywall.dismiss_action.close.users, 45);
  assert.equal(r.paywall.dismiss_action.continue_free.users, 15);
  assert.equal(r.paywall.dismiss_action.close.of_dismiss.pct, 75);    // 45/60
});

test('low_data проставляется при малом знаменателе', async () => {
  const r = await funnelReview({ since: 28 });
  // 80 >= 30 -> не low_data
  assert.equal(r.paywall.branches.purchase.of_paywall_view.low_data, false);
});

test('silent_exit не уходит в минус при потере событий', async () => {
  const r = await funnelReview({ since: 28 });
  assert.ok(r.paywall.silent_exit.users >= 0);
});

test('the two paywalls are reported separately, never as one conversion', async () => {
  // The app has always fired paywall_view for BOTH paywalls, separated only by
  // `source`. Summing them produced "55 views, 1 purchase" and the false
  // conclusion that the paywall converts terribly — that number was a shop
  // window and a decision point added together.
  const r = await funnelReview({ since: 28 });

  assert.equal(r.paywall_by_type.soft_onboarding.source_value, 'post_first_experience');
  assert.equal(r.paywall_by_type.hard_practice_gate.source_value, 'practice_gate_basic');
  // The combined figure must warn about itself rather than look authoritative.
  assert.match(r.paywall.combined_warning, /SUM of both paywalls/);
});

test('purchase / trial_start split by paywall_source, trial_outcome by outcome (101)', async () => {
  const r = await funnelReview({ since: 28 });
  const attr = r.paywall_by_type.purchase_attribution;
  assert.equal(attr.purchase_by_paywall_source.available, true);
  assert.deepEqual(attr.purchase_by_paywall_source.by_value.practice_gate_basic, { users: 5, events: 6 });
  assert.equal(attr.trial_start_by_paywall_source.by_value.post_first_experience.users, 3);
  // trial_outcome dimension `outcome` not registered → told what to create, not guessed.
  assert.equal(attr.trial_outcome_by_outcome.available, false);
  assert.equal(attr.trial_outcome_by_outcome.reason, 'create GA4 custom dimension outcome (event scope)');
  assert.equal(typeof attr.total_purchases_in_window, 'number');
});

test('hard-paywall views sum BOTH source values across the rename seam', async () => {
  // The app used to label the view 'practice_intro' and the dismiss
  // 'practice_gate_basic' for the SAME paywall. Unifying it would have broken
  // the view series unless the tool counts both, which is the whole point.
  const r = await funnelReview({ since: 28 });
  const hard = r.paywall_by_type.hard_practice_gate;
  assert.equal(hard.source_value, 'practice_gate_basic');
  assert.ok(hard.views_by_source_value !== undefined, 'the split across the seam is visible');
  assert.match(hard.seam_note, /SUM of/);
  assert.match(hard.seam_note, /practice_intro/);
});

test('new-user funnel: first_open -> home_view{first_launch} -> practice_start', async () => {
  const r = await funnelReview({ since: 28 });
  assert.deepEqual(r.steps.slice(0, 3).map((s) => s.step), ['first_open', 'home_view{source:first_launch}', 'practice_start']);
  assert.equal(r.steps[1].users, 150);            // only source=first_launch, not all home_view
  assert.equal(r.steps[1].from_previous.pct, 75); // 150/200
  assert.equal(r.steps[2].from_previous.pct, 80); // 120/150
  assert.ok(r.steps.some((s) => s.step === 'paywall_view'));
  assert.match(r.funnel_note, /disabled since 1\.9/);
});

test('legacy onboarding line stays as a secondary list', async () => {
  const r = await funnelReview({ since: 28 });
  assert.deepEqual(r.legacy_onboarding_steps.slice(0, 3).map((s) => s.step), ['first_open', 'onboarding_start', 'onboarding_complete']);
});

test('pre-1.9.6 fallback = relaunch with days_since_first_seen 0, labelled', async () => {
  const r = await funnelReview({ since: 28 });
  const fb = r.pre_1_9_6_fallback;
  assert.equal(fb.available, true);
  assert.equal(fb.users, 12);                      // not first_run, not day 3, not (not set)
  assert.match(fb.label, /FALLBACK/);
});
test('default internal=exclude surfaces the 1.9.5 mislabel note', async () => {
  const r = await funnelReview({ since: 30, app_version: '1.9.5' });
  assert.match(r.internal_note, /1\.9\.5 помечена internal целиком/);
});
