/**
 * One fetch wrapper, so a failing source explains ITSELF.
 *
 * Written after a live incident: Tenjin came back as bare `fetch failed`,
 * which carries no status, no body and no cause — it took a DNS lookup to
 * discover the host simply did not exist. Diagnosing from a tool response
 * should never require that.
 */

export class HttpError extends Error {
  constructor(message, fields) {
    super(message);
    Object.assign(this, fields);
  }
}

/** Node wraps network failures; the useful detail hides in err.cause. */
function causeOf(err) {
  const c = err?.cause;
  if (!c) return undefined;
  return [c.code, c.message].filter(Boolean).join(': ').slice(0, 200) || undefined;
}

/**
 * GET JSON with diagnosable failures.
 * Throws HttpError carrying `status`, `body_snippet` and `cause` where known.
 */
export async function getJson(url, { headers = {}, timeoutMs = 20000, source } = {}) {
  const started = Date.now();
  let res;
  try {
    res = await fetch(url, { headers, signal: AbortSignal.timeout(timeoutMs) });
  } catch (err) {
    // Network-level: DNS, TLS, refused, timeout. No status exists here — say so
    // explicitly rather than leaving the reader to guess it was an auth problem.
    throw new HttpError(`network error contacting ${new URL(url).host}`, {
      source,
      status: null,
      network_error: true,
      cause: causeOf(err) ?? String(err?.message ?? err).slice(0, 200),
      hint: 'No HTTP status: the request never reached the server. Check the host, DNS and outbound egress — not the token.',
      elapsed_ms: Date.now() - started,
    });
  }

  const text = await res.text();
  if (!res.ok) {
    throw new HttpError(`HTTP ${res.status} from ${new URL(url).host}`, {
      source,
      status: res.status,
      // First bytes of the body: APIs put the real reason here, and it is the
      // difference between "bad token" and "bad parameter".
      body_snippet: text.slice(0, 400),
      hint:
        res.status === 401 || res.status === 403
          ? 'Authentication rejected — check the token and its scope.'
          : res.status === 429
            ? 'Rate limited.'
            : 'Check the path and query parameters against the API docs.',
      elapsed_ms: Date.now() - started,
    });
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new HttpError('response was not JSON', {
      source,
      status: res.status,
      body_snippet: text.slice(0, 400),
      elapsed_ms: Date.now() - started,
    });
  }
}
