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

## Система видов (View System)

Главный компонент `onda-level1-demo_27.tsx` использует каскад `if/return` для переключения видов:

```typescript
// Порядок return'ов в OndaLevel1:
if (activePractice) return (...);           // 1. Экран практики (полноэкранный)
if (showOnboarding) return (...);           // 2. Онбординг (полноэкранный)
if (activeView === 'addon') return (...);   // 3. Addon-страница (полноэкранный)
return (...);                               // 4. Основной вид Part
```

### activeView — переключение main/addon

```typescript
const [activeView, setActiveView] = useState<'main' | 'addon'>('main');
```

- `'main'` — основная страница Part (практики, story, артефакты)
- `'addon'` — полноэкранная страница расширенной информации о части (протокол, научная база)

Автосброс при переключении Part:
```typescript
useEffect(() => { setActiveView('main'); }, [activeCircuit]);
```

**Подробнее:** см. `.assistant/CONTENT_STRUCTURE.md` → "Аддоны (Addon-страницы)"

---

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

---

## 🏆 Система артефактов

### Два типа артефактов

| Тип | Описание | Условие разблокировки |
|-----|----------|----------------------|
| **Артефакт контура** | За прохождение всех практик части | Все практики с `isValidForArtifact = true` |
| **Динамический артефакт** | За качество 100% в N практиках | Определённое количество сессий с `quality >= 100` |

### Хранение и сохранение

**Где хранятся:**
- **Supabase:** таблица `user_game_progress`, поле `artifacts` (JSON массив)
- **React state:** `const [artifacts, setArtifacts] = useState([])`

**Структура артефакта:**
```typescript
// Артефакт контура
{
  circuitId: 5,                    // ID контура
  name: "Territory's Pulse",       // Название (из circuit.artifact)
  bonus: 30,                       // % бонуса к OND
  requirement: "Complete all..."   // Описание условия
}

// Динамический артефакт
{
  id: 'clear-will',               // Уникальный ID
  name: "Ясная Воля",
  bonus: 30,
  isClearWill: true               // Флаг типа артефакта
}
```

**Автосохранение:**
```typescript
// useEffect с debounce 1 секунда
const saveGameProgress = async () => {
  await supabase.from('user_game_progress').update({
    artifacts,  // Массив артефактов сохраняется целиком
    // ... другие поля
  }).eq('user_id', user.id);
};
```

**Загрузка при старте:**
```typescript
const { data: progress } = await supabase
  .from('user_game_progress')
  .select('*')
  .eq('user_id', user.id);

// Миграции применяются здесь
const migratedArtifacts = (progress.artifacts || [])
  .filter((a: any) => a.circuitId !== 5);  // Пример миграции
setArtifacts(migratedArtifacts);
```

---

### Артефакты контуров (Circuit Artifacts)

| Part | Артефакт | Бонус | Условие |
|------|----------|-------|---------|
| 1 | Roots of Being | +20% | Все практики части 1 |
| 2 | Pearl of Flow | +35% | Все практики части 2 |
| 3 | Crystal of Grounding | +50% | Все практики части 3 |
| 4 | Listen Heart | +20% | Все практики части 4 |
| 5 | Territory's Pulse | +30% | Все практики части 5 |

**Логика разблокировки:**
```typescript
const allValidated = circuit.practices.every(p => 
  completedPractices[p.id]?.isValidForArtifact
);

if (allValidated && circuit.artifact && !artifacts.some(a => a.circuitId === circuit.id)) {
  setArtifacts(prev => [...prev, { 
    ...circuit.artifact, 
    circuitId: circuit.id 
  }]);
}
```

**Важно:** Артефакт копируется из `circuit.artifact` на момент разблокировки. Если позже изменить `bonus` в коде — уже разблокированный артефакт сохранит старое значение.

---

### Динамические артефакты (Achievement Artifacts)

| ID | Артефакт | Бонус | Условие |
|----|----------|-------|---------|
| `life-rhythm` | Ритм Жизни | +100% | 7 дней подряд практик |
| `clear-will` | Ясная Воля | +30% | 3 любые практики с quality ≥ 100% |
| `inner-wave` | Внутренняя Волна | +30% | 6 практик части 2 с quality ≥ 100% |
| `transformation-pulse` | Пульс Трансформации | +30% | 9 практик части 3 с quality ≥ 100% |
| `echo-of-joy` | Эхо Радости | +50% | 3 практики части 4 с quality ≥ 100% |
| `calm-power` | Спокойная Сила | +20% | 6 практик части 5 с quality ≥ 100% |
| `echo-of-power` | Эхо Власти | +50% | 12 практик части 5 с quality ≥ 100% |

**Логика разблокировки (useEffect):**
```typescript
const CLEAR_WILL_ARTIFACT_ID = 'clear-will';

useEffect(() => {
  const hasArtifact = artifacts.some(a => a.id === CLEAR_WILL_ARTIFACT_ID);
  const perfectPractices = practiceHistory.filter(p => p.quality >= 100).length;
  
  if (perfectPractices >= 3 && !hasArtifact) {
    setArtifacts(prev => [...prev, {
      id: CLEAR_WILL_ARTIFACT_ID,
      name: t('artifacts.clear_will'),
      bonus: 30,
      isClearWill: true
    }]);
  }
}, [practiceHistory, artifacts]);
```

---

### Расчёт бонуса OND

```typescript
const calculateBonus = () => {
  return artifacts.reduce((sum, a) => sum + a.bonus, 0);
};

// При завершении практики
const artifactBonus = calculateBonus();           // Сумма всех бонусов (например 85%)
const bonusMultiplier = 1 + artifactBonus / 100;  // 1.85
const totalOndWithBonus = Math.round(ondReward.totalOnd * bonusMultiplier * 100) / 100;
```

---

### Миграции артефактов

При изменении параметров артефакта (название, бонус) нужно удалить старый:

```typescript
// В loadUserData(), после получения progress
const migratedArtifacts = (progress.artifacts || [])
  .filter((a: any) => a.circuitId !== 5);  // Удаляем артефакт части 5
setArtifacts(migratedArtifacts);
```

**⚠️ После миграции:** пользователю нужно заново пройти практики для разблокировки артефакта с новыми параметрами.

---

### Отображение в UI

**Секция "Part N Artifacts"** — показывает определения из `circuit.artifact`:
```typescript
{currentCircuit.artifact && (
  <div>
    <h3>{currentCircuit.artifact.name}</h3>
    <p>{currentCircuit.artifact.requirement}</p>
    <div>+{currentCircuit.artifact.bonus}% OND</div>
  </div>
)}
```

**Секция "Your Artifacts"** — показывает разблокированные из `artifacts`:
```typescript
{artifacts.map(artifact => (
  <div>
    <h4>{artifactName}</h4>
    <p>{artifactDesc}</p>
    <div>+{artifact.bonus}% OND</div>  {/* Значение на момент разблокировки */}
  </div>
))}
```

---

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
