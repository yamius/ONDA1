/**
 * revenue_review, and the installs_review inconsistency guard.
 *
 * The guard exists because the tool reported paid:254 against total:220 over 90
 * days - 115.5% paid and zero organic - with a completely straight face. A tool
 * that states the impossible without flinching is worse than one that fails.
 */
import { test, mock } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const rcUrl = pathToFileURL(path.join(here, '..', 'lib', 'sources', 'revenuecat.js')).href;
const ascUrl = pathToFileURL(path.join(here, '..', 'lib', 'sources', 'asc.js')).href;
const tenjinUrl = pathToFileURL(path.join(here, '..', 'lib', 'sources', 'tenjin.js')).href;

// ---------------------------------------------------------------- installs --

mock.module(ascUrl, {
  namedExports: {
    ascMissing: () => [],
    ascInstalls: async () => ({ units: 220, by_day: {}, missing_days: [] }),
    ascProbe: async () => ({ ok: true }),
  },
});
mock.module(tenjinUrl, {
  namedExports: {
    tenjinMissing: () => [],
    tenjinSpendReport: async () => ({ data: [] }),
    tenjinProbe: async () => ({ ok: true }),
    // The live shape of the defect: Tenjin attributes more than Apple sold.
    summariseByChannel: () => [
      { channel: 'Google Ads', installs: 250, spend: 500, cpi: 2 },
      { channel: 'Meta', installs: 4, spend: 40, cpi: 10 },
    ],
  },
});

const { installsReview } = await import('../tools/installs_review.js');

test('paid > total refuses to derive a percentage or an organic residual', async () => {
  const r = await installsReview({ since: 90 });
  assert.equal(r.split.inconsistent_sources, true);
  assert.equal(r.split.total_installs_app_store_connect, 220);
  assert.equal(r.split.paid_installs_tenjin, 254);
  assert.equal(r.split.excess, 34);
  // The impossible outputs must be absent, not merely clamped.
  assert.equal(r.split.organic, undefined, 'no organic residual when inputs contradict');
  assert.equal(r.split.paid?.of_total, undefined, 'no 115% percentage');
  assert.ok(r.split.likely_causes.some((c) => /SKAN/.test(c)), 'SKAN modelling named as a likely cause');
});

// ----------------------------------------------------------------- revenue --

const REVENUE_TYPES_SENT = [];

const OVERVIEW = {
  object: 'overview_metrics',
  currency: 'USD',
  metrics: [
    { id: 'active_subscriptions', display_name: 'Active Subscriptions', value: 3 },
    { id: 'active_trials', display_name: 'Active Trials', value: 5 },
    { id: 'mrr', display_name: 'MRR', value: 44.97 },
    { id: 'revenue', display_name: 'Revenue', value: 89.94 },
  ],
};

// Separate, unmocked instance of the source module (query string = new URL).
const real = await import(rcUrl + '?real');

// Shapes copied from the live debug output of 2026-10-24 (aggregates only).
const row = (day, measure, value, incomplete = false) => ({ cohort: 1787616000 + day * 86400, incomplete, measure, value });
const LIVE_CHARTS = {
  trials_new: {
    measures: [{ display_name: 'New Trials', unit: '#' }],
    summary: { average: { 'New Trials': 0.2 }, total: { 'New Trials': 12 } },
    values: [row(0, 0, 4), row(1, 0, 6), row(2, 0, 2), row(3, 0, 0, true)],
  },
  trial_conversion_rate: {
    measures: ['Trial Starts', 'Conversions', 'Expirations', 'Pending', 'Conversion Rate'].map((d) => ({ display_name: d })),
    summary: { total: { 'Trial Starts': 12, Conversions: 2, Expirations: 9, Pending: 1, 'Conversion Rate': 16.67 } },
    // Last day quiet: its rate is 0 - the old "last value" read exactly this.
    values: [row(0, 0, 12), row(0, 1, 2), row(0, 4, 16.67), row(5, 0, 0), row(5, 4, 0)],
  },
  refund_rate: {
    measures: ['Transactions', 'Refunded Transactions', 'Refund Rate'].map((d) => ({ display_name: d })),
    summary: { total: { Transactions: 6, 'Refunded Transactions': 1, 'Refund Rate': 16.67 } },
    values: [],
  },
  churn: {
    measures: ['Actives', 'Churned Actives', 'Churn Rate'].map((d) => ({ display_name: d })),
    summary: { average: { Actives: 5, 'Churned Actives': 0.02, 'Churn Rate': 0.31 } }, // no total
    values: [row(0, 0, 5), row(0, 1, 0), row(0, 2, 0), row(39, 0, 5), row(39, 1, 1), row(39, 2, 20), row(59, 0, 5), row(59, 1, 0), row(59, 2, 0)],
  },
};

mock.module(rcUrl, {
  namedExports: {
    revenueCatMissing: () => [],
    revenueCatProbe: async () => ({ ok: true }),
    overviewMetrics: async () => OVERVIEW,
    REVENUE_TYPES: ['revenue', 'revenue_net_of_taxes', 'proceeds'],
    revenueMetric: async ({ revenueType }) => (REVENUE_TYPES_SENT.push(revenueType), {
      object: 'revenue_metric',
      currency: 'USD',
      revenue_type: revenueType,
      // proceeds is NOT gross*0.7 — that is the whole point.
      value: revenueType === 'proceeds' ? 76.4 : 89.94,
    }),
    chartData: async (name) => LIVE_CHARTS[name] ?? { values: [], segments: [] },
    chartOptions: async () => ({ segments: [{ id: 'store', display_name: 'Store' }] }),
    // The REAL parsers, so the tests exercise the live row/summary shapes.
    measureColumn: real.measureColumn,
    sumSeries: real.sumSeries,
    lastValue: real.lastValue,
    summaryValue: real.summaryValue,
    findSegment: (opts, cands) => {
      const list = opts?.segments ?? [];
      const hit = list.find((s) => cands.some((c) => String(s.id).includes(c)));
      return { match: hit ?? null, available: list.map((s) => s.id) };
    },
  },
});

const { revenueReview } = await import('../tools/revenue_review.js');

test('net revenue comes from the API, not from subtracting a flat 30%', async () => {
  const r = await revenueReview({ since: 28, view: 'top' });
  assert.equal(r.revenue.gross.value, 89.94);
  assert.equal(r.revenue.net_proceeds.value, 76.4);
  // 89.94 * 0.7 = 62.96 — if net ever equals that, someone reintroduced the
  // hardcoded commission and the number is wrong for a 15% seller.
  assert.notEqual(Math.round(r.revenue.net_proceeds.value * 100) / 100, 62.96);
  assert.match(r.revenue.net_note, /NOT gross minus a flat 30%/);
});

test('snapshot says plainly that its windows ignore `since`', async () => {
  const r = await revenueReview({ since: 90, view: 'top' });
  assert.equal(r.snapshot.active_subscriptions, 3);
  assert.equal(r.snapshot.active_trials, 5);
  assert.match(r.snapshot.note, /FIXED/);
  assert.match(r.snapshot.note, /do NOT follow/);
});

test('trials carry their N and a low_data flag', async () => {
  const r = await revenueReview({ since: 28, view: 'top' });
  assert.equal(r.trials.started, 12);            // 4 + 6 + 2
  assert.equal(r.trials.conversion.of_trials_started, 12);
  assert.equal(r.trials.conversion.low_data, true, '12 < 30');
});

test('conversion = RevenueCat window summary, not the last (quiet) day', async () => {
  const r = await revenueReview({ since: 60, view: 'top' });
  const c = r.trials.conversion;
  assert.equal(c.rate_pct, 16.67);
  assert.equal(c.conversions, 2);
  assert.equal(c.expirations, 9);
  assert.equal(c.pending, 1);
  assert.equal(c.rate_of_decided_pct, 18.18);
  assert.equal(r.trials.cancelled_or_expired.expired, 9);
});

test('churn counts churned actives over the window (summary has no total)', async () => {
  const r = await revenueReview({ since: 60, view: 'top' });
  assert.equal(r.churn.churned_in_window, 1);
  assert.equal(r.churn.avg_daily_churn_rate_pct, 0.31);
  assert.equal(r.churn.window_churn_pct, 20);
  assert.equal(r.refunds.count, 1);
  assert.equal(r.refunds.rate_pct, 16.67);
});

test('a breakdown with no matching segment reports what the chart does support', async () => {
  const r = await revenueReview({ since: 28, view: 'full' });
  assert.equal(r.by_channel.available, false);
  assert.deepEqual(r.by_channel.segments_the_chart_does_support, ['store']);
});

test('no Tenjin note in revenue_review output', async () => {
  const r = await revenueReview({ since: 28, view: 'top' });
  assert.equal(r.tenjin_purchase_events_note, undefined);
  assert.equal(r._debug, undefined, 'debug only on request (debug=true or view=full)');
});

test('refund lag is stated, since it rewrites the window retroactively', async () => {
  const r = await revenueReview({ since: 28, view: 'top' });
  assert.match(r.data_lag_note, /REFUNDS/);
  assert.match(r.data_lag_note, /retroactively/);
});

test('only spec enum values are ever sent as revenue_type', async () => {
  // The API rejects the literal word `gross` with a 400. It appears in the
  // docs prose as a description of `revenue`, not as a value — reading the
  // description as the value is exactly the bug this guards.
  const ALLOWED = new Set(['revenue', 'revenue_net_of_taxes', 'proceeds']);
  REVENUE_TYPES_SENT.length = 0;
  await revenueReview({ since: 28, view: 'top' });
  assert.ok(REVENUE_TYPES_SENT.length >= 2, 'both revenue figures requested');
  for (const t of REVENUE_TYPES_SENT) {
    assert.ok(ALLOWED.has(t), `revenue_type "${t}" is not in the spec enum`);
  }
  assert.ok(REVENUE_TYPES_SENT.includes('revenue'), 'gross is requested as `revenue`');
  assert.ok(!REVENUE_TYPES_SENT.includes('gross'), '`gross` is not a valid value');
});
