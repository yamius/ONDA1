# 🔧 Улучшения Debug Monitor + Автоматический запрос разрешений на Watch

## 📅 Дата: 23 декабря 2025

---

## 🎯 Решенные проблемы

### Проблема #1: На часах не появлялись окна выдачи разрешений
**Причина:** Команда `START` от iPhone приходила на Watch, но `HKWorkoutSession` не запускалась из-за отсутствия разрешений HealthKit. Разрешения никогда не запрашивались автоматически.

**Решение:** Добавлен автоматический запрос разрешений HealthKit при получении команды `START` или `REQUEST_OPEN`.

### Проблема #2: Невозможно отследить процесс связи iPhone ↔ Watch
**Причина:** Debug Monitor показывал только общие логи, без специфической информации о состоянии WCSession, разрешениях, HR данных.

**Решение:** Добавлена специальная панель "Apple Watch Diagnostics" с детальной информацией обо всех аспектах связи.

---

## ✨ Что добавлено

### 1. 🍎 Панель Watch Diagnostics в Debug Monitor

Новая панель показывает в реальном времени:

#### WCSession Status
- ✅ **Supported** - WCSession поддерживается
- ✅ **Paired** - Watch подключены к iPhone
- ✅ **App Installed** - ONDA установлена на Watch
- ✅ **Reachable** - Watch доступны для связи (горит зеленым, пульсирует)

#### Heart Rate Data
- **Last Value** - Последнее значение HR (бpm)
- **Last Update** - Время последнего обновления
- **Source** - Источник данных (watch/healthkit/notification)
- **Total Updates** - Количество полученных обновлений HR

#### Permissions (iPhone)
- ✅ **HealthKit** - Разрешение на чтение HR
- ✅ **Microphone** - Разрешение на микрофон

#### Communication
- **Last Command** - Последняя отправленная команда (START/STOP)
- **Command Time** - Время отправки команды
- **Last Event** - Последнее полученное событие от Watch
- **Event Time** - Время получения события

#### Connection Stats
- **Lost Count** - Количество разрывов связи
- **Restored Count** - Количество восстановлений связи
- **Last Change** - Время последнего изменения связи

#### Test Commands
Кнопки для быстрого тестирования:
- 🟢 **START** - Запустить мониторинг на Watch
- 🔴 **STOP** - Остановить мониторинг
- 🔵 **STATUS** - Запросить статус Watch
- 💜 **💓 PING** - Отправить heartbeat
- 🔷 **📳 REQUEST OPEN** - Попросить Watch открыться

#### Quick Diagnostics
Автоматические подсказки о проблемах:
- ⚠️ Watch not paired
- ⚠️ ONDA Watch app not installed
- ⚠️ Watch not reachable (may be in background)
- ⚠️ HealthKit permission not granted on iPhone
- ⚠️ No HR data - check Watch permissions
- ✅ All systems operational

---

### 2. 🔐 Автоматический запрос разрешений на Watch

#### В WorkoutManager.swift добавлено:

**При команде START:**
```swift
// Проверяем разрешения перед запуском workout
if !self.isAuthorized {
    print("[WorkoutManager] ⚠️ HealthKit permission NOT GRANTED - requesting now...")
    
    // Вибрация для привлечения внимания
    WKInterfaceDevice.current().play(.notification)
    
    // Запрашиваем разрешения
    self.requestAuthorizationWithCompletion { success in
        if success {
            print("[WorkoutManager] ✅ Permission granted, now starting workout")
            self.startWorkout()
        }
    }
    return
}
```

**При команде REQUEST_OPEN:**
```swift
// Проверяем разрешения при REQUEST_OPEN
if !self.isAuthorized {
    print("[WorkoutManager] ⚠️ No HealthKit permission - will request when app opens")
    
    // Если app активно - запрашиваем разрешения сразу
    if appState == .active {
        self.requestAuthorizationWithCompletion { success in
            if success {
                print("[WorkoutManager] ✅ Permission granted → ready for workout")
            }
        }
    }
    return
}
```

**Добавлено логирование статуса разрешений:**
```swift
// При каждой команде показываем текущий статус разрешений
print("[WorkoutManager] 🔐 HealthKit authorization status: \(statusStr)")
```

---

## 📱 Как использовать

### Тестирование улучшений:

1. **Откройте приложение на iPhone**
   - Debug Monitor теперь показывается автоматически (кнопка с жуком внизу слева)

2. **Откройте панель Watch Diagnostics**
   - Кликните на "Apple Watch Diagnostics"
   - Панель развернется с полной информацией

3. **Проверьте статус связи**
   - WCSession Status: все индикаторы должны быть зелеными
   - Reachable должен пульсировать зеленым если Watch активны

4. **Выдайте разрешения на iPhone**
   - Пройдите процесс выдачи разрешений
   - В панели Permissions должны загореться зеленые индикаторы

5. **Проверьте что происходит на часах**
   - Откройте ONDA на Apple Watch
   - Теперь АВТОМАТИЧЕСКИ появится диалог разрешений HealthKit! 🎉
   - Выдайте разрешения

6. **Наблюдайте за данными**
   - В Heart Rate Data появится значение пульса
   - Total Updates будет расти
   - В логах появятся сообщения `💗 HR: XX bpm`

### Использование тестовых команд:

**START** - Отправляет команду запуска на часы
```
Лог на часах:
[WorkoutManager] 🟢 START command received
[WorkoutManager] 🔐 HealthKit authorization status: AUTHORIZED ✅
[WorkoutManager] ✅ HealthKit permission already granted
[WorkoutManager] 🏃 Starting workout (app is active)
```

**STATUS** - Проверяет статус WCSession
```
Лог:
[DebugMonitor] Watch status: {
  supported: true,
  paired: true,
  watchAppInstalled: true,
  reachable: true
}
```

**💓 PING** - Отправляет heartbeat для проверки связи
```
Лог на часах:
[WorkoutManager] 💓 Heartbeat received (connection alive)
```

**📳 REQUEST OPEN** - Просит часы открыться и запросить разрешения
```
Лог на часах:
[WorkoutManager] 📳 REQUEST_OPEN command received
[WorkoutManager] 🔐 App active → requesting permissions now
```

---

## 🔍 Диагностика проблем

### Проблема: "Watch not reachable"

**Причина:** Приложение на часах в фоновом режиме или закрыто

**Решение:**
1. Нажмите кнопку **📳 REQUEST OPEN** в Debug Monitor
2. Часы завибрируют 3 раза
3. Откройте приложение ONDA на часах
4. Reachable загорится зеленым

---

### Проблема: "No HR data received yet - check Watch permissions"

**Причина:** На часах не выданы разрешения HealthKit

**Решение:**
1. Нажмите кнопку **START** в Debug Monitor
2. Посмотрите на часы - должен появиться диалог разрешений
3. Выдайте разрешения на чтение пульса
4. Через несколько секунд появятся данные HR

**Если диалог НЕ появился:**
- Откройте приложение ONDA на часах вручную
- Должен появиться экран с кнопкой "Разрешить"
- Нажмите "Разрешить"
- Выдайте разрешения в системном диалоге

---

### Проблема: "HealthKit permission NOT GRANTED"

**В логах видно:**
```
[WorkoutManager] 🔐 HealthKit authorization status: NOT_DETERMINED ⚠️
```

**Решение:** Разрешения будут запрошены автоматически при следующей команде START.

---

### Проблема: Connection Lost Count растет

**Причина:** Нестабильная связь Bluetooth или часы уходят в сон

**Что делать:**
- Проверьте Bluetooth на iPhone
- Убедитесь что часы на руке (не снимайте во время практики)
- Extended Runtime Session должна держать часы активными
- Connection Restored Count должен расти параллельно (автовосстановление работает)

---

## 📂 Измененные файлы

### Frontend:
- ✅ `src/components/DebugMonitor.tsx` - Добавлена панель Watch Diagnostics
- ✅ `src/plugins/ondaWatch.ts` - Типы для событий (уже был)

### iOS Watch App:
- ✅ `ios/App/OndaWatch Watch App/WorkoutManager.swift` - Автозапрос разрешений + логирование
- ✅ `ios/App/OndaWatchExtension/WorkoutManager.swift` - Синхронизировано
- ✅ `ios/App/watchkitapp Watch App/WorkoutManager.swift` - Синхронизировано

### Не изменено (работает как есть):
- ✅ `ios/App/App/OndaWatchPlugin.swift` - Обработка событий
- ✅ `src/services/PermissionsService.ts` - Запрос разрешений на iPhone
- ✅ `src/hooks/useWatchHeartRate.ts` - Подписка на события Watch

---

## 🎉 Результат

### Было:
1. ❌ Разрешения на часах не запрашивались автоматически
2. ❌ Пользователь не знал что происходит с связью
3. ❌ Нельзя было быстро протестировать команды
4. ❌ Непонятно почему нет пульса

### Стало:
1. ✅ Разрешения запрашиваются автоматически при команде START
2. ✅ Полная диагностика связи в реальном времени
3. ✅ Кнопки для быстрого тестирования команд
4. ✅ Автоматические подсказки о проблемах
5. ✅ Детальное логирование на обоих устройствах

---

## 🧪 Сценарий полного тестирования

### Шаг 1: Чистый старт (как будто первый запуск)

```bash
# На iPhone - очистите сохраненные разрешения
localStorage.removeItem('onda_healthkit_granted');
localStorage.removeItem('onda_microphone_granted');
```

### Шаг 2: Откройте приложение на iPhone

- Откройте Debug Monitor (кнопка с жуком)
- Разверните панель "Apple Watch Diagnostics"
- Все должно быть красным/серым (разрешений нет)

### Шаг 3: Выдайте разрешения на iPhone

- Пройдите через экран разрешений
- Выдайте микрофон
- В Debug Monitor:
  - Microphone → 🟢 зеленый
  - В логах: `[Permissions] ✅ Разрешения получены → запускаем HR мониторинг`

### Шаг 4: Откройте ONDA на часах

- Часы завибрируют (получили команду REQUEST_OPEN)
- Должен появиться **ДИАЛОГ РАЗРЕШЕНИЙ HEALTHKIT** ✅
- Нажмите "Разрешить"
- Выдайте разрешения на чтение пульса

### Шаг 5: Наблюдайте за данными

**На часах:**
```
[WorkoutManager] ✅ HealthKit permission already granted
[WorkoutManager] 🏃 Starting workout (app is active)
[WorkoutManager] 💗 HR: 78 bpm (WC reachable: true)
```

**На iPhone в Debug Monitor:**
- HealthKit → 🟢 зеленый
- Last HR Value → 78 bpm
- Total Updates → растет
- Reachable → 🟢 пульсирует
- Quick Diagnostics → ✅ All systems operational

### Шаг 6: Тест потери связи

- Закройте приложение на часах
- В Debug Monitor:
  - Reachable → 🟠 оранжевый
  - Connection Lost Count → +1
  - Quick Diagnostics → ⚠️ Watch not reachable

- Откройте приложение на часах снова
- В Debug Monitor:
  - Reachable → 🟢 зеленый снова
  - Connection Restored Count → +1
  - HR данные восстановились

---

## 💡 Дополнительные возможности

### Экспорт логов

Debug Monitor позволяет:
- 📥 **Download** - Скачать все логи в текстовый файл
- 📤 **Share** (iOS) - Поделиться логами через Share Sheet
- 🗑️ **Clear** - Очистить логи

### Фильтрация логов

- **All** - Все логи
- **Info** - Только информационные
- **Warn** - Только предупреждения
- **Error** - Только ошибки

### Автоматическая категоризация

Логи автоматически группируются по категориям:
- `[Watch]` - События часов
- `[Permissions]` - Разрешения
- `[HealthKit]` - HealthKit
- `[ONDA Plugin]` - Нативный плагин
- `[WorkoutManager]` - Workout сессия
- `[useVitals]` - Vitals данные

---

## 🎯 Следующие шаги

После тестирования этих улучшений:

1. ✅ **Убедитесь что разрешения появляются на часах** ← ВАШ ТЕКУЩИЙ ТЕСТ
2. ⏳ Проверьте стабильность связи при длительной практике
3. ⏳ Протестируйте восстановление связи после разрыва
4. ⏳ Убедитесь что HR данные приходят стабильно

---

**Готово к тестированию!** 🚀

Запустите приложение и откройте Debug Monitor чтобы увидеть все улучшения в действии.
