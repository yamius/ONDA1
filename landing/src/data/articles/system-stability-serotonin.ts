import type { Article } from './types'

/**
 * Serotonin investigation. Where serotonin is made (~90-95% by gut
 * enterochromaffin cells; Gershon & Tack 2007) and why gut serotonin does not
 * reach the brain (it does not cross the blood-brain barrier; brain serotonin
 * comes from raphe neurons); microbes shape gut serotonin in mice (Yano 2015);
 * gut-brain signalling is real but mostly animal evidence (Cryan 2019).
 * What serotonin does: emotional processing (Cowen & Browning 2015), social
 * decisions (Crockett 2008 tryptophan depletion), sleep via melatonin.
 * Depression: low-serotonin theory not supported (Moncrieff 2022) but
 * antidepressants work (Cipriani 2018) + never stop them alone.
 * Levers with evidence: daylight (Lambert 2002 brain serotonin turnover vs
 * sunlight; Golden 2005 light therapy), exercise (Noetel 2024); food effect
 * real in rats (Fernstrom & Wurtman 1971) but small in people; tryptophan /
 * 5-HTP supplements weak evidence (Shaw 2002) + serotonin syndrome risk
 * (Boyer & Shannon 2005). Posture: power-posing hormone effect did not
 * replicate (Ranehill 2015).
 * Removed from the old version: "serotonin = sense of social status",
 * "posture patch triggers serotonin release", "15-20 min of direct sunlight
 * in the eyes without glasses" (unsafe wording), "the gut is the brain's
 * serotonin server", "serotonin is dopamine's antagonist", "turkey/cheese
 * tryptophan protocol", scarcity-mode / write-error metaphors.
 * Honest firewall: ONDA does not measure serotonin, neurotransmitters or mood.
 */
const article: Article = {
  slug: 'system-stability-serotonin',
  title: 'What Does Serotonin Actually Do? The Gut, Sunlight and Mood Myths',
  subtitle:
    'Most of your serotonin is made in the gut — but it never reaches your brain. What serotonin really does, why "low serotonin" does not explain depression, and what actually helps.',
  seoTitle: 'What Does Serotonin Do? Gut, Light and Mood Facts | ONDA Life',
  description:
    'Serotonin helps regulate mood, sleep, appetite and the gut. Gut serotonin does not reach the brain. What the evidence shows about light, food, exercise and pills.',
  category: 'Biological Software',
  relatedSlugs: [
    'serotonin',
    'neurotransmitters',
    'melatonin',
    'microbiome',
    'enteric-nervous-system',
    'dopamine',
  ],
  introStyle: 'emerald',
  image: '/images/articles/system-stability-serotonin.webp',
  imageAlt:
    'Illustration linking the gut and the brain, representing where serotonin is made in the body and in the brain.',
  imageTitle: 'Serotonin in the gut and in the brain',
  imageCaption:
    'The gut makes most of the body’s serotonin, but the brain makes its own: serotonin cannot cross the blood-brain barrier.',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Is depression really a "chemical imbalance"? What hormones and brain chemicals can and cannot explain about mood.',
    link: '/articles/molecular-psychology-hormonal-firmware',
    linkText: 'Do Hormones Control Your Mood? →',
  },
  howToSteps: [
    {
      name: 'Get daylight early in the day',
      text: 'Spend 20 to 30 minutes outdoors in the morning or around midday, for example on a walk. Do not look directly at the sun. On dark winter days, ask a doctor whether a light therapy lamp could help.',
      protocolId: 'serotonin-daylight',
    },
    {
      name: 'Move most days',
      text: 'Walking, jogging, yoga or strength training on most days has good evidence for improving mood, and is safer than supplements that target serotonin.',
      protocolId: 'serotonin-exercise',
    },
    {
      name: 'Check before taking serotonin supplements',
      text: 'Do not combine tryptophan, 5-HTP or St John’s wort with antidepressants, migraine triptans or other serotonin-acting medicines without asking a doctor or pharmacist.',
      protocolId: 'serotonin-supplement-check',
    },
  ],
  content: `
## [ CASE FILE: THE CONFIDENCE CHEMICAL ]

> "A popular article says serotonin is the chemical of social status. Stand up straight and your brain releases it. Stare at the morning sun without glasses to make more. And since 90% of it is made in your gut, your gut is the 'server' that decides your mood.

> Part of that is true: most serotonin really is made in the gut. But does gut serotonin reach the brain? Does posture change it? And is low mood really a shortage of serotonin?"

---

## Section 1: What does serotonin actually do?

Serotonin (5-HT) is a chemical messenger with many jobs at once — in the brain and far outside it.

- **In the brain,** serotonin neurons start in a small group of cells in the brainstem (the raphe nuclei) and send branches almost everywhere. They help regulate mood, anxiety, sleep and wake cycles, appetite, pain and impulse control. Serotonin also shapes how we process emotional information — for example, how strongly we notice negative things (Cowen & Browning 2015).
- **In social life,** serotonin affects decisions rather than "status". When volunteers temporarily lowered their serotonin with a special drink, they rejected unfair offers in a money game more often (Crockett 2008).
- **In sleep,** serotonin is the raw material the pineal gland uses to make [melatonin](/glossary/melatonin).
- **In the body,** serotonin controls gut movement, is carried by blood platelets and helps blood clot.

It is not a simple "happiness chemical". It works together with dopamine, noradrenaline and many other signals — it is not dopamine's opposite. For more on [what dopamine really does](/articles/dopamine-architecture-mastering-desire), see our separate investigation.

---

## Section 2: Is 90% of serotonin made in the gut — and does it affect your brain?

Yes, most of it is made in the gut — but that serotonin does not reach your brain.

About 90 to 95% of the body's serotonin is made by special cells in the gut lining called enterochromaffin cells. There it controls how the gut moves and secretes, and much of it is taken up by blood platelets (Gershon & Tack 2007).

Serotonin **cannot cross the blood-brain barrier**. The brain makes its own serotonin from the amino acid tryptophan. So "the gut makes your mood serotonin" is a myth.

The gut and brain do still talk to each other — through the [vagus nerve](/glossary/vagus-nerve), the immune system and substances made by gut bacteria. In mice, gut bacteria strongly influence how much serotonin the gut makes (Yano 2015). But most evidence linking the [microbiome](/glossary/microbiome) to mood comes from animals, and human studies are still early (Cryan 2019). See [the gut-brain axis](/articles/gut-brain-axis-data-link) for more.

Also note: a blood or urine serotonin test mostly shows gut and platelet serotonin, not what is happening in your brain.

---

## Section 3: Is low serotonin the cause of depression?

Probably not in a simple way. A 2022 umbrella review found no consistent evidence that depression is caused by low serotonin levels or activity (Moncrieff 2022). The review was debated, but most experts agree that depression has many causes: genes, stress, sleep, illness, inflammation, life events and thinking patterns.

This does **not** mean antidepressants don't work. A large network meta-analysis of 522 trials found that all 21 antidepressants studied worked better than placebo for major depression, although average effects were modest (Cipriani 2018). One explanation is that SSRIs gradually change how the brain processes emotional information, rather than just "topping up" a missing chemical (Cowen & Browning 2015).

**Never stop or reduce an antidepressant on your own.** Stopping suddenly can cause withdrawal symptoms or relapse. Plan any change with your doctor. For the wider picture, see [do hormones control your mood?](/articles/molecular-psychology-hormonal-firmware)

---

## Section 4: Does sunlight raise serotonin?

It seems to. In a study of 101 healthy men, researchers sampled blood leaving the brain and found that brain serotonin turnover was lowest in winter and rose with the amount of bright sunlight on the day of testing (Lambert 2002).

Bright light is also a real treatment. A meta-analysis found that light therapy reduces symptoms of seasonal depression, with some benefit for non-seasonal depression too (Golden 2005). Light also sets your body clock, which helps sleep.

**How to do it safely:** spend time outdoors in daylight, especially in the morning. **Never look directly at the sun** — it can damage your eyes. Ordinary daylight around you is enough. If you consider a light therapy lamp, ask a doctor first, especially if you have bipolar disorder or an eye condition.

---

## Section 5: Can food, tryptophan or 5-HTP boost serotonin?

Only a little through food, and supplements come with caveats.

- **Carbohydrates.** In rats, a carbohydrate meal raised brain serotonin, because insulin helps more tryptophan reach the brain (Fernstrom & Wurtman 1971). In people, the effect is small, and even a little protein in the meal cancels it out.
- **Turkey and other "tryptophan foods".** Turkey contains no more tryptophan than most other protein foods. Feeling sleepy after a big meal comes mostly from the size of the meal.
- **Tryptophan and 5-HTP supplements.** A Cochrane review found only a few small trials of poor quality — not enough to know whether they help depression (Shaw 2002).
- **Safety.** Taking these supplements — or St John's wort — together with antidepressants, triptans or some painkillers can cause **serotonin syndrome**: agitation, sweating, shaking, fever and a fast heartbeat. It can be dangerous (Boyer & Shannon 2005). Always check with a doctor or pharmacist first.

A varied diet with enough fibre is good for gut and general health — but it is not a way to "load" your brain with serotonin.

---

## Section 6: Does good posture release serotonin?

There is no evidence for that. The idea comes from "power posing" research. A larger replication with 200 people found that power poses did not change testosterone or cortisol levels, nor people's behaviour — only a small effect on how powerful they said they felt (Ranehill 2015). No study has shown that posture releases serotonin.

Sitting up straight can still be good for breathing and comfort. It just is not a serotonin switch.

**Myth-check:**

- *"Serotonin is the chemical of social status."* — Based on animal studies. In people, serotonin affects mood and social decisions, not a fixed "status level".
- *"Your gut is your brain's serotonin factory."* — The gut makes most of the body's serotonin, but it cannot reach the brain.
- *"Look at the sun without glasses for 15 minutes."* — Unsafe. Daylight around you is enough; never look directly at the sun.
- *"Eat turkey and cheese to make serotonin."* — The food effect is small in people.

---

## Section 7: What actually helps mood related to serotonin?

The best-supported habits help mood in many ways, including through serotonin:

- **Daylight,** especially in the morning (Section 4).
- **Exercise.** A network meta-analysis of 218 trials with 14,170 participants found exercise to be an effective treatment for depression; walking or jogging, yoga and strength training worked best (Noetel 2024).
- **Regular sleep.** Serotonin and melatonin are linked, and poor sleep makes low mood more likely.
- **Treatment when needed.** Talking therapy and, for some people, antidepressants are proven treatments for depression.

---

## Section 8: Can ONDA measure your serotonin?

No. ONDA does not measure serotonin, other brain chemicals or mood — and no app or wearable can.

With an Apple Watch, ONDA reads [heart rate variability](/science/concepts/heart-rate-variability) (HRV), [resting heart rate](/science/measurements/resting-heart-rate) and sleep data from Apple Health. These reflect general stress and recovery, which often change along with mood, but they are not a serotonin reading. ONDA also offers guided breathing practices that can help you calm down in the moment.

---

## Section 9: When should you see a doctor?

See a doctor if low mood, anxiety or loss of interest lasts more than two weeks or gets in the way of daily life; if your mood drops every winter; or before starting tryptophan, 5-HTP or St John's wort while taking any medicine.

**Get urgent help** if you have signs of serotonin syndrome after starting or combining medicines: high fever, strong shaking or muscle stiffness, confusion or a very fast heartbeat.

If you have thoughts of harming yourself, contact emergency services or a crisis line right away (in the US, call or text 988).
`,
}

export default [article]
