/**
 * Prepare one entry for translation:
 *
 *   npx tsx scripts/i18n-export.ts <collection> <slug>
 *     collection: articles | reviews | comparisons | h2h | glossary
 *
 * Writes translations/<collection>/<slug>/:
 *   en.json   — { entry, support } in the canonical shape (src/data/i18n-schema.ts)
 *               entry   = the translatable text of this item
 *               support = shared strings the page also needs (criteria/category labels,
 *                         UI strings, product-card lines); i18n-import only fills the ones
 *                         a language is missing, never overwrites
 *   BRIEF.md  — rules for translators + which languages still lack this entry
 * Translators (or agents) write <lang>.json next to en.json with the same structure,
 * then: npx tsx scripts/i18n-import.ts <collection> <slug> --publish today
 */
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { TRANSLATION_SCHEMA, type TranslationCollection } from '../src/data/i18n-schema'
import { enSource } from './lib/i18n-source'
import { ALL_REVIEWS, ALL_COMPARISONS } from '../src/data/reviews'
import { ALL_HEAD_TO_HEADS } from '../src/data/reviews/head-to-head'
import { getCriteria, CATEGORY_LABELS } from '../src/data/reviews/criteria'

const LANGS = ['es', 'ru', 'uk', 'zh', 'de', 'fr', 'it', 'nl', 'ja', 'pl', 'pt']
const [col, slug] = process.argv.slice(2) as [TranslationCollection, string]
if (!col || !slug || !(col in TRANSLATION_SCHEMA)) {
  console.error('usage: i18n-export.ts <articles|reviews|comparisons|h2h|glossary> <slug>')
  process.exit(1)
}
const entry = enSource(col).get(slug)
if (!entry) {
  console.error(`no ${col} entry "${slug}"`)
  process.exit(1)
}

// UI strings each page type reads (EN defaults live in the components).
const UI: Partial<Record<TranslationCollection, Record<string, string>>> = {
  reviews: { commonQuestions: 'Common questions', headToHeadHeading: 'Compared head-to-head' },
  comparisons: { faqHeading: 'Common questions', seeFullRanking: 'See the full ranking' },
  h2h: {
    choose: 'Choose', criterion: 'Criterion', faqHeading: 'Common questions', headToHeadBreakdownHeading: 'Head-to-head breakdown',
    seeFullRanking: 'See the full ranking', tie: 'Tie', why: 'Why', winner: 'Winner',
  },
}
const cards = (slugs: string[]) =>
  Object.fromEntries(
    slugs.map((s) => ALL_REVIEWS.find((r) => r.slug === s)).filter(Boolean).map((r) => [r!.slug, { verdict: r!.verdict, productType: r!.productType }]),
  )

const support: Record<string, unknown> = {}
if (UI[col]) support.ui = UI[col]
if (col === 'reviews') {
  const r = ALL_REVIEWS.find((x) => x.slug === slug)!
  support.criteria = Object.fromEntries(getCriteria(r.category).map((c) => [c.id, c.label]))
  support.categories = { [r.category]: CATEGORY_LABELS[r.category] }
}
if (col === 'comparisons') {
  const c = ALL_COMPARISONS.find((x) => x.slug === slug)!
  support.categories = { [c.category]: CATEGORY_LABELS[c.category] }
  support.cards = cards(c.picks.map((p) => p.reviewSlug))
}
if (col === 'h2h') {
  const h = ALL_HEAD_TO_HEADS.find((x) => x.slug === slug)!
  support.cards = cards([h.productASlug, h.productBSlug, h.productCSlug].filter(Boolean) as string[])
}

const schema = TRANSLATION_SCHEMA[col]
const missing = LANGS.filter((l) => {
  try {
    const d = JSON.parse(readFileSync(join('public', 'locales', l, schema.file), 'utf-8'))
    return !d[schema.path]?.[slug]
  } catch {
    return true
  }
})
const dir = join('translations', col, slug)
mkdirSync(dir, { recursive: true })
writeFileSync(join(dir, 'en.json'), JSON.stringify({ entry, support }, null, 2) + '\n')
writeFileSync(
  join(dir, 'BRIEF.md'),
  `# Translate ${col} / ${slug}

Source: en.json. Write <lang>.json next to it with EXACTLY the same structure and keys.
Languages without this translation yet: ${missing.join(', ') || '(none)'}

Rules
- Translate every string value in "entry" and "support". Never add, remove or rename keys.
- Q&A items stay { "q", "a" }. Lists that describe EN items one-by-one (axes, howToSteps) keep the same length and order.
- Keyed maps (scoreNotes, picks, criteria, cards) keep their ids as keys.
- Markdown: keep headings, lists and every link URL exactly; translate link text only. In-page anchors may change.
- Keep brand/product names, prices, numbers, units, study names and years.
- Cautious, evidence-based tone exactly as the source — never strengthen a claim; no "cure/diagnose/treat" unless the source says it.
- description: under ~160 characters. title: natural search phrasing in the target language.
- Terminology: Russian/Ukrainian ВСР for HRV, Spanish/Portuguese/French VFC; other languages keep HRV.
- For consistency, read that language's existing public/locales/<lang>/${schema.file}.
`,
)
console.log(`[i18n-export] ${dir}/en.json (+BRIEF.md) — missing in: ${missing.join(', ') || 'none'}`)
