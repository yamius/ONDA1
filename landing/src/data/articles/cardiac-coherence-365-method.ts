import type { Article } from './types'

/**
 * Cardiac coherence (cohérence cardiaque) + the 365 method (3×/day, 6 breaths/min, 5 min) — the
 * French clinical framing of coherent/resonance breathing. Grounded: ~0.1 Hz resonance/baroreflex;
 * 2025 comparative study (6/min > box/4-7-8 for vagal activation, exhale>inhale strongest signal);
 * dose-response. AEO reference + howToSteps + FAQ. Honest: camera shows HR↔breath (RSA); coherence
 * metric proper is an Apple-Watch reading (no camera coherence-score claim).
 */
const article: Article = {
  slug: 'cardiac-coherence-365-method',
  title: 'Cardiac Coherence and the 365 Method: France’s Approach to Breathing',
  seoTitle: 'Cardiac Coherence & the 365 Method | ONDA Life',
  description:
    'Cardiac coherence — breathing at 6 per minute, 3 times a day, for 5 minutes (the 365 method) — is a French clinical tradition for balancing the nervous system. The method, the science, and how to practice.',
  category: 'ONDA Protocol',
  relatedSlugs: ['coherent-breathing-guide', 'find-your-resonance-breathing-rate', 'hrv-harmony-of-rhythms', 'how-to-raise-hrv-naturally', '4-7-8-breathing'],
  introStyle: 'rose',
  neuralSuggestion: {
    text: 'A single session calms but fades — which is exactly why the 365 method spaces three across the day.',
    link: '/tools',
    linkText: 'See it live →',
  },
  content: `
Cardiac coherence (*cohérence cardiaque*) is a breathing technique, popular in France as a mainstream health practice, that balances the two branches of your autonomic nervous system by breathing slowly and rhythmically — usually about six breaths per minute. Its best-known form is the **365 method**: **3** times a day, **6** breaths per minute, for **5** minutes. Emerging in France around the turn of the 2000s and championed by French cardiologists, cardiac coherence is essentially the clinical, structured version of what English-speaking sources call [coherent or resonance breathing](/articles/coherent-breathing-guide). The idea is simple and measurable: breathe at the pace where your heart and breath fall into rhythm, and your nervous system shifts toward balance and calm.

## What cardiac coherence actually is

When you breathe slowly, your heart rate naturally rises on the inhale and falls on the exhale — a phenomenon called respiratory sinus arrhythmia. At around six breaths per minute, this variation becomes large and smooth, and your heart-rate rhythm synchronizes with your blood-pressure rhythm. French practitioners call this state *cohérence* — coherence — because your cardiovascular and respiratory systems are oscillating together in phase rather than independently (the same [harmony-of-rhythms](/articles/hrv-harmony-of-rhythms) idea, given a clinical protocol).

Physiologically, this balances the sympathetic ("gas") and parasympathetic ("brake") branches of the autonomic nervous system, with a measurable rise in heart rate variability (HRV). Subjectively, it feels like calm and clarity. What makes the French framing useful is its precision: it's not vague "deep breathing," but a specific rate (six per minute) held for a specific time, which is exactly what the physiology responds to.

## The 365 method

The 365 method is the practical protocol that made cardiac coherence a household practice in France:

- **3** — practice three times a day (commonly morning, midday, and late afternoon/evening).
- **6** — breathe at six breaths per minute: roughly five seconds in, five seconds out.
- **5** — for five minutes each session.

Three sessions matter because the calming effect of a single session is real but temporary — spacing three across the day keeps your nervous system returning to balance. Morning sets a calm tone, midday interrupts accumulated stress, and an evening session supports winding down. It's a rhythm of regulation, not a one-off rescue.

## The science behind six breaths a minute

Why six? Because that's close to the **resonance frequency** of the human cardiovascular system — the rate at which the heart-rate rhythm and the baroreflex (your blood-pressure control loop) oscillate together at maximum amplitude, around 0.1 Hz. Breathing at this rate produces the strongest, smoothest HRV response, and it's worth [finding your own resonance rate](/articles/find-your-resonance-breathing-rate), which varies a little from person to person.

Recent comparative research supports the emphasis on this pace and on the exhale. A 2025 study comparing square breathing, [4-7-8](/articles/4-7-8-breathing), and six-breaths-per-minute breathing found that the six-per-minute rhythm most strongly activated the vagus nerve and significantly raised HRV — and that an exhale longer than the inhale sends the most intense vagal signal to the brainstem. There's also a dose-response: longer sessions produce longer-lasting autonomic effects, which is part of why the 365 method uses repeated five-minute blocks rather than a single quick breath.

## How to practice cardiac coherence

- **Sit upright and comfortable.** You can do it anywhere, eyes open or closed.
- **Breathe in for about 5 seconds, out for about 5 seconds** — six full breaths per minute. A visual guide or app pacer helps at first.
- **Let the exhale be smooth and complete.** The long, easy exhale is the active ingredient.
- **Do 5 minutes, three times a day.** Consistency across the day matters more than intensity. If sleep is the problem, make one session an evening one — see [cardiac coherence for insomnia](/articles/cardiac-coherence-insomnia-sleep).
- **Don't strain.** If five seconds feels long, start with a slightly faster pace and slow down as it becomes comfortable.

## See your own coherence

Cardiac coherence is defined by a measurable state — your heart and breath synchronizing — so it's the perfect thing to actually watch. ONDA reads your pulse from your phone camera, or your HRV from your Apple Watch, and shows your heart rate rise and fall with your breath in real time. Watching that oscillation grow smooth as you settle to six breaths per minute makes finding your ideal pace far easier than counting alone.
`,
  howToSteps: [
    {
      name: 'Sit upright and comfortable',
      text: 'You can practice anywhere, eyes open or closed. An upright, relaxed posture lets the breath move freely.',
      protocolId: 'cc-sit',
    },
    {
      name: 'Breathe six per minute — ~5 seconds in, ~5 seconds out',
      text: 'Aim for six full breaths per minute, roughly five seconds inhaling and five seconds exhaling. A visual guide or app pacer helps at first.',
      protocolId: 'cc-pace',
    },
    {
      name: 'Make the exhale smooth and complete',
      text: 'The long, easy exhale is the active ingredient — let it be smooth and unforced rather than pushed.',
      protocolId: 'cc-exhale',
    },
    {
      name: 'Do 5 minutes, three times a day',
      text: 'The 365 rhythm — three five-minute sessions across the day — matters more than intensity, because a single session calms only temporarily. If five seconds feels long, start slightly faster and slow down as it becomes comfortable.',
      protocolId: 'cc-365',
    },
  ],
}

export default [article]
