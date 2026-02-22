# MODULE_LANDING — Лендинг onda-life.com

Документация по лендинг-странице ONDA Life.

---

## Общая архитектура

Лендинг — **отдельный проект** внутри основного репозитория, в папке `landing/`.

```
ONDA1/
├── src/              ← Основное приложение (мобильное, Capacitor)
├── landing/          ← Лендинг для onda-life.com (отдельный Vite-проект)
├── .replit           ← Preview = приложение, Deployment = лендинг
└── ...
```

### Разделение ответственности

| Что | Где | Как запускается |
|-----|-----|-----------------|
| **Мобильное приложение** | `src/` (корень) | `npm run dev` (порт 5000), сборка через Capacitor |
| **Лендинг** | `landing/` | `cd landing && npm run dev` (порт 5173) |
| **Replit Preview** | — | Основное приложение (workflow → `npm run dev`) |
| **Replit Deployment** | — | Лендинг (`cd landing && npm install && npm run build && npm run start`) |

### Домены

| URL | Что показывает |
|-----|---------------|
| `https://ONDALife.replit.app` | Лендинг (deployment) |
| `https://onda-life.com` | Лендинг (когда DNS будет настроен) |
| Replit Preview | Основное приложение (для разработки) |

---

## Стек лендинга

| Технология | Версия | Назначение |
|-----------|--------|------------|
| Vite | 7.x | Сборка |
| React | 19.x | UI |
| Tailwind CSS | 4.x | Стили |
| React Router DOM | 7.x | Маршрутизация (SPA) |
| React Markdown | 10.x | Рендеринг контента глоссария |
| TypeScript | 5.9 | Типизация |

---

## Структура файлов

```
landing/
├── index.html                    ← HTML с SEO meta-тегами, OG, шрифты
├── vite.config.ts                ← Vite + React + Tailwind v4 + allowedHosts
├── postcss.config.js             ← Изоляция от корневого Tailwind v3
├── server.js                     ← Production-сервер (Node.js, SPA fallback)
├── package.json                  ← Зависимости и скрипты
├── public/
│   ├── favicon.svg
│   └── hero-bg.png               ← Фоновое изображение hero-секции
└── src/
    ├── main.tsx                  ← Роутинг: /, /glossary, /glossary/:slug
    ├── index.css                 ← Tailwind v4, кастомные цвета, анимации
    ├── components/
    │   ├── Layout.tsx            ← Навигация + футер (общий каркас)
    │   ├── HeroSection.tsx       ← Главный экран с параллакс-фоном
    │   ├── ConceptSection.tsx    ← Секция "Your Body is a Computer"
    │   ├── LevelsSection.tsx     ← 8 уровней системы (карточки)
    │   ├── FeaturesSection.tsx   ← Трекеры, геймификация, система
    │   └── CtaSection.tsx        ← Кнопки App Store / Google Play
    ├── pages/
    │   ├── HomePage.tsx          ← Главная (все секции)
    │   ├── GlossaryPage.tsx      ← Список терминов с поиском/фильтрами
    │   └── GlossaryTermPage.tsx  ← Отдельная страница термина
    └── data/
        └── glossary.ts           ← Данные глоссария (термины)
```

---

## Маршруты

| Путь | Страница | Описание |
|------|----------|----------|
| `/` | HomePage | Главная с секциями Hero, Concept, Levels, Features, CTA |
| `/glossary` | GlossaryPage | Список терминов с поиском и фильтрами по категориям |
| `/glossary/:slug` | GlossaryTermPage | Отдельная страница термина (Markdown-контент) |

---

## Дизайн

### Шрифты

- **Roboto** — основной текст (sans-serif)
- **Roboto Mono** — моноширинный (бейджи, навигация, код)

Подключены через Google Fonts в `index.html`.

### Цветовая палитра (Tailwind классы)

| Элемент | Класс | Цвет |
|---------|-------|------|
| Циан (основной акцент) | `text-cyan-400` | #22d3ee |
| Зелёный (вторичный акцент) | `text-green-400` | #4ade80 |
| Фон страницы | `bg-[#050a0f]` | Тёмно-синий/чёрный |
| Текст основной | `text-white` | Белый |
| Текст вторичный | `text-gray-300` | Серый |
| Текст приглушённый | `text-white/40-50` | Полупрозрачный |

### Навигация (Layout.tsx)

- Лого: `> ONDA` (`text-cyan-400`) + `LIFE` (`text-green-400`)
- Кнопки About/Glossary: `border-cyan-500/30 text-cyan-400`
- Кнопка Download App: `bg-gradient-to-r from-cyan-500 to-green-500 text-black`
- Закругление кнопок: `rounded-lg` (НЕ `rounded-full`, кроме бейджей-статусов)

### Бейджи-статусы

| Бейдж | Стиль |
|-------|-------|
| `[ SYSTEM INITIALIZED ]` | `rounded-full border-cyan-500/50 bg-cyan-500/10 text-cyan-400` |
| `[ CONCEPT ]`, `[ FEATURES ]` и т.д. | Простой текст `text-terminal-green/60` |
| `[ READY TO UPGRADE? ]` | `rounded-full border-terminal-green/25 bg-black/40 text-terminal-green` |

### Hero-секция (параллакс)

Фоновое изображение двигается на **50% скорости скролла**:

```typescript
const [scrollY, setScrollY] = useState(0)
useEffect(() => {
  const handleScroll = () => setScrollY(window.scrollY)
  window.addEventListener('scroll', handleScroll, { passive: true })
  return () => window.removeEventListener('scroll', handleScroll)
}, [])

// В JSX:
style={{ transform: `translateY(${scrollY * 0.5}px)` }}
```

Фон: `opacity-40`, оверлей: `bg-gradient-to-b from-black/60 via-black/40 to-black`.

### Заголовок Hero

```
ONDA LIFE:         → text-cyan-400
Operating System   → text-green-400
for Your Consciousness → text-white
```

Шрифт: `font-mono text-6xl md:text-7xl font-bold leading-tight`.

---

## Глоссарий

### Добавление нового термина

Файл: `landing/src/data/glossary.ts`

Добавить объект в массив `glossaryTerms`:

```typescript
{
  slug: 'term-slug',           // URL: /glossary/term-slug
  title: 'Term Title',         // Заголовок
  category: 'Category Name',   // Категория (для фильтрации)
  shortDescription: '...',     // Краткое описание (на карточке)
  content: `
## Markdown Content

Полное описание термина в формате **Markdown**.
Поддерживаются: заголовки, списки, таблицы, жирный текст, код.
`,
}
```

### Текущие категории

- **Core Concepts** — Biocomputer, Firmware Update
- **Neuroscience** — Psycho-Neural Network, Molecular Psychology
- **Body Systems** — Interoception
- **Gamification** — OND Tokens

### SEO

Каждый термин — отдельная страница с уникальным URL (`/glossary/slug`).
В будущем при переходе на SSG каждая страница станет отдельным HTML-файлом для индексации.

---

## Деплой

### Как работает .replit

```toml
[deployment]
# Build пустой — всё в run (Replit не сохраняет dist между build и run)
build = ["bash", "-c", "echo 'Build handled in run command'"]
# Run: install → build → serve
run = ["bash", "-c", "cd landing && npm install && npm run build && npm run start"]

[workflows]
# Preview — основное приложение (для разработки)
args = "npm run dev"
waitForPort = 5000
```

### Production-сервер (server.js)

- Чистый Node.js HTTP-сервер (без express)
- Раздаёт статику из `landing/dist/`
- **SPA fallback**: любой маршрут без расширения → `index.html`
- Статические файлы: `Cache-Control: max-age=31536000, immutable`
- HTML: `Cache-Control: no-cache`
- Порт: `process.env.PORT || 5000`

### Процесс деплоя

1. Внести изменения в `landing/` (Cursor)
2. Commit + push в `main`
3. На Replit: `git reset --hard origin/main`
4. Нажать **Republish**
5. Лендинг появится на `https://ONDALife.replit.app`

### postcss.config.js

Файл `landing/postcss.config.js` содержит пустую конфигурацию PostCSS.
Это **необходимо** для изоляции Tailwind v4 (лендинг) от Tailwind v3 (корневой проект).
Без этого файла Vite подхватывает корневой `postcss.config.js` с Tailwind v3.

---

## Локальная разработка

```bash
# Запуск dev-сервера
cd landing && npm install && npm run dev
# → http://localhost:5173/

# Сборка production
cd landing && npm run build
# → landing/dist/

# Запуск production-сервера
cd landing && npm run start
# → http://localhost:5000/
```

---

## DNS для onda-life.com (в ожидании)

Домен на **GoDaddy**. Для привязки к Replit нужно:

| Тип | Hostname | Значение |
|-----|----------|----------|
| A | @ | `34.111.179.208` |
| TXT | @ | `replit-verify=a99cf86e-1faa-4171-a249-a55f91d2d125` |

Текущие записи не совпадают (A → 75.2.60.5, TXT отсутствует).
После обновления DNS `onda-life.com` начнёт показывать лендинг.

---

## Будущие улучшения

- **SSG (Static Site Generation)** — для SEO глоссария (каждый термин = отдельный HTML)
- **Миграция на Vercel/Cloudflare Pages** — если Replit станет недостаточно
- **Многоязычность** — русская/английская версия лендинга
- **Markdown-файлы для глоссария** — вместо TS-объектов, для удобства редактирования
