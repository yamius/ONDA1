/**
 * organic_sources — the source-type breakdown from ASC Analytics reports.
 *
 * The states that matter here are the NEGATIVE ones. These reports accumulate
 * from registration and are never backfilled, so "nothing yet" is the normal
 * first answer and must never be dressed up as a measurement of zero.
 */
import { test, mock } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const srcUrl = pathToFileURL(path.join(here, '..', 'lib', 'sources', 'asc-analytics.js')).href;

const WIN = { days: 28, start_date: '2026-08-04', end_date: '2026-09-01' };

// Mutable fixtures so each test can shape the API's answers.
const state = {
  requests: [{ id: 'req1', accessType: 'ONGOING', stoppedDueToInactivity: false }],
  report: { match: { id: 'rep1', name: 'App Store Discovery and Engagement Standard' }, available: [] },
  instances: [{ id: 'inst1', processingDate: '2026-08-30' }],
  rows: [],
};

const { rollUpBySource: realRollUp, findColumn: realFindColumn } =
  await import('../lib/sources/asc-analytics.js');

mock.module(srcUrl, {
  namedExports: {
    ascAnalyticsMissing: () => [],
    ascAppId: () => '6755912529',
    listReportRequests: async () => state.requests,
    findReport: async () => state.report,
    instancesInWindow: async () => state.instances,
    segmentRows: async () => state.rows,
    rollUpBySource: realRollUp,
    findColumn: realFindColumn,
    ascAnalyticsProbe: async () => ({ ok: true }),
  },
});

const { organicSourceBreakdown } = await import('../lib/organic-sources.js');

test('no registered request is not_registered, and says the data is unrecoverable', async () => {
  state.requests = [];
  const r = await organicSourceBreakdown(WIN, 49);
  assert.equal(r.available, false);
  assert.equal(r.reason, 'not_registered');
  assert.match(r.note, /never\s+backfilled|unrecoverable/i);
});

test('a request that Apple stopped is reported as stopped, not as pending', async () => {
  state.requests = [{ id: 'r', accessType: 'ONGOING', stoppedDueToInactivity: true }];
  const r = await organicSourceBreakdown(WIN, 49);
  assert.equal(r.reason, 'stopped_due_to_inactivity');
  assert.deepEqual(r.stopped_access_types, ['ONGOING']);
});

test('registered but no instances yet is report_pending, never an empty measurement', async () => {
  state.requests = [{ id: 'req1', accessType: 'ONGOING', stoppedDueToInactivity: false }];
  state.instances = [];
  const r = await organicSourceBreakdown(WIN, 49);
  assert.equal(r.available, false);
  assert.equal(r.reason, 'report_pending');
  assert.equal(r.by_source, undefined, 'no empty array masquerading as data');
});

test('an unrecognised report format lists the columns instead of guessing', async () => {
  state.instances = [{ id: 'inst1', processingDate: '2026-08-30' }];
  state.rows = [{ 'Some Other Column': '1', 'And Another': '2' }];
  const r = await organicSourceBreakdown(WIN, 49);
  assert.equal(r.reason, 'unrecognised_report_format');
  assert.deepEqual(r.columns_present, ['Some Other Column', 'And Another']);
});

test('rolls up by source type, keeping impressions and page views separate', async () => {
  state.rows = [
    { Date: '2026-08-30', 'Source Type': 'App Store Search', Event: 'Impression', Counts: '400' },
    { Date: '2026-08-30', 'Source Type': 'App Store Search', Event: 'Product Page View', Counts: '80' },
    { Date: '2026-08-30', 'Source Type': 'App Store Browse', Event: 'Impression', Counts: '150' },
    { Date: '2026-08-30', 'Source Type': 'Web Referrer', Event: 'Product Page View', Counts: '30' },
  ];
  const r = await organicSourceBreakdown(WIN, 49);
  assert.equal(r.available, true);
  const search = r.by_source.find((x) => x.source === 'App Store Search');
  assert.equal(search.impressions, 400);
  assert.equal(search.product_page_views, 80);
  assert.equal(search.events_total, 480, 'impressions and page views are not conflated into one metric');
  // 80/400 — where Apple gives both, the per-source conversion is honest.
  assert.equal(search.page_view_rate.pct, 20);
  assert.equal(search.page_view_rate.of, 400);
});

test('shares are against the VISIBLE sum and say so, because Apple omits small rows', async () => {
  const r = await organicSourceBreakdown(WIN, 49);
  const visible = r.by_source.reduce((s, x) => s + x.events_total, 0);
  assert.equal(r.n, visible);
  const pctSum = r.by_source.reduce((s, x) => s + x.share_of_visible.pct, 0);
  assert.ok(Math.abs(pctSum - 100) < 0.5, 'shares are of the visible sum, so they total 100%');
  for (const row of r.by_source) assert.equal(row.share_of_visible.of, visible);
  assert.match(r.thresholding_note, /fewer than\s+5 users/i);
  assert.match(r.thresholding_note, /OMITTED/);
});

test('every share carries its N, and low_data follows the denominator', async () => {
  state.rows = [{ 'Source Type': 'App Store Search', Event: 'Impression', Counts: '12' }];
  const r = await organicSourceBreakdown(WIN, 49);
  const row = r.by_source[0];
  assert.equal(row.share_of_visible.n, 12);
  assert.equal(row.share_of_visible.low_data, true, '12 < 30');
  assert.equal(r.low_data, true);
});

test('discovery events are never presented as comparable to install counts', async () => {
  state.rows = [{ 'Source Type': 'App Store Search', Event: 'Impression', Counts: '400' }];
  const r = await organicSourceBreakdown(WIN, 49);
  assert.match(r.versus_derived_organic, /DISCOVERY events/);
  assert.match(r.versus_derived_organic, /cannot be compared directly/);
  assert.match(r.versus_derived_organic, /49 installs/);
  assert.match(r.measurement_note, /Measured by Apple/);
});
