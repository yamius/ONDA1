/**
 * EN source of every translatable entry, in exactly the shape of
 * src/data/i18n-schema.ts — the reference a translation is checked against and
 * the file translators receive. Node-only (reads the full registries).
 */
import { articlesRaw as articles } from '../../src/data/articles'
import { ARTICLE_FAQ_RAW as ARTICLE_FAQ, ARTICLE_FAQ_SCHEMA_ONLY_RAW as ARTICLE_FAQ_SCHEMA_ONLY } from '../../src/data/article-faq'
import { ALL_REVIEWS_RAW as ALL_REVIEWS, ALL_COMPARISONS_RAW as ALL_COMPARISONS } from '../../src/data/reviews'
import { ALL_HEAD_TO_HEADS_RAW as ALL_HEAD_TO_HEADS } from '../../src/data/reviews/head-to-head'
import { CATEGORY_INTRO, CATEGORY_META_DESCRIPTION } from '../../src/data/reviews/category-hub-copy'
import { CATEGORY_URL_SLUGS } from '../../src/data/reviews/criteria'
import type { ReviewCategory } from '../../src/data/reviews/types'
import { ONDA_ROUNDUPS } from '../../src/data/onda-roundups'
import { glossaryTermsRaw as glossaryTerms } from '../../src/data/glossary'
import type { TranslationCollection } from '../../src/data/i18n-schema'

type Entry = Record<string, unknown>
const clean = (o: Entry): Entry => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && !(Array.isArray(v) && v.length === 0)))
const qa = (list?: { question: string; answer: string }[]) => list?.map((f) => ({ q: f.question, a: f.answer }))

function build(): Record<TranslationCollection, Map<string, Entry>> {
  return {
    articles: new Map(
      articles.map((a) => [
        a.slug,
        clean({
          title: a.title,
          subtitle: a.subtitle,
          description: a.description,
          content: a.content,
          imageAlt: a.imageAlt,
          imageTitle: a.imageTitle,
          imageCaption: a.imageCaption,
          neuralSuggestion: a.neuralSuggestion ? { text: a.neuralSuggestion.text, linkText: a.neuralSuggestion.linkText } : undefined,
          howToSteps: a.howToSteps?.map((s) => ({ name: s.name, text: s.text })),
          faq: qa(ARTICLE_FAQ[a.slug]),
          faqSchema: qa(ARTICLE_FAQ_SCHEMA_ONLY[a.slug]),
        }),
      ]),
    ),
    reviews: new Map(
      ALL_REVIEWS.map((r) => [
        r.slug,
        clean({
          verdict: r.verdict,
          summary: r.summary,
          description: r.description,
          bestFor: r.bestFor,
          testNote: r.testNote,
          productType: r.productType,
          pros: r.pros,
          cons: r.cons,
          scoreNotes: Object.fromEntries(r.scores.map((s) => [s.criterionId, s.note])),
          editorialAdjustment: r.editorialAdjustment?.reason,
          content: r.content,
          faq: r.faq?.map((f) => ({ q: f.q, a: f.a })),
        }),
      ]),
    ),
    comparisons: new Map(
      ALL_COMPARISONS.map((c) => [
        c.slug,
        clean({
          title: c.title,
          description: c.description,
          intro: c.intro,
          verdict: c.verdict,
          content: c.content,
          picks: Object.fromEntries(c.picks.map((p) => [p.reviewSlug, { award: p.award, takeaway: p.takeaway, ...(p.comparisonOnly ? { comparisonOnly: p.comparisonOnly } : {}) }])),
          faq: c.faq?.map((f) => ({ q: f.q, a: f.a })),
        }),
      ]),
    ),
    h2h: new Map(
      ALL_HEAD_TO_HEADS.map((h) => [
        h.slug,
        clean({
          title: h.title,
          description: h.description,
          intro: h.intro,
          verdict: h.verdict,
          bestForA: h.bestForA,
          bestForB: h.bestForB,
          bestForC: h.bestForC,
          axes: h.axes.map((x) => ({ name: x.name, note: x.note })),
          faq: h.faq?.map((f) => ({ q: f.q, a: f.a })),
          content: h.content,
        }),
      ]),
    ),
    categoryHubs: new Map(
      (Object.keys(CATEGORY_INTRO) as ReviewCategory[])
        .filter((c) => CATEGORY_URL_SLUGS[c])
        .map((c) => [
          CATEGORY_URL_SLUGS[c] as string,
          clean({ h1: CATEGORY_INTRO[c].h1, intro: CATEGORY_INTRO[c].intro, description: CATEGORY_META_DESCRIPTION[c] }),
        ]),
    ),
    roundups: new Map(
      ONDA_ROUNDUPS.map((r) => [
        r.slug,
        clean({
          title: r.title,
          description: r.description,
          intro: r.intro,
          entries: r.entries.map((e) => ({ tag: e.tag, blurb: e.blurb, pros: e.pros, cons: e.cons })),
          bottomLine: r.bottomLine,
          faq: r.faq.map((f) => ({ q: f.q, a: f.a })),
        }),
      ]),
    ),
    glossary: new Map(glossaryTerms.map((t) => [t.slug, clean({ title: t.title, shortDescription: t.shortDescription, content: t.content })])),
  }
}

let cache: ReturnType<typeof build> | null = null
export function enSource(collection: TranslationCollection): Map<string, Entry> {
  cache ??= build()
  return cache[collection]
}
