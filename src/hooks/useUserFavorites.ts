// src/hooks/useUserFavorites.ts
import { useState, useEffect, useCallback } from 'react'
import { APP_CONFIG } from '../constants'

export interface FavoriteLesson {
  id: string
  note: string | null
  collection: string | null
  createdAt: string
  lesson: {
    id: string
    title: string
    slug: string
    coverImage: string | null
    duration: number | null
    lessonType: string
    module: {
      course: {
        slug: string
      }
    }
  }
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface UseUserFavoritesResponse {
  items: FavoriteLesson[]
  loading: boolean
  error: string | null
  pagination: Pagination
  fetchFavorites: () => Promise<void>
  addFavorite: (lessonId: string, note?: string, collection?: string) => Promise<void>
  removeFavorite: (id: string) => Promise<void>
}

export function useUserFavorites(): UseUserFavoritesResponse {
  const [items, setItems] = useState<FavoriteLesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })

  const fetchFavorites = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(
        `${APP_CONFIG.apiUrl}/user/favorites?page=1&limit=20`,
        { credentials: 'include' }
      )

      if (!response.ok) {
        throw new Error('Не удалось загрузить избранное')
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

  const addFavorite = useCallback(async (lessonId: string, note?: string, collection?: string) => {
    try {
      const response = await fetch(`${APP_CONFIG.apiUrl}/user/favorites`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, note, collection })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Не удалось добавить в избранное')
      }

      await fetchFavorites()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка добавления')
      throw err
    }
  }, [fetchFavorites])

  const removeFavorite = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${APP_CONFIG.apiUrl}/user/favorites/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Не удалось удалить из избранного')
      }

      setItems(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления')
      throw err
    }
  }, [])

  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  return {
    items,
    loading,
    error,
    pagination,
    fetchFavorites,
    addFavorite,
    removeFavorite
  }
}
