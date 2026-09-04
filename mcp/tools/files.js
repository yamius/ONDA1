/**
 * File tools: list_files, read_file, grep_content. READ-ONLY.
 *
 * Thin wrappers over lib/github.js, which reads product source live from the
 * public repo and enforces the path allowlist. These exist so a hypothesis can
 * be checked mid-conversation without leaving to dump files; the product tools
 * (product_map, practice_detail, …) give parsed structure, these give raw code.
 */

import {
  readFile, listTree, grep, assertReadable, GithubError,
  GITHUB_ALLOWED_PREFIXES, isReadable,
} from '../lib/github.js';
import { ok } from '../lib/shared.js';

function failure(err) {
  if (err instanceof GithubError) {
    const { message, ...rest } = err;
    return { ok: false, error: err.code ?? 'github_error', message: err.message, ...rest };
  }
  return { ok: false, error: 'tool_failed', message: String(err?.message ?? err).slice(0, 300) };
}

// ─────────────────────────────────────────────────────────── list_files ─────

export const listFilesSchema = {
  name: 'list_files',
  description:
    'List product source files in the ONDA repo (main), with sizes, no content. ' +
    'Only src/, public/locales/ and docs/ are visible. Use it to orient before ' +
    'reading, so paths are not guessed. Read-only.',
  inputSchema: {
    type: 'object',
    properties: {
      path: { type: 'string', description: 'Directory prefix to list under, e.g. "src/components". Default: all readable areas.' },
      pattern: { type: 'string', description: 'Optional substring/glob-ish filter on the path, e.g. ".tsx" or "locale".' },
      depth: { type: 'integer', description: 'Max path depth below `path` to include. Omit for all.' },
    },
  },
};

export async function listFilesTool(args = {}) {
  try {
    const tree = await listTree();
    const prefix = args.path ? String(args.path).replace(/^\/+/, '').replace(/\/$/, '') + '/' : '';
    const pattern = args.pattern ? String(args.pattern).toLowerCase() : null;

    let files = tree
      .filter((e) => e.type === 'blob')
      .filter((e) => isReadable(e.path)) // allowlist — never list what can't be read
      .filter((e) => !prefix || e.path.startsWith(prefix) || e.path === prefix.slice(0, -1));

    if (pattern) files = files.filter((e) => e.path.toLowerCase().includes(pattern));
    if (args.depth != null) {
      const base = prefix ? prefix.split('/').filter(Boolean).length : 0;
      files = files.filter((e) => e.path.split('/').filter(Boolean).length - base <= Number(args.depth));
    }

    const MAX = 500;
    const shown = files.slice(0, MAX);
    return ok({
      source: 'github:main (live)',
      allowed_prefixes: GITHUB_ALLOWED_PREFIXES,
      count: files.length,
      returned: shown.length,
      truncated: files.length > MAX,
      files: shown.map((e) => ({ path: e.path, size: e.size })),
    });
  } catch (err) {
    return failure(err);
  }
}

// ──────────────────────────────────────────────────────────── read_file ─────

export const readFileSchema = {
  name: 'read_file',
  description:
    'Read one product source file from the ONDA repo (main), with line numbers. ' +
    'Only src/, public/locales/ and docs/ are allowed; .env, keys, certificates, ' +
    'iOS provisioning and Firebase configs are refused EXPLICITLY with a reason, ' +
    'never a silent miss. Use start_line/end_line for large files. Read-only.',
  inputSchema: {
    type: 'object',
    properties: {
      path: { type: 'string', description: 'Repo-relative path, e.g. "src/onda-level1-demo_27.tsx".' },
      start_line: { type: 'integer', description: 'First line (1-based). Optional.' },
      end_line: { type: 'integer', description: 'Last line (inclusive). Optional.' },
    },
    required: ['path'],
  },
};

export async function readFileTool(args = {}) {
  try {
    // assertReadable first so a denied path returns the NAMED refusal, not a 404.
    assertReadable(args.path);
    const r = await readFile(args.path, { startLine: args.start_line, endLine: args.end_line });
    return ok({ source: 'github:main (live)', ...r });
  } catch (err) {
    return failure(err);
  }
}

// ────────────────────────────────────────────────────────── grep_content ────

export const grepContentSchema = {
  name: 'grep_content',
  description:
    'Search product source in the ONDA repo (main) for a string or /regex/, ' +
    'returning matches with a few lines of context and their paths. The primary ' +
    '"where does this happen" tool. Same allowlist as read_file. Read-only.',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Substring (case-insensitive) or /regex/flags.' },
      path: { type: 'string', description: 'Directory prefix to narrow the search, e.g. "src/services".' },
      max_results: { type: 'integer', description: 'Cap on matches. Default 100.' },
    },
    required: ['query'],
  },
};

export async function grepContentTool(args = {}) {
  try {
    if (!args.query) return { ok: false, error: 'bad_input', message: 'query is required' };
    const g = await grep(args.query, {
      pathPrefix: args.path,
      maxResults: Math.min(Math.max(Number(args.max_results) || 100, 1), 300),
    });
    return ok({
      source: 'github:main (live)',
      query: args.query,
      path: args.path ?? null,
      match_count: g.results.length,
      files_searched: g.files_searched,
      truncated: g.truncated,
      matches: g.results,
    });
  } catch (err) {
    return failure(err);
  }
}
