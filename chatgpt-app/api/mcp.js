/**
 * ONDA ChatGPT app — public MCP endpoint (Streamable HTTP, JSON-RPC 2.0).
 *
 * PUBLIC BY DESIGN, and therefore holds nothing private: no credentials, no
 * analytics access, no user data. Tools are pure functions over generated site
 * data; nothing a person types is stored or logged. Never merge this with the
 * private analytics server in ../mcp.
 *
 * Each tool points ChatGPT at a card (MCP Apps resource, text/html;profile=mcp-app)
 * via _meta.ui.resourceUri (+ the openai/outputTemplate alias); the card gets
 * structuredContent over the ui/notifications/tool-result bridge.
 */
import { TOOLS } from '../lib/tools.js';
import { WIDGETS } from '../lib/widgets.js';

const SERVER_INFO = { name: 'onda-life', title: 'ONDA Life', version: '1.1.0' };
const PROTOCOL_VERSION = '2025-06-18';
// MCP Apps standard (ChatGPT rejects the old text/html+skybridge templates).
const WIDGET_MIME = 'text/html;profile=mcp-app';

function toolDescriptor(t) {
  const w = WIDGETS[t.widget];
  return {
    name: t.name,
    title: t.title,
    description: t.description,
    inputSchema: t.inputSchema,
    annotations: t.annotations,
    _meta: {
      ui: { resourceUri: w.uri },
      'openai/outputTemplate': w.uri, // ChatGPT compatibility alias
      'openai/toolInvocation/invoking': t.invoking,
      'openai/toolInvocation/invoked': t.invoked,
      'openai/widgetAccessible': false,
    },
  };
}

function resourceDescriptor(w) {
  return { uri: w.uri, name: w.name, mimeType: WIDGET_MIME };
}

function resourceContents(w) {
  return {
    uri: w.uri,
    mimeType: WIDGET_MIME,
    text: w.html,
    _meta: {
      // The cards load nothing from the network; links open through the host.
      ui: { prefersBorder: false, csp: { connectDomains: [], resourceDomains: [] } },
      'openai/widgetDescription': `ONDA Life card: ${w.name}.`,
    },
  };
}

const rpcResult = (id, result) => ({ jsonrpc: '2.0', id, result });
const rpcError = (id, code, message) => ({ jsonrpc: '2.0', id, error: { code, message } });

export async function handleRpc(message) {
  const { id, method, params } = message ?? {};
  switch (method) {
    case 'initialize':
      return rpcResult(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: {}, resources: {} },
        serverInfo: SERVER_INFO,
        instructions:
          'ONDA Life tools: check an HRV number against age norms, run a breathing guide, suggest a short free practice, and compare wellness devices or apps from ONDA’s editorial reviews. ' +
          'Not medical advice — for chest pain, fainting or severe symptoms tell the person to seek medical help and do not call a tool.',
      });
    case 'notifications/initialized':
      return null;
    case 'ping':
      return rpcResult(id, {});
    case 'tools/list':
      return rpcResult(id, { tools: TOOLS.map(toolDescriptor) });
    case 'resources/list':
      return rpcResult(id, { resources: Object.values(WIDGETS).map(resourceDescriptor) });
    case 'resources/templates/list':
      return rpcResult(id, { resourceTemplates: [] });
    case 'resources/read': {
      const w = Object.values(WIDGETS).find((x) => x.uri === params?.uri);
      if (!w) return rpcError(id, -32602, `Unknown resource: ${params?.uri}`);
      return rpcResult(id, { contents: [resourceContents(w)] });
    }
    case 'tools/call': {
      const tool = TOOLS.find((t) => t.name === params?.name);
      if (!tool) return rpcError(id, -32602, `Unknown tool: ${params?.name}`);
      try {
        const { structuredContent, text } = tool.run(params.arguments ?? {});
        return rpcResult(id, {
          structuredContent,
          content: [{ type: 'text', text }],
          _meta: { ui: { resourceUri: WIDGETS[tool.widget].uri }, 'openai/outputTemplate': WIDGETS[tool.widget].uri },
        });
      } catch {
        // No input echo: arguments may contain health numbers.
        return rpcResult(id, { content: [{ type: 'text', text: 'The tool could not process this request.' }], isError: true });
      }
    }
    default:
      if (id === undefined) return null; // unknown notification
      return rpcError(id, -32601, `Method not found: ${method}`);
  }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'content-type, mcp-session-id, mcp-protocol-version, authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') {
    return res.status(200).json({
      server: SERVER_INFO,
      transport: 'streamable-http (POST JSON-RPC only)',
      tools: TOOLS.map((t) => t.name),
    });
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body ?? {};
  } catch {
    return res.status(400).json(rpcError(null, -32700, 'Parse error'));
  }
  if (Array.isArray(body)) {
    const out = (await Promise.all(body.map(handleRpc))).filter(Boolean);
    return out.length ? res.status(200).json(out) : res.status(202).end();
  }
  const response = await handleRpc(body);
  if (!response) return res.status(202).end();
  return res.status(200).json(response);
}
