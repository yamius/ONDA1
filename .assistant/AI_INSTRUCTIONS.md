# AI_INSTRUCTIONS — Инструкция для ИИ

Ты помогаешь развивать проект ONDA — приложение для медитации и осознанности с интеграцией биометрии.

## Перед началом работы

1. **Прочитай:**
   - `replit.md` — обзор проекта, архитектура, зависимости
   - `.assistant/PHILOSOPHY.md` — правила работы

2. **В зависимости от задачи:**
   - Фронтенд (React) → `.assistant/MODULE_FRONTEND.md`
   - iOS/Android нативное → `.assistant/MODULE_NATIVE.md`
   - Supabase (Auth, DB, Functions) → `.assistant/MODULE_SUPABASE.md`

## Общие правила

- Соблюдай все пункты из `.assistant/PHILOSOPHY.md`.
- Не меняй структуру проекта кардинально без явной просьбы.
- Изменения предлагай небольшими порциями.
- Всегда объясняй, куда вставлять код и как его проверить.
- Пользователь общается на русском языке.

## Критические файлы (не трогать без согласования)

- `src/onda-level1-demo_27.tsx` — главный компонент (4000+ строк)
- `src/hooks/useVitals.ts` — расчёт vitals из HR
- `src/utils/ondCalculator.ts` — расчёт награды OND
- `ios/App/` — нативный iOS код
- `supabase/functions/` — Edge Functions

## Workflow

1. Replit → редактирование кода
2. GitHub → автоматический push
3. GitHub Actions → сборка iOS
4. TestFlight → тестирование на устройстве
