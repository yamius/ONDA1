# ONDA Science — план страниц

Сводный план научного раздела: что уже сделано, что осталось из MVP, что берём из списка 40 тем и что сознательно не делаем.

**Правило раздела (из аудита):** научный раздел владеет **сущностями, механизмами и доказательствами**. Практические «что делать» и бытовые вопросы остаются в статьях — научная страница на них ссылается, а не повторяет.

Типы URL: `concepts/` (что это), `measurements/` (как измеряется и насколько точно), `mechanisms/` (как работает), `evidence/` (что показывают исследования).

---

## 1. Готово (5)

| URL | Тема |
|---|---|
| `concepts/heart-rate-variability` | What is HRV — центральная страница |
| `concepts/rmssd` | RMSSD |
| `concepts/sdnn` | SDNN |
| `measurements/heart-rate-variability` | Можно ли доверять HRV с часов и колец (ECG vs PPG) |
| `evidence/vagus-nerve-stimulation` | Работает ли стимуляция вагуса |

---

## 2. Остаток MVP — делаем в этом порядке (8)

| # | URL | Тема | Зачем | Ссылается на / пересечения |
|---|---|---|---|---|
| 1 | `concepts/hrv-baseline` | HRV baseline: why your own normal matters more than any norm | Основа всей логики ONDA (коридор, тренд против одного числа). Сюда же — «почему HRV нельзя сравнивать с чужой» | `normal-hrv-by-age`, `/tools/hrv`, `how-to-measure-hrv-consistently` |
| 2 | `concepts/respiratory-sinus-arrhythmia` | Respiratory sinus arrhythmia: how breathing shapes heart rhythm | Научное объяснение связи дыхания и сердца — фундамент всех дыхательных практик | центральная HRV, `mechanisms/breathing-and-hrv` |
| 3 | `mechanisms/breathing-and-hrv` | How breathing changes HRV — and why slow breathing raises it | Прямая связь с главной функцией ONDA; закрывает темы 6 и 8 из списка | `coherent-breathing-guide`, `/resonance-breathing`, `find-your-resonance-breathing-rate` |
| 4 | `evidence/hrv-biofeedback` | HRV biofeedback: what the evidence shows | Научная основа продукта; закрывает темы 9, 38, 39 | pillar `/hrv-biofeedback`, `/apple-watch-hrv-biofeedback` |
| 5 | `evidence/slow-breathing` | Slow breathing: what it does and doesn't do, by the evidence | Синтез исследований по давлению, тревоге, HRV, сну — с честными классами | статьи про дыхание и давление, 4-7-8, когерентное дыхание |
| 6 | `concepts/autonomic-nervous-system` | The autonomic nervous system: sympathetic and parasympathetic | Связывает метрику с физиологией; одна страница вместо трёх тонких | глоссарий, `calm-your-nervous-system-down` |
| 7 | `concepts/vagus-nerve` | The vagus nerve: what it does, and what is myth | Огромный спрос, много мифологии; без «тонуса вагуса» как измеряемой величины | флагман VNS, `vagus-nerve-master-key`, `vagus-nerve-exercises` |
| 8 | `measurements/resting-heart-rate` | Resting heart rate: what it reflects and how it's measured | Вторая главная метрика ONDA; нормы — из утверждённых фактов | `resting-heart-rate-by-age`, инструмент пульса покоя |

---

## 3. Фаза 2 — берём из списка 40 тем (6)

Темы из списка, которые действительно научные и не дублируют статьи. Несколько тем из списка объединены в одну страницу — по отдельности они были бы тонкими и конкурировали бы друг с другом.

| # | URL | Тема | Что объединяет из списка | Зачем |
|---|---|---|---|---|
| 9 | `concepts/interpreting-hrv` | What a single HRV value can and can't tell you | 2, 18, 19, 20, 28, 29 (что HRV говорит; не оценка; нельзя сравнивать с чужой; почему личная; низкая и высокая HRV) | Главный материал против хайпа и неверных толкований; страница безопасности |
| 10 | `mechanisms/hrv-day-to-day` | Why HRV changes from day to day | 4, 12–16 (стресс, сон, нагрузка, алкоголь, кофеин) | Синтез механизмов и размеров эффекта; практические детали — ссылками на существующие статьи про алкоголь, кофеин, сон, перетренированность |
| 11 | `concepts/interoception` | Interoception: how the brain senses the body | 35, 36 | Совпадает с философией ONDA; научная опора для практик внимания к телу |
| 12 | `mechanisms/heart-brain-interaction` | Heart–brain interaction and neurovisceral integration | 33, 34 | Продвинутый уровень; модель Тейера с честной пометкой, что это модель |
| 13 | `evidence/meditation-autonomic-nervous-system` | Meditation and the autonomic nervous system: what the evidence shows | 30, 31 | Научная опора для кластера статей о медитации; синтез с классами доказательности |
| 14 | `measurements/respiratory-rate` | Respiratory rate at rest: what it reflects | — (из аудита) | Третья метрика ONDA; ночная частота дыхания |

---

## 4. Методология ONDA (1)

| # | URL | Тема | Зачем |
|---|---|---|---|
| 15 | `methodology/onda` | How ONDA measures and interprets physiological signals | Как ONDA получает пульс (камера, HealthKit), как строит базлайн и коридор, как работают сигналы, ограничения. Сильный сигнал доверия для поиска и ИИ |

**Важно:** у ONDA нет собственного валидационного исследования. Страница описывает **метод и ограничения**, а не «валидацию». Никаких утверждений о точности ONDA, которые нечем подтвердить. Раздел «ONDA validation» из списка не делаем, пока нет исследования.

---

## 5. Не делаем — и почему

| Темы из списка | Причина |
|---|---|
| 1 What Is HRV, 3 RMSSD vs SDNN, 24 ECG vs wrist, 26–27 RMSSD/SDNN in wearables | Уже сделаны (центральная страница, RMSSD, SDNN, флагман про часы) — сравнение RMSSD и SDNN есть внутри этих страниц |
| 10 What is resonance breathing | Покрывает pillar `/resonance-breathing`; научная часть войдёт в `mechanisms/breathing-and-hrv` |
| 11 Vagus nerve and HRV | Войдёт в `concepts/vagus-nerve` |
| 21 Apple Watch HRV, 22 Oura HRV, 23 Whoop HRV | Факты об устройствах — только из официальных источников, их мало; бытовая сторона уже в статьях и обзорах. Нужное уже есть во флагмане про часы |
| 25 Why devices give different numbers | Статья `hrv-different-every-device` + флагман про часы |
| 17 Food, digestion and HRV | Слабая доказательная база для отдельной научной страницы; при необходимости — абзац в `mechanisms/hrv-day-to-day` |
| 32 Attention, breathing and regulation | Слишком широко; части войдут в страницы про интероцепцию и медитацию |
| 37 Biofeedback vs meditation | Уже есть статья `meditation-vs-breathwork`; научная часть — в `evidence/hrv-biofeedback` |
| 38, 39 Real-time biofeedback, how biofeedback works | Войдут в `evidence/hrv-biofeedback` |
| 40 How ONDA uses physiological signals | Объединено в `methodology/onda` |
| Квантовое сознание, «частоты», «вибрации», 40/10 Гц, «HRV доказывает эмоции», вагус как объяснение всего | Согласен со списком: не делаем вообще. Подрывает доверие ко всему разделу |

---

## 6. Как это ложится на 5 кластеров из списка

Кластеры — для хабов и навигации, а URL остаются по типам (`concepts/measurements/mechanisms/evidence`).

| Кластер | Страницы |
|---|---|
| HRV | центральная HRV, RMSSD, SDNN, базлайн, interpreting HRV, флагман про часы |
| Breathing | RSA, breathing and HRV, slow breathing, respiratory rate |
| Nervous system | ANS, vagus nerve, VNS, HRV day to day |
| Brain–body | interoception, heart–brain, meditation and ANS, HRV biofeedback |
| Measurement & evidence | флагман про часы, resting heart rate, методология ONDA |

**Итого:** 5 готово + 8 MVP + 6 фаза 2 + 1 методология = **20 страниц**. Из 40 тем списка — всё ценное покрыто, без дублей со статьями и без тонких страниц.
