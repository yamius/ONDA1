/**
 * Psychology pages (task 108): /science/psychology/ hub and /science/psychology/<topic>/ — EN only for now.
 * Data: src/generated/psych-pages.json, written at build time by scripts/fetch-psych.ts from the private repo
 * yamius/onda-psych (approved claims only, gated by PSYCH_RELEASE_QUEUE; `preview` = not released yet, only in
 * preview builds → noindex, not in the sitemap). Used by the page (client) and by meta-inject (static JSON-LD).
 */
import PAGES from '../generated/psych-pages.json'
import { SITE_URL } from './science-meta'

export interface PsychSource { pmid?: string; doi?: string; quote: string; study_type: string; coi: string; industry?: boolean }
export interface PsychClaim { id: string; kind?: string; text: string; evidence_class: string; sources?: PsychSource[]; limitation?: string }
export interface PsychPage { key: string; topic: string; lang: string; angle?: string; title: string; summary: string; updated: string; uncertainty?: string; claims: PsychClaim[]; body: string; preview?: boolean }

/** EN, main angle only (translations and angles come later through the normal queue). */
export const PSYCH_PAGES: PsychPage[] = (PAGES as PsychPage[]).filter((p) => p.lang === 'en' && !p.angle)
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

export const PSYCH_HUB_TITLE = 'Psychology: what the evidence shows'
export const PSYCH_HUB_DESC = 'Evidence summaries on psychological topics such as anxiety: what systematic reviews and meta-analyses show, how strong the evidence is, and its limits. Every claim is quoted from its source.'

export interface PsychMeta { title: string; description: string; ogType: 'website' | 'article'; jsonLd: Record<string, unknown>[]; breadcrumbs: { name: string; url: string }[]; noindex?: boolean }

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
  const editor = { '@type': 'Person', name: 'Yakiv Bilenko', url: `${SITE_URL}/people/yakiv-bilenko` }
  return {
    title: `${p.title} | ONDA Life`, description: p.summary.length > 160 ? `${p.summary.slice(0, 157).replace(/\s+\S*$/, '')}…` : p.summary, ogType: 'article', noindex,
    breadcrumbs: [...crumbs, { name: p.title.split(':')[0], url }],
    jsonLd: [{
      '@context': 'https://schema.org', '@type': 'Article', '@id': `${url}#article`, url, mainEntityOfPage: url, headline: p.title, description: p.summary, abstract: p.summary,
      inLanguage: 'en', dateModified: p.updated, author: { '@type': 'Organization', name: 'ONDA Life editorial team', url: SITE_URL }, editor, isPartOf,
      publisher: { '@type': 'Organization', '@id': `${SITE_URL}#organization`, name: 'ONDA Life', url: SITE_URL },
      citation: psychSources(p).map((s) => ({ '@type': 'ScholarlyArticle', ...(psychSourceHref(s) ? { url: psychSourceHref(s) } : {}), ...(s.doi ? { identifier: `doi:${s.doi}` } : {}) })),
    }],
  }
}
