/**
 * Injects internal glossary links into markdown content.
 * Replaces mentions of glossary terms with [term](/glossary/slug) links.
 * Skips replacements inside existing markdown links and code blocks.
 */

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
  for (const { pattern, slug } of TERM_PATTERNS) {
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
