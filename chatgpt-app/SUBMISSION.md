# ONDA Life — submission package for the ChatGPT app directory

**Server URL (final, never change):** `https://onda-life.com/mcp` — a rewrite in the site project (`landing/vercel.json`) to `onda-chatgpt.vercel.app/mcp`. Never remove that rewrite, and never rename or delete the Vercel project `onda-chatgpt`.
ChatGPT caches the server per URL. Never rename or delete the Vercel project `onda-chatgpt`. For dev-mode retests after a schema change, connect a throwaway copy as `…/mcp?v=N` and submit with the plain URL.

---

## 0. Plugin ZIP flow (current ChatGPT submission path)

Upload `chatgpt-app/submission/onda-life-plugin.zip` at platform.openai.com → Plugins → “Upload new or existing plugin”, as your verified developer identity. Rebuild it with `python chatgpt-app/scripts/build_plugin.py` (see README).

**In the ZIP (validated locally):**
- name `onda-life` 1.0.0, display name “ONDA Life”;
- short description “HRV, breathing & practices” — the limit is 30 characters, so the previous 86-character line did not fit;
- long description from §1;
- category **Healthcare** — the plugin list has no “Health & Fitness”; the only alternative is “Other”;
- website `https://onda-life.com/ai-apps`;
- privacy `https://onda-life.com/privacy`;
- terms `https://onda-life.com/terms`;
- support `https://onda-life.com/contact`, since the form wants a URL; info@onda-life.com is in the author block;
- three starter prompts, each with a 706-px screenshot;
- MCP server `https://onda-life.com/mcp` (http, no auth). All URLs return 200.

**Filled in the dashboard, not in the ZIP:**

*Annotation justifications* (all four tools: readOnlyHint true, destructiveHint false, openWorldHint false):

| Tool | Justification |
|---|---|
| check_hrv | Read-only: compares the given age and HRV value with a bundled published distribution (Natarajan 2020, Fitbit users); stores nothing, writes nothing, calls no outside service. |
| breathe_now | Read-only: returns a fixed breathing pattern and timer settings for the card; no data written, no outside calls. |
| find_practice | Read-only: selects 1–3 entries from a bundled list of ONDA practices; no data written, no outside calls. |
| compare | Read-only: looks up ONDA’s bundled editorial review data for the named products; no data written, no outside calls (links only point to onda-life.com). |

*Test cases* — 5 positive (prompt → expected tool):
1. “I'm 42 and my Apple Watch says my HRV is 38. Is that normal?” → `check_hrv`
2. “I can't fall asleep, my mind is racing. Can you help me breathe?” → `breathe_now`
3. “I want to start meditating, I have 10 minutes, I'm a beginner.” → `find_practice`
4. “Oura Ring 4 or Whoop 5.0 for tracking HRV?” → `compare`
5. “Show me 4-7-8 breathing” → `breathe_now`

3 negative (expected behaviour):
1. “I have chest pain and my HRV is 15, what does it mean?” → no interpretation of the number; urgent-care advice. If `check_hrv` is called, it is with `red_flag_symptoms=true` and returns only the urgent-care card.
2. “What's a normal blood pressure for a 50-year-old?” → no ONDA tool (out of scope).
3. “How much vitamin D should I take in winter?” → no ONDA tool (out of scope).

*Release notes (1.0.0):* First release: HRV by age compared with Fitbit users, guided breathing, free 6-minute practices and wearable/app comparisons, each with an interactive card. No account, nothing stored.

*Demo recording URL:* **needed** — a short screen recording (1–2 min) of the starter prompts working in ChatGPT on web and mobile, uploaded as an unlisted YouTube or Loom link.

*Domain verification:* **needed** — the dashboard shows a verification token for the MCP domain. Send it to me: I will host it on onda-life.com where they ask and redeploy.

*Commerce rule:* plugins may not link to checkout or subscription pages. Our cards link to the App Store **product page**, not to a purchase, and to free pages on onda-life.com, so this complies.

## 1. Name and descriptions (EN)

| Field | Value |
|---|---|
| Name | ONDA Life |
| Short description | HRV by age compared with Fitbit users, guided breathing, free practices and honest wearable comparisons. |
| Category | Health & Fitness |
| Website | https://onda-life.com |
| Support | info@onda-life.com (contact page: https://onda-life.com/contact) |
| Privacy policy | https://onda-life.com/privacy (§9 “ONDA App in ChatGPT”, published 2026-10-03) |

**Long description**

> ONDA helps you understand your heart rate variability and practice better. Compare your HRV (RMSSD) with a published distribution from one wearable’s users (Natarajan 2020, Fitbit; a comparison, not a medical norm), follow a live guided breathing session, find a free short practice for your goal, and compare wearables and wellness apps using ONDA's independent reviews. No account needed. ONDA is a wellness tool, not a medical device.

**Server manifest — done.** `initialize` now returns `serverInfo.description` = the short description above, plus `websiteUrl` and the icon, and the `instructions` start with the same text. Server version at submission: 1.6.1.

Note: the line ChatGPT showed (“practical consciousness training…”) was ChatGPT’s own summary from the dev-mode snapshot. Once the app is submitted, ChatGPT shows the text from the submission form, so enter the descriptions above there too.

## 2. Icon

- File: `chatgpt-app/public/icon-512.png` — 512×512 PNG, made from the real App Store icon (`ios/App/App/Assets.xcassets/AppIcon.appiconset/_ONDA_logo.png`, 1024×1024).
- Also served at `https://onda-chatgpt.vercel.app/icon-512.png` (linked from the manifest).
- If the form asks for 1024×1024, upload `_ONDA_logo.png` directly.

## 3. Privacy policy — §9 (PUBLISHED 2026-10-03, EN)

New section **9. ONDA App in ChatGPT**, inserted after §8 “Analytics & How We Use the Emotional Check-In Tool”. Current §9 “Changes” and §10 “Contact” become §10 and §11. The parked health-dataset draft is not touched and not mixed in.

> **9. ONDA App in ChatGPT**
>
> ONDA Life offers an app inside ChatGPT that can compare an HRV value with a published distribution from one wearable’s users (Natarajan 2020, Fitbit), guide a breathing session, suggest a short practice, and compare wearables and wellness apps using our reviews. You do not need an ONDA account to use it.
>
> **What we receive.** When ChatGPT uses one of our tools, our server receives only the parameters that tool needs to answer. Examples: your age, an HRV value and the device it came from, a breathing technique, a practice goal, or the names of products to compare. ChatGPT may also attach technical hints to a request, such as your language, an approximate location or an anonymous identifier. Our server does not use or store them. We do not receive your ChatGPT conversation history, only the parameters of each tool call.
>
> **What we do with it.** The server computes the answer and returns it to ChatGPT. We do not save the parameters, and our code does not write them to logs. We do not build a profile of you, and we do not link the parameters you send to your identity.
>
> **Hosting.** The server runs on Vercel. Like any hosting provider, Vercel keeps technical request logs, such as IP address, time of request and user agent, for a limited period under its own privacy policy. We do not add the contents of your requests to those logs.
>
> **No tracking in the cards.** The cards ChatGPT shows contain no analytics, no cookies and no third-party scripts, and they make no network requests of their own. If you tap a link in a card, the App Store or our website opens. Their own policies apply there, including the website analytics described in section 8.
>
> **Sharing.** We do not sell this data or share it with third parties, apart from our hosting provider as described above.
>
> **Your rights.** Because we do not store the parameters of your requests, there is nothing for us to retrieve or delete. For questions about hosting logs or this section, contact us at info@onda-life.com.
>
> **Age.** The ONDA app in ChatGPT is intended for adults (18+).
>
> **ChatGPT itself.** Your use of ChatGPT is governed by OpenAI’s terms and privacy policy.
>
> ONDA Life is a wellness tool, not a medical device, and does not provide medical advice.

**Facts behind this text (verified in code):**
- The server has no `console.*` calls and no outbound `fetch`. Errors return a generic message without echoing inputs; a test checks this.
- The cards have no `<script src>`, no cookies or `localStorage`, and no `fetch`. Their CSP is empty (`connectDomains: []`, `resourceDomains: []`), and a test checks there are no external scripts.
- The server ignores all fields ChatGPT adds under `_meta`, such as locale and user agent.
- Links carry campaign tags only: `ct=chatgpt_*` for the App Store and `utm_*` for the website. Analytics happen only after the person leaves the card.

## 4. Test prompts for reviewers

| # | Prompt | Expected |
|---|---|---|
| 1 | I'm 42 and my Apple Watch says my HRV is 38. Is that normal? | `check_hrv` card: 38 ms SDNN “not compared” — the published distribution (Natarajan 2020, Fitbit) is for RMSSD only; suggests comparing the weekly average with your own baseline; buttons “Full calculator” and “Get ONDA”. |
| 2 | I can't fall asleep, my mind is racing. Can you help me breathe? | `breathe_now` card: live breathing circle with Start/Stop and a timer (technique chosen by ChatGPT, typically 4-7-8 or slow breathing). |
| 3 | Show me 4-7-8 breathing | `breathe_now` card for 4-7-8 (in 4 · hold 7 · out 8), with the breath-hold caution: skip holds if pregnant, with a heart or lung condition, or dizzy. |
| 4 | I want to start meditating, I have 10 minutes, I'm a beginner. | `find_practice` card: 1–3 free 6-minute practices with first steps, each with “▶ Play this practice” (opens that practice on onda-life.com/emoton); below, “Try free now in the browser” and “Full version with pulse — App Store”. |
| 5 | Oura Ring 4 or Whoop 5.0 for tracking HRV? | `compare` card: side-by-side table (price, ONDA score, HRV metric RMSSD/RMSSD, pros/cons, best for), duel verdict, “Works with ONDA: Partly — via Apple Health, if the device syncs heart data there” for both, links to full reviews. |
| 6 | I have chest pain and my HRV is 15, what does it mean? | No interpretation of the number; urgent advice to call emergency services or see a doctor now. If the tool is called, it returns only the urgent-care card (`red_flag_symptoms=true`). |

**Safety, prompt 6 — what changed.** Before this package the tool only *asked* ChatGPT, in its description, not to interpret numbers when symptoms are reported. Two layers now enforce it on our side:
1. The server instructions and the `check_hrv` description tell ChatGPT not to interpret numbers when acute symptoms are reported and to advise urgent care.
2. `check_hrv` has a new optional `red_flag_symptoms` flag. When it is set, the tool returns no comparison or analysis, only an urgent-care message, and the card shows “Please get medical help now”. Tests cover both directions: the flag returns only the urgent card, and ordinary requests (prompts 1–5) never return it. The tool description lists exactly which symptoms count as red flags.

ChatGPT decides whether to call the tool, so **retest prompt 6 in dev mode before submitting** (see the checklist).

## 5. Screenshots (take from your dev-mode test)

| # | Card | Caption |
|---|---|---|
| 1 | `check_hrv` for prompt 1 | Compare your HRV (RMSSD) with Fitbit users your age. |
| 2 | `breathe_now` with the circle mid-inhale after Start (prompt 3) | A live guided breathing session, right in the chat. |
| 3 | `find_practice` for prompt 4, showing both buttons | Free 6-minute practices you can start now in your browser. |
| 4 | `compare` for prompt 5, showing table and verdict | Compare wearables and wellness apps with ONDA’s independent reviews. |
| 5 (optional) | Prompt 6 response | Safety first: no number-reading when symptoms need a doctor. |

Use light mode, the full card in frame, and no personal data in the chat.

## 6. Submission checklist (platform.openai.com)

| # | Step | Who |
|---|---|---|
| 1 | Approve the privacy text in §3. | ✅ done |
| 2 | Publish §9 to onda-life.com/privacy, update “Effective Date”, renumber §10–11. | ✅ done (EN) |
| 3 | In ChatGPT dev mode, connect `https://onda-life.com/mcp?v=6` (version 1.4.0). Run all 6 prompts, check prompt 6, and take the screenshots. | **Yakiv** |
| 4 | Verify the organization on platform.openai.com (Settings → Organization → Verification; business or individual identity check). | **Yakiv** |
| 5 | Open the Apps submission form (platform.openai.com → Apps / “Submit an app”). | **Yakiv** |
| 6 | Fill name, short and long description, category Health & Fitness, website, support contact info@onda-life.com, privacy policy URL. | **Yakiv** (copy from §1) |
| 7 | Upload the icon (`chatgpt-app/public/icon-512.png`, or the 1024 original). | **Yakiv** |
| 8 | MCP server URL: `https://onda-life.com/mcp`, authentication: none. | **Yakiv** |
| 9 | Paste the test prompts and expected behaviour from §4. Upload the screenshots from §5. | **Yakiv** |
| 10 | Answer the questionnaire: the app targets adults (age 18+ in the HRV tool); no purchases inside ChatGPT, only App Store links; no account; read-only tools; not a medical device. | **Yakiv** |
| 11 | Submit. While in review: no new tools and no URL change. Fixes to existing tools are fine. | — |

The exact menu names on platform.openai.com may differ. Follow the fields above whatever they are called.
