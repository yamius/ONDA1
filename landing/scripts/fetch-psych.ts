/**
 * Task 108 вЂ” fetch psychology pages from the PRIVATE repo yamius/onda-psych at build time.
 *
 * - Needs ONDA_PSYCH_TOKEN (fine-grained PAT, read-only "Contents" on yamius/onda-psych only), set by the owner in
 *   Vercel env (and locally when testing). Without it вЂ” or on any network/API error вЂ” the step logs and exits 0:
 *   the site builds exactly as before, with no psychology pages.
 * - Takes content/<topic>/<lang>[--<angle>].md from onda-psych `main` (merged = passed its checks), keeps only
 *   files in which EVERY claim is status "approved" (owner) or "auto-checked" (green checks + bot merge, no owner
 *   review; pipeline v3); any "proposed" claim skips the file. Psych claims are RENDER-ONLY: they never enter
 *   src/data/science/facts.ts / the approved fact registry and are not reused elsewhere on the site (only the other
 *   direction exists: {{fact:вЂ¦}} of the main registry resolved inside psych bodies). Writes them to content/psych/ (gitignored). That folder is
 *   scanned by scripts/check-citations.ts, so a new PMID/DOI must be registered first:
 *     ONDA_PSYCH_TOKEN=вЂ¦ npx tsx scripts/fetch-psych.ts --include-unregistered && npm run citations:refresh
 *   в†’ commit data/citation-registry.json. In a normal build a file whose ids are not in the registry yet is
 *   SKIPPED (warning), so the build never breaks on it.
 * - No release queue (v3, 2026-11-02): every approved / auto-checked + registered page on onda-psych main is published
 *   on the next site build (indexable, in the sitemap -> IndexNow) via src/generated/psych-pages.json (gitignored).
 *   onda-psych .github/workflows/site-rebuild.yml fires the Vercel deploy hook ~15 min after the last merge.
 * - Local builds: ONDA_PSYCH_DIR=<path to a clone of onda-psych> reads content/ from that folder instead of the
 *   GitHub API (used when ONDA_PSYCH_TOKEN is not set). Keep the clone on an up-to-date `main`.
 * - Every {{fact:вЂ¦}} in a page body is resolved here (EN facts), like the science pages.
 */
import matter from 'gray-matter'
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { resolveFactsDeep } from '../src/data/science/facts'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(ROOT, 'content', 'psych')
const OUT_JSON = join(ROOT, 'src', 'generated', 'psych-pages.json')
const REPO = process.env.ONDA_PSYCH_REPO || 'yamius/onda-psych'
const TOKEN = process.env.ONDA_PSYCH_TOKEN
const LOCAL_DIR = process.env.ONDA_PSYCH_DIR
const INCLUDE_UNREGISTERED = process.argv.includes('--include-unregistered')

interface ClaimSource { pmid?: string; doi?: string; quote: string; study_type: string; coi: string; industry?: boolean }
const SHOWN_STATUSES = ['approved', 'auto-checked']
interface Claim { id: string; kind?: string; text: string; evidence_class: string; sources?: ClaimSource[]; pmid?: string; doi?: string; limitation?: string; status: string }
interface PsychPage { key: string; topic: string; lang: string; angle?: string; title: string; summary: string; updated: string; uncertainty?: string; claims: Claim[]; body: string; preview?: boolean }

function writeOut(pages: PsychPage[]) {
  mkdirSync(dirname(OUT_JSON), { recursive: true })
  writeFileSync(OUT_JSON, JSON.stringify(pages, null, 1))
}

async function gh(path: string, raw = false) {
  const r = await fetch(`https://api.github.com/repos/${REPO}/${path}`, {
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: raw ? 'application/vnd.github.raw+json' : 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
  })
  if (!r.ok) throw new Error(`GitHub ${r.status} for ${path}`)
  return raw ? r.text() : r.json()
}

function registryKeys(): Set<string> {
  try {
    const reg = JSON.parse(readFileSync(join(ROOT, 'data', 'citation-registry.json'), 'utf8')) as { entries: Record<string, { valid: boolean }> }
    return new Set(Object.entries(reg.entries).filter(([, e]) => e.valid).map(([k]) => k))
  } catch { return new Set() }
}

async function main() {
  rmSync(OUT_DIR, { recursive: true, force: true })
  const useLocal = !TOKEN && !!LOCAL_DIR && existsSync(join(LOCAL_DIR, 'content'))
  if (!TOKEN && !useLocal) {
    console.log('[fetch-psych] neither ONDA_PSYCH_TOKEN nor ONDA_PSYCH_DIR set вЂ” skipping psychology pages (build continues without them)')
    writeOut([])
    return
  }
  const FILE_RE = /^content\/[a-z0-9-]+\/[a-z]{2}(--[a-z0-9-]+)?\.md$/
  const paths = useLocal
    ? readdirSync(join(LOCAL_DIR!, 'content'), { withFileTypes: true }).filter((d) => d.isDirectory())
      .flatMap((d) => readdirSync(join(LOCAL_DIR!, 'content', d.name)).map((f) => `content/${d.name}/${f}`)).filter((p) => FILE_RE.test(p))
    : ((await gh('git/trees/main?recursive=1')) as { tree: { path: string; type: string }[] }).tree.filter((t) => t.type === 'blob' && FILE_RE.test(t.path)).map((t) => t.path)
  const read = async (p: string) => (useLocal ? readFileSync(join(LOCAL_DIR!, p), 'utf8') : ((await gh(`contents/${p}?ref=main`, true)) as string))
  const registry = registryKeys()
  const pages: PsychPage[] = []
  let kept = 0
  for (const p of paths) {
    const text = await read(p)
    const { data, content } = matter(text)
    const claims = (data.claims ?? []) as Claim[]
    if (!claims.length || claims.some((c) => !SHOWN_STATUSES.includes(c.status))) { console.log(`[fetch-psych] skip ${p}: a claim is not approved / auto-checked`); continue }
    const ids = claims.flatMap((c) => [c, ...(c.sources ?? [])]).flatMap((s) => [s.pmid && `pmid:${s.pmid}`, s.doi && `doi:${String(s.doi).toLowerCase()}`].filter(Boolean) as string[])
    const missing = [...new Set(ids)].filter((k) => !registry.has(k))
    const rel = p.replace(/^content\//, '')
    if (missing.length && !INCLUDE_UNREGISTERED) {
      console.warn(`[fetch-psych] skip ${p}: ids not in data/citation-registry.json yet (${missing.join(', ')}) вЂ” run with --include-unregistered, then npm run citations:refresh`)
      continue
    }
    const file = join(OUT_DIR, rel)
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, text)
    kept++
    const key = `${data.topic}/${data.lang}${data.angle ? `--${data.angle}` : ''}`
    const updated = data.updated instanceof Date ? data.updated.toISOString().slice(0, 10) : String(data.updated)
    pages.push(resolveFactsDeep({ key, topic: data.topic, lang: data.lang, angle: data.angle, title: data.title, summary: data.summary, updated, uncertainty: data.uncertainty, claims, body: content.trim() }, `psych:${key}`))
  }
  writeOut(pages)
  console.log(`[fetch-psych] ${paths.length} file(s) in ${useLocal ? LOCAL_DIR : REPO}, ${kept} approved / auto-checked + registered, ${pages.length} published`)
}

main().catch((e) => {
  console.warn(`[fetch-psych] ${e instanceof Error ? e.message : e} вЂ” skipping psychology pages`)
  rmSync(OUT_DIR, { recursive: true, force: true })
  writeOut([])
})
