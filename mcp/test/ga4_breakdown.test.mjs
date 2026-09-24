/**
 * ga4_breakdown — the arithmetic the tool owns, with GA4 runReport mocked:
 * shares by UNIQUE USERS (not events), the (not set) mis-addressing guard, and
 * event-independence (metrics_source works on practice_complete too).
 */
import { test, mock } from 'node:test';
import assert from 'node:assert';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const ga4Url = pathToFileURL(path.join(here, '..', 'lib', 'sources', 'ga4.js')).href;

// Rows keyed by (event, dimensionField) so tests can assert the request shape too.
let lastBody = null;
function rowsFor(event, field) {
  if (field === 'landingPage' && event === 'page_view') {
    return [
      { dim: '/reviews/hrv-trackers', users: 40, events: 90 },
      { dim: '/', users: 20, events: 30 },
      { dim: '/tools/hrv', users: 10, events: 12 },
    ];
  }
  if (field === 'landingPage' && event === 'app_store_click') {
    return [
      { dim: '/', users: 4, events: 5 },
      { dim: '/reviews/hrv-trackers', users: 2, events: 2 },
    ];
  }
  if (field === 'pagePath' && event === 'page_view') {
    return [{ dim: '/articles/physiological-sigh', users: 12, events: 15 }];
  }
  if (field !== 'customEvent:metrics_source') return []; // wrong addressing → no data
  // watch: few users, many events; camera: many users; simulated: few.
  if (event === 'results_view') {
    return [
      { dim: 'watch', users: 10, events: 100 },
      { dim: 'camera', users: 30, events: 120 },
      { dim: 'simulated', users: 10, events: 20 },
    ];
  }
  if (event === 'practice_complete') {
    return [
      { dim: 'watch', users: 5, events: 8 },
      { dim: 'camera', users: 15, events: 20 },
    ];
  }
  if (event === 'all_not_set') return [{ dim: '(not set)', users: 40, events: 90 }];
  return [];
}

mock.module(ga4Url, {
  namedExports: {
    ga4Missing: () => [],
    internalFilter: () => null,
    appVersionFilter: () => null,
    // Keep the event marker the rows are keyed on, plus every filter for asserts.
    andFilters: (...f) => ({ __event: f.filter(Boolean)[0]?.__event, __all: f.filter(Boolean) }),
    eventNameFilter: (names) => ({ __event: names[0] }),
    runReport: async (body) => {
      lastBody = body;
      const field = body.dimensions[0].name;
      const event = body.dimensionFilter?.__event ?? 'results_view';
      const rows = rowsFor(event, field).map((r) => ({
        dimensionValues: [{ value: r.dim }],
        metricValues: [{ value: String(r.users) }, { value: String(r.events) }],
      }));
      return { rows };
    },
  },
});

const { ga4Breakdown } = await import('../tools/ga4_breakdown.js');

test('shares are by unique users, not events, and carry their N', async () => {
  const r = await ga4Breakdown({ event: 'results_view', dimension: 'metrics_source' });
  assert.equal(r.ok, true);
  assert.equal(r.total_users, 50);
  const watch = r.breakdown.find((b) => b.value === 'watch');
  // 10/50 = 20% by users. By events it would be 100/240 = 41.7% — the trap.
  assert.equal(watch.share.pct, 20);
  assert.equal(watch.share.n, 10);
  assert.equal(watch.events, 100);
  assert.equal(r.breakdown.find((b) => b.value === 'camera').share.pct, 60);
});

test('a bare dimension name is addressed as customEvent:<name>', async () => {
  await ga4Breakdown({ event: 'results_view', dimension: 'metrics_source' });
  assert.equal(lastBody.dimensions[0].name, 'customEvent:metrics_source');
  assert.equal(lastBody.metrics[0].name, 'activeUsers');
  assert.equal(lastBody.metrics[1].name, 'eventCount');
});

test('metric=events switches the share denominator to events', async () => {
  const r = await ga4Breakdown({ event: 'results_view', dimension: 'metrics_source', metric: 'events' });
  const watch = r.breakdown.find((b) => b.value === 'watch');
  assert.equal(watch.share.pct, 41.7); // 100/240
});

test('all (not set) is flagged as mis-addressed, not served as a distribution', async () => {
  const r = await ga4Breakdown({ event: 'all_not_set', dimension: 'metrics_source' });
  assert.equal(r.dimension_misconfigured, true);
  assert.match(r.dimension_warning, /not set/i);
});

test('low_data fires when the summed users are under the threshold', async () => {
  const r = await ga4Breakdown({ event: 'practice_complete', dimension: 'metrics_source' });
  assert.equal(r.total_users, 20); // 5 + 15 < 30
  assert.equal(r.low_data, true);
});

test('the tool is not bound to one event — practice_complete works too', async () => {
  const r = await ga4Breakdown({ event: 'practice_complete', dimension: 'metrics_source' });
  assert.equal(r.event, 'practice_complete');
  assert.ok(r.breakdown.find((b) => b.value === 'camera'));
});

test('no rows reports empty (no data), not a zero distribution', async () => {
  const r = await ga4Breakdown({ event: 'never_fired', dimension: 'metrics_source' });
  assert.equal(r.empty, true);
});

test('scope=user addresses a bare name as customUser:<name> and reports scope_used', async () => {
  const r = await ga4Breakdown({ event: 'results_view', dimension: 'internal', scope: 'user' });
  assert.equal(lastBody.dimensions[0].name, 'customUser:internal');
  assert.equal(r.scope_used, 'user');
});

test('known user-scoped dim (internal) resolves to customUser: without scope', async () => {
  const r = await ga4Breakdown({ event: 'results_view', dimension: 'internal' });
  assert.equal(lastBody.dimensions[0].name, 'customUser:internal');
  assert.equal(r.scope_used, 'user');
});

test('default scope stays event-scoped — existing calls unchanged', async () => {
  const r = await ga4Breakdown({ event: 'results_view', dimension: 'metrics_source' });
  assert.equal(lastBody.dimensions[0].name, 'customEvent:metrics_source');
  assert.equal(r.scope_used, 'event');
});

test('a colon-qualified customUser: field is used verbatim and reports user scope', async () => {
  const r = await ga4Breakdown({ event: 'results_view', dimension: 'customUser:internal' });
  assert.equal(lastBody.dimensions[0].name, 'customUser:internal');
  assert.equal(r.scope_used, 'user');
});

test('explicit scope=event overrides the known-user-dim list', async () => {
  const r = await ga4Breakdown({ event: 'results_view', dimension: 'internal', scope: 'event' });
  assert.equal(lastBody.dimensions[0].name, 'customEvent:internal');
  assert.equal(r.scope_used, 'event');
});

const allFilters = () => lastBody.dimensionFilter.__all;
const has = (pred) => allFilters().some(pred);

test('standard GA4 fields (pagePath, landingPage) pass through without customEvent:', async () => {
  const r = await ga4Breakdown({ event: 'page_view', dimension: 'pagePath' });
  assert.equal(lastBody.dimensions[0].name, 'pagePath');
  assert.equal(r.scope_used, 'other');
  assert.equal(r.dimension.assumed_custom_event, false);
  assert.equal(r.breakdown[0].value, '/articles/physiological-sigh');
});

test('stream=website filters on platform=web; app → iOS/Android; all → no stream filter', async () => {
  await ga4Breakdown({ event: 'page_view', dimension: 'pagePath', stream: 'website' });
  assert.ok(has((f) => f.filter?.fieldName === 'platform' && f.filter.stringFilter?.value === 'web'));
  await ga4Breakdown({ event: 'page_view', dimension: 'pagePath', stream: 'app' });
  assert.ok(has((f) => f.filter?.fieldName === 'platform' && f.filter.inListFilter?.values.includes('iOS')));
  await ga4Breakdown({ event: 'page_view', dimension: 'pagePath' });
  assert.ok(!has((f) => f.filter?.fieldName === 'platform'));
});

test('exclude_country drops the ISO codes via a NOT countryId filter', async () => {
  const r = await ga4Breakdown({ event: 'page_view', dimension: 'pagePath', exclude_country: 'sg, cn' });
  assert.ok(has((f) => f.notExpression?.filter?.fieldName === 'countryId'
    && f.notExpression.filter.inListFilter.values.join() === 'SG,CN'));
  assert.equal(r.filters.exclude_country, 'sg, cn');
});

test('conversion_event adds per-row converting users + rate (landing page → store)', async () => {
  const r = await ga4Breakdown({
    event: 'page_view', dimension: 'landingPage', stream: 'website', conversion_event: 'app_store_click',
  });
  const home = r.breakdown.find((b) => b.value === '/');
  assert.equal(home.conversion.users, 4);
  assert.equal(home.conversion.rate.pct, 20); // 4 / 20
  const tools = r.breakdown.find((b) => b.value === '/tools/hrv');
  assert.equal(tools.conversion.users, 0); // no store click from that entry page
  assert.equal(r.conversion_total_users, 6);
  assert.equal(r.conversion_event, 'app_store_click');
});

test('limit caps rows (default 25) and flags truncation', async () => {
  await ga4Breakdown({ event: 'page_view', dimension: 'landingPage' });
  assert.equal(lastBody.limit, 25);
  // Mock returns 3 rows; limit 3 → exactly full → truncation is flagged.
  const r = await ga4Breakdown({ event: 'page_view', dimension: 'landingPage', limit: 3 });
  assert.equal(lastBody.limit, 3);
  assert.equal(r.truncated, true);
});

test('without conversion_event rows carry no conversion field — old calls unchanged', async () => {
  const r = await ga4Breakdown({ event: 'results_view', dimension: 'metrics_source' });
  assert.equal(r.breakdown[0].conversion, undefined);
  assert.equal(lastBody.dimensions[0].name, 'customEvent:metrics_source');
  assert.equal(r.filters.stream, 'all');
});
