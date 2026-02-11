# Firebase Analytics - TODO List

## ✅ Что уже сделано (код готов)

- [x] Установлен `@capacitor-firebase/analytics` в package.json
- [x] Создан универсальный сервис аналитики (`src/services/analytics.ts`)
- [x] Создан Android bridge (`src/lib/analytics-bridge.ts`)
- [x] Обновлены Android Gradle файлы (Firebase SDK)
- [x] Обновлен iOS Podfile (Firebase SDK)
- [x] Добавлена инициализация в `main.tsx`
- [x] Добавлены TypeScript типы для Android bridge
- [x] Создана документация (3 файла)

## ❌ Что нужно сделать (настройка Firebase)

### Шаг 1: Firebase Console (5 минут)

1. [ ] Открыть https://console.firebase.google.com/
2. [ ] Создать проект **ONDA**
3. [ ] Включить **Google Analytics** при создании проекта
4. [ ] Добавить **iOS приложение**:
   - Bundle ID: `com.onda-life.ios`
   - Скачать `GoogleService-Info.plist`
5. [ ] Добавить **Android приложение**:
   - Package name: `com.onda.app`
   - Скачать `google-services.json`

### Шаг 2: Добавить файлы в проект (1 минута)

```bash
# iOS
cp ~/Downloads/GoogleService-Info.plist ios/App/App/

# Android
cp ~/Downloads/google-services.json android-webview/app/
```

### Шаг 3: Установить зависимости (2 минуты)

```bash
# npm пакеты
npm install

# iOS CocoaPods
cd ios/App
pod install
cd ../..
```

### Шаг 4: Коммит и push (1 минута)

```bash
git add ios/App/App/GoogleService-Info.plist
git add android-webview/app/google-services.json
git add .
git commit -m "Add Firebase Analytics configuration"
git push
```

### Шаг 5: Деплой через GitHub Actions (автоматически)

- [ ] Дождаться успешной сборки iOS → TestFlight
- [ ] Дождаться успешной сборки Android → APK

### Шаг 6: Проверка (2 минуты)

1. [ ] Установить приложение из TestFlight/APK
2. [ ] Открыть приложение
3. [ ] Подождать 1-2 минуты
4. [ ] Проверить Firebase Console → Analytics → Events
5. [ ] Убедиться, что появились события: `first_open`, `app_open`

### Шаг 7: Интеграция в код (опционально, но рекомендуется)

См. `docs/ANALYTICS_INTEGRATION_EXAMPLES.md`

Добавить трекинг в:
- [ ] Авторизация (sign_up, login)
- [ ] Завершение практики (practice_complete)
- [ ] Покупка подписки (purchase)
- [ ] Просмотры экранов (screen_view)
- [ ] Подключение устройств

### Шаг 8: Настройка рекламы (опционально)

#### Google Ads
1. [ ] Firebase Console → Project settings → Integrations
2. [ ] Google Ads → Link
3. [ ] Выбрать аккаунт → Link

#### Meta Ads (требует дополнительной настройки)
- [ ] Настроить Facebook Conversions API (серверные события)

## 📚 Документация

- `FIREBASE_QUICK_START.md` - Быстрый старт (5 минут)
- `docs/FIREBASE_ANALYTICS_SETUP.md` - Полная инструкция
- `docs/ANALYTICS_INTEGRATION_EXAMPLES.md` - Примеры интеграции в код
- `FIREBASE_INTEGRATION_SUMMARY.md` - Сводка изменений

## ⏱ Общее время

- **Настройка Firebase:** ~10 минут
- **Интеграция в код:** ~30 минут (опционально)

## 🚀 Следующий шаг

Откройте `FIREBASE_QUICK_START.md` и следуйте инструкциям.

---

**Статус:** ✅ Код готов → ❌ Требуется настройка Firebase Console
