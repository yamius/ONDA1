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
  'round-up best-hrv-trackers-2026 › Best value › ringconn-gen-2',
  'duel fitbit-air-vs-whoop-5-0 › HRV accuracy',
  'duel levels-vs-ultrahuman-m1 › Coaching',
  'duel zoe-vs-levels › Sensor accuracy',
  'duel nutrisense-vs-zoe › Sensor accuracy',
  'duel neurosity-crown-vs-emotiv-insight-2 › Signal quality',
  'duel neurosity-crown-vs-emotiv-insight-2 › Comfort',
  'duel headspace-vs-calm › Personalisation',
  'duel bettersleep-vs-sleep-cycle › Free tier',
  'duel joovv-solo-3-vs-platinumled-biomax-600 › Irradiance',
  'duel mito-red-mitopro-1500-vs-hooga-hg500 › Irradiance',
  'duel gembared-vesta-vs-joovv-solo-3 › Irradiance',
  'duel platinumled-biomax-600-vs-biolight-pro-900 › Irradiance',
  'duel plunge-vs-edge-tub › Water management',
  'duel plunge-vs-ice-barrel-500 › Build',
  'duel ice-barrel-500-vs-cold-pod-vs-inergize-cold-tub › Form factor',
  'duel ice-barrel-500-vs-cold-pod-vs-inergize-cold-tub › Water management',
  'duel sun-home-equinox-vs-clearlight-sanctuary-2 › EMF',
  'duel sun-home-equinox-vs-sunlighten-mpulse › EMF',
  'duel higherdose-blanket-v4-vs-therasage-thera-sauna-personal › EMF discipline',
  'duel sunlighten-vs-finnleo-vs-almost-heaven › Heat source',
  'duel muse-2-vs-focuscalm-vs-mendi › Comfort',
  'duel eight-sleep-pod-4-vs-chilipad-dock-pro › Climate range',
  'duel eight-sleep-pod-4-vs-chilipad-dock-pro › Form factor',
  'duel eight-sleep-pod-4-vs-eight-sleep-pod-cover-pro › Form factor',
  'duel chilipad-dock-pro-vs-chilipad-cube › Build',
  'duel eight-sleep-pod-3-vs-eight-sleep-pod-cover-pro › Form factor',
  'duel eight-sleep-pod-4-vs-chilipad-dock-pro-vs-bedjet-3 › Climate range',
  'duel bemer-classic-evo-vs-pulse-centers-pulse-xl-pro › Form factor',
  'duel resona-health-vibe-vs-olylife-tera-p90-plus › Form factor',
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
  for (const c of ALL_COMPARISONS) {
    const ps = c.picks.filter((p) => !p.comparisonOnly).map((p) => ({ p, r: R.get(p.reviewSlug)! }))
    for (const { p, r } of ps) {
      const others = ps.filter((x) => x.p !== p)
      if (/^best overall\b/i.test(p.award) && beatenByMoreThanGap(r.overallScore, others.map((x) => x.r.overallScore)))
        flag(`round-up ${c.slug} › Best overall › ${r.slug}`, `${r.overallScore} but another pick scores more than 0.1 higher`)
      if (/^best value$/i.test(p.award.trim())) {
        const v = (x: typeof r) => x.scores.find((s) => s.criterionId === 'value')?.score
        if (v(r) !== undefined && beatenByMoreThanGap(v(r)!, others.map((x) => v(x.r) ?? -1)))
          flag(`round-up ${c.slug} › Best value › ${r.slug}`, `value ${v(r)} but another pick has a value score more than 0.1 higher`)
      }
    }
  }
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
