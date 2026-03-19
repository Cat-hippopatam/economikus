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

#### ✅ API Endpoints
- `/author/stats` - Статистика автора
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

#### ⚠️ Частично реализовано / Требует доработки
- **Аналитика** - Вкладка есть в навигации, но роут `/author/analytics` не реализован
  - Ошибка: `No routes matched location "/author/analytics"`
  - Требуется: Создать `AuthorAnalyticsPage` и добавить роут

#### 🔲 Не реализовано
- WYSIWYG редактор (Tiptap) - сейчас используется Textarea с Markdown
- Загрузка медиа-файлов на сервер
- Детальная статистика по курсам
- Редактор калькуляторов

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
└── /analytics          ⚠️ Аналитика - РОУТ НЕ СУЩЕСТВУЕТ
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
│   └── AuthorAnalyticsPage.tsx      🔲 НЕ СОЗДАН
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

### Этап 5: Аналитика 🔲 НЕ НАЧАТ
**Проблема:** Роут `/author/analytics` не существует
**Ошибка:** `No routes matched location "/author/analytics"`

**Требуется:**
1. Создать `AuthorAnalyticsPage.tsx`
2. Добавить роут в `App.tsx`
3. Реализовать API для детальной статистики
4. Добавить графики (Recharts/Chart.js)

### Этап 6: Улучшения 🔲 ПЛАНИРУЕТСЯ
- WYSIWYG редактор (Tiptap) вместо Textarea
- Загрузка медиа на сервер (S3/MinIO)
- Редактор калькуляторов
- Детальная статистика по курсам

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

## 6. Известные проблемы

### 6.1 Аналитика ⚠️
**Проблема:** Роут `/author/analytics` не существует
**Решение:** Создать страницу и добавить роут

### 6.2 WYSIWYG редактор
**Текущее состояние:** Textarea с Markdown
**План:** Интегрировать Tiptap для удобства авторов

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
*Версия: 2.0*
*Обновлено: Добавлена информация о проблеме с аналитикой, текущий статус реализации*
