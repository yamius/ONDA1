/**
 * Edge Function: send-engagement-push
 *
 * Server-driven re-engagement push for ONDA via OneSignal REST API.
 *
 * Audience: users whose most recent `app_open` event is between 7 and 14
 * days ago AND who have not already received this push in the last 7
 * days. Two windows:
 *
 *   – Local notifications handle 0-6 days (lapsed reminders are
 *     scheduled on-device every app_open at +3d and +6d). Server
 *     starts from day 7 so we don't double-tap.
 *   – After day 14 we go silent. If the user is still gone, more push
 *     just earns an uninstall. We'll re-engage them via email or paid
 *     re-acquisition instead.
 *
 * Categorization: this is a SERVICE message (re-engagement), not
 * promotional. Sent to ALL users with notifications permission,
 * regardless of the `marketing_optin` tag. Apple App Review 4.5.4
 * permits service messages without separate opt-in.
 *
 * Schedule: cron at 14:00 UTC daily (afternoon Europe / morning US, when
 * push engagement rates peak per industry benchmarks). Configure via
 * Supabase Dashboard → Edge Functions → schedule, or `supabase
 * functions schedule send-engagement-push --cron "0 14 * * *"`.
 *
 * Secrets required (set via `supabase secrets set`):
 *   – ONESIGNAL_APP_ID       (public; same as src/services/pushNotifications.ts)
 *   – ONESIGNAL_REST_API_KEY (secret; OneSignal Dashboard → Settings → Keys & IDs)
 *
 * Returns 200 with a summary of the run. Errors per-user are logged but
 * don't fail the whole batch — one bad subscription_id shouldn't take
 * down the cron.
 */

// @ts-ignore deno style import
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// @ts-ignore deno style import
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ONESIGNAL_API = 'https://api.onesignal.com/notifications';

// Re-engagement copy — short, warm, service-tone. Keep under 80 chars
// each so iOS doesn't truncate on the lock screen.
const COPIES = [
  { title: 'ONDA', body: "It's been a few days. One breath, that's all it takes to begin again." },
  { title: 'ONDA', body: 'Your body remembers stillness. Drop in for 3 minutes.' },
  { title: 'ONDA', body: 'A short practice today — your rhythm is closer than you think.' },
];

function pickCopy(): { title: string; body: string } {
  return COPIES[Math.floor(Math.random() * COPIES.length)];
}

interface OneSignalResponse {
  id?: string;
  recipients?: number;
  errors?: unknown;
}

async function sendPushToUser(
  oneSignalAppId: string,
  oneSignalKey: string,
  externalUserId: string,
  copy: { title: string; body: string },
): Promise<OneSignalResponse> {
  const res = await fetch(ONESIGNAL_API, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${oneSignalKey}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      app_id: oneSignalAppId,
      include_aliases: { external_id: [externalUserId] },
      target_channel: 'push',
      headings: { en: copy.title },
      contents: { en: copy.body },
      // Service-class payload — surfaces metadata to onPushOpened in JS
      // so we can attribute opens server-side via a follow-up event.
      data: {
        kind: 'reengagement',
        sent_at: new Date().toISOString(),
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`OneSignal ${res.status}: ${await res.text()}`);
  }
  return (await res.json()) as OneSignalResponse;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
serve(async (_req: any) => {
  const supabase = createClient(
    // @ts-ignore Deno globals
    Deno.env.get('SUPABASE_URL') ?? '',
    // @ts-ignore Deno globals — service role bypasses RLS for the audience query.
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  // @ts-ignore
  const oneSignalAppId = Deno.env.get('ONESIGNAL_APP_ID');
  // @ts-ignore
  const oneSignalKey = Deno.env.get('ONESIGNAL_REST_API_KEY');
  if (!oneSignalAppId || !oneSignalKey) {
    return new Response(
      JSON.stringify({ error: 'missing ONESIGNAL_APP_ID or ONESIGNAL_REST_API_KEY' }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  // Audience query — users with last app_open in [7d, 14d) AND no
  // reengagement push in last 7d. The `rpc` route keeps the SQL on the
  // database side so we don't ship 50k rows over the wire.
  const { data: audience, error: audErr } = await supabase.rpc('lapsed_users_for_reengagement');
  if (audErr) {
    console.error('audience query failed', audErr);
    return new Response(JSON.stringify({ error: audErr.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  const results = { attempted: 0, sent: 0, failed: 0, errors: [] as string[] };

  for (const row of audience ?? []) {
    const userId: string | undefined = row.user_id;
    if (!userId) continue;
    results.attempted++;
    const copy = pickCopy();
    try {
      await sendPushToUser(oneSignalAppId, oneSignalKey, userId, copy);
      results.sent++;
      // Log the send back to app_events so the next run's audience
      // query can exclude this user for the next 7 days. Idempotent
      // even if OneSignal accepts the call but doesn't actually
      // deliver (subscription lapsed, device uninstalled, etc.) —
      // we'd rather suppress than spam.
      await supabase.from('app_events').insert({
        user_id: userId,
        event_name: 'reengagement_push_sent',
        platform: 'ios',
        metadata: { copy_title: copy.title, copy_body: copy.body },
      });
    } catch (e) {
      results.failed++;
      const msg = e instanceof Error ? e.message : String(e);
      results.errors.push(`${userId}: ${msg}`);
      console.error('send failed for', userId, msg);
    }
  }

  return new Response(JSON.stringify({ ok: true, ...results }), {
    headers: { 'content-type': 'application/json' },
  });
});
