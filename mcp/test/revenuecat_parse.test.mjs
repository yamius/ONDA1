/**
 * The real RevenueCat chart parser (not mocked). Charts API v2 returns `values`
 * as objects {cohort, measure, value, incomplete}; the old tuple-only parser
 * skipped them all, so trials_new read 0 despite a real trial on 2026-08-28.
 */
import { test } from 'node:test';
import assert from 'node:assert';
import { sumSeries, lastValue, measureColumn } from '../lib/sources/revenuecat.js';

const DAY = 86400;
const t0 = Date.UTC(2026, 7, 25) / 1000;
const trialsNew = {
  object: 'chart_data',
  measures: [{ display_name: 'New Trials', unit: '#' }],
  values: [
    { cohort: t0, measure: 0, value: 0, incomplete: false },
    { cohort: t0 + 3 * DAY, measure: 0, value: 1, incomplete: false },
    { cohort: t0 + 4 * DAY, measure: 0, value: 0, incomplete: true },
  ],
};

test('object-shaped values: trials_new sums to the real count', () => {
  assert.deepEqual(sumSeries(trialsNew), { total: 1, points: 3 });
});

test('multi-measure chart: only the chosen measure is read, by name', () => {
  const conv = {
    measures: [{ display_name: 'Trials' }, { display_name: 'Conversions' }, { display_name: 'Conversion Rate' }],
    values: [
      { cohort: t0 + DAY, measure: 2, value: 100 },
      { cohort: t0 + DAY, measure: 0, value: 1 },
      { cohort: t0 + DAY, measure: 1, value: 1 },
      { cohort: t0, measure: 2, value: 50 },
      { cohort: t0 + 2 * DAY, measure: 2, value: null },
    ],
  };
  assert.equal(measureColumn(conv, /rate/i), 3);
  assert.equal(lastValue(conv, 3), 100, 'last non-null by cohort time, rate column');
  assert.equal(sumSeries(conv, 2).total, 1);
});

test('tuple-shaped values still work', () => {
  assert.equal(sumSeries({ values: [[1, 4], [2, 6]] }).total, 10);
  assert.equal(lastValue({ values: [[1, 0.1], [2, null]] }), 0.1);
});
