// src/hooks/useAuthorCourses.ts
/**
 * Хук для управления курсами автора
 * Использует принципы из OPTIMIZATION_GUIDE:
 * - Единая точка изменения: использует api сервис
 * - Переиспользуемые компоненты: useNotification
 */

import { useState, useCallback, useEffect } from 'react'
import { useNotification } from '@/hooks'
import { api } from '@/services'
import type { PaginatedResponse } from '@/types'

export interface AuthorCourse {
  id: string
  title: string
  slug: string
  description: string | null
  coverImage: string | null
  status: string
  difficultyLevel: string | null
  isPremium: boolean
  lessonsCount: number
  modulesCount: number
  viewsCount: number
  createdAt: string
  publishedAt: string | null
  tags: Array<{ id: string; name: string; slug: string; color: string | null }>
}

interface UseAuthorCoursesReturn {
  courses: AuthorCourse[]
  loading: boolean
  page: number
  setPage: (page: number) => void
  totalPages: number
  search: string
  setSearch: (search: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  refresh: () => Promise<void>
  deleteCourse: (id: string) => Promise<void>
}

export function useAuthorCourses(): UseAuthorCoursesReturn {
  const [courses, setCourses] = useState<AuthorCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const { showError, showSuccess } = useNotification()

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string | number> = { page, limit: 10 }
      if (search) params.search = search
      if (statusFilter) params.status = statusFilter

      const data = await api.get<PaginatedResponse<AuthorCourse>>('/author/courses', params)
      setCourses(data.items)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      showError('Ошибка загрузки курсов')
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter, showError])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const deleteCourse = useCallback(async (id: string) => {
    try {
      await api.delete(`/author/courses/${id}`)
      showSuccess('Курс удалён')
      // Удаляем из локального состояния
      setCourses(prev => prev.filter(c => c.id !== id))
    } catch (error) {
      showError('Ошибка удаления курса')
    }
  }, [showError, showSuccess])

  return {
    courses,
    loading,
    page,
    setPage,
    totalPages,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    refresh: fetchCourses,
    deleteCourse,
  }
}
