import type { Article } from './types'

/**
 * Alcohol clearance — companion guide for /tools/alcohol.
 * Targets "how long does alcohol stay in your system" (high volume). Reuses verified sources.
 */
const article: Article = {
  slug: 'how-long-does-alcohol-stay-in-your-system',
  title: 'How Long Does Alcohol Stay in Your System?',
  seoTitle: 'How Long Does Alcohol Stay in Your System? | ONDA Life',
  description:
    'How long alcohol stays in your body, how fast it clears (~one drink an hour), why nothing speeds it up, and what it does to your sleep and recovery.',
  category: 'ONDA Protocol',
  relatedSlugs: ['homeostasis', 'heart-rate-variability', 'deep-sleep', 'slow-wave-sleep', 'circadian-rhythm'],
  introStyle: 'orange',
  image: '/images/tools/alcohol.png',
  imageAlt:
    'How long alcohol stays in your system: the Widmark equation, ~0.015%/hour clearance, and why only time lowers blood alcohol.',
  imageTitle: '[CLEARANCE_RATE]: Why only time lowers blood alcohol — about one drink per hour.',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Estimate your blood-alcohol level and the hours until it clears for your weight and drinks.',
    link: '/tools/alcohol',
    linkText: 'Alcohol Clearance Calculator →',
  },
  howToSteps: [
    { name: 'Know the clearance rate', text: 'Your body clears roughly 0.015% BAC per hour — about one standard drink per hour — regardless of coffee, food or cold showers.', protocolId: 'alc-rate' },
    { name: 'Do the maths from your peak', text: 'Estimate peak BAC, then subtract ~0.015%/hour. Four drinks can take 5–6+ hours to fully clear.', protocolId: 'alc-maths' },
    { name: 'Stop drinking 3+ hours before bed', text: 'Even if you fall asleep, metabolising alcohol fragments the second half of the night and lowers HRV.', protocolId: 'alc-bed' },
    { name: 'Never drive on a guess', text: 'Estimates have huge individual variation — if you have been drinking, arrange another way home.', protocolId: 'alc-drive' },
  ],
  content: `
## [ TRACKING THE CLEARANCE ]

> "‘How long does alcohol stay in your system?’ The blood answer is simpler than people hope: your liver clears alcohol at a roughly fixed rate — about one standard drink per hour — and almost nothing speeds that up. Coffee, a cold shower, a big meal, ‘sweating it out’ — none of them sober you faster; they just make a drunk person a more alert drunk person. In the ONDA Biocomputer model, alcohol is a slow-draining buffer: only time empties it."

---

## Section 1: How fast it clears

Once it’s in your blood, alcohol is eliminated at approximately **0.015% BAC per hour** — close to **one standard drink (14 g) per hour**. So a blood-alcohol level of 0.08% takes about five hours to reach zero; four or five drinks in an evening can mean alcohol in your system past 4–6 hours, sometimes into the next morning.

The detectable *traces* linger far longer than the *impairing* level: alcohol shows in urine for up to ~12–24 hours, and in specialised tests (EtG) for days — but that’s detection, not intoxication. For how it actually clears from blood for your weight and drinks, use the [Alcohol Clearance Calculator](/tools/alcohol).

---

## Section 2: Why nothing speeds it up

The rate-limiting step is your liver’s enzymes (mainly alcohol dehydrogenase), which work at a near-constant pace you can’t hurry. Caffeine masks drowsiness but doesn’t change BAC; food slows *absorption* (lowering the peak) but not *elimination*; water helps the hangover, not the clearance. The only variable that matters once you’ve drunk is **time**.

It does vary between people — body size, sex, genetics, liver health and medication shift the numbers — which is exactly why a calculator gives an estimate, never a green light to drive.

---

## Section 3: The real cost — your night

> **The Hack:** Finish your last drink at least 3 hours before bed.

**The Science:** Alcohol helps you fall asleep but wrecks the back half of the night — it suppresses REM, increases awakenings, and lowers overnight [heart-rate variability](/glossary/heart-rate-variability) as your body works to metabolise it. That’s why a few drinks leave you unrested and show up as poor recovery the next morning. Front-load and stop early to protect [deep sleep](/glossary/deep-sleep).

> [ HARDWARE_VALIDATION ]
> VALIDATION_DEVICE: Sleep / HRV tracker the morning after
> METRIC: Lower overnight HRV and less deep sleep after late drinks
> STATUS: RECOVERY_DEBT_LOGGED

---

Educational only, not medical or legal advice. Blood-alcohol estimates vary widely between individuals — never use them to decide whether it is safe or legal to drive. If you have been drinking, do not drive.
`,
}

export default [article]
