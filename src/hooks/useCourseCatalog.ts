// src/hooks/useCourseCatalog.ts
/**
 * Хук для каталога курсов
 * Управляет фильтрами, пагинацией и загрузкой курсов
 */

import { useState, useEffect, useCallback } from 'react'
import { CourseService } from '@/services'
import type { Course } from '@/types'

interface UseCourseCatalogReturn {
  courses: Course[]
  loading: boolean
  page: number
  setPage: (page: number) => void
  totalPages: number
  total: number
  search: string
  setSearch: (search: string) => void
  difficulty: string | null
  setDifficulty: (difficulty: string | null) => void
  tag: string | null
  setTag: (tag: string | null) => void
  sort: string
  setSort: (sort: string) => void
  refresh: () => Promise<void>
}

export function useCourseCatalog(): UseCourseCatalogReturn {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState<string | null>(null)
  const [tag, setTag] = useState<string | null>(null)
  const [sort, setSort] = useState('created_at_desc')

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string | number> = {
        page,
        limit: 12,
        status: 'PUBLISHED',
        sort,
      }
      
      if (search) params.search = search
      if (difficulty) params.difficulty = difficulty
      if (tag) params.tag = tag

      const result = await CourseService.getAll(params)
      setCourses(result.items)
      setTotalPages(result.pagination.totalPages)
      setTotal(result.pagination.total)
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }, [page, search, difficulty, tag, sort])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  // Сброс страницы при изменении фильтров
  const handleSetSearch = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

  const handleSetDifficulty = useCallback((value: string | null) => {
    setDifficulty(value)
    setPage(1)
  }, [])

  const handleSetTag = useCallback((value: string | null) => {
    setTag(value)
    setPage(1)
  }, [])

  const handleSetSort = useCallback((value: string) => {
    setSort(value)
    setPage(1)
  }, [])

  return {
    courses,
    loading,
    page,
    setPage,
    totalPages,
    total,
    search,
    setSearch: handleSetSearch,
    difficulty,
    setDifficulty: handleSetDifficulty,
    tag,
    setTag: handleSetTag,
    sort,
    setSort: handleSetSort,
    refresh: fetchCourses,
  }
}
