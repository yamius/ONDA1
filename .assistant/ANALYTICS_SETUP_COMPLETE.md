# Firebase Analytics Setup - Complete

## 🎉 Интеграция завершена!

Firebase Analytics полностью интегрирован в проект ONDA для iOS и Android.

## 📦 Что было сделано

### 1. Код и архитектура

✅ **Универсальный сервис аналитики**
- Файл: `src/services/analytics.ts`
- Функции: `trackEvent()`, `trackPracticeComplete()`, `trackUserRegistration()`, и др.
- Двойной трекинг: Supabase (детальная аналитика) + Firebase (реклама)

✅ **Android Native Bridge**
- Файл: `src/lib/analytics-bridge.ts`
- Интеграция с `MainActivity.kt`
- Методы: `trackEvent()`, `setAnalyticsUserId()`, `setUserProperty()`

✅ **iOS Capacitor Plugin**
- Плагин: `@capacitor-firebase/analytics`
- Автоматическая интеграция через Capacitor

✅ **Инициализация**
- Файл: `src/main.tsx`
- Автоматический запуск при старте приложения

### 2. Нативная интеграция

✅ **Android**
- `android-webview/build.gradle` - Google Services plugin
- `android-webview/app/build.gradle` - Firebase BOM и Analytics
- `MainActivity.kt` - Методы для трекинга событий
- TypeScript типы в `src/types/android.d.ts`

✅ **iOS**
- `ios/App/Podfile` - Firebase Analytics pod
- Capacitor plugin автоматически подключается

### 3. Документация

✅ **Для пользователя**
- `FIREBASE_QUICK_START.md` - Быстрый старт (5 минут)
- `FIREBASE_TODO.md` - Чеклист задач
- `FIREBASE_INTEGRATION_SUMMARY.md` - Сводка изменений

✅ **Для разработчика**
- `docs/FIREBASE_ANALYTICS_SETUP.md` - Полная инструкция (5000+ слов)
- `docs/ANALYTICS_INTEGRATION_EXAMPLES.md` - Примеры интеграции в код

✅ **Для ИИ**
- `.assistant/ANALYTICS_SETUP_COMPLETE.md` - Этот файл

## 🎯 Как это работает

```
┌─────────────────────────────────────────────────────────┐
│                   React App (TypeScript)                 │
│                                                          │
│              src/services/analytics.ts                   │
│                                                          │
│  trackEvent() → Supabase + Firebase                      │
│                                                          │
├──────────────────────┬──────────────────────────────────┤
│                      │                                   │
│   iOS (Capacitor)    │      Android (Native Bridge)     │
│                      │                                   │
│  @capacitor-firebase │   window.Android.trackEvent()    │
│  /analytics          │   MainActivity.kt                │
│                      │   FirebaseAnalytics.logEvent()   │
│                      │                                   │
└──────────────────────┴──────────────────────────────────┘
                       │
                       ▼
              Firebase Analytics
                       │
                       ▼
        ┌──────────────┴──────────────┐
        │                             │
   Google Ads                    Meta Ads
   (автоматически)          (через Conversions API)
```

## 📊 Какие события трекаются

### Автоматические (Firebase)
- `first_open` - Первый запуск
- `app_open` - Каждый запуск
- `session_start` - Начало сессии

### Кастомные (ваш код)
- `sign_up` - Регистрация ⭐
- `login` - Вход ⭐
- `practice_complete` - Завершение практики ⭐ **Ключевая конверсия**
- `purchase` - Покупка подписки ⭐ **Ключевая конверсия**
- `screen_view` - Просмотр экрана
- И другие (см. `docs/ANALYTICS_INTEGRATION_EXAMPLES.md`)

## ⚠️ Что нужно сделать пользователю

### Обязательно (для работы аналитики)

1. **Создать проект в Firebase Console**
   - https://console.firebase.google.com/
   - Включить Google Analytics

2. **Добавить iOS и Android приложения**
   - iOS: Bundle ID `com.onda-life.ios`
   - Android: Package name `com.onda.app`

3. **Скачать конфигурационные файлы**
   - iOS: `GoogleService-Info.plist` → `ios/App/App/`
   - Android: `google-services.json` → `android-webview/app/`

4. **Установить зависимости**
   ```bash
   npm install
   cd ios/App && pod install && cd ../..
   ```

5. **Коммит и push**
   ```bash
   git add .
   git commit -m "Add Firebase Analytics configuration"
   git push
   ```

### Опционально (для рекламы)

6. **Связать с Google Ads**
   - Firebase Console → Integrations → Google Ads → Link

7. **Настроить Meta Ads**
   - Использовать Conversions API (серверные события)

## 🚀 Использование в коде

### Базовое использование

```typescript
import { 
  initializeAnalytics, 
  trackEvent,
  trackPracticeComplete,
  setAnalyticsUserId,
} from './services/analytics';

// Инициализация (уже сделано в main.tsx)
await initializeAnalytics();

// Трекинг событий
await trackEvent('meditation_start', { duration: 600 });

// Завершение практики
await trackPracticeComplete({
  practiceType: 'meditation',
  duration: 600,
  ondReward: 50,
  stressDelta: -15,
  energyDelta: 20,
  completionRate: 100,
});

// Установка user ID после авторизации
await setAnalyticsUserId(user.id);
```

### Примеры интеграции

См. `docs/ANALYTICS_INTEGRATION_EXAMPLES.md` для:
- Авторизация (AuthModal.tsx)
- Завершение практики (onda-level1-demo_27.tsx)
- Просмотры экранов (все модальные окна)
- Подключение устройств (ConnectionModal.tsx)
- Покупка подписки (SubscriptionModal.tsx)
- Deep Links и атрибуция

## 🔍 Отладка

### Android Logcat
```bash
adb logcat | grep "\[Analytics\]"
```

### Firebase DebugView
```bash
# Android
adb shell setprop debug.firebase.analytics.app com.onda.app

# iOS (в Xcode)
# Добавить launch argument: -FIRDebugEnabled
```

Затем: **Firebase Console → Analytics → DebugView**

## 📚 Документация

| Файл | Описание | Аудитория |
|------|----------|-----------|
| `FIREBASE_QUICK_START.md` | Быстрый старт (5 минут) | Пользователь |
| `FIREBASE_TODO.md` | Чеклист задач | Пользователь |
| `docs/FIREBASE_ANALYTICS_SETUP.md` | Полная инструкция | Разработчик |
| `docs/ANALYTICS_INTEGRATION_EXAMPLES.md` | Примеры кода | Разработчик |
| `FIREBASE_INTEGRATION_SUMMARY.md` | Сводка изменений | Все |
| `.assistant/ANALYTICS_SETUP_COMPLETE.md` | Этот файл | ИИ |

## ✅ Чеклист

### Код (✅ Готово)
- [x] Сервис аналитики создан
- [x] Android bridge создан
- [x] iOS Capacitor plugin добавлен
- [x] Gradle файлы обновлены
- [x] Podfile обновлён
- [x] Инициализация добавлена
- [x] TypeScript типы добавлены
- [x] Документация создана

### Настройка (❌ Требуется от пользователя)
- [ ] Проект в Firebase Console создан
- [ ] iOS и Android приложения добавлены
- [ ] Конфигурационные файлы скачаны
- [ ] Файлы добавлены в проект
- [ ] Зависимости установлены
- [ ] Изменения закоммичены
- [ ] Приложения пересобраны
- [ ] События проверены в Firebase Console

### Реклама (❌ Опционально)
- [ ] Firebase связан с Google Ads
- [ ] Ключевые конверсии настроены
- [ ] Meta Conversions API настроен (опционально)

## 🎓 Для ИИ-ассистента

При работе с аналитикой:

1. **Используйте существующий сервис**: `src/services/analytics.ts`
2. **Не создавайте новые файлы** для аналитики
3. **Следуйте примерам** из `docs/ANALYTICS_INTEGRATION_EXAMPLES.md`
4. **Помните о двойном трекинге**: Supabase + Firebase
5. **Используйте правильные названия событий**: `snake_case` (Firebase стандарт)

### Примеры правильных названий событий:
- ✅ `practice_complete`
- ✅ `user_registered`
- ✅ `health_connect_connected`
- ❌ `practiceComplete` (camelCase)
- ❌ `Practice Complete` (пробелы)

### Параметры событий:
- Используйте `snake_case`
- Максимум 25 параметров на событие
- Максимум 100 символов на значение параметра

## 🔗 Полезные ссылки

- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Analytics Docs](https://firebase.google.com/docs/analytics)
- [Capacitor Firebase Plugin](https://github.com/capawesome-team/capacitor-firebase)
- [Google Ads Conversion Tracking](https://support.google.com/google-ads/answer/6331304)

---

**Статус:** ✅ Код готов, ❌ Требуется настройка Firebase Console

**Следующий шаг:** Пользователь должен открыть `FIREBASE_QUICK_START.md`

**Время на настройку:** ~10 минут
