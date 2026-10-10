/**
 * Reviews, comparisons and head-to-heads for pages — metadata from the generated
 * catalog, full bodies one entry at a time (content-loader.ts). Mirrors the list
 * API of src/data/reviews (same publishOn gate), so pages never import the full
 * registry (every review + 170 duels) into the browser.
 *
 * read*() suspend on the client until the entry's body is in; the prerender
 * registers the full registry (registerServerReviewSource) so SSR is unchanged.
 */
import type { ToolReview, Comparison, HeadToHead, ReviewCategory } from '../data/reviews/types'
import { REVIEW_CATEGORIES } from '../data/reviews/criteria'
import {
  REVIEW_CATALOG,
  COMPARISON_CATALOG,
  H2H_CATALOG,
  type ReviewMeta,
  type ComparisonMeta,
  type HeadToHeadMeta,
} from '../generated/review-catalog'
import { getEnEntryBody, isEntryReady, loadEntry, type Collection } from './content-loader'

export type { ReviewMeta, ComparisonMeta, HeadToHeadMeta }

const TODAY = new Date().toISOString().slice(0, 10)
const live = <T extends { publishOn?: string }>(x: T) => !x.publishOn || x.publishOn <= TODAY

export const reviews: ReviewMeta[] = REVIEW_CATALOG.filter(live)
export const comparisons: ComparisonMeta[] = COMPARISON_CATALOG.filter(live)
export const headToHeads: HeadToHeadMeta[] = H2H_CATALOG.filter(live)

const LIVE_CATEGORY_SET = new Set<ReviewCategory>([...reviews.map((r) => r.category), ...comparisons.map((c) => c.category)])
export const LIVE_REVIEW_CATEGORIES: ReviewCategory[] = REVIEW_CATEGORIES.filter((c) => LIVE_CATEGORY_SET.has(c))

const reviewBySlug = new Map(reviews.map((r) => [r.slug, r]))
const comparisonBySlug = new Map(comparisons.map((c) => [c.slug, c]))
const h2hBySlug = new Map(headToHeads.map((h) => [h.slug, h]))

export const getReviewBySlug = (slug: string): ReviewMeta | undefined => reviewBySlug.get(slug)
export const getComparisonBySlug = (slug: string): ComparisonMeta | undefined => comparisonBySlug.get(slug)
export const getHeadToHeadBySlug = (slug: string): HeadToHeadMeta | undefined => h2hBySlug.get(slug)

export function getHeadToHeadsForProduct(productSlug: string): HeadToHeadMeta[] {
  return headToHeads.filter(
    (h) => h.productASlug === productSlug || h.productBSlug === productSlug || h.productCSlug === productSlug,
  )
}

/** Reviews referenced by a comparison, in pick (ranking) order. */
export function getReviewsForComparison(comparison: Pick<Comparison, 'picks'>): ReviewMeta[] {
  return comparison.picks.filter((p) => !p.comparisonOnly).map((p) => reviewBySlug.get(p.reviewSlug)).filter((r): r is ReviewMeta => !!r)
}

// ── Full entries ───────────────────────────────────────────────────────────
interface ServerSource {
  review: (slug: string) => ToolReview | undefined
  comparison: (slug: string) => Comparison | undefined
  h2h: (slug: string) => HeadToHead | undefined
}
let server: ServerSource | null = null
export function registerServerReviewSource(src: ServerSource): void {
  server = src
}

function readFull<M extends { slug: string }, F>(c: Collection, meta: M | undefined, lang: string): F | undefined {
  if (!meta) return undefined
  if (!isEntryReady(c, meta.slug, lang)) throw loadEntry(c, meta.slug, lang)
  return { ...meta, ...(getEnEntryBody(c, meta.slug) ?? {}) } as unknown as F
}

export function readReview(slug: string, lang: string): ToolReview | undefined {
  if (server) return server.review(slug)
  return readFull<ReviewMeta, ToolReview>('reviews', reviewBySlug.get(slug), lang)
}
export function readComparison(slug: string, lang: string): Comparison | undefined {
  if (server) return server.comparison(slug)
  return readFull<ComparisonMeta, Comparison>('comparisons', comparisonBySlug.get(slug), lang)
}
export function readHeadToHead(slug: string, lang: string): HeadToHead | undefined {
  if (server) return server.h2h(slug)
  return readFull<HeadToHeadMeta, HeadToHead>('h2h', h2hBySlug.get(slug), lang)
}
