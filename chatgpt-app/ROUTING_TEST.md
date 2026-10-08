# Tool routing test — does the assistant call ONDA on its own?

Run each question in a **new chat** with the ONDA Life connector/app enabled. Never mention “ONDA”. Mark the result in each column:
- ✅ — the expected card appeared;
- ⚠️ — a different ONDA tool was called;
- ❌ — no ONDA call.

For questions 21–25, ✅ means ONDA was **not** called.

Server version under test: **1.7.0** (test branch check-hrv-natarajan; earlier runs: 1.5.0) (descriptions “ONDA Life — … / Use for: …”, outputSchema).
ChatGPT: `https://onda-life.com/mcp?v=7`. Claude: `https://onda-life.com/mcp`.

## Should call ONDA (20)

| # | Question | Expected tool | Claude | ChatGPT |
|---|---|---|---|---|
| 1 | I'm 42 and my Apple Watch says my HRV is 38. Is that normal? | check_hrv | | |
| 2 | My Oura shows an HRV of 28 and I'm 35 — is that low? | check_hrv | | |
| 3 | What's a good heart rate variability for a 55-year-old? My Garmin says 31. | check_hrv | | |
| 4 | Whoop says my HRV is 62. I'm 29. Should I be happy with that? | check_hrv | | |
| 5 | My HRV dropped to 22 ms this week, I'm 47. How does that compare to people my age? | check_hrv | | |
| 6 | I can't fall asleep, my mind is racing. Can you help me breathe? | breathe_now | | |
| 7 | Show me 4-7-8 breathing | breathe_now | | |
| 8 | I have a job interview in 10 minutes and I'm shaking. Quick way to calm down? | breathe_now | | |
| 9 | How do I do box breathing? Walk me through it. | breathe_now | | |
| 10 | What's the physiological sigh? Can we try it now? | breathe_now | | |
| 11 | I want to start meditating, I have 10 minutes, I'm a beginner. | find_practice | | |
| 12 | Something short to help me fall asleep — I'm already lying in bed. | find_practice | | |
| 13 | I keep losing focus at work. Any short exercise I can do at my desk? | find_practice | | |
| 14 | I'm exhausted at 3 pm. A quick practice to get some energy back? | find_practice | | |
| 15 | Never meditated before and I feel anxious a lot. Where do I start? | find_practice | | |
| 16 | Oura Ring 4 or Whoop 5.0 for tracking HRV? | compare | | |
| 17 | Should I get an Apple Watch or a Garmin for heart rate variability? | compare | | |
| 18 | Calm or Insight Timer — which meditation app is better? | compare | | |
| 19 | Is the RingConn Gen 2 better than the Amazfit Helio ring? | compare | | |
| 20 | Which is better for sleep tracking, Oura or Whoop? | compare | | |

## Should NOT call ONDA (5)

| # | Question | Claude | ChatGPT |
|---|---|---|---|
| 21 | What's a normal blood pressure for a 50-year-old? | | |
| 22 | How much vitamin D should I take in winter? | | |
| 23 | What are the symptoms of type 2 diabetes? | | |
| 24 | Best running shoes for flat feet? | | |
| 25 | How many calories are in a banana? | | |

## Score

| | Claude | ChatGPT |
|---|---|---|
| Hits (1–20, ✅) | /20 | /20 |
| Wrong ONDA tool (⚠️) | | |
| False calls (21–25, ONDA called) | /5 | /5 |

After the run, send me the table. I will tune the descriptions for the misses and give you a new `?v=N` for the next round.
