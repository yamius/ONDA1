/**
 * Shared conventions for every ONDA analytics tool.
 *
 * The house rules these encode (see the MCP brief):
 *  - aggregate-only, zero PII — nothing here ever handles an id;
 *  - every percentage travels with the N it came from;
 *  - `low_data` is set when the denominator is too small to mean anything.
 *    At ~50 installs/month (≈1.7/day) a "40% drop-off" can be two people, and
 *    the tool must not let that read as signal.
 */

/** Denominator below which a percentage is noise, not a finding. */
export const LOW_DATA_N = 30;

/** Default window. 28 days, not 1 — see the note above about daily volume. */
export const DEFAULT_SINCE_DAYS = 28;
export const MAX_SINCE_DAYS = 365;

export function clampSince(since) {
  const n = Number.isFinite(Number(since)) ? Math.floor(Number(since)) : DEFAULT_SINCE_DAYS;
  return Math.min(Math.max(n, 1), MAX_SINCE_DAYS);
}

/** UTC yyyy-mm-dd, `daysAgo` days back from today. */
export function isoDaysAgo(daysAgo, now = new Date()) {
  const d = new Date(now.getTime() - daysAgo * 86400000);
  return d.toISOString().slice(0, 10);
}

export function windowFor(since) {
  const days = clampSince(since);
  return { days, start_date: isoDaysAgo(days), end_date: isoDaysAgo(0) };
}

/**
 * A percentage that cannot be quoted without its denominator.
 * Returns null (not 0) when there is nothing to divide by — "no data" and
 * "zero percent" are different answers and must not collapse into one.
 */
export function rate(numerator, denominator) {
  if (!denominator) {
    return { pct: null, n: numerator ?? 0, of: denominator ?? 0, low_data: true };
  }
  return {
    pct: Math.round((numerator / denominator) * 1000) / 10,
    n: numerator,
    of: denominator,
    low_data: denominator < LOW_DATA_N,
  };
}

/** Per-source freshness, so a stale number is never read as a live one. */
export const DATA_LAG = {
  ga4: 'GA4 processing lag is ~24-48h; the last day or two in this window is usually incomplete.',
  asc: 'App Store Connect sales reports land ~1-2 days behind; the newest day may be missing entirely.',
  tenjin: 'Tenjin is near-real-time but paid-network attribution can still be revised for ~48h.',
  revenuecat: 'RevenueCat is near real-time, but refunds arrive days later and rewrite past windows retroactively.',
  asc_analytics: 'App Store analytics are complete two days after the reporting date; ONGOING reports only accumulate from registration and are never backfilled.',
  posthog: 'PostHog is near real-time and unsampled, but autocapture/ingestion can lag minutes to ~an hour, so the current partial day runs light.',
};

export function ok(data, extra = {}) {
  return { ok: true, ...data, ...extra };
}

/**
 * A source that isn't wired up must say so in the payload rather than throw a
 * stack trace at the model — check_status exists to make these visible.
 */
export function notConfigured(source, missing) {
  return {
    ok: false,
    error: 'not_configured',
    source,
    missing,
    hint: `Set ${missing.join(', ')} in the Vercel project env, then redeploy.`,
  };
}

export function sourceError(source, err) {
  return {
    ok: false,
    error: 'source_error',
    source,
    // Message only — never echo credentials or full API responses.
    message: String(err && err.message ? err.message : err).slice(0, 300),
    // Diagnostics carried through from lib/http.js. A bare 'fetch failed' is
    // unactionable: status null + network_error says 'never reached the server'
    // (host/DNS), while a status with a body snippet says what the API objected
    // to. Body is already truncated and never contains our credentials.
    ...(err?.status !== undefined ? { status: err.status } : {}),
    ...(err?.network_error ? { network_error: true } : {}),
    ...(err?.cause ? { cause: err.cause } : {}),
    ...(err?.body_snippet ? { body_snippet: err.body_snippet } : {}),
    ...(err?.hint ? { hint: err.hint } : {}),
  };
}
