# MODULE_SUPABASE — Архитектура бэкенда ONDA

## Сервисы Supabase

| Сервис | Использование |
|--------|---------------|
| **Auth** | Email/password, Google OAuth, сессии |
| **Database** | PostgreSQL — профили, прогресс, история |
| **Storage** | CDN для аудиофайлов практик |
| **Edge Functions** | Серверная логика (Hume AI и др.) |

## Структура базы данных

### Таблицы

```sql
-- Профили пользователей
user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP
)

-- Игровой прогресс
user_game_progress (
  id UUID PRIMARY KEY REFERENCES auth.users,
  ond_balance INTEGER DEFAULT 0,
  completed_practices JSONB,
  achievements JSONB,
  updated_at TIMESTAMP
)

-- История практик
practice_sessions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  practice_id TEXT,
  duration INTEGER,
  quality INTEGER,
  ond_earned INTEGER,
  stress_start REAL,
  stress_end REAL,
  energy_start REAL,
  energy_end REAL,
  created_at TIMESTAMP
)
```

## Безопасность: Создание новых таблиц

### Правило: Используй схему `internal` для внутренних таблиц

Чтобы избежать предупреждений Security Advisor и не давать доступ anon/authenticated:

**1. Создай схему (один раз):**

```sql
create schema if not exists internal;
revoke all on schema internal from anon, authenticated;
```

**2. Создавай таблицы в схеме `internal`:**

```sql
-- Пример: таблица аналитики
create table internal.app_events (
  id bigserial primary key,
  user_id uuid references auth.users,
  event_name text not null,
  event_data jsonb,
  created_at timestamptz default now()
);

-- ВАЖНО: явно убираем доступ
revoke all on internal.app_events from anon, authenticated;
```

### Преимущества схемы `internal`:

- Default privileges для `public` не применяются
- Security Advisor не выдаёт предупреждений
- Меньше ручной работы по отзыву привилегий

### Шаблон промпта для Cursor:

> "Create an internal Postgres table for [описание] in schema `internal`.
> Do NOT expose it to anon/authenticated.
> Include REVOKE statements."

### Когда использовать `public` vs `internal`:

| Схема | Когда использовать |
|-------|-------------------|
| `public` | Данные, которые клиент читает/пишет через RLS |
| `internal` | Аналитика, логи, внутренние данные, бэкенд-only |

## Edge Functions

Расположение: `supabase/functions/`

| Функция | Назначение |
|---------|------------|
| `hume-emotion` | Анализ эмоций через Hume AI |

## Клиент Supabase

Файл: `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

## Переменные окружения

```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ... (только для Edge Functions)
```

## Storage (Audio CDN)

Бакет: `audio-tracks`

Структура:
```
audio-tracks/
├── practices/
│   ├── breath-awareness.mp3
│   ├── body-scan.mp3
│   └── ...
└── ambient/
    ├── nature.mp3
    └── ...
```

Кэширование:
- IndexedDB (первичный)
- Cache API (fallback)
- Retry логика при загрузке
