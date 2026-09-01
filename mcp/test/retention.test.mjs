/**
 * retention_review.
 *
 * The load-bearing behaviour is the refusal to count a cohort that is too young
 * to have the milestone. A cohort that installed yesterday has a d7 of zero by
 * arithmetic; averaging it in makes healthy retention look like a collapse, and
 * that is exactly the kind of quiet lie these tools exist to prevent.
 */
import { test, mock } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const ga4Url = pathToFileURL(path.join(here, '..', 'lib', 'sources', 'ga4.js')).href;

// Window ends 2026-09-01. Ages are measured from that date.
const WIN_END = '2026-09-01';

const calls = [];
const state = { open: [], practice: [] };

mock.module(ga4Url, {
  namedExports: {
    ga4Missing: () => [],
    internalFilter: (m) => ({ mode: m }),
    appVersionFilter: (v) => (v ? { version: v } : null),
    andFilters: (...f) => f.filter(Boolean)[0] ?? undefined,
    eventNameFilter: (n) => ({ events: n }),
    runReport: async () => ({ rows: [] }),
    ga4Probe: async () => ({ ok: true }),
    cohortReport: async (opts) => {
      calls.push(opts);
      return opts.eventName ? state.practice : state.open;
    },
  },
});

const { retentionReview } = await import('../tools/retention_review.js');

/** rows(cohortDay, size, {day: active}) */
function rows(cohort, size, active) {
  return Object.entries(active).map(([nthDay, activeUsers]) => ({
    cohort, nthDay: Number(nthDay), activeUsers, totalUsers: size,
  }));
}

test('retention is reported by open AND by practice, never as one number', async () => {
  state.open = rows('2026-08-01', 100, { 1: 30, 7: 10 });
  state.practice = rows('2026-08-01', 100, { 1: 12, 7: 4 });
  const r = await retentionReview({ since: 28 });

  assert.equal(r.by_open.milestones.d1.pct, 30);
  assert.equal(r.by_practice.milestones.d1.pct, 12);
  assert.notEqual(r.by_open.milestones.d1.pct, r.by_practice.milestones.d1.pct);
  assert.match(r.definitions.by_practice, /opening an app is not retention/i);
  // Both queries actually went out, one of them filtered on the event.
  const evented = calls.filter((c) => c.eventName === 'practice_start');
  assert.ok(evented.length >= 1, 'the practice-based cohort query is really made');
});

test('a cohort too young for a milestone is excluded, not counted as zero', async () => {
  // 2026-08-30 is 2 days before the window end: old enough for nothing.
  state.open = [
    ...rows('2026-08-01', 100, { 1: 30, 7: 10 }),   // 31 days old — complete
    ...rows('2026-08-30', 50, { 1: 0, 7: 0 }),      // 2 days old — d7 impossible
  ];
  state.practice = [];
  const r = await retentionReview({ since: 28 });

  // Only the mature cohort's 100 users form the d7 denominator; if the young
  // one were included it would be 10/150 = 6.7% instead of 10%.
  assert.equal(r.by_open.milestones.d7.of, 100, 'young cohort excluded from the denominator');
  assert.equal(r.by_open.milestones.d7.pct, 10);
  assert.equal(r.by_open.milestones.d7.cohorts_too_young, 1);
  assert.equal(r.by_open.milestones.d7.cohorts_included, 1);
});

test('when no cohort is old enough, the milestone says "no data", not 0%', async () => {
  state.open = rows('2026-08-31', 40, { 1: 0 });   // 1 day old
  state.practice = [];
  const r = await retentionReview({ since: 28 });
  const d30 = r.by_open.milestones.d30;
  assert.equal(d30.incomplete, true);
  assert.equal(d30.of, 0);
  assert.match(d30.note, /not zero retention/i);
});

test('per-cohort rows mark immature milestones instead of showing 0%', async () => {
  state.open = [
    ...rows('2026-08-01', 100, { 1: 30, 7: 10 }),
    ...rows('2026-08-29', 20, { 1: 5 }),
  ];
  state.practice = [];
  const r = await retentionReview({ since: 28, view: 'by_cohort' });
  const young = r.by_open.by_cohort.find((c) => c.cohort === '2026-08-29');
  assert.equal(young.d1.pct, 25, 'd1 is measurable at 3 days old');
  assert.equal(young.d7.incomplete, true);
  assert.equal(young.d7.pct, null, 'no percentage invented for a milestone that has not happened');
  assert.match(young.d7.reason, /needs 9d/);
});

test('the pre-redesign baseline travels with the current number', async () => {
  state.open = rows('2026-08-01', 100, { 1: 30, 7: 10 });
  state.practice = [];
  const r = await retentionReview({ since: 28 });
  assert.equal(r.baseline.d1_pct, 3.42);
  assert.equal(r.baseline.d7_pct, 0.68);
  assert.equal(r.baseline.installs, 145);
  const d7 = r.baseline.comparison.find((c) => c.milestone === 'd7');
  assert.equal(d7.baseline_pct, 0.68);
  assert.equal(d7.current_pct_by_open, 10);
  assert.equal(d7.delta_pp, 9.32);
  assert.equal(d7.current_n, '10/100', 'the N travels with the comparison');
  // The baseline is an app-open number, so it is compared to app-open only.
  assert.match(d7.note, /compared against by_open/);
  assert.match(r.baseline.caution, /one or two people/);
});

test('every rate carries its N and a low_data flag', async () => {
  state.open = rows('2026-08-01', 12, { 1: 4 });
  state.practice = [];
  const r = await retentionReview({ since: 28 });
  const d1 = r.by_open.milestones.d1;
  assert.equal(d1.n, 4);
  assert.equal(d1.of, 12);
  assert.equal(d1.low_data, true, '12 < 30');
});

test('the internal filter and app_version are passed through to the query', async () => {
  calls.length = 0;
  state.open = rows('2026-08-01', 100, { 1: 30 });
  state.practice = [];
  const r = await retentionReview({ since: 28, internal: 'only', app_version: '1.8.8' });
  assert.equal(r.filters.internal, 'only');
  assert.equal(r.filters.app_version, '1.8.8');
  assert.ok(calls.every((c) => c.baseFilter !== undefined), 'a filter is built and passed down');
});

test('channel is declared unavailable rather than guessed at', async () => {
  state.open = rows('2026-08-01', 100, { 1: 30 });
  state.practice = [];
  const r = await retentionReview({ since: 28, view: 'full' });
  assert.equal(r.by_channel.available, false);
  assert.match(r.by_channel.reason, /restrict the dimensions/);
});
