import type { Article } from './types'

/**
 * Breathing + altitude/acclimatization. VERY WEAK evidence base — a single uncontrolled Kilimanjaro
 * report (26 participants, WHM controlled-hyperventilation breathing); framed as an anecdote, untested
 * in trials. Myth guard: fast breathing lowers CO2, it does not "load" oxygen at sea level (SpO2 already
 * ~97–99%); at altitude more ventilation (hypoxic ventilatory response) does raise oxygen somewhat.
 * Distinguishes controlled deep breathing (untested as an acclimatization aid) from slow
 * paced breathing (anxiety/sleep). AEO reference + FAQ. STRONG safety firewall: not a substitute for
 * gradual ascent; severe AMS/HAPE/HACE = descend + emergency care; camera=pulse, watch=HRV.
 */
const article: Article = {
  slug: 'breathing-altitude-acclimatization',
  title: 'Can Breathing Help with Altitude Sickness? What the Research Suggests',
  seoTitle: 'Breathing & Altitude Sickness: The Evidence | ONDA Life',
  description:
    'Controlled hyperventilation breathing (from the Wim Hof Method) was tried on a Kilimanjaro expedition — a single uncontrolled report. What the research does and does not show about breath and acclimatization.',
  category: 'ONDA Protocol',
  relatedSlugs: ['wim-hof-breathing-inflammation', 'coherent-breathing-guide', 'how-to-raise-hrv-naturally', 'physiological-sigh', 'cold-exposure-vagus-nerve'],
  introStyle: 'slate',
  image: '/images/articles/breathing-altitude-acclimatization.jpg',
  imageAlt:
    'Breathing and Altitude Sickness — illustration: a climber silhouette on a high mountain ridge at dawn, a soft visible breath glow, thin cold air and distant peaks.',
  imageTitle: 'Breathing and Altitude Sickness',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'A promising lead, not a substitute. Gradual ascent and “climb high, sleep low” stay the foundation.',
    link: '/measurements',
    linkText: 'What ONDA measures →',
  },
  content: `
Can a breathing technique help your body adapt to high altitude? The evidence is thin. On a Kilimanjaro expedition, 26 participants used [Wim Hof Method breathing](/articles/wim-hof-breathing-inflammation) — a form of controlled hyperventilation — and the report described fewer or milder symptoms of acute mountain sickness; its authors suggested the breathing may speed acclimatization. This is a single uncontrolled report — closer to an anecdote than to evidence — not a trial. Part of the idea is sound: at altitude, breathing more is the body's own first defence against thin air and does raise blood oxygen somewhat. But fast breathing does not "load" the body with oxygen — at sea level blood is already about 97–99% saturated, and hyperventilation mainly blows off carbon dioxide ([fast breathing: what the evidence shows](/science/evidence/fast-breathing)). Whether a deliberate breathing technique speeds acclimatization has not been tested in controlled trials.

## What happens to your body at high altitude?

As you climb, the air thins and each breath delivers less oxygen. Your body responds by breathing faster and deeper, and over days it makes deeper adaptations — producing more red blood cells and adjusting blood chemistry. Until those adaptations catch up, many people experience acute mountain sickness (AMS): headache, nausea, fatigue, poor sleep and dizziness, usually above 2,500 metres. AMS is essentially your body lagging behind the altitude — the gap between how much oxygen you're getting and how much adaptation you've made.

Anything that helps close that gap faster — safely — is valuable, because AMS can range from miserable to, in severe forms, dangerous.

## Can breathing techniques help prevent altitude sickness?

The main source is a single report from Kilimanjaro: on a climb of Mount Kilimanjaro (5,895 m), 26 participants used Wim Hof Method breathing techniques as they ascended. The report described this controlled-hyperventilation breathing as helping prevent or reverse symptoms of acute mountain sickness, and suggested it may accelerate acclimatization. There was no control group, so there is no way to tell whether the breathing, the ascent schedule, expectation or chance made the difference. Treat it as an anecdote, not as evidence that the technique works.

The proposed mechanism is part true, part myth. At sea level, deep, fast breathing barely raises oxygen, because blood is already about 97–99% saturated; what it mainly does is lower carbon dioxide, which makes the blood more alkaline and can cause tingling and light-headedness — and during the breath-holds that follow, oxygen falls. At altitude the picture is different: the air holds less oxygen, saturation drops, and breathing more — the body's own hypoxic ventilatory response — does raise blood oxygen somewhat. That extra breathing is a real and useful part of natural acclimatization. What has not been shown is that rounds of deliberate hyperventilation with breath-holds speed acclimatization beyond it. Read the Kilimanjaro report as an untested idea, not a protocol.

## Which breathing techniques are used at altitude?

Two distinct breathing approaches matter in the mountains, and they do different jobs:

- **Controlled deep breathing / hyperventilation** (as in the Wim Hof Method) — mainly lowers carbon dioxide; whether it aids acclimatization is untested in trials. This is the technique in the single Kilimanjaro report.
- **Slow, paced breathing** — useful for the anxiety, poor sleep and racing heart that altitude often brings, by calming the nervous system. Different purpose: comfort and recovery rather than acclimatization. A [physiological sigh](/articles/physiological-sigh) or [slow coherent breathing](/articles/coherent-breathing-guide) fits here.

Note that spontaneous over-breathing from panic is *not* the same as controlled technique — anxious hyperventilation can worsen how you feel. The benefit comes from deliberate, controlled practice.

## Important safety notes

Altitude is not the place to experiment carelessly:

- **Controlled hyperventilation causes light-headedness** — do it seated or resting, never in or near water, never while driving, never while climbing an exposed section, near drop-offs, or where a faint would be dangerous.
- **Breathing does not replace proper acclimatization** — gradual ascent, rest days, and "climb high, sleep low" remain the foundation. Breathing is a possible aid, not a substitute.
- **Severe altitude illness is a medical emergency.** If symptoms are severe or worsening (confusion, breathlessness at rest, loss of coordination), descend and seek help. No breathing technique treats HAPE or HACE.
- If you have heart, lung or blood-pressure conditions or epilepsy, or are pregnant, get medical advice before high-altitude travel and before trying fast breathing.

## See your body respond

At altitude your [resting heart rate](/science/measurements/resting-heart-rate) rises and your [HRV](/science/concepts/heart-rate-variability) typically falls as your body works to adapt. ONDA reads your pulse from your phone camera, or your HRV from Apple Health (Apple Watch or another tracker that syncs there), so you can watch how [your baseline](/science/concepts/hrv-baseline) shifts with altitude and how it changes as you stay: in some people it partly recovers, while at very high altitude the balance may not return even within several weeks. You can also see the immediate effect of a breathing session on your heart rhythm. Your own trend is a useful companion to how you feel, never a replacement for good mountain judgment.
`,
}

export default [article]
