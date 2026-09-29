import type { Article } from './types'

/**
 * Glymphatic investigation — what the brain's fluid-clearance system is, why
 * "sleep cleans your brain" is a promising but contested idea, what is shown
 * in mice vs. humans, sleep position, the amyloid / Alzheimer's link
 * (association, not proven cause), and ordinary levers (sleep duration and
 * regularity, alcohol, sleep apnea). Grounded in verified literature (Iliff
 * 2012; Xie 2013; Lee 2015; Shokri-Kojori 2018; Fultz 2019; Eide 2021;
 * Miao 2024). Removed from the old versions: "+60% space" presented as a human
 * fact, "only during deep sleep", "sleep on your right side", "hot bath
 * activates the pump", "insulin blocks a glymphatic regulator", "90% of
 * clearance in deep sleep". Merged 'glymphatic-flush-clearing-neural-cache'
 * (301). Honest firewall: ONDA does not measure brain clearance, sleep stages
 * or deep sleep — with Apple Watch, Life Rhythm shows sleep duration and
 * regularity only.
 */
const article: Article = {
  slug: 'nightly-flush-glymphatic-neural-cache',
  title: "Does Sleep Really Clean Your Brain? What the Glymphatic Evidence Shows — and What It Doesn't",
  subtitle:
    'The brain has its own fluid-based waste-clearance route, and sleep seems to matter for it. How much is proven in people, where the science still disagrees, and what you can reasonably do tonight.',
  seoTitle: 'Glymphatic System: Does Sleep Clean Your Brain? | ONDA Life',
  description:
    'Sleep likely helps the brain clear waste, but most evidence is from mice and a 2024 study disputes it. What is proven in humans, sleep position, and what helps.',
  category: 'OS States',
  relatedSlugs: [
    'sleep',
    'deep-sleep',
    'brain-health',
    'glymphatic-system',
    'cerebrospinal-fluid',
    'neurodegeneration',
    'circadian-rhythm',
    'recovery',
  ],
  introStyle: 'slate',
  image: '/images/articles/nightly-flush-glymphatic-neural-cache.webp',
  imageAlt:
    'Illustration of a brain with a stream of cerebrospinal fluid flowing around it, representing the glymphatic system that helps clear waste from brain tissue.',
  imageTitle: 'The glymphatic system: fluid moving through the brain',
  imageCaption:
    'Cerebrospinal fluid flows along channels around blood vessels and helps carry waste out of brain tissue. How strongly sleep boosts this in humans is still being worked out.',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Sleep length is the most practical lever here. See how much sleep adults actually need.',
    link: '/articles/how-much-sleep-do-you-need',
    linkText: 'How Much Sleep Do You Need?',
  },
  howToSteps: [
    {
      name: 'Protect sleep duration and regularity',
      text: 'Aim for 7–9 hours at roughly the same times each night. In human studies, a single night without sleep slowed the clearance of a tracer from the brain and raised amyloid on brain scans.',
      protocolId: 'glymphatic-sleep-duration',
    },
    {
      name: 'Keep alcohol away from bedtime',
      text: 'Alcohol close to bedtime fragments sleep in the second half of the night. Fewer drinks, earlier in the evening, protect the sleep that clearance depends on.',
      protocolId: 'glymphatic-limit-evening-alcohol',
    },
    {
      name: 'Get snoring and breathing pauses checked',
      text: 'Loud snoring, gasping or choking at night and heavy daytime sleepiness can point to sleep apnea, which breaks up sleep all night. It is common and treatable, so raise it with a doctor.',
      protocolId: 'glymphatic-check-sleep-apnea',
    },
  ],
  content: `
## [ CASE FILE: THE BRAIN THAT WASHES ITSELF AT NIGHT ]

> "You have probably seen the headline: while you sleep, your brain rinses itself with fluid and washes away the proteins linked to Alzheimer's. Miss sleep, the story goes, and the waste piles up. Some versions add precise rules: only deep sleep counts, sleep on your right side, take a hot bath 90 minutes before bed.

> The core idea comes from real, influential research. But much of it was done in mice, some of the popular rules were never tested at all, and in 2024 a respected lab reported the opposite result. So what do we actually know about sleep and the brain's cleanup system — and what is still an open question?"

---

## Section 1: What is the glymphatic system?

It is a proposed route by which the fluid that bathes the brain, cerebrospinal fluid (CSF), moves through brain tissue and helps carry waste away. The rest of the body clears waste through lymph vessels, but brain tissue itself has almost none, so researchers long wondered how it cleans up.

In 2012, a team imaging live mice showed that CSF flows into the brain along the spaces surrounding arteries, mixes with the fluid between brain cells, and drains out along the spaces around veins (Iliff 2012). The flow depended partly on a water channel called aquaporin-4 in support cells known as astrocytes. Mice lacking it cleared injected tracers about 70% less well, and also cleared less amyloid beta, a protein that builds up in Alzheimer's disease. Because the system relies on these glial cells and works like a lymphatic system, it was named "glymphatic."

It is a real and important line of research. Just keep in mind that the original mapping was done in mice.

---

## Section 2: Does it only work during deep sleep?

No. That claim goes beyond the evidence. Even the studies that favor sleep describe clearance as faster during sleep, not switched off while awake.

The famous sleep result is a 2013 mouse study. Natural sleep or anesthesia was linked to a 60% increase in the space between brain cells, more exchange between CSF and brain fluid, and faster clearance of amyloid beta (Xie 2013). That is the source of the "space expands by 60%" figure you often see. It was measured in mice, not people.

There is a genuine connection to the deeper stages of sleep in humans, though. A 2019 brain-imaging study of people sleeping in a scanner found that during non-REM sleep, slow waves of brain activity were followed by changes in blood flow, which in turn were coupled to large, rhythmic pulses of CSF (Fultz 2019). It shows that fluid moves in waves in the sleeping human brain, tied to slow-wave activity. It does not measure waste removal, and it does not show that clearance happens *only* in deep sleep. Claims like "90% of clearance occurs in deep sleep" have no source we could find.

---

## Section 3: What is proven in humans — and what did the 2024 study find?

In humans, the evidence is small but meaningful. In mice, it is now openly contested.

**Human studies:**

- **A tracer study.** Researchers in Oslo injected an MRI contrast agent into the spinal fluid and tracked it in the brain for up to 48 hours. Seven people who stayed awake for one night cleared the tracer more slowly from most brain regions than 17 matched people who slept, and a following night of sleep did not make up the difference (Eide 2021). It is a small study, and a medical injection is not an everyday measurement, but it is direct human evidence that sleep loss slows clearance.
- **An amyloid scan study.** In 20 healthy adults, one night of sleep deprivation raised amyloid beta on PET brain scans in the right hippocampus and thalamus compared with a rested night (Shokri-Kojori 2018). This shows a short-term change after sleep loss, not a lasting buildup.

**The counter-finding:** In 2024, a group at Imperial College London measured how fluorescent dyes moved through the brains of male mice and reported that clearance was markedly *reduced*, not increased, during sleep and anesthesia (Miao 2024). It is a single study in mice, and the question is not settled.

The honest summary: sleep loss clearly affects how the brain handles waste-related proteins and tracers in people, but the exact mechanism, and whether sleep speeds the fluid flow itself, is not settled.

---

## Section 4: Does sleep position matter?

Possibly, but only rodent data exist, and they do not support "sleep on your right side."

A 2015 study used MRI and tracers in anesthetized rats placed on their back, stomach or side (Lee 2015). Transport was most efficient on the side in the MRI analysis, and tracer clearance, including amyloid, was better on the side and back than on the stomach, where the head was most upright. The authors themselves noted the result still needed testing in humans.

The study did not compare left with right. Figures like "25–30% better clearance on your side" and advice to raise the head of the bed for better drainage do not come from it. If you already sleep on your side, fine. There is no human evidence that changing position will improve your brain's cleanup.

---

## Section 5: Is it linked to Alzheimer's disease?

There is a link, but it is an association, not a proven cause, and it runs in both directions.

Amyloid beta, the protein that forms plaques in Alzheimer's disease, is cleared in part by the fluid route described above (Iliff 2012). One night of sleep loss can raise it temporarily (Shokri-Kojori 2018). Poor sleep is common in people who later develop dementia, but early brain changes can themselves disturb sleep, so it is hard to know which comes first.

What has **not** been shown: that improving sleep prevents Alzheimer's, that a better "flush" lowers your personal risk, or that any sleep routine or gadget boosts glymphatic clearance. Good sleep is worth protecting for many reasons. Promising dementia prevention through a sleep trick overstates the science.

---

## Section 6: What can you actually do tonight — and what can you see yourself?

The useful steps are the same ones that help sleep in general. None of the popular glymphatic "hacks" has been tested for brain clearance.

- **Get enough sleep, at regular times.** This is the lever the human studies point to: they all looked at losing sleep, and sleep loss made things worse.
- **Go easy on alcohol near bedtime.** It helps you fall asleep but breaks up sleep later in the night.
- **Take snoring and breathing pauses seriously.** Sleep apnea fragments sleep night after night and is treatable.
- **Keep the bedroom cool, dark and quiet** if that helps you sleep. That is a sleep-comfort tip, not a proven way to switch on brain cleaning.

Several claims from older versions of this article are not supported. A hot bath 90 minutes before bed may help some people fall asleep, but nothing shows it "activates the glymphatic pump." Likewise, we found no evidence that insulin blocks growth hormone as a "key glymphatic regulator."

What you can track: ONDA does **not** measure brain clearance, sleep stages or deep sleep. If you wear an Apple Watch, ONDA's Life Rhythm view shows how long you sleep and how regular your bedtimes and wake times are. That covers the two things the research most clearly supports protecting.

---

## Section 7: When should you see a doctor?

See a doctor if your sleep or your memory is changing in ways that worry you. In particular:

- Loud, regular snoring, gasping or choking during sleep, or pauses in breathing someone else has noticed.
- Heavy daytime sleepiness, such as nodding off while reading, in meetings or while driving.
- Memory or thinking problems that are new, getting worse, or noticed by people close to you.
- Long-term insomnia that affects your days. Cognitive behavioral therapy for insomnia (CBT-I) is an effective first-line treatment.

Sleep does seem to matter for how the brain handles its waste. The details are still being argued over in the lab. Getting enough regular sleep tonight doesn't depend on who wins that argument.
`,
}

export default [article]
