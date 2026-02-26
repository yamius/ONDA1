/**
 * Injects internal glossary links into markdown content.
 * Replaces mentions of glossary terms with [term](/glossary/slug) links.
 * Skips replacements inside existing markdown links and code blocks.
 */

import { glossaryTerms } from '../data/glossary'

/** Common abbreviations for glossary terms (used in articles). */
const ARTICLE_ABBREVIATIONS: { pattern: RegExp; slug: string }[] = [
  { pattern: /\bHRV\b/gi, slug: 'heart-rate-variability' },
  { pattern: /\bAlpha Waves\b/gi, slug: 'alpha-state' },
  { pattern: /\bTheta Waves\b/gi, slug: 'theta-state' },
]

/** Build patterns from glossary terms for article linking. Longest titles first to avoid partial matches. */
function buildArticleTermPatterns(): { pattern: RegExp; slug: string }[] {
  const fromTerms = glossaryTerms
    .map((t) => ({ title: t.title, slug: t.slug }))
    .sort((a, b) => b.title.length - a.title.length)
    .map(({ title, slug }) => ({
      pattern: new RegExp(`\\b${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi'),
      slug,
    }))
  return [...fromTerms, ...ARTICLE_ABBREVIATIONS]
}

/** Map: regex pattern (case-insensitive) -> glossary slug. Order: longest phrases first. */
const TERM_PATTERNS: { pattern: RegExp; slug: string }[] = [
  { pattern: /\bprefrontal cortex\b/gi, slug: 'prefrontal-cortex' },
  { pattern: /\bPrefrontal Cortex\b/g, slug: 'prefrontal-cortex' },
  { pattern: /\bprefrontal\b/gi, slug: 'prefrontal-cortex' },
  { pattern: /\bamygdala\b/gi, slug: 'amygdala' },
  { pattern: /\boxytocin\b/gi, slug: 'oxytocin' },
  { pattern: /\bdopamine\b/gi, slug: 'dopamine' },
  { pattern: /\bneuroplasticity\b/gi, slug: 'neuroplasticity' },
  { pattern: /\bproprioception\b/gi, slug: 'proprioception' },
  { pattern: /\bhomeostasis\b/gi, slug: 'homeostasis' },
  { pattern: /\bhippocampus\b/gi, slug: 'hippocampus' },
  { pattern: /\binteroception\b/gi, slug: 'interoception' },
  { pattern: /\bhypothalamus\b/gi, slug: 'hypothalamus' },
]

const LINK_PLACEHOLDER = '\x00GLOSSARY_LINK_PLACEHOLDER\x00'
const CREATED_LINK_PREFIX = '\x01GLOSSARY_CREATED_'

/**
 * Injects glossary links into markdown content.
 * Uses placeholders for created links so overlapping patterns (e.g. "prefrontal" vs "prefrontal cortex") don't corrupt output.
 * @param content Raw markdown
 * @param currentSlug Slug of the term being viewed — self-mentions are not linked
 */
export function injectGlossaryLinks(content: string, currentSlug: string): string {
  return injectGlossaryLinksWithPatterns(content, currentSlug, TERM_PATTERNS)
}

function injectGlossaryLinksWithPatterns(
  content: string,
  currentSlug: string,
  patterns: { pattern: RegExp; slug: string }[]
): string {
  // 1. Protect existing markdown links [text](url) - replace with placeholders
  const linkMatches: string[] = []
  let protectedContent = content.replace(/\[([^\]]*)\]\(([^)]*)\)/g, (_, text, url) => {
    const placeholder = `${LINK_PLACEHOLDER}${linkMatches.length}${LINK_PLACEHOLDER}`
    linkMatches.push(`[${text}](${url})`)
    return placeholder
  })

  // 2. Protect code blocks ```...```
  const codeMatches: string[] = []
  protectedContent = protectedContent.replace(/```[\s\S]*?```/g, (match) => {
    const placeholder = `${LINK_PLACEHOLDER}CODE${codeMatches.length}${LINK_PLACEHOLDER}`
    codeMatches.push(match)
    return placeholder
  })

  // 3. Replace term mentions with internal links (skip self-linking). Use placeholders so overlapping patterns don't corrupt.
  const createdLinks: string[] = []
  for (const { pattern, slug } of patterns) {
    if (slug === currentSlug) continue
    protectedContent = protectedContent.replace(pattern, (match) => {
      const link = `[${match}](/glossary/${slug})`
      const idx = createdLinks.length
      createdLinks.push(link)
      return `${CREATED_LINK_PREFIX}${idx}\x01`
    })
  }

  // 4. Restore created links (before restoring original links/code)
  for (let i = 0; i < createdLinks.length; i++) {
    const placeholder = `${CREATED_LINK_PREFIX}${i}\x01`
    protectedContent = protectedContent.split(placeholder).join(createdLinks[i])
  }

  // 5. Restore code blocks
  protectedContent = protectedContent.replace(
    new RegExp(`${LINK_PLACEHOLDER}CODE(\\d+)${LINK_PLACEHOLDER}`, 'g'),
    (_, i) => codeMatches[parseInt(i, 10)] ?? ''
  )

  // 6. Restore original markdown links
  protectedContent = protectedContent.replace(
    new RegExp(`${LINK_PLACEHOLDER}(\\d+)${LINK_PLACEHOLDER}`, 'g'),
    (_, i) => linkMatches[parseInt(i, 10)] ?? ''
  )

  return protectedContent
}

/**
 * Injects glossary links into article content. Uses all glossary terms for auto-linking.
 * For articles there is no "self" to skip — all term mentions become links.
 */
export function injectArticleGlossaryLinks(content: string): string {
  return injectGlossaryLinksWithPatterns(content, '__no_self__', buildArticleTermPatterns())
}
