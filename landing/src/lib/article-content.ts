/**
 * Article content access for pages — one article at a time.
 *
 * Browser: metadata comes from the generated catalog (no bodies); the full body
 * of ONE article is fetched on demand by article-loader.ts. readArticle()
 * suspends (throws the load promise) until the EN body and — for a localized
 * page — that language's body are in; react-router's startTransition keeps the
 * current page on screen meanwhile, and main.tsx awaits loadArticle() before
 * hydration so the first paint never suspends.
 *
 * Server (prerender): entry-server registers the full in-memory registry via
 * registerServerArticleSource(), so SSR output is unchanged and synchronous.
 */
import type { Article } from '../data/articles/types'
import { ARTICLE_CATALOG, type ArticleMeta } from '../generated/article-catalog'
import { getEnBody, isArticleReady, loadArticle, type ArticleFaq } from './article-loader'

export type { ArticleFaq }
export interface ResolvedArticle {
  article: Article
  faq: ArticleFaq
}

let serverSource: ((slug: string) => ResolvedArticle | undefined) | null = null
export function registerServerArticleSource(fn: (slug: string) => ResolvedArticle | undefined): void {
  serverSource = fn
}

const catalogBySlug = new Map(ARTICLE_CATALOG.map((a) => [a.slug, a]))
export function getArticleMeta(slug: string): ArticleMeta | undefined {
  return catalogBySlug.get(slug)
}
export function articleExists(slug: string): boolean {
  return serverSource ? !!serverSource(slug) : catalogBySlug.has(slug)
}

/**
 * The full article (metadata + EN body + EN FAQ). Localized fields are read by the
 * page through i18n (bodies.<slug>.*), which loadArticle() fills for `lang`.
 * Client: throws the load promise while the body is not cached (suspends).
 */
export function readArticle(slug: string, lang: string): ResolvedArticle | undefined {
  if (serverSource) return serverSource(slug)
  const meta = catalogBySlug.get(slug)
  if (!meta) return undefined
  if (!isArticleReady(slug, lang)) throw loadArticle(slug, lang)
  const { faq, ...rest } = getEnBody(slug)!
  return { article: { ...meta, ...rest } as Article, faq: faq ?? [] }
}

/** Warm the cache for a link the reader is likely to open (hover/focus). */
export function prefetchArticle(slug: string, lang: string): void {
  if (!serverSource && catalogBySlug.has(slug)) void loadArticle(slug, lang)
}
