// src/hooks/useAuthorLessons.ts
/**
 * Хук для управления уроками автора
 */

import { useState, useCallback, useEffect } from 'react'
import { useNotification } from '@/hooks'
import { api } from '@/services'
import type { PaginatedResponse } from '@/types'

export interface AuthorLesson {
  id: string
  title: string
  slug: string
  description: string | null
  lessonType: string
  status: string
  isPremium: boolean
  duration: number | null
  viewsCount: number
  createdAt: string
  publishedAt: string | null
  module: {
    id: string
    title: string
    course: {
      id: string
      title: string
    }
  } | null
  tags: Array<{ id: string; name: string; slug: string; color: string | null }>
}

interface UseAuthorLessonsReturn {
  lessons: AuthorLesson[]
  loading: boolean
  page: number
  setPage: (page: number) => void
  totalPages: number
  search: string
  setSearch: (search: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  typeFilter: string
  setTypeFilter: (type: string) => void
  refresh: () => Promise<void>
  deleteLesson: (id: string) => Promise<void>
}

export function useAuthorLessons(): UseAuthorLessonsReturn {
  const [lessons, setLessons] = useState<AuthorLesson[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const { showError, showSuccess } = useNotification()

  const fetchLessons = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string | number> = { page, limit: 10 }
      if (search) params.search = search
      if (statusFilter) params.status = statusFilter
      if (typeFilter) params.lessonType = typeFilter

      const data = await api.get<PaginatedResponse<AuthorLesson>>('/author/lessons', params)
      setLessons(data.items)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      showError('Ошибка загрузки уроков')
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter, typeFilter, showError])

  useEffect(() => {
    fetchLessons()
  }, [fetchLessons])

  const deleteLesson = useCallback(async (id: string) => {
    try {
      await api.delete(`/author/lessons/${id}`)
      showSuccess('Урок удалён')
      fetchLessons()
    } catch (error) {
      showError('Ошибка удаления урока')
    }
  }, [fetchLessons, showError, showSuccess])

  return {
    lessons,
    loading,
    page,
    setPage,
    totalPages,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    refresh: fetchLessons,
    deleteLesson,
  }
}
