import type { ToolReviewInput } from './types'

const headspace: ToolReviewInput = {
  slug: 'headspace',
  name: 'Headspace',
  brand: 'Headspace',
  category: 'meditation-app',
  productType: 'Meditation app',
  description:
    'ONDA review of Headspace — the best app for learning to meditate, with structured, research-backed courses. Scored on teaching, library and value.',
  verdict:
    'The best app for actually learning to meditate — structured courses and clear teaching, with a free tier that is barely a sample.',
  summary:
    'Headspace is the strongest app here for learning to meditate from scratch. Its courses are well-structured, the teaching is clear and beginner-friendly, and it has put real research behind its claims. The weak point is the free tier — essentially a product tour.',
  scores: [
    { criterionId: 'content-library', score: 8.0, note: 'A large library covering meditation, breathing, focus, sleep and many life topics.' },
    { criterionId: 'teaching', score: 8.5, note: 'The clearest, most structured teaching here — built to take a complete beginner from zero.' },
    { criterionId: 'personalization', score: 8.0, note: 'Structured courses, daily check-ins and recommendations build a real progression.' },
    { criterionId: 'app-experience', score: 8.5, note: 'A friendly, polished app — the signature animations make the practice approachable.' },
    { criterionId: 'free-tier', score: 5.0, note: 'Free content is essentially a product tour; a practice needs the subscription.' },
    { criterionId: 'value', score: 7.0, note: 'Around 70 USD a year — reasonable for the structured course library.' },
    { criterionId: 'evidence', score: 7.5, note: 'Headspace has been tested in independent university trials; studies Headspace funded itself do not count as evidence in ONDA scores. Still strong for the category.' },
  ],
  pros: [
    'The best structured path for beginners',
    'Clear, credible teaching',
    'Research-backed programs',
    'Friendly, polished app',
  ],
  cons: [
    'Free tier is barely a sample',
    'Less raw library breadth than Insight Timer',
    'A subscription is needed for any real practice',
    'Can feel light once you are past the basics',
  ],
  bestFor: 'Best for beginners learning to meditate from scratch — structured courses and clear teaching.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — from public information, app-store data and independent 2026 reviews. Not based on a long hands-on trial by ONDA.',
  price: { usd: 70, note: 'per year', asOf: '2026-05-15' },
  link: 'https://www.headspace.com',
  linkType: 'official',
  content: `## Where it leads

Headspace is the app to choose if you want to actually learn to meditate. Its courses are genuinely structured — they take a complete beginner from "what is meditation" to a steady daily practice — and the teaching is the clearest in this comparison. Headspace has also funded and published clinical research on its programs, which, for an evidence-minded user, sets it apart from apps that lean on vague wellness language.

## What are the downsides of Headspace?

The free tier is the weak point: it is essentially a guided tour of the product, not enough to build a practice on. The library, while broad, does not match the sheer volume of Insight Timer, and once you are past the foundational courses Headspace can start to feel light next to the depth Waking Up offers.

## Who should buy Headspace?

Choose Headspace if you are new to meditation and want a clear, well-taught path rather than an overwhelming library — and you are willing to subscribe. If you want depth beyond the basics, or a usable free option, Waking Up and Insight Timer are the better fits.

---

## Background reading

The science of what meditation actually does at the nervous-system level.

- [Rhythmic entrainment and system frequencies](/articles/rhythmic-entrainment-system-frequencies) — why paced audio and breath protocols compound with practice
- [Physiological concentration: flow-state hardwiring](/articles/physiological-concentration-flow-state-hardwired) — what neurochemistry the flow state actually requires
- [Alpha brain waves: calm, creativity and flow](/articles/neural-bridge-alpha-flow-gateway) — what the alpha rhythm does, and what alpha headsets, apps and music can and cannot change
`,
  references: [
    { label: 'Headspace — official site', url: 'https://www.headspace.com' },
    { label: 'Headspace clinical studies (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=headspace+meditation+randomized+controlled+trial' },
  ],
  relatedSlugs: ['insight-timer', 'calm', 'waking-up'],
  faq: [
    { q: "Is Headspace good for beginners?", a: "Yes. Headspace is the strongest app for learning to meditate from scratch. Its courses are well structured, the teaching is clear and beginner-friendly, and it has put real research behind its programs. Once you are past the basics, though, it can start to feel light." },
    { q: "Is Headspace free?", a: "Not in any meaningful way. The Headspace free tier is barely a sample, essentially a product tour, so a subscription is needed for any real practice. The paid plan costs about $70 per year and unlocks the structured courses that make the app worth using." },
    { q: "Headspace vs Insight Timer: which is better?", a: "Headspace is better for structured learning, with clear courses that guide beginners step by step. Insight Timer is better for breadth and value, with a far larger library and a genuinely usable free tier. Pick Headspace to learn the basics; pick Insight Timer if you want variety." },
  ],
  datePublished: '2026-05-15',
  dateModified: '2026-05-15',
}

export default headspace
