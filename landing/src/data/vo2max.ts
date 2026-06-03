/**
 * VO₂max estimation + fitness norms.
 *
 * No-test estimate via the Uth–Sørensen formula (2004):
 *   VO₂max ≈ 15.3 × (HRmax / HRrest)
 * Only needs max and resting heart rate — accessible, but a population
 * estimate with real error vs a lab test or a maximal field test (Cooper
 * 12-min, 1.5-mile). Resting HR is the big lever: a lower resting HR (fitter
 * heart) raises the estimate.
 *
 * Fitness categories are approximate Cooper Institute / ACSM percentile bands
 * by age and sex (ml/kg/min). Educational, not medical advice.
 */

export type Sex = 'male' | 'female'
export type FitnessCat = 'poor' | 'fair' | 'good' | 'excellent' | 'superior'

interface NormBand {
  minAge: number
  maxAge: number
  /** Upper bounds (inclusive) for poor / fair / good / excellent; above = superior. */
  poor: number
  fair: number
  good: number
  excellent: number
}

const MALE_NORMS: NormBand[] = [
  { minAge: 20, maxAge: 29, poor: 37, fair: 43, good: 51, excellent: 56 },
  { minAge: 30, maxAge: 39, poor: 34, fair: 40, good: 47, excellent: 53 },
  { minAge: 40, maxAge: 49, poor: 31, fair: 38, good: 44, excellent: 51 },
  { minAge: 50, maxAge: 59, poor: 28, fair: 35, good: 42, excellent: 49 },
  { minAge: 60, maxAge: 120, poor: 25, fair: 31, good: 38, excellent: 44 },
]

const FEMALE_NORMS: NormBand[] = [
  { minAge: 20, maxAge: 29, poor: 30, fair: 36, good: 41, excellent: 46 },
  { minAge: 30, maxAge: 39, poor: 28, fair: 33, good: 39, excellent: 44 },
  { minAge: 40, maxAge: 49, poor: 25, fair: 31, good: 36, excellent: 41 },
  { minAge: 50, maxAge: 59, poor: 22, fair: 28, good: 33, excellent: 39 },
  { minAge: 60, maxAge: 120, poor: 20, fair: 25, good: 31, excellent: 36 },
]

const CAT_LABEL: Record<FitnessCat, string> = {
  poor: 'Poor',
  fair: 'Fair',
  good: 'Good',
  excellent: 'Excellent',
  superior: 'Superior',
}

export interface Vo2Result {
  vo2max: number
  category: FitnessCat
  categoryLabel: string
  ageBand: string
  summary: string
}

/** Uth–Sørensen estimate from max + resting HR. */
export function estimateVo2max(hrMax: number, hrRest: number): number {
  if (hrRest <= 0) return 0
  return Math.round(15.3 * (hrMax / hrRest) * 10) / 10
}

export function classifyVo2max(vo2: number, age: number, sex: Sex): Vo2Result {
  const norms = sex === 'male' ? MALE_NORMS : FEMALE_NORMS
  const band = norms.find((b) => age >= b.minAge && age <= b.maxAge) ?? norms[0]
  let category: FitnessCat
  if (vo2 <= band.poor) category = 'poor'
  else if (vo2 <= band.fair) category = 'fair'
  else if (vo2 <= band.good) category = 'good'
  else if (vo2 <= band.excellent) category = 'excellent'
  else category = 'superior'

  const summaryByCat: Record<FitnessCat, string> = {
    poor: `An estimated ${vo2} ml/kg/min sits in the lower range for ${sex === 'male' ? 'men' : 'women'} aged ${band.minAge}–${band.maxAge}. The good news: VO₂max is one of the most trainable markers — Zone 2 base plus weekly high-intensity intervals move it fastest.`,
    fair: `${vo2} ml/kg/min is fair for your age and sex — a solid base to build on. Adding 1–2 VO₂max interval sessions a week on top of an aerobic base is the proven route up.`,
    good: `${vo2} ml/kg/min is good — above average cardiorespiratory fitness for ${sex === 'male' ? 'men' : 'women'} aged ${band.minAge}–${band.maxAge}. VO₂max is strongly tied to all-cause mortality, so this is real longevity capital.`,
    excellent: `${vo2} ml/kg/min is excellent — well above average. You have strong aerobic capacity; maintaining it through the decades is one of the highest-leverage longevity moves there is.`,
    superior: `${vo2} ml/kg/min is superior — elite-leaning aerobic capacity for your age and sex. Protect it: VO₂max naturally declines ~10% per decade after 30 without training.`,
  }
  return {
    vo2max: vo2,
    category,
    categoryLabel: CAT_LABEL[category],
    ageBand: `${band.minAge}–${band.maxAge === 120 ? '60+' : band.maxAge}`,
    summary: summaryByCat[category],
  }
}

export const VO2MAX_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'What is VO₂max?',
    a: 'VO₂max is the maximum volume of oxygen your body can use per minute (ml/kg/min) — the single best measure of cardiorespiratory fitness. It reflects how well your heart, lungs and muscles deliver and use oxygen, and it is one of the strongest predictors of longevity and all-cause mortality.',
  },
  {
    q: 'How is VO₂max estimated without a lab test?',
    a: 'This tool uses the Uth–Sørensen formula: VO₂max ≈ 15.3 × (max HR ÷ resting HR). It only needs your max and resting heart rate. A low resting HR (a sign of a fit, efficient heart) raises the estimate. It is a population approximation — accurate to within roughly ±10–15% of a lab measurement.',
  },
  {
    q: 'What is a good VO₂max for my age?',
    a: 'It declines with age and is higher in men on average. For men 30–39, "good" is roughly 41–47 ml/kg/min; for women 30–39, about 34–39. Below those is fair/poor, above is excellent/superior. The norms table on this page breaks it down by age and sex.',
  },
  {
    q: 'How do I improve my VO₂max?',
    a: 'The fastest route is a large aerobic base (Zone 2, conversational cardio) topped with 1–2 weekly high-intensity interval sessions (e.g. 4×4-minute efforts near max). VO₂max is highly trainable — meaningful gains show in 6–8 weeks — but it also declines ~10% per decade after 30 without training.',
  },
  {
    q: 'How accurate is the heart-rate estimate?',
    a: 'It is a convenient approximation, not a measurement. It depends on knowing your true max HR (formulas can be ±10–12 bpm off) and an accurate resting HR (measure it first thing in the morning, lying down). For a precise number, a lab VO₂max test or a maximal field test (Cooper 12-minute run) is better.',
  },
]
