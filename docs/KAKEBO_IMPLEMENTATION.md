# План реализации инструмента «Kakebo»

> Документ описывает стратегию реализации инструмента учёта условных единиц для анализа привычек и прогресса обучения

**Дата создания:** Март 2026  
**Статус:** Планирование  
**Приоритет:** Средний

---

## Содержание

1. [Анализ текущего состояния](#1-анализ-текущего-состояния)
2. [Требования к реализации](#2-требования-к-реализации)
3. [Модель данных](#3-модель-данных)
4. [Безопасность и проверки](#4-безопасность-и-проверки)
5. [API Endpoints](#5-api-endpoints)
6. [Frontend компоненты](#6-frontend-компоненты)
7. [Рефлексия](#7-рефлексия)
8. [План реализации](#8-план-реализации)
9. [Тестирование](#9-тестирование)

---

## 1. Анализ текущего состояния

### 1.1 Что уже есть в проекте

#### Backend:
- ✅ Express/Hono сервер с TypeScript
- ✅ Prisma ORM с MySQL
- ✅ Аутентификация через HttpOnly Cookie сессии
- ✅ Middleware `requireAuth`, `requireAdmin`, `requireRole`
- ✅ Паттерн маршрутизации (`server/routes/*.routes.ts`)
- ✅ Валидация через Zod (в существующих роутах)
- ✅ Middleware для проверки блокировки пользователей
- ✅ Middleware для работы с бизнес-событиями (`BusinessEvent`)

#### Frontend:
- ✅ React 19 с TypeScript
- ✅ Mantine UI v8.3.16
- ✅ React Router v7
- ✅ Zustand для глобального стейта
- ✅ Кастомные хуки (`useAuth`, `useNotification`, etc.)
- ✅ Компоненты: `ConfirmDialog`, `LoadingState`, `EmptyState`
- ✅ Сервисы API (`src/services/*.service.ts`)
- ✅ Типы в `src/types/`
- ✅ Константы в `src/constants/`

#### База данных:
- ✅ Модель `Profile` с связями
- ✅ Модель `BusinessEvent` для отслеживания событий
- ✅ Модель `Notification` для уведомлений
- ✅ Паттерны CASCADE удаления
- ✅ Индексы для оптимизации запросов

### 1.2 Существующие паттерны для повторения

#### Паттерн хука для CRUD списков:
```typescript
// hooks/useEntityList.ts
export function useEntityList() {
  const [entities, setEntities] = useState([])
  const [loading, setLoading] = useState(true)
  // ...
  return { entities, loading, openCreate, openEdit, handleDelete, ... }
}
```

#### Паттерн сервиса API:
```typescript
// services/entity.service.ts
export const EntityService = {
  getAll: (params) => api.get('/entities', params),
  create: (data) => api.post('/entities', data),
  update: (id, data) => api.patch(`/entities/${id}`, data),
  delete: (id) => api.delete(`/entities/${id}`),
}
```

#### Паттерн компонента модального окна:
```tsx
// components/modals/EntityModal.tsx
export function EntityModal({ opened, onClose, entity, onSave, loading }) {
  // useForm с zodResolver
  // useEffect для сброса формы
  // JSX с Form
}
```

#### Паттерн ConfirmDialog:
```tsx
<ConfirmDialog
  opened={deleteConfirm.opened}
  onClose={() => setDeleteConfirm({ opened: false })}
  onConfirm={executeDelete}
  title="Удалить?"
  message="..."
  confirmLabel="Удалить"
  color="red"
/>
```

---

## 2. Требования к реализации

### 2.1 Философия инструмента

**Ключевое правило:** Платформа не имеет валюты, только «условные единицы» (у.е.).

**Цели инструмента:**
1. Помогать пользователю осознанно тратить «условные единицы»
2. Анализировать привычки потребления
3. Визуализировать прогресс обучения через рефлексию
4. Интегрироваться с учебным планом

### 2.2 Функциональные требования

| Функция | Описание | Приоритет |
|---------|----------|-----------|
| CRUD записей | Создание, просмотр, редактирование, удаление записей о тратах | Критический |
| Категории трат | LIFE, CULTURE, EXTRA, UNEXPECTED | Критический |
| Статистика за месяц | Общая сумма, по категориям, дни с записями | Критический |
| Плановый лимит | Настройка месячного лимита | Высокий |
| Рефлексия | Анализ трат в конце месяца | Высокий |
| Визуализация | График по категориям | Средний |

### 2.3 Нефункциональные требования

- Адаптивный UI (Mobile-first)
- Защита от XSS и CSRF
- Валидация данных на клиенте и сервере
- Производительность: <500ms на API запрос
- TypeScript строгая типизация

---

## 3. Модель данных

### 3.1 Анализ существующей модели

**Что уже есть в `schema.prisma`:**
- ✅ `Profile` — основной профиль пользователя
- ✅ `BusinessEvent` — для трекинга событий (можно использовать для аналитики)
- ✅ `Notification` — для уведомлений о достижениях

**Что нужно добавить:**

```prisma
// Японская система ведения бюджета КаКеБо
model KakeboEntry {
  id          String   @id @default(cuid())
  profileId   String
  profile     Profile  @relation(fields: [profileId], references: [id], onDelete: CASCADE)
  
  date        DateTime @map("date") @db.Date // Конкретный день траты
  year        Int      // Год (для быстрой агрегации)
  month       Int      // Месяц (1-12)
  
  category    KakeboCategory @default(LIFE)
  description String   @db.Text // Что купили?
  amount      Float    // Сумма траты в условных единицах
  isNecessary Boolean  // Было ли это необходимо?
  
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

// Настройки пользователя Kakebo
model KakeboSettings {
  profileId   String   @id
  profile     Profile  @relation(fields: [profileId], references: [id], onDelete: CASCADE)
  
  monthLimit  Float?   // Плановая трата в месяц
  
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  @@map("kakebo_settings")
}

// Рефлексия пользователя
model KakeboReflection {
  id          String   @id @default(cuid())
  profileId   String
  profile     Profile  @relation(fields: [profileId], references: [id], onDelete: CASCADE)
  
  year        Int
  month       Int
  
  // Анализ трат
  unnecessarySpent Float? @map("unnecessary_spent") // Сумма необязательных трат
  
  // Ответы на вопросы
  moneyAtStart      Float? @map("money_at_start")     // Сколько было в начале
  plannedToSave     Float? @map("planned_to_save")    // Сколько планировали отложить
  actuallySaved     Float? @map("actually_saved")     // Сколько отложили
  improvements      String? @db.Text // Что улучшим в следующем месяце
  
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  @@unique([profileId, year, month])
  @@index([profileId, year, month])
  @@map("kakebo_reflections")
}
```

### 3.2 Миграция базы данных

**Шаги:**
1. Добавить модели в `prisma/schema.prisma`
2. Создать миграцию: `npx prisma migrate dev --name add_kakebo_models`
3. Применить миграцию: `npx prisma migrate deploy`
4. Обновить Prisma Client: `npx prisma generate`

**Что проверить после миграции:**
- [ ] Все таблицы созданы в MySQL
- [ ] Индексы созданы правильно
- [ ] Foreign keys с CASCADE работают
- [ ] ENUM `KakeboCategory` создан

---

## 4. Безопасность и проверки

### 4.1 Middleware

Все эндпоинты `/api/kakebo/*` должны использовать:

```typescript
import { requireAuth } from '../middleware/auth'

// В routes/kakebo.routes.ts
app.use('/kakebo', requireAuth)
```

### 4.2 Проверка прав доступа

При каждом запросе данных проверять, что `profileId` в запросе совпадает с `profileId` из сессии:

```typescript
// Пример проверки в роуте
const profile = c.get('profile')
if (!profile) throw new AppError(401, 'Требуется авторизация')

const entries = await prisma.kakeboEntry.findMany({
  where: { profileId: profile.id } // ✅ Только свои данные
})
```

### 4.3 Валидация данных

Использовать Zod для валидации входных данных:

```typescript
import { z } from 'zod'

const KakeboEntrySchema = z.object({
  date: z.string().refine(val => !isNaN(Date.parse(val)), 'Неверная дата'),
  category: z.enum(['LIFE', 'CULTURE', 'EXTRA', 'UNEXPECTED']),
  description: z.string().min(1, 'Описание обязательно').max(500, 'Слишком длинно'),
  amount: z.number().positive('Сумма должна быть больше 0'),
  isNecessary: z.boolean(),
})

const KakeboSettingsSchema = z.object({
  monthLimit: z.number().positive().optional().nullable(),
})

const KakeboReflectionSchema = z.object({
  year: z.number(),
  month: z.number().min(1).max(12),
  unnecessarySpent: z.number().optional(),
  moneyAtStart: z.number().optional(),
  plannedToSave: z.number().optional(),
  actuallySaved: z.number().optional(),
  improvements: z.string().max(1000).optional(),
})
```

### 4.4 Что нужно проверить перед реализацией

1. **Существующие middleware:**
   - [ ] `requireAuth` работает корректно
   - [ ] `getCurrentUser` и `getCurrentProfile` возвращают данные
   - [ ] Сессии истекают правильно

2. **Безопасность данных:**
   - [ ] Все запросы фильтруются по `profileId` из сессии
   - [ ] Нет возможности получить чужие данные через IDOR

3. **Валидация:**
   - [ ] Zod схемы настроены
   - [ ] Ошибки валидации возвращаются корректно

---

## 5. API Endpoints

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
