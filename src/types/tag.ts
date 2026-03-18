// src/types/tag.ts

// === TAG ===
export interface Tag {
  id: string
  name: string
  slug: string
  color: string
  description?: string
  _count?: {
    courses: number
    lessons: number
  }
}

// === TAG INPUT ===
export interface TagInput {
  name: string
  slug: string
  color?: string
  description?: string
}
