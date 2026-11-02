/**
 * Psychology pages (task 108): /science/psychology/ hub and /science/psychology/<topic>/ — EN only for now.
 * Data: src/generated/psych-pages.json, written at build time by scripts/fetch-psych.ts from the private repo
 * yamius/onda-psych (claims approved or auto-checked, render-only, never part of the fact registry; published on the next build after merge, no release queue; `preview` = legacy flag, unused since v3 →
 * noindex, not in the sitemap). Used by the page (client) and by meta-inject (static JSON-LD).
 */
import PAGES from '../generated/psych-pages.json'
import { SITE_URL } from './science-meta'

export interface PsychSource { pmid?: string; doi?: string; quote: string; study_type: string; coi: string; industry?: boolean }
export interface PsychClaim { id: string; kind?: string; text: string; evidence_class: string; sources?: PsychSource[]; limitation?: string; status?: string }
export interface PsychRelatedLink { href: string; label: string; kind: 'article' | 'tool' | 'glossary' }
export interface PsychPage { key: string; topic: string; lang: string; angle?: string; title: string; seo_title?: string; meta_description?: string; summary: string; related?: PsychRelatedLink[]; hubs?: string[]; updated: string; uncertainty?: string; claims: PsychClaim[]; body: string; preview?: boolean }

/** EN, main angle only (translations and angles come later through the normal queue). */
export const PSYCH_PAGES: PsychPage[] = (PAGES as PsychPage[]).filter((p) => p.lang === 'en' && !p.angle)
/** Every claim reviewed by the owner (otherwise auto-checked by the onda-psych pipeline, no human review). */
export const psychOwnerReviewed = (p: PsychPage) => p.claims.every((c) => c.status === 'approved')
export const PSYCH_HUB = '/science/psychology'
export const psychPath = (topic: string) => `${PSYCH_HUB}/${topic}`
export const psychPage = (topic: string) => PSYCH_PAGES.find((p) => p.topic === topic)
/** Routes to prerender (hub only when at least one page exists). */
export const psychRoutes = (): string[] => (PSYCH_PAGES.length ? [PSYCH_HUB, ...PSYCH_PAGES.map((p) => psychPath(p.topic))] : [])
/** Served but not indexed: preview-only pages, and the hub while it has no released page. */
export function isNoindexPsychRoute(route: string): boolean {
  const m = route.replace(/\/$/, '').match(/^\/science\/psychology(?:\/([a-z0-9-]+))?$/)
  if (!m) return false
  return m[1] ? !!psychPage(m[1])?.preview : !PSYCH_PAGES.some((p) => !p.preview)
}

/** Unique sources of a page in first-cited order: S1, S2, … */
export function psychSources(p: PsychPage): (PsychSource & { n: number })[] {
  const out: (PsychSource & { n: number })[] = []
  for (const c of p.claims) for (const s of c.sources ?? []) {
    if (!out.some((o) => (s.pmid && o.pmid === s.pmid) || (s.doi && o.doi?.toLowerCase() === s.doi.toLowerCase()))) out.push({ ...s, n: out.length + 1 })
  }
  return out
}
export const sourceNo = (p: PsychPage, s: PsychSource) => psychSources(p).find((o) => (s.pmid && o.pmid === s.pmid) || (s.doi && o.doi?.toLowerCase() === s.doi?.toLowerCase()))?.n
export const psychSourceHref = (s: PsychSource) => (s.doi ? `https://doi.org/${s.doi}` : s.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${s.pmid}/` : null)

/** Other psychology pages (same section), for the "More in psychology" links. */
export const psychSiblings = (p: PsychPage) => PSYCH_PAGES.filter((o) => o.topic !== p.topic && !o.preview)

/** Plain text of a Markdown fragment: claim markers [topic-c1], links, emphasis and code removed. */
export const psychPlain = (md: string) => md
  .replace(/\[[a-z0-9-]+-c\d+\]/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_`>]+/g, '')
  .replace(/\s+([.,;:!?])/g, '$1').replace(/\s+/g, ' ').trim()

/** FAQ of a page: H2 "FAQ" (onda-psych system.md section 9), Q = each H3, A = its text without claim markers.
 *  The clinician sentence after the last answer is dropped. Pages without that section → []. */
export function psychFaq(p: PsychPage): { question: string; answer: string }[] {
  const m = p.body.match(/^## +FAQ\s*$/m)
  if (!m || m.index === undefined) return []
  const rest = p.body.slice(m.index + m[0].length)
  const sec = rest.slice(0, rest.search(/^## /m) >= 0 ? rest.search(/^## /m) : rest.length)
  const qs = [...sec.matchAll(/^### +(.+?)\s*$/gm)]
  return qs.map((q, i) => {
    let paras = sec.slice(q.index! + q[0].length, i + 1 < qs.length ? qs[i + 1].index : sec.length).split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean)
    if (i === qs.length - 1 && paras.length > 1) paras = paras.slice(0, -1)
    return { question: psychPlain(q[1]), answer: psychPlain(paras.join(' ')) }
  }).filter((f) => f.question && f.answer)
}

export const PSYCH_HUB_TITLE = 'Psychology: what the evidence shows'
export const PSYCH_HUB_DESC = 'Evidence summaries on psychological topics such as anxiety: what systematic reviews and meta-analyses show, how strong the evidence is, and its limits. Every claim is quoted from its source.'

export interface PsychMeta { title: string; description: string; ogType: 'website' | 'article'; jsonLd: Record<string, unknown>[]; breadcrumbs: { name: string; url: string }[]; noindex?: boolean; faq?: { question: string; answer: string }[] }

export function psychMeta(route: string): PsychMeta | undefined {
  const m = route.replace(/\/$/, '').match(/^\/science\/psychology(?:\/([a-z0-9-]+))?$/)
  if (!m || !PSYCH_PAGES.length) return undefined
  const isPartOf = { '@type': 'WebSite', '@id': `${SITE_URL}#website`, name: 'ONDA Life', url: SITE_URL }
  const crumbs = [{ name: 'Home', url: SITE_URL }, { name: 'Science', url: `${SITE_URL}/science` }, { name: 'Psychology', url: `${SITE_URL}${PSYCH_HUB}` }]
  const noindex = isNoindexPsychRoute(route) || undefined
  if (!m[1]) {
    return {
      title: `${PSYCH_HUB_TITLE} | ONDA Life`, description: PSYCH_HUB_DESC, ogType: 'website', breadcrumbs: crumbs, noindex,
      jsonLd: [{
        '@context': 'https://schema.org', '@type': 'CollectionPage', url: `${SITE_URL}${PSYCH_HUB}`, name: PSYCH_HUB_TITLE, description: PSYCH_HUB_DESC, inLanguage: 'en', isPartOf,
        hasPart: PSYCH_PAGES.filter((p) => !p.preview).map((p) => ({ '@type': 'Article', name: p.title, url: `${SITE_URL}${psychPath(p.topic)}` })),
      }],
    }
  }
  const p = psychPage(m[1])
  if (!p) return undefined
  const url = `${SITE_URL}${psychPath(p.topic)}`
  // PMID → PubMed URL, DOI → doi.org (both in sameAs when a source has both)
  const refs = psychSources(p).map((s) => {
    const urls = [s.pmid && `https://pubmed.ncbi.nlm.nih.gov/${s.pmid}/`, s.doi && `https://doi.org/${s.doi}`].filter(Boolean) as string[]
    return { '@type': 'ScholarlyArticle', url: urls[0], ...(urls.length > 1 ? { sameAs: urls.slice(1) } : {}), identifier: [s.pmid && `pmid:${s.pmid}`, s.doi && `doi:${s.doi}`].filter(Boolean) }
  })
  const editor = { '@type': 'Person', name: 'Yakiv Bilenko', url: `${SITE_URL}/people/yakiv-bilenko` }
  return {
    title: `${p.seo_title || p.title} | ONDA Life`, description: p.meta_description || (p.summary.length > 160 ? `${p.summary.slice(0, 157).replace(/\s+\S*$/, '')}…` : p.summary), ogType: 'article', noindex,
    ...(psychFaq(p).length ? { faq: psychFaq(p) } : {}),
    breadcrumbs: [...crumbs, { name: p.title.split(':')[0], url }],
    jsonLd: [{
      '@context': 'https://schema.org', '@type': 'Article', '@id': `${url}#article`, url, mainEntityOfPage: url, headline: p.title, description: p.summary, abstract: p.summary,
      inLanguage: 'en', dateModified: p.updated, author: { '@type': 'Organization', name: 'ONDA Life editorial team', url: SITE_URL }, editor, isPartOf,
      publisher: { '@type': 'Organization', '@id': `${SITE_URL}#organization`, name: 'ONDA Life', url: SITE_URL },
      citation: refs, isBasedOn: refs,
    }],
  }
}
