// Apply UK translations matching EN structure (preserves literal dotted keys).
const fs = require('fs');
const T = require('./uk-translations-data.cjs');

const enPath = 'public/locales/en/translation.json';
const ukPath = 'public/locales/uk/translation.json';
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const uk = JSON.parse(fs.readFileSync(ukPath, 'utf8'));

// Walk EN to build map: flat-path → [actual key segments preserving dotted keys]
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

// Cleanup: undo any prior bad nested structures by rebuilding affected branches.
// For each flat key in T, ensure UK's structure at that path matches EN's segments.
// If UK currently has wrong nested object where EN has dotted leaf, repair.
function repairBranchToEn(ukNode, enNode) {
  if (enNode && typeof enNode === 'object' && !Array.isArray(enNode)) {
    if (ukNode && typeof ukNode === 'object' && !Array.isArray(ukNode)) {
      for (const k of Object.keys(enNode)) {
        if (k.includes('.')) {
          // EN has literal dotted key. If UK has nested split version, flatten it.
          const parts = k.split('.');
          let bad = ukNode;
          let valid = true;
          for (const p of parts) {
            if (bad && typeof bad === 'object' && p in bad) bad = bad[p];
            else { valid = false; break; }
          }
          if (valid && typeof bad === 'string' && !(k in ukNode)) {
            ukNode[k] = bad;
            // remove the wrong nested chain
            delete ukNode[parts[0]];
          }
        } else if (typeof enNode[k] === 'object' && !Array.isArray(enNode[k])) {
          if (ukNode[k] && typeof ukNode[k] === 'object') repairBranchToEn(ukNode[k], enNode[k]);
        }
      }
    }
  }
}

repairBranchToEn(uk, en);

let count = 0, missing = 0;
for (const flatKey of Object.keys(T)) {
  const segs = pathMap[flatKey];
  if (!segs) { missing++; console.warn('No EN path for', flatKey); continue; }
  setByPath(uk, segs, T[flatKey]);
  count++;
}

fs.writeFileSync(ukPath, JSON.stringify(uk, null, 2) + '\n');
console.log('Applied', count, 'UK translations,', missing, 'missing in EN');
