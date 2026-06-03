/**
 * Cognitive Shuffle (Serial Diverse Imagining) sleep tool.
 *
 * The technique, developed by cognitive scientist Luc Beaudoin (Simon Fraser
 * University), feeds the mind a stream of random, unrelated, concrete words to
 * imagine for a moment each. This "serial diverse imagining" mimics the loose,
 * disconnected imagery the brain produces just before sleep, and crowds out the
 * coherent worry-loops that keep people awake — lowering pre-sleep cognitive
 * arousal so sleep can come.
 *
 * This player shows (and optionally speaks) one neutral word at a time on a
 * timer. Educational sleep aid, not a treatment for clinical insomnia.
 */

import type { ScienceSource } from './sources'

/** Concrete, emotionally neutral, easily picturable nouns — nothing stressful,
 *  abstract or task-like that could re-engage the thinking mind. */
export const SHUFFLE_WORDS: string[] = [
  'mushroom', 'fence', 'telescope', 'lantern', 'pebble', 'kettle', 'maple', 'otter',
  'balloon', 'ladder', 'candle', 'harbor', 'feather', 'pumpkin', 'anchor', 'willow',
  'marble', 'compass', 'acorn', 'igloo', 'cabin', 'violin', 'pebbles', 'meadow',
  'snowflake', 'pinecone', 'hammock', 'seashell', 'windmill', 'driftwood', 'pebble path',
  'umbrella', 'teapot', 'sailboat', 'pebbled', 'birch', 'pond', 'fern', 'beehive',
  'cobweb', 'cushion', 'thimble', 'lighthouse', 'kite', 'mitten', 'wheelbarrow', 'satchel',
  'turnip', 'pebble beach', 'glacier', 'orchard', 'pebble stream', 'haystack', 'tortoise',
  'lavender', 'cobblestone', 'paper boat', 'jellyfish', 'firefly', 'pinwheel', 'snow globe',
  'clover', 'pebble wall', 'moss', 'dewdrop', 'cocoon', 'pebble garden', 'wind chime',
  'paper crane', 'sand dune', 'starfish', 'toadstool', 'birdhouse', 'butter dish',
  'rowboat', 'pebble shore', 'mossy log', 'lily pad', 'snail', 'chestnut', 'gourd',
  'icicle', 'paper lantern', 'tumbleweed', 'barn', 'spinning top', 'marbles', 'quilt',
  'apricot', 'beanstalk', 'koala', 'mossy stone', 'paper kite', 'thicket', 'bramble',
  'hedgehog', 'wheelchair ramp', 'pebble bridge', 'reed', 'rolling pin', 'dandelion',
  'snowman', 'pebble pile', 'walnut', 'lantern light', 'flamingo', 'periscope', 'canoe',
  'mossy roof', 'paper plane', 'sugar cube', 'pebble nest', 'birch bark', 'pillow',
  'cattail', 'cinnamon stick', 'wooden spoon', 'pebble row', 'meadow grass', 'fox',
  'lantern glow', 'pinecone trail', 'sailcloth', 'pebble heap', 'wheelbarrow wheel',
  'acorn cap', 'mossy bank', 'paper boat sail', 'snow drift', 'tortoise shell', 'fern frond',
  'beach pail', 'driftwood log', 'lantern post', 'pebble track', 'willow branch',
  'marble run', 'compass needle', 'igloo dome', 'cabin window', 'violin string',
]

/** Pick a random word that is not the one currently shown. */
export function pickShuffleWord(exclude?: string): string {
  if (SHUFFLE_WORDS.length <= 1) return SHUFFLE_WORDS[0]
  let w = exclude
  // Loop is bounded: the array has many entries, so this resolves immediately.
  while (!w || w === exclude) {
    w = SHUFFLE_WORDS[Math.floor(Math.random() * SHUFFLE_WORDS.length)]
  }
  return w
}

export const SHUFFLE_SOURCES: ScienceSource[] = [
  {
    authors: 'Beaudoin LP',
    year: 2014,
    title: 'A design-based approach to sleep-onset and insomnia: super-somnolent mentation, the cognitive shuffle and serial diverse imagining',
    journal: 'Proceedings of the 36th Annual Conference of the Cognitive Science Society',
    contributes: 'Origin of the cognitive shuffle / serial diverse imagining technique and its sleep-onset rationale.',
    url: 'https://www.researchgate.net/publication/267337398',
  },
  {
    authors: 'Digdon N, Beaudoin LP',
    year: 2016,
    title: 'Serial diverse imagining task: a new remedy for bedtime complaints of worrying and other sleep-disruptive mental activity',
    journal: 'SLEEP 2016 (AASM & Sleep Research Society annual meeting), Denver, CO',
    contributes: 'Randomised study (n=154 students) showing improved sleep quality, sleep-onset difficulty and pre-sleep arousal.',
    url: 'https://www.researchgate.net/publication/300004607',
  },
]

export const SHUFFLE_METHODOLOGY =
  'Cognitive shuffling — formally "serial diverse imagining" — was developed by cognitive scientist Luc Beaudoin (Simon Fraser University). The idea: deliberately imagining a stream of random, unrelated, concrete objects mimics the loose imagery the brain drifts through just before sleep, and blocks the coherent worry-loops and planning that keep cognitive arousal high. A randomised study by Digdon & Beaudoin (n=154) found the task improved sleep quality, time to fall asleep and pre-sleep arousal. Evidence is still early (small, mostly-student samples, conference-reported), but the technique is free, drug-free and very low-risk. This player presents one neutral word every few seconds; picture each one briefly, without forcing it, and let your attention wander. It is a sleep aid, not a treatment for clinical insomnia — see a clinician if sleep problems persist.'

export const SHUFFLE_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'What is cognitive shuffling?',
    a: 'Cognitive shuffling (or "serial diverse imagining") is a bedtime mental exercise: you picture a series of random, unrelated, concrete objects — mushroom, fence, telescope — for a moment each. The disconnected imagery resembles what your brain naturally does as it falls asleep, and it interrupts the runaway thinking and worrying that keep you awake.',
  },
  {
    q: 'Does cognitive shuffling actually work?',
    a: 'There is promising early evidence. A randomised study by Digdon & Beaudoin (154 students) found the technique improved sleep quality, difficulty falling asleep and pre-sleep arousal, with benefits lasting across a semester. It is not a cure for clinical insomnia and the research base is still small, but it is free, drug-free and very low-risk to try.',
  },
  {
    q: 'How do I use this tool?',
    a: 'Lie down comfortably with the screen dimmed, press start, and let the words come one at a time. Picture each word for a second or two — no effort, no story, no judging — then let it go as the next appears. If your mind wanders back to your worries, just return to the next word. Many people drift off before the list runs long.',
  },
  {
    q: 'Why random, neutral words instead of relaxing imagery?',
    a: 'Guided relaxation, "sleep journeys" and structured visualisation still require focused attention and a coherent thread — which keeps part of the mind engaged. Random, unconnected words do the opposite: they give the mind something harmless and incoherent to chew on, closer to the fragmented imagery of sleep onset, so it can let go rather than lock onto a thought.',
  },
  {
    q: 'Where does this technique come from?',
    a: 'It was developed by cognitive scientist Luc Beaudoin at Simon Fraser University, who described "serial diverse imagining" and the "cognitive shuffle" (Beaudoin 2014) and studied it with Nancy Digdon (2016). Full citations are in the Sources section on this page.',
  },
]
