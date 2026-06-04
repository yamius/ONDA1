/**
 * Recovery / readiness score estimator + decoder for wearable scores.
 *
 * Whoop "Recovery", Oura "Readiness" and Garmin "Training Readiness/Body
 * Battery" are all heuristics built mainly from the SAME inputs: overnight HRV
 * and resting heart rate (relative to YOUR baseline), plus sleep, and sometimes
 * respiratory rate / temperature / recent load. This tool estimates a readiness
 * score from those inputs and explains what each device actually measures.
 *
 * Crucial honest point (Plews 2013): the meaning is in the trend vs your own
 * baseline, not one day's absolute number. Educational, not medical advice.
 */

import type { ScienceSource } from './sources'

export type HrvLevel = 'above' | 'normal' | 'below' | 'wellBelow'
export type RhrLevel = 'low' | 'normal' | 'elevated' | 'wellElevated'

export interface ReadinessInput {
  hrv: HrvLevel
  rhr: RhrLevel
  sleepHours: number
  sick: boolean
  sore: boolean
  stressed: boolean
}

export type ReadinessBand = 'recover' | 'moderate' | 'go'

export interface ReadinessResult {
  score: number
  band: ReadinessBand
  bandLabel: string
  guidance: string
  drivers: Array<{ label: string; delta: number }>
}

const HRV_DELTA: Record<HrvLevel, number> = { above: 3, normal: 0, below: -18, wellBelow: -38 }
const RHR_DELTA: Record<RhrLevel, number> = { low: 2, normal: 0, elevated: -12, wellElevated: -26 }

export const HRV_LEVELS: Array<{ id: HrvLevel; label: string }> = [
  { id: 'above', label: 'Above my normal' },
  { id: 'normal', label: 'About normal' },
  { id: 'below', label: 'Below normal' },
  { id: 'wellBelow', label: 'Well below' },
]
export const RHR_LEVELS: Array<{ id: RhrLevel; label: string }> = [
  { id: 'low', label: 'Lower than usual' },
  { id: 'normal', label: 'About normal' },
  { id: 'elevated', label: 'Elevated' },
  { id: 'wellElevated', label: 'Well elevated' },
]

function sleepDelta(h: number): number {
  if (h >= 7.5 && h <= 9) return 0
  if (h >= 6.5 && h < 7.5) return -6
  if (h >= 5.5 && h < 6.5) return -16
  if (h >= 4.5 && h < 5.5) return -26
  if (h < 4.5) return -36
  return -4 // > 9 h
}

export function computeReadiness(input: ReadinessInput): ReadinessResult | null {
  if (!input.sleepHours || input.sleepHours < 2 || input.sleepHours > 14) return null
  const drivers: Array<{ label: string; delta: number }> = []
  const hrvD = HRV_DELTA[input.hrv]
  const rhrD = RHR_DELTA[input.rhr]
  const sleepD = sleepDelta(input.sleepHours)
  drivers.push({ label: 'HRV vs baseline', delta: hrvD })
  drivers.push({ label: 'Resting HR vs baseline', delta: rhrD })
  drivers.push({ label: 'Sleep', delta: sleepD })
  if (input.sick) drivers.push({ label: 'Feeling unwell', delta: -30 })
  if (input.sore) drivers.push({ label: 'Muscle soreness', delta: -10 })
  if (input.stressed) drivers.push({ label: 'High stress', delta: -10 })

  const raw = 100 + drivers.reduce((s, d) => s + d.delta, 0)
  const score = Math.max(0, Math.min(100, raw))

  let band: ReadinessBand
  if (score >= 67) band = 'go'
  else if (score >= 40) band = 'moderate'
  else band = 'recover'

  const bandLabel = band === 'go' ? 'Primed — green' : band === 'moderate' ? 'Partial — amber' : 'Under-recovered — red'
  const guidance =
    band === 'go'
      ? 'Green light. Your body looks primed — a good day for hard training, key workouts or demanding focused work. Still warm up and listen to how you feel.'
      : band === 'moderate'
        ? 'Amber. You’re only partly recovered — train, but pull back intensity or volume. Favour Zone 2, technique and lighter work over max efforts, and protect tonight’s sleep.'
        : 'Red. Your system is under-recovered. Prioritise easy movement, sleep, food and stress-down today; the hard session will be there tomorrow. Pushing now mostly digs the hole deeper.'

  return { score, band, bandLabel, guidance, drivers }
}

export interface DeviceDecode {
  device: string
  scoreName: string
  inputs: string
}

export const DEVICE_DECODER: DeviceDecode[] = [
  { device: 'Whoop', scoreName: 'Recovery (%)', inputs: 'Overnight HRV (RMSSD) weighted most heavily, plus resting heart rate, respiratory rate and sleep performance.' },
  { device: 'Oura', scoreName: 'Readiness Score', inputs: 'HRV balance and resting heart rate, body temperature deviation, previous night’s sleep, a recovery index and prior-day activity.' },
  { device: 'Garmin', scoreName: 'Training Readiness / Body Battery', inputs: 'HRV status, sleep, recovery time, acute training load and all-day stress (Body Battery blends HRV, stress, activity and sleep).' },
  { device: 'Apple Watch', scoreName: '(no single score)', inputs: 'No built-in recovery score; you can read overnight HRV and resting-HR trends manually, or use a third-party app.' },
]

export const RECOVERY_SOURCES: ScienceSource[] = [
  {
    authors: 'Plews DJ, Laursen PB, Stanley J, et al.',
    year: 2013,
    title: 'Training adaptation and heart rate variability in elite endurance athletes: opening the door to effective monitoring',
    journal: 'Sports Medicine, 43(9):773–781',
    contributes: 'Shows HRV tracks training adaptation — but the signal is in the trend vs your own baseline, not one day’s number.',
    url: 'https://doi.org/10.1007/s40279-013-0071-8',
  },
  {
    authors: 'Bellenger CR, Fuller JT, Thomson RL, et al.',
    year: 2016,
    title: 'Monitoring athletic training status through autonomic heart rate regulation: a systematic review and meta-analysis',
    journal: 'Sports Medicine, 46(10):1461–1486',
    contributes: 'Meta-analysis linking autonomic markers (HRV, resting HR) to positive vs negative training adaptation — the basis of recovery scores.',
    url: 'https://doi.org/10.1007/s40279-016-0484-2',
  },
  {
    authors: 'Laborde S, Mosley E, Thayer JF',
    year: 2017,
    title: 'Heart rate variability and cardiac vagal tone in psychophysiological research',
    journal: 'Frontiers in Psychology, 8:213',
    contributes: 'Connects vagal tone (HRV) to self-regulation and recovery — why HRV anchors every wearable readiness score.',
    url: 'https://doi.org/10.3389/fpsyg.2017.00213',
  },
]

export const RECOVERY_METHODOLOGY =
  'Every wearable "recovery" or "readiness" score is a heuristic built mostly from the same signals — overnight heart-rate variability and resting heart rate measured against your personal baseline, plus sleep, and sometimes respiratory rate, temperature or recent training load. HRV and resting HR reflect autonomic balance, which research links to whether you’re adapting well or over-reaching (Bellenger 2016; Laborde 2017). This tool mirrors that: it estimates a readiness score from how your HRV and resting HR compare to your normal, your sleep, and any illness/soreness/stress flags — and weights HRV most, as the devices do. The single most important caveat (Plews 2013) is that the meaning lives in the trend against your own baseline, not one day’s absolute number — and that a score is information to weigh, not an order to obey. Educational only, not medical advice; persistent red recovery with symptoms warrants a doctor, not just a rest day.'

export const RECOVERY_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'What does a recovery or readiness score actually measure?',
    a: 'Despite different names, Whoop Recovery, Oura Readiness and Garmin Training Readiness are built from largely the same inputs: your overnight HRV and resting heart rate compared with your personal baseline, plus sleep, and sometimes respiratory rate, temperature or recent training load. HRV is usually the heaviest-weighted signal because it reflects autonomic (vagal) recovery.',
  },
  {
    q: 'Why is my recovery score low?',
    a: 'A low score usually means your overnight HRV dropped and/or resting heart rate rose versus your baseline — the classic signature of incomplete recovery. Common causes: poor or short sleep, alcohol, late meals, hard training the day before, illness brewing, dehydration, heat or high stress. One low day is normal; a sustained dip is the signal that matters.',
  },
  {
    q: 'Should I skip training if my recovery is red?',
    a: 'Not necessarily skip, but adjust. A red score is a reason to pull back intensity and volume — favour easy Zone 2, technique or rest — rather than push a max effort that you’ll recover from poorly. Light movement can even help. Treat the score as information to weigh alongside how you feel, not an order.',
  },
  {
    q: 'Why do my devices give different recovery scores?',
    a: 'Because they weight the inputs differently and measure under different conditions (and HRV itself is hard to capture from the wrist — see our guide on why HRV differs across devices). Don’t compare absolute scores between devices. Pick one, and watch its trend against your own baseline, which is where the real signal is (Plews 2013).',
  },
  {
    q: 'Is a recovery score accurate or worth tracking?',
    a: 'It’s a useful, evidence-grounded heuristic — autonomic markers like HRV and resting HR do track training adaptation (Bellenger 2016) — but it’s not a precise verdict on your body. Its best use is spotting trends and catching under-recovery early, not obsessing over daily numbers. If chasing the score is adding stress, that’s self-defeating; use it calmly or not at all.',
  },
]
