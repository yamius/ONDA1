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

mock.module(rcUrl, {
  namedExports: {
    revenueCatMissing: () => [],
    revenueCatProbe: async () => ({ ok: true }),
    overviewMetrics: async () => OVERVIEW,
    revenueMetric: async ({ revenueType }) => ({
      object: 'revenue_metric',
      currency: 'USD',
      revenue_type: revenueType,
      // proceeds is NOT gross*0.7 — that is the whole point.
      value: revenueType === 'proceeds' ? 76.4 : 89.94,
    }),
    chartData: async (name) => {
      if (name === 'trials_new') return { values: [[1, 4], [2, 6], [3, 2]] };
      if (name === 'trial_conversion_rate') return { values: [[1, 0.1], [2, 0.25]] };
      if (name === 'refund_rate') return { values: [[1, 1], [2, 0]] };
      if (name === 'churn') return { values: [[1, 0.04], [2, 0.06]] };
      return { values: [], segments: [] };
    },
    chartOptions: async () => ({ segments: [{ id: 'store', display_name: 'Store' }] }),
    sumSeries: (c, i = 1) => {
      let total = 0, points = 0;
      for (const row of c?.values ?? []) {
        if (Array.isArray(row) && typeof row[i] === 'number') { total += row[i]; points++; }
      }
      return { total, points };
    },
    lastValue: (c, i = 1) => {
      const rows = c?.values ?? [];
      for (let k = rows.length - 1; k >= 0; k--) if (typeof rows[k]?.[i] === 'number') return rows[k][i];
      return null;
    },
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

test('cancelled trials are declared unavailable rather than invented', async () => {
  const r = await revenueReview({ since: 28, view: 'top' });
  assert.equal(r.trials.cancelled_or_expired.available, false);
  assert.match(r.trials.cancelled_or_expired.reason, /still running/);
});

test('a breakdown with no matching segment reports what the chart does support', async () => {
  const r = await revenueReview({ since: 28, view: 'full' });
  assert.equal(r.by_channel.available, false);
  assert.deepEqual(r.by_channel.segments_the_chart_does_support, ['store']);
});

test('activity in RevenueCat plus silence in Tenjin is called a contradiction', async () => {
  const r = await revenueReview({ since: 28, view: 'top' });
  assert.equal(r.tenjin_purchase_events_note.revenuecat_sees_activity, true);
  assert.match(r.tenjin_purchase_events_note.verdict, /CONTRADICTION/);
  assert.match(r.tenjin_purchase_events_note.verdict, /In-App Purchase/);
  // The Tenjin side must be labelled as operator-supplied, not as an API read.
  assert.match(r.tenjin_purchase_events_note.tenjin_dashboard_state, /NOT something read through an API/);
});

test('refund lag is stated, since it rewrites the window retroactively', async () => {
  const r = await revenueReview({ since: 28, view: 'top' });
  assert.match(r.data_lag_note, /REFUNDS/);
  assert.match(r.data_lag_note, /retroactively/);
});
