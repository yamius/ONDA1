# Liza Conversational Subsystem

"Liza" is the iOS app's in-app emotional-support chat: a fully on-device companion that blends an ELIZA-style reflection engine with scripted, CBT-flavored guided flows. No network, no LLM.

## Safety framing

Liza is **not** a real therapist, doctor, or emergency service, and this is asserted both in code comments and in user-facing copy:

- `src/bot/eliza.ts:3` — file header: *"IMPORTANT: Not a real therapist or emergency service."*
- The product copy frames her modestly as a *companion*, not a clinician: `liza.subtitle` = "Your emotional support companion", `liza.greeting` = "Hi! I'm Liza, and I'm here to listen and support you." (`public/locales/en/translation.json:3334`-`3335`).

**Gap (now FIXED 2026-06-13 — see the update at the end of this paragraph; the description below is the historical "before" state):** the subsystem had **no explicit crisis / self-harm detection or off-ramp** anywhere in the subsystem. There is no keyword trip for suicide/self-harm, no hotline number, and no hard escalation path. The closest thing to an off-ramp is soft de-escalation inside scripted flows — e.g. an "I'm not ready" branch that routes to a normalizing closing step (`flows.json` `anxiety_basic` → `end_normalize`, `body_scan` → `end_normalize`) — but these are gentle reassurances, not safety interventions. The pattern table (`eliza.ts:70`-`93`) classifies `fear`, `sad`, `anxiety`, `lonely`, etc. into reflective prompts only; distressing input is met with another open question, never a referral. If a crisis-handling requirement exists, it was previously **unmet in this code**.
>
> **✅ Update (2026-06-13):** a crisis off-ramp now exists. `src/bot/crisisDetection.ts`
> (`detectCrisis()` — a union keyword match across all 5 languages) is checked at the
> top of `ConversationEngine.handleUserMessage` **before** any ELIZA/flow handling and
> short-circuits to `crisisMessage(lang)`: a gentle, localized (en/es/ru/uk/zh) message
> leading with findahelpline.com + a national line (US 988, RU 8-800-2000-122, UA 7333,
> ES 024) + local emergency, in the same honest "not a therapist" framing. It surfaces
> resources; it does not diagnose or auto-escalate.

## Architecture

Two response generators sit behind one stateful dispatcher.

### 1. ELIZA reflection engine — `src/bot/eliza.ts`

A classic pattern-match + pronoun-reflection responder, localized EN/RU.

- **Reflection dictionaries** `REFLECTIONS_EN` / `REFLECTIONS_RU` (`eliza.ts:7`, `:24`) swap first/second-person pronouns ("I"→"you", "я"→"ты", …). `reflect()` (`eliza.ts:95`) tokenizes the captured fragment, swaps each word, and preserves leading-capital casing.
- **Pattern table** `PATTERNS: PatternRule[]` (`eliza.ts:70`) — an ordered list of `{ pattern: RegExp, type: PatternType }`. Regexes are bilingual (RU+EN alternations, `iu` flags) and ordered specific→generic, ending in a catch-all `/(.*)/` → `fallback` (`eliza.ts:92`). The 20 `PatternType`s (`eliza.ts:43`) include `greeting`, `thanks`, `tired`, `work`, `stress`, `anxiety`, `sad`, `angry`, `fear`, `lonely`, `difficult`, `cant`, `why`, `how`, `feelings`, `thinking`, `fallback`, etc.
- **`Eliza.respond(input)`** (`eliza.ts:137`) walks `PATTERNS` in order; first regex match wins. It pulls the captured fragment (`match[2] ?? match[1]`), reflects it, then loads response templates from i18n via `t('eliza.<type>', { returnObjects: true })` expecting a string array. A template may contain `{{fragment}}`, which is replaced with the reflected fragment (`eliza.ts:151`).
- **Anti-repetition:** `lastResponses: Map<PatternType,string>` (`eliza.ts:130`) tracks the last template used per type; `pickRandom(arr, exclude)` (`eliza.ts:121`) avoids repeating it back-to-back.
- **Fallbacks:** if i18n returns no array, `getDefaultResponse()` (`eliza.ts:165`) supplies hard-coded EN/RU response banks; if even the language/type is missing it degrades to `defaults.en[type]` → `["Tell me more."]` (`eliza.ts:276`). A final hard-coded EN/RU line guards the no-match case (`eliza.ts:160`), though in practice the `fallback` catch-all always matches first.

Localized response banks live at `eliza.*` in the translation files (`public/locales/en/translation.json:3468`).

### 2. Scripted flow state machine — `src/bot/flows.json` + `flowsTypes.ts`

A declarative, branching questionnaire engine. **Schema** (`flowsTypes.ts`):

- `FlowDefinition` = `{ id, titleKey, steps: FlowStep[] }`.
- `FlowStep` = `{ id, botTextKey, input?, saveAs?, next?, nextByAnswer?, isSummaryStep? }`.
- `FlowInput` is a discriminated union: `text` | `buttons` (`{ options: {value,labelKey}[] }`) | `scale` (`{ min, max }`).
- Linear progression via `next` (a step id or `null` to end); branching via `nextByAnswer: Record<answerValue, stepId>` (buttons only).

`flows.json` defines **7 flows**: `anxiety_basic`, `panic_grounding`, `body_scan`, `fear_basic`, `pain_reflection`, `loneliness_connection`, `anger_boundaries`. Each is a CBT-style sequence (situation → automatic thought → intensity scale → cognitive reframe / grounding → small action → summary). All copy is indirect through i18n keys (`flows.*`); `botTextKey` is resolved with the flow context as interpolation vars, so a summary step's `botTextKey` can reuse earlier `saveAs` answers.

> **Uncertainty:** the live engine (`conversationEngine.ts`) does **not** read `isSummaryStep`; that flag is declared in the schema and set on summary steps in `flows.json`, but I found no code branching on it. It appears informational/unused in the current dispatcher.

### 3. Validation — `src/bot/flowsValidation.ts`

`validateFlows(flows): FlowValidationError[]` (`flowsValidation.ts:10`) is a static integrity checker, not part of the runtime chat loop. It flags: duplicate flow ids, duplicate step ids, empty flows, `next` / `nextByAnswer` targets that point to unknown step ids, empty `buttons` option lists, `scale` with `min >= max`, and `nextByAnswer` used on a non-`buttons` step. **Uncertainty:** I found no caller of `validateFlows` in the live app code — it looks like a dev/test/lint utility.

### 4. Loading the flows — `src/bot/flowsIndex.ts`

`flowsIndex.ts` simply imports `flows.json` and casts it to `FlowDefinition[]` (`export const flows`). This is what both the UI and engine consume.

### 5. Dispatcher / blending — `src/bot/conversationEngine.ts`

`ConversationEngine` holds the conversation state and decides ELIZA-vs-flow per turn.

- **State** `EngineState = { mode: "eliza" | "flow", activeFlowId?, activeStepId?, flowContext }`; `createInitialState()` starts in `mode: "eliza"` (`conversationEngine.ts:34`). The engine indexes flows by id into `flowIndex: Map` at construction (`:54`).
- **Output type** `BotMessage` is `text` | `buttons` | `scale` (`conversationEngine.ts:14`) — a UI-agnostic message envelope.
- **`startFlow(state, flowId)`** (`:58`) switches to `mode:"flow"`, emits the first step's message; if the flow id is unknown/empty it gracefully falls back to an ELIZA response (`:64`).
- **`handleUserMessage(state, {text?, value?})`** (`:86`) is the main entry. If `mode === "flow"` with an active flow+step it routes to the flow handler; otherwise it just calls `eliza.respond(text)`.
- **`handleFlowMessage`** (`:104`): saves the answer to `flowContext[step.saveAs]` (value preferred over text), computes the next step (`step.next`, overridden by `step.nextByAnswer[value]` for button steps), and:
  - if there is no next step → **flow ends and control returns to ELIZA**: it concatenates the localized `flows.common.end_thanks` closing with an ELIZA comment (`eliza.respond("I just finished a helpful exercise.")`) and resets to `mode:"eliza"` (`:141`). This is the explicit **blend point** — flows hand the user back to free-form reflection.
  - otherwise it builds and returns the next step's `BotMessage`.
- **`buildBotMessage`** (`:178`) renders a `FlowStep` into a `BotMessage`, resolving `botTextKey` and (for buttons) each option `labelKey` through `t`.
- **`fallbackToEliza`** (`:210`) is a safety net for corrupt state (missing flow/step) — it drops back to ELIZA and clears flow state.

So the "blend" is **modal, not interleaved**: at any moment the user is either in free-form ELIZA mode or walking a scripted flow, and finishing/aborting a flow returns them to ELIZA. The user picks a flow (or "just talk") from buttons in the opening message (see UI below).

### 6. UI driver

There are **two** drivers; only one is live.

**Live path — `src/components/LizaChatModal.tsx`** (the actual mounted UI). It constructs its own engine in a `useMemo`: `new Eliza(t, lang)` + `new ConversationEngine({ eliza, flows, t })` (`LizaChatModal.tsx:26`-`29`), keyed on `t`/`lang` so it rebuilds on language change. `lang` is derived from `i18n.language` (`:24`). It:

- Seeds the conversation with `liza.greeting` (+ optional `liza.emotion_prompt` using the `initialEmotion` prop) and a `buttons` message offering the flows + "Just talk freely" (`:57`-`81`). The offered flow ids are a curated subset — `anxiety_basic`, `panic_grounding`, `body_scan`, `loneliness_connection` — plus a `free_talk` pseudo-option (`:71`-`75`).
- `sendUserText` (`:99`) pushes the user bubble, shows a typing indicator, and after a simulated delay (`2500 + random*1500` ms) calls `engine.handleUserMessage`. It mirrors `state` into a `stateRef` to avoid stale-closure bugs across the timeout (`:107`).
- `sendUserValue` (`:117`) handles button/scale answers: if the value is a known flow id it calls `engine.startFlow`; the `free_talk` value short-circuits to the `liza.free_talk_response` copy without touching the engine; otherwise it forwards the value to `handleUserMessage`.
- Renders `buttons` as pill buttons and `scale` as a range slider (`:195`-`228`).
- This modal is mounted by `src/components/VoiceCheckModal.tsx:598`, wired so the detected `emotionalResult.primaryEmotion` becomes `initialEmotion` — i.e. Liza is offered as a follow-up to the emotional/voice check feature.

**Apparently-unused path — `src/bot/useChatEngine.ts`.** A React hook exposing `messages`, `sendUserText`, `sendUserValue`, `startFlow`. **Uncertainty:** it constructs a module-level `new Eliza()` with **no `t` and no `lang`** (`useChatEngine.ts:9`), which would make ELIZA fall through to its hard-coded English defaults. I found **no `.tsx` importing `useChatEngine`** — the live modal does its own wiring instead. Treat this hook as legacy/dead unless re-wired.

## Local vs. backend / LLM

**Fully local. No LLM, no network.** A grep of `src/bot/` for `fetch`/`axios`/`http`/`openai`/`anthropic`/`api.`/`supabase`/`XMLHttpRequest` returns nothing. All responses come from regex matching (`eliza.ts`), static JSON (`flows.json`), and i18n string banks resolved by `react-i18next` `t()`. The only "AI" is the deterministic ELIZA reflection algorithm. The typing-delay in the UI (`LizaChatModal.tsx:114`) is cosmetic, not a network round-trip.

## Public API / exports

- `eliza.ts`: `class Eliza` (`constructor(t, lang)`, `respond(input): string`); `type TFunction`.
- `conversationEngine.ts`: `class ConversationEngine` (`startFlow`, `handleUserMessage`); `createInitialState()`; types `Mode`, `EngineState`, `BotMessage`.
- `flowsTypes.ts`: types `FlowInputType`, `FlowOption`, `FlowInput*`, `FlowInput`, `FlowStep`, `FlowDefinition`.
- `flowsIndex.ts`: `const flows: FlowDefinition[]`.
- `flowsValidation.ts`: `validateFlows(flows)`; type `FlowValidationError`.
- `useChatEngine.ts`: `useChatEngine()` hook; type `ChatMessage` (currently unconsumed by UI).
- `components/LizaChatModal.tsx`: `LizaChatModal` component (the live UI surface).

## Source files

- `src/bot/eliza.ts` — ELIZA reflection engine + EN/RU default banks.
- `src/bot/conversationEngine.ts` — mode dispatcher / flow state machine driver.
- `src/bot/flows.json` — 7 scripted CBT-style flow definitions.
- `src/bot/flowsTypes.ts` — flow/step/input schema types.
- `src/bot/flowsIndex.ts` — typed import of `flows.json`.
- `src/bot/flowsValidation.ts` — static flow-graph integrity checker (no live caller found).
- `src/bot/useChatEngine.ts` — React hook wrapper (apparently unused by UI).
- `src/components/LizaChatModal.tsx` — live chat UI; builds the engine and renders messages.
- `src/components/VoiceCheckModal.tsx` — mounts `LizaChatModal` (entry point, passes `initialEmotion`).
- `public/locales/<lang>/translation.json` — `liza.*`, `flows.*`, and `eliza.*` copy (EN/RU populated).
