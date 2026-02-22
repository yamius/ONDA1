# Сборка и переменные окружения

Один источник правды: как запускать и собирать приложение, какие env-файлы для чего.

---

## Сценарии

| Цель | Команда | Env | Файл |
|-----|---------|-----|------|
| Разработка, все части открыты | `npm run dev` | используется | `.env.development` (в репо) |
| Разработка, свои настройки | `npm run dev` | переопределяет | `.env.local` (не в репо) |
| Production-сборка, все части открыты | `npm run build` | создать | `.env.production` (не в репо) |
| Production-сборка, части по прогрессу | `npm run build` | не создавать | — |

---

## Файлы окружения

| Файл | В git? | Когда используется |
|------|--------|--------------------|
| `.env.development` | да | `npm run dev` — все части разблокированы |
| `.env.production` | нет | `npm run build` — только если нужны все части в сборке |
| `.env.local` | нет | переопределяет оба (dev/prod) |
| `.env.example` | да | шаблон, подсказка какие переменные есть |

Переменная: `VITE_UNLOCK_ALL_PARTS=true` — разблокировать все части без проверки прогресса.

---

## Быстрые команды

```bash
# Клонировал репо — сразу dev со всеми частями
npm install && npm run dev

# Собрать прод с разблокированными частями (один раз создать .env.production)
echo "VITE_UNLOCK_ALL_PARTS=true" > .env.production
npm run build

# Собрать прод с проверкой разблокировки (как для релиза)
# Не создавать .env.production или удалить переменную
npm run build

# --- Лендинг (отдельный проект в landing/) ---
# Локальная разработка лендинга
cd landing && npm install && npm run dev

# Сборка и запуск лендинга (как на Replit Deployment)
cd landing && npm install && npm run build && npm run start
```

---

## Лендинг vs Приложение

| Что | Папка | Dev-команда | Порт | Replit |
|-----|-------|-------------|------|--------|
| Приложение | корень (`src/`) | `npm run dev` | 5000 | Preview |
| Лендинг | `landing/` | `cd landing && npm run dev` | 5173 | Deployment |

Подробнее: `.assistant/MODULE_LANDING.md`
