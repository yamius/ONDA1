/**
 * verify-095 — read-only check of the 095 analytics params in Supabase app_events.
 *
 *   npx tsx scripts/verify-095.ts --dry-check
 *       Connection check only (anon key from .env.development; RLS returns 0 rows).
 *   SUPABASE_SERVICE_ROLE_KEY=… npx tsx scripts/verify-095.ts \
 *       (--anon <anonymous_id> | --user <user_id uuid> | --build <app_version run#> [--internal])
 *       [--from 2026-10-24T00:00Z] [--to 2026-10-26T00:00Z]
 *
 * Select only (never writes). Keys are read from env / .env files and never printed.
 * Prints: event | param | value | JS type | time, and flags any non-string value.
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'node:fs';

function loadEnvFile(path: string) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] == null) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
['.env.local', '.env.development', '.env'].forEach(loadEnvFile);

const args = process.argv.slice(2);
const arg = (k: string) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const has = (k: string) => args.includes(k);

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
if (!url) { console.error('No SUPABASE_URL / VITE_SUPABASE_URL'); process.exit(1); }

const EVENTS: Record<string, string[]> = {
  notif_prompt_answered: ['trigger', 'granted'],
  practice_start: ['source', 'has_biometrics'],
  baseline_state: ['state'],
  watch_connect_success: ['is_first', 'is_connected'],
  health_permission: ['granted'],
};

async function main() {
  if (has('--dry-check')) {
    const key = process.env.VITE_SUPABASE_ANON_KEY;
    if (!key) { console.error('No VITE_SUPABASE_ANON_KEY'); process.exit(1); }
    const sb = createClient(url!, key, { auth: { persistSession: false } });
    const { error, status } = await sb.from('app_events').select('id').limit(1);
    console.log(error ? `connection FAILED (HTTP ${status}): ${error.message || error.code}` : 'connection OK (anon key; RLS hides rows — use the service key for real checks)');
    return;
  }
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) { console.error('Set SUPABASE_SERVICE_ROLE_KEY in the environment (never commit it).'); process.exit(1); }
  const anon = arg('--anon'), user = arg('--user'), build = arg('--build');
  if (!anon && !user && !build) { console.error('Need --anon, --user or --build'); process.exit(1); }
  const from = arg('--from') ?? new Date(Date.now() - 2 * 86400e3).toISOString();
  const to = arg('--to') ?? new Date().toISOString();

  const sb = createClient(url!, key, { auth: { persistSession: false } });
  let q = sb.from('app_events')
    .select('event_name, metadata, created_at, anonymous_id, app_version')
    .in('event_name', Object.keys(EVENTS))
    .gte('created_at', from).lt('created_at', to)
    .order('created_at', { ascending: true }).limit(5000);
  if (anon) q = q.eq('anonymous_id', anon);
  if (user) q = q.eq('user_id', user);
  if (build) q = q.eq('app_version', build);
  if (has('--internal')) q = q.eq('metadata->>internal', 'true');
  const { data, error } = await q;
  if (error) { console.error(error.message); process.exit(1); }

  const rows: string[][] = [];
  let bad = 0;
  for (const r of data ?? []) {
    for (const p of EVENTS[r.event_name] ?? []) {
      const v = (r.metadata ?? {})[p];
      const t = v === undefined ? 'missing' : v === null ? 'null' : typeof v;
      const flag = t === 'string' ? '' : '  <-- NOT STRING';
      if (flag) bad++;
      rows.push([r.event_name, p, JSON.stringify(v), t + flag, r.created_at]);
    }
  }
  const head = ['event', 'param', 'value', 'JS type', 'time'];
  const w = head.map((h, i) => Math.max(h.length, ...rows.map((r) => r[i].length)));
  const fmt = (r: string[]) => r.map((c, i) => c.padEnd(w[i])).join(' | ');
  console.log(fmt(head)); console.log(w.map((n) => '-'.repeat(n)).join('-|-'));
  rows.forEach((r) => console.log(fmt(r)));

  // Summaries
  const ps = (data ?? []).filter((r) => r.event_name === 'practice_start');
  const bySource: Record<string, number> = {};
  ps.forEach((r) => { const s = String(r.metadata?.source ?? '(none)'); bySource[s] = (bySource[s] ?? 0) + 1; });
  console.log('\npractice_start per source:', bySource);
  const bsDay: Record<string, number> = {};
  (data ?? []).filter((r) => r.event_name === 'baseline_state')
    .forEach((r) => { const d = String(r.created_at).slice(0, 10); bsDay[d] = (bsDay[d] ?? 0) + 1; });
  console.log('baseline_state per UTC day (expect <=1 per local day):', bsDay);
  console.log('watch_connect_success is_first in order:',
    (data ?? []).filter((r) => r.event_name === 'watch_connect_success').map((r) => r.metadata?.is_first));
  console.log(bad ? `\n${bad} value(s) NOT a string` : '\nall checked values are strings');
}
main().catch((e) => { console.error(String(e?.message ?? e)); process.exit(1); });
