import type { Article } from './types'

/**
 * THE alpha-waves page. Explainer for "alpha waves" / "alpha brain waves" / "eeg alpha waves" (GSC 2026-10:
 * ~150 impressions/28d at position ~80 — owner OK 2026-11-05). On 2026-11-25 the older investigation
 * 'neural-bridge-alpha-flow-gateway' (calm, creativity, flow) was merged in and 301'd here in every language:
 * the two EN pages competed for the same query (both stuck at position ~60). Kept from it: creativity/insight/
 * flow (Fink & Benedek 2014, Jung-Beeman 2004, Katahira 2018), the cortisol myth check, slow breathing
 * (Zaccaro 2018), binaural beats (Garcia-Argibay 2019 vs Ingendoh 2023), alpha neurofeedback (Yeh 2020),
 * what can be measured without EEG, when to see a doctor, the how-to steps and the header image.
 * Textbook physiology (8–12 Hz, posterior, eyes-closed, blocked by eye opening: Berger 1929, Barry 2007).
 * Honest firewall: ONDA measures the heart (pulse, breathing estimate; HRV and coherence with Apple Watch),
 * not the brain — no EEG claim about the app.
 */
const article: Article = {
  slug: 'alpha-brain-waves',
  title: 'Alpha Brain Waves: What They Are and What They Can (and Cannot) Tell You',
  subtitle:
    'What the 8–12 Hz alpha rhythm is, what it really does in the brain, what research says about meditation, creativity, flow and stress, and how much apps, music and headbands can change it.',
  seoTitle: 'Alpha Brain Waves: What They Are, How to Measure | ONDA Life',
  description:
    'Alpha waves are 8–12 Hz brain rhythms that rise when you close your eyes and relax. What they reflect, their link to meditation, creativity and flow, and what EEG headsets show.',
  category: 'Neural Hardware',
  relatedSlugs: ['meditation-gamma-waves-experience', 'meditation-with-measurable-progress', 'heart-rate-variability'],
  introStyle: 'indigo',
  image: '/images/articles/neural-bridge-alpha-flow-gateway.webp',
  imageAlt:
    'Illustration of a person meditating between two glowing halves of a brain, with a smooth wave pattern passing between them, representing alpha brain rhythms.',
  imageTitle: 'Alpha brain waves, calm and focus',
  imageCaption:
    'Alpha is a rhythm of about 8–12 cycles per second, strongest at the back of the head when the eyes are closed. It is a sign of how the brain directs attention, not a switch for calm or genius.',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Alpha is a brain signal and needs an EEG headset. Your heart gives a calmer, easier daily signal: HRV.',
    link: '/hrv-biofeedback',
    linkText: 'HRV biofeedback →',
  },
  howToSteps: [
    {
      name: 'Close your eyes for a short break',
      text: 'Between tasks, close your eyes for one to two minutes and let your attention settle on your breathing or on sounds around you. Closing the eyes is the most reliable way to increase alpha activity, and a short break away from the screen is useful whether or not you measure anything.',
      protocolId: 'alpha-eyes-closed-break',
    },
    {
      name: 'Breathe slowly for a few minutes',
      text: 'Sit comfortably and breathe slowly through the nose, with a longer out-breath than in-breath, for about five minutes. Slow breathing reliably changes heart rhythm, and some small studies also report more alpha activity. Stop if you feel dizzy.',
      protocolId: 'alpha-slow-breathing',
    },
    {
      name: 'Give hard problems an incubation break',
      text: 'When you are stuck, step away: take a walk, look out of a window or do something undemanding for 10–15 minutes, then come back. Turning attention inward, away from constant input, is when alpha tends to rise during idea generation.',
      protocolId: 'alpha-incubation-break',
    },
  ],
  content: `
## Quick answer

**Alpha waves are rhythmic electrical brain activity at about 8–12 cycles per second (Hz).** They are strongest over the back of the head when you are awake, relaxed and have your eyes closed, and they shrink the moment you open your eyes or focus on something you see. They are not a "calm mode" you switch on: alpha is better understood as the brain quietening the areas it does not need right now.

| Question | Short answer |
|---|---|
| Frequency | About 8–12 Hz |
| Where | Strongest at the back of the head (visual areas) |
| When | Relaxed, awake, eyes closed; drops when the eyes open |
| What it reflects | Active inhibition: the brain turning down areas it does not need |
| Meditation | Often more alpha, but results vary between studies |
| Can a phone or watch measure it? | No. Alpha needs an EEG |

## What alpha waves are

An EEG (electroencephalogram) records tiny voltage changes on the scalp produced by large groups of neurons firing in step. Those changes form rhythms, named by speed: delta (slowest), theta, **alpha (about 8–12 Hz)**, beta and gamma (fastest). These bands are useful labels, but the brain is never "in" just one of them: all are present at once, in different amounts, in different places.

Alpha was the first human brain rhythm ever recorded. The German psychiatrist Hans Berger described it in 1929 ([Berger, 1929](https://doi.org/10.1007/BF01797193)), which is why the drop in alpha when the eyes open is still called the **Berger effect** or "alpha blocking". A modern study comparing eyes-closed and eyes-open rest confirmed that alpha drops across the scalp when the eyes open, while skin conductance, a marker of arousal, goes up ([Barry et al., 2007](https://pubmed.ncbi.nlm.nih.gov/17911042/)).

Three facts are well established:

- **Where:** alpha is largest over the occipital and parietal regions (back of the head), the visual areas.
- **When:** it is strongest in relaxed, eyes-closed wakefulness and falls with eye opening, visual attention and mental effort.
- **Whose:** each person has their own peak alpha frequency. It differs between people and tends to slow with age ([Klimesch, 1999](https://pubmed.ncbi.nlm.nih.gov/10209231/)).

## What alpha actually reflects

For decades alpha was called an "idling" rhythm. The current view is more precise: alpha reflects **active inhibition**. When a brain region is not needed for the task at hand, its alpha rises, which helps route processing to the regions that are needed ([Jensen & Mazaheri, 2010](https://pubmed.ncbi.nlm.nih.gov/21119777/)). Klimesch describes alpha as a way of controlling access to stored information ([Klimesch, 2012](https://pubmed.ncbi.nlm.nih.gov/23141428/)). That is why alpha over the visual cortex rises when you close your eyes, and why it also rises during demanding inner work such as holding items in memory.

So "more alpha" does not simply mean "more relaxed" or "better". It depends on where it is measured, what you are doing and how it is calculated. Researchers use several different alpha measures (absolute power, relative power, peak frequency, change from rest to task), and they do not always agree ([Bazanova & Vernon, 2014](https://pubmed.ncbi.nlm.nih.gov/23701947/)).

**Myth check:**

- *"Alpha is the brain's relaxation state."* Partly true at best. Alpha often rises with relaxed, eyes-closed rest, but also with focused inner work. It is about where attention is directed, not simply about being calm.
- *"Alpha synchronises the two hemispheres and widens your mental bandwidth."* This is a metaphor, not a finding.

## Alpha waves and meditation

Meditation is the most common reason people ask about alpha. A systematic review of 56 EEG studies of mindfulness found that **increased alpha and theta power were the most common finding**, in healthy people and in patient groups, but the studies were small and varied widely in methods, so the authors could not draw firm conclusions about what drives the change ([Lomas, Ivtzan & Fu, 2015](https://pubmed.ncbi.nlm.nih.gov/26441373/)).

The honest summary: meditation often goes along with more alpha, but a high alpha reading is not proof that you meditated "well", and a low one is not proof that you failed.

## Can breathing or closing your eyes raise alpha?

- **Closing your eyes: yes, reliably.** It is the simplest alpha "trick" there is.
- **Slow breathing: some evidence.** A systematic review of slow breathing (fewer than 10 breaths per minute) included only 15 studies. The EEG studies in it reported more alpha and less theta, alongside the better-established rise in [heart rate variability](/science/concepts/heart-rate-variability) ([Zaccaro et al., 2018](https://pubmed.ncbi.nlm.nih.gov/30245619/)). The studies were small, and there is no proven pathway by which a set breathing pace "switches" the brain into alpha within minutes. Breathe slowly because it is calming and good for heart rhythm; treat any alpha change as a possible bonus.

## Are alpha waves linked to creativity and flow?

**Creativity: yes, with caveats.** A review of EEG studies concluded that more alpha during creative idea generation is one of the most consistent findings in creativity research. Alpha rises with the originality of ideas and is higher in more creative people, which the authors read as attention turned inward, away from outside input ([Fink & Benedek, 2014](https://pubmed.ncbi.nlm.nih.gov/23246442/)). That does not mean raising alpha *makes* you creative; it means alpha tends to rise when you generate ideas from the inside.

**Insight.** In a well-known study of "aha" moments, people solving word puzzles showed a sudden burst of fast gamma activity over the right temporal lobe about a third of a second before they reported an insight ([Jung-Beeman et al., 2004](https://pubmed.ncbi.nlm.nih.gov/15094802/)). Claims that alpha is the "carrier" of insight go well beyond what this research shows.

**Flow: mixed.** In one small study (16 people doing mental arithmetic at different difficulty levels), flow was linked to more frontal theta and only *moderate* alpha, not maximum alpha ([Katahira et al., 2018](https://pubmed.ncbi.nlm.nih.gov/29593605/)). The idea that you must "pass through alpha" to enter flow, or that more alpha always means more flow, is not supported.

## Do alpha waves lower stress or cortisol?

There is no good evidence that alpha waves themselves lower cortisol. We found no study showing that raising alpha causes lower cortisol. What is true is simpler: things that tend to go with more alpha (eyes-closed rest, [slow breathing](/science/evidence/slow-breathing), meditation, stepping away from constant input) can also help you feel calmer. Both changes may come from the same activity; one does not drive the other. For stress hormones, the evidence is about sleep, regular routines, exercise and social support; see [how to lower cortisol](/articles/how-to-lower-cortisol).

## Do alpha-wave apps, music and headbands work?

**Binaural beats.** These play two slightly different tones in each ear, so you hear a "beat" at the difference frequency, for example 10 Hz for alpha. A meta-analysis of 22 studies found a medium effect on memory, attention, anxiety and pain ([Garcia-Argibay et al., 2019](https://pubmed.ncbi.nlm.nih.gov/30073406/)). But a later systematic review of whether binaural beats actually shift brain rhythms found the results inconsistent: 5 of 14 studies matched the idea, 8 contradicted it and 1 was mixed ([Ingendoh et al., 2023](https://pubmed.ncbi.nlm.nih.gov/37205669/)). They may help some people feel calmer; the "brain entrainment" explanation is not established.

**Alpha neurofeedback.** Here a device shows you your own EEG and rewards you when alpha rises. People can learn to change their alpha within a session. A meta-analysis of randomised studies in healthy people found a positive effect of alpha neurofeedback on working memory ([Yeh et al., 2020](https://pubmed.ncbi.nlm.nih.gov/33469422/)). This is promising but based on small studies, usually with lab-grade equipment and several sessions. Treat claims that a device will "boost your alpha" for a specific health benefit with caution.

**Consumer EEG headsets.** Devices such as [Muse S Athena](/reviews/muse-s-athena) or [Neurosity Crown](/reviews/neurosity-crown) pick up real brain signals through a few dry electrodes. A validation study showed that the four-channel Muse could record classic event-related brain responses comparable to a research system ([Krigolson et al., 2017](https://pubmed.ncbi.nlm.nih.gov/28344546/)). The limits matter:

- **Few channels, wrong place.** Alpha is largest at the back of the head; many consumer headsets sit on the forehead and behind the ears.
- **Artefacts.** Blinks, jaw clenching and movement create signals far larger than alpha.
- **Proprietary scores.** "Calm" or "focus" numbers are each company's own algorithm, not a validated alpha measure, and they cannot be compared between brands.

Use them as a meditation feedback aid, not as a medical measurement. See our [best EEG headsets](/reviews/compare/best-eeg-headsets-2026) and [Neurosity Crown alternatives](/reviews/compare/neurosity-crown-alternatives).

## What can you measure without an EEG?

Without an EEG, you cannot measure alpha waves. No phone camera, smartwatch or ring can. What you *can* track are body signals that reflect how settled you are:

- **Heart rate** and how it changes during a calm session.
- **[Breathing rate](/science/measurements/respiratory-rate)**: slower, steadier breathing during practice.
- **Heart rate variability (HRV)** trends over weeks, from a watch or ring.

[ONDA](/how-it-works) does **not** measure EEG or brain waves, and it does not "raise alpha". With the phone camera it shows your pulse and an estimate of your breathing rate; with an Apple Watch it adds HRV and a coherence reading. These tell you how your body responds to a practice, not what your brain rhythms are doing.

## When should you see a doctor?

Brain-wave products are not a treatment. See a doctor if you have ongoing anxiety, low mood, poor sleep or trouble concentrating that affects daily life. Seek urgent care for a seizure, fainting, sudden confusion, a severe new headache, or new weakness, numbness or trouble speaking. If a doctor orders an EEG, it is a clinical test read by a specialist; a consumer headset cannot replace it.

The practical takeaway is modest: close your eyes, slow your breathing, step away from input when you are stuck, and judge the result by how you feel and function, not by a single brain-wave number.

*This article is for education and is not medical advice.*
`,
}

export default [article]
