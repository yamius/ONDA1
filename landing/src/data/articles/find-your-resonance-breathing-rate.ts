import type { Article } from './types'

/**
 * Cluster 2 gap — "which breathing pace is right for me", "how to find your resonance/resonant
 * breathing rate" (Q25). Practical companion to the mechanism article resonant-frequency-system-coherence.
 * Honest: ~6/min is a starting point, personal rate found via live HRV feedback (Apple Watch for coherence);
 * ONDA has no rigid metronome — guided breathing; not medical.
 */
const article: Article = {
  slug: 'find-your-resonance-breathing-rate',
  title: 'How to Find Your Resonance Breathing Rate',
  seoTitle: 'Find Your Resonance Breathing Rate (Personal Pace) | ONDA Life',
  description:
    'Everyone has a breathing pace where heart, breath and blood pressure sync and HRV peaks — usually near 6 a minute, but personal. How to find yours, with and without live feedback.',
  category: 'ONDA Protocol',
  relatedSlugs: ['coherent-breathing-guide', 'resonant-frequency-system-coherence', 'baroreflex-01hz-shift', 'heart-rate-variability', 'how-to-measure-hrv-consistently'],
  introStyle: 'cyan',
  image: '/images/articles/find-your-resonance-breathing-rate.webp',
  imageAlt:
    "A resonance tuner sweeping breathing paces from 4.5 to 7 a minute, the HRV oscillation amplitude peaking into a wide smooth wave at one personal frequency.",
  imageTitle: "Find your resonance breathing rate — where HRV amplitude peaks",
  imageCaption:
    "Finding your personal resonance breathing rate — the pace near six breaths a minute where HRV amplitude peaks, found by watching your own live feedback.",
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'The perfect breathing pace isn’t a rule from a book — it’s a rate you find by watching your own rhythm.',
    link: '/hrv-biofeedback',
    linkText: 'HRV biofeedback →',
  },
  content: `
## [ CASE FILE: YOUR NATURAL FREQUENCY ]

> "There's a breathing pace where something clicks: your heart rate, your breath and your blood-pressure rhythm all fall into phase, and your [heart-rate variability](/glossary/heart-rate-variability) swings to its widest, smoothest amplitude. It's called your resonance frequency, and hitting it is the difference between breathing slowly and breathing *effectively*.

> The catch is that it's slightly different for everyone — and most people never look for theirs. They copy a number off the internet and wonder why it feels off. Finding your own rate is simple, and it's the single biggest upgrade to a breathing practice."

---

## Section 1: What resonance breathing actually is

Around six breaths a minute — roughly 0.1 Hz — the cardiovascular system has a natural resonance. Breathe at that frequency and you maximally stimulate the baroreflex, the loop that buffers blood pressure, producing large, coherent oscillations in heart rate and shifting you toward [parasympathetic](/glossary/parasympathetic-nervous-system) calm. That's the mechanism behind [coherent breathing](/articles/coherent-breathing-guide) and the [0.1 Hz baroreflex shift](/articles/baroreflex-01hz-shift).

At resonance, a small rhythmic input — your breath — produces a large, calming output. Off resonance, you're still breathing slowly, but you're leaving most of the effect on the table.

---

## Section 2: Why ~6 a minute is a starting point, not your answer

Six breaths a minute is the population average, and it's a fine place to begin. But your personal resonance rate depends on your physiology — your height and blood volume among other things — so it typically lands somewhere in the **~4.5 to 7 breaths-per-minute** range. Taller people tend to resonate a little slower; the exact figure is yours to find.

This is why a fixed "4-7-8" or "inhale 5, exhale 5" rule works for some people and feels strained for others. The rule isn't wrong — it's just not personalized. Your resonance rate is a property of *your* system, and the only way to know it is to test.

---

## Section 3: How to find it — the low-tech way

You can get close by feel. Try breathing at a few slow paces, holding each for a minute or two, and notice which one feels the most effortless and settling — the pace where the breath seems to "carry itself" and your body drops into calm with the least effort. Sweep through roughly 4.5, 5, 5.5, 6 and 6.5 breaths a minute (a breath every ~13, 12, 11, 10 and 9 seconds), bias the exhale a little longer than the inhale, and pay attention to which rate your body likes best.

That felt sense gets you into the right neighbourhood. It won't pinpoint the exact address — for that you need to see the signal.

---

## Section 4: How to find it precisely — with feedback

Your resonance rate is defined by where your HRV oscillation amplitude peaks, and that's a thing you can *watch*. With live HRV biofeedback, you breathe at each candidate pace and look for the rate that produces the biggest, smoothest rise-and-fall in your heart rhythm — the widest [coherence](/glossary/heart-rate-variability) wave. That peak is your resonance frequency, found empirically instead of guessed.

This is exactly what ONDA is built to do: it reads your pulse (iPhone camera or Apple Watch), paces your breathing and renders your rhythm live, so you can hunt for the pace that maximises *your* swing — see [HRV biofeedback](/hrv-biofeedback) and [what it measures](/measurements). Two honest specifics: the live **coherence score** that makes the peak easiest to see unlocks with an **Apple Watch** (the camera still shows live pulse and a breathing estimate); and ONDA guides you toward slow breathing without a rigid metronome counting at you — it's guided, reactive pacing, not a fixed drill. Measure across a few calm sessions, since HRV is noisy — [consistency matters](/articles/how-to-measure-hrv-consistently).

---

## Section 5: Using your rate

Once you've found your resonance pace, it becomes the home base for your practice — the rate you return to for down-regulation, focus resets and daily training. It's stable enough to rely on but worth re-checking occasionally, since fitness and physiology shift over time. And don't be rigid mid-practice: the goal is the smooth, effortless swing, so if a slightly different pace feels better on a given day, follow the feel toward the widest wave.

> **The Hack:** Don't copy a breathing number off the internet — find yours. Sweep slow paces from about 4.5 to 7 breaths a minute, exhale a touch longer than you inhale, and pick the rate that feels most effortless. With HRV biofeedback, make it exact: the pace that gives the biggest, smoothest heart-rhythm swing is your resonance frequency.

> [ SYSTEM_STATUS ]
> RESONANCE: the pace where heart/breath/BP sync and HRV amplitude peaks (~0.1 Hz)
> PERSONAL: usually ~4.5–7/min — ~6 is the average, not your answer
> FIND_IT: sweep paces by feel; pinpoint with live HRV amplitude (coherence = Watch)
> STATUS: self-regulation practice, NOT a medical treatment
`,
  howToSteps: [
    {
      name: 'Start near six, but expect to move',
      text: 'About six breaths a minute (0.1 Hz) is the population average and a fine starting point, but your personal resonance rate usually lands somewhere between roughly 4.5 and 7 a minute. Treat six as the door, not the destination.',
      protocolId: 'res-start',
    },
    {
      name: 'Sweep slow paces by feel',
      text: 'Breathe at ~4.5, 5, 5.5, 6 and 6.5 a minute (a breath every ~13 to 9 seconds), holding each a minute or two, exhale a little longer than the inhale. Notice which pace feels most effortless and settling — that’s your neighbourhood.',
      protocolId: 'res-sweep',
    },
    {
      name: 'Pinpoint it with HRV feedback',
      text: 'Your resonance rate is where your HRV oscillation amplitude peaks. With live biofeedback, find the pace that produces the biggest, smoothest heart-rhythm swing (the widest coherence wave, which needs an Apple Watch). Measure across a few calm sessions.',
      protocolId: 'res-feedback',
    },
    {
      name: 'Make it home base, but stay flexible',
      text: 'Use your resonance pace as the default for down-regulation and daily practice, re-checking occasionally as your physiology changes. Chase the smooth, effortless swing rather than a rigid count. It’s a self-regulation practice, not a medical treatment.',
      protocolId: 'res-use',
    },
  ],
}

export default [article]
