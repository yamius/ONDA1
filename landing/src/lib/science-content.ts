/**
 * ONDA Science page data — one page in one language, fetched on demand from
 * /_content/science/<lang>/<kind>/<slug>.json (scripts/generate-science-pages.ts).
 * readSciencePage() suspends on the client until the file is in; the prerender
 * registers every page (registerServerScienceSource) so SSR renders synchronously,
 * and main.tsx preloads the URL's page before hydration.
 */
import type { SciencePageData } from '../generated/science-pages'

let server: ((lang: string, kind: string, slug: string) => SciencePageData | undefined) | null = null
export function registerServerScienceSource(fn: (lang: string, kind: string, slug: string) => SciencePageData | undefined): void {
  server = fn
}

const cache = new Map<string, SciencePageData | null>()
const inflight = new Map<string, Promise<void>>()
const k = (lang: string, kind: string, slug: string) => `${lang}/${kind}/${slug}`

export function loadSciencePage(lang: string, kind: string, slug: string): Promise<void> {
  const key = k(lang, kind, slug)
  if (cache.has(key)) return Promise.resolve()
  const existing = inflight.get(key)
  if (existing) return existing
  const p = fetch(`/_content/science/${key}.json`)
    .then((r) => (r.ok ? (r.json() as Promise<SciencePageData>) : null))
    .catch(() => null)
    .then((d) => {
      cache.set(key, d)
      inflight.delete(key)
    })
  inflight.set(key, p)
  return p
}

/** The full page. Client: suspends until fetched; undefined if it does not exist. */
export function readSciencePage(lang: string, kind: string, slug: string): SciencePageData | undefined {
  if (server) return server(lang, kind, slug)
  const key = k(lang, kind, slug)
  if (!cache.has(key)) throw loadSciencePage(lang, kind, slug)
  return cache.get(key) ?? undefined
}
