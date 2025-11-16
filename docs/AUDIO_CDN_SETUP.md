# Система удаленной загрузки аудио файлов

> **⚠️ Файлы >10MB:** См. [UPLOAD_LARGE_FILES.md](./UPLOAD_LARGE_FILES.md) для инструкций по загрузке больших файлов через TUS protocol.

**Цель:** Уменьшить размер APK путем хранения аудио файлов на сервере и их динамической загрузки.

## 📊 Размер аудио контента

- **Базовые практики:** 39 MB (`public/practices p1/`)
- **Адаптивные практики:** 206 MB (`public/adaptive-practices/`)
- **Итого:** ~245 MB аудио файлов

**Проблема:** Включение всех аудио в APK увеличивает размер приложения на 245MB, что негативно влияет на установки из Google Play.

**Решение:** Хранить аудио в Supabase Storage (CDN) и загружать по требованию с двухуровневым кешированием.

---

## 🏗️ Архитектура

```
┌─────────────────┐
│   React App     │
│  (PWA/Android)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  useAudioCache  │  ← Hook для загрузки
│     Hook        │
└────────┬────────┘
         │
    ┌────┴──────────────────┐
    │                       │
    ▼                       ▼
┌─────────┐          ┌────────────┐
│ Cache 1 │          │  Cache 2   │
│IndexedDB│          │ Cache API  │
└────┬────┘          └─────┬──────┘
     │                     │
     │  Если не в кеше     │
     └──────────┬──────────┘
                ▼
      ┌──────────────────┐
      │ Supabase Storage │  ← CDN
      │   (1GB free)     │
      └──────────────────┘
```

### Два уровня кеша:

1. **IndexedDB** - быстрый доступ, хранит Blob объекты
2. **Cache API** - резервный кеш, работает даже offline

---

## 📦 Установка и настройка

### Шаг 1: Создать Supabase Storage Bucket

```bash
# В Supabase Dashboard:
# Storage → New bucket → "audio-practices"
# Public: ✅ Enabled
# File size limit: 10MB
```

Или автоматически при первом upload:

```bash
npm run upload:audio
```

### Шаг 2: Загрузить аудио файлы

Убедись что у тебя есть `SUPABASE_SERVICE_ROLE_KEY` в `.env`:

```bash
# .env (НИКОГДА НЕ КОММИТЬ!)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # Service Role Key
```

Загрузить все аудио:

```bash
npm run upload:audio
```

**Что делает скрипт:**
- ✅ Сканирует `public/practices p1/` и `public/adaptive-practices/`
- ✅ Создает bucket если не существует
- ✅ Загружает все `.mp3`, `.wav`, `.ogg`, `.m4a` файлы
- ✅ Пропускает уже загруженные файлы
- ✅ Показывает прогресс и статистику

**Вывод:**
```
🎵 Starting audio upload to Supabase Storage...

📁 Found 87 audio files to upload

✅ Uploaded: practices p1/intro.mp3
✅ Uploaded: adaptive-practices/Anxiety/adaptive-body_cocoon/adaptive-body_cocoon-1.mp3
...

==================================================
📊 Upload Summary:
==================================================
Total files:     87
✅ Uploaded:     87
⏭️  Skipped:      0
❌ Failed:       0
==================================================

📍 Example public URL:
https://your-project.supabase.co/storage/v1/object/public/audio-practices/practices%20p1/intro.mp3

✅ All audio files are now accessible via CDN!
```

---

## 💻 Использование в коде

### Базовый пример

```tsx
import { useAudioCache } from '@/hooks/useAudioCache';

function AudioPlayer({ track }: { track: string }) {
  const { url, loading, progress, error } = useAudioCache(track);

  if (loading) {
    return <div>Загрузка... {progress}%</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return <audio src={url} controls />;
}

// Использование:
<AudioPlayer track="practices p1/intro.mp3" />
```

### Продвинутый пример с предзагрузкой

```tsx
import { useAudioCache, useAudioPreloader } from '@/hooks/useAudioCache';

function PracticeSession() {
  const { url, loading, progress } = useAudioCache('practices p1/track1.mp3');
  const preloader = useAudioPreloader();

  useEffect(() => {
    // Предзагрузить следующие треки в фоне
    preloader.preload([
      'practices p1/track2.mp3',
      'practices p1/track3.mp3',
    ]);
  }, []);

  return (
    <>
      {loading && <ProgressBar value={progress} />}
      <audio src={url} autoPlay />
      
      {/* Индикатор предзагрузки */}
      {preloader.remaining > 0 && (
        <div>Загрузка {preloader.remaining} треков в фоне...</div>
      )}
    </>
  );
}
```

### Очистка кеша

```tsx
import { clearAudioCache } from '@/hooks/useAudioCache';

function SettingsPage() {
  const handleClearCache = async () => {
    await clearAudioCache();
    alert('Кеш очищен!');
  };

  return (
    <button onClick={handleClearCache}>
      Очистить кеш аудио
    </button>
  );
}
```

---

## 🔧 API Reference

### `useAudioCache(audioPath)`

Загружает аудио файл с прогрессивным кешированием.

**Parameters:**
- `audioPath: string | null` - Относительный путь к файлу

**Returns:**
```typescript
{
  loading: boolean;      // Идет загрузка?
  progress: number;      // 0-100%
  error: string | null;  // Ошибка загрузки
  url: string | null;    // Blob URL для <audio>
  cached: boolean;       // Взято из кеша?
}
```

**Пример путей:**
- `"practices p1/intro.mp3"`
- `"adaptive-practices/Anxiety/adaptive-body_cocoon/adaptive-body_cocoon-1.mp3"`

---

### `useAudioPreloader()`

Предзагрузка аудио файлов в фоне.

**Returns:**
```typescript
{
  preload: (paths: string[]) => void;  // Добавить в очередь
  current: string | null;               // Текущий файл
  remaining: number;                    // Осталось в очереди
}
```

---

### `clearAudioCache()`

Асинхронная функция для очистки всех кешей.

```typescript
async function clearAudioCache(): Promise<void>
```

---

## 🚀 Преимущества

### ✅ Уменьшение размера APK
- **Было:** APK + 245 MB аудио = 250+ MB
- **Стало:** APK без аудио = ~5 MB

### ✅ Быстрая установка
- Пользователи скачивают только APK
- Аудио загружается по требованию

### ✅ Двухуровневое кеширование
1. **IndexedDB** - Blob storage (быстро)
2. **Cache API** - HTTP cache (надежно)

### ✅ Офлайн поддержка
- Кешированные треки работают без интернета
- Автоматическое восстановление при возвращении online

### ✅ CDN доставка
- Supabase Storage использует Cloudflare CDN
- Низкая латентность по всему миру

---

## 📱 Android WebView конфигурация

Для корректной работы в Android WebView нужно включить кеш:

```kotlin
// MainActivity.kt
webView.settings.apply {
    // ... другие настройки
    
    // Включить кеш для аудио
    setAppCacheEnabled(true)
    cacheMode = WebSettings.LOAD_DEFAULT
    
    // Увеличить квоту для хранения
    setAppCachePath(context.cacheDir.path)
    setAppCacheMaxSize(100 * 1024 * 1024) // 100MB
}
```

---

## 🔥 Build конфигурация

### Исключить аудио из production build

Обновить `vite.config.ts`:

```typescript
export default defineConfig({
  // ...
  build: {
    rollupOptions: {
      external: [
        /^\/practices\s+p1\//,
        /^\/adaptive-practices\//,
      ],
    },
  },
});
```

### Удалить аудио из `dist/` перед копированием в Android

```bash
# После npm run build
npm run build
rm -rf dist/practices\ p1
rm -rf dist/adaptive-practices

# Затем копировать в Android assets
cp -r dist/* android-webview/app/src/main/assets/
```

---

## 🐛 Troubleshooting

### Проблема: "Failed to get public URL"

**Причина:** Bucket не публичный или не существует.

**Решение:**
```bash
# В Supabase Dashboard:
Storage → audio-practices → Settings → Public access: ON
```

### Проблема: Аудио не кешируется

**Причина:** IndexedDB/Cache API отключены в браузере.

**Решение:**
- Проверь console logs: `[AudioCache] IndexedDB get error`
- В Chrome: Settings → Privacy → Site Data → Разрешить

### Проблема: Медленная загрузка

**Причина:** Файлы слишком большие или медленный интернет.

**Решение:**
- Сжать аудио файлы (bitrate 128kbps достаточно для речи)
- Использовать предзагрузку (`useAudioPreloader`)

---

## 📈 Мониторинг

### Проверить размер кеша

```typescript
// В DevTools Console:
navigator.storage.estimate().then(estimate => {
  console.log(`Использовано: ${estimate.usage / 1024 / 1024} MB`);
  console.log(`Доступно: ${estimate.quota / 1024 / 1024} MB`);
});
```

### Логи в console

Все операции логируются с префиксом `[AudioCache]`:

```
[AudioCache] Panel initialized
[AudioCache] Loading from IndexedDB: practices p1/intro.mp3
[AudioCache] Downloading from Supabase: practices p1/track2.mp3
[AudioCache] Downloaded and cached: practices p1/track2.mp3
```

---

## 🎓 Best Practices

### 1. Предзагружать следующие треки

```tsx
// Загружать track2 пока проигрывается track1
useEffect(() => {
  if (currentTrack === 1) {
    preloader.preload(['practices p1/track2.mp3']);
  }
}, [currentTrack]);
```

### 2. Показывать прогресс загрузки

```tsx
{loading && (
  <div className="flex items-center gap-2">
    <Spinner />
    <span>Загрузка аудио... {progress}%</span>
  </div>
)}
```

### 3. Обрабатывать ошибки gracefully

```tsx
{error && (
  <Alert variant="destructive">
    <AlertDescription>
      Не удалось загрузить аудио. Проверьте интернет-соединение.
      <Button onClick={() => reload()}>Повторить</Button>
    </AlertDescription>
  </Alert>
)}
```

### 4. Очистка кеша в настройках

Добавить кнопку "Очистить кеш" в Settings для освобождения места:

```tsx
<Button onClick={() => clearAudioCache()}>
  Очистить кеш ({cacheSize} MB)
</Button>
```

---

## 🔐 Безопасность

- ✅ Все файлы публично доступны (не содержат sensitive data)
- ✅ Supabase Storage использует HTTPS
- ✅ CDN кеширует файлы (max-age: 1 year)
- ⚠️ НЕ храни API keys в коде, используй `.env`

---

## 📝 Checklist для Production

- [ ] Загрузить все аудио в Supabase Storage
- [ ] Протестировать загрузку на медленном интернете (3G)
- [ ] Проверить офлайн mode (после кеширования)
- [ ] Удалить аудио из `dist/` перед Android build
- [ ] Настроить WebView cache в MainActivity.kt
- [ ] Добавить обработку ошибок в UI
- [ ] Добавить индикаторы загрузки
- [ ] Протестировать на реальном Android устройстве

---

**Готово!** Теперь твое приложение будет легким как перышко 🪶
