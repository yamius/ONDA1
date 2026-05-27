# Home redesign 1.7.4 — section boundary mapping

Reference doc for commit `#5b`. Numbers are line ranges in
`src/onda-level1-demo_27.tsx` on branch `claude/v1.7.4` as of HEAD
`455111c`. **Read this end-to-end and approve before I touch the
monolith.**

## Top-level structure

```
4979  return (
4980    <div data-main-container ...>
5013      <DebugMonitor .../>
5020      DEBUG banner (gated by localStorage.debugMode)
5033      Hamburger menu button (fixed position)
5050      Subscription $ button (gated by `{false && ...}` — already disabled)
5095      Verkhnyaya navigatsiya (also className="hidden" — already disabled)
5180      <div className="max-w-6xl mx-auto ..."> ← HOME FLOW STARTS
              ... see section table below ...
6804      </div>  ← HOME FLOW ENDS
6805    </div>    ← outer
6807    Modals (Journal / Stats / Rating / Auth / Profile / Settings /
            Connection / Language / QntShop / EmotionalCheck /
            NervousScan / InfoModal) and the Adaptive practice modal
6850-7320
        </div>
        );
```

The home-screen *flow* — what we reorder — is everything inside the
`max-w-6xl` container at line **5180-6804**. Above that line are
overlays/debug; below are modals. **We do not touch overlays or modals.**

## Current section inventory (top → bottom)

| Range | Block | Disposition |
|---|---|---|
| 5180–5188 | `ONDA ~ LIFE` logo | → Journey (header) |
| 5190–5288 | "Уровень X | Тело" chip + chapter dropdown | → Journey |
| 5289–5391 | "Часть X | Я есть" chip + level dropdown | → Journey |
| 5392–5395 | Quote `«…»` | → Journey |
| **5398–5437** | **`Эмоциональная сверка` + `Взгляд на себя` buttons** | **→ Section 3 (Quick Mood Scan)** — rename via i18n, reflow into a single row |
| 5439–5482 | "Описание контура" panel (circuit title / subtitle / desc) | → Journey |
| 5484–5491 | `<PermissionWarningBanner>` (conditional) | Stays in place, top of home (functional UI, not lore) |
| 5491–5580 | Connection panel (tracker / Bluetooth / instructions, conditional) | Stays in place (functional UI, not lore) |
| **5582–5615** | **Biometric Hero** — 4 cards (Heart / Wind / Activity / Zap) + `<MetricsWaveform>` | **→ Section 1** — move to top of flow, no design change |
| 5617–5659 | "Part Progress" bar (`progress.level_progress`) — level-specific completion | → Journey *(see open question below)* |
| 5661–5699 | "Философский текст" (philosophy.level_X.text_1..5) | → Journey |
| 5701–~5990 | Stats modal trigger + watch activation prompt (largely conditional) | Stays in place (functional UI) |
| **6002–6171** | **Practices grid (12 cards, `currentCircuit.practices.map(...)`)** | **→ Section 5 (All Practices)** — move up, no design change |
| 6173–6188 | "Part info" button (jumps to addon page) | → Journey |
| 6190–6803 | Artifacts block (9 conditional artifact panels) | → Journey |

## Final order after reorder (commit #5b)

Inside the `max-w-6xl` container, the JSX flow becomes:

```
<Section 1: Biometric Hero>     ← from 5582–5615, moved up
<Section 2: Today's Practice>   ← NEW: TodaysPracticeStateCard + existing card for (C)
<Section 3: Quick Mood Scan>    ← from 5398–5437, restyled to one-row
<Section 4: Your Progress>      ← NEW: HRVMiniChart + streak/total from usePracticesProgress
<conditional PermissionWarningBanner>
<conditional Connection panel>
<conditional Stats / Watch activation prompts>
<Section 5: Practices grid>     ← from 6002–6171, untouched design
<Section 6: JourneyAccordion>   ← contains, in order:
  - logo (5180–5188)
  - chapter chip + dropdown (5190–5288)
  - level chip + dropdown (5289–5391)
  - quote (5392–5395)
  - circuit description panel (5439–5482)
  - philosophy text (5661–5699)
  - part info button (6173–6188)
  - artifacts (6190–6803)
  - [open question] Part Progress bar (5617–5659)
</Section 6>
```

## What gets removed entirely

- **Nothing currently visible.** The paywall `$` button (5050–5093) is
  already gated behind `{false && ...}`. I will delete the dead block
  in commit #5b to remove the eyesore from grep / search.
- The `hidden` top nav at 5095–5178 is similarly dead JSX (className
  includes "hidden"). I'll leave it alone in this commit — it's
  unrelated to the redesign, and deletion belongs in a separate cleanup.

## What gets newly inserted

| Where | What |
|---|---|
| Top of `max-w-6xl` flow | `<TodaysPracticeStateCard>` driven by `useTodaysPractice({ isWatchConnected: watchHeartRate.isConnected, freePracticeIds: [...FREE_PRACTICE_IDS] })`. When state==='recommended' we render the existing per-practice card markup (the same JSX used inside the 12-card grid) with the picked id — *not* a new component. |
| Section 4 slot | `<HRVMiniChart>` + a streak/total line using `usePracticesProgress(practiceHistory)` |
| Bottom of flow (just before `</div>` at 6804) | `<JourneyAccordion>` wrapping the lore blocks |

## Hardcoded non-English strings to replace via i18n (out of scope of Journey)

Grep for the literal strings still visible OUTSIDE the JourneyAccordion
content after the reorder. Inside Journey we leave the strings alone —
they're already on i18n keys (`chapters.*`, `quote_level_*`, `circuits.*`,
`philosophy.*`) and EN values will fill in via the existing locale file.

Identified surface strings that need verification (most are already
`t(...)` calls, but I'll double-check each during 5b):

- `nav.emotional_check` → already i18n. EN value needs to be `Voice Check`.
- `eye_scan.nav_button` → already i18n. EN value needs to be `Face Check`.
- `settings.bpm`, `settings.br_unit`, `settings.stress_label`,
  `settings.energy_label` → already i18n. Just verify EN values are
  `BPM`, `/min`, `Stress`, `Energy` (already correct based on
  `t('...', 'BPM')` default-value fallbacks).
- `progress.level_progress`, `progress.practices` → already i18n. EN ok.

So almost no string changes — most labels are already keyed. The two
that need EN-value updates (not new keys) are `nav.emotional_check`
and `eye_scan.nav_button`.

## Open questions for the user before 5b

1. **"Part Progress" bar (5617–5659)** — this shows
   `{completedCount}/{totalPractices} practices` for the *current
   level*. It's level-specific, not lifetime. Two options:

   - **(a)** Move it inside Journey. The lifetime streak/total in
     Section 4 (`Your Progress`) is the new at-a-glance metric; the
     per-level bar belongs with the lore + level navigation.
   - **(b)** Drop it entirely. Users get streak + total + visible
     `completed/12` badges on each practice card anyway.

   Default: **(a)**. Confirm or pick (b).

2. **EN values for the two existing keys** in
   `public/locales/en/translation.json`:

   - `nav.emotional_check` → currently presumably `"Emotional check"`
     or similar. Change to **`Voice Check`**?
   - `eye_scan.nav_button` → currently `"A look at yourself"`. Change
     to **`Face Check`**?

   These keys are also used in other places (e.g. eye-scan title) so
   I'll verify the change doesn't break unrelated UI. If `eye_scan.
   nav_button` IS reused as the screen title inside the eye-scan
   modal too, I'll need a separate key for the home button — flag
   me if you want that pre-empted now.

3. **Today's Practice (C) state — visual** — when the state machine
   returns a `recommendedPracticeId`, do you want the card to be:

   - **(c.1)** A clone of one of the existing 12 cards (so it looks
     identical to a practice in the grid) — risk: duplication weight,
     same card appears twice on screen.
   - **(c.2)** A *simplified* version (just name + duration + Start
     button, no per-practice stats / expand-toggle / sessions etc.).

   Default: **(c.2)** — Section 2 is meant to be one fast tap, not a
   second copy of the full card. Confirm.

4. **Section 3 (Quick Mood Scan) heading**. The two existing buttons
   are full-width pills stacked vertically. Reflowing them into one
   row under a `Quick Mood Scan` header means each button becomes
   ~half-width. Are you OK with the visual density change, or would
   you rather keep them full-width stacked but just add the
   `Quick Mood Scan` header above?

Once you sign off on 1/2/3/4, I write commit #5b. Estimated diff:
~300 lines moved, ~80 lines new (Section 2 + Section 4 inline JSX),
~30 lines deleted (dead paywall $ button).
