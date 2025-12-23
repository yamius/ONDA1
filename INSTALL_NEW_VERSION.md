# 🔧 Установка обновленной версии с автозапросом разрешений

## ⚠️ ВАЖНО
Изменения в коде уже сделаны, но нужно пересобрать и переустановить приложение на часах!

## 📱 Шаги установки

### 1. Синхронизируйте изменения
```bash
cd /workspace
npx cap sync ios
```

### 2. Откройте проект в Xcode
```bash
npx cap open ios
```

### 3. В Xcode выберите целевое устройство

**Для iPhone:**
- Product → Destination → Ваш iPhone

**Для Watch (ВАЖНО!):**
- Product → Destination → Ваши Apple Watch

### 4. Соберите и установите

**Сначала на iPhone:**
1. Выберите схему: **App** (верхний левый угол)
2. Destination: **Ваш iPhone**
3. Product → Run (⌘R)
4. Подождите установки

**Потом на Watch:**
1. Выберите схему: **OndaWatch Watch App** или **watchkitapp Watch App**
2. Destination: **Ваши Apple Watch**  
3. Product → Run (⌘R)
4. Подождите установки (может занять 1-2 минуты)

### 5. Проверьте что новая версия установлена

Запустите приложение на iPhone, откройте Debug Monitor и посмотрите логи:

**Должно появиться при запуске:**
```
[DebugMonitor] Initialized
[Build] Version: dev, Commit: local
[Platform] ios, Native: true
```

## 🧪 Проверка что изменения работают

После установки:

1. **Удалите сохраненные разрешения** (симулируем первый запуск):
   - Откройте Safari на iPhone → Developer → Clear Website Data
   - Или в коде добавьте временно:
     ```javascript
     localStorage.clear();
     ```

2. **Перезапустите приложение на iPhone**
3. **Пройдите процесс выдачи разрешений**
4. **Откройте ONDA на часах**

**Что должно произойти:**

В логах на часах (Console в Xcode):
```
[WorkoutManager] 🟢 START command received
[WorkoutManager] 🔐 HealthKit authorization status: NOT_DETERMINED ⚠️
[WorkoutManager] ⚠️ HealthKit permission NOT GRANTED - requesting now...
```

**НА ЧАСАХ ПОЯВИТСЯ ДИАЛОГ РАЗРЕШЕНИЙ!** ✅

---

## ⚡ Быстрый способ (если очень спешите)

Если не хотите пересобирать, можно вручную выдать разрешения на часах:

### Вариант А: Через настройки Watch

1. На часах: **Настройки** → **Здоровье** → **ONDA**
2. Включите: **Разрешить чтение пульса**

### Вариант Б: Открыть UI на часах

1. Откройте приложение ONDA на часах
2. Должен показаться экран с кнопкой "Разрешить"
3. Нажмите "Разрешить"
4. Выдайте разрешения в системном диалоге

**НО это не решит проблему навсегда** - при следующей установке проблема вернется.

---

## 🐛 Отладка: Как проверить какая версия на часах

Подключите часы к Xcode Console и запустите приложение на iPhone.

### Старая версия (БЕЗ автозапроса):
```
[WorkoutManager] 🟢 START command received
[WorkoutManager] 🏃 Starting workout (app is active)
[WorkoutManager] Workout started successfully
```
Но пульса НЕТ, потому что нет разрешений.

### Новая версия (С автозапросом):
```
[WorkoutManager] 🟢 START command received
[WorkoutManager] 🔐 HealthKit authorization status: NOT_DETERMINED ⚠️
[WorkoutManager] ⚠️ HealthKit permission NOT GRANTED - requesting now...
```
Появится диалог разрешений!

---

## 💡 Почему нужно пересобрать?

Изменения были сделаны в Swift коде:
- `ios/App/OndaWatch Watch App/WorkoutManager.swift`

Swift код компилируется в нативное приложение. Изменения в `.swift` файлах требуют:
1. Компиляции в Xcode
2. Установки на устройство

Изменения в JavaScript/TypeScript (`src/`) применяются автоматически при hot reload, но нативный код - нет.

---

## ✅ Чек-лист перед тестом

- [ ] Синхронизировал: `npx cap sync ios`
- [ ] Собрал и установил приложение на **iPhone**
- [ ] Собрал и установил приложение на **Apple Watch** ⚠️ ВАЖНО!
- [ ] Очистил localStorage (опционально, для чистоты теста)
- [ ] Перезапустил приложение на iPhone
- [ ] Открыл Debug Monitor
- [ ] Прошел процесс выдачи разрешений
- [ ] Открыл ONDA на часах
- [ ] **Появился диалог разрешений на часах!** ✅

---

Пожалуйста, установите новую версию и проверьте снова!
