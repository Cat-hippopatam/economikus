// src/constants/difficulty.ts
/**
 * Конфигурация уровней сложности
 */

export const DIFFICULTY_LEVELS = {
  BEGINNER: { color: 'green', label: 'Начинающий', description: 'Для тех, кто только начинает' },
  INTERMEDIATE: { color: 'yellow', label: 'Средний', description: 'Базовые знания уже есть' },
  ADVANCED: { color: 'red', label: 'Продвинутый', description: 'Требуется опыт и знания' },
} as const

// Алиас для обратной совместимости
export const DIFFICULTY_CONFIG = DIFFICULTY_LEVELS

export type DifficultyKey = keyof typeof DIFFICULTY_LEVELS

// Массив для Select
export const DIFFICULTY_OPTIONS = Object.entries(DIFFICULTY_LEVELS).map(
  ([value, { label }]) => ({ value, label })
)

// Цвета для сложности (для использования вне Badge)
export const DIFFICULTY_COLORS: Record<DifficultyKey, string> = {
  BEGINNER: '#40c057',
  INTERMEDIATE: '#fab005',
  ADVANCED: '#fa5252',
}

// Метки для отображения
export const DIFFICULTY_LABELS: Record<DifficultyKey, string> = {
  BEGINNER: 'Начинающий',
  INTERMEDIATE: 'Средний',
  ADVANCED: 'Продвинутый',
}
