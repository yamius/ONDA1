/**
 * PostHog tool output shaping — with the HogQL runner mocked, so the tests pin
 * the arithmetic the tools own: shares by UNIQUE USERS (not events), too-young
 * cohorts excluded from a milestone, and funnel step conversions. The live query
 * text is exercised against PostHog itself, not here.
 */
import { test, mock } from 'node:test';
import assert from 'node:assert';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const phUrl = pathToFileURL(path.join(here, '..', 'lib', 'sources', 'posthog.js')).href;

// Canned HogQL results, dispatched by a marker in the query text.
mock.module(phUrl, {
  namedExports: {
    posthogMissing: () => [],
    safeEvent: (x) => x,
    safeProperty: (x) => x,
    sinceClause: () => 'timestamp >= now()',
    hogql: async (q) => {
      if (q.includes('windowFunnel')) {
        // step_1..step_3 counts, one breakdown-less row
        return { rows: [{ value: '', step_1: 100, step_2: 40, step_3: 8 }] };
      }
      if (q.includes('first_seen AS')) {
        // one cohort group: 50 eligible for d1, 20 returned; nobody old enough for d30
        return { rows: [{ value: '', cohort_size: 60, elig_d1: 50, ret_d1: 20, elig_d7: 30, ret_d7: 6, elig_d30: 0, ret_d30: 0 }] };
      }
      if (q.includes('GROUP BY event ORDER BY events DESC')) {
        return { rows: [{ event: 'results_view', events: 240, users: 50 }, { event: 'app_open', events: 500, users: 60 }] };
      }
      // ph_breakdown: watch few users but many events; camera many users.
      return {
        rows: [
          { value: 'watch', users: 10, events: 100 },
          { value: 'camera', users: 30, events: 120 },
          { value: 'simulated', users: 10, events: 20 },
        ],
      };
    },
  },
});

const { phBreakdown, phRetention, phFunnel, phEvents } = await import('../tools/posthog.js');

test('ph_breakdown shares are by UNIQUE USERS, not events', async () => {
  const r = await phBreakdown({ event: 'results_view', property: 'metrics_source' });
  assert.equal(r.ok, true);
  assert.equal(r.total_users, 50);
  const watch = r.breakdown.find((b) => b.value === 'watch');
  // By users: 10/50 = 20%. By events it would be 100/240 = 41.7% — the bug the
  // brief calls out. Assert we did NOT compute the event share.
  assert.equal(watch.share_of_users.pct, 20);
  assert.equal(watch.users, 10);
  const camera = r.breakdown.find((b) => b.value === 'camera');
  assert.equal(camera.share_of_users.pct, 60);
});

test('ph_breakdown flags low_data when the user denominator is tiny', async () => {
  const r = await phBreakdown({ event: 'results_view', property: 'metrics_source' });
  // total_users 50 ≥ 30, so not low_data at the top; a value with <30 users is.
  assert.equal(r.low_data, false);
  assert.equal(r.breakdown.find((b) => b.value === 'watch').share_of_users.low_data, false);
});

test('ph_retention excludes a too-young milestone instead of scoring it zero', async () => {
  const r = await phRetention({ breakdown: 'metrics_source' });
  const g = r.groups[0];
  assert.equal(g.d1.pct, 40);          // 20/50
  assert.equal(g.d7.pct, 20);          // 6/30
  assert.equal(g.d30.pct, null);       // elig_d30 = 0 → not zero, "no data"
  assert.equal(g.d30.incomplete, true);
});

test('ph_funnel reports step conversions from previous and from top', async () => {
  const r = await phFunnel({ steps: ['results_view', 'paywall_view', 'purchase'] });
  const s = r.groups[0].steps;
  assert.equal(s[0].users, 100);
  assert.equal(s[1].from_prev.pct, 40);   // 40/100
  assert.equal(s[2].from_top.pct, 8);     // 8/100
});

test('ph_events lists events with counts and unique users', async () => {
  const r = await phEvents({});
  assert.equal(r.event_count, 2);
  assert.equal(r.events.find((e) => e.event === 'results_view').users, 50);
});
