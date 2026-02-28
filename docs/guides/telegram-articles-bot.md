# Telegram Articles Bot & Generator

Один клик: запускаешь бота → раз в день приходит статья в Telegram → Approve → на сайте.

## Секреты (Replit Secrets)

| Секрет | Назначение |
|--------|------------|
| `TELEGRAM_TOKEN` | Токен бота от @BotFather |
| `MY_CHAT_ID` | ID чата, куда бот отправляет статьи |
| `OPENAI_API_KEY` | Ключ OpenAI для генерации |

## Запуск

```bash
uv run python main.py
```

Бот слушает сообщения и в фоне раз в день генерирует статью → отправляет в Telegram → Approve (сохранить) или Reject (отклонить).

## Фильтры контента

ONDA фокусируется на: **поведенческие модели, устройства, время суток, лёгкие упражнения, социальные взаимодействия**.

**Отфильтровываются:**
- Темы: инъекции, пептиды, препараты, добавки (Tesamorelin, Ozempic, Berberine, Quercetin и т.п.)
- Сгенерированный текст: если содержит injection, dosage, mg, pharmaceutical — отклоняется

Чёрный список тем и вывода — в `main.py` (`_TOPIC_BLACKLIST`, `_OUTPUT_BLACKLIST`).

## Источники тем

- **Reddit** — r/biohacking, r/Nootropics, r/longevity (через `REDDIT_SUBS`)
- **YouTube** — RSS последних видео с каналов (Huberman Lab, FoundMyFitness, Peter Attia). Без API-ключа.
- **topics.txt** — fallback, если оба источника недоступны

Добавить свои каналы: `YOUTUBE_CHANNEL_IDS=UCxxx,UCyyy` (channel ID через запятую).

## Команды

| Команда | Описание |
|---------|----------|
| `/article` | Подсказка: вставь статью ниже → Approve/Reject |
| `/generate` | Черновик от OpenAI (без кнопок). Редактируй → вставь обратно → Approve |
| `/test` | Тестовая статья с Approve/Reject |

## Сценарий: черновик → правка → сохранение

1. `/generate` — бот пришлёт черновик (основа для правки).
2. Скопируй, отредактируй в своём редакторе.
3. Вставь отредактированный текст в чат и отправь.
4. Бот ответит «Save as article?» с Approve/Reject.
5. Approve → статья сохраняется в `articles/`.

## Проверка

В Telegram отправь боту `/test` — придёт тестовая статья с кнопками Approve и Reject. Проверь, что обе работают.

## Темы

**По умолчанию:** топ-10 постов с Reddit (r/biohacking, r/Nootropics, r/longevity). Берётся самый популярный пост за день.

**Fallback:** если Reddit недоступен — `scripts/topics.txt`.

**Переменная:** `REDDIT_SUBS` — список сабреддитов через запятую (по умолчанию `biohacking,Nootropics,longevity`).

---

## Дедупликация тем

Похожие темы не повторяются. Берутся заголовки из `articles/*.md` (первая строка). Новая тема с Reddit сравнивается: если 2+ значимых слова совпадают — берётся следующая из топ-10. Если все похожи — используется первая.

## Ручная генерация

```bash
uv run python scripts/article_generator.py cold exposure
```

## Переменные

| Переменная | По умолчанию |
|------------|--------------|
| `ARTICLE_INTERVAL_HOURS` | 24 |
| `ARTICLE_FIRST_DELAY_SEC` | 3600 (первая статья через 1 ч) |
