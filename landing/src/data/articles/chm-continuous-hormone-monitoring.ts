import type { Article } from './types'

/**
 * Continuous hormone monitoring investigation — whether any wearable can
 * track cortisol (or other hormones) today, how research sweat sensors work
 * (Parlak 2018 molecularly imprinted OECT; Torrente-Rodríguez 2020 graphene
 * sweat cortisol; Wang 2022 aptamer-FET smartwatch; Tu 2025 "Stressomic"
 * multi-hormone sweat sensor; Ye 2024 sweat oestradiol) and why sweat is a
 * hard fluid to read (Heikenfeld 2019), how cortisol normally moves across
 * the day (Pruessner 1997 awakening response; Stalder 2016 consensus
 * guidelines; Adam 2017 diurnal slope meta-analysis; Hellhammer 2009 salivary
 * cortisol caveats), and which validated tests exist (Nieman 2008 Cushing's
 * guideline; Bornstein 2016 adrenal insufficiency guideline).
 * Removed from the old version: "see the drop in real time" with
 * "percentage-point precision", Know Labs named as a cortisol sensor (it is
 * an RF glucose project), "flat evening cortisol blocks lipolysis",
 * scheduling tasks by "peak free testosterone/estrogen windows", alerts when
 * hormones "drop below baseline", and the invented ONDA "Correlation Score".
 * Honest firewall: ONDA does not measure cortisol or any hormone. It reads
 * pulse and breathing (camera) and HRV, resting heart rate and sleep
 * regularity (Apple Watch / Apple Health) — indirect signals of stress load.
 */
const article: Article = {
  slug: 'chm-continuous-hormone-monitoring',
  title: 'Can You Track Cortisol Continuously Yet? The State of Wearable Hormone Monitors',
  subtitle:
    'What research sweat sensors can already do, why no consumer device reads your cortisol today, and which tests and everyday signals are worth using instead.',
  seoTitle: 'Can You Track Cortisol Continuously Yet? | ONDA Life',
  description:
    'Not yet: no validated consumer wearable measures cortisol. Research sweat sensors exist; saliva, blood and urine tests remain the standard. What to track instead.',
  category: 'Biological Software',
  relatedSlugs: [
    'cortisol',
    'testosterone',
    'circadian-rhythm',
    'vagus-nerve',
    'heart-rate-variability',
  ],
  introStyle: 'amber',
  image: '/images/articles/continuous-hormone-monitoring-chm-biohacking-onda.webp',
  imageAlt:
    'Illustration of a small skin patch on the arm next to a smooth daily curve that rises in the morning and falls toward evening, representing cortisol across the day.',
  imageTitle: 'Wearable hormone sensors and the daily cortisol curve',
  imageCaption:
    'Cortisol rises sharply after waking and falls toward evening. Research sweat patches can follow parts of that curve in the lab, but no consumer wearable measures it yet.',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Worried your cortisol is too high? See what actually lowers it, based on evidence.',
    link: '/articles/how-to-lower-cortisol',
    linkText: 'How to Lower Cortisol',
  },
  howToSteps: [
    {
      name: 'Use a lab test when you need a real cortisol number',
      text: 'If a doctor suspects a cortisol problem, the validated options are blood, saliva (including late-night saliva) and 24-hour urine tests, read by a clinician. No wearable can replace them today.',
      protocolId: 'chm-lab-cortisol-test',
    },
    {
      name: 'Watch your resting heart rate and HRV trends instead',
      text: 'Track your morning resting heart rate and HRV over weeks. A run of higher resting heart rate and lower HRV than usual can reflect heavy stress load, poor sleep or illness — it is not a hormone reading.',
      protocolId: 'chm-hrv-rhr-trend',
    },
    {
      name: 'Keep your wake time and light regular',
      text: 'Wake at a similar time each day and get daylight soon after. The cortisol rise after waking is tied to the moment you wake, so regular mornings support a regular daily rhythm.',
      protocolId: 'chm-regular-wake-light',
    },
  ],
  content: `
## [ CASE FILE: THE HORMONE PATCH ]

> "An ad shows a sleek patch on someone's arm and a smooth graph on their phone: cortisol climbing during a tense meeting, testosterone peaking at 10 a.m., an alert when 'hormones drop below baseline.' The promise is simple — stop guessing why you're tired and watch your chemistry live, the way people now watch glucose.

> Can you buy that today? And if you could, would the curve actually tell you what to do? The honest answer involves a few impressive lab prototypes, one very tricky body fluid, and a hormone that changes so much across the day that a single number rarely means much."

---

## Section 1: Is there a wearable that measures cortisol today?

No — not one that is validated and on sale to consumers. There is no cortisol equivalent of a continuous glucose monitor (CGM). Smartwatches and rings that mention "stress" estimate it from heart rate, heart rate variability (HRV), skin temperature or skin conductance. They do not measure any hormone.

What does exist is research-grade hardware. University groups have built sweat patches and a smartwatch prototype that detect cortisol on the skin and have tested them on small groups of volunteers (Parlak 2018; Torrente-Rodríguez 2020; Wang 2022). A 2025 prototype called Stressomic measured cortisol together with adrenaline (epinephrine) and noradrenaline (norepinephrine) in sweat and followed their changes during physical, mental and drug-induced stress (Tu 2025).

These are real scientific advances. But they are early-stage studies in small samples, not devices that have been cleared for medical use or tested at scale in everyday life.

---

## Section 2: How do sweat cortisol sensors work — and how accurate are they?

The basic idea: a tiny patch collects a drop of sweat, and a sensor surface that binds cortisol turns that binding into an electrical signal.

- **Molecular "locks."** Some sensors use a plastic membrane shaped around cortisol molecules so that cortisol fits and most look-alikes don't (Parlak 2018). Others use an aptamer — a short strand of DNA-like material that grabs cortisol (Wang 2022).
- **Very low amounts.** Cortisol is present in sweat at low nanomolar levels, far less than the substances earlier sweat sensors could read (Wang 2022).
- **Sweat on demand.** Newer designs use a mild electric current (iontophoresis) to make the skin sweat at rest, and tiny channels to deliver fresh sweat to the sensor (Tu 2025).

How accurate? In pilot studies, sweat cortisol tracked blood or saliva cortisol closely enough to show the daily rhythm and stress responses (Torrente-Rodríguez 2020; Wang 2022). But sweat itself is the main problem. Sweat rate, pH, saltiness, dilution and the breakdown of molecules on the skin all vary, and researchers still understand little about how substances pass from blood into sweat (Heikenfeld 2019). Until sensors are tested in large groups, over weeks, against lab methods, a sweat reading is an interesting estimate — not a number to act on.

---

## Section 3: Why does cortisol change so much across the day?

Because it is designed to. Cortisol follows a strong daily rhythm: low around the middle of the night, rising in the early morning, then a sharp extra jump after you wake, and a gradual fall through the afternoon and evening.

That morning jump is called the **cortisol awakening response**. In three studies with 152 children, adults and older people, free cortisol in saliva rose by 50–75% within the first 30 minutes after waking (Pruessner 1997). An expert consensus describes it as a marked rise over the first 30–45 minutes after waking and stresses that it can only be measured properly if samples are taken at exact times from the moment you wake (Stalder 2016).

On top of that rhythm, cortisol also rises briefly with stress, exercise, illness and meals. This is exactly why one blood test at a random time tells you little, and why doctors use timed tests.

---

## Section 4: What can a cortisol curve actually tell you — and what can't it?

It can show patterns across groups of people. A meta-analysis of 80 studies found that a flatter daily cortisol slope — less drop from morning to evening — was linked with poorer mental and physical health, with a small average effect (r = 0.147) (Adam 2017). The authors note a flat slope may be a marker of stress-related problems, a cause, or both.

What it can't do, at least not yet:

- **Tell you what one reading means for you.** Salivary cortisol is shaped by many layers of the stress system, so it does not always move in step with blood cortisol, especially during stress (Hellhammer 2009).
- **Explain your fatigue by itself.** Tiredness has many causes: sleep, iron, thyroid, mood, illness. A cortisol number does not sort these out.
- **Justify specific fixes.** Claims such as "flat evening cortisol blocks fat burning" or that a live curve lets you manage energy "to the percentage point" are not supported by evidence.

---

## Section 5: What about testosterone, estrogen and other hormones?

Sex hormones are still measured with lab tests: mainly blood, sometimes saliva or urine. Testosterone, for example, is usually checked with a morning blood test, because it is higher earlier in the day.

Research is moving here too. A Caltech team built a sweat patch that detected oestradiol (the main form of estrogen) and found that sweat levels followed the menstrual cycle and correlated well with blood in their participants (Ye 2024). This is a lab prototype, not a product, and no consumer device tracks sex hormones in sweat.

Cycle-tracking apps and rings that use skin or body temperature are useful, but they do not measure hormones. They detect the small temperature shift that usually follows ovulation. Scheduling your work around "peak testosterone" or "peak estrogen windows" has no evidence behind it.

---

## Section 6: What can you track right now instead?

**When you need a real hormone number: lab tests.** For suspected cortisol excess (Cushing's syndrome), guidelines recommend validated tests such as 24-hour urine cortisol, **late-night salivary cortisol** or an overnight dexamethasone suppression test, with abnormal results confirmed by a second test and an endocrinologist (Nieman 2008). For suspected cortisol deficiency (adrenal insufficiency), the standard is a stimulation test, with morning blood cortisol and ACTH as a first screen (Bornstein 2016). Research studies of the awakening response use carefully timed saliva samples (Stalder 2016).

**For everyday stress load: heart signals and sleep.** HRV and resting heart rate react to heavy stress, poor sleep, alcohol and illness. They are indirect signals of how much strain your body is carrying — not hormone readings.

ONDA does **not** measure cortisol or any other hormone. With the phone camera it shows your pulse and an estimate of your breathing rate; with an Apple Watch and Apple Health it adds HRV, resting heart rate and sleep regularity. A trend of lower HRV and higher resting heart rate than your usual is a reason to rest more or check in with yourself, not a cortisol result.

**Your daily routine.** A regular wake time and daylight soon after waking support a regular daily rhythm — and cost nothing.

---

## Section 7: When should you see a doctor?

See a doctor, rather than buying a gadget, if you notice:

- **Signs that could mean too much cortisol:** easy bruising, purple stretch marks, a rounder face, weight gain around the middle with thin arms and legs, muscle weakness, new high blood pressure or high blood sugar.
- **Signs that could mean too little cortisol:** ongoing tiredness with weight loss, poor appetite, nausea, dizziness on standing, salt craving or darkening skin. Sudden severe weakness, vomiting or fainting needs urgent care.
- **Cycle or sex-hormone changes:** missed or very irregular periods, trouble conceiving, or low sex drive with erection problems or loss of body hair.

A continuous hormone monitor may arrive one day. For now, the reliable tools are a timed lab test when something seems wrong, and steady everyday habits the rest of the time.
`,
}

export default [article]
