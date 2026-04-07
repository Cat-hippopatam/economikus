# 📁 Файловая структура проекта Economikus

> Полное описание структуры файлов и директорий образовательной платформы

---

## Содержание

1. [Обзор структуры](#1-обзор-структуры)
2. [Корневая директория](#2-корневая-директория)
3. [Исходный код (src)](#3-исходный-код-src)
4. [Серверная часть (server)](#4-серверная-часть-server)
5. [Документация (docs)](#5-документация-docs)
6. [Публичные ресурсы](#6-публичные-ресурсы)
7. [Конфигурационные файлы](#7-конфигурационные-файлы)

---

## 1. Обзор структуры

```
economikus/
├── src/                    # Frontend приложение (React)
├── server/                 # Backend приложение (Hono)
├── docs/                   # Документация проекта
├── public/                 # Публичные статические файлы
├── prisma/                 # Схема базы данных
├── dist-server/            # Скомпилированный сервер
├── .qodo/                  # Внутренние метаданные
│
├── index.html              # Точка входа HTML
├── package.json            # Зависимости frontend
├── vite.config.ts          # Конфигурация Vite
├── tsconfig*.json          # Конфигурация TypeScript
├── eslint.config.js        # Конфигурация ESLint
├── prisma.config.ts        # Конфигурация Prisma
└── README.md               # Главная документация
```

---

## 2. Корневая директория

| Файл/Папка | Описание |
|------------|----------|
| `index.html` | HTML точка входа для SPA приложения |
| `package.json` | Зависимости и npm-скрипты frontend |
| `vite.config.ts` | Конфигурация сборщика Vite |
| `tsconfig*.json` | Конфигурация TypeScript (app, node, server) |
| `eslint.config.js` | Правила линтера ESLint |
| `prisma.config.ts` | Конфигурация ORM Prisma |
| `prisma/` | Схема и миграции базы данных |
| `server/` | Серверная часть приложения |
| `src/` | Клиентская часть приложения |
| `public/` | Статические файлы (favicon, sitemap) |
| `build-server.mjs` | Скрипт сборки сервера |
| `test_seed.js` | Скрипт для наполнения тестовыми данными |
| `economikus.sql` | SQL дамп базы данных |
| `tree-structure.ts` | Генератор структуры проекта |

---

## 3. Исходный код (src)

```
src/
├── main.tsx                    # Точка входа React приложения
├── App.tsx                     # Главный компонент с роутингом
├── index.css                   # Глобальные стили
├── App.css                     # Стили App компонента
│
├── assets/                     # Статические ассеты (изображения, шрифты)
│
├── components/                 # React компоненты
│   ├── index.ts               # Экспорт всех компонентов
│   ├── ErrorBoundary.tsx      # Обработчик ошибок
│   │
│   ├── auth/                  # Компоненты аутентификации
│   │   ├── ProtectedRoute.tsx # Защищённый маршрут
│   │   └── index.ts
│   │
│   ├── author/                # Компоненты панели автора
│   │   ├── AuthorLayout.tsx   # Макет панели автора
│   │   └── index.ts
│   │
│   ├── calculators/           # Финансовые калькуляторы
│   │   ├── CompoundInterestCalculator.tsx
│   │   ├── LoanCalculator.tsx
│   │   ├── MortgageCalculator.tsx
│   │   └── index.ts
│   │
│   ├── cards/                 # Карточки контента
│   │   ├── StatCard.tsx       # Карточка статистики
│   │   └── index.ts
│   │
│   ├── common/                # Общие переиспользуемые компоненты
│   │   ├── AvatarUploader.tsx     # Загрузка аватара
│   │   ├── ColorIndicator.tsx     # Цветовой индикатор
│   │   ├── ConfirmDialog.tsx      # Диалог подтверждения
│   │   ├── EmptyState.tsx         # Состояние "пусто"
│   │   ├── ErrorState.tsx         # Состояние ошибки
│   │   ├── LoadingState.tsx       # Состояние загрузки
│   │   ├── MarkdownContent.tsx    # Рендер Markdown
│   │   ├── RoleBadge.tsx          # Бейдж роли
│   │   ├── StatCard.tsx           # Карточка статистики
│   │   ├── StatusBadge.tsx        # Бейдж статуса
│   │   └── index.ts
│   │
│   ├── courses/               # Компоненты курсов
│   │   ├── CourseCard.tsx     # Карточка курса
│   │   └── index.ts
│   │
│   ├── forms/                 # Формы (будущие)
│   │
│   ├── layout/                # Компоненты макета
│   │   ├── Header.tsx         # Шапка сайта
│   │   ├── Footer.tsx         # Подвал сайта
│   │   └── index.ts
│   │
│   ├── modals/                # Модальные окна
│   │   ├── CourseModal.tsx    # Модалка курса
│   │   ├── LessonModal.tsx    # Модалка урока
│   │   ├── TagModal.tsx       # Модалка тега
│   │   ├── UserModal.tsx      # Модалка пользователя
│   │   └── index.ts
│   │
│   ├── profile/               # Компоненты профиля
│   │   ├── CertificatesTab.tsx       # Вкладка сертификатов
│   │   ├── DevelopingTab.tsx         # Вкладка "В разработке"
│   │   ├── FavoritesTab.tsx          # Вкладка избранного
│   │   ├── HistoryTab.tsx            # Вкладка истории
│   │   ├── ProgressTab.tsx           # Вкладка прогресса
│   │   ├── SubscriptionPaymentTab.tsx# Вкладка оплаты
│   │   ├── SubscriptionsTab.tsx      # Вкладка подписок
│   │   └── index.ts
│   │
│   └── tables/                # Табличные компоненты
│       ├── DataTable.tsx      # Таблица данных
│       ├── TableFilters.tsx   # Фильтры таблицы
│       └── index.ts
│
├── constants/                 # Константы приложения
│   ├── author.ts              # Константы автора
│   ├── config.ts              # Общая конфигурация
│   ├── difficulty.ts          # Уровни сложности
│   ├── enums.ts               # Перечисления
│   ├── index.ts               # Экспорт констант
│   ├── lessonTypes.ts         # Типы уроков
│   ├── navigation.ts          # Навигационные данные
│   ├── roles.ts               # Роли пользователей
│   └── status.ts              # Статусы
│
├── hooks/                     # Кастомные React хуки
│   ├── index.ts               # Экспорт хуков
│   │
│   ├── useAuth.ts             # Аутентификация
│   ├── useAuthorApplication.ts# Заявка автора
│   ├── useAuthorCourse.ts     # Курс автора (CRUD)
│   ├── useAuthorCourses.ts    # Список курсов автора
│   ├── useAuthorLesson.ts     # Урок автора (CRUD)
│   ├── useAuthorLessons.ts    # Список уроков автора
│   ├── useAuthorModules.ts    # Модули курса
│   ├── useAvatarUpload.ts     # Загрузка аватара
│   ├── useConfirm.ts          # Подтверждение действий
│   ├── useCourseCatalog.ts    # Каталог курсов
│   ├── useCourseDetail.ts     # Детали курса
│   ├── useCourseList.ts       # Список курсов (админ)
│   ├── useCourseModules.ts    # Модули курса
│   ├── useLesson.ts           # Публичный урок
│   ├── useLessonAccess.ts     # Доступ к уроку
│   ├── useLessonContent.ts    # Контент урока
│   ├── useLessonList.ts       # Список уроков (админ)
│   ├── useNotification.ts     # Уведомления
│   ├── usePagination.ts       # Пагинация
│   ├── useSubscriptionCheck.ts# Проверка подписки
│   ├── useTagList.ts          # Список тегов (админ)
│   ├── useTagOptions.ts       # Опции тегов
│   ├── useUserCertificates.ts # Сертификаты пользователя
│   ├── useUserFavorites.ts    # Избранное пользователя
│   ├── useUserHistory.ts      # История просмотров
│   ├── useUserList.ts         # Список пользователей
│   ├── useUserPaymentMethods.ts# Методы оплаты
│   ├── useUserProgress.ts     # Прогресс обучения
│   ├── useUserSubscriptions.ts# Подписки пользователя
│   └── useUserTransactions.ts # Транзакции пользователя
│
├── layouts/                   # Макеты страниц
│   ├── AuthLayout.tsx         # Макет страниц авторизации
│   ├── MainLayout.tsx         # Основной макет
│   └── index.ts
│
├── lib/                       # Утилиты и вспомогательные функции
│   ├── api.ts                 # API клиент
│   └── localStorage.ts        # Работа с localStorage
│
├── pages/                     # Страницы приложения
│   ├── HomePage.tsx           # Главная страница
│   ├── NotFoundPage.tsx       # Страница 404
│   │
│   ├── admin/                 # Страницы админ-панели
│   │   ├── AdminApplications.tsx
│   │   ├── AdminContentModerationPage.tsx
│   │   ├── AdminCourses.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminDeletionRequests.tsx
│   │   ├── AdminLayout.tsx
│   │   ├── AdminLessons.tsx
│   │   ├── AdminModeration.tsx
│   │   ├── AdminTags.tsx
│   │   ├── AdminUsers.tsx
│   │   └── index.ts
│   │
│   ├── auth/                  # Страницы авторизации
│   │   ├── LoginPage.tsx      # Вход
│   │   └── RegisterPage.tsx   # Регистрация
│   │
│   ├── author/                # Страницы панели автора
│   │   ├── AuthorAnalyticsPage.tsx
│   │   ├── AuthorCourseFormPage.tsx
│   │   ├── AuthorCourseModulesPage.tsx
│   │   ├── AuthorCoursesPage.tsx
│   │   ├── AuthorDashboardPage.tsx
│   │   ├── AuthorLessonFormPage.tsx
│   │   └── AuthorLessonsPage.tsx
│   │
│   ├── calculators/           # Страницы калькуляторов
│   │   ├── CalculatorPage.tsx
│   │   ├── CalculatorsPage.tsx
│   │   └── index.ts
│   │
│   ├── catalog/               # Каталог курсов
│   │   └── CatalogPage.tsx
│   │
│   ├── courses/               # Страницы курсов
│   │   └── CoursePage.tsx
│   │
│   ├── info/                  # Информационные страницы
│   │   └── InfoPage.tsx
│   │
│   ├── legal/                 # Правовые документы
│   │   ├── CookiesPage.tsx
│   │   ├── PrivacyPage.tsx
│   │   └── TermsPage.tsx
│   │
│   ├── lessons/               # Страницы уроков
│   │   └── LessonPage.tsx
│   │
│   ├── postulates/            # Постулаты
│   │   └── PostulatesPage.tsx
│   │
│   ├── profile/               # Страницы профиля
│   │   ├── BecomeAuthorPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── ProfileSettingsPage.tsx
│   │
│   └── tools/                 # Инструменты
│       └── ToolsPage.tsx
│
├── services/                  # API сервисы
│   ├── index.ts               # Экспорт сервисов
│   ├── api.ts                 # Базовый API клиент
│   ├── accountDeletion.service.ts
│   ├── application.service.ts # Заявки авторов
│   ├── auth.service.ts        # Аутентификация
│   ├── course.service.ts      # Курсы
│   ├── lesson.service.ts      # Уроки
│   ├── tag.service.ts         # Теги
│   └── user.service.ts        # Пользователи
│
├── shared/                    # Общий код (Shared)
│   └── types.ts               # Общие типы
│
├── store/                     # Глобальное состояние
│   └── useAppStore.ts         # Zustand store
│
├── types/                     # TypeScript типы
│   ├── index.ts               # Экспорт типов
│   ├── api.ts                 # Типы API
│   ├── application.ts         # Типы заявок
│   ├── auth.ts                # Типы аутентификации
│   ├── calculator.ts          # Типы калькуляторов
│   ├── comment.ts             # Типы комментариев
│   ├── course.ts              # Типы курсов
│   ├── lesson.ts              # Типы уроков
│   ├── tag.ts                 # Типы тегов
│   └── user.ts                # Типы пользователей
│
└── utils/                     # Утилиты
    └── calculators.ts         # Функции калькуляторов
```

---

## 4. Серверная часть (server)

```
server/
├── index.ts                   # Точка входа сервера (Hono)
├── db.ts                      # Подключение к базе данных
├── types.ts                   # Типы сервера
│
├── jobs/                      # Фоновые задачи
│   └── session-cleanup.ts     # Очистка сессий
│
├── lib/                       # Серверные утилиты
│   ├── agination.ts           # Пагинация
│   ├── auth_temp.ts           # Временная аутентификация
│   ├── errors.ts              # Обработка ошибок
│   └── validators.ts          # Валидаторы
│
├── middleware/                # Промежуточное ПО
│   ├── auth.ts                # Аутентификация
│   ├── logger.ts              # Логирование
│   └── rate-limit.ts          # Ограничение частоты
│
├── routes/                    # API маршруты
│   ├── admin.routes.ts        # Админ-панель
│   ├── auth.routes.ts         # Аутентификация
│   ├── author.routes.ts       # Панель автора
│   ├── comments.routes.ts     # Комментарии
│   ├── courses.routes.ts      # Курсы
│   ├── lessons.routes.ts      # Уроки
│   ├── moderation.routes.ts   # Модерация
│   ├── payments.routes.ts     # Платежи
│   ├── progress.routes.ts     # Прогресс
│   ├── reactions.routes.ts    # Реакции
│   ├── subscriptions.routes.ts# Подписки
│   ├── tags.routes.ts         # Теги
│   └── user.routes.ts         # Пользователи
│
└── utils/                     # Утилиты сервера
    ├── response.ts            # Формирование ответов
    └── slug.ts                # Генерация slug
```

---

## 5. Документация (docs)

```
docs/
├── PROJECT_DOCUMENTATION.md   # Основная документация проекта
├── PROJECT_STRUCTURE.md       # Структура проекта
├── SITE_MAP_DIAGRAM.md        # Визуальная карта сайта
├── TECHNICAL_DOCUMENTATION.md # Техническая документация
│
├── AUTHOR_PANEL_PLAN.md       # План панели автора
├── LESSON_CONTENT_PLAN.md     # План контента уроков
├── META_TAGS_PLAN.md          # План мета-тегов
├── SUBSCRIPTIONS_PLAN.md      # План подписок
├── SUBSCRIPTIONS_API.md       # API подписок
│
├── OPTIMIZATION_GUIDE.md      # Руководство по оптимизации
├── REFACTORING_PLAN.md        # План рефакторинга
├── SECURITY_PLAN.md           # План безопасности
├── SEO_PLAN.md                # План SEO
├── SITE_STRUCTURE_AND_ANALYZATION.md # Структура и анимация
│
├── mvp_tasks.md               # MVP задачи
├── task.md                    # Задачи
├── TZ.md                      # Техническое задание
├── TZ_MINIMAL.md              # Минимальное ТЗ
│
└── economikus.sql             # SQL дамп базы данных
```

---

## 6. Публичные ресурсы

```
public/
├── favicon.ico                 # Иконка сайта
├── sitemap.xml                # Карта сайта для поисковиков
└── robots.txt                 # Правила для поисковых роботов
```

---

## 7. Конфигурационные файлы

| Файл | Назначение |
|------|------------|
| `tsconfig.json` | Базовые настройки TypeScript |
| `tsconfig.app.json` | Настройки для frontend |
| `tsconfig.node.json` | Настройки для Node.js |
| `tsconfig.server.json` | Настройки для сервера |
| `vite.config.ts` | Конфигурация Vite |
| `eslint.config.js` | Правила ESLint |
| `prisma/schema.prisma` | Схема базы данных |

---

## Соглашения об именовании

| Тип | Формат | Пример |
|-----|--------|--------|
| Компоненты | PascalCase | `CourseCard.tsx` |
| Хуки | camelCase с префиксом `use` | `useAuth.ts` |
| Константы | UPPER_SNAKE_CASE | `roles.ts` |
| Типы | PascalCase | `UserType.ts` |
| Утилиты | camelCase | `calculators.ts` |
| API сервисы | camelCase | `auth.service.ts` |
| CSS классы | kebab-case | `.course-card` |
| Файлы страниц | PascalCase | `LoginPage.tsx` |

---

## Запуск проекта

```bash
# Frontend
cd src
npm install
npm run dev

# Backend
cd server
npm install
npx tsx index.ts

# Оба сразу
npm run dev:all
```

---

*Обновлено: Март 2026*
