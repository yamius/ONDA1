/**
 * Generate favicons from ONDA logo for iOS and Android.
 * Run: node scripts/generate-favicons.mjs
 */
import sharp from 'sharp'
import { writeFile } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')
const sourcePath = join(publicDir, 'onda-logo-source.png')
const BG = '#0a0a0a' // theme-color, no transparency for Apple

/** Create circular mask SVG */
function circleMask(size) {
  const r = size / 2
  return Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${r}" cy="${r}" r="${r}" fill="white"/></svg>`
  )
}

async function main() {
  const img = await sharp(sourcePath)
  const meta = await img.metadata()
  const size = Math.min(meta.width ?? 512, meta.height ?? 512)

  const resize = async (w) => {
    const resized = await img
      .clone()
      .resize(w, w, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .ensureAlpha()
      .toBuffer()
    const mask = await sharp(circleMask(w)).png().toBuffer()
    return sharp(resized)
      .composite([{ input: mask, blend: 'dest-in' }])
      .flatten({ background: BG })
      .png()
  }

  // apple-touch-icon.png (180x180, circular)
  await (await resize(180)).toFile(join(publicDir, 'apple-touch-icon.png'))
  console.log('Created apple-touch-icon.png (180x180, circular)')

  // icon-192.png
  await (await resize(192)).toFile(join(publicDir, 'icon-192.png'))
  console.log('Created icon-192.png (circular)')

  // icon-512.png
  await (await resize(512)).toFile(join(publicDir, 'icon-512.png'))
  console.log('Created icon-512.png (circular)')

  // favicon.png (32x32, circular)
  const buf32Png = await (await resize(32)).toBuffer()
  await sharp(buf32Png).toFile(join(publicDir, 'favicon.png'))
  console.log('Created favicon.png (32x32, circular)')

  // favicon.svg — embed 32x32 circular logo as base64
  const base64 = buf32Png.toString('base64')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="${BG}"/>
  <image href="data:image/png;base64,${base64}" x="0" y="0" width="32" height="32"/>
</svg>`
  await writeFile(join(publicDir, 'favicon.svg'), svg)
  console.log('Created favicon.svg (from logo)')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
