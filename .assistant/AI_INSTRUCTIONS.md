# AI_INSTRUCTIONS — Инструкция для ИИ

Ты помогаешь развивать проект ONDA — приложение для медитации и осознанности с интеграцией биометрии.

## Перед началом работы

1. **Прочитай:**
   - `replit.md` — обзор проекта, архитектура, зависимости
   - `.assistant/PHILOSOPHY.md` — правила работы

---

## 🔗 Работа с GitHub Gists

**ВАЖНО:** Пользователь часто даёт ссылки на gist для контента. Используй правильный способ сразу!

### ✅ Рабочий способ (используй этот):

```bash
curl -sL "https://gist.githubusercontent.com/{user}/{gist_id}/raw"
```

**Пример:**
```bash
# Ссылка от пользователя: https://gist.github.com/yamius/1c0df3f9899b77d83ee3496013046d3d
# Команда:
curl -sL "https://gist.githubusercontent.com/yamius/1c0df3f9899b77d83ee3496013046d3d/raw"
```

### ❌ НЕ работает (не пробуй):

- `gh gist view {id}` — HTTP 403 (ограничения интеграции)
- `curl https://gist.github.com/...` — возвращает HTML, не содержимое

### Как извлечь gist_id из ссылки:

```
https://gist.github.com/yamius/1c0df3f9899b77d83ee3496013046d3d
                        ↑       ↑
                       user    gist_id
```

---

2. **В зависимости от задачи:**
   - Фронтенд (React) → `.assistant/MODULE_FRONTEND.md`
   - iOS/Android нативное → `.assistant/MODULE_NATIVE.md`
   - Supabase (Auth, DB, Functions) → `.assistant/MODULE_SUPABASE.md`
   - **Создание новых частей (контуров)** → `.assistant/CONTENT_STRUCTURE.md`

## Git: Работа с ветками

**⚠️ ВАЖНО: Работай ТОЛЬКО в ветке `main`!**

- Не создавай feature-ветки без явной просьбы
- Все коммиты делай напрямую в `main`
- При push используй: `git push origin main`

## Общие правила

- Соблюдай все пункты из `.assistant/PHILOSOPHY.md`.
- Не меняй структуру проекта кардинально без явной просьбы.
- Изменения предлагай небольшими порциями.
- Всегда объясняй, куда вставлять код и как его проверить.

## 🇷🇺 Язык коммуникации

**ВСЕ тексты пиши на русском языке:**
- Ответы пользователю
- Процессные комментарии (thinking/мысли)
- Описания к командам (description в Shell)
- TODO списки
- Комментарии к коммитам (commit messages можно на английском для GitHub)

Пользователь читает все процессные тексты и хочет понимать ход рассуждений.

## Критические файлы (не трогать без согласования)

- `src/onda-level1-demo_27.tsx` — главный компонент (4000+ строк)
- `src/hooks/useVitals.ts` — расчёт vitals из HR
- `src/utils/ondCalculator.ts` — расчёт награды OND
- `ios/App/` — нативный iOS код
- `supabase/functions/` — Edge Functions

## Build Environment

**ВАЖНО:** У пользователя **НЕТ Mac**. Все iOS сборки происходят через:

1. **GitHub Actions** — автоматическая сборка при push в main
2. **TestFlight** — распространение тестовых сборок
3. **Fastlane** — автоматизация code signing и деплоя

### Что это значит для разработки:

- ❌ Нельзя попросить "запусти `npx cap open ios`" — нет Xcode
- ❌ Нельзя попросить локальную iOS сборку
- ✅ Изменения iOS кода проверяются через CI/CD pipeline
- ✅ После push в main — ждать сборку в GitHub Actions
- ✅ Тестирование на реальном устройстве через TestFlight

### Workflow

1. Cursor/Replit → редактирование кода
2. Git push → GitHub
3. GitHub Actions → автоматическая сборка iOS (Fastlane)
4. TestFlight → установка на iPhone для тестирования

### Native iOS изменения

При изменении Swift кода (`ios/App/`):
- Код попадает в сборку автоматически при следующем push
- Capacitor плагины синхронизируются в CI (`npx cap sync ios`)
- Проверка ошибок компиляции — в логах GitHub Actions
