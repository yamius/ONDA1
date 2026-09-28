/**
 * Per-article body fetcher — deliberately free of the article catalog so main.tsx
 * can await it before hydration without pulling metadata into the entry bundle.
 * Bodies: /_content/articles/<lang>/<slug>.json (scripts/generate-article-chunks.ts).
 */
import i18n from 'i18next'
import type { Article } from '../data/articles/types'

export type ArticleFaq = { question: string; answer: string }[]
/** Everything about an article that is not in the catalog, plus its EN FAQ. */
export type ArticleBody = Partial<Article> & { faq?: ArticleFaq }

const enBodies = new Map<string, ArticleBody>()
const localizedDone = new Set<string>() // `${lang}:${slug}` — fetched (found or not)
const inflight = new Map<string, Promise<void>>()

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url)
    return r.ok ? ((await r.json()) as T) : null
  } catch {
    return null
  }
}

export function isArticleReady(slug: string, lang: string): boolean {
  return enBodies.has(slug) && (lang === 'en' || localizedDone.has(`${lang}:${slug}`))
}

export function getEnBody(slug: string): ArticleBody | undefined {
  return enBodies.get(slug)
}

/** Fetch the EN body and (for other languages) that language's body. Deduped + cached. */
export function loadArticle(slug: string, lang: string): Promise<void> {
  if (isArticleReady(slug, lang)) return Promise.resolve()
  const key = `${lang}:${slug}`
  const existing = inflight.get(key)
  if (existing) return existing
  const tasks: Promise<void>[] = []
  if (!enBodies.has(slug)) {
    tasks.push(
      fetchJson<ArticleBody>(`/_content/articles/en/${slug}.json`).then((b) => {
        // A failed fetch still resolves with an empty body: the page renders its
        // shell instead of suspending forever.
        enBodies.set(slug, b ?? { content: '', relatedSlugs: [] })
      }),
    )
  }
  if (lang !== 'en' && !localizedDone.has(key)) {
    tasks.push(
      fetchJson<Record<string, unknown>>(`/_content/articles/${lang}/${slug}.json`).then((b) => {
        if (b) i18n.addResourceBundle(lang, 'articles', { bodies: { [slug]: b } }, true, true)
        localizedDone.add(key)
      }),
    )
  }
  const p = Promise.all(tasks).then(() => {
    inflight.delete(key)
  })
  inflight.set(key, p)
  return p
}
