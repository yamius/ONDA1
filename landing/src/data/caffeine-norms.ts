/**
 * Caffeine pharmacokinetics for the "last cup before bed" calculator.
 *
 * Model: first-order elimination. residual(t) = dose · 0.5^(t / halfLife).
 * Mean caffeine half-life in healthy adults is ~5–6 h; we use 5.5 h as the
 * default and let the user widen it, because it varies a LOT between people:
 *   - faster (≈4 h): smokers, some CYP1A2 fast-metabolisers
 *   - slower (≈8–9 h+): pregnancy, oral contraceptives, liver load, some meds
 * Sleep-disruption threshold: published work (Drake 2013) shows caffeine even
 * 6 h before bed measurably cuts sleep. We treat ~50 mg residual at bedtime
 * as the "unlikely to disrupt sleep for most people" line (superseded: now 35 mg,
 * calibrated to the Gardiner 2023 meta-analysis).
 *
 * Educational, not medical advice — individual sensitivity varies widely.
 */

import type { ScienceSource } from './sources'

export const DEFAULT_HALF_LIFE_H = 5.5
/** Calibrated to Gardiner 2023: 107 mg coffee → ≥8.8 h, 217.5 mg pre-workout → ≥13.2 h before bed. */
export const SLEEP_THRESHOLD_MG = 35

export interface CaffeineDrink {
  id: string
  /** Display name and serving note come from the page's language file. */
  mg: number
}

/** Approximate caffeine content (mg) of common sources. */
export const CAFFEINE_DRINKS: CaffeineDrink[] = [
  { id: 'espresso', mg: 63 },
  { id: 'coffee', mg: 95 },
  { id: 'coffee-large', mg: 155 },
  { id: 'cold-brew', mg: 205 },
  { id: 'energy', mg: 80 },
  { id: 'preworkout', mg: 200 },
  { id: 'matcha', mg: 70 },
  { id: 'black-tea', mg: 47 },
  { id: 'green-tea', mg: 28 },
  { id: 'cola', mg: 40 },
  { id: 'dark-chocolate', mg: 24 },
]

export interface CaffeineResult {
  /** Hours before bed the last dose should be taken to drop below threshold. */
  hoursBeforeBed: number
  /** Residual caffeine (mg) still in the body at bedtime if taken NOW-ish,
   *  i.e. for the chosen gap. Used for the curve label. */
  residualAtBedtimeIfNow: number
  /** Cutoff clock time "HH:MM" given the bedtime. */
  /** Cut-off as minutes since midnight. */
  cutoffMin: number
  /** Decay samples: hours-after-dose → residual mg, for the mini chart. */
  curve: Array<{ h: number; mg: number }>
}

/** Parse "HH:MM" → minutes since midnight, or null. */
export function parseTime(t: string): number | null {
  const m = t.match(/^(\d{1,2}):(\d{2})$/)
  if (!m) return null
  const h = parseInt(m[1], 10)
  const min = parseInt(m[2], 10)
  if (h > 23 || min > 59) return null
  return h * 60 + min
}

/**
 * Given a dose, bedtime and half-life, compute how many hours before bed the
 * dose must be taken so residual at bedtime ≤ threshold, plus the cutoff
 * clock time and a decay curve.
 */
export function caffeineCutoff(
  doseMg: number,
  bedtimeMin: number,
  halfLifeH = DEFAULT_HALF_LIFE_H,
  thresholdMg = SLEEP_THRESHOLD_MG,
): CaffeineResult {
  // residual = dose · 0.5^(t/hl) = threshold  →  t = hl · log2(dose/threshold)
  const hoursBeforeBed = doseMg <= thresholdMg ? 0 : halfLifeH * Math.log2(doseMg / thresholdMg)
  const cutoffMin = bedtimeMin - Math.round(hoursBeforeBed * 60)
  const curve: Array<{ h: number; mg: number }> = []
  for (let h = 0; h <= 12; h++) {
    curve.push({ h, mg: Math.round(doseMg * Math.pow(0.5, h / halfLifeH)) })
  }
  return {
    hoursBeforeBed,
    residualAtBedtimeIfNow: Math.round(doseMg * Math.pow(0.5, hoursBeforeBed / halfLifeH)),
    cutoffMin: ((cutoffMin % 1440) + 1440) % 1440,
    curve,
  }
}

export const CAFFEINE_SOURCES: ScienceSource[] = [
  {
    authors: 'Gardiner C, Weakley J, Burke LM, Roach GD, Sargent C, Maniar N, Townshend A, Halson SL',
    year: 2023,
    title: 'The effect of caffeine on subsequent sleep: a systematic review and meta-analysis',
    journal: 'Sleep Medicine Reviews, 69:101764',
    contributes: '',
    url: 'https://doi.org/10.1016/j.smrv.2023.101764',
  },
  {
    authors: 'Drake C, Roehrs T, Shambroom J, Roth T',
    year: 2013,
    title: 'Caffeine effects on sleep taken 0, 3, or 6 hours before going to bed',
    journal: 'Journal of Clinical Sleep Medicine, 9(11):1195–1200',
    contributes: '',
    url: 'https://doi.org/10.5664/jcsm.3170',
  },
  {
    authors: 'Nehlig A',
    year: 2018,
    title: 'Interindividual differences in caffeine metabolism and factors driving caffeine consumption',
    journal: 'Pharmacological Reviews, 70(2):384–411',
    contributes: '',
    url: 'https://doi.org/10.1124/pr.117.014407',
  },
]
