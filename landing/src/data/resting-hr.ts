/**
 * Resting heart rate (RHR) reference by age + fitness category.
 *
 * RHR varies more with FITNESS than with age — a fit person of any age tends
 * to sit lower. These bands are APPROXIMATE, derived from widely used resting-HR
 * fitness charts and clinical reference ranges (normal ~50–90 bpm; Nanchen 2018),
 * with the caveat that women average a few bpm higher and RHR is partly genetic.
 * A lower RHR generally reflects a fitter, more efficient heart, and each +10 bpm
 * is associated with higher mortality risk (Zhang 2016). Educational, not medical.
 */

import type { ScienceSource } from './sources'

export interface RhrBand {
  minAge: number
  maxAge: number
  label: string
  /** Upper bound (inclusive) for athlete / excellent / good / average; above = elevated. */
  athlete: number
  excellent: number
  good: number
  average: number
}

export const RHR_AGE_BANDS: RhrBand[] = [
  { minAge: 18, maxAge: 25, label: '18–25', athlete: 55, excellent: 61, good: 65, average: 73 },
  { minAge: 26, maxAge: 35, label: '26–35', athlete: 54, excellent: 61, good: 65, average: 74 },
  { minAge: 36, maxAge: 45, label: '36–45', athlete: 56, excellent: 62, good: 66, average: 75 },
  { minAge: 46, maxAge: 55, label: '46–55', athlete: 57, excellent: 63, good: 67, average: 76 },
  { minAge: 56, maxAge: 65, label: '56–65', athlete: 56, excellent: 61, good: 67, average: 75 },
  { minAge: 66, maxAge: 120, label: '65+', athlete: 55, excellent: 61, good: 65, average: 73 },
]

export type RhrTier = 'athlete' | 'excellent' | 'good' | 'average' | 'elevated'

export interface RhrResult {
  band: RhrBand
  tier: RhrTier
  tierLabel: string
  summary: string
}

const TIER_LABEL: Record<RhrTier, string> = {
  athlete: 'Athlete',
  excellent: 'Excellent',
  good: 'Good',
  average: 'Average',
  elevated: 'Above average',
}

export function bandForAge(age: number): RhrBand {
  return RHR_AGE_BANDS.find((b) => age >= b.minAge && age <= b.maxAge) ?? RHR_AGE_BANDS[0]
}

export function interpretRhr(age: number, rhr: number): RhrResult {
  const band = bandForAge(age)
  let tier: RhrTier
  if (rhr <= band.athlete) tier = 'athlete'
  else if (rhr <= band.excellent) tier = 'excellent'
  else if (rhr <= band.good) tier = 'good'
  else if (rhr <= band.average) tier = 'average'
  else tier = 'elevated'

  const summaryByTier: Record<RhrTier, string> = {
    athlete: `${rhr} bpm is in the athletic range for ${band.label} — a sign of a strong, efficient heart. (Endurance athletes often sit in the 40s–50s.)`,
    excellent: `${rhr} bpm is excellent for ${band.label} — well below average, reflecting good cardiovascular fitness.`,
    good: `${rhr} bpm is good for ${band.label} — a healthy resting heart rate with room to lower it through aerobic training.`,
    average: `${rhr} bpm is around average for ${band.label}. It's within the normal range, and Zone-2 cardio is the most reliable way to bring it down over time.`,
    elevated: `${rhr} bpm is above the typical range for ${band.label}. A single reading is easily raised by caffeine, stress, poor sleep or illness — but a consistently elevated resting heart rate is worth discussing with a doctor.`,
  }
  return { band, tier, tierLabel: TIER_LABEL[tier], summary: summaryByTier[tier] }
}

export const RHR_SOURCES: ScienceSource[] = [
  {
    authors: 'Nanchen D',
    year: 2018,
    title: 'Resting heart rate: what is normal?',
    journal: 'Heart, 104(13):1048–1049',
    contributes: 'Clinical reference: a normal resting heart rate is ~50–90 bpm, lower in the very fit, slightly higher in women, and partly genetic.',
    url: 'https://doi.org/10.1136/heartjnl-2017-312731',
  },
  {
    authors: 'Zhang D, Shen X, Qi X',
    year: 2016,
    title: 'Resting heart rate and all-cause and cardiovascular mortality in the general population: a meta-analysis',
    journal: 'CMAJ, 188(3):E53–E63',
    contributes: 'Meta-analysis (1.2M people): each +10 bpm resting heart rate ≈ +9% all-cause mortality — why a lower RHR matters.',
    url: 'https://doi.org/10.1503/cmaj.150535',
  },
]

export const RHR_METHODOLOGY =
  'Resting heart rate is the number of times your heart beats per minute at complete rest — best measured first thing in the morning before getting up. A normal adult range is about 50–90 bpm (Nanchen 2018); well-trained people often sit in the 40s–50s. These reference bands are approximate, derived from widely used resting-HR fitness charts: they vary a little by age, but RHR depends more on fitness than age, and women average a few bpm higher than men. A lower RHR generally signals a fitter, more efficient heart — and it matters, since each 10 bpm higher resting heart rate is associated with roughly 9% higher all-cause mortality (Zhang 2016). This is an educational reference, not a diagnosis: single readings swing with caffeine, stress, sleep, heat and illness, so track your own morning trend, and see a clinician about a persistently high or very low rate or symptoms.'

export const RHR_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'What is a normal resting heart rate by age?',
    a: 'For most adults a normal resting heart rate is about 50–90 bpm, and it changes surprisingly little across adult age groups — fitness matters more than age. A "good" rate is roughly in the low 60s or below; athletes often sit in the 40s–50s. Use the chart on this page to see where your number falls against fitness categories for your age band.',
  },
  {
    q: 'How do I measure my resting heart rate accurately?',
    a: 'Measure first thing in the morning, before you get out of bed and before caffeine. Count your pulse for 30 seconds and double it, or use a wearable’s overnight/resting figure. Take it under the same conditions on several days and use the average — single readings are easily thrown off by stress, caffeine, heat or a poor night’s sleep.',
  },
  {
    q: 'Is a lower resting heart rate better?',
    a: 'Generally yes, within reason. A lower resting heart rate usually reflects a fitter, more efficient heart, and population data link a higher resting rate to greater mortality risk — about 9% per extra 10 bpm (Zhang 2016). Very low rates are normal in trained athletes, but a low rate with dizziness or fainting, or a persistently high rate, should be checked by a doctor.',
  },
  {
    q: 'How can I lower my resting heart rate?',
    a: 'Aerobic fitness is the most reliable lever — regular Zone-2 cardio lowers resting heart rate over weeks to months. Better sleep, less alcohol and caffeine, slow breathing/HRV practice, hydration and stress management all help too. Improvements are gradual; track your morning trend rather than reacting to any single day.',
  },
  {
    q: 'Why is my resting heart rate high some mornings?',
    a: 'Day-to-day spikes are normal and informative: alcohol the night before, poor or short sleep, illness brewing, dehydration, heat, late meals and high stress all raise morning resting heart rate. That’s why a sustained rise above your personal baseline is often an early sign you need recovery — and why the trend matters more than any one reading.',
  },
]
