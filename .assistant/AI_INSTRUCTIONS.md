# AI_INSTRUCTIONS — операционная инструкция для ИИ-агента

Ты помогаешь развивать **ONDA** — приложение для осознанности с биометрией (камера-/
watch-пульс, практики, геймификация) + SEO-лендинг. Обращайся к пользователю **на «ты»**,
все процессные тексты (мысли, описания команд, ответы) — **на русском**; commit-messages
можно на английском.

## Перед началом — что читать
1. **[`../docs/README.md`](../docs/README.md)** — единый индекс всей документации (приложение, нативка, бэкенд, лендинг).
2. **[`../CONTRIBUTING.md`](../CONTRIBUTING.md)** — git/PR-политика и правила вкладов (это источник истины по git, не дублируй здесь).
3. По задаче — нужный док из `docs/`:
   - React-фронтенд → [`../docs/architecture/frontend.md`](../docs/architecture/frontend.md)
   - iOS/Android нативка → [`../docs/architecture/native.md`](../docs/architecture/native.md)
   - Supabase (Auth/DB/Functions) → [`../docs/architecture/supabase.md`](../docs/architecture/supabase.md)
   - Аналитика (канон событий) → [`../docs/architecture/analytics.md`](../docs/architecture/analytics.md)
   - Практики/части (контент) → [`../docs/guides/authoring-content.md`](../docs/guides/authoring-content.md)
   - Лендинг → [`../landing/docs/architecture.md`](../landing/docs/architecture.md) (+ [`emoton.md`](../landing/docs/emoton.md))
   - Запуск/сборка/env → [`../docs/getting-started/environment.md`](../docs/getting-started/environment.md)

## Как работать
- **Размер изменений:** один запрос — один логичный шаг. Крупное — сначала план, согласуй.
- **Где править:** по умолчанию существующие файлы; не плоди `*_fix`/`*_final`/`*_new`. Главный компонент приложения — `src/onda-level1-demo_27.tsx` (~8400 строк).
- **После правок:** кратко что/где изменил и как проверить.
- **Несоответствие кода и доки:** укажи на него и поправь доку (она должна совпадать с кодом).

## ⛔ Контент: не выдумывать практики
- НЕ создавай практики/тексты «из воздуха» — `practices: []`, пока пользователь не дал реальный контент.
- В чате «Практики» — только практики: не трогай артефакты, не создавай части, не меняй структуру.

## 🌍 Локализация
Русский — **оригинал**, остальные (en/es/uk/zh) — переводы с русского. Ключи — латиницей.
Файлы: `public/locales/<lang>/translation.json` (`ru/` = источник). Не переводи обратно на русский и не меняй русский текст пользователя.

## Система разблокировки частей (Parts)
Part 1 всегда открыта; Part N открывается, когда все практики Part (N-1) засчитаны
(`completedPractices[id]?.isValidForArtifact === true`). Логика — `isPartUnlocked()` в
`src/onda-level1-demo_27.tsx`. Для dev все части открыты через `VITE_UNLOCK_ALL_PARTS=true`
(`.env.development`) — подробности в [`../docs/getting-started/environment.md`](../docs/getting-started/environment.md).

## GitHub Gists (частый источник контента)
Рабочий способ — raw через curl (не `gh gist view`, не обычный URL):
```bash
curl -sL "https://gist.githubusercontent.com/{user}/{gist_id}/raw"
```

## Сборка iOS (важно)
У пользователя **нет Mac** — никаких локальных iOS-сборок/Xcode. iOS собирается в **GitHub
Actions** (Fastlane) → **TestFlight**; Swift-код (`ios/App/`) попадает в сборку при push,
Capacitor синхронится в CI. Проверка ошибок — в логах Actions.

## Критические файлы (не трогать без согласования)
`src/onda-level1-demo_27.tsx` · `src/hooks/useVitals.ts` · `src/utils/ondCalculator.ts` ·
`ios/App/` (нативный iOS) · `supabase/functions/` (Edge Functions).
