/**
 * Population reference ranges for night-time RMSSD HRV by age.
 *
 * These are APPROXIMATE population percentiles (ms) DERIVED from the published
 * normative HRV literature (see HRV_SOURCES below) — chiefly the Nunan 2010
 * meta-analysis, the Umetani 1998 nine-decade age-decline data, and the Voss
 * 2015 age/sex cohort — adjusted upward for the night-time/overnight context
 * that consumer wearables (Oura, Whoop, Garmin) measure, where parasympathetic
 * tone (and therefore RMSSD) is highest. See HRV_METHODOLOGY for how the bands
 * were built and why night-time medians run above daytime lab figures.
 *
 * RMSSD declines roughly 3–5 ms per decade. Intended for an EDUCATIONAL
 * interpreter, not diagnosis: an individual's own trend and baseline matter far
 * more than where a single reading falls on a population curve. Not medical advice.
 */

import type { ScienceSource } from './sources'

/** Peer-reviewed normative HRV literature the reference bands are built on.
 *  Surfaced on the page so the numbers are defensible, not "made up". */
export const HRV_SOURCES: ScienceSource[] = [
  {
    authors: 'Nunan D, Sandercock GRH, Brodie DA',
    year: 2010,
    title: 'A quantitative systematic review of normal values for short-term heart rate variability in healthy adults',
    journal: 'Pacing and Clinical Electrophysiology, 33(11):1407–1417',
    contributes: 'Pooled reference RMSSD/SDNN values across 44 studies of healthy adults (pooled resting RMSSD ≈ 42 ms) — anchors the central tendency.',
    url: 'https://doi.org/10.1111/j.1540-8159.2010.02841.x',
  },
  {
    authors: 'Umetani K, Singer DH, McCraty R, Atkinson M',
    year: 1998,
    title: 'Twenty-four hour time domain heart rate variability and heart rate: relations to age and gender over nine decades',
    journal: 'Journal of the American College of Cardiology, 31(3):593–601',
    contributes: 'The classic age-decline curve — time-domain HRV (incl. RMSSD) falling decade by decade — shapes the per-band shift.',
    url: 'https://doi.org/10.1016/S0735-1097(97)00554-8',
  },
  {
    authors: 'Voss A, Schroeder R, Heitmann A, Peters A, Perz S',
    year: 2015,
    title: 'Short-term heart rate variability — influence of gender and age in healthy subjects',
    journal: 'PLoS ONE, 10(3):e0118308',
    contributes: 'Large healthy cohort (n ≈ 1,900; 5-min supine ECG) with age- and sex-stratified short-term HRV. Informs the RMSSD spread (p10–p90 width) and is the direct source of the SDNN (Apple Watch) table: decade means ± SD for women (Table 5) and men (Table 7).',
    url: 'https://doi.org/10.1371/journal.pone.0118308',
  },
  {
    authors: 'Task Force of the ESC and NASPE',
    year: 1996,
    title: 'Heart rate variability: standards of measurement, physiological interpretation, and clinical use',
    journal: 'Circulation, 93(5):1043–1065',
    contributes: 'Foundational definitions of RMSSD/SDNN and measurement standards the literature reports against.',
    url: 'https://doi.org/10.1161/01.CIR.93.5.1043',
  },
]

/** Plain-English methodology note shown alongside the sources. */
export const HRV_METHODOLOGY =
  'These bands are derived, not copied from a single dataset. Most normative studies report means ± SD or medians by decade for short-term, daytime, seated or supine recordings. We combined those central values (Nunan 2010), applied the decade-by-decade decline (Umetani 1998) and the age/sex spread (Voss 2015), then converted to approximate percentiles accounting for the known right-skew of RMSSD. Crucially, the table is keyed to night-time RMSSD — the overnight window consumer wearables (Oura, Whoop, Garmin) measure, when parasympathetic tone and RMSSD are at their highest. That is why these medians sit above the ~42 ms pooled daytime figure in Nunan 2010, and why a daytime 5-minute lab reading should not be compared directly against them. Treat the percentile as a rough population anchor, not a clinical cut-off — your own multi-week trend matters far more.'

export interface HrvAgeBand {
  /** Inclusive lower age bound. */
  minAge: number
  /** Inclusive upper age bound (Infinity for the top band). */
  maxAge: number
  label: string
  /** RMSSD (ms) at the 10/25/50/75/90th population percentile. */
  p10: number
  p25: number
  p50: number
  p75: number
  p90: number
}

export const HRV_AGE_BANDS: HrvAgeBand[] = [
  { minAge: 18, maxAge: 29, label: '18–29', p10: 30, p25: 42, p50: 58, p75: 78, p90: 100 },
  { minAge: 30, maxAge: 39, label: '30–39', p10: 26, p25: 36, p50: 50, p75: 68, p90: 90 },
  { minAge: 40, maxAge: 49, label: '40–49', p10: 22, p25: 30, p50: 42, p75: 56, p90: 75 },
  { minAge: 50, maxAge: 59, label: '50–59', p10: 18, p25: 26, p50: 36, p75: 48, p90: 64 },
  { minAge: 60, maxAge: 69, label: '60–69', p10: 16, p25: 22, p50: 30, p75: 42, p90: 56 },
  { minAge: 70, maxAge: Infinity, label: '70+', p10: 14, p25: 19, p50: 26, p75: 36, p90: 48 },
]

export type HrvTier = 'low' | 'below' | 'average' | 'above' | 'excellent'

export interface HrvResult {
  band: HrvAgeBand
  /** Approximate population percentile, 1–99. */
  percentile: number
  tier: HrvTier
  tierLabel: string
  /** One-line interpretation shown to the user. */
  summary: string
  /** Position 0–100 for the visual bar. */
  barPct: number
}

export function bandForAge(age: number, metric: 'rmssd' | 'sdnn' = 'rmssd'): HrvAgeBand {
  const bands = metric === 'sdnn' ? SDNN_AGE_BANDS : HRV_AGE_BANDS
  return bands.find((b) => age >= b.minAge && age <= b.maxAge) ?? bands[0]
}

/** Piecewise-linear interpolation of a percentile from the 5 anchor points. */
function estimatePercentile(rmssd: number, b: HrvAgeBand): number {
  const pts: Array<[number, number]> = [
    [b.p10, 10],
    [b.p25, 25],
    [b.p50, 50],
    [b.p75, 75],
    [b.p90, 90],
  ]
  if (rmssd <= b.p10) return Math.max(1, Math.round((rmssd / b.p10) * 10))
  if (rmssd >= b.p90) return Math.min(99, Math.round(90 + ((rmssd - b.p90) / b.p90) * 9))
  for (let i = 0; i < pts.length - 1; i++) {
    const [v0, p0] = pts[i]
    const [v1, p1] = pts[i + 1]
    if (rmssd >= v0 && rmssd <= v1) {
      const t = (rmssd - v0) / (v1 - v0)
      return Math.round(p0 + t * (p1 - p0))
    }
  }
  return 50
}

const TIERS: Array<{ max: number; tier: HrvTier; label: string }> = [
  { max: 20, tier: 'low', label: 'Low for your age' },
  { max: 40, tier: 'below', label: 'Below average' },
  { max: 60, tier: 'average', label: 'Average' },
  { max: 80, tier: 'above', label: 'Above average' },
  { max: 100, tier: 'excellent', label: 'Excellent' },
]

/** Methodology for the SDNN (Apple Watch) table. */
export const SDNN_METHODOLOGY =
  'The SDNN table comes straight from Voss et al. 2015 (n ≈ 1,900 healthy adults, 5-minute resting ECG lying down): we pooled the published decade means ± SD for women (Table 5) and men (Table 7), weighted by group size, and converted them to percentiles with a log-normal fit, because SDNN is right-skewed. The youngest band uses the 25–34 data and the oldest the 65–74 data. Apple Watch reports SDNN from short (~1 minute) readings taken several times a day and at night, so single values scatter more than a 5-minute lab recording — compare your weekly average, not one reading.'

export type HrvMetric = 'rmssd' | 'sdnn'

/** SDNN (ms) percentiles by age — Voss 2015, pooled women + men, log-normal fit. */
export const SDNN_AGE_BANDS: HrvAgeBand[] = [
  { minAge: 18, maxAge: 34, label: '18–34', p10: 28, p25: 35, p50: 46, p75: 60, p90: 76 },
  { minAge: 35, maxAge: 44, label: '35–44', p10: 25, p25: 32, p50: 42, p75: 54, p90: 69 },
  { minAge: 45, maxAge: 54, label: '45–54', p10: 21, p25: 27, p50: 34, p75: 44, p90: 55 },
  { minAge: 55, maxAge: 64, label: '55–64', p10: 17, p25: 22, p50: 29, p75: 39, p90: 50 },
  { minAge: 65, maxAge: Infinity, label: '65+', p10: 15, p25: 20, p50: 26, p75: 35, p90: 45 },
]

export function bandsFor(metric: HrvMetric): HrvAgeBand[] {
  return metric === 'sdnn' ? SDNN_AGE_BANDS : HRV_AGE_BANDS
}

export function interpretHrv(age: number, rmssd: number, metric: HrvMetric = 'rmssd'): HrvResult {
  const band = bandForAge(age, metric)
  const percentile = estimatePercentile(rmssd, band)
  const t = TIERS.find((x) => percentile <= x.max) ?? TIERS[2]
  const summaryByTier: Record<HrvTier, string> = {
    low: `At ${rmssd} ms you sit in the lower range for ${band.label}. A low single reading is common after poor sleep, alcohol, illness or hard training — what matters is your own trend over weeks, not one night.`,
    below: `${rmssd} ms is below the typical median (~${band.p50} ms) for ${band.label}. Sleep, alcohol timing, Zone-2 cardio and breathwork are the levers with the most evidence behind them.`,
    average: `${rmssd} ms is around the median (~${band.p50} ms) for ${band.label} — a healthy, typical resting HRV. Track your own baseline; a rising trend is the goal.`,
    above: `${rmssd} ms is above the median (~${band.p50} ms) for ${band.label} — a strong sign of parasympathetic (recovery) capacity. Protect it with consistent sleep and recovery.`,
    excellent: `${rmssd} ms is in the top range for ${band.label} — excellent autonomic flexibility, the kind seen in well-trained, well-recovered individuals.`,
  }
  return {
    band,
    percentile,
    tier: t.tier,
    tierLabel: t.label,
    summary: summaryByTier[t.tier],
    barPct: Math.max(2, Math.min(98, percentile)),
  }
}
