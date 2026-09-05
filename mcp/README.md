# ONDA analytics MCP (read-only)

An MCP server that answers two questions directly in chat, instead of by hand
from four dashboards: **where did the installs come from**, and **where do
people drop off**.

## Guarantees

- **Read-only by construction.** There is no write path. No tool mutates GA4,
  App Store Connect, Tenjin or the app. Unlike the Vallydia server, there is no
  fused write tool here at all.
- **Aggregate-only, zero PII.** No user ids, IDFA/IDFV, emails or device ids —
  only counts and percentages.
- **Credentials never leave the server.** They are read from env per request and
  never appear in a tool response, not even in an error message.
- **Every percentage carries its N**, plus `low_data: true` when the denominator
  is under 30. At ~50 installs/month a "40% drop-off" can be two people, and the
  tool must not let that read as a finding.
- **Windows default to 28 days**, not 1, for the same reason. `since` is days
  back, capped at 365.
- **Modelled numbers are labelled.** Ad-console install counts (Google/Apple
  SKAN) are modelled and have shown 90 installs where Tenjin saw 1 — nothing
  modelled is passed off as measured.

## Tools (Phase 1)

| Tool | Answers | Sources |
|---|---|---|
| `funnel_review` | Where do people drop off? | GA4 Data API |
| `installs_review` | Where did installs come from? | App Store Connect + Tenjin |
| `revenue_review` | Are people paying? | RevenueCat v2 |
| `retention_review` | Do they come back? | GA4 Data API (cohorts) |
| `ga4_breakdown` | One event split by a dimension (share by unique users) | GA4 Data API |
| `site_fetch` | What is on a page? | the ONDA site |
| `site_style` | What are the brand colours and fonts? | the ONDA site |
| `site_health` | Does the live domain match the preview? | the ONDA site |
| `site_map` | What pages exist? | sitemap.xml |
| `list_files` | What files exist in the repo? | GitHub (main, live) |
| `read_file` | Read one source file | GitHub (main, live) |
| `grep_content` | Where does this happen in the code? | GitHub (main, live) |
| `copy_lookup` | What is this string in every locale? | `public/locales/` (main) |
| `analytics_catalog` | What does this event mean and where does it fire? | `src/` track() calls (main) |
| `practice_catalog` | The practices as a table | circuits array (main) |
| `ph_breakdown` | One event split by a property (shares by unique users) | PostHog (HogQL) |
| `ph_retention` | Cohort d1/d7/d30, splittable by property | PostHog (HogQL) |
| `ph_funnel` | Ordered funnel, splittable by property | PostHog (HogQL) |
| `ph_query` | Raw HogQL (SELECT-only) | PostHog (HogQL) |
| `ph_events` | What events PostHog actually receives | PostHog (HogQL) |
| `check_status` | Are the sources actually answering? | all of the above |

`ads_review` is **not** implemented yet; it is
absent rather than returning empty results.

### `funnel_review`

```
first_open -> onboarding_start -> onboarding_complete -> practice_start
-> practice_complete -> results_view -> paywall_view
   |- purchase
   \- paywall_dismiss{action} -> home_view{source:first_run}
```

The two post-paywall branches are **disjoint and reported separately** —
buying and reaching the hub without buying are different outcomes, and one
blended "conversion" number would hide which is happening. `silent_exit` is the
residual (`paywall_view - purchase - home_view{first_run}`): saw the paywall,
neither bought nor entered the product. It is derived by subtraction, so event
loss inflates it — stated in the payload.

Params: `since`, `app_version`, `internal` (`exclude`|`include`|`only`), `view`.

**Counts are total users per event in the window** — not sessions, and not a
strictly ordered path. A user counts toward a step whenever they fired that
event, even having skipped an earlier one.

### `revenue_review`

Net revenue is RevenueCat `revenue_type=proceeds` — net of taxes **and** store
commission, taken from the API. It is deliberately **not** gross minus a flat
30%: Apple charges 15% under the Small Business Program and after year one of a
subscription, so a hardcoded rate would misstate net by roughly half for this
app.

The `snapshot` block (active subscriptions, active trials, MRR) comes from the
overview endpoint, whose windows are **fixed at 28 days by the API** and do not
follow `since`. Only `revenue`, `trials`, `refunds` and `churn` honour it. The
payload says so rather than letting a `since: 90` call look uniformly 90-day.

Breakdowns by product or channel are attempted only through segments the chart
reports it supports (`/charts/{name}/options`); when none match, the tool
returns `available: false` **and lists the segments that do exist**, instead of
guessing a segment name and taking a 400.

`tenjin_purchase_events_note` cross-checks RevenueCat against the Tenjin
dashboard's `Valid Purchase Event: not received`. If RevenueCat shows paying
activity while Tenjin shows none, that is direct evidence Tenjin has no In-App
Purchase credentials filled in and will keep reporting zero however many
purchases occur. If both show nothing, the tool says so plainly — that proves
nothing about whether Tenjin is wired, and it says that too.

### `installs_review` and contradictory sources

When Tenjin attributes **more** paid installs than App Store Connect reports in
total — it once returned 254 paid against 220 total over 90 days — no
percentage and no organic residual are produced. The tool returns
`inconsistent_sources: true` with both figures, the excess, and the likely
causes (SKAN modelling, timezone drift, redownloads). Reporting 115.5% paid and
0 organic was arithmetic performed on contradictory inputs and stated with a
confidence it had not earned.

## Site tools

`site_fetch`, `site_style`, `site_health` and `site_map` read the ONDA site.
They are read-only like everything else, and they are the part of this server
with a real attack surface, so the constraints are worth stating plainly.

**The caller never supplies a host.** It picks `target` from a two-value enum
(`production` | `preview`) and passes a *path*. There is no `url` or `host`
parameter to abuse. This matters because the server holds App Store Connect,
GA4, Tenjin and RevenueCat credentials: a free-form URL parameter here would be
an SSRF primitive pointed at cloud metadata endpoints.

The remaining defences:

- A three-host allowlist — `onda-life.com`, `www.onda-life.com`,
  `ondalife.vercel.app`. No wildcards, no subdomain exceptions.
- Path validation rejects anything that could carry a host: absolute URLs,
  protocol-relative `//host`, backslashes, embedded credentials. The built URL
  is then re-checked against the allowlist as defence in depth.
- Redirects are **not** followed. One leaving the allowlist is reported as a
  fact, never chased.
- No `Authorization` header ever leaves the module — the analytics credentials
  have nothing to do with reading a public page.
- A 15s timeout and a 3 MB cap; scripts and styles are stripped from the text,
  with `ld+json` parsed out separately.

### `site_style`

Built for one job: reproducing the brand in a graphic. The raw stylesheet is
useless for that — Tailwind emits ~70 internal `--tw-*` variables and its whole
default colour scale, which bury the handful of tokens that actually are the
brand. Those are counted and set aside, leaving the real palette
(`--color-terminal-green`, `--color-terminal-cyan`, `--color-surface`…), the
font variables and `@font-face` declarations, the type scale, and a hex
frequency list with fully transparent values dropped.

### `site_health`

Compares production against the preview path by path — status, title, canonical
— and flags mismatches. It exists because a 404 on the live domain while the
preview served fine was found by accident. Canonicals are compared by *path*,
since the preview canonicalises to the production domain on purpose.

> While DNS still points away from Vercel the two are **expected** to differ:
> that is the migration in progress, not a regression. After the cutover any
> mismatch here is a real problem.

### `retention_review`

Cohort retention from the GA4 Data API (`cohortSpec` with `cohortActiveUsers`
and `cohortTotalUsers`; the fraction is computed here so the denominator always
travels with it).

**Two definitions, reported side by side and never blended:**

| | Counts a user as retained when they… |
|---|---|
| `by_open` | launched the app — GA4 active users, the benchmark-comparable number |
| `by_practice` | actually started a practice (`practice_start`) |

Opening an app is not retention. `by_practice` is the one to act on and is
always the lower of the two; the gap between them is people who came back and
did nothing.

**Immature cohorts are excluded, not counted as zero.** A cohort that installed
yesterday has a d7 of 0 by arithmetic, and averaging it in makes healthy
retention look like a collapse. A cohort must be at least `milestone + 2` days
old (the 2 days being GA4 processing lag) to enter a rate; younger ones are
counted in `cohorts_too_young` and, per cohort, marked `incomplete: true` with
no percentage at all. When no cohort in the window is old enough, the milestone
says so explicitly rather than returning 0%.

Headline rates pool every eligible cohort in the window rather than reporting a
single day: at ~49 installs a month a per-day cohort is single digits, so daily
figures would be permanently `low_data`. Pooling also makes them directly
comparable to the pre-redesign baseline, which was itself a window figure.

**The baseline travels with the number** — Tenjin, 2026-05-23 to 2026-06-22,
145 installs, d1 3.42% and d7 0.68%, $1861 per d7-retained user. It is an
app-open measurement, so it is compared against `by_open` only; `by_practice`
has no baseline and is not given a fake one.

`by_channel` is `available: false`: GA4 restricts which dimensions may
accompany a `cohortSpec`, and Tenjin — the channel-capable cohort source — is
not wired into this tool.

### `organic_sources` — how people find the app in the store

From App Store Connect **Analytics** reports (the asynchronous
`analyticsReportRequests` family), not the sales reports used for install
counts. Broken down by source type: App Store Search, Browse, App Referrer,
Web Referrer, Institutional Purchase, Unavailable.

**Registration is a one-off WRITE and lives outside this server**, which is
read-only by construction:

```bash
ASC_KEY_ID=... ASC_ISSUER_ID=... ASC_PRIVATE_KEY="$(cat AuthKey_XXX.p8)" \
  node scripts/register-analytics-reports.mjs
```

It needs the **Admin** role the first time. It registers both an `ONGOING`
request (accumulates forward, first report in ~24-48h) and a
`ONE_TIME_SNAPSHOT` (returns the history already available).

> An `ONGOING` report accumulates **only from the moment it is registered and
> is never backfilled**. Days before registration are gone for good. Apple also
> *stops* a request that goes unread (`stoppedDueToInactivity`) — the tool
> reports that state distinctly, because it looks like "no data" while actually
> meaning "collection has halted".

**Apple's privacy thresholding changes how these numbers must be read.** Rows
covering fewer than 5 users or devices are *omitted entirely*, and statistical
noise is added to the rest. At ~42 organic installs a month across six source
types, whole sources can be missing. So shares are computed against the
**visible** sum and labelled `share_of_visible`; they are the shape of
discovery, not exact proportions, and they are never rescaled to match the
sales-report total — that would fabricate precision Apple deliberately removed.

`organic_sources` is kept **separate from `split.organic`** on purpose. One is a
subtraction residual (ASC total − Tenjin paid); the other is measured by Apple,
and counts discovery *events*, not installs. They answer different questions and
are not reconciled into one flattering number.

Negative states are distinct and never an empty array: `not_registered`,
`stopped_due_to_inactivity`, `report_pending`, `unrecognised_report_format`
(which lists the columns that were actually present).

### The `internal` filter

Our own runs are marked by a Firebase **user property** `internal`, set by the
app's hidden toggle (7 taps on the version line in Menu). GA4 exposes it as the
user-scoped custom dimension `Internal traffic`.

**Contract: EXTERNAL is `'false'` OR absent.** Everything recorded before the
marker shipped carries no property at all, and those are real users — so
`exclude` is `NOT(== 'true')`, never `== 'false'`, which would silently discard
all history. Only an explicit `'true'` is internal.

`internal: 'only'` exists to confirm events fire at all while walking the flow
yourself.

> The built-in GA4 "Internal traffic" **Data Filter must stay out of Active
> mode** — it discards data irreversibly. Filtering happens per query here,
> which is what keeps `include` and `only` possible.

### `app_version`

Uses GA4's **built-in `appVersion`** dimension, which Firebase populates from
the real marketing version. The app's own `app_version` field is deliberately
NOT used: it carries `VITE_BUILD_NUMBER` (a CI run counter), not `1.8.x`.

## PostHog tools (`ph_*`) — EMOTON only

**Scope:** PostHog receives **EMOTON** events only — the landing's emotional
check-in tool ([`emotonAnalytics.ts`](../landing/src/lib/emotonAnalytics.ts)),
which reports to PostHog and nowhere else. The **iOS app sends nothing to
PostHog** (its analytics are Firebase/GA4). So the `ph_*` tools answer EMOTON
funnel questions — which emotional zones people name, where they drop, whether
they return. For **app** questions (e.g. the watch/camera/simulated
`metrics_source` split) use the GA4 tools: **`ga4_breakdown`**, `funnel_review`,
`retention_review`. When app→PostHog capture ships, app-scoped `ph_*` tools can be
added then.

They speak HogQL (SQL over the `events` table; event properties at
`properties.<name>` e.g. `properties.zone`, unique visitors via
`count(distinct person_id)`) through the Query API. House rules: **read-only**,
**aggregate-only**, every percentage carries its `N`, shares by **unique
visitors** not events. EMOTON is **anonymous** (`person_profiles:
'identified_only'`), so a "visitor" is a browser cookie and cross-day retention
is undercounted for anyone who clears cookies or switches device.

EMOTON events: `emoton_opened`, `presence_started`, `zone_selected`,
`shade_selected`, `route_selected`, `practice_started`, `practice_completed`,
`bewith_entered`, `bewith_stayed_longer`, `assimilation_reached`,
`download_cta_viewed`, `download_cta_clicked`. Properties include `zone`,
`shade`, `route`, `placement`.

- `ph_breakdown` — e.g. `event=shade_selected property=zone` → which emotional
  zones people name, by unique visitors.
- `ph_retention` — cohort d1/d7/d30, with `breakdown=zone`; too-young cohorts
  excluded from a milestone, never scored zero (anonymous caveat above).
- `ph_funnel` — the EMOTON funnel via `windowFunnel`, e.g.
  `["emoton_opened","shade_selected","route_selected","practice_completed","download_cta_clicked"]`.
- `ph_query` — raw HogQL, **SELECT-only**: `INSERT`/`UPDATE`/`DELETE`/`ALTER`/
  `DROP` and multiple statements are refused *before* the request is sent, not
  left to the key's scopes.
- `ph_events` — which EMOTON events are live, with frequency.

Env: `POSTHOG_API_KEY` (personal key, scopes `query:read` + `insight:read`) is
the only required variable; `POSTHOG_PROJECT_ID` (default `462907`) and
`POSTHOG_HOST` (default `https://us.posthog.com` — the US instance) fall back to
the ONDA values.

## Deploy

Separate Vercel project — **not** the landing project, whose functions were
deliberately removed during the static migration, and whose env should not hold
production analytics credentials.

| Setting | Value |
|---|---|
| Root Directory | `mcp` |
| Framework Preset | Other |
| Build Command | *(none)* |
| Output Directory | *(none)* |
| Node.js Version | 22.x |
| Domain | `onda-mcp.vercel.app` (see the note below about `mcp.onda-life.com`) |

Set every variable from [`.env.example`](.env.example) in the project env, then
add the connector in Claude's settings:

```
https://onda-mcp.vercel.app/api/mcp?key=<MCP_AUTH_TOKEN>
```

> ⚠️ **`mcp.onda-life.com` does not resolve.** It was written here as the
> intended endpoint, but no DNS record was ever created for it — `onda-life.com`
> is still at GoDaddy awaiting the migration, so the subdomain does not exist.
> `curl https://mcp.onda-life.com/api/mcp` fails with "Could not resolve host",
> while `onda-mcp.vercel.app` answers. Use the Vercel host until the DNS cutover
> adds the subdomain, then update this line rather than leaving both plausible.

`Authorization: Bearer <token>` works too. **With `MCP_AUTH_TOKEN` unset the
endpoint refuses every request with 503** — an unset gate is an open gate.

## Verifying

```bash
npm test
```

79 tests: the auth gate (fails closed, rejects wrong tokens), the JSON-RPC
surface, graceful `not_configured` degradation, and the funnel arithmetic
against a mocked GA4 — including that `home_view{first_run}` is used rather
than all `home_view`, and that `silent_exit` never goes negative. Plus the
failure diagnostics above, and that Tenjin targets the host from the published
spec rather than an invented one.

## When a source fails

Every failure carries what is needed to act on it, because a bare `fetch failed`
does not:

- `status: null` + `network_error: true` + `cause` — the request **never reached
  the server**. Wrong host, DNS, or egress. Not a token problem.
- `status: 401` / `403` + `body_snippet` — the API answered and rejected us.
  Token or scope.
- `status: 429` — rate limited (Tenjin allows 100 reporting requests/minute).
- `status: 4xx/5xx` + `body_snippet` — the API's own explanation, usually a
  parameter it did not like.

Body snippets are truncated to 400 characters and never contain our credentials.

## Data lag

GA4 ~24–48h, App Store Connect ~1–2 days, Tenjin near-real-time but paid
attribution can be revised for ~48h. Every tool returns a `data_lag_note`; the
newest day in any window is usually incomplete.
