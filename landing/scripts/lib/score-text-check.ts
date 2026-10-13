/**
 * Task 089 build checks for scores in prose (used by check-review-scores.ts and export-chatgpt-data.ts).
 *  - sourceScoreTextErrors: no hand-typed score (X/10, "scores X", "X из 10", "X分", …) in any review,
 *    duel or round-up text, EN or locale — write {{score:<slug>}} / {{score:<slug>.<criterion>}}, or wrap a
 *    number that is not an ONDA score in {{literal:…}}. Every placeholder must name a known review/criterion.
 *    A duel note saying "both score {{score:a.crit}}" must be true for every product of the duel.
 *  - mcpExportScoreErrors: every string with a score in chatgpt-app/data/reviews.json must equal the
 *    resolved site text (catches a stale /mcp export).
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { ALL_REVIEWS, ALL_REVIEWS_RAW, ALL_COMPARISONS, ALL_COMPARISONS_RAW } from '../../src/data/reviews'
import { ALL_HEAD_TO_HEADS, ALL_HEAD_TO_HEADS_RAW } from '../../src/data/reviews/head-to-head'
import { findHandTypedScores, SCORE_TOKEN_RE } from '../../src/data/reviews/score-text'

const ROOT = join(import.meta.dirname, '..', '..')
const SKIP = /^(url|link|slug|reviewSlug|productASlug|productBSlug|productCSlug|publishOn|asOf|criterionId|id)$/
const R = new Map(ALL_REVIEWS.map((r) => [r.slug, r]))

function strings(v: unknown, key = '', out: [string, string][] = []): [string, string][] {
  if (typeof v === 'string') { if (!SKIP.test(key)) out.push([key, v]) }
  else if (Array.isArray(v)) v.forEach((x) => strings(x, key, out))
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) strings(x, k, out)
  return out
}

export function sourceScoreTextErrors(): string[] {
  const errors: string[] = []
  const scan = (where: string, lang: string, v: unknown) => {
    for (const [, s] of strings(v)) {
      for (const h of findHandTypedScores(s, lang)) errors.push(`${where}: hand-typed score "${h.text}" — use {{score:…}} (or {{literal:…}} if it is not an ONDA score)`)
      for (const m of s.matchAll(SCORE_TOKEN_RE)) {
        const r = R.get(m[1])
        if (!r || (m[2] && !r.scores.some((c) => c.criterionId === m[2]))) errors.push(`${where}: unknown placeholder ${m[0]}`)
      }
    }
  }
  for (const r of ALL_REVIEWS_RAW) scan(`review ${r.slug} [en]`, 'en', r)
  for (const c of ALL_COMPARISONS_RAW) scan(`round-up ${c.slug} [en]`, 'en', c)
  for (const h of ALL_HEAD_TO_HEADS_RAW) {
    scan(`duel ${h.slug} [en]`, 'en', h)
    const products = [h.productASlug, h.productBSlug, h.productCSlug].filter(Boolean) as string[]
    for (const [, s] of strings(h)) {
      if (!/\bboth\b/i.test(s)) continue
      for (const m of s.matchAll(SCORE_TOKEN_RE)) {
        if (!m[2]) continue
        const vals = products.map((p) => R.get(p)?.scores.find((c) => c.criterionId === m[2])?.score).filter((x) => x !== undefined)
        const named = vals.slice(0, 2) // "both" = the two products the sentence compares (A and B)
        if (new Set(named).size > 1) errors.push(`duel ${h.slug}: "both score ${m[0]}" but ${m[2]} differs (${named.join(' vs ')})`)
      }
    }
  }
  const LOC = join(ROOT, 'public', 'locales')
  for (const lang of readdirSync(LOC).filter((l) => l !== 'en')) {
    const j = JSON.parse(readFileSync(join(LOC, lang, 'reviews.json'), 'utf8'))
    for (const top of ['bodies', 'comparisons', 'headToHeads'] as const)
      for (const [slug, b] of Object.entries(j[top] ?? {})) scan(`${top} ${slug} [${lang}]`, lang, b)
  }
  return errors
}

export function mcpExportScoreErrors(exportPath = join(ROOT, '..', 'chatgpt-app', 'data', 'reviews.json')): string[] {
  if (!existsSync(exportPath)) {
    console.warn(`[check-review-scores] /mcp export not found (${exportPath}) — skipped`)
    return []
  }
  const site = new Set<string>()
  for (const v of [ALL_REVIEWS, ALL_COMPARISONS, ALL_HEAD_TO_HEADS]) for (const [, s] of strings(v)) site.add(s)
  const ex = JSON.parse(readFileSync(exportPath, 'utf8'))
  const errors: string[] = []
  for (const k of ['reviews', 'headToHeads', 'roundups']) {
    for (const e of ex[k] ?? []) {
      for (const [key, s] of strings(e)) {
        const h = findHandTypedScores(s, 'en')
        if (h.length && !site.has(s)) errors.push(`/mcp export ${k} ${e.slug}.${key}: "${h[0].text}" is not the site's computed text — re-run scripts/export-chatgpt-data.ts`)
        if (/\{\{(score|literal|fact):/.test(s)) errors.push(`/mcp export ${k} ${e.slug}.${key}: unresolved placeholder`)
      }
    }
  }
  return errors
}

// ── Awards and duel-axis winners vs scores (task 089 step 6) ──
import { CRITERIA } from '../../src/data/reviews/criteria'
import { axisWinnerFromScores, beatenByMoreThanGap } from '../../src/data/reviews/scoring'

const norm = (s: string) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, ' ').trim()
/** The criterion a free-text duel axis is named after (exact label or id), if any. */
export function axisCriterion(axisName: string, category: string): string | undefined {
  const n = norm(axisName)
  return ((CRITERIA as Record<string, { id: string; label: string }[]>)[category] ?? []).find((c) => norm(c.label) === n || norm(c.id.replace(/-/g, ' ')) === n)?.id
}

/** Hand-set results the scores contradict, left for the owner's decision (task 089 report).
 *  Remove a line once the owner has decided (fix the text/winner or the scores). */
export const AWARD_REVIEW_PENDING = new Set<string>([
  // winner changes — EN notes sent to the owner, waiting for OK (089 follow-up)
  'duel neurosity-crown-vs-emotiv-insight-2 › Comfort',
  'duel sun-home-equinox-vs-clearlight-sanctuary-2 › EMF',
  'duel eight-sleep-pod-4-vs-eight-sleep-pod-cover-pro › Form factor',
  'duel eight-sleep-pod-3-vs-eight-sleep-pod-cover-pro › Form factor',
  // criterion score itself to re-check (089_awards_table.md) — winner not recomputed until then
  'duel mito-red-mitopro-1500-vs-hooga-hg500 › Irradiance',
  'duel plunge-vs-edge-tub › Water management',
  'duel omnilux-contour-face-vs-currentbody-series-2 › Clinical evidence',
  'duel omnilux-contour-face-vs-dr-dennis-gross-spectralite › Clinical evidence',
  'duel currentbody-series-2-vs-higherdose-red-light-face-mask › Wavelength coverage',
  'duel theraface-mask-vs-higherdose-red-light-face-mask › Clinical evidence',
  'duel lightstim-for-wrinkles-vs-solawave-wand-4-in-1 › Clinical evidence',
  'duel omnilux-contour-face-vs-currentbody-series-2-vs-dr-dennis-gross-spectralite › Clinical evidence',
])

export function awardErrors(): { errors: string[]; pending: string[] } {
  const errors: string[] = [], pending: string[] = []
  const flag = (key: string, msg: string) => (AWARD_REVIEW_PENDING.has(key) ? pending : errors).push(`${key}: ${msg}`)
  // Round-up 'Best overall' / 'Best value' are computed rule awards (index.ts) — a hand-typed one must not survive.
  for (const c of ALL_COMPARISONS)
    for (const p of c.picks) if (/^best (overall|value)(\s*\([^)]*\))?$/i.test(p.award.trim())) errors.push(`round-up ${c.slug} › ${p.reviewSlug}: hand-typed "${p.award}" (computed rule award)`)
  for (const h of ALL_HEAD_TO_HEADS_RAW) {
    const ps = [h.productASlug, h.productBSlug, h.productCSlug].filter(Boolean).map((s) => R.get(s!)!)
    if (ps.some((p) => p.category !== ps[0].category)) continue
    for (const ax of h.axes) {
      if (ax.criterionId) continue // computed
      const crit = axisCriterion(ax.name, ps[0].category)
      if (!crit) continue // free-text axis (Price, Battery, …) — not a review criterion
      const v = ps.map((p) => p.scores.find((s) => s.criterionId === crit)!.score)
      const computed = axisWinnerFromScores(v)
      const key = `duel ${h.slug} › ${ax.name}`
      if (ax.winner === 'tie' ? computed !== 'tie' : beatenByMoreThanGap(v['abc'.indexOf(ax.winner)], v))
        flag(key, `hand-set '${ax.winner}' contradicts ${crit} scores ${v.join(' / ')} (computed '${computed}')`)
    }
  }
  return { errors, pending }
}
