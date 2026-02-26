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
}
