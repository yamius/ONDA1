/**
 * Body-fat % estimate via the U.S. Navy circumference method
 * (Hodgdon & Beckett, 1984). Tape-measure only — no calipers or scale.
 *
 *   men:   %BF = 495 / (1.0324 − 0.19077·log10(waist−neck) + 0.15456·log10(height)) − 450
 *   women: %BF = 495 / (1.29579 − 0.35004·log10(waist+hip−neck) + 0.22100·log10(height)) − 450
 * (circumferences and height in cm; log10).
 *
 * Standard error ≈ 3–4% body fat vs hydrostatic weighing — good for tracking
 * a trend, not a precise clinical value. Educational, not medical advice.
 */

import type { ScienceSource } from './sources'

export type Sex = 'male' | 'female'

export interface BodyFatInput {
  sex: Sex
  heightCm: number
  neckCm: number
  waistCm: number
  /** Hip circumference (women only). */
  hipCm?: number
}

export type BfCategory = 'essential' | 'athletes' | 'fitness' | 'average' | 'obese'

export interface BodyFatResult {
  percent: number
  category: BfCategory
  categoryLabel: string
  /** Fat mass / lean mass need a weight; left to the page if provided. */
  summary: string
}

/** ACE body-fat category cut-offs by sex (%). */
const CATEGORIES: Record<Sex, Array<{ max: number; cat: BfCategory; label: string }>> = {
  male: [
    { max: 5, cat: 'essential', label: 'Essential fat' },
    { max: 13, cat: 'athletes', label: 'Athletic' },
    { max: 17, cat: 'fitness', label: 'Fitness' },
    { max: 24, cat: 'average', label: 'Average' },
    { max: 100, cat: 'obese', label: 'Above average' },
  ],
  female: [
    { max: 13, cat: 'essential', label: 'Essential fat' },
    { max: 20, cat: 'athletes', label: 'Athletic' },
    { max: 24, cat: 'fitness', label: 'Fitness' },
    { max: 31, cat: 'average', label: 'Average' },
    { max: 100, cat: 'obese', label: 'Above average' },
  ],
}

function log10(x: number): number {
  return Math.log(x) / Math.LN10
}

/** Returns null if the inputs are physically impossible (e.g. waist ≤ neck). */
export function computeBodyFat(input: BodyFatInput): BodyFatResult | null {
  const { sex, heightCm, neckCm, waistCm, hipCm } = input
  if (heightCm <= 0 || neckCm <= 0 || waistCm <= 0) return null

  let percent: number
  if (sex === 'male') {
    if (waistCm - neckCm <= 0) return null
    percent =
      495 /
        (1.0324 - 0.19077 * log10(waistCm - neckCm) + 0.15456 * log10(heightCm)) -
      450
  } else {
    if (!hipCm || hipCm <= 0) return null
    if (waistCm + hipCm - neckCm <= 0) return null
    percent =
      495 /
        (1.29579 - 0.35004 * log10(waistCm + hipCm - neckCm) + 0.22100 * log10(heightCm)) -
      450
  }
  if (!isFinite(percent) || percent <= 0 || percent > 75) return null
  percent = Math.round(percent * 10) / 10

  const cats = CATEGORIES[sex]
  const hit = cats.find((c) => percent <= c.max) ?? cats[cats.length - 1]
  const summaryByCat: Record<BfCategory, string> = {
    essential: `${percent}% is at or below the essential-fat floor for ${sex === 'male' ? 'men' : 'women'} — very lean, and sustained levels this low can impair hormones and recovery.`,
    athletes: `${percent}% sits in the athletic range — lean and performance-oriented. Easy to maintain with consistent training and adequate protein.`,
    fitness: `${percent}% is a lean, healthy "fitness" level for ${sex === 'male' ? 'men' : 'women'} — a sustainable place for most active people.`,
    average: `${percent}% is around average for ${sex === 'male' ? 'men' : 'women'}. A modest, gradual deficit plus resistance training shifts this toward the fitness range while keeping muscle.`,
    obese: `${percent}% is above the average band. The highest-leverage moves are a sustainable calorie deficit, daily steps and resistance training to preserve lean mass — track the trend over months, not days.`,
  }
  return { percent, category: hit.cat, categoryLabel: hit.label, summary: summaryByCat[hit.cat] }
}

export const BODY_FAT_SOURCES: ScienceSource[] = [
  {
    authors: 'Hodgdon JA, Beckett MB',
    year: 1984,
    title: 'Prediction of percent body fat for U.S. Navy men from body circumferences and height (Report 84-11)',
    journal: 'Naval Health Research Center, San Diego, CA',
    contributes: 'The men’s circumference equation used here (waist, neck, height).',
    url: 'https://apps.dtic.mil/sti/citations/ADA143890',
  },
  {
    authors: 'Hodgdon JA, Beckett MB',
    year: 1984,
    title: 'Prediction of percent body fat for U.S. Navy women from body circumferences and height (Report 84-29)',
    journal: 'Naval Health Research Center, San Diego, CA',
    contributes: 'The women’s circumference equation (waist, hip, neck, height).',
    url: 'https://apps.dtic.mil/sti/citations/ADA143890',
  },
]

export const BODY_FAT_METHODOLOGY =
  'This uses the U.S. Navy circumference method (Hodgdon & Beckett, 1984) — a tape measure only, no calipers or scale. It estimates body fat from the log of your waist (and hip, for women) minus neck, against height. The published standard error is roughly 3–4% body fat versus hydrostatic (underwater) weighing, so it is reliable for tracking a trend over weeks but not a precise clinical figure; methods like DEXA or air-displacement plethysmography are more accurate. Measure relaxed, at the end of a normal breath: waist at the navel (men) or the narrowest point (women), neck below the larynx, hips at the widest point. Category bands follow common ACE fitness cut-offs. Educational only, not medical advice.'

export const BODY_FAT_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'Where do these body-fat numbers come from?',
    a: 'The estimate uses the U.S. Navy circumference equations developed by Hodgdon & Beckett at the Naval Health Research Center in 1984 (Reports 84-11 for men and 84-29 for women). Full citations are in the Sources section on this page. Category labels follow common ACE fitness ranges.',
  },
  {
    q: 'How accurate is the Navy body-fat method?',
    a: 'It has a standard error of about 3–4% body fat compared with hydrostatic weighing — good enough to track changes over time with a tape measure, but not a precise clinical value. DEXA, hydrostatic weighing and air-displacement plethysmography (Bod Pod) are more accurate; skinfold calipers are similar in error to this method when done well.',
  },
  {
    q: 'How do I measure correctly?',
    a: 'Use a flexible tape, snug but not compressing, relaxed and at the end of a normal exhale. Neck: just below the larynx. Waist: at the navel for men, at the narrowest point for women. Hips (women): at the widest point of the buttocks. Take each measurement twice and average them, and measure under the same conditions each time for consistent trends.',
  },
  {
    q: 'What is a healthy body-fat percentage?',
    a: 'Rough ACE ranges: for men, ~6–13% is athletic, 14–17% fitness, 18–24% average; for women, ~14–20% athletic, 21–24% fitness, 25–31% average. Essential fat (the minimum for health) is about 2–5% in men and 10–13% in women. "Healthy" varies with age, genetics and goals — the trend matters more than a single number.',
  },
  {
    q: 'Why does the women’s formula need a hip measurement?',
    a: 'Women carry proportionally more fat around the hips, so the equation Hodgdon & Beckett fitted for women includes hip circumference alongside waist and neck to predict body fat accurately. The men’s equation uses only waist and neck against height.',
  },
]
