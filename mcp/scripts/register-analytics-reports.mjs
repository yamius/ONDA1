#!/usr/bin/env node
/**
 * ONE-OFF: register App Store Connect Analytics Report requests.
 *
 * ⚠️ THIS SCRIPT WRITES. It is deliberately NOT part of the MCP server, which
 * is read-only by construction and must stay that way. Nothing here is exposed
 * as a tool; you run it by hand, once, and then the MCP side only reads.
 *
 * WHY IT IS URGENT: an ONGOING report starts accumulating from the moment the
 * request is registered and is never backfilled. Every day it is not registered
 * is a day of source-attribution data that cannot be recovered later. A
 * ONE_TIME_SNAPSHOT is requested alongside it because that one DOES return the
 * available history, so the two together give past and future.
 *
 * PERMISSIONS: creating a report request for the first time requires the
 * **Admin** role on the API key. Downloading later needs only Sales/Finance.
 *
 * USAGE (from the mcp/ directory):
 *
 *   ASC_KEY_ID=... ASC_ISSUER_ID=... ASC_PRIVATE_KEY="$(cat AuthKey_XXX.p8)" \
 *     node scripts/register-analytics-reports.mjs
 *
 * Add --dry-run to see what it would do without creating anything.
 */

import jwt from 'jsonwebtoken';

const API = 'https://api.appstoreconnect.apple.com/v1';
const APP_ID = process.env.ASC_APP_ID || '6755912529'; // ONDA Life
const DRY_RUN = process.argv.includes('--dry-run');

function requireEnv() {
  const missing = ['ASC_KEY_ID', 'ASC_ISSUER_ID', 'ASC_PRIVATE_KEY'].filter((k) => !process.env[k]);
  if (missing.length) {
    console.error(`Missing env: ${missing.join(', ')}`);
    console.error('These are the same values the MCP server uses; copy them from the Vercel project.');
    process.exit(1);
  }
}

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
    // Apple explains refusals in the body; without it a 403 for a missing Admin
    // role is indistinguishable from a 409 for an existing request.
    const err = new Error(`HTTP ${res.status} ${method} ${path}`);
    err.status = res.status;
    err.body = text.slice(0, 800);
    throw err;
  }
  return text ? JSON.parse(text) : {};
}

async function existingRequests() {
  // Don't create duplicates: Apple keeps one request per accessType per app,
  // and a second ONGOING would add nothing while muddying which id to read.
  const res = await call(`/analyticsReportRequests?filter[app]=${APP_ID}&limit=200`);
  return (res.data ?? []).map((r) => ({
    id: r.id,
    accessType: r.attributes?.accessType,
    stoppedDueToInactivity: r.attributes?.stoppedDueToInactivity,
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

async function main() {
  requireEnv();
  console.log(`App: ${APP_ID}${DRY_RUN ? '  (DRY RUN — nothing will be created)' : ''}\n`);

  let existing = [];
  try {
    existing = await existingRequests();
  } catch (err) {
    console.error(`Could not list existing requests: ${err.message}`);
    if (err.status === 401) console.error('  → the JWT was rejected: check ASC_KEY_ID / ASC_ISSUER_ID / the .p8 contents.');
    if (err.status === 403) console.error('  → forbidden: this API key likely lacks the Admin role.');
    if (err.body) console.error(`  body: ${err.body}`);
    process.exit(1);
  }

  if (existing.length) {
    console.log('Already registered:');
    for (const r of existing) {
      console.log(`  ${r.accessType.padEnd(20)} id=${r.id}${r.stoppedDueToInactivity ? '  ⚠️ STOPPED DUE TO INACTIVITY' : ''}`);
    }
    console.log('');
  } else {
    console.log('No existing report requests for this app.\n');
  }

  for (const accessType of ['ONGOING', 'ONE_TIME_SNAPSHOT']) {
    const already = existing.find((r) => r.accessType === accessType && !r.stoppedDueToInactivity);
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
      // A 409 here usually means it already exists in some form — not fatal.
      console.error(`✗ ${accessType}: ${err.message}`);
      if (err.body) console.error(`   body: ${err.body}`);
      if (err.status === 403) console.error('   → needs the Admin role on the API key.');
    }
  }

  console.log('');
  console.log('Next: the first ONGOING report lands in roughly 24-48h; a ONE_TIME_SNAPSHOT');
  console.log('carries the history that is already available. Until then installs_review');
  console.log("returns organic_sources.available=false with reason 'report_pending'.");
  console.log('');
  console.log('⚠️ Do not let it go quiet: Apple stops an ONGOING request that is never read');
  console.log('   (stoppedDueToInactivity). Re-run this script if that flag ever shows up.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
