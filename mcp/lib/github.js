/**
 * Read ONDA product source LIVE from GitHub.
 *
 * WHY NOT THE LOCAL FILESYSTEM: this project deploys with Vercel Root Directory
 * = `mcp`, and Vercel's docs are categorical — "Your app will not be able to
 * access files outside of that directory. You also cannot use `..` to move up a
 * level." So `../src` does not exist in the deployed function at all. Reading
 * from GitHub sidesteps that entirely and always reflects main.
 *
 * The repo (github.com/yamius/ONDA1) is PUBLIC, so no token is needed:
 *   files  raw.githubusercontent.com/<owner>/<repo>/<ref>/<path>   (unmetered)
 *   tree   api.github.com/repos/<owner>/<repo>/git/trees/<ref>?recursive=1
 * Only api.github.com is rate-limited unauthenticated (60/h per IP); the hot
 * path (raw file reads) is not, and the tree is cached per warm instance. grep
 * raw-fetches the readable files rather than pulling the whole-repo tarball,
 * which is 322 MB here because dist/ is committed.
 *
 * SECURITY POSTURE — stated plainly so it isn't mistaken for more than it is:
 *   - SSRF: the three hosts above are the ONLY hosts contacted. Fixed constants,
 *     no caller-supplied host, same discipline as the site tools.
 *   - The repo is PUBLIC, so the path allowlist below is NOT protecting secrets
 *     from exposure — anything committed is already world-readable. Its job is
 *     scope discipline (keep tools on product source) and an EXPLICIT refusal on
 *     sensitive paths, never a silent miss that reads like "file not found".
 *   - The real secret guarantee lives elsewhere: analytics credentials are in
 *     Vercel env, not committed (.env.example is empty).
 */


const OWNER = 'yamius';
const REPO = 'ONDA1';
const REF = 'main';
const TIMEOUT_MS = 20000;
const MAX_FILE_BYTES = 2_000_000;
const CACHE_TTL_MS = 60_000;

const RAW = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${REF}`;
const API = `https://api.github.com/repos/${OWNER}/${REPO}`;

/** Directories the tools may read. Everything else is refused. */
const ALLOWED_PREFIXES = ['src/', 'public/locales/', 'docs/'];

/**
 * Sensitive paths refused EXPLICITLY even inside an allowed prefix. A refusal
 * must name itself — a silent skip reads as "no such file" and hides that the
 * path was off-limits.
 */
const DENY_PATTERNS = [
  { re: /(^|\/)\.env(\.|$)/i, why: 'environment file' },
  { re: /(^|\/)ios(\/|$)/i, why: 'iOS project / provisioning' },
  { re: /\.(p8|p12|pem|key|keystore|jks|cer|mobileprovision)$/i, why: 'key or certificate' },
  { re: /googleservice-info|google-services\.json/i, why: 'Firebase config with keys' },
  { re: /(secret|credential|private[-_]?key)/i, why: 'name suggests a secret' },
];

export class GithubError extends Error {
  constructor(message, fields) {
    super(message);
    Object.assign(this, fields);
  }
}

export const GITHUB_ALLOWED_PREFIXES = ALLOWED_PREFIXES;
export const GITHUB_HOSTS = ['raw.githubusercontent.com', 'api.github.com', 'codeload.github.com'];

/** Normalise and validate a repo-relative path. Never lets a host or `..` in. */
export function normaliseRepoPath(input) {
  let path = String(input ?? '').trim().replace(/^\/+/, '');
  if (!path) throw new GithubError('empty path', { code: 'bad_path' });
  if (path.includes('..')) throw new GithubError('".." is not allowed in a path', { code: 'bad_path', path });
  if (/^[a-z][a-z0-9+.-]*:/i.test(path) || path.startsWith('//') || path.includes('\\')) {
    throw new GithubError('path must be a plain repo-relative path', { code: 'bad_path', path });
  }
  return path;
}

/**
 * Assert a path is readable, or throw with a NAMED reason. Two distinct refusals:
 * outside the allowlist, and explicitly denied (sensitive).
 */
export function assertReadable(path) {
  const p = normaliseRepoPath(path);
  for (const d of DENY_PATTERNS) {
    if (d.re.test(p)) {
      throw new GithubError(`refused: ${p} (${d.why})`, {
        code: 'path_denied',
        path: p,
        reason: d.why,
        hint: 'This path is off-limits by policy. This is an explicit refusal, not a missing file.',
      });
    }
  }
  if (!ALLOWED_PREFIXES.some((pre) => p === pre.replace(/\/$/, '') || p.startsWith(pre))) {
    throw new GithubError(`outside the allowlist: ${p}`, {
      code: 'path_not_allowed',
      path: p,
      allowed_prefixes: ALLOWED_PREFIXES,
      hint: 'Only product source is readable. This is an explicit refusal, not a missing file.',
    });
  }
  return p;
}

/** Is a path readable, without throwing — for filtering listings/grep. */
export function isReadable(path) {
  try {
    assertReadable(path);
    return true;
  } catch {
    return false;
  }
}

async function fetchWithDiagnostics(url, { accept, binary } = {}) {
  let res;
  try {
    res = await fetch(url, {
      headers: { Accept: accept ?? '*/*', 'User-Agent': 'onda-mcp-product-reader' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    throw new GithubError(`network error contacting ${new URL(url).host}`, {
      code: 'network_error',
      status: null,
      cause: String(err?.cause?.code ?? err?.message ?? err).slice(0, 200),
      hint: 'No HTTP status: the request never reached GitHub.',
    });
  }
  if (!res.ok) {
    const body = binary ? '' : (await res.text().catch(() => '')).slice(0, 300);
    throw new GithubError(`HTTP ${res.status} from ${new URL(url).host}`, {
      code: 'http_error',
      status: res.status,
      body_snippet: body,
      hint:
        res.status === 404 ? 'Not found on this ref — check the path.'
          : res.status === 403 ? 'Likely the unauthenticated api.github.com rate limit (60/h).'
            : 'Check the path.',
    });
  }
  return res;
}

/** One source file, by path. Enforces the allowlist. */
export async function readFile(path, { startLine, endLine } = {}) {
  const p = assertReadable(path);
  const res = await fetchWithDiagnostics(`${RAW}/${p.split('/').map(encodeURIComponent).join('/')}`, {
    accept: 'text/plain',
  });
  const buf = Buffer.from(await res.arrayBuffer());
  const truncated = buf.byteLength > MAX_FILE_BYTES;
  let text = buf.subarray(0, MAX_FILE_BYTES).toString('utf8');
  const totalLines = text.split('\n').length;

  if (startLine != null || endLine != null) {
    const lines = text.split('\n');
    const from = Math.max(1, Number(startLine) || 1);
    const to = Math.min(lines.length, Number(endLine) || lines.length);
    text = lines.slice(from - 1, to).map((l, i) => `${from + i}\t${l}`).join('\n');
    return { path: p, content: text, total_lines: totalLines, showing_lines: `${from}-${to}`, truncated_bytes: truncated };
  }
  return { path: p, content: text, total_lines: totalLines, bytes: buf.byteLength, truncated_bytes: truncated };
}

let _treeCache = null;
/** The full repo file tree (one metered call, cached per warm instance). */
export async function listTree() {
  if (_treeCache && Date.now() - _treeCache.at < CACHE_TTL_MS) return _treeCache.tree;
  const res = await fetchWithDiagnostics(`${API}/git/trees/${REF}?recursive=1`, { accept: 'application/json' });
  const data = JSON.parse(await res.text());
  const tree = (data.tree ?? []).map((e) => ({ path: e.path, type: e.type, size: e.size ?? null }));
  _treeCache = { at: Date.now(), tree, truncated: !!data.truncated };
  return tree;
}

// The whole-repo tarball is NOT used: this repo commits dist/ (322 MB), so a
// tarball download would be a serverless landmine. The readable footprint
// (src/ + public/locales/ + docs/) is ~4 MB, so grep raw-fetches just those
// files — raw is unmetered, and the allowlist already excludes dist/.
const TEXT_EXT = /\.(ts|tsx|js|jsx|mjs|cjs|json|md|css|txt|html|yml|yaml)$/i;
const _fileCache = new Map(); // path -> { at, content }

async function rawText(path) {
  const cached = _fileCache.get(path);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.content;
  const res = await fetchWithDiagnostics(`${RAW}/${path.split('/').map(encodeURIComponent).join('/')}`, { accept: 'text/plain' });
  const buf = Buffer.from(await res.arrayBuffer());
  const content = buf.subarray(0, MAX_FILE_BYTES).toString('utf8');
  _fileCache.set(path, { at: Date.now(), content });
  return content;
}

/**
 * Grep readable text files for a query. `pathPrefix` narrows the search; the
 * query is a plain case-insensitive substring by default, or a /regex/flags if
 * wrapped. Files are raw-fetched (unmetered) in small concurrent batches.
 */
export async function grep(query, { pathPrefix, maxResults = 100, context = 2 } = {}) {
  const prefix = pathPrefix ? normaliseRepoPath(pathPrefix) : null;
  const tree = await listTree();
  const targets = tree
    .filter((e) => e.type === 'blob' && isReadable(e.path) && TEXT_EXT.test(e.path))
    .filter((e) => (e.size ?? 0) < MAX_FILE_BYTES)
    .filter((e) => !prefix || e.path.startsWith(prefix) || e.path === prefix)
    .map((e) => e.path);

  let matcher;
  const rx = String(query).match(/^\/(.*)\/([a-z]*)$/);
  if (rx) matcher = new RegExp(rx[1], rx[2].includes('i') ? rx[2] : rx[2] + 'i');
  else {
    const esc = String(query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    matcher = new RegExp(esc, 'i');
  }

  const results = [];
  let filesSearched = 0;
  const BATCH = 12;
  for (let i = 0; i < targets.length && results.length < maxResults; i += BATCH) {
    const batch = targets.slice(i, i + BATCH);
    const contents = await Promise.all(batch.map((p) => rawText(p).then((c) => [p, c]).catch(() => [p, null])));
    for (const [path, content] of contents) {
      if (content == null) continue;
      filesSearched += 1;
      const lines = content.split('\n');
      for (let j = 0; j < lines.length; j++) {
        if (matcher.test(lines[j])) {
          results.push({
            path,
            line: j + 1,
            match: lines[j].slice(0, 200),
            context: lines.slice(Math.max(0, j - context), j + context + 1).map((l, k) => ({
              line: Math.max(0, j - context) + k + 1,
              text: l.slice(0, 200),
            })),
          });
          if (results.length >= maxResults) return { results, truncated: true, files_searched: filesSearched };
        }
      }
    }
  }
  return { results, truncated: false, files_searched: filesSearched };
}

export const GITHUB_REF = REF;
