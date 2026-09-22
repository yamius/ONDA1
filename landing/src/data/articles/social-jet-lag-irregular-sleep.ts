import type { Article } from './types'

/**
 * Social jet lag / irregular bedtime → lower HRV; ties to ONDA's Life Rhythm sleep-regularity %
 * (the one metric ONDA measures directly). Distinct from how-to-beat-jet-lag (travel + light/melatonin).
 * Grounded: Rutters/social-jetlag definition (>2h in 30%+); Bonmati-Carrion / young-men field study
 * lower HRV in high-SJL; Penn State adolescent regularity → HRV. Honest: descriptive, not diagnosis.
 * Merged (2026-09-22) with the chronotype-vs-misalignment reframe (Roenneberg): the risk is the
 * GAP between clock and schedule, not the chronotype itself; teenagers worst-hit → later school starts.
 */
const article: Article = {
  slug: 'social-jet-lag-irregular-sleep',
  title: 'Social Jet Lag: Why a Moving Bedtime Reads as Chronic Stress',
  seoTitle: 'Social Jet Lag & HRV: The Irregular-Bedtime Cost | ONDA Life',
  description:
    'You didn’t fly anywhere, but shifting your bedtime an hour night to night gives your body a version of jet lag — and it flattens the HRV that recovers you. Why sleep regularity, not just duration, is a signal worth watching.',
  category: 'ONDA Protocol',
  relatedSlugs: ['circadian-rhythm', 'heart-rate-variability', 'how-to-beat-jet-lag', 'what-is-my-chronotype', 'how-much-sleep-do-you-need'],
  introStyle: 'orange',
  image: '/images/articles/social-jet-lag-irregular-sleep.webp',
  imageAlt:
    'Holographic human figure inside a desynced circadian clock ring — a cyan body-clock misaligned with an orange actual-schedule arc, scattered moon phases around.',
  imageTitle: 'Social jet lag — a bedtime that moves reads as chronic jet lag',
  imageCaption:
    "Social jet lag — a bedtime that shifts an hour night to night reads as chronic stress and flattens HRV, so sleep regularity, not just duration, matters.",
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Duration gets all the attention. Regularity is the number that quietly moves your recovery.',
    link: '/measurements',
    linkText: 'What ONDA measures →',
  },
  content: `
## [ CASE FILE: THE JET LAG YOU GAVE YOURSELF ]

> "You didn't cross a single time zone this week. Your body isn't so sure.

> Late on Friday, later on Saturday, a catch-up lie-in on Sunday, then a brutal Monday alarm — and by the middle of the week your internal clock is chasing a schedule that keeps moving. Chronobiologists have a name for it: **social jet lag**. The travel is imaginary. The physiological cost is not."

---

## Section 1: What social jet lag actually is

Social jet lag is the gap between the sleep your body clock wants and the sleep your calendar imposes — measured as the difference between your mid-sleep point on free days versus work days. Shift your bedtime and wake time around the weekend and you've effectively flown a couple of time zones west on Friday and back east on Monday, without leaving your bed. The term was coined by German chronobiologist Till Roenneberg, whose work established that it's this *mismatch* — not sleep duration alone — that tracks with poorer health.

It is not a fringe problem. More than **30% of people carry a social jet lag of over two hours** — the equivalent of a permanent, low-grade time-zone shift that never resolves because next weekend does it again. Your [circadian rhythm](/glossary/circadian-rhythm) is built for regularity; a moving target keeps it perpetually re-syncing.

---

## Section 2: The autonomic tax — flatter HRV

Here's the part that shows up in the data. A field study of healthy young men found that in the first hours of sleep, those with **high social jet lag had lower [heart-rate variability](/glossary/heart-rate-variability) on work nights** than on free nights — the low-SJL group stayed steady across both. In adolescents, a bedtime that swung by roughly an hour was associated with measurably lower HRV, a core marker of cardiovascular and autonomic function.

Lower HRV means less parasympathetic recovery during exactly the window meant for it. Social jet lag is now treated as a **chronic stressor** in the literature — not because any single irregular night is dangerous, but because the misalignment repeats, and the recovery you skip doesn't get refunded.

---

## Section 3: It isn't your chronotype — it's the mismatch

Here is the reframe that matters, and it comes straight from the chronobiology that named the problem: **the health risk is the gap between your clock and your schedule — not whether you're a night owl or a morning lark.** A late chronotype who is free to live late can be perfectly healthy. Put that same person on an early alarm five days a week and the chronic misalignment — the social jet lag — is what's been linked to worse metabolic health, low mood and cardiovascular strain.

So there's nothing wrong with being an owl. The harm comes from a world built almost entirely around larks, which forces late chronotypes to live against their own biology. The group that pays the most are **teenagers**: they're developmentally the latest chronotypes of anyone, yet they face the earliest start times — which is the core physiological argument for later school starts. Knowing [your chronotype](/articles/what-is-my-chronotype) isn't about labelling yourself a morning or night person; it's about seeing how far your schedule is dragging you from your own clock.

---

## Section 4: Why regularity beats duration

Most people optimize the wrong sleep number. They chase eight hours and ignore *when* those hours land. But an eight-hour night that starts at 11 p.m. on Tuesday and 2 a.m. on Saturday is not the same input twice — the second one arrives out of phase with your clock, and your body pays the alignment cost even if the duration is identical.

This is why **sleep regularity** deserves its own line on the dashboard. It's a distinct signal from duration, it drifts silently, and it's one of the few sleep variables you can improve this week without needing more total time in bed — you just have to stop moving the anchor.

---

## Section 5: Seeing your own regularity

You can't feel a drifting mid-sleep point; it hides inside "I'm just a bit tired lately." That's why it needs measuring. ONDA's **Life Rhythm** reads your sleep from an Apple Watch and reports your regularity as a percentage, alongside your average bedtime and wake time and a good-nights streak — so the swing you can't perceive becomes a number you can watch and steady. Pair that with your overnight [HRV](/glossary/heart-rate-variability) corridor and you can see the autonomic cost of an irregular week directly — [your rhythm, your data](/measurements).

Honest framing: this is descriptive, not diagnostic. Life Rhythm doesn't score your "readiness" or flag a disorder — it shows regularity, duration and quality against your own pattern, and leaves the interpretation to you.

---

## Section 6: Anchoring the clock

The fix is unglamorous and effective: **anchor your wake time first.** A consistent rise time — even on weekends, even after a late night — is the strongest single lever on circadian stability, more reliable than a fixed bedtime. Add morning light to lock it in, keep the weekend drift under an hour, and give the evening a fixed wind-down ritual so bedtime stops floating. For the travel version of the same machinery, see [how to beat jet lag](/articles/how-to-beat-jet-lag); to work with your clock instead of against it, find [your chronotype](/articles/what-is-my-chronotype).

> **The Hack:** Stop chasing hours; steady the *timing*. Keep your wake time within an hour across the whole week — weekends included — and watch your sleep-regularity percentage and overnight HRV climb together. Regularity is the recovery lever hiding in plain sight.

> [ SYSTEM_STATUS ]
> CAUSE: mid-sleep point drifts work-days vs free-days
> COST: lower first-cycle HRV, less parasympathetic recovery
> STATUS: treated as a chronic stressor in the literature
> LEVER: anchor wake time ±1h — DESCRIPTIVE, NOT DIAGNOSIS
`,
  howToSteps: [
    {
      name: 'Anchor your wake time',
      text: 'A consistent rise time — even on weekends and after a late night — is the strongest lever on circadian stability, more reliable than a fixed bedtime. Pick one wake time and hold it within an hour all week.',
      protocolId: 'sjl-wake-anchor',
    },
    {
      name: 'Keep weekend drift under an hour',
      text: 'A mid-sleep point that swings by two or more hours reads to your body as a time-zone shift. Cap the weekend drift near an hour to keep your clock from perpetually re-syncing.',
      protocolId: 'sjl-weekend',
    },
    {
      name: 'Watch regularity, not just duration',
      text: 'Duration and timing are different inputs. Track your sleep-regularity percentage as its own signal — it drifts silently and improves faster than total sleep time.',
      protocolId: 'sjl-regularity',
    },
    {
      name: 'Add morning light and an evening anchor',
      text: 'Morning light locks the wake time in; a fixed evening wind-down stops bedtime from floating. Together they steady the clock and let overnight HRV recover on schedule.',
      protocolId: 'sjl-light-anchor',
    },
  ],
}

export default [article]
