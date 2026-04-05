# Структура проекта Economikus

## Обзор

Платформа онлайн-обучения финансовой грамотности и инвестициям. Включает административную панель, панель автора, систему подписок и пользовательский профиль.

---

## Backend структура

### Главный файл
```
server/
├── index.ts              # Express сервер
├── package.json
└── prisma/
    └── schema.prisma     # Схема базы данных
```

### Маршруты API
```
server/routes/
├── auth.routes.ts        # Аутентификация (register, login, logout, me)
├── user.routes.ts        # Пользователи (CRUD, профиль, прогресс, история)
├── course.routes.ts      # Публичные курсы
├── lesson.routes.ts      # Публичные уроки
├── author.routes.ts      # Панель автора (курсы, уроки, модули, контент)
├── admin.routes.ts       # Админ-панель (пользователи, контент, модерация)
├── moderation.routes.ts  # Модерация контента
└── subscriptions.routes.ts # Подписки, платежи, транзакции
```

### Модели данных (Prisma)
- `Profile` — профиль пользователя
- `Course` — курсы
- `Module` — модули курсов
- `Lesson` — уроки
- `TextContent`, `VideoContent`, `AudioContent`, `QuizContent` — контент уроков
- `Comment` — комментарии
- `Application` — заявки авторов
- `Subscription`, `Transaction`, `PaymentMethod` — подписки и платежи
- `UserProgress`, `LessonProgress` — прогресс обучения
- `History` — история просмотров
- `Favorite` — избранное

---

## Frontend структура

### Основные папки
```
src/
├── main.tsx              # Точка входа
├── App.tsx               # Роутинг
├── env.d.ts              # Типы для env
├── api/                  # OpenAPI клиент
├── components/           # UI компоненты
├── hooks/                # Кастомные хуки
├── pages/                # Страницы
├── services/             # API сервисы
├── types/                # TypeScript типы
├── constants/            # Константы
└── styles/               # Стили
```

### Страницы
```
src/pages/
├── HomePage.tsx                    # Главная
├── CatalogPage.tsx                 # Каталог курсов
├── CoursePage.tsx                  # Страница курса
├── LessonPage.tsx                  # Страница урока
├── CalculatorPage.tsx              # Калькуляторы
├── LoginPage.tsx                   # Вход
├── RegisterPage.tsx                # Регистрация
├── NotFoundPage.tsx                # 404
├── profile/
│   ├── ProfilePage.tsx             # Профиль пользователя
│   ├── ProfileSettingsPage.tsx     # Настройки профиля
│   └── BecomeAuthorPage.tsx        # Стать автором
├── admin/
│   ├── AdminDashboard.tsx
│   ├── AdminUsers.tsx
│   ├── AdminCourses.tsx
│   ├── AdminLessons.tsx
│   ├── AdminTags.tsx
│   ├── AdminModeration.tsx
│   └── AdminApplications.tsx
├── author/
│   ├── AuthorDashboardPage.tsx
│   ├── AuthorCoursesPage.tsx
│   ├── AuthorCourseFormPage.tsx
│   ├── AuthorCourseModulesPage.tsx
│   ├── AuthorLessonsPage.tsx
│   ├── AuthorLessonFormPage.tsx
│   └── AuthorAnalyticsPage.tsx
└── info/
    └── InfoPage.tsx                 # О нас, команда, контакты
```

### Компоненты
```
src/components/
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── FooterLinks.tsx
│   └── ProtectedRoute.tsx
├── common/
│   ├── StatusBadge.tsx
│   ├── RoleBadge.tsx
│   ├── LoadingState.tsx
│   ├── EmptyState.tsx
│   ├── ErrorState.tsx
│   ├── ConfirmDialog.tsx
│   ├── ColorIndicator.tsx
│   ├── AvatarUploader.tsx
│   └── MarkdownContent.tsx
├── cards/
│   ├── CourseCard.tsx
│   ├── LessonCard.tsx
│   └── StatCard.tsx
├── modals/
│   ├── CourseModal.tsx
│   ├── LessonModal.tsx
│   ├── TagModal.tsx
│   └── UserModal.tsx
├── tables/
│   ├── DataTable.tsx
│   └── TableFilters.tsx
├── author/
│   ├── AuthorLayout.tsx
│   ├── TextContentEditor.tsx
│   ├── VideoContentEditor.tsx
│   ├── AudioContentEditor.tsx
│   └── QuizContentEditor.tsx
└── profile/
    ├── ProfileHeader.tsx
    ├── ProfileTabs.tsx
    ├── ProgressTab.tsx
    ├── HistoryTab.tsx
    └── FavoritesTab.tsx
```

### Хуки
```
src/hooks/
├── useAuth.ts               # Авторизация
├── useNotification.ts       # Уведомления
├── useAvatarUpload.ts       # Загрузка аватара
├── useCourseList.ts         # Список курсов (админ)
├── useLessonList.ts         # Список уроков (админ)
├── useTagList.ts            # Список тегов (админ)
├── useUserList.ts           # Список пользователей (админ)
├── useAuthorCourses.ts      # Курсы автора
├── useAuthorCourse.ts       # Курс автора (CRUD)
├── useAuthorLessons.ts      # Уроки автора
├── useAuthorLesson.ts       # Урок автора (CRUD)
├── useCourseModules.ts      # Модули курса
├── useLessonContent.ts      # Контент урока
├── useLesson.ts             # Публичный урок
├── useUserProgress.ts       # Прогресс пользователя
├── useUserHistory.ts        # История просмотров
└── useUserFavorites.ts      # Избранное
```

### API Сервисы
```
src/services/
├── api.ts                   # Базовый API клиент
├── auth.service.ts
├── user.service.ts
├── course.service.ts
├── lesson.service.ts
├── tag.service.ts
├── comment.service.ts
├── application.service.ts
└── history.service.ts
```

---

## Публичные файлы

```
public/
├── favicon.ico
├── sitemap.xml              # Карта сайта
└── robots.txt               # Правила для поисковиков
```

---

## Документация

```
docs/
├── PROJECT_DOCUMENTATION.md # Основная документация
├── TECHNICAL_DOCUMENTATION.md # Техническая документация
├── SEO_PLAN.md              # План SEO
├── AUTHOR_PANEL_PLAN.md     # Панель автора
├── SUBSCRIPTIONS_PLAN.md    # Система подписок
├── SUBSCRIPTIONS_API.md     # API подписок
├── LESSON_CONTENT_PLAN.md   # Контент уроков
├── OPTIMIZATION_GUIDE.md    # Руководство по оптимизации
├── REFACTORING_PLAN.md      # План рефакторинга
└── PROJECT_STRUCTURE.md     # Структура проекта
```

---

## Статус реализации

### ✅ Реализовано
- Админ-панель (пользователи, курсы, уроки, теги, модерация, заявки)
- Панель автора (курсы, уроки, модули, контент, аналитика)
- Система подписок (API)
- Прогресс обучения и история просмотров
- Избранное
- SEO: sitemap.xml, robots.txt
- Legal страницы: Terms, Privacy, Cookies

### ⏳ В планах
- SSR для SEO
- Schema.org микроразметка
- Open Graph теги
- Тесты