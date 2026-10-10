/**
 * Builds ONDA Science from content/science/<kind>/<slug>.md (rules: docs/science-pack/) and the translations in
 * content/science-i18n/<lang>/<kind>/<slug>.md.
 *
 * Outputs
 * - src/generated/science-pages.ts — light index for the client (titles + descriptions per language, no bodies).
 * - src/generated/science-full.ts  — every page in every language, for the prerender and meta-inject only
 *                                    (never imported by client code).
 * - public/_content/science/<lang>/<kind>/<slug>.json — one page's full data; fetched by the client on demand.
 *
 * Rules
 * - {{fact:id}} is resolved to the approved value in the page's language (facts.ts / facts-i18n.ts); unknown id or
 *   a missing translation → build error.
 * - A page with pending items (a proposals block, {{proposed:…}}, or a fact that is not approved) is NOT published.
 * - A translation is published only for languages in SCIENCE_LIVE_LANGS (src/data/science/i18n.ts); a page without a
 *   translation stays EN-only in that language (warning). A translation's
 *   `sourceHash` must match the EN file; a mismatch (EN edited after translation) is reported as STALE, and the
 *   translation keeps being served until it is updated.
 * - Translations keep the EN structure: same number of evidence-map rows; sources, quotes, classes, images and
 *   links come from the EN page.
 * Runs in `dev` and `build` (before tsc). Outputs are gitignored.
 */
import matter from 'gray-matter'
import { createHash } from 'node:crypto'
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { FACTS, resolveFacts, type FactLang } from '../src/data/science/facts'
import { SCIENCE_LIVE_LANGS } from '../src/data/science/i18n'
import { SCIENCE_KIND_IDS } from '../src/data/science/kinds'
import { glossaryTerms } from '../src/data/glossary'
import { articles } from '../src/data/articles'
import { TOOLS } from '../src/data/tools'

const ROOT = join(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..')
const DIR = join(ROOT, 'content', 'science')
const I18N_DIR = join(ROOT, 'content', 'science-i18n')
const OUT = join(ROOT, 'src', 'generated', 'science-pages.ts')
const OUT_FULL = join(ROOT, 'src', 'generated', 'science-full.ts')
const OUT_JSON = join(ROOT, 'public', '_content', 'science')
const KINDS = SCIENCE_KIND_IDS // the one list: src/data/science/kinds.ts

/** Hash of an EN page file, stored in each translation as `sourceHash`. */
export const scienceSourceHash = (text: string) => createHash('sha1').update(text.replace(/\r\n/g, '\n')).digest('hex').slice(0, 12)

const enTitle = {
  glossary: new Map(glossaryTerms.map((t) => [t.slug, t.title])),
  articles: new Map(articles.map((a) => [a.slug, a.title])),
  tools: new Map((TOOLS as { slug: string; title?: string; name?: string }[]).map((t) => [t.slug, t.title ?? t.name ?? t.slug])),
}
/** Localized titles of glossary terms and articles (labels for related links on translated pages). */
function localizedTitles(lang: string): { glossary: Map<string, string>; articles: Map<string, string> } {
  const read = (ns: string) => {
    const p = join(ROOT, 'public', 'locales', lang, `${ns}.json`)
    if (!existsSync(p)) return new Map<string, string>()
    const bodies = (JSON.parse(readFileSync(p, 'utf8')).bodies ?? {}) as Record<string, { title?: string }>
    return new Map(Object.entries(bodies).filter(([, v]) => v?.title).map(([k, v]) => [k, String(v.title)]))
  }
  return { glossary: read('glossary'), articles: read('articles') }
}

/** Intrinsic size of a PNG/JPEG in public/ (for width/height attributes; avoids layout shift). */
function imageSize(rel: string): { w: number; h: number } | null {
  const p = join(ROOT, 'public', rel)
  if (!existsSync(p)) return null
  const b = readFileSync(p)
  if (b.readUInt32BE(0) === 0x89504e47) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }
  let i = 2
  while (i < b.length) {
    if (b[i] !== 0xff) { i++; continue }
    const m = b[i + 1]
    if (m >= 0xc0 && m <= 0xc3) return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) }
    i += 2 + b.readUInt16BE(i + 2)
  }
  return null
}

function lastModified(file: string): string {
  try {
    const d = execSync(`git log -1 --format=%cs -- "${file}"`, { cwd: ROOT, encoding: 'utf8' }).trim()
    if (d) return d
  } catch { /* not committed yet */ }
  return new Date().toISOString().slice(0, 10)
}

interface Raw { kind: string; slug: string; file: string; text: string; fm: any; body: string }
function readTree(dir: string): Raw[] {
  const out: Raw[] = []
  if (!existsSync(dir)) return out
  for (const k of readdirSync(dir)) {
    const p = join(dir, k)
    if (!statSync(p).isDirectory() || !(KINDS as readonly string[]).includes(k)) continue
    for (const f of readdirSync(p)) if (f.endsWith('.md')) {
      const file = join(p, f)
      const text = readFileSync(file, 'utf8')
      const m = matter(text)
      out.push({ kind: k, slug: basename(f, '.md'), file, text, fm: m.data, body: m.content })
    }
  }
  return out
}

const raws = readTree(DIR)
const skipped: string[] = []
const publishable = raws.filter((r) => {
  const why: string[] = []
  if (Array.isArray(r.fm.proposals) && r.fm.proposals.length) why.push('proposals pending')
  if (/\{\{proposed:/.test(r.body)) why.push('{{proposed:}} in body')
  for (const m of r.body.matchAll(/\{\{fact:([^}|]+)/g)) if (FACTS[m[1]] && FACTS[m[1]].status !== 'approved') why.push(`fact ${m[1]} not approved`)
  if (why.length) skipped.push(`${r.kind}/${r.slug}: ${why.join(', ')}`)
  return !why.length
})
const key = (r: { kind: string; slug: string }) => `${r.kind}/${r.slug}`
const published = new Set(publishable.map(key))

// Translations: lang → key → raw
const translations = new Map<string, Map<string, Raw>>()
const stale: { lang: string; page: string }[] = []
const problems: string[] = []
if (existsSync(I18N_DIR)) {
  for (const lang of readdirSync(I18N_DIR)) {
    if (!statSync(join(I18N_DIR, lang)).isDirectory()) continue
    const m = new Map<string, Raw>()
    for (const t of readTree(join(I18N_DIR, lang))) {
      const en = publishable.find((r) => key(r) === key(t))
      if (!en) continue // translation of an unpublished page: ignored
      if (t.fm.sourceHash !== scienceSourceHash(en.text)) stale.push({ lang, page: key(t) })
      const rows = (t.fm.evidenceMap ?? []) as unknown[]
      if (rows.length !== (en.fm.evidenceMap ?? []).length) problems.push(`${lang}/${key(t)}: evidenceMap has ${rows.length} rows, EN has ${(en.fm.evidenceMap ?? []).length}`)
      for (const f of ['title', 'metaTitle', 'metaDescription', 'shortAnswer', 'imageAlt']) if (!t.fm[f] && en.fm[f]) problems.push(`${lang}/${key(t)}: missing ${f}`)
      if ((t.fm.keyPoints ?? []).length !== (en.fm.keyPoints ?? []).length) problems.push(`${lang}/${key(t)}: keyPoints count differs from EN`)
      m.set(key(t), t)
    }
    translations.set(lang, m)
  }
}
// A live language without a translation of a page simply has no /<lang>/ version of it yet (EN only) — reported, not fatal,
// so a new EN page can be published before its translations exist.
const untranslated: string[] = []
for (const lang of SCIENCE_LIVE_LANGS) {
  const m = translations.get(lang)
  const missing = publishable.filter((r) => !m?.has(key(r))).map(key)
  if (missing.length) untranslated.push(`${lang}: ${missing.join(', ')}`)
}
if (problems.length) {
  console.error(`[science] translation problems:\n  ${problems.join('\n  ')}`)
  process.exit(1)
}

// STALE (sourceHash ≠ EN): fatal for LIVE languages (a published /<lang>/ page would contradict EN), a warning for
// languages not live yet (they go live on their SCIENCE_ROLLOUT Monday and must be fixed by then).
// Override (emergency only): ALLOW_STALE=page:lang,page:lang (e.g. mechanisms/caffeine-and-hrv:es) + ALLOW_STALE_REASON="...".
const allowStale = new Set((process.env.ALLOW_STALE ?? '').split(',').map((x) => x.trim()).filter(Boolean))
const allowReason = (process.env.ALLOW_STALE_REASON ?? '').trim()
if (allowStale.size && !allowReason) {
  console.error('[science] ALLOW_STALE is set but ALLOW_STALE_REASON is empty — a reason is required for every stale override.')
  process.exit(1)
}
const staleLive = stale.filter((s) => SCIENCE_LIVE_LANGS.includes(s.lang))
const staleFatal = staleLive.filter((s) => !allowStale.has(`${s.page}:${s.lang}`))
for (const s of staleLive.filter((x) => allowStale.has(`${x.page}:${x.lang}`)))
  console.warn(`[science] ALLOW_STALE: publishing stale ${s.page}:${s.lang} — reason: ${allowReason}`)
if (staleFatal.length) {
  const list = staleFatal.map((s) => `${s.page}:${s.lang}`)
  console.error(
    `[science] STALE translations in LIVE languages (EN changed after translation; sourceHash mismatch):\n  ${list.join('\n  ')}\n` +
      `Fix: update each translation to the current EN text and set its sourceHash from\n` +
      `  npx tsx scripts/science-translation-helper.ts <lang> hash <kind/slug>\n` +
      `Emergency override (logged): ALLOW_STALE=${list.join(',')} ALLOW_STALE_REASON="why" npm run build`,
  )
  process.exit(1)
}
const staleNotLive = stale.filter((s) => !SCIENCE_LIVE_LANGS.includes(s.lang))

const langsOf = (k: string) => ['en', ...SCIENCE_LIVE_LANGS.filter((l) => translations.get(l)?.has(k))]

function buildPage(r: Raw, lang: string) {
  const k = key(r)
  const t = lang === 'en' ? null : translations.get(lang)!.get(k)!
  const where = lang === 'en' ? `content/science/${k}.md` : `content/science-i18n/${lang}/${k}.md`
  const L = lang as FactLang
  const fm = r.fm
  const tf = t?.fm ?? fm
  const titles = lang === 'en' ? null : localizedTitles(lang)
  const sci = [...(fm.related?.science ?? []), ...(Array.isArray(fm.relatedPlanned) ? fm.relatedPlanned : [])]
    .filter((s: string, i: number, a: string[]) => a.indexOf(s) === i && published.has(s) && s !== k)
  const sciTitle = (s: string) => {
    const tr = lang === 'en' ? null : translations.get(lang)?.get(s)
    return String((tr ?? publishable.find((p) => key(p) === s)!).fm.title)
  }
  const evRows = (fm.evidenceMap ?? []) as any[]
  const tRows = (t?.fm.evidenceMap ?? []) as any[]
  return {
    lang,
    kind: r.kind,
    slug: r.slug,
    langs: langsOf(k),
    title: String(tf.title),
    metaTitle: String(tf.metaTitle),
    metaDescription: String(tf.metaDescription),
    shortAnswer: resolveFacts(String(tf.shortAnswer).trim().replace(/\s+/g, ' '), where, L),
    keyPoints: (tf.keyPoints as string[]).map((x) => resolveFacts(x, where, L)),
    image: fm.image ? String(fm.image) : null,
    imageAlt: tf.imageAlt ? String(tf.imageAlt) : fm.imageAlt ? String(fm.imageAlt) : null,
    imageWidth: fm.image ? imageSize(String(fm.image))?.w ?? 1024 : null,
    imageHeight: fm.image ? imageSize(String(fm.image))?.h ?? 768 : null,
    editor: String(fm.editor),
    reviewer: fm.reviewer ?? null,
    lastReviewed: fm.lastReviewed ? String(fm.lastReviewed) : null,
    dateModified: lastModified(t ? t.file : r.file),
    body: resolveFacts(t ? t.body : r.body, where, L).replace(/<!--\s*myth-debunk\s*-->\s*/g, ''), // owner-reviewed exemption marker (check-science-content)
    sources: (fm.sources ?? []).map((s: any) => ({
      id: s.id, cite: s.cite, title: s.title, journal: s.journal ?? null, year: s.year ?? null,
      doi: s.doi ?? null, pmid: s.pmid != null ? String(s.pmid) : null, url: s.url ?? null, type: s.type,
      note: (t?.fm.sourceNotes?.[s.id] ?? s.note) ? String(t?.fm.sourceNotes?.[s.id] ?? s.note) : null,
    })),
    evidenceMap: evRows.map((e, i) => ({
      // "(fact x.y)" / "(proposal P1)" are notes for editors, not for readers.
      claim: resolveFacts(String(tRows[i]?.claim ?? e.claim), where, L).replace(/\s*\((?:facts?|proposals?)\s[^)]*\)/g, ''),
      sources: e.sources as string[],
      class: e.class,
      limitation: String(tRows[i]?.limitation ?? e.limitation),
    })),
    // hrefs are EN base paths; the page prefixes them with langHref (which falls back to EN when a target is not localized).
    related: [
      ...sci.map((s: string) => ({ href: `/science/${s}`, label: sciTitle(s), type: 'Science' })),
      ...(fm.related?.glossary ?? []).filter((g: string) => enTitle.glossary.has(g)).map((g: string) => ({ href: `/glossary/${g}`, label: titles?.glossary.get(g) ?? enTitle.glossary.get(g)!, type: 'Glossary' })),
      ...(fm.related?.articles ?? []).filter((a: string) => enTitle.articles.has(a)).map((a: string) => ({ href: `/articles/${a}`, label: titles?.articles.get(a) ?? enTitle.articles.get(a)!, type: 'Article' })),
      ...(fm.related?.tools ?? []).filter((x: string) => enTitle.tools.has(x)).map((x: string) => ({ href: `/tools/${x}`, label: enTitle.tools.get(x)!, type: 'Tool' })),
    ],
  }
}

const LANGS = ['en', ...SCIENCE_LIVE_LANGS]
const full: Record<string, ReturnType<typeof buildPage>[]> = {}
for (const lang of LANGS) full[lang] = publishable.filter((r) => langsOf(key(r)).includes(lang)).map((r) => buildPage(r, lang))

// Light index: per page, the languages it exists in and its title/description in each.
const index = publishable.map((r) => {
  const k = key(r)
  const i18n: Record<string, { title: string; metaDescription: string }> = {}
  for (const lang of langsOf(k)) {
    const p = full[lang].find((x) => key(x) === k)!
    i18n[lang] = { title: p.title, metaDescription: p.metaDescription }
  }
  return { kind: r.kind, slug: r.slug, langs: langsOf(k), i18n }
})

for (const lang of LANGS) for (const p of full[lang]) {
  const dir = join(OUT_JSON, lang, p.kind)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, `${p.slug}.json`), JSON.stringify(p))
}

const TYPES =
  `export type ScienceKind = ${KINDS.map((k) => `'${k}'`).join(' | ')}\n` +
  `export const SCIENCE_KINDS: ScienceKind[] = ${JSON.stringify(KINDS)}\n` +
  `export interface ScienceSource { id: string; cite: string; title: string; journal: string | null; year: number | null; doi: string | null; pmid: string | null; url: string | null; type: string; note?: string | null }\n` +
  `export interface ScienceEvidence { claim: string; sources: string[]; class: string; limitation: string }\n` +
  `export interface ScienceLink { href: string; label: string; type: string }\n` +
  `export interface SciencePageData { lang: string; kind: ScienceKind; slug: string; langs: string[]; title: string; metaTitle: string; metaDescription: string; shortAnswer: string; keyPoints: string[]; image: string | null; imageAlt: string | null; imageWidth: number | null; imageHeight: number | null; editor: string; reviewer: string | null; lastReviewed: string | null; dateModified: string; body: string; sources: ScienceSource[]; evidenceMap: ScienceEvidence[]; related: ScienceLink[] }\n` +
  `export interface ScienceIndexEntry { kind: ScienceKind; slug: string; langs: string[]; i18n: Record<string, { title: string; metaDescription: string }> }\n`

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(
  OUT,
  `// Generated by scripts/generate-science-pages.ts — do not edit. Light index; page bodies: public/_content/science/<lang>/<kind>/<slug>.json\n` +
    TYPES +
    `export const SCIENCE_LANGS: string[] = ${JSON.stringify(LANGS)}\n` +
    `export const SCIENCE_INDEX: ScienceIndexEntry[] = ${JSON.stringify(index)}\n`,
)
writeFileSync(
  OUT_FULL,
  `// Generated by scripts/generate-science-pages.ts — do not edit. SERVER ONLY (prerender, meta-inject): every page in every language.\n` +
    `import type { SciencePageData } from './science-pages'\n` +
    `export const SCIENCE_FULL: Record<string, SciencePageData[]> = ${JSON.stringify(full)}\n`,
)
const tr = SCIENCE_LIVE_LANGS.map((l) => `${l}:${full[l].length}`).join(' ')
console.log(`[science] generated ${publishable.length} page(s)${tr ? ` + translations ${tr}` : ''}${skipped.length ? `; NOT published (pending): ${skipped.join('; ')}` : ''}`)
if (untranslated.length) console.warn(`[science] not yet translated in live languages (EN only there): ${untranslated.join('; ')}`)
if (staleNotLive.length) console.warn(`[science] STALE translations in not-yet-live languages (fix before their SCIENCE_ROLLOUT date): ${staleNotLive.map((s) => `${s.page}:${s.lang}`).join(', ')}`)
