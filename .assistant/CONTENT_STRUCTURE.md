# CONTENT_STRUCTURE — Структура контента ONDA

Документация для создания новых частей (контуров) приложения.

---

## ⛔ КРИТИЧЕСКИЕ ПРАВИЛА

### 1. НЕ создавать практики самостоятельно!
**Практики, guiding_texts, final_phrases — НЕ придумывать!**
- Пользователь предоставляет все тексты практик
- Если практики не предоставлены — оставлять `practices: []` (пустой массив)
- Не добавлять фейковые practice_items, guiding_texts, final_phrases
- Ждать, пока пользователь предоставит конкретные данные

```typescript
// ПРАВИЛЬНО — пустой массив практик:
{
  id: 5,
  name: t('circuits.circuit_5_name'),
  practices: [],  // Пустой! Ждём данные от пользователя
  artifact: null
}

// НЕПРАВИЛЬНО — выдуманные практики:
practices: [
  { id: 'p5-1', name: '...' }  // ❌ НЕ придумывать!
]
```

### 2. НЕ добавлять артефакты без запроса!
**❌ ЗАПРЕЩЕНО добавлять артефакты самостоятельно!**
- Если пользователь просит добавить практику — добавляем ТОЛЬКО практику
- Артефакты добавляем ТОЛЬКО при явном запросе пользователя
- При создании практик НЕ трогать поле `artifact` в контуре

```typescript
// ПРАВИЛЬНО — добавляем только практику:
practices: [
  { id: 'p5-1', name: t('practice_items.mass_of_center'), ... }
]
// artifact остается как было (null или существующий)

// НЕПРАВИЛЬНО — добавили артефакт "в нагрузку":
practices: [...],
artifact: { name: t('artifacts.shield_of_status'), ... }  // ❌ НЕ добавлять!
```

### 3. Чат "Практики" — только практики!
В специализированном чате для практик:
- ✅ Добавляем практики по данным от пользователя
- ✅ Редактируем существующие практики
- ✅ Исправляем баги отображения практик
- ❌ НЕ добавляем артефакты
- ❌ НЕ создаём новые части (контуры)
- ❌ НЕ меняем структуру приложения

---

## 📋 ТЕКУЩЕЕ СОСТОЯНИЕ ЧАСТЕЙ

### Созданные части (на февраль 2026)

| Part | Название | Level | Статус | Практики |
|------|----------|-------|--------|----------|
| **Part 1** | Я Есть | Body (TERRA) | ✅ Полная | 12 практик |
| **Part 2** | Я Двигаюсь | Body (TERRA) | ✅ Полная | 12 практик |
| **Part 3** | Я Адаптируюсь | Body (TERRA) | ✅ Полная | 12 практик |
| **Part 4** | Я Маневрирую | Emotions (AQUA) | ✅ Контент есть | 2 практики |
| **Part 5** | Я Охраняю Территорию | Emotions (AQUA) | ✅ Полная | 2 практики |
| **Part 6** | Я в Стае | Emotions (AQUA) | ✅ Контент есть | ⏳ Ждём практики |
| **Part 7** | Я Различаю | Mind (AER) | ✅ Контент есть | ⏳ Ждём практики |
| **Part 8** | Я Фокусируюсь | Mind (AER) | ✅ Контент есть | ⏳ Ждём практики |
| **Part 9** | Я Создаю Образ | Mind (AER) | ✅ Контент есть | ⏳ Ждём практики |
| Part 10-12 | — | — | ❌ Не созданы | — |

### Где искать части в коде

#### 1. Главный компонент: `src/onda-level1-demo_27.tsx`

**Массив `circuits`** (~строка 1230-1310):
```typescript
const circuits = useMemo(() => [
  { id: 1, name: t('circuits.circuit_1_name'), ... },
  { id: 2, name: t('circuits.circuit_2_name'), ... },
  { id: 3, name: t('circuits.circuit_3_name'), ... },
  { id: 4, name: t('circuits.circuit_4_name'), ... },
  { id: 5, name: t('circuits.circuit_5_name'), ... },  // ← Part 5 здесь
], [i18n.language]);
```

**Объект `practiceSpaces`** (~строка 1100-1170):
```typescript
const practiceSpaces = useMemo(() => ({
  'p1-1': { colors: '...', element: 'TERRA', ... },
  'p4-1': { ... },
  'p4-2': { ... },
  // Part 5 practices: ждём данные от пользователя
}), [i18n.language]);
```

**Цветовые условия** (поиск `activeCircuit === 5`):
```bash
grep -n "activeCircuit === 5" src/onda-level1-demo_27.tsx
```

#### 2. Переводы: `public/locales/{lang}/translation.json`

**Ключи для Part N:**
```
circuits.circuit_N_name        — Название
circuits.circuit_N_title       — Заголовок  
circuits.circuit_N_subtitle    — Подзаголовок
circuits.circuit_N_desc        — Описание
circuits.circuit_N_chapter     — Глава

philosophy.level_N.text_1..6   — Поэтический текст
level_goal.level_N.*           — Цели и задачи
terra_speaks.level_N.quote_1..4 — Цитаты элемента
terra_final.level_N.line_1..3  — Финальное напутствие

quote_level_N                  — Эпиграф части
```

**Проверить наличие переводов:**
```bash
grep -c "level_5" public/locales/ru/translation.json  # Должно быть > 0
grep -c "level_5" public/locales/en/translation.json  # Должно быть > 0
```

#### 3. Быстрая проверка Part 5

```bash
# Проверить что Part 5 есть в circuits
grep -A5 "id: 5," src/onda-level1-demo_27.tsx

# Проверить переводы Part 5
grep "circuit_5" public/locales/ru/translation.json
grep "level_5" public/locales/ru/translation.json | head -20
```

---

## 🔗 Связь Уровней (Levels) и Частей (Parts)

### Терминология

| Термин | Что это | Количество | Примеры |
|--------|---------|------------|---------|
| **Level** (Уровень) | Большой блок | 4 | Body, Emotions, Mind, Society |
| **Part** (Часть) | Контур внутри уровня | 12 (по 3 на Level) | Часть 1, Часть 2... Часть 12 |

### ⚠️ Названия в коде (историческая путаница):
- `selectedChapter` → это **Level** (Body/Emotions/Mind/Society)
- `selectedLevel` → это **Part** (1-12)
- `circuits` → это массив **Parts**

### Структура

| Level (Уровень) | Элемент | Parts (Части) | Названия частей |
|-----------------|---------|---------------|-----------------|
| **Level 1: Body (Тело)** | TERRA | Parts 1, 2, 3 | Я есть, Я двигаюсь, Я адаптируюсь |
| **Level 2: Emotions (Эмоции)** | AQUA | Parts 4, 5, 6 | Я маневрирую, Я охраняю территорию, Я в стае |
| **Level 3: Mind (Разум)** | AER | Parts 7, 8, 9 | Я различаю, Я фокусируюсь, Я планирую |
| **Level 4: Society (Социум)** | IGNIS | Parts 10, 11, 12 | Я говорю, Я обмениваюсь, Я сотрудничаю |

### Логика переключения (реализовано в `onda-level1-demo_27.tsx`):

1. **При выборе Level → переключение на первую Part этого уровня:**
   ```typescript
   const firstPartOfLevel = (chapter - 1) * 3 + 1;
   // Level 1 → Part 1, Level 2 → Part 4, Level 3 → Part 7, Level 4 → Part 10
   ```

2. **При выборе Part → переключение на соответствующий Level:**
   ```typescript
   const levelForPart = Math.ceil(level / 3);
   // Parts 1-3 → Level 1, Parts 4-6 → Level 2, Parts 7-9 → Level 3, Parts 10-12 → Level 4
   ```

### Ключи переводов для уровней

```
chapters.chapter_1        — "Тело"
chapters.chapter_1_element — "TERRA"
chapters.chapter_2        — "Эмоции"
chapters.chapter_2_element — "AQUA"
chapters.chapter_3        — "Разум"
chapters.chapter_3_element — "AER"
chapters.chapter_4        — "Социум"
chapters.chapter_4_element — "IGNIS"
```

### Ключи для частей

```
circuits.circuit_N_title    — Заголовок ("Я Маневрирую")
circuits.circuit_N_name     — Название (то же что title)
circuits.circuit_N_subtitle — Подзаголовок ("Мелкое млекопитающее / Ловкость и уклонение")
circuits.circuit_N_desc     — Описание (с <br/> для переносов)
circuits.circuit_N_chapter  — К какой главе относится ("Глава 2: Эмоции (AQUA)")
```

---

## 📖 Аддоны (Addon-страницы)

### Что такое аддон

**Аддон** — это полноэкранная отдельная страница с расширенной информацией о части (протокол, научная база, биологический фокус, результаты). Каждая Part может иметь свой аддон.

### Архитектура навигации

```
Part 4  ——→  Part 5  ——→  Part 6       (горизонтальная навигация, уже есть)
  ↕            ↕            ↕           (вертикальная навигация — аддоны)
Part 4       Part 5       Part 6
 Addon        Addon        Addon
  ←——————→  ←——————→                    (горизонтальная навигация между аддонами — будущее)
```

### Реализация в коде

**State:** `activeView: 'main' | 'addon'`

```typescript
const [activeView, setActiveView] = useState<'main' | 'addon'>('main');
```

**Переключение видов** — реализовано через `if (activeView === 'addon') return (...)` перед основным `return`, на одном уровне с `activePractice` и `showOnboarding`:

```typescript
// Порядок return'ов в OndaLevel1:
if (activePractice) return (...);    // 1. Экран практики
if (showOnboarding) return (...);    // 2. Онбординг
if (activeView === 'addon') return (...);  // 3. Addon-страница  ← НОВОЕ
return (...);                        // 4. Основной вид Part
```

**Автосброс при переключении Part:**
```typescript
useEffect(() => {
  setActiveView('main');
}, [activeCircuit]);
```

### Где находится в `onda-level1-demo_27.tsx`

| Элемент | Где искать |
|---------|------------|
| State `activeView` | Рядом с `showMenu` (~строка 169) |
| Автосброс `useEffect` | После `setActiveCircuit(selectedLevel)` |
| Кнопка "Part's info" на основной странице | Между grid практик и блоком `level_goal` |
| Полный addon-вид (return) | Перед основным `return` — поиск: `ADDON VIEW` |

```bash
# Быстрый поиск addon-кода
grep -n "activeView" src/onda-level1-demo_27.tsx
grep -n "ADDON VIEW" src/onda-level1-demo_27.tsx
grep -n "part_info" src/onda-level1-demo_27.tsx
```

### Структура addon-страницы

Addon-страница использует тот же фоновый градиент и цветовую схему что у родительской Part. Контент состоит из карточек-секций:

| Секция | Ключ локализации | Описание |
|--------|-----------------|----------|
| **Кнопка возврата** (вверху) | `part_info.back_to_part` | Навигация обратно к Part |
| **Заголовок + протокол** | `part_info.level_N.title`, `.protocol` | Название части и протокола |
| **Введение** | `.intro`, `.basis` | Два абзаца с описанием |
| **Архитектура** | `.architecture_title`, `.pillar_1-4_title/text` | 4 столпа в отдельных карточках |
| **Биологический фокус** | `.bio_focus_title`, `.bio_focus_1-3` | Список с маркерами |
| **Результаты** | `.result_title`, `.result_1-3`, `.result_outro` | Список + курсивная цитата |
| **Кнопка возврата** (внизу) | `part_info.back_to_part` | Дублирующая навигация |

### Ключи локализации для аддонов

```
part_info.button                          — Текст кнопки "Part's info"
part_info.back_to_part                    — "← Вернуться к Части {{part}}"

part_info.level_N.title                   — Заголовок ("ЧАСТЬ 4: Я МАНЕВРИРУЮ")
part_info.level_N.protocol                — Протокол ("Протокол: Маневренность «Мелкого Млекопитающего»")
part_info.level_N.intro                   — Вступительный абзац
part_info.level_N.basis                   — Основа/базис

part_info.level_N.architecture_title      — "Архитектура Протокола"
part_info.level_N.architecture_intro      — Вводная фраза к столпам
part_info.level_N.pillar_1_title          — Название столпа 1
part_info.level_N.pillar_1_text           — Описание столпа 1
part_info.level_N.pillar_2_title/text     — Столп 2
part_info.level_N.pillar_3_title/text     — Столп 3
part_info.level_N.pillar_4_title/text     — Столп 4

part_info.level_N.bio_focus_title         — "Биологический фокус"
part_info.level_N.bio_focus_intro         — Вводная фраза
part_info.level_N.bio_focus_1             — Пункт 1
part_info.level_N.bio_focus_2             — Пункт 2
part_info.level_N.bio_focus_3             — Пункт 3

part_info.level_N.result_title            — "Что это даёт?"
part_info.level_N.result_intro            — Вводная фраза
part_info.level_N.result_1                — Пункт 1
part_info.level_N.result_2                — Пункт 2
part_info.level_N.result_3                — Пункт 3
part_info.level_N.result_outro            — Завершающая фраза (курсив)
```

### Текущее состояние аддонов

| Part | Addon | Статус |
|------|-------|--------|
| Part 1 | Гомеостаз и первичная интероцепция | ✅ Готов |
| Part 2 | Ритмическая когерентность и первичная локомоция | ✅ Готов |
| Part 3 | Овладение гравитацией и интероцепция | ✅ Готов |
| Part 4 | Маневренность «Мелкого Млекопитающего» | ✅ Готов |
| Part 5 | Сила «Крупного Млекопитающего» | ✅ Готов |
| Part 6 | Социальный Резонанс «Высшего Примата» | ✅ Готов (без базовых практик) |
| Part 7 | Когнитивный контроль и S/N | ✅ Готов |
| Part 8 | Когнитивный контроль и нейронная устойчивость | ✅ Готов |
| Part 9-12 | — | ⏳ Ждём контент |

### Чеклист: добавление нового аддона

#### 1. Контент от пользователя
- [ ] Получить текст аддона (обычно через gist)
- [ ] Текст содержит: название, протокол, введение, столпы/секции, биофокус, результаты

#### 2. Локализация (public/locales/*/translation.json)
- [ ] Добавить `part_info.level_N.*` ключи в `ru/translation.json` (оригинал)
- [ ] Перевести на `en/`, `uk/`, `es/`, `zh/`

#### 3. Код — НЕ нужен!
Addon-вид в `onda-level1-demo_27.tsx` **универсальный** — он автоматически рендерит контент по ключам `part_info.level_${activeCircuit}.*`. Кнопка "Part's info" появляется только если ключ `part_info.level_N.title` существует.

**Для добавления нового аддона достаточно только добавить переводы!**

### Будущее: горизонтальная навигация между аддонами

Для связей между аддонами (синие линии на схеме) потребуется добавить кнопки навигации внутри addon-вида, аналогично существующей "Go to Part N".

---

## 🎨 Цветовая палитра частей

**ВАЖНО:** Каждая часть должна иметь согласованную цветовую палитру. Цвета задаются в `onda-level1-demo_27.tsx` через условия `activeCircuit === N`.

### ⚠️ Правило для кнопки перехода

**Кнопка "Go to Part X" / "Перейти к Части X"** должна быть в цветовой схеме **ЦЕЛЕВОЙ части** (куда идёт переход), а не текущей.

Пример: находимся на Part 2, кнопка "Go to Part 3" — **оранжевая** (цвет Part 3).

```typescript
// В terra_final секции, кнопка перехода:
// activeCircuit + 1 определяет цвет кнопки
const nextPart = activeCircuit + 1;
// Цвет кнопки = цвет nextPart
```

| Текущая Part | Кнопка | Цвет кнопки |
|--------------|--------|-------------|
| Part 1 | "Go to Part 2" | Cyan (Part 2) |
| Part 2 | "Go to Part 3" | Amber/Orange (Part 3) |
| Part 3 | "Go to Part 4" | Teal (Part 4) |
| Part 4 | "Go to Part 5" | Stone (Part 5) |
| Part 5 | "Go to Part 6" | Emerald/Teal (Part 6) |

### Существующие палитры

| Part | Основной цвет | Примеры классов |
|------|---------------|-----------------|
| **Part 1** | Indigo/Purple | `bg-indigo-500/10`, `border-indigo-400/40`, `text-purple-300` |
| **Part 2** | Cyan | `bg-cyan-500/10`, `border-cyan-400/40`, `text-cyan-300` |
| **Part 3** | Amber/Orange | `bg-amber-600/10`, `border-amber-500/40`, `text-amber-300` |
| **Part 4** | Teal | `bg-teal-500/10`, `border-teal-400/40`, `text-teal-300` |
| **Part 5** | Stone | `bg-stone-500/20`, `border-stone-400/50`, `text-stone-200` |
| **Part 6** | Emerald/Teal (warm) | `bg-emerald-500/20`, `border-emerald-400/50`, `text-emerald-300` |
| **Part 7** | Sky/Blue | `bg-sky-500/20`, `border-sky-400/50`, `text-sky-300` |
| **Part 8** | Indigo/Violet | `bg-indigo-500/20`, `border-indigo-400/50`, `text-indigo-300` |
| **Part 9** | Cyan/Sky (light) | `bg-cyan-500/20`, `border-cyan-400/50`, `text-cyan-300` |

### Где нужно задать цвета для новой части

При добавлении новой части (например Part 5) нужно добавить условие `activeCircuit === 5` во ВСЕ следующие места:

1. **Основной фон страницы** (~строка 3213):
   ```typescript
   : activeCircuit === 5
   ? 'bg-gradient-to-br from-COLOR-950 via-COLOR-900 to-COLOR-950'
   ```

2. **Кнопка меню** (~строка 3239):
   ```typescript
   : activeCircuit === 5
   ? 'bg-COLOR-600/40 hover:bg-COLOR-600/60 border border-COLOR-400/30'
   ```

3. **Кнопка подписки** (~строка 3265)

4. **Dropdown Level** (~строка 3392, 3406, 3428):
   ```typescript
   : activeCircuit === 5
   ? 'bg-COLOR-500/10 hover:bg-COLOR-500/20 border-COLOR-400/40'
   ```

5. **Dropdown Part** (~строка 3455, 3477, 3502)

6. **Кнопка Emotional Check** (~строка 3546)

7. **Бордеры секций** (~строки 3554, 3615, 3665-3700):
   ```typescript
   : activeCircuit === 5
   ? 'border-COLOR-500/30'
   ```

8. **Фон секции philosophy** (~строка 3637):
   ```typescript
   : activeCircuit === 5
   ? 'bg-gradient-to-br from-COLOR-900/20 to-COLOR-900/20 border-COLOR-500/30'
   ```

9. **Карточки практик** (~строка 3889):
   ```typescript
   : activeCircuit === 5
   ? 'border-COLOR-500/30 hover:border-COLOR-400/50'
   ```

10. **Фон секции level_goal** (~строка 4018):
    ```typescript
    : activeCircuit === 5
    ? 'bg-gradient-to-br from-COLOR-900/30 via-COLOR-900/20 to-COLOR-900/30 border-COLOR-500/30'
    ```

11. **Цвета текста identity** (~строки 4035-4041):
    ```typescript
    : activeCircuit === 5 ? 'text-COLOR-300'
    ```

12. **Цвета terra_speaks** (~строки 4057, 4076, 4090)

13. **Кнопка "Перейти к Части N"** (~строка 4419):
    ```typescript
    : activeCircuit + 1 === 5
    ? 'bg-gradient-to-r from-COLOR-600 to-COLOR-600 hover:from-COLOR-500 hover:to-COLOR-500 text-white border-2 border-COLOR-300/50'
    ```

### Структура цветов (паттерн)

Для согласованности используй один базовый цвет Tailwind:

| Элемент | Прозрачность/оттенок |
|---------|---------------------|
| Фон страницы | `COLOR-950`, `COLOR-900` |
| Фон кнопок | `COLOR-600/40`, `COLOR-500/10` |
| Бордеры | `COLOR-400/30`, `COLOR-500/30`, `COLOR-400/40` |
| Hover | `COLOR-600/60`, `COLOR-500/20`, `COLOR-400/50` |
| Текст | `COLOR-300`, `COLOR-200` |

### Поиск всех мест для замены

```bash
# Найти все места где нужно добавить цвет для новой части:
grep -n "activeCircuit === 3" src/onda-level1-demo_27.tsx | wc -l
# Ожидается ~30+ мест
```

---

## Блоки контента (BN_X)

| Блок | Описание | Ключ в translation.json |
|------|----------|------------------------|
| **B_1** | Эпиграф/философская цитата | `quote_level_N` |
| **B_2** | Заголовок + описание | `circuits.circuit_N_title`, `circuit_N_subtitle`, `circuit_N_desc`, `circuit_N_chapter` |
| **B_3** | Поэтический текст (6 строк) | `philosophy.level_N.text_1` ... `text_6` |
| **B_4** | Level goal (intro, story, identity, wisdom) | `level_goal.level_N.*` |
| **B_5** | Цитаты элемента | `terra_speaks.level_N.quote_1-4` (для всех уровней, включая AQUA) |
| **B_6** | Финальное напутствие уровня | `terra_final.level_N.line_1-4` |

---

## Структура данных

### 1. Circuit (контур)

**Файл:** `src/onda-level1-demo_27.tsx` → `circuits` массив

```typescript
{
  id: 3,                                    // Номер контура
  name: t('circuits.circuit_3_name'),       // "Я адаптируюсь"
  subtitle: t('circuits.circuit_3_subtitle'), // "Земноводное / Рептилия"
  element: 'TERRA',                         // TERRA | AQUA | IGNIS | AER
  color: 'from-green-900 to-emerald-800',   // Tailwind градиент
  icon: Mountain,                           // Lucide иконка
  practices: [...],                         // Массив практик
  artifact: {
    name: t('artifacts.crystal_of_grounding'),
    bonus: 50,                              // % бонус к OND
    requirement: t('artifacts.requirement')
  }
}
```

### 2. Practice (практика в контуре)

```typescript
{
  id: 'p3-1',                               // pN-M (N=контур, M=номер)
  name: t('practice_items.breath_of_transition'),
  duration: t('practice_items.duration_6min'),
  maxQnt: 90,                               // Базовая награда OND
  desc: t('practice_items.breath_of_transition_desc')
}
```

### 3. PracticeSpace (детали практики)

**Файл:** `src/onda-level1-demo_27.tsx` → `practiceSpaces` объект

```typescript
'p3-1': {
  colors: 'from-green-900 via-teal-800 to-emerald-700',  // Фон практики
  element: 'TERRA',
  elementMessage: t('practice_messages.breath_of_transition_message'),
  ambientSound: t('elements.earth_breathes'),
  visual: '🦎',                             // Emoji в центре круга
  targetTime: 360,                          // Секунды (6 мин = 360)
  guidingTexts: t('guiding_texts.p3_1', { returnObjects: true }),
  finalPhrase: t('final_phrases.p3_1'),
  scienceInfo: t('science_info.p3_1', { returnObjects: true })  // Опционально
}
```

### 4. Блок scienceInfo (научная информация)

**Опциональный блок** — отображается на экране intro между сообщением элемента и таймером.

Формат в `translation.json`:
```json
"science_info": {
  "p4_1": [
    "Биология: Расширение поля зрения снижает активность миндалины.",
    "Почему: Это моторный паттерн мониторинга среды у мелких животных.",
    "Эффект: Снижение уровня фоновой тревоги."
  ]
}
```

**Важно:** Текст до двоеточия автоматически выделяется **жирным** в UI.

---

## Ключи переводов

### Для контура N

```
circuits.circuit_N_name          — Название ("Я адаптируюсь")
circuits.circuit_N_subtitle      — Подзаголовок ("Земноводное / Рептилия")

philosophy.level_N.text_1        — Поэтический текст строка 1
philosophy.level_N.text_2        — Поэтический текст строка 2
...
philosophy.level_N.text_6        — Поэтический текст строка 6

level_goal.level_N.wisdom_1      — Wisdom/цитата 1
level_goal.level_N.wisdom_2      — Wisdom/цитата 2
level_goal.level_N.wisdom_3      — Wisdom/цитата 3
level_goal.level_N.wisdom_4      — Wisdom/цитата 4 (курсив, от элемента)

artifacts.artifact_name          — Название артефакта
```

### Для практики pN-M

```
practice_items.practice_name          — Название практики
practice_items.practice_name_desc     — Описание практики
practice_items.duration_Xmin          — Длительность

practice_messages.practice_message    — Сообщение элемента (короткая фраза перед стартом)
elements.sound_name                   — Название звука

guiding_texts.pN_M                    — Массив направляющих текстов (показываются во время практики)
final_phrases.pN_M                    — Финальная фраза после завершения
science_info.pN_M                     — (Опционально) Массив строк: Биология/Почему/Эффект
```

**Формат science_info:** Текст до двоеточия выделяется жирным автоматически.
Пример: `"Биология: Текст..."` → **Биология:** Текст...

---

## Чеклист: добавление нового контура

### 1. Код (onda-level1-demo_27.tsx)

- [ ] Добавить объект в массив `circuits` с практиками
- [ ] Добавить все практики в `practiceSpaces`
- [ ] **⚠️ КРИТИЧЕСКИ ВАЖНО:** Добавить маппинги в функции (иначе будет отображаться ID вместо названия!):
  - `getPracticeName()` — маппинг ID → ключ названия
  - `getPracticeDesc()` — маппинг ID → ключ описания
  - `getPracticeMessage()` — маппинг ID → ключ сообщения перед практикой
  - `getAmbientSound()` (опционально, только для p1-* практик)

### 2. Переводы (public/locales/*/translation.json)

- [ ] `circuits.circuit_N_name`
- [ ] `circuits.circuit_N_subtitle`
- [ ] `philosophy.level_N.text_1-6`
- [ ] `level_goal.level_N.wisdom_1-4`
- [ ] `practice_items.*` для всех практик
- [ ] `practice_messages.*` для всех практик
- [ ] `guiding_texts.pN_*` для всех практик
- [ ] `final_phrases.pN_*` для всех практик
- [ ] `artifacts.artifact_name`

### 3. Аудио (опционально)

- [ ] Загрузить аудио файлы в `public/practices pN/`
- [ ] Или в Supabase Storage `audio-practices/`
- [ ] Добавить пути в `RemoteAudioPlayer` компоненты

### 4. Визуальные элементы

- [ ] Выбрать цветовую схему (Tailwind градиент)
- [ ] Выбрать иконку (Lucide)
- [ ] Выбрать emoji для каждой практики

---

## ⚠️ Функции маппинга практик (ОБЯЗАТЕЛЬНО!)

В коде есть **отдельные функции**, которые преобразуют ID практики в ключ перевода. Без добавления маппинга практика будет отображаться как `p4-1` вместо "Мягкий Взгляд"!

### Где находятся (onda-level1-demo_27.tsx, ~строки 1575-1700):

```typescript
// 1. getPracticeName — название практики в списке и заголовках
const getPracticeName = (practiceId: string) => {
  const mapping = {
    'p1-1': 'practice_items.micro_breath',
    // ... другие практики ...
    'p4-1': 'practice_items.soft_gaze'  // ← ДОБАВИТЬ!
  };
  return t(mapping[practiceId] || practiceId);
};

// 2. getPracticeDesc — описание практики
const getPracticeDesc = (practiceId: string) => {
  const mapping = {
    'p1-1': 'practice_items.micro_breath_desc',
    // ... другие практики ...
    'p4-1': 'practice_items.soft_gaze_desc'  // ← ДОБАВИТЬ!
  };
  return t(mapping[practiceId] || practiceId);
};

// 3. getPracticeMessage — сообщение элемента перед стартом
const getPracticeMessage = (practiceId: string) => {
  const mapping = {
    'p1-1': 'practice_messages.breath_message',
    // ... другие практики ...
    'p4-1': 'practice_messages.soft_gaze_message'  // ← ДОБАВИТЬ!
  };
  return t(mapping[practiceId] || '');
};
```

### Почему это нужно:

UI использует эти функции для отображения текстов, а НЕ напрямую данные из массива `circuits`. Даже если в `circuits` указано `name: t('practice_items.soft_gaze')`, в некоторых местах UI вызывает `getPracticeName(practice.id)`.

### Чеклист для каждой новой практики:

1. ✅ Добавить в `circuits[N].practices[]`
2. ✅ Добавить в `practiceSpaces` (включая `scienceInfo` если нужен)
3. ✅ Добавить в `getPracticeName()` маппинг
4. ✅ Добавить в `getPracticeDesc()` маппинг  
5. ✅ Добавить в `getPracticeMessage()` маппинг
6. ✅ Добавить переводы в `translation.json`:
   - `practice_items.*` — название и описание
   - `practice_messages.*` — сообщение перед стартом
   - `guiding_texts.pN_M` — направляющие фразы во время практики
   - `final_phrases.pN_M` — финальная фраза
   - `science_info.pN_M` — (опционально) биология/почему/эффект

---

## Пример: Часть 3 "Я адаптируюсь"

### Маппинг блоков из gist

| Gist блок | Содержание | Ключ перевода |
|-----------|------------|---------------|
| B3_1 | «Форма рождается там...» | `philosophy.level_3.quote` |
| B3_2 | "Я адаптируюсь / Земноводное" | `circuits.circuit_3_name`, `circuit_3_subtitle` |
| B3_3 | "Земля становится твёрдой..." | `philosophy.level_3.text_1-5` |
| B3_4 | "Научиться адаптироваться..." | `level_goal.level_3.wisdom_1-3` |
| B3_5 | "ТЕРРА говорит:..." | `level_goal.level_3.wisdom_4` или отдельные цитаты |
| B3_6 | "Теперь ты стоишь между стихиями..." | `final_phrases.p3_*` (для финала контура) |

### Элементы

- **Element:** TERRA
- **Цвет:** `from-green-900 to-emerald-800`
- **Иконка:** Mountain (🏔️)
- **Артефакт:** "Кристалл заземления" (+50% OND)

---

## Структура аудио файлов

```
public/practices pN/
├── pN-1_Practice Name/
│   ├── pN-1_Practice Name-1.mp3
│   ├── pN-1_Practice Name-2.mp3
│   └── ...
├── pN-2_Another Practice/
│   └── ...
```

Или в Supabase Storage:
```
audio-practices/
├── pN/
│   ├── pN-1_Practice Name/
│   │   └── *.mp3
```

---

## Формулы и константы

### Длительности практик

| Ключ | Секунды | Минуты |
|------|---------|--------|
| `duration_3min` | 180 | 3 |
| `duration_6min` | 360 | 6 |
| `duration_10min` | 600 | 10 |
| `duration_12min` | 720 | 12 |
| `duration_15min` | 900 | 15 |
| `duration_20min` | 1200 | 20 |
| `duration_30min` | 1800 | 30 |

### Награды OND

- Базовая награда: `maxQnt` в определении практики
- Бонус артефакта: накапливается (+20%, +35%, +50%...)
- Условие засчитывания: ≥80% времени + ≥33% качества (без трекера)

---

## См. также

- `MODULE_FRONTEND.md` — Система практик и прогресса
- `MODULE_SUPABASE.md` — Структура БД для прогресса
