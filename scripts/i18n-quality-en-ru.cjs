// Deep quality audit for EN/RU. Goes beyond key-parity:
//   1. Empty/null values (reveals stub keys that need real content).
//   2. Placeholder mismatches — when EN has {{count}} but RU doesn't, or
//      vice versa, the rendered string breaks at runtime.
//   3. RU values that contain no Cyrillic at all (after filtering brands,
//      Latin element names, units) — that's likely untranslated English
//      text masquerading as a translation.
//   4. EN values that contain Cyrillic — a bug, would mean Russian leaked
//      into the English source.

const fs = require('fs');
const path = require('path');

function flatten(obj, prefix = '') {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? prefix + '.' + k : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) Object.assign(out, flatten(v, p));
    else out[p] = v;
  }
  return out;
}

const en = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'public/locales/en/translation.json'), 'utf8'));
const ru = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'public/locales/ru/translation.json'), 'utf8'));
const fEn = flatten(en);
const fRu = flatten(ru);

const ALLOW = new Set([
  'app_title', 'nav.watch_hint_title', 'nav.watch_activate_title',
  'liza.name', 'connection.healthkit', 'connection.health_connect',
  'bio_metrics.spo2',
  'chapters.chapter_1_element', 'chapters.chapter_2_element',
  'chapters.chapter_3_element', 'chapters.chapter_4_element',
  'part_info.level_8.pillar_4_title',
]);
const UNIT_RE = /^(?:[\d.]+\s*(?:min|sec|s|ms|h|Hz|BPM|kg)\b|\/(?:min|sec|h)|\p{Emoji}\s*[\d.]+\s*Hz)/iu;
const CYR_RE = /[Ѐ-ӿ]/;
const NUMERIC_RE = /^[\d\s.,!?:;\-+/()[\]{}\\]+$/;

console.log('=== 1. Empty / null values ===');
const emptyEn = Object.keys(fEn).filter(k => fEn[k] === '' || fEn[k] == null);
const emptyRu = Object.keys(fRu).filter(k => fRu[k] === '' || fRu[k] == null);
console.log(`  EN: ${emptyEn.length}, RU: ${emptyRu.length}`);
emptyEn.slice(0, 20).forEach(k => console.log('    EN: ' + k));

console.log('\n=== 2. Placeholder mismatches ({{x}}) ===');
const phMismatch = [];
for (const k of Object.keys(fEn)) {
  if (typeof fEn[k] !== 'string' || typeof fRu[k] !== 'string') continue;
  const enPh = (fEn[k].match(/\{\{[^}]+\}\}/g) || []).sort().join(',');
  const ruPh = (fRu[k].match(/\{\{[^}]+\}\}/g) || []).sort().join(',');
  if (enPh !== ruPh) phMismatch.push({ k, en: enPh, ru: ruPh });
}
console.log(`  Total: ${phMismatch.length}`);
phMismatch.slice(0, 20).forEach(m => console.log(`    ${m.k}  EN: [${m.en}]  RU: [${m.ru}]`));

console.log('\n=== 3. RU values without Cyrillic (likely untranslated EN) ===');
const noKyr = [];
for (const k of Object.keys(fRu)) {
  const v = fRu[k];
  if (typeof v !== 'string' || v.length < 4) continue;
  if (ALLOW.has(k)) continue;
  if (UNIT_RE.test(v)) continue;
  if (CYR_RE.test(v)) continue;
  if (NUMERIC_RE.test(v)) continue;
  noKyr.push({ k, v });
}
console.log(`  Total: ${noKyr.length}`);
noKyr.slice(0, 50).forEach(({ k, v }) => console.log('    ' + k + '  =  ' + String(v).slice(0, 100)));
if (noKyr.length > 50) console.log(`    ... (${noKyr.length - 50} more)`);

console.log('\n=== 4. EN values with Cyrillic (bug — RU leaked into EN) ===');
const enWithCyr = [];
for (const k of Object.keys(fEn)) {
  if (typeof fEn[k] !== 'string') continue;
  if (CYR_RE.test(fEn[k])) enWithCyr.push({ k, v: fEn[k] });
}
console.log(`  Total: ${enWithCyr.length}`);
enWithCyr.slice(0, 20).forEach(({ k, v }) => console.log('    ' + k + '  =  ' + String(v).slice(0, 100)));
