/**
 * Caffeine pharmacokinetics for the "last cup before bed" calculator.
 *
 * Model: first-order elimination. residual(t) = dose · 0.5^(t / halfLife).
 * Mean caffeine half-life in healthy adults is ~5–6 h; we use 5.5 h as the
 * default and let the user widen it, because it varies a LOT between people:
 *   - faster (≈4 h): smokers, some CYP1A2 fast-metabolisers
 *   - slower (≈8–9 h+): pregnancy, oral contraceptives, liver load, some meds
 * Sleep-disruption threshold: published work (Drake 2013) shows caffeine even
 * 6 h before bed measurably cuts sleep. We treat ~50 mg residual at bedtime
 * as the "unlikely to disrupt sleep for most people" line.
 *
 * Educational, not medical advice — individual sensitivity varies widely.
 */

export const DEFAULT_HALF_LIFE_H = 5.5
export const SLEEP_THRESHOLD_MG = 50

export interface CaffeineDrink {
  id: string
  name: string
  mg: number
  note: string
}

/** Approximate caffeine content (mg) of common sources. */
export const CAFFEINE_DRINKS: CaffeineDrink[] = [
  { id: 'espresso', name: 'Espresso (single)', mg: 63, note: '~30 ml shot' },
  { id: 'coffee', name: 'Brewed coffee', mg: 95, note: '240 ml / 8 oz' },
  { id: 'coffee-large', name: 'Large coffee', mg: 155, note: '470 ml / 16 oz' },
  { id: 'cold-brew', name: 'Cold brew', mg: 205, note: '350 ml / 12 oz' },
  { id: 'energy', name: 'Energy drink', mg: 80, note: '250 ml can' },
  { id: 'preworkout', name: 'Pre-workout', mg: 200, note: 'typical scoop' },
  { id: 'matcha', name: 'Matcha', mg: 70, note: '1 tsp / 2 g' },
  { id: 'black-tea', name: 'Black tea', mg: 47, note: '240 ml' },
  { id: 'green-tea', name: 'Green tea', mg: 28, note: '240 ml' },
  { id: 'cola', name: 'Cola / soda', mg: 40, note: '355 ml can' },
  { id: 'dark-chocolate', name: 'Dark chocolate', mg: 24, note: '40 g bar' },
]

export interface CaffeineResult {
  /** Hours before bed the last dose should be taken to drop below threshold. */
  hoursBeforeBed: number
  /** Residual caffeine (mg) still in the body at bedtime if taken NOW-ish,
   *  i.e. for the chosen gap. Used for the curve label. */
  residualAtBedtimeIfNow: number
  /** Cutoff clock time "HH:MM" given the bedtime. */
  cutoffTime: string
  /** Decay samples: hours-after-dose → residual mg, for the mini chart. */
  curve: Array<{ h: number; mg: number }>
}

/** Parse "HH:MM" → minutes since midnight, or null. */
export function parseTime(t: string): number | null {
  const m = t.match(/^(\d{1,2}):(\d{2})$/)
  if (!m) return null
  const h = parseInt(m[1], 10)
  const min = parseInt(m[2], 10)
  if (h > 23 || min > 59) return null
  return h * 60 + min
}

function fmtTime(totalMin: number): string {
  let m = ((totalMin % 1440) + 1440) % 1440
  const h = Math.floor(m / 60)
  const mm = m % 60
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

/**
 * Given a dose, bedtime and half-life, compute how many hours before bed the
 * dose must be taken so residual at bedtime ≤ threshold, plus the cutoff
 * clock time and a decay curve.
 */
export function caffeineCutoff(
  doseMg: number,
  bedtimeMin: number,
  halfLifeH = DEFAULT_HALF_LIFE_H,
  thresholdMg = SLEEP_THRESHOLD_MG,
): CaffeineResult {
  // residual = dose · 0.5^(t/hl) = threshold  →  t = hl · log2(dose/threshold)
  const hoursBeforeBed = doseMg <= thresholdMg ? 0 : halfLifeH * Math.log2(doseMg / thresholdMg)
  const cutoffMin = bedtimeMin - Math.round(hoursBeforeBed * 60)
  const curve: Array<{ h: number; mg: number }> = []
  for (let h = 0; h <= 12; h++) {
    curve.push({ h, mg: Math.round(doseMg * Math.pow(0.5, h / halfLifeH)) })
  }
  return {
    hoursBeforeBed,
    residualAtBedtimeIfNow: Math.round(doseMg * Math.pow(0.5, hoursBeforeBed / halfLifeH)),
    cutoffTime: fmtTime(cutoffMin),
    curve,
  }
}

export const CAFFEINE_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'When should I stop drinking coffee before bed?',
    a: 'As a rule of thumb, stop caffeine 8–10 hours before bed if you are sleep-sensitive. The exact cutoff depends on the dose: caffeine has a ~5.5-hour half-life, so a 95 mg coffee takes about 5 hours to fall to ~50 mg and roughly 8–9 hours to become negligible. Bigger doses need a longer gap.',
  },
  {
    q: 'How long does caffeine stay in your system?',
    a: 'With a ~5.5-hour half-life, half the dose is gone in ~5.5 h, three-quarters in ~11 h, and it takes roughly 5 half-lives (≈24–30 h) to fully clear. That is why an afternoon coffee can still affect sleep even if you no longer "feel" it.',
  },
  {
    q: 'Why is everyone different with caffeine?',
    a: 'Caffeine is broken down mainly by the liver enzyme CYP1A2. Genetics, smoking (speeds it up, ~4 h half-life), pregnancy and oral contraceptives (slow it down, 8–10 h+), and some medications all shift your half-life. Adjust the slider toward "slow" if caffeine keeps you up.',
  },
  {
    q: 'Does caffeine before bed really hurt sleep if I fall asleep fine?',
    a: 'Often, yes. Controlled studies (e.g. Drake 2013) found caffeine taken even 6 hours before bed reduced total sleep time by about an hour and cut deep sleep — even when people did not report trouble falling asleep. It is the sleep architecture, not just sleep onset, that suffers.',
  },
  {
    q: 'What counts as a safe residual at bedtime?',
    a: 'This tool uses ~50 mg residual as the "unlikely to disrupt most people" line — roughly the caffeine in half a cup of coffee. If you are highly sensitive, aim for near zero; if you are a fast metaboliser, you may tolerate more. Track your own sleep to calibrate.',
  },
]
