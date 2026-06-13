# WebView Stability & Diagnostics

Non-obvious workarounds for iOS WKWebView OOM-kills and audio-buffer leaks: a leak-counting resource tracker, a process-lifetime AudioContext singleton, and a localStorage-marker crash post-mortem.

## Overview

The app is a Capacitor WKWebView. iOS aggressively kills the WebView process under memory pressure, and WebKit does not fully reclaim some native allocations (audio buffers, blob data, GL contexts) even when the JS-visible objects are released. This subsystem exists to (a) **avoid** the worst leaks (audio), and (b) **diagnose** the kills we can't avoid, since `performance.memory` is unavailable in WKWebView.

Three modules, all under `src/services/`, all wired in lazily from `main.tsx` after first paint:

| Module | Role |
| --- | --- |
| `resourceTracker.ts` | Approximate memory pressure by monkey-patching leak-prone APIs and counting; ring-buffer snapshots to localStorage. |
| `audioContextSingleton.ts` | One `AudioContext` for the whole JS process to avoid per-mount native buffer leaks. |
| `crashRecovery.ts` | Post-mortem: detect a WebView OOM-kill on the *next* launch via a stale localStorage marker. |

All three are deferred off the cold-start critical path via `runWhenIdle()` in `src/main.tsx:39-67` (WKWebView has no `requestIdleCallback`, so it falls back to `setTimeout`). Deferral means the tracker misses patching anything created in the first ~100 ms splash window — accepted because the audio engine and practices spin up well after that (`src/main.tsx:48-59`).

---

## resourceTracker

`src/services/resourceTracker.ts`. WKWebView does not expose `performance.memory`, so this module **approximates** memory pressure by counting things that commonly leak, then watching whether they grow monotonically across practice runs (`resourceTracker.ts:1-17`).

### How it counts

`installResourceTracker()` (`resourceTracker.ts:79`) monkey-patches global APIs in place (idempotent via the `patched` flag, `:80-81`). Each patch increments a `total…Ever` counter and, where a teardown hook exists, maintains a `live…` counter:

- **`setInterval` / `clearInterval`** (`:84-108`) — tracks live IDs in a `Set` so `clearInterval` decrements accurately even if called twice.
- **`setTimeout` / `clearTimeout`** (`:111-140`) — wraps the handler so the timeout self-removes from the live set when it fires.
- **`AudioContext` / `webkitAudioContext`** (`:143-167`) — increments on construct, wraps `.close()` to decrement `liveAudioContexts`.
- **`AudioContext.prototype.createMediaElementSource`** (`:169-180`) — patched on the prototype so *all* instances count; these pin the `<audio>` decoder in the native audio graph and can't be freed while the context lives (relevant given the singleton context never closes — see below).
- **`new Audio(...)`** (`:183-194`) — each allocates a native decoder/buffer; detached elements that `getElementsByTagName('audio')` misses still hold memory, so this catches them via `totalAudioElementsEver`.
- **`URL.createObjectURL` / `revokeObjectURL`** (`:196-210`) — `liveBlobUrls` = created minus revoked; blob URLs pin the underlying decoded-mp3 `Blob` in native memory until revoked.
- **`new Blob(...)`** (`:212-228`) — counts blobs and their `.size` bytes; decoded audio (~20-30 MB/track per the comment) sits in native memory even with no URL assigned.
- **`HTMLCanvasElement.getContext` (webgl/webgl2)** (`:230-273`) — counts GL contexts (Three.js `<Canvas>` mounts) via a `WeakSet`; best-effort decrement on `webglcontextlost`. Holds a strong ref to the `WEBGL_lose_context` extension because some WebKit versions GC it otherwise (`:267-269`). WKWebView caps live contexts (~8-16).
- **`fetch`** (`:275-284`) — `liveFetches` via `.finally()`; an in-flight fetch with a large `ReadableStream` pins native buffers.

### What it emits

- **`snapshotResources()`** (`:287-317`) returns a `ResourceStats` object: all counters plus live DOM/`audio`/`video` element counts queried at call time, plus `jsHeapUsedMB`/`jsHeapTotalMB` (which are `null` on iOS since `performance.memory` is absent).
- **`startHeartbeat(intervalMs = 500)`** (`:329-342`) runs a 500 ms timer that pushes snapshots into a `HEARTBEAT_MAX = 20`-entry ring buffer in `localStorage` under `onda_resource_heartbeats`. The point: if the WebView is OOM-killed, the post-mortem can ship the last seconds of growth, not just the snapshot at practice start.
- **`getHeartbeats()` / `clearHeartbeats()`** (`:344-357`) read/clear that ring buffer; `crashRecovery` consumes them.

### Consumers

- `main.tsx:54-58` calls `installResourceTracker()` then `startHeartbeat(500)`.
- `AnalyticsService.ts:414-426` — **dev-only** (`ANALYTICS_DEBUG`): on `practice_start` it imports `snapshotResources()` and emits a `resource_snapshot` event to correlate growth with crashes. The `resource_snapshot` event is gated out of prod entirely (`AnalyticsService.ts:403-405`). Note the comment "Keyed on practice_start (practice_view retired)" (`:413`) — the event-name drift from `practice_view` to `practice_start` matters for the crash marker below.

---

## audioContextSingleton

`src/services/audioContextSingleton.ts`. This is the **avoidance** half of the subsystem.

**The leak:** on WKWebView every `new AudioContext()` allocates a large native audio buffer pool that is *not* fully reclaimed on `.close()`. When practice intros mount/unmount a `RemoteAudioPlayer`, a per-mount AudioContext accumulates native memory despite cleanup calling `close()`. The comment states iOS hits memory pressure and kills the WebView after ~3 cycles (`audioContextSingleton.ts:1-9`).

**The fix:** share one `AudioContext` for the lifetime of the JS process so the native leak happens at most once per app launch rather than once per practice open.

- **`getAudioContext()`** (`:22-34`) lazily constructs and returns the shared instance (`AudioContext` or `webkitAudioContext`), returning `null` on failure. **Callers must never call `.close()` on it** — only per-source nodes should be `disconnect()`'d in component cleanup (`:14-18`).
- **`resetAudioContextSingleton()`** (`:42-51`) closes and nulls the singleton to free the native backing buffer (e.g. before long backgrounding). The doc-comment explicitly says **most code paths should NOT call this** (`:36-41`).

Consumers: see `docs/README.md` and `docs/architecture/system-snapshot.md` references; audio players obtain the context via `getAudioContext()` rather than constructing their own.

> Interaction with resourceTracker: because the singleton context is never closed, every `createMediaElementSource` on it accumulates (`resourceTracker.ts:46-49`). That's a deliberate trade — one stable context with accumulating source nodes is cheaper than repeatedly leaking whole contexts.

---

## crashRecovery

`src/services/crashRecovery.ts`. The **post-mortem** half: a WebView OOM-kill leaves no in-process signal (the process is gone), so detection happens on the *next* launch via a stale localStorage marker.

### The marker lifecycle

The marker lives at `localStorage['onda_last_practice_view']` and is owned by `AnalyticsService.track()`:

- **Set** when a practice **starts** — on the `practice_start` event (`AnalyticsService.ts:431-448`), storing `{ practiceId, ts, sessionPracticeCount, sessionId }`. (The key name is historical — it predates the `practice_view`→`practice_start` rename; see the analytics doc's event-name notes.)
- **Cleared** when the practice resolves — on `practice_complete` or `practice_abandon` (`AnalyticsService.ts:450-455`), and also on next-launch detection (`crashRecovery.ts:8`).

If the app dies between start and resolve, the marker survives into the next session — that's the crash fingerprint.

### Detection (`runCrashRecovery()`, `crashRecovery.ts:4-46`)

Called from `main.tsx:65-67` via `runWhenIdle`. It must run before the user can start a new practice; ~100 ms deferral is safe because the practice list isn't reachable until the lazy main scene mounts (`main.tsx:61-64`). Logic:

1. Read `onda_last_practice_view`; bail if absent (`:6-7`).
2. Remove it immediately (`:8`) so it fires at most once.
3. Compute `Date.now() - marker.ts`; **only report if < 10 s** (`:10-12`) — a long gap means the user simply backgrounded the app, not a crash.
4. Pull recent `onda_error_logs` and the resourceTracker heartbeats (dynamic-imports `resourceTracker`, reads `getHeartbeats()`, then `clearHeartbeats()`; tolerates the tracker not being ready, `:14-26`).
5. Emit **`app_crash_suspected`** via `AnalyticsService` (`:28-37`) with `crashed_practice_id`, `ms_since_practice_view`, `session_practice_count`, `prev_session_id`, the last 5 error logs, the last 10 pre-crash heartbeats, and `platform: 'ios'`.

The whole body is wrapped in try/catch — diagnostics must never break launch (`:43-45`). `app_crash_suspected` is a registered event (`AnalyticsService.ts:78`) and is documented in `docs/architecture/analytics.md:187`.

---

## Why these exist (don't regress them)

WKWebView constraints these work around:

- **No `performance.memory`** → can't read heap directly, hence the count-the-leaks approximation in resourceTracker.
- **No `requestIdleCallback`** → `runWhenIdle` falls back to `setTimeout` (`main.tsx:28-37`).
- **Native allocations survive JS release** — AudioContext buffer pools, blob data, `<audio>` decoders, and GL contexts/textures are native memory invisible to JS GC. This is why blob/audio/GL counters track `…Ever` totals, and why the AudioContext is a process-lifetime singleton instead of per-mount.
- **Aggressive OOM process kills** with no in-process notification → the localStorage-marker post-mortem is the only way to attribute a kill.

Regression hazards:
- Calling `.close()` on the singleton AudioContext (outside the rare `resetAudioContextSingleton()` path) reintroduces the per-mount native leak.
- Constructing a fresh `AudioContext` instead of `getAudioContext()` does the same.
- Moving resourceTracker's `install` *later* shrinks coverage; moving the marker set/clear off `practice_start`/`practice_complete`/`practice_abandon` breaks crash attribution.
- The marker key `onda_last_practice_view` is read in `crashRecovery.ts` and written in `AnalyticsService.ts`; both must stay in sync if renamed.

## Source files

- `src/services/resourceTracker.ts`
- `src/services/audioContextSingleton.ts`
- `src/services/crashRecovery.ts`
- `src/main.tsx` (lazy wiring, `runWhenIdle`)
- `src/services/AnalyticsService.ts` (marker set/clear, dev `resource_snapshot`, `app_crash_suspected` registration)
- Related: `docs/architecture/analytics.md` (event catalog)
