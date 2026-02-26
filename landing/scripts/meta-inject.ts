/**
 * Meta data for build-time injection into prerendered HTML.
 * Single source of truth for title/description per route.
 */
import { getTermBySlug } from '../src/data/glossary'
import { GLOSSARY_SEO } from '../src/data/glossary-seo'
import { levelsData } from '../src/data/levels'
import { PART_SEO } from '../src/data/part-seo'
import { parts } from '../src/pages/PartPage'

const SITE_URL = 'https://ondalife.replit.app'
const OG_IMAGE = `${SITE_URL}/og-preview.png`
const DEFAULT_TITLE = 'ONDA Life | Operating System for Your Consciousness'
const DEFAULT_DESC =
  'Stop meditating randomly. Start managing your biological code through systematic upgrades. Your body is a biocomputer. ONDA Life is the OS.'

const ABOUT_TITLE = 'About ONDA Life | The Operating System for Your Consciousness'
const ABOUT_DESC =
  'Discover the science behind ONDA Life. A systematic approach to human upgrade combining neuroscience, evolutionary biology, and biofeedback.'

const GLOSSARY_TITLE = 'Biohacking & Neuroscience Glossary | ONDA Life Knowledge Base'
const GLOSSARY_DESC =
  'Explore 100+ key terms in molecular psychology, neurophysiology, and consciousness architecture. Your comprehensive guide to the ONDA Life system.'

export interface BreadcrumbItem {
  name: string
  url: string
}

export interface RouteMeta {
  title: string
  description: string
  url: string
  breadcrumbs: BreadcrumbItem[]
  definedTerm?: { name: string; description: string; url: string }
}

function buildBreadcrumbs(route: string): BreadcrumbItem[] {
  const home = { name: 'Home', url: SITE_URL }
  if (route === '/') return [home]

  const items: BreadcrumbItem[] = [home]
  const segments = route.split('/').filter(Boolean)

  if (segments[0] === 'about') {
    items.push({ name: 'About', url: `${SITE_URL}/about` })
    return items
  }
  if (segments[0] === 'glossary') {
    items.push({ name: 'Glossary', url: `${SITE_URL}/glossary` })
    if (segments[1]) {
      const term = getTermBySlug(segments[1])
      items.push({
        name: term?.title ?? segments[1],
        url: `${SITE_URL}/glossary/${segments[1]}`,
      })
    }
    return items
  }
  if (segments[0] === 'part' && segments[1]) {
    const part = parts[segments[1]]
    if (part) {
      const levelNum = part.badge.match(/LEVEL (\d+)/)?.[1]
      const level = levelNum ? levelsData[parseInt(levelNum, 10)] : undefined
      if (level) {
        items.push({ name: `Level ${level.number}: ${level.name}`, url: `${SITE_URL}/level/${level.number}` })
      }
      const levelDomain = part.badge.match(/LEVEL \d+: ([^/]+)/)?.[1]?.trim()?.split(' ')[0] ?? ''
      const domainLabel = levelDomain ? levelDomain.charAt(0) + levelDomain.slice(1).toLowerCase() : ''
      const partLabel = `${part.title} ${part.titleHighlight}`.trim()
      const label = domainLabel ? `${domainLabel} / ${partLabel}` : partLabel
      items.push({ name: label, url: `${SITE_URL}/part/${segments[1]}` })
    } else {
      items.push({ name: segments[1], url: `${SITE_URL}/part/${segments[1]}` })
    }
    return items
  }
  if (segments[0] === 'level' && segments[1]) {
    const level = levelsData[parseInt(segments[1], 10)]
    const label = level ? `Level ${level.number}: ${level.name}` : `Level ${segments[1]}`
    items.push({ name: label, url: `${SITE_URL}/level/${segments[1]}` })
    return items
  }

  return items
}

function buildBreadcrumbListJsonLd(breadcrumbs: BreadcrumbItem[]): string {
  const list = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
  return JSON.stringify(list)
}

function buildDefinedTermJsonLd(name: string, description: string, url: string): string {
  const term = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name,
    description,
    url,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'ONDA Life Glossary',
      url: `${SITE_URL}/glossary`,
    },
  }
  return JSON.stringify(term)
}

export function getMetaForRoute(route: string): RouteMeta {
  const url = `${SITE_URL}${route === '/' ? '' : route}`

  const breadcrumbs = buildBreadcrumbs(route)

  if (route === '/') {
    return { title: DEFAULT_TITLE, description: DEFAULT_DESC, url, breadcrumbs }
  }
  if (route === '/about') {
    return { title: ABOUT_TITLE, description: ABOUT_DESC, url, breadcrumbs }
  }
  if (route === '/glossary') {
    return { title: GLOSSARY_TITLE, description: GLOSSARY_DESC, url, breadcrumbs }
  }

  const glossaryMatch = route.match(/^\/glossary\/([^/]+)$/)
  if (glossaryMatch) {
    const slug = glossaryMatch[1]
    const term = getTermBySlug(slug)
    if (term) {
      const seo = GLOSSARY_SEO[slug]
      const title = seo?.title ?? `${term.title} | ONDA Life Glossary`
      const description = seo?.description ?? term.shortDescription
      return {
        title,
        description,
        url,
        breadcrumbs,
        definedTerm: { name: term.title, description, url },
      }
    }
  }

  const partMatch = route.match(/^\/part\/([^/]+)$/)
  if (partMatch) {
    const slug = partMatch[1]
    const part = parts[slug]
    if (part) {
      const seo = PART_SEO[slug]
      const title = seo?.title ?? `${part.title} ${part.titleHighlight} | ONDA Life`
      const description = seo?.description ?? part.metaDescription ?? DEFAULT_DESC
      return { title, description, url, breadcrumbs }
    }
  }

  const levelMatch = route.match(/^\/level\/([^/]+)$/)
  if (levelMatch) {
    const level = levelsData[parseInt(levelMatch[1], 10)]
    const title = level
      ? `Level ${level.number}: ${level.name} | ONDA Life`
      : `Level ${levelMatch[1]} | ONDA Life`
    const description = level?.metaDescription ?? level?.subtitle ?? ''
    return { title, description, url, breadcrumbs }
  }

  return { title: DEFAULT_TITLE, description: DEFAULT_DESC, url, breadcrumbs }
}

function escapeHtmlAttr(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * Injects meta tags, canonical link, and JSON-LD into HTML string.
 */
export function injectMetaIntoHtml(html: string, meta: RouteMeta): string {
  const escapedTitle = escapeHtmlAttr(meta.title)
  const escapedDesc = escapeHtmlAttr(meta.description)
  const escapedUrl = escapeHtmlAttr(meta.url)

  let out = html

  // Canonical link — replace existing or add before </head>
  const canonicalTag = `<link rel="canonical" href="${escapedUrl}">`
  if (out.includes('rel="canonical"')) {
    out = out.replace(/<link\s+rel="canonical"\s+href="[^"]*">/i, canonicalTag)
  } else {
    out = out.replace('</head>', `  ${canonicalTag}\n</head>`)
  }

  // JSON-LD: BreadcrumbList (always)
  const breadcrumbScript = `<script type="application/ld+json">${buildBreadcrumbListJsonLd(meta.breadcrumbs)}</script>`
  out = out.replace('</head>', `  ${breadcrumbScript}\n</head>`)

  // JSON-LD: DefinedTerm (glossary pages only)
  if (meta.definedTerm) {
    const definedTermScript = `<script type="application/ld+json">${buildDefinedTermJsonLd(meta.definedTerm.name, meta.definedTerm.description, meta.definedTerm.url)}</script>`
    out = out.replace('</head>', `  ${definedTermScript}\n</head>`)
  }

  // Replace <title>...</title>
  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapedTitle}</title>`)

  // Replace meta name="title" if present
  if (out.includes('name="title"')) {
    out = out.replace(/<meta\s+name="title"\s+content="[^"]*">/i, `<meta name="title" content="${escapedTitle}">`)
  }

  // Replace or add meta name="description"
  const descMeta = `<meta name="description" content="${escapedDesc}">`
  if (out.includes('name="description"')) {
    out = out.replace(/<meta\s+name="description"\s+content="[^"]*">/i, descMeta)
  } else {
    out = out.replace('</head>', `  ${descMeta}\n</head>`)
  }

  // Replace og:* and twitter:* meta tags
  const replacements: [RegExp, string][] = [
    [/<meta\s+property="og:title"\s+content="[^"]*">/gi, `<meta property="og:title" content="${escapedTitle}">`],
    [/<meta\s+property="og:description"\s+content="[^"]*">/gi, `<meta property="og:description" content="${escapedDesc}">`],
    [/<meta\s+property="og:url"\s+content="[^"]*">/gi, `<meta property="og:url" content="${escapedUrl}">`],
    [/<meta\s+property="og:image"\s+content="[^"]*">/gi, `<meta property="og:image" content="${OG_IMAGE}">`],
    [/<meta\s+property="twitter:url"\s+content="[^"]*">/gi, `<meta property="twitter:url" content="${escapedUrl}">`],
    [/<meta\s+property="twitter:title"\s+content="[^"]*">/gi, `<meta property="twitter:title" content="${escapedTitle}">`],
    [/<meta\s+property="twitter:description"\s+content="[^"]*">/gi, `<meta property="twitter:description" content="${escapedDesc}">`],
    [/<meta\s+property="twitter:image"\s+content="[^"]*">/gi, `<meta property="twitter:image" content="${OG_IMAGE}">`],
  ]

  for (const [regex, replacement] of replacements) {
    out = out.replace(regex, replacement)
  }

  return out
}
