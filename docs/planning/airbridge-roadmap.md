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

> **Status: shipped in Sprint 3 (HealthKit + Watch Connected).**
> `HealthKit Permission` fires from `useHealthKitData` /
> `useHealthKitHeartRate` after the system prompt resolves.
> `Watch Connected` fires once per app session on the first
> `paired && watchAppInstalled` reading. `Bluetooth Permission` and
> `Notifications Permission` are **deferred** — neither plugin is
> currently invoked from the JS layer, so there's no resolution
> callback to hook into. Revisit when those flows ship. See
> [`docs/architecture/airbridge.md`](../architecture/airbridge.md) §7.

### Progression milestones

> **Status: shipped in Sprint 3.** `Level Unlocked`, `Circuit Complete`,
> and `Artifact Earned` are wired with localStorage-backed idempotency
> (one event per milestone per device). See
> [`docs/architecture/airbridge.md`](../architecture/airbridge.md) §7
> for the storage keys and rationale.

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
3. ~~**Sprint 3 — permissions & progression.** HealthKit + Watch Connected, then `Level Unlocked` / `Circuit Complete` / `Artifact Earned`.~~ ✅ Shipped (Bluetooth + Notifications deferred — no JS-layer callsite yet).

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
