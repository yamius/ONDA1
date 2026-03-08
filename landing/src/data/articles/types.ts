export interface HowToStep {
  name: string
  text: string
  /** Unique protocol ID for tracking (e.g. vagus-resonant-frequency) */
  protocolId?: string
}

export interface Article {
  slug: string
  title: string
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
}
