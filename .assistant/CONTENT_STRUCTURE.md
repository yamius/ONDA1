# CONTENT_STRUCTURE — Структура контента ONDA

Документация для создания новых частей (контуров) приложения.

---

## 🔗 Связь Уровней (Chapters) и Частей (Circuits)

**ВАЖНО:** Уровни и Части связаны. При выборе Уровня в выпадающем списке — переключение на первую Часть этого уровня. При выборе Части — переключение на соответствующий Уровень.

| Уровень (Chapter) | Элемент | Части (Circuits) | Названия частей |
|-------------------|---------|------------------|-----------------|
| **Уровень 1: Тело** | TERRA | Части 1, 2, 3 | Я есть, Я двигаюсь, Я адаптируюсь |
| **Уровень 2: Эмоции** | AQUA | Части 4, 5, 6 | Я маневрирую, Я охраняю территорию, Я в стае |
| **Уровень 3: Разум** | AER | Части 7, 8, 9 | Я различаю, Я фокусируюсь, Я планирую |
| **Уровень 4: Социум** | IGNIS | Части 10, 11, 12 | Я говорю, Я обмениваюсь, Я сотрудничаю |

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
  finalPhrase: t('final_phrases.p3_1')
}
```

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

practice_messages.practice_message    — Сообщение элемента
elements.sound_name                   — Название звука

guiding_texts.pN_M                    — Массив направляющих текстов (показываются во время практики)
final_phrases.pN_M                    — Финальная фраза после завершения
```

---

## Чеклист: добавление нового контура

### 1. Код (onda-level1-demo_27.tsx)

- [ ] Добавить объект в массив `circuits`
- [ ] Добавить все практики в `practiceSpaces`
- [ ] Добавить маппинги в функции:
  - `getPracticeName()`
  - `getPracticeDesc()`
  - `getPracticeMessage()`
  - `getAmbientSound()` (если нужно)

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
