/**
 * Glossary for pages — the light index (no term bodies) for lists, labels and
 * links; the full text of ONE term is fetched on demand (content-loader.ts).
 * readTerm() suspends on the client until the body is in; the prerender
 * registers the full glossary (registerServerGlossarySource) so SSR is unchanged.
 */
import type { GlossaryTerm } from '../data/glossary'
import { GLOSSARY_INDEX, type GlossaryIndexEntry } from '../generated/glossary-index'
import { getEnEntryBody, isEntryReady, loadEntry } from './content-loader'

export { glossaryLayer, type GlossaryLayer } from '../data/glossary-layer'
export type { GlossaryIndexEntry }

export const glossaryTerms: GlossaryIndexEntry[] = GLOSSARY_INDEX
export const categories = [...new Set(GLOSSARY_INDEX.map((t) => t.category))]

const bySlug = new Map(GLOSSARY_INDEX.map((t) => [t.slug, t]))
export const getTermBySlug = (slug: string): GlossaryIndexEntry | undefined => bySlug.get(slug)

let server: ((slug: string) => GlossaryTerm | undefined) | null = null
export function registerServerGlossarySource(fn: (slug: string) => GlossaryTerm | undefined): void {
  server = fn
}

/** The full term (index entry + EN content). Client: suspends until fetched. */
export function readTerm(slug: string, lang: string): GlossaryTerm | undefined {
  if (server) return server(slug)
  const meta = bySlug.get(slug)
  if (!meta) return undefined
  if (!isEntryReady('glossary', slug, lang)) throw loadEntry('glossary', slug, lang)
  const body = getEnEntryBody<{ content?: string }>('glossary', slug)
  return { ...meta, content: body?.content ?? '' } as GlossaryTerm
}
