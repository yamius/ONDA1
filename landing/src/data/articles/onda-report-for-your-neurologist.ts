import type { Article } from './types'

/**
 * Series "Doctors and Your Data" (tasks 602-607). Honest framing: watch data is context, never a
 * diagnosis; ONDA report = on-device PDF (baseline, signals, notes), shared only by the user. HRV and
 * breathing baseline from Apple Watch. Not a medical device.
 */
const article: Article = {
  slug: 'onda-report-for-your-neurologist',
  title: "Heart Rate Data and the Nervous System: What a Neurologist Can Do With It (POTS, Dysautonomia, Long COVID)",
  seoTitle: "Heart Rate Data for a Neurologist: POTS & Long COVID | ONDA Life",
  description:
    "When your heart races on standing, you tire after small efforts, or recovery never comes after an illness, the autonomic nervous system may be involved. Here's how a neurologist can use your heart-rate and HRV history — and why the clinic's own test breathes at 6 breaths a minute.",
  category: 'Guide',
  relatedSlugs: ["doctors-and-your-data", "onda-report-for-your-gp", "onda-report-for-your-cardiologist", "dysautonomia-long-covid-breathing", "coherent-breathing-guide"],
  introStyle: 'cyan',
  neuralSuggestion: {
    text: "Bring one page, not your phone: your baseline, what changed and when, your notes and your questions.",
    link: '/articles/doctors-and-your-data',
    linkText: "Which doctor for what →",
  },
  content: `
Your heart rate isn't only about your heart. Every beat is tuned by the autonomic nervous system — the part of the nervous system that runs without your control, speeding the heart up when you stand, slowing it when you rest. When that tuning goes wrong, as in POTS, other forms of dysautonomia, or after some viral illnesses including COVID, the heart often shows it first: racing when you get up, swinging through the day, never quite settling. A neurologist who works with the autonomic nervous system can use your heart-rate and HRV history to see those patterns over weeks — then confirm them with proper tests. Your watch can't diagnose dysautonomia. But it can bring months of evidence into a 20-minute appointment.

*Part of our series [Doctors and Your Data](/articles/doctors-and-your-data).*

## When the problem is the wiring, not the heart

Many people with autonomic problems first see a cardiologist, who finds a structurally healthy heart — and they're left without answers. That's because the heart can be doing exactly what it's told; the problem is in the signals telling it what to do.

Typical clues that point toward the autonomic nervous system include:

- a heart rate that jumps sharply when you stand up, often with dizziness, blurred vision or a racing feeling;
- feeling worse when standing for a long time, in heat or after meals;
- unusual fatigue or "crashes" after efforts that used to be easy;
- symptoms that started or worsened after a viral illness.

Postural orthostatic tachycardia syndrome (POTS), one of the better-known forms, is defined by a sustained rise in heart rate of at least 30 beats per minute within ten minutes of standing (at least 40 in teenagers), without a fall in blood pressure, together with symptoms lasting several months. Only a clinician can make that diagnosis — but the pattern often shows up in the data long before anyone looks for it.

## The clinic's test breathes at your pace

Here's something few people know. One of the standard tests of autonomic function — the heart rate response to deep breathing — asks you to breathe slowly and evenly at about **six breaths per minute** while your heart is recorded. A healthy autonomic system makes the heart rate rise and fall strongly with each breath. When the vagus nerve's control of the heart is impaired, that rise and fall becomes smaller.

Six breaths a minute is the same pace used in coherent or resonance breathing. In other words, the clinic uses slow breathing to *measure* how well your nervous system controls your heart — the same rhythm many people use to *train* it. Your watch or a breathing app can't perform this test for you, but it's a neat reminder that HRV and slow breathing sit at the centre of how neurology looks at the heart.

## How a neurologist can read your report

**Resting heart rate baseline and swings.** A neurologist will look not only at your average resting heart rate but at how unstable it is: large day-to-day swings, a baseline that drifted up after an illness, or a pattern of bad and better weeks.

**HRV trend.** Reduced HRV can reflect weaker vagal control of the heart. A sustained drop after an infection, or unusually low values alongside symptoms, is useful context — though HRV alone can't diagnose an autonomic disorder.

**Breathing rate.** A resting breathing rate above your normal can be part of the picture, particularly with breathlessness or fatigue.

**Signals and notes — the most valuable part here.** Autonomic problems come in flares. A dated record of bad days, what triggered them (standing a long time, heat, a big meal, alcohol, a busy day), and how long recovery took gives a neurologist something they rarely get: the rhythm of your illness over time.

## What help a neurologist can offer

**Confirm what's happening with proper tests.** Depending on symptoms, this may include an active stand test or a tilt-table test (heart rate and blood pressure measured while lying and then upright), the deep-breathing heart rate test, the Valsalva manoeuvre, and sometimes tests of sweating or blood flow. These show what a watch only hints at.

**Rule out other causes — often together with your GP.** Dehydration, anaemia, thyroid problems, medications and deconditioning can all mimic dysautonomia and need checking.

**Build a management plan.** Depending on the diagnosis, this can include guidance on fluids and salt, compression garments, gradual reconditioning that starts lying or seated, and medication when needed — all tailored and supervised, not self-prescribed.

**Help you pace.** For people with long COVID or post-exertional crashes, pushing through often makes things worse. Some clinicians use heart rate to help patients pace activity and avoid crashes. Your data can support that — used the way your clinician advises.

**Track change.** Autonomic recovery is usually slow. A baseline gradually settling, fewer flare days and faster recovery after them are real, visible signs of progress over months.

## Where watch data stops

- **It can't diagnose POTS or dysautonomia.** Formal diagnosis needs measured heart rate *and* blood pressure while lying and standing, under clinical conditions.
- **Don't test yourself to the point of fainting.** If your doctor asks you to record heart rate lying and standing at home, do it exactly as instructed, with something to hold and ideally someone nearby.
- **Averages hide positional changes.** A nightly resting heart rate won't show what happens in the first minutes after you stand.
- **Breathing practice supports, it doesn't treat.** Slow breathing can help some people feel calmer and steadier, but it isn't a treatment for dysautonomia.

Seek urgent care if you faint and injure yourself, faint during exercise, or have chest pain, severe breathlessness or new neurological symptoms such as weakness or difficulty speaking.

## How to prepare for the appointment

- **Bring 8–12 weeks** of your report, including your worst weeks.
- **Keep a short flare diary** in your notes: date, trigger, symptoms, how long recovery took.
- **Write down when it started** and whether it followed an illness, vaccination, injury or major stress.
- **List all medications and supplements**, with start dates.
- **Ask:** "Could this be autonomic, and which tests would show it?"

## Your nervous system's history, on one page

ONDA builds your personal baseline for resting heart rate, HRV and breathing from your Apple Watch, marks the days you left your usual range, and lets you note flares, triggers and recovery as they happen. You can export any period as a PDF — generated on your device and shared only by you — so a neurologist sees months of patterns, not just how you feel on the day of the visit.

*ONDA is a breathing and HRV biofeedback app, not a medical device, and does not diagnose autonomic or neurological conditions. This article is general information, not medical advice. If you faint with injury, have chest pain or new neurological symptoms, seek urgent care.*
`,
}

export default [article]
