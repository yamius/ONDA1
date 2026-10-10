/**
 * Title / description / JSON-LD / breadcrumbs for an ONDA Science route, in any published language:
 * /science, /science/<kind>, /science/<kind>/<slug> and the /<lang>/… variants.
 * Used by meta-inject (prerender, with every page available) and by the page itself (client).
 */
import { SCIENCE_INDEX, SCIENCE_KINDS, SCIENCE_LANGS, type SciencePageData, type ScienceKind, type ScienceSource } from '../generated/science-pages'
import { scienceUi, fillUi } from '../data/science/i18n'
import { MIN_PAGES_FOR_INDEXED_KIND } from '../data/science/kinds'

export const SITE_URL = 'https://onda-life.com'

export interface ScienceRoute { lang: string; kind?: string; slug?: string }

/** Parse a science route; undefined if the route is not in the science section. */
export function parseScienceRoute(route: string): ScienceRoute | undefined {
  const parts = route.split('/').filter(Boolean)
  let lang = 'en'
  if (parts[0] && parts[0] !== 'science' && /^[a-z]{2}$/.test(parts[0])) lang = parts.shift()!
  if (parts[0] !== 'science') return undefined
  if (lang !== 'en' && !SCIENCE_LANGS.includes(lang)) return undefined
  return { lang, kind: parts[1], slug: parts[2] }
}

/** Path of a science URL in a language (EN is unprefixed). */
export const sciencePath = (lang: string, rest = '') => `${lang === 'en' ? '' : `/${lang}`}/science${rest}`
export const pageUrl = (lang: string, p: { kind: string; slug: string }) => `${SITE_URL}${sciencePath(lang, `/${p.kind}/${p.slug}`)}`
/** Short entity name for breadcrumbs: the title before an em/en dash. */
export const scienceShortName = (title: string) => title.split(/\s[—–]\s/)[0]

export const indexFor = (lang: string) => SCIENCE_INDEX.filter((p) => p.langs.includes(lang))
export const kindsWithPages = (lang: string) => SCIENCE_KINDS.filter((k) => indexFor(lang).some((p) => p.kind === k))
/**
 * The section page /<lang>/science/<kind> is indexed only once the kind has MIN_PAGES_FOR_INDEXED_KIND published pages
 * in that language (src/data/science/kinds.ts). Below it: robots noindex, out of the sitemap, no hub-heading or
 * breadcrumb link to it. Its pages stay indexed and listed on the hub.
 */
export const kindIndexed = (kind: string, lang: string) => indexFor(lang).filter((p) => p.kind === kind).length >= MIN_PAGES_FOR_INDEXED_KIND
/** True for a science section route (/science/<kind>, /<lang>/science/<kind>) that is served but must not be indexed. */
export function isNoindexScienceRoute(route: string): boolean {
  const r = parseScienceRoute(route)
  return !!r?.kind && !r.slug && !kindIndexed(r.kind, r.lang)
}

export function sourceHref(s: ScienceSource): string | null {
  if (s.doi) return `https://doi.org/${s.doi}`
  if (s.pmid) return `https://pubmed.ncbi.nlm.nih.gov/${s.pmid}/`
  return s.url
}

export interface ScienceMeta {
  title: string
  description: string
  ogType: 'website' | 'article'
  jsonLd: Record<string, unknown>[]
  image?: string
  imageAlt?: string
  breadcrumbs: { name: string; url: string }[]
  langs: string[]
  /** Section page below MIN_PAGES_FOR_INDEXED_KIND — robots "noindex, follow". */
  noindex?: boolean
  /** Page FAQ (front matter `faq`) — emitted as static FAQPage JSON-LD by meta-inject. */
  faq?: { question: string; answer: string }[]
}

export function scienceMeta(route: string, getPage: (lang: string, kind: string, slug: string) => SciencePageData | undefined): ScienceMeta | undefined {
  const r = parseScienceRoute(route)
  if (!r) return undefined
  const { lang, kind, slug } = r
  const ui = scienceUi(lang)
  const home = lang === 'en' ? SITE_URL : `${SITE_URL}/${lang}`
  const isPartOf = { '@type': 'WebSite', '@id': `${SITE_URL}#website`, name: 'ONDA Life', url: SITE_URL }
  const crumbs = [{ name: ui.home, url: home }, { name: ui.science, url: `${SITE_URL}${sciencePath(lang)}` }]
  const items = indexFor(lang)
  if (!kind) {
    return {
      breadcrumbs: crumbs,
      title: `${ui.hubMetaTitle} | ONDA Life`,
      description: ui.hubDescription,
      ogType: 'website',
      langs: SCIENCE_LANGS,
      jsonLd: [{
        '@context': 'https://schema.org', '@type': 'CollectionPage', '@id': `${SITE_URL}${sciencePath(lang)}#webpage`, url: `${SITE_URL}${sciencePath(lang)}`,
        name: ui.hubMetaTitle, description: ui.hubDescription, inLanguage: lang, isPartOf,
        hasPart: items.map((p) => ({ '@type': 'Article', name: p.i18n[lang].title, url: pageUrl(lang, p) })),
      }],
    }
  }
  if (!(SCIENCE_KINDS as string[]).includes(kind) || !kindsWithPages(lang).includes(kind as ScienceKind)) return undefined
  const info = ui.kinds[kind as ScienceKind]
  const kindCrumb = { name: info.label, url: `${SITE_URL}${sciencePath(lang, `/${kind}`)}` }
  if (!slug) {
    const name = fillUi(ui.kindMetaTitle, { label: info.label })
    return {
      ...(kindIndexed(kind, lang) ? {} : { noindex: true }),
      breadcrumbs: [...crumbs, kindCrumb],
      title: `${name} | ONDA Life`,
      description: fillUi(ui.kindMetaDescription, { label: info.label.toLowerCase(), desc: info.desc }),
      ogType: 'website',
      langs: SCIENCE_LANGS.filter((l) => kindsWithPages(l).includes(kind as ScienceKind)),
      jsonLd: [{
        '@context': 'https://schema.org', '@type': 'CollectionPage', url: `${SITE_URL}${sciencePath(lang, `/${kind}`)}`, name, inLanguage: lang, isPartOf,
        hasPart: items.filter((p) => p.kind === kind).map((p) => ({ '@type': 'Article', name: p.i18n[lang].title, url: pageUrl(lang, p) })),
      }],
    }
  }
  const p = getPage(lang, kind, slug)
  if (!p) return undefined
  // A section page that is not indexed yet is left out of the page's breadcrumb trail (Home › Science › page).
  if (kindIndexed(kind, lang)) crumbs.push(kindCrumb)
  const editor = { '@type': 'Person', name: p.editor, url: `${SITE_URL}/people/yakiv-bilenko` }
  const article: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': p.kind === 'concepts' || p.kind === 'questions' ? 'Article' : 'TechArticle', // plain-language kinds: Article
    '@id': `${pageUrl(lang, p)}#article`,
    url: pageUrl(lang, p),
    mainEntityOfPage: pageUrl(lang, p),
    headline: p.title,
    description: p.metaDescription,
    abstract: p.shortAnswer,
    inLanguage: lang,
    dateModified: p.dateModified,
    author: editor,
    editor,
    publisher: { '@type': 'Organization', '@id': `${SITE_URL}#organization`, name: 'ONDA Life', url: SITE_URL },
    isPartOf,
    citation: p.sources.map((s) => ({
      '@type': s.type === 'official' ? 'WebPage' : 'ScholarlyArticle',
      name: s.title,
      ...(s.year ? { datePublished: String(s.year) } : {}),
      ...(sourceHref(s) ? { url: sourceHref(s) } : {}),
      ...(s.doi ? { identifier: `doi:${s.doi}` } : {}),
    })),
  }
  if (lang !== 'en') article.translationOfWork = { '@id': `${pageUrl('en', p)}#article` }
  if (p.kind === 'concepts') article.about = { '@type': 'DefinedTerm', name: p.title.split(/\s[—–:-]\s/)[0], description: p.shortAnswer, url: pageUrl(lang, p) }
  if (p.reviewer) { article.reviewedBy = { '@type': 'Person', name: p.reviewer }; if (p.lastReviewed) article.lastReviewed = p.lastReviewed }
  if (p.image) article.image = { '@type': 'ImageObject', url: `${SITE_URL}${p.image}`, ...(p.imageWidth ? { width: p.imageWidth, height: p.imageHeight } : {}), ...(p.imageAlt ? { caption: p.imageAlt } : {}) }
  crumbs.push({ name: scienceShortName(p.title), url: pageUrl(lang, p) })
  return { title: `${p.metaTitle} | ONDA Life`, description: p.metaDescription, ogType: 'article', jsonLd: [article], breadcrumbs: crumbs, langs: p.langs, ...(p.faq?.length ? { faq: p.faq.map((f) => ({ question: f.q, answer: f.a })) } : {}), ...(p.image ? { image: `${SITE_URL}${p.image}`, imageAlt: p.imageAlt ?? undefined } : {}) }
}
