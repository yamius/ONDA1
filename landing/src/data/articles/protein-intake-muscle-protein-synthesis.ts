import type { Article } from './types'

/**
 * Protein intake — companion article for /tools/protein.
 * Targets "how much protein per day / protein for muscle" intent, ONDA voice.
 */
const article: Article = {
  slug: 'protein-intake-muscle-protein-synthesis',
  title: 'Protein: Provisioning the Build Queue',
  seoTitle: 'How Much Protein Per Day? The Real Number | ONDA Life',
  description:
    'How much protein do you really need? Learn the evidence-based target in g/kg, the per-meal leucine threshold, and why distribution beats one big hit.',
  category: 'ONDA Protocol',
  relatedSlugs: ['metabolism', 'metabolic-flexibility', 'muscle-metabolic-marker', 'glp1-biology-muscle-preservation', 'insulin-sensitivity'],
  introStyle: 'rose',
  image: '/images/tools/protein.png',
  imageAlt:
    'Protein intake and muscle protein synthesis: the daily g/kg target, the per-meal leucine threshold, and why protein distribution matters.',
  imageTitle: '[BUILD_QUEUE]: Provisioning amino-acid substrate for muscle protein synthesis.',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Get your exact daily protein target in grams from your bodyweight and goal, with a per-meal split.',
    link: '/tools/protein',
    linkText: 'Protein Intake Calculator →',
  },
  content: `
## [ PROVISIONING THE BUILD QUEUE ]

> "Protein is the only macronutrient your body can't improvise. Carbs and fat are interchangeable fuel; protein is structural substrate — the raw material for muscle, enzymes, and repair. In the ONDA Biocomputer model, it's the build queue: under-provision it and the system silently deprioritises maintenance, cannibalising muscle to cover the gap.

> The internet has turned this into noise — 'more is always better', random shake counts, fear of 'too much'. The actual number is well-established. Let's set it correctly."

---

## Section 1: The real target

The RDA of 0.8 g/kg is a floor — the minimum to *avoid deficiency* in a sedentary person, not the level for performance or body composition. The evidence-based range for active people, from the ISSN and ACSM position stands, is **1.4–2.0 g/kg/day**. A large meta-analysis (Morton 2018) put the plateau for maximising muscle gain at about **1.6 g/kg**; in a calorie deficit, pushing to ~2.0–2.4 g/kg better protects lean mass.

Run your number against your bodyweight and goal in the [Protein Intake Calculator](/tools/protein) — it also splits the target across meals.

---

## Section 2: Distribution beats the single hit

Total daily protein matters most, but *how you spread it* matters too. Muscle protein synthesis is triggered when a meal crosses a **leucine threshold** — roughly **0.4 g of protein per kg of bodyweight per meal**. One giant dinner can overshoot what a single session of synthesis can use; 3–4 evenly spaced feedings keep the build queue running all day.

This becomes critical when you compress eating (see [intermittent fasting](/articles/intermittent-fasting-metabolic-switch)) or are protecting muscle during fat loss or on [GLP-1 medications](/articles/glp1-biology-muscle-preservation).

---

## Section 3: Protein Firmware Protocols

### PROTOCOL 1: Anchor Every Meal With Protein

> **The Hack:** Build each meal around a palm-to-two-palms protein source first, then add carbs and fat.

**The Science:** Hitting the ~0.4 g/kg per-meal leucine threshold 3–4 times reliably maximises daily synthesis — more effective than the same total in one or two meals.

### PROTOCOL 2: Target by Bodyweight, Not Guesswork

> **The Hack:** Set 1.6 g/kg as a default for building or maintaining muscle; 2.0–2.4 g/kg when cutting.

**The Science:** These are the ranges the position stands and meta-analyses converge on. Below them you leave gains on the table; far above them adds cost without extra benefit for most people.

### PROTOCOL 3: Protect Protein in a Deficit

> **The Hack:** When losing weight, raise protein and keep training hard.

**The Logic:** A deficit signals the body to break down tissue for energy. High protein plus a resistance stimulus tells it to keep the muscle and burn fat instead.

> [ HARDWARE_VALIDATION ]
> VALIDATION_DEVICE: Food log + strength/measurement trend
> METRIC: Daily protein ≥ target on most days; strength maintained in a deficit
> STATUS: BUILD_QUEUE_PROVISIONED
`,
  howToSteps: [
    {
      name: 'Anchor Every Meal With Protein',
      text: 'Build each meal around a protein source first (a palm to two palms), then add carbs and fat, aiming for ~0.4 g/kg per meal.',
      protocolId: 'protein-anchor-meals',
    },
    {
      name: 'Target by Bodyweight, Not Guesswork',
      text: 'Use 1.6 g/kg/day as a default for building or maintaining muscle; raise to 2.0–2.4 g/kg when in a calorie deficit.',
      protocolId: 'protein-target-bodyweight',
    },
    {
      name: 'Protect Protein in a Deficit',
      text: 'When losing weight, raise protein intake and keep resistance training hard to preserve muscle and lose fat instead.',
      protocolId: 'protein-protect-deficit',
    },
  ],
}

export default [article]
