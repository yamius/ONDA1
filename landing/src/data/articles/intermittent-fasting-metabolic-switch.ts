import type { Article } from './types'

/**
 * Intermittent Fasting — companion article for /tools/fasting.
 * Targets "intermittent fasting / 16:8 / fasting benefits" intent, ONDA voice.
 */
const article: Article = {
  slug: 'intermittent-fasting-metabolic-switch',
  title: 'Intermittent Fasting: Flipping the Metabolic Switch',
  seoTitle: 'Intermittent Fasting: The Metabolic Switch | ONDA Life',
  description:
    'Intermittent fasting is less about eating less and more about flipping a metabolic switch. Learn the 16:8 protocol, what happens hour by hour, and who should skip it.',
  category: 'ONDA Protocol',
  relatedSlugs: ['ketosis', 'autophagy', 'insulin-sensitivity', 'metabolic-flexibility', 'ketones', 'glucose-spikes'],
  introStyle: 'amber',
  image: '/images/tools/fasting.png',
  imageAlt:
    'Intermittent fasting metabolic switch: the shift from glucose to fat and ketones during the fasted state, plus autophagy and insulin sensitivity.',
  imageTitle: '[FUEL_SWITCH]: Transitioning the system from glucose to fat and ketone metabolism.',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Set your eating window and see the metabolic phases of your fast on a timeline.',
    link: '/tools/fasting',
    linkText: 'Intermittent Fasting Calculator →',
  },
  content: `
## [ FLIPPING THE FUEL SWITCH ]

> "Intermittent fasting is widely misunderstood as a starvation diet. It is not. It is a scheduling protocol — you eat the same fuel, but you change *when*, and that timing flips a metabolic switch.

> In the ONDA Biocomputer model, constant grazing keeps the system pinned in 'glucose mode': insulin always slightly elevated, fat-burning machinery idle. Fasting forces a controlled context-switch into 'fat mode', unlocking [ketones](/glossary/ketones), cellular clean-up, and improved [insulin sensitivity](/glossary/insulin-sensitivity). The benefit isn't the hunger. It's the switch."

---

## Section 1: What "the switch" actually is

A few hours after your last meal, insulin falls and the body works through stored [glucose](/glossary/glucose-spikes) (glycogen). Around the 12-hour mark, glycogen runs low and the system pivots to burning fat, producing [ketones](/glossary/ketones) for fuel. This shift — and the metabolic flexibility it trains — is the real point of fasting.

Want to see it on a timeline? The [Intermittent Fasting Calculator](/tools/fasting) maps your eating/fasting windows against the metabolic phases for any protocol (16:8, 18:6, 20:4, OMAD).

---

## Section 2: The phases of a fast

- **0–4 h (fed):** Insulin rises, the last meal is absorbed.
- **4–12 h (post-absorptive):** Insulin drops; the body draws on glycogen.
- **~12 h (fat-burning begins):** Glycogen runs low; lipolysis and [ketosis](/glossary/ketosis) ramp up.
- **~16 h+ (ketosis & autophagy):** Ketones become a major fuel and [autophagy](/glossary/autophagy) — cellular recycling of damaged components — increases.

This is why 16:8 is the popular entry point: a 16-hour fast reaches the start of the more interesting metabolic territory while remaining easy to sustain around sleep.

---

## Section 3: Fasting Firmware Protocols

### PROTOCOL 1: Start at 14:10, Earn 16:8

> **The Hack:** Begin by simply delaying breakfast and not snacking after dinner — a 14-hour fast. Extend to 16 hours once it feels effortless.

**The Science:** Most of the metabolic-flexibility benefit comes from consistently entering the fasted state, not from extreme windows. A sustainable 16:8 beats an unsustainable OMAD.

### PROTOCOL 2: Protect the Fast with Zero-Calorie Inputs

> **The Hack:** Water, black coffee and plain tea are fine and don't break the fast. Anything with calories raises insulin and ends it.

**The Logic:** The fasted state is an insulin state, not a willpower state. Trace calories ("just a splash of milk") quietly flip the switch back to glucose mode.

### PROTOCOL 3: Front-Load Protein in the Window

> **The Hack:** When the window opens, prioritise protein — aim for your daily target across 2–3 meals.

**The Logic:** A shorter eating window makes it easy to under-eat protein and lose muscle. Hit your number; the [Protein Intake Calculator](/tools/protein) sets the target.

---

## Section 4: Who should NOT fast

Fasting is a tool, not a mandate. **Skip it** during pregnancy or breastfeeding, with a history of disordered eating, with type 1 diabetes or on glucose-lowering medication without medical supervision, or if you have certain other conditions. If you take regular medication or have a health condition, check with a clinician first. Done wrong, chronic under-eating tanks sleep, hormones and [homeostasis](/glossary/homeostasis) — the opposite of the goal.

> [ HARDWARE_VALIDATION ]
> VALIDATION_DEVICE: Continuous glucose monitor / morning energy log
> METRIC: Flatter glucose curve + stable energy across the fast
> STATUS: METABOLIC_FLEXIBILITY_ONLINE
`,
  howToSteps: [
    {
      name: 'Start at 14:10, Earn 16:8',
      text: 'Begin by delaying breakfast and not snacking after dinner (a 14-hour fast). Extend to 16 hours once it feels effortless.',
      protocolId: 'fasting-start-14-10',
    },
    {
      name: 'Protect the Fast with Zero-Calorie Inputs',
      text: 'Stick to water, black coffee and plain tea during the fast. Anything with calories raises insulin and ends the fasted state.',
      protocolId: 'fasting-zero-calorie',
    },
    {
      name: 'Front-Load Protein in the Window',
      text: 'When the eating window opens, prioritise protein and hit your daily target across 2–3 meals to protect muscle.',
      protocolId: 'fasting-front-load-protein',
    },
  ],
}

export default [article]
