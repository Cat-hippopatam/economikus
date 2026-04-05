# План рефакторинга: Переиспользуемые компоненты

> Анализ всех страниц и компонентов с целью выделения переиспользуемых частей

---

## 1. Структура папок после рефакторинга

```
src/
├── types/                      # TypeScript типы и интерфейсы
│   ├── index.ts
│   ├── auth.ts
│   ├── user.ts
│   ├── course.ts
│   ├── lesson.ts
│   ├── tag.ts
│   ├── comment.ts
│   ├── application.ts
│   ├── moderation.ts
│   └── api.ts                  # API типы (pagination, response)
│
├── constants/                  # Статические данные и маппинги
│   ├── index.ts
│   ├── config.ts               # ✅ Уже есть
│   ├── navigation.ts           # ✅ Уже есть
│   ├── enums.ts                # ✅ Уже есть
│   ├── status.ts               # Статусы и их цвета/лейблы
│   ├── roles.ts                # Роли и их цвета/лейблы
│   ├── difficulty.ts           # Уровни сложности
│   └── lessonTypes.ts          # Типы уроков
│
├── services/                   # API сервисы
│   ├── index.ts
│   ├── api.ts                  # Базовый axios/fetch инстанс
│   ├── auth.service.ts
│   ├── user.service.ts
│   ├── course.service.ts
│   ├── lesson.service.ts
│   ├── tag.service.ts
│   ├── comment.service.ts
│   ├── application.service.ts
│   └── moderation.service.ts
│
├── hooks/                      # Кастомные хуки
│   ├── index.ts
│   ├── useAuth.ts              # ✅ Уже есть
│   ├── usePagination.ts        # Переиспользуемая пагинация
│   ├── useTable.ts             # Переиспользуемая логика таблиц
│   ├── useModal.ts             # Переиспользуемые модалки
│   └── useNotification.ts      # Переиспользуемые уведомления
│
├── components/                 # Переиспользуемые UI компоненты
│   ├── index.ts
│   ├── layout/                 # ✅ Уже есть
│   ├── common/                 # Общие компоненты
│   │   ├── StatusBadge.tsx
│   │   ├── ColorIndicator.tsx
│   │   ├── AvatarGroup.tsx
│   │   ├── EmptyState.tsx
│   │   ├── LoadingState.tsx
│   │   ├── ErrorState.tsx
│   │   └── ConfirmDialog.tsx
│   ├── forms/                  # Формы
│   │   ├── FormInput.tsx
│   │   ├── FormTextarea.tsx
│   │   ├── FormSelect.tsx
│   │   └── FormActions.tsx
│   ├── tables/                 # Таблицы
│   │   ├── DataTable.tsx
│   │   ├── TableActions.tsx
│   │   └── TableFilters.tsx
│   ├── cards/                  # Карточки
│   │   ├── StatCard.tsx
│   │   ├── UserCard.tsx
│   │   ├── CourseCard.tsx
│   │   └── CommentCard.tsx
│   └── modals/                 # Модальные окна
│       ├── EntityModal.tsx
│       ├── RejectionModal.tsx
│       └── ConfirmModal.tsx
│
└── pages/                      # Страницы (только JSX)
    ├── admin/
    ├── auth/
    ├── profile/
    └── ...
```

---

## 2. Анализ по страницам

### 2.1 AdminDashboard.tsx

**Текущие проблемы:**
- Интерфейс `Stats` определён внутри файла
- Конфигурация карточек (`statCards`) смешана с JSX

**Что вынести:**

| Сущность | Куда | Файл |
|----------|------|------|
| `Stats` интерфейс | types/ | `types/stats.ts` |
| `statCards` конфиг | constants/ | `constants/dashboard.ts` |
| Карточка статистики | components/ | `components/cards/StatCard.tsx` |

**После рефакторинга:**
```typescript
// pages/admin/AdminDashboard.tsx
import { StatCard } from '@/components/cards/StatCard'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import { DASHBOARD_STATS_CONFIG } from '@/constants/dashboard'

export function AdminDashboard() {
  const { stats, loading } = useDashboardStats()
  
  return (
    <div>
      <Text size="xl" fw={700} mb="lg">Дашборд</Text>
      <Grid>
        {DASHBOARD_STATS_CONFIG.map((config) => (
          <Grid.Col key={config.key} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
            <StatCard
              config={config}
              value={stats?.[config.key]}
              loading={loading}
            />
          </Grid.Col>
        ))}
      </Grid>
    </div>
  )
}
```

---

### 2.2 AdminCourses.tsx

**Текущие проблемы:**
- Интерфейс `Course` дублируется в AdminLessons
- `statusColors`, `statusLabels`, `difficultyLabels` — статика
- Логика пагинации, поиска, фильтрации повторяется
- Модальное окно создания/редактирования — 100+ строк JSX

**Что вынести:**

| Сущность | Куда | Файл |
|----------|------|------|
| `Course` интерфейс | types/ | `types/course.ts` |
| `statusColors/Labels` | constants/ | `constants/status.ts` |
| `difficultyLabels` | constants/ | `constants/difficulty.ts` |
| API функции | services/ | `services/course.service.ts` |
| Логика списка | hooks/ | `hooks/useCourseList.ts` |
| Модальное окно | components/ | `components/modals/CourseModal.tsx` |
| Фильтры таблицы | components/ | `components/tables/TableFilters.tsx` |

**После рефакторинга:**
```typescript
// pages/admin/AdminCourses.tsx
import { DataTable } from '@/components/tables/DataTable'
import { CourseModal } from '@/components/modals/CourseModal'
import { useCourseList } from '@/hooks/useCourseList'
import { COURSE_TABLE_COLUMNS } from '@/constants/tables'

export function AdminCourses() {
  const {
    courses, loading, page, setPage, totalPages,
    filters, setFilters, openCreate, openEdit, handleDelete
  } = useCourseList()
  
  const [modalOpened, modalData, { open, close }] = useEntityModal()

  return (
    <Box>
      <Group justify="space-between" mb="lg">
        <Text size="xl" fw={700}>Курсы</Text>
        <Button leftSection={<Plus size={16} />} onClick={openCreate}>
          Создать курс
        </Button>
      </Group>

      <TableFilters
        filters={filters}
        onFilterChange={setFilters}
        config={COURSE_FILTERS_CONFIG}
      />

      <DataTable
        data={courses}
        columns={COURSE_TABLE_COLUMNS}
        loading={loading}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <Pagination value={page} onChange={setPage} total={totalPages} />

      <CourseModal
        opened={modalOpened}
        onClose={close}
        course={modalData}
        onSave={handleSave}
      />
    </Box>
  )
}
```

---

### 2.3 AdminLessons.tsx

**Аналогично AdminCourses:**
- Интерфейс `Lesson` → `types/lesson.ts`
- `typeLabels` → `constants/lessonTypes.ts`
- API → `services/lesson.service.ts`
- Хук → `hooks/useLessonList.ts`

---

### 2.4 AdminTags.tsx

**Что вынести:**

| Сущность | Куда | Файл |
|----------|------|------|
| `Tag` интерфейс | types/ | `types/tag.ts` |
| API функции | services/ | `services/tag.service.ts` |
| Логика CRUD | hooks/ | `hooks/useTagList.ts` |
| ColorInput с превью | components/ | `components/forms/ColorPicker.tsx` |

---

### 2.5 AdminUsers.tsx

**Что вынести:**

| Сущность | Куда | Файл |
|----------|------|------|
| `User` интерфейс | types/ | `types/user.ts` |
| `roleColors/Labels` | constants/ | `constants/roles.ts` |
| API функции | services/ | `services/user.service.ts` |
| Строка таблицы с аватаром | components/ | `components/tables/UserTableRow.tsx` |

---

### 2.6 AdminModeration.tsx

**Что вынести:**

| Сущность | Куда | Файл |
|----------|------|------|
| `Comment` интерфейс | types/ | `types/comment.ts` |
| `ContentItem` интерфейс | types/ | `types/moderation.ts` |
| `statusColors/Labels` | constants/ | `constants/status.ts` |
| API функции | services/ | `services/moderation.service.ts` |
| Логика модерации | hooks/ | `hooks/useModeration.ts` |
| `CommentCard` | components/ | `components/cards/CommentCard.tsx` |
| `RejectionModal` | components/ | `components/modals/RejectionModal.tsx` |

---

### 2.7 AdminApplications.tsx

**Что вынести:**

| Сущность | Куда | Файл |
|----------|------|------|
| `Application` интерфейс | types/ | `types/application.ts` |
| API функции | services/ | `services/application.service.ts` |
| Хук | hooks/ | `hooks/useApplications.ts` |
| `ApplicationModal` | components/ | `components/modals/ApplicationModal.tsx` |
| `getStatusBadge` | components/ | `components/common/StatusBadge.tsx` |

---

### 2.8 LoginPage.tsx & RegisterPage.tsx

**Что вынести:**

| Сущность | Куда | Файл |
|----------|------|------|
| API функции | services/ | `services/auth.service.ts` |
| Хук авторизации | hooks/ | `hooks/useAuthForm.ts` |
| `PasswordStrengthIndicator` | components/ | `components/auth/PasswordStrength.tsx` |
| `AuthLayout` (Paper с формой) | components/ | `components/auth/AuthFormContainer.tsx` |

---

### 2.9 ProfileSettingsPage.tsx

**Что вынести:**

| Сущность | Куда | Файл |
|----------|------|------|
| API функции | services/ | `services/user.service.ts` |
| Хук настроек | hooks/ | `hooks/useProfileSettings.ts` |
| `AvatarUploader` | components/ | `components/profile/AvatarUploader.tsx` |
| `PasswordChangeForm` | components/ | `components/profile/PasswordChangeForm.tsx` |

---

### 2.10 ProfilePage.tsx

**Что вынести:**

| Сущность | Куда | Файл |
|----------|------|------|
| `Profile` интерфейс | types/ | `types/user.ts` |
| API функции | services/ | `services/user.service.ts` |
| Хук профиля | hooks/ | `hooks/usePublicProfile.ts` |
| `ProfileHeader` | components/ | `components/profile/ProfileHeader.tsx` |
| `ProfileStats` | components/ | `components/profile/ProfileStats.tsx` |

---

## 3. Общие компоненты для создания

### 3.1 StatusBadge (переиспользуется в 5+ местах)

```typescript
// components/common/StatusBadge.tsx
import { Badge } from '@mantine/core'
import { STATUS_CONFIG } from '@/constants/status'

interface StatusBadgeProps {
  status: string
  type?: 'content' | 'comment' | 'application'
  size?: 'sm' | 'md' | 'lg'
}

export function StatusBadge({ status, type = 'content', size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[type]?.[status] || { color: 'gray', label: status }
  
  return (
    <Badge color={config.color} size={size} variant="light">
      {config.label}
    </Badge>
  )
}
```

### 3.2 DataTable (переиспользуется во всех админ-таблицах)

```typescript
// components/tables/DataTable.tsx
import { Table, Card, Skeleton, Alert, Stack } from '@mantine/core'
import { LoadingState } from '@/components/common/LoadingState'
import { EmptyState } from '@/components/common/EmptyState'

interface Column<T> {
  key: keyof T | string
  label: string
  render?: (item: T) => React.ReactNode
  width?: string | number
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (item: T) => void
  actions?: (item: T) => React.ReactNode
}

export function DataTable<T extends { id: string }>({
  data, columns, loading, emptyMessage = 'Нет данных', actions
}: DataTableProps<T>) {
  if (loading) {
    return <LoadingState rows={5} />
  }
  
  if (data.length === 0) {
    return <EmptyState message={emptyMessage} />
  }
  
  return (
    <Card shadow="xs" padding={0} radius="md" withBorder>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            {columns.map(col => (
              <Table.Th key={String(col.key)} style={{ width: col.width }}>
                {col.label}
              </Table.Th>
            ))}
            {actions && <Table.Th></Table.Th>}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map(item => (
            <Table.Tr key={item.id}>
              {columns.map(col => (
                <Table.Td key={String(col.key)}>
                  {col.render ? col.render(item) : String(item[col.key as keyof T] ?? '')}
                </Table.Td>
              ))}
              {actions && <Table.Td>{actions(item)}</Table.Td>}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  )
}
```

### 3.3 TableFilters (переиспользуется во всех списках)

```typescript
// components/tables/TableFilters.tsx
import { Group, TextInput, Select } from '@mantine/core'
import { Search } from 'lucide-react'

interface FilterConfig {
  key: string
  type: 'search' | 'select'
  placeholder?: string
  options?: { value: string; label: string }[]
}

interface TableFiltersProps {
  filters: Record<string, string>
  onFilterChange: (filters: Record<string, string>) => void
  config: FilterConfig[]
}

export function TableFilters({ filters, onFilterChange, config }: TableFiltersProps) {
  return (
    <Card shadow="xs" padding="md" radius="md" withBorder mb="lg">
      <Group>
        {config.map(filter => {
          if (filter.type === 'search') {
            return (
              <TextInput
                key={filter.key}
                placeholder={filter.placeholder || 'Поиск...'}
                leftSection={<Search size={16} />}
                value={filters[filter.key] || ''}
                onChange={(e) => onFilterChange({ ...filters, [filter.key]: e.target.value })}
                style={{ flex: 1 }}
              />
            )
          }
          
          if (filter.type === 'select') {
            return (
              <Select
                key={filter.key}
                placeholder={filter.placeholder}
                data={filter.options || []}
                value={filters[filter.key] || null}
                onChange={(v) => onFilterChange({ ...filters, [filter.key]: v || '' })}
                clearable
                w={180}
              />
            )
          }
          
          return null
        })}
      </Group>
    </Card>
  )
}
```

### 3.4 ConfirmDialog (переиспользуется для удаления)

```typescript
// components/common/ConfirmDialog.tsx
import { Modal, Button, Group, Text } from '@mantine/core'
import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  opened: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  color?: string
  loading?: boolean
}

export function ConfirmDialog({
  opened, onClose, onConfirm, title, message,
  confirmLabel = 'Подтвердить', cancelLabel = 'Отмена',
  color = 'red', loading
}: ConfirmDialogProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} centered>
      <Text mb="md">{message}</Text>
      <Group justify="flex-end">
        <Button variant="subtle" onClick={onClose}>{cancelLabel}</Button>
        <Button color={color} onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </Group>
    </Modal>
  )
}
```

### 3.5 LoadingState & EmptyState

```typescript
// components/common/LoadingState.tsx
import { Skeleton, Stack } from '@mantine/core'

interface LoadingStateProps {
  rows?: number
  height?: number
}

export function LoadingState({ rows = 5, height = 60 }: LoadingStateProps) {
  return (
    <Stack gap="sm">
      {[...Array(rows)].map((_, i) => (
        <Skeleton key={i} height={height} radius="md" />
      ))}
    </Stack>
  )
}
```

```typescript
// components/common/EmptyState.tsx
import { Text, Center, Box } from '@mantine/core'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  message: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export function EmptyState({ message, icon, action }: EmptyStateProps) {
  return (
    <Center py="xl">
      <Box ta="center">
        {icon || <Inbox size={48} style={{ opacity: 0.3 }} />}
        <Text c="dimmed" mt="md">{message}</Text>
        {action && <Box mt="md">{action}</Box>}
      </Box>
    </Center>
  )
}
```

---

## 4. Константы для создания

### 4.1 constants/status.ts

```typescript
// Статусы контента
export const CONTENT_STATUS = {
  DRAFT: { color: 'gray', label: 'Черновик' },
  PENDING_REVIEW: { color: 'yellow', label: 'На модерации' },
  PUBLISHED: { color: 'green', label: 'Опубликован' },
  ARCHIVED: { color: 'blue', label: 'В архиве' },
  DELETED: { color: 'red', label: 'Удалён' },
} as const

// Статусы комментариев
export const COMMENT_STATUS = {
  PENDING: { color: 'yellow', label: 'На модерации' },
  APPROVED: { color: 'green', label: 'Одобрен' },
  REJECTED: { color: 'red', label: 'Отклонён' },
} as const

// Статусы заявок
export const APPLICATION_STATUS = {
  PENDING: { color: 'yellow', label: 'На рассмотрении' },
  APPROVED: { color: 'green', label: 'Одобрено' },
  REJECTED: { color: 'red', label: 'Отклонено' },
} as const

// Единый конфиг для StatusBadge
export const STATUS_CONFIG = {
  content: CONTENT_STATUS,
  comment: COMMENT_STATUS,
  application: APPLICATION_STATUS,
} as const
```

### 4.2 constants/roles.ts

```typescript
export const ROLES = {
  USER: { color: 'gray', label: 'Пользователь' },
  AUTHOR: { color: 'blue', label: 'Автор' },
  MODERATOR: { color: 'yellow', label: 'Модератор' },
  ADMIN: { color: 'red', label: 'Администратор' },
} as const

export const ROLE_OPTIONS = Object.entries(ROLES).map(([value, { label }]) => ({
  value,
  label,
}))
```

### 4.3 constants/difficulty.ts

```typescript
export const DIFFICULTY_LEVELS = {
  BEGINNER: { color: 'green', label: 'Начинающий' },
  INTERMEDIATE: { color: 'yellow', label: 'Средний' },
  ADVANCED: { color: 'red', label: 'Продвинутый' },
} as const

export const DIFFICULTY_OPTIONS = Object.entries(DIFFICULTY_LEVELS).map(([value, { label }]) => ({
  value,
  label,
}))
```

### 4.4 constants/lessonTypes.ts

```typescript
export const LESSON_TYPES = {
  ARTICLE: { icon: 'FileText', label: 'Статья' },
  VIDEO: { icon: 'Video', label: 'Видео' },
  AUDIO: { icon: 'Headphones', label: 'Аудио' },
  QUIZ: { icon: 'HelpCircle', label: 'Тест' },
  CALCULATOR: { icon: 'Calculator', label: 'Калькулятор' },
} as const

export const LESSON_TYPE_OPTIONS = Object.entries(LESSON_TYPES).map(([value, { label }]) => ({
  value,
  label,
}))
```

---

## 5. Сервисы для создания

### 5.1 services/api.ts (базовый)

```typescript
// services/api.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
})

// Interceptor для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login or dispatch logout action
    }
    return Promise.reject(error)
  }
)

// Типы для API ответов
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Хелпер для пагинации
export function getPaginationParams(page: number, limit: number = 10): URLSearchParams {
  const params = new URLSearchParams()
  params.append('page', String(page))
  params.append('limit', String(limit))
  return params
}
```

### 5.2 services/course.service.ts

```typescript
// services/course.service.ts
import { api, type PaginatedResponse } from './api'
import type { Course, CourseInput } from '@/types/course'

export const CourseService = {
  getAll: (params?: Record<string, string>) => 
    api.get<PaginatedResponse<Course>>('/courses', { params }),
  
  getBySlug: (slug: string) => 
    api.get<Course>(`/courses/${slug}`),
  
  create: (data: CourseInput) => 
    api.post<Course>('/admin/courses', data),
  
  update: (id: string, data: Partial<CourseInput>) => 
    api.patch<Course>(`/admin/courses/${id}`, data),
  
  delete: (id: string) => 
    api.delete(`/admin/courses/${id}`),
}
```

---

## 6. Хуки для создания

### 6.1 hooks/usePagination.ts

```typescript
// hooks/usePagination.ts
import { useState, useCallback } from 'react'

interface UsePaginationOptions {
  initialPage?: number
  pageSize?: number
}

export function usePagination({ initialPage = 1, pageSize = 10 }: UsePaginationOptions = {}) {
  const [page, setPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(1)
  
  const nextPage = useCallback(() => {
    setPage(p => Math.min(p + 1, totalPages))
  }, [totalPages])
  
  const prevPage = useCallback(() => {
    setPage(p => Math.max(p - 1, 1))
  }, [])
  
  const goToPage = useCallback((p: number) => {
    setPage(Math.max(1, Math.min(p, totalPages)))
  }, [totalPages])
  
  return {
    page,
    setPage,
    totalPages,
    setTotalPages,
    nextPage,
    prevPage,
    goToPage,
    offset: (page - 1) * pageSize,
    limit: pageSize,
  }
}
```

### 6.2 hooks/useTable.ts

```typescript
// hooks/useTable.ts
import { useState, useEffect, useCallback } from 'react'
import { usePagination } from './usePagination'

interface UseTableOptions<T, F = Record<string, string>> {
  fetchFn: (params: { page: number; limit: number; filters: F }) => Promise<{
    items: T[]
    pagination: { totalPages: number }
  }>
  initialFilters?: F
  pageSize?: number
}

export function useTable<T, F = Record<string, string>>({
  fetchFn, initialFilters, pageSize = 10
}: UseTableOptions<T, F>) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<F>(initialFilters || {} as F)
  
  const { page, setPage, totalPages, setTotalPages } = usePagination({ pageSize })
  
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await fetchFn({ page, limit: pageSize, filters })
      setData(result.items)
      setTotalPages(result.pagination.totalPages)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [fetchFn, page, pageSize, filters, setTotalPages])
  
  useEffect(() => {
    fetchData()
  }, [fetchData])
  
  const updateFilters = useCallback((newFilters: Partial<F>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setPage(1) // Сброс на первую страницу при изменении фильтров
  }, [setPage])
  
  return {
    data,
    loading,
    page,
    setPage,
    totalPages,
    filters,
    setFilters: updateFilters,
    refresh: fetchData,
  }
}
```

### 6.3 hooks/useConfirm.ts

```typescript
// hooks/useConfirm.ts
import { useState, useCallback } from 'react'

interface UseConfirmOptions {
  onConfirm: () => Promise<void> | void
  message?: string
  title?: string
}

export function useConfirm({ onConfirm, message, title }: UseConfirmOptions) {
  const [opened, setOpened] = useState(false)
  const [loading, setLoading] = useState(false)
  const [itemId, setItemId] = useState<string | null>(null)
  
  const open = useCallback((id: string) => {
    setItemId(id)
    setOpened(true)
  }, [])
  
  const close = useCallback(() => {
    setOpened(false)
    setItemId(null)
  }, [])
  
  const confirm = useCallback(async () => {
    setLoading(true)
    try {
      await onConfirm()
      close()
    } finally {
      setLoading(false)
    }
  }, [onConfirm, close])
  
  return {
    opened,
    loading,
    itemId,
    open,
    close,
    confirm,
    message,
    title,
  }
}
```

---

## 7. Приоритет реализации

### Фаза 1: Базовая инфраструктура ✅ ВЫПОЛНЕНО
1. ✅ `types/` — все интерфейсы созданы
2. ✅ `constants/status.ts`, `constants/roles.ts`, `constants/difficulty.ts`, `constants/lessonTypes.ts`
3. ✅ `services/api.ts` — базовый сервис

### Фаза 2: Общие компоненты ✅ ВЫПОЛНЕНО
1. ✅ `components/common/StatusBadge.tsx`
2. ✅ `components/common/LoadingState.tsx`
3. ✅ `components/common/EmptyState.tsx`
4. ✅ `components/common/ConfirmDialog.tsx`
5. ✅ `components/common/ErrorState.tsx`
6. ✅ `components/common/ColorIndicator.tsx`

### Фаза 3: Таблицы ✅ ВЫПОЛНЕНО
1. ✅ `components/tables/DataTable.tsx`
2. ✅ `components/tables/TableFilters.tsx`
3. ✅ `hooks/useTable.ts`
4. ✅ `hooks/usePagination.ts`
5. ✅ `hooks/useConfirm.ts`
6. ✅ `hooks/useNotification.ts`

### Фаза 4: Рефакторинг страниц ✅ ЗАВЕРШЕНО
1. ✅ AdminDashboard — StatCard создан
2. ✅ AdminCourses — CourseModal, useCourseList, StatusBadge, ConfirmDialog
3. ✅ AdminLessons — LessonModal, useLessonList, StatusBadge, ConfirmDialog
4. ✅ AdminTags — TagModal, useTagList, ColorIndicator, ConfirmDialog
5. ✅ AdminUsers — UserModal, useUserList, RoleBadge, ConfirmDialog
6. 🔲 AdminModeration — требует отдельного подхода (модерация контента)
7. 🔲 AdminApplications — требует отдельного подхода (заявки авторов)

**Примечание:** AdminModeration и AdminApplications имеют специфическую логику, 
которая не подходит под стандартный паттерн CRUD. Рефакторинг этих страниц 
будет выполнен отдельно с учётом их особенностей.

### Фаза 5: Остальные страницы ✅
1. 🔲 LoginPage / RegisterPage
2. ✅ ProfileSettingsPage — AvatarUploader, ProtectedRoute
3. 🔲 BecomeAuthorPage

### Фаза 6: Защита роутов ✅
1. ✅ `components/auth/ProtectedRoute.tsx`
2. ✅ Интеграция в App.tsx
3. ✅ Проверка ролей для админ-панели

### Фаза 7: Загрузка аватара ✅
1. ✅ `hooks/useAvatarUpload.ts`
2. ✅ `components/common/AvatarUploader.tsx`
3. ✅ `server/routes/user.routes.ts` — POST/DELETE /user/avatar

---

## 8. Пример полного рефакторинга одной страницы

### До: AdminTags.tsx (130 строк)

```typescript
// Весь код в одном файле
// Интерфейсы, API, состояние, JSX — всё смешано
```

### После: AdminTags.tsx (40 строк)

```typescript
// src/pages/admin/AdminTags.tsx
import { Box, Button, Group, Text } from '@mantine/core'
import { Plus } from 'lucide-react'
import { DataTable } from '@/components/tables/DataTable'
import { TagModal } from '@/components/modals/TagModal'
import { useTagList } from '@/hooks/useTagList'
import { TAG_TABLE_COLUMNS } from '@/constants/tables'

export function AdminTags() {
  const {
    tags, loading, modalOpened, editingTag,
    openCreate, openEdit, handleSave, handleDelete, closeModal
  } = useTagList()

  return (
    <Box>
      <Group justify="space-between" mb="lg">
        <Text size="xl" fw={700}>Теги</Text>
        <Button leftSection={<Plus size={16} />} onClick={openCreate}>
          Создать тег
        </Button>
      </Group>

      <DataTable
        data={tags}
        columns={TAG_TABLE_COLUMNS}
        loading={loading}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <TagModal
        opened={modalOpened}
        onClose={closeModal}
        tag={editingTag}
        onSave={handleSave}
      />
    </Box>
  )
}
```

---

## 9. Итоги

| Метрика | До | После |
|---------|-----|-------|
| Строк в странице | 100-200 | 30-50 |
| Дублирование кода | Высокое | Минимальное |
| Переиспользование | Низкое | Высокое |
| Тестируемость | Сложно | Легко |
| Поддержка | Сложно | Легко |

**Количество новых файлов:**
- 15+ файлов типов
- 6 файлов констант
- 8 сервисов
- 6 хуков
- 15+ UI компонентов

**Общий объём работы:** ~6-8 дней
