// src/hooks/useSubscriptionCheck.ts
import { useState, useEffect, useCallback } from 'react'
import { APP_CONFIG } from '../constants'

export interface SubscriptionStatus {
  hasActiveSubscription: boolean
  subscriptionPlan: string | null
  subscriptionStatus: string | null
  expiresAt: string | null
}

interface UseSubscriptionCheckResponse {
  status: SubscriptionStatus
  loading: boolean
  error: string | null
  checkAccess: () => Promise<boolean>
  canAccessPremium: boolean
}

export function useSubscriptionCheck(): UseSubscriptionCheckResponse {
  const [status, setStatus] = useState<SubscriptionStatus>({
    hasActiveSubscription: false,
    subscriptionPlan: null,
    subscriptionStatus: null,
    expiresAt: null
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkAccess = useCallback(async (): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(
        `${APP_CONFIG.apiUrl}/subscriptions/check-access`,
        { credentials: 'include' }
      )

      if (!response.ok) {
        // Если 401 или ошибка - считаем что подписки нет
        setStatus({
          hasActiveSubscription: false,
          subscriptionPlan: null,
          subscriptionStatus: null,
          expiresAt: null
        })
        return false
      }

      const data = await response.json()
      setStatus({
        hasActiveSubscription: data.hasAccess || false,
        subscriptionPlan: data.planType || null,
        subscriptionStatus: data.status || null,
        expiresAt: data.expiresAt || null
      })
      return data.hasAccess || false
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка проверки подписки')
      setStatus({
        hasActiveSubscription: false,
        subscriptionPlan: null,
        subscriptionStatus: null,
        expiresAt: null
      })
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAccess()
  }, [checkAccess])

  return {
    status,
    loading,
    error,
    checkAccess,
    canAccessPremium: status.hasActiveSubscription
  }
}
