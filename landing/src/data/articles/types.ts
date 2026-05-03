export interface HowToStep {
  name: string
  text: string
  /** Unique protocol ID for tracking (e.g. vagus-resonant-frequency) */
  protocolId?: string
}

export interface Article {
  slug: string
  title: string
  /** Optional: subtitle under h1 (distinctive styling) */
  subtitle?: string
  /** Optional: custom SEO title override (e.g. "Dopamine Stacking & Circuit Overload | ONDA Biology") */
  seoTitle?: string
  description: string
  category: string
  content: string
  relatedSlugs: string[]
  /** Optional: HowTo schema steps for SEO (e.g. practical protocols) */
  howToSteps?: HowToStep[]
  /** Optional: Intro blockquote styling — 'purple' for Dopamine, 'amber' for Circadian, 'emerald' for Metabolic, 'blue' for Neuroplasticity, etc. */
  introStyle?: 'cyan' | 'purple' | 'amber' | 'emerald' | 'blue' | 'orange' | 'rose' | 'indigo' | 'gold' | 'slate'
  /** Optional: Cross-link to related article at bottom */
  neuralSuggestion?: { text: string; link: string; linkText: string }
  /** Optional: Image path (from public root, e.g. /images/articles/slug.png) for card and article header */
  image?: string
  /** Optional: Alt text for image (~125 chars, keyword + visual description). SEO-critical. */
  imageAlt?: string
  /** Optional: Title attribute (tooltip on hover) */
  imageTitle?: string
  /** Optional: Caption under image. Increases dwell time. */
  imageCaption?: string
  /** Optional: 'header' = under title; 'content' = inline in markdown (better semantic flow) */
  imagePlacement?: 'header' | 'content'
  /**
   * Optional ISO 8601 timestamp at which the article should become public.
   * - When unset, the article is treated as published immediately (legacy behavior).
   * - When set to a future timestamp, the article is filtered out of the
   *   public registry (`articles`) and therefore disappears from the article
   *   index, sitemap, sitemap-news, sitemap-images, RSS/Atom feeds, llms.txt
   *   variants and the JSONL corpus.
   * - Once `publishedAt <= now`, the article is included again automatically
   *   on the next build (e.g. nightly GitHub Actions cron). No content edit
   *   is needed to flip the article live.
   * - The same value is consumed by ArticlePage.tsx and build-corpus.mjs as
   *   the canonical `datePublished` for JSON-LD, RSS pubDate and the corpus
   *   `published` field, keeping all surfaces in lockstep.
   */
  publishedAt?: string
}
