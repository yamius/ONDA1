import { test } from 'node:test';
import assert from 'node:assert';
import { chartDaily, reconcileRows, cohortDay, measureIndex } from '../lib/reconcile.js';
import { missingDimensionReason } from '../lib/paywall-breakdowns.js';

const D0 = 1791072000; // 2026-10-04 UTC
test('chartDaily reads object rows (seconds) per measure', () => {
  const chart = { measures: [{ display_name: 'New Paid' }, { display_name: 'x' }],
    values: [{ cohort: D0, measure: 0, value: 2 }, { cohort: D0, measure: 1, value: 9 }, { cohort: D0 + 86400, measure: 0, value: 1 }] };
  assert.deepEqual(chartDaily(chart, measureIndex(chart, /new paid/i)), { '2026-10-04': 2, '2026-10-05': 1 });
  assert.equal(cohortDay(D0 * 1000), '2026-10-04');
});

test('reconcile: gap per day and per version, totals', () => {
  const ga4 = [
    { day: '2026-10-04', app_version: '1.9.6', users: 1, events: 1 },
    { day: '2026-10-05', app_version: '1.9.5', users: 1, events: 1 },
  ];
  const r = reconcileRows(ga4, { '2026-10-04': 2, '2026-10-05': 1, '2026-10-06': 1 }, { '2026-10-06': 1 });
  assert.equal(r.totals.gap, 2);
  assert.equal(r.totals.ga4_capture_pct, 50);
  assert.equal(r.by_day.find((d) => d.day === '2026-10-06').gap, 1);
  assert.deepEqual(r.by_version.map((v) => v.app_version), ['1.9.5', '1.9.6']);
});

test('missing dimension message is explicit', () => {
  assert.equal(missingDimensionReason('outcome'), 'create GA4 custom dimension outcome (event scope)');
});
