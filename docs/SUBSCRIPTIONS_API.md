# API Подписок Economikus

## Обзор

API для управления подписками пользователей платформы Economikus. Включает функционал оформления подписок, управления методами оплаты и просмотра истории транзакций.

## Теги API

- **Subscriptions** - Подписки
- **Payment Methods** - Методы оплаты
- **Transactions** - Транзакции

## Эндпоинты

### Подписки

#### GET /api/user/subscriptions
Получение списка подписок пользователя

**Параметры запроса:**
- `page` - номер страницы (по умолчанию 1)
- `limit` - количество элементов на странице (по умолчанию 20, максимум 50)

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
      "trialEndsAt": "2026-01-15T00:00:00Z",
      "autoRenew": true,
      "price": 299.00,
      "currency": "RUB",
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

#### POST /api/user/subscriptions
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
  },
  "transaction": {
    "id": "uuid",
    "type": "SUBSCRIPTION_PAYMENT",
    "amount": 299.00,
    "currency": "RUB",
    "status": "COMPLETED",
    "createdAt": "2026-01-01T00:00:00Z"
  }
}
```

#### DELETE /api/user/subscriptions/:id
Отмена подписки

**Ответ:**
```json
{
  "message": "Подписка отменена"
}
```

### Методы оплаты

#### GET /api/user/payment-methods
Получение списка методов оплаты пользователя

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
      "expiryMonth": 12,
      "expiryYear": 2027,
      "isDefault": true,
      "isVerified": true
    }
  ]
}
```

#### POST /api/user/payment-methods
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

#### DELETE /api/user/payment-methods/:id
Удаление метода оплаты

**Ответ:**
```json
{
  "message": "Метод оплаты удален"
}
```

### Транзакции

#### GET /api/user/transactions
Получение истории транзакций пользователя

**Параметры запроса:**
- `page` - номер страницы (по умолчанию 1)
- `limit` - количество элементов на странице (по умолчанию 20, максимум 50)
- `status` - фильтр по статусу

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

### Админ-панель

#### GET /api/admin/subscriptions
Получение списка всех подписок (для админов)

**Параметры запроса:**
- `page` - номер страницы (по умолчанию 1)
- `limit` - количество элементов на странице (по умолчанию 20, максимум 50)
- `status` - фильтр по статусу
- `profileId` - фильтр по пользователю

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
      "currency": "RUB",
      "createdAt": "2026-01-01T00:00:00Z",
      "profile": {
        "id": "uuid",
        "nickname": "testuser",
        "displayName": "Тестовый пользователь"
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

#### PATCH /api/admin/subscriptions/:id
Изменение статуса подписки (для админов)

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

#### GET /api/admin/transactions
Получение списка всех транзакций (для админов)

**Параметры запроса:**
- `page` - номер страницы (по умолчанию 1)
- `limit` - количество элементов на странице (по умолчанию 20, максимум 50)
- `status` - фильтр по статусу

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
      "createdAt": "2026-01-01T00:00:00Z",
      "profile": {
        "id": "uuid",
        "nickname": "testuser",
        "displayName": "Тестовый пользователь"
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

## Статусы

### SubscriptionStatus
- `ACTIVE` - активна
- `PAST_DUE` - просрочена
- `CANCELED` - отменена
- `EXPIRED` - истекла

### TransactionStatus
- `PENDING` - ожидание
- `COMPLETED` - завершена
- `FAILED` - неудача
- `REFUNDED` - возвращена

## Ошибки

Все ошибки возвращаются в формате:
```json
{
  "error": "Сообщение об ошибке",
  "code": 400
}
```

### Общие ошибки:
- `400` - Неверные параметры запроса
- `401` - Неавторизованный доступ
- `403` - Доступ запрещен
- `404` - Ресурс не найден
- `500` - Внутренняя ошибка сервера