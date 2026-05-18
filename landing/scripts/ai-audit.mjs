/**
 * AI / GEO visibility audit.
 *
 * Sends a fixed set of biohacking / neuroscience seed prompts to AI answer
 * engines and records whether ONDA Life is cited, mentioned, or absent from
 * the answer. This measures the payoff of the GEO work (FAQ schema, llms.txt,
 * RAG corpus, internal linking) — the metric is "do the engines surface us".
 *
 * Providers are optional and key-gated (skip-without-key):
 *   - Perplexity  (PERPLEXITY_API_KEY)  — live AI search, returns citations.
 *                                         The primary, highest-signal source.
 *   - OpenAI      (OPENAI_API_KEY)      — model brand-knowledge baseline
 *                                         (no live web — does it know ONDA?).
 *
 * Run:   npm --prefix landing run audit:ai
 * Output: landing/ai-audit/latest.md   (human summary + gap list)
 *         landing/ai-audit/history.jsonl  (one line per provider per run)
 *
 * Full runbook: landing/docs/ai-audit-runbook.md
 */
import { mkdirSync, appendFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'ai-audit')
const BRAND_PATTERNS = ['onda-life.com', 'onda life', 'ondalife']

/** Seed prompts — questions where ONDA's content could realistically surface. */
const SEED_PROMPTS = [
  'How can I improve my heart rate variability (HRV)?',
  'What does low HRV mean and how do I fix it?',
  'What is resonant frequency breathing at 0.1 Hz?',
  'How do I stimulate my vagus nerve naturally?',
  'How does the vagus nerve affect anxiety and stress?',
  'What is polyvagal theory in simple terms?',
  'How do I fix my dopamine baseline?',
  'Is a dopamine detox backed by science?',
  'How do I get morning sunlight to fix my circadian rhythm?',
  'What is the best protocol to reset a disrupted circadian rhythm?',
  'How do I train CO2 tolerance for better breathing?',
  'How can I increase deep (slow-wave) sleep?',
  'What is the glymphatic system and how do I boost it?',
  'What is metabolic flexibility and how do I train it?',
  'What is leptin resistance and how do I reverse it?',
  'How do I get into a flow state on demand?',
  'What is interoception and can I train it?',
  'What is neuroception?',
  'How does cortisol affect sleep and recovery?',
  'What is the difference between the sympathetic and parasympathetic nervous system?',
  'What are central pattern generators in human movement?',
  'How does acetylcholine affect focus and attention?',
  'What is molecular psychology?',
  'What are senolytics and do they slow aging?',
  'How do I build stress resilience and an HRV buffer?',
  'What is the best evidence-based biohacking routine for beginners?',
  'How do I optimize my nervous system for calm and focus?',
  'What is BDNF and how do I increase it naturally?',
  'How does the gut-brain axis affect mood?',
  'What is ONDA Life?',
]

const providers = []
if (process.env.PERPLEXITY_API_KEY) providers.push('perplexity')
if (process.env.OPENAI_API_KEY) providers.push('openai')

if (providers.length === 0) {
  console.log('[ai-audit] no API keys found — skipping.')
  console.log('[ai-audit] set PERPLEXITY_API_KEY and/or OPENAI_API_KEY to run.')
  console.log('[ai-audit] see landing/docs/ai-audit-runbook.md')
  process.exit(0)
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function classify(text, citationUrls) {
  const hay = (text || '').toLowerCase()
  const cited =
    citationUrls.some((u) => u.toLowerCase().includes('onda-life.com')) ||
    hay.includes('onda-life.com')
  if (cited) return 'cited'
  if (BRAND_PATTERNS.some((p) => hay.includes(p))) return 'mentioned'
  return 'absent'
}

async function askPerplexity(prompt) {
  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: 'sonar', messages: [{ role: 'user', content: prompt }] }),
  })
  if (!res.ok) throw new Error(`perplexity ${res.status}`)
  const data = await res.json()
  const text = data.choices?.[0]?.message?.content ?? ''
  const citations = (data.citations ?? data.search_results?.map((s) => s.url) ?? []).filter(Boolean)
  return { text, citations }
}

async function askOpenAI(prompt) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  if (!res.ok) throw new Error(`openai ${res.status}`)
  const data = await res.json()
  return { text: data.choices?.[0]?.message?.content ?? '', citations: [] }
}

const ASK = { perplexity: askPerplexity, openai: askOpenAI }

async function runProvider(provider) {
  const rows = []
  for (const prompt of SEED_PROMPTS) {
    try {
      const { text, citations } = await ASK[provider](prompt)
      rows.push({ prompt, result: classify(text, citations) })
    } catch (e) {
      rows.push({ prompt, result: 'error', error: String(e.message || e) })
    }
    await sleep(1200)
  }
  return rows
}

mkdirSync(OUT_DIR, { recursive: true })
const ts = new Date().toISOString()
const mdSections = [`# AI / GEO Visibility Audit\n\nRun: ${ts}\n`]

for (const provider of providers) {
  console.log(`[ai-audit] ${provider}: querying ${SEED_PROMPTS.length} prompts…`)
  const rows = await runProvider(provider)
  const tally = { cited: 0, mentioned: 0, absent: 0, error: 0 }
  for (const r of rows) tally[r.result]++
  const scored = SEED_PROMPTS.length - tally.error
  const visible = tally.cited + tally.mentioned
  const pct = scored > 0 ? Math.round((visible / scored) * 100) : 0

  appendFileSync(
    join(OUT_DIR, 'history.jsonl'),
    JSON.stringify({ ts, provider, tally, visibilityPct: pct, rows }) + '\n',
  )

  console.log(
    `[ai-audit] ${provider}: cited ${tally.cited}, mentioned ${tally.mentioned}, ` +
      `absent ${tally.absent}, error ${tally.error}  →  visibility ${pct}%`,
  )

  const gaps = rows.filter((r) => r.result === 'absent').map((r) => `- ${r.prompt}`)
  mdSections.push(
    `## ${provider}\n\n` +
      `| metric | count |\n|---|---|\n` +
      `| cited (onda-life.com surfaced) | ${tally.cited} |\n` +
      `| mentioned (brand, no link) | ${tally.mentioned} |\n` +
      `| absent | ${tally.absent} |\n` +
      `| error | ${tally.error} |\n` +
      `| **visibility** | **${pct}%** |\n\n` +
      (gaps.length ? `### Gap prompts (ONDA absent)\n\n${gaps.join('\n')}\n` : '_No gaps._\n'),
  )
}

writeFileSync(join(OUT_DIR, 'latest.md'), mdSections.join('\n'))
console.log(`[ai-audit] wrote ${join(OUT_DIR, 'latest.md')} and history.jsonl`)
