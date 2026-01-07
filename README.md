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

## Documentation

📚 **[Full Documentation](./docs/index.md)**

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

## Деплой iOS

Автоматический через GitHub Actions → TestFlight.

## Лицензия

Проприетарное ПО.
