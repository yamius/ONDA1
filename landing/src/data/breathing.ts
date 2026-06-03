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

export interface BreathPhase {
  /** Cue shown to the user. */
  label: string
  /** Phase duration in seconds (may be fractional, e.g. 5.5). */
  seconds: number
  /** Target circle scale at the end of the phase (1 = full inhale, ~0.4 = full exhale). */
  scale: number
}

export interface BreathingPattern {
  id: string
  name: string
  tagline: string
  /** Phases in order; zero-length phases are simply omitted. */
  phases: BreathPhase[]
}

const FULL = 1
const EMPTY = 0.42

export const BREATHING_PATTERNS: BreathingPattern[] = [
  {
    id: 'box',
    name: 'Box Breathing',
    tagline: 'Equal 4-4-4-4 — focus & calm under pressure (used by Navy SEALs)',
    phases: [
      { label: 'Breathe in', seconds: 4, scale: FULL },
      { label: 'Hold', seconds: 4, scale: FULL },
      { label: 'Breathe out', seconds: 4, scale: EMPTY },
      { label: 'Hold', seconds: 4, scale: EMPTY },
    ],
  },
  {
    id: '478',
    name: '4-7-8 Breathing',
    tagline: 'Long hold + long exhale — a fast off-switch for sleep',
    phases: [
      { label: 'Breathe in', seconds: 4, scale: FULL },
      { label: 'Hold', seconds: 7, scale: FULL },
      { label: 'Breathe out', seconds: 8, scale: EMPTY },
    ],
  },
  {
    id: 'coherent',
    name: 'Coherent Breathing',
    tagline: '≈5.5 breaths/min — the resonance sweet spot for HRV',
    phases: [
      { label: 'Breathe in', seconds: 5.5, scale: FULL },
      { label: 'Breathe out', seconds: 5.5, scale: EMPTY },
    ],
  },
  {
    id: 'calming',
    name: 'Extended Exhale',
    tagline: 'Inhale 4, exhale 6 — longer out-breath to down-shift fast',
    phases: [
      { label: 'Breathe in', seconds: 4, scale: FULL },
      { label: 'Breathe out', seconds: 6, scale: EMPTY },
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
    contributes: 'RCT showing 5 min/day of slow, exhale-emphasised breathing improves mood and lowers arousal more than mindfulness.',
    url: 'https://doi.org/10.1016/j.xcrm.2022.100895',
  },
]

export const BREATHING_METHODOLOGY =
  'Slow, paced breathing is one of the few voluntary levers on the autonomic nervous system. Breathing at roughly six breaths per minute hits the baroreflex "resonance" frequency, maximising heart-rate variability and nudging the system toward parasympathetic (rest-and-digest) dominance (Lehrer & Gevirtz 2014; Zaccaro 2018). Emphasising the exhale adds a further calming effect — a longer out-breath increases vagal tone, and an RCT found brief daily exhale-focused breathing improved mood and lowered arousal more than mindfulness (Balban 2023). The patterns here apply those principles: Box breathing for steady focus, 4-7-8 and Extended Exhale for winding down, and Coherent breathing (~5.5/min) for the HRV sweet spot. This is an educational relaxation tool, not a medical device. If you have a respiratory or cardiovascular condition, or feel light-headed, stop and breathe normally.'

export const BREATHING_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'What is box breathing?',
    a: 'Box breathing is a simple pattern of four equal phases — inhale 4 seconds, hold 4, exhale 4, hold 4 — repeated in a loop. Popularised by the US military for staying calm and focused under stress, the equal rhythm and the held breath slow your breathing rate and steady the nervous system. Use the Box preset here to follow it visually.',
  },
  {
    q: 'How does 4-7-8 breathing help you sleep?',
    a: 'In 4-7-8 breathing you inhale for 4 seconds, hold for 7, and exhale slowly for 8. The long hold and even longer exhale push your breathing rate right down and emphasise the out-breath, which raises vagal (parasympathetic) tone — shifting you out of "fight or flight" and toward the relaxed state that precedes sleep. It is a popular bedtime down-shift.',
  },
  {
    q: 'What is coherent or resonance breathing?',
    a: 'Coherent breathing means breathing slowly and evenly at around five to six breaths per minute — the "resonance frequency" where your heart rate, breathing and blood-pressure rhythms sync up and HRV is maximised (Lehrer & Gevirtz 2014). The Coherent preset paces you at about 5.5 breaths per minute; everyone’s exact resonance rate differs slightly.',
  },
  {
    q: 'Does slow breathing actually calm the nervous system?',
    a: 'Yes — it is one of the best-evidenced self-regulation tools. A systematic review (Zaccaro 2018) links slow breathing to higher HRV, greater parasympathetic activity and lower arousal, and a randomised trial (Balban 2023) found just five minutes a day of slow, exhale-focused breathing improved mood and reduced physiological arousal. It is not a cure for anxiety disorders, but it is a fast, free, low-risk down-regulation tool.',
  },
  {
    q: 'Why emphasise the exhale?',
    a: 'Your heart rate naturally speeds up slightly on the inhale and slows on the exhale (respiratory sinus arrhythmia). Making the exhale longer than the inhale therefore spends more time in the "slow-down" phase, increasing vagal tone and calming you faster. That is why the 4-7-8 and Extended Exhale patterns work well for stress and sleep.',
  },
]
