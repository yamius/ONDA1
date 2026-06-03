/**
 * Burnout / stress-load self-assessment.
 *
 * Burnout is defined by the WHO (ICD-11, QD85) as an occupational phenomenon —
 * NOT a medical diagnosis — arising from chronic, unmanaged stress, across three
 * dimensions: exhaustion, cynicism/detachment, and reduced efficacy (Maslach &
 * Leiter 2016). These 8 questions are inspired by those dimensions and the
 * public-domain Copenhagen Burnout Inventory (Kristensen 2005), but this is an
 * educational self-check, NOT a diagnostic instrument. A high score is a signal
 * to slow down and, where needed, seek professional support — not a diagnosis.
 */

import type { ScienceSource } from './sources'

export interface QuizOption {
  label: string
  points: number
}
export interface QuizQuestion {
  id: string
  q: string
  options: QuizOption[]
}

// Standard frequency scale (more often = more burnout signal).
const FREQ: QuizOption[] = [
  { label: 'Never', points: 0 },
  { label: 'Rarely', points: 1 },
  { label: 'Sometimes', points: 2 },
  { label: 'Often', points: 3 },
  { label: 'Always', points: 4 },
]
// Reverse scale for efficacy items (more often = LESS burnout signal).
const FREQ_REV: QuizOption[] = [
  { label: 'Never', points: 4 },
  { label: 'Rarely', points: 3 },
  { label: 'Sometimes', points: 2 },
  { label: 'Often', points: 1 },
  { label: 'Always', points: 0 },
]

export const BURNOUT_QUESTIONS: QuizQuestion[] = [
  { id: 'drained', q: 'How often do you feel emotionally drained or depleted by your day?', options: FREQ },
  { id: 'tired', q: 'How often do you wake up tired, even after what should be enough sleep?', options: FREQ },
  { id: 'recover', q: 'How often can you NOT switch off or recover, even on days off?', options: FREQ },
  { id: 'cynical', q: 'How often do you feel cynical, detached or numb about things you used to care about?', options: FREQ },
  { id: 'irritable', q: 'How often do you feel unusually irritable or impatient with people?', options: FREQ },
  { id: 'dread', q: 'How often do you feel dread about starting the day or the week?', options: FREQ },
  { id: 'effective', q: 'How often do you feel effective and on top of things?', options: FREQ_REV },
  { id: 'meaning', q: 'How often do you feel a sense of accomplishment or meaning in what you do?', options: FREQ_REV },
]

export const MAX_SCORE = BURNOUT_QUESTIONS.length * 4 // 32

export type BurnoutTier = 'low' | 'building' | 'high' | 'severe'

export interface BurnoutProfile {
  tier: BurnoutTier
  name: string
  tagline: string
  description: string
  protocol: Array<{ label: string; value: string }>
}

export const BURNOUT_PROFILES: Record<BurnoutTier, BurnoutProfile> = {
  low: {
    tier: 'low',
    name: 'Low stress-load',
    tagline: 'Coping well — keep it that way.',
    description:
      'Your answers show few signs of burnout right now. You are managing your load and recovering between demands. The goal here is maintenance: keep the recovery habits that are working, and stay alert to creeping changes in energy, cynicism or sleep — burnout builds slowly.',
    protocol: [
      { label: 'Maintain', value: 'A daily down-regulation habit (slow breathing, a walk, real downtime)' },
      { label: 'Protect', value: 'Consistent sleep and at least one full recovery day a week' },
      { label: 'Watch', value: 'Early signals: dreading Mondays, shorter temper, unrefreshing sleep' },
    ],
  },
  building: {
    tier: 'building',
    name: 'Building stress-load',
    tagline: 'Early warning signs — act before it compounds.',
    description:
      'You are showing early burnout signals — the stage where small changes have the biggest payoff. This is not a crisis, but it is a clear nudge to protect recovery now rather than pushing through. Chronic, unmanaged stress is what tips this into full burnout (WHO ICD-11), so treat the warning seriously while it is still cheap to reverse.',
    protocol: [
      { label: 'First move', value: 'Add a daily nervous-system down-shift — a few minutes of slow, long-exhale breathing' },
      { label: 'Boundaries', value: 'Cut after-hours work pings and notifications; protect real off-time' },
      { label: 'Sleep', value: 'Prioritise 7–9 h with a consistent wake time — recovery starts here' },
      { label: 'Load', value: 'Name your top stressor and remove or renegotiate one piece of it this week' },
    ],
  },
  high: {
    tier: 'high',
    name: 'High stress-load',
    tagline: 'Significant burnout signals — recovery is the priority.',
    description:
      'Your answers point to a high burnout load across exhaustion, detachment and/or reduced effectiveness. Willpower and pushing harder will not fix this — recovery has to become the priority, not the leftover. Reducing demand matters as much as adding self-care. If this has lasted weeks, consider talking to a doctor or therapist; burnout overlaps with anxiety and depression and benefits from support.',
    protocol: [
      { label: 'Reduce', value: 'Actively lighten your load — delegate, defer or drop something, not just "manage" it' },
      { label: 'Daily reset', value: 'Twice-daily slow breathing or other down-regulation; treat it as non-negotiable' },
      { label: 'Reconnect', value: 'Protect time with people and activities that restore you, away from screens' },
      { label: 'Support', value: 'Consider talking to a GP or therapist if symptoms persist beyond a couple of weeks' },
    ],
  },
  severe: {
    tier: 'severe',
    name: 'Severe stress-load',
    tagline: 'Strong burnout signals — this is a signal to act.',
    description:
      'Your answers show strong, pervasive burnout signals. Please read this as information, not a verdict — but do take it seriously. At this level, self-help tactics are a complement, not a substitute, for reducing demand and getting support. Burnout at this intensity often co-occurs with depression and anxiety, which are very treatable. Reaching out is a strength, not a failure.',
    protocol: [
      { label: 'Talk to someone', value: 'Speak to a doctor or mental-health professional soon — this is the most important step' },
      { label: 'Lower demand', value: 'Where at all possible, reduce hours/load now; recovery needs space to happen' },
      { label: 'Basics first', value: 'Anchor sleep, food, daylight and gentle movement before any "optimisation"' },
      { label: 'Down-regulate', value: 'Use slow breathing to take the edge off acutely, alongside — not instead of — support' },
    ],
  },
}

export function scoreToBurnout(total: number): { tier: BurnoutTier; percent: number } {
  const percent = Math.round((total / MAX_SCORE) * 100)
  let tier: BurnoutTier
  if (percent < 25) tier = 'low'
  else if (percent < 50) tier = 'building'
  else if (percent < 70) tier = 'high'
  else tier = 'severe'
  return { tier, percent }
}

export const BURNOUT_SOURCES: ScienceSource[] = [
  {
    authors: 'World Health Organization',
    year: 2019,
    title: 'Burn-out an "occupational phenomenon": International Classification of Diseases (ICD-11, QD85)',
    journal: 'WHO',
    contributes: 'The authoritative definition — burnout as an occupational phenomenon (not a medical condition) with three dimensions.',
    url: 'https://www.who.int/news/item/28-05-2019-burn-out-an-occupational-phenomenon-international-classification-of-diseases',
  },
  {
    authors: 'Maslach C, Leiter MP',
    year: 2016,
    title: 'Understanding the burnout experience: recent research and its implications for psychiatry',
    journal: 'World Psychiatry, 15(2):103–111',
    contributes: 'The three-dimension model (exhaustion, cynicism, reduced efficacy) the questions are built around.',
    url: 'https://doi.org/10.1002/wps.20311',
  },
  {
    authors: 'Kristensen TS, Borritz M, Villadsen E, Christensen KB',
    year: 2005,
    title: 'The Copenhagen Burnout Inventory: a new tool for the assessment of burnout',
    journal: 'Work & Stress, 19(3):192–207',
    contributes: 'Public-domain burnout instrument whose frequency-based, plain-language style this self-check follows.',
    url: 'https://doi.org/10.1080/02678370500297720',
  },
]

export const BURNOUT_METHODOLOGY =
  'Burnout is defined by the WHO (ICD-11, QD85) as an occupational phenomenon from chronic, unmanaged stress — explicitly not a medical condition — with three dimensions: exhaustion, cynicism/detachment and reduced efficacy (Maslach & Leiter 2016). These eight frequency-rated questions are built around those dimensions, in the plain-language spirit of the public-domain Copenhagen Burnout Inventory (Kristensen 2005). It is a self-awareness check, not a diagnostic instrument like the proprietary Maslach Burnout Inventory, and it cannot diagnose anything. The score simply places you on a stress-load spectrum and points to a recovery-focused next step; a high result is a prompt to reduce demand and, if it persists, seek professional support — burnout overlaps with anxiety and depression, which are treatable. Educational only.'

export const BURNOUT_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'What is burnout, exactly?',
    a: 'The WHO (ICD-11) defines burnout as an occupational phenomenon resulting from chronic workplace stress that has not been successfully managed, across three dimensions: exhaustion, increased mental distance or cynicism toward your work, and reduced professional efficacy (Maslach & Leiter 2016). Notably, the WHO classifies it as an occupational phenomenon, not a medical condition.',
  },
  {
    q: 'Is this burnout test a diagnosis?',
    a: 'No. This is an educational self-check inspired by the burnout dimensions and the public-domain Copenhagen Burnout Inventory — not a clinical diagnostic tool, and burnout itself is not a formal medical diagnosis. It can help you notice where you are on the stress-load spectrum, but a high score means "slow down and consider support", not a label.',
  },
  {
    q: 'What should I do if my score is high?',
    a: 'Treat recovery as the priority, not the leftover: reduce demand where you can (not just "cope" harder), protect sleep, add daily nervous-system down-regulation like slow breathing, and reconnect with restorative people and activities. If high stress-load has lasted more than a couple of weeks — or you feel persistently low — talk to a doctor or therapist. Burnout overlaps with depression and anxiety, which are very treatable.',
  },
  {
    q: 'How is burnout linked to the nervous system and HRV?',
    a: 'Chronic stress keeps the sympathetic ("fight-or-flight") branch dominant and blunts parasympathetic recovery, which often shows up as a lower, flatter heart-rate variability over time. That is why nervous-system regulation — slow breathing, sleep, genuine downtime — is central to recovering from burnout, and why tracking your HRV trend can be an early-warning signal.',
  },
  {
    q: 'Can you recover from burnout?',
    a: 'Yes — but rarely by pushing through. Recovery generally requires reducing the chronic demand that caused it (not only adding self-care), restoring sleep and downtime, and rebuilding a sense of control and meaning. Mild, early-stage stress-load can turn around quickly; severe, long-standing burnout usually needs real changes in workload and, often, professional support.',
  },
]
