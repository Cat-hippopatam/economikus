# Структура проекта Economikus

## Обзор

Платформа онлайн-обучения финансовой грамотности и инвестициям. Включает административную панель, панель автора, систему подписок и пользовательский профиль.

**Последнее обновление:** Март 2026  
**Статус:** В активной разработке (~75% готовности)

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
├── components/           # UI компоненты
├── hooks/                # Кастомные хуки
├── pages/                # Страницы
├── services/             # API сервисы
├── types/                # TypeScript типы
├── constants/            # Константы
├── layouts/              # Макеты страниц
├── lib/                  # Утилиты
├── store/                # Zustand store
└── shared/               # Общие компоненты
```

### Страницы
```
src/pages/
├── HomePage.tsx                    # Главная
├── CatalogPage.tsx                 # Каталог курсов
├── CoursePage.tsx                  # Страница курса
├── LessonPage.tsx                  # Страница урока
├── CalculatorsPage.tsx             # Калькуляторы
├── CalculatorPage.tsx              # Страница калькулятора
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
│   ├── MediaImage.tsx
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
│   ├── QuizContentEditor.tsx
│   └── CourseCoverUpload.tsx
├── profile/
│   ├── ProfileHeader.tsx
│   ├── ProfileTabs.tsx
│   ├── ProgressTab.tsx
│   ├── HistoryTab.tsx
│   └── FavoritesTab.tsx
└── calculators/
    ├── CompoundInterestCalculator.tsx
    ├── LoanCalculator.tsx
    └── MortgageCalculator.tsx
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
├── useCourseCatalog.ts      # Каталог курсов
├── useCourseDetail.ts       # Детали курса
├── useLesson.ts             # Публичный урок
├── useUserProgress.ts       # Прогресс пользователя
├── useUserHistory.ts        # История просмотров
├── useUserFavorites.ts      # Избранное
└── author/
    ├── useAuthorCourses.ts      # Курсы автора
    ├── useAuthorCourse.ts       # Курс автора (CRUD)
    ├── useAuthorLessons.ts      # Уроки автора
    ├── useAuthorLesson.ts       # Урок автора (CRUD)
    ├── useCourseModules.ts      # Модули курса
    ├── useLessonContent.ts      # Контент урока
    └── useAuthorAnalytics.ts    # Аналитика автора
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

### Store (Zustand)
```
src/store/
├── authStore.ts             # Состояние авторизации
├── notificationStore.ts     # Уведомления
└── uiStore.ts               # UI состояние
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
├── README.md                      # Главная документация
├── PROJECT_DOCUMENTATION.md       # Общее описание проекта
├── TECHNICAL_DOCUMENTATION.md     # Техническая документация
├── PROJECT_STRUCTURE.md           # Структура проекта
├── TZ.md                          # Техническое задание (ГОСТ)
├── TZ_MINIMAL.md                  # Минимальное ТЗ для MVP
├── OPTIMIZATION_GUIDE.md          # Правила оптимизации
├── REFACTORING_PLAN.md            # План рефакторинга
├── AUTHOR_PANEL_PLAN.md           # План панели автора
├── SUBSCRIPTIONS_PLAN.md          # Стратегия подписок
├── SUBSCRIPTIONS_API.md           # API подписок
├── LESSON_CONTENT_PLAN.md         # План контента уроков
├── MEDIA_STORAGE_CONFIG.md        # Конфигурация медиа-хранилища
├── MEDIA_UPLOAD_GUIDE.md          # Руководство по загрузке медиа
├── MEDIA_UPLOAD_TEST_PLAN.md      # План тестирования медиа 📝
├── SEO_PLAN.md                    # План SEO оптимизации
├── FIXES_TAGS_AND_COVERS.md       # Исправления тегов и обложек
└── MVP_TASKS.md                   # Задачи для MVP
```

---

## Статус реализации

### ✅ Реализовано

- [x] Аутентификация (Cookie сессии, bcryptjs)
- [x] Админ-панель (пользователи, курсы, уроки, теги, модерация, заявки)
- [x] Панель автора (курсы, уроки, модули, контент, аналитика)
- [x] Каталог курсов (фильтры, поиск, пагинация)
- [x] Страница курса (модули, прогресс)
- [x] Страница урока (ARTICLE, VIDEO, AUDIO, QUIZ, CALCULATOR)
- [x] Калькуляторы (сложный процент, кредит, ипотека)
- [x] Система подписок (API)
- [x] Прогресс обучения и история просмотров
- [x] Избранное (коллекции, заметки)
- [x] Реакции и комментарии
- [x] Медиа-хранилище (локальное/CDN, WebP конвертация)
- [x] SEO: sitemap.xml, robots.txt
- [x] Legal страницы: Terms, Privacy, Cookies
- [x] Swagger/OpenAPI документация

### ⏳ В планах

- [ ] Тестирование медиа-загрузки (полный цикл)
- [ ] Frontend подписок (компоненты, интеграция)
- [ ] OAuth провайдеры (Google, VK, Yandex)
- [ ] Генерация сертификатов (PNG, PDF)
- [ ] Schema.org микроразметка
- [ ] Open Graph теги
- [ ] SSR для SEO
- [ ] Платежи (ЮKassa)
- [ ] Мобильная версия (PWA)
- [ ] Unit-тесты (Vitest)
- [ ] E2E тесты (Playwright)