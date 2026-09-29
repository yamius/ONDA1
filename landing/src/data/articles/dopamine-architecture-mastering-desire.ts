import type { Article } from './types'

/**
 * Dopamine investigation — wanting vs liking (Berridge & Robinson 1998),
 * reward prediction error (Schultz 1997), effort and motivation (Salamone &
 * Correa 2012), addiction as cue-driven learning (Volkow 2016), exercise and
 * mood (Blumenthal 1999), dopamine medicines and impulse control in Parkinson's
 * (Weintraub 2010). Myth-checks: "spikes lower your baseline" / phone-and-sugar
 * "receptor downregulation" (little direct human evidence), and the cold-water
 * "250% for 3–4 hours" claim (Šrámek 2000 measured PLASMA dopamine after 1 h at
 * 14 °C — not brain dopamine, no duration). Merges the former
 * 'dopamine-stacking-preventing-circuit-overload' (301). Honest firewall: ONDA
 * does not measure dopamine, mood or motivation.
 */
const article: Article = {
  slug: 'dopamine-architecture-mastering-desire',
  title: 'The Wanting Machine: What Dopamine Really Does — and the Myths About Resetting It',
  subtitle:
    'Why dopamine is about wanting and learning rather than pleasure, what the popular "baseline" and cold-water claims get wrong, and what actually supports motivation.',
  seoTitle: 'Dopamine and Motivation: What It Really Does | ONDA Life',
  description:
    'Dopamine drives wanting and learning, not pleasure. What the science shows about motivation, why "reset your baseline" claims overreach, and what really helps.',
  category: 'Biological Software',
  relatedSlugs: ['dopamine', 'ventral-tegmental-area', 'nucleus-accumbens', 'prefrontal-cortex', 'limbic-system', 'neuroplasticity'],
  introStyle: 'purple',
  image: '/images/articles/dopamine-reward-system-neural-architecture.webp',
  imageAlt:
    'Illustration of the brain’s dopamine reward pathway: dopamine cells in the midbrain sending signals to the nucleus accumbens and the frontal cortex.',
  imageTitle: 'The dopamine pathway behind wanting and learning',
  imageCaption:
    'Dopamine cells in the midbrain project to the nucleus accumbens and frontal cortex. Their signals shape what we want, what we learn to expect and how much effort we will spend — not simply what feels good.',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Want the practical side of cutting back on easy rewards? Here is what a "dopamine detox" really is and when it helps.',
    link: '/articles/does-dopamine-detox-work',
    linkText: 'Does a Dopamine Detox Work?',
  },
  howToSteps: [
    {
      name: 'Make the next step small and clear',
      text: 'Break a goal into a first step you can finish today. Dopamine signaling tracks effort and expected reward, so a clear, reachable step makes starting easier than waiting to feel motivated.',
      protocolId: 'dopamine-small-next-step',
    },
    {
      name: 'Change the cues, not your willpower',
      text: 'Move the phone out of reach while working, turn off non-essential notifications and keep tempting snacks out of sight. Habits are triggered by cues, so removing the cue works better than resisting it.',
      protocolId: 'dopamine-cue-control',
    },
    {
      name: 'Protect sleep and move most days',
      text: 'Keep a regular sleep schedule and get regular aerobic exercise. Both have solid evidence for mood and energy, which is what people usually mean by "motivation."',
      protocolId: 'dopamine-sleep-exercise',
    },
  ],
  content: `
## [ CASE FILE: THE MISSING DRIVE ]

> "An afternoon disappears into a phone. Short videos, a few notifications, a snack, another scroll. None of it was especially enjoyable, and yet stopping felt strangely hard. The report that needed two hours of focus is still untouched, and it now feels heavier than it did this morning.

> The internet has a ready answer: 'cheap dopamine' has lowered your baseline, and you need a cold plunge or a dopamine fast to reset it. It is a tidy story. But what does dopamine actually do — and how much of that story holds up when you check the studies?"

---

## Section 1: Is dopamine the "pleasure chemical"?

No. Dopamine is much more closely tied to **wanting** — the pull toward a reward — than to **liking**, the pleasure you feel when you get it.

The clearest evidence comes from the work of Kent Berridge and Terry Robinson. In a long review of animal experiments, they showed that when dopamine is sharply reduced, animals still show normal signs of enjoying a sweet taste, but they stop working to get it. Boosting dopamine did the reverse: more pursuit, not more enjoyment (Berridge & Robinson 1998). They called this role "incentive salience" — dopamine makes a cue or a reward stand out as something worth going after.

That split explains the afternoon in the case file. You can keep reaching for something you don't particularly enjoy, because the pull and the pleasure run on partly different systems.

---

## Section 2: What is reward prediction error?

A reward prediction error is the difference between the reward you expected and the one you got. Dopamine cells appear to signal exactly this.

In monkey experiments, Wolfram Schultz and colleagues found that dopamine neurons fired strongly to an unexpected reward. Once a light reliably predicted the reward, the burst moved to the light, and the reward itself caused little change. If an expected reward failed to arrive, activity dipped below normal at the moment it should have come (Schultz 1997).

In plain terms: dopamine is less a "reward" signal than a "better or worse than expected" signal, and it helps the brain learn what predicts good things. This is one reason unpredictable rewards, such as a feed that is sometimes interesting, are so good at holding attention.

---

## Section 3: Why does dopamine matter for effort and motivation?

Dopamine in the brain's reward pathway helps decide whether a reward is worth the work. It supports effort, persistence and getting started more than it supports enjoyment.

In a review of decades of research, John Salamone and Mercè Correa describe how animals with reduced dopamine in the nucleus accumbens still eat freely available food, but shift away from options that require more work, such as pressing a lever many times for a preferred food (Salamone & Correa 2012). Low dopamine did not remove the appetite; it changed the cost-benefit decision.

This is a useful frame for everyday life. Low motivation often feels like "I don't care," but it is frequently "this looks like too much effort for an uncertain payoff." Making the next step smaller and clearer changes that math.

---

## Section 4: Can phones and sugar lower your dopamine baseline?

There is little direct evidence in people that phones, social media or sugar lower a measurable "dopamine baseline" or cause receptor loss. That claim is largely borrowed from drug addiction research.

Brain imaging studies of people addicted to drugs such as cocaine or alcohol do show changes in the dopamine system, including fewer D2 receptors, and repeated drug use strengthens the pull of drug-related cues (Volkow 2016). But those findings come from powerful drugs that act on dopamine directly, often over years. Scrolling and dessert have not been shown to do the same thing, and there is no test that measures anyone's personal "baseline."

The better-supported frame is **learning and habit**. Every time a cue (a buzz, a boring moment, the sight of the phone) is followed by a quick reward, the link gets stronger, and the pull toward it becomes more automatic. Slow, effortful activities start to look less attractive by comparison. You don't need a "reset"; you need to change the cues and give effortful work a fair chance. The practical version of this is covered in [Does a Dopamine Detox Actually Work?](/articles/does-dopamine-detox-work).

The same applies to "dopamine stacking," the idea that doing several stimulating things at once overloads the reward system or causes "excitotoxicity." There is no evidence for that in everyday life. The sensible part — doing one thing at a time — is simply good attention hygiene.

---

## Section 5: Does cold water really raise dopamine by 250%?

Not in the way it is usually quoted. The number comes from one small study, and it measured dopamine in the blood, not in the brain.

In that study, young men sat in water up to the neck for one hour at 32 °C, 20 °C and 14 °C. At 14 °C, plasma noradrenaline rose by 530% and plasma dopamine by 250%, and metabolic rate rose by 350% (Šrámek 2000). The authors put the cold response down mainly to the sympathetic nervous system.

What the popular version gets wrong:

- **It was an hour of immersion**, not a two-minute cold shower.
- **It measured plasma dopamine** — dopamine circulating in the blood, which largely does not cross into the brain. It says nothing about "brain baseline" or motivation.
- **There is no "3–4 hours" figure** in the study.

Cold water can feel energizing, and that feeling is real. But it is not evidence that a cold plunge resets your dopamine system.

Other popular claims need similar care. Morning daylight is genuinely useful for setting your body clock, but "sunlight triggers an immediate dopamine release" rests mostly on animal and retina research. And the idea of randomizing your own rewards to "prevent receptor saturation" or "post-success depression" has no human evidence behind it.

---

## Section 6: What actually supports motivation — and what can you see yourself?

The levers with real evidence are ordinary ones.

- **Sleep.** Short or irregular sleep reliably worsens mood, focus and the sense of effort. It is the first thing to fix.
- **Exercise.** In a randomized trial of 156 adults aged 50 and older with major depression, 16 weeks of aerobic exercise reduced symptoms about as much as an antidepressant, although the medicine worked faster at first (Blumenthal 1999). Regular movement is one of the best-studied ways to lift low mood and energy.
- **Structure the effort.** Clear goals, small first steps and visible progress lower the perceived cost of starting — which is exactly the decision dopamine helps make.
- **Control the cues.** Put the phone in another room during focused work, remove the apps that pull you in most, and keep tempting foods out of sight. Changing the environment works better than relying on willpower.
- **One thing at a time.** Monotasking won't "protect your receptors," but it makes focused work easier to sustain.

What you can track: ONDA does **not** measure dopamine, mood or motivation. What it offers is guided breathing and meditation practice, with your pulse and breathing rate shown during a session. A short, calm practice can be a deliberate pause between a scroll and the next piece of work — a small, honest tool, not a dopamine fix.

---

## Section 7: When should you see a doctor?

See a doctor or mental health professional if low motivation is persistent or is affecting your life. In particular:

- **Loss of interest or pleasure for two weeks or more**, especially with low mood, sleep changes or hopelessness. This can be depression, which is common and treatable.
- **Use you can't control** — of a substance, gambling, gaming or anything else — despite clear harm.
- **New urges after starting a medicine.** In a study of 3,090 people with Parkinson's disease, impulse control problems such as compulsive gambling, buying or eating affected 17.1% of those taking a dopamine agonist, compared with 6.9% of those who were not (Weintraub 2010). Don't stop the medicine on your own; tell your doctor.

If you ever have thoughts of harming yourself, contact emergency services or a crisis line right away (in the US, call or text 988).

Dopamine is not a tank that screens drain and cold water refills. It is a learning and motivation signal — and the most reliable ways to work with it are the unglamorous ones: sleep, movement, clear next steps and fewer cues pulling you off course.
`,
}

export default [article]
