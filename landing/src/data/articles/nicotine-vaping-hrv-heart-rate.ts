import type { Article } from './types'

/**
 * Nicotine/vaping → acute HR & BP rise, reduced HRV (sympathetic stimulant). Consumer-legal like
 * caffeine/alcohol, so fine to name in an educational article (NOT for ad creatives — noted in the
 * topic-map). Ties to ONDA baseline (RHR/HRV). Firewall: descriptive; addiction/quitting → real help.
 * Grounded: nicotine is a sympathomimetic; raises HR, lowers HRV. No fabricated numbers.
 */
const article: Article = {
  slug: 'nicotine-vaping-hrv-heart-rate',
  title: 'The Quiet Tax: What Nicotine and Vaping Do to Your Heart Rate and HRV',
  seoTitle: 'Nicotine, Vaping, Heart Rate & HRV: The Tax | ONDA Life',
  description:
    'Nicotine is a stimulant, and vaping delivers it in a steady drip — raising heart rate and blood pressure while flattening HRV. Why the effect hides behind “it relaxes me,” and how it shows up in your own numbers.',
  category: 'ONDA Protocol',
  relatedSlugs: ['heart-rate-variability', 'caffeine-hrv-resting-heart-rate', 'your-baseline-knows-first', 'sympathetic-nervous-system', 'coherent-breathing-guide'],
  introStyle: 'amber',
  neuralSuggestion: {
    text: 'It feels like it calms you. Your heart rate and HRV tell a different story — and they’re not editorializing.',
    link: '/measurements',
    linkText: 'What ONDA measures →',
  },
  content: `
## [ CASE FILE: THE RELAXATION THAT SPEEDS YOU UP ]

> "You reach for it when you're stressed, and it feels like relief. But the feeling and the physiology point in opposite directions. Nicotine is a stimulant — a [sympathetic](/glossary/sympathetic-nervous-system) accelerant — and while your mind reads the hit as calm, your heart is speeding up and your nervous system is tensing, not settling.

> The relief is real. It's also the relief of feeding a craving, not the relief of a calmed body. And your numbers can tell the two apart."

---

## Section 1: Nicotine is a stimulant, full stop

Whatever the delivery — cigarette, vape, pouch — nicotine acts as a **sympathomimetic**: it stimulates the sympathetic nervous system, releasing adrenaline-family signals that **raise heart rate and blood pressure.** That's the opposite of a relaxant's physiology. The subjective calm comes from relieving withdrawal and from ritual, not from any downregulation of the stress response — under the hood, the stress response is being *turned up.*

This is why the "it relaxes me" story is so sticky and so misleading: the felt experience and the autonomic reality genuinely diverge.

---

## Section 2: What it does to HRV

Because nicotine pushes toward sympathetic dominance, it **reduces [heart-rate variability](/glossary/heart-rate-variability)** — the marker of parasympathetic, recovery-side tone. Higher heart rate, lower variability: the signature of a system tilted toward *go.* With cigarettes this comes bundled with all the other harms of combustion; with vaping the combustion is gone but the nicotine — and its autonomic effect — is not.

Vaping deserves its own note here. It tends to deliver nicotine not as a few discrete hits but as an **all-day steady drip**, which can mean the sympathetic nudge is near-continuous rather than occasional. A body that never gets a clean parasympathetic window is a body whose baseline quietly settles in the wrong place.

---

## Section 3: The withdrawal wobble

There's a second pattern worth naming: nicotine's short half-life means regular users cycle through mini-withdrawals all day, each with its own autonomic turbulence — restlessness, a stress bump, a craving that reads as anxiety. The next hit smooths it, which cements the loop. From the outside it looks like the substance manages stress. From the inside of your data, it's often *creating* the very fluctuations it then relieves.

---

## Section 4: Seeing it in your own numbers

This is a lifestyle input, and like caffeine or alcohol it writes itself into your baseline. ONDA holds your resting heart rate and [HRV](/glossary/heart-rate-variability) against your **personal corridor**, so the effect stops being abstract: an elevated resting pulse and a flattened variability that track your use are the tax made visible — [your own data](/measurements). If you're working toward cutting down or quitting, that same baseline becomes a motivator — because HRV tends to recover as nicotine leaves the picture, and watching your own numbers climb back is a concrete, personal reason to keep going.

The firewall, plainly: ONDA is **descriptive, not medical**, and this is not medical advice. Nicotine dependence is a genuine addiction, and quitting is hard — for real help, a doctor, a quitline, or an evidence-based cessation program will do far more than an app. ONDA can show you the physiology; it can't treat the dependence.

---

## Section 5: If you're cutting down

If quitting is the goal, lean on real support and use your data as encouragement, not judgment. Replace the ritual, not just the substance — the reach for a vape when stressed is often a reach for a *pause*, and a slow [exhale-led breath](/articles/coherent-breathing-guide) delivers the genuine version of the calm nicotine only imitates: an actual parasympathetic shift, no accelerant attached. Then let the corridor show you the payoff as your resting heart rate settles and your variability returns.

> **The Hack:** Don't trust the feeling — check the physiology. Nicotine reads as calm while it raises your heart rate and lowers your HRV. When you want the pause it seems to offer, take a slow, longer-exhale breath instead: that one actually calms the body, and your baseline will show which relief was real.

> [ SYSTEM_STATUS ]
> REALITY: nicotine = sympathetic stimulant (HR ↑, BP ↑, HRV ↓)
> ILLUSION: "relaxation" = relieved withdrawal + ritual, not calm
> VAPING: all-day drip → near-continuous sympathetic nudge
> HELP: dependence is real — quitline/doctor beats an app · NOT MEDICAL ADVICE
`,
  howToSteps: [
    {
      name: 'Separate the feeling from the physiology',
      text: 'Nicotine feels calming but acts as a stimulant — raising heart rate and blood pressure and lowering HRV. The relief is relieved withdrawal and ritual, not a calmed nervous system.',
      protocolId: 'nic-reality',
    },
    {
      name: 'Notice the all-day drip',
      text: 'Vaping often delivers nicotine as a steady all-day drip rather than discrete hits, meaning a near-continuous sympathetic nudge. A body that never gets a clean parasympathetic window drifts its baseline the wrong way.',
      protocolId: 'nic-drip',
    },
    {
      name: 'Replace the ritual with a real pause',
      text: 'The reach for a vape when stressed is often a reach for a pause. A slow, longer-exhale breath delivers the genuine parasympathetic calm nicotine only imitates — no accelerant attached.',
      protocolId: 'nic-replace',
    },
    {
      name: 'Use real help, and your data as motivation',
      text: 'Nicotine dependence is a genuine addiction — a doctor, quitline or cessation program does what an app can’t. Let your recovering HRV and resting heart rate be the concrete, personal reason to keep going.',
      protocolId: 'nic-help',
    },
  ],
}

export default [article]
