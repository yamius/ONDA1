/**
 * Blood-alcohol (BAC) estimate and time-to-sober via the Widmark equation.
 *
 *   BAC% = (A / (r · W)) · 100 − β · t
 *     A = grams of pure alcohol
 *     W = bodyweight in grams
 *     r = Widmark distribution ratio (≈0.68 men, ≈0.55 women)
 *     β = elimination rate (≈0.015 %/hour, typical range 0.013–0.017)
 *
 * Input is by drink (volume × strength → grams of ethanol, density 0.789 g/ml),
 * because a "standard drink" means 14 g in the US, 8 g in the UK and 10 g in
 * much of Europe, Australia and Japan. BAC is shown in % (g/100 ml) and in
 * per mille (‰ ≈ g/L). This is a population estimate with large individual
 * variation — it is NOT a tool for deciding whether it is safe or legal to
 * drive. Never drive after drinking.
 */

import type { ScienceSource } from './sources'

export type Sex = 'male' | 'female'

const ELIMINATION_PER_HOUR = 0.015
const R_MALE = 0.68
const R_FEMALE = 0.55

export interface AlcoholInput {
  kg: number
  sex: Sex
  /** Grams of pure alcohol consumed. */
  grams: number
  hoursSince: number // hours since first drink (elapsed metabolism)
}

export const ETHANOL_DENSITY = 0.789

/** Common drinks (volume ml, strength % ABV). Keys are translated in the UI. */
export const DRINK_PRESETS = [
  { key: 'beer', ml: 500, abv: 5 },
  { key: 'beerSmall', ml: 330, abv: 5 },
  { key: 'wine', ml: 150, abv: 12 },
  { key: 'spirits', ml: 40, abv: 40 },
] as const
export type DrinkKey = (typeof DRINK_PRESETS)[number]['key']

export function gramsOf(ml: number, abv: number): number {
  return ml * (abv / 100) * ETHANOL_DENSITY
}

export interface AlcoholResult {
  peakBac: number // estimated peak BAC (%)
  currentBac: number // BAC now, accounting for elapsed time
  hoursToSober: number // hours from NOW until BAC ~0.00
  /** BAC now in per mille (‰, ≈ g/L) — the unit used in most of Europe. */
  currentPermille: number
  peakPermille: number
}

export function computeAlcohol(input: AlcoholInput): AlcoholResult {
  const r = input.sex === 'male' ? R_MALE : R_FEMALE
  const A = Math.max(0, input.grams)
  const Wg = input.kg * 1000
  const peakBac = (A / (r * Wg)) * 100
  const elapsed = Math.max(0, input.hoursSince)
  const currentBac = Math.max(0, peakBac - ELIMINATION_PER_HOUR * elapsed)
  const hoursToSober = currentBac / ELIMINATION_PER_HOUR
  return {
    peakBac: Math.round(peakBac * 1000) / 1000,
    currentBac: Math.round(currentBac * 1000) / 1000,
    hoursToSober: Math.round(hoursToSober * 10) / 10,
    currentPermille: Math.round(currentBac * 1000) / 100,
    peakPermille: Math.round(peakBac * 1000) / 100,
  }
}

export const ALCOHOL_SOURCES: ScienceSource[] = [
  {
    authors: 'Watson PE, Watson ID, Batt RD',
    year: 1981,
    title: 'Prediction of blood alcohol concentrations in human subjects: updating the Widmark equation',
    journal: 'Journal of Studies on Alcohol, 42(7):547–556',
    contributes: 'Basis for the distribution-ratio values (r ≈ 0.68 men, 0.55 women) in the Widmark calculation.',
    url: 'https://doi.org/10.15288/jsa.1981.42.547',
  },
  {
    authors: 'Jones AW',
    year: 2010,
    title: 'Evidence-based survey of the elimination rates of ethanol from blood with applications in forensic casework',
    journal: 'Forensic Science International, 200(1–3):1–20',
    contributes: 'Supports the ~0.015%/hour elimination rate (typical range 0.013–0.017) used to project time-to-sober.',
    url: 'https://doi.org/10.1016/j.forsciint.2010.02.021',
  },
  {
    authors: 'National Institute on Alcohol Abuse and Alcoholism (NIAAA)',
    year: 2024,
    title: 'What is a standard drink?',
    journal: 'NIAAA, U.S. National Institutes of Health',
    contributes: 'Defines the U.S. standard drink as 14 g of pure alcohol (other countries use 8–10 g) — why this tool counts grams from volume and strength instead.',
    url: 'https://www.niaaa.nih.gov/alcohols-effects-health/what-standard-drink',
  },
]
