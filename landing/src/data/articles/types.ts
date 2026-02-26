export interface HowToStep {
  name: string
  text: string
}

export interface Article {
  slug: string
  title: string
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
}
