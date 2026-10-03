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
import { TOOLS, InputError } from '../lib/tools.js';
import { WIDGETS } from '../lib/widgets.js';

export const SHORT_DESCRIPTION = 'HRV norms by age, guided breathing, free practices and honest wearable comparisons.';
const SERVER_INFO = {
  name: 'onda-life',
  title: 'ONDA Life',
  version: '1.4.0',
  description: SHORT_DESCRIPTION,
  websiteUrl: 'https://onda-life.com',
  icons: [{ src: 'https://onda-chatgpt.vercel.app/icon-512.png', mimeType: 'image/png', sizes: ['512x512'] }],
};
const PROTOCOL_VERSION = '2025-06-18';
// MCP Apps standard (ChatGPT rejects the old text/html+skybridge templates).
const WIDGET_MIME = 'text/html;profile=mcp-app';
// Unique origin ChatGPT sandboxes the cards on (ChatGPT review needs it) — openai/widgetDomain only.
const WIDGET_DOMAIN = 'https://onda-life.com';

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
      'ui/resourceUri': w.uri, // flat MCP Apps key, for hosts on the older spec
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
      // MCP Apps (Claude, ChatGPT, others). No ui.domain: it is optional, each host has its own
      // format (Claude: <sha256>.claudemcpcontent.com), and a wrong value stops the card rendering.
      ui: { prefersBorder: false, csp: { connectDomains: [], resourceDomains: [] } },
      // ChatGPT-specific additions — its dev-mode/review checker reads these.
      'openai/widgetDescription': `ONDA Life card: ${w.name}.`,
      'openai/widgetPrefersBorder': false,
      'openai/widgetDomain': WIDGET_DOMAIN,
      'openai/widgetCSP': { connect_domains: [], resource_domains: [] },
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
          'ONDA Life — ' + SHORT_DESCRIPTION + ' ' +
          'Tools: check an HRV number against age norms, run a live breathing guide, suggest a free short practice, and compare wearables or wellness apps from ONDA’s independent reviews. ' +
          'ONDA is a wellness tool, not a medical device. If the person reports chest pain, fainting, severe breathlessness or a racing heart that does not settle, do not interpret any numbers — tell them to seek urgent medical help.',
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
      } catch (err) {
        // Validation messages name the rule, never the values (arguments may be health numbers).
        const text = err instanceof InputError
          ? err.message
          : tool.name + ' failed while computing the result. Please try again; if it keeps failing, contact info@onda-life.com.';
        return rpcResult(id, { content: [{ type: 'text', text }], isError: true });
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
