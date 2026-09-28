/**
 * Article bodies — thin wrapper over the generic content loader (content-loader.ts).
 * Free of the article catalog so main.tsx can await it before hydration.
 */
import type { Article } from '../data/articles/types'
import { getEnEntryBody, isEntryReady, loadEntry } from './content-loader'

export type ArticleFaq = { question: string; answer: string }[]
/** Everything about an article that is not in the catalog, plus its EN FAQ. */
export type ArticleBody = Partial<Article> & { faq?: ArticleFaq }

export function isArticleReady(slug: string, lang: string): boolean {
  return isEntryReady('articles', slug, lang)
}

export function getEnBody(slug: string): ArticleBody | undefined {
  const b = getEnEntryBody<ArticleBody>('articles', slug)
  // Empty object = failed fetch; keep the page renderable.
  return b && Object.keys(b).length === 0 ? { content: '', relatedSlugs: [] } : b
}

export function loadArticle(slug: string, lang: string): Promise<void> {
  return loadEntry('articles', slug, lang)
}
