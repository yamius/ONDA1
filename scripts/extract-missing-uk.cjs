// Extract UK missing keys with RU values for translation
const fs = require('fs');
const path = require('path');

const en = JSON.parse(fs.readFileSync('public/locales/en/translation.json', 'utf8'));
const ru = JSON.parse(fs.readFileSync('public/locales/ru/translation.json', 'utf8'));
const uk = JSON.parse(fs.readFileSync('public/locales/uk/translation.json', 'utf8'));

function flatten(obj, prefix = '', out = {}) {
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      flatten(v, key, out);
    } else {
      out[key] = v;
    }
  }
  return out;
}

const enFlat = flatten(en);
const ruFlat = flatten(ru);
const ukFlat = flatten(uk);

const missing = {};
for (const k of Object.keys(enFlat)) {
  if (!(k in ukFlat)) {
    // group by top-level namespace
    const ns = k.split('.')[0];
    if (!missing[ns]) missing[ns] = [];
    missing[ns].push({ key: k, ru: ruFlat[k], en: enFlat[k] });
  }
}

const out = process.argv[2] || 'uk-missing.json';
fs.writeFileSync(out, JSON.stringify(missing, null, 2));
console.log('Wrote', out);
console.log('Namespaces:', Object.keys(missing).length);
console.log('Total keys:', Object.values(missing).reduce((a, b) => a + b.length, 0));
