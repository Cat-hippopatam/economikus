# Экономикус (Economikus) - Техническая документация

> Подробное техническое описание проекта для разработчиков и архитекторов

---

## Содержание

1. [Обзор проекта](#1-обзор-проекта)
2. [Технологический стек](#2-технологический-стек)
3. [База данных](#3-база-данных)
4. [API Endpoints](#4-api-endpoints)
5. [Страницы и маршруты](#5-страницы-и-маршруты)
6. [Компоненты](#6-компоненты)
7. [Формы и валидация](#7-формы-и-валидация)
8. [Модальные окна](#8-модальные-окна)
9. [Калькуляторы](#9-калькуляторы)
10. [Админ-панель](#10-админ-панель)
11. [Аутентификация](#11-аутентификация)
12. [Структура проекта](#12-структура-проекта)

---

## 1. Обзор проекта

**Название**: Экономикус (Economikus)  
**Тип**: Образовательная платформа (LMS — Learning Management System)  
**Веб-сайт**: economikus.ru  

Платформа для обучения финансам и инвестициям. Включает курсы, модули, уроки (статьи, видео, аудио, квизы), подписки, платежи и сертификаты.

### Архитектура

Проект построен на современном стеке:
- **Frontend**: React 19 + Vite 6
- **Backend**: Hono (edge-ready HTTP-фреймворк) на порту 3000
- **База данных**: MySQL + Prisma ORM 5.22.0

### Статус реализации

| Модуль | Статус |
|--------|--------|
| Header / Footer | ✅ Реализовано |
| Страницы авторизации | ✅ Реализовано (login, register) |
| Главная страница | ✅ Реализовано |
| Аутентификация API | ✅ Реализовано (register, login, logout, me) |
| API курсов | ✅ Реализовано (CRUD, фильтры, пагинация) |
| API уроков | ✅ Реализовано (CRUD, фильтры, пагинация) |
| API пользователя | ✅ Реализовано (profile, history, favorites, progress) |
| API тегов | ✅ Реализовано (CRUD) |
| API комментариев | ✅ Реализовано (CRUD) |
| API реакций | ✅ Реализовано (like/dislike) |
| API модерации | 🔄 Заглушка |
| API платежей | 🔄 Заглушка |
| Админ-панель | ✅ Реализовано (dashboard, users, courses, lessons, tags) |
| Страницы каталога | ❌ Не реализовано |
| Страницы профиля | ❌ Не реализовано |
| Калькуляторы | ❌ Не реализовано |

### Целевая аудитория

1. **Стартующий (18-24 года)**: студенты, мало денег, нужны базовые знания
2. **Строитель (25-34 года)**: есть доход, нет времени, боится ошибок
3. **Семьянин (35-44 года)**: есть накопления, нужна безопасная стратегия

---

## 2. Технологический стек

| Категория         | Технология                                                            |
| ----------------- | --------------------------------------------------------------------- |
| Frontend          | React 19 + Vite 6                                                     |
| Backend           | Hono 4.x + @hono/node-server                                          |
| Язык              | TypeScript                                                            |
| База данных       | MySQL + Prisma ORM 5.22.0                                            |
| Аутентификация    | Сессии через cookies (bcryptjs для хэширования)                      |
| UI-библиотека     | Mantine v8                                                            |
| Стили             | TailwindCSS v4                                                        |
| Стейт-менеджмент  | Zustand                                                               |
| Валидация         | Zod + react-hook-form + @hookform/resolvers                          |
| HTTP-клиент       | TanStack Query (@tanstack/react-query)                               |
| Линтинг           | ESLint                                                                |
| Иконки            | Lucide React                                                          |
| Роутинг           | react-router-dom 7.x                                                  |

---

## 2.1. Правила разработки

### Алиасы путей (Path Aliases)

В проекте настроены алиасы для удобного импорта файлов:

```typescript
// ✅ Правильно — используйте алиас @/
import { api } from '@/lib/api'
import { Button } from '@/components/Button'

// ❌ Неправильно — не используйте относительные пути
import { api } from '../../libми, а такжке дальнейший трекер развитяи/api'
import { Button } from '../components/Button'
```

**Настройка:**
- `vite.config.ts` — алиас `@` → `./src`
- `tsconfig.app.json` — paths `@/*` → `src/*`

### Иконки

В проекте используется библиотека **Lucide React** для иконок.

```typescript
// ✅ Правильно
import { Plus, Search, MoreVertical, Pencil, Trash2 } from 'lucide-react'

// ❌ Неправильно — @mantine/icons не существует в Mantine v7
import { IconPlus, IconSearch } from '@mantine/icons'
```

**Часто используемые иконки:**
| Действие | Иконка |
|----------|--------|
| Добавить | `Plus` |
| Поиск | `Search` |
| Меню | `MoreVertical` |
| Редактировать | `Pencil` |
| Удалить | `Trash2` |
| Просмотр | `Eye` |
| Настройки | `Settings` |
| Пользователь | `User` |
| Выход | `LogOut` |

---

```json
{
  "dependencies": {
    "@hono/zod-validator": "^0.7.6",
    "@hookform/resolvers": "^5.2.2",
    "@mantine/core": "^8.3.16",
    "@mantine/hooks": "^8.3.16",
    "@prisma/client": "^5.22.0",
    "@tanstack/react-query": "^5.90.21",
    "bcryptjs": "^3.0.3",
    "hono": "^4.12.7",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-hook-form": "^7.71.2",
    "react-router-dom": "^7.13.1",
    "zod": "^4.3.6",
    "zustand": "^5.0.11"
  },
  "devDependencies": {
    "@hono/vite-dev-server": "^0.25.1",
    "prisma": "^5.22.0",
    "tsx": "^4.21.0",
    "vite": "^6.3.5"
  }
}
```

---
Важный совет (Persist):

Если вы хотите, чтобы данные в Zustand **не пропадали при перезагрузке страницы**, используйте встроенный мидлвар `persist`:

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUserStore = create(
  persist(
    (set) => ({ /* ваш стор */ }),
    { name: 'user-storage' } // имя ключа в LocalStorage
  )
)
```

## 3. База данных

### 3.1 Схема MySQL (Prisma ORM)

Проект использует схему MySQL с 28 моделями:

#### Основные модели

| Модель | Назначение | Ключевые поля |
|--------|------------|---------------|
| **User** | Пользователь системы | email, firstName, lastName, role, isBlocked |
| **Profile** | Публичный профиль | userId, nickname, displayName, avatarUrl, bio |
| **Course** | Курсы | title, slug, description, coverImage, difficultyLevel, isPremium |
| **Module** | Модули внутри курсов | courseId, title, sortOrder, lessonsCount |
| **Lesson** | Уроки (статьи, видео, аудио, квизы) | moduleId, title, slug, lessonType, isPremium |
| **TextContent** | Текстовый контент урока | lessonId, body, wordCount, readingTime |
| **VideoContent** | Видеоконтент урока | lessonId, videoUrl, provider, duration |
| **AudioContent** | Аудиоконтент урока | lessonId, audioUrl, duration |
| **QuizContent** | Квизы | lessonId, questions, passingScore |
| **Tag** | Теги | name, slug, color |
| **CourseTag** | Связь тегов с курсами | courseId, tagId |
| **LessonTag** | Связь тегов с уроками | lessonId, tagId |
| **Comment** | Комментарии | commentableType, commentableId, authorProfileId, text |
| **Reaction** | Лайки/дизлайки (курсы, уроки, комментарии) | profileId, type, reactionableType, reactionableId |
| **Favorite** | Избранное | profileId, lessonId, collection |
| **History** | История просмотров | profileId, historableType, historableId, watchedSeconds |
| **CourseProgress** | Прогресс прохождения курса | profileId, courseId, status, progressPercent |
| **LessonProgress** | Прогресс прохождения урока | profileId, lessonId, status, progressPercent |
| **Subscription** | Подписки пользователей | profileId, planType, status, startDate, endDate |
| **Transaction** | Транзакции и платежи | profileId, type, amount, status, provider |
| **PaymentMethod** | Методы оплаты | profileId, type, provider, last4, cardType |
| **Certificate** | Сертификаты курсов | profileId, courseId, certificateNumber, imageUrl |
| **Notification** | Уведомления | profileId, type, title, body, isRead |
| **BusinessEvent** | События аналитики | profileId, eventType, eventCategory, metadata |
| **Session** | Сессии пользователей | sessionToken, userId, expires |
| **Account** | OAuth аккаунты | userId, provider, providerAccountId |
| **VerificationToken** | Токены верификации | identifier, token, expires |
| **Authenticator** | WebAuthn аутентификаторы | userId, credentialID, credentialPublicKey |

#### 3.2 Enums (перечисления)

```prisma
// Роли пользователей
enum Role {
  USER      // Обычный пользователь
  AUTHOR    // Автор контента
  MODERATOR // Модератор
  ADMIN     // Администратор
}

// Статусы контента
enum ContentStatus {
  DRAFT           // Черновик
  PENDING_REVIEW  // На модерации
  PUBLISHED       // Опубликован
  ARCHIVED        // В архиве
  DELETED         // Удалён (soft delete)
}

// Уровень сложности курса
enum DifficultyLevel {
  BEGINNER      // Начинающий
  INTERMEDIATE  // Средний
  ADVANCED      // Продвинутый
}

// Тип видео-провайдера
enum VideoProvider {
  YOUTUBE
  RUTUBE
  VIMEO
  LOCAL
}

// Типы уроков
enum LessonType {
  ARTICLE   // Статья
  VIDEO     // Видео
  AUDIO     // Аудио
  QUIZ      // Тест/квиз
  CALCULATOR // Калькулятор
}

// Типы комментируемых объектов
enum CommentableType {
  COURSE
  LESSON
}

// Типы объектов для реакций
enum ReactionableType {
  COURSE
  LESSON
  COMMENT
}

// Статусы подписки
enum SubscriptionStatus {
  ACTIVE      // Активна
  PAST_DUE    // Просрочена
  CANCELED    // Отменена
  EXPIRED     // Истекла
}

// Статусы транзакций
enum TransactionStatus {
  PENDING    // В ожидании
  COMPLETED  // Завершена
  FAILED     // Ошибка
  REFUNDED   // Возвращена
}

// Типы реакций
enum ReactionType {
  LIKE
  DISLIKE
}

// Статусы модерации
enum ModerationStatus {
  PENDING   // На рассмотрении
  APPROVED  // Одобрено
  REJECTED  // Отклонено
}

// Типы уведомлений
enum NotificationType {
  EMAIL
  IN_APP
  TELEGRAM
}

// Типы объектов для истории
enum HistorableType {
  LESSON
  STANDALONE_ARTICLE
}

// Типы бизнес-объектов
enum BusinessObjectType {
  COURSE
  LESSON
  COMMENT
  SUBSCRIPTION
}
```

#### 3.3 Особенности реализации

- **Soft Delete**: Многие модели имеют поле `deletedAt` для мягкого удаления
- **User vs Profile**: 
  - User — аутентификация и безопасность (email, passwordHash, role)
  - Profile — контент и активности (courses, lessons, comments, reactions)
- **Полиморфизм уроков**: Lesson содержит lessonType и связанные таблицы (TextContent, VideoContent, AudioContent, QuizContent)
- **Кешированная статистика**: Course и Lesson хранят viewsCount, likesCount

---

## 4. API Endpoints

API построен на Hono фреймворке. Все роуты находятся в `server/index.ts`.

### 4.1 Аутентификация ✅ Реализовано

| № | Метод | Путь | Описание | Доступ |
|---|-------|------|----------|--------|
| 1 | POST | `/api/auth/register` | Регистрация нового пользователя | Все |
| 2 | POST | `/api/auth/login` | Вход по email/password | Все |
| 3 | POST | `/api/auth/logout` | Выход | Авторизованный |
| 4 | GET | `/api/auth/me` | Текущий пользователь (по сессии) | Авторизованный |

**Примеры запросов:**

```json
// POST /api/auth/register
{
  "email": "user@example.com",
  "firstName": "Иван",
  "lastName": "Петров",
  "password": "Password123",
  "nickname": "ivan_petrov"
}

// POST /api/auth/login
{
  "email": "user@example.com",
  "password": "Password123",
  "remember": true
}
```

### 4.2 Курсы ✅ Реализовано

| № | Метод | Путь | Описание | Доступ |
|---|-------|------|----------|--------|
| 5 | GET | `/api/courses` | Список курсов с пагинацией и фильтрами | Все |
| 6 | GET | `/api/courses/:slug` | Детальная страница курса | Все |
| 7 | GET | `/api/courses/:slug/modules` | Модули курса | Все |
| 8 | GET | `/api/courses/:slug/modules/:id` | Модуль с уроками | Все |

### 4.3 Уроки ✅ Реализовано

| № | Метод | Путь | Описание | Доступ |
|---|-------|------|----------|--------|
| 9 | GET | `/api/lessons` | Список уроков с фильтрами | Все |
| 10 | GET | `/api/lessons/:slug` | Детальная страница урока | Все |
| 11 | GET | `/api/lessons/:slug/content` | Контент урока (текст/видео/аудио) | Все |

### 4.4 Пользователь ✅ Реализовано

| № | Метод | Путь | Описание | Доступ |
|---|-------|------|----------|--------|
| 12 | GET | `/api/user/me` | Текущий пользователь | Авторизованный |
| 13 | PATCH | `/api/user/profile` | Обновление профиля | Авторизованный |
| 14 | GET | `/api/user/profile/:nickname` | Публичный профиль | Все |
| 15 | GET | `/api/user/history` | История просмотров | Авторизованный |
| 16 | POST | `/api/user/history` | Добавить в историю | Авторизованный |
| 17 | GET | `/api/user/favorites` | Избранное | Авторизованный |
| 18 | POST | `/api/user/favorites` | Добавить в избранное | Авторизованный |
| 19 | DELETE | `/api/user/favorites/:id` | Удалить из избранного | Авторизованный |
| 20 | GET | `/api/user/progress/courses` | Прогресс по курсам | Авторизованный |
| 21 | GET | `/api/user/progress/lessons/:id` | Прогресс по уроку | Авторизованный |
| 22 | POST | `/api/user/progress/lessons/:id` | Обновить прогресс | Авторизованный |
| 23 | GET | `/api/user/certificates` | Сертификаты | Авторизованный |

### 4.5 Реакции ✅ Реализовано

| № | Метод | Путь | Описание | Доступ |
|---|-------|------|----------|--------|
| 24 | GET | `/api/reactions` | Получить реакции | Все |
| 25 | POST | `/api/reactions` | Поставить реакцию | Авторизованный |
| 26 | DELETE | `/api/reactions` | Удалить реакцию | Авторизованный |

### 4.6 Теги ✅ Реализовано

| № | Метод | Путь | Описание | Доступ |
|---|-------|------|----------|--------|
| 27 | GET | `/api/tags` | Список тегов | Все |
| 28 | GET | `/api/tags/:slug/courses` | Курсы по тегу | Все |
| 29 | GET | `/api/tags/:slug/lessons` | Уроки по тегу | Все |

### 4.7 Комментарии ✅ Реализовано

| № | Метод | Путь | Описание | Доступ |
|---|-------|------|----------|--------|
| 30 | GET | `/api/comments` | Список комментариев | Все |
| 31 | POST | `/api/comments` | Добавить комментарий | Авторизованный |
| 32 | PATCH | `/api/comments/:id` | Редактировать комментарий | Авторизованный |
| 33 | DELETE | `/api/comments/:id` | Удалить комментарий | Авторизованный |

### 4.8 Платежи 🔄 Заглушка

| № | Метод | Путь | Описание | Доступ |
|---|-------|------|----------|--------|
| 38 | GET | `/api/payment/plans` | Тарифы подписки | Все |
| 39 | POST | `/api/payment/subscribe` | Оформление подписки | Авторизованный |
| 40 | POST | `/api/payment/cancel` | Отмена подписки | Авторизованный |

### 4.9 Модерация 🔄 Заглушка

| № | Метод | Путь | Описание | Доступ |
|---|-------|------|----------|--------|
| 34 | GET | `/api/moderation` | Контент на модерации | MODERATOR, ADMIN |
| 35 | POST | `/api/moderation/:id/approve` | Одобрить контент | MODERATOR, ADMIN |
| 36 | POST | `/api/moderation/:id/reject` | Отклонить контент | MODERATOR, ADMIN |

### 4.10 Администрирование ✅ Реализовано

| № | Метод | Путь | Описание | Доступ |
|---|-------|------|----------|--------|
| 37 | GET | `/api/admin/stats` | Статистика системы | ADMIN |
| 38 | GET | `/api/admin/users` | Список пользователей | ADMIN |
| 39 | PATCH | `/api/admin/users/:id` | Изменить пользователя | ADMIN |
| 40 | DELETE | `/api/admin/users/:id` | Удалить пользователя | ADMIN |
| 41 | GET | `/api/admin/courses` | Список курсов (админ) | ADMIN |
| 42 | POST | `/api/admin/courses` | Создать курс | ADMIN |
| 43 | PATCH | `/api/admin/courses/:id` | Обновить курс | ADMIN |
| 44 | DELETE | `/api/admin/courses/:id` | Удалить курс | ADMIN |
| 45 | GET | `/api/admin/modules` | Список модулей | ADMIN |
| 46 | POST | `/api/admin/modules` | Создать модуль | ADMIN |
| 47 | PATCH | `/api/admin/modules/:id` | Обновить модуль | ADMIN |
| 48 | DELETE | `/api/admin/modules/:id` | Удалить модуль | ADMIN |
| 49 | GET | `/api/admin/lessons` | Список уроков (админ) | ADMIN |
| 50 | POST | `/api/admin/lessons` | Создать урок | ADMIN |
| 51 | PATCH | `/api/admin/lessons/:id` | Обновить урок | ADMIN |
| 52 | DELETE | `/api/admin/lessons/:id` | Удалить урок | ADMIN |
| 53 | GET | `/api/admin/lessons/:id/content` | Контент урока | ADMIN |
| 54 | PATCH | `/api/admin/lessons/:id/content` | Обновить контент | ADMIN |
| 55 | GET | `/api/admin/tags` | Список тегов (админ) | ADMIN |
| 56 | POST | `/api/admin/tags` | Создать тег | ADMIN |
| 57 | PATCH | `/api/admin/tags/:id` | Обновить тег | ADMIN |
| 58 | DELETE | `/api/admin/tags/:id` | Удалить тег | ADMIN |

### 4.11 Каталог 🔄 Заглушка

| № | Метод | Путь | Описание | Доступ |
|---|-------|------|----------|--------|
| 48 | GET | `/api/catalog` | Каталог с фильтрами | Все |

### 4.12 Health Check

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/health` | Проверка работоспособности сервера |

**Параметры запроса `/api/courses`:**
- `page` — номер страницы (по умолчанию 1)
- `limit` — количество на странице (по умолчанию 20)
- `status` — фильтр по статусу (PUBLISHED, DRAFT)
- `difficulty` — фильтр по сложности (BEGINNER, INTERMEDIATE, ADVANCED)
- `tag` — фильтр по тегу (slug тега)
- `search` — поиск по названию
- `author` — фильтр по автору
- `isPremium` — фильтр по premium статусу
- `sort` — сортировка (created_at_desc, created_at_asc, popular)

---

## 5. Страницы и маршруты

Проект использует Vite + React Router 7. Маршруты настраиваются в `src/App.tsx`.

### 5.1 Текущая реализация

**Реализованные страницы:**

| № | Путь | Компонент | Описание | Статус |
|---|------|-----------|----------|--------|
| 1 | `/` | `src/pages/HomePage.tsx` | Главная страница | ✅ |
| 2 | `/login` | `src/pages/auth/LoginPage.tsx` | Страница входа | ✅ |
| 3 | `/register` | `src/pages/auth/RegisterPage.tsx` | Страница регистрации | ✅ |
| 4 | `/catalog` | Заглушка | Каталог курсов | 🔄 |
| 5 | `/courses` | Заглушка | Список курсов | 🔄 |
| 6 | `/calculators` | Заглушка | Калькуляторы | 🔄 |
| 7 | `/profile` | Заглушка | Профиль пользователя | 🔄 |

**Админ-панель (реализовано):**

| № | Путь | Компонент | Описание | Статус |
|---|------|-----------|----------|--------|
| 8 | `/admin` | `src/pages/admin/AdminDashboard.tsx` | Дашборд | ✅ |
| 9 | `/admin/courses` | `src/pages/admin/AdminCourses.tsx` | Управление курсами | ✅ |
| 10 | `/admin/lessons` | `src/pages/admin/AdminLessons.tsx` | Управление уроками | ✅ |
| 11 | `/admin/tags` | `src/pages/admin/AdminTags.tsx` | Управление тегами | ✅ |
| 12 | `/admin/users` | `src/pages/admin/AdminUsers.tsx` | Управление пользователями | ✅ |

**Layouts:**

| Layout | Компонент | Описание |
|--------|-----------|----------|
| MainLayout | `src/layouts/MainLayout.tsx` | Header + Footer |
| AuthLayout | `src/layouts/AuthLayout.tsx` | Только Header, центрированный контент |

### 5.2 Планируемые публичные маршруты

| № | Путь | Компонент | Описание |
|---|------|-----------|----------|
| 8 | `/course/:slug` | `src/pages/CoursePage.tsx` | Детальная страница курса |
| 9 | `/course/:slug/module/:moduleId` | `src/pages/ModulePage.tsx` | Страница модуля |
| 10 | `/lesson/:slug` | `src/pages/LessonPage.tsx` | Страница урока |
| 11 | `/faq` | `src/pages/FaqPage.tsx` | Вопросы и ответы |
| 12 | `/tools` | `src/pages/ToolsPage.tsx` | Инструменты |
| 13 | `/calculator/credit` | `src/pages/CalculatorPage.tsx` | Кредитный калькулятор |
| 14 | `/calculator/deposit` | `src/pages/CalculatorPage.tsx` | Калькулятор вкладов |
| 15 | `/calculator/mortgage` | `src/pages/CalculatorPage.tsx` | Ипотечный калькулятор |

### 5.3 Планируемые защищённые маршруты

| № | Путь | Компонент | Описание | Требование |
|---|------|-----------|----------|------------|
| 16 | `/profile` | `src/pages/ProfilePage.tsx` | Личный кабинет | Авторизация |
| 17 | `/profile/courses` | `src/pages/ProfileCoursesPage.tsx` | Мои курсы | Авторизация |
| 18 | `/profile/favorites` | `src/pages/ProfileFavoritesPage.tsx` | Избранное | Авторизация |
| 19 | `/profile/settings` | `src/pages/ProfileSettingsPage.tsx` | Настройки профиля | Авторизация |
| 20 | `/profile/subscription` | `src/pages/ProfileSubscriptionPage.tsx` | Подписка | Авторизация |
| 21 | `/profile/history` | `src/pages/ProfileHistoryPage.tsx` | История просмотров | Авторизация |
| 22 | `/profile/certificates` | `src/pages/ProfileCertificatesPage.tsx` | Мои сертификаты | Авторизация |

### 5.4 Планируемые админ-маршруты

| № | Путь | Компонент | Описание | Требование |
|---|------|-----------|----------|------------|
| 23 | `/admin` | `src/pages/admin/AdminPage.tsx` | Главная админ-панель | ADMIN |
| 24 | `/admin/users` | `src/pages/admin/AdminUsersPage.tsx` | Управление пользователями | ADMIN |
| 25 | `/admin/content` | `src/pages/admin/AdminContentPage.tsx` | Управление контентом | ADMIN |
| 26 | `/admin/moderation` | `src/pages/admin/AdminModerationPage.tsx` | Модерация контента | MODERATOR, ADMIN |
| 27 | `/admin/stats` | `src/pages/admin/AdminStatsPage.tsx` | Статистика | ADMIN |

### 5.5 Планируемые автор-маршруты

| № | Путь | Компонент | Описание | Требование |
|---|------|-----------|----------|------------|
| 28 | `/author/dashboard` | `src/pages/author/AuthorDashboardPage.tsx` | Панель автора | AUTHOR, ADMIN |
| 29 | `/author/courses/new` | `src/pages/author/AuthorCourseNewPage.tsx` | Создание курса | AUTHOR, ADMIN |
| 30 | `/author/courses/:id/edit` | `src/pages/author/AuthorCourseEditPage.tsx` | Редактирование курса | AUTHOR, ADMIN |

---

## 6. Компоненты

### 6.1 Текущая структура

На данный момент компоненты не вынесены в отдельную папку. Весь UI используется напрямую из Mantine в страницах.

**Используемые компоненты Mantine:**
- `Container`, `Paper`, `Stack`, `Group`, `Box`
- `TextInput`, `PasswordInput`, `Checkbox`
- `Button`, `Title`, `Text`
- `Alert`, `Divider`, `LoadingOverlay`
- `Table`

### 6.2 Планируемые общие компоненты (`src/components/common/`)

| № | Компонент | Назначение | Параметры |
|---|-----------|------------|-----------|
| 1 | `Button.tsx` | Универсальная кнопка (Mantine Button) | variant, size, disabled, isLoading |
| 2 | `Input.tsx` | Поле ввода (Mantine Input) | error, type, placeholder, value |
| 3 | `Slider.tsx` | Слайдер с мин/макс | min, max, step, value, onChange, formatLabel |
| 4 | `Card.tsx` | Карточка контента | title, description, image, link |
| 5 | `Modal.tsx` | Модальное окно (Mantine Modal) | isOpen, onClose, title, children |
| 6 | `Header.tsx` | Шапка сайта | - |
| 7 | `Footer.tsx` | Подвал сайта | - |
| 8 | `Reactions.tsx` | Лайки/дизлайки контента | contentId, initialLikes, initialDislikes |
| 9 | `ViewTracker.tsx` | Отслеживание просмотров | contentId |
| 10 | `Loader.tsx` | Индикатор загрузки | size, color |
| 11 | `EmptyState.tsx` | Пустое состояние | title, description, action |

### 6.3 Планируемые компоненты калькуляторов (`src/components/calculators/`)

| № | Компонент | Назначение |
|---|-----------|------------|
| 12 | `CreditForm.tsx` | Форма кредитного калькулятора |
| 13 | `CreditChart.tsx` | График платежей по кредиту |
| 14 | `CreditResults.tsx` | Результаты расчёта кредита |
| 15 | `DepositForm.tsx` | Форма калькулятора вкладов |
| 16 | `DepositChart.tsx` | График начисления процентов |
| 17 | `DepositResults.tsx` | Результаты расчёта вклада |
| 18 | `MortgageForm.tsx` | Форма ипотечного калькулятора |
| 19 | `MortgageChart.tsx` | График ипотечных платежей |
| 20 | `MortgageResults.tsx` | Результаты расчёта ипотеки |

### 6.4 Планируемые компоненты главной страницы (`src/components/home/`)

| № | Компонент | Назначение |
|---|-----------|------------|
| 21 | `HeroSection.tsx` | Герой-секция с призывом к действию |
| 22 | `FeaturesSection.tsx` | Секция особенностей платформы |
| 23 | `CourseCard.tsx` | Карточка курса |
| 24 | `ArticleCard.tsx` | Карточка статьи/урока |
| 25 | `TestimonialsSection.tsx` | Отзывы пользователей |
| 26 | `PricingSection.tsx` | Тарифы подписки |

### 6.5 Планируемые компоненты профиля (`src/components/profile/`)

| № | Компонент | Назначение |
|---|-----------|------------|
| 27 | `CourseList.tsx` | Список курсов пользователя |
| 28 | `CourseStats.tsx` | Статистика курсов |
| 29 | `Certificates.tsx` | Сертификаты |
| 30 | `ContinueLearning.tsx` | Продолжить обучение |
| 31 | `FavoritesGrid.tsx` | Сетка избранного |
| 32 | `CollectionsList.tsx` | Коллекции избранного |
| 33 | `ProfileForm.tsx` | Форма редактирования профиля |
| 34 | `AvatarUpload.tsx` | Загрузка аватара |
| 35 | `SocialLinks.tsx` | Социальные сети |
| 36 | `SubscriptionStatus.tsx` | Статус подписки |
| 37 | `PaymentHistory.tsx` | История платежей |
| 38 | `CancelSubscription.tsx` | Отмена подписки |

### 6.6 Планируемые админ-компоненты (`src/components/admin/`)

| № | Компонент | Назначение |
|---|-----------|------------|
| 39 | `UserTable.tsx` | Таблица пользователей с пагинацией |
| 40 | `ContentTable.tsx` | Таблица контента |
| 41 | `ModerationQueue.tsx` | Очередь модерации |
| 42 | `StatsCards.tsx` | Карточки статистики |
| 43 | `UserFilters.tsx` | Фильтры пользователей |
| 44 | `ContentFilters.tsx` | Фильтры контента |

---

## 7. Формы и валидация

### 7.1 Форма входа ✅ Реализовано (`src/pages/auth/LoginPage.tsx`)

**Используемые библиотеки:**
- `react-hook-form` — управление формой
- `@hookform/resolvers/zod` — интеграция с Zod
- `@tanstack/react-query` — мутация для отправки

**Валидация:**
```typescript
// Zod схема (src/shared/types.ts)
export const LoginSchema = z.object({
  email: z.string()
    .email('Некорректный email')
    .min(5)
    .transform((val) => val.toLowerCase()),
  password: z.string().min(6, 'Пароль слишком короткий'),
  remember: z.boolean().optional()
})
```

**Поля формы:**
- `email` — type="email", обязательное
- `password` — type="password", обязательное, минимум 6 символов
- `remember` — checkbox, опциональное

**API запрос:**
```
POST /api/auth/login
Content-Type: application/json
Credentials: include

{
  "email": "user@example.com",
  "password": "password123",
  "remember": true
}
```

### 7.2 Форма регистрации ✅ Реализовано (`src/pages/auth/RegisterPage.tsx`)

**Валидация:**
```typescript
// Zod схема (src/shared/types.ts)
export const RegisterSchema = z.object({
  email: z.string()
    .email('Некорректный формат email')
    .min(5, 'Email слишком короткий')
    .max(255, 'Email слишком длинный')
    .transform((val) => val.toLowerCase()),
  
  firstName: z.string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(100, 'Имя слишком длинное')
    .regex(/^[\p{L}\s'-]+$/u, 'Имя может содержать только буквы, пробелы, дефисы и апострофы'),
  
  lastName: z.string()
    .min(2, 'Фамилия должна содержать минимум 2 символа')
    .max(100, 'Фамилия слишком длинная')
    .regex(/^[\p{L}\s'-]+$/u, 'Фамилия может содержать только буквы, пробелы, дефисы и апострофы'),
  
  password: z.string()
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .max(100, 'Пароль слишком длинный')
    .regex(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
    .regex(/[a-z]/, 'Пароль должен содержать хотя бы одну строчную букву')
    .regex(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру'),
  
  nickname: z.string()
    .min(3, 'Никнейм должен содержать минимум 3 символа')
    .max(50, 'Никнейм слишком длинный')
    .regex(/^[a-zA-Z0-9_]+$/, 'Никнейм может содержать только латинские буквы, цифры и подчёркивание')
})
```

**Поля формы:**
- `email` — type="email", обязательное
- `firstName` — обязательное, 2-100 символов, только буквы
- `lastName` — обязательное, 2-100 символов, только буквы
- `nickname` — обязательное, 3-50 символов, латиница + цифры + _
- `password` — обязательное, минимум 6 символов, должен содержать:
  - Заглавную букву
  - Строчную букву
  - Цифру

**Индикаторы силы пароля:**
Отображаются в реальном времени при вводе пароля:
- ✅ Заглавная буква
- ✅ Строчная буква
- ✅ Цифра

**API запрос:**
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "firstName": "Иван",
  "lastName": "Петров",
  "password": "Password123",
  "nickname": "ivan_petrov"
}
```

### 7.3 Планируемые формы

#### Форма профиля
**Клиентская валидация:**
- firstName: обязательно
- lastName: обязательно
- nickname: обязательно, мин. 3 символа, только `a-zA-Z0-9_`
- displayName: обязательно
- bio: максимум 500 символов

#### Формы калькуляторов

**Кредитный калькулятор:**
- Сумма кредита: min 10,000, max 100,000,000
- Процентная ставка: min 1, max 50
- Срок: min 1, max 600 месяцев
- Тип платежа: аннуитетный/дифференцированный

**Калькулятор вкладов:**
- Сумма вклада: min 1,000, max 100,000,000
- Процентная ставка: min 0.1, max 30
- Срок: min 1, max 60 месяцев
- Капитализация: ежемесячно/ежеквартально/ежегодно/нет

**Ипотечный калькулятор:**
- Сумма кредита: min 100,000, max 100,000,000
- Процентная ставка: min 1, max 30
- Срок: min 1, max 50 лет
- Первоначальный взнос: min 0, max 90%

---

## 8. Модальные окна

### 8.1 Текущий статус

❌ Модальные окна не реализованы. Планируется использование обычных страниц.



### 8.3 Планируемые страницы

| страница | Назначение | Параметры |
|---------|------------|-----------|
| `auth` | Вход/регистрация | `mode`: "login" \| "register" |
| `subscribe` | Оформление подписки | - |
| `payment` | Оплата | `productId`, `priceId` |
| `confirm` | Подтверждение действия | `title`, `message`, `onConfirm` |
| `favorite` | Добавление в избранное | `contentId` |

---

## 9. Калькуляторы

### 9.1 Текущий статус

❌ Калькуляторы не реализованы.

### 9.2 Планируемые калькуляторы

#### Кредитный калькулятор (`/calculator/credit`)

**Функциональность:**
- Расчёт ежемесячного платежа (аннуитетный/дифференцированный)
- График платежей
- Досрочное погашение
- Визуализация (график)

**Типы:**
```typescript
interface CreditInput {
  amount: number;        // Сумма кредита
  rate: number;          // Годовая ставка (%)
  term: number;          // Срок (месяцев)
  type: 'annuity' | 'differentiated';
  earlyRepayment?: {
    amount: number;
    month: number;
  };
}

interface CreditResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  schedule: CreditMonth[];
}
```

#### Калькулятор вкладов (`/calculator/deposit`)

**Функциональность:**
- Расчёт с капитализацией и без
- Ежемесячное пополнение
- Эффективная ставка
- Визуализация (график)

#### Ипотечный калькулятор (`/calculator/mortgage`)

**Функциональность:**
- Расчёт ипотечного платежа
- Первоначальный взнос
- График платежей
- Страховка (опционально)

---

## 10. Админ-панель

### 10.1 Текущий статус

✅ Админ-панель реализована.

### 10.2 Реализованные страницы

| Страница | Путь | Функциональность |
|----------|------|------------------|
| Дашборд | `/admin` | Статистика (пользователи, курсы, уроки, просмотры, премиум) |
| Пользователи | `/admin/users` | Просмотр, редактирование роли, удаление |
| Курсы | `/admin/courses` | CRUD курсов, фильтры по статусу/сложности, поиск |
| Уроки | `/admin/lessons` | CRUD уроков, фильтры по типу/статусу, привязка к модулям |
| Теги | `/admin/tags` | CRUD тегов с цветами |

### 10.3 Реализованная функциональность

**Дашборд:**
- Карточки статистики (пользователи, курсы, уроки, просмотры, премиум-пользователи)
- Быстрые действия (создать курс/урок/тег)
- Статус системы

**Управление пользователями:**
- Просмотр списка с пагинацией
- Поиск по имени/email/никнейму
- Фильтр по роли (USER/AUTHOR/MODERATOR/ADMIN)
- Редактирование роли
- Удаление пользователя

**Управление курсами:**
- CRUD операций
- Фильтры по статусу (DRAFT/PUBLISHED/ARCHIVED)
- Фильтры по сложности (BEGINNER/INTERMEDIATE/ADVANCED)
- Поиск по названию
- Редактирование: название, описание, сложность, премиум-статус, обложка

**Управление уроками:**
- CRUD операций
- Фильтры по типу (ARTICLE/VIDEO/AUDIO/QUIZ)
- Фильтры по статусу
- Привязка к курсу и модулю
- Редактирование контента (текст/видео/аудио/квиз)

**Управление тегами:**
- CRUD операций
- Выбор цвета тега
- Автоматическая генерация slug

### 10.4 Защита маршрутов

- Проверка роли `ADMIN` при входе в админ-панель
- Проверка сессии через cookie
- Редирект на главную при отсутствии прав
- Редирект на страницу входа при отсутствии сессии

---

## 11. Аутентификация

### 11.1 Текущая реализация ✅

**Технологии:**
- **Сессионная аутентификация** (НЕ JWT)
- Сессии через cookies (HttpOnly, SameSite=Strict)
- bcryptjs для хэширования паролей (12 раундов)
- UUID для токенов сессий

**Срок действия сессии:** 30 дней

**Важно:** Мы НЕ используем JWT токены. Вместо этого используется сессионная аутентификация с хранением сессий в базе данных.

**Файлы:**
- `server/routes/auth.routes.ts` — роуты аутентификации
- `src/lib/api.ts` — axios с withCredentials
- `src/shared/types.ts` — Zod схемы валидации

### 11.2 Как работают сессии

**Структура таблицы Session:**
```prisma
model Session {
  id           String   @id
  sessionToken String   @unique  // Уникальный токен
  userId       String              // Может быть несколько сессий на одного пользователя
  expires      DateTime
  user         User     @relation(...)
  
  @@index([userId])
}
```

**Процесс входа:**
1. Пользователь отправляет email/password
2. Сервер проверяет credentials
3. Создаётся новая запись в таблице Session
4. В браузер устанавливается cookie: `session=<token>; HttpOnly; SameSite=Strict`

**Многодевайсная авторизация:**
- Один пользователь может иметь **несколько сессий** (разные устройства/браузеры)
- При логине создаётся новая сессия, старые НЕ удаляются
- Это позволяет быть авторизованным одновременно на ПК и телефоне

### 11.3 Возможные улучшения

**1. Ограничение количества сессий:**
```typescript
// Удалить старые сессии, если больше 5
const existing = await prisma.session.count({ where: { userId } })
if (existing >= 5) {
  await prisma.session.deleteMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
    take: existing - 4
  })
}
```

**2. Очистка истёкших сессий (cron job):**
```typescript
// Удалить просроченные сессии
await prisma.session.deleteMany({
  where: { expires: { lt: new Date() } }
})
```

**3. "Выйти со всех устройств":**
```typescript
// Удалить все сессии пользователя, кроме текущей
await prisma.session.deleteMany({
  where: { 
    userId: currentUserId,
    sessionToken: { not: currentToken }
  }
})
```

### 11.4 API Endpoints

| Endpoint | Метод | Описание |
|----------|-------|----------|
| `/api/auth/register` | POST | Регистрация нового пользователя |
| `/api/auth/login` | POST | Вход по email/password |
| `/api/auth/logout` | POST | Выход (удаление сессии) |
| `/api/auth/me` | GET | Получение текущего пользователя по cookie |

### 11.3 Процесс регистрации

1. Валидация данных через Zod (RegisterSchema)
2. Проверка уникальности email и nickname
3. Хэширование пароля (bcryptjs, 12 раундов)
4. Создание User и Profile в транзакции
5. Автоматическая генерация аватара через ui-avatars.com

### 11.4 Процесс входа

1. Валидация данных через Zod (LoginSchema)
2. Поиск пользователя по email
3. Проверка пароля (bcryptjs compare)
4. Проверка на блокировку (isBlocked)
5. Создание сессии в БД (Session table)
6. Установка cookie с sessionToken
7. Обновление lastLoginAt

### 11.5 Роли и права доступа

| Роль | Доступ |
|------|--------|
| USER | Личный кабинет, курсы, избранное, история |
| AUTHOR | + Создание контента, авторская панель |
| MODERATOR | + Модерация контента |
| ADMIN | + Полное управление пользователями и контентом |

### 11.6 Структура ответов

**Успешная регистрация (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "Иван",
    "lastName": "Петров",
    "role": "USER",
    "profile": {
      "id": "uuid",
      "nickname": "ivan_petrov",
      "displayName": "Иван Петров",
      "avatarUrl": "https://ui-avatars.com/..."
    }
  }
}
```

**Ошибка (400/401/500):**
```json
{
  "error": "Сообщение об ошибке",
  "code": "ERROR_CODE",
  "details": [{ "field": "email", "message": "Ошибка валидации" }]
}
```

---

## 12. Структура проекта

### 12.1 Текущая структура

```
├── src/                         # Исходный код фронтенда
│   ├── components/              # React компоненты
│   │   ├── common/              # Общие компоненты
│   │   └── layout/              # Layout компоненты
│   │       ├── Header.tsx       # Шапка сайта ✅
│   │       ├── Footer.tsx       # Подвал сайта ✅
│   │       └── index.ts         # Экспорт
│   ├── layouts/                 # Layout обёртки
│   │   ├── MainLayout.tsx       # Основной layout (Header + Footer) ✅
│   │   ├── AuthLayout.tsx       # Layout для авторизации (только Header) ✅
│   │   └── index.ts             # Экспорт
│   ├── pages/                   # Страницы
│   │   ├── auth/                # Страницы авторизации
│   │   │   ├── LoginPage.tsx    # Страница входа ✅
│   │   │   └── RegisterPage.tsx # Страница регистрации ✅
│   │   └── HomePage.tsx         # Главная страница ✅
│   ├── shared/                  # Общие типы и утилиты
│   │   └── types.ts             # TypeScript типы и Zod схемы ✅
│   ├── store/                   # Zustand сторы
│   │   └── useAppStore.ts       # Глобальный стор ✅
│   ├── assets/                  # Статические ресурсы
│   ├── App.tsx                  # Главный компонент с роутингом ✅
│   ├── main.tsx                 # Точка входа ✅
│   └── vite-env.d.ts           # Типы Vite
│
├── server/                      # Бэкенд (Hono)
│   ├── routes/                  # API роуты
│   │   ├── auth.routes.ts       # Аутентификация ✅
│   │   ├── user.routes.ts       # Пользователь 🔄 Заглушка
│   │   ├── courses.routes.ts    # Курсы 🔄 Заглушка
│   │   ├── lessons.routes.ts    # Уроки 🔄 Заглушка
│   │   ├── comments.routes.ts   # Комментарии 🔄 Заглушка
│   │   ├── reactions.routes.ts  # Реакции 🔄 Заглушка
│   │   ├── tags.routes.ts       # Теги 🔄 Заглушка
│   │   ├── payments.routes.ts   # Платежи 🔄 Заглушка
│   │   ├── moderation.routes.ts # Модерация 🔄 Заглушка
│   │   └── admin.routes.ts      # Админ 🔄 Заглушка
│   ├── middleware/              # Middleware
│   │   ├── auth.ts              # Auth middleware 🔄 Заглушка
│   │   ├── logger.ts            # Logger 🔄 Заглушка
│   │   └── rate-limit.ts        # Rate limiting 🔄 Заглушка
│   ├── lib/                     # Библиотеки
│   │   ├── auth.ts              # Auth конфигурация 🔄 Резерв
│   │   ├── errors.ts            # Классы ошибок ✅
│   │   ├── validators.ts        # Zod схемы 🔄 Заглушка
│   │   └── agination.ts         # Пагинация 🔄 Заглушка
│   ├── db.ts                    # Prisma клиент ✅
│   └── index.ts                 # Главный файл сервера ✅
│
├── prisma/                      # База данных
│   ├── schema.prisma            # Схема БД ✅
│   └── migrations/              # Миграции
│
├── public/                      # Статические файлы
│   └── images/                  # Изображения
│
├── package.json                 # Зависимости
├── vite.config.ts               # Конфигурация Vite ✅
├── tsconfig.json                # Конфигурация TypeScript
├── tailwind.config.js           # Конфигурация Tailwind
├── eslint.config.js             # Конфигурация ESLint
└── .env                         # Переменные окружения
```

### 12.2 Ключевые файлы

| Файл | Назначение | Статус |
|------|------------|--------|
| `server/index.ts` | Главный файл сервера Hono | ✅ |
| `server/db.ts` | Экспорт Prisma клиента | ✅ |
| `server/lib/errors.ts` | Класс AppError для ошибок | ✅ |
| `server/routes/auth.routes.ts` | Роуты аутентификации | ✅ |
| `src/App.tsx` | Роутинг приложения | ✅ |
| `src/layouts/MainLayout.tsx` | Основной layout | ✅ |
| `src/layouts/AuthLayout.tsx` | Layout для авторизации | ✅ |
| `src/components/layout/Header.tsx` | Шапка сайта | ✅ |
| `src/components/layout/Footer.tsx` | Подвал сайта | ✅ |
| `src/pages/HomePage.tsx` | Главная страница | ✅ |
| `src/pages/auth/LoginPage.tsx` | Страница входа | ✅ |
| `src/pages/auth/RegisterPage.tsx` | Страница регистрации | ✅ |
| `src/shared/types.ts` | TypeScript типы и Zod схемы | ✅ |
| `prisma/schema.prisma` | Схема базы данных | ✅ |

---

## 13. Цветовая палитра

Используется в стилях:

```css
:root {
  --background: #F8F6F3;      /* Светлый фон */
  --foreground: #264653;      /* Основной текст */
  --primary: #F4A261;         /* Оранжевый */
  --secondary: #2A9D8F;       /* Бирюзовый */
  --accent: #F4A261;          /* Акцентный */
  --muted: #6C757D;           /* Приглушённый */
  --destructive: #FF6B6B;     /* Ошибка/удаление */
  --border: #E9ECEF;          /* Границы */
}
```

---

## 14. Команды для работы

```bash
# Запуск dev-сервера (Vite + Hono на порту 5173)
npm run dev

# Запуск только бэкенда (порт 3000)
npx tsx server/index.ts

# Сборка проекта
npm run build

# Запуск продакшн-версии
npm run preview

# Запуск линтера
npm run lint

# Генерация Prisma Client
npx prisma generate

# Применение миграций
npx prisma migrate dev

# Просмотр Studio
npx prisma studio

# Сидирование БД (если есть)
npm run db:seed
```

---

## 15. Переменные окружения (.env)

```env
# База данных (MySQL)
DATABASE_URL="mysql://user:password@localhost:3306/economikus"

# Порт сервера (опционально)
PORT=3000

# Секрет для сессий (минимум 32 символа)
AUTH_SECRET="your-secret-key-min-32-chars-long"
```

---

## 16. Известные проблемы и решения

### 16.1 Исправленные проблемы

| Проблема | Решение |
|----------|---------|
| Ошибка `erors.ts` | Переименован в `errors.ts` |
| Prisma 7.x несовместимость | Понижена до 5.22.0 |
| Отсутствие `url` в datasource | Добавлен `url = env("DATABASE_URL")` |
| `acceptTerms` в RegisterSchema | Поле оставлено (требуется в форме) |
| `userId`/`profileId` вместо `id` | Исправлено на `id` в auth.routes.ts |
| Сервер не запускался | Добавлен `serve()` из @hono/node-server |

### 16.2 Текущие ограничения

- Нет защиты маршрутов на фронтенде (требуется добавить ProtectedRoute)
- Нет middleware для проверки ролей
- Нет rate limiting
- Нет логирования запросов

---

## 17. TODO / Roadmap

### Приоритет 1 (Базовый функционал) ✅ Завершено
- [x] Header и Footer компоненты
- [x] MainLayout и AuthLayout
- [x] Страницы входа/регистрации
- [x] Главная страница
- [x] Аутентификация API (register, login, logout, me)

### Приоритет 2 (API - без защиты маршрутов)
- [ ] API курсов (GET /api/courses, GET /api/courses/:slug)
- [ ] API уроков (GET /api/lessons, GET /api/lessons/:slug)
- [ ] API пользователя (GET /api/user/me, PATCH /api/user/profile)
- [ ] API тегов (GET /api/tags)
- [ ] API комментариев (CRUD)
- [ ] API реакций (лайки/дизлайки)
- [ ] API платежей (заглушки)
- [ ] API модерации (заглушки)
- [ ] API админа (заглушки)

### Приоритет 3 (Страницы контента)
- [ ] Страница каталога
- [ ] Страница списка курсов
- [ ] Страница курса
- [ ] Страница урока

### Приоритет 4 (Профиль пользователя)
- [ ] Страница профиля
- [ ] Страница настроек
- [ ] Страница избранного
- [ ] Страница истории

### Приоритет 5 (Админ-панель)
- [ ] Базовая админ-панель
- [ ] Управление пользователями
- [ ] Функции модератора

### Приоритет 6 (Дополнительный функционал)
- [ ] Калькуляторы
- [ ] Платежи (имитация)

### Приоритет 7 (Защита)
- [ ] ProtectedRoute компонент
- [ ] Middleware для проверки ролей
- [ ] Rate limiting
- [ ] Логирование

---

*Документация обновлена: март 2026*
*Версия: 2.1*
*Статус: Актуальная*
