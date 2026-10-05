/**
 * Builds src/generated/science-pages.ts from content/science/<kind>/<slug>.md (rules: docs/science-pack/).
 *
 * - {{fact:id}} is resolved to the approved value (facts.ts); unknown id → build error.
 * - A page with pending items (a proposals block, {{proposed:…}}, or a fact that is not approved) is NOT
 *   published: it is skipped with a warning, so it never reaches the site, sitemap or llms.txt.
 * - relatedPlanned entries are shown automatically once that science page is published.
 * - Link labels for related glossary terms, articles and tools are resolved here, so the page
 *   chunk carries no catalogs.
 * Runs in `dev` and `build` (before tsc). Output is gitignored.
 */
import matter from 'gray-matter'
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { FACTS, resolveFacts } from '../src/data/science/facts'
import { glossaryTerms } from '../src/data/glossary'
import { articles } from '../src/data/articles'
import { TOOLS } from '../src/data/tools'

const ROOT = join(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..')
const DIR = join(ROOT, 'content', 'science')
const OUT = join(ROOT, 'src', 'generated', 'science-pages.ts')
const KINDS = ['concepts', 'measurements', 'mechanisms', 'evidence'] as const

const glossaryTitle = new Map(glossaryTerms.map((t) => [t.slug, t.title]))
const articleTitle = new Map(articles.map((a) => [a.slug, a.title]))
const toolTitle = new Map((TOOLS as { slug: string; title?: string; name?: string }[]).map((t) => [t.slug, t.title ?? t.name ?? t.slug]))

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

interface Raw { kind: string; slug: string; file: string; fm: any; body: string }
const raws: Raw[] = []
if (existsSync(DIR)) {
  for (const k of readdirSync(DIR)) {
    const p = join(DIR, k)
    if (!statSync(p).isDirectory() || !(KINDS as readonly string[]).includes(k)) continue
    for (const f of readdirSync(p)) if (f.endsWith('.md')) {
      const file = join(p, f)
      const m = matter(readFileSync(file, 'utf8'))
      raws.push({ kind: k, slug: basename(f, '.md'), file, fm: m.data, body: m.content })
    }
  }
}

const skipped: string[] = []
const publishable = raws.filter((r) => {
  const why: string[] = []
  if (Array.isArray(r.fm.proposals) && r.fm.proposals.length) why.push('proposals pending')
  if (/\{\{proposed:/.test(r.body)) why.push('{{proposed:}} in body')
  for (const m of r.body.matchAll(/\{\{fact:([^}]+)\}\}/g)) if (FACTS[m[1]] && FACTS[m[1]].status !== 'approved') why.push(`fact ${m[1]} not approved`)
  if (why.length) skipped.push(`${r.kind}/${r.slug}: ${why.join(', ')}`)
  return !why.length
})
const published = new Set(publishable.map((r) => `${r.kind}/${r.slug}`))
const titleOf = new Map(publishable.map((r) => [`${r.kind}/${r.slug}`, String(r.fm.title)]))

const pages = publishable.map((r) => {
  const where = `content/science/${r.kind}/${r.slug}.md`
  const fm = r.fm
  const sci = [...(fm.related?.science ?? []), ...(Array.isArray(fm.relatedPlanned) ? fm.relatedPlanned : [])]
    .filter((s: string, i: number, a: string[]) => a.indexOf(s) === i && published.has(s) && s !== `${r.kind}/${r.slug}`)
  return {
    kind: r.kind,
    slug: r.slug,
    title: String(fm.title),
    metaTitle: String(fm.metaTitle),
    metaDescription: String(fm.metaDescription),
    shortAnswer: resolveFacts(String(fm.shortAnswer).trim().replace(/\s+/g, ' '), where),
    keyPoints: (fm.keyPoints as string[]).map((k) => resolveFacts(k, where)),
    image: fm.image ? String(fm.image) : null,
    imageAlt: fm.imageAlt ? String(fm.imageAlt) : null,
    imageWidth: fm.image ? imageSize(String(fm.image))?.w ?? 1024 : null,
    imageHeight: fm.image ? imageSize(String(fm.image))?.h ?? 768 : null,
    editor: String(fm.editor),
    reviewer: fm.reviewer ?? null,
    lastReviewed: fm.lastReviewed ? String(fm.lastReviewed) : null,
    dateModified: lastModified(r.file),
    body: resolveFacts(r.body, where),
    sources: (fm.sources ?? []).map((s: any) => ({
      id: s.id, cite: s.cite, title: s.title, journal: s.journal ?? null, year: s.year ?? null,
      doi: s.doi ?? null, pmid: s.pmid != null ? String(s.pmid) : null, url: s.url ?? null, type: s.type, note: s.note ? String(s.note) : null,
    })),
    evidenceMap: (fm.evidenceMap ?? []).map((e: any) => ({
      claim: resolveFacts(String(e.claim), where), sources: e.sources as string[], class: e.class, limitation: String(e.limitation),
    })),
    related: [
      ...sci.map((s: string) => ({ href: `/science/${s}`, label: titleOf.get(s)!, type: 'Science' })),
      ...(fm.related?.glossary ?? []).filter((g: string) => glossaryTitle.has(g)).map((g: string) => ({ href: `/glossary/${g}`, label: glossaryTitle.get(g)!, type: 'Glossary' })),
      ...(fm.related?.articles ?? []).filter((a: string) => articleTitle.has(a)).map((a: string) => ({ href: `/articles/${a}`, label: articleTitle.get(a)!, type: 'Article' })),
      ...(fm.related?.tools ?? []).filter((t: string) => toolTitle.has(t)).map((t: string) => ({ href: `/tools/${t}`, label: toolTitle.get(t)!, type: 'Tool' })),
    ],
  }
})

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(
  OUT,
  `// Generated by scripts/generate-science-pages.ts — do not edit.\n` +
    `export type ScienceKind = ${KINDS.map((k) => `'${k}'`).join(' | ')}\n` +
    `export const SCIENCE_KINDS: ScienceKind[] = ${JSON.stringify(KINDS)}\n` +
    `export interface ScienceSource { id: string; cite: string; title: string; journal: string | null; year: number | null; doi: string | null; pmid: string | null; url: string | null; type: string; note?: string | null }\n` +
    `export interface ScienceEvidence { claim: string; sources: string[]; class: string; limitation: string }\n` +
    `export interface ScienceLink { href: string; label: string; type: string }\n` +
    `export interface SciencePageData { kind: ScienceKind; slug: string; title: string; metaTitle: string; metaDescription: string; shortAnswer: string; keyPoints: string[]; image: string | null; imageAlt: string | null; imageWidth: number | null; imageHeight: number | null; editor: string; reviewer: string | null; lastReviewed: string | null; dateModified: string; body: string; sources: ScienceSource[]; evidenceMap: ScienceEvidence[]; related: ScienceLink[] }\n` +
    `export const SCIENCE_PAGES: SciencePageData[] = ${JSON.stringify(pages, null, 1)}\n`,
)
console.log(`[science] generated ${pages.length} page(s)${skipped.length ? `; NOT published (pending): ${skipped.join('; ')}` : ''}`)
