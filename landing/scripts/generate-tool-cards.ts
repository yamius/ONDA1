/**
 * Branded tool/calculator card image generator.
 *
 * Mirrors generate-review-cards.ts: every interactive tool gets a programmatic
 * branded "share card" (1200×630 OG ratio), rendered SVG → PNG via sharp (an
 * existing dependency — no AI, no new package, 100% our own asset). It gives
 * each /tools/<slug> page:
 *   - a unique og:image / twitter:image (proper social + Reddit unfurls)
 *   - a visible branded asset (kills the "page has no images" signal)
 *
 * Output: dist/images/tools/<slug>.png. Generated at BUILD time into dist so
 * it always matches the current tool catalogue — no committed binaries, no
 * manual re-runs. Wired as og:image in meta-inject.ts (per /tools/<slug>).
 *
 * Font: generic families only (no embedded font) so it renders identically on
 * local Windows and the Linux build container, matching ONDA's terminal look.
 */
import sharp from 'sharp'
import { mkdirSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { TOOLS } from '../src/data/tools'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'dist', 'images', 'tools')

const W = 1200
const H = 630
const BG = '#0a1018'
const GREEN = '#4ade80'
const CYAN = '#00d4ff'
const INK = '#e8eef5'
const MUTE = '#6b7d92'

/** XML-escape text for safe inclusion in SVG. */
function esc(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Normalise non-ASCII glyphs the SVG mono fallback may not carry. */
function ascii(s: string): string {
  return s.replace(/₂/g, '2').replace(/[–—]/g, '-').replace(/[’']/g, "'")
}

/** Pick a name font size that keeps the (card-friendly) name on 1–2 lines. */
function nameFontSize(name: string): number {
  const len = name.length
  if (len <= 16) return 80
  if (len <= 24) return 62
  if (len <= 32) return 50
  if (len <= 42) return 42
  return 36
}

/** Greedy word-wrap into at most `maxLines` lines, constrained to `maxWidth`. */
function wrap(name: string, fontSize: number, maxLines = 2, maxWidth = 680): string[] {
  const maxCharsPerLine = Math.floor(maxWidth / (fontSize * 0.6))
  const words = name.split(' ')
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w
    if (next.length > maxCharsPerLine && cur) {
      lines.push(cur)
      cur = w
    } else {
      cur = next
    }
  }
  if (cur) lines.push(cur)
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines - 1)
    kept.push(lines.slice(maxLines - 1).join(' '))
    return kept
  }
  return lines
}

const sharedDefs = `
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect x="0" y="0" width="${W}" height="4" fill="${GREEN}" fill-opacity="0.5"/>
  <rect x="0" y="0" width="${W * 0.5}" height="4" fill="${CYAN}" fill-opacity="0.6"/>
  <text x="80" y="90" font-family="monospace" font-size="26" font-weight="700" letter-spacing="6">
    <tspan fill="${GREEN}">ONDA</tspan><tspan fill="${MUTE}"> · </tspan><tspan fill="${CYAN}">LIFE</tspan>
  </text>`

const footer = `
  <text x="80" y="${H - 56}" font-family="monospace" font-size="22" fill="${MUTE}">onda-life.com/tools</text>
  <line x1="80" y1="${H - 100}" x2="${W - 80}" y2="${H - 100}" stroke="${MUTE}" stroke-opacity="0.15" stroke-width="1"/>`

/** Size the badge glyph down as it gets longer so it always fits the box. */
function badgeFontSize(badge: string): number {
  const len = badge.length
  if (len <= 3) return 64
  if (len <= 4) return 52
  return 40
}

function toolSvg(name: string, category: string, badge: string): string {
  const cardName = ascii(name)
  const fs = nameFontSize(cardName)
  const lines = wrap(cardName, fs, 2, 680)
  const startY = 300 - (lines.length - 1) * (fs * 0.55)
  const lastBaseline = startY + (lines.length - 1) * fs * 1.1
  const nameTspans = lines
    .map((ln, i) => `<tspan x="80" dy="${i === 0 ? 0 : fs * 1.1}">${esc(ln)}</tspan>`)
    .join('')
  const bfs = badgeFontSize(badge)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  ${sharedDefs}
  <text x="80" y="180" font-family="monospace" font-size="24" font-weight="600" letter-spacing="3" fill="${CYAN}">${esc(ascii(category))} · FREE TOOL</text>
  <text y="${startY}" font-family="sans-serif" font-size="${fs}" font-weight="800" fill="${INK}">${nameTspans}</text>
  <text x="80" y="${lastBaseline + fs * 0.55 + 16}" font-family="monospace" font-size="26" fill="${MUTE}">interactive tool</text>
  <g>
    <rect x="${W - 360}" y="200" width="280" height="180" rx="20" fill="${GREEN}" fill-opacity="0.10" stroke="${GREEN}" stroke-opacity="0.4" stroke-width="2"/>
    <text x="${W - 220}" y="${300 + bfs * 0.18}" font-family="monospace" font-size="${bfs}" font-weight="800" fill="${GREEN}" text-anchor="middle">${esc(ascii(badge))}</text>
    <text x="${W - 220}" y="352" font-family="monospace" font-size="22" fill="${MUTE}" text-anchor="middle">ONDA TOOL</text>
  </g>
  ${footer}
</svg>`
}

async function main() {
  mkdirSync(outDir, { recursive: true })
  let n = 0
  for (const t of TOOLS) {
    const svg = toolSvg(t.name, t.category, t.badge)
    const png = await sharp(Buffer.from(svg)).png({ quality: 90 }).toBuffer()
    writeFileSync(join(outDir, `${t.slug}.png`), png)
    n++
  }
  console.log(`[tool-cards] generated ${n} cards → dist/images/tools/`)
}

main().catch((e) => {
  console.error('[tool-cards] FAILED:', e.message)
  process.exit(1)
})
