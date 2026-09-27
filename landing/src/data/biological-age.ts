/**
 * Fitness age — the published HUNT non-exercise model (Nes et al.).
 *
 * 1. Estimated VO2max (mL/kg/min) from age, waist, resting heart rate and a
 *    physical-activity index (Nes 2011, Med Sci Sports Exerc 43(11):2024–30):
 *      men   = 100.27 − 0.296·age − 0.369·waist − 0.155·RHR + 0.226·PAI
 *      women =  74.74 − 0.247·age − 0.259·waist − 0.114·RHR + 0.198·PAI
 * 2. PAI = frequency × intensity × duration scores from the HUNT questionnaire
 *    (scoring as reported in Nauman 2012, PLoS ONE 7(9):e45021):
 *      frequency: <1/week 0 · once 1 · 2–3 times 2.5 · almost every day 5
 *      intensity: easy 1 · breathless & sweaty 2 · near exhaustion 3
 *      duration:  <15 min 0.1 · 15–29 min 0.38 · 30–60 min 0.75 · >60 min 1
 * 3. Fitness age = the age at which the average healthy person of your sex has
 *    the same VO2max, interpolated between the decade means
 *    of the HUNT3 Fitness Study (Loe 2013, 3,816 healthy adults, treadmill test).
 *
 * The model explains roughly 60% of the variation in measured VO2max, so this is
 * an estimate, not a lab result. Educational only — not a diagnosis.
 */

import type { ScienceSource } from './sources'

export type Sex = 'male' | 'female'
export type Freq = 'lt1' | 'once' | 'twoThree' | 'daily'
export type Intensity = 'easy' | 'breathless' | 'exhaustion'
export type Duration = 'lt15' | 'm15' | 'm30' | 'gt60'

export const FREQ_SCORE: Record<Freq, number> = { lt1: 0, once: 1, twoThree: 2.5, daily: 5 }
export const INTENSITY_SCORE: Record<Intensity, number> = { easy: 1, breathless: 2, exhaustion: 3 }
export const DURATION_SCORE: Record<Duration, number> = { lt15: 0.1, m15: 0.38, m30: 0.75, gt60: 1 }

/** Mean VO2max by decade — HUNT3 Fitness Study (Loe 2013, Table 2). Midpoint age → mL/kg/min. */
export const VO2_NORMS: Record<Sex, Array<[number, number]>> = {
  male: [[25, 54.4], [35, 49.1], [45, 47.2], [55, 42.6], [65, 39.2], [75, 35.3]],
  female: [[25, 43.0], [35, 40.0], [45, 38.4], [55, 34.4], [65, 31.1], [75, 28.3]],
}

export interface FitnessAgeInput {
  age: number
  sex: Sex
  waistCm: number
  restingHr: number
  freq: Freq
  intensity: Intensity
  duration: Duration
}

export interface FitnessAgeResult {
  vo2max: number
  pai: number
  fitnessAge: number
  /** fitnessAge − age (negative = fitter than average for your age). */
  delta: number
  /** Your VO2max as % of the healthy mean for your age and sex. */
  pctOfNorm: number
  normForAge: number
}

export function paiScore(freq: Freq, intensity: Intensity, duration: Duration): number {
  const f = FREQ_SCORE[freq]
  return f === 0 ? 0 : f * INTENSITY_SCORE[intensity] * DURATION_SCORE[duration]
}

export function estimateVo2(i: FitnessAgeInput): number {
  const pai = paiScore(i.freq, i.intensity, i.duration)
  return i.sex === 'male'
    ? 100.27 - 0.296 * i.age - 0.369 * i.waistCm - 0.155 * i.restingHr + 0.226 * pai
    : 74.74 - 0.247 * i.age - 0.259 * i.waistCm - 0.114 * i.restingHr + 0.198 * pai
}

/** Healthy-population mean VO2max at a given age (linear between decade midpoints, extrapolated at the ends). */
export function normAt(age: number, sex: Sex): number {
  const pts = VO2_NORMS[sex]
  const seg = age <= pts[0][0] ? [pts[0], pts[1]] : age >= pts[pts.length - 1][0] ? [pts[pts.length - 2], pts[pts.length - 1]]
    : [pts.find((_, k) => pts[k + 1] && age <= pts[k + 1][0])!, pts[pts.findIndex((_, k) => pts[k + 1] && age <= pts[k + 1][0]) + 1]]
  const [[a0, v0], [a1, v1]] = seg as [[number, number], [number, number]]
  return v0 + ((age - a0) / (a1 - a0)) * (v1 - v0)
}

/** Age at which the healthy mean equals this VO2max (inverse of normAt), clamped to 20–90. */
export function ageForVo2(vo2: number, sex: Sex): number {
  const pts = VO2_NORMS[sex]
  let seg: [[number, number], [number, number]]
  if (vo2 >= pts[0][1]) seg = [pts[0], pts[1]]
  else if (vo2 <= pts[pts.length - 1][1]) seg = [pts[pts.length - 2], pts[pts.length - 1]]
  else {
    const k = pts.findIndex((p, j) => pts[j + 1] && vo2 <= p[1] && vo2 >= pts[j + 1][1])
    seg = [pts[k], pts[k + 1]]
  }
  const [[a0, v0], [a1, v1]] = seg
  const age = a0 + ((vo2 - v0) / (v1 - v0)) * (a1 - a0)
  return Math.max(20, Math.min(90, age))
}

export function computeFitnessAge(i: FitnessAgeInput): FitnessAgeResult {
  const vo2 = estimateVo2(i)
  const fitnessAge = Math.round(ageForVo2(vo2, i.sex))
  const norm = normAt(i.age, i.sex)
  return {
    vo2max: Math.round(vo2 * 10) / 10,
    pai: Math.round(paiScore(i.freq, i.intensity, i.duration) * 100) / 100,
    fitnessAge,
    delta: fitnessAge - Math.round(i.age),
    pctOfNorm: Math.round((vo2 / norm) * 100),
    normForAge: Math.round(norm * 10) / 10,
  }
}

export const BIOAGE_SOURCES: ScienceSource[] = [
  {
    authors: 'Nes BM, Janszky I, Vatten LJ, Nilsen TIL, Aspenes ST, Wisløff U',
    year: 2011,
    title: 'Estimating V̇O2peak from a nonexercise prediction model: the HUNT Study, Norway',
    journal: 'Medicine & Science in Sports & Exercise, 43(11):2024–2030',
    contributes: 'The equations used here: estimated VO2max from age, waist circumference, resting heart rate and a physical-activity index, developed and validated in healthy adults of the Norwegian HUNT study.',
    url: 'https://doi.org/10.1249/MSS.0b013e31821d3f6f',
  },
  {
    authors: 'Nes BM, Vatten LJ, Nauman J, Janszky I, Wisløff U',
    year: 2014,
    title: 'A simple nonexercise model of cardiorespiratory fitness predicts long-term mortality',
    journal: 'Medicine & Science in Sports & Exercise, 46(6):1159–1165',
    contributes: 'In about 37,000 adults followed for an average of 24 years, this non-exercise fitness estimate predicted all-cause and cardiovascular mortality.',
    url: 'https://doi.org/10.1249/MSS.0000000000000219',
  },
  {
    authors: 'Loe H, Rognmo Ø, Saltin B, Wisløff U',
    year: 2013,
    title: 'Aerobic capacity reference data in 3816 healthy men and women 20–90 years',
    journal: 'PLoS ONE, 8(5):e64319',
    contributes: 'Mean treadmill-measured VO2max by decade for healthy men and women — the reference curve your fitness age is read from.',
    url: 'https://doi.org/10.1371/journal.pone.0064319',
  },
  {
    authors: 'Nauman J, Aspenes ST, Nilsen TIL, Vatten LJ, Wisløff U',
    year: 2012,
    title: 'A prospective population study of resting heart rate and peak oxygen uptake (the HUNT Study, Norway)',
    journal: 'PLoS ONE, 7(9):e45021',
    contributes: 'Documents the HUNT physical-activity index used here: frequency × intensity × duration scores from three questions.',
    url: 'https://doi.org/10.1371/journal.pone.0045021',
  },
  {
    authors: 'Mandsager K, Harb S, Cremer P, Phelan D, Nissen SE, Jaber W',
    year: 2018,
    title: 'Association of cardiorespiratory fitness with long-term mortality among adults undergoing exercise treadmill testing',
    journal: 'JAMA Network Open, 1(6):e183605',
    contributes: 'In 122,007 patients, higher cardiorespiratory fitness was linked to lower mortality with no upper limit — why fitness age is worth improving.',
    url: 'https://doi.org/10.1001/jamanetworkopen.2018.3605',
  },
]
