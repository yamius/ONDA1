# Emoton — feature documentation (landing)

**Emoton** is the deliberate, owned emotional check-in — *"I name what I feel."* A
cognitive/affective front-door that continues into a real practice driven by a live
camera-pulse signal. It is a **primary main-menu page at `/emoton`** on the **landing
site** (not a `/tools/*` page; `/bio` is the separate tool — see [Boundaries](#boundaries-with-bio)).

- **Status:** v1 built on branch `claude/emoton`, **merged to `main` 2026-06-12 (FF, `06827d9e`)** and shipped (deploy is whatever the host does off `main`).
- **Scope:** wheel/flow localised **EN + RU** (es/uk/zh fall back to EN); the ported adaptive practices are **EN-only**. No persistence, no free text, no account.
- **Philosophy:** *agency, never assessment.* Felt-states, not physiological claims; existing practices reused by id, never invented; camera = pulse only.

---

## Карта шагов (актуальный флоу) — RU

> **Источник истины по UX — этот раздел** (обновлён после переработки вида/флоу, 2026-06). Разделы §3/§8 ниже описывают исходную модель «want → branch»; UI упростил её до **3 фиксированных действий** на шаге *own*. Хелперы `WANTS_BY_ZONE`, `resolveBranch`, `beWithMoves` и Gendlin-«describe» в `emotonCore.ts` страницей **больше не используются** (легаси, оставлены для переноса в app).

Последовательность (`StepId`): `presence → wheel → own → {be_with | release | (freeze_move →) practice} → assimilation`, плюс `support` как off-ramp.

| # | Шаг | Что на экране | Куда ведёт |
|---|---|---|---|
| 1 | **presence** | Орб «Я», «Вот ты здесь». Коснись орба. | → wheel |
| 2 | **wheel** | «Что сейчас живо в тебе?» — 6 зон вокруг орба. Выбор зоны → «Выбери оттенок» (5 оттенков, та же позиция, фраза сменяется на месте). Тап «Я» — сброс. | оттенок → own · оттенок безнадёжности → support |
| 3 | **own** | «Я и {моя/мой/моё} {чувство}». Орб с полем-эффектом эмоции (цвет по зоне). Текст с местоимениями по роду. **3 кнопки.** | «{практика зоны}» → practice (freeze: → freeze_move) · «Побыть с {ней/ним}» → be_with · «Я знаю, что делать» → release |
| 4 | **be_with** | «Быть с этим»: орб+поле, текст по эмоции (впитать / осесть / побыть рядом / мягкий контакт). «Подключить камеру» (+ подпись) → инлайн-камера: статус + число пульса, **гало бьётся по живому пульсу**. Внизу: «Завершить» · «Начать заново». | «Подключить камеру» → practice · «Завершить» → assimilation · «Начать заново» → restart |
| 5 | **freeze_move** (только freeze) | «Просто один штрих» — нарисуй линию. | → practice |
| 6 | **practice** | Адаптивная практика (3D-фон + аудио + камера-пульс), полноэкранно. Контент EN-only. | onDone → assimilation |
| 7 | **release** | «Ты назвал это — и оно твоё» + приглашение в ONDA Life + кнопки App Store / Google Play. | стор-ссылки · «Начать заново» → restart |
| 8 | **support** | Мягкий off-ramp (Я ≤ ~10% или оттенок безнадёжности): линия помощи 988. | «Начать заново» → restart |
| 9 | **assimilation** | «Ты остался с этим» + орб с эффектами + приглашение в ONDA Life + кнопки стора. | стор-ссылки · «Начать заново» → restart |

**Орб (`FeelingShape`).** SVG-поле тонких лучей вокруг «Я» (не CSS-блоб). Палитра по зоне: радость — золото, покой — тил, гнев — тёмно-красный, тревога — стально-голубой, грусть — индиго, онемение — почти серое. Мягкий заход у кромки орба, пик у основания, рваные кончики, ~70% лучей мерцают (композитные слои), гало в тоне зоны. На *be_with* гало **пульсирует по живому пульсу** (rAF фаза-аккумулятор → плавная смена частоты, удар через один; пишет CSS-переменную `--fs-halo-op`). Mobile-lite: на узких экранах меньше лучей/слоёв (плавность iOS).

---

## 1. Routing & placement

- Page: `/emoton`, wired in `src/main.tsx` + `src/entry-server.tsx` (routes) and `src/components/Layout.tsx` (primary nav item).
- Tapping the **Emoton** nav item while already on `/emoton` resets the flow to the start (dispatches an `emoton:reset` event the page listens for).
- The **Emoton** nav "Download" CTA is page-aware (see [Attribution](#7-downloadinstall-attribution)).

### Boundaries with `/bio`
`/bio` is a **separate tool** with its own (richer) engine. Emoton does **not** share the `/bio` engine. The planned `/bio → /tools/bio` relocation is **DEFERRED** (a public-URL move with SEO/redirect/privacy-§1.5 surface) — `/bio` stays where it is for now.

---

## 2. Architecture & files

| File | Role |
|---|---|
| `src/lib/emotonCore.ts` | **Pure, UI-free core** — wheel taxonomy, want→branch routing, state→direction, tolerance (Я) gauge, zone→practice map. Liftable into the app. |
| `src/pages/EmotonPage.tsx` | The flow surface (wheel → want → branch). SSR-safe; sensor connects only in the practice branch. |
| `src/components/emoton/LandingPractice.tsx` | The practice branch — the **real adaptive-practice experience**, ported 1:1 from the app's `AdaptivePracticeModal`. |
| `src/components/emoton/FeelingShape.tsx` | SVG **ray-field** behind the orb (per-zone colour + halo) on *own / be-with / assimilation*. Halo pulses to the live camera bpm on *be-with* (rAF → `--fs-halo-op`). Mobile-lite. See «Карта шагов». |
| `src/data/adaptivePractices.ts` | All **18 adaptive practices** (6 emotion folders), **EN-only**, user-proofread. (Basic practices stay app-only.) |
| `src/lib/ppgCore.ts`, `src/lib/dsp.ts` | **Synced copies** of the app's shipped camera-pulse core (see [§4](#4-synced-copy-maintenance)). |
| `src/hooks/useCameraPpg.ts` | Web-only variant of the app hook (heartRateStore coupling removed; self-contained bpm/confidence/fingerOn/status). |

### `emotonCore.ts` shape (verified exports)
- `ZoneId` = `fight | flight | freeze | grief | regulated | expansive` (6 zones); `ZONE_ORDER` for layout.
- `WindowPosition` = `over | within | under | low_present` (window-of-tolerance metaphor).
- `BranchId` = `practice | be_with | release | support`.
- `WANTS_BY_ZONE` + `UNIVERSAL_WANTS` (`other → release`); `resolveBranch(zone, want)`, `wantsForZone`, `requiresFirstMove`, `branchUsesSensor`.
- Support off-ramp: `HOPELESSNESS_SHADES` (`hopelessness`, `meaninglessness`), `SELF_FLOODED_FRACTION = 0.1`, `shouldOfferSupport({ selfFraction, shadeId })`.
- Be-with: `BeWithMove` = `witness | grow_self | describe | ease`; `beWithMoves(selfFraction)` (the `ease` titration move appears only as Я nears the danger zone).
- `PracticeDirection` = `down | gentle_up | deepen | channel`.

---

## 3. Wheel-state → existing-practice mapping (reuse only)

> ⚠ **Legacy model.** The per-zone `WANTS_BY_ZONE` table below is the *original* want→branch design; the live UI replaced it with **3 fixed actions** on the *own* step (practice · be-with · "I know what to do") — see «Карта шагов». The mapping is still useful as the zone→practice reference (the practice route still uses it).

| Zone (window) | Want → branch | Practice (existing id) | Direction |
|---|---|---|---|
| Fight — over | calm down → practice · be with → be-with · set a boundary → release | `body_cocoon` | down |
| Flight — over | calm down / ground → practice · be with → be-with | `earth_pulse` | down |
| Freeze — under | gently come back → practice (after first-move) · be with → be-with | `inner_spark` | gentle-up ⚠ |
| Grief — low/present | be with → be-with · describe → be-with (Gendlin) | — (be-with default) | — |
| Regulated — within | deepen → practice · nothing → release | `earth_breath` | deepen |
| Expansive — within | live it → release · channel into action → practice | `light_inhale` | channel |
| (any) | something else → release | — | — |
| hopelessness/meaninglessness shade, or Я flooded | → support off-ramp | — | — |

⚠ **Freeze reuse flag (user decision):** the in-app library has **no bespoke energizing / up-regulation protocol** (recon confirmed — all practices are down/neutral). Freeze reuses the closest up-leaning existing practice (`inner_spark`, *Inspiration*) as a gentle re-mobilization — **not** a fabricated protocol. The web pacer for freeze/expansive runs a brisker "rise" rather than a calming settle, so the brief's down/up asymmetry holds on web too.

The wheel has **6 zones × 5 shades = 30 shades** (RU taxonomy + EN). Tapping the centre "Я" clears the selected zone/shade.

---

## 4. Synced-copy maintenance ⚠

The camera engine is reused in landing via **verbatim copies**, because landing is a
separate Vite build:

- **App = source of truth:** `src/lib/ppgCore.ts`, `src/hooks/dsp.ts`, `src/hooks/useCameraPpg.ts`.
- **Landing copies:** `landing/src/lib/ppgCore.ts`, `landing/src/lib/dsp.ts`, `landing/src/hooks/useCameraPpg.ts` (web variant, heartRateStore coupling removed).
- **Rule:** if the app engine changes, **re-sync the landing copies.** "Copy" was chosen over a shared workspace package for v1.

`LandingPractice` also pulls in verbatim copies of the app's `CameraPulseWindow`,
`RemoteAudioPlayer`, `useAudioCache`, `WelcomeScene`, `MetricsWaveform`,
`constants/practiceAssets`, and a minimal `lib/supabase` (no-throw if env missing).

### Web-only divergences (by design)
- **Camera-only vitals:** coherence stays `null` (coherence is the app/Apple-Watch upgrade).
- **No** Supabase save, paywall, OND persistence, or analytics in the landing practice.
- Practice **chrome** (Start / Complete / etc.) is EN-literal per the "practices EN-only" rule; only the wheel/flow is EN+RU.

---

## 5. Supabase Storage + CSP

Emoton is the **first landing feature to fetch from Supabase Storage** (practice audio
+ HDR panoramas), which required two infra changes:

- **Real public URL fallback:** `lib/supabase.ts` + `constants/practiceAssets.ts` default to the real public project `https://qwtdppugdcguyeaumymc.supabase.co` (buckets `audio-practices` + `hdr` are **public**; reads need no auth). Vite bakes `import.meta.env` at **build time**, so on env-less hosts the real URL is baked in. Setting `VITE_SUPABASE_URL` overrides to another project. (The URL is not a secret — the app bundle and committed `.env.development` already expose it.)
- **CSP (helmet in `landing/server.js`):** `connect-src` += `https://*.supabase.co` (mp3 + `.exr` fetch); new `media-src 'self' blob: https://*.supabase.co` (practice audio plays from a `blob:` URL via `useAudioCache`). Prod runs `node server.js` (Express + helmet) — **that's where CSP lives**.
  - Verify a header change: `PORT=… node landing/server.js` then `curl -sI .../emoton | grep -i content-security-policy`.
  - Symptom when missing: console *"Refused to connect … violates the document's Content Security Policy"*; only the inline base64 JPEG preview flashes.

---

## 6. Prerender build invariants ⚠

The landing prod build runs `tsx scripts/prerender.ts`, which evaluates the **real
source tree in Node** (not the Vite bundle) and is **not** exercised by `build:fast`.
Any new module in the prerender graph must respect:

1. **`import.meta.env` is undefined under tsx** — a module-scope `import.meta.env.X` throws. Read via a guard: `(((import.meta as …).env) ?? {}).VITE_X` (done in `lib/supabase.ts` + `constants/practiceAssets.ts`; `createClient('')` also throws "supabaseUrl is required", hence the placeholder fallback).
2. **Every `LOCALIZED_PAGES` namespace needs a JSON for all 5 `SUPPORTED_LANGS`** — prerender hard-`readFileSync`s `public/locales/<lang>/<ns>.json` with no runtime fallback. `emoton.json` exists for **en, ru, es, uk, zh** (es/uk/zh are EN copies = intended EN fallback). Missing one → `ENOENT public/locales/<lang>/emoton.json`.

**Verify the way the host sees it** (landing/.env is gitignored → no `VITE_SUPABASE_*`):
`mv landing/.env aside && npm run build` → must exit 0 (prerender N/N, validate-seo clean).

**Prerender memory:** runs with `--max-old-space-size=4096 --expose-gc`; GCs every 12
routes (was 100) to keep peak heap low on small build containers. Deploy is Replit
**Autoscale 4 vCPU / 8 GiB / 3 Max** (`.replit` build: `cd landing && rm -rf dist && npm install && npm run build`; run: `node server.js`). If prerender OOMs, **lower** the heap flag or batch prerender — do not raise it above container RAM.

---

## 7. Download/install attribution

Canonical mechanism (`src/config/appStore.ts`):
- `appStoreUrl(campaign)` → `apps.apple.com/app/apple-store/id6755912529?pt=128331898&ct=<campaign>&mt=8` (provider `pt=128331898`, free-form `ct`). App Store ID **6755912529**, bundle `com.onda-life.ios`.
- `emotonCtaUrl(placement)` wraps the Apple ct-link in **one Tenjin click** for source `emoton_web` (key `TENJIN_EMOTON_CLICK = fnR3SpdCPaWVGNh6snescc`):
  `track.tenjin.com/v0/click/fnR3SpdCPaWVGNh6snescc?redirect_url=<ENC(apple ct-link)>`.
  One tap feeds both **Tenjin** (install/revenue; probabilistic under ATT — trust Apple `ct` for counts) and **Apple Sources**.

**Placements:** post-practice CTA → `ct=emoton_post_practice` (uses `emoton.upgrade_link`); nav Download on `/emoton` → `ct=emoton_nav` (homepage keeps `home_cta`/`#download`). No `/emoton` CTA points at `/#download`.

**Verified empirically:** `redirect_url` is the **only** param Tenjin v0 honours (others fall through to the global store URL without `ct`); the value **must be fully URL-encoded** (a raw `&` drops `ct`); both placements 302→correct Apple ct-link.

⚠ **Do NOT route Emoton through `/go`** (`landing/public/go/index.html`) — that is a fixed quiz/Reddit hop (Meta InitiateCheckout + hardcoded Tenjin click) that **ignores `ct`**.
ℹ Because the Emoton CTA href is now `track.tenjin.com` (not `apps.apple.com`), the `Layout` document-capture Reddit-Lead listener no longer fires for Emoton CTAs (organic — fine). Layer 3 (Meta pixel) intentionally skipped.

---

## 8. Honesty audit (each claim → source)

- **6 zones = window-of-tolerance *metaphor*, not a mechanism.** No physiological claim; zones are felt-states.
- **Practices are EXISTING, reused by id — never invented.** Ids verified against the app's `AdaptivePracticeModal` + `PRACTICE_SETS`. A zone with no fitting practice (grief) falls back to be-with rather than fabricating one (`resolveBranch`).
- **Camera = PULSE ONLY.** `ppgCore` commits a bpm only when its two estimators agree + SQI passes, else `null`; the page shows bpm only while `status==='reading'`. The lead visual is the breathing pacer + responsive pulse trend, not the number.
- **No coherence/HRV from camera.** Stated in UI ("Pulse only — coherence unlocks with an Apple Watch"); no fabricated metric.
- **"Be with it" is not suppression.** In a normal state the moves are witness / grow-the-Self / describe — no shrink-slider. "Ease it a notch" (titration) appears **only** as Я approaches the danger zone.
- **Support off-ramp is gentle + real, never an alarm.** 988 Suicide & Crisis Lifeline (US/EN v1). The Я-proportion gauge is **never shown as a %** — conveyed only by circle-region sizes; the ~10% threshold is a backend trigger.
- **No persistence, no free text.** No storage calls anywhere. (The Gendlin "describe the feeling" SELECT and the grow-self/ease moves were **removed** from the be-with UI in the 2026-06 rework — be-with now offers the live camera pulse + finish; the helpers remain in `emotonCore.ts` for the app port. See «Карта шагов».)
- **Sensor only at the practice branch.** Only `LandingPractice` mounts `useCameraPpg`; wheel / be-with / release / support never touch the camera.

---

## 9. In-app continuation path

Emoton (web) check-in → ported adaptive practice with live **camera** pulse →
download hook → in-app: the **same** wheel/core → full audio-guided practice with
**Apple-Watch**-precision pulse + **coherence** + the 8-level journey.

---

## 10. Key decisions (user)

- **Freeze reuses `inner_spark`** (Inspiration) as a gentle-up — the library has no bespoke energizing practice (reuse chosen over adding one).
- **`/bio → /tools/bio` relocation DEFERRED** — `/bio` stays put and keeps its own richer engine; Emoton does not share it.
- **Copy over shared workspace package** for the reused engine, for v1.

---

## 11. v1 constraints (honest scope)

- Wheel/flow **EN + RU** (namespace `emoton`); adaptive practices + practice chrome **EN-only**.
- No persistence, no per-user learning, no free text (Gendlin word SELECT).
- Camera = pulse only (coherence = watch/app upgrade); support off-ramp = 988 (US/EN); Я-gauge % never shown.
- SSR-safe (no `document`/`navigator` at render; camera starts only on user tap).

---

## Verification

`tsc -p tsconfig.app.json --noEmit` clean; full `npm run build` (incl. prerender +
validate-seo) exits 0 even with `landing/.env` removed (host parity). See [§6](#6-prerender-build-invariants-) for the env-less build check.
