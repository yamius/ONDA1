import type { ToolReview } from './types'

const insightTimer: ToolReview = {
  slug: 'insight-timer',
  name: 'Insight Timer',
  brand: 'Insight Timer',
  category: 'meditation-app',
  productType: 'Meditation app',
  description:
    'ONDA review of Insight Timer — the largest meditation library and the most usable free tier. Scored on library, teaching, personalisation and value.',
  verdict:
    'The largest meditation library on earth, and the only app here you can genuinely use for free — variable quality is the price.',
  summary:
    'Insight Timer is the largest meditation library in the world and the rare app you can build a real practice on without paying. It works like a YouTube for meditation: enormous range, many teachers, hourly live events — and, inevitably, variable quality.',
  overallScore: 8.0,
  scores: [
    { criterionId: 'content-library', score: 9.5, note: 'The largest meditation library anywhere — hundreds of thousands of guided sessions and courses.' },
    { criterionId: 'teaching', score: 7.5, note: 'A huge range of teachers and traditions; depth is there, but quality varies session to session.' },
    { criterionId: 'personalization', score: 6.5, note: 'Less guided than course-led apps — you largely curate your own path.' },
    { criterionId: 'app-experience', score: 7.0, note: 'Functional and feature-rich, but the sheer volume can make it feel cluttered.' },
    { criterionId: 'free-tier', score: 9.5, note: 'The standout free tier in the category — a genuine practice is possible without paying.' },
    { criterionId: 'value', score: 8.5, note: 'The cheapest paid tier here, on top of the largest free library — the value leader.' },
    { criterionId: 'evidence', score: 6.0, note: 'Quality and grounding vary widely across a crowd-sourced library.' },
  ],
  pros: [
    'The largest meditation library in the world',
    'A genuinely usable free tier — rare in this category',
    'Cheapest paid tier, plus hourly live events and community',
    'A huge range of teachers and traditions',
  ],
  cons: [
    'Quality varies session to session',
    'Less structured guidance than course-led apps',
    'The volume can feel cluttered and hard to navigate',
    'Crowd-sourced content is unevenly grounded',
  ],
  bestFor: 'Best overall — the largest library, a genuinely usable free tier and the strongest value.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — from public information, app-store data and independent 2026 reviews. Not based on a long hands-on trial by ONDA.',
  price: { usd: 60, note: 'per year (Member Plus); a very large free tier', asOf: '2026-05-15' },
  link: 'https://insighttimer.com',
  linkType: 'official',
  content: `## Where it leads

Insight Timer is the largest meditation library in the world, and the one app in this comparison you can genuinely build a practice on without paying. It works less like a curated course and more like a YouTube for meditation: hundreds of thousands of sessions, thousands of teachers, hourly live events and an active community. For range — and for a free tier that is a real offer rather than a teaser — nothing here comes close.

## Where it falls short

Breadth has a cost. Because the library is crowd-sourced, quality varies session to session, and there is far less structured hand-holding than a Headspace course gives you — you largely curate your own path. The app is feature-rich to the point of feeling cluttered, and the content is unevenly grounded.

## Who it is for

Choose Insight Timer if you want the widest possible choice, strong value, and the freedom to practise for free — and you are comfortable doing some of the curation yourself. If you would rather be guided along a clear, vetted path, Headspace is the more structured choice.`,
  references: [
    { label: 'Insight Timer — official site', url: 'https://insighttimer.com' },
    { label: 'Meditation app clinical research (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=meditation+app+randomized+controlled+trial' },
  ],
  relatedSlugs: ['headspace', 'calm', 'waking-up'],
  datePublished: '2026-05-15',
  dateModified: '2026-05-15',
}

export default insightTimer
