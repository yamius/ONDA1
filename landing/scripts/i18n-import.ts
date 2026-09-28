/**
 * Merge finished translations of one entry into the locale files (and optionally publish):
 *
 *   npx tsx scripts/i18n-import.ts <collection> <slug> [--publish YYYY-MM-DD|today] [--langs es,ru]
 *
 * Reads translations/<collection>/<slug>/<lang>.json ({ entry, support }, see i18n-export.ts),
 * normalizes `entry` to the canonical schema and writes it to
 * public/locales/<lang>/<file> → <path>.<slug> (replacing an older translation of it).
 * `support` strings are only ADDED where a language lacks them (ui/criteria/categories
 * keys; cards → reviews.bodies.<reviewSlug>.{verdict,productType}). Key order and line
 * endings are preserved. --publish appends the releases to scripts/locale-publish.ts.
 * Finally runs scripts/check-translations.ts for this collection.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'
import { TRANSLATION_SCHEMA, type TranslationCollection } from '../src/data/i18n-schema'
import { enSource } from './lib/i18n-source'
import { normalizeEntry } from './i18n-normalize'

const args = process.argv.slice(2)
const [col, slug] = args as [TranslationCollection, string]
const flag = (name: string) => {
  const i = args.indexOf(name)
  return i >= 0 ? args[i + 1] : undefined
}
if (!col || !slug || !(col in TRANSLATION_SCHEMA)) {
  console.error('usage: i18n-import.ts <articles|reviews|comparisons|h2h|glossary> <slug> [--publish YYYY-MM-DD|today] [--langs es,ru]')
  process.exit(1)
}
const dir = join('translations', col, slug)
if (!existsSync(dir)) {
  console.error(`${dir} not found — run i18n-export first`)
  process.exit(1)
}
const onlyLangs = flag('--langs')?.split(',')
const langs = readdirSync(dir)
  .filter((f) => /^[a-z]{2}\.json$/.test(f) && f !== 'en.json')
  .map((f) => f.slice(0, 2))
  .filter((l) => !onlyLangs || onlyLangs.includes(l))
const schema = TRANSLATION_SCHEMA[col]
const en = enSource(col).get(slug)

function writeJson(p: string, raw: string, data: unknown) {
  let out = JSON.stringify(data, null, 2) + '\n'
  if (raw.includes('\r\n')) out = out.replace(/\n/g, '\r\n')
  writeFileSync(p, out)
}
const addMissing = (target: Record<string, unknown>, add: Record<string, unknown> = {}) => {
  for (const [k, v] of Object.entries(add)) if (!(k in target)) target[k] = v
  return target
}

for (const lang of langs) {
  const t = JSON.parse(readFileSync(join(dir, `${lang}.json`), 'utf-8')) as { entry: Record<string, unknown>; support?: Record<string, Record<string, unknown>> }
  const p = join('public', 'locales', lang, schema.file)
  const raw = readFileSync(p, 'utf-8')
  const data = JSON.parse(raw)
  data[schema.path] = { ...(data[schema.path] ?? {}), [slug]: normalizeEntry(col, t.entry, en) }
  const s = t.support ?? {}
  if (s.ui) data.ui = addMissing({ ...(data.ui ?? {}) }, s.ui)
  if (s.criteria) data.criteria = addMissing({ ...(data.criteria ?? {}) }, s.criteria)
  if (s.categories) data.categories = addMissing({ ...(data.categories ?? {}) }, s.categories)
  if (s.cards) {
    data.bodies = data.bodies ?? {}
    for (const [rs, card] of Object.entries(s.cards as Record<string, Record<string, string>>)) {
      data.bodies[rs] = addMissing({ ...(data.bodies[rs] ?? {}) }, card)
    }
  }
  writeJson(p, raw, data)
  console.log(`[i18n-import] ${lang}: ${col}/${slug} → ${p}`)
}

const pub = flag('--publish')
if (pub && langs.length) {
  const date = pub === 'today' ? new Date().toISOString().slice(0, 10) : pub
  const file = join('scripts', 'locale-publish.ts')
  const src = readFileSync(file, 'utf-8')
  const line = `  ...everywhere('${col}', '${slug}', '${date}', ${JSON.stringify(langs)}),\n`
  const at = src.lastIndexOf(']')
  writeFileSync(file, src.slice(0, at) + line + src.slice(at))
  console.log(`[i18n-import] published ${col}/${slug} in ${langs.join(',')} from ${date} (scripts/locale-publish.ts)`)
}

execSync(`npx tsx scripts/check-translations.ts`, { stdio: 'inherit' })
