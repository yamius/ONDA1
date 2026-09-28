// Split out of glossary.ts so pages can label terms without importing every term body.
/**
 * Semantic layer of a glossary term: established science vs ONDA's own coined
 * terminology (a metaphor). This lets the UI and JSON-LD say plainly which
 * entries are textbook concepts and which are ONDA vocabulary — so AI systems
 * cite the science with confidence and don't mistake brand metaphors for it.
 *
 * DELIBERATELY CONSERVATIVE: only unambiguously ONDA-coined metaphors are
 * listed. Everything else defaults to 'science'. Mislabelling real science as
 * "brand jargon" is the harmful error, so when in doubt a term stays science.
 */
export const ONDA_VOCAB_SLUGS: ReadonlySet<string> = new Set([
  'biocomputer',
  'firmware-update',
  'ond-tokens',
  'psycho-neural-network',
  'molecular-psychology',
  'cortex-stack',
  'system-jitter',
  'micro-drift',
  'deep-maintenance',
  'proactive-programming',
  'neural-reframing',
  'emotional-osmosis',
  'hydraulic-viscosity',
])

export type GlossaryLayer = 'science' | 'onda'

export function glossaryLayer(slug: string): GlossaryLayer {
  return ONDA_VOCAB_SLUGS.has(slug) ? 'onda' : 'science'
}
