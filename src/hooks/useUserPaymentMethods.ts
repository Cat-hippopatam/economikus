// src/hooks/useUserPaymentMethods.ts
import { useState, useEffect, useCallback } from 'react'
import { APP_CONFIG } from '../constants'

export interface PaymentMethod {
  id: string
  type: string
  provider: string
  last4: string | null
  cardType: string | null
  expiryMonth: number | null
  expiryYear: number | null
  isDefault: boolean
  isVerified: boolean
}

interface UseUserPaymentMethodsResponse {
  items: PaymentMethod[]
  loading: boolean
  error: string | null
  fetchPaymentMethods: () => Promise<void>
  addPaymentMethod: (type: string, provider: string, providerToken: string) => Promise<void>
  removePaymentMethod: (id: string) => Promise<void>
}

export function useUserPaymentMethods(): UseUserPaymentMethodsResponse {
  const [items, setItems] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPaymentMethods = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${APP_CONFIG.apiUrl}/subscriptions/payment-methods`, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Не удалось загрузить методы оплаты')
      }

      const data = await response.json()
      setItems(data.items || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }, [])

  const addPaymentMethod = useCallback(async (
    type: string,
    provider: string,
    providerToken: string
  ) => {
    try {
      const response = await fetch(`${APP_CONFIG.apiUrl}/subscriptions/payment-methods`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, provider, providerToken })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Не удалось добавить метод оплаты')
      }

      await fetchPaymentMethods()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка добавления')
      throw err
    }
  }, [fetchPaymentMethods])

  const removePaymentMethod = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${APP_CONFIG.apiUrl}/subscriptions/payment-methods/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Не удалось удалить метод оплаты')
      }

      setItems(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления')
      throw err
    }
  }, [])

  useEffect(() => {
    fetchPaymentMethods()
  }, [fetchPaymentMethods])

  return {
    items,
    loading,
    error,
    fetchPaymentMethods,
    addPaymentMethod,
    removePaymentMethod
  }
}
