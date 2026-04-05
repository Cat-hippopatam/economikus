// src/hooks/useUserHistory.ts
import { useState, useEffect, useCallback } from 'react'
import { APP_CONFIG } from '../constants'

export interface HistoryLesson {
  title: string
  slug: string
  lessonType: string
  module: {
    course: {
      slug: string
      title: string
    }
  }
}

export interface HistoryItem {
  id: string
  historableType: 'LESSON' | 'STANDALONE_ARTICLE'
  historableId: string
  watchedSeconds: number | null
  completed: boolean
  viewedAt: string
  lesson?: HistoryLesson | null
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface UseUserHistoryResponse {
  items: HistoryItem[]
  loading: boolean
  error: string | null
  pagination: Pagination
  fetchHistory: () => Promise<void>
}

export function useUserHistory(): UseUserHistoryResponse {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(
        `${APP_CONFIG.apiUrl}/user/history?page=1&limit=20`,
        { credentials: 'include' }
      )

      if (!response.ok) {
        throw new Error('Не удалось загрузить историю')
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
    fetchHistory()
  }, [fetchHistory])

  return {
    items,
    loading,
    error,
    pagination,
    fetchHistory
  }
}
