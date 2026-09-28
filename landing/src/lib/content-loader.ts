/**
 * Generic per-entry body fetcher for every content collection. One entry = one
 * small JSON file: /_content/<collection>/<lang>/<slug>.json, written by
 * scripts/generate-article-chunks.ts. No catalog in here, so main.tsx can await it
 * before hydration without growing the entry bundle.
 *
 * EN bodies are kept in memory and merged with catalog metadata by the collection
 * modules (article-content.ts, review-content.ts). A localized body is merged into
 * i18n at the path the pages already read (e.g. reviews → reviews:bodies.<slug>).
 */
import i18n from 'i18next'

export type Collection = 'articles' | 'reviews' | 'comparisons' | 'h2h' | 'glossary'

/** Where a localized body lives in i18n: [namespace, top-level key]. */
const I18N_TARGET: Record<Collection, [string, string]> = {
  articles: ['articles', 'bodies'],
  reviews: ['reviews', 'bodies'],
  comparisons: ['reviews', 'comparisons'],
  h2h: ['reviews', 'headToHeads'],
  glossary: ['glossary', 'bodies'],
}

const enBodies = new Map<string, Record<string, unknown>>() // `${collection}:${slug}`
const localizedDone = new Set<string>() // `${collection}:${lang}:${slug}` — fetched (found or not)
const inflight = new Map<string, Promise<void>>()

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url)
    return r.ok ? ((await r.json()) as T) : null
  } catch {
    return null
  }
}

export function isEntryReady(c: Collection, slug: string, lang: string): boolean {
  return enBodies.has(`${c}:${slug}`) && (lang === 'en' || localizedDone.has(`${c}:${lang}:${slug}`))
}

export function getEnEntryBody<T = Record<string, unknown>>(c: Collection, slug: string): T | undefined {
  return enBodies.get(`${c}:${slug}`) as T | undefined
}

/** Fetch the EN body and (other languages) that language's body. Deduped + cached. */
export function loadEntry(c: Collection, slug: string, lang: string): Promise<void> {
  if (isEntryReady(c, slug, lang)) return Promise.resolve()
  const key = `${c}:${lang}:${slug}`
  const existing = inflight.get(key)
  if (existing) return existing
  const tasks: Promise<void>[] = []
  if (!enBodies.has(`${c}:${slug}`)) {
    tasks.push(
      fetchJson<Record<string, unknown>>(`/_content/${c}/en/${slug}.json`).then((b) => {
        // A failed fetch resolves with an empty body: the page renders its shell
        // instead of suspending forever.
        enBodies.set(`${c}:${slug}`, b ?? {})
      }),
    )
  }
  if (lang !== 'en' && !localizedDone.has(key)) {
    tasks.push(
      fetchJson<Record<string, unknown>>(`/_content/${c}/${lang}/${slug}.json`).then((b) => {
        if (b) {
          const [ns, top] = I18N_TARGET[c]
          i18n.addResourceBundle(lang, ns, { [top]: { [slug]: b } }, true, true)
        }
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
