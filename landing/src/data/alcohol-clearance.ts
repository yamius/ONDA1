/**
 * Blood-alcohol (BAC) estimate and time-to-sober via the Widmark equation.
 *
 *   BAC% = (A / (r · W)) · 100 − β · t
 *     A = grams of pure alcohol
 *     W = bodyweight in grams
 *     r = Widmark distribution ratio (≈0.68 men, ≈0.55 women)
 *     β = elimination rate (≈0.015 %/hour, typical range 0.013–0.017)
 *
 * One standard drink here = 14 g pure alcohol (US standard). This is a
 * population estimate with large individual variation — it is NOT a tool
 * for deciding whether it is safe or legal to drive. Never drive after drinking.
 */

export type Sex = 'male' | 'female'

const GRAMS_PER_STANDARD_DRINK = 14
const ELIMINATION_PER_HOUR = 0.015
const R_MALE = 0.68
const R_FEMALE = 0.55

export interface AlcoholInput {
  kg: number
  sex: Sex
  drinks: number // number of standard drinks
  hoursSince: number // hours since first drink (elapsed metabolism)
}

export interface AlcoholResult {
  peakBac: number // estimated peak BAC (%)
  currentBac: number // BAC now, accounting for elapsed time
  hoursToSober: number // hours from NOW until BAC ~0.00
  hoursToLegal: number // hours from NOW until BAC < 0.05 (common limit)
}

export function computeAlcohol(input: AlcoholInput): AlcoholResult {
  const r = input.sex === 'male' ? R_MALE : R_FEMALE
  const A = Math.max(0, input.drinks) * GRAMS_PER_STANDARD_DRINK
  const Wg = input.kg * 1000
  const peakBac = (A / (r * Wg)) * 100
  const elapsed = Math.max(0, input.hoursSince)
  const currentBac = Math.max(0, peakBac - ELIMINATION_PER_HOUR * elapsed)
  const hoursToSober = currentBac / ELIMINATION_PER_HOUR
  const hoursToLegal = Math.max(0, (currentBac - 0.05) / ELIMINATION_PER_HOUR)
  return {
    peakBac: Math.round(peakBac * 1000) / 1000,
    currentBac: Math.round(currentBac * 1000) / 1000,
    hoursToSober: Math.round(hoursToSober * 10) / 10,
    hoursToLegal: Math.round(hoursToLegal * 10) / 10,
  }
}

/** Format decimal hours as "Xh Ym". */
export function formatHours(h: number): string {
  if (h <= 0) return 'now'
  const whole = Math.floor(h)
  const mins = Math.round((h - whole) * 60)
  if (whole === 0) return `${mins}m`
  if (mins === 0) return `${whole}h`
  return `${whole}h ${mins}m`
}

export const ALCOHOL_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'How long does it take to sober up?',
    a: 'Your body clears alcohol at a roughly fixed rate — about 0.015% BAC per hour, or close to one standard drink per hour — regardless of coffee, cold showers or food. So four drinks can take five to six hours or more to fully clear. Nothing reliably speeds this up; only time lowers your BAC.',
  },
  {
    q: 'How is blood alcohol content (BAC) estimated?',
    a: 'This tool uses the Widmark equation: it divides the grams of pure alcohol consumed by your bodyweight and a distribution ratio (about 0.68 for men, 0.55 for women), then subtracts the alcohol eliminated since your first drink. One standard drink is treated as 14 g of pure alcohol.',
  },
  {
    q: 'Is this accurate enough to decide if I can drive?',
    a: 'No. This is an educational population estimate with large individual variation — genetics, food, medication, liver health and drink strength all shift the real number. Never use it to decide whether it is safe or legal to drive. If you have been drinking, do not drive; arrange another way home.',
  },
  {
    q: 'Why does alcohol wreck my sleep?',
    a: 'Alcohol helps you fall asleep but fragments the second half of the night: it suppresses REM sleep, increases awakenings and lowers heart-rate variability (HRV) as your body metabolises it. That is why even a few drinks can leave you feeling unrested and show up as poor recovery on a wearable the next morning.',
  },
  {
    q: 'Does body size and sex change how alcohol affects me?',
    a: 'Yes. The same number of drinks produces a higher BAC in a smaller person, because the alcohol is distributed through less body water. Women tend to reach a higher BAC than men of the same weight because of differences in body-water proportion, which is why the formula uses a lower distribution ratio for women.',
  },
]
