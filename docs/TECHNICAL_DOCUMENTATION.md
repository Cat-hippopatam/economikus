# Техническая документация Economikus

> Единая документация образовательной платформы для изучения финансов и инвестиций

---

## Содержание

1. [Обзор проекта](#1-обзор-проекта)
2. [Технологический стек](#2-технологический-стек)
3. [Структура проекта](#3-структура-проекта)
4. [API Endpoints](#4-api-endpoints)
5. [Страницы приложения](#5-страницы-приложения)
6. [Компоненты и переиспользование](#6-компоненты-и-переиспользование)
7. [Обработка изображений](#7-обработка-изображений)
8. [Калькуляторы](#8-калькуляторы)
9. [Панель автора](#9-панель-автора)
10. [Безопасность](#10-безопасность)
11. [Стандарты разработки](#11-стандарты-разработки)
12. [Roadmap](#12-roadmap)

---

## 1. Обзор проекта

### 1.1 Описание

**Экономикус** — образовательная платформа для изучения финансов, инвестиций и управления личными финансами.

| Метрика | Значение |
|---------|----------|
| **Статус** | В активной разработке |
| **Готовность** | ~60% |
| **Последнее обновление** | Март 2026 |

### 1.2 Основные модули

| Модуль | Статус | Готовность |
|--------|--------|------------|
| Аутентификация | ✅ Работает | 95% |
| Каталог курсов | ✅ Работает | 95% |
| Страница курса | ✅ Работает | 90% |
| Страница урока | ✅ Работает | 90% |
| Админ-панель | ✅ Работает | 85% |
| Панель автора | ✅ Работает | 95% |
| Калькуляторы | ✅ Работает | 100% |
| Прогресс обучения | ✅ Работает | 90% |
| Система подписок | ✅ Работает | 80% (API готов) |
| SEO | ✅ Частично | 40% (sitemap, robots) |

---

## 2. Технологический стек

### 2.1 Frontend

| Пакет | Версия | Назначение |
|-------|--------|------------|
| `react` | 19.1.0 | UI фреймворк |
| `react-dom` | 19.1.0 | React DOM |
| `react-router-dom` | 7.13.1 | Роутинг |
| `@mantine/core` | 8.3.16 | UI компоненты |
| `@mantine/hooks` | 8.3.16 | React хуки |
| `tailwindcss` | 4.2.1 | Стили |
| `react-hook-form` | 7.71.2 | Формы |
| `zod` | 4.3.6 | Валидация |
| `@hookform/resolvers` | 5.2.2 | Интеграция Zod |
| `@tanstack/react-query` | 5.90.21 | Server state |
| `zustand` | 5.0.11 | State management |
| `react-markdown` | 10.1.0 | Рендеринг Markdown |
| `remark-gfm` | 4.0.1 | GitHub Flavored Markdown |
| `react-syntax-highlighter` | 16.1.1 | Подсветка синтаксиса |
| `lucide-react` | 0.577.0 | Иконки |
| `axios` | 1.13.6 | HTTP клиент (установлен) |
| `dayjs` | 1.11.20 | Работа с датами (установлен) |
| `isomorphic-dompurify` | 3.3.0 | Санитизация HTML (установлен) |
| `@hello-pangea/dnd` | 18.0.1 | Drag&Drop |

### 2.2 Backend

| Пакет | Версия | Назначение |
|-------|--------|------------|
| `hono` | 4.12.7 | HTTP фреймворк |
| `@hono/node-server` | — | Node.js адаптер |
| `@hono/vite-dev-server` | 0.25.1 | Dev сервер |
| `@prisma/client` | 5.22.0 | ORM |
| `bcryptjs` | 3.0.3 | Хеширование паролей |
| `@hono/swagger-ui` | 0.6.1 | Swagger UI |
| `@hono/zod-openapi` | 1.2.2 | OpenAPI |
| `@hono/zod-validator` | 0.7.6 | Валидация |
| `@auth/core` | 0.35.0 | Auth.js (установлен) |
| `@hono/auth-js` | 1.1.1 | Auth.js для Hono (установлен) |

---

## 3. Структура проекта

### 3.1 Директория src/

```
src/
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx        ✅ Защита роутов
│   ├── common/
│   │   ├── StatusBadge.tsx           ✅ Бейдж статуса
│   │   ├── RoleBadge.tsx             ✅ Бейдж роли
│   │   ├── LoadingState.tsx          ✅ Состояние загрузки
│   │   ├── EmptyState.tsx            ✅ Пустое состояние
│   │   ├── ErrorState.tsx            ✅ Состояние ошибки
│   │   ├── ConfirmDialog.tsx         ✅ Диалог подтверждения
│   │   ├── ColorIndicator.tsx        ✅ Индикатор цвета
│   │   └── AvatarUploader.tsx        ✅ Загрузка аватара
│   ├── modals/
│   │   ├── TagModal.tsx
│   │   ├── CourseModal.tsx
│   │   ├── LessonModal.tsx
│   │   └── UserModal.tsx
│   ├── tables/
│   │   ├── DataTable.tsx
│   │   └── TableFilters.tsx
│   ├── cards/
│   │   └── StatCard.tsx
│   ├── courses/
│   │   └── CourseCard.tsx            ✅ Карточка курса
│   ├── calculators/                  ✅ Калькуляторы
│   │   ├── CompoundInterestCalculator.tsx
│   │   ├── LoanCalculator.tsx
│   │   ├── MortgageCalculator.tsx
│   │   └── index.ts
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
│
├── constants/
│   ├── config.ts                     ✅ Конфигурация
│   ├── navigation.ts                 ✅ Навигация
│   ├── status.ts                     ✅ Статусы
│   ├── roles.ts                      ✅ Роли
│   ├── difficulty.ts                 ✅ Уровни сложности
│   ├── lessonTypes.ts                ✅ Типы уроков
│   └── author.ts                     ✅ Константы автора
│
├── hooks/
│   ├── useAuth.ts                    ✅ Авторизация
│   ├── useNotification.ts            ✅ Уведомления
│   ├── usePagination.ts              ✅ Пагинация
│   ├── useTable.ts                   ✅ Таблицы
│   ├── useTagList.ts                 ✅ Теги (CRUD)
│   ├── useCourseList.ts              ✅ Курсы (CRUD)
│   ├── useLessonList.ts              ✅ Уроки (CRUD)
│   ├── useUserList.ts                ✅ Пользователи (CRUD)
│   ├── useCourseCatalog.ts           ✅ Каталог курсов
│   ├── useCourseDetail.ts            ✅ Детали курса
│   ├── useLesson.ts                  ✅ Урок с контентом
│   ├── useAvatarUpload.ts            ✅ Загрузка аватара
│   └── author/                       ✅ Хуки автора
│       ├── useAuthorCourses.ts
│       ├── useAuthorCourse.ts
│       ├── useAuthorLessons.ts
│       ├── useAuthorLesson.ts
│       ├── useCourseModules.ts
│       ├── useLessonContent.ts
│       └── useAuthorAnalytics.ts
│
├── services/
│   ├── api.ts                        ✅ Базовый API
│   ├── auth.service.ts
│   ├── user.service.ts
│   ├── course.service.ts
│   ├── lesson.service.ts
│   ├── tag.service.ts
│   └── application.service.ts
│
├── types/
│   ├── index.ts                      ✅ Экспорты
│   ├── auth.ts
│   ├── user.ts
│   ├── course.ts
│   ├── lesson.ts
│   ├── tag.ts
│   ├── calculator.ts                 ✅ Типы калькуляторов
│   └── api.ts
│
├── pages/
│   ├── HomePage.tsx                  ✅ Главная
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminCourses.tsx
│   │   ├── AdminLessons.tsx
│   │   ├── AdminTags.tsx
│   │   ├── AdminUsers.tsx
│   │   ├── AdminModeration.tsx
│   │   ├── AdminApplications.tsx
│   │   └── AdminLayout.tsx
│   ├── author/
│   │   ├── AuthorDashboardPage.tsx
│   │   ├── AuthorCoursesPage.tsx
│   │   ├── AuthorCourseFormPage.tsx
│   │   ├── AuthorCourseModulesPage.tsx
│   │   ├── AuthorLessonsPage.tsx
│   │   ├── AuthorLessonFormPage.tsx
│   │   ├── AuthorAnalyticsPage.tsx
│   │   └── AuthorLayout.tsx
│   ├── profile/
│   │   ├── ProfilePage.tsx           ✅ Публичный профиль
│   │   ├── ProfileSettingsPage.tsx   ✅ Настройки
│   │   └── BecomeAuthorPage.tsx
│   ├── catalog/
│   │   └── CatalogPage.tsx           ✅ Каталог курсов
│   ├── courses/
│   │   └── CoursePage.tsx            ✅ Детали курса
│   ├── lessons/
│   │   └── LessonPage.tsx            ✅ Урок с контентом
│   └── calculators/
│       ├── CalculatorsPage.tsx       ✅ Каталог калькуляторов
│       └── CalculatorPage.tsx        ✅ Калькулятор
│
├── layouts/
│   ├── MainLayout.tsx
│   └── AuthLayout.tsx
│
├── utils/
│   └── calculators.ts                ✅ Функции расчётов
│
├── App.tsx                           ✅ Роутинг
├── main.tsx                          ✅ Точка входа
└── index.css                         ✅ Глобальные стили
```

### 3.2 Директория server/

```
server/
├── routes/
│   ├── auth.routes.ts                ✅ Аутентификация
│   ├── courses.routes.ts             ✅ API курсов
│   ├── lessons.routes.ts             ✅ API уроков
│   ├── user.routes.ts                ✅ API пользователя
│   ├── tags.routes.ts                ✅ API тегов
│   ├── reactions.routes.ts           ✅ API реакций
│   ├── comments.routes.ts            ✅ API комментариев
│   ├── admin.routes.ts               ✅ API админа
│   ├── author.routes.ts              ✅ API автора
│   ├── moderation.routes.ts          ✅ API модерации
│   └── progress.routes.ts            ✅ Прогресс
│
├── middleware/
│   ├── auth.ts                       ✅ Auth middleware
│   └── rate-limit.ts                 ⚠️ Заглушка
│
├── lib/
│   ├── errors.ts                     ✅ Класс AppError
│   └── auth.ts                       ❌ Резерв
│
├── jobs/
│   └── session-cleanup.ts            ✅ Очистка сессий
│
├── utils/
│   ├── response.ts                   ✅ Утилиты ответа
│   └── slug.ts                       ✅ Генерация slug
│
├── types.ts                          ✅ Типы сервера
├── db.ts                             ✅ Prisma клиент
└── index.ts                          ✅ Главный файл
```

---

## 4. API Endpoints

### 4.1 Swagger документация

**Доступ:** `http://localhost:3000/api/swagger`

### 4.2 Полный список API

#### Аутентификация
| Endpoint | Метод | Защита | Описание |
|----------|-------|--------|----------|
| `/api/auth/register` | POST | Публичный | Регистрация |
| `/api/auth/login` | POST | Публичный | Вход |
| `/api/auth/logout` | POST | Публичный | Выход |
| `/api/auth/me` | GET | Публичный | Текущий пользователь |

#### Курсы
| Endpoint | Метод | Защита | Описание |
|----------|-------|--------|----------|
| `/api/courses` | GET | Публичный | Список с фильтрами |
| `/api/courses/:slug` | GET | Публичный | Детали курса |
| `/api/courses/:slug/modules` | GET | Публичный | Модули курса |

#### Уроки
| Endpoint | Метод | Защита | Описание |
|----------|-------|--------|----------|
| `/api/lessons` | GET | Публичный | Список |
| `/api/lessons/:slug` | GET | Публичный | Детали |
| `/api/lessons/:slug/content` | GET | Публичный | Контент |

#### Пользователь
| Endpoint | Метод | Защита | Описание |
|----------|-------|--------|----------|
| `/api/user/me` | GET | requireAuth | Профиль |
| `/api/user/profile` | PATCH | requireAuth | Обновить профиль |
| `/api/user/password` | PATCH | requireAuth | Сменить пароль |
| `/api/user/avatar` | POST/DELETE | requireAuth | Аватар |
| `/api/user/favorites` | GET/POST/DELETE | requireAuth | Избранное |
| `/api/user/history` | GET/POST | requireAuth | История |
| `/api/user/progress/courses` | GET | requireAuth | Прогресс курсов |
| `/api/user/progress/lessons/:id` | GET/POST | requireAuth | Прогресс урока |
| `/api/user/profile/:nickname` | GET | Публичный | Публичный профиль |

#### Теги
| Endpoint | Метод | Защита | Описание |
|----------|-------|--------|----------|
| `/api/tags` | GET | Публичный | Список |
| `/api/tags/:slug/courses` | GET | Публичный | Курсы по тегу |
| `/api/tags/:slug/lessons` | GET | Публичный | Уроки по тегу |

#### Реакции и комментарии
| Endpoint | Метод | Защита | Описание |
|----------|-------|--------|----------|
| `/api/reactions` | GET/POST/DELETE | Смешанный | Реакции |
| `/api/comments` | GET/POST | Смешанный | Комментарии |
| `/api/comments/:id` | PATCH/DELETE | Смешанный | Комментарий |

#### Админ
| Endpoint | Метод | Защита | Описание |
|----------|-------|--------|----------|
| `/api/admin/stats` | GET | ADMIN | Статистика |
| `/api/admin/users` | * | ADMIN | Пользователи |
| `/api/admin/courses` | * | ADMIN | Курсы |
| `/api/admin/modules` | * | ADMIN | Модули |
| `/api/admin/lessons` | * | ADMIN | Уроки |
| `/api/admin/tags` | * | ADMIN | Теги |
| `/api/admin/applications` | GET/PATCH | ADMIN | Заявки авторов |

#### Автор
| Endpoint | Метод | Защита | Описание |
|----------|-------|--------|----------|
| `/api/author/stats` | GET | AUTHOR | Статистика |
| `/api/author/analytics` | GET | AUTHOR | Аналитика |
| `/api/author/courses` | * | AUTHOR | Курсы |
| `/api/author/lessons` | * | AUTHOR | Уроки |
| `/api/author/modules` | * | AUTHOR | Модули |

---

## 5. Страницы приложения

| Страница | Путь | Статус |
|----------|------|--------|
| Главная | `/` | ✅ |
| Вход | `/login` | ✅ |
| Регистрация | `/register` | ✅ |
| Каталог курсов | `/catalog` | ✅ |
| Курс | `/courses/:slug` | ✅ |
| Урок | `/courses/:slug/lessons/:lessonSlug` | ✅ |
| Профиль | `/user/:nickname` | ✅ |
| Настройки | `/profile/settings` | ✅ |
| Стать автором | `/become-author` | ✅ |
| Панель автора | `/author/*` | ✅ |
| Админ-панель | `/admin/*` | ✅ |
| Калькуляторы | `/calculators` | ✅ |
| Калькулятор | `/calculators/:slug` | ✅ |
| О нас | `/info` | ✅ |
| Terms of Use | `/terms` | ✅ |
| Privacy Policy | `/privacy` | ✅ |
| Cookie Policy | `/cookies` | ✅ |

---

## 6. Компоненты и переиспользование

### 6.1 Переиспользуемые компоненты

| Компонент | Назначение |
|-----------|------------|
| `StatusBadge` | Бейдж статуса |
| `RoleBadge` | Бейдж роли |
| `LoadingState` | Состояние загрузки |
| `EmptyState` | Пустое состояние |
| `ErrorState` | Состояние ошибки |
| `ConfirmDialog` | Диалог подтверждения |
| `ColorIndicator` | Индикатор цвета |
| `AvatarUploader` | Загрузка аватара |
| `CourseCard` | Карточка курса |
| `StatCard` | Карточка статистики |
| `DataTable` | Переиспользуемая таблица |
| `ProtectedRoute` | Защита роутов |

### 6.2 Хуки для бизнес-логики

| Хук | Назначение |
|-----|------------|
| `useAuth` | Авторизация |
| `useCourseCatalog` | Каталог курсов |
| `useCourseDetail` | Детали курса |
| `useLesson` | Урок с контентом |
| `useTagList` | Теги (CRUD) |
| `useCourseList` | Курсы (CRUD) |
| `useLessonList` | Уроки (CRUD) |
| `useUserList` | Пользователи (CRUD) |
| `useAvatarUpload` | Загрузка аватара |
| `useNotification` | Уведомления |

---

## 7. Обработка изображений

### 7.1 Источники изображений

| Тип | URL | Пример |
|-----|-----|--------|
| Аватар (по умолчанию) | `ui-avatars.com` | `https://ui-avatars.com/api/?name=Name` |
| Аватар (реальный) | CDN | `https://cdn.economikus.ru/avatars/*.jpg` |
| Обложка курса | CDN | `https://cdn.economikus.ru/covers/*.jpg` |
| Обложка профиля | CDN | — |

### 7.2 Fallback реализован

| Компонент | coverImage | avatarUrl | Статус |
|-----------|------------|-----------|--------|
| **CourseCard** | ✅ Да | — | ✅ Полный |
| **CoursePage** | ✅ Да | — | ✅ Исправлено |
| **ProfilePage** | ✅ Да | ✅ Да | ✅ Исправлено |
| **AvatarUploader** | — | ✅ Да | ✅ |

---

## 8. Калькуляторы

### 8.1 Реализованные калькуляторы

| Калькулятор | Slug | Функциональность |
|-------------|------|------------------|
| Сложный процент | `compound-interest` | Начальная сумма, пополнения, ставка, срок, капитализация |
| Кредитный | `loan` | Сумма, ставка, срок, тип платежа, график |
| Ипотечный | `mortgage` | Стоимость, взнос, ставка, маткапитал, вычеты |

### 8.2 Роуты

- `/calculators` — каталог калькуляторов
- `/calculators/:slug` — страница калькулятора

### 8.3 Интеграция с уроками

Уроки с типом `CALCULATOR` автоматически отображают калькулятор по slug.

---

## 9. Панель автора

### 9.1 Структура роутов

```
/author
├── /dashboard          ✅ Статистика
├── /courses            ✅ Список курсов
│   ├── /new            ✅ Создание курса
│   └── /:id            ✅ Редактирование курса
│       └── /modules    ✅ Управление модулями (Drag&Drop)
├── /lessons            ✅ Список уроков
│   ├── /new            ✅ Создание урока
│   └── /:id            ✅ Редактирование урока
└── /analytics          ✅ Аналитика
```

### 9.2 Типы контента уроков

| Тип | Редактор | Хранение |
|-----|----------|----------|
| ARTICLE | TextContentEditor (Markdown) | TextContent.body |
| VIDEO | VideoContentEditor (URL) | VideoContent.videoUrl |
| AUDIO | AudioContentEditor (URL) | AudioContent.audioUrl |
| QUIZ | QuizContentEditor | QuizContent.questions |
| CALCULATOR | Интерактивный компонент | — |

### 9.3 Статусы контента

| Статус | Описание | Кто может установить |
|--------|----------|---------------------|
| DRAFT | Черновик | Автор |
| PENDING_REVIEW | На модерации | Автор |
| PUBLISHED | Опубликован | Только Админ/Модератор |

---

## 10. Безопасность

### 10.1 Реализованные меры

| Мера | Статус | Описание |
|------|--------|----------|
| HttpOnly cookies | ✅ | Сессии в HttpOnly cookies |
| SameSite=Strict | ✅ | Защита от CSRF |
| Хеширование паролей | ✅ | bcryptjs, 12 раундов |
| Проверка авторизации | ✅ | Middleware requireAuth |
| Проверка ролей | ✅ | requireRole middleware |
| Защита от блокировки | ✅ | Проверка isBlocked |
| ProtectedRoute | ✅ | Защита роутов на фронтенде |

### 10.2 Рекомендуемые меры

| Мера | Приоритет | Описание |
|------|-----------|----------|
| Rate limiting | 🔴 | Ограничение попыток входа |
| Санитизация входа | 🔴 | DOMPurify для форм |
| Content Security Policy | 🟡 | Заголовки безопасности |

---

## 11. Стандарты разработки

### 11.1 Принципы

- **DRY** — Don't Repeat Yourself
- **KISS** — Keep It Simple, Stupid
- **Single Responsibility** — один компонент = одна задача
- **Composition over Inheritance** — композиция вместо наследования

### 11.2 Стандарты именования

| Тип | Паттерн | Пример |
|-----|---------|--------|
| Компонент | PascalCase | `StatusBadge.tsx` |
| Хук | camelCase | `useTagList.ts` |
| Сервис | camelCase.service | `tag.service.ts` |
| Тип | camelCase | `tag.ts` |
| Константа | camelCase | `status.ts` |

### 11.3 Порядок импортов

```tsx
// 1. React и внешние библиотеки
import { useState, useEffect } from 'react'

// 2. Mantine UI
import { Container, Title, Stack } from '@mantine/core'

// 3. Иконки
import { Plus, Search } from 'lucide-react'

// 4. Компоненты проекта
import { LoadingState } from '@/components/common'

// 5. Хуки
import { useAuth } from '@/hooks'

// 6. Типы
import type { Course } from '@/types'

// 7. Константы
import { DIFFICULTY_CONFIG } from '@/constants'
```

---

## 12. Roadmap

### 12.1 Выполнено

- [x] Аутентификация
- [x] Каталог курсов
- [x] Страница курса
- [x] Страница урока
- [x] Админ-панель
- [x] Панель автора
- [x] Калькуляторы
- [x] Прогресс обучения
- [x] История просмотров
- [x] Избранное
- [x] Система подписок (API)
- [x] Управление модулями — drag&drop
- [x] Контент уроков (Text, Video, Audio, Quiz)
- [x] SEO: sitemap.xml, robots.txt

### 12.2 Краткосрочные задачи

- [ ] Frontend подписок (компоненты)
- [ ] OAuth провайдеры (Google, VK, Yandex)
- [ ] Schema.org микроразметка
- [ ] Open Graph теги

### 12.3 Долгосрочные задачи

- [ ] SSR для SEO
- [ ] Платежи (ЮKassa)
- [ ] Мобильная версия
- [ ] Unit-тесты

---

## Дополнительная документация

| Документ | Описание |
|----------|----------|
| `OPTIMIZATION_GUIDE.md` | Правила оптимизации и стандарты разработки |
| `REFACTORING_PLAN.md` | План рефакторинга |
| `AUTHOR_PANEL_PLAN.md` | План панели автора |
| `docs/LESSON_CONTENT_PLAN.md` | План контента уроков |

---

*Документация обновлена: Март 2026*
*Версия: 5.0 (объединённая)*
