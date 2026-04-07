# Техническая спецификация Экономикус

> Образовательная платформа для изучения финансов и инвестиций

---

## Содержание

1. [О проекте](#1-о-проекте)
2. [Технологический стек](#2-технологический-стек)
3. [Структура проекта](#3-структура-проекта)
4. [Страницы приложения](#4-страницы-приложения)
5. [API Endpoints](#5-api-endpoints)
6. [База данных](#6-база-данных)
7. [Компоненты и переиспользование](#7-компоненты-и-переиспользование)
8. [Безопасность](#8-безопасность)
9. [Запуск проекта](#9-запуск-проекта)

---

## 1. О проекте

**Экономикус** — образовательная онлайн-платформа для изучения финансов, инвестиций и управления личными финансами.

### Основные возможности

| Возможность | Описание |
|-------------|----------|
| Курсы | Структурированные курсы с модулями и уроками |
| Уроки | 5 типов контента: статьи, видео, аудио, тесты, калькуляторы |
| Калькуляторы | Сложный процент, кредитный, ипотечный |
| Прогресс | Отслеживание прохождения курсов |
| Подписки | Монетизация контента |
| Панель автора | Создание и управление контентом |
| Админ-панель | Управление платформой |

### Роли пользователей

| Роль | Описание |
|------|----------|
| USER | Обычный пользователь |
| AUTHOR | Автор курсов |
| MODERATOR | Модератор контента |
| ADMIN | Администратор |

### Целевая аудитория

- Начинающие инвесторы
- Студенты и молодые специалисты
- Все, кто хочет повысить финансовую грамотность

---

## 2. Технологический стек

### Frontend

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
| `@tanstack/react-query` | 5.90.21 | Server state |
| `zustand` | 5.0.11 | State management |
| `react-markdown` | 10.1.0 | Рендеринг Markdown |
| `lucide-react` | 0.577.0 | Иконки |
| `@hello-pangea/dnd` | 18.0.1 | Drag&Drop |

### Backend

| Пакет | Версия | Назначение |
|-------|--------|------------|
| `hono` | 4.12.7 | HTTP фреймворк |
| `@prisma/client` | 5.22.0 | ORM |
| `bcryptjs` | 3.0.3 | Хеширование паролей |
| `@hono/swagger-ui` | 0.6.1 | Swagger UI |
| `@hono/zod-openapi` | 1.2.2 | OpenAPI |

### Цветовая палитра

| Цвет | HEX | Использование |
|------|-----|---------------|
| Primary | `#2A9D8F` | Бирюзовый — основной акцент |
| Secondary | `#264653` | Тёмно-синий — текст и фоны |
| Accent | `#F4A261` | Оранжевый — дополнительный акцент |
| Background | `#F8F6F3` | Светло-бежевый — фон страницы |
| Error | `#FF6B6B` | Красный — ошибки |

---

## 3. Структура проекта

```
economikus/
├── src/                    # Frontend (React)
│   ├── components/         # UI компоненты
│   │   ├── auth/           # Защита роутов
│   │   ├── author/         # Панель автора
│   │   ├── calculators/    # Калькуляторы
│   │   ├── cards/          # Карточки
│   │   ├── common/         # Переиспользуемые
│   │   ├── layout/         # Header, Footer
│   │   ├── modals/         # Модальные окна
│   │   ├── profile/        # Профиль
│   │   └── tables/         # Таблицы
│   ├── constants/          # Константы
│   ├── hooks/              # Кастомные хуки
│   ├── layouts/            # Макеты страниц
│   ├── pages/              # Страницы
│   │   ├── admin/          # Админ-панель
│   │   ├── auth/           # Авторизация
│   │   ├── author/         # Панель автора
│   │   ├── calculators/    # Калькуляторы
│   │   ├── catalog/        # Каталог
│   │   ├── courses/        # Курсы
│   │   ├── info/           # О нас
│   │   ├── legal/          # Правовые
│   │   ├── lessons/        # Уроки
│   │   ├── postulates/     # Постулаты
│   │   ├── profile/        # Профиль
│   │   └── tools/          # Инструменты
│   ├── services/           # API сервисы
│   ├── types/              # TypeScript типы
│   └── utils/              # Утилиты
│
├── server/                 # Backend (Hono)
│   ├── routes/             # API роуты
│   ├── middleware/         # Промежуточное ПО
│   ├── lib/                # Утилиты
│   └── index.ts            # Точка входа
│
├── prisma/                 # Схема БД
├── public/                 # Статика
└── docs/                   # Документация
```

### Соглашения об именовании

| Тип | Формат | Пример |
|-----|--------|--------|
| Компонент | PascalCase | `CourseCard.tsx` |
| Хук | camelCase, prefix `use` | `useAuth.ts` |
| Сервис | camelCase.service | `auth.service.ts` |
| Константа | camelCase | `status.ts` |
| Страница | PascalCase + Page | `LoginPage.tsx` |

---

## 4. Страницы приложения

### Публичные страницы

| URL | Страница | Описание |
|-----|----------|----------|
| `/` | HomePage | Главная с Hero, курсами, CTA |
| `/catalog` | CatalogPage | Каталог курсов с фильтрами |
| `/courses/:slug` | CoursePage | Страница курса |
| `/courses/:courseSlug/lessons/:lessonSlug` | LessonPage | Урок с контентом |
| `/calculators` | CalculatorsPage | Каталог калькуляторов |
| `/calculators/:slug` | CalculatorPage | Калькулятор |
| `/tools` | ToolsPage | Инструменты |
| `/postulates` | PostulatesPage | Финансовые постулаты |
| `/info` | InfoPage | О платформе |
| `/terms` | TermsPage | Условия использования |
| `/privacy` | PrivacyPage | Политика конфиденциальности |
| `/cookies` | CookiesPage | Политика cookie |
| `/user/:nickname` | ProfilePage | Публичный профиль |

### Страницы авторизации

| URL | Страница |
|-----|----------|
| `/login` | LoginPage |
| `/register` | RegisterPage |

### Защищённые страницы (личный кабинет)

| URL | Страница |
|-----|----------|
| `/profile/settings` | ProfileSettingsPage |
| `/become-author` | BecomeAuthorPage |

### Панель автора (`/author/*`)

| URL | Страница |
|-----|----------|
| `/author/dashboard` | AuthorDashboardPage |
| `/author/courses` | AuthorCoursesPage |
| `/author/courses/new` | AuthorCourseFormPage |
| `/author/courses/:id` | AuthorCourseFormPage |
| `/author/courses/:id/modules` | AuthorCourseModulesPage |
| `/author/lessons` | AuthorLessonsPage |
| `/author/lessons/new` | AuthorLessonFormPage |
| `/author/lessons/:id` | AuthorLessonFormPage |
| `/author/analytics` | AuthorAnalyticsPage |

### Админ-панель (`/admin/*`)

| URL | Страница |
|-----|----------|
| `/admin` | AdminDashboard |
| `/admin/users` | AdminUsers |
| `/admin/courses` | AdminCourses |
| `/admin/lessons` | AdminLessons |
| `/admin/tags` | AdminTags |
| `/admin/moderation` | AdminModeration |
| `/admin/applications` | AdminApplications |

---

## 5. API Endpoints

### Аутентификация

| Endpoint | Метод | Защита | Описание |
|----------|-------|--------|----------|
| `/api/auth/register` | POST | Публичный | Регистрация |
| `/api/auth/login` | POST | Публичный | Вход |
| `/api/auth/logout` | POST | Публичный | Выход |
| `/api/auth/me` | GET | Публичный | Текущий пользователь |

### Курсы

| Endpoint | Метод | Защита | Описание |
|----------|-------|--------|----------|
| `/api/courses` | GET | Публичный | Список с фильтрами |
| `/api/courses/:slug` | GET | Публичный | Детали курса |
| `/api/courses/:slug/modules` | GET | Публичный | Модули курса |

### Уроки

| Endpoint | Метод | Защита | Описание |
|----------|-------|--------|----------|
| `/api/lessons/:slug` | GET | Публичный | Детали урока |
| `/api/lessons/:slug/content` | GET | Публичный | Контент урока |

### Пользователь

| Endpoint | Метод | Защита | Описание |
|----------|-------|--------|----------|
| `/api/user/me` | GET | requireAuth | Профиль |
| `/api/user/profile` | PATCH | requireAuth | Обновить профиль |
| `/api/user/favorites` | GET/POST/DELETE | requireAuth | Избранное |
| `/api/user/history` | GET/POST | requireAuth | История |
| `/api/user/progress/courses` | GET | requireAuth | Прогресс курсов |
| `/api/user/progress/lessons/:id` | GET/POST | requireAuth | Прогресс урока |
| `/api/user/profile/:nickname` | GET | Публичный | Публичный профиль |

### Теги

| Endpoint | Метод | Защита | Описание |
|----------|-------|--------|----------|
| `/api/tags` | GET | Публичный | Список |
| `/api/tags/:slug/courses` | GET | Публичный | Курсы по тегу |

### Автор

| Endpoint | Метод | Защита | Описание |
|----------|-------|--------|----------|
| `/api/author/stats` | GET | AUTHOR | Статистика |
| `/api/author/courses` | * | AUTHOR | Курсы |
| `/api/author/lessons` | * | AUTHOR | Уроки |
| `/api/author/modules` | * | AUTHOR | Модули |
| `/api/author/lessons/:id/content/*` | POST | AUTHOR | Контент уроков |

### Админ

| Endpoint | Метод | Защита | Описание |
|----------|-------|--------|----------|
| `/api/admin/stats` | GET | ADMIN | Статистика |
| `/api/admin/users` | * | ADMIN | Пользователи |
| `/api/admin/courses` | * | ADMIN | Курсы |
| `/api/admin/lessons` | * | ADMIN | Уроки |
| `/api/admin/tags` | * | ADMIN | Теги |
| `/api/admin/applications` | GET/PATCH | ADMIN | Заявки авторов |

**Swagger документация:** `http://localhost:3000/api/swagger`

---

## 6. База данных

### Основные модели

| Модель | Описание |
|--------|----------|
| `User` | Пользователь (email, password, role) |
| `Profile` | Профиль пользователя (nickname, bio, avatar) |
| `Course` | Курс (title, slug, description, author) |
| `Module` | Модуль курса (title, order, courseId) |
| `Lesson` | Урок (title, slug, type, moduleId) |
| `TextContent` | Текстовый контент урока |
| `VideoContent` | Видео контент урока |
| `AudioContent` | Аудио контент урока |
| `QuizContent` | Тестовый контент урока |
| `UserProgress` | Прогресс пользователя по курсам |
| `LessonProgress` | Прогресс по урокам |
| `History` | История просмотров |
| `Favorite` | Избранное |
| `Comment` | Комментарии |
| `Application` | Заявки авторов |
| `Subscription` | Подписки |
| `Transaction` | Транзакции |
| `Tag` | Теги |

### Статусы контента

| Статус | Описание | Кто может установить |
|--------|----------|---------------------|
| DRAFT | Черновик | Автор |
| PENDING_REVIEW | На модерации | Автор |
| PUBLISHED | Опубликован | Админ/Модератор |
| ARCHIVED | В архиве | Админ |

### Типы уроков

| Тип | Контент | Редактор |
|-----|---------|----------|
| ARTICLE | Текст (Markdown) | TextContentEditor |
| VIDEO | Видео URL | VideoContentEditor |
| AUDIO | Аудио URL | AudioContentEditor |
| QUIZ | Тест | QuizContentEditor |
| CALCULATOR | Калькулятор | — |

---

## 7. Компоненты и переиспользование

### Переиспользуемые компоненты (`src/components/common/`)

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
| `MarkdownContent` | Рендер Markdown |

### Переиспользуемые хуки

| Хук | Назначение |
|-----|------------|
| `useAuth` | Авторизация |
| `useCourseCatalog` | Каталог курсов |
| `useCourseDetail` | Детали курса |
| `useLesson` | Урок с контентом |
| `useUserFavorites` | Избранное |
| `useUserProgress` | Прогресс |
| `useTagList` | Теги (CRUD) |
| `useCourseList` | Курсы (CRUD) |
| `useLessonList` | Уроки (CRUD) |
| `useUserList` | Пользователи (CRUD) |

### Модальные окна (`src/components/modals/`)

| Модалка | Назначение |
|---------|------------|
| `CourseModal` | Создание/редактирование курса |
| `LessonModal` | Создание/редактирование урока |
| `TagModal` | Создание/редактирование тега |
| `UserModal` | Редактирование пользователя |

---

## 8. Безопасность

### Реализованные меры

| Мера | Реализация |
|------|------------|
| Защита паролей | bcryptjs, 12 раундов |
| Сессии | HttpOnly cookies, SameSite=Strict |
| SQL-инъекции | Prisma ORM |
| XSS | React экранирование |
| CSRF | SameSite=Strict cookies |
| Авторизация | Middleware requireAuth, requireRole |
| Проверка блокировки | isBlocked при аутентификации |
| Защита роутов | ProtectedRoute на клиенте |

### Рекомендуемые улучшения

| Мера | Приоритет |
|------|-----------|
| Content-Security-Policy (CSP) | Высокий |
| Rate limiting | Средний |
| 2FA | Средний |
| Логирование действий | Средний |

---

## 9. Запуск проекта

### Требования

- Node.js 18+
- MySQL 8+

### Установка

```bash
# Frontend
cd src
npm install
npm run dev

# Backend
cd server
npm install
npx tsx index.ts
```

### Переменные окружения

```env
DATABASE_URL="mysql://root:password@localhost:3306/economikus"
```

### Сборка для продакшена

```bash
npm run build
```

---

*Обновлено: Апрель 2026*
