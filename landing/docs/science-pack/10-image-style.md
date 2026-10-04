# 10. Image style (light scientific)

Every science page has one hero image. You (Mistral) write two frontmatter fields:
- **`imageAlt`** — what the image shows;
- **`imagePrompt`** — the prompt Yakiv uses to generate the image.

Yakiv generates the image and sends the file. Claude Code saves it as `public/images/science/<slug>.jpg` and sets `image`. You never set `image` yourself.

## Reference image

The published reference is `concepts/rmssd`:
- file: `landing/public/images/science/rmssd.jpg`;
- live: https://onda-life.com/images/science/rmssd.jpg.

It shows a single thin teal heart-rhythm line across a white background, with soft glow and a lot of empty space.

## Style rules

| Do | Don’t |
|---|---|
| White or very light grey background | Dark backgrounds, neon “cyber” looks (the rest of the site is dark; science pages are deliberately light) |
| One simple visual idea: a line, a wave, a minimal diagram, an abstract anatomical outline | Busy scenes, several ideas at once |
| Teal / cyan accent (close to the reference), soft glow, thin strokes; at most one secondary muted colour | Rainbow palettes, heavy gradients |
| Lots of negative space, calm and precise | Clutter, decorative particles |
| Abstract and schematic | Realistic people, faces, hands, devices, brand logos, watches or rings |
| No text at all | Letters, numbers, labels, axes with values, fake charts with data |
| Medically neutral | Blood, organs in realistic detail, hospital scenes, anything alarming |
| 4:3 landscape (rendered as 1024×768) | Portrait or square |

## `imagePrompt` — pattern

> Minimal scientific illustration on a clean white background: **[one visual idea tied to the page entity]**, thin teal lines with a soft cyan glow, lots of empty space, no text, no numbers, no people, no devices, light and calm, 4:3.

**Example (rmssd):**

> Minimal scientific illustration on a clean white background: a single thin teal ECG-like heart-rhythm line running horizontally across the middle, with slightly uneven spacing between beats, soft cyan glow, lots of empty space, no text, no people, no devices, light and calm, 4:3.

**Ideas for other MVP pages** (pick or adapt):
- `sdnn` — a wide band of overlapping rhythm lines, showing overall spread;
- `respiratory-sinus-arrhythmia` — a slow breathing wave and a heart-rhythm line rising and falling together;
- `vagus-nerve` — a minimal, abstract line-drawn nerve path from the brainstem to the heart, with no anatomy detail.

## `imageAlt` — rules

- One plain sentence, 40–200 characters. The check enforces the length.
- Say what is visible, then, if useful, what it represents. Don’t start with “Image of”.
- No keyword stuffing, no claims.

**Example (rmssd):**

> A thin teal heart-rhythm trace on a white background, with the spacing between beats varying slightly — a visual of beat-to-beat heart rate variability.
