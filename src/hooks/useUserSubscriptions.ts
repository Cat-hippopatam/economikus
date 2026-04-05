// src/hooks/useUserSubscriptions.ts
import { useState, useEffect, useCallback } from 'react'
import { APP_CONFIG } from '../constants'

export interface Subscription {
  id: string
  planType: string
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'EXPIRED'
  startDate: string
  endDate: string | null
  trialEndsAt: string | null
  autoRenew: boolean
  price: number
  currency: string
  paymentMethod: {
    id: string
    type: string
    last4: string | null
    cardType: string | null
  } | null
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface UseUserSubscriptionsResponse {
  items: Subscription[]
  loading: boolean
  error: string | null
  pagination: Pagination
  fetchSubscriptions: () => Promise<void>
  createSubscription: (planType: string, paymentMethodId?: string, autoRenew?: boolean) => Promise<void>
  cancelSubscription: (id: string) => Promise<void>
}

export function useUserSubscriptions(): UseUserSubscriptionsResponse {
  const [items, setItems] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(
        `${APP_CONFIG.apiUrl}/subscriptions/subscriptions?page=1&limit=20`,
        { credentials: 'include' }
      )

      if (!response.ok) {
        throw new Error('Не удалось загрузить подписки')
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

  const createSubscription = useCallback(async (
    planType: string,
    paymentMethodId?: string,
    autoRenew: boolean = true
  ) => {
    try {
      const response = await fetch(`${APP_CONFIG.apiUrl}/subscriptions/subscriptions`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType, paymentMethodId, autoRenew })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Не удалось оформить подписку')
      }

      await fetchSubscriptions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка оформления подписки')
      throw err
    }
  }, [fetchSubscriptions])

  const cancelSubscription = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${APP_CONFIG.apiUrl}/subscriptions/subscriptions/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Не удалось отменить подписку')
      }

      setItems(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка отмены подписки')
      throw err
    }
  }, [])

  useEffect(() => {
    fetchSubscriptions()
  }, [fetchSubscriptions])

  return {
    items,
    loading,
    error,
    pagination,
    fetchSubscriptions,
    createSubscription,
    cancelSubscription
  }
}
