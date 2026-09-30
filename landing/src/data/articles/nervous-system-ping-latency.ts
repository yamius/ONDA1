import type { Article } from './types'

/**
 * HRV and thinking speed investigation — what HRV measures (Shaffer &
 * Ginsberg 2017; Laborde 2017: RMSSD/HF reflect cardiac vagal activity;
 * Billman 2013: LF/HF is not a "sympatho-vagal balance"), how resting HRV
 * relates to reaction time and executive function (Hansen, Johnsen & Thayer
 * 2003; Luque-Casado 2013; Williams 2016 reaction-time variability; Forte
 * 2019 systematic review; Zahn 2016 and Holzman & Bridgett 2017
 * meta-analyses, small effects r = 0.15 and r = 0.09), why a link is
 * plausible (neurovisceral integration: Thayer & Lane 2000, 2009; Thayer 2012
 * neuroimaging meta-analysis — correlational), and whether HRV training
 * helps (Lehrer & Gevirtz 2014 mechanism; Lehrer 2020 meta-analysis; Tinello
 * 2022 executive-function review).
 * Merged in (301): 'hrv-training-nervous-system-latency' and
 * 'biological-latency-optimizing-system-ping'.
 * Removed from the old versions: HRV as a "ping"/"latency", "high HRV =
 * parasympathetic dominant / low = sympathetic dominant", coherence as
 * "heart, lungs and brain phase-locked", "HRV correlates directly with the
 * speed of the prefrontal override", "pre-conscious emotional interception",
 * the "cold rebound = massive parasympathetic surge", DFA alpha 1 > 1.0 as a
 * recovery finish line, myelin "patched" by nutrient protocols, alpha as a
 * 10 Hz "system clock" that cuts processing lag, and a fixed 5.5 s breath.
 * Honest firewall: ONDA camera = pulse + breathing estimate; HRV needs an
 * Apple Watch; coherence = Apple Watch only, a proprietary RSA feedback score,
 * not clinical HRV; no numeric pacer; ONDA does not measure reaction time.
 */
const article: Article = {
  slug: 'nervous-system-ping-latency',
  title: 'Does HRV Predict How Fast You Think and React? What the Research Shows',
  subtitle:
    'What heart rate variability really measures, how strongly it is linked to reaction time, focus and self-control, and whether training your HRV can make you sharper.',
  seoTitle: 'Does HRV Predict Reaction Time and Focus? | ONDA Life',
  description:
    'Only weakly. Higher resting HRV is linked to slightly better focus and steadier reactions, but effects are small. What HRV measures and what training can do.',
  category: 'Neural Hardware',
  relatedSlugs: [
    'heart-rate-variability',
    'vagus-nerve',
    'autonomic-nervous-system',
    'parasympathetic-nervous-system',
    'biofeedback',
    'coherence',
    'focus',
    'stress',
    'recovery',
  ],
  introStyle: 'cyan',
  image: '/images/articles/nervous-system-ping-latency.webp',
  imageAlt:
    'Illustration of a human head with a heartbeat trace running beneath it, representing the link between heart rhythm, attention and reaction time.',
  imageTitle: 'Heart rate variability, focus and reaction time',
  imageCaption:
    'Heart rate variability describes small changes in the time between heartbeats. People with higher resting HRV tend to do slightly better on attention tasks, but it is a weak signal, not a measure of thinking speed.',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Want to practise the kind of slow breathing used in HRV biofeedback? Find the pace that suits you.',
    link: '/articles/find-your-resonance-breathing-rate',
    linkText: 'Find Your Resonance Breathing Rate',
  },
  howToSteps: [
    {
      name: 'Take a short morning HRV reading the same way each day',
      text: 'Measure HRV for one to two minutes after waking, in the same position, before coffee. Use a device that records beat-to-beat data, such as an Apple Watch or a chest strap. Compare each reading with your own weekly average, not with other people.',
      protocolId: 'hrvrt-morning-reading',
    },
    {
      name: 'Practise slow breathing for 10–20 minutes',
      text: 'Sit comfortably and breathe slowly and smoothly through the nose, roughly five to seven breaths a minute, for 10–20 minutes on most days. HRV rises while you breathe this way. Stop if you feel dizzy.',
      protocolId: 'hrvrt-slow-breathing',
    },
    {
      name: 'Protect the basics that drive both HRV and focus',
      text: 'Keep regular sleep, move most days and limit alcohol late in the evening. These habits improve both resting HRV and attention, so they are a better bet than chasing a higher HRV number for its own sake.',
      protocolId: 'hrvrt-sleep-movement',
    },
  ],
  content: `
## [ CASE FILE: THE FAST-THINKER SCORE ]

> "A training blog says your heart rate variability is your nervous system's 'reaction speed'. High HRV means a sharp, calm mind that catches your temper before it fires. Low HRV means you are slow, foggy and one step behind. Raise the number, the blog promises, and you will think and react faster.

> There is a real finding underneath this story: people with higher resting HRV do tend to do a little better on some attention and self-control tasks. But how big is that link? Does it mean HRV measures how fast your brain works? And can breathing practice really make you quicker?"

---

## Section 1: What does HRV actually measure?

Heart rate variability (HRV) is the small, constant change in the time between one heartbeat and the next. A heart beating at 60 beats per minute does not beat exactly once a second; the gaps vary by tens of milliseconds. A healthy heart is not a metronome (Shaffer & Ginsberg 2017).

The most common short-term measure, RMSSD, and the high-frequency part of HRV mainly reflect **vagal activity** — how much the vagus nerve is slowing and adjusting the heart from beat to beat (Laborde 2017). Breathing drives much of this: the heart speeds up slightly when you breathe in and slows when you breathe out.

HRV is **not a delay or a speed**. It says nothing directly about how quickly signals travel along your nerves. And it is not a clean "gas vs brake" dial: the popular LF/HF ratio does not accurately measure the balance between the sympathetic and parasympathetic systems (Billman 2013). So "low HRV = stress mode, high HRV = calm mode" is an oversimplification.

For the basics — normal ranges, devices, why your number differs from a friend's — see [HRV questions answered](/articles/hrv-questions-answered).

---

## Section 2: Is higher HRV linked to faster reaction time?

Sometimes, weakly, and mostly on tasks that need attention and control rather than simple speed.

- In 53 navy sailors, the group with higher resting HRV had more correct answers on a working-memory test and faster average reaction times with fewer errors on an attention test — but only on the parts of the test that needed executive control (Hansen, Johnsen & Thayer 2003).
- In 104 healthy young adults, lower resting HRV predicted **more uneven** reaction times on an attention task — more trial-to-trial wobble, a sign of attention lapses — even after accounting for average speed (Williams 2016).
- In a study comparing fitter and less fit young people, the fitter group reacted faster on a vigilance task and their HRV held up better over time on task (Luque-Casado 2013). Fitness raises both, so it is hard to say HRV itself makes the difference.

A systematic review of 20 studies in healthy adults found that higher parasympathetic activity tended to go with better performance across attention, processing speed and executive function, while noting that the number of studies was small (Forte 2019).

The size matters. A meta-analysis of 26 studies found an average correlation between resting HRV and self-control of **r = 0.15**, with signs of publication bias (Zahn 2016). A larger meta-analysis of 123 studies and more than 14,000 people found **r = 0.09** for HRV and top-down self-regulation (Holzman & Bridgett 2017). Links that small are real at the group level but tell you almost nothing about one person.

---

## Section 3: Why would the heart's rhythm relate to focus and self-control?

The main explanation is the **neurovisceral integration model**. It proposes that the same brain networks — especially areas of the prefrontal cortex that help control attention and emotion — also help regulate the heart through the vagus nerve (Thayer & Lane 2000; Thayer & Lane 2009). If those networks work well, you might expect both better self-control and higher resting HRV.

There is some support: a meta-analysis of brain-imaging studies found that HRV was associated with activity in regions such as the ventromedial prefrontal cortex and amygdala (Thayer 2012).

But this evidence is **correlational**. It does not show that HRV sets the speed of your "brain override", and it does not show that raising HRV will make those brain areas work better. Claims that high HRV lets you catch emotions "before they reach awareness" go well beyond the data.

---

## Section 4: Does low HRV mean your nervous system is "slow"?

No. A low reading is not a sign that your nerves or brain are running slow.

HRV falls with age and varies a lot between healthy people. On a given day it also drops with poor sleep, alcohol, illness, hard training, stress, dehydration — and even during demanding mental work itself (Hansen, Johnsen & Thayer 2003; Luque-Casado 2013). Several of these also make it harder to concentrate, which is part of why HRV and focus move together.

**Myth-check:**

- *"HRV is your nervous system's latency."* — No. It is variation in heartbeat timing, mostly driven by vagal activity and breathing.
- *"High HRV means parasympathetic dominance."* — Too simple; the balance model behind it does not hold up (Billman 2013).
- *"Coherence means your heart, lungs and brain are phase-locked."* — Slow breathing makes heart rhythm and breathing move in step. The brain part is not established.
- *"Better myelin or a 10 Hz 'brain clock' cuts your reaction lag."* — No supplement or routine has been shown to speed nerve conduction in healthy people this way.

If you have had a low morning number, see [what to do after a low HRV reading](/articles/what-to-do-after-low-hrv-reading).

---

## Section 5: Can HRV training improve reaction time or focus?

The evidence is modest and mixed.

HRV biofeedback usually means breathing slowly — around six breaths a minute, at the pace where heart rate rises and falls most with each breath — while watching your heart rhythm. HRV rises sharply **during** this kind of breathing; the leading explanation is that it trains the baroreflex, the circuit that keeps blood pressure steady (Lehrer & Gevirtz 2014).

- A meta-analysis of 58 controlled studies found a **small to moderate** overall benefit of HRV biofeedback, with the largest effects for anxiety, depression, anger and athletic or artistic performance (Lehrer 2020). Numbers of studies per outcome were small.
- A review of 16 studies on executive functions found that 56% reported improvement in at least one measure, most often attention — mainly in groups such as stressed people, athletes, veterans, people with ADHD and older patients (Tinello 2022).

What is **not** shown: that raising your resting HRV makes a healthy person react measurably faster. A calmer, more focused state after a breathing session is plausible and useful. A faster brain is not the proven result.

For a broader plan, see [how to train your nervous system](/articles/how-to-train-your-nervous-system), [how to raise HRV naturally](/articles/how-to-raise-hrv-naturally) and [finding your resonance breathing rate](/articles/find-your-resonance-breathing-rate).

---

## Section 6: How can you track this yourself without overreading one number?

**1. Measure HRV the same way each time.** One to two minutes after waking, same position, same device. Look at your 7-day average, not single days. See [how to measure HRV consistently](/articles/how-to-measure-hrv-consistently).

**2. Test focus separately.** If you want to know whether you are sharper, measure that directly: a simple online reaction-time or attention test at the same time of day, several times a week. Compare weeks, not mornings.

**3. Watch the shared drivers.** Note sleep, alcohol, training load and illness. Often these explain both a low HRV and a foggy day.

**4. Treat breathing sessions as practice, not a score chase.** A higher number during slow breathing is expected. What matters is whether you feel steadier and your weekly baseline holds up.

ONDA can help with the breathing side. With the phone camera it shows your pulse and an estimate of your breathing rate. With an Apple Watch it also reads HRV and resting heart rate, and gives a live coherence score during practice — a feedback measure of how smoothly your heart rhythm follows your breathing, not a clinical HRV value. ONDA does not measure reaction time or thinking speed.

---

## Section 7: When should you see a doctor?

See a doctor if you notice new or worsening problems with concentration, memory or reaction time; dizziness or fainting; a very fast, slow or irregular heartbeat; or a resting HRV that stays far below your usual for weeks alongside fatigue or other symptoms. Chest pain, sudden weakness, confusion or trouble speaking need emergency care.
`,
}

export default [article]
