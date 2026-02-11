# Firebase Analytics Integration - Сводка изменений

## 📦 Что было добавлено

### 1. Новые файлы

#### Сервисы и библиотеки
- ✅ `src/services/analytics.ts` - Универсальный сервис аналитики (Supabase + Firebase)
- ✅ `src/lib/analytics-bridge.ts` - Bridge для Android нативных вызовов

#### Документация
- ✅ `docs/FIREBASE_ANALYTICS_SETUP.md` - Полная инструкция по настройке (5000+ слов)
- ✅ `FIREBASE_QUICK_START.md` - Быстрый старт (5 минут)
- ✅ `FIREBASE_INTEGRATION_SUMMARY.md` - Этот файл

### 2. Изменённые файлы

#### Frontend
- ✅ `package.json` - Добавлен `@capacitor-firebase/analytics`
- ✅ `src/main.tsx` - Инициализация Firebase Analytics при старте
- ✅ `src/types/android.d.ts` - Добавлены типы для Analytics методов

#### Android
- ✅ `android-webview/build.gradle` - Добавлен Google Services plugin
- ✅ `android-webview/app/build.gradle` - Добавлены Firebase зависимости
- ✅ `android-webview/app/src/main/java/com/onda/app/MainActivity.kt` - Добавлены методы для трекинга

#### iOS
- ✅ `ios/App/Podfile` - Добавлен Firebase Analytics pod

### 3. Файлы, которые нужно добавить вручную

⚠️ **Эти файлы нужно скачать из Firebase Console:**

- ❌ `ios/App/App/GoogleService-Info.plist` - Конфигурация iOS
- ❌ `android-webview/app/google-services.json` - Конфигурация Android

**Инструкция:** См. `FIREBASE_QUICK_START.md`

## 🎯 Как это работает

### Архитектура

```
React App (src/services/analytics.ts)
    │
    ├─── iOS: @capacitor-firebase/analytics
    │         └─── Firebase iOS SDK
    │
    └─── Android: window.Android.trackEvent()
              └─── MainActivity.kt
                    └─── Firebase Android SDK
```

### Двойной трекинг

Каждое событие отправляется в **два места**:

1. **Supabase** (`app_events` таблица) - Детальная аналитика продукта
2. **Firebase Analytics** - Атрибуция рекламы (Google Ads, Meta Ads)

### Пример использования

```typescript
import { trackEvent, trackPracticeComplete } from './services/analytics';

// Простое событие
await trackEvent('button_click', { button_name: 'start' });

// Завершение практики (ключевая конверсия)
await trackPracticeComplete({
  practiceType: 'meditation',
  duration: 600,
  ondReward: 50,
  stressDelta: -15,
  energyDelta: 20,
  completionRate: 100,
});
```

## 📊 Какие события трекаются

### Автоматические события (Firebase)
- `first_open` - Первый запуск приложения
- `app_open` - Каждый запуск приложения
- `session_start` - Начало сессии

### Кастомные события (ваш код)
- `sign_up` - Регистрация пользователя
- `login` - Вход пользователя
- `practice_complete` - Завершение практики ⭐ **Ключевая конверсия**
- `purchase` - Покупка подписки ⭐ **Ключевая конверсия**
- `screen_view` - Просмотр экрана

### Параметры событий
Каждое событие содержит:
- `platform` - `ios`, `android`, или `web`
- `timestamp` - ISO 8601 timestamp
- `user_id` - ID пользователя из Supabase (если авторизован)
- `session_id` - ID сессии (30 минут)
- Кастомные параметры события

## 🔗 Интеграция с рекламой

### Google Ads (автоматически)
Firebase автоматически интегрируется с Google Ads после связывания аккаунтов.

**Как связать:**
1. Firebase Console → Project settings → Integrations
2. Google Ads → Link
3. Выберите аккаунт → Link

### Meta Ads (требует дополнительной настройки)
Для Facebook/Instagram нужно:
1. Добавить Facebook SDK (клиентский, ограничен iOS ATT)
2. **ИЛИ** использовать Conversions API (серверный, рекомендуется)

**Рекомендация:** Используйте Conversions API через Supabase Edge Function для обхода iOS ATT.

## 🚀 Следующие шаги

### 1. Настройка Firebase (5 минут)
```bash
# Следуйте инструкции
cat FIREBASE_QUICK_START.md
```

### 2. Установка зависимостей
```bash
npm install
cd ios/App && pod install && cd ../..
```

### 3. Добавление конфигов
```bash
# Скачайте из Firebase Console
cp ~/Downloads/GoogleService-Info.plist ios/App/App/
cp ~/Downloads/google-services.json android-webview/app/
```

### 4. Деплой
```bash
git add .
git commit -m "Add Firebase Analytics integration"
git push
```

GitHub Actions автоматически соберёт приложения с Firebase.

### 5. Проверка
1. Установите приложение из TestFlight/APK
2. Откройте приложение
3. Проверьте Firebase Console → Analytics → Events (через 1-2 минуты)

## 📈 Использование в коде

### Инициализация (уже сделано в `main.tsx`)
```typescript
import { initializeAnalytics } from './services/analytics';
await initializeAnalytics();
```

### Трекинг событий
```typescript
import { 
  trackEvent,
  trackScreenView,
  trackPracticeComplete,
  trackUserRegistration,
  trackUserLogin,
  trackSubscriptionPurchase,
  setAnalyticsUserId,
} from './services/analytics';

// Базовое событие
await trackEvent('meditation_start', { duration: 600 });

// Просмотр экрана
await trackScreenView('home');

// Завершение практики
await trackPracticeComplete({
  practiceType: 'meditation',
  duration: 600,
  ondReward: 50,
  stressDelta: -15,
  energyDelta: 20,
  completionRate: 100,
});

// Регистрация
await trackUserRegistration('email'); // 'email' | 'google' | 'apple'

// Вход
await trackUserLogin('google');

// Покупка
await trackSubscriptionPurchase({
  productId: 'onda_premium_monthly',
  price: 9.99,
  currency: 'USD',
});

// Установка user ID после авторизации
const { data: { user } } = await supabase.auth.getUser();
if (user) {
  await setAnalyticsUserId(user.id);
}
```

### Атрибуция (Deep Links)
```typescript
import { trackAttribution, parseUTMParams } from './services/analytics';

// При открытии deep link
const url = 'myapp://open?utm_source=facebook&utm_campaign=spring2024';
const utmParams = parseUTMParams(url);

if (utmParams) {
  await trackAttribution(utmParams);
}
```

## 🔍 Отладка

### Android Logcat
```bash
adb logcat | grep "\[Analytics\]"
```

### iOS Console
Используйте Xcode Console или Safari Web Inspector.

### Firebase DebugView
Для мгновенной проверки событий:

**Android:**
```bash
adb shell setprop debug.firebase.analytics.app com.onda.app
```

**iOS:**
```bash
# В Xcode, добавьте launch argument: -FIRDebugEnabled
```

Затем откройте **Firebase Console → Analytics → DebugView**.

## 📚 Документация

- `FIREBASE_QUICK_START.md` - Быстрый старт (5 минут)
- `docs/FIREBASE_ANALYTICS_SETUP.md` - Полная инструкция
- [Firebase Analytics Docs](https://firebase.google.com/docs/analytics)
- [Capacitor Firebase Plugin](https://github.com/capawesome-team/capacitor-firebase)

## ✅ Чеклист интеграции

### Код (✅ Готово)
- [x] Установлен `@capacitor-firebase/analytics`
- [x] Создан универсальный сервис `analytics.ts`
- [x] Добавлен Android bridge
- [x] Обновлены Gradle файлы
- [x] Обновлен Podfile
- [x] Добавлена инициализация в `main.tsx`
- [x] Добавлены TypeScript типы

### Настройка (❌ Требуется)
- [ ] Создан проект в Firebase Console
- [ ] Добавлены iOS и Android приложения
- [ ] Скачаны конфигурационные файлы
- [ ] Файлы добавлены в проект
- [ ] Установлены зависимости (`npm install`, `pod install`)
- [ ] Изменения закоммичены и запушены
- [ ] Приложения пересобраны через GitHub Actions
- [ ] События проверены в Firebase Console

### Реклама (❌ Опционально)
- [ ] Firebase связан с Google Ads
- [ ] Настроены ключевые конверсии
- [ ] (Опционально) Настроен Meta Conversions API

---

**Статус:** ✅ Код готов, ❌ Требуется настройка Firebase Console

**Время на настройку:** ~10 минут

**Следующий шаг:** Откройте `FIREBASE_QUICK_START.md`
