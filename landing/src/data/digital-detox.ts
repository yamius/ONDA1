/**
 * Digital detox / screen-reset planner.
 *
 * Honest framing: "digital detox" doesn't mean going off-grid, and the evidence
 * on dramatic total detoxes is mixed (Radtke 2022). What reliably helps are
 * specific, sustainable changes: capping social media (~30 min/day cut
 * loneliness and depression in Hunt 2018), cutting evening screens (they delay
 * sleep and suppress melatonin ~55%, Chang 2015), and killing non-human
 * notifications. This is stimulus control applied to screens — a calm habit
 * redesign, not a purity test. Educational, not medical advice.
 */

import type { ScienceSource } from './sources'

export interface DetoxDuration {
  id: string
  label: string
  guidance: string
}

export const DETOX_DURATIONS: DetoxDuration[] = [
  { id: 'daily', label: 'Daily rules (ongoing)', guidance: 'The most effective version: permanent guardrails you barely notice, not a one-off purge. Set the rules once and let the environment do the work.' },
  { id: '24h', label: '24-hour screen sabbath', guidance: 'One full day off recreational screens — a weekly reset. Tell people in advance and plan offline things to do so the day doesn’t feel empty.' },
  { id: 'weekend', label: 'Weekend (48 h)', guidance: 'A deeper reset; keep maps/calls if needed, cut feeds and recreational apps. Expect phantom phone-checks on day one — that reflex is exactly what you’re unwinding.' },
  { id: '7day', label: '7-day reset', guidance: 'A full recalibration of your attention. Reintroduce apps deliberately afterward — re-add the ones that earn their place, leave the rest off.' },
]

export interface DetoxHabit {
  id: string
  label: string
  tactic: string
}

export const DETOX_HABITS: DetoxHabit[] = [
  { id: 'social', label: 'Social media', tactic: 'Cap each app at ~30 minutes/day — the limit that cut loneliness and depression in Hunt (2018). Use the OS screen-time limit and log out so re-entry has friction.' },
  { id: 'doomscroll', label: 'News & doomscrolling', tactic: 'Pick one fixed news window (e.g. once at midday). Remove news apps from the home screen and unfollow rage-bait sources.' },
  { id: 'notifications', label: 'Notifications', tactic: 'Turn off every non-human notification. Keep only calls and messages from real people; batch-check the rest on your schedule, not theirs.' },
  { id: 'bedtime', label: 'Screens before bed', tactic: 'No light-emitting screens 60–90 minutes before sleep (evening screens delay sleep and suppress melatonin ~55%, Chang 2015). Charge the phone outside the bedroom.' },
  { id: 'shortvideo', label: 'Short-form video', tactic: 'Delete the app for the window and use it on the web only — the extra friction is usually enough to break the loop.' },
  { id: 'workchat', label: 'Always-on email / Slack', tactic: 'Define off-hours, silence work apps after a set time, and remove them from your phone or use a separate work profile.' },
]

export const PHONE_SETUP: string[] = [
  'Switch the screen to grayscale — it strips the colour reward that makes feeds compulsive.',
  'Move tempting apps off the home screen into a folder a couple of swipes away.',
  'Turn off all non-human notifications; leave only calls and real messages.',
  'Charge your phone outside the bedroom and use a separate alarm clock.',
  'One screen at a time — no phone while watching TV or working.',
]

export interface DetoxPlan {
  duration: DetoxDuration
  tactics: Array<{ label: string; tactic: string }>
  phoneSetup: string[]
}

export function buildDetoxPlan(durationId: string, selectedHabitIds: string[]): DetoxPlan {
  const duration = DETOX_DURATIONS.find((d) => d.id === durationId) ?? DETOX_DURATIONS[0]
  const chosen = selectedHabitIds.length
    ? DETOX_HABITS.filter((h) => selectedHabitIds.includes(h.id))
    : DETOX_HABITS
  return { duration, tactics: chosen.map((h) => ({ label: h.label, tactic: h.tactic })), phoneSetup: PHONE_SETUP }
}

export const DETOX_SOURCES: ScienceSource[] = [
  {
    authors: 'Hunt MG, Marx R, Lipson C, Young J',
    year: 2018,
    title: 'No more FOMO: limiting social media decreases loneliness and depression',
    journal: 'Journal of Social and Clinical Psychology, 37(10):751–768',
    contributes: 'RCT showing capping social media at ~30 min/day reduced loneliness and depression — the basis for the social-media limit.',
    url: 'https://doi.org/10.1521/jscp.2018.37.10.751',
  },
  {
    authors: 'Chang AM, Aeschbach D, Duffy JF, Czeisler CA',
    year: 2015,
    title: 'Evening use of light-emitting eReaders negatively affects sleep, circadian timing, and next-morning alertness',
    journal: 'PNAS, 112(4):1232–1237',
    contributes: 'Evening light-emitting screens delayed sleep and suppressed melatonin ~55% — why the bedtime-screen rule matters.',
    url: 'https://doi.org/10.1073/pnas.1418490112',
  },
  {
    authors: 'Radtke T, Apel T, Schenkel K, et al.',
    year: 2022,
    title: 'Digital detox: an effective solution in the smartphone era? A systematic literature review',
    journal: 'Mobile Media & Communication, 10(2):190–215',
    contributes: 'Systematic review: effects of total "detoxes" are mixed — why this tool favours specific, sustainable changes over purges.',
    url: 'https://doi.org/10.1177/20501579211028647',
  },
]

export const DETOX_METHODOLOGY =
  'A "digital detox" doesn’t require going off-grid — and a systematic review found the effects of dramatic total detoxes are mixed (Radtke 2022). What reliably helps are specific, sustainable changes, which is what this planner builds: capping social media (an experiment found limiting it to ~30 min/day reduced loneliness and depression; Hunt 2018), removing light-emitting screens before bed (they delay sleep and suppress melatonin by around half; Chang 2015), and switching off non-human notifications so your attention isn’t pulled on someone else’s schedule. The mechanism is stimulus control — change the environment so the better choice is the easy one — not willpower or guilt. In keeping with ONDA’s calm, non-obsessive approach, the goal is a phone that serves you, not a purity contest. Educational behaviour-change aid, not medical advice.'

export const DETOX_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'What is a digital detox, really?',
    a: 'It’s a deliberate reduction of screen and smartphone use — not necessarily going fully offline. The useful version isn’t a heroic week of abstinence (the evidence on those is mixed); it’s a set of specific, sustainable changes: limiting social media, cutting evening screens, and turning off notifications so your attention is yours again.',
  },
  {
    q: 'Do digital detoxes actually work?',
    a: 'It depends what you mean. A systematic review (Radtke 2022) found total "detoxes" produce mixed results. But targeted changes have solid support: limiting social media to ~30 minutes a day reduced loneliness and depression in a controlled study (Hunt 2018), and cutting evening screen light measurably improves sleep (Chang 2015). Specific beats dramatic.',
  },
  {
    q: 'How do I do a digital detox without quitting my phone?',
    a: 'Redesign the environment instead of relying on willpower: grayscale the screen, move tempting apps off the home screen, turn off non-human notifications, cap social apps with the OS timer, and charge the phone outside the bedroom. The tool builds a plan around the habits you choose, plus a phone-setup checklist.',
  },
  {
    q: 'Why no screens before bed?',
    a: 'Light-emitting screens in the evening suppress melatonin, delay your body clock and push back sleep — in one study, evening eReader use cut melatonin by about 55% and reduced next-morning alertness (Chang 2015). Stopping screens 60–90 minutes before bed, and charging the phone in another room, is one of the highest-value changes for sleep.',
  },
  {
    q: 'How long should a digital detox last?',
    a: 'Ongoing, light-touch rules beat occasional purges. Permanent guardrails — notifications off, social capped, no bedtime screens — work because you stop relying on willpower. A 24-hour "screen sabbath" or a weekend reset can help you notice your patterns, but the durable benefit comes from the everyday defaults you keep afterward.',
  },
]
