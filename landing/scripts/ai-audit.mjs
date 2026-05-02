#!/usr/bin/env node
/**
 * AI Visibility Audit (Stage 1 + 14 of GEO sprint).
 *
 * Runs 50 seed prompts (docs/ai-audit-prompts.md) against every AI / search
 * engine for which we have credentials. For each (engine, prompt) pair:
 *   - record citation rank (1 = first cited URL contains onda-life.com,
 *     N = Nth, 0 = not cited).
 *   - record whether the answer text mentions onda-life.com (=> 0.5 if
 *     uncited, otherwise the rank wins).
 *   - persist to dist/ai-audit/<label>.json
 *
 * Engines (each gracefully skipped if its env var is missing):
 *   - PERPLEXITY_API_KEY   → Perplexity Sonar (`sonar-small-online`).
 *   - OPENAI_API_KEY       → OpenAI Chat Completions with web_search tool.
 *   - ANTHROPIC_API_KEY    → Claude messages with web_search tool.
 *   - BRAVE_SEARCH_API_KEY → Brave Web Search.
 *   - BING_SEARCH_API_KEY  → Bing Web Search.
 *
 * Usage:
 *   tsx scripts/ai-audit.mjs                # writes baseline.json
 *   AI_AUDIT_LABEL=post-sprint  tsx scripts/ai-audit.mjs
 *   AI_AUDIT_PROMPTS=docs/custom-prompts.md tsx scripts/ai-audit.mjs
 *
 * Cron-friendly: the same script is invoked by .github/workflows/ai-audit.yml
 * (Stage 14). When DRY_RUN=1 (or no engines configured), the script writes a
 * synthesized "no-engines" report instead of failing — useful for verifying
 * the build pipeline without burning API quota.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')
const distDir = join(projectRoot, 'dist', 'ai-audit')
const SITE_HOST = 'onda-life.com'
const SITE_REGEX = /onda[\s-]?life\.com/i
const TIMEOUT_MS = Number(process.env.AI_AUDIT_TIMEOUT ?? 25000)
const LABEL = (process.env.AI_AUDIT_LABEL ?? 'baseline').replace(/[^a-z0-9._-]/gi, '_')
const PROMPTS_PATH = process.env.AI_AUDIT_PROMPTS
  ? join(projectRoot, process.env.AI_AUDIT_PROMPTS)
  : join(projectRoot, 'docs', 'ai-audit-prompts.md')

// ---------------------------------------------------------------------------
// Prompt loader — parses the markdown table at docs/ai-audit-prompts.md.
// ---------------------------------------------------------------------------
function loadPrompts() {
  if (!existsSync(PROMPTS_PATH)) {
    throw new Error(`[ai-audit] cannot find prompts file: ${PROMPTS_PATH}`)
  }
  const raw = readFileSync(PROMPTS_PATH, 'utf-8')
  const lines = raw.split(/\r?\n/)
  const out = []
  for (const line of lines) {
    // Match `| 1  | prompt text | topic |`
    const m = line.match(/^\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*$/)
    if (!m) continue
    out.push({ id: Number(m[1]), prompt: m[2].trim(), topic: m[3].trim() })
  }
  if (out.length === 0) {
    throw new Error(`[ai-audit] no prompts parsed from ${PROMPTS_PATH}`)
  }
  return out
}

// ---------------------------------------------------------------------------
// Citation scoring
// ---------------------------------------------------------------------------
/** Given a list of cited URLs and the raw answer text, return rank score. */
function scoreCitation(citedUrls, answerText) {
  for (let i = 0; i < citedUrls.length; i++) {
    if (typeof citedUrls[i] === 'string' && SITE_REGEX.test(citedUrls[i])) {
      return { rank: i + 1, mentioned: true, source: 'cited' }
    }
  }
  if (answerText && SITE_REGEX.test(answerText)) {
    return { rank: 0, mentioned: true, source: 'mentioned' }
  }
  return { rank: 0, mentioned: false, source: 'absent' }
}

// ---------------------------------------------------------------------------
// Engine adapters — each returns { citedUrls: string[], answer: string }.
// All adapters MUST tolerate API errors and surface them via the catch in
// runEngine() instead of crashing the audit run.
// ---------------------------------------------------------------------------
async function fetchJson(url, opts) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, { ...opts, signal: ctrl.signal })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      throw new Error(`HTTP ${res.status}: ${body.slice(0, 200)}`)
    }
    return await res.json()
  } finally {
    clearTimeout(timer)
  }
}

async function queryPerplexity(prompt) {
  const key = process.env.PERPLEXITY_API_KEY
  if (!key) return null
  const body = {
    model: 'sonar',
    messages: [{ role: 'user', content: prompt }],
    return_citations: true,
  }
  const data = await fetchJson('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const answer = data?.choices?.[0]?.message?.content ?? ''
  const citedUrls = Array.isArray(data?.citations) ? data.citations : []
  return { citedUrls, answer }
}

async function queryOpenAI(prompt) {
  const key = process.env.OPENAI_API_KEY
  if (!key) return null
  // OpenAI Responses API with web_search built-in tool.
  const body = {
    model: process.env.AI_AUDIT_OPENAI_MODEL ?? 'gpt-4o-mini',
    tools: [{ type: 'web_search' }],
    input: prompt,
  }
  const data = await fetchJson('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const text = data?.output_text ?? ''
  const citedUrls = []
  // Scan for url_citation annotations in the structured output.
  for (const item of data?.output ?? []) {
    for (const c of item?.content ?? []) {
      for (const a of c?.annotations ?? []) {
        if (a?.url) citedUrls.push(a.url)
      }
    }
  }
  return { citedUrls, answer: text }
}

async function queryAnthropic(prompt) {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return null
  const body = {
    model: process.env.AI_AUDIT_CLAUDE_MODEL ?? 'claude-3-5-sonnet-latest',
    max_tokens: 1024,
    tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 5 }],
    messages: [{ role: 'user', content: prompt }],
  }
  const data = await fetchJson('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const text = (data?.content ?? [])
    .map((c) => (typeof c?.text === 'string' ? c.text : ''))
    .join(' ')
  const citedUrls = []
  for (const c of data?.content ?? []) {
    if (c?.type === 'web_search_tool_result' && Array.isArray(c?.content)) {
      for (const r of c.content) if (r?.url) citedUrls.push(r.url)
    }
    for (const a of c?.citations ?? []) if (a?.url) citedUrls.push(a.url)
  }
  return { citedUrls, answer: text }
}

async function queryBrave(prompt) {
  const key = process.env.BRAVE_SEARCH_API_KEY
  if (!key) return null
  const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(prompt)}&count=10`
  const data = await fetchJson(url, {
    headers: { 'X-Subscription-Token': key, Accept: 'application/json' },
  })
  const results = data?.web?.results ?? []
  const citedUrls = results.map((r) => r?.url).filter(Boolean)
  const answer = results.map((r) => `${r?.title ?? ''} ${r?.description ?? ''}`).join(' ')
  return { citedUrls, answer }
}

async function queryBing(prompt) {
  const key = process.env.BING_SEARCH_API_KEY
  if (!key) return null
  const url = `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(prompt)}&count=10`
  const data = await fetchJson(url, {
    headers: { 'Ocp-Apim-Subscription-Key': key },
  })
  const results = data?.webPages?.value ?? []
  const citedUrls = results.map((r) => r?.url).filter(Boolean)
  const answer = results.map((r) => `${r?.name ?? ''} ${r?.snippet ?? ''}`).join(' ')
  return { citedUrls, answer }
}

const ENGINES = [
  { id: 'perplexity', label: 'Perplexity Sonar', run: queryPerplexity, env: 'PERPLEXITY_API_KEY' },
  { id: 'openai', label: 'OpenAI web_search', run: queryOpenAI, env: 'OPENAI_API_KEY' },
  { id: 'claude', label: 'Anthropic web_search', run: queryAnthropic, env: 'ANTHROPIC_API_KEY' },
  { id: 'brave', label: 'Brave Search', run: queryBrave, env: 'BRAVE_SEARCH_API_KEY' },
  { id: 'bing', label: 'Bing Web Search', run: queryBing, env: 'BING_SEARCH_API_KEY' },
]

async function runEngine(engine, prompt) {
  try {
    const out = await engine.run(prompt)
    if (!out) return { skipped: true, reason: `missing ${engine.env}` }
    const score = scoreCitation(out.citedUrls, out.answer)
    return { score, citedCount: out.citedUrls.length }
  } catch (err) {
    return { error: String(err?.message ?? err) }
  }
}

// ---------------------------------------------------------------------------
// Aggregate visibility score: sum over (engine, prompt) of the per-pair score.
// per-pair = 1 / rank when rank > 0, else 0.5 if mentioned, else 0.
// ---------------------------------------------------------------------------
function pairScore(score) {
  if (!score) return 0
  if (score.rank > 0) return 1 / score.rank
  if (score.mentioned) return 0.5
  return 0
}

async function main() {
  const prompts = loadPrompts()
  const enabled = ENGINES.filter((e) => process.env[e.env])
  const dryRun = process.env.DRY_RUN === '1' || enabled.length === 0
  console.log(
    `[ai-audit] label=${LABEL} prompts=${prompts.length} engines=${enabled.length}${dryRun ? ' (DRY_RUN — no live calls)' : ''}`,
  )
  for (const e of ENGINES) {
    console.log(`  - ${e.label}: ${process.env[e.env] ? 'configured' : 'skipped (no ' + e.env + ')'}`)
  }

  const results = []
  for (const p of prompts) {
    const row = { id: p.id, prompt: p.prompt, topic: p.topic, engines: {} }
    for (const e of enabled) {
      // eslint-disable-next-line no-await-in-loop
      const r = await runEngine(e, p.prompt)
      row.engines[e.id] = r
    }
    results.push(row)
    if (!dryRun) console.log(`[ai-audit] ${p.id}/${prompts.length} ${p.prompt.slice(0, 60)}`)
  }

  // Aggregate
  let totalScore = 0
  let totalSlots = 0
  const perEngine = {}
  const perTopic = {}
  for (const e of enabled) perEngine[e.id] = { cited: 0, mentioned: 0, scored: 0, total: 0 }
  for (const row of results) {
    for (const e of enabled) {
      const r = row.engines[e.id]
      totalSlots++
      perEngine[e.id].total++
      perTopic[row.topic] ??= { scored: 0, total: 0 }
      perTopic[row.topic].total++
      if (r?.score) {
        const s = pairScore(r.score)
        totalScore += s
        perEngine[e.id].scored += s
        perTopic[row.topic].scored += s
        if (r.score.rank > 0) perEngine[e.id].cited++
        else if (r.score.mentioned) perEngine[e.id].mentioned++
      }
    }
  }

  const report = {
    label: LABEL,
    timestamp: new Date().toISOString(),
    siteHost: SITE_HOST,
    prompts: prompts.length,
    engines: enabled.map((e) => e.id),
    skippedEngines: ENGINES.filter((e) => !enabled.includes(e)).map((e) => e.id),
    dryRun,
    aggregateScore: Number(totalScore.toFixed(3)),
    visibility:
      totalSlots > 0 ? Number((totalScore / totalSlots).toFixed(3)) : 0,
    perEngine,
    perTopic,
    results,
  }

  mkdirSync(distDir, { recursive: true })
  const outPath = join(distDir, `${LABEL}.json`)
  writeFileSync(outPath, JSON.stringify(report, null, 2))
  console.log(
    `[ai-audit] wrote ${outPath} — aggregateScore=${report.aggregateScore} visibility=${report.visibility}`,
  )

  // Markdown summary alongside JSON for fast review.
  const mdLines = [
    `# AI Visibility Audit — ${LABEL}`,
    '',
    `Generated: ${report.timestamp}`,
    `Engines: ${enabled.map((e) => e.label).join(', ') || '(none — DRY_RUN)'}`,
    '',
    `**Aggregate score:** ${report.aggregateScore}  `,
    `**Visibility (avg per engine×prompt):** ${report.visibility}`,
    '',
    '## Per-engine',
    '| Engine | Cited | Mentioned | Total | Score |',
    '|---|---:|---:|---:|---:|',
    ...enabled.map((e) => {
      const x = perEngine[e.id]
      return `| ${e.label} | ${x.cited} | ${x.mentioned} | ${x.total} | ${x.scored.toFixed(2)} |`
    }),
    '',
    '## Per-topic',
    '| Topic | Score | Total |',
    '|---|---:|---:|',
    ...Object.entries(perTopic)
      .sort((a, b) => b[1].scored - a[1].scored)
      .map(([t, x]) => `| ${t} | ${x.scored.toFixed(2)} | ${x.total} |`),
  ]
  writeFileSync(join(distDir, `${LABEL}.md`), mdLines.join('\n'))
}

main().catch((err) => {
  console.error('[ai-audit] FATAL', err)
  process.exit(1)
})
