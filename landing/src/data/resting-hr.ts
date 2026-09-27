/**
 * Resting heart rate (RHR) reference by age and sex.
 *
 * Percentiles are taken DIRECTLY from the CDC/NCHS NHANES 1999–2008 report
 * (Ostchega et al. 2011, National Health Statistics Reports No. 41, Tables 2–3):
 * seated resting pulse of ~17,000 U.S. adults, excluding people with a condition
 * or medication that affects pulse. Bands: 18–39 uses the 20–39 row, 60+ the
 * 60–79 row (the 80+ row is based on few people). Wearables that read resting
 * or sleeping heart rate usually come out a few bpm lower than a seated check.
 * Educational, not medical advice.
 */

import type { ScienceSource } from './sources'

export type RhrSex = 'male' | 'female'

export interface RhrBand {
  minAge: number
  maxAge: number
  label: string
  /** Resting pulse (bpm) at the 5/10/25/50/75/90/95th percentile. */
  p5: number
  p10: number
  p25: number
  p50: number
  p75: number
  p90: number
  p95: number
}

export const RHR_BANDS: Record<RhrSex, RhrBand[]> = {
  male: [
    { minAge: 18, maxAge: 39, label: '18–39', p5: 52, p10: 55, p25: 61, p50: 69, p75: 76, p90: 84, p95: 89 },
    { minAge: 40, maxAge: 59, label: '40–59', p5: 52, p10: 55, p25: 61, p50: 68, p75: 77, p90: 85, p95: 90 },
    { minAge: 60, maxAge: Infinity, label: '60+', p5: 50, p10: 54, p25: 60, p50: 67, p75: 75, p90: 84, p95: 91 },
  ],
  female: [
    { minAge: 18, maxAge: 39, label: '18–39', p5: 57, p10: 60, p25: 66, p50: 74, p75: 82, p90: 89, p95: 95 },
    { minAge: 40, maxAge: 59, label: '40–59', p5: 56, p10: 59, p25: 64, p50: 71, p75: 79, p90: 86, p95: 92 },
    { minAge: 60, maxAge: Infinity, label: '60+', p5: 56, p10: 59, p25: 64, p50: 70, p75: 78, p90: 86, p95: 92 },
  ],
}

/** Lower is generally better for resting pulse, so tiers run from low to high. */
export type RhrTier = 'veryLow' | 'low' | 'typical' | 'higher' | 'high'

export interface RhrResult {
  band: RhrBand
  /** Approximate population percentile (share of people with a LOWER pulse), 1–99. */
  percentile: number
  tier: RhrTier
  /** Clinical flag, independent of percentile. */
  flag: 'tachy' | 'brady' | null
  barPct: number
}

export function bandForAge(age: number, sex: RhrSex): RhrBand {
  const bands = RHR_BANDS[sex]
  return bands.find((b) => age >= b.minAge && age <= b.maxAge) ?? bands[0]
}

function estimatePercentile(v: number, b: RhrBand): number {
  const pts: Array<[number, number]> = [
    [b.p5, 5], [b.p10, 10], [b.p25, 25], [b.p50, 50], [b.p75, 75], [b.p90, 90], [b.p95, 95],
  ]
  if (v <= b.p5) return Math.max(1, Math.round(5 - (b.p5 - v) * 0.5))
  if (v >= b.p95) return Math.min(99, Math.round(95 + (v - b.p95) * 0.5))
  for (let i = 0; i < pts.length - 1; i++) {
    const [v0, p0] = pts[i]
    const [v1, p1] = pts[i + 1]
    if (v >= v0 && v <= v1) return Math.round(p0 + ((v - v0) / (v1 - v0)) * (p1 - p0))
  }
  return 50
}

export function interpretRhr(age: number, rhr: number, sex: RhrSex): RhrResult {
  const band = bandForAge(age, sex)
  const percentile = estimatePercentile(rhr, band)
  const tier: RhrTier =
    percentile <= 10 ? 'veryLow' : percentile <= 25 ? 'low' : percentile <= 75 ? 'typical' : percentile <= 90 ? 'higher' : 'high'
  const flag = rhr > 100 ? 'tachy' : rhr < 50 ? 'brady' : null
  return { band, percentile, tier, flag, barPct: Math.max(2, Math.min(98, percentile)) }
}

export const RHR_SOURCES: ScienceSource[] = [
  {
    authors: 'Ostchega Y, Porter KS, Hughes J, Dillon CF, Nwankwo T',
    year: 2011,
    title: 'Resting pulse rate reference data for children, adolescents, and adults: United States, 1999–2008',
    journal: 'National Health Statistics Reports, No. 41 (CDC/NCHS)',
    contributes: 'Direct source of the tables: seated resting pulse percentiles by age and sex from NHANES 1999–2008, excluding conditions and medications that affect pulse (Tables 2–3).',
    url: 'https://www.cdc.gov/nchs/data/nhsr/nhsr041.pdf',
  },
  {
    authors: 'Nanchen D',
    year: 2018,
    title: 'Resting heart rate: what is normal?',
    journal: 'Heart, 104(13):1048–1049',
    contributes: 'Clinical context: a normal resting heart rate is roughly 50–90 bpm, lower in the very fit, slightly higher in women, and partly genetic.',
    url: 'https://doi.org/10.1136/heartjnl-2017-312731',
  },
  {
    authors: 'Zhang D, Shen X, Qi X',
    year: 2016,
    title: 'Resting heart rate and all-cause and cardiovascular mortality in the general population: a meta-analysis',
    journal: 'CMAJ, 188(3):E53–E63',
    contributes: 'Meta-analysis (about 1.2 million people): each 10 bpm higher resting heart rate is linked to about 9% higher all-cause mortality — why a lower resting rate matters.',
    url: 'https://doi.org/10.1503/cmaj.150535',
  },
]
