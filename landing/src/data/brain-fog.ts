/**
 * Brain-fog / focus quiz.
 *
 * "Brain fog" is a lay term for a symptom — forgetfulness, slow thinking,
 * trouble concentrating — not a diagnosis, and it has many possible drivers
 * (McWhirter 2023). This quiz scores four common, modifiable contributors —
 * sleep, stress, digital overstimulation and lifestyle — and surfaces the ones
 * most likely to be fogging you, each with a targeted protocol. Educational
 * only: persistent or severe cognitive symptoms need a medical work-up.
 */

import type { ScienceSource } from './sources'

export type FogDomain = 'sleep' | 'stress' | 'stimulation' | 'lifestyle'

export interface FogOption {
  label: string
  points: number
}
export interface FogQuestion {
  id: string
  q: string
  domain: FogDomain
  options: FogOption[]
}

const FREQ: FogOption[] = [
  { label: 'Never', points: 0 },
  { label: 'Rarely', points: 1 },
  { label: 'Sometimes', points: 2 },
  { label: 'Often', points: 3 },
  { label: 'Always', points: 4 },
]

export const FOG_QUESTIONS: FogQuestion[] = [
  { id: 'sleep-short', domain: 'sleep', q: 'I sleep less than 7 hours, or wake unrefreshed.', options: FREQ },
  { id: 'sleep-irreg', domain: 'sleep', q: 'My sleep and wake times are irregular day to day.', options: FREQ },
  { id: 'stress-load', domain: 'stress', q: 'I feel chronically stressed, overwhelmed or "on".', options: FREQ },
  { id: 'stress-rumin', domain: 'stress', q: 'My mind feels busy and I struggle to be present.', options: FREQ },
  { id: 'stim-scroll', domain: 'stimulation', q: 'I switch between apps/tabs constantly and rarely single-task.', options: FREQ },
  { id: 'stim-screen', domain: 'stimulation', q: 'My first and last act of the day is checking a screen.', options: FREQ },
  { id: 'life-move', domain: 'lifestyle', q: 'I sit most of the day with little movement or daylight.', options: FREQ },
  { id: 'life-fuel', domain: 'lifestyle', q: 'I’m often under-hydrated or run on caffeine and quick carbs.', options: FREQ },
]

const MAX_PER_DOMAIN = 2 * 4 // 2 questions × 4

export interface DomainInfo {
  name: string
  summary: string
  protocol: string[]
  tools: Array<{ slug: string; label: string }>
}

export const FOG_DOMAINS: Record<FogDomain, DomainInfo> = {
  sleep: {
    name: 'Sleep',
    summary: 'Short or irregular sleep is the most common and most reversible cause of foggy thinking — attention and working memory take the first hit (Lim & Dinges 2010).',
    protocol: [
      'Anchor a consistent wake time, 7 days a week — regularity beats duration.',
      'Aim for 7–9 hours; get bright light early and cut caffeine ~8–10 h before bed.',
    ],
    tools: [
      { slug: 'sleep-cycle', label: 'Sleep cycle calculator' },
      { slug: 'caffeine', label: 'Caffeine cut-off' },
      { slug: 'sleep-debt', label: 'Sleep debt' },
    ],
  },
  stress: {
    name: 'Stress',
    summary: 'Chronic stress and elevated cortisol impair the prefrontal cortex — the seat of focus and working memory (Lupien 2009). A busy, "wired" mind has little bandwidth left for deep work.',
    protocol: [
      'Down-regulate daily with slow, long-exhale breathing — even 5 minutes shifts arousal.',
      'Build real breaks into the day; protect one block of single-tasked deep work.',
    ],
    tools: [
      { slug: 'breathing', label: 'Breathing pacer' },
      { slug: 'nervous-system', label: 'Nervous system state' },
    ],
  },
  stimulation: {
    name: 'Overstimulation',
    summary: 'Constant app-switching and a diet of high-stimulation feeds fragment attention and make slower, effortful focus feel impossible. The fog here is largely trained — and reversible.',
    protocol: [
      'Single-task: one screen, one tab, one job — batch the rest.',
      'Cut the cheap-dopamine loops and reset your attention with a short detox.',
    ],
    tools: [
      { slug: 'digital-detox', label: 'Digital detox' },
      { slug: 'dopamine-detox', label: 'Dopamine reset' },
    ],
  },
  lifestyle: {
    name: 'Lifestyle',
    summary: 'Sitting all day, dehydration, blood-sugar swings and no daylight quietly drain cognitive sharpness. The basics move the needle more than any nootropic.',
    protocol: [
      'Move every hour and get outside — even a short walk in daylight clears the head.',
      'Hydrate, and build meals around protein and fibre to avoid glucose crashes.',
    ],
    tools: [
      { slug: 'water', label: 'Water intake' },
      { slug: 'zone-2', label: 'Zone 2 heart rate' },
    ],
  },
}

export interface FogDomainScore {
  domain: FogDomain
  info: DomainInfo
  percent: number
}
export interface FogResult {
  overallPercent: number
  scores: FogDomainScore[] // all four, sorted desc
  topDrivers: FogDomainScore[] // those >= 40%, capped at 2
}

export function scoreBrainFog(answers: Record<string, number>): FogResult {
  const sums: Record<FogDomain, number> = { sleep: 0, stress: 0, stimulation: 0, lifestyle: 0 }
  let total = 0
  for (const q of FOG_QUESTIONS) {
    const v = answers[q.id] ?? 0
    sums[q.domain] += v
    total += v
  }
  const scores: FogDomainScore[] = (Object.keys(sums) as FogDomain[])
    .map((d) => ({ domain: d, info: FOG_DOMAINS[d], percent: Math.round((sums[d] / MAX_PER_DOMAIN) * 100) }))
    .sort((a, b) => b.percent - a.percent)
  const overallPercent = Math.round((total / (FOG_QUESTIONS.length * 4)) * 100)
  const topDrivers = scores.filter((s) => s.percent >= 40).slice(0, 2)
  return { overallPercent, scores, topDrivers }
}

export const FOG_SOURCES: ScienceSource[] = [
  {
    authors: 'McWhirter L, Smyth H, Hoeritzauer I, et al.',
    year: 2023,
    title: 'What is brain fog?',
    journal: 'Journal of Neurology, Neurosurgery & Psychiatry, 94(4):321–325',
    contributes: 'Establishes that "brain fog" is a symptom description, not a diagnosis — with many possible causes that warrant a proper work-up.',
    url: 'https://doi.org/10.1136/jnnp-2022-329683',
  },
  {
    authors: 'Lim J, Dinges DF',
    year: 2010,
    title: 'A meta-analysis of the impact of short-term sleep deprivation on cognitive variables',
    journal: 'Psychological Bulletin, 136(3):375–389',
    contributes: 'Sleep loss reliably degrades attention and working memory — the sleep-driven fog pathway.',
    url: 'https://doi.org/10.1037/a0018883',
  },
  {
    authors: 'Lupien SJ, McEwen BS, Gunnar MR, Heim C',
    year: 2009,
    title: 'Effects of stress throughout the lifespan on the brain, behaviour and cognition',
    journal: 'Nature Reviews Neuroscience, 10:434–445',
    contributes: 'How chronic stress and cortisol impair prefrontal cognition — the stress-driven fog pathway.',
    url: 'https://doi.org/10.1038/nrn2639',
  },
]

export const FOG_METHODOLOGY =
  '"Brain fog" isn’t a medical diagnosis — it’s a description of a symptom (forgetfulness, slow or effortful thinking, trouble concentrating) with many possible causes (McWhirter 2023). Rather than give you one label, this quiz scores four of the most common, modifiable contributors and surfaces the ones most likely to be fogging you: sleep (loss reliably degrades attention and memory; Lim & Dinges 2010), stress (chronic cortisol impairs the prefrontal cortex; Lupien 2009), digital overstimulation (fragmented attention), and lifestyle basics (movement, hydration, blood sugar, daylight). Each flagged driver comes with a targeted protocol. It is an educational self-check, not a diagnosis — persistent, severe or worsening cognitive symptoms (especially with other signs) deserve a medical work-up to rule out causes like thyroid problems, anaemia, depression or post-viral syndromes.'

export const FOG_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'What causes brain fog?',
    a: 'There’s no single cause — "brain fog" is a symptom, not a diagnosis (McWhirter 2023). The most common everyday, fixable drivers are poor or short sleep, chronic stress, digital overstimulation, and lifestyle basics (too little movement, dehydration, blood-sugar swings, no daylight). Medical causes — thyroid issues, anaemia, depression, post-viral syndromes, medication side-effects — also exist, which is why persistent fog warrants a check-up.',
  },
  {
    q: 'How do I get rid of brain fog fast?',
    a: 'Start with the biggest lever the quiz flags. For most people that’s sleep: a consistent wake time and 7–9 hours sharpen attention quickly. Alongside it, a few minutes of slow breathing to drop stress, a single-tasking block instead of constant app-switching, and a short walk in daylight with proper hydration often lift the fog within a day or two.',
  },
  {
    q: 'Is brain fog a medical condition?',
    a: 'Not in itself — it’s a way people describe cognitive symptoms, and the term isn’t a clinical diagnosis. But it can be a sign of an underlying condition. If your fog is persistent, severe, getting worse, or comes with other symptoms (low mood, fatigue, weight or temperature changes), see a doctor to rule out treatable medical causes.',
  },
  {
    q: 'Can screens and social media cause brain fog?',
    a: 'They can contribute. Constantly switching between apps and feeds trains your attention to crave novelty and makes slow, effortful focus feel harder — a fog that’s largely learned and reversible. Single-tasking, cutting non-essential notifications and a short digital reset typically restore concentration over days to weeks.',
  },
  {
    q: 'Does this quiz diagnose anything?',
    a: 'No. It’s an educational self-check that estimates which common, modifiable factors are most likely contributing to your foggy thinking, and points you to practical steps. It can’t see medical causes. If something feels off beyond lifestyle, treat the quiz as a prompt to also speak with a clinician.',
  },
]
