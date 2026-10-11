# 7. Byline

The byline reads **“Editorial: ONDA Life (Yakiv Bilenko) · Sources checked: <date> · Updated <date>”** (localized in every language). There is no reviewer role on the site: no “reviewed by”, no expert or medical review, and no `reviewedBy` / `lastReviewed` in the JSON-LD (owner decision 2026-10-11).

| Field | Value | Who sets it |
|---|---|---|
| `editor` | `"Yakiv Bilenko"` on every page; shown as “Editorial: ONDA Life (Yakiv Bilenko)” | the author, as in the template |
| `reviewer` | always `null`. Kept in the schema for compatibility; never rendered. | — |
| `lastReviewed` | `null`; Yakiv sets the date (YYYY-MM-DD) when the sources were checked and the page accepted. Shown as “Sources checked: <date>”. | Yakiv only |

**Rules:**
- **Never invent a reviewer**, and never write “reviewed by”, “medically reviewed” or “expert-checked” anywhere.
- **The author does not sign as a scientist or clinician.** Mistral is not named on the page.
