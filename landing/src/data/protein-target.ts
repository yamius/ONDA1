/**
 * Daily protein target model.
 *
 * Ranges (g per kg bodyweight per day) are drawn from the ISSN and ACSM
 * position stands on protein and exercise:
 *   - RDA minimum (sedentary, avoid deficiency): 0.8 g/kg
 *   - General active / fitness: 1.2–1.6 g/kg
 *   - Building muscle (resistance training, slight surplus): 1.6–2.2 g/kg
 *   - Fat loss / cutting (preserve lean mass in a deficit): 1.8–2.4 g/kg
 *   - Older adult (50+, blunt sarcopenia): 1.2–1.6 g/kg
 *
 * Computed on TOTAL bodyweight (the basis these position stands use). For
 * people with high body fat, lean-mass-based targets are more precise and
 * sit lower. Educational, not medical/dietetic advice.
 */

import type { ScienceSource } from './sources'

export interface ProteinGoal {
  id: string
  label: string
  loPerKg: number
  hiPerKg: number
  note: string
}

export const PROTEIN_GOALS: ProteinGoal[] = [
  { id: 'sedentary', label: 'General health (sedentary)', loPerKg: 0.8, hiPerKg: 1.0, note: 'Enough to avoid deficiency and maintain.' },
  { id: 'active', label: 'Active / general fitness', loPerKg: 1.2, hiPerKg: 1.6, note: 'Supports recovery from regular training.' },
  { id: 'muscle', label: 'Build muscle', loPerKg: 1.6, hiPerKg: 2.2, note: 'Resistance training + slight calorie surplus.' },
  { id: 'cut', label: 'Fat loss (preserve muscle)', loPerKg: 1.8, hiPerKg: 2.4, note: 'Higher protein protects lean mass in a deficit.' },
  { id: 'older', label: 'Older adult (50+)', loPerKg: 1.2, hiPerKg: 1.6, note: 'Counters age-related muscle loss (sarcopenia).' },
]

export interface ProteinResult {
  goal: ProteinGoal
  weightKg: number
  gLow: number
  gHigh: number
  /** Midpoint grams/day. */
  gMid: number
  /** Per-meal grams at the chosen meal count (midpoint). */
  perMeal: number
}

export function computeProtein(weightKg: number, goal: ProteinGoal, meals: number): ProteinResult {
  const gLow = Math.round(weightKg * goal.loPerKg)
  const gHigh = Math.round(weightKg * goal.hiPerKg)
  const gMid = Math.round((gLow + gHigh) / 2)
  return {
    goal,
    weightKg,
    gLow,
    gHigh,
    gMid,
    perMeal: Math.round(gMid / Math.max(1, meals)),
  }
}

export const PROTEIN_SOURCES: ScienceSource[] = [
  {
    authors: 'Jäger R, Kerksick CM, Campbell BI, et al.',
    year: 2017,
    title: 'International Society of Sports Nutrition Position Stand: protein and exercise',
    journal: 'Journal of the International Society of Sports Nutrition, 14:20',
    contributes: 'Primary basis for the active/strength ranges (≈1.4–2.0 g/kg, up to 2.4 g/kg in a deficit).',
    url: 'https://doi.org/10.1186/s12970-017-0177-8',
  },
  {
    authors: 'Thomas DT, Erdman KA, Burke LM',
    year: 2016,
    title: 'Nutrition and Athletic Performance — Joint Position Statement (ACSM, AND, DC)',
    journal: 'Medicine & Science in Sports & Exercise, 48(3):543–568',
    contributes: 'Corroborates the athlete protein ranges and per-meal distribution guidance.',
    url: 'https://doi.org/10.1249/MSS.0000000000000852',
  },
  {
    authors: 'Morton RW, Murphy KT, McKellar SR, et al.',
    year: 2018,
    title: 'A systematic review, meta-analysis and meta-regression of protein supplementation on resistance-training gains',
    journal: 'British Journal of Sports Medicine, 52(6):376–384',
    contributes: 'Source of the ≈1.6 g/kg/day plateau for maximising muscle gain.',
    url: 'https://doi.org/10.1136/bjsports-2017-097608',
  },
]

export const PROTEIN_METHODOLOGY =
  'Targets are expressed in grams per kg of total bodyweight, as the position stands report them. The 0.8 g/kg RDA is the minimum to avoid deficiency in sedentary adults — not the optimum. The ISSN (Jäger 2017) and ACSM/AND joint stand (Thomas 2016) put active and strength athletes at roughly 1.4–2.0 g/kg, and a meta-analysis (Morton 2018) places the muscle-gain plateau near 1.6 g/kg. In an energy deficit, 2.0–2.4 g/kg better preserves lean mass. Spread intake across meals (~0.4 g/kg each) for best muscle-protein synthesis. If your body fat is high, a lean-mass-based target runs lower than total-bodyweight figures.'

export const PROTEIN_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'Where do these protein targets come from?',
    a: 'The ranges come from the ISSN protein position stand (Jäger 2017), the ACSM/AND/DC joint statement (Thomas 2016), and a resistance-training meta-analysis (Morton 2018) that pins the muscle-gain plateau near 1.6 g/kg. Full citations are in the Sources section on this page. Targets use total bodyweight, per the position stands; the 0.8 g/kg RDA is a minimum, not an optimum.',
  },
  {
    q: 'How much protein do I need per day?',
    a: 'It depends on your goal. The 0.8 g/kg RDA only prevents deficiency. For an active person, 1.2–1.6 g/kg is a better target; for building muscle, 1.6–2.2 g/kg; and in a fat-loss phase, 1.8–2.4 g/kg helps preserve muscle. Multiply your bodyweight in kg by the range for your goal.',
  },
  {
    q: 'Is more protein always better?',
    a: 'No — there are diminishing returns above roughly 2.2 g/kg for most people, and extra protein is largely just used for energy. Very high intakes are safe for healthy kidneys but offer little extra muscle benefit. Hitting the range consistently matters more than exceeding it.',
  },
  {
    q: 'Should I spread protein across meals?',
    a: 'Yes. Muscle protein synthesis responds best to ~0.4 g/kg per meal across 3–4 meals, rather than one large dose. Each meal needs roughly 25–40 g of quality protein (enough leucine to trigger synthesis) for most adults.',
  },
  {
    q: 'Bodyweight or lean mass?',
    a: 'These targets use total bodyweight, which the sports-nutrition position stands are based on. If you carry high body fat, targets based on lean body mass are more accurate and will be somewhat lower — fat tissue does not need feeding with protein.',
  },
  {
    q: 'Why do older adults need more protein?',
    a: 'Ageing muscle becomes "anabolically resistant" — it responds less to a given dose of protein. Bumping intake to 1.2–1.6 g/kg, with adequate leucine per meal and resistance training, helps counter sarcopenia (age-related muscle loss), a major driver of frailty.',
  },
]
