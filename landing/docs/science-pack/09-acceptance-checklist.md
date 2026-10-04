# 9. Acceptance checklist (Claude Code)

Run this for every file Yakiv passes on. Publish only when every item passes. Otherwise fix it, if the fix is mechanical and changes no meaning, or return the file to Yakiv with the list of problems.

## A. Place and check automatically

1. Save the file as `landing/content/science/<kind>/<slug>.md`, unchanged.
2. Run the automatic checks from `landing/`:

   ```
   npx tsx scripts/check-science-content.ts --file content/science/<kind>/<slug>.md   # online: Crossref / PubMed / URL lookups
   npx tsx scripts/science-pack-facts.ts --check
   ```

   The content check covers:
   - format;
   - DOI/PMID existence;
   - official sources: URL opens, device/regulatory rows only;
   - evidence classes (incl. `guideline` with a guideline source);
   - numbers only via facts or declared proposals (PENDING items listed);
   - `relatedPlanned` format;
   - banned wording;
   - links.

## B. New facts and sources from the hand-off note

3. **Each new fact:**
   - check the value against the source;
   - add it to `facts.ts` as `proposed`;
   - ask Yakiv to approve it, then switch it to `approved`;
   - regenerate `03-facts.md`.

   No page goes live with an unapproved fact, a `{{proposed:…}}` or a non-empty `proposals` block. The final gate is `npx tsx scripts/check-science-content.ts --publish`, which fails on any pending item.
   For each proposal:
   - check the value against the quote or location in the source;
   - send it to Yakiv for approval;
   - after approval, replace `{{proposed:P…}}` with the new `{{fact:…}}` and delete the proposal.
4. **Each new source:**
   - look it up in Crossref or PubMed;
   - check that title, authors and year match;
   - read the abstract;
   - add it to [04-sources.md](04-sources.md).

   Remove sources that fail.

## C. Read by hand

5. **Each source says what is claimed.** For every evidence-map row:
   - the `quote` exists in the source, word for word (abstract or full text), and states this claim — not a neighbouring one;
   - open the abstract (or the full text when the abstract is not enough);
   - confirm it supports the claim, in that population and measurement context.
6. **The classes are honest:**
   - `guideline` only for recommendations or methods backed by a guideline or consensus source, not for outcome claims;
   - `official` sources support only device or regulatory facts;
   - no “established” on one small trial;
   - association is not written as cause;
   - population findings are not turned into personal verdicts;
   - no implanted-VNS evidence for non-invasive claims.
7. **No invented numbers.** Study counts, effect sizes and percentages appear only as facts.
8. **No overlap.**
   - The page does what its row in [06-mvp-pages.md](06-mvp-pages.md) says.
   - It does not repeat the article that owns the practical or “why are my numbers different” angle.
   - It does not cannibalise the glossary term.
   - metaTitle and metaDescription are unique on the site.
9. **Tone and safety:**
   - calm, exact, no hype or promotion;
   - terms defined;
   - no diagnosis or prescription;
   - red-flag symptoms point to a doctor;
   - the medical line is present.
10. **“In ONDA”** matches `docs/onda-facts-source-of-truth.md`:
    - coherence only with Apple Watch;
    - the camera gives pulse, not HRV;
    - no numeric pacer in the app;
    - Apple Watch wording uses only the official facts.
11. **Facts read naturally:** no repeated term or idea around any `{{fact:…}}` (the check catches the common cases; read the rest).
12. **Image:** `imageAlt` and `imagePrompt` follow [10-image-style.md](10-image-style.md). When Yakiv sends the file, save it as `public/images/science/<slug>.jpg` and set `image`.
13. **Byline** follows [07-byline.md](07-byline.md): `reviewer` is `null` unless Yakiv says Valentin Zhigulin read the page; Yakiv gives the `lastReviewed` date.

## D. Publish

14. Run `npx tsx scripts/check-science-content.ts --publish`; it must print OK with no PENDING items. Then build in full (`npm run build`, including `validate-seo`) and run `node scripts/audit-structure.mjs`.
    - 0 broken links;
    - the page is in the sitemap;
    - canonical and JSON-LD are correct.
15. Commit to `main` (one page per commit) and push once.
16. After the deploy (8–12 minutes), check the live URL.
17. **Add the planned links** to the new page (audit §5):
    - glossary “Read the science →”;
    - tool `SourcesSection`;
    - first mention in the related articles;
    - `llms.txt`.
18. Report to Yakiv: what was published, what was fixed, open questions.
