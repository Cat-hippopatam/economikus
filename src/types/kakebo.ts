export type KakeboCategory = 'LIFE' | 'CULTURE' | 'EXTRA' | 'UNEXPECTED'

export interface KakeboEntry {
  id: string
  date: string
  category: KakeboCategory
  description: string
  amount: number
  isNecessary: boolean
}

export interface KakeboSettings {
  monthLimit: number | null
}

export interface KakeboSummary {
  totalSpent: number
  daysInMonth: number
  daysWithEntries: number
  byCategory: Record<KakeboCategory, number>
}

export interface KakeboMonthData {
  settings: KakeboSettings
  entries: KakeboEntry[]
  summary: KakeboSummary
}

export interface KakeboReflection {
  id?: string
  year: number
  month: number
  unnecessarySpent?: number
  moneyAtStart?: number
  plannedToSave?: number
  actuallySaved?: number
  improvements?: string
}
