# 🚀 Быстрый старт: Система удаленной загрузки аудио

## 📋 Что нужно сделать

### 1️⃣ Получить Service Role Key для Supabase

1. Открой [Supabase Dashboard](https://supabase.com/dashboard)
2. Выбери свой проект
3. Иди в **Settings → API**
4. Найди **Service Role Key** (⚠️ СЕКРЕТНЫЙ КЛЮЧ!)
5. Скопируй его

### 2️⃣ Добавить ключ в Environment Variables

Открой файл `.env` (или создай его в корне проекта):

```bash
# .env
VITE_SUPABASE_URL=https://ваш-проект.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...  # Уже есть
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # НОВЫЙ! Скопируй из Dashboard
```

⚠️ **ВАЖНО:** 
- **НЕ КОММИТЬ** `.env` в Git!
- Проверь что `.env` в `.gitignore`

### 3️⃣ Загрузить аудио файлы в Supabase Storage

Запусти команду:

```bash
npm run upload:audio
```

**Что произойдет:**
- ✅ Создастся bucket `audio-practices` (если нет)
- ✅ Загрузятся все файлы из `public/practices p1/` и `public/adaptive-practices/`
- ✅ ~245MB аудио будут доступны через CDN

**Вывод:**
```
🎵 Starting audio upload to Supabase Storage...

🪣 Checking if bucket "audio-practices" exists...
✅ Bucket already exists

📁 Found 87 audio files to upload

✅ Uploaded: practices p1/intro.mp3
✅ Uploaded: adaptive-practices/Anxiety/adaptive-body_cocoon-1.mp3
...

==================================================
📊 Upload Summary:
==================================================
Total files:     87
✅ Uploaded:     87
⏭️  Skipped:      0
❌ Failed:       0
==================================================

✅ All audio files are now accessible via CDN!
```

### 4️⃣ Использовать в коде

#### Вариант А: RemoteAudioPlayer (рекомендуется)

```tsx
import { RemoteAudioPlayer } from '@/components/RemoteAudioPlayer';

function MyPractice() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Пауза' : 'Играть'}
      </button>

      <RemoteAudioPlayer
        isPlaying={isPlaying}
        audioPath="practices p1/intro.mp3"
        showLoadingIndicator={true}
        onLoadingChange={(loading, progress) => {
          console.log(`Загрузка: ${progress}%`);
        }}
      />
    </>
  );
}
```

#### Вариант Б: useAudioCache hook (для кастомных плееров)

```tsx
import { useAudioCache } from '@/hooks/useAudioCache';

function CustomPlayer() {
  const { url, loading, progress, error } = useAudioCache('practices p1/track1.mp3');

  if (loading) {
    return <div>Загрузка... {progress}%</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return <audio src={url} controls autoPlay />;
}
```

### 5️⃣ Обновить существующие компоненты

Найди все использования `PracticeAudioPlayer` и замени на `RemoteAudioPlayer`:

**Было:**
```tsx
<PracticeAudioPlayer
  isPlaying={isPlaying}
  audioSrc="/adaptive-practices/Anxiety/adaptive-body_cocoon-1.mp3"
/>
```

**Стало:**
```tsx
<RemoteAudioPlayer
  isPlaying={isPlaying}
  audioPath="adaptive-practices/Anxiety/adaptive-body_cocoon/adaptive-body_cocoon-1.mp3"
  showLoadingIndicator={true}
/>
```

⚠️ **Важно:** 
- Убери `/` в начале пути (было `/adaptive...` → стало `adaptive...`)
- Поменяй prop `audioSrc` на `audioPath`

### 6️⃣ Удалить аудио из production build

Когда будешь собирать для Android, **удали аудио из dist/**:

```bash
# Собрать приложение
npm run build

# Удалить аудио из dist (они теперь на CDN!)
rm -rf dist/practices\ p1
rm -rf dist/adaptive-practices

# Скопировать в Android assets
cp -r dist/* android-webview/app/src/main/assets/
```

**Результат:**
- **Было:** APK ~250MB
- **Стало:** APK ~5MB 🎉

---

## 🧪 Тестирование

### Проверить что все работает:

1. **Запусти dev сервер:**
   ```bash
   npm run dev
   ```

2. **Открой Chrome DevTools → Console**

3. **Проверь логи:**
   ```
   [AudioCache] Loading from IndexedDB: practices p1/intro.mp3
   [AudioCache] Downloading from Supabase: practices p1/intro.mp3
   [AudioCache] Downloaded and cached: practices p1/intro.mp3
   ```

4. **Проверь кеш:**
   ```javascript
   // В DevTools Console:
   navigator.storage.estimate().then(e => {
     console.log(`Использовано: ${(e.usage / 1024 / 1024).toFixed(2)} MB`);
   });
   ```

### Проверить на медленном интернете:

1. Chrome DevTools → Network → Throttling → **Slow 3G**
2. Запусти практику
3. Увидишь индикатор загрузки с процентами
4. После загрузки - аудио в кеше, работает мгновенно!

---

## 🎯 Чек-лист перед production

- [ ] Все аудио файлы загружены в Supabase Storage
- [ ] В `.env` есть `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Все компоненты используют `RemoteAudioPlayer` или `useAudioCache`
- [ ] Удалил аудио из `dist/` перед копированием в Android
- [ ] Протестировал на медленном интернете (3G)
- [ ] Протестировал офлайн mode (после кеширования)
- [ ] Android WebView кеш включен (уже сделано в MainActivity.kt)

---

## ❓ FAQ

### Q: Можно ли использовать и локальные, и удаленные файлы?

**A:** Да! `PracticeAudioPlayer` работает для локальных файлов, `RemoteAudioPlayer` для удаленных. Можно использовать оба.

### Q: Как очистить кеш?

**A:** 
```tsx
import { clearAudioCache } from '@/hooks/useAudioCache';

await clearAudioCache(); // Очистит IndexedDB + Cache API
```

### Q: Что делать если файл не грузится?

**A:**
1. Проверь URL в Supabase Dashboard → Storage → audio-practices
2. Проверь что bucket публичный
3. Проверь путь к файлу (без `/` в начале)
4. Посмотри console logs: `[AudioCache] ...`

### Q: Сколько места занимает кеш?

**A:** По умолчанию браузер дает ~60% от свободного места. В Android WebView - 200MB (настроено в MainActivity.kt).

### Q: Работает ли офлайн?

**A:** Да! После первой загрузки аудио кешируется и работает без интернета.

---

## 🎉 Готово!

Теперь твое приложение:
- ✅ Весит ~5MB вместо 250MB
- ✅ Быстро устанавливается из Google Play
- ✅ Загружает аудио по требованию
- ✅ Кеширует для офлайн использования
- ✅ Показывает прогресс загрузки пользователю

**Следующий шаг:** Загрузи обновленный APK в Google Play! 🚀
