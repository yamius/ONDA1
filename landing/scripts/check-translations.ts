/**
 * Validates every translation in public/locales/<lang>/{articles,reviews,glossary}.json
 * against src/data/i18n-schema.ts and the EN source (scripts/lib/i18n-source.ts).
 *
 * ERRORS (build fails) — a translation that would render wrong:
 *   unknown field (e.g. an id/flag copied into a translation), wrong shape, Q&A not {q,a},
 *   indexed list length ≠ EN, keyed id not in EN, markdown link targets ≠ EN, entry for an
 *   unknown slug.
 * WARNINGS (listed, build continues) — English would show on a live page:
 *   a PUBLISHED localized page whose translation misses a required field, or text that is
 *   still English.
 * Full report: .cache/translation-report.md
 *
 *   npx tsx scripts/check-translations.ts            # all
 *   npx tsx scripts/check-translations.ts ru reviews # one language / collection
 */
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { TRANSLATION_SCHEMA, type FieldSpec, type TranslationCollection } from '../src/data/i18n-schema'
import { enSource } from './lib/i18n-source'
import { LOCALIZED_ARTICLE_ROUTE_SET, LOCALIZED_GLOSSARY_ROUTE_SET, LOCALIZED_REVIEW_ROUTE_SET } from './prerender-routes'

const LANGS = ['es', 'ru', 'uk', 'zh', 'de', 'fr', 'it', 'nl', 'ja', 'pl', 'pt']
const [onlyLang, onlyCol] = process.argv.slice(2)

// ── published localized pages, per collection ──
const published = (set: Set<string>, re: RegExp) => {
  const out = new Set<string>()
  for (const r of set) {
    const m = r.match(re)
    if (m) out.add(`${m[1]}:${m[2]}`)
  }
  return out
}
const PUBLISHED: Record<TranslationCollection, Set<string>> = {
  articles: published(LOCALIZED_ARTICLE_ROUTE_SET, /^\/([a-z]{2})\/articles\/([^/]+)$/),
  reviews: published(LOCALIZED_REVIEW_ROUTE_SET, /^\/([a-z]{2})\/reviews\/(?!compare\/|vs\/|methodology$)([^/]+)$/),
  comparisons: published(LOCALIZED_REVIEW_ROUTE_SET, /^\/([a-z]{2})\/reviews\/compare\/([^/]+)$/),
  h2h: published(LOCALIZED_REVIEW_ROUTE_SET, /^\/([a-z]{2})\/reviews\/vs\/([^/]+)$/),
  glossary: published(LOCALIZED_GLOSSARY_ROUTE_SET, /^\/([a-z]{2})\/glossary\/([^/]+)$/),
}

// ── heuristics ──
const EN_WORDS = /\b(the|your|you|with|what|how|why|and|this|that|are|from|into|than|not|of|is)\b/gi
const NOT_EN = /\b(der|die|das|und|ist|nicht|mit|een|het|van|niet|les|des|est|pour|una|della|che|para|com|não|jest|nie|się|el|los|las|del|por|que)\b/i
function looksEnglish(s: string): boolean {
  const plain = s.replace(/\]\([^)]*\)/g, ']').replace(/`[^`]*`/g, '').replace(/https?:\S+/g, '')
  const letters = [...plain].filter((c) => /\p{L}/u.test(c))
  if (letters.length < 40) return false
  const ascii = letters.filter((c) => c <= 'z').length / letters.length
  if (ascii < 0.85) return false
  const hits = new Set((plain.match(EN_WORDS) ?? []).map((w) => w.toLowerCase()))
  return hits.size >= 4 && !NOT_EN.test(plain)
}
// Page links only — in-page anchors (#…) legitimately change with translated headings.
const links = (md: string) => new Set((md.match(/\]\(([^)\s]+)/g) ?? []).map((l) => l.slice(2)).filter((l) => !l.startsWith('#')))
let stale: number[] = []
const isStr = (v: unknown) => typeof v === 'string' && v.trim().length > 0

type Issue = { lang: string; col: string; slug: string; msg: string }
const errors: Issue[] = []
const warnings: Issue[] = []

function checkField(spec: FieldSpec, v: unknown, en: unknown, where: (m: string) => void, texts: string[]) {
  switch (spec.kind) {
    case 'text':
    case 'markdown':
      if (!isStr(v)) return where('must be a non-empty string')
      texts.push(v as string)
      if (spec.kind === 'markdown' && typeof en === 'string') {
        const enLinks = links(en)
        const trLinks = links(v as string)
        const bad = [...trLinks].filter((l) => !enLinks.has(l))
        if (bad.length) where(`links not in EN (translated/garbled URL?): ${bad.slice(0, 3).join(', ')}`)
        const lost = [...enLinks].filter((l) => !trLinks.has(l)).length
        if (lost) stale.push(lost)
      }
      return
    case 'textList':
      if (!Array.isArray(v) || !v.every(isStr)) return where('must be a list of strings')
      texts.push(...(v as string[]))
      return
    case 'qaList':
      if (!Array.isArray(v) || !v.every((x) => x && isStr((x as { q?: string }).q) && isStr((x as { a?: string }).a) && Object.keys(x).length === 2))
        return where('must be a list of { q, a }')
      for (const x of v as { q: string; a: string }[]) texts.push(x.q, x.a)
      return
    case 'indexed': {
      if (!Array.isArray(v)) return where('must be a list')
      if (Array.isArray(en) && v.length !== en.length) where(`has ${v.length} items, EN has ${en.length}`)
      for (const x of v) {
        const extra = Object.keys(x ?? {}).filter((k) => !spec.keys.includes(k))
        if (extra.length) where(`item has non-translatable keys: ${extra.join(', ')}`)
        for (const k of spec.keys) if (isStr(x?.[k])) texts.push(x[k])
      }
      return
    }
    case 'keyed': {
      if (!v || typeof v !== 'object' || Array.isArray(v)) return where('must be an object keyed by EN ids')
      const enKeys = new Set(Object.keys((en as object) ?? {}))
      for (const [k, val] of Object.entries(v as object)) {
        if (enKeys.size && !enKeys.has(k)) where(`unknown id "${k}"`)
        if (spec.keys) {
          if (!val || typeof val !== 'object') where(`"${k}" must be { ${spec.keys.join(', ')} }`)
          else for (const kk of spec.keys) if (isStr((val as Record<string, string>)[kk])) texts.push((val as Record<string, string>)[kk])
        } else if (!isStr(val)) where(`"${k}" must be a string`)
        else texts.push(val as string)
      }
      return
    }
    case 'object': {
      if (!v || typeof v !== 'object') return where('must be an object')
      const extra = Object.keys(v).filter((k) => !spec.keys.includes(k))
      if (extra.length) where(`has non-translatable keys: ${extra.join(', ')}`)
      for (const k of spec.keys) if (isStr((v as Record<string, string>)[k])) texts.push((v as Record<string, string>)[k])
    }
  }
}

for (const lang of LANGS) {
  if (onlyLang && lang !== onlyLang) continue
  const files = new Map<string, Record<string, unknown>>()
  for (const [col, schema] of Object.entries(TRANSLATION_SCHEMA) as [TranslationCollection, (typeof TRANSLATION_SCHEMA)[TranslationCollection]][]) {
    if (onlyCol && col !== onlyCol) continue
    if (!files.has(schema.file)) {
      try {
        files.set(schema.file, JSON.parse(readFileSync(join('public', 'locales', lang, schema.file), 'utf-8')))
      } catch {
        files.set(schema.file, {})
      }
    }
    const entries = ((files.get(schema.file) ?? {})[schema.path] ?? {}) as Record<string, Record<string, unknown>>
    const en = enSource(col)
    for (const [slug, entry] of Object.entries(entries)) {
      const enEntry = en.get(slug)
      // glossary/articles 'bodies' may also hold light entries for other collections' cards —
      // reviews.bodies can carry a partial {verdict, productType} for h2h product cards.
      if (!enEntry) {
        errors.push({ lang, col, slug, msg: 'translation for an unknown slug (renamed or deleted in EN?)' })
        continue
      }
      const texts: string[] = []
      stale = []
      for (const [field, value] of Object.entries(entry ?? {})) {
        const spec = (schema.fields as Record<string, FieldSpec>)[field]
        if (!spec) {
          errors.push({ lang, col, slug, msg: `"${field}" is not a translatable field — remove it (EN keeps ids/links/flags)` })
          continue
        }
        checkField(spec, value, enEntry[field], (m) => errors.push({ lang, col, slug, msg: `${field} ${m}` }), texts)
      }
      if (stale.length) warnings.push({ lang, col, slug, msg: `translation is behind EN: ${stale.reduce((a, b) => a + b, 0)} link(s) added in EN are missing` })
      if (PUBLISHED[col].has(`${lang}:${slug}`)) {
        const missing = schema.required.filter((f) => enEntry[f] !== undefined && entry[f] === undefined)
        if (missing.length) warnings.push({ lang, col, slug, msg: `published, but missing: ${missing.join(', ')} (shown in English)` })
        const englishy = texts.filter(looksEnglish)
        if (englishy.length) warnings.push({ lang, col, slug, msg: `still English: "${englishy[0].slice(0, 70)}…"${englishy.length > 1 ? ` (+${englishy.length - 1})` : ''}` })
      }
    }
    // published pages with NO translation at all
    for (const key of PUBLISHED[col]) {
      const [l, slug] = key.split(':')
      if (l === lang && !entries[slug]) warnings.push({ lang, col, slug, msg: 'published, but not translated at all (whole page in English)' })
    }
  }
}

const fmt = (i: Issue) => `${i.lang} ${i.col}/${i.slug}: ${i.msg}`
mkdirSync('.cache', { recursive: true })
writeFileSync(
  join('.cache', 'translation-report.md'),
  `# Translation report\n\n## Errors (${errors.length})\n${errors.map((i) => `- ${fmt(i)}`).join('\n')}\n\n## Warnings (${warnings.length})\n${warnings.map((i) => `- ${fmt(i)}`).join('\n')}\n`,
)
const byKey = (list: Issue[]) => {
  const m = new Map<string, number>()
  for (const i of list) m.set(`${i.lang} ${i.col}`, (m.get(`${i.lang} ${i.col}`) ?? 0) + 1)
  return [...m.entries()].map(([k, n]) => `${k}:${n}`).join('  ')
}
console.log(`[translations] ${warnings.length} warnings — ${byKey(warnings) || 'none'} (details: .cache/translation-report.md)`)
if (errors.length) {
  for (const e of errors.slice(0, 40)) console.error(`[translations] ERROR ${fmt(e)}`)
  if (errors.length > 40) console.error(`[translations] … ${errors.length - 40} more in .cache/translation-report.md`)
  process.exit(1)
}
console.log('[translations] OK — every translation matches the schema')
