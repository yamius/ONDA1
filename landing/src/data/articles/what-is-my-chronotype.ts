import type { Article } from './types'

/**
 * Chronotype — companion guide for /tools/chronotype.
 * Targets "what is my chronotype / morning lark vs night owl". Verified sources.
 */
const article: Article = {
  slug: 'what-is-my-chronotype',
  title: 'What’s Your Chronotype? Morning Lark or Night Owl',
  seoTitle: 'What’s Your Chronotype? Lark vs Owl | ONDA Life',
  description:
    'Your chronotype is your body clock’s natural timing — lark, owl or in between. What it is, why it’s largely genetic, social jet lag, and how to work with it.',
  category: 'ONDA Protocol',
  relatedSlugs: ['circadian-rhythm', 'homeostasis', 'cortisol', 'deep-sleep', 'adenosine'],
  introStyle: 'indigo',
  image: '/images/articles/what-is-my-chronotype.png',
  imageAlt:
    'What is my chronotype: morning lark vs night owl vs intermediate, why it’s largely genetic, social jet lag, and how to time your day around it.',
  imageTitle: '[CLOCK_TYPE]: Identifying your natural circadian timing — and working with it.',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Take the 6-question quiz to find your type and a personalised daily-timing protocol.',
    link: '/tools/chronotype',
    linkText: 'Chronotype Quiz →',
  },
  howToSteps: [
    { name: 'Find your natural type', text: 'On free days with no alarm, when do you naturally sleep and wake? Early = lark, late = owl, middle = intermediate.', protocolId: 'ct-find' },
    { name: 'Stop fighting it', text: 'Chronotype is largely genetic and age-linked — you can nudge it with light, not override it. Build your schedule around it where you can.', protocolId: 'ct-accept' },
    { name: 'Cut social jet lag', text: 'Keep weekday and weekend sleep times closer together; big swings (late chronotypes especially) impair health and mood.', protocolId: 'ct-socialjetlag' },
    { name: 'Use light to shift if needed', text: 'Owls who must wake early: bright morning light + dark evenings nudge the clock earlier over weeks.', protocolId: 'ct-shift' },
  ],
  content: `
## [ IDENTIFYING THE CLOCK TYPE ]

> "Your chronotype is the natural timing of your body clock — whether you’re wired to peak early (a ‘lark’), late (an ‘owl’), or somewhere between. It’s not laziness or discipline; it’s biology. In the ONDA Biocomputer model, it’s your default clock-offset, and most of the friction people feel with mornings or late nights comes from running their life on a schedule that fights it."

---

## Section 1: Lark, owl, or in between

Researchers measure chronotype with tools like the Morningness–Eveningness Questionnaire (Horne & Östberg 1976) and the Munich ChronoType Questionnaire, which uses your sleep timing on *free* days — when no alarm forces you — as the truest read (Roenneberg 2003). Most people are intermediate; true extreme larks and owls sit at the tails.

The quickest self-check: on a holiday with no obligations, when do you naturally fall asleep and wake? That’s your clock talking. The [Chronotype Quiz](/tools/chronotype) turns six questions into your type plus a timing protocol.

---

## Section 2: It’s largely genetic — and shifts with age

Chronotype is substantially heritable and changes predictably across life: children skew early, adolescents shift dramatically late (peaking around age 20 — biology, not attitude), then drift earlier again with age (Adan 2012; Roenneberg 2003). You can nudge it a little with light and routine, but you can’t simply will an owl into a lark. Working *with* your type beats fighting it.

---

## Section 3: Social jet lag — the hidden cost

> **The Hack:** Keep your weekday and free-day sleep times as close as you can.

**The Science:** When your social schedule (early work, school) clashes with a late clock, you build up "social jet lag" — sleeping short on workdays and long on free days. Late chronotypes accumulate real sleep debt this way (Roenneberg 2003), and it’s linked to worse mood, metabolism and health. Shrinking that gap is one of the highest-value things a night owl can do.

> **The Hack:** If you must shift earlier, get bright light first thing and keep evenings dim.

**The Logic:** Morning light advances the clock; evening light delays it. Used consistently, light is the one lever that actually moves your chronotype (within limits).

> [ HARDWARE_VALIDATION ]
> VALIDATION_DEVICE: Sleep tracker (weekday vs free-day midpoint)
> METRIC: Smaller weekday/weekend sleep-timing gap; easier wakeups
> STATUS: ALIGNED_WITH_CLOCK

---

Educational only, not medical advice. Persistent inability to sleep or wake at socially required times (beyond normal owl tendencies) can indicate a circadian rhythm sleep disorder worth discussing with a clinician.
`,
}

export default [article]
