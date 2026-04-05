// src/constants/status.ts
/**
 * Конфигурация статусов контента
 */

// Статусы контента (курсы, уроки)
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
  PENDING: { color: 'yellow', label: 'На рассмотрении', icon: 'Clock' },
  APPROVED: { color: 'green', label: 'Одобрено', icon: 'Check' },
  REJECTED: { color: 'red', label: 'Отклонено', icon: 'X' },
} as const

// Единый конфиг для StatusBadge
export const STATUS_CONFIG = {
  content: CONTENT_STATUS,
  comment: COMMENT_STATUS,
  application: APPLICATION_STATUS,
} as const

export type StatusType = keyof typeof STATUS_CONFIG
export type ContentStatusKey = keyof typeof CONTENT_STATUS
export type CommentStatusKey = keyof typeof COMMENT_STATUS
export type ApplicationStatusKey = keyof typeof APPLICATION_STATUS

// Массивы для Select
export const CONTENT_STATUS_OPTIONS = Object.entries(CONTENT_STATUS).map(
  ([value, { label }]) => ({ value, label })
)

export const COMMENT_STATUS_OPTIONS = Object.entries(COMMENT_STATUS).map(
  ([value, { label }]) => ({ value, label })
)

export const APPLICATION_STATUS_OPTIONS = Object.entries(APPLICATION_STATUS).map(
  ([value, { label }]) => ({ value, label })
)

// Универсальные мапы для цветов и меток
export const STATUS_COLORS = {
  course: {
    DRAFT: 'gray',
    PUBLISHED: 'green',
    ARCHIVED: 'red',
    PENDING_REVIEW: 'yellow',
    DELETED: 'gray',
  },
  lesson: {
    DRAFT: 'gray',
    PUBLISHED: 'green',
    ARCHIVED: 'red',
    PENDING_REVIEW: 'yellow',
    DELETED: 'gray',
  },
  comment: {
    PENDING: 'yellow',
    APPROVED: 'green',
    REJECTED: 'red',
  },
  application: {
    PENDING: 'yellow',
    APPROVED: 'green',
    REJECTED: 'red',
  },
}

export const STATUS_LABELS = {
  course: {
    DRAFT: 'Черновик',
    PUBLISHED: 'Опубликован',
    ARCHIVED: 'Архив',
    PENDING_REVIEW: 'На модерации',
    DELETED: 'Удалён',
  },
  lesson: {
    DRAFT: 'Черновик',
    PUBLISHED: 'Опубликован',
    ARCHIVED: 'Архив',
    PENDING_REVIEW: 'На модерации',
    DELETED: 'Удалён',
  },
  comment: {
    PENDING: 'На модерации',
    APPROVED: 'Одобрен',
    REJECTED: 'Отклонён',
  },
  application: {
    PENDING: 'На рассмотрении',
    APPROVED: 'Одобрено',
    REJECTED: 'Отклонено',
  },
}
