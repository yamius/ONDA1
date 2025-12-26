# EmotionalCheck "Load failed" Issue

**Дата:** 2024-12-25  
**Ветка:** `experiment/watch-context-priority`  
**Статус:** ❌ НЕ РЕШЕНО (отложено)  
**Приоритет:** Средний (некритично, есть fallback на mock данные)

---

## Описание проблемы

При анализе записи голоса в `EmotionalCheckModal` возникает ошибка `TypeError: "Load failed"` при попытке отправить аудио в Supabase Edge Function.

### Симптомы

```
[11:35:11] [INFO] [EmotionalCheck] 📦 Using audio blob from memory: 28062 bytes
[11:35:11] [INFO] [EmotionalCheck] 📤 Sending to Supabase Edge Function...
[11:35:18] [ERROR] [EmotionalCheck] ❌ Error analyzing voice: {} (7 seconds later)
[11:35:18] [ERROR] [EmotionalCheck] Error details: {
  "message": "Load failed",
  "name": "TypeError",
  "fullError": "{\"message\":\"Load failed\"}"
}
[11:35:18] [WARN] [EmotionalCheck] ⚠️ Using fallback mock emotion data due to API error
```

### Поведение

1. ✅ Запись голоса работает (28062 bytes recorded)
2. ✅ Blob создается корректно из `audioChunksRef.current`
3. ❌ `fetch()` к Supabase Edge Function фейлится через ~7 секунд
4. ✅ Fallback на mock данные срабатывает (graceful degradation работает)

---

## История исправлений

### Попытка 1: Исправление fetch(blob:...)

**Проблема:** Первоначально код использовал `fetch(audioURL)` где `audioURL` был blob URL (`blob:http://...`).

**Старый код (НЕ работал на iOS):**
```typescript
const audioBlob = await fetch(audioURL).then(r => r.blob());  // ❌ iOS блокирует fetch(blob:...)
```

**Новый код (текущий):**
```typescript
const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });  // ✅ Берем blob из памяти
console.log('[EmotionalCheck] 📦 Using audio blob from memory:', audioBlob.size, 'bytes');
```

**Результат:** Blob создается успешно, но fetch() к Edge Function все равно фейлится.

**Коммит:** `041b573` - "Fix EmotionalCheck 'Load failed' error on iOS"

---

## Анализ возможных причин

### Вариант 1: CORS проблема ⚠️

**Теория:** Supabase Edge Function блокирует запрос из-за неправильных CORS заголовков.

**Факты:**
- Edge Function имеет CORS заголовки:
  ```typescript
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
  };
  ```
- `FormData` отправляет `Content-Type: multipart/form-data; boundary=...`
- Возможно, специфический `Content-Type` с boundary не проходит через CORS

**Проверка:** Нужно добавить логирование response status и headers

**Вероятность:** Средняя (40%)

---

### Вариант 2: Неправильный URL или ключ ⚠️

**Теория:** `VITE_SUPABASE_URL` или `VITE_SUPABASE_ANON_KEY` неправильные или не установлены.

**Факты:**
- Переменные импортируются:
  ```typescript
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
  ```
- НЕТ логирования значений (нужно добавить)
- URL формируется: `${SUPABASE_URL}/functions/v1/analyze-emotion`

**Проверка:** Добавить логи `console.log('[EmotionalCheck] API URL:', apiUrl.substring(0, 50))`

**Вероятность:** Низкая (20%) - если бы URL был неправильный, ошибка была бы "Failed to fetch" или 404

---

### Вариант 3: Network timeout (iOS WKWebView) ⚠️

**Теория:** iOS WKWebView блокирует fetch() запрос из-за timeout или security restrictions.

**Факты:**
- Ошибка происходит через 7 секунд (слишком быстро для типичного timeout)
- iOS WKWebView имеет жесткие ограничения на network requests
- "Load failed" — типичная ошибка iOS для заблокированных запросов

**Проверка:** Попробовать на Android или в браузере (не WKWebView)

**Вероятность:** Высокая (60%)

---

### Вариант 4: FormData + fetch() не работает на iOS 🔥

**Теория:** iOS Safari/WKWebView имеет проблемы с отправкой `FormData` через `fetch()`.

**Факты:**
- iOS часто имеет баги с FormData и binary data
- Размер файла небольшой (28 KB), не должно быть проблем с размером
- Edge Function корректно принимает FormData:
  ```typescript
  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const file = formData.get("audio");
    // ...
  }
  ```

**Альтернатива:** Отправлять как base64 в JSON вместо FormData

**Вероятность:** Высокая (50%)

---

### Вариант 5: Supabase Edge Function недоступна ❓

**Теория:** Edge Function не отвечает или возвращает ошибку.

**Факты:**
- НЕТ логов от Edge Function в Supabase dashboard
- НЕТ логов response.status в клиенте
- Ошибка "Load failed" появляется ДО того, как response получен

**Проверка:** Проверить Supabase dashboard → Edge Functions → Logs

**Вероятность:** Средняя (30%)

---

## Рекомендуемые решения

### Решение 1: Добавить детальную диагностику (ПЕРВЫЙ ШАГ) ⭐

**Цель:** Понять ГДЕ именно фейлится запрос.

**Изменения в `EmotionalCheckModal.tsx`:**

```typescript
const analyzeVoice = async () => {
  console.log('[EmotionalCheck] 🔍 Starting voice analysis...');
  setRecordingState('analyzing');

  try {
    if (audioChunksRef.current.length === 0) {
      throw new Error('No audio recording available');
    }

    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    console.log('[EmotionalCheck] 📦 Audio blob:', {
      size: audioBlob.size,
      type: audioBlob.type,
      chunks: audioChunksRef.current.length
    });

    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    const apiUrl = `${SUPABASE_URL}/functions/v1/analyze-emotion`;
    
    // 🔍 ДИАГНОСТИКА: Логируем URL и ключ
    console.log('[EmotionalCheck] 🌐 API URL:', apiUrl);
    console.log('[EmotionalCheck] 🔑 Auth key (first 20 chars):', SUPABASE_ANON_KEY?.substring(0, 20) + '...');
    console.log('[EmotionalCheck] 📤 Sending FormData...');
    
    const fetchStartTime = Date.now();

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: formData,
    });

    const fetchDuration = Date.now() - fetchStartTime;
    console.log('[EmotionalCheck] ✅ Fetch completed in', fetchDuration, 'ms');
    console.log('[EmotionalCheck] 📊 Response status:', response.status);
    console.log('[EmotionalCheck] 📊 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[EmotionalCheck] ❌ API error response:', errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('[EmotionalCheck] 📦 API result:', result);

    // ... остальное без изменений
  } catch (error: any) {
    console.error('[EmotionalCheck] ❌ Error analyzing voice:', error);
    console.error('[EmotionalCheck] 🔍 Error details:', {
      message: error?.message || 'Unknown error',
      name: error?.name || 'Unknown',
      stack: error?.stack,
      type: typeof error,
      fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
    });
    
    // 🔍 ДИАГНОСТИКА: Проверяем сетевые ошибки
    if (error.name === 'TypeError' && error.message === 'Load failed') {
      console.error('[EmotionalCheck] 🚨 Network request blocked or failed');
      console.error('[EmotionalCheck] Possible causes:');
      console.error('[EmotionalCheck] 1. CORS issue');
      console.error('[EmotionalCheck] 2. Invalid URL or auth key');
      console.error('[EmotionalCheck] 3. iOS WKWebView network restrictions');
      console.error('[EmotionalCheck] 4. FormData + fetch() not working on iOS');
      console.error('[EmotionalCheck] 5. Supabase Edge Function unavailable');
    }

    // ... fallback на mock данные
  }
};
```

---

### Решение 2: Отправлять как base64 JSON вместо FormData 🔧

**Цель:** Обойти возможные проблемы с FormData на iOS.

**Изменения в `EmotionalCheckModal.tsx`:**

```typescript
const analyzeVoice = async () => {
  console.log('[EmotionalCheck] 🔍 Starting voice analysis...');
  setRecordingState('analyzing');

  try {
    if (audioChunksRef.current.length === 0) {
      throw new Error('No audio recording available');
    }

    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    console.log('[EmotionalCheck] 📦 Audio blob size:', audioBlob.size, 'bytes');

    // 🔥 НОВОЕ: Конвертируем в base64
    console.log('[EmotionalCheck] 🔄 Converting to base64...');
    const base64Audio = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read as data URL'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(audioBlob);
    });

    console.log('[EmotionalCheck] ✅ Base64 length:', base64Audio.length);

    const apiUrl = `${SUPABASE_URL}/functions/v1/analyze-emotion`;
    console.log('[EmotionalCheck] 📤 Sending as JSON...');

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        audio: base64Audio,
        format: 'base64' 
      }),
    });

    // ... остальное без изменений
  } catch (error) {
    // ... error handling
  }
};
```

**⚠️ Требует изменений в Edge Function:**

```typescript
// supabase/functions/analyze-emotion/index.ts
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const contentType = req.headers.get("content-type") || "";
    let audioBlob: Blob;
    let fileName = "recording.webm";

    // 🔥 НОВОЕ: Поддержка base64 JSON
    if (contentType.includes("application/json")) {
      const body = await req.json();
      
      if (body.audio && body.format === 'base64') {
        console.log("Received base64 audio");
        
        // Извлекаем base64 без data URL prefix
        const base64Data = body.audio.split(',')[1] || body.audio;
        
        // Декодируем base64 → binary
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        audioBlob = new Blob([bytes], { type: 'audio/webm' });
        console.log("Decoded audio blob size:", audioBlob.size);
      } else {
        throw new Error("Invalid JSON body format");
      }
    } else if (contentType.includes("multipart/form-data")) {
      // Старая логика для FormData
      const formData = await req.formData();
      const file = formData.get("audio");
      
      if (!file || !(file instanceof Blob)) {
        throw new Error("No audio file provided");
      }
      
      audioBlob = file;
      
      if (file instanceof File && file.name) {
        fileName = file.name;
      }
    } else {
      audioBlob = await req.blob();
    }

    // ... остальное без изменений
  } catch (error) {
    // ... error handling
  }
});
```

---

### Решение 3: Загружать в Supabase Storage, передавать URL 📦

**Цель:** Использовать стандартный flow через Storage вместо прямой передачи аудио.

**Преимущества:**
- ✅ Надежный способ передачи больших файлов
- ✅ Аудио сохраняется для анализа/отладки
- ✅ Меньше ограничений на размер

**Недостатки:**
- ❌ Требует создания Storage bucket
- ❌ Медленнее (2 запроса вместо 1)
- ❌ Требует cleanup старых файлов

**Изменения в `EmotionalCheckModal.tsx`:**

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);

const analyzeVoice = async () => {
  console.log('[EmotionalCheck] 🔍 Starting voice analysis...');
  setRecordingState('analyzing');

  try {
    if (audioChunksRef.current.length === 0) {
      throw new Error('No audio recording available');
    }

    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    console.log('[EmotionalCheck] 📦 Audio blob size:', audioBlob.size, 'bytes');

    // 1️⃣ Загружаем в Supabase Storage
    console.log('[EmotionalCheck] 📤 Uploading to Storage...');
    const fileName = `emotion-recordings/${Date.now()}-${Math.random().toString(36).substring(7)}.webm`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('audio-recordings')
      .upload(fileName, audioBlob, {
        contentType: 'audio/webm',
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('[EmotionalCheck] ❌ Upload error:', uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    console.log('[EmotionalCheck] ✅ Uploaded:', uploadData.path);

    // 2️⃣ Получаем публичный URL
    const { data: urlData } = supabase.storage
      .from('audio-recordings')
      .getPublicUrl(fileName);

    console.log('[EmotionalCheck] 🔗 Audio URL:', urlData.publicUrl);

    // 3️⃣ Отправляем URL в Edge Function
    const apiUrl = `${SUPABASE_URL}/functions/v1/analyze-emotion`;
    console.log('[EmotionalCheck] 📤 Sending URL to Edge Function...');

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        audioUrl: urlData.publicUrl 
      }),
    });

    // ... остальное без изменений
  } catch (error) {
    // ... error handling
  }
};
```

**⚠️ Требует изменений в Edge Function:**

```typescript
// supabase/functions/analyze-emotion/index.ts
Deno.serve(async (req: Request) => {
  // ...

  try {
    const contentType = req.headers.get("content-type") || "";
    let audioBlob: Blob;
    let fileName = "recording.webm";

    // 🔥 НОВОЕ: Поддержка URL
    if (contentType.includes("application/json")) {
      const body = await req.json();
      
      if (body.audioUrl) {
        console.log("Fetching audio from URL:", body.audioUrl);
        
        const audioResponse = await fetch(body.audioUrl);
        if (!audioResponse.ok) {
          throw new Error(`Failed to fetch audio: ${audioResponse.status}`);
        }
        
        audioBlob = await audioResponse.blob();
        console.log("Downloaded audio blob size:", audioBlob.size);
      } else {
        throw new Error("No audioUrl in request body");
      }
    } else if (contentType.includes("multipart/form-data")) {
      // Старая логика для FormData
      // ...
    }

    // ... остальное без изменений
  } catch (error) {
    // ... error handling
  }
});
```

---

## Текущий статус

- ✅ Blob создается корректно из `audioChunksRef.current`
- ❌ `fetch()` к Edge Function фейлится с "Load failed"
- ✅ Graceful fallback на mock данные работает
- ⏸️ **Проблема отложена для более детальной диагностики**

---

## Следующие шаги (когда вернемся к проблеме)

1. **Добавить детальную диагностику** (Решение 1)
   - Логировать URL, auth key, response status
   - Определить точную причину "Load failed"

2. **Попробовать альтернативный способ отправки:**
   - Если CORS/FormData проблема → Решение 2 (base64 JSON)
   - Если iOS WKWebView блокирует → Решение 3 (Storage + URL)

3. **Проверить Supabase dashboard:**
   - Edge Functions → Logs
   - Есть ли входящие запросы?
   - Какие ошибки на стороне сервера?

4. **Протестировать на разных платформах:**
   - Android (не WKWebView)
   - Браузер Safari на Mac
   - Chrome на iOS (использует WKWebView)

---

## Связанные файлы

- `src/components/EmotionalCheckModal.tsx` (строки 159-254)
- `supabase/functions/analyze-emotion/index.ts`
- Коммит: `041b573` - "Fix EmotionalCheck 'Load failed' error on iOS"

---

## Дополнительные заметки

- Проблема некритична, т.к. есть graceful fallback на mock данные
- Пользователь все равно получает результат (случайная эмоция)
- Реальный API (Hume AI) требует API key в Edge Function
- Mock данные достаточно хороши для тестирования UX
