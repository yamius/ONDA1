import type { Article } from './types'

/**
 * Affect labeling / journaling → lowers arousal; maps directly to ONDA's Diary feature (text/voice).
 * The one ONDA function with no content around it. Grounded in real landmarks: Lieberman et al. 2007
 * "Putting Feelings Into Words" (affect labeling dampens amygdala); Pennebaker expressive-writing line.
 * Framed honestly — reduces arousal / downregulates threat response; NOT a therapy. Firewall intact.
 */
const article: Article = {
  slug: 'name-it-to-tame-it-affect-labeling',
  title: 'Name It to Tame It: Why Writing a Feeling Down Turns the Volume Down',
  seoTitle: 'Affect Labeling: Name a Feeling to Calm It | ONDA Life',
  description:
    'Putting a feeling into words measurably lowers its intensity — a phenomenon called affect labeling. Why naming what you feel downregulates the threat response, and how a two-line diary turns it into a daily practice.',
  category: 'OS States',
  relatedSlugs: ['anxiety-panic-breathing-hrv', 'how-to-lower-cortisol', 'chronic-stress-nervous-system-never-off', 'vagus-nerve', 'coherent-breathing-guide'],
  introStyle: 'purple',
  image: '/images/articles/name-it-to-tame-it-affect-labeling.webp',
  imageAlt:
    "Glowing brain with a label clamping a dampened amygdala and an engaged prefrontal cortex — affect labeling lowering emotional arousal.",
  imageTitle: "Affect labeling — naming a feeling dampens the amygdala",
  imageCaption:
    "Affect labeling — how putting a feeling into words dampens the amygdala and lowers its intensity, and how a two-line diary makes it a daily practice.",
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'The breath calms the body. Naming the feeling calms the story the body is reacting to. Use both.',
    link: '/measurements',
    linkText: 'What ONDA measures →',
  },
  content: `
## [ CASE FILE: THE WORD THAT LOWERS THE VOLUME ]

> "A feeling with no name is loud. It fills the whole room, formless and urgent. Then you write one sentence — 'I'm anxious about tomorrow' — and something odd happens. The feeling doesn't vanish, but the volume drops a notch. It has edges now. It's a thing you're looking at, not a thing you're drowning in.

> This isn't a metaphor. It's a measurable effect with a name of its own: **affect labeling.**"

---

## Section 1: Naming a feeling changes the brain that's feeling it

In a landmark neuroimaging study — Lieberman and colleagues, *"Putting Feelings Into Words"* (2007) — researchers found that the simple act of labeling an emotion **dampened activity in the amygdala**, the brain's fast threat detector, while engaging the prefrontal regions that regulate it. Putting the feeling into words literally shifted the processing from raw alarm toward deliberate regulation.

The folk version — *name it to tame it* — turns out to be neurologically accurate. Language is a lever on emotion. When you name what you feel, you hand the reactive part of your brain over to the part that can actually manage it.

---

## Section 2: Why an unnamed feeling stays loud

Left unlabeled, an emotion runs as pure signal — arousal without a handle. It keeps the threat system engaged, drives rumination (the mind circling the same formless dread), and feeds the same [sympathetic](/glossary/sympathetic-nervous-system) activation that shows up in a fast pulse and shallow breath. The feeling and the body loop, each amplifying the other, with no exit because there's nothing to grab onto.

Naming is the handle. It doesn't deny the feeling — it makes it *addressable*. And addressable feelings settle in a way formless ones never do.

---

## Section 3: Writing it down goes further than thinking it

Affect labeling works in your head; it works better on the page. There's a long research line — most associated with James Pennebaker's **expressive writing** studies — showing that writing about emotional experiences, even for a few minutes over a few days, is associated with measurable improvements in stress and wellbeing. Writing forces the vague into the specific: it demands a word, a subject, a shape. That extra structure is part of the mechanism, not a side effect.

It also externalizes the loop. A worry circling in your head has no end; a worry written on a page is finished — you can close it, and come back to it, instead of re-running it.

---

## Section 4: The diary as a nervous-system tool

This is exactly why ONDA includes a **diary** — text or voice — sitting right next to the physiological signals. The pairing is the point: your breath practice calms the *body*, and naming the feeling calms the *story* the body is reacting to. One works bottom-up, the other top-down, and they meet in the middle.

The diary is local-first and private — it's never logged to analytics — so the page is genuinely yours to be honest on, which is what makes the labeling work. Over time it also becomes context: a place where a stretch of [drift in your baseline](/articles/your-baseline-knows-first) can sit alongside what was actually going on that week. Numbers tell you *that* something shifted; a two-line note tells you *why*.

The firewall, plainly: journaling and affect labeling are **self-regulation practices, not therapy or treatment**. They sit alongside professional care for anxiety, depression or trauma — they don't replace it, and ONDA is not a medical device.

---

## Section 5: How to actually do it

You don't need pages. Affect labeling works in a sentence: *what am I feeling, and what is it about.* Do it in the moment a feeling spikes, or as a short nightly note. Be specific — "anxious about the meeting" beats "bad." Pair it with a slow [exhale-led breath](/articles/coherent-breathing-guide) and you're regulating body and story at once. For the acute-spike version of the same toolkit, see [anxiety, panic and the breath](/articles/anxiety-panic-breathing-hrv); for the stress that never switches off, [the nervous system that never clocks out](/articles/chronic-stress-nervous-system-never-off).

> **The Hack:** When a feeling is loud, name it in one specific sentence — out loud or written down. "I'm anxious about tomorrow" recruits the regulating part of your brain and turns the amygdala's volume down. It won't erase the feeling; it'll give it edges, and edges are what let it settle.

> [ SYSTEM_STATUS ]
> EFFECT: labeling an emotion dampens the amygdala (Lieberman 2007)
> UNNAMED: pure arousal, fuels rumination + sympathetic loop
> WRITING: forces the specific, externalizes the loop
> PAIR: name the story + breathe the body — PRACTICE, NOT THERAPY
`,
  howToSteps: [
    {
      name: 'Name the feeling specifically',
      text: 'Put the emotion into one specific sentence — "anxious about the meeting," not "bad." Naming recruits the prefrontal regulators and dampens the amygdala’s threat signal.',
      protocolId: 'affect-name',
    },
    {
      name: 'Write it, don’t just think it',
      text: 'Writing forces the vague into the specific and externalizes the loop — a worry on the page is finished, where a worry in your head keeps circling. A few lines is enough.',
      protocolId: 'affect-write',
    },
    {
      name: 'Pair it with the breath',
      text: 'Naming calms the story top-down; a slow exhale-led breath calms the body bottom-up. Do both together to regulate the feeling and the physiology at once.',
      protocolId: 'affect-pair',
    },
    {
      name: 'Let it become context',
      text: 'A private nightly note turns your numbers into a story: when your baseline drifts, a two-line entry records why. Keep it honest — and for clinical concerns, use it alongside professional care, not instead.',
      protocolId: 'affect-context',
    },
  ],
}

export default [article]
