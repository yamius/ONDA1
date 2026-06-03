/**
 * Population reference ranges for night-time RMSSD HRV by age.
 *
 * These are APPROXIMATE population percentiles (ms) synthesised from the
 * published normative HRV literature (Nunan 2010 meta-analysis; Umetani 1998
 * age-decline curves) and the resting/overnight ranges consumer devices
 * (Oura, Whoop) surface. RMSSD declines roughly 3–5 ms per decade.
 *
 * Intended for an EDUCATIONAL interpreter, not diagnosis: an individual's own
 * trend and baseline matter far more than where a single reading falls on a
 * population curve. Not medical advice.
 */

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

export function bandForAge(age: number): HrvAgeBand {
  return HRV_AGE_BANDS.find((b) => age >= b.minAge && age <= b.maxAge) ?? HRV_AGE_BANDS[0]
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

/** FAQ for the HRV interpreter — rendered on the page AND emitted as
 *  FAQPage JSON-LD by meta-inject (single source of truth, no drift). */
export const HRV_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'What is a good HRV for my age?',
    a: 'HRV (RMSSD) declines with age — a healthy median is roughly 58 ms in your 20s, 50 ms in your 30s, 42 ms in your 40s, 36 ms in your 50s and 30 ms in your 60s. But "good" is relative to your own baseline: a value that rises over weeks beats a high one-off reading.',
  },
  {
    q: 'What HRV metric does this use — RMSSD or SDNN?',
    a: 'RMSSD, the short-term parasympathetic metric most consumer devices (Oura, Whoop, Garmin, Polar) report as overnight or resting "HRV". If your device only shows SDNN or a proprietary 0–100 score, the percentile here will not map directly.',
  },
  {
    q: 'Why does my HRV change so much night to night?',
    a: 'RMSSD is sensitive: alcohol, late meals, poor or short sleep, illness, dehydration and hard training all suppress it for a night or two. Day-to-day swings of 10–20 ms are normal — read the weekly trend, not single nights.',
  },
  {
    q: 'How do I raise my HRV?',
    a: 'The levers with the most evidence: consistent sleep timing and duration, Zone-2 cardio, cutting alcohol (especially within 3 hours of bed), slow resonance-frequency breathing (~6 breaths/min), and managing chronic stress load. Improvements show over weeks, not days.',
  },
  {
    q: 'Is low HRV dangerous?',
    a: 'A single low reading is not a medical event — it usually reflects recent sleep, alcohol or training. Persistently low HRV relative to your own baseline can signal accumulated stress or under-recovery. This tool is educational, not a diagnosis; see a clinician for health concerns.',
  },
]

export function interpretHrv(age: number, rmssd: number): HrvResult {
  const band = bandForAge(age)
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
