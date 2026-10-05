/**
 * Gate for ONDA Science pages (written by Mistral, checked and published by Claude Code).
 * Rules: docs/science-pack/ — this script enforces the parts marked “auto” there.
 *
 *   npx tsx scripts/check-science-content.ts                    # all files in content/science/
 *   npx tsx scripts/check-science-content.ts --file <path.md>   # one file anywhere (e.g. a draft before hand-off)
 *   npx tsx scripts/check-science-content.ts --offline          # skip Crossref/PubMed/URL lookups
 *   npx tsx scripts/check-science-content.ts --publish          # also fail on pending proposals (use before publishing)
 *
 * Checks:
 *  1. frontmatter: required fields, kind, slug = file name, lengths, editor/reviewer rules
 *  2. sources: S1… unique; scientific types need a DOI or PMID that exists (Crossref / PubMed);
 *     type `official` needs a URL that opens (DOI not required)
 *  3. evidenceMap: valid class, limitation, known sources; `official` sources only in rows with
 *     claimType device|regulatory and no efficacy wording; class `guideline` needs a guideline source;
 *     every [Sx] in the body is defined
 *  4. numbers: none in the body outside {{fact:…}} / {{proposed:…}}; fact ids exist;
 *     no digits in title/meta/shortAnswer/keyPoints
 *  5. proposals: well-formed; every {{proposed:id}} is declared; proposed facts and proposals are PENDING —
 *     allowed in a draft, blocked with --publish
 *  6. banned wording
 *  7. related links exist; relatedPlanned = science pages not written yet (format only)
 * Exit code 1 on any error (and on pending items with --publish).
 */
import matter from 'gray-matter'
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { join, relative, basename, dirname, resolve } from 'node:path'
import { FACTS } from '../src/data/science/facts'
import { articles } from '../src/data/articles'
import { glossaryTerms } from '../src/data/glossary'

const ROOT = join(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..')
const DIR = join(ROOT, 'content', 'science')
const KINDS = ['concepts', 'measurements', 'mechanisms', 'evidence']
const SCIENTIFIC_TYPES = ['systematic-review', 'meta-analysis', 'randomized-trial', 'observational', 'review', 'guideline', 'other']
/** official = manufacturer/regulator documents; product-documentation = ONDA's own docs (what the app does). Both: URL, no DOI, device/regulatory claims only. */
const URL_TYPES = ['official', 'product-documentation']
const SOURCE_TYPES = [...SCIENTIFIC_TYPES, ...URL_TYPES]
/** `guideline` = guideline / expert consensus (e.g. methodological guidelines such as Carter 2026). */
const CLASSES = ['established', 'guideline', 'context-dependent', 'emerging', 'debated', 'unknown']
const CLAIM_TYPES = ['definition', 'measurement', 'physiology', 'device', 'regulatory', 'efficacy', 'safety', 'other']
const OFFICIAL_CLAIM_TYPES = ['device', 'regulatory']
/** Published before evidence quotes became mandatory (2026-10-04); every other page needs a quote per row. */
const QUOTE_GRANDFATHERED = new Set(['concepts/rmssd'])
const EFFICACY_WORDS = /\b(effective|efficacy|improv\w*|reduc\w*|lower\w*|increas\w*|rais\w*|treat\w*|works?|benefit\w*|help\w*|relie\w*|outcome\w*)\b/i

const argv = process.argv.slice(2)
const OFFLINE = argv.includes('--offline')
const PUBLISH = argv.includes('--publish')
const FILES_ARG = argv.flatMap((a, i) => (argv[i - 1] === '--file' ? [resolve(a)] : []))

/** Spec 002 §6–7 + audit §4: wording that must not appear. Mirrors docs/science-pack/05-banned-wording.md (“auto”). */
const BANNED: [RegExp, string][] = [
  [/\bmeasures? (your )?vagal tone\b|\bmeasure of vagal tone\b/i, 'HRV does not measure vagal tone directly — use {{fact:claim.vagalTone}}'],
  [/\b(trains?|training|raises?|raising|increases?|increasing|improves?|improving|boosts?|boosting|strengthens?|enhances?|tones?) (your |the )?vagal tone\b/i, 'vagal tone cannot be measured or changed directly — use {{fact:claim.vagalTone}}'],
  [/\b(stimulates?|stimulating|activates?|activating) (the |your )?vag(us|al)\b/i, 'use {{fact:claim.slowExhale}} instead of “stimulates the vagus”'],
  [/\bdirectly (measures?|reflects?) (the )?parasympathetic\b/i, 'HRV does not directly measure parasympathetic activity'],
  [/LF\s*\/\s*HF\b[^.]{0,60}\b(balance|sympathetic)/i, 'LF/HF is not sympathovagal balance'],
  [/\bhigher HRV is always better\b/i, 'not always true'],
  [/\blow HRV means (you are |you’re )?(stress|unwell|sick)/i, 'use {{fact:claim.hrvNotStress}}'],
  [/\b(wearable|watch|ring) (measured|measures) (your )?(autonomic|nervous system)/i, 'a wearable estimates HRV from the pulse signal'],
  [/\breset (your )?nervous system\b|\bhack (your )?biology\b|\brewire (your )?brain\b/i, 'banned phrase'],
  [/\b(cure|cures|curing|treats? (anxiety|depression|insomnia))\b/i, 'no treatment/cure claims'],
  [/\b(clinically|scientifically) proven\b/i, 'name the study type and evidence class instead'],
  [/\b(guaranteed|always works|instantly calms?)\b/i, 'no guarantees'],
  [/\bONDA (diagnoses|detects (a )?disease|replaces (your )?doctor)/i, 'ONDA does not diagnose'],
  [/\bRecovery HRV\b[^.]{0,40}\bRMSSD\b|\bRMSSD\b[^.]{0,40}\bRecovery HRV\b/i, 'Apple does not officially state Recovery HRV = RMSSD (owner rule 2026-10-04)'],
]

const errors: string[] = []
const pending: string[] = []
const warnings: string[] = []
const mythReview: string[] = []
const err = (file: string, msg: string) => errors.push(`${file}: ${msg}`)
const pend = (file: string, msg: string) => pending.push(`${file}: ${msg}`)
const warn = (file: string, msg: string) => warnings.push(`${file}: ${msg}`)

async function sourceExists(src: { doi?: string; pmid?: string | number }): Promise<string | null> {
  if (OFFLINE) return null
  try {
    if (src.doi) {
      const r = await fetch(`https://api.crossref.org/works/${encodeURIComponent(src.doi)}`, { headers: { 'user-agent': 'onda-life science check (mailto:info@onda-life.com)' } })
      if (r.status === 404) return `DOI not found in Crossref: ${src.doi}`
      if (!r.ok) return null // network trouble ≠ fabricated source; re-run
    }
    if (src.pmid) {
      const r = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${src.pmid}`)
      const j: any = r.ok ? await r.json() : null
      if (j && (!j.result || !j.result[String(src.pmid)] || j.result[String(src.pmid)].error)) return `PMID not found in PubMed: ${src.pmid}`
    }
  } catch { return null }
  return null
}

/** null = opens; string = error; 'network' = could not reach (warning, not error). */
async function urlOpens(url: string): Promise<string | null> {
  if (OFFLINE) return null
  const ua = { 'user-agent': 'Mozilla/5.0 (onda-life science check; info@onda-life.com)' }
  try {
    let r = await fetch(url, { method: 'HEAD', redirect: 'follow', headers: ua })
    if (r.status === 405 || r.status === 403) r = await fetch(url, { method: 'GET', redirect: 'follow', headers: ua })
    if (r.status >= 400) return `URL returns HTTP ${r.status}: ${url}`
    return null
  } catch { return 'network' }
}

function stripAllowed(text: string): string {
  return text
    .replace(/\{\{(fact|proposed):[^}]+\}\}/g, ' ')
    .replace(/\[S\d+(?:\s*,\s*S\d+)*\]/g, ' ')
    .replace(/\([A-Z][A-Za-z’'\- ]+(?: et al\.)?,? (19|20)\d{2}[a-z]?\)/g, ' ') // (Author 2021)
    .replace(/\b[A-Z][A-Za-z’'\-]+(?: et al\.)? \((19|20)\d{2}\)/g, ' ') // Author (2021)
    .replace(/\]\([^)]*\)/g, ']') // link targets
    .replace(/\b(aged?|at ages?|ages?) \d{2}(?:[–-]\d{2}|\+)/gi, ' ') // age bands are labels, not data
    .replace(/^#{1,6} .*$/gm, (h) => h.replace(/\b(19|20)\d{2}\b/g, ' '))
}

const routeExists = {
  glossary: new Set(glossaryTerms.map((t) => t.slug)),
  articles: new Set(articles.map((a) => a.slug)),
}

function listFiles(): string[] {
  if (FILES_ARG.length) return FILES_ARG
  if (!existsSync(DIR)) return []
  const files: string[] = []
  for (const k of readdirSync(DIR)) {
    const p = join(DIR, k)
    if (statSync(p).isDirectory()) for (const f of readdirSync(p)) if (f.endsWith('.md')) files.push(join(p, f))
  }
  return files
}

async function main() {
  const files = listFiles()
  if (!files.length) { console.log('[science] no content/science pages yet'); return }
  // Existing science pages = everything in content/science plus the files under check.
  const repoFiles = existsSync(DIR) ? readdirSync(DIR).flatMap((k) => (statSync(join(DIR, k)).isDirectory() ? readdirSync(join(DIR, k)).filter((f) => f.endsWith('.md')).map((f) => `${k}/${basename(f, '.md')}`) : [])) : []
  const slugs = new Set<string>(repoFiles)

  const parsed: { file: string; rel: string; fm: any; body: string }[] = []
  for (const file of files) {
    const rel = relative(ROOT, file).replace(/\\/g, '/')
    const src = readFileSync(file, 'utf8')
    if (!src.startsWith('---')) { err(rel, 'missing --- frontmatter ---'); continue }
    try { const m = matter(src); parsed.push({ file, rel, fm: m.data, body: m.content }); slugs.add(`${m.data.kind}/${m.data.slug}`) } catch (e) { err(rel, (e as Error).message) }
  }

  for (const { file, rel, fm, body } of parsed) {
    // 1. frontmatter
    const slug = basename(file, '.md')
    const inRepo = !FILES_ARG.length || resolve(file).startsWith(resolve(DIR))
    const kind = inRepo ? basename(dirname(file)) : fm.kind
    if (!KINDS.includes(kind)) err(rel, `kind must be one of ${KINDS.join(', ')}`)
    if (fm.kind !== kind) err(rel, `kind "${fm.kind}" must equal folder "${kind}"`)
    if (fm.slug !== slug) err(rel, `slug "${fm.slug}" must equal file name "${slug}"`)
    if (!/^[a-z0-9-]+$/.test(slug)) err(rel, 'slug: lowercase letters, digits, hyphens')
    for (const k of ['title', 'metaTitle', 'metaDescription', 'shortAnswer', 'keyPoints', 'editor', 'sources', 'evidenceMap']) if (fm[k] == null) err(rel, `missing ${k}`)
    if (fm.title?.length > 70) err(rel, `title ${fm.title.length} > 70`)
    if (fm.metaTitle?.length > 48) err(rel, `metaTitle ${fm.metaTitle.length} > 48 (the site adds “ | ONDA Life” and clamps titles above 60 characters)`)
    if (fm.metaDescription && (fm.metaDescription.length < 110 || fm.metaDescription.length > 155)) err(rel, `metaDescription ${fm.metaDescription.length} not in 110–155`)
    const words = String(fm.shortAnswer || '').trim().split(/\s+/).length
    if (words < 40 || words > 80) err(rel, `shortAnswer ${words} words, need 40–80`)
    if (!Array.isArray(fm.keyPoints) || fm.keyPoints.length < 3 || fm.keyPoints.length > 7) err(rel, 'keyPoints: 3–7 items')
    if (fm.editor !== 'Yakiv Bilenko') err(rel, 'editor must be "Yakiv Bilenko"')
    if (fm.reviewer != null && fm.reviewer !== 'Valentin Zhigulin') err(rel, 'reviewer must be null or "Valentin Zhigulin"')
    if (fm.reviewer != null && !fm.lastReviewed) err(rel, 'reviewer set without lastReviewed')
    if (!fm.imageAlt || String(fm.imageAlt).length < 40 || String(fm.imageAlt).length > 200) err(rel, 'imageAlt required: one plain sentence, 40–200 characters, describing what the image shows')
    if (!fm.imagePrompt || String(fm.imagePrompt).length < 80) err(rel, 'imagePrompt required (≥ 80 characters) in the light scientific style — see the image style guide')
    if (fm.image != null) {
      if (!/^\/images\/science\/[a-z0-9-]+\.(jpg|png|webp)$/.test(String(fm.image))) err(rel, 'image must be /images/science/<slug>.jpg|png|webp (set by Claude Code when the image file arrives)')
      else if (!existsSync(join(ROOT, 'public', String(fm.image)))) err(rel, `image file public${fm.image} does not exist`)
    } else pend(rel, 'no image yet — Yakiv supplies the file, Claude Code sets image')

    // 2. sources
    const ids = new Set<string>()
    const official = new Set<string>()
    const guidelineSrc = new Set<string>()
    for (const s of fm.sources || []) {
      if (!/^S\d+$/.test(s.id) || ids.has(s.id)) err(rel, `source id "${s.id}" must be unique S1, S2…`)
      ids.add(s.id)
      if (!SOURCE_TYPES.includes(s.type)) { err(rel, `${s.id}: type must be one of ${SOURCE_TYPES.join(', ')}`); continue }
      if (URL_TYPES.includes(s.type)) {
        official.add(s.id)
        if (!s.url || !/^https:\/\//.test(s.url)) { err(rel, `${s.id}: type ${s.type} needs an https URL`); continue }
        const r = await urlOpens(s.url)
        if (r === 'network') warn(rel, `${s.id}: could not reach ${s.url} — re-run online`)
        else if (r) err(rel, `${s.id}: ${r}`)
      } else {
        if (s.type === 'guideline') guidelineSrc.add(s.id)
        if (!s.doi && !s.pmid) { err(rel, `${s.id}: DOI or PMID required (only types official / product-documentation may use a URL instead)`); continue }
        const miss = await sourceExists(s)
        if (miss) err(rel, `${s.id}: ${miss}`)
      }
    }

    // 3. evidence map + inline citations
    for (const row of fm.evidenceMap || []) {
      const label = `evidenceMap “${String(row.claim).slice(0, 50)}…”`
      if (!CLASSES.includes(row.class)) err(rel, `${label}: class "${row.class}" must be one of ${CLASSES.join(', ')}`)
      if (!Array.isArray(row.sources) || !row.sources.length) err(rel, `${label}: needs sources`)
      for (const s of row.sources || []) if (!ids.has(s)) err(rel, `${label}: cites unknown ${s}`)
      if (!row.limitation) err(rel, `${label}: needs a limitation`)
      if (!QUOTE_GRANDFATHERED.has(`${fm.kind}/${fm.slug}`) && (!row.quote || String(row.quote).trim().length < 15)) err(rel, `${label}: needs quote — a short exact quotation from the cited source that states this claim`)
      if (row.claimType != null && !CLAIM_TYPES.includes(row.claimType)) err(rel, `${label}: claimType must be one of ${CLAIM_TYPES.join(', ')}`)
      const usesOfficial = (row.sources || []).some((s: string) => official.has(s))
      if (usesOfficial) {
        if (!OFFICIAL_CLAIM_TYPES.includes(row.claimType)) err(rel, `${label}: an official / product-documentation source may support only claimType device or regulatory (got ${row.claimType ?? 'none'})`)
        const m = String(row.claim).match(EFFICACY_WORDS)
        if (m) err(rel, `${label}: official / product-documentation sources cannot support health/efficacy claims (“${m[0]}”)`)
      }
      if (row.class === 'guideline' && !(row.sources || []).some((s: string) => guidelineSrc.has(s))) err(rel, `${label}: class guideline needs a source of type guideline`)
    }
    for (const m of body.matchAll(/\[(S\d+(?:\s*,\s*S\d+)*)\]/g)) for (const s of m[1].split(/\s*,\s*/)) if (!ids.has(s)) err(rel, `body cites unknown ${s}`)

    // 4–5. numbers, facts, proposals
    const proposals = new Map<string, any>()
    for (const p of fm.proposals || []) {
      const label = `proposal ${p.id ?? '?'}`
      if (!/^P\d+$/.test(p.id ?? '') || proposals.has(p.id)) { err(rel, `${label}: id must be unique P1, P2…`); continue }
      proposals.set(p.id, p)
      if (!['fact', 'source'].includes(p.kind)) err(rel, `${label}: kind must be fact or source`)
      if (p.kind === 'fact' && (!p.value || !p.scope)) err(rel, `${label}: a fact proposal needs value and scope`)
      if (!p.doi && !p.pmid && !p.url) err(rel, `${label}: needs a DOI, PMID or (official only) URL`)
      if (!p.quote && !p.location) err(rel, `${label}: needs the exact quote or the location in the source (table, page, section)`)
      if (p.doi || p.pmid) { const miss = await sourceExists(p); if (miss) err(rel, `${label}: ${miss}`) }
      pend(rel, `${label} (${p.kind}${p.value ? `: ${p.value}` : ''}) awaits Yakiv’s approval`)
    }
    for (const m of body.matchAll(/\{\{fact:([^}]+)\}\}/g)) {
      const id = m[1]
      if (/^NEW:/i.test(id)) { err(rel, `{{fact:NEW: …}} is retired — declare a proposal and write {{proposed:P1}}`); continue }
      const f = FACTS[id]
      if (!f) err(rel, `unknown fact ${id}`)
      else if (f.status !== 'approved') pend(rel, `fact ${id} is proposed, not approved yet`)
    }
    // Fact framing: don't repeat what the fact already says (“the definition is {{fact:x.definition}}” → “…definition is RMSSD — the root…”).
    for (const m of body.matchAll(/\{\{fact:([a-zA-Z0-9.\-]+)\}\}/g)) {
      const f = FACTS[m[1]]
      if (!f) continue
      const before = body.slice(Math.max(0, m.index! - 120), m.index!).split(/[.!?\n]\s/).pop() ?? ''
      const term = f.display.match(/^(\S+) — /)?.[1]
      if (term && before.includes(term)) err(rel, `{{fact:${m[1]}}} starts with “${term} —”, and the sentence already names ${term}: “…${before.trim().slice(-50)}” — rebuild the sentence so the term appears once`)
      else if ((() => { const last = f.display.match(/([A-Za-z]{4,})\W*$/)?.[1]; const after = body.slice(m.index! + m[0].length, m.index! + m[0].length + 40); return !!last && new RegExp(`^[^.!?]{0,25}\\b${last}\\b`, 'i').test(after) })()) err(rel, `{{fact:${m[1]}}} ends with “${f.display.split(' ').pop()}”, and the next words repeat it (“…${body.slice(m.index! + m[0].length, m.index! + m[0].length + 30)}”) — rebuild the sentence`)
      else if (/\b(definition (is|of [^,]+ is)|defined as|stands for|means)\s*$/i.test(before)) err(rel, `{{fact:${m[1]}}} is framed by “${before.trim().slice(-30)}”, which repeats what the fact itself says — let the fact carry the sentence`)
    }
    for (const m of body.matchAll(/\{\{proposed:([^}]+)\}\}/g)) if (!proposals.has(m[1])) err(rel, `{{proposed:${m[1]}}} has no matching entry in proposals`)
    const stray = [...stripAllowed(body).matchAll(/[^\n]{0,30}\d[^\n]{0,30}/g)].map((x) => x[0].trim())
    for (const s of stray) err(rel, `number outside {{fact:}} / {{proposed:}}: “${s}”`)
    const fmText = [fm.title, fm.metaTitle, fm.metaDescription, fm.shortAnswer, ...(fm.keyPoints || [])].join(' ')
    if (/\d/.test(String(fmText).replace(/\{\{(fact|proposed):[^}]+\}\}/g, ' '))) err(rel, 'digits in title/meta/shortAnswer/keyPoints — write numbers in words there')

    // 6. banned wording. A paragraph that starts with <!-- myth-debunk --> states a banned claim only to refute it: it is
    // exempt from the banned list, and every such paragraph is listed for the owner's manual review (use rarely).
    const MYTH = /<!--\s*myth-debunk\s*-->/
    const paras = body.split(/\n\s*\n/)
    for (const p of paras.filter((x) => MYTH.test(x))) mythReview.push(`${rel}: ${p.replace(MYTH, '').trim().slice(0, 160)}…`)
    const all = `${fmText}\n${paras.filter((x) => !MYTH.test(x)).join('\n\n')}`
    for (const [re, why] of BANNED) { const m = all.match(re); if (m) err(rel, `banned wording “${m[0]}” — ${why}`) }

    // 7. links
    for (const g of fm.related?.glossary || []) if (!routeExists.glossary.has(g)) err(rel, `related.glossary "${g}" does not exist`)
    for (const a of fm.related?.articles || []) if (!routeExists.articles.has(a)) err(rel, `related.articles "${a}" does not exist`)
    for (const s of fm.related?.science || []) {
      if (!String(s).includes('/')) err(rel, `related.science "${s}" needs the section: <kind>/<slug>, e.g. concepts/${s}`)
      else if (!slugs.has(s)) err(rel, `related.science "${s}" does not exist yet — put it in relatedPlanned`)
    }
    if (fm.relatedPlanned != null && !Array.isArray(fm.relatedPlanned)) err(rel, 'relatedPlanned must be a flat list of <kind>/<slug> (e.g. [concepts/sdnn]), not an object')
    for (const s of Array.isArray(fm.relatedPlanned) ? fm.relatedPlanned : []) {
      const [k, sl, extra] = String(s).split('/')
      if (!KINDS.includes(k) || !/^[a-z0-9-]+$/.test(sl ?? '') || extra) err(rel, `relatedPlanned "${s}" must be <kind>/<slug> of a science page`)
      else if (slugs.has(s)) warn(rel, `relatedPlanned "${s}" now exists — it is shown automatically; you may move it to related.science`)
    }
    for (const m of body.matchAll(/\]\((\/[^)\s#]+)/g)) {
      const p = m[1].split('/').filter(Boolean)
      if (p[0] === 'articles' && p[1] && !routeExists.articles.has(p[1])) err(rel, `link to missing article ${m[1]}`)
      if (p[0] === 'glossary' && p[1] && !routeExists.glossary.has(p[1])) err(rel, `link to missing glossary term ${m[1]}`)
      if (p[0] === 'science' && p[2] && !slugs.has(`${p[1]}/${p[2]}`)) err(rel, `inline link to unwritten science page ${m[1]} — list it in relatedPlanned instead`)
    }
  }

  if (mythReview.length) console.log(`[science] MYTH-DEBUNK — ${mythReview.length} paragraph(s) exempt from the banned list, review by hand:\n  ` + mythReview.join('\n  '))
  if (warnings.length) console.log(`[science] ${warnings.length} warning(s):\n  ` + warnings.join('\n  '))
  if (pending.length) console.log(`[science] PENDING — ${pending.length} item(s) need Yakiv’s approval before publishing:\n  ` + pending.join('\n  '))
  if (errors.length) { console.error(`[science] ${errors.length} problem(s):\n  ` + errors.join('\n  ')); return }
  if (PUBLISH && pending.length) { console.error('[science] NOT PUBLISHABLE — pending items above'); return }
  console.log(`[science] OK — ${parsed.length} page(s) checked${OFFLINE ? ' (offline: sources and URLs not looked up)' : ''}${pending.length ? ' — draft OK, not publishable yet' : ''}`)
}

main().then(() => process.exit(errors.length || (PUBLISH && pending.length) ? 1 : 0))
