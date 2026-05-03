#!/usr/bin/env node
/**
 * Read-only baseline SEO audit.
 *
 * Walks dist/**\/*.html, extracts the SEO-relevant signals from each
 * page, and writes a report to dist/audit-baseline.{json,md}.
 *
 * No production code is touched. Safe to run multiple times.
 *
 * Usage:
 *   cd landing && node scripts/audit-baseline.mjs
 */

import { readFile, readdir, stat, writeFile, mkdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { JSDOM } from 'jsdom';

const DIST = 'dist';
const TITLE_MIN = 50, TITLE_MAX = 60;
const DESC_MIN = 140, DESC_MAX = 160;

async function walk(dir, out = []) {
  for (const name of await readdir(dir)) {
    const p = join(dir, name);
    const s = await stat(p);
    if (s.isDirectory()) await walk(p, out);
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

function audit(html, file) {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const head = doc.head;

  const title = doc.querySelector('title')?.textContent?.trim() ?? null;
  const desc = head.querySelector('meta[name="description"]')?.getAttribute('content') ?? null;
  const canonical = head.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null;
  const robots = head.querySelector('meta[name="robots"]')?.getAttribute('content') ?? null;
  const ogImage = head.querySelector('meta[property="og:image"]')?.getAttribute('content') ?? null;
  const ogLocale = head.querySelector('meta[property="og:locale"]')?.getAttribute('content') ?? null;
  const ogType = head.querySelector('meta[property="og:type"]')?.getAttribute('content') ?? null;
  const ogTitle = head.querySelector('meta[property="og:title"]')?.getAttribute('content') ?? null;
  const author = head.querySelector('meta[name="author"]')?.getAttribute('content') ?? null;
  const datePublished = head.querySelector('meta[property="article:published_time"]')?.getAttribute('content') ?? null;
  const dateModified = head.querySelector('meta[property="article:modified_time"]')?.getAttribute('content') ?? null;

  const hreflangs = [...head.querySelectorAll('link[rel="alternate"][hreflang]')].map(l => ({
    hreflang: l.getAttribute('hreflang'),
    href: l.getAttribute('href'),
  }));

  const jsonldTypes = [];
  let jsonldErrors = 0;
  for (const s of head.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const data = JSON.parse(s.textContent || '{}');
      const collect = (node) => {
        if (!node) return;
        if (Array.isArray(node)) return node.forEach(collect);
        if (node['@type']) {
          const t = Array.isArray(node['@type']) ? node['@type'].join('+') : node['@type'];
          jsonldTypes.push(t);
        }
        if (node['@graph']) collect(node['@graph']);
      };
      collect(data);
    } catch {
      jsonldErrors++;
    }
  }

  const h1Count = doc.querySelectorAll('h1').length;
  const imgCount = doc.querySelectorAll('img').length;
  const imgsWithoutAlt = [...doc.querySelectorAll('img')].filter(i => !i.getAttribute('alt')).length;

  return {
    file,
    title,
    titleLen: title?.length ?? 0,
    titleInBudget: title ? title.length >= TITLE_MIN && title.length <= TITLE_MAX : false,
    desc,
    descLen: desc?.length ?? 0,
    descInBudget: desc ? desc.length >= DESC_MIN && desc.length <= DESC_MAX : false,
    canonical,
    robots,
    ogImage,
    ogLocale,
    ogType,
    ogTitle,
    author,
    datePublished,
    dateModified,
    hreflangCount: hreflangs.length,
    hreflangs: hreflangs.slice(0, 10),
    jsonldTypes,
    jsonldErrors,
    h1Count,
    imgCount,
    imgsWithoutAlt,
  };
}

function summarize(rows) {
  const total = rows.length;
  const tally = (pred) => rows.filter(pred).length;
  return {
    total,
    missingTitle: tally(r => !r.title),
    titleOutsideBudget: tally(r => !r.titleInBudget && r.title),
    missingDescription: tally(r => !r.desc),
    descOutsideBudget: tally(r => !r.descInBudget && r.desc),
    missingCanonical: tally(r => !r.canonical),
    missingOgImage: tally(r => !r.ogImage),
    missingOgLocale: tally(r => !r.ogLocale),
    missingAuthor: tally(r => !r.author),
    noHreflang: tally(r => r.hreflangCount === 0),
    noJsonld: tally(r => r.jsonldTypes.length === 0),
    jsonldParseErrors: rows.reduce((a, r) => a + r.jsonldErrors, 0),
    missingH1: tally(r => r.h1Count === 0),
    multipleH1: tally(r => r.h1Count > 1),
    imgsWithoutAlt: rows.reduce((a, r) => a + r.imgsWithoutAlt, 0),
    jsonldTypesSeen: [...new Set(rows.flatMap(r => r.jsonldTypes))].sort(),
  };
}

function md(summary, rows) {
  const t = summary;
  const pct = (n) => `${n}/${t.total} (${Math.round(100*n/t.total)}%)`;
  return `# Baseline SEO Audit

**Total HTML files:** ${t.total}

## Top-level health

| Metric | Issue count | Note |
|---|---|---|
| Missing \`<title>\` | ${pct(t.missingTitle)} | |
| Title outside 50–60 chars | ${pct(t.titleOutsideBudget)} | not blocking, but Google may rewrite |
| Missing description | ${pct(t.missingDescription)} | |
| Description outside 140–160 chars | ${pct(t.descOutsideBudget)} | budget violation |
| Missing canonical | ${pct(t.missingCanonical)} | |
| Missing \`og:image\` | ${pct(t.missingOgImage)} | breaks social shares |
| Missing \`og:locale\` | ${pct(t.missingOgLocale)} | |
| Missing \`<meta name="author">\` | ${pct(t.missingAuthor)} | E-E-A-T signal for YMYL |
| No hreflang at all | ${pct(t.noHreflang)} | EN-only pages or missing cluster |
| No JSON-LD | ${pct(t.noJsonld)} | structured data gap |
| JSON-LD parse errors | ${t.jsonldParseErrors} | |
| Missing \`<h1>\` | ${pct(t.missingH1)} | |
| Multiple \`<h1>\` | ${pct(t.multipleH1)} | |
| Images without \`alt\` | ${t.imgsWithoutAlt} | accessibility + image SEO |

## JSON-LD types in the wild

${t.jsonldTypesSeen.length ? t.jsonldTypesSeen.map(s => `- \`${s}\``).join('\n') : '_(none found)_'}

## Worst offenders — title length

${rows.filter(r => !r.titleInBudget && r.title).sort((a,b) => Math.abs(a.titleLen-55) - Math.abs(b.titleLen-55)).slice(-10).map(r => `- ${r.titleLen}ch \`${r.file}\` — ${r.title?.slice(0,70)}…`).join('\n') || '_(none)_'}

## Worst offenders — description length

${rows.filter(r => !r.descInBudget && r.desc).sort((a,b) => Math.abs(a.descLen-150) - Math.abs(b.descLen-150)).slice(-10).map(r => `- ${r.descLen}ch \`${r.file}\``).join('\n') || '_(none)_'}

## Pages missing og:image

${rows.filter(r => !r.ogImage).slice(0, 20).map(r => `- ${r.file}`).join('\n') || '_(none)_'}

## Pages missing canonical

${rows.filter(r => !r.canonical).slice(0, 20).map(r => `- ${r.file}`).join('\n') || '_(none)_'}
`;
}

const start = Date.now();
const files = await walk(DIST);
console.log(`[audit] scanning ${files.length} HTML files in ${DIST}/...`);
const rows = [];
for (const f of files) {
  try {
    const html = await readFile(f, 'utf8');
    rows.push(audit(html, relative(DIST, f).replaceAll('\\', '/')));
  } catch (e) {
    console.error(`[audit] failed: ${f}: ${e.message}`);
  }
}
const summary = summarize(rows);
await mkdir('dist', { recursive: true });
await writeFile('dist/audit-baseline.json', JSON.stringify({ summary, rows }, null, 2));
await writeFile('dist/audit-baseline.md', md(summary, rows));
const dt = ((Date.now() - start) / 1000).toFixed(1);
console.log(`[audit] done in ${dt}s. Wrote dist/audit-baseline.{json,md}`);
console.log(`[audit] ${rows.length} pages scanned`);
console.log(`[audit] summary:`, JSON.stringify(summary, null, 2));
