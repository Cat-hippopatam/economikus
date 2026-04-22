# Документация проекта Economikus

> Единая точка входа в документацию проекта

**Последнее обновление:** Март 2026  
**Статус проекта:** В активной разработке (~75% готовности)

---

## 📚 Основная документация

| Файл | Описание | Статус |
|------|----------|--------|
| **[docs/TECHNICAL_DOCUMENTATION.md](docs/TECHNICAL_DOCUMENTATION.md)** | Единая техническая документация | ✅ Актуальна |
| **[docs/PROJECT_DOCUMENTATION.md](docs/PROJECT_DOCUMENTATION.md)** | Общее описание проекта | ✅ Актуальна |
| **[docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md)** | Структура проекта | ✅ Актуальна |
| **[docs/TZ.md](docs/TZ.md)** | Техническое задание (ГОСТ) | ✅ Актуально |
| **[docs/TZ_MINIMAL.md](docs/TZ_MINIMAL.md)** | Минимальное ТЗ для MVP | ✅ Актуально |
| **[docs/OPTIMIZATION_GUIDE.md](docs/OPTIMIZATION_GUIDE.md)** | Правила оптимизации и стандарты | ✅ Актуален |
| **[docs/REFACTORING_PLAN.md](docs/REFACTORING_PLAN.md)** | План рефакторинга | ✅ Актуален |
| **[docs/AUTHOR_PANEL_PLAN.md](docs/AUTHOR_PANEL_PLAN.md)** | План панели автора | ✅ Актуален |
| **[docs/LESSON_CONTENT_PLAN.md](docs/LESSON_CONTENT_PLAN.md)** | План контента уроков | ✅ Актуален |
| **[docs/MEDIA_STORAGE_CONFIG.md](docs/MEDIA_STORAGE_CONFIG.md)** | Конфигурация медиа-хранилища | ✅ Актуален |
| **[docs/MEDIA_UPLOAD_GUIDE.md](docs/MEDIA_UPLOAD_GUIDE.md)** | Руководство по загрузке медиа | ✅ Актуален |
| **[docs/MEDIA_UPLOAD_TEST_PLAN.md](docs/MEDIA_UPLOAD_TEST_PLAN.md)** | План тестирования загрузки медиа | 📝 Новое |
| **[docs/SUBSCRIPTIONS_PLAN.md](docs/SUBSCRIPTIONS_PLAN.md)** | Стратегия подписок | ✅ Актуален |
| **[docs/SUBSCRIPTIONS_API.md](docs/SUBSCRIPTIONS_API.md)** | API подписок | ✅ Актуален |
| **[docs/SEO_PLAN.md](docs/SEO_PLAN.md)** | План SEO оптимизации | ✅ Актуален |
| **[docs/FIXES_TAGS_AND_COVERS.md](docs/FIXES_TAGS_AND_COVERS.md)** | Исправления тегов и обложек | ✅ Актуален |
| **[docs/MVP_TASKS.md](docs/MVP_TASKS.md)** | Задачи для MVP | ✅ Актуален |

---

## 🚀 Быстрый старт

### Чтение документации

1. **Для новых разработчиков:**
   - Начните с `TECHNICAL_DOCUMENTATION.md`
   - Прочитайте `OPTIMIZATION_GUIDE.md`

2. **Для работы с API:**
   - Swagger: `http://localhost:3000/api/swagger`
   - OpenAPI JSON: `http://localhost:3000/api/doc`

---

## 📊 Статистика проекта

### Готовность модулей

| Модуль | Готовность | Статус |
|--------|------------|--------|
| Аутентификация | 95% | ✅ Работает |
| Каталог курсов | 95% | ✅ Работает |
| Страница курса | 90% | ✅ Работает |
| Страница урока | 90% | ✅ Работает |
| Админ-панель | 85% | ✅ Работает |
| Панель автора | 95% | ✅ Работает |
| Калькуляторы | 100% | ✅ Работает |
| Прогресс обучения | 90% | ✅ Работает |
| История просмотров | 90% | ✅ Работает |
| Избранное | 90% | ✅ Работает |
| Система подписок | 80% | ✅ API готово |
| Медиа-хранилище | 85% | ✅ Локальное/CDN |
| SEO | 40% | ⏳ sitemap, robots |

### Покрытие Swagger документацией

| Раздел | Покрытие |
|--------|----------|
| Auth | 100% |
| Courses | 100% |
| Lessons | 100% |
| User | 100% |
| Tags | 100% |
| Reactions | 100% |
| Comments | 100% |
| Author | 100% |
| Admin | 100% |
| Moderation | 100% |
| Progress | 100% |
| **Всего** | **100%** |

---

## 🛠️ Техническая информация

### Запуск проекта

```bash
# Установка зависимостей
npm install

# Генерация ключа сессии
auth secret

# Запуск frontend (порт 5173)
npm run dev

# Запуск backend (порт 3000)
cd server && npx tsx index.ts

# База данных
npx prisma migrate dev
npx prisma db seed
```

### Переменные окружения

```env
# .env
DATABASE_URL="mysql://user:password@localhost:3306/economikus"
SESSION_SECRET="your-secret-key"
FRONTEND_URL="http://localhost:5173"
API_URL="http://localhost:3000"

# Медиа-хранилище
MEDIA_STORAGE_MODE=local
MEDIA_LOCAL_PATH=./public/media
MEDIA_CONVERT_TO_WEBP=true
```

### Доступ к сервисам

| Сервис | URL | Описание |
|--------|-----|----------|
| Frontend | http://localhost:5173 | Основное приложение |
| Backend API | http://localhost:3000 | REST API |
| Swagger | http://localhost:3000/api/swagger | API документация |
| OpenAPI JSON | http://localhost:3000/api/doc | OpenAPI спецификация |
| phpMyAdmin | http://localhost/phpmyadmin | Управление БД (только ADMIN) |

---

## 📝 Версии документации

| Версия | Дата | Изменения |
|--------|------|-----------|
| 6.0 | Март 2026 | Актуализация состояния проекта, план тестирования медиа |
| 5.0 | Март 2026 | Объединённая документация |
| 4.0 | Март 2026 | TECHNICAL_DOCUMENTATION_4 |
| 3.0 | Март 2026 | TECHNICAL_DOCUMENTATION_3 |
| 2.0 | Март 2026 | TECHNICAL_DOCUMENTATION_2 |
| 1.0 | Март 2026 | TECHNICAL_DOCUMENTATION |

---

## 📖 О проекте

**Экономикус** — образовательная платформа для изучения финансов, инвестиций и управления личными финансами.

### Ключевые возможности:
- 📚 Курсы с модульной структурой
- 🎥 Видео, аудио, текстовые уроки и квизы
- 🧮 Финансовые калькуляторы
- 📈 Прогресс обучения и история
- ⭐ Избранное и заметки
- 🎓 Сертификаты об окончании
- 💰 Система подписок
- ✍️ Панель автора для создания контента
- 🔧 Админ-панель для модерации

### Технологический стек:
- **Frontend:** React 19, Vite, TypeScript, Mantine v8, Tailwind CSS v4
- **Backend:** Hono, Prisma, MySQL
- **Auth:** Auth.js (NextAuth), bcryptjs
- **Медиа:** Sharp (конвертация WebP), локальное/CDN хранилище

---

## 🧪 Тестирование

### Запуск тестов медиа-загрузки

```bash
npm run test:media
```

См. подробный план тестирования в [docs/MEDIA_UPLOAD_TEST_PLAN.md](docs/MEDIA_UPLOAD_TEST_PLAN.md)

---

*Обновлено: Март 2026*
