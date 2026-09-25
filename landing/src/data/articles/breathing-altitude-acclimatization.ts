import type { Article } from './types'

/**
 * Breathing + altitude/acclimatization. WEAKER evidence base — a Kilimanjaro field observation (26
 * participants, WHM controlled-hyperventilation breathing) suggesting faster acclimatization, framed
 * as PROMISING not proven. Distinguishes controlled deep breathing (acclimatization aid) from slow
 * paced breathing (anxiety/sleep). AEO reference + FAQ. STRONG safety firewall: not a substitute for
 * gradual ascent; severe AMS/HAPE/HACE = descend + emergency care; camera=pulse, watch=HRV.
 */
const article: Article = {
  slug: 'breathing-altitude-acclimatization',
  title: 'Can Breathing Help with Altitude Sickness? What the Research Suggests',
  seoTitle: 'Breathing & Altitude Sickness: The Evidence | ONDA Life',
  description:
    'Controlled hyperventilation breathing (from the Wim Hof Method) was used on a Kilimanjaro expedition to reduce altitude sickness. What the research suggests about breath and acclimatization.',
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
Breathing technique may help your body adapt to high altitude faster. On a Kilimanjaro expedition, 26 participants used [Wim Hof Method breathing](/articles/wim-hof-breathing-inflammation) — a form of controlled hyperventilation — to prevent or reduce the symptoms of acute mountain sickness, and researchers reported it may accelerate altitude acclimatization. The idea is physiologically plausible: deliberate deep breathing raises blood oxygen and shifts blood chemistry in ways that mimic part of the body's natural adaptation to thin air. This is promising rather than proven — a field observation, not a large controlled trial — but it points to breathing as a low-cost tool worth understanding if you head for high places.

## What happens to your body at altitude

As you climb, the air thins and each breath delivers less oxygen. Your body responds by breathing faster and deeper, and over days it makes deeper adaptations — producing more red blood cells and adjusting blood chemistry. Until those adaptations catch up, many people experience acute mountain sickness (AMS): headache, nausea, fatigue, poor sleep and dizziness, usually above 2,500 metres. AMS is essentially your body lagging behind the altitude — the gap between how much oxygen you're getting and how much adaptation you've made.

Anything that helps close that gap faster — safely — is valuable, because AMS can range from miserable to, in severe forms, dangerous.

## What the Kilimanjaro observation found

On a climb of Mount Kilimanjaro (5,895 m), 26 participants used Wim Hof Method breathing techniques as they ascended. The report indicated that this controlled-hyperventilation breathing helped prevent or reverse symptoms of acute mountain sickness, suggesting it may accelerate acclimatization to altitude.

The proposed mechanism is straightforward: the deep, forceful breathing temporarily raises oxygen saturation and lowers carbon dioxide, nudging blood chemistry (pH and oxygen delivery) in a direction that partly anticipates the body's slower natural adjustment. In effect, the breathing may give your physiology a head start on adapting to thin air. It's worth being clear about the evidence level: this is a field observation from an expedition, not a large randomized controlled trial, so it should be read as a promising lead rather than settled proof.

## Breathing techniques used at altitude

Two distinct breathing approaches matter in the mountains, and they do different jobs:

- **Controlled deep breathing / hyperventilation** (as in the Wim Hof Method) — deliberately raises oxygen and may aid acclimatization, used actively during ascent. This is the technique in the Kilimanjaro observation.
- **Slow, paced breathing** — useful for the anxiety, poor sleep and racing heart that altitude often brings, by calming the nervous system. Different purpose: comfort and recovery rather than acclimatization. A [physiological sigh](/articles/physiological-sigh) or [slow coherent breathing](/articles/coherent-breathing-guide) fits here.

Note that spontaneous over-breathing from panic is *not* the same as controlled technique — anxious hyperventilation can worsen how you feel. The benefit comes from deliberate, controlled practice.

## Important safety notes

Altitude is not the place to experiment carelessly:

- **Controlled hyperventilation causes light-headedness** — do it seated or resting, never while climbing an exposed section, near drop-offs, or where a faint would be dangerous.
- **Breathing does not replace proper acclimatization** — gradual ascent, rest days, and "climb high, sleep low" remain the foundation. Breathing is a possible aid, not a substitute.
- **Severe altitude illness is a medical emergency.** If symptoms are severe or worsening (confusion, breathlessness at rest, loss of coordination), descend and seek help. No breathing technique treats HAPE or HACE.
- If you have heart, lung or blood-pressure conditions, get medical advice before high-altitude travel.

## See your body respond

At altitude your resting heart rate rises and your HRV typically falls as your body works to adapt. ONDA reads your pulse from your phone camera, or your HRV from your Apple Watch, so you can watch how your baseline shifts with altitude and how it settles as you acclimatize — and see the immediate effect of a breathing session on your heart rhythm. Your own trend is a useful companion to how you feel, never a replacement for good mountain judgment.
`,
}

export default [article]
