#!/usr/bin/env node
/**
 * Stage 14 — append latest AI-audit run to the history log + render the
 * markdown dashboard with per-engine visibility trends.
 *
 *   dist/ai-audit/<label>.json  -> appended to dist/ai-audit/history.jsonl
 *                                  -> rendered into dist/ai-audit/dashboard.md
 *
 * Designed to run after scripts/ai-audit.mjs in the same CI step.
 *
 * Alerts: if the latest visibility score has dropped >20% versus the
 * previous run with the same label, exits with code 1 so the cron job
 * can surface a notice. Set ALERT_DISABLED=1 to bypass.
 */
import { readFileSync, writeFileSync, existsSync, appendFileSync, readdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const auditDir = join(dirname(__dirname), 'dist', 'ai-audit')

const LABEL = process.env.AI_AUDIT_LABEL ?? 'baseline'
const REPORT_PATH = join(auditDir, `${LABEL}.json`)
const HISTORY_PATH = join(auditDir, 'history.jsonl')
const DASHBOARD_PATH = join(auditDir, 'dashboard.md')
const ALERT_THRESHOLD = Number(process.env.ALERT_THRESHOLD ?? 0.2)

if (!existsSync(REPORT_PATH)) {
  console.error(`[ai-audit-history] missing report ${REPORT_PATH} — run scripts/ai-audit.mjs first`)
  process.exit(2)
}

const report = JSON.parse(readFileSync(REPORT_PATH, 'utf-8'))
const summary = {
  timestamp: report.timestamp,
  label: report.label ?? LABEL,
  engines: report.engines,
  prompts: report.prompts,
  visibility: report.visibility,
  aggregateScore: report.aggregateScore,
  perEngine: report.perEngine,
}

// Append one JSON line — never rewrite history (immutable audit log).
appendFileSync(HISTORY_PATH, JSON.stringify(summary) + '\n')

// Read the entire history for the dashboard.
const allRuns = existsSync(HISTORY_PATH)
  ? readFileSync(HISTORY_PATH, 'utf-8').trim().split('\n').map((l) => JSON.parse(l))
  : [summary]

const sameLabel = allRuns.filter((r) => r.label === LABEL)
const previous = sameLabel[sameLabel.length - 2]
let alert = null
if (previous && summary.visibility !== undefined) {
  const drop = (previous.visibility - summary.visibility) / Math.max(previous.visibility, 0.001)
  if (drop > ALERT_THRESHOLD) {
    alert = {
      previousVisibility: previous.visibility,
      currentVisibility: summary.visibility,
      dropPct: Number((drop * 100).toFixed(1)),
    }
  }
}

const md = [
  '# AI Visibility Dashboard',
  '',
  `Generated: ${new Date().toISOString()}`,
  `Total runs in history: ${allRuns.length}`,
  '',
]

if (alert) {
  md.push(
    '> ⚠️ **VISIBILITY ALERT** — drop of ' +
      `${alert.dropPct}% vs previous run (${alert.previousVisibility} → ${alert.currentVisibility}).` +
      ' Investigate: algorithmic refresh, lost backlinks, or robots/canonical regression.',
    '',
  )
}

md.push('## Latest run')
md.push('')
md.push(`- **Label**: ${summary.label}`)
md.push(`- **Timestamp**: ${summary.timestamp}`)
md.push(`- **Engines**: ${(summary.engines ?? []).join(', ') || '(none — DRY_RUN)'}`)
md.push(`- **Prompts**: ${summary.prompts}`)
md.push(`- **Visibility**: ${summary.visibility}`)
md.push(`- **Aggregate score**: ${summary.aggregateScore}`)
md.push('')

md.push('## History (last 30)')
md.push('')
md.push('| Timestamp | Label | Visibility | Aggregate |')
md.push('|---|---|---:|---:|')
for (const r of allRuns.slice(-30)) {
  md.push(`| ${r.timestamp} | ${r.label} | ${r.visibility ?? '-'} | ${r.aggregateScore ?? '-'} |`)
}
md.push('')

if (sameLabel.length >= 2) {
  md.push(`## Trend for label \`${LABEL}\``)
  md.push('')
  md.push('| Timestamp | Visibility | Δ |')
  md.push('|---|---:|---:|')
  for (let i = 0; i < sameLabel.length; i++) {
    const cur = sameLabel[i]
    const prev = sameLabel[i - 1]
    const delta = prev ? Number((cur.visibility - prev.visibility).toFixed(3)) : '-'
    md.push(`| ${cur.timestamp} | ${cur.visibility ?? '-'} | ${delta} |`)
  }
}

writeFileSync(DASHBOARD_PATH, md.join('\n'))
console.log(`[ai-audit-history] appended history.jsonl + wrote dashboard.md`)
if (alert && process.env.ALERT_DISABLED !== '1') {
  console.error('[ai-audit-history] visibility alert triggered')
  process.exit(1)
}
