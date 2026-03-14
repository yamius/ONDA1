# MODULE_LANDING — Лендинг onda-life.com

Документация по лендинг-странице ONDA Life.

---

## Общая архитектура

Лендинг — **отдельный проект** внутри основного репозитория, в папке `landing/`.

```
ONDA1/
├── src/              ← Основное приложение (мобильное, Capacitor)
├── landing/          ← Лендинг для onda-life.com (отдельный Vite-проект)
├── .replit           ← конфиг для Replit (если используется)
└── ...
```

### Разделение ответственности

| Что | Где | Как запускается |
|-----|-----|-----------------|
| **Мобильное приложение** | `src/` (корень) | `npm run dev` (порт 5000), сборка через Capacitor |
| **Лендинг** (разработка) | `landing/` | `cd landing && npm run dev` (порт 5173) |
| **Лендинг** (production) | https://onda-life.com | `npm run build` + `node server.js` |

### Домены

| URL | Что показывает |
|-----|---------------|
| **https://onda-life.com** | Лендинг (основной домен) |
| localhost:5173 | Лендинг (локальная разработка) |

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
│   ├── onda-life-hrv-consciousness-hero.png  ← Фоновое изображение hero-секции (SEO-имя)
│   ├── robots.txt                ← Allow/Disallow, Sitemap (без trailing slash в директивах)
│   ├── images/articles/          ← Header-изображения статей (SEO-имена: keyword-topic-onda.png)
│   └── images/parts/             ← Header-изображения Part-страниц (SEO-имена: onda-part-N-slug-*.png)
└── src/
    ├── main.tsx                  ← Роутинг: /, /about, /glossary, /glossary/:slug, /part/:slug
    ├── index.css                 ← Tailwind v4, кастомные цвета, анимации
    ├── components/
    │   ├── Layout.tsx            ← Навигация + футер + FooterSitemap + scroll-to-top при навигации
    │   ├── FooterSitemap.tsx     ← HTML-карта сайта в футере (для роботов, свёрнута по умолчанию)
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
| `/articles` | ArticlesPage | Список статей с поиском и фильтрами |
| `/articles/:slug` | ArticlePage / MdArticlePage | Статическая TS-статья или Markdown (Telegram) |
| `/part/:slug` | PartPage | Детальное описание Part (например `/part/i-am`) |
| `/level/:number` | LevelPage | Агрегированное описание уровня (например `/level/1`, `/level/2`) |
| `/glossary` | GlossaryPage | Список терминов с поиском и фильтрами по категориям |
| `/glossary/:slug` | GlossaryTermPage | Отдельная страница термина (Markdown-контент) |
| `/the-stack` | TheStackPage | Дашборд всех протоколов с STATUS |

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
- **Header-изображение (опционально):**
  - `image` — путь `/images/parts/onda-part-N-slug-conscious-architecture.png`
  - `imageAlt` — SEO alt (~125 символов: keywords)
  - `imageTitle` — title-атрибут (hover, техническое описание)
  - Рендер: под заголовком h1, без подписи, `loading="lazy"`
- `sections` — секции (Biological Protocol, Target Systems, Results & Benefits)
- `glossaryLinks` — ссылки на термины глоссария (теги внизу страницы)

Для добавления новой Part: добавить объект в `parts` в `PartPage.tsx` и `slug` в соответствующий part в `LevelsSection.tsx`.

Текущие Part-страницы:
- `/part/i-am` — Part 1: I Am (Level 1, BODY / TERRA) — с header-изображением сознания/нейросети

---

## Articles (статические статьи)

SEO-статьи в стиле «биокомпьютер / протокол». Хранятся в `landing/src/data/articles/` как TS-модули.

### Типы статей

| Тип | Где | Описание |
|-----|-----|----------|
| **Статические (TS)** | `landing/src/data/articles/*.ts` | Full control, prerender, протоколы с [DONE]/[ACTIVE] |
| **Markdown (Telegram)** | `articles/*.md` | См. `docs/guides/telegram-articles-bot.md` |

### Структура Article (types.ts)

```typescript
{
  slug: 'article-slug',           // URL: /articles/article-slug
  title: 'Article Title',
  seoTitle?: 'Custom Title | ONDA',  // переопределение <title>, og:title (иначе: title + " | ONDA Life")
  description: 'SEO description',  // meta description, og:description (~150–160 символов)
  category: 'Neural Hardware',   // см. ARTICLE_CATEGORIES
  relatedSlugs: ['vagus-nerve', 'hrv'],  // термины глоссария
  content: `## [ SECTION ] ...`,  // Markdown
  howToSteps?: [                 // для протоколов с [DONE]/[ACTIVE]
    { name: '...', text: '...', protocolId: 'short-protocolKey' },
  ],
  introStyle?: 'cyan' | 'purple' | 'amber' | 'emerald' | 'blue' | 'orange' | 'rose' | 'indigo' | 'gold' | 'slate',
  neuralSuggestion?: { text: '...', link: '/articles/...', linkText: '...' },
  // Изображение (опционально)
  image?: '/images/articles/keyword-article-name.png',
  imageAlt?: '...',    // ~125 символов, ключевое слово + описание визуала. SEO-критично. Используется для og:image:alt, twitter:image:alt, img alt.
  imageTitle?: '...',  // title-атрибут img (всплывающая подсказка при hover)
  imageCaption?: '...', // видимая подпись под картинкой (figcaption). ONDA-голос, keyword-rich.
  imagePlacement?: 'header' | 'content',  // 'header' = под заголовком; 'content' = inline в markdown
}
```

**⚠️ НЕ используй `terminologyBlock`** — термины из статей добавляются только в глоссарий (см. правило ниже).

### Изображения: SEO и размещение

| Параметр | Роль | Рекомендация |
|----------|------|--------------|
| **Имя файла** | Фактор ранжирования | `keyword-topic-onda.png` вместо `IMG_1234.png` |
| **imageAlt** | Главный SEO-сигнал. Используется для `img` alt, `og:image:alt`, `twitter:image:alt` | ~125 символов, keyword-rich, описание визуала |
| **imageTitle** | Атрибут `title` у `img` (всплывающая подсказка при hover) | Кратко, с ключевым словом |
| **imageCaption** | Видимая подпись под картинкой (`figcaption`). ONDA-голос, keyword-rich | Опционально. Увеличивает dwell time |
| **imagePlacement** | Семантика | `'header'` — под заголовком (по умолчанию); `'content'` — inline в markdown |

**Размещение в контенте:** при `imagePlacement: 'content'` добавь изображение в markdown после intro blockquote с вводной фразой:

```markdown
> "Intro quote..."

The diagram below maps [концепция] to [метрики].

![Alt text с ключевым словом](/images/articles/file-name.png "Title для tooltip")

---
## [ SECTION 1: ... ]
```

**Meta-теги для картинки (автоматически):** при наличии `article.image` и `article.imageAlt`:
- `og:image`, `twitter:image` — полный URL картинки статьи (иначе — общий OG_IMAGE)
- `og:image:alt`, `twitter:image:alt` — из `imageAlt`
- JSON-LD TechArticle — поле `image` в схеме

**Файл изображения:** `landing/public/images/articles/`. Карточка в списке статей всегда использует `article.image`.

**Производительность:** все изображения рендерятся с `loading="lazy"` (уже в ArticlePage).

**Примеры имён файлов:** `vagus-nerve-biohacking-data-highway.png`, `dopamine-stacking-circuit-overload.png`, `onda-cacao-stem-cell-regeneration-matrix.png`.

### Протоколы и кнопки [ DONE ]

Для привязки кнопки [ DONE ] к блоку «The Hack» поле `howToSteps[].text` должно **совпадать по подстроке** с текстом в blockquote (матчинг: `blockquoteContent.includes(s.text)` или `hackText.includes(s.text)`). Можно использовать укороченный текст — например, `"Perform one high-dopamine activity at a time"` вместо полной фразы. **Не добавляй** `[ DONE ]` в markdown — кнопка рендерится автоматически.

### Система синхронизации протоколов ([ DONE ] ↔ The Stack)

**Правило:** `howToSteps[].protocolId`, ключ в `PROTOCOL_TO_ARTICLE` и `id` в `TheStackPage` должны быть **одинаковыми строками**. Только так кнопка [ DONE ] в статье и тогл в The Stack пишут/читают один и тот же ключ localStorage.

**Формат protocolId:** `{short}-{base}`, где `short` = значение из `ARTICLE_SHORT` для данной статьи. Примеры: `breathwork-box-breathing`, `femtech-phase-sync`, `glymph-sleep-posture`.

**Как работает:**
```
protocolId = 'breathwork-box-breathing'                          // в статье и TheStack

PROTOCOL_TO_ARTICLE['breathwork-box-breathing']
  → 'breathwork-command-line-interface'                          // articleSlug

ARTICLE_SHORT['breathwork-command-line-interface']
  → 'breathwork'                                                 // short

getProtocolUniqueId('breathwork-box-breathing')
  → 'breathwork-breathwork-box-breathing'                        // uniqueId

localStorage key
  → 'onda-protocol-breathwork-breathwork-box-breathing'          // итоговый ключ
```

**Исключения (не использовать prefix):** `cacao-stem-cells` и `cognitive-architecture-neural-throughput` — у них `protocolId` в статье это просто base-ключ (`cellular-ignition`, `neural-circuit-digital-sunset`). В TheStack и PROTOCOL_TO_ARTICLE тоже base-ключ. Эти статьи не трогать без необходимости.

**`ARTICLE_PROTOCOL_ORDER`** — только для MD-статей, опубликованных через Telegram-бота. На TS-статьи не влияет.

### Чеклист: добавление новой статьи

1. **Создать файл** `landing/src/data/articles/{slug}.ts`
   - Экспорт: `export default [article]`

2. **Зарегистрировать в index** `landing/src/data/articles/index.ts`
   - `import xxxArticle from './xxx'`
   - Добавить в массив `articles`

3. **Если есть протоколы** — `landing/src/data/protocol-ids.ts`:
   - `ARTICLE_SHORT`: добавить `'article-slug': 'short'` — выбрать короткий уникальный префикс
   - `howToSteps[].protocolId` = `'{short}-{base}'` (например `femtech-phase-sync`)
   - `PROTOCOL_TO_ARTICLE`: для каждого протокола добавить `'тот_же_protocolId': 'article-slug'`
   - ⚠️ **Ключ в `PROTOCOL_TO_ARTICLE` должен быть идентичен `protocolId` из `howToSteps`** — иначе `[ DONE ]` пишет `unknown-*`

4. **ArticlePage.tsx** (обязательно):
   - `ARTICLE_SLUG_TO_STACK_SECTION`: slug → id секции The Stack (см. таблицу «Секции The Stack» ниже)
   - `ARTICLE_SYNC_TIMES`: slug → время чтения (например `'4 min 45 sec'`). Чтобы **скрыть блок времени** — добавить `article.slug !== 'xxx'` в условие рендера (пример: cacao-stem-cells)
   - CTA-блок: добавить ветку `article.slug === 'xxx'` с текстом призыва

5. **meta-inject.ts** (для кастомного SEO):
   - `ARTICLE_SEO_TITLES`: slug → кастомный title (если нужен отличный от `title + " | ONDA Life"`)
   - `ARTICLE_SEO_DESCRIPTIONS`: slug → кастомный meta description
   - Для JSON-LD TechArticle с keywords, audience, dependencies, proficiencyLevel — добавить slug в блок `techArticleExtras` (см. dopamine-stacking, cacao-stem-cells)
   - **FAQ schema:** добавить slug в `FAQ_SCHEMA` с массивом `{ question, answer }[]` для FAQPage JSON-LD

6. **TheStackPage.tsx** — если протоколы должны быть в The Stack:
   - Добавить в нужную секцию `STACK_COMPONENTS`: `{ id: 'тот_же_protocolId', name: 'PROTOCOL_NAME', params: '...' }`
   - ⚠️ `id` должен совпадать с `protocolId` из статьи и ключом в `PROTOCOL_TO_ARTICLE`

7. **Опционально** `landing/src/data/articles-categories.ts`:
   - Добавить slug в `FEATURED_ARTICLE_SLUGS` для вывода в Featured

8. **Термины из статьи → глоссарий** (обязательно, если в статье есть новые термины):
   - Добавить каждый термин в `landing/src/data/glossary.ts` (см. правило «Термины из статей» в разделе Глоссарий)
   - Добавить slug в `landing/src/data/glossary-categories.ts` → `SLUG_TO_CATEGORY`
   - При необходимости добавить аббревиатуры в `landing/src/utils/glossaryLinks.ts` → `ARTICLE_ABBREVIATIONS`
   - В тексте статьи использовать те же формулировки/названия — ссылки на глоссарий подставляются автоматически

9. **Если есть изображение:**
   - Сохранить в `landing/public/images/articles/` с SEO-именем (keyword-topic-onda.png)
   - Заполнить `image`, `imageAlt`, `imageTitle`, при необходимости `imageCaption` (видимая подпись)
   - Выбрать `imagePlacement`: `'header'` — под заголовком; `'content'` — inline в markdown после intro
   - При `'content'` — добавить изображение в markdown с вводной фразой (см. «Изображения: SEO и размещение»)
   - og:image, twitter:image, og:image:alt, TechArticle.image подставляются автоматически

### Секции The Stack (id для ARTICLE_SLUG_TO_STACK_SECTION)

| id | Секция |
|----|--------|
| `nervous-system` | NERVOUS_SYSTEM |
| `reward-logic` | REWARD_LOGIC |
| `energy-grid` | ENERGY_GRID |
| `power-grid` | POWER_GRID |
| `regeneration-matrix` | REGENERATION_MATRIX |
| `neural-hardware` | NEURAL_HARDWARE |
| `cognitive-engine` | COGNITIVE_ENGINE |
| `gut-brain-link` | GUT_BRAIN_LINK |
| `system-forecasting` | SYSTEM_FORECASTING |
| `os-states` | OS_STATES |

### Категории статей (ARTICLE_CATEGORIES)

- Neural Hardware
- Biological Software
- OS States
- ONDA Protocol

### После добавления

```bash
cd landing && npm run build
```

Prerender автоматически создаёт `dist/articles/{slug}/index.html`. Маршруты берутся из `articles` в `routes.ts`.

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

### Правило: термины из статей → только в глоссарий

**Новые термины из статей НЕ добавляются в статью (нет `terminologyBlock`).** Все термины должны быть в глоссарии, а в тексте статьи — только упоминания. Ссылки на глоссарий подставляются автоматически через `injectArticleGlossaryLinks()`.

**При добавлении новой статьи с новыми терминами:**

1. Добавь каждый термин в `landing/src/data/glossary.ts` в массив `rawGlossaryTerms`
2. Добавь slug в `landing/src/data/glossary-categories.ts` → `SLUG_TO_CATEGORY`
3. Для аббревиатур (NIR, PBM, CSF, BOLT и т.п.) — добавь паттерн в `landing/src/utils/glossaryLinks.ts` → `ARTICLE_ABBREVIATIONS`
4. Используй в статье те же названия, что в `title` термина — тогда ссылки подставятся автоматически

### Добавление нового термина

Файл: `landing/src/data/glossary.ts`

**Структура без дублирования:** страница рендерит `title` (H1) и `shortDescription` отдельно. В `content` **не повторяй** заголовок — начинай сразу с уникального текста. См. `.cursorrules` → «Глоссарий».

Добавить объект в массив `rawGlossaryTerms`:

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

### SEO и индексация (последние изменения)

**Канонические URL без trailing slash.** Все URL на сайте используют формат без слэша на конце (`/articles`, `/glossary/vagus-nerve`). Сервер (`server.js`):
- `redirect: false` в `express.static` — отключает редирект `/articles` → `/articles/`
- Middleware редиректит запросы со слэшем (`/articles/`) 301 на канонический URL без слэша (`/articles`)

**robots.txt** (`landing/public/robots.txt`):
```
User-agent: *
Allow: /
Allow: /glossary
Allow: /level
Allow: /part
Allow: /about
Allow: /articles
Disallow: /static/
Sitemap: https://onda-life.com/sitemap.xml
```
Директивы `Allow` — без завершающих слэшей, в соответствии со стандартом URL.

**HTML-карта сайта (FooterSitemap).** В футере на каждой странице — свёрнутый блок «Site map» (`<details>`), содержащий прямые ссылки на все важные разделы: Main, Articles, Levels & Parts, Glossary. Контент всегда в DOM — роботы видят ссылки без клика. Компонент: `landing/src/components/FooterSitemap.tsx`.

**Бургер-меню.** Ссылки (About, Glossary, Articles, Download, Contact) всегда в DOM, скрыты через `opacity-0` и `pointer-events-none`, когда меню закрыто. Роботы находят ссылки при первичной загрузке.

**Страница About.** `meta-inject.ts` + `AboutPage.tsx`: title, description, og:title, og:description, og:type, JSON-LD `AboutPage` с `SoftwareApplication` в mainEntity. H1: «What is ONDA Life».

**sitemap.xml.** Генерируется при `npm run build` (`scripts/sitemap.ts`), все URL с `https://onda-life.com`, без trailing slash. Production-сервер при необходимости отдаёт динамический sitemap (см. `server.js`).

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
   | Статическая статья | `data/articles/*.ts` + `index.ts` + `protocol-ids.ts` + `ArticlePage.tsx` + `TheStackPage.tsx` | См. «Articles (статические статьи)» |
   | Новая страница (напр. /articles) | `routes.ts` → `staticRoutes` + новый компонент страницы | `main.tsx` подхватит из `staticRoutes` автоматически |

3. **Перед деплоем** — всегда запусти `npm run build`. При необходимости проверь локально: `npm run start` и открой новые URL в браузере.

4. **Если prerender падает** — в логе будет строка вида `[prerender] Failed /glossary/some-slug ...`. Частые причины: неверный slug в ссылках или страница не успевает загрузиться (таймаут).

**Итог:** добавляешь контент в нужные файлы → запускаешь `npm run build` → prerender подхватывает всё автоматически. Дальше — см. «Процесс деплоя» (push → хостинг).

---

## Деплой

**Основной домен:** https://onda-life.com

### Локальная подготовка

1. Добавить контент (термин, Part, страницу) — см. «После добавления контента»
2. Проверить сборку: `cd landing && npm run build`
3. Закоммитить и отправить в `main`:
   ```bash
   git add .
   git commit -m "описание изменений"
   git pull --rebase origin main   # обязательно перед push
   git push origin main
   ```

### Хостинг (Replit / Vercel / др.)

После push хостинг подтягивает изменения и пересобирает. Лендинг доступен на https://onda-life.com.

**Если используется Replit:**

- Replit Autoscale деплоит из **workspace**, не напрямую из GitHub.
- Build step содержит `git pull` для автоматической синхронизации с GitHub.
- Конфигурация `.replit` (рабочие настройки):
  ```toml
  [deployment]
  deploymentTarget = "autoscale"
  healthcheck = "/health"
  build = ["bash", "-c", "git pull origin main --ff-only || true && cd landing && rm -rf dist && npm install && npm run build"]
  run = ["bash", "-c", "cd landing && npm install && PORT=5000 node server.js"]

  [[ports]]
  localPort = 5000
  externalPort = 80
  ```
- **`healthcheck = "/health"`** — путь для проверки живости (если Replit поддерживает).
- **`PORT=5000`** в run — явно совпадает с `localPort` в `[[ports]]`.
- **`git pull` в build** — автоматически подтягивает свежий код из GitHub перед сборкой. `|| true` — чтобы деплой не падал, если pull невозможен (например, diverging branches).
- **`rm -rf dist` в build — обязательно.** Без этого Replit может использовать закешированный `dist/` от предыдущей сборки.
- Порты: `[[ports]] localPort = 5000, externalPort = 80` — сервер слушает на `0.0.0.0:5000`.
- Процесс деплоя: `git push` из Cursor → нажать **Deploy** в Replit (build step сам сделает `git pull`)

> **⚠️ НЕ МЕНЯТЬ конфигурацию деплоя без крайней необходимости.**
> Эта конфигурация — проверенная и рабочая. Любые изменения в `build`/`run` командах `.replit`, в `server.js` (порядок запуска, healthcheck, fallback) могут сломать деплой. Если деплой перестал работать — сначала проверь, что конфигурация соответствует документации выше.

> **⚠️ НЕ использовать `git` в runtime (server.js).**
> В Replit Autoscale deployment-контейнере `git` может быть недоступен или `.git` отсутствует. Любые вызовы `execSync('git ...')` в server.js приведут к 500 ошибкам и бесконечным перезапускам. Git — только в build step.

> **⚠️ `express.static` и несуществующий `distDir`.**
> Если `dist/` не существует при старте сервера, `express.static` может выбрасывать ошибки → 500 на healthcheck → Replit убивает процесс. Поэтому `server.js` создаёт `dist/` через `mkdirSync` при старте.

**Если деплой не подхватывает изменения:**

1. Зайти в Shell на Replit
2. Проверить, что код синхронизирован: `git log --oneline -3` (сравнить с GitHub)
3. Если код старый — синхронизировать вручную:
   ```bash
   git stash
   git rebase origin/main
   git stash pop
   ```
   Или: `git pull origin main --ff-only` (если нет diverging branches)
4. Нажать **Deploy**

**Если Replit Agent сделал локальные коммиты (diverging branches):**

Replit Agent может автоматически коммитить изменения в workspace. Это создаёт diverging branches, и `git pull --ff-only` не работает. Решение:
```bash
git stash                    # сохранить локальные изменения
git rebase origin/main       # перебазировать поверх свежего main
git stash pop                # вернуть локальные изменения
```

**Replit: `signal: terminated` (процесс убивается каждые 2 минуты):**

Replit проверяет живость приложения по HTTP. Если healthcheck не проходит (таймаут >5 сек, 500, или неверный ответ) — процесс завершается с `signal: terminated`.

**Что проверить:**
1. **Логи** — смотреть `[timestamp] - GET /` и `[root] ...` — по ним видно, какой путь и User-Agent использует Replit
2. **`/health`** — должен отвечать 200 OK за &lt;1 сек
3. **`/`** — для healthcheck-запросов (по UA) сервер отдаёт минимальный HTML мгновенно; для обычных — из кэша (без чтения диска)
4. **Порт** — `localPort = 5000` в `.replit` и `PORT=5000` в run должны совпадать
5. **`0.0.0.0`** — сервер слушает на `0.0.0.0`, а не `127.0.0.1`

**Если Replit стучится по `/` с неизвестным User-Agent:**
- Добавить паттерн в `isHealthcheckRequest()` в `server.js` (например, по логам `[root] no cache, passing to SSG, UA: ...`)

**Файлы конфигурации:**
- `.replit` — `healthcheck = "/health"`, `PORT=5000` в run, `[[ports]] localPort = 5000`
- `replit.nix` — `pkgs.nodejs_20` (если используется Nix)

### Production-сервер (landing/server.js)

Express-сервер, раздаёт статику из `landing/dist/`.

**Порядок обработки (критично для Replit):**

1. **Логирование** — все входящие запросы: `[timestamp] - METHOD /path`
2. **`/health`** (GET, HEAD) → 200 OK — первый маршрут, максимально быстрый
3. **`/`** — приоритетный обработчик:
   - **Healthcheck UA** — если User-Agent содержит `replit`, `healthcheck`, `curl`, `wget`, `headless`, `googlecloud` или `?health=1` → мгновенный ответ с минимальным HTML
   - **Кэш** — `dist/index.html` загружается в память при старте → ответ без чтения с диска
   - Иначе → SSG-роутер (sendFile или заглушка)
4. Остальные маршруты (API, static, SSG)

**Ключевые механизмы:**

| Механизм | Описание |
|----------|----------|
| **Startup safety** | `mkdirSync(distDir)` — гарантирует существование `dist/` до `express.static` |
| **Root cache** | `cachedRootHtml` — `readFileSync` при старте; обновляется после фоновой сборки |
| **Healthcheck UA** | `isHealthcheckRequest()` — определяет запросы Replit/балансировщика по User-Agent |
| **Canonical URLs** | middleware редиректит `/path/` → `/path` (301) |
| **Fallback-сборка** | если `dist/index.html` нет — `npm run build` в фоне, заглушка "Building..." |
| **Global error handler** | перехватывает ошибки, возвращает 200 вместо 500 (критично для healthcheck) |
| **Try-catch** | SSG-роутер, loadMdArticles, sendFile — логирование stack trace при ошибках |

**Кэш и порт:**
- Статика: `Cache-Control: max-age=31536000, immutable`
- HTML: `Cache-Control: no-cache`
- Порт: `process.env.PORT || 5000` (в Replit run: `PORT=5000`)

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

## DNS для onda-life.com

Домен настроен и указывает на https://onda-life.com. Лендинг доступен по основному домену.

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
| 6 | BRAIN / AQUA II | 16-18 (**→ /level/6**) |
| 7 | DNA / AER II | 19-21 (**→ /level/7**) |
| 8 | ATOMIC / IGNIS II | 22-24 (**→ /level/8**) |

### Правила оформления описаний уровней

**Источник данных:** `landing/src/data/levels.ts`. Страница уровня: `LevelPage.tsx`, карточка на главной: `LevelsSection.tsx`.

**Структура LevelData (levels.ts):**

| Поле | Назначение |
|------|------------|
| `number`, `badge`, `name`, `subtitle` | Идентификация и заголовок |
| `metaDescription` | SEO meta description (150–160 символов) |
| `intro` | Вводный текст (абзацы через `\n\n`) |
| `architecture` | System Architecture: `title`, `intro`, `parts[]` (number, label, slug, protocol, goal, work) |
| `biologicalProtocol` | Biological Protocol: `intro`, `items[]` (name, text) |
| `targetSystems` | Target Systems: `intro`, `items[]` (name, text) |
| `results` | Results & Benefits: `intro`, `items[]` (строки) |
| `researchLinks` | Ссылки на PubMed (label, url) |
| `glossaryLinks` | Термины глоссария (label, slug) — slug должен существовать в glossary.ts |

**Семантика:**

- `h1`: Level X + name (LevelPage)
- `h2`: subtitle, [ SYSTEM ARCHITECTURE ], Biological Protocol, Target Systems, Results & Benefits, Research Basis, Related Terms
- `h3`: подзаголовки внутри секций (например, items в biologicalProtocol)

**Ссылки на Parts:**

- У каждой ссылки «→ Open X protocol» — `aria-label` и `title` с названием протокола.
- URL: `/part/:slug` (например `/part/i-sense`).

**SEO:**

- Schema.org: JSON-LD `CreativeWork` с `name`, `description`, `url`, `author`, `about` (Target Systems) — инжектируется в prerender.
- Meta: title, description, og:*, twitter:* — из `metaDescription` и `subtitle`.

**Карточка на главной (LevelsSection):**

- `name`, `description` — краткое описание уровня.
- `researchLinks` — опционально; если не нужны отдельные ссылки, включи ключевые термины в `description`.

**Уровни с полными страницами (levelsWithPages):** 1, 2, 3, 4, 5, 6, 7, 8 — все 8 уровней имеют отдельные страницы `/level/N`.

**FAQ-схема (meta-inject.ts → FAQ_LEVEL_SCHEMA):** Уровни 6, 7, 8 имеют FAQ JSON-LD (по 3 вопроса). При добавлении нового уровня — добавить FAQ.

**Level 8 особенности:**
- Тема: `border-violet-500/30`, `text-amber-300` (violet + gold)
- Градиент карточки: `from-violet-500/20 via-amber-500/10 to-white/5`

**Добавление нового уровня:**

1. Добавить `levelThemes[N]` в levels.ts.
2. Добавить объект уровня в `levelsData`.
3. Добавить карточку в `LevelsSection.tsx` (levels array).
4. Добавить `N` в `levelsWithPages`, если нужна отдельная страница `/level/N`.
5. Добавить FAQ в `meta-inject.ts` → `FAQ_LEVEL_SCHEMA[N]`.
6. Обновить бейджи Parts в `PartPage.tsx`.

---

## Будущие улучшения

- **SSG** — реализован через post-build prerender (Puppeteer), каждый термин и Part = отдельный HTML
- **Альтернативный хостинг** — Vercel/Cloudflare Pages при необходимости
- **Многоязычность** — русская/английская версия лендинга
- **Markdown-файлы для глоссария** — вместо TS-объектов, для удобства редактирования
- **Описания для всех Parts** — добавить данные в `PartPage.tsx` и `slug` в `LevelsSection.tsx`
