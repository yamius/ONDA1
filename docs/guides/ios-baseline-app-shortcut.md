# TODO (iOS app) — Baseline as an in-app App Shortcut

**Status:** not started. Future task in the **iOS app repo/target**, not the landing.
**Raised:** 2026-09-05, after shipping the web Baseline tool at `onda-life.com/tools/baseline`.

## The question this answers

Apps like Calm / Zen show ready-made tiles in the iOS **Shortcuts** app automatically —
the user installs the app and the tiles just appear, grouped under the app name, with no
iCloud link and no setup. We want the same for people who install **ONDA**: a Baseline
tile that appears on its own.

## How that actually works

Those auto-appearing tiles are **App Shortcuts**, declared through Apple's **App Intents**
framework (iOS 16+). The app defines an `AppIntent` (the action) plus an
`AppShortcutsProvider` (which surfaces it), and iOS lists it in the Shortcuts app and Siri
automatically once the app is installed. Delete the app → the tile disappears. There is no
iCloud link involved and the user creates nothing.

## The key design decision

**An App Shortcut runs the app's own code — it does NOT open a web page.** So the ONDA App
Shortcut must NOT be "open onda-life.com/tools/baseline". It should be a **native action**,
e.g. *"Show my Baseline"* / *"Read my two-week baseline"*, that:

- reads the last 14 days from HealthKit **in the app** (the app already has HealthKit +
  the live coherence/HRV engine), and
- opens the in-app view — which is the "same thing, live" the web tool points at.

For app users this is strictly better than the web tool. The web fragment-shortcut
(`Baseline Onda 14 items` → `onda-life.com/tools/baseline`) stays the path for people
**without** the app (organic, from the tool page). Two paths, two audiences:

| | No app | Has the app |
|---|---|---|
| How it's added | iCloud link from `/tools/baseline` | appears on its own (App Intents) |
| What it does | opens the web card page | runs a native screen in the app |
| Where the work is | ✅ done (landing) | native Swift in the iOS project |

## What building it involves

- ONDA app is **Capacitor**, so App Intents live as **native Swift in the iOS target**
  (Xcode) — a small `AppIntent` + `AppShortcutsProvider`. No Capacitor plugin strictly
  required; can be added directly to the native target. (A Capacitor↔Swift bridge is only
  needed if the intent must hand off into the web/JS layer; opening a specific in-app route
  is usually enough.)
- Add a spoken phrase for Siri while there ("Show my ONDA baseline").
- Privacy: this path reads HealthKit **in-app** and shows it in-app — no fragment, no web,
  no third-party script concern. Keep it aligned with the app's existing HealthKit usage
  string / App Privacy labels (do not silently widen HealthKit reads — see the dormant
  fitness-reads note in memory).

## Not blocking anything

The landing side is complete for non-app users. This is purely additive for app users and
can wait for its own task in the iOS app. When picked up: scope a single `AppIntent`
("Open/Show my Baseline"), wire it to the existing in-app Baseline/metrics view, register it
via `AppShortcutsProvider`, and optionally donate it to Siri.
