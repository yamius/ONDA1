# ONDA Science — аудит перед запуском (фаза 1)

Дата: 2026-10-04. Только чтение: страницы, роуты, данные `/science/`, существующие URL, статьи, калькуляторы, sitemap и сервер `/mcp` не менялись.

Основа — документы `D:\_ONDA\_Sciense\` 001–005 и схема структуры, с тремя изменениями владельца:
1. Раздел живёт на основном домене `https://onda-life.com/science/…`, не на субдомене. Документ 001 §47 это допускает при конкретной причине: нет быстрого доступа к DNS, а субдомен не наследует авторитет домена. Отпадают определение хоста (§20), отдельные robots/llms/ai.txt, отдельная Search Console и GitHub Pages (004 §8.6).
2. Раздела `/questions/` в MVP нет. Вопросы обслуживают статьи и калькуляторы. Это совпадает с рекомендацией 004 §8, риск 1.
3. Научные записи — единый источник правды для чисел, норм и формулировок.

Сырые данные аудита: `landing/.cache/sci/inventory.tsv` (825 страниц сайта; пересобирается командой `npx tsx .cache/sci/export.ts`).

---

## 1. Архитектура: что переиспользуем

| Слой | Как устроено сейчас | Для `/science/` |
|---|---|---|
| Роуты | `src/main.tsx` (клиент, lazy) и `src/entry-server.tsx` (SSR). EN-only страницы (`/research`, `/ai-apps`, `/measurements`) — одна строка `<Route>` без цикла по языкам. | Одна строка `/science`, одна `/science/:kind`, одна `/science/:kind/:slug` в **обоих** файлах. Новая lazy-страница `SciencePage`. |
| Данные | `src/data/*`. Источники: `ScienceSource` (`sources.ts`) у калькуляторов и `EvidenceReference` / `EvidenceClaim` в `evidence.ts` (из него строится `/research`). | Новый модуль `src/data/science/` (§4). Реестр ссылок общий: `evidence.ts` (`EVIDENCE_REFERENCES`), без второго списка литературы. |
| Пререндер | `scripts/prerender-routes.ts`: `nonLocalizedStaticPaths` и динамические EN-списки. `getPrerenderRoutes()` убирает дубли. | Добавить `...scienceEntries.map(e => '/science/'+e.kind+'/'+e.slug)` и хабы рядом с EN-списками. Карта сайта подхватит их автоматически (`sitemap.ts` берёт `getPrerenderRoutes`). |
| Размер бандла | `check-budget.mjs`: тексты не должны попадать в браузерный код; статьи отдаются по одной из `public/_content/…`. | 13 записей можно грузить ленивым чанком страницы (≤300 КБ). При росте раздела — вынести тексты в `_content/science/<slug>.json` по образцу `generate-article-chunks.ts` и добавить лимит в `check-budget`. |
| Мета/JSON-LD | `scripts/meta-inject.ts`, `getMetaForRoute`: ветки по роуту. Страница экспортирует свою функцию JSON-LD (`researchJsonLd`, `aiAppsJsonLd`). | Ветка `segments[0]==='science'` → `scienceJsonLd(entry)`. Типы JSON-LD: `DefinedTerm` (concepts), `TechArticle` + `citation[]` с DOI/PMID (measurements, evidence), `Article` + `about` (mechanisms), `BreadcrumbList`. Дата обновления — через `article-dates.mjs` с ключом `science:<slug>`, как у глоссария. |
| i18n | Страница без записи в `LOCALIZED_PAGES` — только EN; переключатель языка оставляет EN-адрес. | Раздел EN-only: в `LOCALIZED_PAGES` не добавлять, hreflang не нужен. |
| Обнаружение | `sitemap.ts`, `sitemap-news.ts`, `feed.ts`, `llms-txt.ts` (список разделов вручную), `robots.txt`, `ai.txt`, IndexNow. | Автоматически: sitemap и IndexNow. Вручную: одна секция в `llms-txt.ts`. robots и ai.txt уже приглашают нужных роботов. |
| Проверки | `validate-seo.mjs` (ломает сборку), `audit-structure.mjs` (ссылки, сироты, заголовки), `audit-seo-geo.mjs`, `check-translations` (раздела не касается), `ai-audit.mjs`. | Новых проверок для работы раздела не нужно. Нужна одна новая проверка: `check-science-facts` (§4). |

**Вывод.** Никакой параллельной инфраструктуры: один хост, один пререндер, одна карта сайта, общие мета и проверки. Новых файлов: модуль данных, страница, одна ветка в `meta-inject` и строки роутов и пререндера.

---

## 2. Таблица пересечений (§48)

Из 24 страниц 001 §7 вопросы исключены (изменение 2). Для каждой страницы MVP — существующие URL, их тип и намерение, и решение.

Решения: **создать** — новая научная запись; **объединить** — несколько предложенных записей в одну; **только ссылка** — научную страницу не делаем, ведём на существующую; **не делать** — убираем из MVP.

| Существующие URL | Тип | Намерение | Предлагаемый `/science/` URL | Действие |
|---|---|---|---|---|
| `/glossary/heart-rate-variability`, `/articles/hrv-questions-answered` (52 вопроса), `/hrv-biofeedback` | глоссарий / статья-FAQ / опорная страница | короткое определение / ответы на вопросы / метод | `/science/concepts/heart-rate-variability` | **Создать** как хаб-сущность: что такое HRV, метрики, что HRV не говорит (002 §6). Глоссарий остаётся коротким определением со ссылкой «Read the science». FAQ-статью не трогаем: она владеет вопросами. |
| нет (в глоссарии нет RMSSD) | — | определение метрики | `/science/concepts/rmssd` | **Создать** — пробел. Калькулятор и статьи с нормами ссылаются сюда. |
| нет (в глоссарии нет SDNN) | — | определение метрики | `/science/concepts/sdnn` | **Создать** — пробел. Сюда переезжает объяснение «SDNN на Apple Watch» (оно сейчас разбросано и местами устарело, §4). |
| `/articles/your-baseline-knows-first`, `/articles/what-your-apple-watch-records`, `/tools/baseline` | статьи / инструмент | ранний сигнал / что пишут часы / подсчёт | `/science/concepts/hrv-baseline` | **Создать** — единое определение окон: 7-дневное среднее, 14-дневный базлайн, 90-дневный коридор. Сейчас на сайте три разных окна. |
| `/glossary/autonomic-nervous-system`, `…/sympathetic-nervous-system`, `…/parasympathetic-nervous-system`, `/articles/how-to-train-your-nervous-system` | глоссарий ×3 / статья | определения / практика | `/science/concepts/autonomic-nervous-system` | **Объединить** три записи из 001 §7 в одну. Отдельные страницы sympathetic/parasympathetic — **только ссылка** на глоссарий: иначе три тонкие страницы будут конкурировать с глоссарием. |
| `/glossary/vagus-nerve`, `…/ventral-vagus`, `…/polyvagal-theory`, `/articles/vagus-nerve-exercises` (сюда же 301 с `vagus-nerve-master-key`) | глоссарий / статья | определение / практика | `/science/concepts/vagus-nerve` | **Создать** — опора для флагмана 2 и место, где фиксируется формулировка «vagal tone напрямую не измеряется». Запись глоссария сейчас переобещает («Level 1 directly trains vagal tone») — исправить до запуска. |
| `/resonance-breathing`, `/articles/find-your-resonance-breathing-rate`, `/articles/coherent-breathing-guide`, `/tools/resonance-breathing` | опорная страница / статьи / инструмент | метод и практика | (`/science/concepts/resonance-breathing`) | **Только ссылка**. Метод полностью покрыт опорной страницей. Научная часть уходит в механизм «дыхание и HRV». |
| нет | — | механизм | `/science/concepts/respiratory-sinus-arrhythmia` | **Создать** — пробел (нет ни в глоссарии, ни в статьях), а это основа связи дыхания и HRV. |
| `/articles/coherent-breathing-guide`, `/articles/short-daily-breathing-routine`, `/articles/hrv-breathing-cold-honest-limits` | статьи | практика / честные пределы | (`/science/concepts/slow-breathing`) | **Объединить** с `evidence/slow-breathing`: отдельная страница-понятие дублировала бы практические статьи. |
| `/articles/hrv-different-every-device`, `/articles/apple-watch-recovery-hrv-vs-overall-hrv`, `/articles/why-is-my-apple-watch-hrv-low`, `/articles/how-to-measure-hrv-consistently`, `/tools/hrv`, `/measurements` (продуктовая), `/reviews/compare/best-hrv-trackers-2026` | статьи / калькулятор / продукт / рейтинг | «почему цифры разные» / «что значит моя цифра» / «как мерить» / «что меряет ONDA» / «что купить» | `/science/measurements/heart-rate-variability` + флагман 003 | **Объединить** «measurements/heart-rate-variability» (001 §7) и флагман 003 в одну страницу: *Can you trust HRV from a smartwatch or ring?* Отличие см. ниже. |
| `/articles/resting-heart-rate-by-age`, `/tools/resting-heart-rate` | статья / калькулятор | нормы по возрасту / моя цифра | `/science/measurements/resting-heart-rate` | **Создать** — ради единого источника: здесь фиксируется «нормальный» диапазон (сейчас 60–100 и 50–90 в разных местах). Нормы по возрасту остаются за статьёй, научная страница описывает метод и соглашения. |
| `/articles/respiratory-rate-hidden-signal`, `/tools/breathing-rate` | статья / инструмент | ночная частота дыхания | `/science/measurements/respiratory-rate` | **Не делать в MVP** (фаза 2): статья покрывает намерение, расхождений в числах нет (12–20 в минуту). |
| `/articles/resonant-frequency-system-coherence`, `/articles/baroreflex-01hz-shift` (старый «метафорический» стиль), `/hrv-vs-coherence`, `/articles/breathing-for-focus-and-attention` | статьи / опорная страница | метафорическое объяснение / различие терминов / внимание | `/science/mechanisms/breathing-and-hrv` | **Создать**: RSA, барорефлекс около 0,1 Гц, резонанс, данные. Две старые статьи — кандидаты на объединение с 301 на эту страницу (фаза 2, решение за владельцем). `breathing-for-focus` — только ссылка. |
| `/articles/overtraining-hrv-resting-heart-rate`, `/articles/how-much-alcohol-lowers-hrv`, `…/caffeine-…`, `…/nicotine-…`, сон-статьи | статьи | влияние образа жизни | `/science/mechanisms/{sleep,stress,exercise}-and-hrv` | **Не делать в MVP**: практические статьи покрывают намерение. Фаза 2 — после первых данных. |
| `/hrv-biofeedback`, `/research` (утверждения из `evidence.ts`) | опорная страница / исследовательская страница | метод / «на чём мы строим» | `/science/evidence/hrv-biofeedback` | **Создать**. Утверждения про биофидбек переезжают из `evidence.ts` сюда, `/research` на них ссылается. `/hrv-biofeedback` остаётся практической. |
| `/articles/hrv-breathing-cold-honest-limits`, `/articles/coherent-breathing-guide`, `/articles/cardiac-coherence-365-method`, `/articles/high-blood-pressure-slow-breathing`, `/articles/anxiety-panic-breathing-hrv` | статьи | практика и честные пределы | `/science/evidence/slow-breathing` | **Создать** (вбирает понятие slow-breathing): синтез данных по медленному дыханию с классами утверждений из 002 §4. |
| `/articles/vagus-nerve-exercises`, `/articles/electric-medicine-neuromodulation`, `/articles/cold-exposure-vagus-nerve`, `/articles/humming-breath-vagus`, `/reviews/compare/best-vagus-nerve-stimulators-2026`, 10 обзоров и 15 сравнений стимуляторов | статьи / рейтинг / обзоры | практика / обзор нейромодуляции / выбор устройства | `/science/evidence/vagus-nerve-stimulation` (флагман 005) | **Создать**. Отличие см. ниже. |
| `/research` | исследовательская страница (EN) | для партнёров и грантов: что доказано и куда идём | `/science/research/*` | **Не делать.** `evidence/` = синтез, `/research` остаётся страницей для партнёров с дорожной картой и ссылается на `evidence/`. Отдельную библиографию не заводим: источники хранятся в одном реестре `evidence.ts` и выводятся на каждой странице. |
| глоссарий `interoception`, статьи про интероцепцию | глоссарий / статьи | определение | `/science/concepts/interoception` (001 §4) | **Не делать в MVP**. |

### Флагман 1 — «Can you trust HRV from a smartwatch or ring?»

**Существующие:**
- `hrv-different-every-device` — *почему у меня разные цифры на разных устройствах* (бытовой угол);
- `apple-watch-recovery-hrv-vs-overall-hrv` — *два числа Apple*;
- `why-is-my-apple-watch-hrv-low` — *моя цифра низкая*;
- `/tools/hrv` — *где я по возрасту*.

**Чем отличается научная страница.** Она отвечает на вопрос метода: насколько PPG-оценка (PRV) совпадает с ЭКГ-HRV, где и почему расходится — движение, короткие окна, нелинейные метрики, сон и реальная жизнь — и что из этого следует. Опора — систематический обзор Xu 2026 (43 исследования, 10 в мета-анализе), Zuern 2026 (66 человек, одновременно ЭКГ и PPG) и рекомендации Carter 2026. Все DOI проверены через Crossref 2026-10-04. Норм и процентов точности на странице нет (003). Бытовые статьи ссылаются на неё как на «доказательную базу».

**Вывод:** делать. Риск дубля низкий, если страница не повторяет «почему цифры разные» и не даёт рейтинг устройств.

### Флагман 2 — «Does vagus nerve stimulation really work?»

**Существующие:**
- `vagus-nerve-exercises` — *практика: как успокоиться*;
- `electric-medicine-neuromodulation` — *старый обзор нейромодуляции в целом*;
- `cold-exposure-vagus-nerve` — *холод*;
- обзоры и сравнения стимуляторов — *какой купить*.

**Чем отличается научная страница.** Это синтез данных именно по неинвазивной стимуляции (taVNS / tVNS):
- влияние на HRV неустойчиво (Wolf 2021);
- проблемы плацебо-контроля и параметров (Yap 2020);
- анатомия ушной ветви нерва (Butt 2019);
- сон: Lin 2026, SMD около −0,57;
- депрессия: мета-анализ 2023 года;
- одобрения FDA только для gammaCore и только при головной боли.

Без рейтинга устройств и без переноса данных об имплантированной VNS на неинвазивную. Обзоры устройств ссылаются на страницу как на «что говорят данные».

**Вывод:** делать. Это самая сильная страница раздела: на сайте больше 25 страниц про устройства и нет ни одной, которая честно отвечает «работает ли это вообще».

---

## 3. Итоговый MVP — 13 научных страниц и хаб

| # | URL | Почему в MVP |
|---|---|---|
| 0 | `/science` | Хаб: разделы, флагманы, связь с практикой (001 §42, без ленты блога). Разделы `/science/concepts` и т. п. — простые списки, без отдельного контента. |
| 1 | `/science/concepts/heart-rate-variability` | Центральная сущность; держит запрещённые формулировки (002 §6) в одном месте. |
| 2 | `/science/concepts/rmssd` | Пробел: в глоссарии нет; калькулятор и статьи ссылаются. |
| 3 | `/science/concepts/sdnn` | Пробел; закрывает устаревшее «Apple Watch = только SDNN». |
| 4 | `/science/concepts/hrv-baseline` | Единые окна базлайна (сейчас три версии). |
| 5 | `/science/concepts/autonomic-nervous-system` | Одна страница вместо трёх; опора для механизмов. |
| 6 | `/science/concepts/vagus-nerve` | Опора флагмана 2; формулировка про vagal tone. |
| 7 | `/science/concepts/respiratory-sinus-arrhythmia` | Пробел; ядро связи «дыхание → HRV». |
| 8 | `/science/measurements/heart-rate-variability` (**флагман 1**) | Объединяет измерение HRV и флагман 003. |
| 9 | `/science/measurements/resting-heart-rate` | Единый источник норм пульса покоя. |
| 10 | `/science/mechanisms/breathing-and-hrv` | RSA, барорефлекс, резонанс; будущая цель для двух старых метафорических статей. |
| 11 | `/science/evidence/hrv-biofeedback` | Синтез данных; разгружает `/research`. |
| 12 | `/science/evidence/slow-breathing` | Синтез данных (понятие slow-breathing объединено сюда). |
| 13 | `/science/evidence/vagus-nerve-stimulation` (**флагман 2**) | Самая сильная новая страница. |

Из 24 страниц документа 001 убраны:
- 4 вопроса — изменение 2;
- sympathetic и parasympathetic — объединены в страницу про автономную нервную систему;
- resonance-breathing — только ссылка;
- slow-breathing как понятие — объединено с evidence;
- respiratory-rate, sleep-, stress- и exercise-and-hrv — фаза 2.

Флагман 003 объединён с measurements/HRV, флагман 005 добавлен. Итого 13 и хаб.

---

## 4. Единый источник правды

### Что сейчас расходится

Числовые таблицы HRV (RMSSD и SDNN по возрасту) везде совпадают с `hrv-norms.ts`. Расходятся следующие места.

| # | Тема | Значение A | Значение B | Что принять |
|---|---|---|---|---|
| 1 | Как Apple Watch считает HRV | «только SDNN, замеры около 1 минуты» (`hrv-norms.ts:134`, `why-is-my-apple-watch-hrv-low`, `normal-hrv-by-age:51`) | с сентября 2026 есть Recovery HRV на RMSSD, замеры примерно каждые 5 минут (`apple-watch-recovery-hrv-vs-overall-hrv`, `article-faq:233–235`) | Уточнить: Overall HRV = SDNN; Recovery HRV = RMSSD на новых моделях. **Сам факт про 2026 перепроверить по Apple** (вопрос 7). |
| 2 | «Нормальный» пульс покоя у взрослых | 60–100 (`resting-heart-rate-by-age`, `topic-hub-faq`) | около 50–90 (`resting-hr.ts:99`) | Выбрать одно и объяснить (вопрос 6). |
| 3 | Резонансное дыхание | 5,5 с вдох / 5,5 с выдох ≈ 5,5 в минуту (`resonance-breathing-i18n`, `onda-faq`) | «6 в минуту = 5 с / 5 с» (`rhythmic-entrainment…`, `article-faq:1045,1159`) | Оба варианта в пределах коридора; записать один — около 5,5–6 в минуту — и пояснить. |
| 4 | Личный резонансный диапазон | 4,5–7 | 4,5–6,5; 5–6; 5–7 | 4,5–7 (Lehrer / Vaschillo). |
| 5 | Окно базлайна | 14 дней | 7-дневное среднее против 2–4 недель; 2–3 недели; коридор 90 дней | Правило: 7-дневное среднее сравнивается с 14-дневным базлайном; 90 дней — коридор светофора. |
| 6 | Падение HRV с возрастом | «3–5 мс за десятилетие» (комментарий `hrv-norms.ts:12`) | сама таблица: 4–8 мс между группами | Исправить комментарий. |
| 7 | «Обычный» диапазон RMSSD | «примерно 20–80 мс» (`bioMetrics.ts:550`) | возрастные таблицы (ночные значения) | Указать, дневное это значение или ночное. |
| 8 | Вагус | «долгий выдох стимулирует вагус» (более 10 мест в FAQ и статьях), «Level 1 напрямую тренирует vagal tone» (глоссарий), «гудение механически стимулирует вагус» | осторожная статья `hrv-breathing-cold-honest-limits` | Формулировки из 002 §6 и 005: vagal tone напрямую не измеряется; медленный выдох **связан** с ростом вагусно-опосредованной HRV. |
| 9 | «Тренированные: 40–60 уд/мин» | — | флаг брадикардии ниже 50 (`resting-hr.ts:81`) | Добавить контекст к флагу. |

### Как свести, не ломая работающее

1. **Числа — в маленький модуль `src/data/science/facts.ts`.** Только константы, без текста. Каждая запись содержит: `id`, `value`, `unit`, `range?`, `population`, `method` (ночь или день, SDNN или RMSSD), `sourceIds` (ссылки на `evidence.ts`) и `lastReviewed`. Таблицы норм HRV и пульса остаются в `hrv-norms.ts` и `resting-hr.ts`, чтобы калькуляторы не трогать. `facts.ts` их **реэкспортирует**, а не копирует. Источник один, имена прежние, калькуляторы и бандл не меняются.
2. **Тексты научных страниц** (`src/data/science/entries/*.ts`) берут числа только из `facts.ts`.
3. **Статьи и переводы.** В тексте числа пишутся заглушками: `{{fact:rhr.adult.normal}}`, `{{fact:hrv.rmssd.median.40-49}}`. Их подставляет `generate-article-chunks.ts` (для браузера) и пререндер (для HTML); неизвестный `id` ломает сборку. Переводы в `public/locales/*` работают так же: число одно на все языки, формат — по языку. Переводить статьи на заглушки постепенно, начиная с тех, где есть расхождения: `normal-hrv-by-age`, `resting-heart-rate-by-age`, `why-is-my-apple-watch-hrv-low`, `hrv-questions`, `article-faq`.
4. **Проверка `scripts/check-science-facts.ts`.** Без числовых совпадений она работает только как предупреждение.
   - Ищет вбитые вручную числа рядом с ключевыми словами (ms + HRV/RMSSD/SDNN, bpm + resting, breaths/min) там, где должна стоять заглушка.
   - Ищет запрещённые формулировки из 002 §6 («measures vagal tone», «LF/HF balance», «higher HRV is always better», «stimulates the vagus nerve»).
   - Когда основные статьи будут переведены на заглушки, проверку можно сделать блокирующей.
5. **Сервер `/mcp`** в этой задаче не трогаем. Он уже получает таблицы из `hrv-norms.ts` при сборке через `export-chatgpt-data.ts`, поэтому с источником совпадает. После перехода на `facts.ts` достаточно пересобрать данные на **тестовом адресе** и только потом выкладывать: сервер живой (правило из README).
6. **Формулировки.** В `facts.ts` рядом с числами — короткие утверждённые фразы (`claim.vagal-tone`, `claim.apple-watch-hrv-method`). Статьи и глоссарий берут их через ту же заглушку. Так формулировка про вагус живёт в одном месте.

---

## 5. Связь с основным сайтом

- **Навигация.** В шапке сейчас пункт Research (`Layout.tsx:248–254`). Предлагаю переименовать его в **Science** и вести на `/science`, а `/research` — со страницы `/science` и из подвала. Альтернатива — оставить Research и добавить Science только в подвал (`FooterSitemap.tsx`, `SitemapPage.tsx`).
- **Глоссарий.** Термины `heart-rate-variability`, `vagus-nerve`, `autonomic-nervous-system`, `coherence` получают строку «Read the science →» на научную запись. Новые термины для RMSSD, SDNN, RSA и baseline в глоссарий **не** добавлять: их определения живут в науке, иначе снова два места.
- **Калькуляторы.** В `SourcesSection` у `/tools/hrv`, `/tools/resting-heart-rate`, `/tools/baseline`, `/tools/resonance-breathing` — ссылка на научную запись с методом (RMSSD/SDNN, базлайн, пульс покоя, механизм дыхания).
- **Статьи.** В блоке источников и в тексте при первом упоминании метрики — ссылка на понятие. Обзоры стимуляторов вагуса и рейтинг стимуляторов ведут на флагман 2. Рейтинг трекеров HRV и статьи про Apple Watch — на флагман 1.
- **`/research`** ссылается на `evidence/` вместо собственного списка утверждений.
- **`/measurements`** (продуктовая «что меряет ONDA») ссылается на `science/measurements/*`, и наоборот: «In ONDA» → `/measurements`.
- **llms.txt** — новая секция «ONDA Science» со всеми 13 страницами.

---

## 6. Риски и вопросы

**Риски:**
- **Каннибализация понятий и глоссария** (HRV, vagus-nerve, ANS). Решение — глоссарий остаётся коротким определением со ссылкой, научная страница — полной сущностью. Через 4–6 недель проверить в GSC, не делят ли они запросы.
- **Похожие названия:** `/measurements` (продуктовая) и `/science/measurements/` (научная). Это путает только при чтении URL, но стоит учесть в навигации.
- **Научные страницы будут противоречить старым статьям**, пока не исправлены переобещания про вагус и устаревшее «Apple Watch = только SDNN». Исправить их **до** публикации флагманов.
- **Бюджет бандла** — при 13 страницах ленивый чанк укладывается; при росте раздела нужен вынос текстов в `_content`.
- **Источники 2026 года.** Восемь DOI флагманов проверены через Crossref и существуют: Carter, Xu, Zuern, Wolf, Szulczewski, Lin, Yap, Butt. У некоторых ссылок в 005 журнал ещё не подтверждён — их проверить при написании.

**Вопросы к тебе:**
1. **Шапка:** переименовать Research в Science (и вести на `/science`) или оставить Research и добавить Science в подвал?
2. **Две старые метафорические статьи** (`resonant-frequency-system-coherence`, `baroreflex-01hz-shift`) — потом объединить с 301 в `mechanisms/breathing-and-hrv` или оставить как есть?
3. **Глоссарий:** согласен, что RMSSD, SDNN, RSA и baseline **не** добавляем как термины, а глоссарий ссылается на науку?
4. **Язык:** раздел только EN на старте? Документы 001 §18 допускают переводы позже.
5. **Автор и рецензент:** подписывать страницы «Yakiv Bilenko — editor» без рецензента (002 §18 разрешает рецензента только реального) или есть кандидат-рецензент?
6. **Пульс покоя «норма»:** взять общепринятое 60–100 с оговоркой про новые данные (50–90) или наоборот?
7. **Apple Watch Recovery HRV (RMSSD, сентябрь 2026):** на сайте это утверждается. Подтверждаешь по своим часам? Если да — это уходит в `facts.ts`, и старые формулировки «только SDNN» правим.
8. **Порядок работ:** сначала исправить расхождения и переобещания на сайте (§4, это и есть фаза «единого источника»), потом строить раздел — или параллельно?
