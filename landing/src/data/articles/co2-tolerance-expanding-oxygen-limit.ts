import type { Article } from './types'

/**
 * CO₂ tolerance / BOLT investigation — why the urge to breathe is driven
 * mainly by CO₂, what the BOLT breath-hold test is (a Buteyko / Oxygen
 * Advantage metric, not a validated clinical test), what over-breathing
 * really does (Bohr effect is modest at rest; the better-supported effect is
 * lower brain blood flow from hypocapnic vasoconstriction), what CO₂-focused
 * training does and doesn't do (Buteyko for asthma, panic and CO₂
 * sensitivity, freediver chemosensitivity), and which breath-hold practices
 * are unsafe. Grounded in verified literature (Klein 1993; Bruton & Lewith
 * 2005; Delapille 2001; Cowie 2008; Ainslie & Duffin 2009; Lindholm &
 * Lundgren 2009; Meuret 2009; Boyd 2015; Malte 2021; Kowalski 2024).
 * Removed from the old versions: "without CO₂ hemoglobin refuses to release
 * oxygen", "CO₂ tolerance unlocks hidden energy", BOLT <25 s = "inefficient
 * gas exchange" / "40+ s goal", apnea tables without safety warnings,
 * "HRV during apnea = fight-or-flight", Apollo Neuro as CO₂ training.
 * Merged 'bohr-effect-oxygen-telemetry' (301). Honest firewall: ONDA does not
 * measure CO₂, blood oxygen (SpO₂) or BOLT; the camera gives pulse and a
 * breathing-rate estimate only.
 */
const article: Article = {
  slug: 'co2-tolerance-expanding-oxygen-limit',
  title: 'CO₂ Tolerance and the BOLT Test: What Your Breath-Hold Time Really Tells You',
  subtitle:
    'Why the urge to breathe comes mostly from carbon dioxide, what a breath-hold score can and cannot say about you, and which breath-hold habits are genuinely dangerous.',
  seoTitle: 'CO₂ Tolerance & the BOLT Test, Explained | ONDA Life',
  description:
    'The urge to breathe is driven mostly by CO₂, not low oxygen. What the BOLT breath-hold test measures, why it is barely validated, and how to practice safely.',
  category: 'Neural Hardware',
  relatedSlugs: [
    'co2-tolerance',
    'breathing',
    'hyperventilation',
    'anxiety',
    'vagus-nerve',
    'heart-rate-variability',
  ],
  introStyle: 'cyan',
  image: '/images/articles/co2-tolerance-oxygen-efficiency-bohr-effect-onda.webp',
  imageAlt:
    'Illustration of a person breathing calmly, with carbon dioxide and oxygen moving between the lungs, the blood and the brain.',
  imageTitle: 'CO₂, oxygen and the urge to breathe',
  imageCaption:
    'The urge to breathe rises mainly with carbon dioxide. Breathing too much lowers CO₂, which narrows brain blood vessels; a breath-hold score mostly reflects how long you tolerate that urge.',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Over-breathing and anxiety often feed each other. See how slow breathing is used for panic and anxiety.',
    link: '/articles/anxiety-panic-breathing-hrv',
    linkText: 'Breathing for Anxiety and Panic',
  },
  howToSteps: [
    {
      name: 'Take the BOLT test only on dry land, seated',
      text: 'After a normal, relaxed exhale, pinch your nose and time how long until the first clear urge to breathe — then breathe normally. Never test near or in water, while driving, or if you have a heart condition, seizures or are pregnant.',
      protocolId: 'co2-bolt-safe-test',
    },
    {
      name: 'Practice gentle, quiet nasal breathing',
      text: 'Breathe through the nose, slightly slower and softer than usual, for a few minutes. A mild feeling of wanting more air is fine; strong air hunger, dizziness or anxiety means stop and breathe normally.',
      protocolId: 'co2-quiet-nasal-breathing',
    },
    {
      name: 'Get breathlessness checked, not trained away',
      text: 'New or worsening breathlessness, wheeze or chest symptoms need a doctor. If you have asthma, breathing retraining can be added to your treatment, not used instead of it.',
      protocolId: 'co2-check-breathlessness',
    },
  ],
  content: `
## [ CASE FILE: THE BREATH-HOLD SCORE ]

> "A breathing coach asks you to breathe out normally, pinch your nose and hold. At 14 seconds you feel the first tug to breathe and let go. 'Under 25 seconds,' you're told, 'means your gas exchange is inefficient and your cells are short of oxygen. Get it to 40.' A friend who trains daily brags about his 45-second score and his breath-hold tables.

> But is your blood really short of oxygen at 14 seconds — and does a longer hold mean a healthier body? The answer starts with what actually makes you want to breathe: not oxygen, mostly, but **carbon dioxide (CO₂)**."

---

## Section 1: Why do you feel the urge to breathe — low oxygen or high CO₂?

Mostly high CO₂. At rest and at sea level, the drive to breathe is set mainly by the level of carbon dioxide in your blood, which sensors in the brainstem track through its effect on acidity. Oxygen sensors do respond too, but usually only once oxygen falls much further.

That is why the first urge during a breath-hold arrives long before oxygen is low. It is also why the urge can be trained: trained breath-hold divers show a measurably blunted breathing response to rising CO₂ compared with non-divers (Delapille 2001).

The flip side is less comforting. Because the alarm is driven by CO₂, not oxygen, you can silence it — for example by over-breathing before a hold — while oxygen keeps falling. That is the mechanism behind blackouts in water (Section 6).

---

## Section 2: What is the BOLT test and how do you do it safely?

BOLT ("Body Oxygen Level Test") is a simple breath-hold timing used in the Buteyko method and the Oxygen Advantage program. Despite the name, it does not measure oxygen. It measures how long you comfortably tolerate the first urge to breathe.

How it is usually done:

1. Sit down and breathe normally through your nose for a minute.
2. After a normal, relaxed exhale (not a forced one), pinch your nose.
3. Time the seconds until the **first clear urge** to breathe — not your maximum.
4. Release and breathe normally. If you need a big gasp, you held too long.

Do it only seated on dry land. Never near or in water, never while driving, and skip it if you have a heart condition, a seizure disorder or are pregnant. Stop at the first strong urge.

---

## Section 3: What is a "normal" BOLT score — and is it a valid measure?

There is no validated "normal." The popular cut-offs (under 20–25 seconds is "poor," 40 seconds is the goal) come from breathing programs, not from studies that link scores to health outcomes.

The score mostly reflects how you tolerate breathlessness, which depends on mood, attention, how full your lungs are, and what you ate or drank. When researchers tested BOLT in 49 highly trained speed skaters, it showed no significant relationship with any measure from an all-out sprint test or a maximal exercise test, including maximum oxygen uptake (Kowalski 2024). The authors noted that BOLT had not been scientifically validated.

So BOLT can be a rough personal gauge of how calm your breathing feels. It cannot tell you your gas exchange is "inefficient" or that your cells are short of oxygen.

---

## Section 4: Does over-breathing really starve your brain of oxygen?

Partly, but not the way it is usually told. The better-supported effect is on brain **blood flow**, not on hemoglobin refusing to release oxygen.

- **The Bohr effect is real, but modest at rest.** More CO₂ and acidity make hemoglobin release oxygen a little more easily; less CO₂ makes it hold on a little more tightly (Malte 2021). Mild over-breathing shifts this somewhat. It does not stop oxygen delivery, and there is no hidden energy reserve to unlock.
- **Blood vessels in the brain react strongly to CO₂.** Low CO₂ narrows them and reduces brain blood flow; high CO₂ widens them (Ainslie & Duffin 2009). This is why heavy over-breathing can bring lightheadedness, tingling and a foggy feeling.

In short: habitual over-breathing can make you feel worse, and it is worth noticing. But the fix is ordinary, calm breathing, not chasing a breath-hold number.

---

## Section 5: Can you train CO₂ tolerance — and does it help anxiety or fitness?

You can get more comfortable with the urge to breathe. What that does for your health is more modest than it is often sold.

- **Asthma.** A review found only a handful of small Buteyko trials with inconsistent results, and noted it is unknown whether the method actually raises CO₂ (Bruton & Lewith 2005). In a randomized trial, asthma control improved about equally with Buteyko (40% to 79%) and with physiotherapist-led breathing and relaxation (44% to 72%); the Buteyko group used less inhaled steroid, and other differences were not significant (Cowie 2008). Symptoms can improve; it is not a replacement for medication.
- **Panic and anxiety.** One influential theory holds that some panic attacks are a "false suffocation alarm," with heightened sensitivity to CO₂ (Klein 1993). In 35 people with panic disorder, four weeks of breathing training that raised CO₂ toward normal (using a CO₂ monitor) reduced fear of body sensations, and the CO₂ change partly explained it (Meuret 2009). That is supervised training, not maximal breath-holds.
- **Fitness.** Divers do adapt to CO₂ (Delapille 2001), but there is no good evidence that a higher BOLT score makes you fitter (Kowalski 2024).

---

## Section 6: Which breath-hold practices are unsafe?

Any breath-holding in or near water, and any fast, heavy breathing before a hold. Over-breathing lowers CO₂, which delays the urge to breathe while oxygen keeps dropping — so you can pass out without warning. This is called hypoxic or shallow-water blackout.

Blackout from low oxygen is a leading cause of breath-hold diving deaths, concentrated among less-trained recreational divers and spearfishers, and people with heart problems may be especially vulnerable (Lindholm & Lundgren 2009). A New York State review of 16 drownings linked to dangerous underwater breath-holding found that combining more than one such behavior raised the risk of death (Boyd 2015).

Safety rules:

- Never practice breath-holds in a pool, bath, lake or sea, and never while driving.
- Never over-breathe before a hold.
- Stop at the first strong urge; no "pushing through" tables alone.
- Avoid it if you have a heart condition, seizures, fainting episodes or are pregnant.

Holding your breath also does not trigger "fight or flight." It triggers the dive reflex: the heart slows and blood vessels in the limbs tighten (Lindholm & Lundgren 2009).

---

## Section 7: What can you see yourself?

You can time your own BOLT on dry land and watch how calm your everyday breathing feels. Treat the number as a personal note, not a diagnosis.

ONDA does **not** measure CO₂, blood oxygen (SpO₂) or BOLT. With the phone camera it shows your pulse and an estimate of your breathing rate; with an Apple Watch it adds more signals such as HRV. If your resting breathing rate is often high or your breathing feels hurried, that is worth noticing — and worth a slower, quieter practice or a doctor's view.

---

## Section 8: When should you see a doctor?

See a doctor rather than training harder if you have:

- Breathlessness that is new, getting worse, or comes on with mild effort or lying flat.
- Chest pain, wheeze, a persistent cough, fainting, or blue lips.
- Frequent sighing, air hunger or tingling that you can't explain — this can be dysfunctional breathing, which physiotherapists can treat.
- Asthma that isn't well controlled. Breathing retraining can help alongside your treatment, never instead of it.

The urge to breathe is a safety signal, not a weakness to overcome. Calm breathing is worth practicing; beating a breath-hold score is not the goal.
`,
}

export default [article]
