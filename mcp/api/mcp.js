/**
 * ONDA analytics MCP endpoint — Streamable HTTP transport (JSON-RPC 2.0).
 *
 * READ-ONLY BY CONSTRUCTION: there is no write path in this server. No tool
 * mutates anything in GA4, App Store Connect, Tenjin or the app itself, and
 * no credential is ever echoed into a response.
 *
 * The endpoint FAILS CLOSED: with MCP_AUTH_TOKEN unset every request is
 * refused. An unset gate is an open gate, and behind this one sit production
 * analytics credentials.
 */

import { funnelReview, funnelReviewSchema } from '../tools/funnel_review.js';
import { installsReview, installsReviewSchema } from '../tools/installs_review.js';
import { revenueReview, revenueReviewSchema } from '../tools/revenue_review.js';
import { checkStatus, checkStatusSchema } from '../tools/check_status.js';

const SERVER_INFO = { name: 'onda-analytics', version: '0.1.0' };
const PROTOCOL_VERSION = '2025-06-18';

const TOOLS = [
  { schema: funnelReviewSchema, run: funnelReview },
  { schema: installsReviewSchema, run: installsReview },
  { schema: revenueReviewSchema, run: revenueReview },
  { schema: checkStatusSchema, run: checkStatus },
];

function rpcResult(id, result) {
  return { jsonrpc: '2.0', id, result };
}
function rpcError(id, code, message) {
  return { jsonrpc: '2.0', id, error: { code, message } };
}

/** Bearer header or ?key= — whichever the client can send. */
function authorised(req) {
  const expected = process.env.MCP_AUTH_TOKEN;
  if (!expected) return 'not_configured';
  const header = req.headers?.authorization || '';
  const bearer = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  let key = '';
  try {
    key = new URL(req.url, 'http://x').searchParams.get('key') || '';
  } catch {
    key = '';
  }
  return bearer === expected || key === expected;
}

async function handleRpc(message) {
  const { id, method, params } = message ?? {};

  switch (method) {
    case 'initialize':
      return rpcResult(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO,
      });

    case 'notifications/initialized':
      return null; // notification — no response

    case 'ping':
      return rpcResult(id, {});

    case 'tools/list':
      return rpcResult(id, { tools: TOOLS.map((t) => t.schema) });

    case 'tools/call': {
      const tool = TOOLS.find((t) => t.schema.name === params?.name);
      if (!tool) return rpcError(id, -32602, `Unknown tool: ${params?.name}`);
      try {
        const data = await tool.run(params.arguments ?? {});
        return rpcResult(id, {
          content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
          // A source that is down is a tool-level error, not a transport one:
          // the model needs to read WHICH source failed, not just "it failed".
          isError: data?.ok === false,
        });
      } catch (err) {
        return rpcResult(id, {
          content: [{ type: 'text', text: JSON.stringify({ ok: false, error: 'tool_failed', message: String(err?.message ?? err).slice(0, 300) }) }],
          isError: true,
        });
      }
    }

    default:
      return rpcError(id, -32601, `Method not found: ${method}`);
  }
}

export default async function handler(req, res) {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Cache-Control', 'no-store');

  const auth = authorised(req);
  if (auth === 'not_configured') {
    return res.status(503).json({
      error: 'not_configured',
      message: 'MCP_AUTH_TOKEN is not set on the server; the endpoint refuses all requests until it is.',
    });
  }
  if (!auth) return res.status(401).json({ error: 'unauthorized' });

  if (req.method === 'GET') {
    // Not an SSE stream: this server is request/response only. Kept so a
    // browser hit gives something honest instead of a 405 with no explanation.
    return res.status(200).json({
      server: SERVER_INFO,
      transport: 'streamable-http (POST JSON-RPC only)',
      tools: TOOLS.map((t) => t.schema.name),
    });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body ?? {};

  // Batch or single, per JSON-RPC.
  if (Array.isArray(body)) {
    const out = (await Promise.all(body.map(handleRpc))).filter(Boolean);
    return res.status(200).json(out);
  }
  const response = await handleRpc(body);
  if (!response) return res.status(202).end(); // notification
  return res.status(200).json(response);
}
