# Apple Watch HR Streaming — Полная цепочка

## Обзор архитектуры

```
┌─────────────────┐     WCSession      ┌─────────────────┐
│   iPhone App    │ ◄──────────────────► │  Apple Watch    │
│   (Capacitor)   │    (Bluetooth)      │   (watchOS)     │
└────────┬────────┘                     └────────┬────────┘
         │                                       │
         ▼                                       ▼
┌─────────────────┐                     ┌─────────────────┐
│  OndaWatchPlugin│                     │ WorkoutManager  │
│     (Swift)     │                     │    (Swift)      │
└────────┬────────┘                     └────────┬────────┘
         │                                       │
         ▼                                       ▼
┌─────────────────┐                     ┌─────────────────┐
│ OndaWatchManager│                     │HKWorkoutSession │
│  (WCSession)    │                     │  (HealthKit)    │
└────────┬────────┘                     └────────┬────────┘
         │                                       │
         ▼                                       │
┌─────────────────┐                              │
│   JavaScript    │ ◄────────────────────────────┘
│  (React hooks)  │      heartRate events
└─────────────────┘
```

---

## Файлы и их роли

### 1. JavaScript/React Layer

| Файл | Роль |
|------|------|
| `src/plugins/ondaWatch.ts` | TypeScript обёртка для Capacitor плагина |
| `src/hooks/useWatchHeartRate.ts` | React hook для управления Watch HR |
| `src/hooks/useVitals.ts` | Агрегатор всех источников HR (BLE, HealthKit, Watch) |
| `src/onda-level1-demo_27.tsx` | Основной компонент, вызывает start/stop при практике |
| `src/components/AdaptivePracticeModal.tsx` | Адаптивные практики, вызывает start/stop |

### 2. iOS Native Layer (iPhone)

| Файл | Роль |
|------|------|
| `ios/App/App/OndaWatchPlugin.swift` | Capacitor плагин, мост JS ↔ Swift |
| `ios/App/App/AppDelegate.swift` | Активация WCSession при запуске |

### 3. watchOS Layer (Apple Watch)

| Файл | Роль |
|------|------|
| `ios/App/OndaWatch Watch App/WorkoutManager.swift` | Управление HKWorkoutSession |
| `ios/App/OndaWatch Watch App/ContentView.swift` | UI часов |
| `ios/App/OndaWatch Watch App/OndaWatchApp.swift` | Entry point watchOS app |

---

## Детальная цепочка: Старт практики → HR на экране

### Шаг 1: Пользователь нажимает "Начать практику"

**Файл:** `src/onda-level1-demo_27.tsx`
```typescript
const beginPractice = () => {
  // ... инициализация практики ...
  
  // Start Apple Watch HR streaming
  if (watchHeartRate.watchStatus?.reachable) {
    console.log('[Basic Practice] Starting Watch HR streaming');
    watchHeartRate.startRealtime().catch(err => {
      console.error('[Basic Practice] Failed to start Watch:', err);
    });
  }
};
```

### Шаг 2: Hook вызывает Capacitor плагин

**Файл:** `src/hooks/useWatchHeartRate.ts`
```typescript
const startRealtime = useCallback(async () => {
  if (!watchStatus?.reachable) {
    addLog('Watch not reachable');
    return;
  }
  
  setIsMonitoring(true);
  addLog('Starting realtime...');
  
  try {
    await OndaWatch.startRealtime();  // ← Вызов плагина
    addLog('Realtime started');
    
    // Heartbeat каждые 5 сек для keep-alive
    heartbeatIntervalRef.current = setInterval(() => {
      OndaWatch.sendHeartbeat();
    }, 5000);
  } catch (err) {
    addLog(`Start error: ${err}`);
    setIsMonitoring(false);
  }
}, [watchStatus?.reachable, addLog]);
```

### Шаг 3: Плагин отправляет команду на Watch

**Файл:** `ios/App/App/OndaWatchPlugin.swift`
```swift
@objc func startRealtime(_ call: CAPPluginCall) {
    print("[ONDA Plugin] startRealtime called")
    implementation.sendCommand(type: "start")  // ← Отправка через WCSession
    call.resolve()
}

// В OndaWatchManager:
func sendCommand(type: String) {
    guard let session = session else { return }
    
    if session.isReachable {
        session.sendMessage(["command": type], replyHandler: nil) { error in
            self.addDebugLog("Send error: \(error)")
        }
    }
}
```

### Шаг 4: Watch получает команду и запускает Workout

**Файл:** `ios/App/OndaWatch Watch App/WorkoutManager.swift`
```swift
// WCSessionDelegate - получение сообщения
func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
    if let command = message["command"] as? String {
        if command == "start" {
            startWorkout()  // ← Запуск HKWorkoutSession
        } else if command == "stop" {
            stopWorkout()
        }
    }
}

func startWorkout() {
    let config = HKWorkoutConfiguration()
    config.activityType = .mindAndBody  // Медитация
    config.locationType = .indoor
    
    session = try HKWorkoutSession(healthStore: healthStore, configuration: config)
    builder = session?.associatedWorkoutBuilder()
    
    // HKLiveWorkoutDataSource автоматически читает HR
    builder?.dataSource = HKLiveWorkoutDataSource(
        healthStore: healthStore, 
        workoutConfiguration: config
    )
    
    session?.delegate = self
    builder?.delegate = self
    
    session?.startActivity(with: Date())
    builder?.beginCollection(withStart: Date()) { success, error in
        self.isActive = true  // Workout запущен!
    }
}
```

### Шаг 5: Watch отправляет HR на iPhone

**Файл:** `ios/App/OndaWatch Watch App/WorkoutManager.swift`
```swift
// HKLiveWorkoutBuilderDelegate - новые данные HR
func workoutBuilder(_ workoutBuilder: HKLiveWorkoutBuilder, 
                    didCollectDataOf collectedTypes: Set<HKSampleType>) {
    for type in collectedTypes {
        guard let quantityType = type as? HKQuantityType,
              quantityType == HKQuantityType.quantityType(forIdentifier: .heartRate) 
        else { continue }
        
        if let statistics = workoutBuilder.statistics(for: quantityType) {
            let hrUnit = HKUnit.count().unitDivided(by: .minute())
            if let value = statistics.mostRecentQuantity()?.doubleValue(for: hrUnit) {
                DispatchQueue.main.async {
                    self.heartRate = value
                    self.sendHeartRateToPhone(value)  // ← Отправка на iPhone
                }
            }
        }
    }
}

private func sendHeartRateToPhone(_ hr: Double) {
    guard WCSession.default.isReachable else { return }
    WCSession.default.sendMessage(["heartRate": hr], replyHandler: nil)
}
```

### Шаг 6: iPhone получает HR и передаёт в JS

**Файл:** `ios/App/App/OndaWatchPlugin.swift`
```swift
// WCSessionDelegate - получение HR с часов
func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
    if let hr = message["heartRate"] as? Double {
        receivedCount += 1
        addDebugLog("HR: \(Int(hr)) bpm (#\(receivedCount))")
        
        // Отправка в JavaScript через Capacitor
        DispatchQueue.main.async {
            self.plugin?.notifyListeners("heartRate", data: [
                "value": hr,
                "source": "watch",
                "timestamp": ISO8601DateFormatter().string(from: Date())
            ])
        }
    }
}
```

### Шаг 7: React hook получает HR

**Файл:** `src/hooks/useWatchHeartRate.ts`
```typescript
// Listener для событий heartRate
hrListener = await OndaWatch.addListener(
  'heartRate',
  (event: HeartRateEvent) => {
    setHeartRate(Math.round(event.value));  // ← HR в state
    setLastUpdated(new Date());
    setError(null);
  }
);
```

### Шаг 8: useVitals агрегирует источники

**Файл:** `src/hooks/useVitals.ts`
```typescript
// Приоритет источников HR:
const hr = bleHR.hr 
  ?? hkHeartRate          // HealthKit (iOS polling)
  ?? watchHR.heartRate    // Apple Watch realtime ← ЭТОТ
  ?? notificationHR;
```

### Шаг 9: Компонент отображает HR

**Файл:** `src/onda-level1-demo_27.tsx` или `ConnectionModal.tsx`
```typescript
// vitalsData.hr теперь содержит пульс с часов
<span>{vitalsData.hr ?? '--'} BPM</span>
```

---

## Текущие проблемы и оптимизация

### Проблема 1: Часы не активируются автоматически

**Причина:** Пользователь должен:
1. Открыть ONDA Watch app на часах
2. Дать разрешения HealthKit
3. iPhone и Watch должны быть в зоне Bluetooth

**Решение:** Автоматическая активация при запуске практики уже реализована.
Но требуется один раз вручную открыть Watch app для permissions.

### Проблема 2: `isReachable` = false

**Причины:**
- Watch app не запущен (в фоне)
- Watch не на руке / экран выключен
- Bluetooth отключён

**Решение:** 
- Watch app должен работать в foreground во время практики
- HKWorkoutSession держит экран активным

### Проблема 3: Задержка первого HR

**Причина:** HKWorkoutSession нужно ~3-5 секунд для первого чтения.

**Решение:** Показывать loader "Connecting to Watch..." первые секунды.

---

## Оптимизация UX — минимум действий пользователя

### Текущий flow (требует 3-4 действия):
1. Открыть ONDA на iPhone
2. Открыть ONDA Watch на часах (вручную!)
3. Запустить практику
4. Ждать соединения

### Оптимизированный flow (1-2 действия):

**Вариант A: Complication на циферблате**
- Добавить Watch Complication
- Тап по complication → запуск Watch app + готовность к HR

**Вариант B: Background Watch App**
- Watch app всегда в памяти через Background App Refresh
- При старте практики на iPhone — мгновенная активация

**Вариант C: Auto-launch при WCSession**
- iOS отправляет `transferUserInfo` при запуске практики
- watchOS просыпается и запускает workout автоматически

### РЕАЛИЗОВАНО: Автозапуск через transferUserInfo

**iPhone (OndaWatchPlugin.swift):**
```swift
func sendCommand(type: String) {
    let message: [String: Any] = ["type": type]
    
    if session.isReachable {
        // Watch в foreground - мгновенная доставка
        session.sendMessage(message, replyHandler: nil)
    } else {
        // Watch в фоне - очередь для доставки при пробуждении
        session.transferUserInfo(message)
    }
}
```

**Watch (WorkoutManager.swift):**
```swift
// Realtime - когда Watch app активен
func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
    handleCommand(message)
}

// Background wake - пробуждает Watch app из фона!
func session(_ session: WCSession, didReceiveUserInfo userInfo: [String: Any]) {
    handleCommand(userInfo)  // Автоматический запуск workout
}

private func handleCommand(_ data: [String: Any]) {
    let cmd = (data["type"] as? String) ?? (data["command"] as? String)
    switch cmd {
    case "start": startWorkout()
    case "stop": stopWorkout()
    default: break
    }
}
```

**Результат:** Пользователю достаточно нажать "Начать практику" — Watch app запустится автоматически.

---

## Чек-лист для тестирования

- [ ] Watch app установлен (General → Apple Watch → ONDA)
- [ ] Watch на руке, экран активен
- [ ] Bluetooth включён на iPhone
- [ ] HealthKit permissions даны на Watch
- [ ] В логах: `[Watch] Status: paired=true, app=true, reach=true`
- [ ] При старте практики: `[Basic Practice] Starting Watch HR streaming`
- [ ] На Watch: экран workout с пульсом
- [ ] В приложении: HR обновляется каждые 1-5 секунд
