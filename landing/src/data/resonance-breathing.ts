/**
 * Resonance (coherent) breathing rate finder + pacer.
 *
 * Every person has a personal "resonance frequency" — usually between ~4.5 and
 * 6.5 breaths/min — at which the heart-rate, breathing and baroreflex rhythms
 * align and HRV amplitude is maximised (Lehrer 2003; Shaffer 2020). Breathing
 * at this rate is the core of HRV biofeedback. The exact rate is personal and
 * is best pinned down with live HRV; this tool gives a height-based starting
 * estimate, a sweep protocol to find it by feel, and a pacer at any rate.
 *
 * Educational tool, not a medical device. Stop if you feel light-headed.
 */

import type { ScienceSource } from './sources'

export const RESONANCE_RATES = [6.5, 6.0, 5.5, 5.0, 4.5] as const
export type ResonanceRate = (typeof RESONANCE_RATES)[number]

export interface RatePacing {
  bpm: number
  cycleSec: number
  halfSec: number // equal inhale = exhale
}

/** Convert breaths-per-minute to an equal inhale/exhale pacing. */
export function rateToPacing(bpm: number): RatePacing {
  const cycleSec = 60 / bpm
  return { bpm, cycleSec: Math.round(cycleSec * 100) / 100, halfSec: Math.round((cycleSec / 2) * 100) / 100 }
}

export interface ResonanceEstimate {
  bpm: number
  band: string
  note: string
}

/** Rough height-based STARTING estimate. Resonance frequency tends to be a
 *  little slower in taller people (larger blood volume / vascular system).
 *  This is only a starting point — true RF must be found by testing. */
export function estimateResonanceRate(heightCm: number): ResonanceEstimate | null {
  if (!heightCm || heightCm < 120 || heightCm > 230) return null
  if (heightCm < 165) return { bpm: 6.0, band: '≈ 6.0–6.5 breaths/min', note: 'Shorter stature tends toward the faster end of the resonance range.' }
  if (heightCm < 185) return { bpm: 5.5, band: '≈ 5.5–6.0 breaths/min', note: 'Average stature usually resonates around 5.5–6 breaths/min.' }
  return { bpm: 5.0, band: '≈ 5.0–5.5 breaths/min', note: 'Taller stature tends toward the slower end of the resonance range.' }
}

export const RESONANCE_SOURCES: ScienceSource[] = [
  {
    authors: 'Lehrer PM, Vaschillo E, Vaschillo B, et al.',
    year: 2003,
    title: 'Heart rate variability biofeedback increases baroreflex gain and peak expiratory flow',
    journal: 'Psychosomatic Medicine, 65(5):796–805',
    contributes: 'Foundational work establishing the resonance-frequency concept and its baroreflex mechanism.',
    url: 'https://doi.org/10.1097/01.psy.0000089200.81962.19',
  },
  {
    authors: 'Shaffer F, Meehan ZM',
    year: 2020,
    title: 'A practical guide to resonance frequency assessment for heart rate variability biofeedback',
    journal: 'Frontiers in Neuroscience, 14:570400',
    contributes: 'The protocol for finding an individual’s resonance frequency by sweeping breathing rates.',
    url: 'https://doi.org/10.3389/fnins.2020.570400',
  },
  {
    authors: 'Steffen PR, Austin T, DeBarros A, Brown T',
    year: 2017,
    title: 'The impact of resonance frequency breathing on measures of heart rate variability, blood pressure, and mood',
    journal: 'Frontiers in Public Health, 5:222',
    contributes: 'Shows breathing at resonance frequency (~6/min) raises HRV and improves mood vs sitting quietly.',
    url: 'https://doi.org/10.3389/fpubh.2017.00222',
  },
]

export const RESONANCE_METHODOLOGY =
  'Resonance-frequency breathing is the precise version of coherent breathing. At a personal rate — usually 4.5–6.5 breaths/min — your heart-rate oscillations, breathing and baroreflex come into phase, and HRV amplitude peaks (Lehrer 2003). The exact rate is individual and tends to be slightly slower in taller people, so the height-based number here is only a starting point. The accepted way to find your true resonance frequency is to test each rate for a couple of minutes and measure which produces the largest, smoothest HRV oscillations (Shaffer 2020) — that needs live HRV, which is exactly what ONDA Life provides. Without a sensor, pick the rate you can sustain most smoothly and that leaves you calmest. This is an educational tool, not a medical device; stop if you feel light-headed.'

export const RESONANCE_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'What is resonance frequency breathing?',
    a: 'It is breathing at the specific slow rate — usually between 4.5 and 6.5 breaths per minute — where your cardiovascular rhythms synchronise and heart-rate variability is maximised. Breathing at this "resonance frequency" is the core technique of HRV biofeedback, and it is a more precise, personalised version of coherent breathing.',
  },
  {
    q: 'How do I find my personal resonance rate?',
    a: 'The proper method is to breathe at each rate (6.5, 6.0, 5.5, 5.0, 4.5/min) for about two minutes while measuring your HRV, and choose the rate that produces the largest, smoothest heart-rate oscillations (Shaffer 2020). That requires a live HRV reading — ONDA Life does this automatically. Without a sensor, use the height estimate here as a start and pick the rate that feels smoothest and calmest.',
  },
  {
    q: 'Is resonance breathing the same as coherent breathing?',
    a: 'They overlap. Coherent breathing usually means a fixed ~5–6 breaths/min for everyone. Resonance-frequency breathing is the individualised version: your specific rate within that range where HRV peaks. For most people the two are close, which is why ~5.5/min is a good default starting point.',
  },
  {
    q: 'How long and how often should I practise?',
    a: 'Studies of HRV biofeedback typically use sessions of 10–20 minutes, once or twice daily. Even a few minutes at your resonance rate acutely raises HRV and calms arousal; the larger benefits (baroreflex strengthening, mood, blood pressure) build with regular practice over weeks.',
  },
  {
    q: 'Does it really raise HRV?',
    a: 'Acutely, yes — breathing at resonance frequency reliably increases HRV amplitude during the session, and trials such as Steffen 2017 show improvements in HRV, blood pressure and mood. Longer-term clinical effects are promising but more mixed across studies. It is a low-risk, well-evidenced self-regulation practice, not a medical treatment.',
  },
]
