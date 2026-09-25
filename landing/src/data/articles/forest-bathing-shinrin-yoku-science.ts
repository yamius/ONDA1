import type { Article } from './types'

/**
 * Forest bathing (shinrin-yoku) — Japanese research measured the autonomic shift. Grounded: nationwide
 * 38-forest field study (Park/Miyazaki: cortisol −12.4%, sympathetic −7.0%, systolic BP −1.4%, HR −5.8%,
 * parasympathetic +55.0% vs city) + Gunma older-adults study (BP, POMS mood, blood cortisol, NK-cell ↑);
 * phytoncides (terpenes) via olfactory pathway. AEO reference + howToSteps + FAQ. Numbers attributed to
 * the studies (no fabricated DOIs); NK/immune described as measured, no cure claim; camera=pulse, watch=HRV.
 */
const article: Article = {
  slug: 'forest-bathing-shinrin-yoku-science',
  title: 'Forest Bathing (Shinrin-yoku): What Japanese Research Actually Measured',
  seoTitle: 'Forest Bathing (Shinrin-yoku): The Science | ONDA Life',
  description:
    'Forest bathing lowers cortisol, blood pressure and sympathetic activity while boosting parasympathetic tone — Japanese studies across 38 forests measured exactly how much. The science of shinrin-yoku.',
  category: 'Biological Software',
  relatedSlugs: ['how-to-lower-cortisol', 'coherent-breathing-guide', 'how-to-raise-hrv-naturally', 'cold-exposure-vagus-nerve', 'breathing-lowers-stress-hormones'],
  introStyle: 'emerald',
  image: '/images/articles/forest-bathing-shinrin-yoku-science.jpg',
  imageAlt:
    'Forest Bathing (Shinrin-yoku) — illustration: a person walking slowly through a misty Japanese cedar forest, beams of light through the trees, tiny glowing particles floating in the air.',
  imageTitle: 'Forest Bathing (Shinrin-yoku)',
  imagePlacement: 'header',
  neuralSuggestion: {
    text: 'Not "nature is nice" — a measured autonomic shift, partly from what you breathe. Watch your own before/after.',
    link: '/measurements',
    linkText: 'What ONDA measures →',
  },
  content: `
Forest bathing — *shinrin-yoku*, coined in Japan in the 1980s — is the practice of spending calm, unhurried time among trees, and Japanese research has measured its effects precisely. In a nationwide study across 38 forests, from Okinawa to Hokkaido, time in the forest versus the city lowered the stress hormone [cortisol](/glossary/cortisol) by 12.4%, reduced sympathetic ("fight or flight") activity by 7.0%, dropped blood pressure and heart rate, and raised parasympathetic ("rest and digest") activity by a striking 55.0%. This isn't vague "nature is nice" wellness — it's a measured autonomic shift toward calm, driven in part by airborne compounds trees release. Japan turned an intuition into science, which is exactly why the rest of the world took notice.

## From feeling to science

For most of history, "a walk in the woods is good for you" was folk wisdom. What Japanese researchers did — led by figures like Yoshifumi Miyazaki and Qing Li at Nippon Medical School — was measure it: blood pressure, heart rate variability, salivary and blood cortisol, sympathetic and parasympathetic activity, and even immune markers, before and after forest exposure, compared against matched city walks. That shift from feeling to data is what made shinrin-yoku a serious research field and a recognized preventive-health practice in Japan.

The design matters: by comparing a forest walk to an equivalent urban walk, these studies isolated the *environment's* effect from the exercise itself. The forest did something the city street didn't.

## What the studies measured

The findings are remarkably consistent across studies:

- **The nationwide field study (38 forests).** Compared to urban settings, forest environments produced: cortisol down 12.4%, sympathetic nervous activity down 7.0%, systolic blood pressure down 1.4%, heart rate down 5.8%, and parasympathetic activity up 55.0%. In plain terms — less stress hormone, less "fight or flight," more "rest and digest."
- **A controlled study in older adults (Gunma forest).** One hour walking in a forest versus non-forest farmland produced significant drops in blood pressure, reduced depressive mood on psychological testing (POMS), lower blood cortisol — and increased natural killer (NK) cell activity, part of the immune system's anti-microbial and anti-tumor defense.

Together they show forest bathing shifting the whole system: nervous system toward calm, stress hormones down, and even immune markers up.

## Phytoncides: why the air itself matters

The most distinctive finding is that part of the effect comes from what you *breathe*, not just what you see. Trees release volatile compounds called **phytoncides** — terpenes and similar molecules that plants emit to defend against microbes. Japanese research proposes that inhaling phytoncides calms the brain through the olfactory (smell) pathway, helping balance the autonomic nervous system, suppress stress-hormone release, and boost NK-cell activity.

This is why forest bathing isn't just "outdoor exercise." Air analysis in the studied forests measured these tree-derived compounds directly, linking the chemistry of the forest air to the measured drop in stress. You're not only moving and relaxing — you're breathing a subtly medicinal atmosphere.

## How to actually do shinrin-yoku

Forest bathing is deliberately slow and sensory — the opposite of a workout:

- **Go slowly.** It's not a hike for distance or speed. Wander, pause, stand still.
- **Use your senses.** Notice the light, the sounds, the smell of the trees (that scent is the phytoncides). Breathe it in.
- **Put the phone away.** The benefit comes from unhurried, undistracted presence — the same reason a screen-free walk resets you.
- **Give it time.** The studies used sessions of roughly an hour or more. Even shorter helps, but don't rush it.
- **Breathe slowly while you're there.** Pairing [slow breathing](/articles/coherent-breathing-guide) with forest air combines two parasympathetic levers at once — much like [cold exposure](/articles/cold-exposure-vagus-nerve) is another direct vagal lever.

You don't need a remote wilderness — a quiet park with real trees delivers much of the effect. For the hormone side of the same calm, see [how to lower cortisol](/articles/how-to-lower-cortisol).

## See your own shift

The calm that forest bathing produces is a measurable autonomic change — exactly the kind ONDA tracks. Read your resting heart rate from your phone camera, or your HRV from your Apple Watch, before and after time among trees, and you can watch your own parasympathetic shift: pulse settling, HRV rising. It turns "I feel better after the woods" into something you can actually see in your numbers.
`,
  howToSteps: [
    {
      name: 'Go slowly — it is not a hike',
      text: 'Wander, pause, stand still. Forest bathing is about presence, not distance or speed.',
      protocolId: 'sy-slow',
    },
    {
      name: 'Engage your senses',
      text: 'Notice the light, the sounds and the smell of the trees — that scent is the phytoncides. Breathe it in.',
      protocolId: 'sy-senses',
    },
    {
      name: 'Put the phone away',
      text: 'The benefit comes from unhurried, undistracted presence. Leave the screen alone.',
      protocolId: 'sy-unplug',
    },
    {
      name: 'Give it time and breathe slowly',
      text: 'Aim for roughly an hour or more of slow, sensory time among real trees; even a quiet park helps. Add slow breathing to stack two parasympathetic levers at once.',
      protocolId: 'sy-time',
    },
  ],
}

export default [article]
