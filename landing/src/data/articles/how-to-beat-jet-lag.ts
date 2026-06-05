import type { Article } from './types'

/**
 * Jet lag — companion guide for /tools/jet-lag.
 * Targets "how to beat jet lag" with light + melatonin + timing. Verified sources.
 */
const article: Article = {
  slug: 'how-to-beat-jet-lag',
  title: 'How to Beat Jet Lag: Light, Melatonin & Timing',
  seoTitle: 'How to Beat Jet Lag (Light & Melatonin) | ONDA Life',
  description:
    'Beat jet lag by shifting your body clock the right way: well-timed light is the strongest lever, melatonin helps eastward, and direction decides the strategy.',
  category: 'ONDA Protocol',
  relatedSlugs: ['circadian-rhythm', 'homeostasis', 'deep-sleep', 'slow-wave-sleep', 'cortisol'],
  introStyle: 'amber',
  image: '/images/articles/how-to-beat-jet-lag.png',
  imageAlt:
    'How to beat jet lag: timed bright light to shift the body clock, melatonin for eastward travel, and why direction changes the strategy.',
  imageTitle: '[CLOCK_SHIFT]: Using light and melatonin to re-time the circadian clock.',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Enter your trip to get exact seek-light and avoid-light windows for your direction.',
    link: '/tools/jet-lag',
    linkText: 'Jet Lag Light-Timing Planner →',
  },
  howToSteps: [
    { name: 'Know which way to shift', text: 'Flying east = advance your clock (sleep/wake earlier); flying west = delay it (later). East is harder and slower.', protocolId: 'jl-direction' },
    { name: 'Use light as the main lever', text: 'Seek bright light to advance (mornings, eastward) or delay (evenings, westward); avoid light at the wrong time — that pushes the clock backwards.', protocolId: 'jl-light' },
    { name: 'Add melatonin for eastward trips', text: 'A small dose in the destination evening helps advance the clock for trips across ~5+ zones east (Herxheimer 2002).', protocolId: 'jl-melatonin' },
    { name: 'Shift sleep gradually', text: 'Move bedtime/wake ~1 h/day toward the destination; pre-shifting a couple of days before helps for big trips.', protocolId: 'jl-sleep' },
  ],
  content: `
## [ RE-TIMING THE CLOCK ]

> "Jet lag isn’t tiredness — it’s a clock mismatch. Your internal circadian clock is still on home time while the world around you runs on destination time, and until they realign, sleep, energy, digestion and mood are all off. You can’t will the clock to move, but you can shift it — and the most powerful lever isn’t coffee or willpower, it’s light, used at the right time."

---

## Section 1: Which way does your clock need to move?

Everything hinges on direction:

- **Flying east** → you must **advance** your clock (fall asleep and wake earlier). Harder, because the human clock naturally runs slightly longer than 24 h and prefers to delay.
- **Flying west** → you must **delay** it (later). Easier and faster.

A rough rule: about one day of adjustment per time zone, a bit quicker westward. Light timing can speed this up; mistimed light slows it down. The [Jet Lag Light-Timing Planner](/tools/jet-lag) computes your exact seek-light and avoid-light windows from your trip.

---

## Section 2: Light — the strongest lever

Light resets the clock more powerfully than anything else, but timing relative to your body clock decides the direction (Eastman & Burgess 2009). The pivot is your core-body-temperature minimum (≈2 h before your usual wake time):

- **To advance (eastward):** get bright light *after* that point (your morning), and *avoid* light in the late evening.
- **To delay (westward):** get bright light in the *evening*, and avoid early-morning light.

Get it backwards and you push your clock the wrong way — which is how people accidentally make jet lag worse. Bright outdoor daylight is ideal; in the wrong window, sunglasses and dim screens help (evening screens already delay the clock and suppress melatonin — Chang 2015).

---

## Section 3: Melatonin and sleep timing

> **The Hack:** For eastward trips across ~5+ time zones, a low dose of melatonin in the destination evening helps pull your clock earlier.

**The Science:** A Cochrane review found melatonin "remarkably effective" at reducing jet lag, especially eastward and for travellers who’ve had it before (Herxheimer & Petrie 2002). Pair it with the light schedule, not instead of it.

> **The Hack:** Shift your sleep schedule ~1 hour per day toward the destination, starting a day or two before you fly for big trips.

**The Logic:** Pre-shifting shrinks the gap your clock has to close on arrival, so you land already part-adjusted.

> [ HARDWARE_VALIDATION ]
> VALIDATION_DEVICE: Sleep tracker + how fast local-time sleep returns
> METRIC: Solid sleep on local time within ~days, not the whole trip
> STATUS: CIRCADIAN_REALIGNED

---

Educational only, not medical advice. Melatonin can interact with conditions and medications and isn’t for everyone — check with a clinician, especially if you’re pregnant, on other drugs, or have a health condition.
`,
}

export default [article]
