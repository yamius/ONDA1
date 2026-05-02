/**
 * Generate WebP + AVIF variants of every PNG/JPG in /public.
 *
 * For each source image we emit:
 *   - <name>.webp           (full resolution)
 *   - <name>.avif           (full resolution, ~30% smaller than WebP)
 *   - <name>-640w.webp      (responsive, only if source > 640px wide)
 *   - <name>-640w.avif      (responsive)
 *
 * Skip favicons / app icons (SKIP set). Auto-reduces quality for outputs
 * that exceed MAX_KB (~100KB target keeps LCP fast on slow networks).
 *
 * The OptimizedImage React component picks the best variant via <picture>
 * + srcset / sizes, with PNG/JPG as the universal fallback.
 *
 * Run automatically as the first step of `npm run build`.
 */
import sharp from 'sharp'
import { readdir, stat, writeFile, access } from 'fs/promises'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const publicDir = join(__dirname, '..', 'public')

const SKIP = new Set([
  'favicon.png',
  'apple-touch-icon.png',
  'icon-192.png',
  'icon-512.png',
  'onda-logo-source.png',
])
const MAX_KB = 99
const RESPONSIVE_WIDTH = 640
const QUALITIES_WEBP = [82, 72, 60, 48, 38]
const QUALITIES_AVIF = [60, 50, 40, 32, 24]

async function exists(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

async function findImages(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = join(dir, e.name)
    if (e.isDirectory()) {
      await findImages(full, files)
    } else if (/\.(png|jpg|jpeg)$/i.test(e.name) && !SKIP.has(e.name)) {
      files.push(full)
    }
  }
  return files
}

/** Walk down the quality ladder until output fits under MAX_KB. */
async function encodeWebP(pipeline) {
  for (const q of QUALITIES_WEBP) {
    const buf = await pipeline.clone().webp({ quality: q, effort: 4 }).toBuffer()
    if (buf.length <= MAX_KB * 1024) return { buf, quality: q }
  }
  const buf = await pipeline.clone().webp({ quality: 38, effort: 4 }).toBuffer()
  return { buf, quality: 38 }
}

async function encodeAvif(pipeline) {
  // effort: 2 is sharp's default and 3-5x faster than effort: 4 with negligible
  // quality difference at our target file sizes. Higher effort is only worth it
  // for offline batch encoding, not per-deploy builds.
  for (const q of QUALITIES_AVIF) {
    const buf = await pipeline.clone().avif({ quality: q, effort: 2 }).toBuffer()
    if (buf.length <= MAX_KB * 1024) return { buf, quality: q }
  }
  const buf = await pipeline.clone().avif({ quality: 24, effort: 2 }).toBuffer()
  return { buf, quality: 24 }
}

async function processOne(src) {
  const meta = await sharp(src).metadata()
  const variants = [
    { suffix: '', pipeline: () => sharp(src) },
  ]
  // Add a responsive 640w variant only when the source is meaningfully wider.
  if (meta.width && meta.width > RESPONSIVE_WIDTH * 1.2) {
    variants.push({
      suffix: '-640w',
      pipeline: () => sharp(src).resize({ width: RESPONSIVE_WIDTH }),
    })
  }

  const reports = []
  for (const v of variants) {
    const webpPath = src.replace(/\.(png|jpg|jpeg)$/i, `${v.suffix}.webp`)
    const avifPath = src.replace(/\.(png|jpg|jpeg)$/i, `${v.suffix}.avif`)

    if (!(await exists(webpPath))) {
      const { buf, quality } = await encodeWebP(v.pipeline())
      await writeFile(webpPath, buf)
      reports.push(`  ${webpPath.replace(publicDir, '')}: ${(buf.length / 1024).toFixed(0)}KB (q${quality})`)
    }
    if (!(await exists(avifPath))) {
      const { buf, quality } = await encodeAvif(v.pipeline())
      await writeFile(avifPath, buf)
      reports.push(`  ${avifPath.replace(publicDir, '')}: ${(buf.length / 1024).toFixed(0)}KB (q${quality})`)
    }
  }

  return reports
}

async function main() {
  const images = await findImages(publicDir)
  let processed = 0
  let untouched = 0
  for (const src of images) {
    const reports = await processOne(src)
    if (reports.length === 0) {
      untouched++
      continue
    }
    console.log(`${src.replace(publicDir, '')}:`)
    for (const r of reports) console.log(r)
    processed++
  }
  console.log(`\nDone. ${processed} processed, ${untouched} already up to date.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
