import type { Article } from './types'

/**
 * Caffeine → overnight cardiac signature (resting HR up, HRV down) + "find your personal
 * cutoff via your own baseline". Distinct from caffeine-half-life-sleep-pressure (adenosine/
 * sleep-pressure lens) — this is the autonomic/cardiac lens. Grounded: caffeine half-life 5-6h;
 * REM LF/HF & QTvi rise (Bonnet); habitual-user tolerance blunts acute HRV effect. Honest:
 * caffeine is a legal consumer stimulant (fine to name); no disease claims. Funnels to /measurements.
 */
const article: Article = {
  slug: 'caffeine-hrv-resting-heart-rate',
  title: "Caffeine's Overnight Signature: What the Afternoon Coffee Does to Your Heart",
  seoTitle: 'Caffeine, Resting Heart Rate & HRV: Your Cutoff | ONDA Life',
  description:
    'Caffeine has a 5–6 hour half-life, so the afternoon cup can still raise your resting heart rate and flatten your overnight HRV. Why the effect is deeply personal, and how to find your own caffeine cutoff from your own data.',
  category: 'ONDA Protocol',
  relatedSlugs: ['caffeine-half-life-sleep-pressure', 'heart-rate-variability', 'apple-watch-recovery-hrv-vs-overall-hrv', 'what-your-apple-watch-records', 'sympathetic-nervous-system'],
  introStyle: 'amber',
  image: '/images/articles/caffeine-hrv-resting-heart-rate.webp',
  imageAlt:
    'Glowing translucent human heart with a caffeine molecule dissolving into it in amber, and an overnight curve that stays high instead of dipping into rest.',
  imageTitle: 'Caffeine’s overnight signature — resting heart rate up, HRV down',
  imageCaption:
    "Caffeine's overnight signature — a 5–6 hour half-life means the afternoon coffee can raise resting heart rate and flatten HRV; find your personal cutoff in your data.",
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Your caffeine cutoff isn’t a rule from a magazine. It’s a line in your own overnight numbers.',
    link: '/measurements',
    linkText: 'What ONDA measures →',
  },
  content: `
## [ CASE FILE: THE CUP YOU FORGOT ABOUT ]

> "You stopped tasting the coffee at three in the afternoon. Your heart is still tasting it at midnight.

> Caffeine is the most-used stimulant on earth and the one people most confidently misjudge. The buzz fades in a couple of hours, so the story ends there — except the molecule doesn't. Half of that 2 p.m. cup is still circulating at dinner, quietly holding your nervous system a notch toward *go* while your body is trying to shift toward *rest*."

---

## Section 1: The half-life is the whole story

Caffeine's half-life averages **five to six hours**. That is the number almost nobody accounts for. A coffee at 3 p.m. means roughly half its caffeine is still in you at 8 or 9 p.m., and a meaningful fraction past midnight. You don't feel it as a jolt anymore — tolerance blunts the *sensation* long before it clears the *effect* — but your autonomic nervous system is still reading it.

The result is a low, steady tilt toward the [sympathetic](/glossary/sympathetic-nervous-system) branch exactly when your physiology should be handing the night over to [parasympathetic](/glossary/parasympathetic-nervous-system) recovery.

---

## Section 2: What it does to the overnight signal

Caffeine leaves a signature in three places ONDA actually watches:

- **Resting heart rate ticks up.** A stimulant keeps the baseline pulse a few beats higher than it would otherwise settle — a small rise, but one that shows against your own corridor.
- **Overnight HRV flattens.** With sympathetic tone held up, beat-to-beat [variability](/glossary/heart-rate-variability) — the marker of parasympathetic recovery — reads lower. Sleep studies find higher LF/HF ratios and QT variability during REM after evening caffeine: the autonomic fingerprint of a nervous system that never fully let go.
- **Sleep thins.** Even when you fall asleep fine, caffeine can shave sleep quality and depth — and a poorer night drags the next day's baseline with it.

None of this is dramatic on any single night. It is a *tax*, not a catastrophe — and taxes compound.

---

## Section 3: Why there's no universal cutoff

Here is the part the "no caffeine after 2 p.m." rule gets wrong: **the right cutoff is not the same for two people, and it isn't willpower.** It's genetics and metabolism. Fast metabolizers clear caffeine quickly and can drink it late with little cost; slow metabolizers carry an afternoon cup deep into the night. Habitual heavy users develop partial tolerance to the acute autonomic effect; occasional users get hit harder.

So a population rule is the wrong tool. The only cutoff that means anything is *yours*, and the only way to find it is to watch how your own overnight numbers respond to caffeine at different times.

---

## Section 4: Finding your cutoff from your own data

This is a measurement problem, and it's a solvable one. Build a **personal baseline** — your normal resting heart rate, variability and breathing rate — then watch what a late cup does to it. A night after a 4 p.m. coffee that reads with a higher resting pulse and a flatter [HRV](/glossary/heart-rate-variability) than your corridor is your body drawing the line for you.

ONDA reads those overnight signals from an Apple Watch (or your resting numbers from the phone camera) and holds your corridor, so a late-caffeine night shows up as a visible departure from *your* normal rather than an abstract worry — [your data, your line](/measurements). Move the cup earlier, watch the night come back into the corridor, and you've found your cutoff empirically instead of guessing.

The honest caveat: caffeine affects sleep and recovery, but it isn't a medical hazard for most people and ONDA isn't diagnosing anything — it's showing you a lifestyle input written into your own numbers. For the adenosine-and-sleep-pressure side of the same molecule, see [caffeine's half-life and sleep pressure](/articles/caffeine-half-life-sleep-pressure).

---

## Section 5: What to actually do

You don't have to quit coffee. You have to *time* it. Front-load caffeine into the morning, set your personal cutoff a few hours earlier than you think you need, and if you want the night back without giving up the ritual, a slow [exhale-led wind-down](/articles/coherent-breathing-guide) helps hand the nervous system over to recovery. Then check the numbers — the corridor tells you whether it worked.

> **The Hack:** Treat caffeine like a half-life, not a buzz. Assume a 3 p.m. cup is still working at 9 p.m., set your cutoff by what your *overnight* resting heart rate and HRV actually do — not by a generic rule — and move it earlier until your nights sit back inside your baseline.

> [ SYSTEM_STATUS ]
> HALF_LIFE: ~5-6h (afternoon cup active into the night)
> SIGNATURE: resting HR ↑ · overnight HRV ↓ · sleep depth ↓
> CUTOFF: personal (genetics/metabolism), not a fixed clock
> METHOD: read your own baseline — PRACTICE, NOT DIAGNOSIS
`,
  howToSteps: [
    {
      name: 'Account for the half-life',
      text: 'Caffeine averages a 5-6 hour half-life, so assume half of an afternoon cup is still active late in the evening. The faded buzz does not mean the molecule has cleared.',
      protocolId: 'caffeine-halflife',
    },
    {
      name: 'Watch the overnight signature',
      text: 'Late caffeine tends to raise resting heart rate, flatten overnight HRV and thin sleep. Look for these against your personal baseline rather than at any single reading.',
      protocolId: 'caffeine-signature',
    },
    {
      name: 'Find your personal cutoff empirically',
      text: 'Your cutoff is set by genetics and metabolism, not a magazine rule. Move your last cup earlier and watch when your overnight numbers return to your corridor — that time is your real cutoff.',
      protocolId: 'caffeine-cutoff',
    },
    {
      name: 'Front-load, then wind down',
      text: 'Keep caffeine in the morning. If you want the night back, add a slow exhale-led wind-down to hand the nervous system over to recovery, and confirm it worked in your own baseline.',
      protocolId: 'caffeine-frontload',
    },
  ],
}

export default [article]
