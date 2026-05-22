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

/** Sleep apps: trackers and wind-down tools. Tracking accuracy and
 *  wind-down content carry the most weight — a sleep app is judged on
 *  whether it measures sleep, helps you get it, or both. */
const SLEEP_APP_CRITERIA: Criterion[] = [
  {
    id: 'tracking-accuracy',
    label: 'Sleep tracking accuracy',
    weight: 0.2,
    description:
      'How accurately the app measures sleep — timing, stages and disturbances — by accelerometer, microphone, sonar or a paired wearable.',
  },
  {
    id: 'wind-down-content',
    label: 'Wind-down content',
    weight: 0.2,
    description:
      'Breadth and quality of content for falling asleep — soundscapes, sleep stories, guided audio and white noise.',
  },
  {
    id: 'sleep-science',
    label: 'Sleep science',
    weight: 0.15,
    description:
      'Grounding in real sleep science — circadian methods, CBT-I, smart-wake timing — rather than vague relaxation claims.',
  },
  {
    id: 'insights',
    label: 'Insights and guidance',
    weight: 0.15,
    description:
      'Quality of the analysis the app gives back — trends, explanations and actionable recommendations, not just a score.',
  },
  {
    id: 'app-experience',
    label: 'App experience',
    weight: 0.1,
    description:
      'Clarity and friction of the app — interface, navigation and how easily it fits a nightly routine.',
  },
  {
    id: 'free-tier',
    label: 'Free tier',
    weight: 0.1,
    description:
      'How much is genuinely usable without paying — a working free tier versus a locked sample.',
  },
  {
    id: 'value',
    label: 'Value',
    weight: 0.1,
    description:
      'Price — one-time or subscription — weighed against what the app delivers.',
  },
]

/** Vagus-nerve stimulators: non-invasive (and one reference implanted)
 *  devices targeting the vagus nerve. Evidence and mechanism carry the
 *  most weight — the field is full of marketing claims weakly tied to
 *  what the hardware actually does. */
const VAGUS_STIM_CRITERIA: Criterion[] = [
  {
    id: 'evidence',
    label: 'Evidence and clinical backing',
    weight: 0.25,
    description:
      'Quality and quantity of peer-reviewed studies on the device itself — not the vagus nerve in general — plus FDA / CE clearances and the conditions they cover.',
  },
  {
    id: 'mechanism',
    label: 'Stimulation mechanism',
    weight: 0.2,
    description:
      'What the device does to the vagus nerve — electrical (transcutaneous tVNS at the ear or neck), implanted, vibrotactile or infrasonic — and how transparent its dosing parameters are.',
  },
  {
    id: 'protocols',
    label: 'Protocol flexibility',
    weight: 0.15,
    description:
      'Range and customisability of programmes — session lengths, intensities, modes (sleep, stress, focus, recovery) and whether parameters are documented or hidden behind a black-box app.',
  },
  {
    id: 'comfort',
    label: 'Comfort and wearability',
    weight: 0.15,
    description:
      'Form factor, skin tolerance and how realistic daily or session-based use is — handheld, ear clip, neck collar, chest pebble or wearable patch.',
  },
  {
    id: 'biofeedback',
    label: 'Biofeedback and data',
    weight: 0.15,
    description:
      'On-device or paired HRV measurement, session logging and integration with health apps — does it just stimulate, or close the loop with measurable output.',
  },
  {
    id: 'value',
    label: 'Value',
    weight: 0.1,
    description:
      'Hardware price together with any mandatory subscription or prescription, weighed against the evidence and what the device delivers.',
  },
]

/** Continuous Glucose Monitors for non-diabetic / biohacker use. Insight
 *  quality and sensor accuracy carry the most weight — eight out of ten
 *  CGM programmes on the consumer market are software/coaching wrappers
 *  around two underlying sensors (Abbott Libre 3 and Dexcom G7), so the
 *  real differentiator is what the app does with the data, not the
 *  hardware itself. */
const CGM_CRITERIA: Criterion[] = [
  {
    id: 'sensor-accuracy',
    label: 'Sensor accuracy and reliability',
    weight: 0.2,
    description:
      'Mean absolute relative difference (MARD) of the underlying sensor versus reference plasma glucose, sensor lifespan, drop-out and warm-up behaviour. Most consumer CGMs ride on either Abbott Libre 3 or Dexcom G7 — both well-validated, with G7 marginally more accurate in independent comparison.',
  },
  {
    id: 'insights',
    label: 'Insights and analysis quality',
    weight: 0.25,
    description:
      'How the app interprets glucose curves — meal scoring, food-by-food impact, time-in-range, fasting and overnight metrics, AUC and variability. This is the category’s real differentiator and the metric biohackers are paying for.',
  },
  {
    id: 'coaching',
    label: 'Coaching and guidance',
    weight: 0.15,
    description:
      'Form and quality of human or AI coaching included — registered dietitian, certified coach, AI agent or none. Substance of the guidance, not the marketing claim.',
  },
  {
    id: 'app-integration',
    label: 'App and integration UX',
    weight: 0.15,
    description:
      'Clarity of the app itself plus integration with the wider stack — Apple Health, Google Fit, Oura, Whoop, MyFitnessPal — so the CGM data composes with other biomarkers rather than living in a silo.',
  },
  {
    id: 'flexibility',
    label: 'Programme flexibility and data access',
    weight: 0.15,
    description:
      'Subscription terms, ability to pause or buy single sensors, whether raw glucose data can be exported, and how easy it is to leave without losing access to historical insights.',
  },
  {
    id: 'value',
    label: 'Value',
    weight: 0.1,
    description:
      'Total monthly or annual cost — hardware, sensors and any coaching subscription — weighed against insight depth and the credibility of the coaching layer.',
  },
]

/** EEG / brain-training headsets: consumer and developer wearables that
 *  measure (EEG, fNIRS) or modulate (tDCS) brain activity for focus,
 *  meditation, sleep or clinical neurofeedback. Signal quality and
 *  training-content depth lead the rubric — a noisy signal or an empty
 *  app turn the headset into a paperweight regardless of price. */
const EEG_HEADSET_CRITERIA: Criterion[] = [
  {
    id: 'signal-quality',
    label: 'Signal quality and sensor pedigree',
    weight: 0.2,
    description:
      'Sensor type and count (EEG channels, fNIRS optodes, tDCS electrode pairs), sampling rate, dry vs wet electrodes and how well a clean signal holds during a real session. For non-measurement devices (tDCS) this scores stimulation parameter transparency.',
  },
  {
    id: 'training-content',
    label: 'Training programmes and content',
    weight: 0.2,
    description:
      'Breadth and depth of guided sessions — meditations, focus exercises, neurofeedback protocols, clinical programmes — and whether the experience evolves with the user over months of use.',
  },
  {
    id: 'insights',
    label: 'Insights and analysis quality',
    weight: 0.15,
    description:
      'How the app interprets the brain signal — EEG band breakdowns, focus and calm metrics, session-by-session progression, sleep-stage analysis where applicable. The translation from raw signal to actionable feedback.',
  },
  {
    id: 'comfort',
    label: 'Comfort and wearability',
    weight: 0.1,
    description:
      'Headset weight, fit, electrode pressure and how realistic 20–60 minute sessions or overnight wear is in practice.',
  },
  {
    id: 'app-ux',
    label: 'App and integration UX',
    weight: 0.1,
    description:
      'Clarity of the app, friction of starting a session and whether data integrates with Apple Health, Google Fit and other wearables.',
  },
  {
    id: 'open-data',
    label: 'Open data and developer access',
    weight: 0.1,
    description:
      'Raw-signal export, SDK availability, third-party app ecosystem and how locked the user is into the manufacturer’s interpretation. Biohackers and researchers value this disproportionately.',
  },
  {
    id: 'value',
    label: 'Value',
    weight: 0.15,
    description:
      'Hardware price together with any required subscription, weighed against signal quality, content depth and developer access.',
  },
]

/** Criteria sets keyed by category. */
export const CRITERIA: Record<ReviewCategory, Criterion[]> = {
  'hrv-wearable': HRV_WEARABLE_CRITERIA,
  'meditation-app': MEDITATION_APP_CRITERIA,
  'sleep-app': SLEEP_APP_CRITERIA,
  'vagus-stim': VAGUS_STIM_CRITERIA,
  cgm: CGM_CRITERIA,
  'eeg-headset': EEG_HEADSET_CRITERIA,
}

/** Human-readable category labels for the hub and the methodology page. */
export const CATEGORY_LABELS: Record<ReviewCategory, string> = {
  'hrv-wearable': 'HRV trackers',
  'meditation-app': 'Meditation apps',
  'sleep-app': 'Sleep apps',
  'vagus-stim': 'Vagus nerve stimulators',
  cgm: 'Continuous glucose monitors',
  'eeg-headset': 'EEG & brain-training headsets',
}

/** Review categories in display order. */
export const REVIEW_CATEGORIES: ReviewCategory[] = [
  'hrv-wearable',
  'meditation-app',
  'sleep-app',
  'vagus-stim',
  'cgm',
  'eeg-headset',
]

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
