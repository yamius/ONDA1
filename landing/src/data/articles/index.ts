/**
 * Articles for /articles section. SEO-focused long-form content.
 */
export type { Article } from './types'
import type { Article } from './types'
import vagusArticle from './vagus-nerve-master-key'
import dopamineArticle from './dopamine-architecture-mastering-desire'
import circadianArticle from './circadian-reset-mastering-light'
import metabolicArticle from './metabolic-flexibility-dual-fuel-system'
import neuroplasticityArticle from './neuroplasticity-flow-overclocking'

export const articles: Article[] = [...vagusArticle, ...dopamineArticle, ...circadianArticle, ...metabolicArticle, ...neuroplasticityArticle]

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug)
}

/**
 * Returns articles that reference the given glossary term (in relatedSlugs or content).
 * Used for bidirectional linking: glossary term → related articles.
 */
export function getArticlesForTerm(termSlug: string, termTitle: string): Article[] {
  const slugLower = termSlug.toLowerCase()
  const titleLower = termTitle.toLowerCase()
  return articles.filter((a) => {
    if (a.relatedSlugs?.includes(termSlug)) return true
    const contentLower = a.content.toLowerCase()
    return (
      contentLower.includes(titleLower) ||
      contentLower.includes(slugLower.replace(/-/g, ' '))
    )
  })
}
