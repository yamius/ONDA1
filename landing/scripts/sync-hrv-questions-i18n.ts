/**
 * Writes the translated "HRV Questions, Answered" page into each locale's
 * public/locales/<lang>/articles.json → bodies['hrv-questions-answered'].
 * Source of the translations: src/data/hrv-questions-i18n/<lang>.json.
 * The body markdown is built exactly like the EN article (TOC + H2 groups + H3
 * questions); the Q&A goes to faqSchema (FAQPage JSON-LD only — the questions
 * are already the visible body). Re-run after editing a translation:
 *   npx tsx scripts/sync-hrv-questions-i18n.ts
 */
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import GithubSlugger from 'github-slugger'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const SLUG = 'hrv-questions-answered'
const LANGS = ['es', 'ru', 'uk', 'zh', 'de', 'fr', 'it', 'nl', 'ja', 'pl', 'pt']

interface Src {
  title: string
  description: string
  intro: string
  neuralSuggestion: { text: string; linkText: string }
  groups: { title: string; items: { id: string; q: string; a: string }[] }[]
}

const stripMd = (s: string) =>
  s.replace(/\s*(?:·\s*)?\[[^\]]*→\]\([^)]*\)/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').trim()

for (const lang of LANGS) {
  const srcPath = join(root, 'src', 'data', 'hrv-questions-i18n', `${lang}.json`)
  if (!existsSync(srcPath)) continue
  const d = JSON.parse(readFileSync(srcPath, 'utf-8')) as Src
  const slugger = new GithubSlugger()
  const anchors = new Map<string, string>()
  for (const g of d.groups) {
    slugger.slug(g.title)
    for (const x of g.items) anchors.set(x.id, slugger.slug(x.q))
  }
  const toc = d.groups.map((g) => `- **${g.title}:** ${g.items.map((x) => `[${x.q}](#${anchors.get(x.id)})`).join(' · ')}`).join('\n')
  const body = d.groups.map((g) => `## ${g.title}\n\n` + g.items.map((x) => `### ${x.q}\n\n${x.a}`).join('\n\n')).join('\n\n')
  const file = join(root, 'public', 'locales', lang, 'articles.json')
  const json = JSON.parse(readFileSync(file, 'utf-8'))
  json.bodies = json.bodies ?? {}
  json.bodies[SLUG] = {
    title: d.title,
    description: d.description,
    neuralSuggestion: { text: d.neuralSuggestion.text, linkText: d.neuralSuggestion.linkText },
    content: `\n${d.intro}\n\n${toc}\n\n${body}\n`,
    faqSchema: d.groups.flatMap((g) => g.items.map((x) => ({ question: x.q, answer: stripMd(x.a) }))),
  }
  writeFileSync(file, JSON.stringify(json, null, 2) + '\n')
  console.log(`${lang}: ${d.groups.reduce((n, g) => n + g.items.length, 0)} questions`)
}
