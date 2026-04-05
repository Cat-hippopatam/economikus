// src/hooks/useNotification.ts
/**
 * Хук для уведомлений
 */

import { useState, useCallback } from 'react'

interface Notification {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
}

interface UseNotificationReturn {
  notification: Notification | null
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showWarning: (message: string) => void
  showInfo: (message: string) => void
  hide: () => void
}

export function useNotification(): UseNotificationReturn {
  const [notification, setNotification] = useState<Notification | null>(null)

  const showSuccess = useCallback((message: string) => {
    setNotification({ type: 'success', message })
  }, [])

  const showError = useCallback((message: string) => {
    setNotification({ type: 'error', message })
  }, [])

  const showWarning = useCallback((message: string) => {
    setNotification({ type: 'warning', message })
  }, [])

  const showInfo = useCallback((message: string) => {
    setNotification({ type: 'info', message })
  }, [])

  const hide = useCallback(() => {
    setNotification(null)
  }, [])

  return {
    notification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hide,
  }
}
