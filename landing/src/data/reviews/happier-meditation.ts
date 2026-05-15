import type { ToolReview } from './types'

const happierMeditation: ToolReview = {
  slug: 'happier-meditation',
  name: 'Happier Meditation',
  brand: 'Happier',
  category: 'meditation-app',
  productType: 'Meditation app',
  description:
    'ONDA review of Happier Meditation (formerly Ten Percent Happier) — built around teaching quality. Scored on teaching, library, app experience and value.',
  verdict:
    'Excellent, relatable teachers and a polished app — formerly Ten Percent Happier — held back only by a premium price.',
  summary:
    'Happier Meditation — formerly Ten Percent Happier — is built around the quality of its teachers. Its 500-plus guided sessions come from a relatable, expert roster, and the app is polished and well-reviewed. The catch is price: at around 100 USD a year it is one of the more expensive options.',
  overallScore: 7.4,
  scores: [
    { criterionId: 'content-library', score: 7.5, note: 'Over 500 guided meditations plus courses — a solid, well-curated library.' },
    { criterionId: 'teaching', score: 8.5, note: 'The strongest card here — a relatable, expert roster of teachers, consistently praised by reviewers.' },
    { criterionId: 'personalization', score: 7.5, note: 'Courses and recommendations build a coherent path.' },
    { criterionId: 'app-experience', score: 8.0, note: 'Polished and user-friendly — an Apple "Best Of" winner.' },
    { criterionId: 'free-tier', score: 5.0, note: 'A limited free selection; the library needs a subscription.' },
    { criterionId: 'value', score: 6.0, note: 'Around 100 USD a year — pricier than Calm or Headspace.' },
    { criterionId: 'evidence', score: 7.5, note: 'Skeptic-friendly framing and credible, named teachers rather than vague wellness language.' },
  ],
  pros: [
    'Excellent, relatable expert teachers',
    'Polished, well-reviewed app',
    '500-plus guided meditations and courses',
    'Skeptic-friendly, no-woo framing',
  ],
  cons: [
    'One of the most expensive apps here',
    'Thin free tier',
    'Library smaller than Insight Timer or Calm',
    'Recent rebrand from Ten Percent Happier may confuse search',
  ],
  bestFor: 'Best for teaching quality — a relatable, expert roster across 500-plus guided sessions.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — from public information, app-store data and independent 2026 reviews. Not based on a long hands-on trial by ONDA.',
  price: { usd: 100, note: 'per year (formerly Ten Percent Happier)', asOf: '2026-05-15' },
  link: 'https://www.meditatehappier.com',
  linkType: 'official',
  content: `## Where it leads

Happier Meditation — the app formerly known as Ten Percent Happier — is built around one thing above all: the quality of its teachers. Its 500-plus guided meditations come from a relatable, expert roster, and reviewers consistently single out the calibre and variety of the voices. The app itself is polished and easy to use, an Apple "Best Of" winner, and its skeptic-friendly framing avoids the vague wellness language that puts some people off the category.

## Where it falls short

Price is the sticking point. At around 100 USD a year it is one of the more expensive options here — more than Calm or Headspace — and the free tier is thin, so the teaching everyone praises sits behind a subscription. The library, while well-curated, is not as deep as Insight Timer's.

## Who it is for

Choose Happier Meditation if teaching quality is what you care about most and the price is acceptable. If you want the same calibre of instruction with more philosophical depth, look at Waking Up; if budget matters, Insight Timer and the free apps deliver more for less.`,
  references: [
    { label: 'Happier Meditation — official site', url: 'https://www.meditatehappier.com' },
    { label: 'Meditation app clinical research (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=meditation+app+randomized+controlled+trial' },
  ],
  relatedSlugs: ['headspace', 'waking-up', 'calm'],
  datePublished: '2026-05-15',
  dateModified: '2026-05-15',
}

export default happierMeditation
