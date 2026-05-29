# ONDA Life — iOS Release History

> **Назначение:** хронология всех iOS-релизов проекта, что вошло в каждый, и где известно — статус в App Store / TestFlight. Источник — git-log по `ios/App/App.xcodeproj/project.pbxproj` + commit-bodies + памятные пометки в commit-messages про rejection'ы.
>
> **Note:** `MARKETING_VERSION` в pbxproj (то, что под капотом, и что попадает в CFBundleShortVersionString) **не равен** «App Version» в App Store Connect. В Connect свой счётчик iteration'ов submission'ов, который к маю 2026 показывает `1.1.4` хотя сборки идут под `1.7.x`. См. секцию [App Store Connect display version](#app-store-connect-display-version) ниже.

---

## Текущий статус

- **На ревью в App Store:** `1.7.4 (202605272243)` — **REJECTED 2026-05-29** по Guideline 2.1 (Information Needed про face data). См. секцию ниже.
- **Готова к сабмиту:** `1.7.5` (на 2026-05-28, после approval'а 1.7.4 если он случится, или как замена)
- **Активная ветка разработки:** `main` (после merge'а `claude/v1.7.4` home-redesign и Parts 2/3 контента)

---

## Хронология версий

| Версия | Дата bump'а | Статус | Краткое описание |
|--------|-------------|--------|------------------|
| **1.0** | 2026-04-04 | seed | Первый MARKETING_VERSION с Firebase config |
| **1.0.1** | 2026-04-18 | TestFlight | Bump для нового submission в TestFlight |
| **1.0.2** | 2026-04-23 | TestFlight | Allow new build submissions |
| **1.0.3** | 2026-04-24 | **REJECTED** Apple | Apple отклонила за отсутствие ATT prompt'а (см. 1.3.0 fix) |
| **1.0.4** | 2026-04-25 | debug | Airbridge SDK debug log, ATT-gated sanity probe |
| **1.0.5** | 2026-04-25 | revert | Откат к голому AirbridgeOptionBuilder |
| **1.0.6** | 2026-04-26 | debug | Synchronous sanity probe + Podfile разлочен на `~> 4.1` |
| **1.0.7** | 2026-04-26 | bug fix | Убрали duplicate ATT request (SDK 4.9.3 сам спрашивает) |
| **1.0.8** | 2026-04-27 | bug fix | Чёрный фон WebView, чтобы убрать белую вспышку при cold-start |
| **1.0.9** | 2026-04-27 | bug fix | Убрали synchronous sanity probe, блокировавший cold-start |
| **1.1.0** | 2026-04-27 | perf | Defer Airbridge init off the cold-start critical path |
| **1.1.1** | 2026-04-27 | perf | Inline HTML splash маскирует cold-start JS load |
| **1.1.2** | 2026-04-27 | perf | Code-split основной сцены + circular ONDA splash |
| **1.1.3** | 2026-04-27 | perf | Real ONDA LIFE logo + teal spinner в boot splash |
| **1.2.0** | 2026-04-27 | perf | Defer Sentry/resourceTracker/crashDetector + vendor splitting |
| **1.2.1** | 2026-04-27 | perf | Skip web-only analytics SDKs в Capacitor WebView |
| **1.2.2** | 2026-04-27 | style | Shrink boot splash logo на 33% |
| **1.2.3** | 2026-04-27 | feat | Mirror каждого `track()` call в Firebase Analytics |
| **1.2.4** | 2026-04-27 | perf | Lazy-load WelcomeScene → three.js off cold-start |
| **1.2.5** | 2026-04-27 | feat | `value+currency` на purchase events для ROAS bidding |
| **1.2.6** | 2026-04-27 | perf | Bundle EN translations + drop i18n Suspense + 50% logo |
| **1.2.7** | 2026-04-27 | diag | Visible cold-start timing на splash + +1s splash |
| **1.2.8** | 2026-04-27 | cleanup | Удалили timing diagnostics после фикса cold-start |
| **1.2.9** | 2026-04-28 | cleanup | Drop boot splash целиком — cold-start теперь быстрый |
| **1.3.0** | 2026-04-29 | fix | **Restore manual ATT prompt** — Apple отклонила 1.0.3 без него |
| **1.3.1** | 2026-04-29 | fix | YouTube iframe → click-to-open thumbnail |
| **1.3.2** | 2026-04-29 | fix | Video thumbnail collapsed to 0 height |
| **1.4.0** | 2026-04-30 | **MIGRATION** | **Replace Airbridge with Tenjin** (MMP миграция) |
| **1.4.1** | 2026-04-30 | fix | CI: Airbridge pod check → Tenjin |
| **1.4.2** | 2026-04-30 | feat | Tenjin `close_practice` event + per-practice slug |
| **1.4.3** | 2026-05-01 | **feat** | **Free-tier sampler** — первые 3 практики Part 1 без paywall/auth |
| **1.4.4** | 2026-05-02 | chore | Version bump |
| **1.4.5** | 2026-05-05 | fix | Defer Tenjin connect() пока ATT prompt не resolved |
| **1.4.6** | 2026-05-07 | chore | Version bump |
| **1.4.8** | 2026-05-12 | **feat** | **Local notifications Sprint 1** (daily + streak reminders) |
| **1.4.9** | 2026-05-13 | chore | Version bump |
| **1.5.0** | 2026-05-13 | feat | (merged into 1.6 push integration thread) |
| **1.6.0** | 2026-05-14 | **feat** | **OneSignal integration** — server-side push channel |
| **1.6.1** | 2026-05-15 | fix | Stop OneSignal от prompting на first launch (onboarding owns it) |
| **1.7.0** | 2026-05-16 | feat | Subscriptions lifecycle analytics + Tenjin revenue server-side; paywall без auth |
| **1.7.1** | 2026-05-17 | **APPROVED** | Apple приняла; пользовался ранний adopter с 17 апреля |
| **1.7.2** | 2026-05-20 | chore | Version bump (минорные правки) |
| **1.7.3** | 2026-05-23 | **feat** | **ATT prompt убран целиком**, онбординг скрыт, push primer отложен до 2 практик |
| **1.7.4** | 2026-05-25 | **REJECTED** | **Build `1.7.4 (202605272243)`** — Apple отклонила 2026-05-29 за face-data privacy questions (см. ниже) |
| **1.7.5** | 2026-05-28 | готова | Post-rejection bump; SKStoreReviewController prompt на 2-й практике, home redesign |

---

## Тематические эпохи

### 1.0.x — Первые сабмишены + ATT/Airbridge churn (апрель 2026)

Серия попыток поставить первую версию в TestFlight + быстрое iteration по проблемам с Airbridge SDK на iOS 26.4.1:
- **1.0.3 → REJECTED** Apple за отсутствие ATT prompt'а (вернули в 1.3.0)
- **1.0.4–1.0.7** — Airbridge SDK debugging (sync probe, ATT-gating, 4.1.3 → ~> 4.1, duplicate ATT removal)
- **1.0.8–1.0.9** — Cold-start fix (белый экран при первом open, sync probe blocking main thread)

### 1.1.x — Cold-start perf (апрель 2026)

5 версий за 1 день (2026-04-27) — итерация по перформансу холодного старта. Splash → boot animation → lazy-load three.js. После 1.2.9 splash вообще убрали.

### 1.2.x — Перформанс + analytics (апрель 2026)

10 версий за 1 день (2026-04-27). Финальная оптимизация vendor chunks, Firebase mirroring, value+currency для ROAS.

### 1.3.x — Post-rejection восстановление (апрель 2026)

- **1.3.0** — Manual ATT prompt восстановлен. Apple отклоняла без него.
- **1.3.1–1.3.2** — Fix про part-info видео (iframe → clickable thumbnail на youtube-nocookie).

### 1.4.x — Tenjin migration + product features (апрель–май 2026)

- **1.4.0** — Полная замена Airbridge → Tenjin как MMP (server-side revenue).
- **1.4.3** — **Free-tier sampler** запущен (первые 3 практики Part 1 без auth/paywall).
- **1.4.5** — Defer Tenjin connect() до ATT resolved.
- **1.4.8** — Sprint 1 local reminders (daily nudge + streak protection).

### 1.5.x–1.6.x — Push notifications (май 2026)

- **1.5.0** — версия-маркер (минорные правки между Sprint 1 и OneSignal интеграцией).
- **1.6.0** — **OneSignal** интеграция (server-side push channel вместо local-only).
- **1.6.1** — Fix double-prompt: OneSignal больше не спрашивает разрешение на cold-start (onboarding owns).

### 1.7.x — Theme + product polish + ATT removal (май 2026)

- **1.7.0** — Subscription lifecycle analytics, paywall без auth-wall (раньше требовали sign-up).
- **1.7.1** — **APPROVED** Apple. Один paying customer ($14.99 monthly, конвертился из triяla 17 апреля → этот же релиз).
- **1.7.2** — Version bump.
- **1.7.3** — **Стратегический сдвиг:**
  - ATT prompt удалён целиком (SKAN-only через Tenjin).
  - Онбординг (3 экрана) скрыт авто-показом.
  - Notification primer отложен до 2 завершённых практик.
- **1.7.4** — Firebase events split, default monthly, MetricsWaveform график. **REJECTED** Apple 2026-05-29 за face data.
- **1.7.5** — Post-rejection bump; добавлен SKStoreReviewController prompt после 2 практик, home redesign выкатан.

---

## REJECTED submissions

### 2026-04-24 — `1.0.3` REJECTED по ATT prompt

Apple отклонила за отсутствие ATT-prompt'а. Fix в `1.3.0` ([74dd6bc](https://github.com/yamius/ONDA1/commit/74dd6bc)): manual `AppTrackingTransparency.requestPermission()` в onboarding.

**Контекст:** в 1.0.4–1.0.7 пытались делать без manual ATT (полагались на Airbridge SDK что он сам спросит). Apple это не приняла. **Пришлось вернуть manual ATT.**

### 2026-01-12 — REJECTED по IAP + Subscriptions

См. [`docs/apple-review-response-2026-01-12.md`](apple-review-response-2026-01-12.md). Три причины:
- 2.2 Beta Testing — выглядит как тестовая версия
- 2.1 App Completeness — IAP "product not available"
- 3.1.2 Subscriptions — нет ссылки на Terms of Use

### 2026-05-29 — `1.7.4 (202605272243)` REJECTED по Face Data privacy

**Submission ID:** `52d43b89-8877-45c3-ac85-e04c5a60901b`
**Review Device:** iPhone 17 Pro Max + Apple Watch
**Reviewer:** Apple Review (Hello, … message)

**Guideline 2.1 — Information Needed:**

Apple просит детальные ответы про face data:
- Какие face data app собирает?
- Все планируемые использования собранных данных?
- Делитесь ли с third parties? Где хранятся?
- Сколько хранятся?
- Где в privacy policy это описано? Конкретные секции?
- Конкретный текст из privacy policy про face data?

**Также:** «Does your app implement third-party AI for the Voice and Face check?»

**Странность:** уже были approved сборки с этими же фичами (eye-scan / NervousSystemScan + emotional check по voice — обе появились в 1.7.x track). Reviewer задаёт вопросы ретроспективно — вероятно, новый reviewer или escalation.

**План ответа** (TBD — отдельный doc):
- Eye-scan (NervousSystemScan) использует **MediaPipe Face Landmarker** локально на устройстве через WASM (`public/mediapipe/face_landmarker.task`). Face data **не покидает устройство**, не отправляется на сервера, не делится с third parties.
- Voice (emotional check) — recording → отправка на наш backend для эмоционального анализа → result. Audio retention TBD проверить на серверной стороне.
- Privacy Policy секцию обновить (если не покрывает явно).

---

## App Store Connect display version

Apple Connect показывает «iOS приложение **1.1.4**» рядом с актуальным build `1.7.4 (202605272243)`. Это **отдельная нумерация App Store Connect** — итерация submission слотов, не CFBundleShortVersionString.

**Почему так:**
- `MARKETING_VERSION` в `project.pbxproj` шёл `1.0` → `1.0.x` → … → `1.7.x` (наша внутренняя нумерация).
- App Store Connect ведёт отдельный counter «App Version» для каждого submission slot — это видимое в Connect число.
- Они не обязаны совпадать; Apple отображает то что в submission'е (`1.7.4 (202605272243)`).

**Не путать с CFBundleVersion (build number):** до v1.7.3 build всегда был `= 1`. В 1.7.3 bump'нули до `= 2` (опасение что Apple отклонит дубликат), потом в 1.7.4 ресетнули обратно `= 1`. Сейчас правило (см. [`feedback-workflow-patterns.md`](../memory/feedback-workflow-patterns.md)): build трогать не надо, CI генерит уникальный timestamp-штамп (см. build номер в названии `202605272243` — это `YYYYMMDDHHMM`).

---

## Источники

- `git log --all -p -- ios/App/App.xcodeproj/project.pbxproj` — все MARKETING_VERSION transitions
- `git log --all --grep="bump\|reject\|app store" -i` — упоминания rejection'ов в commit messages
- `docs/apple-review-response-2026-01-12.md` — детальный ответ на январский rejection
- Память: `memory/ios-app-state.md` — текущее состояние v1.7.x
- App Store Connect → My Apps → ONDA → TestFlight / App Review Submissions

---

## Как обновлять этот файл

После каждого MARKETING_VERSION bump'а в `project.pbxproj`:
1. Добавить строчку в таблицу с датой и кратким описанием.
2. Если был rejection — добавить полную секцию в **REJECTED submissions** с submission ID и причинами.
3. Если был APPROVED — пометить в основной таблице.
4. Если переход тематический (новая эпоха фич) — добавить секцию в **Тематические эпохи**.
5. Добавить запись в **Release notes archive** ниже (What's New + sanitised Reviewer Notes + Outcome).

**Правила архива:**
- Demo account credentials → НИКОГДА в репо. Заменять на `[redacted — see App Store Connect]`.
- Бэкфилить только 1.7.x и новее. Старые версии остаются строкой в основной таблице.
- После ревью обязательно дописать **Outcome:** одной строкой — это даёт pattern-match на будущие rejection'ы.
- Длинные notes сворачивать в `<details>` для читаемости.

---

## Release notes archive

Архив текстов, отправленных в App Store Connect: What's New (публичный, store listing) + Reviewer Notes (для App Review). Demo credentials удалены.

### 1.7.5 — submitted 2026-05-29

**What's New (EN):**
> • Live heart-rate, stress, and energy trend chart on the home screen
> • Smoother subscription experience
> • Small polish across the app

**What's New (RU):**
> • График пульса, стресса и энергии в реальном времени на главном экране
> • Плавнее работа с подпиской
> • Мелкие улучшения интерфейса

<details>
<summary>Reviewer Notes</summary>

```
Hello App Review Team,

Version 1.7.5 contains the following changes since the last
approved build (1.7.3):

1. Home screen: a new compact line chart visualises the current
   heart-rate, stress, and energy trends already shown as numeric
   tiles above. The chart reads existing biometric data — no new
   permissions and no new data collection.

2. Home screen layout refined: biometric overview tiles, clearer
   practice descriptions, and updated welcome screens for individual
   practices with educational context. No new features, no new
   permissions, no new data flows.

3. Subscription analytics: internal correction so that paid
   conversions and free-trial starts are reported as separate
   events. No change to user-facing pricing, paywall content,
   or subscription terms.

4. Subscription screen: the default highlighted plan is now the
   monthly plan instead of the yearly plan. All plans, prices,
   and trial terms remain unchanged.

5. App rating: a standard SKStoreReviewController prompt is now
   shown after a user completes their second guided practice,
   subject to Apple's system-level frequency rules.

6. Minor UI polish on the home screen and subscription screen.

No changes to data collection, third-party SDKs, sign-in flows,
permissions, or in-app purchases beyond the above.

Demo account:
  Email:    [redacted — see App Store Connect]
  Password: [redacted — see App Store Connect]

Thank you,
The ONDA Life team
```

</details>

**Outcome:** _pending review_

---

### 1.7.4 — submitted 2026-05-27, build `202605272243`

Содержательно покрывает: split Firebase events (trial_started ≠ subscription_paid), paywall default monthly, MetricsWaveform graph на хабе.

<details>
<summary>Reviewer Notes (что отправляли)</summary>

Полного архива текста не сохранилось. Известно, что notes описывали MetricsWaveform и split событий, без явного упоминания Face/Voice Check.

</details>

**Outcome:** ❌ **REJECTED** 2026-05-29 — Guideline 2.1 (Information Needed), вопросы про face data privacy. Submission ID `52d43b89-8877-45c3-ac85-e04c5a60901b`. Билд удалён до отправки нового ответа; функциональность перенесена в 1.7.5 с обновлённой privacy policy. Подробности — секция **REJECTED submissions** выше.

---

### 1.7.3 — submitted 2026-05-23

Содержательно: убран ATT prompt (полностью, не «отложен»), скрыт авто-показ первых трёх экранов онбординга, push notification primer отложен до 2-й успешной практики.

<details>
<summary>Reviewer Notes (что отправляли)</summary>

Notes объясняли: удаление ATT (мы остаёмся в SKAN-only режиме через Tenjin), причина скрытия онбординга (UX optimization для cold-start), и что push primer теперь триггерится после value moment, а не сразу.

</details>

**Outcome:** ✅ **APPROVED**. С этой сборки Face Check + Voice Check уже присутствовали (added в 1.7.1) и Apple их одобрил без вопросов.

---

### 1.7.2 — submitted 2026-05-20

Содержательно: bugfix-релиз после 1.7.1 (детали по коммитам в основной таблице).

**Outcome:** ✅ **APPROVED**. Face Check + Voice Check без вопросов.

---

### 1.7.1 — submitted 2026-05-17

Содержательно: первая сборка с **NervousSystemScan** (Face Check on-device MediaPipe) и Voice Check (Hume AI prosody).

<details>
<summary>Reviewer Notes (что отправляли)</summary>

Notes описывали новый экран «Nervous System Scan» как биофидбэк-инструмент. Apple одобрил без вопросов про face data — что делает rejection 1.7.4 reviewer-зависимым, а не policy-обусловленным.

</details>

**Outcome:** ✅ **APPROVED**. Это baseline для всех будущих ссылок «эта фича уже была одобрена».
