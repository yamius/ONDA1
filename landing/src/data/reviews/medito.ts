import type { ToolReview } from './types'

const medito: ToolReview = {
  slug: 'medito',
  name: 'Medito',
  brand: 'Medito Foundation',
  category: 'meditation-app',
  productType: 'Meditation app',
  description:
    'ONDA review of Medito — the completely free, open-source, ad-free meditation app. Scored on library, free tier, app experience and value.',
  verdict:
    'Completely free, open-source and ad-free, with no account required — the no-strings choice, if you can accept a smaller library.',
  summary:
    'Medito is the no-strings app: completely free, open-source, ad-free, with no account required and no premium tier. Built by an Amsterdam nonprofit, it covers the fundamentals well. What it does not have is the depth or breadth of the paid giants.',
  overallScore: 7.4,
  scores: [
    { criterionId: 'content-library', score: 6.5, note: 'Covers the fundamentals well — beginner courses, breathing, sleep, stress — but smaller than the giants.' },
    { criterionId: 'teaching', score: 7.0, note: 'Solid, with a diverse set of narrators; the quality is genuine if not deep.' },
    { criterionId: 'personalization', score: 6.0, note: 'Straightforward courses and sessions rather than an adaptive plan.' },
    { criterionId: 'app-experience', score: 8.0, note: 'Clean and calm, with no ads, no upsells and no account required.' },
    { criterionId: 'free-tier', score: 10.0, note: 'Completely free — no trials, no premium tier, no locked content. Ever.' },
    { criterionId: 'value', score: 9.5, note: 'Free and open-source, sustained by a nonprofit — unbeatable on cost.' },
    { criterionId: 'evidence', score: 6.0, note: 'An honest, nonprofit project rather than a research-led program.' },
  ],
  pros: [
    'Completely free, open-source and ad-free',
    'No account required — privacy-friendly',
    'Covers the fundamentals well',
    'Backed by a transparent nonprofit',
  ],
  cons: [
    'Smaller library than the paid giants',
    'No adaptive personalisation',
    'Not a research-led app',
    'Less depth for advanced practice',
  ],
  bestFor: 'Best for a fully free, ad-free, open-source app with no account and no paywall.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — from public information, app-store data and independent 2026 reviews. Not based on a long hands-on trial by ONDA.',
  price: { usd: 0, note: 'completely free; open-source nonprofit, no ads', asOf: '2026-05-15' },
  link: 'https://meditofoundation.org/medito-app',
  linkType: 'official',
  content: `## Where it leads

Medito is the no-strings app. Built by the Medito Foundation, an Amsterdam nonprofit with open-source code, it follows a simple principle: no trials, no premium tier, nothing locked behind a paywall, ever. It needs no account, runs no ads, and still covers the fundamentals properly — beginner courses, breathing exercises, sleep meditations and sessions for stress and anxiety. For a free, private, genuinely independent option, it is the cleanest one here.

## Where it falls short

It is the fundamentals, not the full range. The library is smaller than the paid giants and shorter on advanced material, there is no adaptive personalisation, and it is an honest community project rather than a research-led program like the Healthy Minds Program. Depth runs out sooner.

## Who it is for

Choose Medito if you want a completely free, ad-free, open-source app with no account and no upsells — especially if you are privacy-conscious or simply opposed to paying to meditate. If you want a larger library or a science-led framework, Insight Timer and the Healthy Minds Program go further.`,
  references: [
    { label: 'Medito — official site', url: 'https://meditofoundation.org/medito-app' },
    { label: 'Meditation app clinical research (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=meditation+app+randomized+controlled+trial' },
  ],
  relatedSlugs: ['healthy-minds-program', 'smiling-mind', 'insight-timer'],
  datePublished: '2026-05-15',
  dateModified: '2026-05-15',
}

export default medito
