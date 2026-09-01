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

test('report requests are read through the app relationship, not the collection', async () => {
  // GET /v1/analyticsReportRequests returns 403 FORBIDDEN_ERROR: that resource
  // allows only CREATE, DELETE and GET_INSTANCE. The 403 is about the
  // OPERATION, not about permissions — the key that hit it had Admin all along.
  const fs = await import('node:fs');
  const client = fs.readFileSync(new URL('../lib/sources/asc-analytics.js', import.meta.url), 'utf8');
  assert.ok(
    /\/apps\/\$\{ascAppId\(\)\}\/analyticsReportRequests/.test(client),
    'must list via /v1/apps/{id}/analyticsReportRequests',
  );
  assert.ok(
    !/API\}\/analyticsReportRequests\?/.test(client),
    'must not list the top-level analyticsReportRequests collection',
  );

  const script = fs.readFileSync(new URL('../scripts/register-analytics-reports.mjs', import.meta.url), 'utf8');
  assert.ok(/\/apps\/\$\{APP_ID\}\/analyticsReportRequests/.test(script), 'script lists via the app relationship');
  // The script may still POST to the collection — CREATE is allowed there.
  assert.ok(/method: 'POST'/.test(script), 'creation still posts to the collection, which allows CREATE');
});

test('a 403 naming an operation is not blamed on the Admin role', async () => {
  const fs = await import('node:fs');
  const script = fs.readFileSync(new URL('../scripts/register-analytics-reports.mjs', import.meta.url), 'utf8');
  assert.ok(/UNSUPPORTED OPERATION/.test(script), 'operation errors are explained as such');
  // The role hint must be CONDITIONAL. The original asserted a missing role on
  // any 403 and sent the operator looking in the wrong place. Only live
  // guidance is checked — the comment recording that mistake is deliberate.
  const guidance = script
    .split(/\r?\n/)
    .filter((l) => /lines\.push/.test(l))
    .join('\n');
  assert.ok(/Admin role/.test(guidance), 'the role hint still exists for genuine permission failures');
  assert.ok(
    /If the body does not name an operation/.test(guidance),
    'the role hint is conditioned on the body not naming an operation',
  );
});
