# Исправления: Теги и Загрузка обложек

## 📋 Резюме

Исправлены проблемы с:
1. **Тегами** - сервер не находил теги из-за неправильных имён моделей Prisma
2. **Загрузкой обложек** - реализована серверная загрузка через FormData вместо base64

---

## ✅ Выполненные изменения

### 1. Теги - Исправление имён моделей Prisma

**Проблема:** Prisma schema использует snake_case имена моделей (`tags`, `lesson_tags`, `course_tags`), но код использовал camelCase (`tag`, `lessonTag`, `courseTag`).

**Исправленные файлы:**

#### `server/routes/author.routes.ts`
- ✅ `prisma.tag.findMany` → `prisma.tags.findMany`
- ✅ `tag.id` → `tag.tag_id`
- ✅ `prisma.lessonTag` → `prisma.lesson_tags`
- ✅ `lessonId` → `lesson_id`, `tagId` → `tag_id`
- ✅ Добавлена правильная маппинг тегов в ответе API

#### `server/routes/tags.routes.ts`
- ✅ Все обращения к `prisma.tag` → `prisma.tags`
- ✅ Все `tag.id` → `tag.tag_id`
- ✅ Связи `tags: { some: { tagId: tag.id } }` → `lesson_tags: { some: { tag_id: tag.tag_id } }`

#### `server/routes/admin.routes.ts`
- ✅ CRUD операции с тегами исправлены на `prisma.tags`

---

### 2. Загрузка обложек - Серверная часть

**Проблема:** Клиент отправлял base64 строки, сервер не обрабатывал загрузку файлов.

**Добавленные endpoint'ы:**

#### `server/routes/author.routes.ts`
```typescript
// POST /author/courses/upload-cover - уже существовал
// POST /author/lessons/upload-cover - ДОБАВЛЕН
```

Оба endpoint'а:
- Принимают `FormData` с полем `cover`
- Используют `mediaStorage.upload(file, 'covers')`
- Возвращают `{ coverUrl: string }`

---

### 3. Загрузка обложек - Клиентская часть

**Исправленные файлы:**

#### `src/services/api.ts`
- ✅ Добавлена поддержка `FormData` в методах `post`, `patch`, `put`
- ✅ Добавлен третий параметр `config?: { headers?: Record<string, string> }`
- ✅ Автоматическое определение `Content-Type` для FormData

#### `src/hooks/useAuthorLesson.ts`
- ✅ Переписан `uploadCover` для использования `FormData`
- ✅ Отправка на `/author/lessons/upload-cover`
- ✅ Проверка размера (макс 5MB)

#### `src/hooks/useAuthorCourse.ts`
- ✅ Переписан `uploadCover` для использования `FormData`
- ✅ Отправка на `/author/courses/upload-cover`
- ✅ Проверка размера (макс 5MB)

#### `src/pages/author/AuthorLessonFormPage.tsx`
- ✅ Обновлён `handleCoverUpload` для работы с новым API

---

## 🧪 Тестирование

### Тест 1: Проверка тегов в БД
```bash
npx tsx test-tags-check.ts
```
**Результат:** ✅ 13 тегов найдено

### Тест 2: Проверка имён моделей Prisma
```bash
npx tsx test-prisma-models.ts
```
**Результат:** ✅ Подтверждено snake_case (`tags`, `lesson_tags`, `course_tags`)

### Тест 3: Сборка проекта
```bash
npm run build
```
**Результат:** ✅ Успешно (4737 модулей)

---

## 📝 Известные ограничения

### Не исправлено (требуется по запросу):
- ❌ `admin.routes.ts` - другие модели (`profile`, `course`, `lesson`, `module`, `user`, `subscription`)
- ❌ `server/index.ts` - `session` → `sessions`
- ❌ `server/middleware/auth.ts` - `session` → `sessions`
- ❌ `server/jobs/session-cleanup.ts` - `session` → `sessions`

Эти файлы требуют аналогичных исправлений, но не были затронуты по запросу.

---

## 🚀 Следующие шаги

### Для тестирования загрузки обложек:
1. Запустить сервер: `npm run dev`
2. Открыть панель автора: `/author/courses` или `/author/lessons`
3. Создать/редактировать курс/урок
4. Нажать "Загрузить обложку"
5. Проверить что файл загрузился и отображается

### Для тестирования тегов:
1. Открыть панель автора
2. Создать урок/курс
3. Выбрать теги из списка
4. Сохранить
5. Проверить что теги сохранились (не UUID, а названия)

---

## 📁 Изменённые файлы

### Сервер (5 файлов)
- `server/routes/author.routes.ts`
- `server/routes/tags.routes.ts`
- `server/routes/admin.routes.ts` (частично)

### Клиент (4 файла)
- `src/services/api.ts`
- `src/hooks/useAuthorLesson.ts`
- `src/hooks/useAuthorCourse.ts`
- `src/pages/author/AuthorLessonFormPage.tsx`

### Тесты (2 файла)
- `test-tags-check.ts`
- `test-prisma-models.ts`

---

## ⚠️ Важные заметки

1. **Переменная окружения:** Убедитесь что `MEDIA_STORAGE_MODE=local` для локальной загрузки
2. **Папка для файлов:** `public/media/covers/` должна существовать и быть доступна для записи
3. **CORS:** При загрузке файлов через FormData убедитесь что CORS настроен правильно
