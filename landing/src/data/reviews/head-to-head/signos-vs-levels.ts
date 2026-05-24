import type { HeadToHead } from '../types'

const signosVsLevels: HeadToHead = {
  slug: 'signos-vs-levels',
  productASlug: 'signos',
  productBSlug: 'levels',
  title: 'Signos vs Levels (2026)',
  description:
    'Signos vs Levels — side-by-side ONDA comparison of two CGM programmes on Dexcom G7. Weight-loss AI coaching versus the deepest biohacker insight engine.',
  intro:
    'Signos and Levels are the two CGM programmes most often compared once buyers narrow the field to Dexcom G7 hardware. Same sensor underneath, different goals on top. Signos was built for weight loss — an AI agent pushing meal-by-meal nudges to flatten glucose spikes. Levels was built as a biohacker insight engine — the deepest meal-impact analytics with a credible medical advisory board. The decision is about which job you have.',
  winnerSlug: null,
  verdict:
    'Different jobs. Signos for weight loss with AI coaching pushing daily behaviour change. Levels for ongoing biohacker insight without a weight-loss framing.',
  bestForA:
    'Choose Signos if weight loss is the primary reason you are wearing a CGM and you respond well to in-app AI nudges — meal-by-meal suggestions, exercise prompts, snack-stack advice.',
  bestForB:
    'Choose Levels if you treat CGM as a general-purpose biohacker instrument — running protocols, tracking time-in-range, iterating on meal experiments without a weight-loss frame.',
  axes: [
    { name: 'Sensor accuracy', winner: 'tie', note: 'Both run Dexcom G7 — same hardware, same MARD ~8.2%, same 10-day wear. Indistinguishable on sensor.' },
    { name: 'Programme goal', winner: 'tie', note: 'Signos: weight loss via glucose-spike management. Levels: general biohacker insight. Different jobs.' },
    { name: 'Coaching model', winner: 'a', note: 'Signos: real-time AI agent surfacing meal-by-meal nudges and exercise prompts. Levels: app-only insights, no real-time coaching.' },
    { name: 'Insight depth', winner: 'b', note: 'Levels has the deeper meal-impact engine — AUC decomposition, food-by-food ranking history, time-in-range views. Signos is competent but weight-loss framed.' },
    { name: 'Content library', winner: 'b', note: 'Levels has a substantial editorial library backed by its medical advisory board. Signos leans on the AI nudges instead.' },
    { name: 'Behavioural directiveness', winner: 'a', note: 'Signos is the most directly behavioural programme in the category — it tells you what to do in the moment. Levels surfaces the data and trusts you to interpret it.' },
    { name: 'Weight-loss outcome data', winner: 'a', note: 'Signos publishes company outcome data for weight-loss specifically. Levels does not market a weight-loss outcome at all.' },
    { name: 'Price', winner: 'a', note: 'Signos: $140–$160/month. Levels: $199/month. Signos is meaningfully cheaper.' },
  ],
  faq: [
    {
      q: 'Should I pick Signos or Levels?',
      a: 'Signos if weight loss is the primary goal and you respond to AI coaching nudges. Levels if you treat CGM as a general biohacker instrument and want the deepest insight engine without a weight-loss framing. Different jobs.',
    },
    {
      q: 'Are Signos and Levels the same hardware?',
      a: 'Yes. Both ship Dexcom G7 — the same sensor with the same 10-day wear and the same MARD ~8.2% accuracy. The differentiation is the app, the coaching model and the framing.',
    },
    {
      q: 'Does Signos really work for weight loss?',
      a: 'Company outcome data shows meaningful loss in the user base; independent peer-reviewed validation is thinner. The AI coaching loop is the behavioural mechanism — for users who respond to in-app nudges it works; for users who do not, the data alone is not what makes Levels different.',
    },
    {
      q: 'Is Signos cheaper than Levels?',
      a: 'Yes — Signos is $140–$160/month versus Levels at $199. Both include Dexcom G7 sensors. Over a year the difference is roughly $500.',
    },
  ],
  content: `## The short version

Signos and Levels ship the same Dexcom G7 sensor. The decision is whether you want AI weight-loss coaching or a general-purpose biohacker insight engine. They solve different jobs, even though they look like the same product.

## When Signos is the right pick

If weight loss is the explicit reason you are wearing a CGM and you respond well to in-app AI nudges pushing meal-by-meal recommendations, Signos is the right shape. The behavioural directiveness is the value — and it costs ~$500/year less than Levels.

## When Levels is the right pick

If you treat CGM as a general-purpose self-experimentation instrument — running fasting protocols, tracking time-in-range as a metric, iterating on food curves week by week without a weight-loss frame — Levels is the right shape. The deeper insight engine and the broader content library are what the premium pays for.`,
  relatedComparisonSlug: 'best-cgm-for-biohackers-2026',
  datePublished: '2026-05-22',
  dateModified: '2026-05-22',
}

export default signosVsLevels
