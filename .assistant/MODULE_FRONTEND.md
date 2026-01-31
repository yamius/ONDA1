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

## Система практик и прогресса

### Структура данных практик

```typescript
// State пройденных практик
const [completedPractices, setCompletedPractices] = useState({});

// Структура completedPractices[practiceId]:
{
  quality: number,              // Лучший показатель качества (0-100%)
  qnt: number,                  // Количество заработанных OND
  sessions: string[],           // Массив ID сессий этой практики
  isValidForArtifact: boolean   // Засчитана ли для артефакта контура
}
```

### Условия валидации практики (isValidForArtifact)

Практика засчитывается как "пройденная" для артефакта если:

```typescript
const timePercent = practiceTime / (activePractice.targetTime || 720);
const hasRealMetrics = freshVitals.hasVitalsData;
const minQualityRequired = hasRealMetrics ? 70 : 33;

const isValidForArtifact = timePercent >= 0.8 && qualityScore >= minQualityRequired;
```

| Условие | С биометрией | Без биометрии |
|---------|--------------|---------------|
| Время | ≥80% от целевого | ≥80% от целевого |
| Качество | ≥70% | ≥33% |

### Расчёт качества (qualityScore)

```typescript
// Снижение стресса (10% = хорошо)
const stressReduction = initialVitals.stress - currentStress;
const stressScore = Math.min(Math.max(stressReduction / (initialVitals.stress * 0.1), 0), 1) * 100;

// Повышение энергии (10% = хорошо)  
const energyIncrease = currentEnergy - initialVitals.energy;
const energyScore = Math.min(Math.max(energyIncrease / (initialVitals.energy * 0.1), 0), 1) * 100;

// Комбинированный скор: 40% стресс + 45% энергия
const performanceScore = (stressScore * 0.40 + energyScore * 0.45);

// Итоговое качество
rawQuality = currentTime >= targetTime 
  ? 15 + (performanceScore * 0.85)           // После 100% времени
  : (timeProgress * 0.15 + performanceScore * 0.85);  // До 100% времени
```

### Прогресс-бар контура

```typescript
const currentCircuit = circuits[activeCircuit - 1];
const totalPractices = currentCircuit.practices.length;
// Считаются ТОЛЬКО валидированные практики
const completedCount = currentCircuit.practices.filter(
  p => completedPractices[p.id]?.isValidForArtifact
).length;
const progress = (completedCount / totalPractices) * 100;
```

### Получение артефакта контура

Артефакт выдаётся когда ВСЕ практики контура имеют `isValidForArtifact = true`:

```typescript
const allValidated = circuit.practices.every(p => 
  completedPractices[p.id]?.isValidForArtifact
);

if (allValidated && !artifacts.some(a => a.circuitId === circuit.id)) {
  setArtifacts(prev => [...prev, { ...circuit.artifact, circuitId: circuit.id }]);
}
```

### Achievements (достижения)

| ID | Условие |
|----|---------|
| `circuit_1` | Все практики 1-го контура пройдены |
| `all_circuits` | Все практики ВСЕХ контуров пройдены |
| `streak_3` | 3 дня подряд практик |
| `marathoner` | 50 практик всего |
| `quality_master` | 10 практик с качеством >90% |
| `time_master` | 10 часов общего времени |
| `collector` | 3 артефакта собрано |

### Файлы

| Файл | Что содержит |
|------|--------------|
| `src/onda-level1-demo_27.tsx` | Вся логика практик, прогресса, артефактов |
| `src/utils/ondCalculator.ts` | Расчёт OND награды |
| `src/lib/supabase.ts` | Типы для `user_game_progress` |
