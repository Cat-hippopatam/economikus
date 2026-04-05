// src/types/user.ts
import type { Role } from './auth'

// === USER ===
export interface User {
  id: string
  email: string
  nickname: string
  displayName: string
  firstName?: string
  lastName?: string
  role: Role
  avatarUrl?: string | null
  bio?: string | null
  createdAt?: string
  profile?: Profile
  _count?: {
    courses: number
    lessons: number
  }
}

// === PROFILE ===
export interface Profile {
  id: string
  nickname: string
  displayName: string
  avatarUrl: string | null
  bio?: string | null
  website?: string | null
  telegram?: string | null
  youtube?: string | null
  coverImage?: string | null
  totalViews?: number
  subscribers?: number
  createdAt?: string
  user?: {
    id: string
    role: Role
  }
  _count?: {
    courses: number
    lessons: number
    certificates: number
  }
}

// === PROFILE INPUT ===
export interface ProfileInput {
  displayName?: string
  bio?: string
  website?: string
  telegram?: string
  youtube?: string
}

// === USER INPUT (для админки) ===
export interface UserInput {
  displayName?: string
  bio?: string
  role?: 'USER' | 'AUTHOR' | 'ADMIN' | 'MODERATOR'
}

// === PASSWORD CHANGE ===
export interface PasswordChangeInput {
  currentPassword: string
  newPassword: string
}

// === USER WITH STATS (для админки) ===
export interface UserWithStats extends User {
  avatarUrl?: string | null
  bio?: string | null
  createdAt: string
  _count?: {
    courses: number
    lessons: number
  }
}
