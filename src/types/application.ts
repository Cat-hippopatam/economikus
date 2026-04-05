// src/types/application.ts
import type { Profile } from './user'

// === APPLICATION ===
export interface Application {
  id: string
  status: ApplicationStatus
  motivation: string
  experience: string | null
  portfolioUrl: string | null
  rejectionReason: string | null
  createdAt: string
  reviewedAt: string | null
  profile: Profile
  reviewer: Profile | null
}

// === APPLICATION INPUT ===
export interface ApplicationInput {
  motivation: string
  experience?: string
  portfolioUrl?: string
}

// === APPLICATION STATUS ===
export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
