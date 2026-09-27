/**
 * Sleep-cycle / bedtime calculator.
 *
 * Sleep runs in NREM–REM cycles of ~90 minutes; waking at the end of a cycle
 * (rather than mid-deep-sleep) tends to feel less groggy. Given a fixed wake
 * time, we work backwards in 90-minute cycles (plus ~15 min to fall asleep) to
 * suggest bedtimes that land you at a cycle boundary. Given a bedtime, we do
 * the reverse to suggest wake times.
 *
 * The 90-minute figure is an average — real cycles run ~70–120 min and the
 * first is often shorter (Carskadon & Dement; Feinberg & Floyd 1979). Treat
 * the suggestions as a guide, not a guarantee. Educational, not medical advice.
 */

import type { ScienceSource } from './sources'

export const CYCLE_MIN = 90
export const FALL_ASLEEP_MIN = 15

/** Parse "HH:MM" → minutes since midnight, or null. */
export function parseTime(value: string): number | null {
  const m = value.match(/^(\d{1,2}):(\d{2})$/)
  if (!m) return null
  const h = parseInt(m[1], 10)
  const min = parseInt(m[2], 10)
  if (h < 0 || h > 23 || min < 0 || min > 59) return null
  return h * 60 + min
}

/** Format minutes-since-midnight as a clock time in the page language (12 h or 24 h by locale). */
export function fmtTime(totalMin: number, lang: string): string {
  const m = ((Math.round(totalMin) % 1440) + 1440) % 1440
  const d = new Date(Date.UTC(2020, 0, 1, Math.floor(m / 60), m % 60))
  return new Intl.DateTimeFormat(lang, { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }).format(d)
}

export interface CycleOption {
  cycles: number
  /** Minutes since midnight. */
  minutes: number
  totalSleepH: number
}

/** Given a wake time, list bedtimes (6,5,4,3 cycles) that end at a cycle boundary. */
export function bedtimesForWake(wakeMin: number): CycleOption[] {
  return [6, 5, 4, 3].map((cycles) => {
    const bedMin = wakeMin - (cycles * CYCLE_MIN + FALL_ASLEEP_MIN)
    return { cycles, minutes: bedMin, totalSleepH: Math.round((cycles * CYCLE_MIN) / 6) / 10 }
  })
}

/** Given a bedtime, list wake times after 6,5,4,3 cycles (incl. fall-asleep time). */
export function wakesForBedtime(bedMin: number): CycleOption[] {
  return [6, 5, 4, 3].map((cycles) => {
    const wakeMin = bedMin + FALL_ASLEEP_MIN + cycles * CYCLE_MIN
    return { cycles, minutes: wakeMin, totalSleepH: Math.round((cycles * CYCLE_MIN) / 6) / 10 }
  })
}

export const SLEEP_CYCLE_SOURCES: ScienceSource[] = [
  {
    authors: 'Feinberg I, Floyd TC',
    year: 1979,
    title: 'Systematic trends across the night in human sleep cycles',
    journal: 'Psychophysiology, 16(3):283–291',
    contributes: 'Quantifies NREM–REM cycle periods across the night, supporting the ~90-minute average used here.',
    url: 'https://doi.org/10.1111/j.1469-8986.1979.tb02991.x',
  },
  {
    authors: 'Institute of Medicine (US) Committee on Sleep Medicine',
    year: 2006,
    title: 'Sleep Physiology (Sleep Disorders and Sleep Deprivation: An Unmet Public Health Problem)',
    journal: 'National Academies Press, Washington DC',
    contributes: 'Reference description of NREM–REM cycling at roughly 90-minute intervals through the night.',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK19956/',
  },
  {
    authors: 'Hirshkowitz M, Whiton K, Albert SM, et al.',
    year: 2015,
    title: "National Sleep Foundation's sleep time duration recommendations",
    journal: 'Sleep Health, 1(1):40–43',
    contributes: 'Recommended sleep duration by age — the basis for the 5–6 cycles (7.5–9 h) guidance for adults.',
    url: 'https://doi.org/10.1016/j.sleh.2014.12.010',
  },
]
