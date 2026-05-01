// Remove 7 stale onboarding keys from all 5 language files.
//
// These keys (screen1_subtitle, screen2_subtitle, screen2_text3,
// screen2_list5, screen2_list6, screen2_list7, screen3_subtitle) are
// empty strings in every language including EN, AND grep src/ returns
// zero references — they're leftover from a previous onboarding design
// that got refactored away. Removing them shrinks the translation files
// and stops the i18n-audit from flagging them every run.

const fs = require('fs');
const path = require('path');

const STALE = [
  'screen1_subtitle',
  'screen2_subtitle',
  'screen2_text3',
  'screen2_list5',
  'screen2_list6',
  'screen2_list7',
  'screen3_subtitle',
];

const langs = ['en', 'es', 'ru', 'uk', 'zh'];
const dir = path.join(__dirname, '..', 'public', 'locales');

let total = 0;
for (const l of langs) {
  const p = path.join(dir, l, 'translation.json');
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (!data.onboarding) continue;
  let removed = 0;
  for (const k of STALE) {
    if (k in data.onboarding) {
      delete data.onboarding[k];
      removed++;
    }
  }
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n');
  console.log(`${l}: removed ${removed} stale keys`);
  total += removed;
}
console.log(`\nTotal: ${total} keys removed across ${langs.length} files`);
