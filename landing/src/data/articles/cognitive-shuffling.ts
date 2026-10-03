import type { Article } from './types'

/**
 * Cognitive Shuffling — companion article for the /tools/cognitive-shuffle tool.
 * 2026-10 upgrade: answer-first; unsourced Digdon & Beaudoin student-study results removed
 * (evidence framed as theory + preliminary data); Harvey 2002 + Qaseem 2016 used; table + doctor note.
 * Targets the high-intent query "cognitive shuffling" with a how-to + the science,
 * and funnels readers into the interactive tool.
 */
const article: Article = {
  slug: 'cognitive-shuffling',
  title: 'Cognitive Shuffling: A Mental Trick to Help You Fall Asleep',
  seoTitle: 'Cognitive Shuffling: How It Works for Sleep | ONDA Life',
  description:
    'Cognitive shuffling: picture random, unrelated objects in bed to quiet a racing mind. How to do it, what the early evidence shows, and when to try CBT-I.',
  category: 'ONDA Protocol',
  relatedSlugs: [
    'phase-locked-acoustic-sleep',
    'circadian-lighting-dark-therapy',
    'nervous-system-ping-latency',
  ],
  introStyle: 'indigo',
  image: '/images/cognitive-shuffling.png',
  imageAlt:
    'Cognitive shuffling sleep technique: picturing random neutral words at bedtime to quiet a racing mind and fall asleep faster.',
  imageTitle: '[BUFFER_FLUSH]: Serial diverse imagining to break the bedtime worry-loop.',
  imagePlacement: 'header',
  howToSteps: [
    {
      name: 'Get into position first',
      text: 'Lie down in bed with the lights off and the room cool. Do the technique only once you are actually trying to sleep — not while still scrolling or planning tomorrow.',
    },
    {
      name: 'Pick a random seed word',
      text: 'Choose any neutral, concrete word — say "lantern". You will use its letters to spawn more words.',
    },
    {
      name: 'Spin off images from the first letter',
      text: 'Take the first letter (L) and think of unrelated objects starting with it — ladder, lemon, lake — picturing each one for a second or two, then letting it go.',
    },
    {
      name: 'Move through the letters',
      text: 'When that letter runs dry, move to the next (A: acorn, anchor, apple…). Keep the images concrete and disconnected. Do not build a story.',
    },
    {
      name: 'Let attention drift and repeat',
      text: 'If your mind wanders back to worries, just return to the next random word. Many people drift off before running out of letters. Or skip the manual version and let the tool feed you the words.',
    },
  ],
  neuralSuggestion: {
    text: 'Pair it with a cycle-aligned bedtime so you fall asleep faster AND wake less groggy.',
    link: '/tools/sleep-cycle',
    linkText: 'Sleep Cycle Calculator →',
  },
  content: `
Cognitive shuffling is a falling-asleep technique in which you picture a stream of random, unrelated, everyday objects — a ladder, a lemon, a lake — to crowd out worrying and planning thoughts at lights-out. It was proposed by cognitive scientist Luc Beaudoin, who calls it *serial diverse imagining*, on the idea that scattered, neutral images resemble the drifting imagery of normal sleep onset. The evidence is still early: it rests on a cognitive model of sleep onset and small preliminary studies rather than large clinical trials, so treat it as a free, low-risk thing to try — not a treatment for insomnia.

---

## Why does a racing mind keep you awake?

A racing mind keeps you awake because worry, planning and monitoring whether you are falling asleep raise mental and physical arousal. Psychologist Allison Harvey’s cognitive model of insomnia describes exactly this loop: excessive negative thinking about sleep and the day triggers arousal and distress, attention locks onto threats (including "I’m still awake"), and the extra arousal makes sleep less likely (Harvey 2002). Trying harder to switch off is itself a form of engagement, which is why willpower rarely works.

---

## What is cognitive shuffling?

Cognitive shuffling is a deliberate way of giving your mind something harmless, random and disconnected to do in bed. Beaudoin’s framing is that falling asleep is accompanied by loose, unconnected imagery (hypnagogia), whereas coherent, emotionally loaded thinking holds you awake. By imagining a series of unrelated concrete objects — holding each for a few seconds before the next — you mimic the first and crowd out the second (Beaudoin 2019).

That is the opposite of a lot of sleep content. Sleep stories and structured visualisations keep a narrative thread; cognitive shuffling deliberately breaks it.

---

## How do you do cognitive shuffling?

You do it by spinning random, concrete images out of the letters of a neutral word:

1. **Get into bed, lights off,** only when you are actually trying to sleep.
2. **Pick a neutral seed word,** such as "lantern".
3. **Take the first letter (L)** and think of unrelated objects starting with it — ladder, lemon, lake — picturing each for a few seconds.
4. **Move to the next letter** when ideas run dry (A: acorn, anchor, apple…). Keep the images unconnected; don’t build a story.
5. **If a worry returns,** go back to the next word without judging yourself.

Choosing the words is itself a small task, which is why some people prefer a generator. **→ [Try our free Cognitive Shuffle tool](/tools/cognitive-shuffle)** — it shows (and optionally speaks) one neutral word every few seconds so you can stay passive. No account, no setup.

---

## Does cognitive shuffling actually work?

Nobody knows yet how well it works, because it hasn’t been tested in large randomized trials. The main published description is a 2019 conference abstract in *Sleep Medicine* that sets out the theory and explicitly proposes testing the technique against alternatives (Beaudoin 2019). Preliminary findings from Beaudoin’s group have been presented mostly at conferences rather than in full peer-reviewed trials.

What it has going for it: it targets the arousal loop that cognitive models of insomnia put at the centre of the problem (Harvey 2002), it costs nothing, and the downside of trying it is close to zero.

| Approach | What you do | Evidence |
|---|---|---|
| **Cognitive shuffling** | Picture random, unrelated objects | Theory + preliminary data; no large trials yet |
| **Counting sheep** | Repetitive counting | Little research; easy to do on autopilot while still worrying |
| **CBT-I** | Structured therapy: sleep scheduling, stimulus control, thought work | First-line treatment for chronic insomnia (Qaseem 2016) |

---

## How do you make it work better?

You make it work better by doing it only in bed, keeping images concrete, and not keeping score.

- **Do it in bed, in the dark.** It is a falling-asleep tool, not a wind-down activity for the sofa. If you’re still wired, check your [caffeine cut-off](/tools/caffeine) and [a cycle-aligned bedtime](/tools/sleep-cycle).
- **Keep images concrete, not abstract.** "Justice" or "deadline" re-engage the thinking brain; "otter", "kettle" and "harbour" don’t.
- **Don’t judge your performance.** If a worry sneaks back, return to the next word. The non-effort is the point.
- **Give it a few nights.** A new routine usually feels easier once it’s familiar.

---

## When should you see a doctor instead?

See a doctor if you regularly struggle to sleep despite good habits — for example, trouble sleeping at least three nights a week for three months — or if you are exhausted during the day. Cognitive shuffling is not a treatment for chronic insomnia, sleep apnoea, restless legs, or sleep problems driven by pain, medication or another medical condition. For chronic insomnia, the American College of Physicians recommends cognitive behavioural therapy for insomnia (CBT-I) as the first-line treatment (Qaseem 2016); shuffling can sit alongside it. Loud snoring, gasping at night or falling asleep while driving need prompt medical attention.

The mind that won’t switch off isn’t broken. It just needs the right kind of nothing to do.
`,
}

export default [article]
