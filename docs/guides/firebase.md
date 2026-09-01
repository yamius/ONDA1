# Firebase Analytics - Activation Guide

## ⚠️ Текущий статус

Firebase Analytics **подготовлен**, но **отключен** до добавления конфигурационных файлов.

**Почему отключен?**
- `google-services.json` (Android) должен быть скачан из Firebase Console
- `GoogleService-Info.plist` (iOS) должен быть скачан из Firebase Console
- Эти файлы содержат ваши уникальные API ключи и не могут быть сгенерированы автоматически

## 🚀 Как активировать (5 минут)

### Шаг 1: Firebase Console

1. Откройте https://console.firebase.google.com/
2. Создайте проект **ONDA** (включите Google Analytics)
3. Добавьте **iOS приложение**:
   - Bundle ID: `com.onda-life.ios`
   - Скачайте `GoogleService-Info.plist`
4. Добавьте **Android приложение**:
   - Package name: `com.onda.app`
   - Скачайте `google-services.json`

### Шаг 2: Добавьте файлы в проект

```bash
# iOS
cp ~/Downloads/GoogleService-Info.plist ios/App/App/

# Android
cp ~/Downloads/google-services.json android-webview/app/
```

### Шаг 3: Раскомментируйте Firebase код

#### Android: `android-webview/app/build.gradle`

**Найдите:**
```gradle
// Firebase: Uncomment after adding google-services.json from Firebase Console
// id 'com.google.gms.google-services'
```

**Замените на:**
```gradle
id 'com.google.gms.google-services'
```

**И найдите:**
```gradle
// Firebase Analytics (uncomment after adding google-services.json)
// implementation platform('com.google.firebase:firebase-bom:32.7.0')
// implementation 'com.google.firebase:firebase-analytics-ktx'
```

**Замените на:**
```gradle
// Firebase Analytics
implementation platform('com.google.firebase:firebase-bom:32.7.0')
implementation 'com.google.firebase:firebase-analytics-ktx'
```

#### Android: `MainActivity.kt`

**Найдите все блоки с комментарием:**
```kotlin
// Firebase Analytics (uncomment after adding google-services.json)
```

**И раскомментируйте код внутри.**

**Пример:**
```kotlin
// Было:
// import com.google.firebase.analytics.FirebaseAnalytics

// Стало:
import com.google.firebase.analytics.FirebaseAnalytics
```

### Шаг 4: Коммит и push

```bash
git add ios/App/App/GoogleService-Info.plist
git add android-webview/app/google-services.json
git add android-webview/app/build.gradle
git add android-webview/app/src/main/java/com/onda/app/MainActivity.kt
git commit -m "Activate Firebase Analytics with config files"
git push
```

### Шаг 5: Проверка

GitHub Actions автоматически соберёт приложения с Firebase Analytics.

## 📊 Что будет работать после активации

- ✅ Трекинг событий в Firebase Analytics
- ✅ Автоматическая интеграция с Google Ads
- ✅ Атрибуция рекламного трафика
- ✅ Firebase DebugView — но ТОЛЬКО при запуске из Xcode с `-FIRDebugEnabled` (см. «Проверка работы»)
- ✅ Двойной трекинг: Supabase + Firebase

## 🔍 Проверка работы

> ⚠️ **DebugView НЕ работает на сборке из TestFlight или App Store.** DebugView
> получает события только когда приложение запущено с аргументом
> `-FIRDebugEnabled`, а он задаётся в схеме Xcode и **не переносится** в
> архивную сборку. Пустой DebugView на TestFlight — это отсутствие сигнала, а
> **не** доказательство того, что событие не отправляется. Не делайте из него
> вывод «событие не работает».

Есть ровно два рабочих пути:

**A. Немедленно — запуск из Xcode**

1. Xcode → Product → Scheme → Edit Scheme → Run → Arguments
2. Добавьте аргумент запуска: `-FIRDebugEnabled`
3. Запустите на устройстве/симуляторе из Xcode
4. **Firebase Console → Analytics → DebugView** — события видны за секунды

**B. На реальной сборке — обычные отчёты, через 24–48 ч**

1. Установите приложение из TestFlight/APK и пройдите нужный сценарий
2. Подождите **24–48 часов** (лаг обработки GA4)
3. **Firebase Console → Analytics → Events** или отчёты GA4
4. Должны появиться события: `first_open`, `app_open`

## 📚 Документация

- `FIREBASE_QUICK_START.md` - Полная инструкция
- `docs/FIREBASE_ANALYTICS_SETUP.md` - Детальная документация
- `docs/ANDROID_DEBUG_BUILD.md` - Debug сборка для тестирования

---

**Статус:** ⏸️ Ожидает добавления конфигурационных файлов из Firebase Console
