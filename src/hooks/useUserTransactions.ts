// src/hooks/useUserTransactions.ts
import { useState, useEffect, useCallback } from 'react'
import { APP_CONFIG } from '../constants'

export interface Transaction {
  id: string
  type: string
  amount: number
  currency: string
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
  createdAt: string
  subscription: {
    id: string
    planType: string
  } | null
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface UseUserTransactionsResponse {
  items: Transaction[]
  loading: boolean
  error: string | null
  pagination: Pagination
  fetchTransactions: (status?: string) => Promise<void>
}

export function useUserTransactions(): UseUserTransactionsResponse {
  const [items, setItems] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })

  const fetchTransactions = useCallback(async (status?: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const queryParams = new URLSearchParams({ page: '1', limit: '20' })
      if (status) {
        queryParams.append('status', status)
      }

      const response = await fetch(
        `${APP_CONFIG.apiUrl}/subscriptions/transactions?${queryParams.toString()}`,
        { credentials: 'include' }
      )

      if (!response.ok) {
        throw new Error('Не удалось загрузить транзакции')
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
    fetchTransactions()
  }, [fetchTransactions])

  return {
    items,
    loading,
    error,
    pagination,
    fetchTransactions
  }
}
