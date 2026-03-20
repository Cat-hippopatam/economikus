# Техническая документация Economikus
## Полный анализ проекта, проблемы и roadmap

> Актуальное состояние проекта на основе глубокого анализа кода, зависимостей и архитектуры

---

## 📚 Сопутствующая документация

| Документ | Описание |
|----------|----------|
| **[OPTIMIZATION_GUIDE.md](./OPTIMIZATION_GUIDE.md)** | Единое руководство по оптимизации, рефакторингу и стандартам разработки |
| **[REFACTORING_PLAN.md](./REFACTORING_PLAN.md)** | План рефакторинга админ-страниц |

> ⚠️ **Важно:** Перед началом новой разработки ознакомьтесь с `OPTIMIZATION_GUIDE.md` — там описаны все стандарты, паттерны и правила.

---

## Содержание

1. [Исполнительное резюме](#1-исполнительное-резюме)
2. [Анализ технологического стека](#2-анализ-технологического-стека)
3. [Структура проекта](#3-структура-проекта)
4. [Реализованный функционал](#4-реализованный-функционал)
5. [Выявленные проблемы](#5-выявленные-проблемы)
6. [Анализ API](#6-анализ-api)
7. [Анализ фронтенда](#7-анализ-фронтенда)
8. [Безопасность](#8-безопасность)
9. [Рекомендации и roadmap](#9-рекомендации-и-roadmap)

---

## 1. Исполнительное резюме

### 1.1 Статус проекта

**Экономикус** — образовательная платформа для изучения финансов и инвестиций.

| Метрика | Значение |
|---------|----------|
| **Статус** | В активной разработке |
| **Готовность** | ~40% |
| **Последнее обновление** | Март 2026 |

### 1.2 Краткий обзор реализованного

| Модуль | Статус | Готовность |
|--------|--------|------------|
| Аутентификация | ✅ Работает | 90% |
| API курсов | ✅ Работает | 80% |
| API уроков | ✅ Работает | 80% |
| API пользователя | ✅ Работает | 85% |
| API тегов | ✅ Работает | 100% |
| API реакций | ✅ Работает | 100% |
| API комментариев | ✅ Работает | 100% |
| Админ-панель | ✅ Работает | 70% |
| Страницы авторизации | ✅ Работает | 95% |
| Главная страница | ✅ Работает | 80% |
| Страница профиля | ⚠️ Есть баги | 60% |
| Страница настроек | ⚠️ Есть баги | 50% |
| Каталог курсов | ✅ Работает | 90% |
| Страница курса | ✅ Работает | 85% |
| Калькуляторы | ❌ Не реализовано | 0% |

### 1.3 Критические проблемы

1. **✅ ИСПРАВЛЕНО:** `navigate()` вызывается в теле компонента (React 19 ошибка)
2. **✅ ИСПРАВЛЕНО:** Абсолютные URL в API запросах ломают проксирование
3. **✅ ИСПРАВЛЕНО:** Загрузка аватара - ограничение 2MB, правильная обработка ошибок
4. **✅ ИСПРАВЛЕНО:** Нет защиты роутов на фронтенде
5. **✅ ИСПРАВЛЕНО:** После одобрения заявки на авторство - роль меняется на AUTHOR

---

## 2. Анализ технологического стека

### 2.1 Установленные зависимости

#### Frontend

| Пакет | Версия | Назначение | Статус использования |
|-------|--------|------------|---------------------|
| `react` | 19.1.0 | UI фреймворк | ✅ Активно |
| `react-dom` | 19.1.0 | React DOM | ✅ Активно |
| `react-router-dom` | 7.13.1 | Роутинг | ✅ Активно |
| `@mantine/core` | 8.3.16 | UI компоненты | ✅ Активно |
| `@mantine/hooks` | 8.3.16 | React хуки | ✅ Активно |
| `@tanstack/react-query` | 5.90.21 | Server state | ⚠️ Минимально |
| `react-hook-form` | 7.71.2 | Формы | ✅ Активно |
| `zod` | 4.3.6 | Валидация | ✅ Активно |
| `@hookform/resolvers` | 5.2.2 | Интеграция Zod | ✅ Активно |
| `zustand` | 5.0.11 | State management | ⚠️ Минимально |
| `axios` | 1.13.6 | HTTP клиент | ⚠️ Не используется |
| `lucide-react` | 0.577.0 | Иконки | ✅ Активно |
| `isomorphic-dompurify` | 3.3.0 | Санитизация HTML | ⚠️ Не используется |
| `dayjs` | 1.11.20 | Работа с датами | ⚠️ Не используется |
| `tailwindcss` | 4.2.1 | Стили | ✅ Активно |

#### Backend

| Пакет | Версия | Назначение | Статус использования |
|-------|--------|------------|---------------------|
| `hono` | 4.12.7 | HTTP фреймворк | ✅ Активно |
| `@hono/node-server` | - | Node.js адаптер | ✅ Активно |
| `@hono/vite-dev-server` | 0.25.1 | Dev сервер | ✅ Активно |
| `@prisma/client` | 5.22.0 | ORM | ✅ Активно |
| `bcryptjs` | 3.0.3 | Хеширование | ✅ Активно |
| `@hono/zod-validator` | 0.7.6 | Валидация | ⚠️ Минимально |
| `@hono/swagger-ui` | 0.6.1 | Документация API | ⚠️ Минимально |
| `@hono/zod-openapi` | 1.2.2 | OpenAPI | ⚠️ Минимально |
| `@auth/core` | 0.35.0 | Auth.js | ❌ Не используется |
| `@hono/auth-js` | 1.1.1 | Auth.js для Hono | ❌ Не используется |

#### Dev Dependencies

| Пакет | Версия | Назначение |
|-------|--------|------------|
| `typescript` | 5.8.3 | Типизация |
| `vite` | 6.3.5 | Сборщик |
| `prisma` | 5.22.0 | CLI для Prisma |
| `tsx` | 4.21.0 | Запуск TS |
| `eslint` | 9.25.0 | Линтинг |

### 2.2 Неиспользуемые зависимости

| Пакет | Рекомендация |
|-------|--------------|
| `@auth/core` | Удалить или использовать |
| `@hono/auth-js` | Удалить или использовать |
| `axios` | Использовать вместо fetch или удалить |
| `isomorphic-dompurify` | Добавить санитизацию в формы |
| `dayjs` | Использовать для форматирования дат |

### 2.3 Отсутствующие зависимости

| Пакет | Назначение | Приоритет |
|-------|------------|-----------|
| `@tabler/icons-react` | Иконки для Mantine | 🔴 Добавлен, но не установлен |
| `vitest` | Тестирование | 🟡 |
| `@testing-library/react` | Тестирование компонентов | 🟡 |

---

## 3. Структура проекта

### 3.1 Директория src/

```
src/
├── components/
│   └── layout/
│       ├── Header.tsx         ✅ Шапка с навигацией
│       ├── Footer.tsx         ✅ Подвал
│       └── index.ts           ✅ Экспорт
│
├── constants/
│   ├── config.ts              ✅ Конфигурация приложения
│   ├── enums.ts               ✅ Enums для UI
│   ├── navigation.ts          ✅ Навигационные ссылки
│   └── index.ts               ✅ Экспорт
│
├── hooks/
│   └── useAuth.ts             ✅ Хук авторизации
│
├── layouts/
│   ├── MainLayout.tsx         ✅ Header + Footer
│   ├── AuthLayout.tsx         ✅ Только Header
│   └── index.ts               ✅ Экспорт
│
├── lib/
│   ├── api.ts                 ⚠️ Axios инстанс (не используется)
│   └── localStorage.ts        ✅ Сервис localStorage
│
├── pages/
│   ├── HomePage.tsx           ✅ Главная страница
│   ├── auth/
│   │   ├── LoginPage.tsx      ✅ Страница входа
│   │   └── RegisterPage.tsx   ✅ Страница регистрации
│   ├── admin/
│   │   ├── AdminLayout.tsx    ✅ Layout админки
│   │   ├── AdminDashboard.tsx ✅ Дашборд
│   │   ├── AdminCourses.tsx   ✅ Управление курсами
│   │   ├── AdminLessons.tsx   ✅ Управление уроками
│   │   ├── AdminTags.tsx      ✅ Управление тегами
│   │   ├── AdminUsers.tsx     ✅ Управление пользователями
│   │   ├── AdminModeration.tsx✅ Модерация
│   │   └── AdminApplications.tsx ✅ Заявки авторов
│   ├── profile/
│   │   ├── ProfilePage.tsx    ⚠️ Профиль (баги)
│   │   ├── ProfileSettingsPage.tsx ⚠️ Настройки (баги)
│   │   └── BecomeAuthorPage.tsx ✅ Стать автором
│   └── author/
│       └── AuthorDashboardPage.tsx ✅ Панель автора
│
├── shared/
│   └── types.ts               ✅ TypeScript типы и Zod схемы
│
├── store/
│   └── useAppStore.ts         ⚠️ Zustand стор (минимальное использование)
│
├── App.tsx                    ✅ Роутинг
├── main.tsx                   ✅ Точка входа
└── index.css                  ✅ Глобальные стили
```

### 3.2 Директория server/

```
server/
├── routes/
│   ├── auth.routes.ts         ✅ Аутентификация
│   ├── courses.routes.ts      ✅ API курсов
│   ├── lessons.routes.ts      ✅ API уроков
│   ├── user.routes.ts         ✅ API пользователя
│   ├── tags.routes.ts         ✅ API тегов
│   ├── reactions.routes.ts    ✅ API реакций
│   ├── comments.routes.ts     ✅ API комментариев
│   ├── admin.routes.ts        ✅ API админа
│   ├── author.routes.ts       ✅ API автора
│   ├── moderation.routes.ts   ✅ API модерации
│   └── payments.routes.ts     ⚠️ Заглушка
│
├── middleware/
│   ├── auth.ts                ✅ Auth middleware
│   ├── logger.ts              ⚠️ Заглушка
│   └── rate-limit.ts          ⚠️ Заглушка
│
├── lib/
│   ├── auth.ts                ❌ Не используется (резерв)
│   ├── errors.ts              ✅ Класс AppError
│   ├── validators.ts          ⚠️ Заглушка
│   └── agination.ts           ⚠️ Заглушка
│
├── jobs/
│   └── session-cleanup.ts     ✅ Очистка сессий
│
├── utils/
│   ├── response.ts            ✅ Утилиты ответа
│   └── slug.ts                ✅ Генерация slug
│
├── types.ts                   ✅ Типы сервера
├── db.ts                      ✅ Prisma клиент
└── index.ts                   ✅ Главный файл
```

---

## 4. Реализованный функционал

### 4.1 Аутентификация ✅

**Роуты:**
- `POST /api/auth/register` — регистрация
- `POST /api/auth/login` — вход
- `POST /api/auth/logout` — выход
- `GET /api/auth/me` — текущий пользователь

**Особенности:**
- Сессионная аутентификация (HttpOnly cookies)
- bcryptjs для хеширования (12 раундов)
- 30 дней жизни сессии
- Middleware `requireAuth` для защиты роутов

### 4.2 Курсы ✅

**Роуты:**
- `GET /api/courses` — список с фильтрами и пагинацией
- `GET /api/courses/:slug` — детали курса
- `GET /api/courses/:slug/modules` — модули курса

### 4.3 Уроки ✅

**Роуты:**
- `GET /api/lessons` — список с фильтрами
- `GET /api/lessons/:slug` — детали урока
- `GET /api/lessons/:slug/content` — контент урока

### 4.4 Пользователь ✅

**Роуты:**
- `GET /api/user/me` — профиль
- `PATCH /api/user/profile` — обновление профиля
- `PATCH /api/user/password` — смена пароля
- `GET /api/user/history` — история просмотров
- `GET/POST/DELETE /api/user/favorites` — избранное
- `GET /api/user/progress/courses` — прогресс
- `GET /api/user/certificates` — сертификаты
- `GET /api/user/profile/:nickname` — публичный профиль

### 4.5 Админ-панель ✅

**Роуты:**
- `GET /api/admin/stats` — статистика
- `GET/POST/PATCH/DELETE /api/admin/users` — пользователи
- `GET/POST/PATCH/DELETE /api/admin/courses` — курсы
- `GET/POST/PATCH/DELETE /api/admin/modules` — модули
- `GET/POST/PATCH/DELETE /api/admin/lessons` — уроки
- `GET/POST/PATCH/DELETE /api/admin/tags` — теги
- `GET /api/admin/applications` — заявки авторов

### 4.6 Калькуляторы ✅

**Роуты:**
- `/calculators` — каталог калькуляторов с поиском и фильтрами
- `/calculators/:slug` — страница конкретного калькулятора

**Реализованные калькуляторы:**

| Калькулятор | Slug | Функциональность |
|-------------|------|------------------|
| Сложный процент | `compound-interest` | Расчёт доходности инвестиций с капитализацией |
| Кредитный | `loan` | Расчёт платежей, переплаты, график |
| Ипотечный | `mortgage` | Платежи, налоговые вычеты, маткапитал |

**Архитектура:**
- `src/types/calculator.ts` — типы для калькуляторов
- `src/utils/calculators.ts` — функции расчётов и форматирования
- `src/components/calculators/` — компоненты калькуляторов
- `src/pages/calculators/` — страницы каталога и калькулятора

**Интеграция с уроками:**
- Уроки с типом `CALCULATOR` автоматически отображают соответствующий калькулятор
- Поддержка slug-идентификации: `compound-interest-demo`, `loan`, `mortgage`

---

## 5. Выявленные проблемы

### 5.1 🔴 Критические проблемы

#### Проблема 1: navigate() в теле компонента

**Файл:** `src/pages/profile/ProfileSettingsPage.tsx:92`

**Код:**
```typescript
if (!user || !profile) {
  navigate('/login')  // ❌ Ошибка! Вызывается во время рендера
  return null
}
```

**Ошибка React 19:**
```
You should call navigate() in a React.useEffect(), not when your component is first rendered.
```

**Решение:**
```typescript
useEffect(() => {
  if (!loading && !user) {
    navigate('/login', { replace: true })
  }
}, [loading, user, navigate])

if (loading) {
  return <Container size="md" py="xl"><Skeleton height={400} radius="md" /></Container>
}

if (!user || !profile) {
  return null
}
```

#### Проблема 2: Абсолютные URL в API запросах

**Файл:** `src/constants/config.ts`

**Код:**
```typescript
apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
```

**Проблема:** В dev режиме Vite проксирует `/api/*` на Hono сервер. Использование абсолютного URL ломает проксирование.

**Решение:**
```typescript
// В dev режиме использовать относительный путь
apiUrl: import.meta.env.PROD 
  ? (import.meta.env.VITE_API_URL || 'https://api.economikus.ru/api')
  : '/api',
```

#### Проблема 3: Отсутствует пакет @tabler/icons-react

**Ошибка:**
```
Failed to resolve import "@tabler/icons-react"
```

**Решение:**
```bash
npm install @tabler/icons-react
# или заменить на lucide-react
```

### 5.2 🟡 Важные проблемы

#### Проблема 4: Нет загрузки аватара

**Файл:** `src/pages/profile/ProfileSettingsPage.tsx`

**Код:**
```typescript
<FileInput 
  placeholder="Выберите изображение" 
  accept="image/*" 
  // ❌ Нет onChange, нет загрузки на сервер
/>
```

**Решение:**
1. Добавить endpoint `POST /api/user/avatar`
2. Добавить логику загрузки файла
3. Использовать FormData

#### Проблема 5: Нет защиты роутов на фронтенде

**Проблема:** Страницы `/profile/*`, `/admin/*` доступны без авторизации.

**Решение:** Создать `ProtectedRoute` компонент.

#### Проблема 6: Zustand используется минимально

**Проблема:** Zustand установлен, но почти не используется. Есть дублирование состояния между `useAuth` и `useAppStore`.

**Решение:** Либо активно использовать Zustand для глобального состояния, либо удалить.

### 5.3 🟢 Минорные проблемы

#### Проблема 7: Axios не используется

**Проблема:** Axios установлен, но во всём проекте используется `fetch`.

**Решение:** Либо заменить fetch на axios, либо удалить пакет.

#### Проблема 8: isomorphic-dompurify не используется

**Проблема:** Пакет установлен, но санитизация не применяется к полям формы.

**Решение:** Добавить санитизацию в Zod схемы.

---

## 6. Анализ API

### 6.1 Реализованные endpoints

| Endpoint | Метод | Статус | Защита |
|----------|-------|--------|--------|
| `/api/auth/register` | POST | ✅ | Публичный |
| `/api/auth/login` | POST | ✅ | Публичный |
| `/api/auth/logout` | POST | ✅ | Публичный |
| `/api/auth/me` | GET | ✅ | Публичный |
| `/api/courses` | GET | ✅ | Публичный |
| `/api/courses/:slug` | GET | ✅ | Публичный |
| `/api/lessons` | GET | ✅ | Публичный |
| `/api/lessons/:slug` | GET | ✅ | Публичный |
| `/api/user/me` | GET | ✅ | requireAuth |
| `/api/user/profile` | PATCH | ✅ | requireAuth |
| `/api/user/password` | PATCH | ✅ | requireAuth |
| `/api/user/favorites` | GET/POST/DELETE | ✅ | requireAuth |
| `/api/user/history` | GET | ✅ | requireAuth |
| `/api/admin/*` | * | ✅ | requireAuth + ADMIN |
| `/api/tags` | GET | ✅ | Публичный |
| `/api/reactions` | GET/POST/DELETE | ✅ | Смешанный |
| `/api/comments` | GET/POST/PATCH/DELETE | ✅ | Смешанный |

### 6.2 Отсутствующие endpoints

| Endpoint | Метод | Назначение | Приоритет |
|----------|-------|------------|-----------|
| `/api/user/avatar` | POST | Загрузка аватара | 🔴 |
| `/api/catalog` | GET | Каталог с фильтрами | 🟡 |
| `/api/search` | GET | Глобальный поиск | 🟢 |
| `/api/calculator/*` | * | Калькуляторы | 🟢 |

---

## 7. Анализ фронтенда

### 7.1 Страницы

| Страница | Путь | Статус | Проблемы |
|----------|------|--------|----------|
| Главная | `/` | ✅ | - |
| Вход | `/login` | ✅ | - |
| Регистрация | `/register` | ✅ | - |
| Профиль | `/profile` | ⚠️ | Редирект на /profile/settings |
| Настройки | `/profile/settings` | ⚠️ | navigate() в теле компонента |
| Публичный профиль | `/user/:nickname` | ✅ | - |
| Стать автором | `/become-author` | ✅ | - |
| Админ-дашборд | `/admin` | ✅ | - |
| Админ-курсы | `/admin/courses` | ✅ | - |
| Админ-уроки | `/admin/lessons` | ✅ | - |
| Админ-теги | `/admin/tags` | ✅ | - |
| Админ-пользователи | `/admin/users` | ✅ | - |
| Админ-модерация | `/admin/moderation` | ✅ | - |
| Админ-контент | `/admin/content` | ✅ | Модерация контента уроков |
| Админ-заявки | `/admin/applications` | ✅ | - |
| Каталог | `/catalog` | ✅ | Список курсов с фильтрами |
| Курс | `/courses/:slug` | ✅ | Детальная страница курса |
| Урок | `/courses/:courseSlug/lessons/:lessonSlug` | ✅ | Страница урока с навигацией |
| Калькуляторы | `/calculators` | ✅ | Каталог калькуляторов |
| Калькулятор | `/calculators/:slug` | ✅ | Страница калькулятора |

### 7.2 Компоненты

| Компонент | Файл | Статус |
|-----------|------|--------|
| Header | `components/layout/Header.tsx` | ✅ |
| Footer | `components/layout/Footer.tsx` | ✅ |
| MainLayout | `layouts/MainLayout.tsx` | ✅ |
| AuthLayout | `layouts/AuthLayout.tsx` | ✅ |
| AdminLayout | `pages/admin/AdminLayout.tsx` | ✅ |

### 7.3 Хуки

| Хук | Файл | Статус | Использование |
|-----|------|--------|---------------|
| useAuth | `hooks/useAuth.ts` | ✅ | ProfileSettingsPage |
| useAppStore | `store/useAppStore.ts` | ⚠️ | Минимальное |

---

## 8. Безопасность

### 8.1 Реализованные меры

| Мера | Статус | Описание |
|------|--------|----------|
| HttpOnly cookies | ✅ | Сессии в HttpOnly cookies |
| SameSite=Strict | ✅ | Защита от CSRF |
| Хеширование паролей | ✅ | bcryptjs, 12 раундов |
| Проверка авторизации | ✅ | Middleware requireAuth |
| Проверка ролей | ✅ | requireRole middleware |
| Защита от блокировки | ✅ | Проверка isBlocked |

### 8.2 Рекомендуемые меры

| Мера | Приоритет | Описание |
|------|-----------|----------|
| Rate limiting | 🔴 | Ограничение попыток входа |
| Санитизация входа | 🔴 | DOMPurify для форм |
| Content Security Policy | 🟡 | Заголовки безопасности |
| Индексы на Session | 🟡 | Ускорение поиска сессии |
| Ограничение сессий | 🟡 | Максимум 5 на пользователя |

---

## 9. Рекомендации и Roadmap

### 9.1 Немедленные действия (P0)

| Задача | Файл | Время | Статус |
|--------|------|-------|--------|
| Исправить navigate() | ProfileSettingsPage.tsx | 15 мин | ✅ Исправлено |
| Исправить apiUrl | config.ts | 5 мин | ✅ Исправлено |
| Исправить vite.config.ts | vite.config.ts | 10 мин | ✅ Исправлено |
| Добавить тип User | shared/types.ts | 5 мин | ✅ Исправлено |
| Исправить интерфейсы Course/Lesson | AdminCourses.tsx, AdminLessons.tsx | 10 мин | ✅ Исправлено |
| Удалить неиспользуемые импорты | AdminLayout.tsx, AdminModeration.tsx и др. | 10 мин | ✅ Исправлено |
| Установить @types/node | package.json | 2 мин | ✅ Исправлено |

### 9.2 Краткосрочные задачи (P1)

| Задача | Время | Описание | Статус |
|--------|-------|----------|--------|
| Загрузка аватара | 3 часа | API + UI | ✅ Выполнено |
| ProtectedRoute | 2 часа | Защита роутов | ✅ Выполнено |
| Каталог курсов | 8 часов | Страница + фильтры | ✅ Выполнено |
| Страница курса | 6 часов | Детальная страница | ✅ Выполнено |

### 9.3 Среднесрочные задачи (P2)

| Задача | Время | Описание |
|--------|-------|----------|
| Калькуляторы | 16 часов | 3 калькулятора |
| Страницы уроков | 8 часов | Просмотр контента |
| Тесты | 16 часов | Unit + integration |
| Rate limiting | 4 часа | Защита от брутфорса |

### 9.4 Долгосрочные задачи (P3)

| Задача | Время | Описание |
|--------|-------|----------|
| OAuth провайдеры | 8 часов | Google, VK, Yandex |
| Платежи | 16 часов | Интеграция ЮKassa |
| Мобильная версия | 24 часа | Адаптив |
| SEO оптимизация | 8 часов | Meta теги, sitemap |

### 9.5 Roadmap по спринтам

#### Спринт 1 (1 неделя) — Стабилизация
- [x] Исправить navigate() в ProfileSettingsPage
- [x] Исправить apiUrl для dev режима
- [x] Установить @tabler/icons-react
- [x] Добавить загрузку аватара
- [x] Добавить ProtectedRoute
- [ ] Каталог курсов

#### Спринт 2 (1 неделя) — Каталог
- [ ] Страница каталога курсов
- [ ] Фильтры и поиск
- [ ] Страница курса
- [ ] Страница модуля

#### Спринт 3 (1 неделя) — Уроки
- [ ] Страница урока
- [ ] Отображение контента (текст, видео, аудио)
- [ ] Квизы
- [ ] Прогресс

#### Спринт 4 (2 недели) — Калькуляторы
- [ ] Кредитный калькулятор
- [ ] Калькулятор вкладов
- [ ] Ипотечный калькулятор

---

## 10. Итоги исправлений

### 10.1 Исправленные проблемы

| Проблема | Решение | Результат |
|----------|---------|-----------|
| `navigate()` в теле компонента | Перенесён в useEffect | ✅ React 19 совместимость |
| Абсолютный apiUrl | Относительный путь в dev режиме | ✅ Проксирование работает |
| TypeScript ошибки | Добавлены типы, исправлены импорты | ✅ Сборка успешна |
| vite.config.ts | ESM-совместимый путь | ✅ Сборка успешна |
| Неиспользуемые импорты | Удалены | ✅ Чистый код |
| **Смена пароля не работает** | Добавлен passwordHash в middleware | ✅ Исправлено |

### 10.2 Выполненный рефакторинг

> 📖 Подробное описание паттернов и правил см. в [OPTIMIZATION_GUIDE.md](./OPTIMIZATION_GUIDE.md)

#### Созданная структура:

```
src/
├── types/                      # ✅ Создано
│   ├── index.ts
│   ├── auth.ts
│   ├── user.ts
│   ├── course.ts
│   ├── lesson.ts
│   ├── tag.ts
│   ├── comment.ts
│   ├── application.ts
│   └── api.ts
│
├── constants/                  # ✅ Расширено
│   ├── status.ts               # Статусы + STATUS_COLORS, STATUS_LABELS
│   ├── roles.ts                # Роли + ROLE_COLORS, ROLE_LABELS
│   ├── difficulty.ts           # Уровни сложности + DIFFICULTY_LABELS
│   └── lessonTypes.ts          # Типы уроков + LESSON_TYPE_LABELS
│
├── services/                   # ✅ Создано
│   ├── index.ts
│   ├── api.ts                  # Базовый API класс
│   ├── auth.service.ts
│   ├── user.service.ts
│   ├── course.service.ts
│   ├── lesson.service.ts
│   ├── tag.service.ts
│   └── application.service.ts
│
├── hooks/                      # ✅ Расширено
│   ├── index.ts
│   ├── usePagination.ts        # Переиспользуемая пагинация
│   ├── useTable.ts             # Логика таблиц
│   ├── useConfirm.ts           # Диалоги подтверждения
│   ├── useNotification.ts      # Уведомления
│   ├── useTagList.ts           # Управление списком тегов с CRUD
│   ├── useCourseList.ts        # Управление списком курсов с CRUD
│   ├── useLessonList.ts        # Управление списком уроков с CRUD
│   └── useUserList.ts          # Управление списком пользователей с CRUD
│
└── components/
    ├── common/                 # ✅ Создано
    │   ├── StatusBadge.tsx     # Бейдж статуса
    │   ├── RoleBadge.tsx       # Бейдж роли
    │   ├── LoadingState.tsx    # Состояние загрузки
    │   ├── EmptyState.tsx      # Пустое состояние
    │   ├── ErrorState.tsx      # Состояние ошибки
    │   ├── ConfirmDialog.tsx   # Диалог подтверждения
    │   └── ColorIndicator.tsx  # Индикатор цвета
    │
    ├── modals/                 # ✅ Создано
    │   ├── TagModal.tsx        # Модальное окно тега
    │   ├── CourseModal.tsx     # Модальное окно курса
    │   ├── LessonModal.tsx     # Модальное окно урока
    │   └── UserModal.tsx       # Модальное окно пользователя
    │
    ├── tables/                 # ✅ Создано
    │   ├── DataTable.tsx       # Переиспользуемая таблица
    │   └── TableFilters.tsx    # Фильтры таблиц
    │
    └── cards/                  # ✅ Создано
        └── StatCard.tsx        # Карточка статистики
```

#### Переиспользуемые компоненты:

| Категория | Компонент | Назначение |
|-----------|-----------|------------|
| Common | `StatusBadge` | Бейдж статуса контента |
| Common | `RoleBadge` | Бейдж роли пользователя |
| Common | `LoadingState` | Состояние загрузки |
| Common | `EmptyState` | Пустое состояние |
| Common | `ErrorState` | Состояние ошибки |
| Common | `ConfirmDialog` | Диалог подтверждения |
| Common | `ColorIndicator` | Индикатор цвета |
| Modals | `TagModal` | Создание/редактирование тега |
| Modals | `CourseModal` | Создание/редактирование курса |
| Modals | `LessonModal` | Создание/редактирование урока |
| Modals | `UserModal` | Редактирование пользователя |
| Tables | `DataTable` | Переиспользуемая таблица |
| Tables | `TableFilters` | Фильтры таблиц |
| Cards | `StatCard` | Карточка статистики |

#### Хуки для управления списками:

| Хук | Назначение | CRUD |
|-----|------------|------|
| `useTagList` | Теги | ✅ Create, Read, Update, Delete |
| `useCourseList` | Курсы | ✅ Create, Read, Update, Delete |
| `useLessonList` | Уроки | ✅ Create, Read, Update, Delete |
| `useUserList` | Пользователи | ✅ Read, Update, Delete |
| `useNotification` | Уведомления | — |
| `useConfirm` | Диалоги | — |
| `usePagination` | Пагинация | — |
| `useTable` | Таблицы | — |

#### Рефакторинг админ-страниц:

| Страница | Статус | Хук | Модалка | Компоненты |
|----------|--------|-----|---------|------------|
| AdminDashboard | ✅ | — | — | StatCard |
| AdminTags | ✅ | useTagList | TagModal | ColorIndicator, ConfirmDialog |
| AdminCourses | ✅ | useCourseList | CourseModal | StatusBadge, ConfirmDialog |
| AdminLessons | ✅ | useLessonList | LessonModal | StatusBadge, ConfirmDialog |
| AdminUsers | ✅ | useUserList | UserModal | RoleBadge, ConfirmDialog |
| AdminModeration | 🔲 | — | — | Требует отдельного подхода |
| AdminApplications | 🔲 | — | — | Требует отдельного подхода |

#### Защита роутов:

| Компонент | Назначение |
|-----------|------------|
| `ProtectedRoute` | Защита роутов с проверкой авторизации и ролей |

#### Профиль пользователя:

| Компонент | Назначение |
|-----------|------------|
| `AvatarUploader` | Загрузка и удаление аватара |
| `useAvatarUpload` | Хук для загрузки аватара |
| `useAuthorApplication` | Хук для управления заявкой на авторство |

#### Страница автора:

| Компонент | Назначение |
|-----------|------------|
| `AuthorDashboardPage` | Панель автора с статистикой |
| `BecomeAuthorPage` | Подача заявки на статус автора |

---

## 12. Принципы оптимизации

### 12.1 Единая точка изменения статических элементов

**Проблема:** При изменении текстов, цветов, иконок приходится править код в нескольких местах.

**Решение:** Выносить все статические данные в константы:

```typescript
// ❌ Плохо: статика размазана по коду
<Badge color="yellow">На рассмотрении</Badge>
<Badge color="green">Одобрено</Badge>
<Badge color="red">Отклонено</Badge>

// ✅ Хорошо: единая точка изменения
// constants/status.ts
export const APPLICATION_STATUS = {
  PENDING: { color: 'yellow', label: 'На рассмотрении' },
  APPROVED: { color: 'green', label: 'Одобрено' },
  REJECTED: { color: 'red', label: 'Отклонено' },
} as const

// Использование
<StatusBadge status="PENDING" type="application" />
```

### 12.2 Переиспользуемые компоненты

| Компонент | Используется в | Назначение |
|-----------|---------------|------------|
| `StatusBadge` | AdminCourses, AdminLessons, BecomeAuthorPage, AdminApplications | Отображение статуса |
| `LoadingState` | Все страницы с загрузкой | Состояние загрузки |
| `StatCard` | AdminDashboard, AuthorDashboardPage | Карточка статистики |
| `ConfirmDialog` | Все CRUD операции | Подтверждение действий |

### 12.3 Хуки для бизнес-логики

| Хук | Назначение |
|-----|------------|
| `useAuthorApplication` | Управление заявкой на авторство |
| `useTagList` | CRUD для тегов |
| `useCourseList` | CRUD для курсов |
| `useLessonList` | CRUD для уроков |
| `useUserList` | CRUD для пользователей |
| `useAvatarUpload` | Загрузка аватара |

---

## 13. Панель автора

### 13.1 Текущий статус

| Компонент | Статус | Описание |
|-----------|--------|----------|
| `AuthorDashboardPage` | ✅ | Главная страница со статистикой |
| `AuthorLayout` | ✅ | Layout с боковой навигацией |
| `AuthorCoursesPage` | ✅ | Список курсов автора |
| `AuthorLessonsPage` | ✅ | Список уроков автора |
| `AuthorAnalyticsPage` | ✅ | Страница аналитики **НОВОЕ** |
| `useAuthorApplication` | ✅ | Хук для подачи заявки на авторство |
| `useAuthorCourses` | ✅ | Хук для управления курсами автора |
| `useAuthorLessons` | ✅ | Хук для управления уроками автора |
| `constants/author.ts` | ✅ | Константы для панели автора |
| API `/author/stats` | ✅ | Статистика автора |
| API `/author/analytics` | ✅ | Детальная аналитика **НОВОЕ** |
| API `/author/courses` | ✅ | CRUD курсов автора |
| API `/author/lessons` | ✅ | CRUD уроков автора |
| API `/admin/applications` | ✅ | Управление заявками (смена роли на AUTHOR) |

### 13.2 План разработки

См. [AUTHOR_PANEL_PLAN.md](./AUTHOR_PANEL_PLAN.md)

#### Этапы:

1. **P0 - Базовая инфраструктура** ✅ Выполнено
   - AuthorLayout с навигацией
   - Роутинг в App.tsx
   - Константы AUTHOR_NAVIGATION

2. **P0 - Управление курсами** ✅ Выполнено
   - AuthorCoursesPage (список курсов)
   - useAuthorCourses (CRUD хук)
   - API endpoints (/author/courses)

3. **P0 - Управление уроками** ✅ Выполнено
   - AuthorLessonsPage (список уроков)
   - useAuthorLessons (CRUD хук)
   - API endpoints (/author/lessons)

4. **P1 - Редактор контента** (3-4 дня)
   - WYSIWYG редактор
   - Загрузка видео
   - Редактор тестов

5. **P1 - Управление модулями** (1-2 дня)
   - Drag&Drop редактор

6. **P2 - Аналитика** ✅ ВЫПОЛНЕНО
   - AuthorAnalyticsPage создана
   - API endpoint `/author/analytics` реализован
   - OpenAPI документация добавлена
   - Базовая статистика: overview, курсы/уроки по статусам, топ контент

---

## 14. Исправленные проблемы

### 14.1 Загрузка аватара

**Проблема:** 500 ошибка при загрузке аватара

**Причина:** 
- Слишком большой файл (5MB → base64 > 65535 байт)
- MySQL TEXT поле имеет лимит 65535 байт

**Решение:**
- Ограничение размера файла: 2MB
- Проверка размера dataUrl перед сохранением
- Правильная обработка ошибок на сервере

**Файлы:**
- `server/routes/user.routes.ts` - добавлен try-catch и проверки
- `src/hooks/useAvatarUpload.ts` - валидация на клиенте
- `src/components/common/AvatarUploader.tsx` - правильные подсказки

### 14.2 Смена роли при одобрении заявки

**Проблема:** После одобрения заявки роль пользователя не менялась

**Решение:** Логика уже реализована в `server/routes/admin.routes.ts`:

```typescript
if (action === 'approve') {
  // Меняем статус заявки
  await prisma.authorApplication.update({
    where: { id },
    data: { status: 'APPROVED', reviewedBy: profile.id, reviewedAt: new Date() }
  })
  // Меняем роль пользователя на AUTHOR
  const userProfile = await prisma.profile.findUnique({ where: { id: application.profileId } })
  if (userProfile) {
    await prisma.user.update({
      where: { id: userProfile.userId },
      data: { role: 'AUTHOR' }
    })
  }
}
```

### 14.3 Защита роутов

**Проблема:** Страницы `/author/*` доступны без проверки роли

**Решение:** Используется `ProtectedRoute`:

```typescript
<Route 
  path="/author/dashboard" 
  element={
    <ProtectedRoute roles={['AUTHOR', 'ADMIN']}>
      <AuthorDashboardPage />
    </ProtectedRoute>
  } 
/>
```

### 14.4 Глобальный обработчик ошибок

**Проблема:** Endpoints возвращали 500 Internal Server Error вместо понятных ошибок

**Решение:** Добавлен глобальный обработчик ошибок в `server/index.ts`:

```typescript
app.onError((err, c) => {
  if (err instanceof AppError) {
    return c.json({ error: err.message, code: err.code }, err.statusCode)
  }
  console.error('Server error:', err)
  return c.json({ error: 'Internal server error' }, 500)
})
```

**Результат:**
- `/api/author/stats` без авторизации → `401 {"error":"Требуется авторизация","code":"UNAUTHORIZED"}`
- Правильные HTTP коды для всех ошибок

### 14.5 OpenAPI и Swagger

**Обновлено:** Добавлена документация для всех endpoints автора:
- `/author/stats` - статистика автора
- `/author/courses` - CRUD курсов
- `/author/lessons` - CRUD уроков

**Исправлено:** Swagger теперь загружает API docs с правильного URL:
```typescript
const API_URL = process.env.API_URL || 'http://localhost:3000'
app.get('/api/swagger', swaggerUI({ url: `${API_URL}/api/doc` }))
```

**Доступ:** `http://localhost:3000/api/swagger`

---

## 15. Следующие шаги

### 15.1 Немедленные (текущий спринт)

1. **Калькуляторы** - кредитный, вкладов, ипотечный

### 15.2 Краткосрочные (1-2 недели)

1. **Страница урока** - просмотр контента
2. **Страница модуля** - список уроков
3. **Прогресс обучения** - отслеживание

### 15.3 Среднесрочные (2-4 недели)

1. **Управление модулями** - drag&drop
2. **Загрузка медиа** - видео, аудио
3. **Редактор тестов** - квизы

---

## 16. Документация

| Документ | Описание | Статус |
|----------|----------|--------|
| [OPTIMIZATION_GUIDE.md](./OPTIMIZATION_GUIDE.md) | Правила оптимизации | ✅ Актуален |
| [REFACTORING_PLAN.md](./REFACTORING_PLAN.md) | План рефакторинга | ✅ Актуален |
| [AUTHOR_PANEL_PLAN.md](./AUTHOR_PANEL_PLAN.md) | План панели автора | ✅ Создан |
| [TECHNICAL_DOCUMENTATION_4.md](./TECHNICAL_DOCUMENTATION_4.md) | Техническая документация | ✅ Актуален |

---

*Документация создана: Март 2026*
*Версия: 4.3*
*Статус: Актуальная*
*Обновлено: Добавлены страницы каталога курсов и детальной страницы курса*
