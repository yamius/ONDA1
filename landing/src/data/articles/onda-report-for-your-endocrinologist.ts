import type { Article } from './types'

/**
 * Series "Doctors and Your Data" (tasks 602-607). Honest framing: watch data is context, never a
 * diagnosis; ONDA report = on-device PDF (baseline, signals, notes), shared only by the user. HRV and
 * breathing baseline from Apple Watch. Not a medical device.
 */
const article: Article = {
  slug: 'onda-report-for-your-endocrinologist',
  title: "Your Heart Rate and Your Hormones: What an Endocrinologist Can Do With Your Data (Thyroid, Diabetes)",
  seoTitle: "Heart Rate & Hormones: Data for an Endocrinologist | ONDA Life",
  description:
    "Hormones set the pace of your heart. A thyroid problem can push resting heart rate up or down, and diabetes can quietly lower HRV. Here's how an endocrinologist can use your heart-rate history — and where blood tests take over.",
  category: 'Guide',
  relatedSlugs: ["doctors-and-your-data", "onda-report-for-your-gp", "onda-report-for-your-neurologist", "resting-heart-rate-by-age", "yoga-breathing-diabetes-blood-sugar"],
  introStyle: 'amber',
  neuralSuggestion: {
    text: "Bring one page, not your phone: your baseline, what changed and when, your notes and your questions.",
    link: '/articles/doctors-and-your-data',
    linkText: "Which doctor for what →",
  },
  content: `
Your hormones set the pace your heart runs at. Thyroid hormone, in particular, works almost like a dial on your resting heart rate: too much and the heart speeds up, too little and it slows down. Diabetes works more quietly — over years it can damage the nerves that fine-tune the heart, and one of the early signs is lower heart rate variability. That makes your resting heart rate and HRV history surprisingly relevant to an endocrinologist. It can't replace a single blood test. But a clear trend — when your resting pulse started to climb, how it responded to treatment — gives the specialist a timeline that lab results alone don't show.

*Part of our series [Doctors and Your Data](/articles/doctors-and-your-data).*

## The thyroid: a dial on your resting heart rate

Thyroid hormone raises the body's overall metabolic rate, and the heart is one of the first organs to respond.

**When the thyroid is overactive (hyperthyroidism),** resting heart rate often rises and stays up, sometimes with palpitations, feeling hot, unexplained weight loss, tremor, anxiety or poor sleep.

**When it's underactive (hypothyroidism),** heart rate may drift lower, with tiredness, feeling cold, weight gain, low mood or slowed thinking.

A resting heart rate that climbs steadily over weeks without an obvious reason — no illness, no new training, no stressful period — is exactly the kind of change worth mentioning to a doctor. It doesn't mean you have a thyroid problem; many things raise heart rate. But combined with symptoms, it can be the prompt to check. Thyroid problems are common and very treatable, and they're diagnosed with a simple blood test.

## Diabetes: when HRV connects to real clinical testing

Most of the time, consumer HRV has little role in medicine. Diabetes is one of the exceptions where HRV-type measures matter clinically.

Over years, high blood sugar can damage the autonomic nerves that control the heart — a complication called **cardiovascular autonomic neuropathy**. One of its early features is **reduced heart rate variability**: the heart's beat-to-beat flexibility shrinks because its nervous control is weakening. Later signs can include a resting heart rate that stays unusually high and dizziness on standing.

Doctors test for it with **cardiovascular autonomic reflex tests** — heart rate response to slow deep breathing, to standing up, and to the Valsalva manoeuvre, along with blood pressure on standing. These are measured under clinical conditions. A falling HRV trend on a watch can't diagnose neuropathy, but for someone with diabetes it's a reasonable thing to mention, especially with symptoms.

## How an endocrinologist can read your report

**Resting heart rate baseline and trend.** The most useful line for thyroid questions: when a rise or fall began, how large it is, and whether it tracks with symptoms.

**HRV trend.** Particularly relevant in diabetes, as supporting context alongside clinical testing — not as a diagnosis.

**Response to treatment.** When thyroid treatment starts or changes, resting heart rate often moves back toward normal over the following weeks. A trend makes that visible between appointments — alongside blood results, which remain the basis for dosing.

**Your notes.** Symptoms, weight changes, new medications, illness, and — for diabetes — anything notable about glucose control, entered with dates.

## What help an endocrinologist can offer

**Confirm with blood tests.** Thyroid function is diagnosed with blood tests (such as TSH and thyroid hormone levels); diabetes control is assessed with glucose and HbA1c. Your data can point to *when* to test and what changed; the tests say *what* is happening.

**Screen for complications.** In diabetes, an endocrinologist can arrange autonomic reflex testing — often with neurology or cardiology — when there are signs of autonomic involvement.

**Adjust treatment.** Thyroid medication doses and diabetes treatment are adjusted on lab results and clinical judgment. Your heart-rate trend is a helpful companion, showing how your body is responding day to day.

**Consider other hormonal causes.** Less commonly, other hormone conditions can cause episodes of fast heartbeat, sweating or palpitations. Dated episodes in your notes help a specialist decide whether further tests are needed.

**Coordinate care.** Endocrine problems often overlap with the heart, nerves and mood. An endocrinologist can work with your GP, cardiologist or neurologist, and your report travels between them.

## Where watch data stops

- **It can't measure hormones.** Thyroid and diabetes are diagnosed and managed with blood tests.
- **It can't detect low blood sugar.** Heart rate may rise during a low, but so it does for many other reasons. People who need to monitor glucose should use a glucose meter or continuous glucose monitor, as their doctor advises.
- **Never adjust medication based on heart rate.** Thyroid, diabetes and heart medications are changed only by your doctor.
- **Many things raise heart rate.** Illness, dehydration, poor sleep, caffeine, alcohol and stress are far more common causes than hormones.

Seek urgent care for a very fast or irregular heartbeat with feeling unwell, chest pain, confusion, or symptoms of a severe low or very high blood sugar.

## How to prepare for the appointment

- **Bring 8–12 weeks** of your report, including the period when symptoms began.
- **Note symptoms with dates:** heat or cold intolerance, weight change, tremor, fatigue, palpitations, dizziness on standing.
- **Bring recent blood results** if you have them.
- **List medications and supplements** with start dates and dose changes — including biotin, which can interfere with some lab tests.
- **Ask:** "Could hormones explain this change, and which tests would show it?"

## Your heart's response to your hormones, on one page

ONDA builds your personal baseline for resting heart rate, HRV and breathing from your Apple Watch, marks the days you left your usual range, and lets you add notes on symptoms and treatment. You can export any period as a PDF — generated on your device and shared only by you — so an endocrinologist sees how your body responded over weeks, alongside your lab results.

*ONDA is a breathing and HRV biofeedback app, not a medical device, and does not measure hormones or blood sugar. This article is general information, not medical advice. If you have a very fast or irregular heartbeat with feeling unwell or symptoms of severe low or high blood sugar, seek urgent care.*
`,
}

export default [article]
