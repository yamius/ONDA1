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

export function fmt(totalMin: number): string {
  const m = ((Math.round(totalMin) % 1440) + 1440) % 1440
  const h = Math.floor(m / 60)
  const min = m % 60
  const ampm = h < 12 ? 'AM' : 'PM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(min).padStart(2, '0')} ${ampm}`
}

export interface CycleOption {
  cycles: number
  time: string // HH:MM AM/PM
  totalSleepH: number
}

/** Given a wake time, list bedtimes (6,5,4,3 cycles) that end at a cycle boundary. */
export function bedtimesForWake(wakeMin: number): CycleOption[] {
  return [6, 5, 4, 3].map((cycles) => {
    const bedMin = wakeMin - (cycles * CYCLE_MIN + FALL_ASLEEP_MIN)
    return { cycles, time: fmt(bedMin), totalSleepH: Math.round((cycles * CYCLE_MIN) / 6) / 10 }
  })
}

/** Given a bedtime, list wake times after 6,5,4,3 cycles (incl. fall-asleep time). */
export function wakesForBedtime(bedMin: number): CycleOption[] {
  return [6, 5, 4, 3].map((cycles) => {
    const wakeMin = bedMin + FALL_ASLEEP_MIN + cycles * CYCLE_MIN
    return { cycles, time: fmt(wakeMin), totalSleepH: Math.round((cycles * CYCLE_MIN) / 6) / 10 }
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
    contributes: 'Underpins the "aim for 5–6 cycles (7.5–9 h)" guidance for adults.',
    url: 'https://doi.org/10.1016/j.sleh.2014.12.010',
  },
]

export const SLEEP_CYCLE_METHODOLOGY =
  'Sleep alternates between NREM and REM in cycles averaging about 90 minutes (Feinberg & Floyd 1979; IOM 2006). Waking near the end of a cycle — in lighter sleep — tends to feel less groggy than being woken from deep sleep, which is the idea behind cycle-timed alarms. From your fixed wake time we subtract whole 90-minute cycles plus about 15 minutes to fall asleep, and suggest bedtimes that land you on a boundary; for adults, 5–6 cycles (≈7.5–9 hours) aligns with the National Sleep Foundation recommendation. The 90-minute figure is an average: real cycles range ~70–120 minutes and the first is often shorter, so treat these as guides rather than exact times. Total sleep duration matters more than hitting a precise cycle. Educational only, not medical advice.'

export const SLEEP_CYCLE_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'Where does the 90-minute sleep cycle come from?',
    a: 'It is the long-standing average for the NREM–REM cycle in adults, documented by sleep researchers such as Feinberg & Floyd (1979) and summarised in the Institute of Medicine’s sleep physiology review (2006). Full citations are in the Sources section on this page. Real cycles vary (~70–120 minutes), so it is an average, not a fixed clock.',
  },
  {
    q: 'What time should I go to bed to wake up at a set time?',
    a: 'Work backwards from your wake time in 90-minute cycles, allowing ~15 minutes to fall asleep. Aiming to wake at the end of a cycle — typically after 5 or 6 cycles (7.5 or 9 hours) for adults — tends to feel less groggy than waking mid-cycle. This calculator lists those bedtimes for you.',
  },
  {
    q: 'Why do I wake up groggy even after 8 hours?',
    a: 'Grogginess (sleep inertia) is worst when an alarm pulls you out of deep NREM sleep mid-cycle. Waking nearer the end of a cycle, in lighter sleep, usually feels better — which is why cycle-timed bedtimes can help even when total sleep is unchanged. Inconsistent sleep timing, alcohol and a warm or bright room also worsen morning grogginess.',
  },
  {
    q: 'Is the 90-minute cycle exact for everyone?',
    a: 'No. It is a population average. Individual cycles range from about 70 to 120 minutes, the first cycle of the night is often shorter, and cycle length shifts across the night and with age. Use the suggested times as a helpful guide and adjust based on how you actually feel on waking.',
  },
  {
    q: 'How many sleep cycles do I need?',
    a: 'Most adults do best on 5–6 full cycles a night — roughly 7.5–9 hours — in line with the National Sleep Foundation and AASM recommendations of at least 7 hours. Four cycles (6 hours) is a workable minimum for the occasional short night, but routinely sleeping that little builds up sleep debt.',
  },
]
