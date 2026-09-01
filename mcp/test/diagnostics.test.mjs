/**
 * A failing source must explain itself. Written after Tenjin returned a bare
 * `fetch failed` on the live deploy — no status, no body, no cause — and the
 * real reason (a hostname that did not exist) took a DNS lookup to find.
 */
import { test } from 'node:test';
import assert from 'node:assert';
import { getJson, HttpError } from '../lib/http.js';
import { sourceError } from '../lib/shared.js';

test('a dead host reports network_error with a cause and no status', async () => {
  // .invalid is reserved by RFC 2606 and can never resolve.
  await assert.rejects(
    () => getJson('https://nonexistent-host.invalid/x', { source: 'test', timeoutMs: 5000 }),
    (err) => {
      assert.ok(err instanceof HttpError);
      assert.equal(err.status, null, 'no HTTP status exists for a network failure');
      assert.equal(err.network_error, true);
      assert.ok(err.cause, 'must carry the underlying cause (DNS/TLS/refused)');
      assert.match(err.hint, /never reached the server/);
      return true;
    },
  );
});

test('sourceError forwards status, body and hint into the tool payload', () => {
  const err = new HttpError('HTTP 401 from api.example.com', {
    status: 401,
    body_snippet: '{"error":"invalid token"}',
    hint: 'Authentication rejected — check the token and its scope.',
  });
  const out = sourceError('tenjin', err);
  assert.equal(out.status, 401);
  assert.equal(out.body_snippet, '{"error":"invalid token"}');
  assert.match(out.hint, /Authentication rejected/);
});

test('a network failure is distinguishable from an auth failure in the payload', () => {
  const net = sourceError('tenjin', new HttpError('network error', { status: null, network_error: true, cause: 'ENOTFOUND' }));
  const auth = sourceError('tenjin', new HttpError('HTTP 403', { status: 403, body_snippet: 'forbidden' }));
  assert.equal(net.network_error, true);
  assert.equal(net.status, null);
  assert.equal(auth.network_error, undefined);
  assert.equal(auth.status, 403);
});

test('Tenjin targets the host from the published spec, not the invented one', async () => {
  const src = await import('node:fs').then((fs) => fs.readFileSync(new URL('../lib/sources/tenjin.js', import.meta.url), 'utf8'));
  assert.ok(src.includes('https://api.tenjin.com/v2'), 'base URL must be api.tenjin.com/v2');
  // Only as a URL: the comment naming the mistake is deliberate documentation.
  assert.ok(!src.includes('https://reporting.tenjin.com'), 'reporting.tenjin.com is not a real host');
  assert.ok(src.includes('Bearer'), 'auth is a Bearer header');
  assert.ok(!src.includes('api_key='), 'api_key query param is not how this API authenticates');
});

test('summariseByChannel reads the documented data[].attributes shape', async () => {
  const { summariseByChannel } = await import('../lib/sources/tenjin.js');
  const payload = {
    data: [
      { type: 'report', attributes: { name: 'Google Ads', short_id: 'google', installs: 12, spend: 60, clicks: 300, impressions: 9000 } },
      { type: 'report', attributes: { name: 'Meta', short_id: 'meta', installs: 3, spend: 45, clicks: 90, impressions: 2000 } },
      { type: 'report', attributes: { name: 'Google Ads', short_id: 'google', installs: 4, spend: 20, clicks: 100, impressions: 1000 } },
    ],
  };
  const out = summariseByChannel(payload);
  assert.equal(out.length, 2);
  assert.equal(out[0].channel, 'Google Ads');
  assert.equal(out[0].installs, 16);          // 12 + 4, rows merged
  assert.equal(out[0].spend, 80);
  assert.equal(out[0].cpi, 5);                // 80/16, recomputed from the totals
  assert.equal(out[1].cpi, 15);               // 45/3
});

test('a channel with spend but no installs gets cpi null, not Infinity', async () => {
  const { summariseByChannel } = await import('../lib/sources/tenjin.js');
  const out = summariseByChannel({ data: [{ attributes: { name: 'Reddit', installs: 0, spend: 25 } }] });
  assert.equal(out[0].cpi, null);
});
