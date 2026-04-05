# Документация проекта Economikus

> Единая точка входа в документацию проекта

---

## 📚 Основная документация

| Файл | Описание | Статус |
|------|----------|--------|
| **[TECHNICAL_DOCUMENTATION.md](../TECHNICAL_DOCUMENTATION.md)** | Единая техническая документация | ✅ Актуальна |
| `OPTIMIZATION_GUIDE.md` | Правила оптимизации и стандарты | ✅ Актуален |
| `REFACTORING_PLAN.md` | План рефакторинга | ✅ Актуален |
| `AUTHOR_PANEL_PLAN.md` | План панели автора | ✅ Актуален |
| `docs/LESSON_CONTENT_PLAN.md` | План контента уроков | ✅ Актуален |

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

| Модуль | Готовность |
|--------|------------|
| Аутентификация | 90% |
| Каталог курсов | 90% |
| Страница курса | 85% |
| Страница урока | 80% |
| Админ-панель | 70% |
| Панель автора | 80% |
| Калькуляторы | 100% |
| Прогресс обучения | 80% |

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

# Запуск frontend
npm run dev

# Генерация ключа
auth secret

# Запуск backend
cd server && npx tsx index.ts
```

### Доступ к сервисам

| Сервис | URL |
|--------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| Swagger | http://localhost:3000/api/swagger |
| OpenAPI JSON | http://localhost:3000/api/doc |

---

## 📝 Версии документации

| Версия | Дата | Изменения |
|--------|------|-----------|
| 5.0 | Март 2026 | Объединённая документация |
| 4.0 | Март 2026 | TECHNICAL_DOCUMENTATION_4 |
| 3.0 | Март 2026 | TECHNICAL_DOCUMENTATION_3 |
| 2.0 | Март 2026 | TECHNICAL_DOCUMENTATION_2 |
| 1.0 | Март 2026 | TECHNICAL_DOCUMENTATION |

---

*Обновлено: Март 2026*
