# План реализации системы подписок

## 1. Обзор системы подписок

Система подписок предназначена для предоставления пользователям доступа к премиум-контенту платформы Economikus. Система будет поддерживать различные типы подписок и предоставлять пользователям возможность управлять своими подписками.

## 2. Архитектура системы

### 2.1 Модели данных

#### Subscription (Подписка)
- id: UUID - уникальный идентификатор
- profileId: UUID - ссылка на профиль пользователя
- planType: String - тип подписки (например: "premium_monthly", "premium_annual")
- status: SubscriptionStatus - статус подписки (ACTIVE, PAST_DUE, CANCELED, EXPIRED)
- startDate: DateTime - дата начала подписки
- endDate: DateTime? - дата окончания подписки
- trialEndsAt: DateTime? - дата окончания пробного периода
- autoRenew: Boolean - автоматическое продление
- cancelAtPeriodEnd: Boolean - отмена в конце периода
- price: Float - цена подписки
- currency: String - валюта (по умолчанию "RUB")
- paymentMethodId: UUID? - метод оплаты
- providerSubscriptionId: String? - ID подписки у провайдера
- provider: String? - провайдер оплаты
- createdAt: DateTime - дата создания
- updatedAt: DateTime - дата обновления
- canceledAt: DateTime? - дата отмены
- deletedAt: DateTime? - дата удаления

#### Transaction (Транзакция)
- id: UUID - уникальный идентификатор
- profileId: UUID - ссылка на профиль пользователя
- subscriptionId: UUID? - ссылка на подписку
- type: String - тип транзакции (SUBSCRIPTION_PAYMENT, REFUND)
- amount: Float - сумма
- currency: String - валюта (по умолчанию "RUB")
- status: TransactionStatus - статус транзакции (PENDING, COMPLETED, FAILED, REFUNDED)
- courseId: UUID? - ссылка на курс (если применимо)
- paymentMethodId: UUID? - метод оплаты
- provider: String - провайдер оплаты
- providerPaymentId: String? - ID платежа у провайдера
- providerResponse: Json? - ответ провайдера
- refundedAt: DateTime? - дата возврата
- refundAmount: Float? - сумма возврата
- refundReason: String? - причина возврата
- createdAt: DateTime - дата создания
- updatedAt: DateTime - дата обновления
- completedAt: DateTime? - дата завершения
- failedAt: DateTime? - дата неудачного платежа

#### PaymentMethod (Метод оплаты)
- id: UUID - уникальный идентификатор
- profileId: UUID - ссылка на профиль пользователя
- type: String - тип метода оплаты (CARD, PAYPAL, YOOMONEY)
- provider: String - провайдер оплаты
- providerToken: String - токен у провайдера
- last4: String? - последние 4 цифры карты
- cardType: String? - тип карты
- expiryMonth: Int? - месяц истечения
- expiryYear: Int? - год истечения
- phoneNumber: String? - номер телефона
- isDefault: Boolean - по умолчанию
- isVerified: Boolean - верифицирован
- isExpired: Boolean - истек
- metadata: Json? - дополнительные данные
- createdAt: DateTime - дата создания
- updatedAt: DateTime - дата обновления
- deletedAt: DateTime? - дата удаления

### 2.2 Статусы

#### SubscriptionStatus
- ACTIVE - активна
- PAST_DUE - просрочена
- CANCELED - отменена
- EXPIRED - истекла

#### TransactionStatus
- PENDING - ожидание
- COMPLETED - завершена
- FAILED - неудача
- REFUNDED - возвращена

## 3. API эндпоинты

### 3.1 Подписки (User)

#### GET /user/subscriptions
Получение списка подписок пользователя

**Параметры запроса:**
- page: Number - номер страницы (по умолчанию 1)
- limit: Number - количество элементов на странице (по умолчанию 20, максимум 50)

**Ответ:**
```json
{
  "items": [
    {
      "id": "uuid",
      "planType": "premium_monthly",
      "status": "ACTIVE",
      "startDate": "2026-01-01T00:00:00Z",
      "endDate": "2026-02-01T00:00:00Z",
      "price": 299.00,
      "currency": "RUB",
      "autoRenew": true,
      "paymentMethod": {
        "id": "uuid",
        "type": "CARD",
        "last4": "1234",
        "cardType": "VISA"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

#### POST /user/subscriptions
Оформление новой подписки

**Тело запроса:**
```json
{
  "planType": "premium_monthly",
  "paymentMethodId": "uuid",
  "autoRenew": true
}
```

**Ответ:**
```json
{
  "message": "Подписка оформлена",
  "subscription": {
    "id": "uuid",
    "planType": "premium_monthly",
    "status": "ACTIVE",
    "startDate": "2026-01-01T00:00:00Z",
    "endDate": "2026-02-01T00:00:00Z",
    "price": 299.00,
    "currency": "RUB",
    "autoRenew": true
  }
}
```

#### DELETE /user/subscriptions/:id
Отмена подписки

**Ответ:**
```json
{
  "message": "Подписка отменена"
}
```

### 3.2 Платежные методы (User)

#### GET /user/payment-methods
Получение списка методов оплаты

**Ответ:**
```json
{
  "items": [
    {
      "id": "uuid",
      "type": "CARD",
      "provider": "stripe",
      "last4": "1234",
      "cardType": "VISA",
      "isDefault": true,
      "isVerified": true,
      "expiryMonth": 12,
      "expiryYear": 2027
    }
  ]
}
```

#### POST /user/payment-methods
Добавление нового метода оплаты

**Тело запроса:**
```json
{
  "type": "CARD",
  "provider": "stripe",
  "providerToken": "tok_visa_1234"
}
```

**Ответ:**
```json
{
  "message": "Метод оплаты добавлен",
  "paymentMethod": {
    "id": "uuid",
    "type": "CARD",
    "last4": "1234",
    "cardType": "VISA",
    "isDefault": false,
    "isVerified": true
  }
}
```

#### DELETE /user/payment-methods/:id
Удаление метода оплаты

**Ответ:**
```json
{
  "message": "Метод оплаты удален"
}
```

### 3.3 Транзакции (User)

#### GET /user/transactions
Получение истории транзакций

**Параметры запроса:**
- page: Number - номер страницы (по умолчанию 1)
- limit: Number - количество элементов на странице (по умолчанию 20, максимум 50)
- status: String - фильтр по статусу

**Ответ:**
```json
{
  "items": [
    {
      "id": "uuid",
      "type": "SUBSCRIPTION_PAYMENT",
      "amount": 299.00,
      "currency": "RUB",
      "status": "COMPLETED",
      "createdAt": "2026-01-01T00:00:00Z",
      "subscription": {
        "id": "uuid",
        "planType": "premium_monthly"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

### 3.4 Админ-панель

#### GET /admin/subscriptions
Получение списка всех подписок

**Параметры запроса:**
- page: Number - номер страницы (по умолчанию 1)
- limit: Number - количество элементов на странице (по умолчанию 20, максимум 50)
- status: String - фильтр по статусу
- profileId: String - фильтр по пользователю

**Ответ:**
```json
{
  "items": [
    {
      "id": "uuid",
      "profileId": "uuid",
      "planType": "premium_monthly",
      "status": "ACTIVE",
      "startDate": "2026-01-01T00:00:00Z",
      "endDate": "2026-02-01T00:00:00Z",
      "price": 299.00,
      "currency": "RUB"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

#### PATCH /admin/subscriptions/:id
Изменение статуса подписки

**Тело запроса:**
```json
{
  "status": "CANCELED"
}
```

**Ответ:**
```json
{
  "message": "Статус подписки обновлен",
  "subscription": {
    "id": "uuid",
    "status": "CANCELED"
  }
}
```

#### GET /admin/transactions
Получение списка всех транзакций

**Параметры запроса:**
- page: Number - номер страницы (по умолчанию 1)
- limit: Number - количество элементов на странице (по умолчанию 20, максимум 50)
- status: String - фильтр по статусу

**Ответ:**
```json
{
  "items": [
    {
      "id": "uuid",
      "profileId": "uuid",
      "type": "SUBSCRIPTION_PAYMENT",
      "amount": 299.00,
      "currency": "RUB",
      "status": "COMPLETED",
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

## 4. Фронтенд компоненты

### 4.1 Хуки

#### useUserSubscriptions
- `useUserSubscriptions()` - получение списка подписок
- `useCreateSubscription()` - оформление подписки
- `useCancelSubscription()` - отмена подписки

#### useUserPaymentMethods
- `useUserPaymentMethods()` - получение списка методов оплаты
- `useAddPaymentMethod()` - добавление метода оплаты
- `useDeletePaymentMethod()` - удаление метода оплаты

#### useUserTransactions
- `useUserTransactions()` - получение истории транзакций

### 4.2 Компоненты

#### SubscriptionCard
Карточка подписки с информацией о статусе, дате окончания и возможностью отмены.

#### SubscriptionsTab
Вкладка профиля для отображения подписок пользователя.

#### PaymentMethodCard
Карточка метода оплаты с информацией о типе, дате истечения и статусе.

#### PaymentMethodsTab
Вкладка профиля для управления методами оплаты.

#### TransactionCard
Карточка транзакции с информацией о сумме, статусе и дате.

#### TransactionsTab
Вкладка профиля для отображения истории транзакций.

## 5. Безопасность

### 5.1 Аутентификация
- Все эндпоинты подписок требуют аутентификации
- Доступ к данным подписок ограничен для владельца
- Админ-панель требует роли ADMIN

### 5.2 Защита данных
- Платежные данные шифруются
- Токены провайдеров не передаются клиенту
- Все операции логируются

### 5.3 Валидация
- Все входящие данные валидируются
- Проверка прав доступа на уровне сервера
- Ограничение на количество запросов

## 6. Тестирование

### 6.1 Unit-тесты
- Тесты для хуков
- Тесты для API контроллеров
- Тесты для бизнес-логики

### 6.2 Integration-тесты
- Тесты взаимодействия между компонентами
- Тесты API эндпоинтов
- Тесты безопасности

### 6.3 E2E-тесты
- Тесты полного цикла оформления подписки
- Тесты управления методами оплаты
- Тесты отмены подписки

## 7. Документация

### 7.1 Техническая документация
- Описание архитектуры системы
- Спецификация API
- Описание моделей данных

### 7.2 Пользовательская документация
- Руководство пользователя по подпискам
- FAQ по системе подписок

### 7.3 Документация для разработчиков
- Инструкции по развертыванию
- Руководства по тестированию
- Руководства по отладке

## 8. План реализации

### Этап 1: Подготовка (1 день)
- Анализ требований
- Создание технической документации
- Подготовка тестового окружения

### Этап 2: Backend (3 дня)
- Реализация моделей данных
- Реализация API эндпоинтов
- Реализация бизнес-логики
- Тестирование API

### Этап 3: Frontend (4 дня)
- Создание хуков
- Создание компонентов
- Интеграция с профилем
- Тестирование компонентов

### Этап 4: Админ-панель (2 дня)
- Реализация разделов в админ-панели
- Добавление фильтрации и поиска
- Тестирование

### Этап 5: Тестирование и документация (2 дня)
- Проведение тестирования
- Обновление документации
- Финальная проверка

## 9. Критерии готовности

1. Все API эндпоинты реализованы и протестированы
2. Пользователи могут оформлять подписки
3. Пользователи могут управлять методами оплаты
4. Пользователи могут видеть историю транзакций
5. Администраторы могут управлять подписками
6. Все компоненты корректно отображаются для разных ролей
7. Документация обновлена
8. Все тесты проходят успешно

## 10. Риски и ограничения

1. **Сложности с безопасностью** - необходимо тщательно проверить все операции с платежами
2. **Производительность** - при большом количестве подписок нужно оптимизировать запросы
3. **Совместимость** - необходимо проверить совместимость с существующими компонентами
4. **Тестирование** - сложность тестирования платежных операций без реальных платежей
5. **Сложность интеграции с платежными системами** - требует специфических знаний

## 11. Альтернативные решения

1. **Тестовые платежи** - использование тестовых систем оплаты
2. **Имитация платежей** - создание фейковых транзакций для тестирования
3. **Модульное тестирование** - использование mock-объектов для тестирования API
4. **Постепенная реализация** - начать с базового функционала и постепенно добавлять расширенные возможности