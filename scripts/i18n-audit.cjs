#!/usr/bin/env node
/**
 * i18n audit for the app's translation files.
 *
 * Reports per language:
 *   1. Total leaf keys + parity vs EN baseline
 *   2. Missing keys (present in EN but absent in this lang) — grouped by namespace
 *   3. Empty / null values
 *   4. English fallthroughs — values byte-equal to EN, AFTER filtering through
 *      ALLOWLIST below. The allowlist is the difference between "useful audit"
 *      and "noise" — without it, brand names ("ONDA LIFE", "Apple Watch"),
 *      Latin element names (TERRA/AQUA/AER/IGNIS), universal abbreviations
 *      (SpO2, Hz, BPM), and shared loanwords (POPULAR, Intro in es) all show
 *      up as fake "untranslated" rows.
 *
 * Run: node scripts/i18n-audit.cjs
 *
 * Tweak ALLOWLIST when adding new app strings that are intentionally the same
 * across languages.
 */

const fs = require('fs');
const path = require('path');

// ─── ALLOWLIST: false-positive filters for the fallthrough check ──────────

const ALLOWLIST = {
  // Full key paths whose value is intentionally identical in every language.
  // Brands, product names, Latin/Greek/Latin scientific terms, universal
  // medical abbreviations.
  fallthroughKeys: new Set([
    // Brand & app name
    'app_title',
    'nav.watch_hint_title',     // "Apple Watch"
    'nav.watch_activate_title', // "Onda Life"
    'liza.name',                // character name
    // Apple/Google product names — never localized
    'connection.healthkit',     // "Apple HealthKit"
    'connection.health_connect',// "Health Connect"
    // Universal medical abbreviations
    'bio_metrics.spo2',
    // Latin classical-element names (intentional thematic consistency)
    'chapters.chapter_1_element', // TERRA
    'chapters.chapter_2_element', // AQUA
    'chapters.chapter_3_element', // AER
    'chapters.chapter_4_element', // IGNIS
    // Latin anatomical term
    'part_info.level_8.pillar_4_title', // "Locus Coeruleus"
  ]),

  // Per-language: keys where the value coincides with EN by linguistic
  // accident (loanword, shared abbreviation), not by missing translation.
  fallthroughKeysByLang: {
    es: new Set([
      'nav.intro',          // "Intro" is also informal Spanish
      'shop.popular',       // "POPULAR" exists as Spanish word
      'practices.elemental', // "Elemental" is the same word in Spanish
    ]),
  },

  // Regex on VALUE — universal units / formats that don't translate.
  fallthroughValuePatterns: [
    // Numbers + unit: "1 min", "1.5 min", "40 Hz", "120 BPM", "5 kg"
    /^[\d.]+\s*(min|sec|s|ms|h|Hz|BPM|kg)\b/i,
    // Slash-prefixed unit: "/min", "/h"
    /^\/(min|sec|h)$/i,
    // Emoji + frequency: "🔇 1 Hz", "🌲 40 Hz"
    /^\p{Emoji}\s*[\d.]+\s*Hz$/u,
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────

function flatten(obj, prefix = '') {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? prefix + '.' + k : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) Object.assign(out, flatten(v, p));
    else out[p] = v;
  }
  return out;
}

function isAllowedFallthrough(key, lang, value) {
  if (ALLOWLIST.fallthroughKeys.has(key)) return true;
  if (ALLOWLIST.fallthroughKeysByLang[lang]?.has(key)) return true;
  if (typeof value === 'string') {
    for (const re of ALLOWLIST.fallthroughValuePatterns) if (re.test(value)) return true;
  }
  return false;
}

function groupByNamespace(keys) {
  const groups = {};
  for (const k of keys) {
    const ns = k.split('.')[0];
    groups[ns] = (groups[ns] || 0) + 1;
  }
  return Object.entries(groups).sort((a, b) => b[1] - a[1]);
}

// ─── Run ─────────────────────────────────────────────────────────────────

const LANGS = ['en', 'es', 'ru', 'uk', 'zh'];
const localesDir = path.join(__dirname, '..', 'public', 'locales');
const data = {};
for (const l of LANGS) {
  data[l] = JSON.parse(fs.readFileSync(path.join(localesDir, l, 'translation.json'), 'utf8'));
}
const flat = {};
for (const l of LANGS) flat[l] = flatten(data[l]);

const enKeys = Object.keys(flat.en);

// 1. Coverage
console.log('=== 1. COVERAGE (vs EN baseline of ' + enKeys.length + ' keys) ===\n');
for (const l of LANGS) {
  const total = Object.keys(flat[l]).length;
  const missing = l === 'en' ? 0 : enKeys.filter(k => !(k in flat[l])).length;
  const pct = l === 'en' ? '100%' : Math.round((1 - missing / enKeys.length) * 100) + '%';
  console.log(`  ${l}: ${total.toString().padStart(5)} keys   missing ${missing.toString().padStart(4)}   ${pct}`);
}

// 2. Missing per language, grouped by namespace
console.log('\n=== 2. MISSING KEYS BY NAMESPACE ===\n');
for (const l of LANGS.filter(l => l !== 'en')) {
  const missing = enKeys.filter(k => !(k in flat[l]));
  if (missing.length === 0) {
    console.log(`  ${l}: ✓ no gaps`);
    continue;
  }
  console.log(`  --- ${l.toUpperCase()} (${missing.length} missing) ---`);
  for (const [ns, n] of groupByNamespace(missing)) {
    console.log(`    ${n.toString().padStart(4)}  ${ns}`);
  }
}

// 3. Empty/null values
console.log('\n=== 3. EMPTY / NULL VALUES ===\n');
for (const l of LANGS) {
  const empty = Object.keys(flat[l]).filter(k => flat[l][k] === '' || flat[l][k] == null);
  if (empty.length === 0) continue;
  console.log(`  ${l}: ${empty.length} empty`);
  if (empty.length <= 8) empty.forEach(k => console.log(`    - ${k}`));
}

// 4. Fallthroughs (filtered through allowlist)
console.log('\n=== 4. ENGLISH FALLTHROUGHS (real, after allowlist) ===\n');
let totalReal = 0;
for (const l of LANGS.filter(l => l !== 'en')) {
  const real = [];
  for (const k of Object.keys(flat[l])) {
    if (!(k in flat.en)) continue;
    if (flat[l][k] !== flat.en[k]) continue;
    if (typeof flat[l][k] !== 'string' || flat[l][k].length <= 3) continue;
    if (isAllowedFallthrough(k, l, flat[l][k])) continue;
    real.push(k);
  }
  totalReal += real.length;
  if (real.length === 0) {
    console.log(`  ${l}: ✓ none`);
    continue;
  }
  console.log(`  --- ${l.toUpperCase()} (${real.length}) ---`);
  for (const k of real.slice(0, 30)) {
    const v = String(flat[l][k]).slice(0, 80).replace(/\n/g, ' ');
    console.log(`    ${k}  =  ${v}`);
  }
  if (real.length > 30) console.log(`    ... (${real.length - 30} more)`);
}

// Footer
console.log('\n=== SUMMARY ===');
const missingTotal = LANGS.filter(l => l !== 'en')
  .reduce((sum, l) => sum + enKeys.filter(k => !(k in flat[l])).length, 0);
console.log(`  Total missing keys across non-EN langs: ${missingTotal}`);
console.log(`  Real fallthroughs (allowlist-filtered): ${totalReal}`);
process.exit(totalReal > 0 ? 1 : 0);
