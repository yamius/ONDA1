/**
 * Task 089 — audit (and one-off fix) of hand-typed scores in review / duel / round-up text.
 * Scans EN sources (src/data/reviews/**), public/locales/<lang>/reviews.json and the /mcp export
 * (chatgpt-app/data/reviews.json); maps each textual score to its product (and criterion) via the
 * hand-reviewed INTENT table and compares it with the computed score.
 *   tsx scripts/audit-review-score-text.ts [--md out.md] [--fix literal|placeholder]
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { ALL_REVIEWS } from '../src/data/reviews'
import { findHandTypedScores, formatScore } from '../src/data/reviews/score-text'

/** page → hand-typed value → target ("slug" = overall, "slug.criterion"). Reviewed by hand from the EN text;
 *  translations carry the same numbers. A value not listed here is not a score (power level, cap rule …). */
const INTENT: Record<string, Record<string, string>> = {
  'oura-ring-4': { '7.9': 'oura-ring-4' },
  'withings-scanwatch': { '7.4': 'withings-scanwatch' },
  'ultrahuman-ring-pro': { '7.9': 'ultrahuman-ring-pro' },
  'ringconn-gen-3': { '7.6': 'ringconn-gen-3' },
  'ultrahuman-ring-air': { '5.5': 'ultrahuman-ring-air.wearability', '7.3': 'ultrahuman-ring-air' },
  'fitbit-charge-6': { '6.8': 'fitbit-charge-6' },
  'luna-ring': { '6.7': 'luna-ring' },
  'amazfit-helio-ring': { '6.8': 'amazfit-helio-ring' },
  'circular-ring-2': { '6.5': 'circular-ring-2' },
  'ultrahuman-m1': { '8.5': 'ultrahuman-m1.sensor-accuracy', '7.5': 'ultrahuman-m1' },
  'platinumled-biomax-600': { '8.2': 'platinumled-biomax-600' },
  'kineon-move-plus': { '7': 'kineon-move-plus', '8': 'kineon-move-plus.value' },
  'penguin-chillers': { '7.2': 'penguin-chillers' },
  'clearlight-sanctuary-2': { '7.4': 'clearlight-sanctuary-2' },
  'eight-sleep-pod-6': { '9.7': 'eight-sleep-pod-5.climate-range' },
  'ooler-sleep-system': { '7': 'ooler-sleep-system' },
  'slumber-cloud-dryline': { '5.5': 'slumber-cloud-dryline', '3.5': 'slumber-cloud-dryline.climate-range', '8.5': 'slumber-cloud-dryline.value', '10': 'slumber-cloud-dryline.subscription' },
  'healthy-wave-multi-wave': { '8.4': 'healthy-wave-multi-wave' },
  'resona-health-vibe': { '8.5': 'resona-health-vibe.value', '7': 'resona-health-vibe' },
  'inhale-by-aero-health': { '9': 'inhale-by-aero-health.biofeedback', '6.7': 'inhale-by-aero-health', '6': 'inhale-by-aero-health.value' },
  'prana-breath': { '6.3': 'prana-breath', '8': 'prana-breath.value' },
  'breathe-to-relax': { '7': 'breathe-to-relax.evidence-grounding', '5.9': 'breathe-to-relax', '9.5': 'breathe-to-relax.value' },
  // duels: "Both score X" on an axis = the shared criterion score (equality checked in check-review-scores)
  'breathwrk-vs-othership': { '7.5': 'breathwrk.technique-coverage' },
  'breathwrk-vs-soma-breath': { '8': 'breathwrk.session-library', '7.5': 'breathwrk.technique-coverage', '6.5': 'breathwrk.evidence-grounding' },
  'breathwrk-vs-othership-vs-wim-hof-method-app': { '7.5': 'breathwrk.technique-coverage' },
}
const R = new Map(ALL_REVIEWS.map((r) => [r.slug, r]))
function computedFor(target: string): number {
  const [slug, crit] = target.split('.')
  const r = R.get(slug)!
  return crit ? r.scores.find((s) => s.criterionId === crit)!.score : r.overallScore
}
type Row = { page: string; lang: string; text: string; target: string; computed: string; status: string; ctx: string }
const rows: Row[] = []
const args = process.argv.slice(2)
const fix = args.includes('--fix') ? args[args.indexOf('--fix') + 1] : ''
const md = args.includes('--md') ? args[args.indexOf('--md') + 1] : ''

/** Scan + optionally rewrite one string. */
function handle(page: string, lang: string, s: string): string {
  const L = lang === 'mcp' ? 'en' : lang
  const hits = findHandTypedScores(s, L)
  let out = s
  for (const h of [...hits].reverse()) {
    const target = INTENT[page]?.[String(h.value)]
    const ctx = s.slice(Math.max(0, h.start - 60), h.end + 15).replace(/\s+/g, ' ')
    if (!target) {
      rows.push({ page, lang, text: h.text, target: '—', computed: '—', status: 'AMBIGUOUS (not a score → {{literal:}})', ctx })
      if (fix === 'placeholder') out = out.slice(0, h.start) + `{{literal:${s.slice(h.start, h.end)}}}` + out.slice(h.end)
      continue
    }
    const c = computedFor(target)
    rows.push({ page, lang, text: h.text, target, computed: formatScore(c, L), status: c === h.value ? 'OK' : 'MISMATCH', ctx })
    const rep = fix === 'literal' ? formatScore(c, L) : fix === 'placeholder' ? `{{score:${target}}}` : null
    if (rep) out = out.slice(0, h.numStart) + rep + out.slice(h.numStart + h.numText.length)
  }
  return out
}
const SKIP = /^(url|link|slug|reviewSlug|productASlug|productBSlug|productCSlug|publishOn|asOf)$/
function walk(page: string, lang: string, v: any, key = ''): any {
  if (typeof v === 'string') return SKIP.test(key) ? v : handle(page, lang, v)
  if (Array.isArray(v)) return v.map((x) => walk(page, lang, x, key))
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(page, lang, x, k)]))
  return v
}
const ROOT = join(import.meta.dirname, '..')
// EN sources: whole data-file text (code carries no score patterns)
const DATA = join(ROOT, 'src', 'data', 'reviews')
for (const dir of [DATA, join(DATA, 'head-to-head')]) {
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.ts'))) {
    const p = join(dir, f)
    const src = readFileSync(p, 'utf8')
    const slug = src.match(/^\s*slug:\s*'([^']+)'/m)?.[1]
    if (!slug) continue
    const next = handle(slug, 'en', src)
    if (fix && next !== src) writeFileSync(p, next)
  }
}
const LOC = join(ROOT, 'public', 'locales')
for (const lang of readdirSync(LOC).filter((l) => l !== 'en')) {
  const p = join(LOC, lang, 'reviews.json')
  const j = JSON.parse(readFileSync(p, 'utf8'))
  let changed = false
  for (const top of ['bodies', 'comparisons', 'headToHeads']) {
    for (const [slug, b] of Object.entries(j[top] ?? {})) {
      const nb = walk(slug, lang, b)
      if (JSON.stringify(nb) !== JSON.stringify(b)) { j[top][slug] = nb; changed = true }
    }
  }
  if (fix && changed) writeFileSync(p, JSON.stringify(j, null, 2) + '\n')
}
if (!fix) {
  const ex = JSON.parse(readFileSync(join(ROOT, '..', 'chatgpt-app', 'data', 'reviews.json'), 'utf8'))
  for (const k of ['reviews', 'headToHeads', 'roundups']) for (const e of ex[k] ?? []) walk(e.slug, 'mcp', e)
}
const n = (st: string) => rows.filter((r) => r.status.startsWith(st)).length
console.log(`[score-audit] ${rows.length} textual scores: ${n('OK')} OK, ${n('MISMATCH')} mismatch, ${n('AMBIGUOUS')} ambiguous${fix ? ` (fixed: ${fix})` : ''}`)
if (md) {
  const esc = (x: string) => x.replace(/\|/g, '\\|')
  const order = (r: Row) => (r.status === 'MISMATCH' ? 0 : r.status.startsWith('AMBIG') ? 1 : 2)
  const sorted = [...rows].sort((a, b) => order(a) - order(b) || a.page.localeCompare(b.page) || a.lang.localeCompare(b.lang))
  writeFileSync(
    md,
    `# 089 — score audit (state before the fix)\n\nComputed = roundHalfUp1(Σ score×weight + editorialAdjustment). lang "mcp" = chatgpt-app/data/reviews.json.\n\n` +
      `${rows.length} textual scores: ${n('OK')} OK, **${n('MISMATCH')} mismatch**, ${n('AMBIGUOUS')} ambiguous (look like scores but are not — kept as {{literal:}}).\n\n` +
      `| page | lang | text | refers to | computed | status | context |\n|---|---|---|---|---|---|---|\n` +
      sorted.map((r) => `| ${r.page} | ${r.lang} | ${esc(r.text)} | ${r.target} | ${r.computed} | ${r.status} | …${esc(r.ctx)}… |`).join('\n') +
      '\n',
  )
}
