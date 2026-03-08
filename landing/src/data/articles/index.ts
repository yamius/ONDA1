/**
 * Articles for /articles section. SEO-focused long-form content.
 */
export type { Article } from './types'
import type { Article } from './types'
import vagusArticle from './vagus-nerve-master-key'
import dopamineArticle from './dopamine-architecture-mastering-desire'
import dopamineStackingArticle from './dopamine-stacking-preventing-circuit-overload'
import circadianArticle from './circadian-reset-mastering-light'
import metabolicArticle from './metabolic-flexibility-dual-fuel-system'
import neuroplasticityArticle from './neuroplasticity-flow-overclocking'
import gutBrainArticle from './gut-brain-axis-data-link'
import breathworkArticle from './breathwork-command-line-interface'
import hrvArticle from './hrv-training-nervous-system-latency'
import digitalDementiaArticle from './digital-dementia-attentional-control'
import longevityArticle from './longevity-hardware-cellular-cleanup'
import cognitiveArticle from './cognitive-architecture-nootropic-stacks'
import mitochondrialArticle from './mitochondrial-biogenesis-cellular-power-grid'
import circadianLightingArticle from './circadian-lighting-dark-therapy'
import glp1Article from './glp1-biology-muscle-preservation'
import mtDnaRedLightArticle from './mitochondrial-dna-red-light'
import senolyticArticle from './senolytic-high-dosing-longevity'
import aiBiomarkerArticle from './ai-biomarker-tracking-predictive'
import phaseLockedSleepArticle from './phase-locked-acoustic-sleep'
import neuralEntrainmentArticle from './neural-entrainment-meditation-2'
import electricMedicineArticle from './electric-medicine-neuromodulation'
import muscleMetabolicArticle from './muscle-metabolic-marker'
import chmArticle from './chm-continuous-hormone-monitoring'
import glymphaticFlushArticle from './glymphatic-flush-clearing-neural-cache'
import cpgArticle from './cpg-neural-autopilot'
import co2ToleranceArticle from './co2-tolerance-expanding-oxygen-limit'
import femtechArticle from './femtech-cyclical-architecture'
import cacaoStemCellsArticle from './cacao-stem-cells'
import cognitiveNeuralArticle from './cognitive-architecture-neural-throughput'

export const articles: Article[] = [...vagusArticle, ...dopamineArticle, ...dopamineStackingArticle, ...circadianArticle, ...metabolicArticle, ...neuroplasticityArticle, ...gutBrainArticle, ...breathworkArticle, ...hrvArticle, ...digitalDementiaArticle, ...longevityArticle, ...cognitiveArticle, ...mitochondrialArticle, ...circadianLightingArticle, ...glp1Article, ...mtDnaRedLightArticle, ...senolyticArticle, ...aiBiomarkerArticle, ...phaseLockedSleepArticle, ...neuralEntrainmentArticle, ...electricMedicineArticle, ...muscleMetabolicArticle, ...chmArticle, ...glymphaticFlushArticle, ...cpgArticle, ...co2ToleranceArticle, ...femtechArticle, ...cacaoStemCellsArticle, ...cognitiveNeuralArticle]

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug)
}

/**
 * Returns articles that reference the given glossary term (in relatedSlugs or content).
 * Used for bidirectional linking: glossary term → related articles.
 */
export function getArticlesForTerm(termSlug: string, termTitle: string): Article[] {
  const slugLower = termSlug.toLowerCase()
  const titleLower = termTitle.toLowerCase()
  return articles.filter((a) => {
    if (a.relatedSlugs?.includes(termSlug)) return true
    const contentLower = a.content.toLowerCase()
    return (
      contentLower.includes(titleLower) ||
      contentLower.includes(slugLower.replace(/-/g, ' '))
    )
  })
}
