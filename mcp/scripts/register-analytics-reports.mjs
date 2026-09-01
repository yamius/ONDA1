#!/usr/bin/env node
/**
 * ONE-OFF: register App Store Connect Analytics Report requests.
 *
 * ⚠️ THIS SCRIPT WRITES. It is deliberately NOT part of the MCP server, which
 * is read-only by construction. Nothing here is exposed as a tool; you run it
 * by hand, once, and the MCP side only ever reads.
 *
 * WHY IT IS URGENT: an ONGOING report accumulates from the moment the request
 * is registered and is never backfilled. Every day it is not registered is a
 * day of source attribution that cannot be recovered. A ONE_TIME_SNAPSHOT is
 * requested alongside because that one does return the available history.
 *
 * READING EXISTING REQUESTS — note the endpoint:
 *   GET /v1/apps/{id}/analyticsReportRequests        ✅ works
 *   GET /v1/analyticsReportRequests                  ❌ 403 FORBIDDEN_ERROR
 * The top-level collection does NOT allow GET_COLLECTION at all; Apple permits
 * only CREATE, DELETE and GET_INSTANCE on it. The requests are readable only
 * through the app relationship. (Learned the hard way — the first version of
 * this script used the collection and failed on its first call.)
 *
 * PERMISSIONS: creating a report request for the first time needs the Admin
 * role. Downloading afterwards needs only Sales/Finance.
 *
 * USAGE (from the mcp/ directory):
 *
 *   PowerShell:
 *     $env:ASC_KEY_ID="..."; $env:ASC_ISSUER_ID="..."
 *     $env:ASC_PRIVATE_KEY=(Get-Content AuthKey_XXX.p8 -Raw)
 *     node scripts/register-analytics-reports.mjs
 *
 *   bash:
 *     ASC_KEY_ID=... ASC_ISSUER_ID=... ASC_PRIVATE_KEY="$(cat AuthKey_XXX.p8)" \
 *       node scripts/register-analytics-reports.mjs
 *
 * Add --dry-run to see what it would do without creating anything.
 */

import jwt from 'jsonwebtoken';

const API = 'https://api.appstoreconnect.apple.com/v1';
const APP_ID = process.env.ASC_APP_ID || '6755912529'; // ONDA Life
const DRY_RUN = process.argv.includes('--dry-run');
const ACCESS_TYPES = ['ONGOING', 'ONE_TIME_SNAPSHOT'];

function token() {
  const key = String(process.env.ASC_PRIVATE_KEY).replace(/\\n/g, '\n');
  return jwt.sign({}, key, {
    algorithm: 'ES256',
    keyid: process.env.ASC_KEY_ID,
    issuer: process.env.ASC_ISSUER_ID,
    audience: 'appstoreconnect-v1',
    expiresIn: '15m',
  });
}

async function call(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token()}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status} ${method} ${path}`);
    err.status = res.status;
    err.body = text.slice(0, 800);
    throw err;
  }
  return text ? JSON.parse(text) : {};
}

/**
 * Explain a failure from what Apple actually said, not from a guess.
 *
 * The first version asserted "likely lacks the Admin role" on any 403. That
 * was wrong and actively misleading: the 403 we hit was a FORBIDDEN_ERROR
 * about an unsupported OPERATION, on a key that had Admin all along.
 */
function explain(err) {
  const body = String(err.body ?? '');
  const lines = [];
  if (/does not allow/i.test(body) || /GET_COLLECTION/.test(body)) {
    lines.push('This is an UNSUPPORTED OPERATION on that resource, not a permissions problem.');
    lines.push('Read report requests through GET /v1/apps/{id}/analyticsReportRequests instead.');
  } else if (err.status === 401) {
    lines.push('The JWT was rejected: check ASC_KEY_ID, ASC_ISSUER_ID and the .p8 contents.');
  } else if (err.status === 403) {
    lines.push('Forbidden. If the body does not name an operation, the key may lack the Admin role,');
    lines.push('which is required to register a report type for the first time.');
  } else if (err.status === 409) {
    lines.push('Conflict — a request of this access type most likely already exists.');
  }
  return lines;
}

/** Requests already registered, read through the app relationship. */
async function existingRequests() {
  const res = await call(`/apps/${APP_ID}/analyticsReportRequests?limit=200`);
  return (res.data ?? []).map((r) => ({
    id: r.id,
    accessType: r.attributes?.accessType,
    stoppedDueToInactivity: !!r.attributes?.stoppedDueToInactivity,
  }));
}

async function createRequest(accessType) {
  return call('/analyticsReportRequests', {
    method: 'POST',
    body: {
      data: {
        type: 'analyticsReportRequests',
        attributes: { accessType },
        relationships: { app: { data: { type: 'apps', id: APP_ID } } },
      },
    },
  });
}

async function run() {
  const missing = ['ASC_KEY_ID', 'ASC_ISSUER_ID', 'ASC_PRIVATE_KEY'].filter((k) => !process.env[k]);
  if (missing.length) {
    console.error(`Missing env: ${missing.join(', ')}`);
    console.error('These are the same values the MCP server uses; copy them from the Vercel project.');
    return 1;
  }

  // Fail fast on a key we cannot even sign with. Otherwise --dry-run happily
  // reports "would create" while nothing could ever have worked, which is worse
  // than an error: it is false reassurance.
  try {
    token();
  } catch (err) {
    console.error(`The private key could not be used to sign a token: ${err.message}`);
    console.error('ASC_PRIVATE_KEY must be the full contents of the .p8 file, including the');
    console.error('BEGIN/END PRIVATE KEY lines. In PowerShell: (Get-Content AuthKey_XXX.p8 -Raw).');
    return 1;
  }

  console.log(`App: ${APP_ID}${DRY_RUN ? '  (DRY RUN — nothing will be created)' : ''}\n`);

  let existing = null;
  try {
    existing = await existingRequests();
  } catch (err) {
    // Not fatal: without the listing we simply cannot skip duplicates, and
    // Apple answers a duplicate CREATE with a 409 we handle below. Losing the
    // ONGOING window is worse than risking a redundant request.
    console.warn(`⚠️  Could not read existing requests: ${err.message}`);
    for (const line of explain(err)) console.warn(`    ${line}`);
    if (err.body) console.warn(`    body: ${err.body}`);
    console.warn('    Continuing without duplicate detection.\n');
  }

  if (existing?.length) {
    console.log('Already registered:');
    for (const r of existing) {
      const flag = r.stoppedDueToInactivity ? '  ⚠️ STOPPED DUE TO INACTIVITY' : '';
      console.log(`  ${String(r.accessType).padEnd(20)} id=${r.id}${flag}`);
    }
    console.log('');
  } else if (existing) {
    console.log('No existing report requests for this app.\n');
  }

  let failures = 0;
  for (const accessType of ACCESS_TYPES) {
    const already = existing?.find((r) => r.accessType === accessType && !r.stoppedDueToInactivity);
    if (already) {
      console.log(`✓ ${accessType}: already active (id=${already.id}) — skipping.`);
      continue;
    }
    if (DRY_RUN) {
      console.log(`· ${accessType}: would create.`);
      continue;
    }
    try {
      const res = await createRequest(accessType);
      console.log(`✓ ${accessType}: created, id=${res?.data?.id}`);
    } catch (err) {
      if (err.status === 409) {
        console.log(`✓ ${accessType}: already exists (409) — nothing to do.`);
        continue;
      }
      failures += 1;
      console.error(`✗ ${accessType}: ${err.message}`);
      for (const line of explain(err)) console.error(`    ${line}`);
      if (err.body) console.error(`    body: ${err.body}`);
    }
  }

  console.log('');
  console.log('Next: the first ONGOING report lands in roughly 24-48h; a ONE_TIME_SNAPSHOT');
  console.log('carries the history already available. Until then installs_review returns');
  console.log("organic_sources.available=false with reason 'report_pending'.");
  console.log('');
  console.log('⚠️ Apple stops an ONGOING request that goes unread (stoppedDueToInactivity).');
  console.log('   Re-run this script if check_status ever reports that flag.');

  return failures ? 1 : 0;
}

// Set exitCode and let the event loop drain on its own. Calling process.exit()
// while undici still has sockets closing trips
// `Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)` on Windows — an
// abort that hides whatever the script was actually trying to report.
run()
  .then((code) => { process.exitCode = code; })
  .catch((err) => {
    console.error(`Unexpected failure: ${err?.message ?? err}`);
    if (err?.body) console.error(`  body: ${err.body}`);
    process.exitCode = 1;
  });
