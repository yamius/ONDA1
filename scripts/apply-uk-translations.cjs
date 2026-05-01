// Apply UK translations: deep-set each path in translations object
const fs = require('fs');

const T = require('./uk-translations-data.cjs');

const ukPath = 'public/locales/uk/translation.json';
const uk = JSON.parse(fs.readFileSync(ukPath, 'utf8'));

function setPath(obj, path, value) {
  const parts = path.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (!(p in cur) || typeof cur[p] !== 'object' || Array.isArray(cur[p])) cur[p] = {};
    cur = cur[p];
  }
  cur[parts[parts.length - 1]] = value;
}

let count = 0;
for (const key of Object.keys(T)) {
  setPath(uk, key, T[key]);
  count++;
}

fs.writeFileSync(ukPath, JSON.stringify(uk, null, 2) + '\n');
console.log('Applied', count, 'UK translations');
