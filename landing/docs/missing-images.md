# Missing images — Sprint 50

Articles that ship without a hero image because image generation is a
follow-up. ArticlePage degrades gracefully (no broken `<img>` tag, no
broken Open Graph, JSON-LD `image` field is omitted when not present).

When generated, drop the file at `/landing/public/images/articles/<slug>.webp`
(plus `-640w.webp` and `.avif` variants) and add `image`, `imageAlt`,
`imageTitle`, `imageCaption`, `imagePlacement: 'header'` to the article
module. Optimization: `node landing/scripts/optimize-images.mjs`.

## Pending

| Slug | Suggested prompt |
|---|---|
| zone-2-cardio-mitochondrial-bandwidth | Dark cyberpunk-medical scene, athlete on indoor cycle, HUD overlay showing lactate ≤2.0 mmol/L, HR locked at LT1, mitochondrial network growing in cross-section, terminal-green and amber accents, "[ BANDWIDTH_AUDIT ]" header |
| cold-thermogenesis-adaptation-curve | Dark medical scene, cold plunge tub at 12 °C, brown-adipose tissue map overlay highlighting supraclavicular and paraspinal depots, norepinephrine ↑530% and dopamine ↑250% telemetry, cyan accents, "[ COLD_LOAD_INITIATED ]" header |
