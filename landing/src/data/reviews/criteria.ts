/**
 * Scoring criteria per review category. Weights sum to 1.0 within a
 * category — a review's overallScore is the weighted mean of its
 * CriterionScores. These definitions are the single source of truth for
 * the public /reviews/methodology page.
 */
import type { Criterion, ReviewCategory } from './types'

/** HRV wearables: rings, straps and watches that measure heart-rate
 *  variability. HRV accuracy is weighted highest — it is the metric
 *  ONDA's whole product is built on. */
const HRV_WEARABLE_CRITERIA: Criterion[] = [
  {
    id: 'hrv-accuracy',
    label: 'HRV measurement accuracy',
    weight: 0.25,
    description:
      'Agreement of measured HRV (RMSSD) with an ECG chest-strap reference, drawn from peer-reviewed validation studies and side-by-side testing.',
  },
  {
    id: 'sensor',
    label: 'Sensor and signal quality',
    weight: 0.15,
    description:
      'Sensor type (optical PPG vs electrical ECG), sampling approach, and how well a clean signal holds during movement and overnight.',
  },
  {
    id: 'sleep-accuracy',
    label: 'Sleep tracking accuracy',
    weight: 0.15,
    description:
      'How closely sleep staging and total sleep time track polysomnography or validated references — HRV is read mostly during sleep.',
  },
  {
    id: 'data-access',
    label: 'Data access and export',
    weight: 0.15,
    description:
      'Access to raw and detailed data: export, an open API, and integration with third-party tools rather than a closed app.',
  },
  {
    id: 'wearability',
    label: 'Wearability and battery',
    weight: 0.1,
    description:
      'Comfort and form factor for 24/7 wear, plus battery life and how much charging interrupts continuous measurement.',
  },
  {
    id: 'app-ux',
    label: 'App and software experience',
    weight: 0.1,
    description:
      'Clarity of the app, quality of the guidance, and whether metrics are explained rather than reduced to one opaque score.',
  },
  {
    id: 'value',
    label: 'Value',
    weight: 0.1,
    description:
      'Hardware price together with any mandatory subscription, weighed against what the device delivers.',
  },
]

/** Meditation and mindfulness apps. Library breadth and teaching quality
 *  carry the most weight — they are what a daily practice is built on. */
const MEDITATION_APP_CRITERIA: Criterion[] = [
  {
    id: 'content-library',
    label: 'Content library',
    weight: 0.25,
    description:
      'Breadth, depth and quality of the guided library — meditations, courses and series across topics and levels.',
  },
  {
    id: 'teaching',
    label: 'Teaching quality',
    weight: 0.2,
    description:
      'Calibre of the instructors and the teaching itself — how clearly and credibly practice is taught, from beginner to advanced.',
  },
  {
    id: 'personalization',
    label: 'Personalisation',
    weight: 0.15,
    description:
      'How well the app adapts to you — structured courses, progress tracking, recommendations and daily guidance.',
  },
  {
    id: 'app-experience',
    label: 'App experience',
    weight: 0.15,
    description:
      'Clarity and friction of the app itself — interface, navigation and how easily a session starts.',
  },
  {
    id: 'free-tier',
    label: 'Free tier',
    weight: 0.1,
    description:
      'How much genuine practice is possible without paying — a usable free tier versus a locked product tour.',
  },
  {
    id: 'value',
    label: 'Value',
    weight: 0.1,
    description:
      'Subscription price weighed against what the library and the teaching deliver.',
  },
  {
    id: 'evidence',
    label: 'Evidence base',
    weight: 0.05,
    description:
      'How far the app is grounded in research and credible teaching lineages rather than vague wellness claims.',
  },
]

/** Criteria sets keyed by category. */
export const CRITERIA: Record<ReviewCategory, Criterion[]> = {
  'hrv-wearable': HRV_WEARABLE_CRITERIA,
  'meditation-app': MEDITATION_APP_CRITERIA,
}

/** Human-readable category labels for the hub and the methodology page. */
export const CATEGORY_LABELS: Record<ReviewCategory, string> = {
  'hrv-wearable': 'HRV trackers',
  'meditation-app': 'Meditation apps',
}

/** Review categories in display order. */
export const REVIEW_CATEGORIES: ReviewCategory[] = ['hrv-wearable', 'meditation-app']

/** All scoring criteria for a category, in display order. */
export function getCriteria(category: ReviewCategory): Criterion[] {
  return CRITERIA[category]
}

/** Look up one criterion by id within a category. */
export function getCriterion(
  category: ReviewCategory,
  id: string,
): Criterion | undefined {
  return CRITERIA[category].find((c) => c.id === id)
}
