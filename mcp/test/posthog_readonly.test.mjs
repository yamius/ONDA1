/**
 * PostHog read-only enforcement — the part that matters most, since ph_query
 * runs arbitrary HogQL against production data. The guard rejects anything but a
 * single SELECT/WITH BEFORE the request is sent; it does not trust the API key's
 * scopes to be the backstop. Uses the REAL source (no mocks) so it tests the
 * actual guard, and never needs the network: a rejected query never fetches.
 */
import { test } from 'node:test';
import assert from 'node:assert';
import { assertSelectOnly } from '../lib/sources/posthog.js';
import { phQuery, phBreakdown } from '../tools/posthog.js';

test('assertSelectOnly accepts a plain SELECT and a leading WITH', () => {
  assert.doesNotThrow(() => assertSelectOnly('SELECT event, count() FROM events GROUP BY event'));
  assert.doesNotThrow(() => assertSelectOnly('WITH x AS (SELECT 1) SELECT * FROM x'));
  assert.doesNotThrow(() => assertSelectOnly('  select 1  ')); // case + whitespace
});

for (const bad of [
  'INSERT INTO events VALUES (1)',
  'DROP TABLE events',
  'DELETE FROM events',
  'UPDATE events SET x = 1',
  'ALTER TABLE events ADD COLUMN y Int',
  'TRUNCATE TABLE events',
  'SELECT 1; DROP TABLE events',   // second statement must not slip through
  'select * from events; select 2', // multiple SELECTs still refused
  '',                               // empty
]) {
  test(`assertSelectOnly rejects: ${bad.slice(0, 32)}`, () => {
    assert.throws(() => assertSelectOnly(bad), /read_only_violation/);
  });
}

test('a write keyword hidden inside a string literal does NOT false-trip the guard', () => {
  assert.doesNotThrow(() =>
    assertSelectOnly("SELECT event FROM events WHERE properties.note = 'please DROP by'"));
});

test('ph_query refuses a non-SELECT before sending, returning read_only_violation', async () => {
  process.env.POSTHOG_API_KEY = 'test-key'; // key present, so we get past not_configured
  const r = await phQuery({ query: 'DROP TABLE events' });
  assert.equal(r.ok, false);
  assert.equal(r.error, 'read_only_violation');
});

test('ph_* return not_configured (not a crash) when POSTHOG_API_KEY is unset', async () => {
  delete process.env.POSTHOG_API_KEY;
  const q = await phQuery({ query: 'SELECT 1' });
  assert.equal(q.error, 'not_configured');
  assert.ok(q.missing.includes('POSTHOG_API_KEY'));
  const b = await phBreakdown({ event: 'shade_selected', property: 'zone' });
  assert.equal(b.error, 'not_configured');
});
