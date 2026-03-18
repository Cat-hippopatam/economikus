// src/types/lesson.ts
import type { Tag } from './tag'
import type { ContentStatus } from './course'

// === LESSON ===
export interface Lesson {
  id: string
  title: string
  slug: string
  description?: string
  lessonType: LessonType
  status: ContentStatus
  isPremium: boolean
  duration: number
  moduleId?: string
  module?: {
    id: string
    title: string
    course: {
      id: string
      title: string
    }
  } | null
  tags: Tag[]
  createdAt?: string
  viewsCount?: number
}

// === LESSON INPUT ===
export interface LessonInput {
  title: string
  slug: string
  description?: string
  lessonType: LessonType
  duration?: number
  isPremium?: boolean
  status?: ContentStatus
  moduleId?: string
  tagIds?: string[]
}

// === LESSON PROGRESS ===
export interface LessonProgress {
  id: string
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
  watchedSeconds: number
  completedAt?: string
  lesson: Lesson
}

// === LESSON TYPE ===
export type LessonType = 'ARTICLE' | 'VIDEO' | 'AUDIO' | 'QUIZ' | 'CALCULATOR'
