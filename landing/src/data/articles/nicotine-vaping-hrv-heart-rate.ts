import type { Article } from './types'

/**
 * Nicotine/vaping → acute HR & BP rise, reduced HRV (sympathetic stimulant). Consumer-legal like
 * caffeine/alcohol, so fine to name in an educational article (NOT for ad creatives — noted in the
 * topic-map). Ties to ONDA baseline (RHR/HRV). Firewall: descriptive; addiction/quitting → real help.
 * Grounded: Benowitz & Burbank 2016 (nicotine CV pharmacology), Moheimani 2017 (e-cig users: HRV
 * shifted sympathetic). 2026-10 upgrade: answer-first, comparison table, quit steps, chest-pain note;
 * "all-day drip = near-continuous sympathetic nudge" and "HRV recovers after quitting" softened (unsourced).
 */
const article: Article = {
  slug: 'nicotine-vaping-hrv-heart-rate',
  title: 'The Quiet Tax: What Nicotine and Vaping Do to Your Heart Rate and HRV',
  seoTitle: 'Nicotine and Vaping: Heart Rate and HRV Effects | ONDA Life',
  description:
    'Nicotine raises heart rate and blood pressure and tilts HRV toward stress, smoked or vaped. Why it still feels relaxing, and how to quit.',
  category: 'ONDA Protocol',
  relatedSlugs: ['heart-rate-variability', 'caffeine-hrv-resting-heart-rate', 'your-baseline-knows-first', 'sympathetic-nervous-system', 'coherent-breathing-guide'],
  introStyle: 'amber',
  image: '/images/articles/nicotine-vaping-hrv-heart-rate.webp',
  imageAlt:
    "Nicotine molecule feeding an all-day drip into a glowing heart, heart rate and blood pressure up and HRV down — nicotine's quiet autonomic tax.",
  imageTitle: "Nicotine — a sympathomimetic that raises heart rate and lowers HRV",
  imageCaption:
    "Nicotine's quiet autonomic tax — a sympathomimetic that raises heart rate and blood pressure while flattening HRV, and how it hides behind \"it relaxes me.\"",
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'It feels like it calms you. Your heart rate and HRV tell a different story — and they’re not editorializing.',
    link: '/measurements',
    linkText: 'What ONDA measures →',
  },
  content: `
Nicotine raises heart rate and blood pressure because it triggers the release of adrenaline-like stress chemicals, whether it comes from a cigarette, a vape or a pouch (Benowitz 2016). It also shifts the nervous system toward the [sympathetic](/glossary/sympathetic-nervous-system) "go" side: in a study of healthy young adults, habitual e-cigarette users had [heart rate variability](/science/concepts/heart-rate-variability) patterns showing more sympathetic and less vagal activity than non-users (Moheimani 2017). The calm many people feel from nicotine is largely relief from withdrawal and the ritual of a pause, not a calmer body.

---

## Does nicotine raise your heart rate?

Yes — nicotine acutely raises heart rate and blood pressure. It stimulates the sympathetic nervous system and the release of catecholamines (adrenaline and noradrenaline), which speeds the heart, narrows blood vessels and increases the heart’s workload (Benowitz 2016). This happens with any delivery route; removing tobacco smoke removes many toxins but not nicotine’s effect on the heart.

That is the opposite of a relaxant’s physiology, which is why the "it relaxes me" story is so misleading: the felt experience and the autonomic reality point in different directions.

---

## How does nicotine affect HRV?

Nicotine tends to lower [heart rate variability](/glossary/heart-rate-variability), the beat-to-beat variation that reflects recovery-side (parasympathetic) tone. Moheimani et al. (2017) compared 23 healthy habitual e-cigarette users with 19 non-users and found HRV patterns shifted toward sympathetic predominance, along with higher oxidative stress. It was a small cross-sectional study, so it shows an association rather than proof of cause, but it fits nicotine’s known pharmacology.

| | Cigarettes | Vapes | Nicotine pouches / gum |
|---|---|---|---|
| Nicotine | Yes | Yes | Yes |
| Heart rate and blood pressure | Raised | Raised | Raised |
| Tobacco smoke (combustion) | Yes | No | No |
| Overall cardiovascular risk | Highest | Lower than smoking; long-term risk still unknown | Lower than smoking (based on nicotine-replacement and smokeless data) |

Benowitz and Burbank concluded that nicotine without combustion carries much lower cardiovascular risk than smoking for healthy users, at least in the short term — but remains a concern for people with heart disease (Benowitz 2016).

---

## Why does nicotine feel relaxing if it’s a stimulant?

Nicotine feels relaxing mainly because each dose relieves the restlessness and craving of withdrawal from the last one. Nicotine wears off within hours, so regular users cycle through mini-withdrawals during the day; the next dose smooths them out, which reinforces the habit. The reach for a vape is also a reach for a pause — a break, a few deliberate breaths — and that part of the relief is real.

Vaping can make the pattern less visible: because it is easy to use continuously, many people take small hits throughout the day rather than a few discrete cigarettes, so the stimulant effect can be spread across more of the day.

---

## Can you see nicotine’s effect in your own numbers?

You can often see it as a [resting heart rate](/science/measurements/resting-heart-rate) and HRV that sit worse on heavier-use days than on lighter ones. ONDA reads resting heart rate and HRV from Apple Health (Apple Watch or another tracker that syncs there) and holds them against your **personal 14-day baseline**, so changes are compared with your own normal rather than a population average — [see what ONDA measures](/measurements). If you cut down or quit, the same baseline lets you watch your resting heart rate settle over the following weeks, which many people find motivating.

ONDA is descriptive, not medical, and this is not medical advice. It can show you the physiology; it can’t treat the dependence.

---

## How do you cut down or quit?

You give yourself the best chance by combining practical support with medication or nicotine replacement where appropriate.

1. **Get support:** a doctor, pharmacist or free quitline (in the US, 1-800-QUIT-NOW; in the UK, the NHS Stop Smoking Service) improves your odds compared with going it alone.
2. **Ask about medication:** nicotine replacement (patches plus gum or lozenges), varenicline or cytisine can ease withdrawal — a clinician can help you choose.
3. **Set a quit date** and plan for the moments you usually reach for nicotine.
4. **Replace the ritual, not just the substance:** when you want a pause, take a few slow breaths with a longer exhale — see [coherent breathing](/articles/coherent-breathing-guide). It gives you the break without the stimulant.
5. **Track the payoff:** watch your own resting heart rate trend as a concrete reason to keep going.

---

## When should you get medical help?

Call emergency services straight away for chest pain or pressure, pain spreading to the arm, jaw or back, sudden shortness of breath, fainting, or a racing or irregular heartbeat that doesn’t settle. See a doctor before using nicotine replacement if you’re pregnant, have heart disease or have recently had a heart attack or stroke. Never vape or use nicotine products near children — liquid nicotine is poisonous if swallowed.

> **The Hack:** Don’t trust the feeling — check the physiology. Nicotine reads as calm while it raises your heart rate. When you want the pause it seems to offer, take a slow, longer-exhale breath instead, and let your baseline show the difference over the weeks you cut down.

> [ SYSTEM_STATUS ]
> REALITY: nicotine = sympathetic stimulant (HR ↑, BP ↑, HRV shifts toward sympathetic)
> ILLUSION: "relaxation" = relieved withdrawal + ritual, not a calmer body
> VAPING: no smoke, same nicotine
> HELP: quitline/doctor + medication beat an app · NOT MEDICAL ADVICE
`,
  howToSteps: [
    {
      name: 'Separate the feeling from the physiology',
      text: 'Nicotine feels calming but acts as a stimulant — raising heart rate and blood pressure and shifting HRV toward sympathetic dominance. The relief is mostly relieved withdrawal and ritual, not a calmed nervous system.',
      protocolId: 'nic-reality',
    },
    {
      name: 'Notice the all-day pattern',
      text: 'Vaping removes smoke but not nicotine. Because it is easy to use continuously, many people take small hits all day, spreading the stimulant effect across more of the day.',
      protocolId: 'nic-drip',
    },
    {
      name: 'Replace the ritual with a real pause',
      text: 'The reach for a vape when stressed is often a reach for a pause. A slow, longer-exhale breath delivers the genuine parasympathetic calm nicotine only imitates — no accelerant attached.',
      protocolId: 'nic-replace',
    },
    {
      name: 'Use real help, and your data as motivation',
      text: 'Nicotine dependence is a genuine addiction — a doctor, quitline, nicotine replacement or stop-smoking medication does what an app can’t. Let your settling resting heart rate be a concrete, personal reason to keep going.',
      protocolId: 'nic-help',
    },
  ],
}

export default [article]
