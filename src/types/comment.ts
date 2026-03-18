// src/types/comment.ts
import type { Profile } from './user'

// === COMMENT ===
export interface Comment {
  id: string
  text: string
  status: CommentStatus
  createdAt: string
  author: Profile
  commentableType: 'COURSE' | 'LESSON'
  commentableId: string
  course?: { id: string; title: string }
  lesson?: { id: string; title: string }
}

// === COMMENT INPUT ===
export interface CommentInput {
  text: string
  commentableType: 'COURSE' | 'LESSON'
  commentableId: string
}

// === COMMENT STATUS ===
export type CommentStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
