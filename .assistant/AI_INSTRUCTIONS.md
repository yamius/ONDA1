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
- `src/hooks/useWatchHeartRate.ts` — Apple Watch HR streaming
- `src/utils/ondCalculator.ts` — расчёт награды OND
- `ios/App/` — нативный iOS код
- `ios/App/OndaWatch Watch App/` — watchOS приложение
- `supabase/functions/` — Edge Functions

## КЛЮЧЕВЫЕ ПАТТЕРНЫ (ЗАПОМНИ!)

### Apple Watch Auto-Management
```typescript
// В OndaLevel1 (строки 42-50):
useEffect(() => {
  if (platform === 'ios' && watchHeartRate.watchStatus?.supported) {
    watchHeartRate.setAutoManaged(true);  // ← Автозапуск workout!
  }
}, [...]);
```
**Расчёты stress/energy/breathing идут АВТОМАТИЧЕСКИ при открытии приложения на iOS!**
Кнопки "Real-time/Direct/Workout" — для ручного режима, не обязательны.

### Vitals Calculation Flow
```
Watch HR → useWatchHeartRate → heartRateStore.addDataPoint()
                                      ↓
              useVitals (setInterval каждые 2 сек)
                                      ↓
              Расчёт stress, energy, breathing, HRV, CSI
```
Требуется минимум 10 точек в буфере (~10-20 сек) для начала расчётов.

### Watch Permission UI
На часах показываются ОБЕ кнопки когда `heartRate == 0`:
- "Дать разрешение" — вызывает системное окно HealthKit
- "Открыть Здоровье" — ведёт в настройки (если отклонил)

### Watch Notification System
```
iPhone открывает ONDA → transferUserInfo(["type": "start"])
    ↓
Watch получает → если не активен → уведомление с вибрацией
    ↓
Пользователь нажимает "Открыть" → workout стартует
```

### Extended Runtime Session
WKExtendedRuntimeSession (mindfulness) — до 1 часа активности часов без засыпания.

## Workflow

1. Replit → редактирование кода
2. GitHub → автоматический push
3. GitHub Actions → сборка iOS
4. TestFlight → тестирование на устройстве
