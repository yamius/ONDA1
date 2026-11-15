/**
 * Glossary card generator (variant C, owner 2026-11-15) — see src/data/glossary-cards.ts.
 *
 * Renders one 1200×630 PNG per glossary term for EN and for every language whose
 * localized glossary term is live (same gate as the prerendered /<lang>/glossary/<slug>
 * pages), into dist/images/glossary/<lang>/<slug>.png. SVG → PNG via sharp, like
 * generate-tool-cards.ts.
 *
 * Fonts: Roboto Mono Regular + Bold TTF in scripts/fonts (Latin + Cyrillic subset; WOFF2 does NOT load in
 * the Linux build container — cards rendered as boxes on 2026-11-15)
 * through a private fontconfig file, so the output is identical on Windows and on the
 * Linux build container and never depends on system fonts.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { tmpdir } from 'os'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const fwd = (p: string) => p.replace(/\\/g, '/')
const fcDir = join(tmpdir(), 'onda-glossary-fc')
mkdirSync(join(fcDir, 'cache'), { recursive: true })
writeFileSync(
  join(fcDir, 'fonts.conf'),
  `<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig><dir>${fwd(join(ROOT, 'scripts', 'fonts'))}</dir><cachedir>${fwd(join(fcDir, 'cache'))}</cachedir></fontconfig>`,
)
process.env.FONTCONFIG_FILE = join(fcDir, 'fonts.conf') // must be set before sharp loads

const { default: sharp } = await import('sharp')
const { glossaryTerms } = await import('../src/data/glossary')
const { liveGlossarySlugsByLang } = await import('./prerender-routes')
const { GLOSSARY_CARD_W: W, GLOSSARY_CARD_H: H, GLOSSARY_CARD_BAND_TOP: B0, GLOSSARY_CATEGORY_ACCENT } = await import('../src/data/glossary-cards')

const BG = '#0a1018'
const INK = '#e8eef5'
const MUTE = '#6b7d92'
const TEXT_X = 360
const TEXT_W = W - TEXT_X - 60

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const clean = (s: string) => s.replace(/\*\*|__|`/g, '').replace(/\s+/g, ' ').trim()

/** Monospace width model: one glyph ≈ 0.6 em. */
function fitLine(s: string, size: number, maxW: number): string {
  const max = Math.floor(maxW / (size * 0.6))
  if (s.length <= max) return s
  const cut = s.slice(0, max - 1)
  const sp = cut.lastIndexOf(' ')
  return `${(sp > max * 0.6 ? cut.slice(0, sp) : cut).replace(/[\s,;:.–—-]+$/, '')}…`
}

/** Title: one line at up to 60 px; long titles shrink, then wrap to two lines. */
function titleLines(t: string): { size: number; lines: string[] } {
  for (const size of [60, 54, 48, 42]) if (t.length * size * 0.6 <= TEXT_W) return { size, lines: [t] }
  const size = 40
  const max = Math.floor(TEXT_W / (size * 0.6))
  const words = t.split(' ')
  let a = ''
  while (words.length && `${a} ${words[0]}`.trim().length <= max) a = `${a} ${words.shift()}`.trim()
  if (!a) return { size, lines: [fitLine(t, size, TEXT_W)] }
  return { size, lines: [a, fitLine(words.join(' '), size, TEXT_W)].filter(Boolean) }
}

/** Up to `max` lines of monospace text, word-wrapped; the last line ends with … if cut. */
function wrapLines(s: string, size: number, maxW: number, max: number): string[] {
  const per = Math.floor(maxW / (size * 0.6))
  const words = s.split(' ')
  const lines: string[] = []
  while (words.length && lines.length < max) {
    let l = ''
    while (words.length && `${l} ${words[0]}`.trim().length <= per) l = `${l} ${words.shift()}`.trim()
    if (!l) l = words.shift()!.slice(0, per)
    lines.push(l)
  }
  if (words.length) lines[lines.length - 1] = fitLine(`${lines[lines.length - 1]} ${words.join(' ')}`, size, maxW)
  return lines
}

/** Layout (owner 2026-11-15): brand line on top, no category label, title higher,
 *  two lines of description below it. */
function cardSvg(title: string, category: string, desc: string): string {
  const a = GLOSSARY_CATEGORY_ACCENT[category] ?? '#4ade80'
  const y = (v: number) => B0 + v
  const { size, lines } = titleLines(title)
  const two = lines.length > 1
  const titleY = y(two ? 112 : 128)
  const tspans = lines.map((l, i) => `<tspan x="${TEXT_X}" dy="${i ? size * 1.1 : 0}">${esc(l)}</tspan>`).join('')
  const descTop = titleY + (lines.length - 1) * size * 1.1 + 48
  const dl = wrapLines(desc, 22, TEXT_W, two ? 2 : 3)
  const descTspans = dl.map((l, i) => `<tspan x="${TEXT_X}" dy="${i ? 32 : 0}">${esc(l)}</tspan>`).join('')
  const letter = [...title][0]?.toUpperCase() ?? '•'
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect x="0" y="${B0}" width="300" height="300" fill="${a}" fill-opacity="0.10"/>
  <text x="150" y="${y(212)}" text-anchor="middle" font-family="Roboto Mono" font-weight="700" font-size="180" fill="${a}" fill-opacity="0.85">${esc(letter)}</text>
  <text x="${TEXT_X}" y="${y(52)}" font-family="Roboto Mono" font-size="18" letter-spacing="4" fill="${MUTE}">ONDA · LIFE GLOSSARY</text>
  <text y="${titleY}" font-family="Roboto Mono" font-weight="700" font-size="${size}" fill="${INK}">${tspans}</text>
  <text y="${descTop}" font-family="Roboto Mono" font-size="22" fill="${MUTE}">${descTspans}</text>
</svg>`
}

/** Card phrase: the first sentence of the entry body (the definition), so the card does not
 *  repeat the short description printed under it in the list; falls back to the short description. */
function cardPhrase(content: string | undefined, fallback: string): string {
  const text = clean(
    (content ?? '')
      .split(/\r?\n/)
      .filter((l) => l.trim() && !/^\s*(#|>|[-*]\s|\d+\.\s|\|)/.test(l))
      .join(' ')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/\{\{[^}]*\}\}/g, ''),
  )
  const m = text.match(/^(.{30,240}?[.!?。])(\s|$)/)
  const first = m ? m[1] : ''
  if (!first || first.toLowerCase() === fallback.toLowerCase()) return fallback
  return first
}

type Body = { title?: string; shortDescription?: string; content?: string }
const bodiesFor = (lang: string): Record<string, Body> => {
  try {
    return (JSON.parse(readFileSync(join(ROOT, 'public', 'locales', lang, 'glossary.json'), 'utf-8')).bodies ?? {}) as Record<string, Body>
  } catch {
    return {}
  }
}

const jobs: { lang: string; slug: string; title: string; category: string; desc: string }[] = []
for (const t of glossaryTerms) jobs.push({ lang: 'en', slug: t.slug, title: clean(t.title), category: t.category, desc: cardPhrase(t.content, clean(t.shortDescription)) })
for (const [lang, slugs] of Object.entries(liveGlossarySlugsByLang)) {
  const bodies = bodiesFor(lang)
  for (const slug of slugs) {
    const t = glossaryTerms.find((x) => x.slug === slug)
    if (!t) continue
    const b = bodies[slug] ?? {}
    jobs.push({ lang, slug, title: clean(b.title || t.title), category: t.category, desc: b.content ? cardPhrase(b.content, clean(b.shortDescription || t.shortDescription)) : clean(b.shortDescription || t.shortDescription) })
  }
}

let n = 0
for (const j of jobs) {
  const dir = join(ROOT, 'dist', 'images', 'glossary', j.lang)
  mkdirSync(dir, { recursive: true })
  const png = await sharp(Buffer.from(cardSvg(j.title, j.category, j.desc))).png({ compressionLevel: 9, palette: true, quality: 90 }).toBuffer()
  writeFileSync(join(dir, `${j.slug}.png`), png)
  n++
}
const langs = [...new Set(jobs.map((j) => j.lang))].join(', ')
console.log(`[glossary-cards] generated ${n} cards (${langs}) → dist/images/glossary/`)
