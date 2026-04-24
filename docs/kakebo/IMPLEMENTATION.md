# Kakebo — Документация реализации

> Документ описывает стратегию реализации, текущий статус и зафиксированные недочёты инструмента учёта условных единиц для анализа привычек и прогресса обучения

**Дата создания:** Март 2026  
**Дата реализации:** Апрель 2026  
**Статус:** ✅ Базовый уровень реализован  
**Приоритет:** Средний

---

## Содержание

1. [Статус реализации](#1-статус-реализации)
2. [Паспорт Kakebo](#2-паспорт-kakebo)
3. [Архитектура](#3-архитектура)
4. [API Endpoints](#4-api-endpoints)
5. [Frontend компоненты](#5-frontend-компоненты)
6. [Известные недочёты и исправления](#6-известные-недочёты-и-исправления)
7. [История изменений](#7-история-изменений)

---

## 1. Статус реализации

### ✅ Реализовано (Базовый уровень)

| Компонент | Статус | Примечание |
|-----------|--------|------------|
| База данных | ✅ Готово | 3 модели + индексы |
| Backend API | ✅ Готово | Все CRUD эндпоинты |
| Frontend типы | ✅ Готово | TypeScript типы |
| Сервис API | ✅ Готово | kakeboService |
| React Query хуки | ✅ Готово | 7 хуков |
| KakeboPage | ✅ Готово | Основная страница |
| KakeboStats | ✅ Готово | Статистика с прогресс-баром |
| KakeboForm | ✅ Готово | Форма добавления (адаптивная) |
| KakeboList | ✅ Готово | Таблица/карточки (адаптивная) |
| KakeboReflection | ✅ Готово | Рефлексия месяца |
| Адаптивность | ✅ Готово | Mobile-first дизайн |
| Лимиты | ✅ Готово | Визуализация с прогресс-баром |

### ⏳ В планах

- [ ] Графики по категориям
- [ ] Экспорт данных (CSV/Excel)
- [ ] Уведомления о приближении к лимиту
- [ ] Годовая статистика
- [ ] Сравнение с предыдущими месяцами

---

## 2. Паспорт Kakebo

### 2.1 Философия инструмента

**Ключевое правило:** Платформа не имеет валюты, только «условные единицы» (у.е.).

**Цели инструмента:**
1. Помогать пользователю осознанно тратить «условные единицы»
2. Анализировать привычки потребления
3. Визуализировать прогресс обучения через рефлексию
4. Интегрироваться с учебным планом

### 2.2 Ключевые метрики

- **Траты за месяц** - общая сумма в у.е.
- **Дней с записями** - активность ведения учёта
- **Распределение по категориям** - LIFE, CULTURE, EXTRA, UNEXPECTED
- **Остаток до лимита** - контроль бюджета
- **Рефлексия** - качественные улучшения

### 2.3 Категории трат

| Категория | Описание | Примеры |
|-----------|----------|---------|
| **LIFE** | Необходимые траты | Еда, транспорт, жильё, коммунальные |
| **CULTURE** | Образование и развитие | Книги, курсы, мероприятия |
| **EXTRA** | Дополнительные покупки | Одежда, электроника, хобби |
| **UNEXPECTED** | Непредвиденное | Подарки, ремонты, штрафы |

---

## 3. Архитектура

### 3.1 Модель данных

```prisma
// Кэкебо записи
model KakeboEntry {
  id          String   @id @default(cuid())
  profileId   String
  profile     Profile  @relation(fields: [profileId], references: [id], onDelete: Cascade)
  
  date        DateTime @map("date") @db.Date
  year        Int
  month       Int
  
  category    KakeboCategory @default(LIFE)
  description String   @db.Text
  amount      Float
  isNecessary Boolean  @default(false)
  
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  @@index([profileId, year, month])
  @@index([profileId, date])
  @@map("kakebo_entries")
}

enum KakeboCategory {
  LIFE
  CULTURE
  EXTRA
  UNEXPECTED
}

// Настройки пользователя
model KakeboSettings {
  profileId  String @id
  profile    Profile @relation(fields: [profileId], references: [id], onDelete: Cascade)
  
  monthLimit Float? @map("month_limit")
  
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")
  
  @@map("kakebo_settings")
}

// Рефлексия
model KakeboReflection {
  id             String @id @default(cuid())
  profileId      String
  profile        Profile @relation(fields: [profileId], references: [id], onDelete: Cascade)
  
  year           Int
  month          Int
  
  unnecessarySpent Float? @map("unnecessary_spent")
  moneyAtStart   Float? @map("money_at_start")
  plannedToSave  Float? @map("planned_to_save")
  actuallySaved  Float? @map("actually_saved")
  improvements   String? @db.Text
  
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  @@unique([profileId, year, month])
  @@index([profileId, year, month])
  @@map("kakebo_reflections")
}
```

### 3.2 Структура файлов

```
server/
└── routes/
    └── kakebo.routes.ts          # Backend API

src/
├── types/
│   └── kakebo.ts                 # TypeScript типы
├── services/
│   └── kakebo.service.ts         # API вызовы
├── hooks/
│   └── useKakebo.ts              # React Query хуки
├── components/kakebo/
│   ├── KakeboStats.tsx           # Карточка статистики
│   ├── KakeboForm.tsx            # Форма добавления
│   ├── KakeboList.tsx            # Список трат
│   ├── KakeboReflection.tsx      # Блок рефлексии
│   └── index.ts                  # Экспорт компонентов
└── pages/tools/
    └── KakeboPage.tsx            # Основная страница
```

---

## 4. API Endpoints

### 4.1 Список эндпоинтов

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/api/kakebo?year=&month=` | Получить данные за месяц |
| POST | `/api/kakebo` | Создать запись |
| PUT | `/api/kakebo/:id` | Обновить запись |
| DELETE | `/api/kakebo/:id` | Удалить запись |
| PUT | `/api/kakebo/settings` | Обновить настройки |
| GET | `/api/kakebo/reflection?year=&month=` | Получить рефлексию |
| POST | `/api/kakebo/reflection` | Сохранить рефлексию |

### 4.2 Примеры запросов

**Получить данные за месяц:**
```bash
GET /api/kakebo?year=2026&month=4
```

**Создать запись:**
```bash
POST /api/kakebo
{
  "date": "2026-04-24",
  "category": "LIFE",
  "description": "Обед",
  "amount": 50,
  "isNecessary": true
}
```

**Обновить настройки:**
```bash
PUT /api/kakebo/settings
{
  "monthLimit": 10000
}
```

---

## 5. Frontend компоненты

### 5.1 Типы

```typescript
export type KakeboCategory = 'LIFE' | 'CULTURE' | 'EXTRA' | 'UNEXPECTED'

export interface KakeboEntry {
  id: string
  date: string
  category: KakeboCategory
  description: string
  amount: number
  isNecessary: boolean
}

export interface KakeboSettings {
  monthLimit: number | null
}

export interface KakeboSummary {
  totalSpent: number
  daysInMonth: number
  daysWithEntries: number
  byCategory: Record<KakeboCategory, number>
}

export interface KakeboMonthData {
  settings: KakeboSettings
  entries: KakeboEntry[]
  summary: KakeboSummary
}

export interface KakeboReflection {
  id?: string
  year: number
  month: number
  unnecessarySpent?: number
  moneyAtStart?: number
  plannedToSave?: number
  actuallySaved?: number
  improvements?: string
}
```

### 5.2 Хуки

- `useKakeboMonth(year, month)` - получить данные за месяц
- `useKakeboSettings()` - обновить настройки
- `useAddKakeboEntry()` - создать запись
- `useUpdateKakeboEntry()` - обновить запись
- `useDeleteKakeboEntry()` - удалить запись
- `useKakeboReflection(year, month)` - получить рефлексию
- `useSaveKakeboReflection()` - сохранить рефлексию

---

## 6. Известные недочёты и исправления

### 6.1 Проблемы с Prisma и базой данных

**Проблема 1: Ошибка уникального ключа в KakeboReflection**

*Описание:* При запросе `findUnique` с полями `profileId`, `year`, `month` возникала ошибка, так как Prisma требует использовать композитный уникальный ключ.

*Исходный код (неверно):*
```typescript
const reflection = await prisma.kakeboReflection.findUnique({
  where: { profileId: profile.id, year, month }
})
```

*Исправление:*
```typescript
const reflection = await prisma.kakeboReflection.findUnique({
  where: { profileId_year_month: { profileId: profile.id, year, month } }
})
```

*Коммит:* `5367a92 fix: исправить ошибки в Kakebo и авторизации`

---

**Проблема 2: Автоматическое создание профиля при сессии**

*Описание:* При загрузке сессии у старых пользователей мог отсутствовать профиль (опциональное отношение), что приводило к ошибке авторизации.

*Исходный код:*
```typescript
// getSessionData не обрабатывал null профиль
profile: session.user.profile // Может быть null
```

*Исправление:*
```typescript
// Если профиля нет - создаём автоматически
if (!session.user.profile) {
  await prisma.profile.create({
    data: {
      userId: session.user.id,
      nickname: `${firstName}${lastName}`,
      displayName: `${firstName} ${lastName}`,
    }
  })
  // Перезапрашиваем профиль
}
```

*Коммит:* `5367a92 fix: исправить ошибки в Kakebo и авторизации`

---

### 6.2 Проблемы маршрутизации

**Проблема 3: Конфликт маршрутов `/:id` и `/settings`**

*Описание:* Маршрут `PUT /:id` перехватывал запрос `PUT /settings`, так как Hono обрабатывает динамические параметры как «любая строка».

*Неправильный порядок:*
```typescript
kakebo.put('/:id', ...)      // ✅ Перехватывает всё
kakebo.put('/settings', ...) // ❌ Никогда не срабатывает
```

*Исправление:* Конкретные маршруты должны идти перед динамическими
```typescript
kakebo.put('/settings', ...) // ✅ Сначала конкретные
kakebo.put('/:id', ...)      // ✅ Потом динамические
```

*Коммит:* `cbf78c7 fix: исправить порядок маршрутов Kakebo`

---

### 6.3 Проблемы компиляции TypeScript

**Проблема 4: Неправильный импорт `@mantine/form`**

*Описание:* В проекте используется `react-hook-form`, а не `@mantine/form`.

*Исходный код:*
```typescript
import { useForm } from '@mantine/form' // ❌ Нет в проекте
```

*Исправление:* Упрощение формы на useState
```typescript
import { useState } from 'react' // ✅ Простое состояние
```

*Коммит:* `ac06cf4 fix: финальные исправления Kakebo для успешного build`

---

**Проблема 5: Ошибки типов в NumberInput**

*Описание:* Свойство `precision` не существует в Mantine v8.

*Исходный код:*
```typescript
<NumberInput precision={2} /> // ❌ Не существует
```

*Исправление:*
```typescript
<NumberInput /> // ✅ Убрать unsupported props
```

*Коммит:* `ac06cf4 fix: финальные исправления Kakebo для успешного build`

---

### 6.4 Проблемы логики лимитов

**Проблема 6: Неверная логика `isOverLimit` при null**

*Описание:* При отсутствии лимита (`monthLimit = null`) сравнение работало некорректно.

*Исходный код:*
```typescript
const isOverLimit = data?.settings.monthLimit && 
  data.summary.totalSpent > data.settings.monthLimit
```

*Исправление:*
```typescript
const isOverLimit = data?.settings.monthLimit && 
  data.summary.totalSpent > (data.settings.monthLimit || 0)
```

*Дополнительно:*
- Добавлен расчёт `remainingLimit`
- Добавлен `limitPercent` для прогресс-бара
- Цветовая индикация: зелёный (<80%), оранжевый (80-100%), красный (>100%)

*Коммит:* `5d885cc feat: улучшить отображение лимита в Kakebo`

---

### 6.5 Проблемы адаптивности

**Проблема 7: Поля формы в строку на мобильных**

*Описание:* На мобильных устройствах все поля формы располагались в одну строку, что делало их непригодными для использования.

*Исходный код:*
```tsx
<Group gap="sm" grow> // ❌ Всё в одной строке
  <TextInput />
  <Select />
  <TextInput />
  <NumberInput />
  <Button />
</Group>
```

*Исправление:*
```tsx
<Stack gap="sm"> // ✅ Вертикальный стек
  <Group gap="sm" wrap="wrap">
    <TextInput style={{ flex: 1, minWidth: 150 }} />
    <Select style={{ flex: 1, minWidth: 180 }} />
  </Group>
  <TextInput />
  <Group gap="sm" align="flex-end">
    <NumberInput style={{ flex: 1 }} />
    <Switch style={{ flex: 1 }} />
    <Button style={{ flex: 1 }} />
  </Group>
</Stack>
```

*Коммит:* `8aee019 feat: улучшить адаптивность Kakebo`

---

**Проблема 8: Таблица на мобильных**

*Описание:* Таблица с записями на мобильных устройствах была нечитаемой.

*Исправление:*
- Использовать `visibleFrom="lg"` для таблицы
- Использовать `hiddenFrom="lg"` для карточек
- Добавить `SimpleGrid` с карточками для мобильных

*Коммит:* `8aee019 feat: улучшить адаптивность Kakebo`

---

## 7. История изменений

| Версия | Дата | Описание |
|--------|------|----------|
| 1.0.0 | Апрель 2026 | Базовая реализация Kakebo |

### Детали коммитов

```
5d885cc fix: улучшить отображение лимита в Kakebo
cbf78c7 fix: исправить порядок маршрутов Kakebo
8aee019 feat: улучшить адаптивность Kakebo
5fd5155 fix: исправить ошибки компиляции Kakebo
1fe7e7e feat: завершить реализацию Kakebo
70dfd85 feat: реализовать компоненты UI для Kakebo
3a5761a feat: добавить frontend типы, сервис и хуки для Kakebo
948eebb feat: реализовать backend API для Kakebo
4aef25e feat: добавить модели Kakebo в Prisma schema
```

---

## 8. Рекомендации для будущих версий

1. **Миграции вместо db push:** Использовать `prisma migrate dev` для разработки и `prisma migrate deploy` для продакшена
2. **Уведомления:** Интегрировать с существующей системой уведомлений вместо console.log
3. **Тестирование:** Добавить unit-тесты для API и компонентов
4. **Доступность:** Добавить ARIA-атрибуты для скринридеров
5. **Производительность:** Добавить виртуализацию для больших списков записей

---

**Документ обновлён:** Апрель 2026  
**Статус:** Актуален для версии 1.0.0

### 5.1 Структура маршрутов

**Файл:** `server/routes/kakebo.routes.ts`

```typescript
import { Hono } from 'hono'
import { z } from 'zod'
import { prisma } from '../db'
import { requireAuth, getCurrentProfile } from '../middleware/auth'
import { AppError } from '../lib/errors'

const kakebo = new Hono()

// Middleware для всех кэкебо-роутов
kakebo.use('*', requireAuth)

// ==================== GET /api/kakebo ====================
// Получить данные за месяц
kakebo.get('/', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(401, 'Требуется авторизация')

  const year = parseInt(c.req.query('year') || new Date().getFullYear().toString())
  const month = parseInt(c.req.query('month') || (new Date().getMonth() + 1).toString())

  // Получаем настройки
  const settings = await prisma.kakeboSettings.findUnique({
    where: { profileId: profile.id }
  })

  // Получаем записи
  const entries = await prisma.kakeboEntry.findMany({
    where: {
      profileId: profile.id,
      year,
      month
    },
    orderBy: { date: 'desc' }
  })

  // Агрегация
  const totalSpent = entries.reduce((sum, e) => sum + e.amount, 0)
  const daysWithEntries = new Set(entries.map(e => e.date.toISOString().split('T')[0])).size
  const daysInMonth = new Date(year, month, 0).getDate()

  const byCategory = entries.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount
    return acc
  }, {} as Record<string, number>)

  return c.json({
    settings: { monthLimit: settings?.monthLimit ?? null },
    entries: entries.map(e => ({
      id: e.id,
      date: e.date.toISOString(),
      category: e.category,
      description: e.description,
      amount: e.amount,
      isNecessary: e.isNecessary
    })),
    summary: {
      totalSpent,
      daysInMonth,
      daysWithEntries,
      byCategory
    }
  })
})

// ==================== POST /api/kakebo ====================
// Создать запись
kakebo.post('/', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(401, 'Требуется авторизация')

  const body = await c.req.json()
  const parsed = KakeboEntrySchema.safeParse(body)

  if (!parsed.success) {
    throw new AppError(400, 'Ошибка валидации', 'VALIDATION_ERROR', parsed.error)
  }

  const { date, category, description, amount, isNecessary } = parsed.data
  const dateObj = new Date(date)

  const entry = await prisma.kakeboEntry.create({
    data: {
      profileId: profile.id,
      date: dateObj,
      year: dateObj.getFullYear(),
      month: dateObj.getMonth() + 1,
      category,
      description,
      amount,
      isNecessary
    }
  })

  return c.json({ message: 'Запись создана', entry }, 201)
})

// ==================== PUT /api/kakebo/:id ====================
// Обновить запись
kakebo.put('/:id', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(401, 'Требуется авторизация')

  const id = c.req.param('id')
  const body = await c.req.json()

  // Проверка существования и принадлежности
  const existing = await prisma.kakeboEntry.findFirst({
    where: { id, profileId: profile.id }
  })
  if (!existing) throw new AppError(404, 'Запись не найдена')

  const parsed = KakeboEntrySchema.partial().safeParse(body)
  if (!parsed.success) throw new AppError(400, 'Ошибка валидации')

  const entry = await prisma.kakeboEntry.update({
    where: { id },
    data: parsed.data
  })

  return c.json({ message: 'Запись обновлена', entry })
})

// ==================== DELETE /api/kakebo/:id ====================
// Удалить запись
kakebo.delete('/:id', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(401, 'Требуется авторизация')

  const id = c.req.param('id')

  // Проверка принадлежности
  const existing = await prisma.kakeboEntry.findFirst({
    where: { id, profileId: profile.id }
  })
  if (!existing) throw new AppError(404, 'Запись не найдена')

  await prisma.kakeboEntry.delete({ where: { id } })

  return c.json({ message: 'Запись удалена' })
})

// ==================== PUT /api/kakebo/settings ====================
// Обновить настройки
kakebo.put('/settings', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(401, 'Требуется авторизация')

  const body = await c.req.json()
  const parsed = KakeboSettingsSchema.safeParse(body)

  if (!parsed.success) throw new AppError(400, 'Ошибка валидации')

  const settings = await prisma.kakeboSettings.upsert({
    where: { profileId: profile.id },
    create: { profileId: profile.id, ...parsed.data },
    update: parsed.data
  })

  return c.json({ message: 'Настройки обновлены', settings })
})

// ==================== GET /api/kakebo/reflection ====================
// Получить рефлексию за месяц
kakebo.get('/reflection', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(401, 'Требуется авторизация')

  const year = parseInt(c.req.query('year') || new Date().getFullYear().toString())
  const month = parseInt(c.req.query('month') || (new Date().getMonth() + 1).toString())

  const reflection = await prisma.kakeboReflection.findUnique({
    where: { profileId: profile.id, year, month }
  })

  return c.json({ reflection })
})

// ==================== POST /api/kakebo/reflection ====================
// Сохранить рефлексию
kakebo.post('/reflection', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(401, 'Требуется авторизация')

  const body = await c.req.json()
  const parsed = KakeboReflectionSchema.safeParse(body)

  if (!parsed.success) throw new AppError(400, 'Ошибка валидации')

  const reflection = await prisma.kakeboReflection.upsert({
    where: { profileId: profile.id, year: parsed.data.year, month: parsed.data.month },
    create: { profileId: profile.id, ...parsed.data },
    update: parsed.data
  })

  return c.json({ message: 'Рефлексия сохранена', reflection })
})

// ==================== GET /api/kakebo/achievements ====================
// ❌ УДАЛЕНО: Геймификация не реализуется на данном этапе
// См. раздел 7 (удалён)
```

### 5.2 Регистрация маршрутов в сервере

**Файл:** `server/index.ts`

```typescript
import kakeboRoutes from './routes/kakebo.routes'

// ... после других маршрутов
app.use('/api/kakebo', kakeboRoutes)
```

---

## 6. Frontend компоненты

### 6.1 Структура папок

```
src/
├── pages/tools/
│   └── KakeboPage.tsx              # Основная страница
├── components/kakebo/
│   ├── KakeboStats.tsx             # Карточка статистики
│   ├── KakeboForm.tsx              # Форма добавления
│   ├── KakeboList.tsx              # Список трат
│   └── KakeboReflection.tsx        # Блок рефлексии
├── hooks/useKakebo.ts              # React Query хуки
├── services/kakebo.service.ts      # API вызовы
└── types/kakebo.ts                 # TypeScript типы
```

### 6.2 Типы

**Файл:** `src/types/kakebo.ts`

```typescript
export type KakeboCategory = 'LIFE' | 'CULTURE' | 'EXTRA' | 'UNEXPECTED'

export interface KakeboEntry {
  id: string
  date: string
  category: KakeboCategory
  description: string
  amount: number
  isNecessary: boolean
}

export interface KakeboSettings {
  monthLimit: number | null
}

export interface KakeboSummary {
  totalSpent: number
  daysInMonth: number
  daysWithEntries: number
  byCategory: Record<KakeboCategory, number>
}

export interface KakeboMonthData {
  settings: KakeboSettings
  entries: KakeboEntry[]
  summary: KakeboSummary
}

export interface KakeboReflection {
  id?: string
  year: number
  month: number
  unnecessarySpent?: number
  moneyAtStart?: number
  plannedToSave?: number
  actuallySaved?: number
  improvements?: string
}
```

### 6.3 Сервис API

**Файл:** `src/services/kakebo.service.ts`

```typescript
import { api } from './api'
import type {
  KakeboMonthData,
  KakeboEntry,
  KakeboSettings,
  KakeboReflection
} from '@/types/kakebo'

export const kakeboService = {
  /**
   * Получить данные за месяц
   */
  getMonth: (year: number, month: number): Promise<KakeboMonthData> =>
    api.get(`/kakebo?year=${year}&month=${month}`),

  /**
   * Создать запись
   */
  createEntry: (data: Partial<KakeboEntry>): Promise<{ message: string; entry: KakeboEntry }> =>
    api.post('/kakebo', data),

  /**
   * Обновить запись
   */
  updateEntry: (id: string, data: Partial<KakeboEntry>): Promise<{ message: string; entry: KakeboEntry }> =>
    api.put(`/kakebo/${id}`, data),

  /**
   * Удалить запись
   */
  deleteEntry: (id: string): Promise<{ message: string }> =>
    api.delete(`/kakebo/${id}`),

  /**
   * Обновить настройки
   */
  updateSettings: (data: Partial<KakeboSettings>): Promise<{ message: string; settings: KakeboSettings }> =>
    api.put('/kakebo/settings', data),

  /**
   * Получить рефлексию
   */
  getReflection: (year: number, month: number): Promise<{ reflection: KakeboReflection | null }> =>
    api.get(`/kakebo/reflection?year=${year}&month=${month}`),

  /**
   * Сохранить рефлексию
   */
  saveReflection: (data: KakeboReflection): Promise<{ message: string; reflection: KakeboReflection }> =>
    api.post('/kakebo/reflection', data),
}
```

### 6.4 Хуки

**Файл:** `src/hooks/useKakebo.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { kakeboService } from '@/services/kakebo.service'
import { notifications } from '@mantine/notifications'
import type { KakeboEntry, KakeboReflection } from '@/types/kakebo'

export function useKakeboMonth(year: number, month: number) {
  return useQuery({
    queryKey: ['kakebo', year, month],
    queryFn: () => kakeboService.getMonth(year, month),
    staleTime: 1000 * 60 * 5, // 5 минут
  })
}

export function useKakeboSettings() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: kakeboService.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kakebo'] })
      notifications.show({
        title: 'Готово',
        message: 'Настройки обновлены',
        color: 'green'
      })
    },
    onError: (error) => {
      notifications.show({
        title: 'Ошибка',
        message: error.message,
        color: 'red'
      })
    }
  })
}

export function useAddKakeboEntry() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: kakeboService.createEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kakebo'] })
      notifications.show({
        title: 'Готово',
        message: 'Запись добавлена',
        color: 'green'
      })
    },
    onError: (error) => {
      notifications.show({
        title: 'Ошибка',
        message: error.message,
        color: 'red'
      })
    }
  })
}

export function useUpdateKakeboEntry() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<KakeboEntry> }) =>
      kakeboService.updateEntry(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kakebo'] })
      notifications.show({
        title: 'Готово',
        message: 'Запись обновлена',
        color: 'green'
      })
    }
  })
}

export function useDeleteKakeboEntry() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: kakeboService.deleteEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kakebo'] })
      notifications.show({
        title: 'Готово',
        message: 'Запись удалена',
        color: 'green'
      })
    }
  })
}

export function useKakeboReflection(year: number, month: number) {
  return useQuery({
    queryKey: ['kakebo', 'reflection', year, month],
    queryFn: () => kakeboService.getReflection(year, month),
    select: (data) => data.reflection
  })
}

export function useSaveKakeboReflection() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: kakeboService.saveReflection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kakebo', 'reflection'] })
      notifications.show({
        title: 'Готово',
        message: 'Рефлексия сохранена',
        color: 'green'
      })
    }
  })
}
```

### 6.5 Компоненты

#### KakeboPage.tsx (основная страница)

```tsx
// src/pages/tools/KakeboPage.tsx
import { useState } from 'react'
import { Box, Title, Grid, Paper, Text, Group, Select, Flex } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { Plus, Settings } from 'lucide-react'
import { KakeboStats } from '@/components/kakebo/KakeboStats'
import { KakeboForm } from '@/components/kakebo/KakeboForm'
import { KakeboList } from '@/components/kakebo/KakeboList'
import { KakeboReflection } from '@/components/kakebo/KakeboReflection'
import { useKakeboMonth, useKakeboSettings, useKakeboReflection } from '@/hooks/useKakebo'
import { modals } from '@mantine/modals'

export function KakeboPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1

  const { data, isLoading, refetch } = useKakeboMonth(year, month)
  const settingsMutation = useKakeboSettings()
  const reflectionQuery = useKakeboReflection(year, month)

  const handleMonthChange = (date: Date | null) => {
    if (date) {
      setCurrentDate(date)
    }
  }

  const openSettingsModal = () => {
    modals.openConfirmModal({
      title: 'Настройки лимита',
      children: (
        <Select
          label="Месячный лимит (у.е.)"
          data={[
            { value: '1000', label: '1000 у.е.' },
            { value: '2000', label: '2000 у.е.' },
            { value: '5000', label: '5000 у.е.' },
            { value: '10000', label: '10000 у.е.' },
          ]}
          defaultValue={data?.settings.monthLimit?.toString() || ''}
          onChange={(v) => {
            if (v) {
              settingsMutation.mutate({ monthLimit: parseFloat(v) })
            }
          }}
        />
      ),
      confirmProps: { hidden: true },
      cancelProps: { hidden: true },
    })
  }

  return (
    <Box p="md">
      <Flex justify="space-between" align="center" mb="lg">
        <Title order={1}>Kakebo — Учёт условных единиц</Title>
        <Group>
          <DatePickerInput
            value={currentDate}
            onChange={handleMonthChange}
            type="month"
            placeholder="Выберите месяц"
          />
          <Settings onClick={openSettingsModal} style={{ cursor: 'pointer' }} />
        </Group>
      </Flex>

      {/* Статистика */}
      <Grid mb="lg">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <KakeboStats
            title="Потрачено"
            value={data?.summary.totalSpent || 0}
            subtitle={`Лимит: ${data?.settings.monthLimit || 'не установлен'}`}
            color={data?.summary.totalSpent > (data?.settings.monthLimit || Infinity) ? 'red' : 'green'}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <KakeboStats
            title="Дней с записями"
            value={`${data?.summary.daysWithEntries || 0}/${data?.summary.daysInMonth || 0}`}
            color="blue"
          />
        </Grid.Col>
      </Grid>

      {/* Форма добавления */}
      <Paper p="md" mb="md" withBorder>
        <Group mb="sm">
          <Plus size={20} />
          <Text fw={500}>Добавить запись</Text>
        </Group>
        <KakeboForm onSuccess={() => refetch()} />
      </Paper>

      {/* Список трат */}
      <KakeboList entries={data?.entries || []} isLoading={isLoading} onRefresh={refetch} />

      {/* Рефлексия */}
      {reflectionQuery.data && (
        <KakeboReflection
          reflection={reflectionQuery.data}
          onSave={reflectionQuery.refetch}
        />
      )}
    </Box>
  )
}
```

(Остальные компоненты `KakeboStats`, `KakeboForm`, `KakeboList`, `KakeboReflection` создаются по аналогии с существующими компонентами проекта)

---

## 7. Удалённый раздел: Геймификация

> **Примечание:** Геймификация и система достижений были удалены из плана реализации по запросу. Этот функционал может быть добавлен в будущем.

---

---

## 7. Рефлексия

### 8.1 Когда показывать

Рефлексия показывается:
- В конце текущего месяца (после 25-го числа)
- Для предыдущих месяцев (если ещё не заполнена)

### 8.2 Вопросы для рефлексии

```tsx
interface KakeboReflectionForm {
  // Анализ трат (автоматически рассчитывается)
  unnecessarySpent: number // Сумма трат, где isNecessary = false

  // Вопросы
  moneyAtStart: number // "Сколько денег у вас было в начале месяца?"
  plannedToSave: number // "Сколько вы планировали отложить?"
  actuallySaved: number // "Сколько вам удалось отложить на самом деле?"
  improvements: string // "Что вы сделаете лучше в следующем месяце?"
}
```

### 8.3 Компонент рефлексии

```tsx
// src/components/kakebo/KakeboReflection.tsx
import { useForm } from '@react-hookz/web'
import { Button, Textarea, TextInput, Paper, Title, Group, Alert } from '@mantine/core'
import { Info } from 'lucide-react'
import { useSaveKakeboReflection } from '@/hooks/useKakebo'

interface Props {
  reflection: KakeboReflection | null
  onSave: () => void
}

export function KakeboReflection({ reflection, onSave }: Props) {
  const saveMutation = useSaveKakeboReflection()
  const [form, handleChange] = useForm<KakeboReflectionForm>({
    unnecessarySpent: 0,
    moneyAtStart: 0,
    plannedToSave: 0,
    actuallySaved: 0,
    improvements: ''
  })

  const isCurrentMonthEnd = new Date().getDate() >= 25

  if (!isCurrentMonthEnd && !reflection) {
    return null
  }

  return (
    <Paper p="md" withBorder>
      <Title order={2} mb="md">Рефлексия</Title>

      {!isCurrentMonthEnd && (
        <Alert icon={<Info size={16} />} color="blue" mb="md">
          Заполните рефлексию в конце месяца
        </Alert>
      )}

      <TextInput
        label="Сколько денег у вас было в начале месяца?"
        type="number"
        value={form.moneyAtStart}
        onChange={(e) => handleChange('moneyAtStart', parseFloat(e.target.value))}
      />

      <TextInput
        label="Сколько вы планировали отложить?"
        type="number"
        value={form.plannedToSave}
        onChange={(e) => handleChange('plannedToSave', parseFloat(e.target.value))}
      />

      <TextInput
        label="Сколько вам удалось отложить на самом деле?"
        type="number"
        value={form.actuallySaved}
        onChange={(e) => handleChange('actuallySaved', parseFloat(e.target.value))}
      />

      <Textarea
        label="Что вы сделаете лучше в следующем месяце?"
        value={form.improvements}
        onChange={(e) => handleChange('improvements', e.target.value)}
        minRows={4}
      />

      <Button
        loading={saveMutation.isPending}
        onClick={() => saveMutation.mutate({ ...form, year: 2026, month: 3 })}
      >
        Сохранить рефлексию
      </Button>
    </Paper>
  )
}
```

---

## 8. План реализации

### Фаза 1: Подготовка (День 1)

1. **Анализ и проверка:**
   - [ ] Проверить работу `requireAuth` middleware
   - [ ] Проверить работу сессий (cookie)
   - [ ] Проверить существующие Zod схемы
   - [ ] Проверить работу `BusinessEvent` модели

2. **Создание модели данных:**
   - [ ] Добавить модели в `prisma/schema.prisma`
   - [ ] Создать миграцию: `npx prisma migrate dev --name add_kakebo_models`
   - [ ] Применить миграцию
   - [ ] Сгенерировать Prisma Client

### Фаза 2: Backend API (День 2)

1. **Создание роутов:**
   - [ ] `server/routes/kakebo.routes.ts`
   - [ ] Регистрация в `server/index.ts`
   - [ ] CRUD эндпоинты
   - [ ] Эндпоинты для настроек и рефлексии

2. **Валидация:**
   - [ ] Zod схемы для всех входов
   - [ ] Обработка ошибок валидации

3. **Безопасность:**
   - [ ] Проверка `profileId` на всех запросах
   - [ ] Middleware `requireAuth` на всех роутах

4. **Тестирование API:**
   - [ ] Тестирование через Swagger/UI
   - [ ] Проверка ошибок доступа

### Фаза 3: Frontend типы и сервисы (День 3)

1. **Типы:**
   - [ ] `src/types/kakebo.ts`
   - [ ] Экспорт в `src/types/index.ts`

2. **Сервис:**
   - [ ] `src/services/kakebo.service.ts`
   - [ ] Экспорт в `src/services/index.ts`

3. **Хуки:**
   - [ ] `src/hooks/useKakebo.ts`
   - [ ] Экспорт в `src/hooks/index.ts`

### Фаза 4: Frontend компоненты (День 4-5)

1. **Основные компоненты:**
   - [ ] `src/components/kakebo/KakeboStats.tsx`
   - [ ] `src/components/kakebo/KakeboForm.tsx`
   - [ ] `src/components/kakebo/KakeboList.tsx`
   - [ ] `src/components/kakebo/KakeboReflection.tsx`
   - [ ] `src/components/kakebo/KakeboAchievements.tsx`

2. **Страница:**
   - [ ] `src/pages/tools/KakeboPage.tsx`
   - [ ] Роут в `App.tsx`

3. **Стили:**
   - [ ] Адаптивная верстка
   - [ ] Интеграция с дизайн-системой

### Фаза 5: Рефлексия и полировка (День 6)

1. **Логика рефлексии:**
   - [ ] Проверка условий отображения (конец месяца)
   - [ ] Автоматический расчёт `unnecessarySpent`

2. **UI/UX:**
   - [ ] Адаптивность
   - [ ] Ошибки и состояния загрузки
   - [ ] Уведомления

### Фаза 6: Тестирование и полировка (День 7)

1. **Функциональное тестирование:**
   - [ ] CRUD операции
   - [ ] Проверка безопасности
   - [ ] Валидация данных
   - [ ] Рефлексия
   - [ ] Достижения

2. **UI/UX:**
   - [ ] Адаптивность
   - [ ] Ошибки и состояния загрузки
   - [ ] Уведомления

3. **Документация:**
   - [ ] Обновить `PROJECT_DOCUMENTATION.md`
   - [ ] Обновить `TECHNICAL_DOCUMENTATION.md`

---

## 9. Тестирование

### 10.1 Критерии приёмки (DoD)

| Требование | Как проверить |
|------------|---------------|
| **Логика** | Пользователь залогинен. Данные, внесенные на вкладке, сохраняются в БД и видны только ему. |
| **Рефлексия** | В конце месяца пользователь видит блок с вопросами и может сохранить ответы, которые не исчезнут при перезагрузке страницы. |
| **UI** | Адаптивная верстка, валидация форм, уведомления об ошибках. |

### 10.2 Тест-кейсы

#### CRUD операций:

| № | Действие | Ожидаемый результат |
|---|----------|---------------------|
| 1 | Создать запись с валидными данными | Запись создана, отображается в списке |
| 2 | Создать запись с amount <= 0 | Ошибка валидации |
| 3 | Создать запись без description | Ошибка валидации |
| 4 | Обновить свою запись | Запись обновлена |
| 5 | Обновить чужую запись (через API) | Ошибка 404 |
| 6 | Удалить свою запись | Запись удалена |
| 7 | Удалить чужую запись (через API) | Ошибка 404 |

#### Безопасность:

| № | Действие | Ожидаемый результат |
|---|----------|---------------------|
| 1 | Получить данные без сессии | Ошибка 401 |
| 2 | Получить данные другого пользователя | Ошибка 404 (или пустой список) |
| 3 | Создать запись от имени другого пользователя | Ошибка 401/403 |

#### Геймификация:

> **Удалено:** Геймификация не реализуется на данном этапе.

#### Рефлексия:

| № | Действие | Ожидаемый результат |
|---|----------|---------------------|
| 1 | Сохранить рефлексию | Рефлексия сохранена в БД |
| 2 | Загрузить страницу с сохранённой рефлексией | Данные отображаются |
| 3 | Изменить рефлексию | Рефлексия обновлена |

---

## Заключение

Этот план описывает полный цикл реализации инструмента Kakebo с учётом существующей архитектуры проекта. Ключевые моменты:

1. **Использование существующих паттернов** — хуки, сервисы, компоненты по аналогии с уже реализованными функциями
2. **Безопасность данных** — все запросы фильтруются по `profileId` из сессии
3. **React Query для кэширования** — использование `useQuery` и `useMutation` для управления состоянием
4. **Поэтапная реализация** — разбивка на 6 дней с чёткими целями

После реализации необходимо обновить документацию проекта и протестировать все сценарии использования.

---

*Документ создан: Март 2026*  
*Автор: A*  
*Статус: Готов к реализации*
