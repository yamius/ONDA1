import type { ToolReviewInput } from './types'

const healthyMindsProgram: ToolReviewInput = {
  slug: 'healthy-minds-program',
  name: 'Healthy Minds Program',
  brand: 'Healthy Minds Innovations',
  category: 'meditation-app',
  productType: 'Meditation app',
  description:
    'ONDA review of the Healthy Minds Program — the most scientifically grounded meditation app, completely free. Scored on teaching, evidence and value.',
  verdict:
    'The most scientifically grounded app here — completely free, ad-free, built by a neuroscientist and validated in dozens of studies.',
  summary:
    'The Healthy Minds Program is the most evidence-grounded app in this comparison, and it is completely free. Founded by neuroscientist Richard Davidson and validated across dozens of peer-reviewed studies, it teaches a structured framework — Awareness, Connection, Insight, Purpose — with no ads and no subscription.',
  scores: [
    { criterionId: 'content-library', score: 7.0, note: 'A focused, structured library rather than a sprawling one — quality over sheer volume.' },
    { criterionId: 'teaching', score: 8.0, note: 'Grounded in the research framework of neuroscientist Richard Davidson — credible and well-sequenced.' },
    { criterionId: 'personalization', score: 6.5, note: 'A clear fixed journey — Foundations through Purpose — rather than an adaptive plan.' },
    { criterionId: 'app-experience', score: 7.5, note: 'Clean and calm, with no ads and no upsells interrupting practice.' },
    { criterionId: 'free-tier', score: 10.0, note: 'Completely free — no subscription, no ads, no locked content.' },
    { criterionId: 'value', score: 9.5, note: 'Free, sustained by donations — nothing else here matches it on cost.' },
    { criterionId: 'evidence', score: 7.5, note: 'Outcomes measured across many peer-reviewed studies, but most come from the developer\'s affiliated Center for Healthy Minds; research by an organisation affiliated with the app is not independent and does not count as evidence in ONDA scores. Few independent studies remain.' },
  ],
  pros: [
    'Completely free — no subscription, no ads',
    'The most scientifically validated app here',
    'Founded by a leading neuroscientist',
    'A clear, well-sequenced framework',
  ],
  cons: [
    'A focused library, not a sprawling one',
    'A fixed journey rather than an adaptive plan',
    'Less polished production than Calm',
    'No sleep-story-style relaxation content',
  ],
  bestFor: 'Best for evidence-grounded practice — free, ad-free and the most studied app here.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — from public information, app-store data and independent 2026 reviews. Not based on a long hands-on trial by ONDA.',
  price: { usd: 0, note: 'completely free; donation-funded by the nonprofit Healthy Minds Innovations, no ads, no paywall', asOf: '2026-10-01' },
  link: 'https://hminnovations.org/meditation-app',
  linkType: 'official',
  content: `## Where it leads

The Healthy Minds Program is the most evidence-grounded app in this comparison, and it is completely free. It was founded by the neuroscientist Richard Davidson, it carries no ads and no subscription, and its outcomes have been measured across more than fifty peer-reviewed studies. The practice is built as a structured framework — Foundations, then Awareness, Connection, Insight and Purpose — so it teaches a coherent model of a trained mind, not just a catalogue of sessions.

## What are the downsides of Healthy Minds Program?

It is focused rather than vast: there is no sprawling library, no celebrity sleep stories, and the journey is fixed rather than adaptive. Production is clean but plainer than Calm's, and if you want endless variety or sleep-specific content, this is not that app.

## Who should buy Healthy Minds Program?

Choose the Healthy Minds Program if you want a free, ad-free practice grounded in real science and a clear framework — and you value substance over polish or breadth. It pairs especially well with anyone who came to meditation through an interest in the underlying neuroscience.

---

## Background reading

The science of what meditation actually does at the nervous-system level.

- [Neural entrainment through meditation](/articles/neural-entrainment-meditation-2) — why structured practice rewires baseline cortical states
- [Alpha brain waves: calm, creativity and flow](/articles/neural-bridge-alpha-flow-gateway) — what the alpha rhythm does, and what alpha headsets, apps and music can and cannot change
- [Rhythmic entrainment and system frequencies](/articles/rhythmic-entrainment-system-frequencies) — why paced audio and breath protocols compound with practice
`,
  references: [
    { label: 'Healthy Minds Program — official site', url: 'https://hminnovations.org/meditation-app' },
    { label: 'Meditation app clinical research (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=meditation+app+randomized+controlled+trial' },
  ],
  relatedSlugs: ['smiling-mind', 'medito', 'waking-up'],
  faq: [
    { q: "Is the Healthy Minds Program really free?", a: "Yes. The Healthy Minds Program is completely free, with no subscription and no ads, because it is donation-funded. Despite the zero price, it is the most scientifically validated app in its comparison, backed by dozens of peer-reviewed studies." },
    { q: "Who created the Healthy Minds Program?", a: "The Healthy Minds Program was founded by neuroscientist Richard Davidson. It teaches a structured framework built on four pillars, Awareness, Connection, Insight and Purpose, and has been validated across dozens of peer-reviewed studies, making it the most evidence-grounded app in the comparison." },
    { q: "What are the downsides of the Healthy Minds Program?", a: "Its library is focused rather than sprawling, and it follows a fixed journey instead of an adaptive plan. Production is less polished than Calm, and there is no sleep-story-style relaxation content. For evidence-based practice at zero cost, those trade-offs are modest." },
  ],
  datePublished: '2026-05-15',
  dateModified: '2026-10-10',
}

export default healthyMindsProgram
