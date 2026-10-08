/**
 * Manual source-health check (NOT part of the build): `npm run sources:health`.
 *
 * For every DOI / PMID in data/citation-registry.json (plus DOIs/PMIDs found in
 * content/science/**.md frontmatter) it checks:
 *  (a) the DOI resolves on Crossref (HTTP 200 on api.crossref.org/works/<doi>);
 *  (b) retraction / correction / expression of concern:
 *      - Crossref `update-to` and `relation` fields,
 *      - Europe PMC pubType ("Retracted Publication", "Retraction of",
 *        "Expression of Concern", "Published Erratum"/correction flags).
 * Polite rate limit (~5 req/s), retries with backoff, results cached in
 * .cache/sources-health.json (default TTL 14 days; --fresh ignores cache).
 *
 * Flags: --fresh  ignore cache | --json  print JSON report | --limit N
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname ?? __dirname, '..');
const REGISTRY = path.join(ROOT, 'data/citation-registry.json');
const CACHE_FILE = path.join(ROOT, '.cache/sources-health.json');
const TTL_MS = 14 * 24 * 3600 * 1000;
const UA = 'ONDA-sources-health/1.0 (mailto:yam.bilenko@gmail.com)';
const SCAN_DIRS = ['content', 'src/data', 'locales', 'docs/science-pack'];

const args = process.argv.slice(2);
const FRESH = args.includes('--fresh');
const AS_JSON = args.includes('--json');
const limIdx = args.indexOf('--limit');
const LIMIT = limIdx >= 0 ? Number(args[limIdx + 1]) : Infinity;

type Flag = { kind: 'retraction' | 'correction' | 'eoc' | 'other-update'; detail: string; source: 'crossref' | 'europepmc' };
type Result = {
  id: string; doi?: string; pmid?: string;
  crossrefStatus?: number | 'error';
  otherRA?: string; // DOI valid but registered with a non-Crossref agency
  flags: Flag[];
  checkedAt: string;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let last = 0;
async function politeFetch(url: string): Promise<Response | null> {
  for (let attempt = 0; attempt < 4; attempt++) {
    const wait = Math.max(0, last + 200 - Date.now()); // <= 5 req/s
    if (wait) await sleep(wait);
    last = Date.now();
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
      if (res.status === 429 || res.status >= 500) { await sleep(1000 * 2 ** attempt); continue; }
      return res;
    } catch { await sleep(1000 * 2 ** attempt); }
  }
  return null;
}

function classify(text: string): Flag['kind'] {
  const t = text.toLowerCase();
  if (t.includes('retract') || t.includes('withdraw')) return 'retraction';
  if (t.includes('concern')) return 'eoc';
  if (t.includes('correct') || t.includes('errat')) return 'correction';
  return 'other-update';
}

async function checkCrossref(doi: string, r: Result) {
  const res = await politeFetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`);
  if (!res) { r.crossrefStatus = 'error'; return; }
  r.crossrefStatus = res.status;
  if (res.status === 404) {
    // Not every DOI is Crossref-registered (mEDRA, DataCite…): ask doi.org which agency holds it.
    const ra = await politeFetch(`https://doi.org/doiRA/${encodeURIComponent(doi)}`);
    const agency = ra && ra.status === 200 ? (await ra.json())?.[0]?.RA : undefined;
    if (agency && agency !== 'Crossref') r.otherRA = agency;
  }
  if (res.status !== 200) return;
  const msg = (await res.json())?.message ?? {};
  for (const u of msg['update-to'] ?? []) {
    // update-to on THIS record means this record is a notice updating another DOI.
    r.flags.push({ kind: classify(u.type ?? ''), detail: `this DOI is a ${u.type} notice for ${u.DOI}`, source: 'crossref' });
  }
  for (const u of msg['updated-by'] ?? []) {
    r.flags.push({ kind: classify(u.type ?? ''), detail: `updated-by ${u.type} ${u.DOI ?? ''}`, source: 'crossref' });
  }
  for (const [rel, items] of Object.entries<any>(msg.relation ?? {})) {
    if (/retract|correct|concern|errat/i.test(rel)) {
      for (const it of items) r.flags.push({ kind: classify(rel), detail: `relation ${rel} ${it.id}`, source: 'crossref' });
    }
  }
}

async function checkEuropePmc(r: Result) {
  const q = r.pmid ? `EXT_ID:${r.pmid} AND SRC:MED` : `DOI:"${r.doi}"`;
  const res = await politeFetch(`https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(q)}&resultType=core&format=json&pageSize=1`);
  if (!res || res.status !== 200) return;
  const hit = (await res.json())?.resultList?.result?.[0];
  if (!hit) return;
  if (!r.pmid && hit.pmid) r.pmid = hit.pmid;
  const types: string[] = hit.pubTypeList?.pubType ?? [];
  for (const t of types) {
    if (/Retracted Publication|Retraction of|Expression of Concern|Published Erratum|Correction/i.test(t)) {
      r.flags.push({ kind: classify(t), detail: `pubType "${t}"`, source: 'europepmc' });
    }
  }
  for (const c of hit.commentCorrectionList?.commentCorrection ?? []) {
    if (/Retraction in|Expression of concern in|Erratum in/i.test(c.type ?? '')) {
      r.flags.push({ kind: classify(c.type), detail: `${c.type} ${c.source ?? ''}:${c.id ?? ''}`, source: 'europepmc' });
    }
  }
}

function decodeEntities(s: string) {
  return s.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d)).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

function walk(dir: string, out: string[] = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(md|ts|tsx|json)$/.test(e.name) && !e.name.endsWith('.generated.ts')) out.push(p);
  }
  return out;
}

async function main() {
  const reg = JSON.parse(fs.readFileSync(REGISTRY, 'utf8')).entries as Record<string, any>;
  // Collect targets keyed by DOI (preferred) or PMID.
  const targets = new Map<string, { doi?: string; pmid?: string }>();
  const pmidToDoi = new Map<string, string>();
  for (const [k, v] of Object.entries(reg)) {
    if (v.valid === false) continue;
    if (k.startsWith('pmid:') && v.doi) pmidToDoi.set(k.slice(5), decodeEntities(String(v.doi)).toLowerCase());
  }
  for (const [k, v] of Object.entries(reg)) {
    if (v.valid === false) continue;
    if (k.startsWith('doi:')) {
      const doi = decodeEntities(k.slice(4)).toLowerCase();
      targets.set(`doi:${doi}`, { ...targets.get(`doi:${doi}`), doi });
    } else if (k.startsWith('pmid:')) {
      const pmid = k.slice(5);
      const doi = pmidToDoi.get(pmid);
      if (doi) targets.set(`doi:${doi}`, { ...targets.get(`doi:${doi}`), doi, pmid });
      else targets.set(k, { pmid });
    }
  }
  // Science frontmatter sources not (yet) in the registry.
  for (const f of walk(path.join(ROOT, 'content/science'))) {
    const txt = fs.readFileSync(f, 'utf8');
    for (const m of txt.matchAll(/doi:\s*"?(10\.[^"\s]+)"?/g)) {
      const doi = m[1].toLowerCase();
      if (!targets.has(`doi:${doi}`)) targets.set(`doi:${doi}`, { doi });
    }
  }

  // Index: which files mention each id.
  const files = SCAN_DIRS.flatMap((d) => walk(path.join(ROOT, d)));
  const texts = files.map((f) => [path.relative(ROOT, f).replace(/\\/g, '/'), fs.readFileSync(f, 'utf8').toLowerCase()] as const);
  const pagesFor = (t: { doi?: string; pmid?: string }) =>
    texts.filter(([, s]) => (t.doi && s.includes(t.doi)) || (t.pmid && new RegExp(`\\b${t.pmid}\\b`).test(s))).map(([f]) => f);

  const cache: Record<string, Result> = !FRESH && fs.existsSync(CACHE_FILE) ? JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')) : {};
  const results: Result[] = [];
  let n = 0;
  for (const [id, t] of targets) {
    if (n++ >= LIMIT) break;
    const c = cache[id];
    if (c && Date.now() - Date.parse(c.checkedAt) < TTL_MS) { results.push(c); continue; }
    const r: Result = { id, doi: t.doi, pmid: t.pmid, flags: [], checkedAt: new Date().toISOString() };
    if (t.doi) await checkCrossref(t.doi, r);
    await checkEuropePmc(r);
    cache[id] = r;
    results.push(r);
    if (n % 25 === 0) {
      fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
      fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 1));
      process.stderr.write(`  ${n}/${targets.size}\n`);
    }
  }
  fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 1));

  const broken = results.filter((r) => r.doi && r.crossrefStatus !== 200 && !r.otherRA);
  const nonCrossref = results.filter((r) => r.otherRA);
  const flagged = results.filter((r) => r.flags.length);
  const report = {
    total: results.length,
    nonCrossref: nonCrossref.map((r) => ({ id: r.id, agency: r.otherRA })),
    broken: broken.map((r) => ({ id: r.id, status: r.crossrefStatus, pmid: r.pmid, pages: pagesFor(r) })),
    flagged: flagged.map((r) => ({ id: r.id, pmid: r.pmid, flags: r.flags, pages: pagesFor(r) })),
  };
  if (AS_JSON) { console.log(JSON.stringify(report, null, 2)); return; }
  console.log(`Checked: ${report.total}`);
  console.log(`\nValid DOIs registered outside Crossref: ${report.nonCrossref.length}`);
  for (const x of report.nonCrossref) console.log(`  ${x.id} (${x.agency})`);
  console.log(`\nBroken DOIs (Crossref != 200): ${report.broken.length}`);
  for (const b of report.broken) console.log(`  ${b.id} [${b.status}] pmid=${b.pmid ?? '-'}\n    pages: ${b.pages.join(', ') || '-'}`);
  console.log(`\nRetraction / EoC / correction flags: ${report.flagged.length}`);
  for (const f of report.flagged) {
    console.log(`  ${f.id} pmid=${f.pmid ?? '-'}`);
    for (const fl of f.flags) console.log(`    - ${fl.kind} (${fl.source}): ${fl.detail}`);
    console.log(`    pages: ${f.pages.join(', ') || '-'}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
