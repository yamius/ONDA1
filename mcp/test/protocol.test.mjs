/**
 * MCP transport contract: the gate, and the JSON-RPC surface Claude speaks.
 * The auth cases matter most — behind this endpoint sit production credentials.
 */
import { test } from 'node:test';
import assert from 'node:assert';
import handler from '../api/mcp.js';

function mkRes() {
  const r = { _status: 200, _json: undefined, _ended: false, _headers: {} };
  r.setHeader = (k, v) => { r._headers[k] = v; };
  r.status = (s) => { r._status = s; return r; };
  r.json = (j) => { r._json = j; return r; };
  r.end = () => { r._ended = true; return r; };
  return r;
}
async function call(body, { token = 'test-token', url = '/api/mcp', method = 'POST' } = {}) {
  const req = { method, url, headers: token ? { authorization: `Bearer ${token}` } : {}, body };
  const res = mkRes();
  await handler(req, res);
  return res;
}

test('fails closed when MCP_AUTH_TOKEN is unset', async () => {
  delete process.env.MCP_AUTH_TOKEN;
  const r = await call({ jsonrpc: '2.0', id: 1, method: 'tools/list' });
  assert.equal(r._status, 503);
  assert.equal(r._json.error, 'not_configured');
});

test('rejects a wrong token', async () => {
  process.env.MCP_AUTH_TOKEN = 'test-token';
  const r = await call({ jsonrpc: '2.0', id: 1, method: 'tools/list' }, { token: 'wrong' });
  assert.equal(r._status, 401);
});

test('accepts the token via ?key= as well as Bearer', async () => {
  process.env.MCP_AUTH_TOKEN = 'test-token';
  const r = await call({ jsonrpc: '2.0', id: 1, method: 'tools/list' }, { token: '', url: '/api/mcp?key=test-token' });
  assert.equal(r._status, 200);
  assert.equal(r._json.result.tools.length, 3);
});

test('initialize announces the tools capability', async () => {
  process.env.MCP_AUTH_TOKEN = 'test-token';
  const r = await call({ jsonrpc: '2.0', id: 2, method: 'initialize', params: {} });
  assert.ok(r._json.result.protocolVersion);
  assert.deepEqual(r._json.result.serverInfo.name, 'onda-analytics');
});

test('notifications get no response body', async () => {
  process.env.MCP_AUTH_TOKEN = 'test-token';
  const r = await call({ jsonrpc: '2.0', method: 'notifications/initialized' });
  assert.equal(r._status, 202);
  assert.equal(r._json, undefined);
});

test('exposes exactly the three Phase 1 tools, and no write tool', async () => {
  process.env.MCP_AUTH_TOKEN = 'test-token';
  const r = await call({ jsonrpc: '2.0', id: 3, method: 'tools/list' });
  const names = r._json.result.tools.map((t) => t.name).sort();
  assert.deepEqual(names, ['check_status', 'funnel_review', 'installs_review']);
  assert.ok(!names.some((n) => /write|update|create|delete/.test(n)), 'read-only server');
});

test('unknown tool is a protocol error, not a crash', async () => {
  process.env.MCP_AUTH_TOKEN = 'test-token';
  const r = await call({ jsonrpc: '2.0', id: 6, method: 'tools/call', params: { name: 'ads_write' } });
  assert.equal(r._json.error.code, -32602);
});

test('a missing credential degrades to not_configured, not an exception', async () => {
  process.env.MCP_AUTH_TOKEN = 'test-token';
  delete process.env.GA4_PROPERTY_ID;
  delete process.env.GA4_SERVICE_ACCOUNT_JSON;
  const r = await call({ jsonrpc: '2.0', id: 5, method: 'tools/call', params: { name: 'funnel_review', arguments: {} } });
  const payload = JSON.parse(r._json.result.content[0].text);
  assert.equal(payload.error, 'not_configured');
  assert.ok(payload.missing.includes('GA4_PROPERTY_ID'));
  assert.equal(r._json.result.isError, true);
});

test('check_status reports every source without throwing', async () => {
  process.env.MCP_AUTH_TOKEN = 'test-token';
  const r = await call({ jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: 'check_status' } });
  const payload = JSON.parse(r._json.result.content[0].text);
  assert.equal(payload.sources.length, 3);
  assert.ok(payload.summary.includes('sources answering'));
});
