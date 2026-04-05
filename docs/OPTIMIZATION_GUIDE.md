# Руководство по оптимизации и рефакторингу проекта Economikus

> Единый документ с принципами, правилами и стандартами разработки

---

## Содержание

1. [Принципы разработки](#1-принципы-разработки)
2. [Архитектура проекта](#2-архитектура-проекта)
3. [Стандарты именования](#3-стандарты-именования)
4. [Переиспользуемые компоненты](#4-переиспользуемые-компоненты)
5. [Хуки для управления состоянием](#5-хуки-для-управления-состоянием)
6. [Модальные окна](#6-модальные-окна)
7. [Сервисы API](#7-сервисы-api)
8. [Константы и типы](#8-константы-и-типы)
9. [Правила рефакторинга страниц](#9-правила-рефакторинга-страниц)
10. [Чеклист для новых фич](#10-чеклист-для-новых-фич)

---

## 1. Принципы разработки

### 1.1 Основные принципы

| Принцип | Описание |
|---------|----------|
| **DRY** | Don't Repeat Yourself — избегаем дублирование кода |
| **KISS** | Keep It Simple, Stupid — простые решения лучше сложных |
| **Single Responsibility** | Один компонент/хук — одна задача |
| **Composition over Inheritance** | Композиция вместо наследования |

### 1.2 Правила написания кода

```typescript
// ❌ Плохо: дублирование логики
function AdminTags() {
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    api.get('/admin/tags').then(res => setTags(res.data.items))
  }, [])
  // ...
}

function AdminCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    api.get('/admin/courses').then(res => setCourses(res.data.items))
  }, [])
  // ...
}

// ✅ Хорошо: выносим в хук
function AdminTags() {
  const { tags, loading, handleDelete } = useTagList()
  // ...
}

function AdminCourses() {
  const { courses, loading, handleDelete } = useCourseList()
  // ...
}
```

### 1.3 Структура файлов

```
src/
├── components/           # Переиспользуемые UI компоненты
│   ├── common/          # Универсальные компоненты (Badge, Dialog, etc.)
│   ├── modals/          # Модальные окна
│   ├── tables/          # Компоненты таблиц
│   ├── cards/           # Карточки
│   └── layout/          # Layout компоненты
│
├── hooks/               # Кастомные хуки
├── services/            # API сервисы
├── types/               # TypeScript типы
├── constants/           # Константы и конфигурации
├── pages/               # Страницы приложения
└── layouts/             # Layout обёртки
```

---

## 2. Архитектура проекта

### 2.1 Уровни абстракции

```
┌─────────────────────────────────────────────────────────────┐
│                         PAGES                                │
│  (Страницы — используют компоненты, хуки, сервисы)          │
├─────────────────────────────────────────────────────────────┤
│                       LAYOUTS                                │
│  (Обёртки страниц — Header, Footer, Sidebar)                │
├─────────────────────────────────────────────────────────────┤
│                      COMPONENTS                              │
│  (UI компоненты — modals, tables, cards, common)            │
├─────────────────────────────────────────────────────────────┤
│                         HOOKS                                │
│  (Бизнес-логика — useTagList, useCourseList, etc.)          │
├─────────────────────────────────────────────────────────────┤
│                       SERVICES                               │
│  (API вызовы — TagService, CourseService, etc.)             │
├─────────────────────────────────────────────────────────────┤
│                      CONSTANTS                               │
│  (Статичные данные — статусы, роли, типы)                   │
├─────────────────────────────────────────────────────────────┤
│                         TYPES                                │
│  (TypeScript интерфейсы и типы)                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Поток данных

```
Page → Hook → Service → API → Backend
  ↓
Component (render)
```

---

## 3. Стандарты именования

### 3.1 Файлы

| Тип | Паттерн | Пример |
|-----|---------|--------|
| Компонент | `PascalCase.tsx` | `StatusBadge.tsx` |
| Хук | `camelCase.ts` | `useTagList.ts` |
| Сервис | `camelCase.service.ts` | `tag.service.ts` |
| Тип | `camelCase.ts` | `tag.ts` |
| Константа | `camelCase.ts` | `status.ts` |
| Страница | `PascalCase.tsx` | `AdminTags.tsx` |

### 3.2 Компоненты

```typescript
// ✅ Хорошо: описательное имя
export function ConfirmDialog({ opened, onClose, onConfirm, title, message }: ConfirmDialogProps) {}

// ✅ Хорошо: префикс для типа компонента
export function UserModal() {}
export function StatusBadge() {}
export function StatCard() {}

// ❌ Плохо: неинформативное имя
export function Dialog() {}
export function Badge() {}
export function Card() {}
```

### 3.3 Хуки

```typescript
// ✅ Хорошо: префикс use + описательное имя
export function useTagList() {}
export function useCourseList() {}
export function useNotification() {}

// ✅ Хорошо: возвращаемый тип с суффиксом Return
interface UseTagListReturn {
  tags: Tag[]
  loading: boolean
  // ...
}
```

### 3.4 Переменные и функции

```typescript
// ✅ Хорошо: глагол для действий
const fetchUsers = async () => {}
const handleDelete = async (id: string) => {}
const openEditModal = (user: User) => {}

// ✅ Хорошо: is/has для булевых значений
const isLoading = true
const hasPermission = false
const isOpened = false

// ✅ Хорошо: описательные имена для состояния
const [deleteConfirm, setDeleteConfirm] = useState({ opened: false, id: null })
```

---

## 4. Переиспользуемые компоненты

### 4.1 Общие компоненты (src/components/common/)

| Компонент | Назначение | Props |
|-----------|------------|-------|
| `StatusBadge` | Бейдж статуса | `status, type, size, variant` |
| `RoleBadge` | Бейдж роли | `role, size, variant` |
| `LoadingState` | Состояние загрузки | `text, size` |
| `EmptyState` | Пустое состояние | `title, description, icon` |
| `ErrorState` | Состояние ошибки | `title, message, onRetry` |
| `ConfirmDialog` | Диалог подтверждения | `opened, onClose, onConfirm, title, message` |
| `ColorIndicator` | Индикатор цвета | `color, size` |
| `AvatarUploader` | Загрузка аватара | `currentAvatar, size, onUploadSuccess` |

### 4.2 Пример использования

```tsx
import { StatusBadge, RoleBadge, ConfirmDialog, LoadingState, EmptyState, AvatarUploader } from '@/components/common'
import { ProtectedRoute } from '@/components/auth'

// Статус контента
<StatusBadge status={course.status} type="content" />

// Роль пользователя
<RoleBadge role={user.role} />

// Диалог подтверждения
<ConfirmDialog
  opened={deleteConfirm.opened}
  onClose={() => setDeleteConfirm({ opened: false })}
  onConfirm={handleDelete}
  title="Удалить курс?"
  message="Это действие нельзя отменить."
  confirmLabel="Удалить"
  color="red"
/>

// Состояния
{loading && <LoadingState text="Загрузка..." />}
{!loading && items.length === 0 && <EmptyState title="Нет данных" />}

// Загрузка аватара
<AvatarUploader
  currentAvatar={profile.avatarUrl}
  size={80}
  onUploadSuccess={(url) => console.log('Uploaded:', url)}
/>

// Защита роутов
<ProtectedRoute roles={['ADMIN']}>
  <AdminDashboard />
</ProtectedRoute>
```

### 4.3 Создание нового компонента

```tsx
// src/components/common/NewBadge.tsx
import { Badge } from '@mantine/core'
import { NEW_CONFIG } from '@/constants'

interface NewBadgeProps {
  type: string
  size?: 'sm' | 'md' | 'lg'
}

export function NewBadge({ type, size = 'md' }: NewBadgeProps) {
  const config = NEW_CONFIG[type]
  
  return (
    <Badge color={config?.color || 'gray'} size={size}>
      {config?.label || type}
    </Badge>
  )
}

// Экспорт в src/components/common/index.ts
export { NewBadge } from './NewBadge'
```

---

## 5. Хуки для управления состоянием

### 5.1 Структура хука для списка с CRUD

```typescript
// src/hooks/useEntityList.ts
import { useState, useCallback, useEffect } from 'react'
import { EntityService } from '@/services'
import type { Entity, EntityInput } from '@/types'
import { useNotification } from './useNotification'

interface UseEntityListReturn {
  entities: Entity[]
  loading: boolean
  page: number
  setPage: (page: number) => void
  totalPages: number
  search: string
  setSearch: (search: string) => void
  filter: string | null
  setFilter: (filter: string | null) => void
  modalOpened: boolean
  editingEntity: Entity | null
  saving: boolean
  openCreate: () => void
  openEdit: (entity: Entity) => void
  closeModal: () => void
  handleSave: (data: EntityInput) => Promise<void>
  handleDelete: (id: string) => Promise<void>
  refresh: () => Promise<void>
}

export function useEntityList(): UseEntityListReturn {
  const [entities, setEntities] = useState<Entity[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string | null>(null)
  const [modalOpened, setModalOpened] = useState(false)
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null)
  const [saving, setSaving] = useState(false)
  const { showError, showSuccess } = useNotification()

  // Загрузка данных
  const fetchEntities = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = { page: page.toString(), limit: '10' }
      if (search) params.search = search
      if (filter) params.filter = filter

      const result = await EntityService.getAdmin(params)
      setEntities(result.items)
      setTotalPages(result.pagination.totalPages)
    } catch (error) {
      showError('Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }, [page, search, filter, showError])

  useEffect(() => {
    fetchEntities()
  }, [fetchEntities])

  // CRUD операции
  const openCreate = useCallback(() => {
    setEditingEntity(null)
    setModalOpened(true)
  }, [])

  const openEdit = useCallback((entity: Entity) => {
    setEditingEntity(entity)
    setModalOpened(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalOpened(false)
    setEditingEntity(null)
  }, [])

  const handleSave = useCallback(async (data: EntityInput) => {
    setSaving(true)
    try {
      if (editingEntity) {
        await EntityService.update(editingEntity.id, data)
        showSuccess('Обновлено')
      } else {
        await EntityService.create(data)
        showSuccess('Создано')
      }
      closeModal()
      fetchEntities()
    } catch (error) {
      showError('Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }, [editingEntity, closeModal, fetchEntities, showError, showSuccess])

  const handleDelete = useCallback(async (id: string) => {
    try {
      await EntityService.delete(id)
      showSuccess('Удалено')
      fetchEntities()
    } catch (error) {
      showError('Ошибка удаления')
    }
  }, [fetchEntities, showError, showSuccess])

  return {
    entities,
    loading,
    page,
    setPage,
    totalPages,
    search,
    setSearch,
    filter,
    setFilter,
    modalOpened,
    editingEntity,
    saving,
    openCreate,
    openEdit,
    closeModal,
    handleSave,
    handleDelete,
    refresh: fetchEntities,
  }
}
```

### 5.2 Существующие хуки

| Хук | Назначение |
|-----|------------|
| `useTagList` | Управление списком тегов |
| `useCourseList` | Управление списком курсов |
| `useLessonList` | Управление списком уроков |
| `useUserList` | Управление списком пользователей |
| `useNotification` | Уведомления (toast) |
| `useConfirm` | Диалоги подтверждения |
| `usePagination` | Логика пагинации |
| `useTable` | Логика таблиц с сортировкой |

---

## 6. Модальные окна

### 6.1 Структура модального окна

```tsx
// src/components/modals/EntityModal.tsx
import { useEffect } from 'react'
import { Modal, Stack, TextInput, Group, Button } from '@mantine/core'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Entity } from '@/types'

// Схема валидации
const EntitySchema = z.object({
  name: z.string().min(2, 'Минимум 2 символа').max(100, 'Максимум 100 символов'),
  description: z.string().max(500).optional(),
})

type EntityFormData = z.infer<typeof EntitySchema>

interface EntityModalProps {
  opened: boolean
  onClose: () => void
  entity: Entity | null
  onSave: (data: EntityFormData) => Promise<void>
  loading?: boolean
}

export function EntityModal({ opened, onClose, entity, onSave, loading }: EntityModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
  } = useForm<EntityFormData>({
    resolver: zodResolver(EntitySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  // Сброс формы при открытии
  useEffect(() => {
    if (opened) {
      reset({
        name: entity?.name || '',
        description: entity?.description || '',
      })
    }
  }, [opened, entity, reset])

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={entity ? 'Редактировать' : 'Создать'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSave)}>
        <Stack gap="md">
          <TextInput
            label="Название"
            required
            {...register('name')}
            error={errors.name?.message}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onClose}>Отмена</Button>
            <Button type="submit" loading={loading}>
              {entity ? 'Сохранить' : 'Создать'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
```

### 6.2 Существующие модальные окна

| Модальное окно | Назначение |
|----------------|------------|
| `TagModal` | Создание/редактирование тега |
| `CourseModal` | Создание/редактирование курса |
| `LessonModal` | Создание/редактирование урока |
| `UserModal` | Редактирование пользователя |

---

## 7. Сервисы API

### 7.1 Структура сервиса

```typescript
// src/services/entity.service.ts
import { api } from './api'
import type { Entity, EntityInput, PaginatedResponse } from '@/types'

export const EntityService = {
  // === ПУБЛИЧНЫЕ ===

  /**
   * Получить список
   */
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get<PaginatedResponse<Entity>>('/entities', params),

  /**
   * Получить по ID
   */
  getById: (id: string) =>
    api.get<Entity>(`/entities/${id}`),

  // === АДМИН ===

  /**
   * Создать
   */
  create: (data: EntityInput) =>
    api.post<Entity>('/admin/entities', data),

  /**
   * Обновить
   */
  update: (id: string, data: Partial<EntityInput>) =>
    api.patch<Entity>(`/admin/entities/${id}`, data),

  /**
   * Удалить
   */
  delete: (id: string) =>
    api.delete(`/admin/entities/${id}`),

  /**
   * Получить список (админ)
   */
  getAdmin: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get<PaginatedResponse<Entity>>('/admin/entities', params),
}
```

### 7.2 Базовый API класс

```typescript
// src/services/api.ts
const API_BASE = '/api'

export const api = {
  get: <T>(url: string, params?: Record<string, unknown>) =>
    fetch(`${API_BASE}${url}?${new URLSearchParams(params as Record<string, string>)}`, {
      credentials: 'include',
    }).then(res => res.json()) as Promise<T>,

  post: <T>(url: string, data?: unknown) =>
    fetch(`${API_BASE}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    }).then(res => res.json()) as Promise<T>,

  patch: <T>(url: string, data?: unknown) =>
    fetch(`${API_BASE}${url}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    }).then(res => res.json()) as Promise<T>,

  delete: (url: string) =>
    fetch(`${API_BASE}${url}`, {
      method: 'DELETE',
      credentials: 'include',
    }),
}
```

---

## 8. Константы и типы

### 8.1 Структура констант

```typescript
// src/constants/status.ts
export const STATUS_COLORS = {
  course: {
    DRAFT: 'gray',
    PUBLISHED: 'green',
    ARCHIVED: 'red',
  },
  lesson: {
    DRAFT: 'gray',
    PUBLISHED: 'green',
    ARCHIVED: 'red',
  },
}

export const STATUS_LABELS = {
  course: {
    DRAFT: 'Черновик',
    PUBLISHED: 'Опубликован',
    ARCHIVED: 'Архив',
  },
  lesson: {
    DRAFT: 'Черновик',
    PUBLISHED: 'Опубликован',
    ARCHIVED: 'Архив',
  },
}

// src/constants/roles.ts
export const ROLE_COLORS = {
  USER: 'gray',
  AUTHOR: 'blue',
  ADMIN: 'red',
}

export const ROLE_LABELS = {
  USER: 'Пользователь',
  AUTHOR: 'Автор',
  ADMIN: 'Администратор',
}
```

### 8.2 Структура типов

```typescript
// src/types/entity.ts
export interface Entity {
  id: string
  name: string
  description?: string
  createdAt?: string
}

export interface EntityInput {
  name: string
  description?: string
}

// src/types/api.ts
export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

---

## 9. Правила рефакторинга страниц

### 9.1 Шаги рефакторинга

1. **Создать типы** (если отсутствуют)
   - `src/types/entity.ts` — интерфейсы Entity, EntityInput
   - Экспортировать в `src/types/index.ts`

2. **Создать сервис** (если отсутствует)
   - `src/services/entity.service.ts` — CRUD методы
   - Экспортировать в `src/services/index.ts`

3. **Создать хук**
   - `src/hooks/useEntityList.ts` — логика списка с CRUD
   - Экспортировать в `src/hooks/index.ts`

4. **Создать модальное окно**
   - `src/components/modals/EntityModal.tsx` — форма создания/редактирования
   - Экспортировать в `src/components/modals/index.ts`

5. **Обновить страницу**
   - Импортировать хук, модалку, компоненты
   - Удалить локальное состояние и логику
   - Использовать ConfirmDialog вместо confirm()

### 9.2 Шаблон страницы

```tsx
// src/pages/admin/AdminEntities.tsx
import { useState } from 'react'
import { Box, Button, Card, Group, Text, Table, TextInput, Select, Pagination, ActionIcon, Menu, Skeleton, Alert, Stack, Badge } from '@mantine/core'
import { Plus, Search, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { EntityModal } from '@/components/modals'
import { StatusBadge, ConfirmDialog } from '@/components/common'
import { useEntityList } from '@/hooks'
import { STATUS_LABELS } from '@/constants'
import type { EntityInput } from '@/types'

export function AdminEntities() {
  const {
    entities,
    loading,
    page,
    setPage,
    totalPages,
    search,
    setSearch,
    filter,
    setFilter,
    modalOpened,
    editingEntity,
    saving,
    openCreate,
    openEdit,
    closeModal,
    handleSave,
    handleDelete,
  } = useEntityList()

  // Диалог подтверждения
  const [deleteConfirm, setDeleteConfirm] = useState({
    opened: false,
    id: null as string | null,
    name: '',
  })

  const confirmDelete = (entity: { id: string; name: string }) => {
    setDeleteConfirm({ opened: true, id: entity.id, name: entity.name })
  }

  const executeDelete = async () => {
    if (deleteConfirm.id) {
      await handleDelete(deleteConfirm.id)
      setDeleteConfirm({ opened: false, id: null, name: '' })
    }
  }

  const onSave = async (data: EntityInput) => {
    await handleSave(data)
  }

  return (
    <Box>
      {/* Header */}
      <Group justify="space-between" mb="lg">
        <Text size="xl" fw={700}>Сущности</Text>
        <Button leftSection={<Plus size={16} />} onClick={openCreate}>
          Создать
        </Button>
      </Group>

      {/* Filters */}
      <Card shadow="xs" padding="md" radius="md" withBorder mb="lg">
        <Group>
          <TextInput
            placeholder="Поиск..."
            leftSection={<Search size={16} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Фильтр"
            data={[{ value: '', label: 'Все' }]}
            value={filter}
            onChange={(v) => setFilter(v || null)}
            clearable
            w={180}
          />
        </Group>
      </Card>

      {/* Table */}
      {loading ? (
        <Stack gap="sm">
          {[...Array(5)].map((_, i) => <Skeleton key={i} height={60} radius="md" />)}
        </Stack>
      ) : entities.length === 0 ? (
        <Alert color="gray">Не найдено</Alert>
      ) : (
        <Card shadow="xs" padding={0} radius="md" withBorder>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Название</Table.Th>
                <Table.Th>Статус</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {entities.map((entity) => (
                <Table.Tr key={entity.id}>
                  <Table.Td>
                    <Text fw={500}>{entity.name}</Text>
                  </Table.Td>
                  <Table.Td>
                    <StatusBadge status={entity.status} type="content" />
                  </Table.Td>
                  <Table.Td>
                    <Menu>
                      <Menu.Target>
                        <ActionIcon variant="subtle">
                          <MoreVertical size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item leftSection={<Pencil size={14} />} onClick={() => openEdit(entity)}>
                          Редактировать
                        </Menu.Item>
                        <Menu.Item color="red" leftSection={<Trash2 size={14} />} onClick={() => confirmDelete({ id: entity.id, name: entity.name })}>
                          Удалить
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Group justify="center" mt="lg">
          <Pagination total={totalPages} value={page} onChange={setPage} />
        </Group>
      )}

      {/* Modal */}
      <EntityModal
        opened={modalOpened}
        onClose={closeModal}
        entity={editingEntity}
        onSave={onSave}
        loading={saving}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        opened={deleteConfirm.opened}
        onClose={() => setDeleteConfirm({ opened: false, id: null, name: '' })}
        onConfirm={executeDelete}
        title="Удалить?"
        message={`"${deleteConfirm.name}" будет удалено. Это действие нельзя отменить.`}
        confirmLabel="Удалить"
        color="red"
      />
    </Box>
  )
}
```

### 9.3 Чеклист рефакторинга

- [ ] Типы созданы и экспортированы
- [ ] Сервис создан и экспортирован
- [ ] Хук создан и экспортирован
- [ ] Модальное окно создано и экспортировано
- [ ] Страница обновлена
- [ ] ConfirmDialog используется вместо confirm()
- [ ] StatusBadge/RoleBadge используются вместо локальных мап
- [ ] TypeScript компиляция без ошибок
- [ ] Линтер без ошибок

---

## 10. Чеклист для новых фич

### 10.1 Перед началом

- [ ] Проанализированы существующие компоненты/хуки
- [ ] Определена необходимость новых абстракций
- [ ] Согласована структура с командой

### 10.2 Разработка

- [ ] Типы в `src/types/`
- [ ] Константы в `src/constants/`
- [ ] Сервис в `src/services/`
- [ ] Хук в `src/hooks/`
- [ ] Компоненты в `src/components/`
- [ ] Страница в `src/pages/`

### 10.3 Проверка

- [ ] `npm run build` — без ошибок
- [ ] `npm run lint` — без ошибок (warnings допустимы)
- [ ] `npx tsc --noEmit` — без ошибок
- [ ] Код отформатирован (Prettier)

### 10.4 Документация

- [ ] JSDoc комментарии для публичных функций
- [ ] Обновлена TECHNICAL_DOCUMENTATION.md (если нужно)
- [ ] Обновлен REFACTORING_PLAN.md (если нужно)

---

## Приложение А: Существующие компоненты

### Переиспользуемые компоненты

| Категория | Компонент | Файл |
|-----------|-----------|------|
| Common | StatusBadge | `components/common/StatusBadge.tsx` |
| Common | RoleBadge | `components/common/RoleBadge.tsx` |
| Common | LoadingState | `components/common/LoadingState.tsx` |
| Common | EmptyState | `components/common/EmptyState.tsx` |
| Common | ErrorState | `components/common/ErrorState.tsx` |
| Common | ConfirmDialog | `components/common/ConfirmDialog.tsx` |
| Common | ColorIndicator | `components/common/ColorIndicator.tsx` |
| Common | AvatarUploader | `components/common/AvatarUploader.tsx` |
| Auth | ProtectedRoute | `components/auth/ProtectedRoute.tsx` |
| Modals | TagModal | `components/modals/TagModal.tsx` |
| Modals | CourseModal | `components/modals/CourseModal.tsx` |
| Modals | LessonModal | `components/modals/LessonModal.tsx` |
| Modals | UserModal | `components/modals/UserModal.tsx` |
| Tables | DataTable | `components/tables/DataTable.tsx` |
| Tables | TableFilters | `components/tables/TableFilters.tsx` |
| Cards | StatCard | `components/cards/StatCard.tsx` |

### Хуки

| Хук | Файл | Назначение |
|-----|------|------------|
| useAuth | `hooks/useAuth.ts` | Авторизация |
| useNotification | `hooks/useNotification.ts` | Уведомления |
| useConfirm | `hooks/useConfirm.ts` | Диалоги подтверждения |
| usePagination | `hooks/usePagination.ts` | Пагинация |
| useTable | `hooks/useTable.ts` | Таблицы |
| useTagList | `hooks/useTagList.ts` | Теги |
| useCourseList | `hooks/useCourseList.ts` | Курсы |
| useLessonList | `hooks/useLessonList.ts` | Уроки |
| useUserList | `hooks/useUserList.ts` | Пользователи |
| useAvatarUpload | `hooks/useAvatarUpload.ts` | Загрузка аватара |

### Сервисы

| Сервис | Файл | Назначение |
|--------|------|------------|
| api | `services/api.ts` | Базовый API |
| AuthService | `services/auth.service.ts` | Авторизация |
| UserService | `services/user.service.ts` | Пользователи |
| CourseService | `services/course.service.ts` | Курсы |
| LessonService | `services/lesson.service.ts` | Уроки |
| TagService | `services/tag.service.ts` | Теги |
| ApplicationService | `services/application.service.ts` | Заявки |

---

## Приложение Б: Статус рефакторинга

### Выполнено ✅

#### Админ-страницы

| Страница | Хук | Модалка | Компоненты |
|----------|-----|---------|------------|
| AdminDashboard | — | — | StatCard |
| AdminTags | useTagList | TagModal | ColorIndicator, ConfirmDialog |
| AdminCourses | useCourseList | CourseModal | StatusBadge, ConfirmDialog |
| AdminLessons | useLessonList | LessonModal | StatusBadge, ConfirmDialog |
| AdminUsers | useUserList | UserModal | RoleBadge, ConfirmDialog |

#### Защита роутов

| Компонент | Назначение |
|-----------|------------|
| ProtectedRoute | Защита роутов с проверкой авторизации и ролей |

#### Профиль пользователя

| Компонент | Назначение |
|-----------|------------|
| ProfileSettingsPage | Рефакторинг с AvatarUploader |
| AvatarUploader | Загрузка и удаление аватара |
| useAvatarUpload | Хук для загрузки аватара |

#### Бэкенд endpoints

| Endpoint | Метод | Назначение |
|----------|-------|------------|
| `/user/password` | PATCH | Смена пароля |
| `/user/avatar` | POST | Загрузка аватара |
| `/user/avatar` | DELETE | Удаление аватара |

### В процессе 🔲

| Страница | Статус |
|----------|--------|
| AdminModeration | Требует отдельного подхода (модерация контента) |
| AdminApplications | Требует отдельного подхода (заявки авторов) |
| LoginPage | Рефакторинг с useAuthForm |
| RegisterPage | Рефакторинг с useAuthForm |
| BecomeAuthorPage | Рефакторинг |

---

## 11. Тестирование API

### 11.1 Обязательные проверки

При создании новых API endpoints **обязательно** проводить тестирование:

1. **Проверка авторизации**
   - Запрос без авторизации должен возвращать `401 Unauthorized`
   - Запрос с авторизацией должен возвращать данные

2. **Проверка прав доступа**
   - Запрос с недостаточными правами должен возвращать `403 Forbidden`

3. **Проверка валидации**
   - Невалидные данные должны возвращать `400 Bad Request`
   - Проверить граничные случаи

4. **Проверка существования данных**
   - Запрос к несуществующему ресурсу должен возвращать `404 Not Found`

### 11.2 Пример тестирования

```powershell
# Проверка без авторизации (должен вернуть 401)
Invoke-RestMethod -Uri "http://localhost:3000/api/author/analytics" -Method Get

# Проверка Swagger документации
Invoke-WebRequest -Uri "http://localhost:3000/api/swagger" -UseBasicParsing

# Проверка OpenAPI spec
Invoke-RestMethod -Uri "http://localhost:3000/api/doc" -Method Get
```

### 11.3 Добавление в Swagger

После тестирования endpoint **обязательно** добавить документацию в OpenAPI:

1. Открыть `server/index.ts`
2. Найти секцию `paths` в `/api/doc` endpoint
3. Добавить описание endpoint с параметрами и responses

Пример:
```typescript
'/author/analytics': {
  get: {
    tags: ['Author'],
    summary: 'Детальная аналитика автора',
    description: 'Возвращает расширенную статистику',
    responses: {
      '200': { description: 'Детальная аналитика' },
      '401': { description: 'Не авторизован' },
      '403': { description: 'Доступ только для авторов' }
    }
  }
}
```

### 11.4 Чеклист тестирования API

- [ ] Endpoint доступен по правильному URL
- [ ] Возвращает правильный HTTP статус
- [ ] Возвращает правильный формат данных (JSON)
- [ ] Обрабатывает ошибки корректно
- [ ] Документация добавлена в Swagger
- [ ] Документация обновлена в TECHNICAL_DOCUMENTATION_4.md

---

*Документ создан: Январь 2025*
*Версия: 1.1*
*Обновлено: Добавлен раздел 11 - Тестирование API*
