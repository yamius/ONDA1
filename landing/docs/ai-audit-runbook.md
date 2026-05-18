# AI / GEO Visibility Audit — Runbook

> Operational handoff for the AI-search visibility audit. Pick this up in any
> session — everything needed to run, interpret, and act on it lives below.

## What this is

`landing/scripts/ai-audit.mjs` sends a fixed set of biohacking / neuroscience
seed prompts to AI answer engines and records, per prompt, whether ONDA Life
is **cited** (onda-life.com surfaced), **mentioned** (brand named, no link),
or **absent**.

This is the feedback loop for the GEO work — FAQ schema, `llms.txt`, the RAG
corpus, internal linking. Those investments are bets that AI engines will
surface ONDA; this audit measures whether the bet is paying off.

Output:
- `landing/ai-audit/latest.md` — human summary + the list of "gap" prompts
  where ONDA was absent (the queries to target next).
- `landing/ai-audit/history.jsonl` — one line per provider per run, for
  trend tracking over time.

## Providers (optional, key-gated)

The script is **skip-without-key**: with no keys it prints a notice and exits
0. Set whichever keys you have as environment variables:

| Provider | Env var | Signal |
|---|---|---|
| Perplexity | `PERPLEXITY_API_KEY` | Live AI search with citations — the primary, highest-signal source. |
| OpenAI | `OPENAI_API_KEY` | Model brand-knowledge baseline (no live web) — does the model itself know ONDA. |

Perplexity is the one that matters most: it is an AI *search* engine, so a
citation there is the real GEO win. OpenAI without web search only reflects
whether ONDA has entered model training data — a slower, longer-term signal.

### Getting keys

- Perplexity: <https://www.perplexity.ai/settings/api> — pay-as-you-go, cheap
  (~$1 buys hundreds of `sonar` calls). One run ≈ 30 calls.
- OpenAI: <https://platform.openai.com/api-keys> — `gpt-4o-mini` is used; one
  run ≈ 30 cheap calls.

## How to run

```bash
PERPLEXITY_API_KEY=pplx-xxxx npm --prefix landing run audit:ai
```

or with both:

```bash
PERPLEXITY_API_KEY=pplx-xxxx OPENAI_API_KEY=sk-xxxx npm --prefix landing run audit:ai
```

The script paces calls at ~1.2 s each (≈40 s per provider) to stay under rate
limits. It is **not** part of `npm run build` — run it on demand.

## Interpreting the output

`visibility %` = (cited + mentioned) / (prompts that did not error).

Reasonable trajectory for a young site:
- Month 1–2: near 0% cited on Perplexity is normal — domain authority is low.
- The first wins usually come on **specific / long-tail prompts** (e.g. "what
  is neuroception", "resonant frequency breathing 0.1 Hz"), not head terms
  ("how to improve HRV").
- Track the `history.jsonl` trend, not a single run. A rising `cited` count is
  the goal.

### Acting on the gap list

`latest.md` lists every prompt where ONDA was absent. For high-value gaps:
- Confirm there is an article/glossary page that genuinely answers the prompt.
- If yes but not surfaced → strengthen it: FAQ block matching the prompt
  phrasing, internal links, a direct answer in the first paragraph.
- If no page answers it → that is a content gap worth a new article.

## Cadence

Monthly is enough — GEO moves slowly. Keep every `history.jsonl` line; the
trend across months is the real signal.

## Related files

- `landing/scripts/ai-audit.mjs` — the script (seed prompts are inline at the
  top — edit the `SEED_PROMPTS` array to change coverage).
- `landing/ai-audit/latest.md` + `history.jsonl` — output.
- `landing/docs/gsc-audit-runbook.md` — the sibling Google Search Console
  coverage audit.
