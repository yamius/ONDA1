// Generic applier: node scripts/apply-translations.cjs <lang>
// Reads scripts/<lang>-translations-data.cjs and applies to public/locales/<lang>/translation.json,
// preserving EN's literal dotted-keys structure.
const fs = require('fs');

const lang = process.argv[2];
if (!lang) { console.error('Usage: apply-translations.cjs <lang>'); process.exit(1); }

const T = require(`./${lang}-translations-data.cjs`);

const enPath = 'public/locales/en/translation.json';
const targetPath = `public/locales/${lang}/translation.json`;
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const target = JSON.parse(fs.readFileSync(targetPath, 'utf8'));

function buildPathMap(obj, prefix = [], flat = '', map = {}) {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    for (const k of Object.keys(obj)) {
      const newFlat = flat ? flat + '.' + k : k;
      buildPathMap(obj[k], [...prefix, k], newFlat, map);
    }
  } else {
    map[flat] = prefix;
  }
  return map;
}
const pathMap = buildPathMap(en);

function setByPath(obj, segments, value) {
  let cur = obj;
  for (let i = 0; i < segments.length - 1; i++) {
    const k = segments[i];
    if (!(k in cur) || typeof cur[k] !== 'object' || Array.isArray(cur[k])) cur[k] = {};
    cur = cur[k];
  }
  cur[segments[segments.length - 1]] = value;
}

function repairBranchToEn(node, enNode) {
  if (enNode && typeof enNode === 'object' && !Array.isArray(enNode)) {
    if (node && typeof node === 'object' && !Array.isArray(node)) {
      for (const k of Object.keys(enNode)) {
        if (k.includes('.')) {
          const parts = k.split('.');
          let bad = node, valid = true;
          for (const p of parts) {
            if (bad && typeof bad === 'object' && p in bad) bad = bad[p];
            else { valid = false; break; }
          }
          if (valid && typeof bad === 'string' && !(k in node)) {
            node[k] = bad;
            delete node[parts[0]];
          }
        } else if (typeof enNode[k] === 'object' && !Array.isArray(enNode[k])) {
          if (node[k] && typeof node[k] === 'object') repairBranchToEn(node[k], enNode[k]);
        }
      }
    }
  }
}
repairBranchToEn(target, en);

let count = 0, missing = 0;
for (const k of Object.keys(T)) {
  const segs = pathMap[k];
  if (!segs) { missing++; console.warn('No EN path for', k); continue; }
  setByPath(target, segs, T[k]);
  count++;
}
fs.writeFileSync(targetPath, JSON.stringify(target, null, 2) + '\n');
console.log(`[${lang}] applied ${count}, missing in EN ${missing}`);
