// server/types.ts
import { ContentStatus, DifficultyLevel, LessonType, ReactionableType, ReactionType, CommentableType } from '@prisma/client'

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
