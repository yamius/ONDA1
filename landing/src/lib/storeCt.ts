/**
 * Apple App Store campaign tag (`ct`) — the ONE place a ct is built.
 *
 * Scheme (task 15): <type>_<slug>[_<lang>]  — ≤ 40 chars (App Store limit).
 *   hdr_<pagetype>  header / menu "Download"      ftr_<pagetype> footer "Download"
 *   home_hero       homepage                      ar_<slug>      article
 *   hub_<topic>     Library topic hub             pillar_meditation
 *   rv_<product>    single review                 rvhub_<cat>    review category hub
 *   vs_<a>_<b>      review head-to-head           cmp_<slug>     /compare/* (ONDA vs …)
 *   gl_<term>       glossary term                 tool_<name>    tool
 *   bio_<metric>    /bio/*                        pg_<name>      product pages
 * Non-English pages get a `_<lang>` suffix (es/ru/uk/zh).
 *
 * If the slug doesn't fit, it's cut and a 4-char hash of the full slug is
 * appended, so two long slugs sharing a prefix never collapse into one ct.
 */
import { appStoreUrl } from '../config/appStore'

export type CtType =
  | 'hdr' | 'ftr' | 'home' | 'ar' | 'hub' | 'pillar' | 'rv' | 'rvhub'
  | 'vs' | 'cmp' | 'gl' | 'tool' | 'bio' | 'pg'

const MAX = 40

function hash4(s: string): string {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0
  return h.toString(36).slice(-4).padStart(4, '0')
}

export function storeCt(type: CtType, slug = '', lang = 'en'): string {
  const suffix = lang && lang !== 'en' ? `_${lang}` : ''
  const clean = slug.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
  const head = clean ? `${type}_` : type
  const room = MAX - head.length - suffix.length
  let body = clean
  if (body.length > room) body = `${body.slice(0, room - 5).replace(/_+$/, '')}_${hash4(clean)}`
  return `${head}${body}${suffix}`
}

export function storeUrl(type: CtType, slug = '', lang = 'en'): string {
  return appStoreUrl(storeCt(type, slug, lang))
}

/** Coarse page type from a pathname — used for the header/footer Download ct. */
export function pageTypeFromPath(pathname: string): string {
  const p = pathname.replace(/^\/(es|ru|uk|zh|de|fr|it|nl|ja|pl)(?=\/|$)/, '').replace(/\/+$/, '') || '/'
  if (p === '/') return 'home'
  if (p.startsWith('/articles/topic/')) return 'hub'
  if (p === '/articles') return 'library'
  if (p.startsWith('/articles/')) return 'ar'
  if (p.startsWith('/reviews/vs/')) return 'vs'
  if (p.startsWith('/reviews')) return 'rv'
  if (p.startsWith('/compare')) return 'cmp'
  if (p.startsWith('/glossary')) return 'gl'
  if (p.startsWith('/tools')) return 'tool'
  if (p.startsWith('/bio')) return 'bio'
  return p.slice(1).split('/')[0].replace(/[^a-z0-9]+/g, '_').slice(0, 20) || 'page'
}
