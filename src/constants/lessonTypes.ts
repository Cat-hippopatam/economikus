// src/constants/lessonTypes.ts
/**
 * Конфигурация типов уроков
 */

import { FileText, Video, Headphones, HelpCircle, Calculator } from 'lucide-react'

export const LESSON_TYPES = {
  ARTICLE: { icon: FileText, label: 'Статья', description: 'Текстовый контент' },
  VIDEO: { icon: Video, label: 'Видео', description: 'Видео урок' },
  AUDIO: { icon: Headphones, label: 'Аудио', description: 'Аудио урок' },
  QUIZ: { icon: HelpCircle, label: 'Тест', description: 'Тестирование знаний' },
  CALCULATOR: { icon: Calculator, label: 'Калькулятор', description: 'Интерактивный калькулятор' },
} as const

export type LessonTypeKey = keyof typeof LESSON_TYPES

// Массив для Select
export const LESSON_TYPE_OPTIONS = Object.entries(LESSON_TYPES).map(
  ([value, { label }]) => ({ value, label })
)

// Иконки для отображения
export const LESSON_TYPE_ICONS = {
  ARTICLE: '📄',
  VIDEO: '🎬',
  AUDIO: '🎧',
  QUIZ: '❓',
  CALCULATOR: '🧮',
} as const

// Метки для отображения
export const LESSON_TYPE_LABELS: Record<LessonTypeKey, string> = {
  ARTICLE: 'Статья',
  VIDEO: 'Видео',
  AUDIO: 'Аудио',
  QUIZ: 'Тест',
  CALCULATOR: 'Калькулятор',
}
