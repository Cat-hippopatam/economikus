// server/types.ts
// Локальные определения типов для Prisma enum (т.к. могут не экспортироваться из клиента)

// Content Status
export type ContentStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED'

// Difficulty Level
export type DifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'

// Lesson Type
export type LessonType = 'ARTICLE' | 'VIDEO' | 'AUDIO' | 'QUIZ' | 'CALCULATOR'

// Reaction
export type ReactionableType = 'COURSE' | 'LESSON' | 'COMMENT'
export type ReactionType = 'LIKE' | 'DISLIKE'

// Comment
export type CommentableType = 'COURSE' | 'LESSON'

export interface CourseWhereInput {
  deletedAt: null
  status?: ContentStatus
  difficultyLevel?: DifficultyLevel
  isPremium?: boolean
  OR?: Array<{ title?: { contains: string }; description?: { contains: string } }>
  tags?: { some: { tag: { slug: string } } }
}

export interface LessonWhereInput {
  deletedAt: null
  status?: ContentStatus
  lessonType?: LessonType
  isPremium?: boolean
  OR?: Array<{ title?: { contains: string }; description?: { contains: string } }>
  tags?: { some: { tag: { slug: string } } }
}

export interface FavoriteWhereInput {
  profileId: string
  type?: 'course' | 'lesson'
  collection?: string
}

export interface ContextWithSession {
  req: {
    header: (name: string) => string | undefined
    param: (name: string) => string
    query: (name: string) => string | undefined
    json: () => Promise<Record<string, unknown>>
  }
  json: (data: unknown, status?: number) => Response
  header: (name: string, value: string) => void
}

export interface ReactionInput {
  type: ReactionableType
  id: string
  reactionType: ReactionType
}

export interface CommentInput {
  type: CommentableType
  id: string
  text: string
}
