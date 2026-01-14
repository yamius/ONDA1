# Apple App Review Response Plan

**Дата отклонения:** 12 января 2026  
**Submission ID:** 5400abaf-9cf1-43f9-bfda-26686353c466  
**Review Device:** iPad Pro 11-inch (M4), iPadOS 26.2

---

## 📋 Обзор проблем

Apple отклонила приложение по **3 причинам**:

| Guideline | Описание | Приоритет |
|-----------|----------|-----------|
| **2.2** | Beta Testing - приложение выглядит как тестовая версия | 🟡 Medium |
| **2.1** | App Completeness - ошибка "product not available" при IAP | 🔴 Critical |
| **3.1.2** | Subscriptions - отсутствует ссылка на Terms of Use | 🔴 Critical |

---

## 🔴 Проблема 1: Guideline 2.1 - In-App Purchase не работает

### Что произошло
Apple попытался оформить подписку в sandbox-среде и получил ошибку "product not available".

### Причины (проверить в App Store Connect)

#### ✅ Шаг 1: Paid Apps Agreement
1. Войти в **App Store Connect** → **Business** → **Agreements, Tax, and Banking**
2. Проверить статус **Paid Apps Agreement**
3. Если статус "Action Required" - **ПРИНЯТЬ СОГЛАШЕНИЕ**

#### ✅ Шаг 2: Проверить продукты подписки
1. **App Store Connect** → **My Apps** → **ONDA** → **Subscriptions**
2. Проверить что **оба продукта** настроены:
   - `com.ondalife.premium.yearly` (годовая)
   - `com.ondalife.premium.monthly` (месячная)
3. Каждый продукт должен иметь:
   - ✅ Статус: **Ready to Submit** (или Approved)
   - ✅ Цена настроена для всех регионов
   - ✅ Локализованные названия и описания
   - ✅ Intro Offer (trial) настроен если используется

#### ✅ Шаг 3: Проверить RevenueCat
1. Войти в **RevenueCat Dashboard**
2. Проверить что продукты синхронизированы с App Store Connect
3. Проверить что **Offering** "default" содержит оба пакета

#### ✅ Шаг 4: Тестирование в Sandbox
1. Использовать **Sandbox аккаунт** для тестирования (не обычный Apple ID!)
2. На реальном устройстве открыть подписку
3. Убедиться что цены отображаются и покупка работает

---

## 🔴 Проблема 2: Guideline 3.1.2 - Terms of Use (EULA)

### Что требует Apple
Ссылка на Terms of Use должна быть в **метаданных App Store**.

### Решение

#### Вариант A: Добавить в App Description (рекомендуется)
В **App Store Connect** → **App Information** → **Description**:

Добавить в конец описания:

```
---
Terms of Use: https://yourdomain.com/legal/terms
Privacy Policy: https://yourdomain.com/legal/privacy
```

#### Вариант B: Загрузить Custom EULA
1. App Store Connect → App Information → License Agreement
2. Выбрать "Custom License Agreement"
3. Загрузить текст из `/public/legal/terms-en.md`

### ⚠️ Важно: Нужен публичный URL!
Если у вас нет публичного сайта с Terms/Privacy, можно:
1. Разместить на GitHub Pages
2. Использовать Notion/Google Docs с публичной ссылкой
3. Создать простой landing page

**Текущие файлы Terms/Privacy находятся:**
- `/public/legal/terms-en.md`
- `/public/legal/privacy-en.md`

---

## 🟡 Проблема 3: Guideline 2.2 - Beta Testing

### Что думает Apple
Приложение выглядит как тестовая/бета версия с ограниченным функционалом.

### Возможные причины
1. Есть тестовые страницы (`/audio-test`)
2. Debug элементы видимы
3. UI выглядит незавершённым

### Решение
1. ✅ Тестовая страница AudioTest доступна только по специальному URL - **это нормально**
2. ✅ Debug кнопка закомментирована в production - **это нормально**
3. Убедиться что в UI нет текстов типа "Coming soon", "Test", "Demo"

**Ответ для Apple (если спросят):**
> The app is a complete, production-ready application with full functionality including:
> - 100+ guided audio practices for meditation and breathing
> - Real-time biometric integration (heart rate tracking)
> - Subscription-based premium content
> - Multi-language support (EN, RU, ES, UK, ZH)
> 
> All core features are fully implemented and tested.

---

## 📝 Ответ для Apple в App Store Connect

```
Hello,

Thank you for reviewing our app. We have addressed all the issues:

1. **In-App Purchase (2.1):**
   We have verified our subscription products configuration and ensured the Paid Apps Agreement is active. Both yearly and monthly subscription products are now properly configured and tested in the sandbox environment.

2. **Terms of Use (3.1.2):**
   We have added functional links to our Terms of Use and Privacy Policy in the App Description. The links are:
   - Terms of Use: [YOUR_URL]
   - Privacy Policy: [YOUR_URL]

3. **App Completeness (2.2):**
   ONDA Life is a complete, production-ready meditation and mindfulness application featuring:
   - 100+ guided audio practices
   - Real-time heart rate integration with Apple Watch and HealthKit
   - Personalized practice recommendations
   - Multi-language support
   
   All features are fully functional and tested.

We appreciate your feedback and look forward to the next review.

Best regards,
ONDA Team
```

---

## 📊 Чеклист перед повторной отправкой

- [ ] **Paid Apps Agreement** активен
- [ ] **Subscription products** в статусе "Ready to Submit"
- [ ] **Цены** настроены для всех регионов
- [ ] **Trial periods** настроены (7 дней monthly, 14 дней yearly)
- [ ] **Sandbox тестирование** прошло успешно
- [ ] **Terms of Use URL** добавлен в App Description
- [ ] **Privacy Policy URL** добавлен в App Description
- [ ] **App Description** не содержит слов "beta", "test", "demo"
- [ ] **Screenshots** показывают завершённое приложение

---

## 🔗 Полезные ссылки

- [App Store Review Guidelines 2.1](https://developer.apple.com/app-store/review/guidelines/#performance)
- [App Store Review Guidelines 2.2](https://developer.apple.com/app-store/review/guidelines/#beta-testing)
- [App Store Review Guidelines 3.1.2](https://developer.apple.com/app-store/review/guidelines/#subscriptions)
- [Testing In-App Purchases in Sandbox](https://developer.apple.com/documentation/storekit/in-app_purchase/testing_in-app_purchases_in_xcode/)
- [RevenueCat iOS Setup](https://www.revenuecat.com/docs/ios)
