// src/hooks/usePagination.ts
/**
 * Хук для пагинации
 */

import { useState, useCallback } from 'react'

interface UsePaginationOptions {
  initialPage?: number
  pageSize?: number
}

interface UsePaginationReturn {
  page: number
  pageSize: number
  totalPages: number
  setPage: (page: number) => void
  setTotalPages: (total: number) => void
  nextPage: () => void
  prevPage: () => void
  reset: () => void
  offset: number
}

export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
  const { initialPage = 1, pageSize = 10 } = options
  
  const [page, setPageState] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(1)

  const setPage = useCallback((p: number) => {
    setPageState(Math.max(1, Math.min(p, totalPages)))
  }, [totalPages])

  const nextPage = useCallback(() => {
    setPageState(p => Math.min(p + 1, totalPages))
  }, [totalPages])

  const prevPage = useCallback(() => {
    setPageState(p => Math.max(p - 1, 1))
  }, [])

  const reset = useCallback(() => {
    setPageState(1)
  }, [])

  return {
    page,
    pageSize,
    totalPages,
    setPage,
    setTotalPages,
    nextPage,
    prevPage,
    reset,
    offset: (page - 1) * pageSize,
  }
}
