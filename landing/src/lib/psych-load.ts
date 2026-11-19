/**
 * Full psychology page (body + claims), kept out of the client bundle: SSR / build scripts register them
 * (registerPsychFull), the client fetches /_psych/<lang>/<topic>.json (scripts/fetch-psych.ts).
 * Tiny on purpose: main.tsx imports loadPsychFull for the pre-hydration preload.
 */
import type { PsychClaim, PsychPage, PsychRelatedLink } from './psych'

export interface PsychFull extends Omit<PsychPage, 'claimIds' | 'ownerReviewed'> { related?: PsychRelatedLink[]; uncertainty?: string; claims: PsychClaim[]; body: string }


let server: ((lang: string, topic: string) => PsychFull | undefined) | null = null
/** SSR (entry-server) and build scripts (meta-inject) register the full pages here. */
export function registerPsychFull(pages: PsychFull[]): void {
  server = (lang, topic) => pages.find((p) => p.lang === lang && p.topic === topic && !p.angle)
}
const cache = new Map<string, PsychFull | null>()
const inflight = new Map<string, Promise<void>>()
export function loadPsychFull(lang: string, topic: string): Promise<void> {
  const key = `${lang}/${topic}`
  if (cache.has(key)) return Promise.resolve()
  const ex = inflight.get(key)
  if (ex) return ex
  const pr = fetch(`/_psych/${key}.json`).then((r) => (r.ok ? (r.json() as Promise<PsychFull>) : null)).catch(() => null)
    .then((d) => { cache.set(key, d); inflight.delete(key) })
  inflight.set(key, pr)
  return pr
}
/** Full page. SSR: synchronous; client: suspends until fetched. */
export function readPsychFull(lang: string, topic: string): PsychFull | undefined {
  if (server) return server(lang, topic)
  const key = `${lang}/${topic}`
  if (!cache.has(key)) throw loadPsychFull(lang, topic)
  return cache.get(key) ?? undefined
}
export const peekPsychFull = (lang: string, topic: string): PsychFull | undefined => (server ? server(lang, topic) : cache.get(`${lang}/${topic}`) ?? undefined)
