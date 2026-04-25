# Airbridge Analytics — Event Roadmap

Proposed events not yet wired up. Companion to [`docs/architecture/airbridge.md`](../architecture/airbridge.md), which documents what is *already* emitted.

Principles we apply when deciding whether to add an event:

- **Attribution / funnel / revenue first.** Airbridge is paid for to answer "did this campaign cause a paying user?" — events that don't help that story belong in the internal Supabase analytics, not here.
- **One event per user-meaningful moment.** Not per re-render, not per debounce tick.
- **Flat scalar payloads only.** No nested objects — dashboards can't slice them.
- **Safe-noop helpers.** Every new event goes through a helper in `src/lib/airbridge.ts` that guards on `typeof window.airbridge === 'function'`.

---

## 1. High priority — activation & core funnel

> **Status: shipped in Sprint 1.** `Sign Up`, `Sign In`, `App Open`,
> `Complete Onboarding`, `First Practice Complete` are all wired up.
> See [`docs/architecture/airbridge.md`](../architecture/airbridge.md) §2
> for triggers, payloads, and gotchas.

---

## 2. Medium priority — paywall funnel detail & permissions

### Paywall funnel

> **Status: shipped in Sprint 2.** `Dismiss Paywall` is live, and `source`
> is attached as an extra on both `View Paywall` and `Dismiss Paywall`
> (we went with the "filter on existing event" route — no separate
> `Paywall Trigger` event). See
> [`docs/architecture/airbridge.md`](../architecture/airbridge.md) §6 for
> the source-value table.

### Permissions

| Event | Trigger | Label | Extras |
|---|---|---|---|
| `HealthKit Permission` | After the system prompt resolves | `granted` \| `denied` | `requested_types` (flat string, comma-joined) |
| `Bluetooth Permission` | Same pattern | `granted` \| `denied` | — |
| `Notifications Permission` | Same pattern | `granted` \| `denied` | — |
| `Watch Connected` | First successful handshake with paired Apple Watch companion in a given session | — | `watch_model` if available |

These gate downstream feature usage (HRV, push re-engagement, watch sessions) so we want to see their grant rate in attribution cohorts.

### Progression milestones

| Event | Trigger | Label | Extras |
|---|---|---|---|
| `Level Unlocked` | User advances from Level N → Level N+1 | `level_${N+1}` | `practices_completed_to_unlock` |
| `Circuit Complete` | All practices in a circuit finished | circuit id | `duration_seconds_total` |
| `Artifact Earned` | Artifact validity threshold met and artifact persisted | artifact id | `quality_score` |

One event per milestone per user per unit — idempotent on repeat triggers.

### Recommendations

| Event | Trigger | Label | Extras |
|---|---|---|---|
| `Recommendation Followed` | User starts a practice that was the top recommendation from the emotional check-in result screen | recommended practice name | `emotion` (source emotion) |

Measures whether our recommender actually steers behavior.

---

## 3. Lower priority — nice-to-haves

Only add if a specific dashboard question demands them. Otherwise they're noise.

| Event | Notes |
|---|---|
| `Pause Practice` / `Resume Practice` | Only useful if abandonment analysis shows a pause/resume pattern worth segmenting. Currently speculative. |
| `Language Changed` | One-off; UA/ES/ZH rollout analysis. Safe to emit from the settings toggle. |
| `Notifications Enabled` (in-app toggle, not system permission) | Re-engagement funnel. |
| `Share App` / `Invite Sent` | Only if/when a share feature ships. |

---

## 4. Explicit "won't track" list

To keep the event stream clean, we deliberately do **not** send these to Airbridge:

- Every tab/menu click that doesn't change funnel state.
- Scroll depth, time-on-screen for arbitrary screens.
- Debug / developer-mode toggles.
- Per-second telemetry (HRV sample stream, breathing rate ticks) — that belongs in Supabase analytics with batched inserts, not an attribution SDK.
- Auth-required redirects and purchase failures — covered by internal analytics (`paywall_auth_required`, `purchase_failed`, `purchase_cancelled`).
- Restore Purchases success — not a new conversion; double-counts revenue.

---

## 5. Suggested rollout order

1. ~~**Sprint 1 — close the funnel.** `Sign Up`, `Sign In`, `App Open`, `Complete Onboarding`, `First Practice Complete`.~~ ✅ Shipped.
2. ~~**Sprint 2 — paywall detail.** `source` extra on `View Paywall`, `Dismiss Paywall`.~~ ✅ Shipped.
3. **Sprint 3 — permissions & progression.** HealthKit / Bluetooth / Notifications / Watch, then `Level Unlocked` / `Circuit Complete` / `Artifact Earned`. Feeds retention cohorts.

After each sprint: update [`docs/architecture/airbridge.md`](../architecture/airbridge.md) §9 and remove the shipped items from this roadmap.

---

## 6. Implementation checklist for a new event

Copy-paste template when promoting an item from this doc to production:

- [ ] Add a helper to `src/lib/airbridge.ts` (guard + `try/catch` + `console.log`).
- [ ] Call it from the component at the exact UX moment (not inside a debounced handler).
- [ ] Verify once-per-user / once-per-session semantics if applicable (persistent flag in Supabase or secure storage).
- [ ] Add a row to the reference table in `docs/architecture/airbridge.md` §8.
- [ ] Remove the item from this roadmap.
- [ ] Verify on device: browser console shows `[Airbridge] …`; Xcode console shows the native bridge call.
