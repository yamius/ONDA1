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

## Структура проекта

```
src/                    # React PWA
├── components/         # UI компоненты
├── hooks/              # React хуки (vitals, health data)
├── utils/              # Утилиты и расчёты
└── onda-level1-demo_27.tsx  # Главный компонент

ios/                    # iOS приложение (Capacitor)
├── App/                # iPhone приложение
└── OndaWatch Watch App/  # Apple Watch приложение

android-webview/        # Android приложение
supabase/               # Edge Functions
.assistant/             # Документация для ИИ
docs/                   # Техническая документация
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
