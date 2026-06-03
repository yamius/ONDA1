import type { Article } from './types'

/**
 * Zone 2 Training — companion article for /tools/zone-2.
 * Targets "zone 2 training / zone 2 heart rate" intent in ONDA house style.
 */
const article: Article = {
  slug: 'zone-2-training-aerobic-base',
  title: 'Zone 2 Training: Installing Your Aerobic Base Layer',
  seoTitle: 'Zone 2 Training: Build Your Aerobic Base | ONDA Life',
  description:
    'Zone 2 training builds the mitochondrial base layer that powers everything else. Learn what Zone 2 heart rate is, why it works, and how to program it.',
  category: 'ONDA Protocol',
  relatedSlugs: ['mitochondria', 'metabolic-flexibility', 'atp', 'heart-rate-variability', 'homeostasis'],
  introStyle: 'emerald',
  image: '/images/tools/zone-2.png',
  imageAlt:
    'Zone 2 training aerobic base: conversational-pace cardio that builds mitochondrial density and fat oxidation for endurance and longevity.',
  imageTitle: '[BASE_LAYER_INSTALL]: Building mitochondrial density at the conversational-pace threshold.',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Find your exact Zone 2 heart-rate band and all five zones from your age.',
    link: '/tools/zone-2',
    linkText: 'Zone 2 Heart Rate Calculator →',
  },
  content: `
## [ INSTALLING THE BASE LAYER ]

> "Most people train like they're trying to win every session. They run their easy days too hard and their hard days too soft, landing in a grey 'no man's land' that builds fatigue without building capacity. In the ONDA Biocomputer model, this is a thrashing CPU — lots of heat, little throughput.

> Zone 2 is the fix. It is the low-intensity aerobic band where your system runs almost entirely on fat, builds new mitochondria, and expands the hardware that every other system draws on. It is not glamorous. It is the base layer the whole stack compiles on top of."

---

## Section 1: What Zone 2 actually is

Zone 2 is the intensity just below your **first lactate threshold** — the point where blood lactate starts to climb above resting levels (roughly 2 mmol/L). In practice it sits around **60–70% of your maximum heart rate**, and it has one unmistakable signature: you can hold a full conversation, but you'd rather not. Breathe through your nose, talk in complete sentences — if you're gasping, you've drifted into Zone 3.

The exact band is personal. Pull your numbers — and all five training zones — from the [Zone 2 Heart Rate Calculator](/tools/zone-2), which uses the accurate Tanaka max-HR formula (and Karvonen reserve if you enter a resting HR).

---

## Section 2: Why the base layer matters

At this intensity your cells preferentially burn fat, and the training stimulus targets the slow-twitch fibres and their power plants. Over weeks, three things upgrade:

- **Mitochondrial density** — more [mitochondria](/glossary/mitochondria) per cell means more [ATP](/glossary/atp) capacity and a higher ceiling for everything aerobic.
- **Fat oxidation** — you get better at running on fat, sparing glycogen. This is the core of [metabolic flexibility](/glossary/metabolic-flexibility).
- **Capillary density & stroke volume** — more delivery pipes and a stronger pump, which lowers resting heart rate and tends to lift [heart-rate variability](/glossary/heart-rate-variability) over time.

This is the layer elite endurance athletes spend ~80% of their volume building. It also happens to be longevity infrastructure: aerobic base is tightly linked to all-cause mortality.

---

## Section 3: Zone 2 Firmware Protocols

### PROTOCOL 1: The Conversation Test

> **The Hack:** Set your pace by speech, not ego. If you can talk in full sentences but singing would be a stretch, you're in Zone 2. If you've gone quiet, slow down.

**The Science:** Heart-rate monitors lag and drift; your ventilation responds to lactate in real time. The talk test is a free, instant proxy for the first lactate threshold.

### PROTOCOL 2: Accumulate Volume, Not Intensity

> **The Hack:** Target 150–180+ minutes per week in Zone 2, in blocks of 30–60 minutes. Most weeks, keep it almost boringly easy.

**The Science:** Mitochondrial adaptations are driven by time-at-intensity, not suffering. A polarized split — lots of easy, a little very hard — outperforms chronic medium effort (Seiler's endurance research).

### PROTOCOL 3: Guard the Ceiling with Intervals

> **The Hack:** Once the base is in, add 1–2 short high-intensity sessions per week on top — not instead.

**The Logic:** Zone 2 widens the base; brief VO₂max work raises the roof. You need both, but the base comes first. See the [VO₂max guide](/articles/vo2max-increase-aerobic-engine) for the high-end protocol.

> [ HARDWARE_VALIDATION ]
> VALIDATION_DEVICE: Chest-strap HR monitor + morning resting HR
> METRIC: Resting HR trend ↓ / HRV trend ↑ over 8–12 weeks
> STATUS: AEROBIC_BASE_COMPILING
`,
  howToSteps: [
    {
      name: 'The Conversation Test',
      text: 'Set pace by speech: you can talk in full sentences but not comfortably sing. If you go quiet, slow down — you have drifted out of Zone 2.',
      protocolId: 'zone2-conversation-test',
    },
    {
      name: 'Accumulate Volume, Not Intensity',
      text: 'Target 150–180+ minutes per week in Zone 2, in 30–60 minute blocks, kept almost boringly easy.',
      protocolId: 'zone2-accumulate-volume',
    },
    {
      name: 'Guard the Ceiling with Intervals',
      text: 'Once the base is established, add 1–2 short high-intensity sessions per week on top of Zone 2, not instead of it.',
      protocolId: 'zone2-add-intervals',
    },
  ],
}

export default [article]
