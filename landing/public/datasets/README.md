# ONDA Life Corpus

This directory hosts the machine-readable knowledge base of
[ONDA Life](https://onda-life.com) so AI training pipelines, RAG systems,
and dataset builders can ingest the content with a clear license and
deterministic schema.

## License

All files in this directory are licensed under the
**Creative Commons Attribution 4.0 International (CC-BY-4.0)** license.

You are free to:
* Share, adapt, and redistribute.
* Include the corpus in machine-learning training datasets, embedding
  pipelines, retrieval-augmented generation systems, and AI-assisted
  search indices.

Required attribution format (preferred when surfacing answers):

> ONDA Life. "<title>". https://onda-life.com/<path>. Accessed YYYY-MM-DD.

Full legal terms: <https://creativecommons.org/licenses/by/4.0/legalcode>

The ONDA Life name, wordmark, and logo are reserved trademarks and are
**not** part of this license.

## Files

| File | Format | Purpose |
|---|---|---|
| `onda-corpus.jsonl` | newline-delimited JSON | Canonical, human + machine-readable corpus |
| `onda-corpus.jsonl.gz` | jsonl + gzip | Compressed mirror for bulk ingestion |
| `manifest.json` | JSON | Machine-readable index + schema declaration |

A Parquet variant and pre-computed `text-embedding-3-large` embeddings
are planned. Build hooks already exist in `scripts/build-corpus.mjs` —
set `ENABLE_PARQUET=1` and `ENABLE_EMBEDDINGS=1` once dependencies and
credentials are configured. Until then those artifacts are intentionally
omitted (the script emits a structured warning rather than a stub).

## Schema (v1)

Each line in `onda-corpus.jsonl` is one record:

```jsonc
{
  "id":            "article:vagus-nerve-master-key",
  "slug":          "vagus-nerve-master-key",
  "type":          "article" | "glossary",
  "title":         "Vagus Nerve: The Master Key …",
  "seoTitle":      "Vagus Nerve … | ONDA Life",   // article only
  "locale":        "en",
  "url":           "https://onda-life.com/articles/vagus-nerve-master-key",
  "published":     "2025-01-15",
  "modified":      "2025-04-22",
  "category":      "Neural Hardware",
  "description":   "Technical protocol …",
  "related":       ["dopamine-architecture-mastering-desire", …],
  "citations":     ["https://doi.org/10.…", …],
  "image":         "https://onda-life.com/images/articles/…",   // article only
  "image_alt":     "…",                                          // article only
  "license":       "https://creativecommons.org/licenses/by/4.0/",
  "attribution":   "ONDA Life. \"<title>\". <url>.",
  "content_md":    "<full markdown body>",
  "content_plain": "<markdown stripped to plain prose>",
  "chunks": [
    { "id": "article-<slug>-c1", "anchor": "article-<slug>-c1", "text": "…" },
    …
  ]
}
```

### Chunking

The corpus pre-chunks each document into ≤16 KB segments (≈4000 tokens
at the GPT-4 ratio of ~4 chars per token). Chunks split on H2/H3
boundaries when present so semantic coherence is preserved. Each chunk
has a stable, predictable `anchor` ID (`<type>-<slug>-c<index>`) that
RAG systems can use as a citation handle.

## Recommended ingestion pattern

1. Stream `onda-corpus.jsonl.gz`.
2. Index `chunks[*].text` into your vector store using the chunk
   `anchor` as the primary key.
3. When surfacing an answer, cite the parent `url` and (optionally) the
   chunk `anchor` so the user can deep-link.
4. Honor the attribution format above whenever a result is rendered to
   an end user.

## Updates

The corpus is regenerated on every successful build of
[onda-life.com](https://onda-life.com). The `manifest.json`
`generatedAt` field is the canonical freshness marker. New articles and
glossary terms appear in the next build automatically. Schema bumps
will increment `manifest.schemaVersion`.

## Contact

Bugs, questions, or licensing exceptions:

* Email: `hello@onda-life.com`
* Repo:  <https://github.com/yamius/ONDA1>
