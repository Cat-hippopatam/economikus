# Функционал платформы Экономикус

> Подробное описание основных модулей системы

---

## Содержание

1. [Панель автора](#1-панель-автора)
2. [Контент уроков](#2-контент-уроков)
3. [Система подписок](#3-система-подписок)
4. [Управление модулями](#4-управление-модулями)

---

## 1. Панель автора

Панель автора (`/author/*`) позволяет создавать и управлять образовательным контентом.

### Роуты

| URL | Страница | Описание |
|-----|----------|----------|
| `/author/dashboard` | AuthorDashboardPage | Статистика: просмотры, студенты, курсы |
| `/author/courses` | AuthorCoursesPage | Список курсов с фильтрами |
| `/author/courses/new` | AuthorCourseFormPage | Создание курса |
| `/author/courses/:id` | AuthorCourseFormPage | Редактирование курса |
| `/author/courses/:id/modules` | AuthorCourseModulesPage | Управление модулями (Drag&Drop) |
| `/author/lessons` | AuthorLessonsPage | Список уроков |
| `/author/lessons/new` | AuthorLessonFormPage | Создание урока |
| `/author/lessons/:id` | AuthorLessonFormPage | Редактирование урока |
| `/author/analytics` | AuthorAnalyticsPage | Детальная аналитика |

### API Endpoints

| Endpoint | Метод | Описание |
|----------|-------|----------|
| `/author/stats` | GET | Статистика автора |
| `/author/analytics` | GET | Детальная аналитика |
| `/author/courses` | GET/POST | Список/создание курсов |
| `/author/courses/:id` | GET/PATCH/DELETE | CRUD курса |
| `/author/courses/:id/modules` | GET | Модули курса |
| `/author/lessons` | GET/POST | Список/создание уроков |
| `/author/lessons/:id` | GET/PATCH/DELETE | CRUD урока |
| `/author/modules` | POST | Создать модуль |
| `/author/modules/:id` | PATCH/DELETE | Обновить/удалить модуль |
| `/author/modules/reorder` | POST | Изменить порядок |
| `/author/lessons/:id/content/text` | POST | Сохранить текст |
| `/author/lessons/:id/content/video` | POST | Сохранить видео |
| `/author/lessons/:id/content/audio` | POST | Сохранить аудио |
| `/author/lessons/:id/content/quiz` | POST | Сохранить тест |

### Статусы контента

| Статус | Описание | Кто может установить |
|--------|----------|---------------------|
| DRAFT | Черновик | Автор |
| PENDING_REVIEW | На модерации | Автор |
| PUBLISHED | Опубликован | Только Админ/Модератор |

### Редакторы контента

| Тип урока | Компонент | Описание |
|-----------|-----------|----------|
| ARTICLE | TextContentEditor | Markdown редактор с предпросмотром |
| VIDEO | VideoContentEditor | URL для YouTube/Vimeo/RuTube |
| AUDIO | AudioContentEditor | URL для аудио |
| QUIZ | QuizContentEditor | Конструктор тестов |

---

## 2. Контент уроков

Платформа поддерживает 5 типов контента уроков.

### Типы уроков

| Тип | Описание | Хранение |
|-----|----------|----------|
| ARTICLE | Текстовый урок с Markdown | TextContent.body |
| VIDEO | Видео урок | VideoContent.videoUrl |
| AUDIO | Аудио урок | AudioContent.audioUrl |
| QUIZ | Тест/Квиз | QuizContent.questions (JSON) |
| CALCULATOR | Интерактивный калькулятор | Связь по slug |

### Структура БД контента

```
TextContent
├── id
├── lessonId
├── body (текст в Markdown)
├── wordCount
└── readingTime

VideoContent
├── id
├── lessonId
├── videoUrl
├── provider (youtube/vimeo/rutube)
├── duration
└── qualities

AudioContent
├── id
├── lessonId
├── audioUrl
└── duration

QuizContent
├── id
├── lessonId
├── questions (JSON)
└── passingScore
```

### Структура вопроса квиза

```json
{
  "id": "uuid",
  "question": "Текст вопроса",
  "options": [
    { "id": "a", "text": "Вариант A", "isCorrect": true },
    { "id": "b", "text": "Вариант B", "isCorrect": false },
    { "id": "c", "text": "Вариант C", "isCorrect": false }
  ],
  "explanation": "Пояснение после ответа"
}
```

### Загрузка медиа

**Рекомендации для MVP:**
- Видео: только ссылки на YouTube/Vimeo
- Аудио: загрузка на сервер (до 50MB)
- Изображения: загрузка на сервер (до 2MB)

**Рекомендации для продакшена:**
- S3-совместимое хранилище (MinIO, AWS S3, Yandex Object Storage)

---

## 3. Система подписок

Система подписок для монетизации контента.

### Модели данных

#### Subscription (Подписка)

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID | Уникальный идентификатор |
| profileId | UUID | Ссылка на профиль |
| planType | String | Тип подписки (premium_monthly, premium_annual) |
| status | Enum | ACTIVE, PAST_DUE, CANCELED, EXPIRED |
| startDate | DateTime | Дата начала |
| endDate | DateTime? | Дата окончания |
| autoRenew | Boolean | Автоматическое продление |
| price | Float | Цена |
| currency | String | Валюта (RUB) |

#### Transaction (Транзакция)

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID | Уникальный идентификатор |
| profileId | UUID | Ссылка на профиль |
| subscriptionId | UUID? | Ссылка на подписку |
| type | Enum | SUBSCRIPTION_PAYMENT, REFUND |
| amount | Float | Сумма |
| status | Enum | PENDING, COMPLETED, FAILED, REFUNDED |
| provider | String | Провайдер оплаты |

#### PaymentMethod (Метод оплаты)

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID | Уникальный идентификатор |
| profileId | UUID | Ссылка на профиль |
| type | Enum | CARD, PAYPAL, YOOMONEY |
| last4 | String? | Последние 4 цифры карты |
| expiryMonth | Int? | Месяц истечения |
| expiryYear | Int? | Год истечения |
| isDefault | Boolean | По умолчанию |

### API Endpoints (подписки)

| Endpoint | Метод | Описание |
|----------|-------|----------|
| `/api/user/subscriptions` | GET | Список подписок |
| `/api/user/subscriptions` | POST | Оформить подписку |
| `/api/user/subscriptions/:id` | DELETE | Отменить подписку |
| `/api/user/payment-methods` | GET | Список методов оплаты |
| `/api/user/payment-methods` | POST | Добавить метод оплаты |
| `/api/user/payment-methods/:id` | DELETE | Удалить метод оплаты |
| `/api/user/transactions` | GET | История транзакций |
| `/api/admin/subscriptions` | GET | Все подписки (админ) |
| `/api/admin/transactions` | GET | Все транзакции (админ) |

### Статусы

**SubscriptionStatus:**
- ACTIVE — активна
- PAST_DUE — просрочена
- CANCELED — отменена
- EXPIRED — истекла

**TransactionStatus:**
- PENDING — ожидание
- COMPLETED — завершена
- FAILED — неудача
- REFUNDED — возвращена

### Хуки (Frontend)

| Хук | Описание |
|-----|----------|
| useUserSubscriptions | Получение списка подписок |
| useCreateSubscription | Оформление подписки |
| useCancelSubscription | Отмена подписки |
| useUserPaymentMethods | Методы оплаты |
| useAddPaymentMethod | Добавление метода оплаты |
| useDeletePaymentMethod | Удаление метода оплаты |
| useUserTransactions | История транзакций |

---

## 4. Управление модулями

Модули — это логические единицы курса, объединяющие уроки.

### API Endpoints

| Endpoint | Метод | Описание |
|----------|-------|----------|
| `/author/courses/:id/modules` | GET | Список модулей курса |
| `/author/modules` | POST | Создать модуль |
| `/author/modules/:id` | PATCH | Обновить модуль |
| `/author/modules/:id` | DELETE | Удалить модуль |
| `/author/modules/reorder` | POST | Изменить порядок (Drag&Drop) |

### UI страница управления

```
/author/courses/:id/modules

┌─────────────────────────────────────┐
│  Курс: Основы инвестирования        │
│  [Добавить модуль]                  │
├─────────────────────────────────────┤
│  Модуль 1: Введение                 │
│  ├── Описание модуля                │
│  ├── 5 уроков                       │
│  └── [Редактировать] [Удалить]      │
├─────────────────────────────────────┤
│  Модуль 2: Анализ рынков            │
│  ...                                │
└─────────────────────────────────────┘
```

### Особенности

- **Drag&Drop** — сортировка модулей перетаскиванием
- **Группировка** — модули отображаются сгруппированными по курсам
- **Счётчик** — показывает количество уроков в модуле
- **Мягкое удаление** — используется поле `deletedAt`

---

*Обновлено: Апрель 2026*
