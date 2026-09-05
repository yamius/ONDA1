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
    andFilters: (...f) => f.filter(Boolean)[0],
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
