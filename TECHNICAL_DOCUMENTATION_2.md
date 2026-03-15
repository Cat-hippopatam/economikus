# Техническая документация 2 часть
## Углублённый анализ проекта Economikus

> Детальное исследование архитектуры, зависимостей, взаимосвязей и направлений развития

---

## Содержание

1. [Обзор технологического стека](#1-обзор-технологического-стека)
2. [Анализ структуры проекта](#2-анализ-структуры-проекта)
3. [Конфигурационные файлы](#3-конфигурационные-файлы)
4. [База данных и ORM](#4-база-данных-и-orm)
5. [API архитектура](#5-api-архитектура)
6. [Аутентификация и сессии](#6-аутентификация-и-сессии)
7. [Фронтенд архитектура](#7-фронтенд-архитектура)
8. [Компонентная структура](#8-компонентная-структура)
9. [Взаимосвязи между модулями](#9-взаимосвязи-между-модулями)
10. [Текущие проблемы и ограничения](#10-текущие-проблемы-и-ограничения)
11. [Рекомендации по развитию](#11-рекомендации-по-развитию)
12. [Roadmap развития](#12-roadmap-развития)

---

## 1. Обзор технологического стека

### 1.1 Основные технологии

| Уровень | Технология | Версия | Назначение |
|---------|------------|--------|------------|
| **Frontend** | React | 19.1.0 | UI-фреймворк |
| | Vite | 6.3.5 | Сборщик и dev-сервер |
| | react-router-dom | 7.13.1 | Клиентский роутинг |
| | Mantine | 8.3.16 | UI-компоненты |
| | TailwindCSS | 4.2.1 | Стилизация |
| | Zustand | 5.0.11 | Глобальный стейт |
| | TanStack Query | 5.90.21 | Server state |
| | react-hook-form | 7.71.2 | Управление формами |
| | Zod | 4.3.6 | Валидация схем |
| **Backend** | Hono | 4.12.7 | HTTP-фреймворк |
| | Prisma | 5.22.0 | ORM для MySQL |
| | bcryptjs | 3.0.3 | Хэширование паролей |
| **Инструменты** | TypeScript | 5.8.3 | Типизация |
| | ESLint | 9.25.0 | Линтинг |
| | tsx | 4.21.0 | Запуск TS файлов |

### 1.2 Уникальные особенности стека

**React 19** — последняя версия React с улучшенной производительностью и новыми хуками.

**Hono** — легковесный edge-first фреймворк, работающий в Cloudflare Workers, Deno, Bun и Node.js. В проекте используется с `@hono/node-server` для запуска на Node.js.

**Zod 4** — новая версия библиотеки валидации с улучшенной производительностью.

**Mantine 8** — полнофункциональная UI-библиотека с 100+ компонентами.

**@hono/vite-dev-server** — плагин Vite для разработки Hono бэкенда без отдельного сервера.

### 1.3 Сравнение с альтернативами

| Компонент | Используется | Альтернативы |
|-----------|--------------|--------------|
| UI Framework | Mantine | Material UI, Ant Design, Chakra UI |
| State | Zustand | Redux Toolkit, Jotai, Recoil |
| Server State | TanStack Query | SWR, Apollo Client |
| Backend | Hono | Express, Fastify, Koa |
| ORM | Prisma | Drizzle, TypeORM, Sequelize |
| Validation | Zod | Yup, Joi, Superstruct |

---

## 2. Анализ структуры проекта

### 2.1 Корневая структура

```
E:\Project\app\
├── src/                    # Фронтенд (React)
├── server/                 # Бэкенд (Hono)
├── prisma/                 # Схема БД и миграции
├── public/                 # Статические файлы
├── node_modules/           # Зависимости
├── package.json            # Конфигурация npm
├── vite.config.ts          # Конфигурация Vite
├── tsconfig.json           # Конфигурация TypeScript
├── eslint.config.js        # Конфигурация ESLint
├── .env                    # Переменные окружения
├── TECHNICAL_DOCUMENTATION.md  # Документация (часть 1)
└── index.html              # Точка входа HTML
```

### 2.2 Структура фронтенда (src/)

```
src/
├── components/
│   └── layout/
│       ├── Header.tsx      # Шапка сайта
│       ├── Footer.tsx      # Подвал сайта
│       └── index.ts        # Экспорт
├── layouts/
│   ├── MainLayout.tsx      # Layout с Header+Footer
│   ├── AuthLayout.tsx      # Layout для авторизации
│   └── index.ts            # Экспорт
├── pages/
│   ├── HomePage.tsx        # Главная страница
│   ├── auth/
│   │   ├── LoginPage.tsx   # Страница входа
│   │   └── RegisterPage.tsx # Страница регистрации
│   └── admin/
│       ├── AdminLayout.tsx # Layout админ-панели
│       ├── AdminDashboard.tsx
│       ├── AdminCourses.tsx
│       ├── AdminLessons.tsx
│       ├── AdminTags.tsx
│       ├── AdminUsers.tsx
│       └── index.ts
├── shared/
│   └── types.ts            # TypeScript типы и Zod схемы
├── store/
│   └── useAppStore.ts      # Zustand стор
├── lib/
│   └── api.ts              # Axios инстанс
├── assets/
│   └── react.svg
├── App.tsx                 # Главный компонент с роутингом
├── main.tsx                # Точка входа
├── App.css                 # Дополнительные стили
├── index.css               # Глобальные стили
└── vite-env.d.ts           # Типы Vite
```

### 2.3 Структура бэкенда (server/)

```
server/
├── routes/
│   ├── auth.routes.ts      # Аутентификация
│   ├── courses.routes.ts   # Курсы
│   ├── lessons.routes.ts   # Уроки
│   ├── user.routes.ts      # Пользователь
│   ├── tags.routes.ts      # Теги
│   ├── reactions.routes.ts # Реакции
│   ├── comments.routes.ts  # Комментарии
│   ├── admin.routes.ts     # Админ
│   └── payments.routes.ts  # Платежи (заглушка)
├── middleware/
│   ├── auth.ts             # Заглушка auth
│   ├── logger.ts           # Заглушка логгера
│   └── rate-limit.ts       # Заглушка rate limiting
├── lib/
│   ├── auth.ts             # Конфиг Auth.js (резерв)
│   ├── errors.ts           # Класс AppError
│   ├── validators.ts       # Заглушки валидаторов
│   └── agination.ts        # Пагинация (заглушка)
├── utils/
│   ├── slug.ts             # Утилиты для slug
│   └── response.ts         # Утилиты ответа
├── types.ts                # TypeScript типы сервера
├── db.ts                   # Prisma клиент
└── index.ts                # Главный файл сервера
```

### 2.4 Структура базы данных (prisma/)

```
prisma/
├── schema.prisma           # Основная схема
├── schema_copy.prisma      # Копия схемы
└── (миграции отсутствуют)
```

---

## 3. Конфигурационные файлы

### 3.1 vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import devServer from '@hono/vite-dev-server'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),           // React плагин
    tailwindcss(),     // TailwindCSS
    devServer({
      entry: 'server/index.ts',  // Точка входа Hono
      exclude: [/^\/(?!api).*/], // Проксирование /api на Hono
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),  // Алиас для импортов
    },
  },
})
```

**Ключевые моменты:**
- `@hono/vite-dev-server` объединяет Vite и Hono в одном процессе
- Все запросы `/api/*` перенаправляются на Hono сервер
- Остальные запросы обрабатывает Vite (React)

### 3.2 package.json

**Ключевые скрипты:**
```json
{
  "scripts": {
    "dev": "vite",              // Запуск dev сервера
    "build": "tsc -b && vite build",  // Сборка
    "lint": "eslint .",         // Линтинг
    "preview": "vite preview",  // Превью продакшна
    "db:seed": "tsx prisma/seed.ts"  // Сидирование БД
  }
}
```

### 3.3 tsconfig.json

Комплексная настройка TypeScript с разделением на:
- `tsconfig.node.json` — для Node.js (сервер)
- `tsconfig.app.json` — для браузера (фронтенд)

**Алиасы путей:**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### 3.4 .env

```env
DATABASE_URL="mysql://user:password@localhost:3306/economikus"
PORT=3000
AUTH_SECRET="your-secret-key-min-32-chars-long"
FRONTEND_URL="http://localhost:5173"
```

---

## 4. База данных и ORM

> **Важное примечание:** Prisma используется исключительно для генерации TypeScript-типов и подключения к базе данных. Миграции **не используются** — схема `schema.prisma` применяется напрямую к MySQL без `prisma migrate`. Это упрощает процесс разработки и не требует управления миграциями.

### 4.1 Схема Prisma

Проект использует **28 моделей** в MySQL базе данных:

#### 4.1.1 Модели аутентификации

| Модель | Назначение | Связи |
|--------|------------|-------|
| **User** | Основная учетная запись | profile, sessions, accounts |
| **Profile** | Публичный профиль пользователя | user, courses, lessons, comments |
| **Session** | Активные сессии пользователей | user |
| **Account** | OAuth аккаунты (Google, VK, etc.) | user |
| **VerificationToken** | Токены верификации email | - |
| **Authenticator** | WebAuthn аутентификаторы | user |

#### 4.1.2 Модели контента

| Модель | Назначение | Связи |
|--------|------------|-------|
| **Course** | Курсы | author, modules, tags, progress |
| **Module** | Модули курсов | course, lessons |
| **Lesson** | Уроки | module, author, content tables |
| **TextContent** | Текстовый контент | lesson |
| **VideoContent** | Видео контент | lesson |
| **AudioContent** | Аудио контент | lesson |
| **QuizContent** | Тесты/квизы | lesson |
| **Tag** | Теги | courses, lessons |
| **CourseTag** | Связь курсов и тегов | course, tag |
| **LessonTag** | Связь уроков и тегов | lesson, tag |

#### 4.1.3 Модели активности

| Модель | Назначение | Связи |
|--------|------------|-------|
| **Comment** | Комментарии | author, lesson/course |
| **Reaction** | Лайки/дизлайки | profile |
| **Favorite** | Избранное | profile, lesson |
| **History** | История просмотров | profile |
| **CourseProgress** | Прогресс по курсам | profile, course |
| **LessonProgress** | Прогресс по урокам | profile, lesson |
| **Certificate** | Сертификаты | profile, course |

#### 4.1.4 Модели платежей

| Модель | Назначение | Связи |
|--------|------------|-------|
| **Subscription** | Подписки | profile, paymentMethod |
| **Transaction** | Транзакции | profile, subscription |
| **PaymentMethod** | Методы оплаты | profile |
| **Notification** | Уведомления | profile |

### 4.2 Особенности реализации

**Полиморфизм уроков:**
```
Lesson
├── lessonType = 'ARTICLE' → TextContent
├── lessonType = 'VIDEO'   → VideoContent
├── lessonType = 'AUDIO'   → AudioContent
└── lessonType = 'QUIZ'    → QuizContent
```

**Soft Delete:** Многие модели имеют поле `deletedAt` для мягкого удаления.

**Кэшированная статистика:** Course и Lesson хранят `viewsCount`, `likesCount` для быстрого доступа.

### 4.3 Enums

```prisma
enum Role { USER, AUTHOR, MODERATOR, ADMIN }
enum ContentStatus { DRAFT, PENDING_REVIEW, PUBLISHED, ARCHIVED, DELETED }
enum DifficultyLevel { BEGINNER, INTERMEDIATE, ADVANCED }
enum LessonType { ARTICLE, VIDEO, AUDIO, QUIZ, CALCULATOR }
enum ReactionType { LIKE, DISLIKE }
enum SubscriptionStatus { ACTIVE, PAST_DUE, CANCELED, EXPIRED }
enum TransactionStatus { PENDING, COMPLETED, FAILED, REFUNDED }
```

---

## 5. API архитектура

### 5.1 Структура сервера (server/index.ts)

```typescript
const app = new Hono()

// Middleware
app.use('*', logger())           // Логирование запросов
app.use('*', cors({ ... }))      // CORS

// Роуты
app.route('/api/auth', authRoutes)
app.route('/api/courses', coursesRoutes)
app.route('/api/lessons', lessonsRoutes)
app.route('/api/user', userRoutes)
app.route('/api/tags', tagsRoutes)
app.route('/api/reactions', reactionsRoutes)
app.route('/api/comments', commentsRoutes)
app.route('/api/admin', adminRoutes)

// Health check
app.get('/api/health', ...)

// Swagger
app.get('/api/doc', ...)   // OpenAPI документация
app.get('/api/swagger', ...) // Swagger UI

// Запуск
serve({ fetch: app.fetch, port })
```

### 5.2 Реализованные API

#### Аутентификация (auth.routes.ts) ✅
- `POST /api/auth/register` — регистрация
- `POST /api/auth/login` — вход
- `POST /api/auth/logout` — выход
- `GET /api/auth/me` — текущий пользователь

#### Курсы (courses.routes.ts) ✅
- `GET /api/courses` — список с фильтрами
- `GET /api/courses/:slug` — детали курса
- `GET /api/courses/:slug/modules` — модули курса
- `GET /api/courses/:slug/modules/:id` — уроки модуля

#### Уроки (lessons.routes.ts) ✅
- `GET /api/lessons` — список с фильтрами
- `GET /api/lessons/:slug` — детали урока
- `GET /api/lessons/:slug/content` — контент урока

#### Пользователь (user.routes.ts) ✅
- `GET /api/user/me` — профиль
- `PATCH /api/user/profile` — обновить профиль
- `GET /api/user/profile/:nickname` — публичный профиль
- `GET/POST /api/user/favorites` — избранное
- `GET/POST /api/user/history` — история
- `GET/POST /api/user/progress` — прогресс

#### Теги (tags.routes.ts) ✅
- `GET /api/tags` — список тегов
- `GET /api/tags/:slug/courses` — курсы по тегу
- `GET /api/tags/:slug/lessons` — уроки по тегу

#### Реакции (reactions.routes.ts) ✅
- `GET /api/reactions` — получить реакции
- `POST /api/reactions` — поставить реакцию
- `DELETE /api/reactions` — удалить реакцию

#### Комментарии (comments.routes.ts) ✅
- `GET /api/comments` — список комментариев
- `POST /api/comments` — добавить комментарий
- `PATCH /api/comments/:id` — редактировать
- `DELETE /api/comments/:id` — удалить

#### Админ (admin.routes.ts) ✅
- `GET /api/admin/stats` — статистика
- `GET/POST/PATCH/DELETE /api/admin/users` — пользователи
- `GET/POST/PATCH/DELETE /api/admin/courses` — курсы
- `GET/POST/PATCH/DELETE /api/admin/modules` — модули
- `GET/POST/PATCH/DELETE /api/admin/lessons` — уроки
- `GET/POST/PATCH/DELETE /api/admin/tags` — теги

#### Платежи (payments.routes.ts) 🔄
- Заглушки

### 5.3 OpenAPI документация

Встроена в `server/index.ts`:
- `GET /api/doc` — JSON спецификация
- `GET /api/swagger` — Swagger UI

---

## 6. Аутентификация и сессии

### 6.1 Архитектура сессий

Проект использует **сессионную аутентификацию** (НЕ JWT):

```
┌─────────────────────────────────────────────────────────────┐
│                      Браузер                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Cookie: session=abc123...; HttpOnly; SameSite=Strict│   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Hono Server                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │ auth.routes  │───▶│   Session    │───▶│    User      │  │
│  │   .ts        │    │   Table      │    │    Table     │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Важное примечание:** Prisma используется только для генерации типов и подключения к БД. Миграции не используются — схема применяется напрямую к базе данных.

### 6.2 Процесс входа

```typescript
// 1. Поиск пользователя
const user = await prisma.user.findUnique({
  where: { email },
  include: { profile: true }
})

// 2. Проверка пароля
const isValid = await compare(password, user.passwordHash)

// 3. Создание сессии
const session = await prisma.session.create({
  data: {
    sessionToken: crypto.randomUUID(),
    userId: user.id,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  }
})

// 4. Установка cookie
c.header('Set-Cookie', `session=${session.sessionToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${30 * 24 * 60 * 60}`)
```

### 6.3 Проверка авторизации

```typescript
// Извлечение токена из cookie
const cookie = c.req.header('Cookie')
const sessionToken = cookie?.match(/session=([^;]+)/)?.[1]

// Проверка сессии
const session = await prisma.session.findUnique({
  where: { sessionToken },
  include: { user: { include: { profile: true } } }
})

if (!session || session.expires < new Date()) {
  return c.json({ error: 'Unauthorized' }, 401)
}
```

### 6.4 Преимущества сессий перед JWT

| Аспект | Сессии | JWT |
|--------|--------|-----|
| Хранение | В БД | В клиенте |
| Отзыв | Мгновенный | Только по истечении |
| Безопасность | HttpOnly cookie | Уязвимость к XSS |
| Многодевйсность | Несколько сессий | Один токен |
| Нагрузка на БД | Запрос при каждом запросе | Минимум |

### 6.5 Текущая реализация: проблемы и ограничения

**Что реализовано:**
- ✅ Создание сессии при входе
- ✅ Проверка сессии в каждом защищённом роуте
- ✅ HttpOnly cookies
- ✅ Срок жизни 30 дней

**Что НЕ реализовано:**
- ❌ Ограничение количества сессий на пользователя
- ❌ Очистка просроченных сессий
- ❌ Защита от перебора сессий
- ❌ Middleware для проверки авторизации
- ❌ Функция "Выйти со всех устройств"
- ❌ Привязка сессии к IP/User-Agent

### 6.6 Угроза роста таблицы Session

**Проблема:** При текущей реализации таблица `Session` будет бесконтрольно расти, создавая серьёзную нагрузку на БД:

```
100 000 пользователей × 3 устройства × 365 дней = ~1 095 000 записей в год
```

**Последствия неконтролируемого роста:**
1. **Замедление запросов** — поиск сессии по token становится медленнее без индексации
2. **Увеличение времени JOIN** — при каждой авторизации делается JOIN с user
3. **Затраты на хранилище** — каждая запись занимает место
4. **Сложность резервного копирования** — большие таблицы

### 6.7 Рекомендуемые улучшения для сессий

#### 6.7.1 Ограничение количества сессий на пользователя

```typescript
// server/routes/auth.routes.ts

const MAX_SESSIONS_PER_USER = 5  // Максимум 5 устройств

async function createSession(userId: string) {
  // Проверяем количество существующих сессий
  const existingCount = await prisma.session.count({
    where: { userId }
  })

  // Если превышен лимит — удаляем самые старые
  if (existingCount >= MAX_SESSIONS_PER_USER) {
    await prisma.session.deleteMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      take: existingCount - MAX_SESSIONS_PER_USER + 1
    })
  }

  // Создаём новую сессию
  return prisma.session.create({ /* ... */ })
}
```

**Эффект:** Даже при 100 000 пользователей максимум будет ~500 000 записей.

#### 6.7.2 Автоматическая очистка просроченных сессий

**Вариант А: При каждом входе (простой)**

```typescript
async function cleanupExpiredSessions() {
  const result = await prisma.session.deleteMany({
    where: {
      expires: { lt: new Date() }
    }
  })
  console.log(`Удалено просроченных сессий: ${result.count}`)
}

// Вызывать при каждом входе
cleanupExpiredSessions()
```

**Вариант Б: Cron job (для продакшена)**

```typescript
// server/jobs/session-cleanup.ts
import { prisma } from '../db'

export async function cleanupExpiredSessions() {
  const result = await prisma.session.deleteMany({
    where: {
      expires: { lt: new Date() }
    }
  })
  return result.count
}

// Запуск раз в сутки
// setInterval(() => cleanupExpiredSessions(), 24 * 60 * 60 * 1000)
```

#### 6.7.3 Индексация таблицы Session

```prisma
// prisma/schema.prisma

model Session {
  id           String   @id
  sessionToken String   @unique  // Уникальный индекс — критически важен!
  userId       String
  expires      DateTime
  createdAt    DateTime @default(now())
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Индекс для поиска по userId (нужно для очистки старых сессий)
  @@index([userId])
  // Индекс для поиска просроченных сессий (нужно для cleanup)
  @@index([expires])
}
```

**Без индекса:** Full table scan при каждом запросе — катастрофа для производительности.

#### 6.7.4 Функция "Выйти со всех устройств"

```typescript
// server/routes/auth.routes.ts

// POST /api/auth/logout-all
auth.post('/logout-all', async (c) => {
  const user = c.get('user')  // Получаем из middleware
  if (!user) return c.json({ error: 'Unauthorized' }, 401)

  await prisma.session.deleteMany({
    where: { userId: user.id }
  })

  return c.json({ message: 'Все сессии завершены' })
})
```

#### 6.7.5 Привязка сессии к Device ID (опционально)

Для дополнительной безопасности можно привязать сессию к device/fingerprint:

```typescript
// При создании сессии
const deviceId = c.req.header('X-Device-ID')

await prisma.session.create({
  data: {
    sessionToken: crypto.randomUUID(),
    userId: user.id,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    // Дополнительные метаданные
    metadata: {
      ip: c.req.header('CF-Connecting-IP'),
      userAgent: c.req.header('User-Agent'),
      deviceId: deviceId
    }
  }
})
```

#### 6.7.6 Middleware для проверки авторизации

Создать централизованный middleware вместо проверки в каждом роуте:

```typescript
// server/middleware/auth.ts
import type { MiddlewareHandler } from 'hono'
import { prisma } from '../db'
import { AppError } from '../lib/errors'

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const cookie = c.req.header('Cookie')
  const sessionToken = cookie?.match(/session=([^;]+)/)?.[1]

  if (!sessionToken) {
    throw new AppError(401, 'Необходима авторизация', 'UNAUTHORIZED')
  }

  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: {
      user: {
        include: { profile: true }
      }
    }
  })

  if (!session || session.expires < new Date()) {
    throw new AppError(401, 'Сессия истекла', 'SESSION_EXPIRED')
  }

  // Устанавливаем user в контекст
  c.set('user', session.user)
  c.set('profile', session.user.profile)

  await next()
}

// Использование в роутах:
const protectedRoute = route.use('*', authMiddleware)

protectedRoute.get('/user/me', async (c) => {
  const user = c.get('user')
  return c.json({ user })
})
```

### 6.8 Сравнение подходов к сессиям

| Подход | Плюсы | Минусы | Рекомендация |
|--------|-------|--------|--------------|
| **Текущий** | Просто | Растёт без ограничений | ❌ Не для прода |
| **С лимитом** | Контролируемый размер | Удаляет старые устройства | ✅ |
| **С cleanup** | Автоочистка | Требует cron | ✅ |
| **JWT** | Нет нагрузки на БД | Сложный отзыв | 🤔 Альтернатива |

### 6.9 Итоговые рекомендации по сессиям

**Минимальный набор для продакшена:**

1. ✅ Добавить индексы на `sessionToken` и `userId`
2. ✅ Ограничить количество сессий (5 на пользователя)
3. ✅ Очищать просроченные сессии при входе
4. ✅ Добавить middleware для авторизации

**Дополнительно для безопасности:**

5. ✅ Функция "Выйти со всех устройств"
6. ✅ Логирование подозрительной активности
7. ✅ Привязка к IP (опционально)

**Не рекомендуется:**
- Увеличивать срок жизни сессии более 30 дней
- Создавать новую сессию при каждом действии
- Хранить sensitive данные в session metadata

---

## 7. Фронтенд архитектура

### 7.1 Точка входа (main.tsx)

```typescript
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <App />
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>,
)
```

### 7.2 Провайдеры

| Провайдер | Назначение |
|-----------|------------|
| **StrictMode** | Режим разработки с проверками |
| **QueryClientProvider** | TanStack Query для серверного стейта |
| **MantineProvider** | UI-компоненты и темизация |

### 7.3 Роутинг (App.tsx)

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { AuthLayout } from './layouts/AuthLayout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import { AdminLayout, ... } from './pages/admin'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Основные страницы */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<div>Каталог</div>} />
          <Route path="/courses" element={<div>Курсы</div>} />
          <Route path="/profile" element={<div>Профиль</div>} />
        </Route>

        {/* Авторизация */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Админ-панель */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="lessons" element={<AdminLessons />} />
          <Route path="tags" element={<AdminTags />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

### 7.4 API клиент (lib/api.ts)

```typescript
// src/lib/api.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,  // Важно для cookies
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Unauthorized')
    }
    return Promise.reject(error)
  }
)
```

### 7.5 Типы и валидация (shared/types.ts)

```typescript
// Zod схемы
export const RegisterSchema = z.object({
  email: z.string().email().transform(val => val.toLowerCase()),
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  password: z.string()
    .min(6)
    .regex(/[A-Z]/, 'Заглавная буква')
    .regex(/[a-z]/, 'Строчная буква')
    .regex(/[0-9]/, 'Цифра'),
  nickname: z.string().min(3).regex(/^[a-zA-Z0-9_]+$/),
  acceptTerms: z.boolean().refine(val => val === true)
})

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  remember: z.boolean().optional()
})

export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput = z.infer<typeof LoginSchema>
```

---

## 8. Компонентная структура

### 8.1 Layout компоненты

#### MainLayout
```typescript
// src/layouts/MainLayout.tsx
export function MainLayout() {
  return (
    <Box style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" style={{ flex: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  )
}
```

**Используется для:** Главной страницы, каталога, курсов, профиля

#### AuthLayout
```typescript
// src/layouts/AuthLayout.tsx
export function AuthLayout() {
  return (
    <Box style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Outlet />
      </Box>
    </Box>
  )
}
```

**Используется для:** Страниц входа и регистрации

#### AdminLayout
```typescript
// src/pages/admin/AdminLayout.tsx
// Использует AppShell от Mantine
<AppShell>
  <AppShell.Header>...</AppShell.Header>
  <AppShell.Navbar>...</AppShell.Navbar>
  <AppShell.Main>...</AppShell.Main>
</AppShell>
```

**Используется для:** Всех страниц админ-панели

### 8.2 Header компонент

Функции:
- Навигация по сайту
- Отображение состояния авторизации
- Мобильное меню (Drawer)
- Выпадающее меню пользователя

Особенности:
- Sticky позиционирование с blur при скролле
- Адаптивность (десктоп/мобильный)
- Проверка авторизации через `/api/auth/me`

### 8.3 Footer компонент

Функции:
- Навигационные ссылки (4 колонки)
- Социальные сети
- Копирайт

### 8.4 Страницы авторизации

#### LoginPage
- Форма с email и паролем
- Чекбокс "Запомнить меня"
- Ссылка на регистрацию
- Сообщения об ошибках

#### RegisterPage
- Форма с множеством полей
- Индикаторы сложности пароля
- Чекбокс принятия условий
- Валидация в реальном времени

---

## 9. Взаимосвязи между модулями

### 9.1 Диаграмма потоков данных

```
┌──────────────────────────────────────────────────────────────────┐
│                         Браузер                                  │
│  ┌─────────┐    ┌─────────┐    ┌──────────┐    ┌─────────────┐ │
│  │ React   │───▶│ Router  │───▶│ Pages    │───▶│ Components  │ │
│  │ App     │    │         │    │          │    │             │ │
│  └─────────┘    └─────────┘    └──────────┘    └─────────────┘ │
│       │                                      │                   │
│       ▼                                      ▼                   │
│  ┌─────────┐                          ┌──────────┐              │
│  │ Zustand │                          │ TanStack │              │
│  │ Store   │                          │ Query    │              │
│  └─────────┘                          └──────────┘              │
│       │                                      │                   │
│       └──────────────┬──────────────────────┘                   │
│                      ▼                                           │
│              ┌─────────────┐                                     │
│              │ Axios / API │                                     │
│              └─────────────┘                                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                      Vite Dev Server                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Прокси /api/* ──────────────────────────────│  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                        Hono Server                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Middleware: logger(), cors()                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│       │                                                        │
│       ▼                                                        │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐   │
│  │ Auth    │  │Courses  │  │Lessons  │  │ Admin           │   │
│  │ Routes  │  │ Routes  │  │ Routes  │  │ Routes          │   │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────────┬────────┘   │
│       │            │            │                 │             │
│       └────────────┴────────────┴────────┬────────┘             │
│                                           │                      │
│                                           ▼                      │
│                                  ┌────────────────┐              │
│                                  │   Prisma ORM   │              │
│                                  └────────┬───────┘              │
│                                           │                      │
│                                           ▼                      │
│                                  ┌────────────────┐              │
│                                  │  MySQL Database│              │
│                                  └────────────────┘              │
└──────────────────────────────────────────────────────────────────┘
```

### 9.2 Ключевые зависимости

| Модуль | Зависит от | Использует |
|--------|------------|------------|
| **App.tsx** | react-router-dom | Routes, Route |
| **MainLayout** | Header, Footer | Outlet |
| **Header** | react-router-dom | Link, useLocation |
| **LoginPage** | react-hook-form, zod | useForm, zodResolver |
| **LoginPage** | @tanstack/react-query | useMutation |
| **api.ts** | axios | axios.create |
| **auth.routes.ts** | prisma, bcryptjs | hash, compare |
| **courses.routes.ts** | prisma | findMany, findUnique |

### 9.3 Поток авторизации

```
1. Пользователь заполняет форму LoginPage
   │
   ▼
2. react-hook-form валидирует данные через Zod
   │
   ▼
3. TanStack Query useMutation отправляет POST /api/auth/login
   │
   ▼
4. Axios отправляет запрос с credentials: include
   │
   ▼
5. Vite проксирует /api/* на Hono сервер
   │
   ▼
6. Hono auth.routes проверяет credentials в БД
   │
   ▼
7. Hono создаёт сессию и устанавливает cookie
   │
   ▼
8. Ответ возвращается, useMutation.onSuccess выполняет navigate
```

---

## 10. Текущие проблемы и ограничения

### 10.1 Критические проблемы

| Проблема | Описание | Влияние |
|----------|----------|---------|
| **Отсутствует @tabler/icons-react** | Импорт в RegisterPage не работает | Ошибка сборки |
| **Заглушки API** | Платежи, модерация не реализованы | Ограниченный функционал |
| **Рост таблицы Session** | Нет лимита и очистки сессий | Нагрузка на БД |

### 10.2 Технический долг

| Проблема | Описание | Рекомендация |
|----------|----------|--------------|
| **Дублирование кода** | В RegisterPage был дубликат | Удалён |
| **Неиспользуемые импорты** | MenuIcon в Header | Удалён |
| **Заглушки middleware** | auth.ts, logger.ts пустые | Реализовать |
| **Нет защиты роутов** | Каждый роут сам проверяет сессию | Добавить middleware |
| **Рост таблицы Session** | Нет лимита и очистки | Добавить ограничения |
| **Нет индексов в БД** | Медленные запросы | Добавить индексы |

### 10.3 Архитектурные ограничения

| Ограничение | Описание |
|-------------|----------|
| **Нет rate limiting** | Уязвимость к DDoS |
| **Нет логирования** | Сложно отлаживать |
| **Нет кэширования** | Каждый запрос в БД |
| **Нет пагинации на фронтенде** | Нужно добавить |

---

## 11. Рекомендации по развитию

### 11.1 Краткосрочные (1-2 недели)

1. **Установить @tabler/icons-react**
   ```bash
   npm install @tabler/icons-react
   ```

2. **Оптимизировать таблицу сессий**
   - Добавить индексы на `sessionToken`, `userId`, `expires`
   - Ограничить количество сессий (5 на пользователя)
   - Добавить очистку просроченных сессий

3. **Добавить middleware защиты**
   - Создать `server/middleware/auth.ts`
   - Применять к защищённым роутам

4. **Реализовать страницы**
   - CatalogPage
   - CoursePage
   - LessonPage
   - ProfilePage

### 11.2 Среднесрочные (1-2 месяца)

1. **Калькуляторы**
   - Кредитный калькулятор
   - Калькулятор вкладов
   - Ипотечный калькулятор

2. **Улучшение админ-панели**
   - Модерация контента
   - Аналитика

3. **Оптимизация**
   - Rate limiting
   - Кэширование
   - Логирование

### 11.3 Долгосрочные (3-6 месяцев)

1. **Платежи**
   - Интеграция с ЮKassa
   - Подписки

2. **OAuth**
   - Google
   - VK
   - Яндекс

3. **Производительность**
   - SSR/SSG
   - Оптимизация бандла

---

## 12. Roadmap развития

### Фаза 1: Базовая функциональность (текущая)

- [x] Регистрация/вход
- [x] Header/Footer
- [x] Главная страница
- [x] API курсов
- [x] API уроков
- [ ] API пользователя (профиль)
- [ ] Каталог
- [ ] Страница курса
- [ ] Страница урока

### Фаза 2: Личный кабинет

- [ ] Профиль пользователя
- [ ] Избранное
- [ ] История просмотров
- [ ] Прогресс обучения
- [ ] Сертификаты

### Фаза 3: Расширенный функционал

- [ ] Калькуляторы
- [ ] Модерация контента
- [ ] Платежи (имитация)
- [ ] Уведомления

### Фаза 4: Масштабирование

- [ ] OAuth провайдеры
- [ ] Оптимизация производительности
- [ ] Тестирование
- [ ] Документация API

---

## Приложение: Команды для работы

```bash
# Запуск dev сервера
npm run dev

# Запуск только бэкенда
npx tsx server/index.ts

# Сборка
npm run build

# Линтинг
npm run lint

# Prisma (только генерация типов, миграции не используются)
npx prisma generate     # Генерация TypeScript клиента
npx prisma studio       # Просмотр БД (опционально)

# TypeScript проверка
npx tsc --noEmit
```

---

*Документация создана: март 2026*
*Версия: 1.0*
*Автор: AI Assistant*
