import GithubSlugger from 'github-slugger'
import type { Article } from './types'
import { HRV_QUESTION_GROUPS } from '../hrv-questions'

/**
 * HRV questions hub — 41 short, direct answers grouped in six sections, each linking deeper.
 * Body is generated from src/data/hrv-questions.ts; FAQPage JSON-LD comes from the same data via
 * ARTICLE_FAQ_SCHEMA_ONLY (not ARTICLE_FAQ, which would render the Q&A a second time). EN only.
 */

// Anchors must match rehype-slug output for the H3s: same slugger, same heading order as the page.
const slugger = new GithubSlugger()
const anchors = new Map<string, string>()
for (const g of HRV_QUESTION_GROUPS) {
  slugger.slug(g.title)
  for (const x of g.items) anchors.set(x.id, slugger.slug(x.q))
}

const toc = HRV_QUESTION_GROUPS.map(
  (g) => `- **${g.title}:** ${g.items.map((x) => `[${x.q}](#${anchors.get(x.id)})`).join(' · ')}`,
).join('\n')

const body = HRV_QUESTION_GROUPS.map(
  (g) => `## ${g.title}\n\n` + g.items.map((x) => `### ${x.q}\n\n${x.a}`).join('\n\n'),
).join('\n\n')

const article: Article = {
  slug: 'hrv-questions-answered',
  title: 'HRV Questions, Answered: 41 Straight Answers About Heart Rate Variability',
  seoTitle: 'HRV Questions Answered: 41 Short Answers | ONDA Life',
  description:
    'What is a good HRV? Why is mine low? Does alcohol, caffeine or breathing change it? 41 short, sourced answers about heart rate variability, each linking to a deeper guide or free calculator.',
  category: 'Biological Software',
  relatedSlugs: ['normal-hrv-by-age', 'how-to-raise-hrv-naturally', 'what-to-do-after-low-hrv-reading', 'how-to-measure-hrv-consistently'],
  introStyle: 'rose',
  neuralSuggestion: {
    text: 'Most HRV questions end in the same place: your own range matters more than any average.',
    link: '/tools/baseline',
    linkText: 'See your two-week range →',
  },
  content: `
Short, direct answers to the questions people actually ask about heart rate variability (HRV). Each answer starts with the answer, gives one figure or source where it matters, and links to a longer guide or a free calculator. This page is general information, not medical advice.

${toc}

${body}
`,
}

export default [article]
