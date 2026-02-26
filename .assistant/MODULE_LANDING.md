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
| **Лендинг** | `landing/` | `npm run dev:landing` или `cd landing && npm run dev` (порт 5173) |
| **Replit Preview** | — | Основное приложение (workflow → `npm run dev`) |
| **Replit Deployment** | — | Лендинг (build: `npm run build`, run: `node server.js` — см. `.replit`) |

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
├── index.html                    ← HTML с SEO meta-тегами, OG, шрифты, viewport-fit=cover
├── vite.config.ts                ← Vite + React + Tailwind v4 + allowedHosts
├── postcss.config.js             ← Изоляция от корневого Tailwind v3
├── server.js                     ← Production-сервер (Node.js, SPA fallback, instant port)
├── package.json                  ← Зависимости и скрипты
├── public/
│   ├── favicon.svg               ← Логотип ONDA Life (волна + текст, SVG)
│   └── hero-bg.png               ← Фоновое изображение hero-секции
└── src/
    ├── main.tsx                  ← Роутинг: /, /about, /glossary, /glossary/:slug, /part/:slug
    ├── index.css                 ← Tailwind v4, кастомные цвета, анимации
    ├── components/
    │   ├── Layout.tsx            ← Навигация + футер + scroll-to-top при навигации
    │   ├── HeroSection.tsx       ← Главный экран с параллакс-фоном
    │   ├── ConceptSection.tsx    ← Секция "Your Body is a Computer"
    │   ├── LevelsSection.tsx     ← 8 уровней (карточки, кликабельные parts → /part/:slug)
    │   ├── FeaturesSection.tsx   ← Трекеры, геймификация, система
    │   └── CtaSection.tsx        ← Секция "Initialize Your System" + App Store / Google Play
    ├── pages/
    │   ├── HomePage.tsx          ← Главная (все секции)
    │   ├── AboutPage.tsx         ← Страница "About" с описанием ONDA Life
    │   ├── PartPage.tsx          ← Детальное описание Part (уровня), ссылки на глоссарий
    │   ├── GlossaryPage.tsx      ← Список терминов с поиском/фильтрами
    │   └── GlossaryTermPage.tsx  ← Отдельная страница термина
    ├── config/
    │   └── routes.ts             ← Единый источник маршрутов (staticRoutes + getPrerenderRoutes)
    └── data/
        └── glossary.ts           ← Данные глоссария
```

---

## Маршруты

| Путь | Страница | Описание |
|------|----------|----------|
| `/` | HomePage | Главная с секциями Hero, Concept, Levels, Features, CTA |
| `/about` | AboutPage | О проекте ONDA Life (стиль заголовков с градиентами) |
| `/part/:slug` | PartPage | Детальное описание Part (например `/part/i-am`) |
| `/level/:number` | LevelPage | Агрегированное описание уровня (например `/level/1`, `/level/2`) |
| `/glossary` | GlossaryPage | Список терминов с поиском и фильтрами по категориям |
| `/glossary/:slug` | GlossaryTermPage | Отдельная страница термина (Markdown-контент) |

### Навигация между страницами

- При переходе на новую страницу контент мгновенно скрывается (`opacity: 0`), скролл сбрасывается, затем контент появляется уже сверху — без видимого скролла.
- Реализовано через `useLayoutEffect` + `requestAnimationFrame` в `Layout.tsx`.

### Страницы Part (PartPage.tsx)

Каждая Part — отдельная страница с подробным описанием практики. Стиль заголовков идентичен AboutPage (`text-2xl md:text-4xl`, градиенты `terminal-cyan → terminal-green`).

Структура данных Part:
- `badge` — бейдж уровня (`[ PART 1 — LEVEL 1: BODY / TERRA ]`)
- `title` / `titleHighlight` — заголовок с градиентным выделением
- `subtitle` — подзаголовок протокола
- `intro` — вводный текст
- `sections` — секции (Biological Protocol, Target Systems, Results & Benefits)
- `glossaryLinks` — ссылки на термины глоссария (теги внизу страницы)

Для добавления новой Part: добавить объект в `parts` в `PartPage.tsx` и `slug` в соответствующий part в `LevelsSection.tsx`.

Текущие Part-страницы:
- `/part/i-am` — Part 1: I Am (Level 1, BODY / TERRA)

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

- Кнопка `>` (бургер): `h-8 w-8 rounded-lg border-cyan-500/30 text-cyan-400`, поворачивается на 90° при открытии меню
- Лого: `ONDA` (`text-cyan-400`) + `LIFE` (`text-green-400`)
- Кнопка Download App: `bg-gradient-to-r from-cyan-500 to-green-500 text-black`, сдвинута от правого края (`mr-6 md:mr-8`)
- Выпадающее меню (одинаковое на всех экранах): About, Glossary, Language, Download, Contacts
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

Шрифт: `font-mono text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight`.

---

## Глоссарий

### Добавление нового термина

Файл: `landing/src/data/glossary.ts`

**Структура без дублирования:** страница рендерит `title` (H1) и `shortDescription` отдельно. В `content` **не повторяй** заголовок — начинай сразу с уникального текста. См. `.cursorrules` → «Глоссарий».

Добавить объект в массив `glossaryTerms`:

```typescript
{
  slug: 'term-slug',           // URL: /glossary/term-slug
  title: 'Term Title',         // Заголовок (H1 рендерится шаблоном)
  category: 'Category Name',   // Категория (для фильтрации)
  shortDescription: '...',     // Одно предложение (карточка + под заголовком)
  content: `
### Первая секция

Начинай сразу с контента — **без** повторения заголовка (## Term Title).
Используй ### для подзаголовков, Markdown для списков, таблиц, **жирного** текста.
`,
}
```

### Структура страницы термина (GlossaryTermPage)

Рендерится в порядке: breadcrumb → category badge → **H1** (`title`) → **shortDescription** → `content` (Markdown). Поэтому `content` не должен дублировать заголовок — иначе SEO-дублирование.

### Текущие категории и термины

- **Core Concepts** — Biocomputer, Firmware Update, Mind
- **Neuroscience** — Psycho-Neural Network, Molecular Psychology, Brain, Insular Cortex
- **Body Systems** — Interoception, Homeostasis, Primary Interoception, Metabolism, Vagus Nerve
- **Gamification** — OND Tokens

### SEO и SSG

Каждый термин и Part — отдельная страница с уникальным URL. Для страниц терминов глоссария настроено:
- **Meta description** — из `shortDescription`
- **Open Graph** — og:title, og:description, og:url, og:type (article)
- **Schema.org** — JSON-LD `DefinedTerm` для каждого термина **SSG включён**: после `vite build` запускается `scripts/prerender.ts`, который через Puppeteer генерирует статический HTML для каждого маршрута. Результат: `dist/about/index.html`, `dist/glossary/term-slug/index.html`, `dist/part/part-slug/index.html` — каждый URL = отдельный HTML-файл для индексации.

**Полная автоматизация маршрутов** — всё берётся из `src/config/routes.ts`:
- **Термины глоссария** — из `glossary.ts` (добавил термин → prerender подхватит)
- **Part-страницы** — из `PartPage.tsx` (добавил Part → prerender подхватит)
- **Новые статические страницы** — добавь `{ path: '/articles', component: ArticlesPage }` в `staticRoutes` в `routes.ts`; `main.tsx` уже рендерит маршруты из этого массива, prerender тоже подхватит

### После добавления контента

1. **Проверка сборки** — обязательно запусти:
   ```bash
   cd landing && npm run build
   ```
   Если сборка прошла без ошибок — prerender отработал, новые страницы попали в `dist/`.

2. **Где что добавлять:**

   | Тип контента | Где добавлять | Дополнительно |
   |--------------|--------------|---------------|
   | Термин глоссария | `glossary.ts` | Ничего |
   | Part-страница | `PartPage.tsx` (в `parts`) + `LevelsSection.tsx` (slug в карточке уровня) | Ничего |
   | Новая страница (напр. /articles) | `routes.ts` → `staticRoutes` + новый компонент страницы | `main.tsx` подхватит из `staticRoutes` автоматически |

3. **Перед деплоем** — всегда запусти `npm run build`. При необходимости проверь локально: `npm run start` и открой новые URL в браузере.

4. **Если prerender падает** — в логе будет строка вида `[prerender] Failed /glossary/some-slug ...`. Частые причины: неверный slug в ссылках или страница не успевает загрузиться (таймаут).

**Итог:** добавляешь контент в нужные файлы → запускаешь `npm run build` → prerender подхватывает всё автоматически. Дальше — см. «Процесс деплоя» (push → Replit Republish).

---

## Деплой на Replit

### ⚠️ КРИТИЧЕСКИ ВАЖНО: Replit Autoscale не сохраняет файлы между build и run

Replit Autoscale запускает `build` и `run` в **разных окружениях**. Папка `dist/`, созданная в фазе `build`, **не доступна** в фазе `run`. Это значит:

- ❌ **НЕ работает**: `build` собирает `dist/`, `run` запускает сервер — `dist/` не найден
- ❌ **НЕ работает**: `outDir: '../dist'` (в корень) — тоже теряется
- ❌ **НЕ работает**: раздельные `build` и `run` для Autoscale
- ✅ **Работает**: всё в одной команде `run` — install → build → start

### Рабочая конфигурация .replit

```toml
[deployment]
deploymentTarget = "autoscale"
build = ["bash", "-c", "cd landing && npm install && npm run build"]
run = ["bash", "-c", "cd landing && npm install && node server.js"]
```

**Важно:**
- `build` фаза: `cd landing && npm install && npm run build` — собирает `dist/`
- `run` фаза: `cd landing && npm install && node server.js` — на Autoscale `dist/` из build недоступна, поэтому `server.js` при отсутствии `dist/` запускает сборку в фоне; порт 5000 открывается сразу (loading-страница)
- Это решает проблему таймаута порта на Replit Autoscale

### Что где показывается

| Контекст | Что запускается | Что видно |
|----------|----------------|-----------|
| **Replit Preview** (кнопка Run) | `npm run dev` (корень, порт 5000) | Основное приложение |
| **Replit Deployment** (Republish) | build + run из `.replit` | Лендинг |
| **https://ONDALife.replit.app** | Deployment | Лендинг |
| **https://onda-life.com** | Deployment (после DNS) | Лендинг |

### Production-сервер (landing/server.js)

- Чистый Node.js HTTP-сервер (без express)
- **Мгновенное открытие порта**: показывает loading-страницу пока `dist/` не готов
- **Fallback-сборка**: если `dist/index.html` не найден — запускает `npm run build` в фоне
- Раздаёт статику из `landing/dist/`
- **SPA fallback**: любой маршрут без расширения → `index.html`
- Статические файлы: `Cache-Control: max-age=31536000, immutable`
- HTML: `Cache-Control: no-cache`
- Порт: `process.env.PORT || 5000`

### Процесс деплоя: от контента до Replit

**1. Локально (Cursor)**

- Добавить контент (термин, Part, страницу) — см. «После добавления контента»
- Проверить сборку: `cd landing && npm run build`
- Закоммитить и отправить в `main`:
  ```bash
  git add .
  git commit -m "описание изменений"
  git pull --rebase origin main   # обязательно перед push
  git push origin main
  ```

**2. На Replit**

- Открыть Replit Shell
- Подтянуть изменения: `git reset --hard origin/main`
- Нажать **Republish** (Deployments → Republish)
- Дождаться фаз: Provision → Security Scan → Build → Bundle → Promote

**3. Результат**

- Лендинг доступен на `https://ONDALife.replit.app`

**Если Republish failed** — проверить вкладку Publishing, прочитать ошибку. Частые причины: таймаут порта или отсутствие `dist/` (run-фаза пересобирает в фоне через `server.js`).

### postcss.config.js

Файл `landing/postcss.config.js` содержит пустую конфигурацию PostCSS.
Это **необходимо** для изоляции Tailwind v4 (лендинг) от Tailwind v3 (корневой проект).
Без этого файла Vite подхватывает корневой `postcss.config.js` с Tailwind v3.

---

## Локальная разработка

```bash
# Запуск dev-сервера лендинга (порт 5173)
cd landing && npm install && npm run dev
# или из корня:
npm run dev:landing
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

## Мобильная адаптация

Лендинг адаптирован под мобильные устройства (mobile-first через Tailwind breakpoints).

### Навигация

- **Все экраны**: кнопка `>` (бургер) + лого `ONDA LIFE` + кнопка `Download App`
- Бургер раскрывает выпадающее меню: About, Glossary, Language, Download, Contacts
- Меню закрывается при переходе на другую страницу или клике вне меню
- Скролл фона блокируется при открытом меню
- Safe area insets для устройств с вырезами (`pt-[env(safe-area-inset-top)]`)

### Адаптивная типографика

| Элемент | Мобильные | Десктоп |
|---------|-----------|---------|
| Hero заголовок | `text-3xl` → `sm:text-4xl` | `md:text-6xl` → `lg:text-7xl` |
| Hero подзаголовок | `text-sm` → `sm:text-base` | `md:text-xl` |
| Секции заголовки | `text-2xl` | `md:text-4xl` |
| Padding секций | `px-4 py-16` | `md:px-6 md:py-24` |

### CTA-кнопки

- На мобильных: ограничены `max-w-[200px]`, компактный padding (`px-4 py-2`)
- На десктопе: `sm:w-auto sm:flex-row`, стандартный padding

### Глоссарий

- Фильтры категорий: горизонтальный скролл на мобильных
- `pt-20` на страницах глоссария (отступ под фиксированный хедер)

---

## Уровни и Parts (LevelsSection.tsx)

8 уровней, каждый с 3 частями (Parts). Карточки уровней отображаются в сетке 2 колонки (десктоп) / 1 колонка (мобильные).

Если у Part есть `slug` — она отображается как кликабельная ссылка (`→`), ведущая на `/part/:slug`.

| Уровень | Название | Parts |
|---------|----------|-------|
| 1 | BODY / TERRA | 1) I Am (**→ /part/i-am**), 2) I Move, 3) I Adapt |
| 2 | EMOTIONS / AQUA | 4-6 |
| 3 | MIND / AER | 7-9 |
| 4 | SOCIETY / IGNIS | 10-12 |
| 5 | BODY II / TERRA II | 13-15 |
| 6 | BRAIN CONSCIOUSNESS / AQUA II | 16-18 |
| 7 | DNA CONSCIOUSNESS / AER II | 19-21 |
| 8 | ATOMIC CONSCIOUSNESS / IGNIS II | 22-24 |

---

## Будущие улучшения

- **SSG** — реализован через post-build prerender (Puppeteer), каждый термин и Part = отдельный HTML
- **Миграция на Vercel/Cloudflare Pages** — если Replit станет недостаточно
- **Многоязычность** — русская/английская версия лендинга
- **Markdown-файлы для глоссария** — вместо TS-объектов, для удобства редактирования
- **Описания для всех Parts** — добавить данные в `PartPage.tsx` и `slug` в `LevelsSection.tsx`
