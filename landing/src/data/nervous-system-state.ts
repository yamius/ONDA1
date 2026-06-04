/**
 * Nervous-system state quiz — "which autonomic state are you in?"
 *
 * Reads your current balance between two forms of dysregulation: sympathetic
 * activation (fight-or-flight: wired, anxious, tense) and a dorsal/shutdown
 * pattern (flat, numb, withdrawn), versus a regulated, calm-and-connected state.
 *
 * Honesty note: the popular "vagal states" framing comes from polyvagal theory
 * (Porges 2009), whose finer evolutionary/anatomical claims are debated in the
 * literature. What is well supported is the practical core: you can read your
 * autonomic state and shift it — slow, long-exhale breathing raises vagal tone
 * (Gerritsen & Band 2018), and vagal tone indexed by HRV tracks self-regulation
 * (Laborde 2017). This is an educational self-check, not a diagnosis.
 */

import type { ScienceSource } from './sources'

export type StateTrack = 'symp' | 'dorsal'

export interface StateOption {
  label: string
  points: number
}
export interface StateQuestion {
  id: string
  q: string
  track: StateTrack
  options: StateOption[]
}

const FREQ: StateOption[] = [
  { label: 'Never', points: 0 },
  { label: 'Rarely', points: 1 },
  { label: 'Sometimes', points: 2 },
  { label: 'Often', points: 3 },
  { label: 'Always', points: 4 },
]

export const NS_QUESTIONS: StateQuestion[] = [
  { id: 'racing', track: 'symp', q: 'My mind races, or I feel "wired but tired".', options: FREQ },
  { id: 'tense', track: 'symp', q: 'I feel tense, on-edge or unable to fully relax.', options: FREQ },
  { id: 'anxious', track: 'symp', q: 'Small things make me anxious, jumpy or irritable.', options: FREQ },
  { id: 'switchoff', track: 'symp', q: 'I find it hard to switch off, even when I want to.', options: FREQ },
  { id: 'numb', track: 'dorsal', q: 'I feel numb, flat or emotionally shut down.', options: FREQ },
  { id: 'disconnected', track: 'dorsal', q: 'I feel disconnected from people or the world around me.', options: FREQ },
  { id: 'heavy', track: 'dorsal', q: 'I feel a heavy, can’t-get-going kind of exhaustion.', options: FREQ },
  { id: 'withdraw', track: 'dorsal', q: 'I feel like withdrawing from everything, or that nothing matters.', options: FREQ },
]

const MAX_PER_TRACK = 4 * 4 // 4 questions × 4 points = 16

export type NsState = 'regulated' | 'activated' | 'shutdown'

export interface NsProfile {
  state: NsState
  name: string
  tagline: string
  description: string
  protocol: Array<{ label: string; value: string }>
}

export const NS_PROFILES: Record<NsState, NsProfile> = {
  regulated: {
    state: 'regulated',
    name: 'Regulated — calm & connected',
    tagline: 'Your "ventral" state: safe, social, able to engage.',
    description:
      'Right now you show few signs of either fight-or-flight or shutdown. This is the regulated state where you think clearly, connect with people and recover well — the best window for hard work, learning and genuine rest. The goal is to protect it: regulation is a practice, not a fixed trait.',
    protocol: [
      { label: 'Maintain', value: 'A daily dose of slow breathing or movement to keep vagal tone high' },
      { label: 'Protect', value: 'Sleep, sunlight and real connection — the pillars that keep you here' },
      { label: 'Use it', value: 'Front-load demanding work and learning into this state while you have it' },
    ],
  },
  activated: {
    state: 'activated',
    name: 'Sympathetic activation — fight-or-flight',
    tagline: 'Wired, tense, hard to switch off.',
    description:
      'Your answers lean toward sympathetic activation — the "fight-or-flight" gear: alert, tense and hard to power down. Useful in short bursts, draining when it becomes the default. The lever here is active down-regulation: you can’t think your way calm, but you can breathe and move your way there. A longer exhale is the fastest switch.',
    protocol: [
      { label: 'Now', value: 'Slow your breathing with a long exhale — try the Breathing Pacer (4-7-8 or extended-exhale)' },
      { label: 'Discharge', value: 'Move: a walk or light exercise burns off the stress chemistry' },
      { label: 'Reduce input', value: 'Cut caffeine and screens that keep you revved; dim the evening' },
      { label: 'Reset', value: 'A cool-water splash to the face nudges the calming "dive" reflex' },
    ],
  },
  shutdown: {
    state: 'shutdown',
    name: 'Dorsal shutdown — flat & withdrawn',
    tagline: 'Numb, disconnected, low energy.',
    description:
      'Your answers lean toward a shutdown pattern — flat, numb, disconnected, low. This is the system pulling the handbrake under sustained overload. Importantly, forcing "relaxation" can deepen it; the way out is gentle, gradual re-activation and connection rather than more rest. If this flatness or hopelessness is persistent, please treat it as a reason to reach out for support.',
    protocol: [
      { label: 'Gently move', value: 'Light, rhythmic movement (a slow walk, a stretch) — activation before calm' },
      { label: 'Orient out', value: 'Sunlight, fresh air, and looking around the room to signal safety' },
      { label: 'Small contact', value: 'A short message or call to one safe person; tiny social doses count' },
      { label: 'Get support', value: 'If low mood, numbness or hopelessness persists, talk to a doctor or therapist' },
    ],
  },
}

export interface NsResult {
  profile: NsProfile
  sympPercent: number
  dorsalPercent: number
}

export function scoreNervousSystem(answers: Record<string, number>): NsResult {
  let symp = 0
  let dorsal = 0
  for (const q of NS_QUESTIONS) {
    const v = answers[q.id] ?? 0
    if (q.track === 'symp') symp += v
    else dorsal += v
  }
  const sympPercent = Math.round((symp / MAX_PER_TRACK) * 100)
  const dorsalPercent = Math.round((dorsal / MAX_PER_TRACK) * 100)
  let state: NsState
  if (sympPercent < 30 && dorsalPercent < 30) state = 'regulated'
  else if (sympPercent >= dorsalPercent) state = 'activated'
  else state = 'shutdown'
  return { profile: NS_PROFILES[state], sympPercent, dorsalPercent }
}

export const NS_SOURCES: ScienceSource[] = [
  {
    authors: 'Porges SW',
    year: 2009,
    title: 'The polyvagal theory: new insights into adaptive reactions of the autonomic nervous system',
    journal: 'Cleveland Clinic Journal of Medicine, 76(Suppl 2):S86–S90',
    contributes: 'Origin of the "vagal states" framing of regulation, fight-or-flight and shutdown used here (a theory, with debated specifics).',
    url: 'https://doi.org/10.3949/ccjm.76.s2.17',
  },
  {
    authors: 'Laborde S, Mosley E, Thayer JF',
    year: 2017,
    title: 'Heart rate variability and cardiac vagal tone in psychophysiological research',
    journal: 'Frontiers in Psychology, 8:213',
    contributes: 'Links vagal tone (indexed by HRV) to self-regulation across emotion, cognition and health.',
    url: 'https://doi.org/10.3389/fpsyg.2017.00213',
  },
  {
    authors: 'Gerritsen RJS, Band GPH',
    year: 2018,
    title: 'Breath of life: the respiratory vagal stimulation model of contemplative activity',
    journal: 'Frontiers in Human Neuroscience, 12:397',
    contributes: 'Mechanism for why slow, exhale-emphasised breathing stimulates the vagus and shifts state — the basis of the protocols.',
    url: 'https://doi.org/10.3389/fnhum.2018.00397',
  },
]

export const NS_METHODOLOGY =
  'This check estimates your balance between two kinds of dysregulation — sympathetic activation (fight-or-flight) and a dorsal/shutdown pattern — against a regulated, calm-and-connected state, scoring each on its own scale. The "vagal states" language comes from polyvagal theory (Porges 2009); its broad map is widely used in therapy, though some of its finer evolutionary and anatomical claims are debated, so we treat the states as a practical lens, not settled fact. What is well supported is the actionable part: vagal tone (indexed by HRV) tracks self-regulation (Laborde 2017), and slow, long-exhale breathing stimulates the vagus and shifts state (Gerritsen & Band 2018). It is an educational self-awareness tool, not a diagnosis — and a persistent shutdown pattern, low mood or hopelessness is a reason to seek professional support.'

export const NS_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'What does "fight-or-flight vs shutdown" mean?',
    a: 'They are two ways your autonomic nervous system responds to stress. Sympathetic activation is the "fight-or-flight" gear — wired, tense, anxious, hard to switch off. The dorsal/shutdown pattern is the opposite extreme — flat, numb, disconnected, low — when the system pulls a handbrake under sustained overload. Between them is the regulated, calm-and-connected state where you function best.',
  },
  {
    q: 'How do I get out of fight-or-flight?',
    a: 'You can’t reason your way calm, but you can breathe and move your way there. The fastest lever is a longer exhale — slow, extended-exhale or 4-7-8 breathing stimulates the vagus nerve and shifts you toward calm (Gerritsen & Band 2018). Light movement to discharge stress chemistry, cutting caffeine and screens, and a cool splash of water to the face all help too.',
  },
  {
    q: 'What if I’m in shutdown rather than wired?',
    a: 'Shutdown (flat, numb, withdrawn) needs the opposite approach: gentle re-activation, not more "relaxation", which can deepen it. Light rhythmic movement, sunlight and fresh air, and small doses of safe social contact help nudge the system back online. If the flatness, numbness or hopelessness is persistent, please treat it as a signal to reach out to a doctor or therapist.',
  },
  {
    q: 'Is this based on polyvagal theory — and is that proven?',
    a: 'The three-state framing comes from polyvagal theory (Porges). It is influential and widely used clinically, but some of its specific evolutionary and anatomical claims are debated among researchers. We use it as a practical lens for noticing and shifting your state, and we anchor the advice in well-supported findings about vagal tone, HRV and slow breathing rather than the contested specifics.',
  },
  {
    q: 'How is this linked to HRV and the vagus nerve?',
    a: 'The vagus nerve is the main parasympathetic ("rest-and-digest") brake on your heart, and its activity — vagal tone — is reflected in your heart-rate variability. Higher vagal tone is associated with better self-regulation and a quicker return to calm after stress (Laborde 2017). Practices that raise vagal tone, especially slow breathing, are central to moving out of fight-or-flight.',
  },
]
