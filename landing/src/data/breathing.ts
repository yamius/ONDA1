/**
 * Breathing pacer patterns + evidence.
 *
 * A visual breathing guide: an expanding/contracting circle paced to one of
 * several well-known patterns. Slow, paced breathing (especially ~6 breaths/min
 * and extended exhales) shifts the autonomic balance toward the parasympathetic
 * "rest-and-digest" branch, raises HRV via the baroreflex, and lowers arousal —
 * the same mechanism ONDA's live-HRV breathing trains.
 *
 * Educational relaxation tool, not a medical device or a treatment for any
 * condition. Anyone with a respiratory or cardiovascular condition, or who
 * feels dizzy, should stop and breathe normally.
 */

import type { ScienceSource } from './sources'

export type PhaseKind = 'in' | 'topup' | 'hold' | 'out'

export interface BreathPhase {
  /** Cue type — the visible label comes from the page's language file. */
  kind: PhaseKind
  /** Phase duration in seconds (may be fractional, e.g. 5.5). */
  seconds: number
  /** Target circle scale at the end of the phase (1 = full inhale, ~0.42 = full exhale). */
  scale: number
}

export interface BreathingPattern {
  /** Stable id, also used as the ?p= deep-link value. */
  id: 'box' | '478' | 'coherent' | 'calming' | 'sigh'
  phases: BreathPhase[]
}

const FULL = 1
const EMPTY = 0.42

export const BREATHING_PATTERNS: BreathingPattern[] = [
  {
    id: 'box',
    phases: [
      { kind: 'in', seconds: 4, scale: FULL },
      { kind: 'hold', seconds: 4, scale: FULL },
      { kind: 'out', seconds: 4, scale: EMPTY },
      { kind: 'hold', seconds: 4, scale: EMPTY },
    ],
  },
  {
    id: '478',
    phases: [
      { kind: 'in', seconds: 4, scale: FULL },
      { kind: 'hold', seconds: 7, scale: FULL },
      { kind: 'out', seconds: 8, scale: EMPTY },
    ],
  },
  {
    id: 'coherent',
    phases: [
      { kind: 'in', seconds: 5.5, scale: FULL },
      { kind: 'out', seconds: 5.5, scale: EMPTY },
    ],
  },
  {
    id: 'calming',
    phases: [
      { kind: 'in', seconds: 4, scale: FULL },
      { kind: 'out', seconds: 6, scale: EMPTY },
    ],
  },
  {
    // Physiological sigh / cyclic sighing (Balban 2023): a full nasal inhale,
    // a short second "top-up" inhale, then a long slow exhale.
    id: 'sigh',
    phases: [
      { kind: 'in', seconds: 2.5, scale: 0.85 },
      { kind: 'topup', seconds: 1, scale: FULL },
      { kind: 'out', seconds: 6, scale: EMPTY },
    ],
  },
]

export const BREATHING_SOURCES: ScienceSource[] = [
  {
    authors: 'Zaccaro A, Piarulli A, Laurino M, et al.',
    year: 2018,
    title: 'How breath-control can change your life: a systematic review on psycho-physiological correlates of slow breathing',
    journal: 'Frontiers in Human Neuroscience, 12:353',
    contributes: 'Systematic review linking slow breathing to higher HRV, parasympathetic shift and reduced arousal.',
    url: 'https://doi.org/10.3389/fnhum.2018.00353',
  },
  {
    authors: 'Lehrer PM, Gevirtz R',
    year: 2014,
    title: 'Heart rate variability biofeedback: how and why does it work?',
    journal: 'Frontiers in Psychology, 5:756',
    contributes: 'Explains the ~0.1 Hz (≈6 breaths/min) resonance frequency and baroreflex mechanism behind coherent breathing.',
    url: 'https://doi.org/10.3389/fpsyg.2014.00756',
  },
  {
    authors: 'Balban MY, Neri E, Kogon MM, et al.',
    year: 2023,
    title: 'Brief structured respiration practices enhance mood and reduce physiological arousal',
    journal: 'Cell Reports Medicine, 4(1):100895',
    contributes: 'RCT: 5 minutes a day of exhale-emphasised breathing — cyclic sighing most of all — improved mood and lowered resting breathing rate more than mindfulness meditation.',
    url: 'https://doi.org/10.1016/j.xcrm.2022.100895',
  },
]
