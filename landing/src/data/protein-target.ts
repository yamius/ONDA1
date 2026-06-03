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

export const PROTEIN_FAQ: Array<{ q: string; a: string }> = [
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
