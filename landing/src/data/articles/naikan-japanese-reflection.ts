import type { Article } from './types'

/**
 * Naikan — Japanese structured self-reflection (Ishin Yoshimoto), three questions (received / given /
 * trouble caused), deliberately NO "how did they wrong me" question. Reorganizes attention toward
 * gratitude + responsibility; complements Morita (acceptance/action) and breath/zazen. AEO + howToSteps
 * + FAQ. HONEST: Naikan is reflection, NOT a breathing/autonomic practice — so NO fake ONDA HRV tie-in;
 * it's framed as a complement to the breath/meditation practices ONDA does track. Morita described as a
 * concept (no article link yet).
 */
const article: Article = {
  slug: 'naikan-japanese-reflection',
  title: 'Naikan: The Japanese Practice of Structured Self-Reflection',
  seoTitle: 'Naikan: Japanese Structured Self-Reflection | ONDA Life',
  description:
    'Naikan is a Japanese method of structured reflection built on three simple questions, used therapeutically to shift perspective and gratitude. The practice, its psychology, and how it complements meditation.',
  category: 'ONDA Protocol',
  relatedSlugs: ['meditation-with-measurable-progress', 'zazen-zen-meditation-brain', 'meditation-vs-breathwork', 'measuring-meditation-progress', 'zen-koans-brain-cognition', 'how-to-regulate-emotions'],
  introStyle: 'emerald',
  image: '/images/articles/naikan-japanese-reflection.jpg',
  imageAlt:
    'Naikan: Japanese Self-Reflection — illustration: a seated figure behind a translucent Japanese folding screen, three soft lights floating in front of them.',
  imageTitle: 'Naikan: Japanese Self-Reflection',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'If breath calms the body and meditation trains attention, Naikan trains perspective — a rounded contemplative practice.',
    link: '/articles/meditation-vs-breathwork',
    linkText: 'Meditation vs breathwork →',
  },
  content: `
Naikan is a Japanese method of structured self-reflection — a kind of meditation on your relationships and your life, organized around three deceptively simple questions. Developed in Japan by Ishin Yoshimoto in the mid-20th century from Buddhist roots, Naikan (meaning "looking inside" or "introspection") is used both as a personal practice and therapeutically. Rather than emptying the mind like breath-focused meditation, Naikan *directs* reflection along specific lines that reliably shift perspective toward gratitude, responsibility, and connection. It's a different flavor of contemplative practice — not calming the mind through the breath, but reshaping how you see your life through guided attention.

*This article is part of our complete guide to [Meditation With Measurable Progress](/articles/meditation-with-measurable-progress).*

## The three questions

Naikan's entire method rests on reflecting, about a specific person or period, on three questions:

1. **What have I received from this person?**
2. **What have I given to this person?**
3. **What troubles and difficulties have I caused this person?**

Notably, there's no fourth question — "what troubles has this person caused *me*?" Its deliberate absence is the heart of the method. We spend enormous mental energy, often automatically, cataloguing how others have wronged or disappointed us. Naikan sets that habitual grievance-tracking aside and directs attention to what we've received, what we've given, and the trouble we've caused. This reorientation reliably surfaces a very different picture of our relationships and our lives.

## Why the structure works

Naikan is powerful precisely *because* it's structured. Left to its own devices, self-reflection tends to loop through familiar grooves — grievances, worries, self-justification (the same [default-mode rumination](/articles/zen-koans-brain-cognition) other meditation research describes). Naikan interrupts that by imposing three specific channels for attention, all of which point toward recognition of support received and impact given.

The effect is a shift in perspective. Reflecting concretely on what you've received from a parent, a partner, a colleague — the countless things normally invisible — tends to generate genuine gratitude, not as forced positivity but as an accurate accounting you'd simply never done. Reflecting on trouble you've caused builds honest responsibility without spiraling into shame, because it's balanced by what you've given and received. The three questions together produce a fuller, fairer, and usually warmer view than the mind's default.

## Naikan and Morita: the Japanese pair

Naikan is often mentioned alongside [Morita therapy](/articles/morita-therapy-tracking-paradox) as one of Japan's two homegrown psychotherapies, and they complement each other. Morita teaches acceptance of feelings as they are (*arugamama*) and redirection toward constructive action; Naikan restructures how you see your relationships and history through gratitude and responsibility. Where Morita addresses your relationship to your inner states, Naikan addresses your relationship to others and your past. Both, notably, work not by suppressing thought but by *reorganizing* attention — a distinctly Japanese contemplative approach that differs from the Western emphasis on either emptying the mind or challenging thoughts directly.

## How to practice Naikan

You can do a simplified Naikan reflection on your own:

- **Choose a person** — start with someone significant (a parent, partner, close friend) and a period of time.
- **Sit quietly** and take the three questions in order, spending real time on each: what you received, what you gave, what trouble you caused.
- **Be concrete and specific** — not "my mother did a lot," but particular meals, acts, sacrifices. Specificity is what makes the shift real.
- **Resist the fourth question.** When your mind jumps to how they wronged you, gently set it aside and return to the three.
- **Notice what surfaces** — often unexpected gratitude, and a fairer, warmer picture than you started with.

Even 15–20 minutes can shift your perspective noticeably. Traditional intensive Naikan involves days of structured reflection, but the everyday version is accessible to anyone.

## A complement to breath and mind practices

Naikan pairs naturally with the calming practices elsewhere on this site. [Breathwork and zazen](/articles/meditation-vs-breathwork) settle the nervous system and quiet the mind; Naikan gives reflection a constructive direction once you're settled. A calm mind reflecting through Naikan's three questions is more able to see clearly and generously. If breath calms the body and meditation trains attention, Naikan trains perspective — a different lever from the ones you can [track in your numbers](/articles/measuring-meditation-progress), and a natural complement to them. For the emotional-regulation side of the same coin, see [how to regulate emotions](/articles/how-to-regulate-emotions).
`,
  howToSteps: [
    {
      name: 'Choose a person and a period',
      text: 'Start with someone significant — a parent, partner or close friend — and a specific stretch of time.',
      protocolId: 'naikan-choose',
    },
    {
      name: 'Take the three questions in order',
      text: 'Sit quietly and spend real time on each: what you received from them, what you gave them, and what troubles you caused them.',
      protocolId: 'naikan-three',
    },
    {
      name: 'Be concrete and specific',
      text: 'Not "my mother did a lot" but particular meals, acts and sacrifices. Specificity is what makes the shift in perspective real.',
      protocolId: 'naikan-specific',
    },
    {
      name: 'Resist the fourth question',
      text: 'When the mind jumps to how they wronged you, gently set it aside and return to the three. Its deliberate absence is the heart of the method.',
      protocolId: 'naikan-resist',
    },
  ],
}

export default [article]
