import type { Article } from './types'

/**
 * Series "Doctors and Your Data" (tasks 595-600). Honest framing: watch data is context, never a
 * diagnosis; pulse is not rhythm; ONDA report = on-device PDF (baseline, signals, notes), shared only by
 * the user. HRV/breathing baseline from Apple Watch. Not a medical device.
 */
const article: Article = {
  slug: 'talk-to-your-doctor-about-wearable-data',
  title: "How to Talk to Your Doctor About Your Watch Data (Without Being Dismissed)",
  seoTitle: "How to Talk to Your Doctor About Your Watch Data (Without Being Dismissed) | ONDA Life",
  description:
    "Your watch collects months of heart rate, HRV and sleep data your doctor never sees. Here's what clinicians actually find useful, how to prepare a one-page summary, and the questions worth asking.",
  category: 'Guide',
  relatedSlugs: ["normal-hrv-by-age", "resting-heart-rate-by-age", "how-to-measure-hrv-consistently", "what-to-do-after-low-hrv-reading", "hrv-breathing-cold-honest-limits"],
  introStyle: 'blue',
  image: '/images/articles/talk-to-your-doctor-about-wearable-data.jpg',
  imageAlt:
    'How to Talk to Your Doctor About Your Watch Data — illustration: a patient with a smartwatch and a doctor at a desk, a mint heart-rate wave flowing from the watch into a one-page report the doctor is reading.',
  imageTitle: 'How to Talk to Your Doctor About Your Watch Data',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: "Symptoms first, data second — one page with your baseline, what changed and when.",
    link: '/articles/doctors-and-your-data',
    linkText: "Which doctor for what →",
  },
  content: `
Your watch has recorded months of your heart rate, sleep and heart rate variability — far more than a doctor sees in a 15-minute appointment, where you get one blood pressure reading and one pulse. That data can genuinely help, but only if you bring it in a form a clinician can use. Doctors rarely want a raw export or a "readiness score." They want **trends, context and dates**: how your resting heart rate or sleep changed, when it changed, and what else was happening. A one-page summary, symptoms first and data second, turns "my app says my HRV is low" into a conversation your doctor can actually work with.

## Why this conversation often goes badly

Many people arrive with a phone full of charts and leave feeling brushed off. It usually isn't because the doctor doesn't care. It's a mismatch of formats.

Consumer wearables produce enormous amounts of data, most of it unvalidated for clinical decisions, presented through proprietary scores that differ between brands. A doctor looking at your "recovery 34%" has no reference for what it means. Heart rate variability in particular isn't a standard clinical measurement in routine care — it varies hugely between people and devices, and a single low number means almost nothing on its own.

So the problem isn't that your data is useless. It's that it arrives as noise. Your job is to turn it into signal before you walk in.

## What doctors actually find useful

Not all watch data is equal in a clinical conversation.

**Usually useful:**
- **Resting heart rate trends** over weeks — a sustained rise or fall is easy to understand and relevant to many conditions.
- **Sleep duration and timing** patterns — regular or irregular, and since when.
- **Specific events with dates** — "my resting pulse jumped by 10 beats for two weeks starting March 3rd."
- **Features your watch is cleared for medically** — some watches offer regulator-cleared functions, such as irregular rhythm notifications. If one fired, say so and bring the date.
- **Your own notes** — symptoms, medication changes, illness, alcohol, stress, travel.

**Usually less useful:**
- A single HRV reading, or HRV compared with population averages.
- Brand-specific scores (readiness, recovery, stress, body battery).
- Months of raw data with no summary.

## Prepare a one-page summary

Before the appointment, spend twenty minutes turning your data into one page:

1. **Your baseline.** What's normal for you — typical resting heart rate, usual sleep, your usual HRV range — over a calm period.
2. **What changed, and when.** The trend that worries you, with start date and how long it lasted.
3. **Two or three simple charts.** Four to eight weeks, trend lines only, clearly dated.
4. **Context.** Illness, new medication, alcohol, travel, a stressful stretch, a change in training.
5. **Symptoms.** How you actually felt — this matters more than any number.
6. **Your questions.** Written down, so they don't get lost.

Print it or have it ready as a PDF. One page gets read. Forty screenshots don't.

## How to frame it in the room

Lead with how you feel, then support it with data — not the other way round. Compare:

- *Less effective:* "My app says my HRV is really low."
- *More effective:* "I've felt unusually tired for three weeks. My watch shows my resting heart rate went up about eight beats over the same period, and my sleep got shorter. Here's the one-page summary."

The second version gives your doctor a symptom, a timeline and a measurable change — the building blocks of a clinical picture. Then ask what it means *for you*, rather than asking them to validate the app.

## What your data can't tell you

Honesty keeps this useful. Watch data is **not a diagnosis**. Accuracy varies by device, fit and activity. HRV is highly individual, and a low reading more often reflects a bad night, alcohol or a cold than a disease. And your data never replaces a proper examination or tests your doctor decides you need.

Two rules matter most: don't change or stop any medication based on watch data, and if you have urgent symptoms — chest pain, fainting, severe breathlessness — seek care immediately rather than checking your numbers.

## Questions worth asking

- Is this change in my resting heart rate something to look into, or within normal variation for me?
- Given my symptoms, is there a test that would answer this better than my watch can?
- Which of these numbers, if any, would you want me to keep tracking?
- What change would mean I should come back sooner?

## Bring your data in a form that works

ONDA was built partly for this moment. It reads your resting heart rate, HRV and breathing from your Apple Watch, shows your personal baseline rather than a population average, and lets you add notes when something changes. You can export your timeline as a clean PDF — baseline, trends and your notes on one document, generated on your device and shared only by you. It's exactly the one-page summary a doctor can read in a minute.

*ONDA is a breathing and HRV biofeedback app, not a medical device. This article is general information, not medical advice. If you have urgent symptoms, seek medical care immediately.*
`,
}

export default [article]
