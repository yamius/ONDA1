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
    authors: 'Beaudoin LP, Lemyre A, Pudlo M, Bastien C',
    year: 2019,
    title: 'Towards an integrative design-oriented theory of sleep-onset and insomnolence from which a new cognitive treatment for insomnolence (serial diverse kinesthetic imagining, a form of cognitive shuffling) is proposed for experimentally testing this against alternatives',
    journal: 'Sleep Medicine 64 (Suppl 1): S29 (conference abstract)',
    contributes: 'Theory behind the cognitive shuffle / serial diverse imagining and its sleep-onset rationale, from the technique’s originator. A proposal for testing, not a trial result.',
    url: 'https://doi.org/10.1016/j.sleep.2019.11.081',
  },
]

export const SHUFFLE_METHODOLOGY =
  'Cognitive shuffling — formally "serial diverse imagining" — was developed by cognitive scientist Luc Beaudoin (Simon Fraser University). The idea: deliberately imagining a stream of random, unrelated, concrete objects mimics the loose imagery the brain drifts through just before sleep, and blocks the coherent worry-loops and planning that keep cognitive arousal high. Evidence is still early: the student studies of the technique were reported at conferences, and we could not find them in a peer-reviewed journal, so treat it as a plausible, untested-at-scale idea rather than a proven treatment. It is free, drug-free and very low-risk. This player presents one neutral word every few seconds; picture each one briefly, without forcing it, and let your attention wander. It is a sleep aid, not a treatment for clinical insomnia — see a clinician if sleep problems persist.'

export const SHUFFLE_FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'What is cognitive shuffling?',
    a: 'Cognitive shuffling (or "serial diverse imagining") is a bedtime mental exercise: you picture a series of random, unrelated, concrete objects — mushroom, fence, telescope — for a moment each. The disconnected imagery resembles what your brain naturally does as it falls asleep, and it interrupts the runaway thinking and worrying that keep you awake.',
  },
  {
    q: 'Does cognitive shuffling actually work?',
    a: 'It is not proven yet. The idea has a clear rationale, and the originator’s student studies were reported at conferences, but we could not find them published in a peer-reviewed journal, so there is no solid trial evidence either way. It is not a cure for clinical insomnia, but it is free, drug-free and very low-risk to try.',
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
    a: 'It was developed by cognitive scientist Luc Beaudoin at Simon Fraser University, who described "serial diverse imagining" and the "cognitive shuffle" in conference papers from 2014 onwards. The citation is in the Sources section on this page.',
  },
]
