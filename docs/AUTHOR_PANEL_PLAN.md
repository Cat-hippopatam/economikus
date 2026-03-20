# План разработки: Панель автора

> Детальный план с приоритетами и этапами

---

## 1. Обзор

### 1.1 Цель
Создать полнофункциональную панель автора для управления курсами, уроками и просмотра статистики.

### 1.2 Текущий статус реализации

#### ✅ Полностью реализовано
- **AuthorLayout** - Layout с боковой навигацией
- **AuthorDashboardPage** - Главная страница со статистикой
- **AuthorCoursesPage** - Список курсов с фильтрами и поиском
- **AuthorCourseFormPage** - Создание/редактирование курса
- **AuthorLessonsPage** - Список уроков с фильтрами
- **AuthorLessonFormPage** - Создание/редактирование урока с контентом
- **AuthorCourseModulesPage** - Управление модулями курса (Drag&Drop)
- **AuthorAnalyticsPage** - Страница аналитики ✅ **НОВОЕ**

#### ✅ API Endpoints
- `/author/stats` - Статистика автора
- `/author/analytics` - Детальная аналитика ✅ **НОВОЕ**
- `/author/courses` - CRUD курсов
- `/author/lessons` - CRUD уроков
- `/author/modules` - CRUD модулей
- `/author/lessons/:id/content/*` - Контент уроков (text, video, audio, quiz)

#### ✅ Хуки
- `useAuthorCourses` - Управление списком курсов
- `useAuthorCourse` - CRUD одного курса
- `useAuthorLessons` - Управление списком уроков
- `useAuthorLesson` - CRUD одного урока
- `useCourseModules` - Управление модулями
- `useLessonContent` - Управление контентом урока
- `useTagOptions` - Получение тегов

#### ✅ Компоненты
- `MarkdownContent` - Отображение Markdown с подсветкой синтаксиса
- `TextContentEditor` - Редактор текста с предпросмотром и загрузкой .md
- `VideoContentEditor` - Форма для видео URL (YouTube, Vimeo, RuTube)
- `AudioContentEditor` - Форма для аудио URL
- `QuizContentEditor` - Полноценный редактор тестов

#### ✅ Документация API
- OpenAPI/Swagger документация для всех endpoints автора
- Доступ: `http://localhost:3000/api/swagger`

---

## 2. Архитектура

### 2.1 Структура роутов

```
/author
├── /dashboard          ✅ Главная страница (статистика)
├── /courses            ✅ Список курсов автора
│   ├── /new            ✅ Создание курса
│   └── /:id            ✅ Редактирование курса
│       └── /modules    ✅ Управление модулями курса
├── /lessons            ✅ Список уроков автора
│   ├── /new            ✅ Создание урока
│   └── /:id            ✅ Редактирование урока (вкладки: Настройки / Контент)
└── /analytics          ✅ Аналитика
```

### 2.2 Структура файлов

```
src/
├── pages/author/
│   ├── AuthorDashboardPage.tsx      ✅ Готово
│   ├── AuthorCoursesPage.tsx        ✅ Готово
│   ├── AuthorCourseFormPage.tsx     ✅ Готово
│   ├── AuthorLessonsPage.tsx        ✅ Готово
│   ├── AuthorLessonFormPage.tsx     ✅ Готово (с редакторами контента)
│   ├── AuthorCourseModulesPage.tsx  ✅ Готово (Drag&Drop)
│   └── AuthorAnalyticsPage.tsx      ✅ Готово
│
├── components/author/
│   ├── AuthorLayout.tsx             ✅ Готово
│   └── index.ts                     ✅ Готово
│
├── components/common/
│   ├── MarkdownContent.tsx          ✅ Готово (Markdown + подсветка)
│   └── ...
│
├── hooks/
│   ├── useAuthorCourses.ts          ✅ Готово
│   ├── useAuthorCourse.ts           ✅ Готово
│   ├── useAuthorLessons.ts          ✅ Готово
│   ├── useAuthorLesson.ts           ✅ Готово
│   ├── useCourseModules.ts          ✅ Готово
│   ├── useLessonContent.ts          ✅ Готово
│   └── useTagOptions.ts             ✅ Готово
│
└── constants/
    └── author.ts                    ✅ Готово
```

---

## 3. API Endpoints

### 3.1 Полный список

| Endpoint | Метод | Статус | Описание |
|----------|-------|--------|----------|
| `/author/stats` | GET | ✅ | Статистика автора |
| `/author/analytics` | GET | ✅ | Детальная аналитика |
| `/author/courses` | GET | ✅ | Список курсов автора |
| `/author/courses` | POST | ✅ | Создать курс |
| `/author/courses/:id` | GET | ✅ | Детали курса |
| `/author/courses/:id` | PATCH | ✅ | Обновить курс |
| `/author/courses/:id` | DELETE | ✅ | Удалить курс (мягкое удаление) |
| `/author/courses/:id/modules` | GET | ✅ | Модули курса |
| `/author/lessons` | GET | ✅ | Список уроков автора |
| `/author/lessons` | POST | ✅ | Создать урок |
| `/author/lessons/:id` | GET | ✅ | Детали урока |
| `/author/lessons/:id` | PATCH | ✅ | Обновить урок |
| `/author/lessons/:id` | DELETE | ✅ | Удалить урок |
| `/author/modules` | GET | ✅ | Список курсов с модулями |
| `/author/modules` | POST | ✅ | Создать модуль |
| `/author/modules/:id` | PATCH | ✅ | Обновить модуль |
| `/author/modules/:id` | DELETE | ✅ | Удалить модуль |
| `/author/modules/reorder` | POST | ✅ | Изменить порядок модулей |
| `/author/lessons/:id/content` | GET | ✅ | Контент урока |
| `/author/lessons/:id/content/text` | POST | ✅ | Сохранить текст |
| `/author/lessons/:id/content/video` | POST | ✅ | Сохранить видео |
| `/author/lessons/:id/content/audio` | POST | ✅ | Сохранить аудио |
| `/author/lessons/:id/content/quiz` | POST | ✅ | Сохранить тест |

---

## 4. Этапы разработки

### Этап 1: Базовая инфраструктура ✅ ЗАВЕРШЁН
- AuthorLayout с боковой навигацией
- Роутинг в App.tsx
- Константы (AUTHOR_NAVIGATION, статусы, типы)

### Этап 2: Управление курсами ✅ ЗАВЕРШЁН
- AuthorCoursesPage (список с фильтрами)
- AuthorCourseFormPage (создание/редактирование)
- Валидация статусов (DRAFT, PENDING_REVIEW для автора)
- Мягкое удаление (deletedAt)

### Этап 3: Управление уроками ✅ ЗАВЕРШЁН
- AuthorLessonsPage (список с фильтрами)
- AuthorLessonFormPage (создание/редактирование)
- Вкладки: Настройки / Контент
- Валидация статусов
- Мягкое удаление

### Этап 3.5: Управление модулями ✅ ЗАВЕРШЁН
- AuthorCourseModulesPage
- Drag&Drop сортировка
- Группировка по курсам
- Счётчик уроков в модуле

### Этап 4: Контент уроков ✅ ЗАВЕРШЁН
- API для Text/Video/Audio/Quiz контента
- TextContentEditor с Markdown и предпросмотром
- Загрузка .md файлов
- Подсветка синтаксиса (react-syntax-highlighter)
- VideoContentEditor (YouTube, Vimeo, RuTube)
- AudioContentEditor
- QuizContentEditor (вопросы, варианты, правильный ответ)

### Этап 5: Аналитика ✅ ЗАВЕРШЁН
- AuthorAnalyticsPage создана
- API endpoint `/author/analytics` реализован
- OpenAPI документация добавлена
- Базовая статистика: overview, курсы/уроки по статусам, топ контент

### Этап 6: Улучшения 🔲 ПЛАНИРУЕТСЯ
- WYSIWYG редактор (Tiptap) вместо Textarea
- Загрузка медиа на сервер (S3/MinIO)
- Редактор калькуляторов
- Графики статистики (Recharts)

---

## 5. Бизнес-логика

### 5.1 Статусы контента

| Статус | Описание | Кто может установить |
|--------|----------|---------------------|
| `DRAFT` | Черновик | Автор |
| `PENDING_REVIEW` | На модерации | Автор |
| `PUBLISHED` | Опубликован | Только Админ/Модератор |

**Валидация на сервере:**
```typescript
const allowedStatuses = ['DRAFT', 'PENDING_REVIEW']
const finalStatus = allowedStatuses.includes(status) ? status : 'DRAFT'
```

### 5.2 Мягкое удаление

- Поле `deletedAt: DateTime?`
- При удалении: `deletedAt = new Date()`
- Запись остаётся в БД, но не видна в запросах
- Восстановление только через админ-панель

### 5.3 Выбор модуля для урока

- Модули группируются по курсам
- В Select отображаются как: `Курс → Модуль`
- Модуль можно не выбирать (урок без модуля)

### 5.4 Типы контента урока

| Тип | Редактор | Хранение |
|-----|----------|----------|
| ARTICLE | TextContentEditor (Markdown) | TextContent.body |
| VIDEO | VideoContentEditor (URL) | VideoContent.videoUrl |
| AUDIO | AudioContentEditor (URL) | AudioContent.audioUrl |
| QUIZ | QuizContentEditor | QuizContent.questions (JSON) |

---

## 6. Правила разработки

### 6.1 Тестирование API
**Правило:** При создании новых API endpoints обязательно проводить тестирование:
1. Проверить доступ без авторизации (должен вернуть 401)
2. Проверить доступ с авторизацией
3. Проверить валидацию данных
4. Добавить документацию в Swagger/OpenAPI

### 6.2 Документация
- Все новые endpoints должны быть задокументированы в OpenAPI
- Обновлять AUTHOR_PANEL_PLAN.md при добавлении нового функционала
- Обновлять TECHNICAL_DOCUMENTATION_4.md при изменении статуса

---

## 7. Установленные пакеты

```json
{
  "dependencies": {
    "@hello-pangea/dnd": "^16.0.1",     // Drag&Drop для модулей
    "react-markdown": "^9.x",           // Рендеринг Markdown
    "remark-gfm": "^4.x",               // GitHub Flavored Markdown
    "react-syntax-highlighter": "^15.x", // Подсветка кода
    "@types/react-syntax-highlighter": "^15.x"
  }
}
```

---

## 8. Связанные документы

- [docs/LESSON_CONTENT_PLAN.md](./docs/LESSON_CONTENT_PLAN.md) - План контента уроков
- [OPTIMIZATION_GUIDE.md](./OPTIMIZATION_GUIDE.md) - Правила оптимизации
- [TECHNICAL_DOCUMENTATION_4.md](./TECHNICAL_DOCUMENTATION_4.md) - Техническая документация

---

*Создано: Март 2026*
*Версия: 3.0*
*Обновлено: Добавлен этап 5 - Аналитика, обновлён статус реализации*
