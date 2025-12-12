# PRACTICES_AUDIO — Структура практик и аудио ONDA

## Supabase Storage

Базовый URL:
```
https://ilckshuxgvrbmibmfpaq.supabase.co/storage/v1/object/public/audio-practices/
```

---

## Part 1 практики (Часть 1: Я есть)

| ID | Название (RU) | Название (EN) | Длительность | Аудио папка |
|----|---------------|---------------|--------------|-------------|
| p1-1 | Микро-дыхание | Breath of Life | 3 мин | `p1-1_Breath of Life/` |
| p1-2 | Чувство бытия | Sense of Being | 3 мин | `p1-2_Sense of Being/` |
| p1-3 | Тёплый пульс | Warm Pulse | 3 мин | `p1-3_Warm Pulse/` |
| p1-4 | Неподвижная волна | Still Wave | 3 мин | `p1-4_Still Wave/` |
| p1-5 | Внутреннее слушание | Inner Listening | 3 мин | `p1-5_Inner Listening/` |
| p1-6 | Первый свет | First Light | 3 мин | `p1-6_First Light/` |
| p1-7 | Жидкое присутствие | Liquid Presence | 3 мин | `p1-7_Liquid Presence/` |
| p1-8 | Счёт дыхания | Breath Counting | 3 мин | `p1-8_Breath Counting/` |
| p1-9 | Точка покоя | Point of Stillness | 6 мин | `p1-9_Point of Stillness/` |
| p1-10 | Я есть тишина | I Am Stillness | 6 мин | `p1-10_I Am Stillness/` |
| p1-11 | Поток земли | Earth Flow | 12 мин | `p1-11_Earth Flow/` |
| p1-12 | Корень тела | Body Root | 12 мин | `p1-12_Body Root/` |

### Формат аудио файлов
```
{папка}/{id}_{название}-{номер_трека}.mp3

Пример:
p1-1_Breath of Life/p1-1_Breath of Life-1.mp3
p1-1_Breath of Life/p1-1_Breath of Life-2.mp3
```

### Количество треков
- 3-минутные практики: 2 трека
- 6-минутные практики: 3 трека
- 12-минутные практики: 4 трека

---

## Адаптивные практики (Emotional)

Расположены в подпапках по эмоциям:

| ID | Эмоция | Аудио папка |
|----|--------|-------------|
| body_cocoon | Anxiety | `Anxiety/adaptive-body_cocoon/` |
| light_inhale | Joy | `Joy/adaptive-light_inhale/` |
| inner_spark | Inspiration | `Inspiration/adaptive-inner_spark/` |
| slow_glow | Fatigue | `Fatigue/adaptive-slow_glow/` |
| earth_breath | Calmness | `Calmness/adaptive-earth_breath/` |
| wave_pulse | Sadness | `Sadness/adaptive-wave_pulse/` |

---

## Ключевые файлы

### Определение практик

| Файл | Содержимое |
|------|------------|
| `ios/App/App/OndaWatchPlugin.swift` | `part1Practices` — данные Part 1 для Apple Watch (Swift) |
| `src/components/AdaptivePracticeModal.tsx` | `adaptivePractices` — адаптивные практики (TypeScript) |
| `src/hooks/useWatchPracticeAudio.ts` | `practiceAudioMap` — маппинг ID → аудио пути |

### Воспроизведение аудио

| Компонент | Использование |
|-----------|---------------|
| `RemoteAudioPlayer.tsx` | Компонент для воспроизведения (используется в модалах) |
| `useAudioCache.ts` | Кеширование аудио (IndexedDB + Cache API) |
| `useWatchPracticeAudio.ts` | Автовоспроизведение при практике с часов |

---

## Apple Watch → iPhone аудио

### Поток событий
1. Часы: пользователь запускает практику
2. Часы → iPhone: `sendMessage(["type": "startPractice", "practiceId": "p1-1"])`
3. iPhone: `OndaWatchPlugin` получает, вызывает `notifyListeners("practiceStarted")`
4. React: `useWatchPracticeAudio` ловит событие, запускает аудио
5. При завершении: `practiceEnded` → аудио останавливается

### События Capacitor

```typescript
// src/plugins/ondaWatch.ts
interface PracticeStartedEvent {
  practiceId: string;
}

interface PracticeEndedEvent {
  practiceId: string;
  duration: number;
}
```

---

## Guiding Texts

Направляющие тексты меняются каждые **15 секунд** с fade анимацией (0.5s).

| Длительность | Количество текстов |
|--------------|-------------------|
| 3 мин (180 сек) | 12 текстов |
| 6 мин (360 сек) | 24 текста |
| 12 мин (720 сек) | 48 текстов |

Тексты хранятся:
- Watch: `part1Practices[].guidingTexts` в `OndaWatchPlugin.swift`
- iPhone: переводы в `public/locales/{lang}/translation.json`
