/**
 * Dopamine reset planner ("dopamine detox", honestly framed).
 *
 * IMPORTANT framing: you cannot literally "detox" dopamine, and screens do not
 * deplete it. What the popular "dopamine detox / fasting" actually is — and the
 * only part with an evidence base — is **stimulus control**, a classic CBT
 * technique: deliberately removing high-stimulation, low-effort reward loops for
 * a set window so your attention and motivation recalibrate toward ordinary,
 * higher-effort activities (Fei 2022; Volkow 2017). This tool builds a structured
 * behavioural reset on that basis. Educational, not medical advice or therapy.
 */

import type { ScienceSource } from './sources'

export interface ResetDuration {
  id: string
  label: string
  guidance: string
}

export const RESET_DURATIONS: ResetDuration[] = [
  { id: 'morning', label: 'Morning reset (first 2–3 h)', guidance: 'Keep feeds, news and notifications off until after sunlight, some movement and your first focused block. The easiest version — and the most repeatable, which is what actually matters.' },
  { id: '24h', label: '24-hour reset', guidance: 'One full day away from your biggest reward loops. Plan offline activities in advance so the empty gaps are already filled before cravings hit.' },
  { id: 'weekend', label: 'Weekend (48 h)', guidance: 'A deeper reset. Pair the cut list with nature, people and movement. Expect restlessness and boredom on day one — that discomfort is the point, and it passes.' },
  { id: '7day', label: '7-day reset', guidance: 'A full recalibration. Keep essential work tools, cut recreational high-stimulation inputs, then reintroduce them deliberately afterward — one at a time, with limits.' },
]

export interface StimInput {
  id: string
  label: string
}

export const HIGH_STIM_INPUTS: StimInput[] = [
  { id: 'shortvideo', label: 'Short-form video & social (TikTok, Reels, Shorts)' },
  { id: 'news', label: 'News & doomscrolling' },
  { id: 'gaming', label: 'Video games' },
  { id: 'porn', label: 'Pornography' },
  { id: 'junkfood', label: 'Ultra-processed food & sugar' },
  { id: 'shopping', label: 'Online shopping' },
  { id: 'notifications', label: 'Non-essential notifications' },
]

export const REPLACEMENTS: Array<{ label: string; note: string }> = [
  { label: 'Morning sunlight + a phone-free walk', note: 'Anchors your body clock and lifts mood without a spike-and-crash.' },
  { label: 'Exercise or any real movement', note: 'A slow, clean rise in drive that lasts hours — the opposite of a scroll hit.' },
  { label: 'Read a physical book', note: 'Sustained, low-stimulation focus rebuilds attention span.' },
  { label: 'Single-task deep work', note: 'One screen, one tab. Finishing hard things is the "high-yield" reward.' },
  { label: 'Sit with boredom / meditate', note: 'Tolerating understimulation is the actual skill being trained.' },
  { label: 'Real-world conversation or a meal with people', note: 'Connection is a slow, durable reward your system is built for.' },
  { label: 'Time in nature', note: 'Calms arousal and restores attention with no comedown.' },
]

export const RESET_RULES: string[] = [
  'Remove the trigger from your environment, don’t rely on willpower — log out, delete the app for the window, leave the phone in another room.',
  'Time-box instead of white-knuckling — decide in advance when (and whether) you re-engage, rather than fighting urges all day.',
  'One screen, one task — no parallel stimulation (no phone while watching, no tabs while working).',
  'Replace, don’t just remove — every loop you cut needs a restorative activity ready to fill the gap.',
]

export interface ResetPlan {
  duration: ResetDuration
  cut: string[]
  replace: typeof REPLACEMENTS
  rules: string[]
}

export function buildResetPlan(durationId: string, selectedInputIds: string[]): ResetPlan {
  const duration = RESET_DURATIONS.find((d) => d.id === durationId) ?? RESET_DURATIONS[0]
  const chosen = selectedInputIds.length
    ? HIGH_STIM_INPUTS.filter((i) => selectedInputIds.includes(i.id))
    : HIGH_STIM_INPUTS
  return { duration, cut: chosen.map((i) => i.label), replace: REPLACEMENTS, rules: RESET_RULES }
}

export const DOPAMINE_SOURCES: ScienceSource[] = [
  {
    authors: 'Fei Y, et al.',
    year: 2022,
    title: 'Maladaptive or misunderstood? Dopamine fasting as a potential intervention for behavioral addiction',
    journal: 'Lifestyle Medicine, 3(4):e54',
    contributes: 'Frames "dopamine fasting" accurately as time-based stimulus control (a CBT technique), not literal dopamine reduction.',
    url: 'https://doi.org/10.1002/lim2.54',
  },
  {
    authors: 'Volkow ND, Wise RA, Baler R',
    year: 2017,
    title: 'The dopamine motive system: implications for drug and food addiction',
    journal: 'Nature Reviews Neuroscience, 18(12):741–752',
    contributes: 'How over-rewarding stimuli sensitise motivation toward themselves while desensitising it toward ordinary rewards.',
    url: 'https://doi.org/10.1038/nrn.2017.130',
  },
  {
    authors: 'Cleveland Clinic',
    year: 2023,
    title: 'Dopamine detoxes don’t work — here’s what to do instead',
    journal: 'Cleveland Clinic Health Essentials',
    contributes: 'Plain-language clinical take: the literal "detox" is a myth; structured behaviour change is the real lever.',
    url: 'https://health.clevelandclinic.org/dopamine-detox',
  },
]

export const DOPAMINE_METHODOLOGY =
  'First, the honest part: you cannot "detox" dopamine, and phones do not deplete it. The popular "dopamine detox / fasting" is a misnomer — what actually works, and the only part with evidence, is stimulus control: a long-standing cognitive-behavioural technique of deliberately removing high-stimulation, low-effort reward loops for a set period (Fei 2022). The rationale: a diet of intense, frictionless rewards (short-form video, junk food, gambling-like feeds) sensitises your motivation toward those things and dulls it toward slower, higher-effort rewards like work, reading or exercise (Volkow 2017). A structured reset doesn’t "cleanse" anything — it gives that balance time to recalibrate and rebuilds your tolerance for ordinary stimulation. This planner applies four stimulus-control rules to a window and input set you choose. It is an educational behaviour-change aid, not medical advice or treatment for addiction — for compulsive behaviours that disrupt your life, see a clinician.'

export const DOPAMINE_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'Does a dopamine detox actually work?',
    a: 'Not in the literal sense — you can’t flush or reset dopamine by abstaining, and screens don’t deplete it. What does work is the behaviour underneath the buzzword: time-based stimulus control (a CBT technique) where you cut high-stimulation, low-effort reward loops for a window so your attention and motivation recalibrate. So the practice can genuinely help; the "detox" explanation is just wrong.',
  },
  {
    q: 'What should I cut during a dopamine reset?',
    a: 'The intense, frictionless reward loops: short-form video and social feeds, news doomscrolling, video games, pornography, ultra-processed food and sugar, online shopping, and non-essential notifications. You don’t have to cut everything — pick the ones that most hijack your attention. The tool builds your plan around what you select.',
  },
  {
    q: 'What do I do instead?',
    a: 'Replace, don’t just remove. Fill the gap with slower, restorative activities: morning sunlight and a phone-free walk, exercise, reading a physical book, single-tasked deep work, time in nature, real conversation, or simply tolerating boredom. The discomfort of under-stimulation is the actual skill you’re training.',
  },
  {
    q: 'How long should a dopamine reset last?',
    a: 'Shorter and repeatable beats long and heroic. A daily morning reset (no feeds until after sunlight, movement and focused work) is the most sustainable. A 24-hour or weekend reset goes deeper; a 7-day version is a full recalibration. Whatever the length, the key is reintroducing inputs deliberately and with limits afterward — not bingeing the moment it ends.',
  },
  {
    q: 'Is this a treatment for addiction?',
    a: 'No. This is an educational behaviour-change tool based on stimulus control, useful for everyday over-reliance on stimulating apps and habits. It is not therapy or medical advice. If a behaviour feels genuinely compulsive — you keep doing it despite real harm to your work, relationships or health — that warrants support from a qualified clinician.',
  },
]
