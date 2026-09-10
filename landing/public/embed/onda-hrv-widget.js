/*!
 * ONDA Life — HRV Interpreter widget (embeddable, dependency-free)
 * Enter age + resting RMSSD → population-percentile interpretation.
 *
 * Usage on any page:
 *   <div data-onda-hrv></div>
 *   <script src="https://onda-life.com/embed/onda-hrv-widget.js" defer></script>
 *
 * Renders in the host page's light DOM with scoped `ondahrv-` classes, so the
 * "Powered by ONDA Life" attribution link is a normal, crawlable link on your
 * page. Educational only — not medical advice. MIT licensed.
 * Source: https://github.com/yamius/onda-hrv-widget
 */
(function () {
  'use strict';
  var SITE = 'https://onda-life.com';
  var TOOL_URL = SITE + '/tools/hrv?utm_source=widget&utm_medium=embed';

  // ── HRV reference bands (night-time RMSSD, ms) by age, derived from the
  // normative literature (Nunan 2010, Umetani 1998, Voss 2015; ESC/NASPE 1996).
  // Percentile anchors p10/p25/p50/p75/p90. See onda-life.com/tools/hrv.
  var BANDS = [
    { min: 18, max: 29, label: '18–29', p10: 30, p25: 42, p50: 58, p75: 78, p90: 100 },
    { min: 30, max: 39, label: '30–39', p10: 26, p25: 36, p50: 50, p75: 68, p90: 90 },
    { min: 40, max: 49, label: '40–49', p10: 22, p25: 30, p50: 42, p75: 56, p90: 75 },
    { min: 50, max: 59, label: '50–59', p10: 18, p25: 26, p50: 36, p75: 48, p90: 64 },
    { min: 60, max: 69, label: '60–69', p10: 16, p25: 22, p50: 30, p75: 42, p90: 56 },
    { min: 70, max: Infinity, label: '70+', p10: 14, p25: 19, p50: 26, p75: 36, p90: 48 }
  ];
  var TIERS = [
    { max: 20, tier: 'low', label: 'Low for your age' },
    { max: 40, tier: 'below', label: 'Below average' },
    { max: 60, tier: 'average', label: 'Average' },
    { max: 80, tier: 'above', label: 'Above average' },
    { max: 100, tier: 'excellent', label: 'Excellent' }
  ];
  var TIER_COLOR = {
    low: '#f87171', below: '#fbbf24', average: 'rgba(255,255,255,.85)',
    above: '#34d399', excellent: '#22d3ee'
  };

  function bandForAge(age) {
    for (var i = 0; i < BANDS.length; i++) if (age >= BANDS[i].min && age <= BANDS[i].max) return BANDS[i];
    return BANDS[0];
  }
  function estimatePercentile(r, b) {
    var pts = [[b.p10, 10], [b.p25, 25], [b.p50, 50], [b.p75, 75], [b.p90, 90]];
    if (r <= b.p10) return Math.max(1, Math.round((r / b.p10) * 10));
    if (r >= b.p90) return Math.min(99, Math.round(90 + ((r - b.p90) / b.p90) * 9));
    for (var i = 0; i < pts.length - 1; i++) {
      var v0 = pts[i][0], p0 = pts[i][1], v1 = pts[i + 1][0], p1 = pts[i + 1][1];
      if (r >= v0 && r <= v1) { var t = (r - v0) / (v1 - v0); return Math.round(p0 + t * (p1 - p0)); }
    }
    return 50;
  }
  function ordinal(n) {
    n = Math.round(n);
    var v = Math.abs(n) % 100, s = 'th';
    if (!(v >= 11 && v <= 13)) { var d = v % 10; s = d === 1 ? 'st' : d === 2 ? 'nd' : d === 3 ? 'rd' : 'th'; }
    return n + s;
  }
  function interpret(age, rmssd) {
    var b = bandForAge(age);
    var pct = estimatePercentile(rmssd, b);
    var t = null;
    for (var i = 0; i < TIERS.length; i++) { if (pct <= TIERS[i].max) { t = TIERS[i]; break; } }
    if (!t) t = TIERS[2];
    return { band: b, percentile: pct, tier: t.tier, tierLabel: t.label, barPct: Math.max(2, Math.min(98, pct)) };
  }

  var STYLE_ID = 'ondahrv-styles';
  var CSS =
    '.ondahrv{box-sizing:border-box;max-width:420px;margin:0 auto;border:1px solid rgba(255,255,255,.1);border-radius:14px;background:#0a1018;color:#fff;padding:20px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.5}' +
    '.ondahrv *{box-sizing:border-box}' +
    '.ondahrv__k{font:600 11px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.15em;text-transform:uppercase;color:rgba(34,211,238,.8);margin-bottom:12px}' +
    '.ondahrv__lead{font:400 12px/1.5 ui-monospace,monospace;color:rgba(255,255,255,.5);margin:0 0 16px}' +
    '.ondahrv__row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}' +
    '.ondahrv__lab{display:block}' +
    '.ondahrv__lab span{display:block;font:600 10px/1 ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.5);margin-bottom:6px}' +
    '.ondahrv__in{width:100%;border:1px solid rgba(255,255,255,.15);border-radius:10px;background:rgba(0,0,0,.3);color:#fff;padding:9px 12px;font:400 16px ui-monospace,monospace;outline:none}' +
    '.ondahrv__in:focus{border-color:rgba(52,211,153,.6)}' +
    '.ondahrv__out{border:1px solid rgba(255,255,255,.1);border-radius:10px;background:rgba(255,255,255,.05);padding:12px}' +
    '.ondahrv__top{display:flex;align-items:baseline;justify-content:space-between;gap:8px}' +
    '.ondahrv__tier{font:700 18px/1.2 system-ui,sans-serif}' +
    '.ondahrv__pct{font:400 12px ui-monospace,monospace;color:rgba(255,255,255,.5);white-space:nowrap}' +
    '.ondahrv__bar{margin-top:10px;height:6px;width:100%;border-radius:999px;background:rgba(255,255,255,.1);overflow:hidden}' +
    '.ondahrv__fill{height:100%;border-radius:999px;background:linear-gradient(90deg,#22d3ee,#34d399)}' +
    '.ondahrv__note{margin:8px 0 0;font:400 10px/1.5 ui-monospace,monospace;color:rgba(255,255,255,.45)}' +
    '.ondahrv__hint{font:400 12px ui-monospace,monospace;color:rgba(255,255,255,.4);margin:0}' +
    '.ondahrv__by{margin-top:16px;text-align:center}' +
    '.ondahrv__by a{font:400 10px ui-monospace,monospace;color:rgba(255,255,255,.4);text-decoration:none}' +
    '.ondahrv__by a:hover{color:#34d399}' +
    '.ondahrv__by b{color:#34d399;font-weight:600}.ondahrv__by i{color:#22d3ee;font-style:normal}';

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID; s.textContent = CSS;
    document.head.appendChild(s);
  }

  function esc(v) { return String(v); }

  function mount(el) {
    if (el.getAttribute('data-onda-hrv-ready')) return;
    el.setAttribute('data-onda-hrv-ready', '1');

    var root = document.createElement('div');
    root.className = 'ondahrv';
    root.innerHTML =
      '<div class="ondahrv__k">HRV Interpreter</div>' +
      '<p class="ondahrv__lead">Enter your age and resting RMSSD to see where your HRV lands against population norms.</p>' +
      '<div class="ondahrv__row">' +
        '<label class="ondahrv__lab"><span>Age</span><input class="ondahrv__in" data-f="age" type="number" inputmode="numeric" min="18" max="100" value="35"></label>' +
        '<label class="ondahrv__lab"><span>RMSSD (ms)</span><input class="ondahrv__in" data-f="rmssd" type="number" inputmode="numeric" min="1" max="250" value="45"></label>' +
      '</div>' +
      '<div data-slot="out"></div>' +
      '<div class="ondahrv__by">' +
        '<a href="' + TOOL_URL + '" target="_blank" rel="noopener">Powered by <b>ONDA</b> <i>Life</i> — HRV Interpreter →</a>' +
      '</div>';
    el.appendChild(root);

    var out = root.querySelector('[data-slot="out"]');
    var ageEl = root.querySelector('[data-f="age"]');
    var rmssdEl = root.querySelector('[data-f="rmssd"]');

    function render() {
      var a = parseInt(ageEl.value, 10), r = parseInt(rmssdEl.value, 10);
      if (!a || a < 18 || a > 100 || !r || r < 1 || r > 250) {
        out.innerHTML = '<p class="ondahrv__hint">Enter age (18–100) and RMSSD (1–250 ms).</p>';
        return;
      }
      var res = interpret(a, r);
      out.innerHTML =
        '<div class="ondahrv__out">' +
          '<div class="ondahrv__top">' +
            '<span class="ondahrv__tier" style="color:' + TIER_COLOR[res.tier] + '">' + esc(res.tierLabel) + '</span>' +
            '<span class="ondahrv__pct">~' + ordinal(res.percentile) + ' pct</span>' +
          '</div>' +
          '<div class="ondahrv__bar"><div class="ondahrv__fill" style="width:' + res.barPct + '%"></div></div>' +
          '<p class="ondahrv__note">Median for your age ≈ ' + res.band.p50 + ' ms. Educational, not medical advice.</p>' +
        '</div>';
    }
    ageEl.addEventListener('input', render);
    rmssdEl.addEventListener('input', render);
    render();
  }

  function init() {
    injectStyle();
    var nodes = document.querySelectorAll('[data-onda-hrv]');
    for (var i = 0; i < nodes.length; i++) mount(nodes[i]);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // Expose a manual mount for SPA / dynamic insertion.
  window.OndaHrvWidget = { mount: mount, init: init };
})();
