// src/hooks/useUserProgress.ts
import { useState, useEffect, useCallback } from 'react'
import { APP_CONFIG } from '../constants'

export interface CourseProgress {
  id: string
  status: string
  progressPercent: number
  completedLessons: number
  totalLessons: number
  lastViewedAt: string
  course: {
    id: string
    title: string
    slug: string
    coverImage: string | null
    lessonsCount: number
    modulesCount: number
  }
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface UseUserProgressResponse {
  items: CourseProgress[]
  loading: boolean
  error: string | null
  pagination: Pagination
  fetchProgress: () => Promise<void>
}

export function useUserProgress(): UseUserProgressResponse {
  const [items, setItems] = useState<CourseProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })

  const fetchProgress = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(
        `${APP_CONFIG.apiUrl}/user/progress/courses?page=1&limit=20`,
        { credentials: 'include' }
      )

      if (!response.ok) {
        throw new Error('Не удалось загрузить прогресс')
      }

      const data = await response.json()
      setItems(data.items || [])
      setPagination(data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProgress()
  }, [fetchProgress])

  return {
    items,
    loading,
    error,
    pagination,
    fetchProgress
  }
}
