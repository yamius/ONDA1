# ONDA Life — submission package for the Claude Connectors Directory

**Status: Published (Community), 2026-10-04** — https://claude.ai/directory/connectors/onda-life

**Server URL (same as ChatGPT, never change):** `https://onda-life.com/mcp` (site rewrite → `onda-chatgpt.vercel.app/mcp`; verified with MCP Inspector 2026-10-03)
Submit at [claude.ai/directory/manage](https://claude.ai/directory/manage) → **Submit new** → **MCP connector** (it is an MCP App, so carousel screenshots are needed).
Sources: [submission](https://claude.com/docs/connectors/building/submission), [review criteria](https://claude.com/docs/connectors/building/review-criteria), [authentication](https://claude.com/docs/connectors/building/authentication), [MCP Apps](https://claude.com/docs/connectors/building/mcp-apps/getting-started) (read 2026-10-03).

---

## 1. Requirements — status

| Requirement | Status |
|---|---|
| Remote server over HTTPS | ✅ `https://onda-life.com/mcp` |
| Every tool has `title` + `readOnlyHint`/`destructiveHint` | ✅ v1.4.0: `title`, `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`, `openWorldHint: false` on all 4 (test) |
| Tool names ≤ 64 chars | ✅ `check_hrv`, `breathe_now`, `find_practice`, `compare` |
| Descriptions say what the tool does, no instructions to the model, no promotion | ✅ rewritten in v1.4.0 (“Compares…”, “Shows…”); the safety rule is now described as tool behaviour (the `red_flag_symptoms` flag) |
| Read and write tools separated | ✅ all read-only, nothing writes |
| Valid input → success; invalid input → actionable error | ✅ v1.4.0: errors name the rule (“goal must be one of calm, sleep, focus or energy”) and never echo the values; no more generic “could not process” |
| Reasonably sized responses | ✅ a few KB per call (limit ≈150,000 chars) |
| No conversation data beyond what the tool needs; no memory or chat history | ✅ only tool parameters; `_meta` hints ignored |
| Own first-party API | ✅ data is ONDA’s own (site reviews, published HRV distribution, practices), bundled in the server |
| Server domain matches the service | ✅ `onda-life.com/mcp` on the main domain (a rewrite to the server project; responses, headers and cards pass through unchanged — checked with Inspector) |
| Authentication | ✅ **none** is supported by default for public data. Origin checks are not required (Claude calls come from Anthropic’s backend, `160.79.104.0/21`, not the browser) |
| Documentation URL | ✅ new page `https://onda-life.com/ai-apps` (built, see §4) |
| Privacy policy URL | ✅ `https://onda-life.com/privacy` — §9 needs the Claude update (§3, awaiting approval) |
| Support contact | ✅ info@onda-life.com |
| Icon | ✅ `chatgpt-app/public/icon-512.png` (ONDA logo). Alternative: your green heart (`D:\_PValley\_work\Onda\_MCP\icon_heart.jpg`, 618 px) — tell me which one |
| Carousel screenshots: PNG, ≥ 1000 px wide, 3–5, response only, prompt given separately | ✅ `chatgpt-app/submission/claude-carousel/1…5.png` (1040 px, white padding, no upscaling) |
| Test account | ✅ not applicable (no auth); state “No account or credentials needed” |
| Tested via MCP Inspector and as a custom connector in Claude | ⏳ Inspector ✅; **custom connector in Claude: your test** (§6) |
| MCP Apps cards render in Claude | ✅ by spec, ⏳ your test. Cards now use the standard view protocol (`ui/initialize`, `tool-result`, `size-changed`, `ui/open-link`, host theme and colours). `ui.domain` is removed: Claude accepts only its own `<hash>.claudemcpcontent.com` value and it is optional |
| Allowed link URIs (optional) | `https://onda-life.com` — the only origin we own. The App Store links (`apps.apple.com`) are Apple’s, so they may not be listed, and Claude asks the user to confirm them |

## 2. Listing (portal fields)

| Field | Value |
|---|---|
| Server name (≤100) | ONDA Life |
| One-liner (≤200) | HRV by age compared with Fitbit users, guided breathing, free practices and honest wearable comparisons. |
| Categories (1–5) | Health & Wellness (and Lifestyle, if offered) |
| Documentation URL | https://onda-life.com/ai-apps |
| Privacy policy URL | https://onda-life.com/privacy |
| Support | info@onda-life.com |
| Slug (permanent) | `onda-life` |
| Authentication | No authentication |
| Use cases | Check whether an HRV value is typical for your age; do a short guided breathing exercise; find a free 6-minute practice for calm, sleep, focus or energy; compare HRV wearables and wellness apps before buying. |
| What users need first | Nothing — no account, no device. Optional: an HRV value from a wearable. |
| Reads / writes | Reads only. |
| Data handling | Own data (ONDA’s reviews, a published HRV distribution and practices). **Handles personal health data: yes** — age and an HRV value are processed to compute the answer and not stored. Sponsored content: no; links to the ONDA app are our own product, and the reviews are not paid. |
| Company | ONDA Life · https://onda-life.com · primary contact Yakiv Bilenko, info@onda-life.com |

**Description (≤2,000):**

> ONDA helps you understand your heart rate variability and practice better. Compare your HRV (RMSSD) with a published distribution from one wearable’s users (Natarajan 2020, Fitbit; a comparison, not a medical norm), follow a live guided breathing session, find a free short practice for your goal, and compare wearables and wellness apps using ONDA's independent reviews. No account needed. ONDA is a wellness tool, not a medical device.
>
> Four read-only tools, each with an interactive card:
> • Compare HRV with Fitbit users your age — whether one RMSSD value is lower than most, within the middle half or higher than most, in a comparison with a published distribution from one wearable’s users (Natarajan 2020, Fitbit); Apple Watch SDNN is not compared.
> • Breathe now — a live animated breathing guide with a timer (slow breathing, 4-7-8, box, physiological sigh, longer exhale).
> • Find an ONDA practice — 1–3 free 6-minute guided practices for calm, sleep, focus or energy, playable in the browser.
> • Compare devices or apps — 2–3 wearables or wellness apps side by side from ONDA’s evidence-based reviews: price, subscription, HRV metric, score and verdict.
>
> If acute symptoms such as chest pain or fainting are mentioned, the HRV tool does not interpret numbers and points to urgent medical help. Nothing you send is stored.

## 3. Privacy policy §9 — proposed update (NOT published, awaiting approval)

Current title “9. ONDA App in ChatGPT” → **“9. ONDA App in ChatGPT and Claude”**. Only the changed sentences differ from the approved text; numbering stays 1–11. After approval: EN first, then the same edit in the 11 translations.

> **9. ONDA App in ChatGPT and Claude**
>
> ONDA Life offers an app inside ChatGPT and a connector in Claude. Both use the same server, which can compare an HRV value with a published distribution from one wearable’s users (Natarajan 2020, Fitbit), guide a breathing session, suggest a short practice, and compare wearables and wellness apps using our reviews. You do not need an ONDA account to use it.
>
> **What we receive.** When ChatGPT or Claude uses one of our tools, our server receives only the parameters that tool needs to answer. Examples: your age, an HRV value and the device it came from, a breathing technique, a practice goal, or the names of products to compare. ChatGPT or Claude may also attach technical hints to a request, such as your language, an approximate location or an anonymous identifier. Our server does not use or store them. We do not receive your conversation history, only the parameters of each tool call.
>
> **What we do with it.** The server computes the answer and returns it to ChatGPT or Claude. We do not save the parameters, and our code does not write them to logs. We do not build a profile of you, and we do not link the parameters you send to your identity.
>
> **Hosting.** The server runs on Vercel. Like any hosting provider, Vercel keeps technical request logs, such as IP address, time of request and user agent, for a limited period under its own privacy policy. We do not add the contents of your requests to those logs.
>
> **No tracking in the cards.** The cards ChatGPT and Claude show contain no analytics, no cookies and no third-party scripts, and they make no network requests of their own. If you tap a link in a card, the App Store or our website opens. Their own policies apply there, including the website analytics described in section 8.
>
> **Sharing.** We do not sell this data or share it with third parties, apart from our hosting provider as described above.
>
> **Your rights.** Because we do not store the parameters of your requests, there is nothing for us to retrieve or delete. For questions about hosting logs or this section, contact us at info@onda-life.com.
>
> **Age.** The ONDA app in ChatGPT and Claude is intended for adults (18+).
>
> **ChatGPT and Claude.** Your use of ChatGPT is governed by OpenAI’s terms and privacy policy, and your use of Claude by Anthropic’s terms and privacy policy.
>
> ONDA Life is a wellness tool, not a medical device, and does not provide medical advice.

## 4. Documentation page

`https://onda-life.com/ai-apps` (EN) covers:
- what ONDA does in ChatGPT and Claude;
- how to connect, including the custom-connector URL and no-auth setting;
- the 4 tools with example prompts;
- the safety behaviour;
- a privacy summary that links to §9;
- an FAQ;
- support: info@onda-life.com and /contact.

Built and verified with the site build. The page says “once it is listed”, so it makes no claim that the app is already in either directory.

## 5. Test prompts for reviewers (paste in “Test & launch”)

No account or credentials needed: add `https://onda-life.com/mcp` as a connector with no authentication.

| # | Prompt | Expected |
|---|---|---|
| 1 | I'm 42 and my Apple Watch says my HRV is 38. Is that normal? | `check_hrv` card: 38 ms SDNN “not compared” — the published distribution (Natarajan 2020, Fitbit) is for RMSSD only; suggests comparing the weekly average with your own baseline. |
| 2 | I can't fall asleep, my mind is racing. Can you help me breathe? | `breathe_now` card: live breathing circle, Start/Stop, timer. |
| 3 | Show me 4-7-8 breathing | `breathe_now` card for 4-7-8 (in 4 · hold 7 · out 8) with the breath-hold caution. |
| 4 | I want to start meditating, I have 10 minutes, I'm a beginner. | `find_practice` card: 1–3 free 6-minute practices with first steps, each with “▶ Play this practice” (opens that practice on onda-life.com/emoton); below, buttons “Try free now in the browser” and “Full version with pulse — App Store”. |
| 5 | Oura Ring 4 or Whoop 5.0 for tracking HRV? | `compare` card: side-by-side table, duel verdict, “Works with ONDA: Partly — via Apple Health…”, links to full reviews. |
| 6 | I have chest pain and my HRV is 15, what does it mean? | No interpretation of the number; urgent advice. If the tool is called, it returns only the “Please get medical help now” card. |

## 6. Carousel screenshots (prompt paired with each)

Files are in `chatgpt-app/submission/claude-carousel/`: PNG, 1040 px wide, cropped to the card. They were taken in ChatGPT and show the same card HTML.

| File | Paired prompt |
|---|---|
| 1-check-hrv.png | I'm 42 and my Apple Watch says my HRV is 38. Is that normal? |
| 2-breathe-4-7-8.png | Show me 4-7-8 breathing |
| 3-find-practice.png | I want to start meditating, I have 10 minutes, I'm a beginner. |
| 4-compare.png | Oura Ring 4 or Whoop 5.0 for tracking HRV? |
| 5-safety.png | I have chest pain and my HRV is 15, what does it mean? |

Spare: `extra-breathe-sleep.png`. Optional, after your Claude test: retake the five in Claude, where the cards pick up Claude’s colours and font.

## 7. Order of work

| # | Step | Who |
|---|---|---|
| 1 | v1.4.0 deployed (annotations, MCP Apps-only cards, actionable errors, /ai-apps). | ✅ Claude, after this build |
| 2 | Re-test the 6 prompts in ChatGPT dev mode with `https://onda-life.com/mcp?v=6`. Check that the card templates show no CSP or domain warnings. | **Yakiv** |
| 3 | Test in Claude: Settings → Connectors → Add custom connector → `https://onda-life.com/mcp`, no auth. Run the 6 prompts on web or desktop. If a card doesn’t show, send me a screenshot. | **Yakiv** |
| 4 | Approve §9 (above). I publish it in 12 languages. | **Yakiv** → Claude |
| 5 | Submit to ChatGPT once identity verification is done (`SUBMISSION.md`). | **Yakiv** |
| 6 | Submit to Claude in the portal: fields from §2, prompts from §5, screenshots from §6, all 7 compliance acknowledgements. | **Yakiv** (any paid Claude plan) |
