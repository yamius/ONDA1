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
  // /host/<card> — a minimal MCP Apps host: embeds the card in a sandboxed iframe and speaks the
  // view protocol (answers ui/initialize with a dark host context, sends tool-result, logs size/open-link).
  const hostMatch = url.pathname.match(/^\/host\/(\w+)$/);
  if (hostMatch && WIDGETS[hostMatch[1]]) {
    const k = hostMatch[1];
    const html = WIDGETS[k].html;
    const page = `<!doctype html><meta charset="utf-8"><title>host ${k}</title><body style="background:#262624;color:#eee;font:13px monospace;padding:16px">
<iframe id="f" sandbox="allow-scripts" style="width:100%;max-width:720px;border:0;height:50px;display:block"></iframe><pre id="log"></pre>
<script>
const f=document.getElementById('f'),log=(m)=>document.getElementById('log').textContent+=m+String.fromCharCode(10);
window.HOSTLOG=[];
window.addEventListener('message',(e)=>{if(e.source!==f.contentWindow)return;const m=e.data;window.HOSTLOG.push(m.method||('result#'+m.id));log('<- '+(m.method||'?')+' '+JSON.stringify(m.params||{}));
 if(m.method==='ui/initialize'){f.contentWindow.postMessage({jsonrpc:'2.0',id:m.id,result:{protocolVersion:'2026-01-26',hostInfo:{name:'test-host',version:'1'},hostCapabilities:{openLinks:{}},hostContext:{theme:'dark',styles:{variables:{'--color-background-primary':'#30302E','--color-text-primary':'#FAF9F5','--color-text-secondary':'#C2C0B6','--color-background-secondary':'#262624','--color-border-tertiary':'rgba(222,220,209,.15)'}}}}},'*')}
 if(m.method==='ui/notifications/initialized'){f.contentWindow.postMessage({jsonrpc:'2.0',method:'ui/notifications/tool-result',params:{structuredContent:${JSON.stringify(DEMOS[k].structuredContent)}}},'*')}
 if(m.method==='ui/notifications/size-changed'){f.style.height=m.params.height+'px'}
 if(m.method==='ui/open-link'){f.contentWindow.postMessage({jsonrpc:'2.0',id:m.id,result:{}},'*')}
});
f.srcdoc=${JSON.stringify(html).replace(/<\/script/gi, '<\\/script')};
</script>`;
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    return res.end(page);
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
