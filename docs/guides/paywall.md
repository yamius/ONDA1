# Paywall Implementation & Roadmap

История изменений и план развития пэйволла в ONDA.

См. также: [In-App Purchase](./in-app-purchase.md) — низкоуровневая интеграция RevenueCat/Supabase.

---

## Статус

**Текущая итерация:** Iteration 1 — пэйволл на «Начать практику» для iOS-фри-юзеров. Реализовано (коммит `002e6e9`, 2026-04-18).

---

## Обзор архитектуры (что было до итерации 1)

Три слоя:

1. **Native** — `src/services/RevenueCatService.ts` (синглтон-обёртка над `@revenuecat/purchases-capacitor`, entitlement `ONDA Premium`, iOS-ключ настроен, Android-ключ — заглушка).
2. **React hook** — `src/hooks/useSubscription.ts` (состояние `isPremium`, `offerings`, `customerInfo`; действия `purchase / restore / refresh`; auto-login в RC при Supabase `SIGNED_IN`).
3. **UI** — `src/components/SubscriptionModal.tsx` (Yearly/Monthly планы, triggers intro-price/триалы из RC, автозакрытие при `isPremium`).

**Бэкенд:**
- `supabase/functions/revenuecat-webhook/index.ts` — апсертит подписки в таблицу `user_subscriptions`, игнорирует анонимные RC-id (`$RCAnonymousID:*`).
- `supabase/migrations/20260110160000_create_user_subscriptions.sql` — схема `user_subscriptions` + SQL-функция `is_user_subscribed(user_id)`.

**До итерации 1** единственной точкой входа в пэйволл была плавающая кнопка `DollarSign` в верхнем правом углу (`src/onda-level1-demo_27.tsx:4397`). Фактически пэйволл работал как витрина: купить можно было, но гейтинга контента не было — `isPremium` не проверялся нигде, кроме самой модалки.

---

## Iteration 1 — Пэйволл на «Начать практику» (DONE)

### Цель

Перехватывать клик на «Начать практику» (финальная кнопка на intro-экранах базовых и адаптивных практик). Для фри-юзеров на iOS показывать `SubscriptionModal` вместо запуска практики. Включать аналитику и требовать логин перед покупкой.

### Зафиксированные решения

| # | Решение | Выбор |
|---|---|---|
| 1 | Где гейтим | Финальная кнопка «Начать» на intro-экранах (2 места). Карточка практики в списке не гейтится — intro остаётся доступным. |
| 2 | Кому показываем | Только фри-юзерам (`isPremium === false`). |
| 3 | Какие практики | Все базовые и все адаптивные. |
| 4 | Обработка `isLoading` | **Fail-open** — пока статус подписки грузится, разрешаем практику. |
| 5 | Платформы | Гейтим только `platform === 'ios'`. На web и Android (dev/test) пэйволл не срабатывает. |
| 6 | Неавторизованные | **Вариант B** — практики без логина; при попытке покупки в пэйволле → `AuthModal`; после логина юзер повторно жмёт «Try Free». |
| 7 | Аналитика | Событие `paywall_viewed` при каждом показе + полный funnel на покупку. |

### Точки перехвата (что изменено)

#### 1. Базовая практика — `src/onda-level1-demo_27.tsx`

Intro-экран, кнопка «Начать практику» (~строка 3534).

**Добавлен импорт:**
```ts
import { useSubscription } from './hooks/useSubscription';
```

**Добавлены хуки в компоненте:**
```ts
const { isPremium, isLoading: isSubLoading } = useSubscription();
// platform и track/trackPractice уже существовали в файле
```

**Guard-обёртка вокруг `beginPractice`:**
```tsx
onClick={() => {
  if (isPremium || isSubLoading || platform !== 'ios') {
    beginPractice();
    return;
  }
  track('paywall_viewed', {
    source: 'practice_intro',
    practice_id: activePractice?.id,
    practice_type: 'basic',
  });
  setShowSubscriptionModal(true);
}}
```

`SubscriptionModal` и `showSubscriptionModal` state уже были в файле — ничего добавлять не понадобилось.

#### 2. Адаптивная практика — `src/components/AdaptivePracticeModal.tsx`

Intro-экран, кнопка «Начать практику» (~строка 1031).

**Добавлены импорты:**
```ts
import { Capacitor } from '@capacitor/core';
import { SubscriptionModal } from './SubscriptionModal';
import { useSubscription } from '../hooks/useSubscription';
import { useAnalytics } from '../hooks/useAnalytics';
```

**Добавлены хуки и state:**
```ts
const { isPremium, isLoading: isSubLoading } = useSubscription();
const { track } = useAnalytics();
const platform = Capacitor.getPlatform();
const [showPaywall, setShowPaywall] = useState(false);
```

**Guard-обёртка вокруг `startPractice`:**
```tsx
onClick={() => {
  if (isPremium || isSubLoading || platform !== 'ios') {
    startPractice();
    return;
  }
  track('paywall_viewed', {
    source: 'practice_intro',
    practice_id: practice.id,
    practice_type: 'adaptive',
  });
  setShowPaywall(true);
}}
```

**Рендер пэйволла в конце JSX:**
```tsx
<SubscriptionModal
  isOpen={showPaywall}
  onClose={() => setShowPaywall(false)}
/>
```

Z-index: `SubscriptionModal` = `z-[200]`, `AdaptivePracticeModal` = `z-50` — перекрытие корректное.

#### 3. Login-gate на покупке — `src/components/SubscriptionModal.tsx`

**Добавлены импорты:**
```ts
import { useAnalytics } from '../hooks/useAnalytics';
import { supabase } from '../lib/supabase';
import { AuthModal } from './AuthModal';
```

**Добавлены хук и state:**
```ts
const { track } = useAnalytics();
const [showAuthModal, setShowAuthModal] = useState(false);
```

**Переписан `handlePurchase`:**
```ts
const handlePurchase = async () => {
  setPurchaseError(null);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    track('paywall_auth_required', { plan: selectedPlan });
    setShowAuthModal(true);
    return;
  }

  const pkg = selectedPlan === 'yearly' ? yearlyPackage : monthlyPackage;
  if (!pkg) {
    setPurchaseError(t('subscription.error_no_product', 'Product not available'));
    return;
  }

  track('purchase_started', {
    plan: selectedPlan,
    product_id: pkg.product.identifier,
    price: pkg.product.price,
    currency: pkg.product.currencyCode,
  });

  try {
    const success = await purchase(pkg);
    if (success) {
      track('purchase_succeeded', { plan: selectedPlan, product_id: pkg.product.identifier });
      onClose();
    } else {
      track('purchase_cancelled', { plan: selectedPlan });
    }
  } catch (err: any) {
    track('purchase_failed', { plan: selectedPlan, error: err?.message ?? 'unknown' });
    setPurchaseError(err.message || t('subscription.error_purchase', 'Purchase failed'));
  }
};
```

**Рендер `AuthModal` внутри модалки:**
```tsx
{showAuthModal && (
  <AuthModal
    onClose={() => setShowAuthModal(false)}
    isLightTheme={false}
  />
)}
```

После успешного логина `AuthModal` сам вызывает `onClose()`. Юзер возвращается на пэйволл и повторно жмёт «Try Free» — теперь с аккаунтом.

После логина хук `useSubscription` автоматически делает `revenueCatService.login(session.user.id)` (через `onAuthStateChange` listener), и webhook привязывает подписку к Supabase user_id.

#### 4. Расширен тип событий — `src/services/AnalyticsService.ts`

Добавлена секция Paywall/Monetization в `AnalyticsEventName`:

```ts
// Paywall / Monetization
| 'paywall_viewed'
| 'paywall_auth_required'
| 'purchase_started'
| 'purchase_succeeded'
| 'purchase_failed'
| 'purchase_cancelled'
```

### Поведенческая матрица

| Ситуация | «Начать практику» | Кнопка `$` |
|---|---|---|
| iOS, премиум | Практика стартует | Пэйволл открывается и автозакрывается (isPremium) |
| iOS, фри, залогинен | Пэйволл → Try Free → покупка | Пэйволл → Try Free → покупка |
| iOS, фри, не залогинен | Пэйволл → `AuthModal` → логин → повторно Try Free → покупка | То же самое |
| iOS, `isLoading` (первые секунды) | Fail-open: практика стартует | Пэйволл открывается |
| Android (тесты на устройстве) | Практика стартует | Пэйволл открывается (UI-демо, покупка не работает — ключ заглушка) |
| Web (разработка) | Практика стартует | Пэйволл открывается (RevenueCat не инициализируется) |

### События аналитики — funnel

1. `paywall_viewed` — `{ source, practice_id, practice_type }`
2. `paywall_auth_required` — `{ plan }` (фри-юзер без логина тыкнул на Try Free)
3. `purchase_started` — `{ plan, product_id, price, currency }`
4. `purchase_succeeded` — `{ plan, product_id }`
5. `purchase_cancelled` — `{ plan }` (юзер отменил в системной модалке Apple)
6. `purchase_failed` — `{ plan, error }`

### Тестирование (TestFlight checklist)

1. **Премиум Sandbox-тестер** — «Начать практику» → практика стартует, пэйволл не открывается.
2. **Фри-залогинен** — «Начать практику» → пэйволл → «Try Free» → App Store Sandbox → покупка.
3. **Фри-НЕ-залогинен** (ключевой новый сценарий) — «Начать практику» → пэйволл → «Try Free» → `AuthModal` → регистрация → `AuthModal` закрывается → «Try Free» ещё раз → покупка.
4. **Аналитика** — проверить в Supabase (таблица `app_events`) или Firebase, что приходят события из funnel выше.
5. **Кнопка `$`** — работает как раньше, логин требуется только на покупке.

### Git-история итерации

- `002e6e9` — Gate practice start with paywall for iOS free users
- `240b83d` — Bump MARKETING_VERSION to 1.0.1 for TestFlight (Apple закрыл train 1.0)

---

## Roadmap — что намечено, но не сделано

Выявлено на этапе первичного аудита пэйволла (см. чат-анализ 2026-04-18). Каждый пункт — отдельная итерация.

### Iteration 2 — Локализация цен и дисклеймеров (HIGH PRIORITY)

**Проблема.** В `SubscriptionModal.tsx` цены и дисклеймеры захардкожены в USD:
- fallback `$64.99` / `$14.99` / `5.42 USD/mo.` (стр. 104–109)
- дисклеймер `subscription.disclaimer_yearly` / `subscription.disclaimer_monthly` в `public/locales/*/translation.json` — тоже USD

Если RC не успел подгрузить офферинги или у юзера другая валюта, он видит USD-суммы, не совпадающие с реальным чарджем стора. **Риск для App Store Review.**

**Что нужно:**
- Убрать USD-fallback цен — показывать спиннер, пока офферинги грузятся.
- Дисклеймер построить из реальных значений RC (`pkg.product.priceString`, `introPrice.period`, вычисленная per-month цена) через i18n-шаблон с плейсхолдерами `{{price}}`, `{{currency}}`, `{{trialDays}}`.

### Iteration 3 — Безопасность webhook (HIGH PRIORITY, SECURITY)

**Проблемы в `supabase/functions/revenuecat-webhook/index.ts`:**
- Нет верификации `Authorization`-заголовка с RC shared secret → любой может вызвать функцию и апсертить произвольные статусы подписок.
- Нет дедупликации по `event.id` → при ретраях RC возможны гонки/дубли.

**Что нужно:**
- Проверять `req.headers.get('Authorization')` против `Deno.env.get('REVENUECAT_WEBHOOK_SECRET')`.
- Хранить `event.id` в таблице `processed_webhook_events` и skip'ать дубли.

### Iteration 4 — Дополнительная аналитика и UX

- `paywall_dismissed` — отслеживать, где юзер закрыл пэйволл без покупки (crossclick / background / обратная навигация).
- `paywall_plan_selected` — когда юзер переключает yearly/monthly перед покупкой.
- `restore_started / succeeded / empty / failed` — аналогичный funnel для «Restore Purchases».
- Скрывать кнопку `$` при `isPremium` — сейчас она открывается и тут же автозакрывается, что выглядит странно.

### Iteration 5 — Android production readiness

Когда будем запускать Google Play:
- Заменить заглушку `REVENUECAT_ANDROID_API_KEY` на реальный ключ в `src/services/RevenueCatService.ts:6`.
- Настроить продукты в Google Play Console, проверить офферинги в RC.
- Убрать исключение `platform !== 'ios'` в guard-обёртках (или оставить, но добавить `platform === 'android'` в условия гейтинга отдельно через feature-flag).
- Протестировать весь funnel в Google Play Sandbox.

### Iteration 6 — Очистка мёртвых пропсов и мелкий UX

- Проп `activeCircuit` в `SubscriptionModalProps` не используется внутри — удалить или использовать для темы/атрибуции.
- Добавить passive-analytics screen view `paywall_screen` при `isOpen === true` (кроме уже трекаемого `paywall_viewed` с триггера).

### Iteration 7 — Альтернативные гейтинг-модели (OPEN QUESTION)

Текущая модель — **Hard gate** (все практики гейтятся). Альтернативы на будущее, если conversion rate окажется низким:
- **Freemium:** Circuit 1 бесплатно, Circuits 2–12 премиум.
- **Daily limit:** 3 бесплатные практики в день, дальше пэйволл.
- **Soft trial:** всё бесплатно N дней после регистрации, потом пэйволл.
- **Onboarding push:** автопоказ пэйволла после первой завершённой практики.

Решение о переключении модели — после сбора метрик из Iteration 1 (условно 2–4 недели production-данных).

---

## Приложение — знаний о текущей структуре

### Ключевые файлы

| Слой | Файл | Назначение |
|---|---|---|
| Native wrapper | `src/services/RevenueCatService.ts` | RC SDK, entitlement `ONDA Premium` |
| React hook | `src/hooks/useSubscription.ts` | `isPremium`, `purchase`, `restore` |
| UI | `src/components/SubscriptionModal.tsx` | Пэйволл-модалка |
| Gate #1 | `src/onda-level1-demo_27.tsx` (~3534) | Intro базовых практик |
| Gate #2 | `src/components/AdaptivePracticeModal.tsx` (~1031) | Intro адаптивных практик |
| Gate #3 (старый) | `src/onda-level1-demo_27.tsx` (~4397) | Плавающая кнопка `$` |
| Analytics | `src/services/AnalyticsService.ts` | Типы событий + track API |
| DB | `supabase/migrations/20260110160000_create_user_subscriptions.sql` | Таблица подписок |
| Webhook | `supabase/functions/revenuecat-webhook/index.ts` | RC → Supabase sync |
| Auth | `src/components/AuthModal.tsx` | Login/signup (используется из пэйволла) |

### Entitlement и продукты

- **Entitlement ID:** `ONDA Premium` (в `src/services/RevenueCatService.ts:9` и таблице)
- **Bundle ID:** `com.onda-life.ios`
- **Продукты** (см. `docs/guides/in-app-purchase.md`):
  - Yearly: `com.onda.yearly` — 14-day trial
  - Monthly: `com.onda.monthly` — 7-day trial
- **RC Offering:** `default`
