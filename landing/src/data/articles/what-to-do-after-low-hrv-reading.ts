import type { Article } from './types'

/**
 * Actionable article — "Apple Watch / app showed low HRV, what do I do?" (Q15, Q35).
 * Turns a passive reading into practice. Honest: descriptive not diagnostic; one reading is noise;
 * ONDA to down-regulate + train. Not a medical device. Cross-links baseline + measurement articles.
 */
const article: Article = {
  slug: 'what-to-do-after-low-hrv-reading',
  title: 'Your HRV Reading Is Low. Now What?',
  seoTitle: 'Low HRV Reading — What to Do About It | ONDA Life',
  description:
    'Your Apple Watch or app flagged a low HRV. Before you worry: one reading is mostly noise. What a low HRV actually means, when to ignore it, and the practice that does something about it.',
  category: 'ONDA Protocol',
  relatedSlugs: ['your-baseline-knows-first', 'hrv-different-every-device', 'how-to-measure-hrv-consistently', 'coherent-breathing-guide', 'heart-rate-variability'],
  introStyle: 'cyan',
  neuralSuggestion: {
    text: 'A low number is information, not a verdict — and the useful response is a practice, not a panic.',
    link: '/hrv-biofeedback',
    linkText: 'HRV biofeedback →',
  },
  content: `
## [ CASE FILE: THE RED NUMBER ]

> "Your watch says your HRV is low this morning. Your stomach drops a little. Is something wrong? Should you cancel the workout? Panic?

> Slow down. A single low [HRV](/glossary/heart-rate-variability) reading is one of the most over-interpreted numbers in consumer health. Most of the time it means very little — and when it does mean something, the right response is boring, physiological, and entirely in your hands."

---

## Section 1: First, don't over-read a single number

HRV is *gloriously* noisy. It swings with when you measured, your posture, last night's alcohol, a late meal, a stressful thought, even talking. A low reading on any given morning is, more often than not, just that day's noise — not a trend and not a diagnosis.

The rule that matters: **a single value is nearly meaningless; the trend against your own baseline is the signal.** One low morning inside your normal range is nothing. Several low mornings in a row, drifting below your personal corridor, is worth attention — see [your baseline knows first](/articles/your-baseline-knows-first) and [how to measure HRV so it means something](/articles/how-to-measure-hrv-consistently). And don't compare across devices — [each one reads differently](/articles/hrv-different-every-device).

---

## Section 2: What a genuinely low stretch is telling you

When your HRV really is depressed for a few days, it's your autonomic nervous system reporting **load** — not disease. The usual, honest suspects:

- **Poor or short sleep**, or an irregular bedtime.
- **Alcohol** the night before — a reliable overnight suppressor.
- **Hard training without recovery** — the [overtraining](/articles/overtraining-hrv-resting-heart-rate) pattern.
- **Stress that hasn't switched off**, carried into the evening and sleep.
- **A bug coming on**, or just a rough, depleting stretch.

It's a "your body is carrying something — ease up and recover" signal, not a "something is medically wrong" alarm. If a low reading comes with symptoms that worry you, that's a conversation for a doctor, not an app: HRV tools are descriptive, not diagnostic, and not medical devices.

---

## Section 3: What to actually do about it

The response to a low HRV stretch is the same short list that raises HRV in general, applied *now*: protect tonight's sleep, skip the evening drink, hydrate, and pull the training load back from hammer to easy. Let recovery happen instead of forcing through it — a low reading is your cue to bank a rest day, not to prove something.

And there's one thing you can do in the moment that directly nudges the metric the right way.

---

## Section 4: The one lever that moves it now — breathing

You can't will your HRV up. But you can breathe — and slow, exhale-led breathing acutely raises HRV within minutes by handing tone to the [parasympathetic](/glossary/parasympathetic-nervous-system) branch. It won't erase a genuine recovery deficit, but it shifts your state in the right direction, right now, and it's the most useful active response to a low reading there is.

This is where a low number stops being a source of anxiety and becomes a prompt to *practise*. An HRV biofeedback app reads your pulse (iPhone camera or Apple Watch) and shows your rhythm respond as you breathe — so instead of staring at a bad number, you watch yourself move it. That's ONDA's whole loop: measure, practise, see the response — [HRV biofeedback](/hrv-biofeedback), and [what it measures](/measurements). Honest note: the live coherence score needs an Apple Watch; the camera still gives live pulse and a breathing estimate.

---

## Section 5: The healthy relationship with a low reading

Treat a low HRV the way a good coach treats a heavy-legs day: as **information to act on, not a scoreboard to fear.** Zoom out to the trend, look for the obvious cause (sleep, alcohol, load, stress), respond with recovery, and use a few minutes of slow breathing to down-regulate on the spot. Then let tomorrow's reading — in context, over days — tell you whether you're bouncing back.

> **The Hack:** Don't react to one low HRV number — respond to the trend. Check the obvious causes (sleep, alcohol, training load, stress), protect recovery today, and take two minutes of slow, longer-exhale breathing to nudge it up right now. Information, then action — never panic over a single morning.

> [ SYSTEM_STATUS ]
> ONE_READING: mostly noise — trust the trend vs your baseline
> LOW_STRETCH: load signal (sleep/alcohol/training/stress/illness), NOT a diagnosis
> RESPOND: protect sleep, ease load, hydrate, recover
> ACT_NOW: slow exhale-led breathing raises HRV in minutes — PRACTICE, NOT DIAGNOSIS
`,
  howToSteps: [
    {
      name: 'Zoom out to the trend',
      text: 'A single low reading is mostly noise. Look at where it sits against your own baseline over several days before you react — and don’t compare across devices.',
      protocolId: 'lowhrv-trend',
    },
    {
      name: 'Find the obvious cause',
      text: 'A genuinely low stretch usually traces to sleep, alcohol, hard training without recovery, unshaken stress, or a bug coming on. It’s a load signal, not a diagnosis — symptoms that worry you go to a doctor.',
      protocolId: 'lowhrv-cause',
    },
    {
      name: 'Respond with recovery',
      text: 'Protect tonight’s sleep, skip the evening drink, hydrate, and pull training back to easy. A low reading is your cue to bank a rest day, not to force through it.',
      protocolId: 'lowhrv-recover',
    },
    {
      name: 'Down-regulate on the spot with breathing',
      text: 'Slow, exhale-led breathing acutely raises HRV within minutes. Use biofeedback to watch your rhythm respond, turning a worrying number into a practice you can act on now.',
      protocolId: 'lowhrv-breathe',
    },
  ],
}

export default [article]
