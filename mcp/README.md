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
| `check_status` | Are the sources actually answering? | all of the above |

`retention_review` and `ads_review` are **not** implemented yet; they are
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
| Domain | `mcp.onda-life.com` |

Set every variable from [`.env.example`](.env.example) in the project env, then
add the connector in Claude's settings:

```
https://mcp.onda-life.com/api/mcp?key=<MCP_AUTH_TOKEN>
```

`Authorization: Bearer <token>` works too. **With `MCP_AUTH_TOKEN` unset the
endpoint refuses every request with 503** — an unset gate is an open gate.

## Verifying

```bash
npm test
```

38 tests: the auth gate (fails closed, rejects wrong tokens), the JSON-RPC
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
