/**
 * Short chronotype quiz, inspired by the validated Horne–Östberg
 * Morningness–Eveningness Questionnaire (MEQ) but condensed to 6 questions
 * for a fast, shareable web tool. Scores map to three evidence-based types:
 * Morning, Intermediate, Evening. (We nod to the popular Lion/Bear/Wolf
 * animal labels for familiarity, but the classification is MEQ-style, not a
 * proprietary framework.)
 *
 * Output is a personalised daily-timing protocol per type — when to wake,
 * do focused work, train, cut caffeine and sleep. Educational, not medical;
 * chronotype shifts with age and can be partially trained with light timing.
 */

export interface QuizOption {
  label: string
  points: number
}
export interface QuizQuestion {
  id: string
  q: string
  options: QuizOption[]
}

export const CHRONOTYPE_QUESTIONS: QuizQuestion[] = [
  {
    id: 'wake',
    q: 'If you were entirely free to plan your day, what time would you get up?',
    options: [
      { label: 'Before 6:30', points: 5 },
      { label: '6:30 – 7:45', points: 4 },
      { label: '7:45 – 9:30', points: 3 },
      { label: '9:30 – 11:00', points: 2 },
      { label: 'After 11:00', points: 1 },
    ],
  },
  {
    id: 'bed',
    q: 'And what time would you go to bed if you were entirely free?',
    options: [
      { label: 'Before 21:00', points: 5 },
      { label: '21:00 – 22:15', points: 4 },
      { label: '22:15 – 00:30', points: 3 },
      { label: '00:30 – 01:45', points: 2 },
      { label: 'After 01:45', points: 1 },
    ],
  },
  {
    id: 'alert',
    q: 'How alert do you feel in the first half hour after waking up?',
    options: [
      { label: 'Very alert', points: 4 },
      { label: 'Fairly alert', points: 3 },
      { label: 'Fairly groggy', points: 2 },
      { label: 'Very groggy', points: 1 },
    ],
  },
  {
    id: 'peak',
    q: 'When do you feel at your mental best?',
    options: [
      { label: 'Early morning', points: 4 },
      { label: 'Late morning', points: 3 },
      { label: 'Afternoon', points: 2 },
      { label: 'Evening / night', points: 1 },
    ],
  },
  {
    id: 'exercise',
    q: 'If you had to do hard exercise, when would you prefer it?',
    options: [
      { label: 'Morning', points: 3 },
      { label: 'Midday / afternoon', points: 2 },
      { label: 'Evening', points: 1 },
    ],
  },
  {
    id: 'selfid',
    q: 'In your own sense of it, are you a morning or an evening person?',
    options: [
      { label: 'Definitely morning', points: 4 },
      { label: 'More morning than evening', points: 3 },
      { label: 'More evening than morning', points: 2 },
      { label: 'Definitely evening', points: 1 },
    ],
  },
]

export const MIN_SCORE = 6
export const MAX_SCORE = 25

export type Chronotype = 'morning' | 'intermediate' | 'evening'

export interface ChronotypeProfile {
  type: Chronotype
  name: string
  animal: string
  tagline: string
  description: string
  protocol: Array<{ label: string; value: string }>
}

export const CHRONOTYPE_PROFILES: Record<Chronotype, ChronotypeProfile> = {
  morning: {
    type: 'morning',
    name: 'Morning type',
    animal: 'the "Lion"',
    tagline: 'Up early, sharp early, fading by evening.',
    description:
      'Your body clock runs early: you wake easily, hit peak alertness in the first half of the day, and wind down well before midnight. Front-load your hardest cognitive work — your prefrontal edge is gone by late afternoon. Guard against social schedules that push your bedtime late, which costs you more than it would an evening type.',
    protocol: [
      { label: 'Natural wake', value: '5:30 – 6:30' },
      { label: 'Deep-focus window', value: '7:00 – 11:00' },
      { label: 'Best training time', value: 'Morning / early afternoon' },
      { label: 'Last caffeine', value: 'By ~13:00' },
      { label: 'Ideal bedtime', value: '21:30 – 22:30' },
    ],
  },
  intermediate: {
    type: 'intermediate',
    name: 'Intermediate type',
    animal: 'the "Bear"',
    tagline: 'Tracks the sun — the most common pattern.',
    description:
      'You sit in the middle of the spectrum, roughly synced to the solar day — which is where most people land. You do not have an extreme edge in either direction, so consistency is your superpower: a steady wake time and morning light exposure lock your rhythm and give you a reliable late-morning peak.',
    protocol: [
      { label: 'Natural wake', value: '6:30 – 7:30' },
      { label: 'Deep-focus window', value: '9:00 – 12:00' },
      { label: 'Best training time', value: 'Midday or early evening' },
      { label: 'Last caffeine', value: 'By ~14:00' },
      { label: 'Ideal bedtime', value: '22:30 – 23:30' },
    ],
  },
  evening: {
    type: 'evening',
    name: 'Evening type',
    animal: 'the "Wolf"',
    tagline: 'Slow mornings, strong nights.',
    description:
      'Your clock runs late: mornings are genuinely hard (it is biology, not laziness), and your alertness, mood and even strength peak in the late afternoon and evening. The big risk is "social jet lag" — being forced to early schedules leaves you chronically sleep-deprived. Protect a later, consistent wake time where you can, and use bright morning light to nudge the clock earlier if you must shift it.',
    protocol: [
      { label: 'Natural wake', value: '8:00 – 10:00' },
      { label: 'Deep-focus window', value: '13:00 – 19:00' },
      { label: 'Best training time', value: 'Late afternoon / evening' },
      { label: 'Last caffeine', value: 'By ~15:00 (you need a longer runway)' },
      { label: 'Ideal bedtime', value: '00:00 – 01:30' },
    ],
  },
}

export function scoreToChronotype(total: number): Chronotype {
  if (total >= 20) return 'morning'
  if (total >= 14) return 'intermediate'
  return 'evening'
}

export const CHRONOTYPE_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'What is a chronotype?',
    a: 'Your chronotype is your body clock\'s natural preference for when to sleep, wake and peak — driven largely by genetics (the PER3 gene among others) and your circadian rhythm. It sits on a spectrum from strong "morning" types to strong "evening" types, with most people in the middle.',
  },
  {
    q: 'Can you change your chronotype?',
    a: 'Partly. Your underlying genetic lean is fixed, but the expressed timing can be nudged 1–2 hours with disciplined light exposure (bright light early to shift earlier, dim evenings and blue-light limits to stop drifting later), consistent wake times and meal timing. You will not turn a true Wolf into a Lion, but you can stop fighting your biology.',
  },
  {
    q: 'Does chronotype change with age?',
    a: 'Yes. Children are early types, adolescents shift markedly late (peaking around age 19–20 — which is why early school start times hit teens so hard), and we drift earlier again through adulthood and into older age. Re-take a chronotype check every few years.',
  },
  {
    q: 'Why does working against my chronotype matter?',
    a: 'Being forced onto a schedule that clashes with your clock creates "social jet lag" — a chronic mismatch linked in research to worse sleep, mood, metabolic markers and performance. Aligning your hardest work and your sleep window with your natural timing, where life allows, is one of the highest-leverage, zero-cost biohacks.',
  },
  {
    q: 'Is this the same as the Lion/Bear/Wolf/Dolphin test?',
    a: 'Similar idea. The popular animal framework is one author\'s four-type model; this quiz uses the three classic, research-validated categories (morning / intermediate / evening) from the Morningness–Eveningness Questionnaire, with the animal names noted just for familiarity.',
  },
]
