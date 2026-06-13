# Backend architecture (Supabase)

> **⚠️ Corrections (verified against `supabase/`):** the Edge Functions are
> **`analyze-emotion`** (Hume AI voice, Stream/WebSocket), **`delete-account`** (GDPR
> purge), and **`revenuecat-webhook`** (subscription state → `user_subscriptions`).
> There is **no** `hume-emotion` function. The schema is ~12 tables across 18
> migrations — beyond profiles/progress it includes fitness connections
> (`google_fit_connections`, `strava_connections`), `user_subscriptions`, and
> `public.app_events` + ~19 `analytics_*` views (see
> [analytics.md](analytics.md) / [../guides/analytics-views.md](../guides/analytics-views.md)).

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

### ⚠️ Supabase policy change — Oct 30, 2026

С **30 октября 2026** Supabase **перестаёт** автоматически давать grants ролям `anon` / `authenticated` / `service_role` на новые таблицы в `public`. Существующие таблицы свои текущие grants сохраняют — ничего не сломается.

Для **любой новой** таблицы в `public`, созданной после этой даты, нужно явно прописывать `GRANT`-ы в миграции — иначе PostgREST вернёт `42501 permission denied`.

Канонический шаблон новой миграции в `public` (используй вместо «голого» `create table` — см. также `supabase/migrations/_TEMPLATE.sql`):

```sql
create table public.<your_table> (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  -- ... колонки ...
  created_at timestamptz default now()
);

-- Grants — ОБЯЗАТЕЛЬНО для новых таблиц после 2026-10-30
grant select, insert, update, delete on public.<your_table> to authenticated;
grant all on public.<your_table> to service_role;
-- grant select on public.<your_table> to anon;  -- только если правда нужен анонимный доступ

-- RLS
alter table public.<your_table> enable row level security;

create policy "Users read own rows" on public.<your_table>
  for select to authenticated using (auth.uid() = user_id);

create policy "Users insert own rows" on public.<your_table>
  for insert to authenticated with check (auth.uid() = user_id);

-- ... остальные policies (update / delete) по необходимости
```

Для **internal** таблиц логика обратная — там grants по умолчанию не дают, и наоборот, надо явно `revoke` (см. секцию выше).

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
