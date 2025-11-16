# 📤 Загрузка Больших Файлов в Supabase Storage

## Проблема
По умолчанию Supabase Storage имеет лимит **10MB на файл**. Для аудио-файлов ONDA (некоторые >10MB) это создаёт проблему.

## Решение: TUS Resumable Uploads

### ✅ **Преимущества TUS:**
- **Файлы до 50MB** (Free plan) или до 50GB (Pro plan)
- **Автоматическое возобновление** при обрыве сети
- **Прогресс загрузки** в реальном времени
- **Chunked upload** - файл загружается частями по 6MB

---

## 🔧 Настройка (Один раз)

### 1. Увеличьте лимит в Supabase Dashboard

1. Откройте [Supabase Dashboard](https://supabase.com/dashboard)
2. Выберите ваш проект
3. Перейдите в **Storage → Settings**
4. Измените **Global file size limit**:
   - **Free plan**: максимум **50 MB**
   - **Pro plan**: до **500 GB**

**⚠️ Важно:** Нужно изменить **ОБА** лимита:
- **Global limit** (для всего проекта)
- **Bucket limit** (для каждого bucket отдельно)

### 2. Установите зависимости (уже сделано)

```bash
npm install tus-js-client
```

---

## 📤 Использование

### **Вариант 1: Автоматический выбор метода**

Скрипт **автоматически** выбирает метод загрузки:
- **< 6MB**: Стандартный upload (быстрее)
- **> 6MB**: TUS resumable upload (надёжнее)

```bash
npm run upload:audio:tus
```

### **Вариант 2: Только стандартный upload (<10MB)**

Используйте старый скрипт для файлов <10MB:

```bash
npm run upload:audio
```

---

## 🎯 Что делает новый скрипт?

### **`upload-large-audio-tus.ts`**

```typescript
// Для файлов > 6MB использует TUS
await uploadWithTUS(filePath, remotePath, (uploaded, total) => {
  const progress = Math.round((uploaded / total) * 100);
  console.log(`${progress}%`);
});

// Для файлов < 6MB использует стандартный метод
await uploadStandard(filePath, remotePath);
```

### **Особенности:**

1. **Chunked upload**: Файлы разбиваются на части по 6MB
2. **Retry logic**: 5 попыток с экспоненциальным backoff
3. **Прогресс**: Логирует каждые 10% загрузки
4. **Upsert**: Автоматически перезаписывает существующие файлы

---

## 📊 Пример вывода

```bash
🎵 ONDA Audio Upload to Supabase (TUS Resumable)
============================================================
📍 Project ID: qwtdppugdcguyeaumymc
📦 Bucket: audio-practices
🔧 Using TUS for files > 6MB

🪣 Checking if bucket "audio-practices" exists...
✅ Bucket already exists

📊 Found 77 audio files

[1/77] Processing: p1-1_Breath of Life/p1-1_Breath of Life-1.mp3
  📤 Uploading p1-1_Breath of Life/p1-1_Breath of Life-1.mp3 (2.85 MB) via Standard...
  ✅ Uploaded: p1-1_Breath of Life/p1-1_Breath of Life-1.mp3

[2/77] Processing: Anxiety/adaptive-body_cocoon/adaptive-body_cocoon-2.mp3
  📤 Uploading Anxiety/adaptive-body_cocoon/adaptive-body_cocoon-2.mp3 (12.54 MB) via TUS...
     10%
     20%
     30%
     40%
     50%
     60%
     70%
     80%
     90%
     100%
  ✅ Uploaded: Anxiety/adaptive-body_cocoon/adaptive-body_cocoon-2.mp3

...

============================================================
📊 Upload Summary:
   Total files: 77
   ✅ Uploaded: 77
   ⏭️  Skipped:  0
   ❌ Failed:   0
============================================================

✅ All files uploaded successfully!
```

---

## 🚨 Решение проблем

### ❌ "413 Maximum size exceeded"

**Причина:** Лимит bucket меньше, чем размер файла.

**Решение:**
1. Проверьте **Global limit** в Storage Settings
2. Проверьте **Bucket limit** (Edit bucket → File size limit)
3. Убедитесь, что оба значения >= размера файла

### ❌ "Payload too large"

**Причина:** Bucket-специфичный лимит не увеличен.

**Решение:**
```bash
# В Supabase Dashboard:
Storage → Buckets → audio-practices → Edit
→ Set "File size limit" to 50 MB (or higher)
```

### ❌ TUS upload fails with 400/404

**Причина:** Неправильный Project ID или эндпоинт.

**Решение:** Проверьте, что `VITE_SUPABASE_URL` корректен:
```bash
echo $VITE_SUPABASE_URL
# Должно быть: https://YOUR_PROJECT_ID.supabase.co
```

---

## 📖 Технические детали

### **TUS Protocol**

TUS - это HTTP-протокол для **resumable file uploads**:
- **Chunking**: Файл разбивается на части
- **Resumption**: Если загрузка прервалась, она возобновляется с последнего chunk
- **Progress tracking**: Клиент знает, сколько байт загружено

### **Supabase TUS Endpoint**

```
https://PROJECT_ID.supabase.co/storage/v1/upload/resumable
```

**Заголовки:**
```typescript
headers: {
  authorization: `Bearer ${serviceRoleKey}`,
  'x-upsert': 'true', // Перезаписать если существует
}
```

**Metadata:**
```typescript
metadata: {
  bucketName: 'audio-practices',
  objectName: 'path/to/file.mp3',
  contentType: 'audio/mpeg',
  cacheControl: '3600',
}
```

**Chunk size:** Должен быть **ровно 6MB** (требование Supabase)

---

## 🔗 Ссылки

- [Supabase File Limits Docs](https://supabase.com/docs/guides/storage/uploads/file-limits)
- [TUS Resumable Upload Guide](https://supabase.com/docs/guides/storage/uploads/resumable-uploads)
- [TUS.js Client](https://github.com/tus/tus-js-client)

---

## ✅ Checklist

Перед загрузкой файлов >10MB:

- [ ] Увеличен **Global limit** в Storage Settings
- [ ] Увеличен **Bucket limit** для `audio-practices`
- [ ] Установлен `tus-js-client` (npm install)
- [ ] Переменные окружения настроены (`VITE_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`)
- [ ] Запущен скрипт: `npm run upload:audio:tus`

---

**Готово!** 🎉 Теперь вы можете загружать аудио-файлы любого размера (до 50MB на Free plan).
