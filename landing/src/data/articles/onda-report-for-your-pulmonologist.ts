import type { Article } from './types'

/**
 * Series "Doctors and Your Data" (tasks 602-607). Honest framing: watch data is context, never a
 * diagnosis; ONDA report = on-device PDF (baseline, signals, notes), shared only by the user. HRV and
 * breathing baseline from Apple Watch. Not a medical device.
 */
const article: Article = {
  slug: 'onda-report-for-your-pulmonologist',
  title: "Your Breathing in Numbers: What a Lung Specialist Can Do With Your Data (Asthma, Breathlessness, Breathing Patterns)",
  seoTitle: "Your Breathing in Numbers: Data for a Lung Specialist | ONDA Life",
  description:
    "Your watch tracks how fast you breathe at night — a quiet signal that often changes before you feel ill. Here's how a pulmonologist can use your breathing and heart-rate history, and why breathing retraining is one of the few breathing practices in official guidelines.",
  category: 'Guide',
  relatedSlugs: ["doctors-and-your-data", "onda-report-for-your-gp", "onda-report-for-your-neurologist", "respiratory-rate-hidden-signal", "co2-tolerance-expanding-oxygen-limit"],
  introStyle: 'blue',
  neuralSuggestion: {
    text: "Bring one page, not your phone: your baseline, what changed and when, your notes and your questions.",
    link: '/articles/doctors-and-your-data',
    linkText: "Which doctor for what →",
  },
  content: `
How fast you breathe at rest is one of the quietest numbers your watch records — and one of the most telling. A typical adult breathes about 12 to 20 times a minute at rest, and your own night-time breathing rate tends to be remarkably stable. When it rises and stays up, that's often a sign your body is working harder: an infection starting, a flare of a lung condition, or breathing that has slipped into an inefficient pattern. A pulmonologist (lung specialist) can read your breathing-rate and heart-rate history alongside your symptoms — and confirm what's happening with lung tests your watch can't do. There's also a twist: lung medicine is one of the few areas where breathing exercises appear in official treatment guidelines.

*Part of our series [Doctors and Your Data](/articles/doctors-and-your-data).*

## Why breathing rate is such an honest signal

Breathing rate is hard to fake and slow to change. At night, without talking, moving or thinking about it, your breathing settles into a personal rhythm that stays within a narrow band for most people. That stability is exactly what makes changes stand out.

Research using wearables has explored how a rise in resting breathing rate and heart rate can appear around the start of respiratory infections, sometimes before symptoms are obvious. For people with long-term lung conditions, a sustained rise from their usual breathing rate can accompany a flare. A watch can't tell you *why* your breathing changed — but it can show clearly *that* it did, and when.

## How a pulmonologist can read your report

**Night-time breathing rate baseline and trend.** Your normal range, and any sustained rise above it. A single high night means little; several nights in a row, especially with symptoms, is worth noting.

**Resting heart rate alongside.** Breathing rate and heart rate often rise together during illness or flares. Seeing both move at the same time strengthens the picture.

**HRV trend.** Supporting context — a drop can accompany illness or poor sleep, but it isn't a lung measurement.

**Your notes.** For lung problems, context is everything: triggers (cold air, exercise, pollen, pets, smoke, colds), night-time symptoms like coughing or waking breathless, how often you used a reliever inhaler, and how long episodes lasted.

## What help a pulmonologist can offer

**Measure your lungs directly.** Depending on symptoms, a lung specialist may use spirometry (how much and how fast you can breathe out), peak flow, tests of airway inflammation, oxygen measurements, exercise testing or imaging. These show what a watch only hints at.

**Diagnose and manage lung conditions.** Asthma, COPD and other lung conditions are diagnosed with these tests and managed with medication, inhaler technique, trigger control and action plans. Your dated notes help show whether treatment is keeping things stable.

**Recognise dysfunctional breathing.** Some people are breathless not because their lungs are damaged, but because their breathing pattern has become inefficient — breathing too fast, too high in the chest, or through the mouth, sometimes after an illness or during long-term stress. This "breathing pattern disorder" can coexist with asthma or appear on its own, and it's often missed.

**Offer breathing retraining.** Here's the twist. For asthma, breathing retraining programmes delivered by respiratory physiotherapists are recommended in some national guidelines as an addition to medication, and a large clinical trial found that a physiotherapy breathing-retraining programme improved quality of life in people with asthma. These programmes typically teach slower, lower, nose-based breathing — close to the principles behind coherent breathing. They don't replace inhalers; they help people breathe more efficiently between and alongside treatment.

**Plan for flares.** A specialist can help you build an action plan — what to do when symptoms worsen — and your trend may help you notice a flare building.

## Where watch data stops

- **It can't measure lung function.** Spirometry and other lung tests do that.
- **Wellness oxygen readings aren't medical.** If your watch shows blood oxygen, treat it as a rough indication, not a diagnosis.
- **Breathing exercises never replace your reliever.** During an asthma attack, use your reliever inhaler and follow your action plan first. Calm, slow breathing can help you stay steady, but never delay medication for it.
- **A higher breathing rate has many causes,** from a cold to fever, anxiety or heart problems. It points to a question, not an answer.

Seek emergency care for severe breathlessness, difficulty speaking in full sentences, blue or grey lips, chest pain, or a reliever inhaler that isn't helping.

## How to prepare for the appointment

- **Bring 8–12 weeks** of your report, including any flares or infections.
- **Note triggers, night symptoms and inhaler use** with dates.
- **Record how you feel on exertion**: stairs, walking, exercise.
- **Bring your inhalers** so technique can be checked.
- **Ask:** "Could part of my breathlessness be my breathing pattern, and would breathing retraining help?"

## Your breathing, on one page

ONDA builds your personal baseline for night-time breathing rate, resting heart rate and HRV from your Apple Watch, marks the days you left your usual range, and lets you note triggers and symptoms. You can export any period as a PDF, generated on your device and shared only by you, so a lung specialist sees how your breathing behaved over weeks — not just on the day of the test.

*ONDA is a breathing and HRV biofeedback app, not a medical device, and does not diagnose lung conditions. This article is general information, not medical advice. During an asthma attack, use your reliever and follow your action plan; seek emergency care for severe breathlessness.*
`,
}

export default [article]
