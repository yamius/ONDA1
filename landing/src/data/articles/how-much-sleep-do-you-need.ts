import type { Article } from './types'

/**
 * How Much Sleep Do You Need — companion guide for /tools/sleep-debt + /tools/sleep-cycle.
 * Targets the huge "how much sleep do I need / by age" query. Reuses verified sources.
 */
const article: Article = {
  slug: 'how-much-sleep-do-you-need',
  title: 'How Much Sleep Do You Need? (By Age)',
  seoTitle: 'How Much Sleep Do You Need by Age | ONDA Life',
  description:
    'How much sleep you really need by age, why "I only need 5 hours" is almost always wrong, and how sleep debt builds — with the evidence and the fixes.',
  category: 'ONDA Protocol',
  relatedSlugs: ['deep-sleep', 'slow-wave-sleep', 'circadian-rhythm', 'adenosine', 'homeostasis'],
  introStyle: 'indigo',
  image: '/images/how-much-sleep-do-you-need.png',
  imageAlt:
    'How much sleep do you need by age: the National Sleep Foundation ranges, why most adults need 7–9 hours, and how sleep debt accumulates.',
  imageTitle: '[SLEEP_REQUIREMENT]: Matching sleep duration to your age-based need.',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Add up your last 7 nights to see your actual sleep debt against your need.',
    link: '/tools/sleep-debt',
    linkText: 'Sleep Debt Calculator →',
  },
  howToSteps: [
    { name: 'Find your age-based need', text: 'Most adults need 7–9 hours; teens 8–10; school-age children 9–11. Use the upper half if you train hard or are stressed.', protocolId: 'sleep-need-band' },
    { name: 'Anchor a consistent schedule', text: 'Same wake time 7 days a week stabilises your body clock more than chasing hours on weekends.', protocolId: 'sleep-need-consistency' },
    { name: 'Repay debt gradually', text: 'You can recover some sleep debt with a few extra hours over several nights — but not erase chronic loss in one lie-in.', protocolId: 'sleep-need-repay' },
    { name: 'Judge by daytime function', text: 'If you’re reliant on caffeine and groggy by mid-afternoon, you’re likely under-sleeping regardless of the clock.', protocolId: 'sleep-need-function' },
  ],
  content: `
## [ READING THE SLEEP REQUIREMENT ]

> "‘How much sleep do I need?’ has a boringly consistent answer for almost everyone: more than you think, and on a more regular schedule than you keep. The myth of the high-performer who thrives on five hours is mostly survivorship bias plus people who’ve normalised feeling tired. In the ONDA Biocomputer model, sleep is the nightly maintenance window — skip it and errors accumulate as [sleep debt](/tools/sleep-debt)."

---

## Section 1: The numbers, by age

The National Sleep Foundation’s expert panel set recommended ranges (Hirshkowitz 2015):

- **Teens (14–17):** 8–10 hours
- **Young adults & adults (18–64):** 7–9 hours
- **Older adults (65+):** 7–8 hours
- **School-age children (6–13):** 9–11 hours

The American Academy of Sleep Medicine independently recommends **at least 7 hours** for adults (Watson 2015). Note these are *ranges* — your personal need sits somewhere inside, nudged up by hard training, illness or high stress. The [Sleep Debt Calculator](/tools/sleep-debt) uses these bands to compute your deficit.

---

## Section 2: Why "I only need 5–6 hours" is usually wrong

True short-sleepers — people genuinely unimpaired on under six hours — are vanishingly rare (a specific genetic trait). For everyone else, chronic short sleep degrades attention, memory and mood, and you adapt to *feeling* normal while your performance keeps dropping — you lose the ability to judge your own impairment. The deficit is real even when the grogginess fades.

---

## Section 3: Sleep debt accumulates — and only partly repays

Sleep loss adds up. In a landmark study, people restricted to six hours a night for two weeks were as impaired as those kept awake for two full nights — but rated themselves only slightly sleepy (Van Dongen 2003). The cost is cumulative and largely invisible from the inside.

You can repay *some* debt — a few extra hours across several nights helps — but you can’t bank sleep in advance or undo months of loss in one weekend. The durable fix is hitting your need most nights.

### PROTOCOL: Consistency Over Catch-Up

> **The Hack:** Anchor one wake time all week and back-calculate your bedtime to hit your need; use a [cycle-aligned bedtime](/tools/sleep-cycle) so you wake between cycles.

**The Science:** A stable wake time entrains your [circadian rhythm](/glossary/circadian-rhythm) and stabilises the pressure-and-clock system that governs sleep — more effective than erratic hours plus weekend catch-up.

> [ HARDWARE_VALIDATION ]
> VALIDATION_DEVICE: Sleep tracker + daytime alertness
> METRIC: Need met most nights; afternoon energy without heavy caffeine
> STATUS: SLEEP_BALANCE_POSITIVE

---

Educational only, not medical advice. Loud snoring, gasping, or unrefreshing sleep despite enough hours can signal a sleep disorder (like apnea) — worth a clinician’s assessment.
`,
}

export default [article]
