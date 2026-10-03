/**
 * The four cards ChatGPT renders in the chat. Each is one self-contained HTML
 * document (no external scripts, fonts or requests), served as an MCP resource
 * with mimeType text/html+skybridge. Data arrives as window.openai.toolOutput
 * (the tool's structuredContent); the card re-renders on openai:set_globals.
 * Links open via window.openai.openExternal when the host provides it.
 */

const SHELL_CSS = `
:root{--bg:#fff;--fg:#14212b;--muted:#5d6b76;--line:#e3e8ec;--soft:#f4f7f9;--accent:#0f7c8c;--accent-fg:#fff;--warn:#9a5b00}
:root[data-theme=dark]{--bg:#16191c;--fg:#e8eef2;--muted:#9aa8b2;--line:#2b3238;--soft:#1e2328;--accent:#3fb6c4;--accent-fg:#0b1418;--warn:#e0a54a}
*{box-sizing:border-box}html,body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
.card{padding:16px;border:1px solid var(--line);border-radius:16px}
h2{font-size:17px;margin:0 0 4px}.muted{color:var(--muted);font-size:13px}.small{font-size:12.5px}
.bridge{margin-top:14px;padding:12px;border-radius:12px;background:var(--soft);display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap}
.btn{display:inline-block;padding:8px 14px;border-radius:999px;background:var(--accent);color:var(--accent-fg);text-decoration:none;font-weight:600;font-size:14px;border:0;cursor:pointer}
.btn.ghost{background:transparent;color:var(--accent);border:1px solid var(--accent)}
a{color:var(--accent)}.row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.warn{color:var(--warn)}
`;

const SHELL_JS = `
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function onLink(e){ const a = e.target.closest('a[href]'); if(!a) return; if(window.openai?.openExternal){ e.preventDefault(); window.openai.openExternal({ href: a.href }); } }
document.addEventListener('click', onLink);
function data(){ return window.openai?.toolOutput ?? window.__DEMO__ ?? null; }
function theme(){ document.documentElement.dataset.theme = window.openai?.theme === 'dark' ? 'dark' : 'light'; }
function boot(render){ const go = () => { theme(); const d = data(); if (d) render(d); }; go(); window.addEventListener('openai:set_globals', go); }
function bridge(b, extra=''){ if(!b) return ''; return '<div class="bridge"><span class="small">'+esc(b.text)+'</span><span class="row">'+extra+'<a class="btn" target="_blank" rel="noopener" href="'+esc(b.url)+'">Get ONDA</a></span></div>'; }
`;

const page = (title, css, body, js) => `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>${SHELL_CSS}${css}</style></head><body>${body}<script>${SHELL_JS}${js}</script></body></html>`;

// ── check_hrv ───────────────────────────────────────────────────────────
const hrv = page(
  'HRV for your age',
  `.scale{position:relative;height:14px;border-radius:999px;margin:22px 0 6px;background:linear-gradient(90deg,#d9655b 0%,#e8a94f 25%,#7fbf7a 50%,#3fa9b5 80%,#2c7fb8 100%)}
.pin{position:absolute;top:-24px;transform:translateX(-50%);font-size:12px;font-weight:700;white-space:nowrap}
.pin:after{content:"";position:absolute;left:50%;top:18px;width:2px;height:22px;background:var(--fg);transform:translateX(-50%)}
.ticks{display:flex;justify-content:space-between;font-size:11.5px;color:var(--muted)}
.big{font-size:28px;font-weight:700}`,
  `<div class="card" id="root"></div>`,
  `boot((d) => {
  const pct = Math.max(2, Math.min(98, d.percentile));
  $('#root').innerHTML =
    '<h2>Your HRV for age ' + esc(d.age) + '</h2>' +
    '<div class="muted">' + esc(d.metric) + ' · age band ' + esc(d.ageBand) + '</div>' +
    '<div class="row" style="margin-top:10px"><span class="big">' + esc(d.value) + ' ms</span><span>' + esc(d.tierLabel) + ' · ~' + esc(d.percentile) + ' percentile</span></div>' +
    '<div class="scale"><span class="pin" style="left:' + pct + '%">You</span></div>' +
    '<div class="ticks"><span>' + d.band.p10 + ' ms</span><span>median ' + d.band.p50 + ' ms</span><span>' + d.band.p90 + ' ms</span></div>' +
    '<p>' + esc(d.summary) + '</p>' +
    '<p class="muted small">' + esc(d.metricNote) + ' ' + esc(d.trendNote) + '</p>' +
    bridge(d.bridge, '<a class="btn ghost" target="_blank" rel="noopener" href="' + esc(d.learnMore) + '">Full calculator</a>') +
    '<p class="muted small">' + esc(d.safety) + '</p>';
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
    '<div>' + esc(p.why) + '</div><ol class="steps">' + p.firstSteps.map((s) => '<li>' + esc(s) + '</li>').join('') + '</ol></div>').join('');
  $('#root').innerHTML = '<h2>Practices to ' + esc(GOAL[d.goal] || d.goal) + '</h2>' +
    (d.timeNote ? '<div class="muted small">' + esc(d.timeNote) + '</div>' : '') +
    (items || '<p>No match in the free set.</p>') +
    '<div class="row" style="margin-top:8px"><a class="btn ghost" target="_blank" rel="noopener" href="' + esc(d.tryFree.url) + '">' + esc(d.tryFree.text) + '</a></div>' +
    bridge(d.bridge);
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
  `const WORKS = { yes: 'Yes — HRV + baseline', no: 'No (camera pulse works without it)', 'not-a-device': '—' };
boot((d) => {
  const P = d.products;
  const cell = (f) => P.map((p) => '<td>' + f(p) + '</td>').join('');
  const row = (label, f) => '<tr><th>' + label + '</th>' + cell(f) + '</tr>';
  const winner = d.duel && d.duel.winner;
  let html = '<h2>' + esc(d.duel ? d.duel.title : P.map((p) => p.name).join(' vs ')) + '</h2>';
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
  hrv: { uri: 'ui://widget/onda-hrv.html', name: 'HRV for your age', html: hrv },
  breathe: { uri: 'ui://widget/onda-breathe.html', name: 'Breathing guide', html: breathe },
  practice: { uri: 'ui://widget/onda-practice.html', name: 'ONDA practices', html: practice },
  compare: { uri: 'ui://widget/onda-compare.html', name: 'Device and app comparison', html: compare },
};
