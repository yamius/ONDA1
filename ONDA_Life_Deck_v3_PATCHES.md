# ONDA Life Deck v3 → v3.1 — Designer Patch Sheet

> Drop-in text replacements for the 4 inconsistencies flagged in the
> review of `_2_ONDA_Life_Technical_Architecture_&_Product_Ecosystem.pdf`.
> Each patch is independent — apply in any order. No layout changes
> required; only text content inside existing slide containers.

---

## PATCH 1 — Slide 15 (Technical Roadmap) — CRITICAL

**Reason:** Middle column currently lists Eye-Scan + multi-sensor fusion
as future capabilities, contradicting slides 5, 8 and 12 where they are
already presented as shipping. Replacing with a credible *extension* of
the shipped Eye-Scan removes the conflict and adds a grant-relevant
clinical-validation angle.

### BEFORE — middle column

> **Advanced Biometric Fusion**
> MediaPipe eye-scan for ANS detection.
> Multi-sensor synchronization (Watch + BLE + Camera).

### AFTER — middle column (replace verbatim)

> **Eye-Scan v2: Longitudinal ANS Profiling**
> Multi-week baseline of pupil and blink dynamics per user.
> Anomaly detection: early-warning when ANS drifts off the personal norm.

### Optional title-bar tweak (whole slide)

If the deck owner wants to underline that this is *extension*, not
*delivery*, replace the slide title:

> **BEFORE:** *Technical Roadmap: AI Personalization & Advanced Biofeedback*
> **AFTER:** *Roadmap: Extending the Shipped Stack*

---

## PATCH 2 — Slide 10 (High-Level Architecture)

**Reason:** Notification Listener is the unique competitive moat surfaced
on the new Slide 8; it must also appear in the architecture diagram so
the picture is consistent.

### BEFORE — Android block

> **ANDROID (WEBVIEW + KOTLIN)**
> Kotlin Modules • Health Connect • BLE Manager • Foreground Service

### AFTER — Android block (replace verbatim)

> **ANDROID (WEBVIEW + KOTLIN)**
> Kotlin Modules • Health Connect • BLE Manager • Notification Listener • Foreground Service

*(If the existing layout fits only 4 items, drop "Foreground Service" —
Notification Listener is the more important novelty.)*

---

## PATCH 3 — Slide 11 (Mobile Tech Stack) — Android Native block

**Reason:** Same consistency fix. The Android Native bullet list does not
mention Notification Listener even though it is highlighted on Slide 8.

### BEFORE — Android Native (Kotlin) bullets

> • **Kotlin Modules:** Google Health Connect API
> • **BLE Manager:** Polar, Xiaomi, and chest-strap support
> • **Foreground Service:** Persistent HR tracking
> • **WebView Architecture:** Optimized for Android API 45+

### AFTER — Android Native (Kotlin) bullets (replace verbatim)

> • **Kotlin Modules:** Google Health Connect API
> • **BLE Manager:** Polar, Xiaomi, COROS, Garmin and generic GATT 5.0 straps
> • **Notification Listener:** HR ingestion from third-party fitness app notifications
> • **Foreground Service:** Persistent HR tracking during long practice sessions

*("WebView Architecture: Optimized for Android API 45+" can be dropped to
keep four bullets — API-version detail is not a differentiator and
"WebView" is implicit in the slide title.)*

---

## PATCH 4 — Slide 14 (Content Engine) — Counters row

**Reason:** Editorial reviews vertical (28 product reviews + 3
round-ups) is a shipped product line, mentioned in Slide 2's
"Personalization" pillar but missing from the Content Engine numbers.
Adding it on the counters row gives a fuller picture of the
content-marketing surface.

### BEFORE — counters row

```
   68              216              11             630+
ARTICLES      GLOSSARY TERMS    TOPIC HUBS    PRERENDERED URLS
```

### AFTER — counters row (replace verbatim)

```
   68          216           28           11           5            630+
ARTICLES   GLOSSARY      REVIEWS       TOPIC      LANGUAGES    PRERENDERED
              TERMS                     HUBS                       URLS
```

### Optional supporting line below counters

If the slide has room for a supporting caption, add:

> *Editorial vertical includes 28 hands-on / evidence-based reviews and
> 3 round-ups across HRV wearables, meditation apps and sleep apps.*

---

## PATCH 5 — Slide 12 (Biometric Core) — minor visual polish

**Reason:** Current 4-quadrant layout shows the four ingestion channels
as visually equal blocks with no flow direction toward the central
"ONDA BioOS / SENSOR FUSION" disc. Adding arrows turns it from a
catalogue into a system diagram.

### CHANGE — visual only (no text edit required)

Add a thin arrow from each of the four quadrants (Apple Ecosystem,
Android Ecosystem, BLE Peripherals, Eye-Scan CV) **pointing inward** to
the central "ONDA BioOS / SENSOR FUSION" disc.

If arrows are not feasible in the current template, add one caption
under the disc:

> *Four ingestion channels → one fused Stress, Energy and Life Rhythm signal.*

---

## SUMMARY — what the designer should ship

| # | Slide | Action | Effort |
|---|-------|--------|--------|
| **1** | 15. Roadmap | Replace middle column text | 1 min |
| **2** | 10. Architecture | Add "Notification Listener" to Android block | 1 min |
| **3** | 11. Mobile Tech Stack | Swap WebView line for Notification Listener | 1 min |
| **4** | 14. Content Engine | Add "28 Reviews" + "5 Languages" counters | 3 min |
| **5** | 12. Biometric Core | Add 4 inward arrows to central disc (visual) | 5 min |

**Total estimated work:** ~10 minutes. No new slides, no layout
restructuring, no new graphics beyond the 4 arrows in Patch 5.

---

## VERIFICATION CHECKLIST POST-PATCH

After applying, re-check the deck against these three consistency rules:

▸ **Rule 1 — Eye-Scan = SHIPPING.** Appears on slides 2, 5, 8, 12 as
  current capability. **No longer mentioned on slide 15 (Roadmap).**

▸ **Rule 2 — Notification Listener = visible in every Android context.**
  Listed on slides 8 (new), 10 (architecture), 11 (tech stack).

▸ **Rule 3 — Content Engine numbers = full picture.** Slides 2 and 14
  agree on the same set of content types (articles, glossary, reviews,
  hubs, languages, URLs).

When all three pass — deck is ready for Eurostar submission.

---

*Patch sheet generated 2026-05-20. Based on review of
`_2_ONDA_Life_Technical_Architecture_&_Product_Ecosystem.pdf` (833 KB,
13 content slides + title).*
