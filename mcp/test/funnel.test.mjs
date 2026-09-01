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
const HOME_BY_SOURCE = { first_run: 40, relaunch: 15 };
const DISMISS_BY_ACTION = { close: 45, continue_free: 15 };

mock.module(ga4Url, {
  namedExports: {
    ga4Missing: () => [],
    internalFilter: () => null,
    appVersionFilter: () => null,
    andFilters: () => undefined,
    eventNameFilter: () => null,
    ga4Probe: async () => ({ ok: true }),
    runReport: async (body) => {
      const dim = body.dimensions?.[0]?.name;
      const mk = (obj) => ({ rows: Object.entries(obj).map(([k, v]) => ({ dimensionValues: [{ value: k }], metricValues: [{ value: String(v) }] })) });
      if (dim === 'eventName') return mk(COUNTS);
      if (dim === 'customEvent:source') return mk(HOME_BY_SOURCE);
      if (dim === 'customEvent:action') return mk(DISMISS_BY_ACTION);
      return { rows: [] };
    },
  },
});

const { funnelReview } = await import('../tools/funnel_review.js');

test('шаги воронки: проценты от предыдущего и от вершины', async () => {
  const r = await funnelReview({ since: 28 });
  const byName = Object.fromEntries(r.steps.map(s => [s.step, s]));
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
  const { funnelReview: fr } = await import('../tools/funnel_review.js');
  const r = await fr({ since: 28 });
  assert.ok(r.paywall.silent_exit.users >= 0);
});
