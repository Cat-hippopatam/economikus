// src/constants/index.ts
/**
 * Экспорт всех констант
 * Примечание: некоторые константы дублируются между файлами для обратной совместимости
 */

export * from './navigation'
export * from './config'
export * from './enums'

// Новые константы (могут конфликтовать с enums.ts, поэтому экспортируем под псевдонимами)
export { CONTENT_STATUS as CONTENT_STATUS_V2, COMMENT_STATUS, APPLICATION_STATUS, STATUS_CONFIG } from './status'
export { ROLES as ROLES_V2, ROLE_OPTIONS, ADMIN_ROLES, AUTHOR_ROLES, ROLE_COLORS, ROLE_LABELS } from './roles'
export { DIFFICULTY_LEVELS as DIFFICULTY_LEVELS_V2, DIFFICULTY_OPTIONS, DIFFICULTY_COLORS, DIFFICULTY_LABELS } from './difficulty'
export { LESSON_TYPES as LESSON_TYPES_V2, LESSON_TYPE_OPTIONS, LESSON_TYPE_ICONS, LESSON_TYPE_LABELS } from './lessonTypes'
export { COURSE_STATUSES } from './author'

// Универсальные мапы для цветов и меток
export { STATUS_COLORS, STATUS_LABELS } from './status'
