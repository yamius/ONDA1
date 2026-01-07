# 🤖 Автоматическая сборка APK

GitHub Actions CI/CD настроен для ONDA!

---

## ⚡ Быстрый старт

```bash
# 1. Создайте keystore
cd android-webview/app
keytool -genkey -v -keystore onda-release.keystore -alias onda -keyalg RSA -keysize 2048 -validity 10000

# 2. Конвертируйте в Base64
base64 -i onda-release.keystore | pbcopy  # macOS

# 3. Добавьте GitHub Secrets (см. инструкцию)
# 4. Push в GitHub
git push origin main

# ✅ APK готов через ~5-10 минут!
```

---

## 📖 Документация

### Краткая инструкция:
**[docs/QUICK_START_CI_CD.md](./docs/QUICK_START_CI_CD.md)** - настройка за 5 минут

### Полное руководство:
**[docs/GITHUB_ACTIONS_SETUP.md](./docs/GITHUB_ACTIONS_SETUP.md)** - подробная инструкция

### Локальная сборка:
**[docs/BUILD_APK.md](./docs/BUILD_APK.md)** - сборка без CI/CD

---

## 🔐 Требуемые GitHub Secrets

| Secret | Описание |
|--------|----------|
| `KEYSTORE_BASE64` | Keystore файл в Base64 |
| `KEYSTORE_PASSWORD` | Пароль keystore |
| `KEY_PASSWORD` | Пароль ключа |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key |

---

## 📥 Где скачать APK?

### Вариант 1: GitHub Actions Artifacts
1. **Actions** → последний запуск
2. Artifacts → **onda-release-XXX**
3. Скачать и распаковать

### Вариант 2: GitHub Releases
1. **Releases** → последний релиз
2. Скачать `app-release.apk`

---

## 🚀 Что происходит при push?

1. ✅ Собирается React приложение
2. ✅ Копируется в Android assets (без аудио)
3. ✅ Собирается подписанный APK
4. ✅ Загружается в Artifacts
5. ✅ Создаётся Release (только main)

**Время:** ~5-10 минут

---

## 🎯 Триггеры сборки

**Автоматически:**
- Push в `main`
- Push в `develop`
- Pull Request

**Вручную:**
- **Actions** → **Build Android APK** → **Run workflow**

---

## 📊 Результат

- **Размер APK:** ~5-10MB (аудио из CDN)
- **Срок хранения:** 30 дней (Artifacts)
- **Автоматические релизы:** при push в main

---

## 🐛 Troubleshooting

### Проблема: "Secrets not found"
→ Проверьте что все 5 secrets добавлены в GitHub

### Проблема: "Keystore decode failed"
→ Пересоздайте Base64 (одна строка без переносов)

### Проблема: "APK size > 100MB"
→ Проверьте что аудио файлы исключены из assets

**Подробнее:** [docs/GITHUB_ACTIONS_SETUP.md](./docs/GITHUB_ACTIONS_SETUP.md)

---

**Готово к использованию! 🎉**
