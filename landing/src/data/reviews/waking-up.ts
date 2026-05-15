import type { ToolReview } from './types'

const wakingUp: ToolReview = {
  slug: 'waking-up',
  name: 'Waking Up',
  brand: 'Waking Up',
  category: 'meditation-app',
  productType: 'Meditation app',
  description:
    'ONDA review of Waking Up — Sam Harris’s app: the deepest teaching and philosophy in the category. Scored on teaching, library, evidence and value.',
  verdict:
    'The deepest, most rigorous app here — philosophy and serious instruction — but the most expensive, and not for beginners.',
  summary:
    'Waking Up, built by Sam Harris, is the most intellectually serious app in this comparison. It treats meditation as a way to examine consciousness, pairs practice with philosophy and conversations with leading thinkers, and is taught with unusual rigour. It is also the most expensive, and it is not built for beginners.',
  overallScore: 7.4,
  scores: [
    { criterionId: 'content-library', score: 7.0, note: 'A deliberately curated library — focused and deep rather than broad, with no real sleep content.' },
    { criterionId: 'teaching', score: 9.0, note: 'The deepest teaching here — Sam Harris plus high-calibre guest teachers, taught with rigour.' },
    { criterionId: 'personalization', score: 6.5, note: 'A structured 28-day course to start, but lighter on adaptive, ongoing personalisation.' },
    { criterionId: 'app-experience', score: 7.5, note: 'A clean, calm app that stays out of the way of the practice.' },
    { criterionId: 'free-tier', score: 6.5, note: 'A 30-day trial, plus a standing offer of free access to anyone who genuinely cannot afford it.' },
    { criterionId: 'value', score: 7.0, note: 'The most expensive here at around 130 USD a year — though the scholarship policy softens that.' },
    { criterionId: 'evidence', score: 8.5, note: 'A secular, intellectually rigorous approach grounded in neuroscience and named teaching lineages.' },
  ],
  pros: [
    'The deepest teaching and the highest-calibre instructors',
    'Pairs practice with philosophy and conversations with leading thinkers',
    'Secular and intellectually rigorous',
    'Free access for anyone who cannot afford it',
  ],
  cons: [
    'The most expensive app here',
    'Not built for complete beginners',
    'A smaller, curated library — no sleep content',
    'Lighter on adaptive personalisation',
  ],
  bestFor: 'Best for depth — serious instruction and philosophy, for practitioners past the basics.',
  testStatus: 'evidence-based',
  testNote:
    'Evidence-based assessment — from public information, app-store data and independent 2026 reviews. Not based on a long hands-on trial by ONDA.',
  price: { usd: 130, note: 'per year; free for anyone who genuinely cannot afford it', asOf: '2026-05-15' },
  link: 'https://www.wakingup.com',
  linkType: 'official',
  content: `## Where it leads

Waking Up, built by the neuroscientist and philosopher Sam Harris, is the most intellectually serious app in this comparison. It treats meditation not as a relaxation tool but as a way to examine the nature of consciousness, and it pairs practice with a genuine body of theory — lessons on philosophy and psychology, and conversations with leading thinkers. The teaching, from Harris and a set of high-calibre guest instructors, is the deepest and most rigorous here.

## Where it falls short

That depth is narrow by design. The library is curated and comparatively small, there is no sleep content, and the introductory course moves quickly into advanced ideas — a complete beginner can feel out of their depth. It is also the most expensive option, although a standing offer of free access to anyone who genuinely cannot afford it takes the edge off the price.

## Who it is for

Choose Waking Up if you already have a basic practice and want to go deeper — into rigorous instruction and the philosophy behind it — and the price (or the scholarship) works for you. If you are starting from zero, begin with Headspace and move to Waking Up once a practice is established.`,
  references: [
    { label: 'Waking Up — official site', url: 'https://www.wakingup.com' },
    { label: 'Meditation app clinical research (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=meditation+app+randomized+controlled+trial' },
  ],
  relatedSlugs: ['headspace', 'insight-timer', 'calm'],
  datePublished: '2026-05-15',
  dateModified: '2026-05-15',
}

export default wakingUp
