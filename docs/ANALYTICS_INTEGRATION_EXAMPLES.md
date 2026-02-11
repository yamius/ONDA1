# Analytics Integration Examples

Примеры интеграции Firebase Analytics в существующий код ONDA.

## 📍 Где добавить трекинг

### 1. Авторизация (AuthModal.tsx)

```typescript
import { trackUserRegistration, trackUserLogin, setAnalyticsUserId } from '../services/analytics';

// После успешной регистрации
const handleSignUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  
  if (!error && data.user) {
    // Трекинг регистрации
    await trackUserRegistration('email');
    await setAnalyticsUserId(data.user.id);
  }
};

// После успешного входа
const handleSignIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (!error && data.user) {
    // Трекинг входа
    await trackUserLogin('email');
    await setAnalyticsUserId(data.user.id);
  }
};

// OAuth (Google)
const handleGoogleSignIn = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
  
  if (!error && data.user) {
    await trackUserLogin('google');
    await setAnalyticsUserId(data.user.id);
  }
};
```

### 2. Завершение практики (onda-level1-demo_27.tsx)

```typescript
import { trackPracticeComplete } from './services/analytics';

// В функции завершения практики
const handlePracticeComplete = async () => {
  // Ваш существующий код расчёта OND
  const ondReward = calculateOndReward(duration, stressDelta, energyDelta, completionRate);
  
  // Сохранение в Supabase
  await supabase.from('user_game_progress').update({ ond_balance: newBalance });
  
  // Трекинг завершения практики
  await trackPracticeComplete({
    practiceType: currentPractice, // 'meditation' | 'breathing'
    duration: practiceTimer,
    ondReward,
    stressDelta: finalStress - initialStress,
    energyDelta: finalEnergy - initialEnergy,
    completionRate: (practiceTimer / totalDuration) * 100,
  });
};
```

### 3. Просмотры экранов (модальные окна)

```typescript
import { trackScreenView } from './services/analytics';

// В useEffect при открытии модального окна
useEffect(() => {
  if (isOpen) {
    trackScreenView('settings_modal');
  }
}, [isOpen]);

// Примеры названий экранов:
// - 'home' - Главный экран
// - 'practice_meditation' - Медитация
// - 'practice_breathing' - Дыхание
// - 'settings_modal' - Настройки
// - 'profile_modal' - Профиль
// - 'shop_modal' - Магазин OND
// - 'subscription_modal' - Подписка
// - 'connection_modal' - Подключение устройств
```

### 4. Подключение устройств (ConnectionModal.tsx)

```typescript
import { trackEvent } from '../services/analytics';

// Health Connect
const handleHealthConnectConnect = async () => {
  await window.Android?.requestHealthConnectPermissions();
  
  // Трекинг подключения
  await trackEvent('health_connect_connected', {
    platform: 'android',
  });
};

// Apple Watch
const handleAppleWatchConnect = async () => {
  await startWatchSession();
  
  // Трекинг подключения
  await trackEvent('apple_watch_connected', {
    platform: 'ios',
  });
};

// Bluetooth пульсометр
const handleBluetoothConnect = async (deviceId: string, deviceName: string) => {
  await window.Android?.connectBluetoothDevice(deviceId);
  
  // Трекинг подключения
  await trackEvent('bluetooth_device_connected', {
    device_type: 'heart_rate_monitor',
    device_name: deviceName,
  });
};
```

### 5. Покупка подписки (SubscriptionModal.tsx)

```typescript
import { trackSubscriptionPurchase } from '../services/analytics';

// После успешной покупки
const handlePurchaseSuccess = async (productId: string, price: number, currency: string) => {
  // Ваш существующий код обработки покупки
  
  // Трекинг покупки
  await trackSubscriptionPurchase({
    productId,
    price,
    currency,
  });
};

// Пример:
await handlePurchaseSuccess('onda_premium_monthly', 9.99, 'USD');
```

### 6. Магазин OND (OndShopModal.tsx)

```typescript
import { trackEvent } from '../services/analytics';

// Просмотр товара
const handleItemView = async (itemId: string, itemName: string, price: number) => {
  await trackEvent('shop_item_view', {
    item_id: itemId,
    item_name: itemName,
    price,
  });
};

// Покупка товара за OND
const handleItemPurchase = async (itemId: string, itemName: string, price: number) => {
  // Ваш существующий код покупки
  
  // Трекинг покупки
  await trackEvent('shop_item_purchase', {
    item_id: itemId,
    item_name: itemName,
    price,
    currency: 'OND',
  });
};
```

### 7. Чат с Liza (LizaChatModal.tsx)

```typescript
import { trackEvent } from '../services/analytics';

// Открытие чата
useEffect(() => {
  if (isOpen) {
    trackEvent('liza_chat_opened');
  }
}, [isOpen]);

// Отправка сообщения
const handleSendMessage = async (message: string) => {
  // Ваш существующий код отправки
  
  // Трекинг сообщения
  await trackEvent('liza_message_sent', {
    message_length: message.length,
  });
};

// Получение ответа
const handleReceiveResponse = async (response: string) => {
  await trackEvent('liza_response_received', {
    response_length: response.length,
  });
};
```

### 8. Эмоциональная проверка (EmotionalCheckModal.tsx)

```typescript
import { trackEvent } from '../services/analytics';

// Начало записи голоса
const handleStartRecording = async () => {
  await trackEvent('emotional_check_started');
};

// Завершение анализа
const handleAnalysisComplete = async (emotion: string, confidence: number) => {
  await trackEvent('emotional_check_completed', {
    detected_emotion: emotion,
    confidence_score: confidence,
  });
};
```

### 9. Изменение настроек (SettingsModal.tsx)

```typescript
import { trackEvent, setUserProperty } from '../services/analytics';

// Смена языка
const handleLanguageChange = async (newLanguage: string) => {
  // Ваш существующий код смены языка
  
  // Трекинг и установка user property
  await trackEvent('language_changed', { new_language: newLanguage });
  await setUserProperty('preferred_language', newLanguage);
};

// Смена темы
const handleThemeChange = async (newTheme: 'light' | 'dark') => {
  await trackEvent('theme_changed', { new_theme: newTheme });
  await setUserProperty('preferred_theme', newTheme);
};
```

### 10. Deep Links и атрибуция

```typescript
import { trackAttribution, parseUTMParams } from './services/analytics';
import { App } from '@capacitor/app';

// В main.tsx или App.tsx
useEffect(() => {
  // Слушаем deep links
  App.addListener('appUrlOpen', async (event) => {
    const url = event.url;
    console.log('[DeepLink] Opened:', url);
    
    // Парсим UTM параметры
    const utmParams = parseUTMParams(url);
    
    if (utmParams) {
      // Сохраняем атрибуцию
      await trackAttribution(utmParams);
      console.log('[Attribution] Tracked:', utmParams);
    }
  });
  
  return () => {
    App.removeAllListeners();
  };
}, []);

// Примеры deep links:
// myapp://open?utm_source=facebook&utm_campaign=spring2024
// myapp://open?utm_source=google&utm_medium=cpc&utm_campaign=meditation_app
// myapp://open?utm_source=instagram&utm_content=story_ad
```

## 🎯 Рекомендуемые события для трекинга

### Критические конверсии (обязательно)
1. ✅ `sign_up` - Регистрация
2. ✅ `login` - Вход
3. ✅ `practice_complete` - Завершение практики
4. ✅ `purchase` - Покупка подписки

### Важные события (рекомендуется)
5. `screen_view` - Просмотр экранов
6. `health_connect_connected` - Подключение Health Connect
7. `apple_watch_connected` - Подключение Apple Watch
8. `bluetooth_device_connected` - Подключение Bluetooth устройства
9. `shop_item_purchase` - Покупка в магазине OND
10. `emotional_check_completed` - Завершение эмоциональной проверки

### Дополнительные события (опционально)
11. `liza_chat_opened` - Открытие чата с Liza
12. `language_changed` - Смена языка
13. `theme_changed` - Смена темы
14. `tutorial_completed` - Завершение обучения
15. `share_app` - Поделиться приложением

## 📊 User Properties (для сегментации)

```typescript
import { setUserProperty } from './services/analytics';

// После авторизации или изменения настроек
await setUserProperty('preferred_language', 'ru');
await setUserProperty('preferred_theme', 'dark');
await setUserProperty('subscription_status', 'premium');
await setUserProperty('total_practices', '50');
await setUserProperty('favorite_practice', 'meditation');
await setUserProperty('device_type', 'apple_watch');
```

## 🔍 Отладка

### Проверка событий в консоли

```typescript
// Добавьте в analytics.ts для отладки
console.log('[Analytics] Event tracked:', {
  eventName,
  eventParams,
  platform,
  timestamp,
});
```

### Проверка в Firebase DebugView

**Android:**
```bash
adb shell setprop debug.firebase.analytics.app com.onda.app
```

**iOS:**
В Xcode добавьте launch argument: `-FIRDebugEnabled`

Затем откройте **Firebase Console → Analytics → DebugView**.

## ✅ Чеклист интеграции

- [ ] Авторизация (sign_up, login)
- [ ] Завершение практики (practice_complete)
- [ ] Просмотры экранов (screen_view)
- [ ] Подключение устройств (health_connect_connected, apple_watch_connected)
- [ ] Покупка подписки (purchase)
- [ ] Магазин OND (shop_item_purchase)
- [ ] Эмоциональная проверка (emotional_check_completed)
- [ ] Настройки (language_changed, theme_changed)
- [ ] Deep Links (attribution tracking)
- [ ] User Properties (preferred_language, subscription_status)

---

**Готово!** Теперь все ключевые действия пользователей отслеживаются в Firebase Analytics.
