import type { ToolReview } from './types'

const headspace: ToolReview = {
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
  overallScore: 7.8,
  scores: [
    { criterionId: 'content-library', score: 8.0, note: 'A large library covering meditation, breathing, focus, sleep and many life topics.' },
    { criterionId: 'teaching', score: 8.5, note: 'The clearest, most structured teaching here — built to take a complete beginner from zero.' },
    { criterionId: 'personalization', score: 8.0, note: 'Structured courses, daily check-ins and recommendations build a real progression.' },
    { criterionId: 'app-experience', score: 8.5, note: 'A friendly, polished app — the signature animations make the practice approachable.' },
    { criterionId: 'free-tier', score: 5.0, note: 'Free content is essentially a product tour; a practice needs the subscription.' },
    { criterionId: 'value', score: 7.0, note: 'Around 70 USD a year — reasonable for the structured course library.' },
    { criterionId: 'evidence', score: 8.0, note: 'Headspace has funded and published clinical research on its programs — strong for the category.' },
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

## Where it falls short

The free tier is the weak point: it is essentially a guided tour of the product, not enough to build a practice on. The library, while broad, does not match the sheer volume of Insight Timer, and once you are past the foundational courses Headspace can start to feel light next to the depth Waking Up offers.

## Who it is for

Choose Headspace if you are new to meditation and want a clear, well-taught path rather than an overwhelming library — and you are willing to subscribe. If you want depth beyond the basics, or a usable free option, Waking Up and Insight Timer are the better fits.`,
  references: [
    { label: 'Headspace — official site', url: 'https://www.headspace.com' },
    { label: 'Headspace clinical studies (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=headspace+meditation+randomized+controlled+trial' },
  ],
  relatedSlugs: ['insight-timer', 'calm', 'waking-up'],
  datePublished: '2026-05-15',
  dateModified: '2026-05-15',
}

export default headspace
