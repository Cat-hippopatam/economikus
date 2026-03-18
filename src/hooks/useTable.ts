// src/hooks/useTable.ts
/**
 * Хук для работы с таблицами (списки, пагинация, фильтры)
 */

import { useState, useEffect, useCallback } from 'react'
import { usePagination } from './usePagination'

interface UseTableOptions<T, F = Record<string, string>> {
  fetchFn: (params: { page: number; limit: number; filters: F }) => Promise<{
    items: T[]
    pagination: { total: number; totalPages: number }
  }>
  initialFilters?: F
  pageSize?: number
  autoFetch?: boolean
}

interface UseTableReturn<T, F> {
  data: T[]
  loading: boolean
  error: string | null
  page: number
  totalPages: number
  total: number
  filters: F
  setFilters: (filters: Partial<F>) => void
  resetFilters: () => void
  refresh: () => Promise<void>
  setPage: (page: number) => void
}

export function useTable<T extends { id: string }, F = Record<string, string>>(
  options: UseTableOptions<T, F>
): UseTableReturn<T, F> {
  const { 
    fetchFn, 
    initialFilters, 
    pageSize = 10,
    autoFetch = true 
  } = options

  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [filters, setFiltersState] = useState<F>(initialFilters || {} as F)

  const { page, totalPages, setPage, setTotalPages, reset: resetPagination } = usePagination({ pageSize })

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchFn({ page, limit: pageSize, filters })
      setData(result.items)
      setTotal(result.pagination.total)
      setTotalPages(result.pagination.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки данных')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [fetchFn, page, pageSize, filters, setTotalPages])

  useEffect(() => {
    if (autoFetch) {
      fetchData()
    }
  }, [fetchData, autoFetch])

  const setFilters = useCallback((newFilters: Partial<F>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }))
    resetPagination() // Сброс на первую страницу при изменении фильтров
  }, [resetPagination])

  const resetFilters = useCallback(() => {
    setFiltersState(initialFilters || {} as F)
    resetPagination()
  }, [initialFilters, resetPagination])

  return {
    data,
    loading,
    error,
    page,
    totalPages,
    total,
    filters,
    setFilters,
    resetFilters,
    refresh: fetchData,
    setPage,
  }
}
