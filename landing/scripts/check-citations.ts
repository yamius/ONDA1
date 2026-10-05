/**
 * Site-wide citation check (PMID / DOI / PMCID).
 *
 * Why: an audit (2026-10) found AI-era citations whose ids pointed at unrelated
 * papers (a trypanosome study cited as Thayer 2009, a lupus ELISA cited as
 * Craig 2002, hair-cell Ca2+ cited as Lehrer & Gevirtz). This check makes that
 * class of error fail the build.
 *
 * Modes
 *   tsx scripts/check-citations.ts            offline (build). Every id found in the
 *                                             content must be in data/citation-registry.json
 *                                             and not marked invalid; labels next to an id
 *                                             (author surname / year) must agree with it.
 *   tsx scripts/check-citations.ts --refresh  online. Fetches ids missing from the registry
 *                                             (PubMed esummary, Crossref / doi.org, PMC idconv),
 *                                             writes the registry, then runs the offline check.
 *                                             Fails on ids that do not exist.
 *   --refresh --all                           re-verifies every id in the registry.
 *   --root <dir>                              scan another tree (used to test the check on a
 *                                             scratch copy). --registry / --allowlist override paths.
 *
 * Label rule (deliberately conservative, to avoid false positives): a label is an
 * "Author … YEAR" / "Author et al. (YEAR)" / "Author & Author YEAR" string inside the
 * same reference (a `label:` / `cite:` / `authors:`+`year:` record, a markdown link
 * text, or the prose just before the id). It fails only when the nearest label's
 * surname is not among the paper's authors, or its year is off by more than one.
 * Justified exceptions go in data/citation-allowlist.json: [{ "id", "file"?, "reason" }].
 *
 * The science section's own online check (check-science-content.ts) stays as is.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

type Kind = 'pmid' | 'doi' | 'pmcid'
interface RegEntry {
  kind: Kind
  valid: boolean
  title?: string
  firstAuthor?: string
  authors?: string[]
  year?: number
  /** other publication year (print vs online) */
  yearAlt?: number
  journal?: string
  doi?: string
  pmid?: string
  source?: string
  reason?: string
  verifiedAt: string
}
interface Registry { _comment?: string; entries: Record<string, RegEntry> }
interface AllowItem { id: string; file?: string; reason: string }
interface Occ { kind: Kind; key: string; raw: string; file: string; line: number; start: number; end: number }

const argv = process.argv.slice(2)
const flag = (n: string) => argv.includes(n)
const opt = (n: string) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : undefined }
const LANDING = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ROOT = path.resolve(opt('--root') ?? LANDING)
const REGISTRY = path.resolve(opt('--registry') ?? path.join(LANDING, 'data/citation-registry.json'))
const ALLOWLIST = path.resolve(opt('--allowlist') ?? path.join(LANDING, 'data/citation-allowlist.json'))
const REFRESH = flag('--refresh')
const REVERIFY_ALL = flag('--all')

// ---------------------------------------------------------------- scanning
const SCAN: { dir: string; exts: string[] }[] = [
  { dir: 'src/data', exts: ['.ts', '.tsx'] },
  { dir: 'src/pages', exts: ['.ts', '.tsx'] },
  { dir: 'public/locales', exts: ['.json'] },
  { dir: 'content/science', exts: ['.md'] },
  { dir: 'content/science-i18n', exts: ['.md'] },
]
const SKIP_FILE = /\.generated\.ts$/

function walk(dir: string, exts: string[], out: string[]) {
  if (!fs.existsSync(dir)) return
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, exts, out)
    else if (exts.some((x) => e.name.endsWith(x)) && !SKIP_FILE.test(e.name)) out.push(p)
  }
}

const RE_PMID = /(?:pubmed\.ncbi\.nlm\.nih\.gov\/|ncbi\.nlm\.nih\.gov\/pubmed\/|\bPMID:?\s*|["']?pmid["']?\s*:\s*["']?)(\d{4,9})\b/gi
const RE_PMC = /\b(PMC\d{4,9})\b/g
// DOI: stop at whitespace, quotes, brackets, backticks, commas/semicolons and CJK punctuation/letters.
const RE_DOI = /\b(10\.\d{4,9}\/[^\s"'<>()]*\(\d{4}\)\d{3}<[^>\s"']+>[\w.;]+|10\.\d{4,9}\/[^\s"'<>\]`,;\\，。）（、；：Ѐ-ӿ　-鿿가-힯]+)/g

function cleanDoi(raw: string): string {
  let d = raw
  // trailing ")" that closes a surrounding parenthesis, not part of the DOI
  const bal = () => (d.match(/\(/g)?.length ?? 0) - (d.match(/\)/g)?.length ?? 0)
  for (let prev = ''; prev !== d;) {
    prev = d
    while (d.endsWith(')') && bal() < 0) d = d.slice(0, -1)
    d = d.replace(/[.*_:]+$/, '')
  }
  d = d.replace(/\/(full|abstract|pdf|epdf|meta|fulltext|html)$/i, '')
  d = d.replace(/[.]+$/, '')
  try { d = decodeURIComponent(d) } catch { /* keep */ }
  return d
}

function scanFile(abs: string): { occ: Occ[]; text: string } {
  const text = fs.readFileSync(abs, 'utf8')
  const rel = path.relative(ROOT, abs).split(path.sep).join('/')
  const occ: Occ[] = []
  const lineOf = (i: number) => text.slice(0, i).split('\n').length
  for (const m of text.matchAll(RE_PMID)) {
    const s = m.index! + m[0].length - m[1].length
    occ.push({ kind: 'pmid', key: `pmid:${m[1]}`, raw: m[1], file: rel, line: lineOf(s), start: s, end: s + m[1].length })
  }
  for (const m of text.matchAll(RE_PMC)) {
    occ.push({ kind: 'pmcid', key: `pmcid:${m[1].toUpperCase()}`, raw: m[1], file: rel, line: lineOf(m.index!), start: m.index!, end: m.index! + m[1].length })
  }
  for (const m of text.matchAll(RE_DOI)) {
    const d = cleanDoi(m[1])
    if (!/^10\.\d{4,9}\/\S+/.test(d)) continue
    occ.push({ kind: 'doi', key: `doi:${d.toLowerCase()}`, raw: d, file: rel, line: lineOf(m.index!), start: m.index!, end: m.index! + m[1].length })
  }
  return { occ, text }
}

// ---------------------------------------------------------------- fetching
const UA = 'onda-landing-citation-check/1.0'
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
async function getJson(url: string, headers: Record<string, string> = {}): Promise<{ status: number; json: any }> {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA, ...headers }, redirect: 'follow' })
      if (r.status === 429 || r.status >= 500) { await sleep(1500 * (attempt + 1)); continue }
      const t = await r.text()
      try { return { status: r.status, json: JSON.parse(t) } } catch { return { status: r.status, json: null } }
    } catch { await sleep(1500 * (attempt + 1)) }
  }
  return { status: 0, json: null }
}
const now = () => new Date().toISOString().slice(0, 10)
const yearOf = (s?: string | number | null) => { const m = String(s ?? '').match(/(19|20)\d{2}/); return m ? Number(m[0]) : undefined }
const surnameOfPubmed = (name: string) => name.replace(/\s+[A-Z]{1,4}$/, '').trim()

async function fetchPmids(ids: string[]): Promise<Record<string, RegEntry | null>> {
  const out: Record<string, RegEntry | null> = {}
  for (let i = 0; i < ids.length; i += 150) {
    const chunk = ids.slice(i, i + 150)
    const { json } = await getJson(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${chunk.join(',')}`)
    if (!json?.result) throw new Error('PubMed esummary failed — network? Try again later.')
    for (const id of chunk) {
      const r = json.result[id]
      if (!r || r.error || !r.title) { out[id] = null; continue }
      const authors = (r.authors ?? []).filter((a: any) => a.authtype === 'Author').map((a: any) => surnameOfPubmed(a.name))
      out[id] = {
        kind: 'pmid', valid: true, title: r.title, firstAuthor: authors[0] ?? r.sortfirstauthor, authors,
        year: yearOf(r.pubdate) ?? yearOf(r.epubdate), ...(yearOf(r.epubdate) && yearOf(r.epubdate) !== yearOf(r.pubdate) ? { yearAlt: yearOf(r.epubdate) } : {}), journal: r.source,
        doi: (r.articleids ?? []).find((a: any) => a.idtype === 'doi')?.value, source: 'pubmed', verifiedAt: now(),
      }
    }
    await sleep(400)
  }
  return out
}

function fromCsl(m: any, source: string): RegEntry {
  const authors = (m.author ?? []).map((a: any) => a.family ?? a.literal ?? a.name).filter(Boolean)
  const dp = m.issued?.['date-parts']?.[0]?.[0] ?? m['published-print']?.['date-parts']?.[0]?.[0] ?? m['published-online']?.['date-parts']?.[0]?.[0]
  const title = Array.isArray(m.title) ? m.title[0] : m.title
  const journal = Array.isArray(m['container-title']) ? m['container-title'][0] : m['container-title']
  const yp = m['published-print']?.['date-parts']?.[0]?.[0] ?? m['journal-issue']?.['published-print']?.['date-parts']?.[0]?.[0]
  const yo = m['published-online']?.['date-parts']?.[0]?.[0]
  const alt = [yp, yo].map(Number).find((y) => y && y !== Number(dp))
  return { kind: 'doi', valid: true, title, firstAuthor: authors[0], authors, year: dp ? Number(dp) : undefined, ...(alt ? { yearAlt: alt } : {}), journal, source, verifiedAt: now() }
}

async function fetchDoi(doi: string): Promise<RegEntry | null> {
  const enc = doi.split('/').map(encodeURIComponent).join('/')
  const cr = await getJson(`https://api.crossref.org/works/${enc}`)
  if (cr.status === 200 && cr.json?.message) return fromCsl(cr.json.message, 'crossref')
  // Not Crossref (DataCite, mEDRA, JaLC …): ask doi.org via content negotiation.
  const dn = await getJson(`https://doi.org/${enc}`, { Accept: 'application/vnd.citationstyles.csl+json' })
  if (dn.status === 200 && dn.json) return fromCsl(dn.json, 'doi.org')
  if (cr.status === 404 && (dn.status === 404 || dn.status === 406 || dn.status === 0)) return null
  if (cr.status === 0 && dn.status === 0) throw new Error(`Network failure resolving DOI ${doi}`)
  return null
}

async function fetchPmc(pmcid: string): Promise<RegEntry | null> {
  const { json } = await getJson(`https://pmc.ncbi.nlm.nih.gov/tools/idconv/api/v1/articles/?ids=${pmcid}&format=json`)
  const rec = json?.records?.[0]
  if (!rec || rec.status === 'error' || !rec.pmid) {
    if (!json) throw new Error('PMC idconv failed — network?')
    return null
  }
  const p = (await fetchPmids([String(rec.pmid)]))[String(rec.pmid)]
  if (!p) return null
  return { ...p, kind: 'pmcid', pmid: String(rec.pmid), doi: rec.doi ?? p.doi, source: 'pmc-idconv+pubmed' }
}

// ---------------------------------------------------------------- label matching
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z]/g, '')
const NOT_SURNAMES = new Set(
  ('january february march april may june july august september october november december jan feb mar apr jun jul aug sep sept oct nov dec ' +
    'the in on since by from and or of for to at as an a its this that these those update updated published review reviews study studies trial ' +
    'version edition guideline guidelines report statement position meta cochrane who nih fda since until year years summer winter spring autumn fall ' +
    'checked asof live launched released founded copyright issue volume vol table figure fig part level step phase gen generation series model ' +
    'hrv rmssd sdnn ecg eeg ppg vo nasa iso ieee apple garmin oura whoop polar samsung fitbit google amazon ' +
    'surgery medicine neurosci neuroscience group society association committee force task journal physiology psychology psychiatry ' +
    'cardiology research science sciences health biol rev med lancet nature circulation sleep psychophysiology frontiers plos').split(/\s+/),
)
// Surname-first label: "Thayer et al. 2009", "Lehrer & Gevirtz (2014)", "Craig 2002", "Thayer JF … 2009" is NOT matched (too loose).
const SURNAME = "[A-Z][A-Za-z\\u00C0-\\u024F'’\\-]+(?:\\s(?:van|von|de|der|den|da|di|du|le|la)\\s[A-Z][A-Za-z\\u00C0-\\u024F'’\\-]+)?"
const RE_LABEL = new RegExp(
  `(?:^|[^A-Za-z\\u00C0-\\u024F])((?:van |von |de |der |den |da |di |du |le |la )*${SURNAME})(?:\\s+(?:et\\s+al\\.?|and\\s+colleagues|y\\s+col\\.?)|\\s*(?:&|and|und|y|et|e|i)\\s+${SURNAME}(?:\\s*(?:&|and)\\s+${SURNAME})?)?,?\\s*\\(?((?:19|20)\\d{2})[a-z]?\\b`,
  'g',
)
const RE_LABEL_JOURNAL = new RegExp(
  `(?:^|[(;]\\s*)(${SURNAME})(?:\\s+et\\s+al\\.?|\\s*(?:&|and)\\s+${SURNAME})?,\\s+[A-Z][^()\\[\\];\\n]{1,80}?\\(?((?:19|20)\\d{2})\\b`,
  'g',
)

interface Label { surname: string; year: number; text: string }
function labelsIn(s: string): Label[] {
  const out: Label[] = []
  for (const m of s.matchAll(RE_LABEL)) {
    const sur = m[1].trim()
    if (NOT_SURNAMES.has(norm(sur)) || norm(sur).length < 2 || /^[A-Z]{1,5}$/.test(sur)) continue
    // "Nat Rev Neurosci (2015)": a capitalised word right before means a journal / organisation name
    const prev = s.slice(0, m.index! + m[0].indexOf(m[1])).match(/([A-Za-zÀ-ɏ]+)[\s.]*$/)?.[1]
    if (prev && /^[A-Z]/.test(prev) && !NOT_SURNAMES.has(norm(prev))) continue
    out.push({ surname: sur, year: Number(m[2]), text: m[0].trim() })
  }
  // "Craig, Nat Rev Neurosci (2002)" / "Lehrer et al., Appl Psychophysiol Biofeedback 2000"
  for (const m of s.matchAll(RE_LABEL_JOURNAL)) {
    const sur = m[1].trim()
    if (NOT_SURNAMES.has(norm(sur)) || /^[A-Z]{1,5}$/.test(sur) || out.some((o) => o.surname === sur)) continue
    out.push({ surname: sur, year: Number(m[2]), text: m[0].trim() })
  }
  return out
}

/** Find the reference "record" around an occurrence and return its label candidates. */
function labelsFor(text: string, o: Occ): { labels: Label[]; authorsField?: string; yearField?: number } {
  // 1) markdown link text: [Craig 2002](https://…id…)
  const lineStart = text.lastIndexOf('\n', o.start) + 1
  const before = text.slice(Math.max(lineStart, o.start - 600), o.start)
  const md = before.match(/\[([^\]\n]{3,300})\]\([^)\s]*$/)
  if (md) return { labels: labelsIn(md[1]) }

  // 2) enclosing object / YAML list item (≤ 1500 chars back, same record)
  const back = text.slice(Math.max(0, o.start - 1500), o.start)
  const fwd = text.slice(o.end, o.end + 600)
  let recStart = -1
  let depth = 0
  for (let i = back.length - 1; i >= 0; i--) {
    const c = back[i]
    if (c === '}') depth++
    else if (c === '{') { if (depth === 0) { recStart = i; break } depth-- }
  }
  const yamlItem = back.lastIndexOf('\n  - id:') >= 0 && /\.md$/.test(o.file) ? back.lastIndexOf('\n  - id:') : -1
  let rec: string | undefined
  if (yamlItem >= 0 && (recStart < 0 || yamlItem > recStart)) {
    const endRel = fwd.search(/\n {2}- id:|\n[a-zA-Z]/)
    rec = back.slice(yamlItem) + text.slice(o.start, o.end) + (endRel >= 0 ? fwd.slice(0, endRel) : fwd)
  } else if (recStart >= 0) {
    const closeRel = (() => { let d = 0; for (let i = 0; i < fwd.length; i++) { if (fwd[i] === '{') d++; else if (fwd[i] === '}') { if (d === 0) return i; d-- } } return -1 })()
    if (closeRel >= 0) rec = back.slice(recStart) + text.slice(o.start, o.end) + fwd.slice(0, closeRel + 1)
  }
  if (rec && rec.length < 2500 && !/\{[^{}]*\{/.test(rec.slice(1))) {
    const authorsField = rec.match(/["']?authors["']?\s*:\s*["'`]([^"'`\n]+)["'`]/)?.[1]
    const yearField = Number(rec.match(/["']?year["']?\s*:\s*["']?((?:19|20)\d{2})/)?.[1]) || undefined
    const lab = rec.match(/["']?(?:label|cite)["']?\s*:\s*(["'`])((?:(?!\1).){2,400})\1/)?.[2]
    if (authorsField || lab) return { labels: lab ? labelsIn(lab) : [], authorsField, yearField }
    // TS line comment after a URL constant: `…/19463818/', // Thayer & Lane — HRV`
  }
  const comment = text.slice(o.end, text.indexOf('\n', o.end) >= 0 ? text.indexOf('\n', o.end) : undefined).match(/\/\/\s*(.+)$/)?.[1]
  if (comment) {
    const l = labelsIn(comment)
    if (l.length) return { labels: l }
    const sur = comment.match(/^([A-Z][A-Za-z'’\-]+)(?:\s*(?:&|and|\/)\s*[A-Z][A-Za-z'’\-]+)?\s+[—–-]/)
    if (sur) return { labels: [], authorsField: sur[1] }
  }
  // 3) prose: the same sentence/clause before the id (≤ 220 chars, same paragraph)
  const para = text.slice(Math.max(text.lastIndexOf('\n\n', o.start), o.start - 220), o.start)
  const clause = para.split(/(?<=[.!?])\s+(?=[A-Z])|;\s/).pop() ?? para
  const l = labelsIn(clause)
  return { labels: l.length ? [l[l.length - 1]] : [] }
}

const yearOk = (y: number, e: RegEntry) => [e.year, e.yearAlt].some((x) => x && Math.abs(y - x) <= 1)

function surnameMatches(sur: string, e: RegEntry): boolean {
  const n = norm(sur.replace(/^(van|von|de|der|den|da|di|du|le|la)\s+/i, ''))
  const names = [e.firstAuthor ?? '', ...(e.authors ?? [])].map(norm).filter(Boolean)
  if (!names.length) return true // corporate / no personal authors: cannot judge
  return names.some((a) => a === n || (n.length >= 4 && (a.includes(n) || n.includes(a) && a.length >= 4)))
}

// ---------------------------------------------------------------- main
function loadJson<T>(p: string, dflt: T): T { try { return JSON.parse(fs.readFileSync(p, 'utf8')) as T } catch { return dflt } }

async function main() {
  const files: string[] = []
  for (const s of SCAN) walk(path.join(ROOT, s.dir), s.exts, files)
  const texts = new Map<string, string>()
  const occs: Occ[] = []
  for (const f of files) { const { occ, text } = scanFile(f); if (occ.length) { texts.set(f, text); occs.push(...occ) } }

  const registry = loadJson<Registry>(REGISTRY, { entries: {} })
  const allow = loadJson<AllowItem[]>(ALLOWLIST, [])
  const allowed = (o: Occ) => allow.some((a) => a.id.toLowerCase() === o.key.split(':')[1].toLowerCase() && (!a.file || o.file.endsWith(a.file)))
  const keys = [...new Set(occs.map((o) => o.key))]

  if (REFRESH) {
    const todo = keys.filter((k) => REVERIFY_ALL || !registry.entries[k] || (registry.entries[k].valid && !registry.entries[k].title))
    // never re-fetch entries a human marked invalid (wrong-paper notes)
    const fetchable = todo.filter((k) => !(registry.entries[k] && !registry.entries[k].valid && registry.entries[k].source === 'manual'))
    console.log(`citations:refresh — ${keys.length} ids in content, fetching ${fetchable.length}`)
    const pm = fetchable.filter((k) => k.startsWith('pmid:')).map((k) => k.slice(5))
    const res = await fetchPmids(pm)
    for (const id of pm) registry.entries[`pmid:${id}`] = res[id] ?? { kind: 'pmid', valid: false, reason: 'PMID does not exist in PubMed', source: 'pubmed', verifiedAt: now() }
    let n = 0
    for (const k of fetchable.filter((k) => k.startsWith('doi:'))) {
      const doi = k.slice(4)
      const e = await fetchDoi(doi)
      registry.entries[k] = e ?? { kind: 'doi', valid: false, reason: 'DOI not registered (Crossref 404, doi.org 404)', source: 'crossref', verifiedAt: now() }
      if (++n % 25 === 0) console.log(`  … ${n} DOIs`)
      await sleep(120)
    }
    for (const k of fetchable.filter((k) => k.startsWith('pmcid:'))) {
      const e = await fetchPmc(k.slice(6))
      registry.entries[k] = e ?? { kind: 'pmcid', valid: false, reason: 'PMCID not found by PMC idconv', source: 'pmc-idconv', verifiedAt: now() }
      await sleep(400)
    }
    const sorted: Record<string, RegEntry> = {}
    const inContent = new Set(keys)
    // keep ids still cited + manual "never cite again" entries; drop stale fetched ones
    for (const k of Object.keys(registry.entries).sort()) if (inContent.has(k) || registry.entries[k].source === 'manual') sorted[k] = registry.entries[k]
    registry._comment = 'Citation registry for scripts/check-citations.ts. Filled by `npm run citations:refresh` from PubMed esummary, Crossref/doi.org and PMC idconv. Entries with source "manual" and valid:false are known wrong-paper ids (2026-10 audit) and must never be cited again.'
    registry.entries = sorted
    fs.mkdirSync(path.dirname(REGISTRY), { recursive: true })
    fs.writeFileSync(REGISTRY, JSON.stringify({ _comment: registry._comment, entries: registry.entries }, null, 1) + '\n')
  }

  const errors: string[] = []
  const missing = new Set<string>()
  let labelChecked = 0
  for (const o of occs) {
    if (allowed(o)) continue
    const e = registry.entries[o.key]
    const where = `${o.file}:${o.line}`
    if (!e) { missing.add(o.key); errors.push(`${where}  ${o.key} is not in the citation registry — run npm run citations:refresh`); continue }
    if (!e.valid) { errors.push(`${where}  ${o.key} is marked invalid: ${e.reason ?? 'does not exist'}`); continue }
    const { labels, authorsField, yearField } = labelsFor(texts.get(path.join(ROOT, o.file)) ?? texts.get(path.resolve(ROOT, o.file))!, o)
    const paper = `${e.firstAuthor ?? '?'} ${e.year ?? '?'}, "${(e.title ?? '').slice(0, 90)}"`
    if (authorsField) {
      labelChecked++
      const first = authorsField.split(/,|;| and | & /)[0].trim().replace(/\s+(et al\.?|[A-Z]{1,4}\.?)$/g, '').replace(/\s+[A-Z]{1,4}$/, '')
      if (first && /[A-Za-z]/.test(first) && !/^[A-Z]{2,}$/.test(first) && !NOT_SURNAMES.has(norm(first.split(/\s+/)[0])) && !surnameMatches(first, e)) {
        errors.push(`${where}  ${o.key}: authors "${authorsField}" but the id is ${paper}`)
        continue
      }
      if (yearField && e.year && !yearOk(yearField, e)) { errors.push(`${where}  ${o.key}: year ${yearField} but the id is ${paper}`); continue }
    }
    if (labels.length) {
      labelChecked++
      const ok = labels.some((l) => surnameMatches(l.surname, e) && (!e.year || yearOk(l.year, e)))
      if (!ok) {
        const l = labels[labels.length - 1]
        const why = surnameMatches(l.surname, e) ? `year ${l.year}` : `"${l.surname}" is not an author`
        errors.push(`${where}  ${o.key}: label "${l.text}" (${why}) but the id is ${paper}`)
      }
    }
  }

  console.log(`citations:check — ${occs.length} citations, ${keys.length} unique ids, ${labelChecked} labels compared, ${files.length} files scanned`)
  if (errors.length) {
    console.error(`\n✗ ${errors.length} citation problem(s):`)
    for (const e of [...new Set(errors)]) console.error('  ' + e)
    if (missing.size && !REFRESH) console.error(`\n${missing.size} id(s) missing from ${path.relative(process.cwd(), REGISTRY)} — run: npm run citations:refresh`)
    console.error('\nJustified exceptions: data/citation-allowlist.json [{ "id", "file"?, "reason" }]')
    process.exit(1)
  }
  console.log('✓ all citations resolve to registered papers and their labels agree')
}

main().catch((e) => { console.error(e); process.exit(1) })
