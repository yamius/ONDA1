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
  /** Key into the page's translated band labels. */
  band: 'short' | 'mid' | 'tall'
}

/** Rough height-based STARTING estimate. Resonance frequency tends to be a
 *  little slower in taller people (larger blood volume / vascular system).
 *  This is only a starting point — true RF must be found by testing. */
export function estimateResonanceRate(heightCm: number): ResonanceEstimate | null {
  if (!heightCm || heightCm < 120 || heightCm > 230) return null
  if (heightCm < 165) return { bpm: 6.0, band: 'short' }
  if (heightCm < 185) return { bpm: 5.5, band: 'mid' }
  return { bpm: 5.0, band: 'tall' }
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
