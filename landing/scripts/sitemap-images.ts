/**
 * Image sitemap. One <url> per page, with up to N <image:image> children
 * per URL (Google's spec allows up to 1000 per URL; we cap at 5 to keep
 * the file lean).
 *
 * Source priority:
 *   1. Article images (article.image + imageAlt + imageTitle + imageCaption).
 *   2. Hero image on the homepage.
 *   3. Glossary terms — currently no per-term images, skipped.
 *
 * The license URL is the canonical CC-BY-4.0 declaration; surfaced so
 * Google Images can render the licensable badge on results.
 */
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { articles } from '../src/data/articles'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')
const SITE_URL = 'https://onda-life.com'
const LICENSE_URL = 'https://creativecommons.org/licenses/by/4.0/'

function escXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

interface ImageEntry { loc: string; caption?: string; title?: string; license: string }

function imagesForArticle(a: typeof articles[number]): ImageEntry[] {
  if (!a.image) return []
  const loc = a.image.startsWith('http') ? a.image : `${SITE_URL}${a.image}`
  return [
    {
      loc,
      caption: a.imageCaption ?? a.imageAlt,
      title: a.imageTitle ?? a.title,
      license: LICENSE_URL,
    },
  ]
}

const urlBlocks: string[] = []

// Homepage hero
urlBlocks.push(`  <url>
    <loc>${SITE_URL}/</loc>
    <image:image>
      <image:loc>${SITE_URL}/onda-life-hrv-consciousness-hero.png</image:loc>
      <image:caption>${escXml('ONDA Life — Biohacking App and Consciousness OS. HRV tracking and neural optimization.')}</image:caption>
      <image:title>${escXml('ONDA Life — Biohacking App and Consciousness OS')}</image:title>
      <image:license>${LICENSE_URL}</image:license>
    </image:image>
  </url>`)

for (const a of articles) {
  const imgs = imagesForArticle(a)
  if (imgs.length === 0) continue
  const inner = imgs
    .map(
      (img) => `    <image:image>
      <image:loc>${img.loc}</image:loc>
      ${img.caption ? `<image:caption>${escXml(img.caption)}</image:caption>` : ''}
      ${img.title ? `<image:title>${escXml(img.title)}</image:title>` : ''}
      <image:license>${img.license}</image:license>
    </image:image>`,
    )
    .join('\n')
  urlBlocks.push(`  <url>
    <loc>${SITE_URL}/articles/${a.slug}</loc>
${inner}
  </url>`)
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlBlocks.join('\n')}
</urlset>
`

writeFileSync(join(distDir, 'sitemap-images.xml'), xml)
console.log(`[sitemap-images] wrote sitemap-images.xml (${urlBlocks.length} URLs)`)
