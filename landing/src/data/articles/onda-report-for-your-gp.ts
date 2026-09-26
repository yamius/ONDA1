import type { Article } from './types'

/**
 * Series "Doctors and Your Data" (tasks 595-600). Honest framing: watch data is context, never a
 * diagnosis; pulse is not rhythm; ONDA report = on-device PDF (baseline, signals, notes), shared only by
 * the user. HRV/breathing baseline from Apple Watch. Not a medical device.
 */
const article: Article = {
  slug: 'onda-report-for-your-gp',
  title: "Showing Your Heart Data to Your GP: What a Family Doctor Can Do With It",
  seoTitle: "Showing Your Heart Data to Your GP | ONDA Life",
  description:
    "Your family doctor is usually the first person to see your watch data. Here's how a GP can read a heart-rate and HRV report, what help they can offer, and how to make the appointment count.",
  category: 'Guide',
  relatedSlugs: ["talk-to-your-doctor-about-wearable-data", "resting-heart-rate-by-age", "normal-hrv-by-age", "what-to-do-after-low-hrv-reading", "how-much-alcohol-lowers-hrv"],
  introStyle: 'blue',
  neuralSuggestion: {
    text: "Bring one page, not your phone: your baseline, what changed and when, your notes and your questions.",
    link: '/articles/talk-to-your-doctor-about-wearable-data',
    linkText: "How to talk to your doctor →",
  },
  content: `
Your GP (family doctor) is usually the right first person to see your watch data. Not because they'll interpret every HRV value — most won't, and they don't need to — but because they can put a **change in your body** next to **your symptoms, history and medications**, and decide what, if anything, needs checking. A clear report showing your normal resting heart rate, breathing rate and HRV, what changed, and when, helps a GP separate everyday causes (a virus, a new medication, poor sleep, alcohol) from things worth testing, and refer you on only when it's needed.

*Part of our series [Doctors and Your Data](/articles/doctors-and-your-data).*

## Why start with your GP

A GP sees the whole person. A cardiologist looks at the heart, a sleep specialist at sleep — but a family doctor holds your history, medications, previous test results and life context in one place. That makes them the best person to answer the first, most important question: *is this change something, or nothing?*

They're also the gatekeeper for the next step. If your data and symptoms suggest a closer look, your GP decides which tests make sense and which specialist, if any, you should see.

## How a GP can read each part of your report

A good report — like the PDF ONDA exports — has a few blocks. Here's what a GP can take from each.

**Your baseline.** Your normal range for resting heart rate, HRV and breathing rate over a calm period, and how many nights of data it's built on. This matters most: it tells the doctor what's normal *for you*, rather than comparing you with a population chart.

**The day-by-day timeline.** Values over the chosen period, with days marked where a measure left your usual range. A GP will look for the **shape**: a sudden jump, a slow drift, or scattered one-off days. A single odd night is rarely meaningful; a shift that lasts for days or weeks is.

**Signals.** The dates when a measure moved outside your normal range, by how much, and for how long. These give the doctor a clear timeline to match against symptoms.

**Your notes.** What you wrote down when something changed — illness, a stressful week, new medication, travel, alcohol, poor sleep. For a GP, this context is often worth as much as the numbers, because it explains many changes on its own.

## What help a GP can offer

With symptoms plus a clear trend, a family doctor can typically:

**Look for common, everyday causes first.** A resting heart rate that climbs for several days often lines up with an infection, dehydration, poor sleep, heavy training, alcohol or stress. Your notes and dates make this quick to check.

**Review your medications.** Many medicines change heart rate — some lower it, others raise it. A GP can see whether a change in your data started when a medication started or changed dose.

**Decide whether tests are worth doing.** Depending on your symptoms, a GP may consider simple checks such as a physical examination, blood pressure, blood tests or an ECG — tests that answer questions a watch can't. Your data doesn't order the tests; it helps the GP decide whether they're needed.

**Refer you when it makes sense.** If the picture points to the heart, sleep, breathing or mental health, your GP can refer you to the right specialist — and your report travels with you, so the next doctor starts with the history.

**Follow up over time.** After a change — new medication, recovering from illness, a lifestyle change — your trend shows whether things are returning to your baseline. That makes follow-up appointments more concrete than "how have you been feeling?"

## What a GP won't do with it

Be realistic. Your GP won't diagnose a condition from HRV alone — it isn't used that way in routine care. Watch and camera readings aren't medical-grade measurements, and a single low value usually reflects a bad night rather than disease. Some doctors are more comfortable with wearable data than others; if yours is cautious, the summary still helps, because it turns a vague complaint into a dated, measurable change.

## How to make the appointment count

- **Bring one page, not your phone.** The PDF summary, printed or ready to show.
- **Lead with symptoms.** "I've felt tired and breathless for two weeks" first; the data second.
- **Point to the change.** "My resting pulse went up about eight beats from the 3rd, and stayed there."
- **Mention what you already noticed.** A cold, a new pill, a stressful month — it's all in your notes.
- **Ask what would change the plan.** "What would make you want to check this further?"

If you have urgent symptoms — chest pain, fainting, severe breathlessness — don't wait for an appointment or check your data. Seek care immediately.

## Your report, ready for the appointment

ONDA builds your personal baseline from your Apple Watch history, marks the days you left your usual range, and lets you add notes when something changes. From the timeline you can export a clean PDF — baseline, day-by-day values, signals and your notes, for the period you choose — generated on your device and shared only by you. It's designed to be read by a GP in a minute.

*ONDA is a breathing and HRV biofeedback app, not a medical device. This article is general information, not medical advice. If you have urgent symptoms, seek medical care immediately.*
`,
}

export default [article]
