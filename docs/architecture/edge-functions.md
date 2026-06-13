# Supabase Edge Functions

Deno (`Deno.serve` / `std/http` `serve`) functions deployed to Supabase, living in
`supabase/functions/`. They cover the work that can't or shouldn't run on the client:
calling a third-party AI with a secret key, deleting an account with the service role,
and receiving server-to-server billing webhooks.

| Function | Trigger | What it does | Auth |
| --- | --- | --- | --- |
| `analyze-emotion` | Client `POST` (voice check) | Streams audio to Hume AI prosody model over WebSocket, maps the top emotion to an in-app key. In-memory only — no storage/DB write. | None (no JWT check); key gate is the `HUME_API_KEY` env |
| `delete-account` | Client `POST` (GDPR delete) | Verifies the caller's JWT, then service-role-deletes the auth user (cascades to all user data). | User JWT (`Authorization` header) verified, then service role |
| `revenuecat-webhook` | RevenueCat server→server webhook | Maps the subscription event → status, upserts `user_subscriptions`, logs the lifecycle event into `app_events`. | `Authorization` header verified against `REVENUECAT_WEBHOOK_AUTH` (enforced when set; warns if unset) — service role internally |

> No `_shared/` directory exists. Each function defines its own inline `corsHeaders`
> (they differ slightly between the analyze-emotion file and the other two).

---

## `analyze-emotion`

Source: `supabase/functions/analyze-emotion/index.ts`

Voice emotion analysis for the in-app "Voice Check". The function forwards a short
audio clip to **Hume AI's Stream Models API over a WebSocket** and returns the user's
top emotion, mapped to an app i18n key.

**Latency / design.** The file's header comment (`index.ts:3-23`) documents the
history: v1 used Hume's async **Batch Jobs** API (10–30 s, so the client's 5 s timeout
almost always fired the mock fallback). This v2 uses the synchronous Stream WebSocket —
"one message in, one prediction message back, typically 1–2 s" (`index.ts:13-15`),
which fits under the client's timeout. *(This supersedes the older base64/batch notes in
`archive/emotional-check-fix.md`.)*

**Privacy — in-memory only (verified).** Audio passes through the function in-memory,
is forwarded to Hume, and discarded once the prediction returns. There is **no Supabase
Storage write and no DB insert** in this file — confirmed by reading the whole source:
the only outbound network call is the Hume WebSocket (`index.ts:81-82`), and the only
`Response` bodies are the JSON results. The header comment states this explicitly
(`index.ts:17-22`) and ties it to Privacy Policy §1.3 "Emotion Analysis (Voice Check)".

### Flow

1. `OPTIONS` → CORS preflight 200 (`index.ts:138-140`).
2. If `HUME_API_KEY` is unset → returns `{ error, useMock: true }` at **HTTP 200** so
   the client falls back to a mock emotion (`index.ts:143-156`).
3. Decode inbound audio into base64 by `Content-Type` (`index.ts:159-182`):
   - `application/json` — iOS WKWebView path: body `{ audio: "data:audio/webm;base64,…", format: "base64" }`; strips the `data:` prefix (`index.ts:162-171`).
   - `multipart/form-data` — reads the `audio` Blob field (`index.ts:172-178`).
   - otherwise — raw request body as a blob (`index.ts:179-182`).
4. `callHumeStream()` opens `wss://api.hume.ai/v0/stream/models?apiKey=…`, sends the
   audio, resolves on the first frame with predictions or an error, and **caps the wait
   at 4200 ms** (`index.ts:73-135`, `189`) to stay under the client's 5 s abort.
5. Take the top-scoring emotion, map it to an app key, return JSON.

### Request shapes

JSON (iOS WKWebView):
```json
{ "audio": "data:audio/webm;base64,<...>", "format": "base64" }
```
Also accepts `multipart/form-data` with an `audio` file field, or a raw audio body.

### Response shape (`index.ts:247-263`)

```json
{
  "primaryEmotion": "emotional_check.joy",
  "confidence": 0.87,
  "energyLevel": 0.42,
  "recommendation": "emotional_check.rec_joy",
  "rawEmotions": [ { "name": "Joy", "score": 0.87 }, ... ],
  "humeData": { "topEmotion": "Joy", "score": 0.87 },
  "source": "hume-stream"
}
```

- `primaryEmotion` / `recommendation` are i18n keys. The Hume emotion name is matched
  (substring, lowercased) against `emotionMapping` (`index.ts:217-236`); unmatched →
  `emotional_check.contemplation`. `recommendation` is `primaryEmotion` with
  `emotional_check.` → `emotional_check.rec_` (`index.ts:242-245`).
- `energyLevel` is a heuristic: the summed score of high-energy emotions (Excitement,
  Joy, Triumph, Amusement, Surprise (positive)) ÷ 5, ×1.5, clamped to 1
  (`index.ts:209-215`, `251`).

**Error handling.** On any error (timeout, Hume error, parse failure) the catch block
returns `{ error, useMock: true }` at **HTTP 200** (`index.ts:264-283`) so the client
shows a mock emotion rather than a hard failure — same posture as the missing-key case.

---

## `delete-account`

Source: `supabase/functions/delete-account/index.ts`

GDPR account deletion. Verifies the caller actually owns the account, then deletes the
auth user with the service role.

### Flow

1. `OPTIONS` → CORS 200 (`index.ts:10-12`).
2. Require an `Authorization` header, else **401** (`index.ts:15-21`).
3. Create a Supabase client **scoped to the user's JWT** (anon key + forwarded
   `Authorization`) and call `auth.getUser()` to verify identity; on error/no user →
   **401** (`index.ts:24-36`).
4. Create a **service-role** client and call
   `supabaseAdmin.auth.admin.deleteUser(user.id)` (`index.ts:39-44`).
5. On delete error → **500**; on success → `{ success: true }` 200 (`index.ts:45-56`).

### What it clears

The function does **not** issue per-table `DELETE`s. It deletes the **auth user**
(`auth.admin.deleteUser`, `index.ts:44`); all user-owned rows are removed by the
schema's `ON DELETE CASCADE` foreign keys to `auth.users`. Per `supabase.md`, user
tables reference `auth.users` (e.g. `user_subscriptions` is
`references auth.users on delete cascade`, `supabase.md:118`), so the cascade is the
purge mechanism. The inline comment calls this out: "cascades to all user data"
(`index.ts:38`).

> Uncertainty: the exact set of cascaded tables is defined by the DB schema, not this
> function. See `supabase.md` for the authoritative table/FK list. Any table that does
> **not** cascade from `auth.users` would not be cleared by this path.

---

## `revenuecat-webhook`

Source: `supabase/functions/revenuecat-webhook/index.ts`

Server-to-server endpoint that RevenueCat calls on every subscription lifecycle event.
It keeps `user_subscriptions` (current state) in sync and appends an analytics row to
`app_events` (history). See `../guides/in-app-purchase.md` for the purchase flow and
`analytics.md` for `app_events`.

### Flow

1. `OPTIONS` → CORS 200 (`index.ts:48-50`).
2. **Verify `Authorization`** against `REVENUECAT_WEBHOOK_AUTH`: mismatch → **401**; if the env var is unset, log a loud warning and continue (so an un-configured deploy doesn't silently drop real subscription events). Configure the same value in RevenueCat (Integrations → Webhooks → Authorization header) and `supabase secrets`.
3. Create a **service-role** client.
3. Parse the webhook JSON; pull `payload.event` (`index.ts:59-60`).
4. `switch` on `event.type` → derive `status` + `willRenew` (see mapping below). Unknown
   types short-circuit with `{ success: true }` 200 (`index.ts:68-114`).
5. Log the event to `app_events` (skipped for sandbox — see below) (`index.ts:126-162`).
6. Anonymous users stop here (no `user_subscriptions` write) (`index.ts:164-172`).
7. Upsert `user_subscriptions` on `user_id` conflict (`index.ts:182-218`).

### Event-type → status / `will_renew` (`index.ts:68-114`)

| RevenueCat event | `status` | `will_renew` |
| --- | --- | --- |
| `INITIAL_PURCHASE` | `active` | `true` |
| `RENEWAL` | `active` | `true` |
| `UNCANCELLATION` | `active` | `true` |
| `CANCELLATION` | `active` (until expiry) | `false` |
| `EXPIRATION` | `expired` | `false` |
| `BILLING_ISSUE` | `billing_issue` | `true` |
| `SUBSCRIPTION_PAUSED` | `cancelled` | `false` |
| `PRODUCT_CHANGE` | `active` | `true` |
| `NON_RENEWING_PURCHASE` | `active` | `false` |
| `TRANSFER` | `active` | `true` |
| (unknown) | — returns 200 early, no write | — |

`TRANSFER` is handled as `active`/`true` in the switch but has **no** entry in the
analytics `eventNameMap`, so it upserts `user_subscriptions` without logging an
`app_events` row (`index.ts:103-107`, `126-137`).

### `app_events` analytics row (`index.ts:126-162`)

`eventNameMap` maps RC event → canonical analytics name:

| RC event | `event_name` |
| --- | --- |
| `INITIAL_PURCHASE` | `subscription_started` |
| `RENEWAL` | `subscription_renewed` |
| `CANCELLATION` | `subscription_cancelled` |
| `UNCANCELLATION` | `subscription_uncancelled` |
| `EXPIRATION` | `subscription_expired` |
| `BILLING_ISSUE` | `subscription_billing_issue` |
| `PRODUCT_CHANGE` | `subscription_product_change` |
| `NON_RENEWING_PURCHASE` | `subscription_started` |
| `SUBSCRIPTION_PAUSED` | `subscription_paused` |

Row written: `user_id` (null if anonymous), `anonymous_id` (the RC id if anonymous),
`event_name`, `platform` (`android` if `store === 'PLAY_STORE'` else `ios`), and a
`metadata` blob (`rc_event_type`, `product_id`, `is_trial`, `is_trial_conversion`,
`cancel_reason`, `expires_at`, `store`). The insert is wrapped in try/catch and is
**non-fatal** — a logging failure must never break the subscription sync
(`index.ts:157-161`).

### SANDBOX skip

`app_events` is only written when `event.environment !== 'SANDBOX'` (`index.ts:138`).
Sandbox/test purchases therefore **do not pollute analytics**. Note the sandbox guard
is only on the analytics insert — sandbox events still flow into the
`user_subscriptions` upsert below.

### Anonymous handling

`userId = event.app_user_id`; anonymous if it starts with `$RCAnonymousID:`
(`index.ts:117-118`). Because most buyers start anonymous after the auth-wall removal,
the analytics row is still logged (under `anonymous_id`). But `user_subscriptions.user_id`
is an FK to `auth.users`, so anonymous purchasers **cannot** be upserted there — the
function returns early with `{ success: true, message: 'Anonymous user — event logged' }`
(`index.ts:164-172`).

### `user_subscriptions` upsert (`index.ts:182-218`)

Upserts on `user_id` conflict with: `revenuecat_app_user_id`
(`event.original_app_user_id`), `status`, `entitlement_id` (first of `entitlement_ids`),
`product_id`, `purchased_at`, `expires_at`, `is_trial`, `will_renew`,
`original_purchase_date`, `latest_purchase_date`, `store` (mapped via `storeMap`:
`APP_STORE→app_store`, `PLAY_STORE→play_store`, `STRIPE→stripe`,
`PROMOTIONAL→promotional`), `updated_at`.

**FK-violation tolerance.** If the upsert hits Postgres error `23503` (FK violation —
user not in `auth.users`), it logs and returns `{ success: true, message: 'User not
found' }` rather than erroring (`index.ts:206-215`), so RevenueCat doesn't retry
forever. Other DB errors throw → **500** (`index.ts:217`, `233-242`).

---

## Secrets / environment

| Env var | Used by | Purpose |
| --- | --- | --- |
| `HUME_API_KEY` | `analyze-emotion` | Hume AI Stream auth (sent as a `?apiKey=` query param on the WebSocket URL). |
| `SUPABASE_URL` | `delete-account`, `revenuecat-webhook` | Supabase project URL. |
| `SUPABASE_ANON_KEY` | `delete-account` | Builds the JWT-scoped client used to verify the caller. |
| `SUPABASE_SERVICE_ROLE_KEY` | `delete-account`, `revenuecat-webhook` | Privileged client: admin user delete; `app_events` / `user_subscriptions` writes that bypass RLS. |
| `REVENUECAT_WEBHOOK_AUTH` | `revenuecat-webhook` | Shared secret matched against the request's `Authorization` header (set the same value in the RevenueCat dashboard). If unset, the webhook runs unauthenticated (logs a warning). |

`analyze-emotion` does **not** use the Supabase env vars at all (no DB access).

---

## Source files

- `supabase/functions/analyze-emotion/index.ts`
- `supabase/functions/delete-account/index.ts`
- `supabase/functions/revenuecat-webhook/index.ts`

## Related docs

- [`supabase.md`](supabase.md) — DB schema, tables, RLS, and the `auth.users` FK cascades that `delete-account` relies on.
- [`analytics.md`](analytics.md) — the `app_events` sink that `revenuecat-webhook` writes subscription-lifecycle rows into.
- [`../guides/in-app-purchase.md`](../guides/in-app-purchase.md) — RevenueCat purchase flow that produces the webhook events.
