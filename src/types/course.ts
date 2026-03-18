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

// === MODULE ===
export interface Module {
  id: string
  title: string
  slug: string
  description?: string
  order: number
  courseId: string
  lessonsCount: number
  createdAt?: string
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
