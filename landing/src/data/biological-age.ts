/**
 * Biological-age (a.k.a. "fitness age") estimate.
 *
 * IMPORTANT: this is NOT an epigenetic clock or a clinical biological age. It is
 * a transparent lifestyle estimate in the spirit of the Norwegian "fitness age"
 * model (Nes 2011): start from chronological age and shift it by modifiable
 * markers with well-established links to all-cause mortality — resting heart
 * rate (Zhang 2016), cardiorespiratory fitness/activity (Mandsager 2018), sleep
 * and smoking. It is a motivational mirror of your habits, not a diagnosis.
 * Educational only — and a deliberately calm, non-alarming framing.
 */

import type { ScienceSource } from './sources'

export type Smoking = 'never' | 'former' | 'current'

export interface ActivityOption {
  id: string
  label: string
  /** Years added/subtracted (fitness is the strongest modifiable longevity lever). */
  delta: number
}

export const BIOAGE_ACTIVITY: ActivityOption[] = [
  { id: 'sedentary', label: 'Sedentary — little/no exercise', delta: 4 },
  { id: 'light', label: 'Light — 1–2 days/week', delta: 1.5 },
  { id: 'moderate', label: 'Moderate — 3–4 days/week', delta: -1.5 },
  { id: 'high', label: 'High — 5+ days, incl. hard cardio', delta: -4 },
]

const SMOKING_DELTA: Record<Smoking, number> = { never: -1, former: 1, current: 6 }

export interface BioAgeInput {
  chronAge: number
  restingHr: number
  activityId: string
  sleepHours: number
  smoking: Smoking
}

export interface BioAgeResult {
  bioAge: number
  deltaYears: number // bioAge - chronAge (negative = younger)
  drivers: Array<{ label: string; years: number }>
  summary: string
}

function sleepDelta(h: number): number {
  if (h >= 7 && h <= 8.5) return -1
  if ((h >= 6.5 && h < 7) || (h > 8.5 && h <= 9)) return 0
  if (h >= 6 && h < 6.5) return 1
  if (h < 6) return 2.5
  return 1.5 // > 9 h
}

function rhrDelta(rhr: number): number {
  // ~+9% all-cause mortality per +10 bpm (Zhang 2016); reference ~65 bpm.
  const d = ((rhr - 65) / 10) * 1.5
  return Math.max(-6, Math.min(6, d))
}

export function computeBioAge(input: BioAgeInput): BioAgeResult | null {
  const { chronAge, restingHr, activityId, sleepHours, smoking } = input
  if (!chronAge || chronAge < 18 || chronAge > 100) return null
  if (!restingHr || restingHr < 35 || restingHr > 120) return null
  if (!sleepHours || sleepHours < 3 || sleepHours > 14) return null
  const activity = BIOAGE_ACTIVITY.find((a) => a.id === activityId) ?? BIOAGE_ACTIVITY[2]

  const drivers = [
    { label: 'Resting heart rate', years: Math.round(rhrDelta(restingHr) * 10) / 10 },
    { label: 'Activity & fitness', years: activity.delta },
    { label: 'Sleep', years: sleepDelta(sleepHours) },
    { label: 'Smoking', years: SMOKING_DELTA[smoking] },
  ]
  const rawDelta = drivers.reduce((s, d) => s + d.years, 0)
  const deltaYears = Math.max(-12, Math.min(15, Math.round(rawDelta)))
  const bioAge = Math.max(18, chronAge + deltaYears)

  let summary: string
  if (deltaYears <= -3)
    summary = `Your habits track younger than your age — about ${Math.abs(deltaYears)} years. The markers driving that (a strong resting heart rate, fitness, sleep) are exactly the ones worth protecting. Keep the trend, don't chase a number.`
  else if (deltaYears < 0)
    summary = `You're tracking a touch younger than your age. Small, consistent wins — a little more Zone-2 cardio, steadier sleep — compound over years.`
  else if (deltaYears === 0)
    summary = `You're tracking right around your age. The biggest levers from here are cardiorespiratory fitness and sleep consistency — both highly modifiable.`
  else
    summary = `Your habits currently track a few years older than your age. That's not a verdict — every input here is changeable, and fitness and resting heart rate respond within weeks. Direction matters more than today's number.`

  return { bioAge, deltaYears, drivers, summary }
}

export const BIOAGE_SOURCES: ScienceSource[] = [
  {
    authors: 'Nes BM, Janszky I, Wisløff U, et al.',
    year: 2011,
    title: 'Estimating V̇O2peak from a nonexercise prediction model: the HUNT Study, Norway',
    journal: 'Medicine & Science in Sports & Exercise, 43(11):2024–2030',
    contributes: 'Basis of the "fitness age" concept — estimating fitness (and an age equivalent) from non-exercise lifestyle markers.',
    url: 'https://doi.org/10.1249/MSS.0b013e31821d3f6f',
  },
  {
    authors: 'Mandsager K, Harb S, Cremer P, et al.',
    year: 2018,
    title: 'Association of cardiorespiratory fitness with long-term mortality among adults undergoing exercise treadmill testing',
    journal: 'JAMA Network Open, 1(6):e183605',
    contributes: 'Large cohort (122,007) showing fitness is inversely associated with mortality with no upper limit — why activity weighs heaviest here.',
    url: 'https://doi.org/10.1001/jamanetworkopen.2018.3605',
  },
  {
    authors: 'Zhang D, Shen X, Qi X',
    year: 2016,
    title: 'Resting heart rate and all-cause and cardiovascular mortality in the general population: a meta-analysis',
    journal: 'CMAJ, 188(3):E53–E63',
    contributes: 'Meta-analysis (1.2M people): each +10 bpm resting heart rate ≈ +9% all-cause mortality — the basis for the RHR adjustment.',
    url: 'https://doi.org/10.1503/cmaj.150535',
  },
]

export const BIOAGE_METHODOLOGY =
  'This is a lifestyle/"fitness age" estimate, not an epigenetic clock or a clinical biological age — those require bloodwork, DNA-methylation assays or a lab VO₂max test. It starts from your chronological age and shifts it using four modifiable markers with well-established links to all-cause mortality: cardiorespiratory fitness/activity (the strongest lever; Mandsager 2018, Nes 2011), resting heart rate (≈+9% mortality per +10 bpm; Zhang 2016), sleep duration (a U-shaped risk) and smoking. The adjustments are deliberately modest and transparent — shown broken down by driver — and capped, because no four-question model can capture genetics, medical history or your full life. Read it as a motivational mirror of your current habits, not a prediction or diagnosis. The point is the direction you can move it, not the exact figure — and definitely not anxiety over it.'

export const BIOAGE_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'How is biological age calculated here?',
    a: 'This tool gives a "fitness age" style estimate: it starts from your real age and adjusts it using four modifiable markers tied to longevity in the research — activity/fitness, resting heart rate, sleep and smoking. It is transparent (you see each driver) and intentionally conservative. It is not an epigenetic clock or a medical test.',
  },
  {
    q: 'Is this my real biological age?',
    a: 'No — and be wary of anything online that claims to give you a precise one. True biological-age measures use DNA-methylation "clocks", blood biomarkers or a lab VO₂max test. This is an educational estimate of how your lifestyle habits stack up against your chronological age, useful for motivation and direction, not diagnosis.',
  },
  {
    q: 'What lowers your biological age the most?',
    a: 'Cardiorespiratory fitness is the single biggest modifiable lever — a large study (Mandsager 2018) found higher fitness linked to lower mortality with no upper limit of benefit. A lower resting heart rate, consistent 7–8.5 hours of sleep, and not smoking all help too. Encouragingly, fitness and resting heart rate improve within weeks of training.',
  },
  {
    q: 'My result looks older than my age — should I worry?',
    a: 'No. It is a snapshot of changeable habits, not a verdict on your health or lifespan, and a four-question estimate can’t see your genetics or medical history. Treat a higher number as information, not alarm: every input is something you can move, and the direction of travel matters far more than a single figure. If you have real health concerns, see a clinician.',
  },
  {
    q: 'Why does resting heart rate affect the estimate?',
    a: 'A lower resting heart rate generally reflects a fitter, more efficient heart and stronger parasympathetic tone. A meta-analysis of over a million people (Zhang 2016) found each 10 beats-per-minute higher resting heart rate was associated with roughly 9% higher all-cause mortality, so it is a meaningful, easy-to-measure marker — and one you can lower with aerobic training.',
  },
]
