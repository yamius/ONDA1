# 7. Byline

| Field | Value | Who sets it |
|---|---|---|
| `editor` | `"Yakiv Bilenko"` on every page; shown as “Yakiv Bilenko — editor” | the author, as in the template |
| `reviewer` | `null`. It becomes `"Valentin Zhigulin"` **only** when he has actually read this page. | Yakiv only |
| `lastReviewed` | `null`; Yakiv sets the date (YYYY-MM-DD) when the page is accepted | Yakiv only |

**Rules:**
- **Never invent a reviewer**, and never write “reviewed by”, “medically reviewed” or “expert-checked” in the body.
- **The author does not sign as a scientist or clinician.** Mistral is not named on the page.
- **“Reviewed by” appears only when `reviewer` is set**, and the page renders it from the frontmatter.
- **When a reviewer reads a later version,** Yakiv updates `lastReviewed`. If the page changes materially after review, `reviewer` stays only once he has re-read it.
