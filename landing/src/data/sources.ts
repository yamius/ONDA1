/**
 * Shared shape for a peer-reviewed reference cited on a tool page.
 *
 * Every calculator that publishes normative/science-based numbers exports a
 * `<TOOL>_SOURCES: ScienceSource[]` plus a `<TOOL>_METHODOLOGY` string, rendered
 * by <SourcesSection> so the figures are visibly defensible — not "AI-made-up".
 */
export interface ScienceSource {
  authors: string
  year: number
  title: string
  journal: string
  /** One line on what this reference contributes to the tool's numbers. */
  contributes: string
  /** Stable link — DOI where available, else PubMed / official body. */
  url: string
}
