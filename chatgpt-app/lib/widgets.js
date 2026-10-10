/**
 * The four cards ChatGPT renders in the chat. Each is one self-contained HTML
 * document (no external scripts, fonts or requests), served as an MCP resource
 * with mimeType text/html;profile=mcp-app (MCP Apps). Data arrives over the postMessage bridge (ui/notifications/tool-result), or window.openai.toolOutput as fallback
 * (the tool's structuredContent); the card re-renders on openai:set_globals.
 * Links open via window.openai.openExternal when the host provides it.
 */

const SHELL_CSS = `
:root{--bg:var(--color-background-primary,#fff);--fg:var(--color-text-primary,#14212b);--muted:var(--color-text-secondary,#5d6b76);--line:var(--color-border-tertiary,#e3e8ec);--soft:var(--color-background-secondary,#f4f7f9);--accent:#0f7c8c;--accent-fg:#fff;--warn:var(--color-text-warning,#9a5b00);--danger:var(--color-text-danger,#a73d39);--radius:var(--border-radius-xl,14px)}
:root[data-theme=dark]{--bg:var(--color-background-primary,#16191c);--fg:var(--color-text-primary,#e8eef2);--muted:var(--color-text-secondary,#9aa8b2);--line:var(--color-border-tertiary,#2b3238);--soft:var(--color-background-secondary,#1e2328);--accent:#3fb6c4;--accent-fg:#0b1418;--warn:var(--color-text-warning,#e0a54a);--danger:var(--color-text-danger,#ee8884)}
*{box-sizing:border-box}html,body{margin:0;background:transparent;color:var(--fg);font-family:var(--font-sans,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif);font-size:var(--font-text-md-size,15px);line-height:1.45}
.card{padding:16px;background:var(--bg);border:1px solid var(--line);border-radius:var(--radius)}
h2{font-size:var(--font-heading-md-size,17px);margin:0 0 4px}.muted{color:var(--muted);font-size:13px}.small{font-size:12.5px}
.bridge{margin-top:14px;padding:12px;border-radius:12px;background:var(--soft);display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;min-height:44px;padding:8px 16px;border-radius:999px;background:var(--accent);color:var(--accent-fg);text-decoration:none;font-weight:600;font-size:14px;border:0;cursor:pointer}
.btn.ghost{background:transparent;color:var(--accent);border:1px solid var(--accent)}
a{color:var(--accent)}.row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.warn{color:var(--danger)}
body:not(.ready){min-height:120px}
`;

const SHELL_JS = `
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// MCP Apps view protocol (postMessage JSON-RPC to the host, spec 2026-01-26) — works in Claude,
// ChatGPT and other MCP Apps hosts. window.openai is only a fallback for older ChatGPT builds;
// window.__DEMO__ is the local preview.
const inHost = window.parent !== window;
let rpcId = 0, data = null, renderFn = null;
const pending = new Map();
const post = (msg) => { try { window.parent.postMessage({ jsonrpc: '2.0', ...msg }, '*'); } catch (e) {} };
const request = (method, params) => new Promise((res) => { const id = ++rpcId; pending.set(id, res); post({ id, method, params }); setTimeout(() => { if (pending.delete(id)) res(null); }, 4000); });
function applyContext(ctx) {
  if (!ctx) return;
  const root = document.documentElement;
  if (ctx.theme) root.dataset.theme = ctx.theme === 'dark' ? 'dark' : 'light';
  const vars = ctx.styles && ctx.styles.variables;
  if (vars) for (const k in vars) if (k.startsWith('--') && vars[k]) root.style.setProperty(k, vars[k]);
  const s = ctx.safeAreaInsets;
  // Only touch padding when the insets actually change — every change moves the card height.
  if (s) { const pad = (s.top||0)+'px '+(s.right||0)+'px '+(s.bottom||0)+'px '+(s.left||0)+'px'; if (document.body.style.padding !== pad) document.body.style.padding = pad; }
}
// Render once per distinct result: hosts may resend the same tool-result or context while the
// reply is still streaming, and a full re-render would flash the card (and reset the breathing timer).
let drawnKey = null;
function draw() {
  if (window.openai && window.openai.theme && !inHost) document.documentElement.dataset.theme = window.openai.theme;
  const d = data || (window.openai && window.openai.toolOutput) || window.__DEMO__;
  if (d && renderFn) { const key = JSON.stringify(d); if (key !== drawnKey) { drawnKey = key; renderFn(d); document.body.classList.add('ready'); } }
  reportSize();
}
let lastH = 0;
// Report height only once real content is drawn, never smaller than the skeleton, and only on a
// real change (±2px): an empty or shrinking report makes the host collapse the card for a moment.
function reportSize() {
  if (!inHost || drawnKey === null) return;
  const h = Math.max(120, Math.ceil(document.body.scrollHeight));
  if (Math.abs(h - lastH) > 2) { lastH = h; post({ method: 'ui/notifications/size-changed', params: { height: h } }); }
}
window.addEventListener('message', (ev) => {
  if (ev.source !== window.parent) return;
  const m = ev.data; if (!m || m.jsonrpc !== '2.0') return;
  if (m.id != null && pending.has(m.id)) { const res = pending.get(m.id); pending.delete(m.id); res(m.result || null); return; }
  if (m.method === 'ui/notifications/tool-result' && m.params && m.params.structuredContent) { data = m.params.structuredContent; draw(); }
  if (m.method === 'ui/notifications/host-context-changed') { applyContext(m.params); reportSize(); }
});
function onLink(e) {
  const a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
  e.preventDefault();
  const url = a.href;
  // ChatGPT's own opener when present (instant there); the standard ui/open-link everywhere else.
  if (window.openai && window.openai.openExternal) window.openai.openExternal({ href: url });
  else if (inHost) request('ui/open-link', { url });
  else window.open(url, '_blank', 'noopener');
}
document.addEventListener('click', onLink);
function boot(render) {
  renderFn = render;
  if (inHost) {
    request('ui/initialize', { protocolVersion: '2026-01-26', appInfo: { name: 'onda-life', version: '1.4.0' }, appCapabilities: { availableDisplayModes: ['inline'] } })
      .then((r) => { if (r) applyContext(r.hostContext); post({ method: 'ui/notifications/initialized', params: {} }); draw(); });
    if (window.ResizeObserver) new ResizeObserver(reportSize).observe(document.documentElement);
  }
  draw();
  window.addEventListener('openai:set_globals', draw);
}
function bridge(b, extra=''){ if(!b) return ''; return '<div class="bridge"><span class="small">'+esc(b.text)+'</span><span class="row">'+extra+'<a class="btn" target="_blank" rel="noopener" href="'+esc(b.url)+'">Get ONDA</a></span></div>'; }
`;

const page = (title, css, body, js) => `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>${SHELL_CSS}${css}</style></head><body>${body}<script>${SHELL_JS}${js}</script></body></html>`;

// ── check_hrv ───────────────────────────────────────────────────────────
const hrv = page(
  'HRV compared with Fitbit users your age',
  `.zones{display:flex;gap:4px;margin:8px 0 4px}.zone{flex:1;text-align:center;font-size:12px;padding:6px 2px;border-radius:8px;background:rgba(127,127,127,.14);color:var(--muted)}
.zone.on{background:#0f7c8c;color:#fff;font-weight:700}
.big{font-size:28px;font-weight:700}.grp{margin-top:12px}`,
  `<div class="card" id="root"></div>`,
  `boot((d) => {
  if (d.urgent) { $('#root').innerHTML = '<h2 class="warn">Please get medical help now</h2><p>' + esc(d.message) + '</p>'; return; }
  const foot = bridge(d.bridge, '<a class="btn ghost" target="_blank" rel="noopener" href="' + esc(d.learnMore) + '">Full calculator</a>') +
    '<p class="muted small">' + esc(d.safety) + '</p>';
  if (!d.compared) {
    $('#root').innerHTML = '<h2>Your HRV at age ' + esc(d.age) + '</h2>' +
      '<div class="row" style="margin-top:10px"><span class="big">' + esc(d.value) + ' ms</span><span>' + esc(d.metric) + ' · not compared</span></div>' +
      (d.comparisons ? '<p>' + esc(d.ageNote) + '</p>' + d.comparisons.map((c) =>
        '<p class="muted small">' + esc(c.group) + ': middle half ' + esc(c.p25) + '–' + esc(c.p75) + ' ms, median ' + esc(c.p50) + ' ms</p>').join('') +
        '<p class="muted small">' + esc(d.deviceNote) + '</p><p><strong>' + esc(d.disclaimer) + '</strong></p>'
        : '<p>' + esc(d.metricNote) + '</p>') + foot;
    return;
  }
  const NAMES = { lower: 'Below the middle half', middle: 'Middle half', higher: 'Above the middle half' };
  const zones = (v) => ['lower', 'middle', 'higher'].map((k) => '<div class="zone' + (k === v ? ' on' : '') + '">' + NAMES[k] + '</div>').join('');
  const groups = (d.comparisons || []).map((c) =>
    '<div class="grp"><div class="muted small">Compared with ' + esc(c.group) + ': middle half ' + esc(c.p25) + '–' + esc(c.p75) + ' ms, median ' + esc(c.p50) + ' ms</div>' +
    '<div class="zones">' + zones(c.verdict) + '</div><div class="small">' + esc(c.verdictText) + '</div></div>').join('');
  $('#root').innerHTML =
    '<h2>Your HRV at age ' + esc(d.age) + '</h2>' +
    '<div class="row" style="margin-top:10px"><span class="big">' + esc(d.value) + ' ms</span><span>' + esc(d.metric) + (d.verdictText ? ' · ' + esc(d.verdictText) : '') + '</span></div>' +
    groups +
    '<p><strong>' + esc(d.disclaimer) + '</strong></p>' +
    '<p class="muted small">' + esc(d.deviceNote) + '</p>' +
    '<p class="muted small">' + esc(d.ageNote) + ' ' + esc(d.metricNote) + '</p>' +
    '<p class="muted small">Source: ' + esc(d.source) + '</p>' + foot;
});`,
);

// ── breathe_now ─────────────────────────────────────────────────────────
const breathe = page(
  'Breathe now',
  `.stage{display:flex;flex-direction:column;align-items:center;gap:10px;margin:14px 0}
.circle{width:180px;height:180px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#7fd3dc,#0f7c8c);transform:scale(.42);transition-property:transform;transition-timing-function:ease-in-out}
.cue{font-size:20px;font-weight:600;min-height:28px}.time{font-variant-numeric:tabular-nums;color:var(--muted)}`,
  `<div class="card"><div id="head"></div><div class="stage"><div class="circle" id="c"></div><div class="cue" id="cue">Ready</div><div class="time" id="t"></div><button class="btn" id="go">Start</button></div><div id="foot"></div></div>`,
  `const LABEL = { in: 'Breathe in', topup: 'Top-up inhale', hold: 'Hold', out: 'Breathe out' };
let timer = null, endAt = 0, d = null;
function stop(msg){ clearTimeout(timer); timer = null; $('#go').textContent = 'Start'; $('#cue').textContent = msg || 'Ready'; $('#c').style.transitionDuration = '1s'; $('#c').style.transform = 'scale(.42)'; }
function step(i){
  if (Date.now() >= endAt) return stop('Well done');
  const ph = d.phases[i % d.phases.length];
  $('#cue').textContent = LABEL[ph.kind];
  $('#c').style.transitionDuration = ph.seconds + 's';
  $('#c').style.transform = 'scale(' + ph.scale + ')';
  timer = setTimeout(() => step(i + 1), ph.seconds * 1000);
}
function tick(){ if (!timer) return; const s = Math.max(0, Math.round((endAt - Date.now()) / 1000)); $('#t').textContent = Math.floor(s/60) + ':' + String(s%60).padStart(2,'0'); setTimeout(tick, 500); }
$('#go').onclick = () => { if (timer) return stop(); endAt = Date.now() + d.minutes * 60000; $('#go').textContent = 'Stop'; step(0); tick(); };
boot((x) => {
  d = x;
  $('#head').innerHTML = '<h2>' + esc(d.name) + '</h2><div class="muted">' + esc(d.how) + ' Good for ' + esc(d.goodFor) + '.</div>';
  $('#t').textContent = d.minutes + ':00';
  $('#foot').innerHTML = '<p class="muted small">' + esc(d.caution) + '</p>' + bridge(d.bridge, '<a class="btn ghost" target="_blank" rel="noopener" href="' + esc(d.learnMore) + '">Open on the web</a>');
});`,
);

// ── find_practice ───────────────────────────────────────────────────────
const practice = page(
  'ONDA practices',
  `.p{padding:12px 0;border-top:1px solid var(--line)}.p:first-of-type{border-top:0}
.em{font-size:24px;line-height:1}.steps{margin:6px 0 0 18px;padding:0;color:var(--muted);font-size:13px}`,
  `<div class="card" id="root"></div>`,
  `const GOAL = { calm: 'calm down', sleep: 'sleep', focus: 'focus', energy: 'energy' };
boot((d) => {
  const items = d.practices.map((p) =>
    '<div class="p"><div class="row"><span class="em">' + esc(p.emoji) + '</span><b>' + esc(p.name) + '</b><span class="muted small">' + esc(p.minutes) + ' min</span></div>' +
    '<div>' + esc(p.why) + '</div><ol class="steps">' + p.firstSteps.map((s) => '<li>' + esc(s) + '</li>').join('') + '</ol>' +
    (p.playUrl ? '<div class="row" style="margin-top:8px"><a class="btn ghost" target="_blank" rel="noopener" href="' + esc(p.playUrl) + '">▶ Play this practice</a></div>' : '') + '</div>').join('');
  $('#root').innerHTML = '<h2>Practices to ' + esc(GOAL[d.goal] || d.goal) + '</h2>' +
    (d.timeNote ? '<div class="muted small">' + esc(d.timeNote) + '</div>' : '') +
    (items || '<p>No match in the free set.</p>') +
    '<div class="row" style="margin-top:10px"><a class="btn ghost" target="_blank" rel="noopener" href="' + esc(d.tryFree.url) + '">' + esc(d.tryFree.text) + '</a>' +
    '<a class="btn" target="_blank" rel="noopener" href="' + esc(d.bridge.url) + '">' + esc(d.bridge.button) + '</a></div>' +
    '<p class="muted small">' + esc(d.bridge.text) + '</p>';
});`,
);

// ── compare ─────────────────────────────────────────────────────────────
const compare = page(
  'Compare',
  `.wrap{overflow-x:auto}table{border-collapse:collapse;width:100%;min-width:420px;font-size:13.5px}
th,td{text-align:left;vertical-align:top;padding:8px;border-top:1px solid var(--line)}th{font-weight:600;color:var(--muted);width:110px}
thead td{font-weight:700;border-top:0}.win{font-weight:700}.pill{display:inline-block;padding:1px 8px;border-radius:999px;background:var(--soft);font-size:12px}
ul{margin:0;padding-left:16px}`,
  `<div class="card" id="root"></div>`,
  `const WORKS = { yes: 'Yes — HRV, baseline and coherence', partly: 'Partly — via Apple Health, if the device syncs heart data there', 'not-a-device': '—' };
boot((d) => {
  const P = d.products;
  const cell = (f) => P.map((p) => '<td>' + f(p) + '</td>').join('');
  const row = (label, f) => '<tr><th>' + label + '</th>' + cell(f) + '</tr>';
  const winner = d.duel && d.duel.winner;
  let html = '<h2>' + esc(d.duel ? d.duel.title : P.map((p) => p.name).join(' vs ')) + '</h2>';
  if (d.duel && d.duel.label) html += '<p class="small"><b>' + esc(d.duel.label) + '</b></p>';
  if (d.duel) html += '<p>' + esc(d.duel.verdict) + '</p>';
  if (P.length) {
    html += '<div class="wrap"><table><thead><tr><td></td>' + cell((p) => '<span class="' + (p.slug === winner ? 'win' : '') + '">' + esc(p.name) + (p.slug === winner ? ' ★' : '') + '</span>') + '</tr></thead><tbody>' +
      row('Price', (p) => (p.priceUsd ? '$' + esc(p.priceUsd) : '—') + (p.priceNote ? '<div class="muted small">' + esc(p.priceNote) + '</div>' : '')) +
      row('ONDA score', (p) => '<b>' + esc(p.score) + '</b>/10') +
      (P.some((p) => p.hrvMetric) ? row('HRV metric', (p) => esc(p.hrvMetric || '—')) : '') +
      (P.some((p) => p.focus.length) ? row('Your priority', (p) => p.focus.map((s) => esc(s.score) + ' — ' + esc(s.note)).join('<br>')) : '') +
      row('Pros', (p) => '<ul>' + p.pros.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>') +
      row('Cons', (p) => '<ul>' + p.cons.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>') +
      row('Best for', (p) => esc(p.bestFor)) +
      (P.some((p) => p.worksWithOnda !== 'not-a-device') ? row('Works with ONDA', (p) => '<span class="pill">' + esc(WORKS[p.worksWithOnda]) + '</span>') : '') +
      row('Review', (p) => '<a target="_blank" rel="noopener" href="' + esc(p.reviewUrl) + '">Full review</a><div class="muted small">' + esc(p.assessed) + '</div>') +
      '</tbody></table></div>';
  }
  if (d.duel) html += '<div class="row" style="margin-top:10px"><a class="btn ghost" target="_blank" rel="noopener" href="' + esc(d.duel.url) + '">Full comparison</a></div>';
  if (d.notFound.length) html += '<p class="muted small">No ONDA review yet: ' + d.notFound.map(esc).join(', ') + '.</p>';
  if (d.ownProductNote) html += '<p class="small"><span class="pill">Our product</span> ' + esc(d.ownProductNote) + '</p>';
  html += bridge(d.bridge) + '<p class="muted small">' + esc(d.source) + '</p>';
  $('#root').innerHTML = html;
});`,
);

export const WIDGETS = {
  hrv: { uri: 'ui://onda/hrv-v7.html', name: 'HRV compared with Fitbit users your age', html: hrv },
  breathe: { uri: 'ui://onda/breathe-v5.html', name: 'Breathing guide', html: breathe },
  practice: { uri: 'ui://onda/practice-v5.html', name: 'ONDA practices', html: practice },
  compare: { uri: 'ui://onda/compare-v6.html', name: 'Device and app comparison', html: compare },
};
