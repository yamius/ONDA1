/**
 * Local preview of the four cards with real tool output, without ChatGPT:
 *   npm run preview  →  http://localhost:4417
 * Each card gets its tool's structuredContent as window.__DEMO__ (the same
 * object ChatGPT passes as window.openai.toolOutput). ?theme=dark for dark mode.
 */
import { createServer } from 'node:http';
import { checkHrv, breatheNow, findPractice, compare } from '../lib/tools.js';
import { WIDGETS } from '../lib/widgets.js';
import handler from '../api/mcp.js';

const DEMOS = {
  hrv: checkHrv.run({ age: 42, hrv_ms: 38, device: 'apple_watch' }),
  breathe: breatheNow.run({ technique: 'coherent', minutes: 1 }),
  practice: findPractice.run({ goal: 'sleep', position: 'lying' }),
  compare: compare.run({ products: ['Oura Ring 4', 'Whoop 5.0'], priority: 'hrv' }),
};

const PORT = 4417;
createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.pathname === '/mcp') {
    let raw = '';
    for await (const c of req) raw += c;
    req.body = raw;
    const shim = {
      statusCode: 200,
      setHeader: (k, v) => res.setHeader(k, v),
      status(c) { this.statusCode = c; return this; },
      json(o) { res.writeHead(this.statusCode, { 'content-type': 'application/json' }); res.end(JSON.stringify(o)); },
      end() { res.writeHead(this.statusCode); res.end(); },
    };
    return handler(req, shim);
  }
  const key = url.pathname.slice(1);
  if (WIDGETS[key]) {
    const theme = url.searchParams.get('theme') === 'dark' ? 'dark' : 'light';
    const inject = `<script>window.__DEMO__=${JSON.stringify(DEMOS[key].structuredContent)};window.openai={theme:${JSON.stringify(theme)}};</script>`;
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    return res.end(WIDGETS[key].html.replace('<body>', `<body style="max-width:720px;margin:16px auto;padding:0 16px">${inject}`));
  }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(`<!doctype html><meta charset="utf-8"><title>ONDA ChatGPT cards</title><body style="font-family:sans-serif;padding:16px"><h1>ONDA ChatGPT cards</h1><ul>${Object.keys(WIDGETS).map((k) => `<li><a href="/${k}">${k}</a> · <a href="/${k}?theme=dark">dark</a></li>`).join('')}</ul><p>MCP endpoint: POST /mcp</p>`);
}).listen(PORT, () => console.log(`preview on http://localhost:${PORT}`));
