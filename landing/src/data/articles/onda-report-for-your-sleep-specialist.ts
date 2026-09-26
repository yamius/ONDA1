import type { Article } from './types'

/**
 * Series "Doctors and Your Data" (tasks 595-600). Honest framing: watch data is context, never a
 * diagnosis; pulse is not rhythm; ONDA report = on-device PDF (baseline, signals, notes), shared only by
 * the user. HRV/breathing baseline from Apple Watch. Not a medical device.
 */
const article: Article = {
  slug: 'onda-report-for-your-sleep-specialist',
  title: "Showing Your Night Data to a Sleep Specialist: What It Can and Can't Tell Them",
  seoTitle: "Showing Your Night Data to a Sleep Specialist | ONDA Life",
  description:
    "Your watch records every night — heart rate, HRV, breathing and sleep timing. Here's what a sleep specialist can take from that history, which tests they may use next, and why obsessing over sleep scores can backfire.",
  category: 'Guide',
  relatedSlugs: ["onda-report-for-your-gp", "talk-to-your-doctor-about-wearable-data", "social-jet-lag-irregular-sleep", "cardiac-coherence-insomnia-sleep", "how-much-alcohol-lowers-hrv"],
  introStyle: 'indigo',
  neuralSuggestion: {
    text: "Bring one page, not your phone: your baseline, what changed and when, your notes and your questions.",
    link: '/articles/talk-to-your-doctor-about-wearable-data',
    linkText: "How to talk to your doctor →",
  },
  content: `
A sleep specialist rarely gets to see what actually happens across weeks of your nights — they see one appointment, a questionnaire, and your memory of how you slept. Your watch fills that gap. Nightly resting heart rate, HRV, breathing rate and sleep timing, recorded over weeks, show **patterns**: how regular your schedule really is, which nights your body didn't settle, and what you were doing beforehand. That history helps a sleep specialist decide what kind of sleep problem they're looking at and which test is worth doing. What it can't do is replace a proper sleep assessment — and there's one trap worth knowing about: tracking sleep too anxiously can make sleep worse.

*Part of our series [Doctors and Your Data](/articles/doctors-and-your-data).*

## What a sleep specialist is trying to work out

Poor sleep has very different causes, and each needs a different approach. A sleep specialist is usually trying to answer:

- Is this **insomnia** — trouble falling or staying asleep, often driven by an over-aroused nervous system?
- Is it a **body-clock problem** — a schedule that fights your natural rhythm?
- Could it be **sleep-disordered breathing**, such as sleep apnea?
- Or is it driven by something else — medication, alcohol, pain, mood, or another condition?

Your data doesn't answer these questions on its own. But it helps point toward the right one.

## How a sleep specialist can read your report

**Sleep timing and regularity.** When you actually fell asleep and woke up, night after night. A specialist looks for irregular schedules, weekend shifts and late drift — the pattern behind body-clock problems and social jet lag. This is often more accurate than what people recall.

**Nightly resting heart rate.** Your heart rate should drop during sleep. Nights when it stays elevated suggest your body didn't fully settle — often after alcohol, late meals, illness, stress or late training. A specialist can match these nights against your notes.

**Nightly HRV.** Overnight HRV reflects how much your nervous system shifted into recovery. A pattern of low overnight HRV alongside insomnia fits the picture of an over-aroused nervous system — useful context, not a diagnosis.

**Breathing rate at night.** A resting breathing rate that stays above your normal can be relevant context, especially if you snore, wake unrefreshed or feel sleepy by day. It doesn't detect sleep apnea — but it may add weight to the question of whether a sleep study is worth doing.

**Your notes.** Caffeine, alcohol, late screens, a stressful week, travel, new medication. For sleep, context explains a great deal, and it's the part a questionnaire usually misses.

## What help a sleep specialist can offer

**Identify the type of sleep problem.** Combining your history, symptoms, questionnaires and your data, they can distinguish insomnia, body-clock disorders and possible breathing-related problems — each with a different treatment.

**Decide on a sleep study.** If breathing-related sleep problems are suspected, they may arrange a home sleep apnea test or an overnight sleep study (polysomnography). These measure breathing, oxygen and sleep stages directly — things a consumer watch can't reliably do.

**Offer effective insomnia treatment.** For chronic insomnia, the recommended first-line treatment is cognitive behavioral therapy for insomnia (CBT-I), which works on the habits and arousal that keep people awake. Your data can help track progress during treatment.

**Reset your body clock.** For timing problems, a specialist can advise on light exposure, sleep scheduling and routine — and your timeline shows whether the changes are working.

**Review medications and substances.** Many medicines, as well as alcohol and caffeine, affect sleep. Dated notes make the links easier to spot.

## The trap: when tracking makes sleep worse

Sleep researchers have a name for it: **orthosomnia** — becoming so preoccupied with getting "perfect" sleep data that the anxiety itself makes sleep worse. People lie awake worrying about their score, or trust the app over how they actually feel.

A good sleep specialist will steer you away from this, and it's worth knowing before you go. Use your data to spot **patterns over weeks**, not to grade each night. If checking your numbers makes you anxious, that's a signal to look less often. The goal is better sleep, not a better score.

## Where watch data stops

- **Watches estimate sleep; they don't measure it clinically.** Sleep-stage estimates from wearables are approximate. A sleep study is the reference.
- **Watch data can't diagnose sleep apnea.** Some watches offer a separately cleared sleep apnea notification feature — if yours gave an alert, bring it with its date. A breathing app's trends are a different kind of data.
- **Trends can't replace your description.** How rested you feel, daytime sleepiness and what a partner notices (snoring, pauses in breathing) matter a lot.

If you stop breathing during sleep according to a partner, wake up choking or gasping, or feel dangerously sleepy while driving, see a doctor promptly.

## How to prepare for the appointment

- **Bring 4–8 weeks** of your report, covering typical nights and bad ones.
- **Keep brief notes** on caffeine, alcohol, screens, exercise and stress for those weeks.
- **Describe your days, not just nights:** energy, sleepiness, naps, concentration.
- **Ask a partner** what they notice while you sleep.
- **Mention any separate watch alerts** with dates.
- **Ask:** "What kind of sleep problem does this look like, and what would confirm it?"

## Your nights, ready for a specialist

ONDA builds your personal baseline for nightly resting heart rate, HRV and breathing from your Apple Watch, marks the nights you left your usual range, and lets you add notes on what happened. You can export any period as a PDF — generated on your device and shared only by you — so a sleep specialist sees weeks of your nights, not just one night's memory.

*ONDA is a breathing and HRV biofeedback app, not a medical device, and does not diagnose sleep disorders. This article is general information, not medical advice. If you have symptoms such as breathing pauses in sleep or dangerous daytime sleepiness, see a doctor promptly.*
`,
}

export default [article]
