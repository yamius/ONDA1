# ⚙️ GitHub Actions CI/CD Setup

Автоматическая сборка Android APK при каждом коммите в GitHub.

---

## 🎯 Что делает CI/CD?

При **каждом push** в `main` или `develop`:
1. ✅ Собирает React веб-приложение
2. ✅ Копирует в Android assets (без аудио - используется CDN)
3. ✅ Собирает подписанный APK
4. ✅ Загружает APK в GitHub Artifacts
5. ✅ Создаёт GitHub Release с готовым APK

**Результат:** Готовый APK доступен для скачивания через ~5-10 минут после push!

---

## 📋 Предварительные требования

### 1. Создать release keystore

Если ещё не создан:

```bash
cd android-webview/app

keytool -genkey -v \
  -keystore onda-release.keystore \
  -alias onda \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**Сохраните:**
- Keystore password
- Key password
- Сам файл `onda-release.keystore`

---

## 🔐 Настройка GitHub Secrets

### Шаг 1: Конвертировать keystore в Base64

```bash
# macOS/Linux
base64 -i android-webview/app/onda-release.keystore | pbcopy

# Windows (PowerShell)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("android-webview\app\onda-release.keystore")) | Set-Clipboard

# Linux (xclip)
base64 android-webview/app/onda-release.keystore | xclip -selection clipboard
```

**Результат:** Длинная строка Base64 скопирована в буфер обмена.

---

### Шаг 2: Добавить Secrets в GitHub

1. Откройте ваш репозиторий на GitHub
2. Перейдите в **Settings → Secrets and variables → Actions**
3. Нажмите **New repository secret**

Добавьте следующие secrets:

#### **KEYSTORE_BASE64**
- **Name:** `KEYSTORE_BASE64`
- **Value:** Вставьте Base64 строку из буфера обмена
- **Description:** Keystore file encoded in Base64

#### **KEYSTORE_PASSWORD**
- **Name:** `KEYSTORE_PASSWORD`
- **Value:** Пароль от keystore
- **Description:** Keystore password

#### **KEY_PASSWORD**
- **Name:** `KEY_PASSWORD`
- **Value:** Пароль от ключа (часто тот же, что и keystore)
- **Description:** Key password

#### **VITE_SUPABASE_URL**
- **Name:** `VITE_SUPABASE_URL`
- **Value:** `https://qwtdppugdcguyeaumymc.supabase.co`
- **Description:** Supabase project URL

#### **VITE_SUPABASE_ANON_KEY**
- **Name:** `VITE_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (ваш ключ)
- **Description:** Supabase anonymous key

---

### Шаг 3: Проверить Secrets

После добавления вы должны увидеть:

```
KEYSTORE_BASE64           •••••••••••••
KEYSTORE_PASSWORD         •••••••••••••
KEY_PASSWORD              •••••••••••••
VITE_SUPABASE_URL         •••••••••••••
VITE_SUPABASE_ANON_KEY    •••••••••••••
```

✅ Secrets настроены!

---

## 🚀 Использование

### Автоматическая сборка (при push)

```bash
# Любой коммит в main или develop запустит сборку
git add .
git commit -m "Update app"
git push origin main
```

**Процесс:**
1. GitHub Actions автоматически запустится
2. Через ~5-10 минут APK будет готов
3. Скачайте из **Actions → [ваш run] → Artifacts**

---

### Ручная сборка (когда нужно)

1. Откройте **Actions** в GitHub
2. Выберите **Build Android APK**
3. Нажмите **Run workflow**
4. Выберите:
   - **Branch:** main / develop
   - **Build type:** debug / release
5. Нажмите **Run workflow**

---

## 📥 Скачивание APK

### Вариант 1: Из Artifacts

1. Откройте **Actions** → выберите последний запуск
2. Скролльте вниз до **Artifacts**
3. Скачайте **onda-release-XXX.zip**
4. Распакуйте → `app-release.apk`

### Вариант 2: Из Releases (только main branch)

1. Откройте **Releases** в GitHub
2. Выберите последний релиз
3. Скачайте `app-release.apk` напрямую

---

## 🔍 Мониторинг сборки

### Просмотр логов:

1. **Actions** → выберите запуск
2. Кликните на **Build APK**
3. Разверните шаги для просмотра логов

### Ключевые шаги:

- **Build web application** - сборка React
- **Prepare Android assets** - копирование файлов
- **Build Release APK** - сборка APK
- **Upload APK artifact** - загрузка результата

---

## 🎨 Настройка Workflow

### Изменить триггеры:

Откройте `.github/workflows/build-android-apk.yml`:

```yaml
on:
  push:
    branches:
      - main        # Собирать при push в main
      - develop     # И в develop
      - feature/*   # Добавьте свои ветки
```

### Изменить retention:

```yaml
- name: Upload APK artifact
  uses: actions/upload-artifact@v4
  with:
    name: onda-release-${{ github.run_number }}
    path: ${{ steps.apk_info.outputs.apk_path }}
    retention-days: 30  # Измените (max 90 дней)
```

---

## 🐛 Troubleshooting

### ❌ **"Secrets not found"**

**Причина:** Secrets не настроены

**Решение:**
1. Проверьте **Settings → Secrets and variables → Actions**
2. Убедитесь, что все 5 secrets добавлены
3. Имена должны совпадать **точно** (case-sensitive)

---

### ❌ **"Keystore decode failed"**

**Причина:** Неправильная Base64 кодировка

**Решение:**
```bash
# Пересоздайте Base64
base64 android-webview/app/onda-release.keystore > keystore.txt
cat keystore.txt  # Скопируйте содержимое

# Убедитесь что это одна строка без переносов
```

---

### ❌ **"Signing failed: wrong password"**

**Причина:** Неправильный пароль в secrets

**Решение:**
1. Проверьте **KEYSTORE_PASSWORD** и **KEY_PASSWORD**
2. Убедитесь что нет лишних пробелов
3. Обновите secrets с корректными паролями

---

### ❌ **"APK size > 100MB"**

**Причина:** Аудио файлы включены в APK

**Решение:**
1. Проверьте workflow step "Prepare Android assets"
2. Убедитесь что удаляются `practices p1/` и `adaptive-practices/`
3. Пересоберите:
   ```bash
   npm run prepare:android
   git add android-webview/app/src/main/assets
   git commit -m "Fix assets"
   git push
   ```

---

### ❌ **"Gradle build failed"**

**Причина:** Проблемы с зависимостями или конфигурацией

**Решение:**
1. Проверьте локальную сборку:
   ```bash
   cd android-webview
   ./gradlew clean assembleRelease
   ```
2. Если работает локально, но не в CI:
   - Проверьте версию Java (должна быть 17)
   - Проверьте `android-webview/build.gradle`

---

## 📊 Статистика сборки

После каждой успешной сборки GitHub Actions создаёт:

**Artifacts:**
- ✅ Подписанный APK (~5-10MB)
- ✅ Доступен 30 дней
- ✅ Можно скачать и установить

**Releases (только main):**
- ✅ Автоматический tag: `v1.0.XXX`
- ✅ APK прикреплён к релизу
- ✅ Release notes с размером APK

---

## 🎯 Best Practices

### 1. **Защита паролей**
- ❌ Никогда не коммитьте keystore файлы
- ❌ Никогда не коммитьте пароли
- ✅ Используйте только GitHub Secrets

### 2. **Версионирование**
Обновляйте версию в `android-webview/app/build.gradle`:

```gradle
defaultConfig {
    versionCode 2      // Увеличивайте на 1
    versionName "1.1"  // Семантическое версионирование
}
```

### 3. **Тестирование перед push**
```bash
# Локальная проверка
npm run prepare:android
cd android-webview
./gradlew assembleRelease

# Если работает - push
git push
```

### 4. **Branch protection**
Настройте в GitHub:
- **Settings → Branches → Add rule**
- **Require status checks to pass** ✅
- Выберите **Build Android APK**

Теперь merge невозможен, пока APK не соберётся успешно!

---

## 🚀 Расширенные возможности

### Автоматическая публикация в Google Play

Для публикации в Google Play автоматически добавьте:

```yaml
- name: Upload to Google Play
  uses: r0adkll/upload-google-play@v1
  with:
    serviceAccountJsonPlainText: ${{ secrets.GOOGLE_PLAY_SERVICE_ACCOUNT }}
    packageName: com.onda.app
    releaseFiles: app/build/outputs/apk/release/app-release.apk
    track: internal  # internal, alpha, beta, production
```

**Требует:**
- Google Play Developer Account
- Service Account JSON

---

## 📖 Дополнительные ресурсы

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Android CI/CD Best Practices](https://developer.android.com/studio/publish/app-signing#sign-apk)
- [GitHub Secrets Management](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

---

**CI/CD настроен! 🎉**

Теперь каждый push автоматически собирает APK. Просто коммитьте и получайте готовое приложение!
