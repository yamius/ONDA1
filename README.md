# ONDA

Мобильное приложение для осознанности и благополучия с геймификацией и биометрическим трекингом.

## О проекте

ONDA проводит пользователей через прогрессивные "контуры" практик развития сознания, награждая за выполнение виртуальной валютой (OND). Приложение использует данные о здоровье в реальном времени для адаптивных, персонализированных медитаций и дыхательных упражнений.

## Возможности

- Медитации и дыхательные практики с аудио-сопровождением
- Интеграция с Apple Watch для мониторинга пульса в реальном времени
- Подключение Bluetooth пульсометров
- Расчёт стресса и энергии на основе вариабельности сердечного ритма
- Система наград и достижений
- Поддержка 5 языков (EN, ES, RU, UK, ZH)
- Тёмная и светлая темы

## Технологии

| Компонент | Технологии |
|-----------|------------|
| Frontend | React 18, TypeScript, Vite, TailwindCSS |
| iOS | Capacitor, Swift, WatchKit |
| Android | WebView, Kotlin, Health Connect |
| Backend | Supabase (Auth, PostgreSQL, Storage, Edge Functions) |
| Analytics | Firebase/GA4 + Supabase events (one typed `track()`), Tenjin (attribution/MMP) |

## Documentation

📚 **[Full Documentation](./docs/README.md)**

| Section | Description |
|---------|-------------|
| [Getting Started](./docs/getting-started/) | Setup guides for iOS, Android, CI/CD |
| [Architecture](./docs/architecture/) | System design and technical solutions |
| [Guides](./docs/guides/) | Step-by-step technical guides |

## Project Structure

```
src/                    # React PWA
├── components/         # UI components
├── hooks/              # React hooks (vitals, health data)
├── utils/              # Utilities and calculations
└── onda-level1-demo_27.tsx  # Main component

ios/                    # iOS app (Capacitor)
├── App/                # iPhone app
└── watchkitapp Watch App/  # Apple Watch app

android-webview/        # Android app
supabase/               # Edge Functions
docs/                   # Technical documentation
├── getting-started/    # Setup guides
├── architecture/       # System design
├── guides/             # Technical guides
└── archive/            # Legacy docs
```

## Запуск

```bash
npm install
npm run dev
```

## Деплой лендинга

| Контекст | Команда | Результат |
|----------|---------|------------|
| **Локальная разработка** | `cd landing && npm run dev` | Лендинг на http://localhost:5173 |
| **Production** | `cd landing && npm run build` → `npm run start` | Лендинг на https://onda-life.com |

**Процесс деплоя:**
1. Локально: `cd landing && npm run build` → `git add .` → `git commit -m "..."` → `git pull --rebase origin main` → `git push origin main`
2. На хостинге (Replit / Vercel / др.): подтянуть изменения и пересобрать

Подробнее: [`landing/docs/architecture.md`](./landing/docs/architecture.md) (раздел «Деплой»)

## Деплой iOS

Автоматический через GitHub Actions → TestFlight.

## Аналитика

Событийная аналитика идёт через один типизированный `track()` → Firebase/GA4 +
Supabase `app_events`; атрибуция (install/revenue) — через Tenjin (native).

- Канон событий: [`docs/architecture/analytics.md`](./docs/architecture/analytics.md)
- Активация Firebase: [`docs/guides/firebase.md`](./docs/guides/firebase.md)

## Лицензия

Проприетарное ПО.
