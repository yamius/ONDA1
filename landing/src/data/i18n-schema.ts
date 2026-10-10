/**
 * THE translation schema — one place that says, for every content collection,
 * where its translations live and which fields are translatable, in what shape.
 *
 * Used by:
 *  - scripts/check-translations.ts   (build: validates every locale file against this + the EN source)
 *  - scripts/i18n-export.ts / i18n-import.ts  (hand an entry to translators / merge it back)
 *  - src/lib/localize.ts             (pages read a translated entry through it — no per-page field lists)
 *
 * Conventions (all collections):
 *  - Q&A lists are always `{ q, a }`.
 *  - Only TEXT is translated. Ids, links, slugs, numbers, flags stay in the EN source
 *    (never copy them into a translation).
 *  - `indexed` lists match the EN list item-for-item (same length, same order).
 *  - `keyed` maps are keyed by the EN ids (criterion id, product slug …); a subset is fine.
 */
export type QA = { q: string; a: string }

export type FieldSpec =
  | { kind: 'text' }
  | { kind: 'markdown' } // links/URLs must match EN
  | { kind: 'textList' } // string[] — any length (pros/cons may be reworded)
  | { kind: 'qaList' } // QA[] — any length
  | { kind: 'indexed'; keys: readonly string[] } // object[] matched to EN by position
  | { kind: 'keyed'; keys?: readonly string[] } // Record<enId, string | {keys…}>
  | { kind: 'object'; keys: readonly string[] } // one object of text fields

export interface CollectionSchema {
  /** public/locales/<lang>/<file> */
  file: 'articles.json' | 'reviews.json' | 'glossary.json'
  /** top-level key holding `{ [slug]: entry }` */
  path: 'bodies' | 'comparisons' | 'headToHeads'
  fields: Record<string, FieldSpec>
  /** A PUBLISHED translation must have all of these (otherwise the page shows English). */
  required: readonly string[]
}

const text = { kind: 'text' } as const
const markdown = { kind: 'markdown' } as const
const textList = { kind: 'textList' } as const
const qaList = { kind: 'qaList' } as const

export const TRANSLATION_SCHEMA = {
  articles: {
    file: 'articles.json',
    path: 'bodies',
    fields: {
      title: text,
      /** Optional short <title> (≤ ~48 chars) — used instead of cutting the long title. */
      seoTitle: text,
      subtitle: text,
      description: text,
      content: markdown,
      imageAlt: text,
      imageTitle: text,
      imageCaption: text,
      neuralSuggestion: { kind: 'object', keys: ['text', 'linkText'] },
      howToSteps: { kind: 'indexed', keys: ['name', 'text'] },
      /** Visible FAQ block. */
      faq: qaList,
      /** FAQPage JSON-LD only — for pages whose Q&A IS the body (no second visible block). */
      faqSchema: qaList,
    },
    required: ['title', 'description', 'content'],
  },
  reviews: {
    file: 'reviews.json',
    path: 'bodies',
    fields: {
      verdict: text,
      summary: text,
      description: text,
      bestFor: text,
      testNote: text,
      productType: text,
      pros: textList,
      cons: textList,
      scoreNotes: { kind: 'keyed' },
      editorialAdjustment: text,
      content: markdown,
      faq: qaList,
    },
    required: ['verdict', 'summary', 'description', 'bestFor', 'testNote', 'pros', 'cons', 'scoreNotes', 'content'],
  },
  comparisons: {
    file: 'reviews.json',
    path: 'comparisons',
    fields: {
      title: text,
      description: text,
      intro: text,
      verdict: text,
      content: markdown,
      picks: { kind: 'keyed', keys: ['award', 'takeaway', 'comparisonOnly'] },
      faq: qaList,
    },
    required: ['title', 'description', 'intro', 'verdict', 'content', 'picks'],
  },
  h2h: {
    file: 'reviews.json',
    path: 'headToHeads',
    fields: {
      title: text,
      description: text,
      intro: text,
      verdict: text,
      bestForA: text,
      bestForB: text,
      bestForC: text,
      axes: { kind: 'indexed', keys: ['name', 'note'] },
      faq: qaList,
      content: markdown,
    },
    required: ['title', 'description', 'intro', 'verdict', 'bestForA', 'bestForB', 'axes', 'content'],
  },
  glossary: {
    file: 'glossary.json',
    path: 'bodies',
    fields: { title: text, shortDescription: text, content: markdown },
    required: ['title', 'shortDescription', 'content'],
  },
} as const satisfies Record<string, CollectionSchema>

export type TranslationCollection = keyof typeof TRANSLATION_SCHEMA
