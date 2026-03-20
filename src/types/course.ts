// src/types/course.ts
import type { Profile } from './user'
import type { Tag } from './tag'

// === COURSE ===
export interface Course {
  id: string
  title: string
  slug: string
  description?: string
  coverImage?: string
  duration?: number
  status: ContentStatus
  difficultyLevel: DifficultyLevel
  isPremium: boolean
  viewsCount: number
  modulesCount: number
  lessonsCount: number
  author?: Profile
  authorProfileId?: string
  tags: Tag[]
  modules?: Module[]
  createdAt?: string
  updatedAt?: string
  _count?: {
    modules: number
    progress: number
    lessons: number
  }
}

// === COURSE INPUT ===
export interface CourseInput {
  title: string
  slug: string
  description?: string
  coverImage?: string
  difficultyLevel: DifficultyLevel
  duration?: number
  isPremium?: boolean
  status?: ContentStatus
  tagIds?: string[]
}

// === LESSON (minimal for module) ===
export interface LessonInModule {
  id: string
  title: string
  slug: string
  lessonType: LessonType
  duration?: number
  isPremium?: boolean
  sortOrder?: number
  status?: ContentStatus
}

// === MODULE ===
export interface Module {
  id: string
  title: string
  slug?: string
  description?: string
  sortOrder?: number
  order?: number
  courseId?: string
  lessonsCount: number
  duration?: number
  isPublished?: boolean
  lessons?: LessonInModule[]
  createdAt?: string
  _count?: {
    lessons: number
  }
}

// === MODULE INPUT ===
export interface ModuleInput {
  title: string
  slug: string
  description?: string
  order?: number
}

// === COURSE PROGRESS ===
export interface CourseProgress {
  id: string
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
  progressPercent: number
  completedLessons: number
  totalLessons: number
  lastViewedAt: string
  course: Course
}

// === ENUMS ===
export type ContentStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED'
export type DifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
export type LessonType = 'ARTICLE' | 'VIDEO' | 'AUDIO' | 'QUIZ' | 'CALCULATOR'
