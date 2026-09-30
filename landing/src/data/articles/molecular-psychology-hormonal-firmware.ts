import type { Article } from './types'

/**
 * Hormones-and-mood hub investigation. What "molecular psychology" really is
 * (Montag 2022: behavioural/molecular genetics and neuroscience of individual
 * differences), emotion as appraisal + context + body, two-way (Barrett 2017,
 * constructed emotion), stress mediators and allostatic load (McEwen 1998),
 * the serotonin theory of depression (Moncrieff 2022 umbrella review) balanced
 * with antidepressant efficacy (Cipriani 2018) and a do-not-stop-without-a-
 * doctor warning, the dual-hormone hypothesis (Mehta & Josephs 2010; Dekkers
 * 2019 meta-analysis, r = -0.061), oxytocin and trust (Kosfeld 2005; Nave 2015
 * critical review), what changes mood (Baglioni 2011 insomnia OR 2.60;
 * Noetel 2024 exercise; Barsaglini 2014 psychotherapy changes brain function),
 * and where hormones clearly matter (Schmidt 1998 PMS/PMDD; Bloch 2000
 * postpartum; Freeman 2006 menopausal transition).
 * Removed from the old version: "every emotion is a molecule docking into a
 * receptor", "a feeling is a readout, not a cause", "confidence is a
 * testosterone-to-cortisol ratio", "trust is an oxytocin release", "Monday
 * flatness = depleted dopamine baseline", "serotonin depletion causes
 * rumination", "calm = GABA outpacing glutamate", "talking doesn't change a
 * receptor count", firmware/operator/panel metaphors, the ratio-tracking
 * protocol and the CGM product block.
 * Honest firewall: ONDA does not measure hormones, neurotransmitters or mood.
 * HRV / resting HR (Apple Watch) and sleep regularity are indirect load signals.
 */
const article: Article = {
  slug: 'molecular-psychology-hormonal-firmware',
  title: 'Do Hormones Control Your Mood? What the Science Actually Shows',
  subtitle:
    'What molecular psychology really studies, which hormones and brain chemicals shape how you feel, why the "chemical imbalance" story is too simple — and what actually shifts mood.',
  seoTitle: 'Do Hormones Control Your Mood? The Science | ONDA Life',
  description:
    'Partly, but not alone. Hormones and brain chemicals shape mood together with sleep, stress, thoughts and people. What the evidence shows and what helps.',
  category: 'Biological Software',
  relatedSlugs: [
    'molecular-psychology',
    'neurotransmitters',
    'cortisol',
    'hpa-axis',
    'allostatic-load',
    'dopamine',
    'serotonin',
    'oxytocin',
    'testosterone',
    'neuroplasticity',
  ],
  introStyle: 'amber',
  image: '/images/articles/molecular-psychology-hormonal-firmware.png',
  imageAlt:
    'Illustration of a translucent human figure with layered labels, representing how the brain, hormones and daily life together shape mood.',
  imageTitle: 'Hormones, brain chemistry and mood',
  imageCaption:
    'Hormones and brain chemicals influence mood, but they work together with sleep, stress, thoughts and relationships — the influence runs in both directions.',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Can you actually watch your hormones change during the day? The honest state of wearable hormone sensors.',
    link: '/articles/chm-continuous-hormone-monitoring',
    linkText: 'Can You Track Cortisol Continuously Yet? →',
  },
  howToSteps: [
    {
      name: 'Keep a simple two-week mood and habits log',
      text: 'Once a day, rate your mood from 1 to 5 and note sleep, movement, alcohol, time with people and any big stressor. After two weeks, look for patterns. For women, also note the day of the menstrual cycle.',
      protocolId: 'hormood-mood-log',
    },
    {
      name: 'Protect sleep and move most days',
      text: 'Keep regular sleep and wake times and aim for some walking, jogging, yoga or strength training on most days. These two habits have some of the strongest evidence for protecting mood.',
      protocolId: 'hormood-sleep-exercise',
    },
    {
      name: 'Get help early if low mood lasts',
      text: 'If low mood, anxiety or loss of interest lasts more than two weeks, or mood changes clearly follow your cycle, pregnancy, birth or menopause, talk to a doctor. Ask about a thyroid check and about talking therapy.',
      protocolId: 'hormood-seek-help',
    },
  ],
  content: `
## [ CASE FILE: THE CHEMICAL MOOD ]

> "A popular article says every feeling you have is just a molecule docking into a receptor. Confidence is your testosterone-to-cortisol ratio. Trust is an oxytocin release. A flat Monday is a depleted dopamine baseline. Talking about your problems is pointless, it says, because words cannot change your chemistry.

> Hormones and brain chemicals really do affect how we feel. But does chemistry simply dictate mood? Is depression a 'chemical imbalance'? And if feelings are just molecules, why do sleep, exercise and therapy work so well?"

---

## Section 1: What is molecular psychology, really?

Molecular psychology is a real research field — but not the one the "firmware" story describes. It studies how genes, brain chemistry and brain systems relate to **differences between people** in personality, emotion and behaviour, combining behavioural genetics, molecular genetics and neuroscience (Montag 2022).

It does not claim that each feeling is a single molecule. Most traits studied in the field are linked to many genes with tiny effects each, plus environment and life experience. For a short definition, see the [molecular psychology glossary entry](/glossary/molecular-psychology).

---

## Section 2: Which hormones and brain chemicals actually affect mood?

Many do — but always as part of a larger system, and the influence runs both ways.

- **Cortisol and the stress system.** When you face a challenge, the [HPA axis](/glossary/hpa-axis) releases [cortisol](/glossary/cortisol). Short bursts help you cope. When stress stays high for months, the wear and tear — called [allostatic load](/glossary/allostatic-load) — is linked to worse physical and mental health (McEwen 1998). See [how to lower cortisol](/articles/how-to-lower-cortisol) and [how breathing affects stress hormones](/articles/breathing-lowers-stress-hormones).
- **Dopamine** is about wanting and learning what is worth pursuing, not simply pleasure. See [what dopamine really does](/articles/dopamine-architecture-mastering-desire).
- **Serotonin, GABA and glutamate** are involved in mood and anxiety, but "calm is GABA winning over glutamate" is a cartoon. Each chemical acts in many circuits at once.
- **Sex hormones** such as oestrogen, progesterone and testosterone can affect mood, especially when they change quickly. See [oestrogen and the brain](/articles/neural-optimizer-estrogen).
- **Appetite and energy hormones** such as leptin interact with mood too. See [what leptin really does](/articles/energy-sensor-leptin).

Just as important: the arrow also points the other way. Your thoughts, worries and relationships change your hormones. Worrying about a meeting raises cortisol; a supportive conversation can lower your stress response.

Modern emotion science describes feelings as the brain making sense of body signals **in context** — using past experience, the situation and what you expect (Barrett 2017). The same racing heart can feel like fear before an exam or excitement before a match. A feeling is not just a chemical readout.

---

## Section 3: Is depression caused by a "chemical imbalance"?

Not in the simple way often claimed. The "low serotonin" explanation is not well supported.

A 2022 umbrella review found no consistent evidence that depression is caused by lowered serotonin activity or levels (Moncrieff 2022). Large genetic studies found no link between the serotonin transporter gene and depression. The review has been debated, but most experts now agree depression has many causes: genes, stress, sleep, illness, inflammation, life events and thinking patterns.

This does **not** mean antidepressants don't work. A network meta-analysis of 522 trials with more than 116,000 adults found that all 21 antidepressants studied worked better than placebo for major depression, though effects were modest on average (Cipriani 2018). They help many people, for reasons that may go beyond "topping up" serotonin.

**Never stop or reduce an antidepressant on your own.** Stopping suddenly can cause withdrawal symptoms or relapse. Any change should be planned with your doctor.

---

## Section 4: Does testosterone make you confident?

Only a little, and not reliably. The "confidence ratio" idea comes from the dual-hormone hypothesis: testosterone was linked to dominance only in people whose cortisol was low (Mehta & Josephs 2010).

A meta-analysis of 33 studies with 8,538 people found only marginal support. The combined testosterone–cortisol effect on status-related behaviour was statistically significant but very small (r = -0.061), with signs of publication bias (Dekkers 2019).

Oxytocin has a similar story. An early study found that an oxytocin nasal spray increased trust in a money game (Kosfeld 2005). But a later critical review concluded that this finding "has not replicated well" and that trust is not reliably linked to oxytocin (Nave 2015). See [oxytocin and testosterone in social life](/articles/endocrine-social-drive-oxytocin-testosterone).

**Myth-check:**

- *"Every emotion is a molecule docking into a receptor."* — Chemistry is part of every feeling, but emotions also depend on how your brain interprets the situation.
- *"Confidence is a testosterone-to-cortisol ratio."* — The link is very small and inconsistent.
- *"A flat Monday means your dopamine baseline is depleted."* — There is no test for this and no evidence for it. Poor weekend sleep is a likelier culprit.
- *"Talking can't change your chemistry."* — Wrong. Psychotherapy leads to measurable changes in brain activity (Barsaglini 2014).

---

## Section 5: Why can't you just decide to feel differently — and what does change mood?

You can't switch a feeling off by willpower, because mood builds up from many slow inputs. But you can change those inputs, and they add up.

- **How you interpret events.** Reappraisal — looking at a situation another way — is a learnable skill. See [how to regulate your emotions](/articles/how-to-regulate-emotions).
- **Sleep.** People without depression who have insomnia are about twice as likely to develop it later (odds ratio 2.60 across 21 studies; Baglioni 2011).
- **Exercise.** A network meta-analysis of 218 trials with 14,170 participants found exercise to be an effective treatment for depression; walking or jogging, yoga and strength training worked best, especially at higher intensity (Noetel 2024).
- **Therapy.** Talking therapies such as CBT change how the brain responds, and those changes show up on brain scans (Barsaglini 2014).
- **Other people.** Regular contact with people you trust buffers stress. It is one of the simplest protective habits.

None of these works overnight. Think in weeks, not days.

---

## Section 6: When do hormones clearly matter?

In some situations, hormones play a clear, well-documented role in mood:

- **Thyroid problems.** An underactive thyroid can cause low mood, tiredness and slowed thinking; an overactive one can cause anxiety and irritability. A simple blood test checks this.
- **PMDD.** In women with premenstrual syndrome, switching off the ovaries relieved symptoms, and adding back normal levels of oestrogen or progesterone brought them back — while women without the condition had no mood change on the same hormones (Schmidt 1998). The problem is **sensitivity** to normal hormone changes, not abnormal levels.
- **After birth.** Women with a history of postpartum depression were more sensitive to a simulated drop in pregnancy hormones than women without that history (Bloch 2000).
- **Perimenopause.** In a study of women with no history of depression, depressed mood became more likely during the menopausal transition (Freeman 2006).
- **Cushing's syndrome and steroid medicines.** Very high cortisol, from illness or high-dose steroid drugs, can cause depression, anxiety or mood swings.

For the current state of hormone tracking, see [can you track cortisol continuously yet?](/articles/chm-continuous-hormone-monitoring).

---

## Section 7: Can body signals like HRV warn you about a bad day?

Only weakly. Heart rate variability (HRV), resting heart rate and regular sleep reflect general stress load and recovery. They often dip after poor sleep, illness, alcohol or a hard week — which can also affect mood. But they are not mood measures and cannot tell you which hormone is involved.

ONDA does not measure hormones, neurotransmitters or mood. With an Apple Watch, it reads HRV, resting heart rate and sleep data from Apple Health, which you can use as indirect signs of stress load. It also offers guided breathing practices. Compare readings with your own usual range, and treat them as a hint to look after sleep and stress — not as a diagnosis.

---

## Section 8: When should mood changes send you to a doctor?

See a doctor if low mood, anxiety, irritability or loss of interest lasts more than two weeks or gets in the way of work, relationships or daily life. Also seek help if mood changes clearly follow your menstrual cycle, pregnancy, birth or menopause; if you have signs of a thyroid problem (unexplained weight change, feeling very cold or hot, a racing heart); or if you started a new medicine, such as steroids, before your mood changed.

If you have thoughts of harming yourself, contact emergency services or a crisis line right away (in the US, call or text 988).
`,
}

export default [article]
