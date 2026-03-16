// src/constants/enums.ts
/**
 * Enums и справочники для UI
 * Копии Prisma enums для использования на фронтенде
 */

// Роли пользователей
export const ROLES = {
  USER: { value: 'USER', label: 'Пользователь', color: 'gray' },
  AUTHOR: { value: 'AUTHOR', label: 'Автор', color: 'blue' },
  MODERATOR: { value: 'MODERATOR', label: 'Модератор', color: 'yellow' },
  ADMIN: { value: 'ADMIN', label: 'Администратор', color: 'red' },
} as const

// Статусы контента
export const CONTENT_STATUS = {
  DRAFT: { value: 'DRAFT', label: 'Черновик', color: 'gray' },
  PENDING_REVIEW: { value: 'PENDING_REVIEW', label: 'На модерации', color: 'yellow' },
  PUBLISHED: { value: 'PUBLISHED', label: 'Опубликован', color: 'green' },
  ARCHIVED: { value: 'ARCHIVED', label: 'В архиве', color: 'blue' },
  DELETED: { value: 'DELETED', label: 'Удалён', color: 'red' },
} as const

// Уровни сложности
export const DIFFICULTY_LEVELS = {
  BEGINNER: { value: 'BEGINNER', label: 'Начинающий', color: 'green' },
  INTERMEDIATE: { value: 'INTERMEDIATE', label: 'Средний', color: 'yellow' },
  ADVANCED: { value: 'ADVANCED', label: 'Продвинутый', color: 'red' },
} as const

// Типы уроков
export const LESSON_TYPES = {
  ARTICLE: { value: 'ARTICLE', label: 'Статья', icon: 'FileText', color: 'blue' },
  VIDEO: { value: 'VIDEO', label: 'Видео', icon: 'Video', color: 'violet' },
  AUDIO: { value: 'AUDIO', label: 'Аудио', icon: 'Headphones', color: 'cyan' },
  QUIZ: { value: 'QUIZ', label: 'Тест', icon: 'HelpCircle', color: 'orange' },
  CALCULATOR: { value: 'CALCULATOR', label: 'Калькулятор', icon: 'Calculator', color: 'teal' },
} as const

// Статусы подписки
export const SUBSCRIPTION_STATUS = {
  ACTIVE: { value: 'ACTIVE', label: 'Активна', color: 'green' },
  PAST_DUE: { value: 'PAST_DUE', label: 'Просрочена', color: 'red' },
  CANCELED: { value: 'CANCELED', label: 'Отменена', color: 'gray' },
  EXPIRED: { value: 'EXPIRED', label: 'Истекла', color: 'orange' },
} as const

// Видеопровайдеры
export const VIDEO_PROVIDERS = {
  YOUTUBE: { value: 'YOUTUBE', label: 'YouTube', color: 'red' },
  RUTUBE: { value: 'RUTUBE', label: 'Rutube', color: 'blue' },
  VIMEO: { value: 'VIMEO', label: 'Vimeo', color: 'cyan' },
  LOCAL: { value: 'LOCAL', label: 'Локальный', color: 'gray' },
} as const

// Типы реакций
export const REACTION_TYPES = {
  LIKE: { value: 'LIKE', label: 'Нравится', icon: 'ThumbsUp', color: 'blue' },
  DISLIKE: { value: 'DISLIKE', label: 'Не нравится', icon: 'ThumbsDown', color: 'red' },
} as const

// Вспомогательные функции для получения списков
export const getRoleOptions = () => Object.values(ROLES).map(r => ({ value: r.value, label: r.label }))
export const getStatusOptions = () => Object.values(CONTENT_STATUS).map(s => ({ value: s.value, label: s.label }))
export const getDifficultyOptions = () => Object.values(DIFFICULTY_LEVELS).map(d => ({ value: d.value, label: d.label }))
export const getLessonTypeOptions = () => Object.values(LESSON_TYPES).map(l => ({ value: l.value, label: l.label }))

// Типы
export type Role = keyof typeof ROLES
export type ContentStatus = keyof typeof CONTENT_STATUS
export type DifficultyLevel = keyof typeof DIFFICULTY_LEVELS
export type LessonType = keyof typeof LESSON_TYPES
export type SubscriptionStatus = keyof typeof SUBSCRIPTION_STATUS
