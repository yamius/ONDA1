# Android Debug Build Guide

## 🐛 Как собрать Debug APK вручную

### Через GitHub Actions (рекомендуется)

1. Откройте [GitHub Actions](https://github.com/YOUR_USERNAME/ONDA1/actions)
2. Выберите workflow **"Build Android APK"**
3. Нажмите **"Run workflow"**
4. Выберите:
   - **Branch:** `main` (или любая другая)
   - **Build type:** `debug` ⬅️ **Важно!**
5. Нажмите **"Run workflow"**

Через ~5-7 минут APK будет готов в разделе **Artifacts**.

### Локально (если есть Android SDK)

```bash
# 1. Подготовка
npm run build
npm run prepare:android

# 2. Сборка Debug APK
cd android-webview
./gradlew assembleDebug --stacktrace

# APK будет в: android-webview/app/build/outputs/apk/debug/app-debug.apk
```

## 🔍 Firebase DebugView

Debug APK автоматически отправляет события в Firebase DebugView для мгновенной проверки.

### Как включить DebugView

1. Подключите устройство через USB
2. Включите USB отладку на Android
3. Выполните команду:

```bash
adb shell setprop debug.firebase.analytics.app com.onda.life
```

4. Откройте приложение
5. Перейдите в **Firebase Console → Analytics → DebugView**
6. События появляются **мгновенно** (без задержки 1-2 минуты)

### Отключить DebugView

```bash
adb shell setprop debug.firebase.analytics.app .none.
```

## 📊 Разница между Debug и Release

| Параметр | Debug | Release |
|----------|-------|---------|
| Размер APK | ~20-30 MB | ~5-10 MB |
| Обфускация | Нет | Да (ProGuard) |
| Подпись | Debug keystore | Release keystore |
| Firebase DebugView | ✅ Работает | ❌ Не работает |
| Скорость сборки | Быстрее | Медленнее |
| Логи | Подробные | Минимальные |

## 🎯 Когда использовать Debug

- ✅ Тестирование Firebase Analytics
- ✅ Отладка событий в DebugView
- ✅ Проверка интеграции
- ✅ Разработка новых фич
- ❌ Публикация в Google Play (только Release!)

## 🚀 Когда использовать Release

- ✅ Публикация в Google Play
- ✅ Распространение пользователям
- ✅ Финальное тестирование перед релизом
- ❌ Отладка (логи минимальные)

## 🔧 Устранение проблем

### GitHub Actions собирает Release вместо Debug

**Причина:** Старая версия workflow с неправильными условиями.

**Решение:** Обновлено в `.github/workflows/build-android-apk.yml` (уже исправлено).

### DebugView не показывает события

**Причины:**
1. Не выполнена команда `adb shell setprop`
2. Установлен Release APK (не Debug)
3. Приложение не открыто

**Решение:**
1. Проверьте, что установлен **Debug APK** (имя файла `app-debug.apk`)
2. Выполните команду `adb shell setprop debug.firebase.analytics.app com.onda.life`
3. Перезапустите приложение
4. Откройте Firebase Console → Analytics → DebugView

### APK не устанавливается

**Причина:** Конфликт с установленной версией.

**Решение:**
```bash
# Удалите старую версию
adb uninstall com.onda.app

# Установите новую
adb install android-webview/app/build/outputs/apk/debug/app-debug.apk
```

## 📚 Дополнительные ресурсы

- [Firebase DebugView Docs](https://firebase.google.com/docs/analytics/debugview)
- [Android Debug vs Release](https://developer.android.com/studio/build/build-variants)
- [ADB Commands](https://developer.android.com/studio/command-line/adb)

---

**Готово!** Теперь вы можете собирать Debug APK вручную для тестирования Firebase Analytics.
