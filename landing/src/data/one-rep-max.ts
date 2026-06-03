/**
 * One-rep-max (1RM) estimator + training-load table.
 *
 * Estimates the most you could lift once from a weight you lifted for multiple
 * reps, using two long-standing prediction equations:
 *   Epley (1985):   1RM = w · (1 + reps/30)
 *   Brzycki (1993): 1RM = w · 36 / (37 − reps)
 * They agree closely at low reps and diverge as reps climb, so we show both and
 * their average. Accuracy is best at ≤6 reps and degrades beyond ~10–12 (see
 * LeSuer 1997). Educational estimate — true 1RM requires a supervised test.
 */

import type { ScienceSource } from './sources'

export interface OrmLoadRow {
  pct: number
  reps: number
  weight: number
}

export interface OrmResult {
  epley: number
  brzycki: number
  average: number
  table: OrmLoadRow[]
}

/** Standard rep target at each %1RM (a widely used training-load chart). */
const LOAD_CHART: Array<{ pct: number; reps: number }> = [
  { pct: 100, reps: 1 },
  { pct: 95, reps: 2 },
  { pct: 90, reps: 4 },
  { pct: 85, reps: 6 },
  { pct: 80, reps: 8 },
  { pct: 75, reps: 10 },
  { pct: 70, reps: 12 },
]

export function epley1rm(weight: number, reps: number): number {
  if (reps <= 1) return weight
  return weight * (1 + reps / 30)
}

export function brzycki1rm(weight: number, reps: number): number {
  if (reps <= 1) return weight
  if (reps >= 37) return weight // guard against the asymptote
  return (weight * 36) / (37 - reps)
}

/** Round to the nearest `step` (2.5 kg / 5 lb plates are typical). */
function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step
}

export function computeOneRepMax(weight: number, reps: number, step = 2.5): OrmResult {
  const epley = epley1rm(weight, reps)
  const brzycki = brzycki1rm(weight, reps)
  const average = (epley + brzycki) / 2
  const table = LOAD_CHART.map((row) => ({
    pct: row.pct,
    reps: row.reps,
    weight: roundTo((average * row.pct) / 100, step),
  }))
  return {
    epley: Math.round(epley * 10) / 10,
    brzycki: Math.round(brzycki * 10) / 10,
    average: Math.round(average * 10) / 10,
    table,
  }
}

export const ONE_REP_MAX_SOURCES: ScienceSource[] = [
  {
    authors: 'Brzycki M',
    year: 1993,
    title: 'Strength testing — predicting a one-rep max from reps-to-fatigue',
    journal: 'Journal of Physical Education, Recreation & Dance, 64(1):88–90',
    contributes: 'The Brzycki prediction equation (1RM = w · 36 / (37 − reps)) used here.',
    url: 'https://doi.org/10.1080/07303084.1993.10606684',
  },
  {
    authors: 'LeSuer DA, McCormick JH, Mayhew JL, Wasserstein RL, Arnold MD',
    year: 1997,
    title: 'The accuracy of prediction equations for estimating 1-RM performance in the bench press, squat, and deadlift',
    journal: 'Journal of Strength and Conditioning Research, 11(4):211–213',
    contributes: 'Validation showing these equations are most accurate at low reps and lose accuracy past ~10 reps.',
    url: 'https://journals.lww.com/nsca-jscr/abstract/1997/11000/the_accuracy_of_prediction_equations_for.1.aspx',
  },
]

export const ONE_REP_MAX_METHODOLOGY =
  'Your one-rep max is estimated from a sub-maximal set using two established equations: Epley (1985), 1RM = weight × (1 + reps/30), and Brzycki (1993), 1RM = weight × 36 / (37 − reps). They track each other closely at low reps and diverge as reps rise, so we report both and their average. A validation study (LeSuer 1997) found such equations most accurate at roughly 6 reps or fewer and increasingly approximate beyond ~10–12 reps — so a heavy triple predicts your max far better than a light set of 15. Loads in the table are the average estimate scaled to common %1RM training targets, rounded to the nearest 2.5 kg / 5 lb. This is an estimate, not a substitute for a properly warmed-up, supervised max test.'

export const ONE_REP_MAX_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'Where do these 1RM numbers come from?',
    a: 'The estimate uses the Epley (1985) and Brzycki (1993) prediction equations and reports their average; a validation study (LeSuer 1997) found such formulas most accurate at low reps. Full citations are in the Sources section on this page. For best accuracy, enter a set of 6 reps or fewer.',
  },
  {
    q: 'How accurate is an estimated one-rep max?',
    a: 'Very good when the set is heavy and short. Prediction equations correlate strongly with measured 1RM (r > 0.95) for sets up to about 6 reps, then drift as reps increase because endurance and technique start to dominate. Treat a number from a set of 12+ as a ballpark only.',
  },
  {
    q: 'How many reps should I enter for the best estimate?',
    a: 'Use a recent, genuinely hard set of 2–6 reps where the last rep was close to failure with good form. That range sits in the sweet spot of the prediction equations. Avoid using sets taken well short of failure — they will under-estimate your max.',
  },
  {
    q: 'Should I actually train at these percentages?',
    a: 'The load table is a starting point for programming: heavy strength work sits around 85–95% for low reps, hypertrophy around 67–80% for moderate reps, and technique or speed work lower. Real readiness varies day to day, so use RPE/RIR (reps in reserve) to autoregulate rather than chasing the exact number.',
  },
  {
    q: 'Is it safe to test my true one-rep max?',
    a: 'For trained lifters with sound technique it can be, but it carries more injury risk and fatigue than a sub-maximal estimate — which is why most coaches program from estimated maxes. If you do test, warm up thoroughly, use a spotter or safeties, and stop if form breaks down. This tool is educational, not coaching or medical advice.',
  },
]
