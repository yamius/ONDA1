# MODULE_FRONTEND — Архитектура фронтенда ONDA

## Стек
- React 18 + TypeScript
- Vite (сборка)
- TailwindCSS (стили)
- i18next (интернационализация: EN, ES, RU, UK, ZH)
- Capacitor (мост к нативным API)

## Структура `src/`

```
src/
├── components/          # UI компоненты
│   ├── AdaptivePracticeModal.tsx   # Адаптивные практики
│   ├── AuthModal.tsx               # Авторизация
│   ├── ConnectionModal.tsx         # Подключение устройств
│   ├── VitalsDiagnostics.tsx       # Диагностика vitals
│   └── ...
├── hooks/               # React хуки
│   ├── useVitals.ts                # Расчёт stress/energy из HR
│   ├── heartRateStore.ts           # Глобальное хранилище HR
│   ├── useWatchHeartRate.ts        # Apple Watch HR
│   ├── useHealthKitHeartRate.ts    # HealthKit HR
│   ├── useHealthConnect.ts         # Android Health Connect
│   └── ...
├── utils/               # Утилиты
│   ├── ondCalculator.ts            # Расчёт награды OND
│   ├── biometricCalculations.ts    # HRV, stress, energy формулы
│   └── ...
├── lib/                 # Библиотеки
│   ├── supabase.ts                 # Supabase клиент
│   └── ...
├── pages/               # Страницы (если используется роутинг)
├── types/               # TypeScript типы
│   └── android.d.ts                # Типы для Android bridge
├── bot/                 # Терапевтический бот Liza
├── bridge/              # Мост WebView ↔ Native
├── sleep/               # Модуль сна и ритма
├── plugins/             # Capacitor плагины
├── tests/               # Тесты (Vitest)
├── onda-level1-demo_27.tsx  # ГЛАВНЫЙ КОМПОНЕНТ
├── App.tsx              # Корневой компонент
├── main.tsx             # Точка входа
├── i18n.ts              # Конфигурация i18next
└── index.css            # Глобальные стили
```

## Принципы

1. **Главный компонент** — `onda-level1-demo_27.tsx` содержит основную логику приложения.
2. **Новые компоненты** добавлять в `src/components/`.
3. **Бизнес-логику** выносить в хуки (`src/hooks/`) или утилиты (`src/utils/`).
4. **Типы** определять в `src/types/`.
5. **Не дублировать код** — переиспользовать компоненты и хуки.

## Важные хуки

| Хук | Назначение |
|-----|------------|
| `useVitals` | Агрегирует HR из всех источников, рассчитывает stress/energy |
| `heartRateStore` | Zustand store для глобального HR |
| `useWatchHeartRate` | Получение HR с Apple Watch через WCSession |
| `useHealthKitHeartRate` | Polling HR из HealthKit |
| `useKeepAwake` | Блокировка засыпания экрана |

## Паттерн vitalsRef

Для получения свежих данных в async функциях используется `vitalsRef`:

```typescript
const vitalsData = useVitals();
const vitalsRef = useRef(vitalsData);
vitalsRef.current = vitalsData;

// В async функции:
const freshVitals = vitalsRef.current;
```
