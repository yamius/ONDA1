/**
 * Articles for /articles section. SEO-focused long-form content.
 */
export type { Article } from './types'
import type { Article } from './types'
import vagusArticle from './vagus-nerve-master-key'

export const articles: Article[] = [...vagusArticle]

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug)
}
