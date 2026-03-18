// src/constants/roles.ts
/**
 * Конфигурация ролей пользователей
 */

export const ROLES = {
  USER: { color: 'gray', label: 'Пользователь', description: 'Обычный пользователь платформы' },
  AUTHOR: { color: 'blue', label: 'Автор', description: 'Может создавать курсы и уроки' },
  MODERATOR: { color: 'yellow', label: 'Модератор', description: 'Модерация контента и комментариев' },
  ADMIN: { color: 'red', label: 'Администратор', description: 'Полный доступ к системе' },
} as const

export type RoleKey = keyof typeof ROLES

// Массив для Select
export const ROLE_OPTIONS = Object.entries(ROLES).map(([value, { label }]) => ({
  value,
  label,
}))

// Роли с доступом к админ-панели
export const ADMIN_ROLES = ['ADMIN', 'MODERATOR'] as const

// Роли с доступом к созданию контента
export const AUTHOR_ROLES = ['ADMIN', 'MODERATOR', 'AUTHOR'] as const

// Цвета для RoleBadge
export const ROLE_COLORS: Record<RoleKey, string> = {
  USER: 'gray',
  AUTHOR: 'blue',
  MODERATOR: 'yellow',
  ADMIN: 'red',
}

// Метки для отображения
export const ROLE_LABELS: Record<RoleKey, string> = {
  USER: 'Пользователь',
  AUTHOR: 'Автор',
  MODERATOR: 'Модератор',
  ADMIN: 'Администратор',
}
