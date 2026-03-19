// src/hooks/useAuthorApplication.ts
/**
 * Хук для управления заявкой на статус автора
 */

import { useState, useCallback, useEffect } from 'react'
import { useNotification } from './useNotification'
import { api } from '@/services'

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface AuthorApplication {
  id: string
  status: ApplicationStatus
  motivation: string
  experience: string | null
  portfolioUrl: string | null
  rejectionReason: string | null
  createdAt: string
  reviewedAt: string | null
  reviewer: { id: string; nickname: string; displayName: string } | null
}

interface UseAuthorApplicationReturn {
  application: AuthorApplication | null
  loading: boolean
  submitting: boolean
  fetchApplication: () => Promise<void>
  submitApplication: (data: { motivation: string; experience?: string; portfolioUrl?: string }) => Promise<boolean>
  resetApplication: () => void
}

export function useAuthorApplication(): UseAuthorApplicationReturn {
  const [application, setApplication] = useState<AuthorApplication | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { showError, showSuccess } = useNotification()

  const fetchApplication = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.get<{ application: AuthorApplication | null }>('/author/application')
      setApplication(data.application)
    } catch (error) {
      console.error('Error fetching application:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const submitApplication = useCallback(async (data: {
    motivation: string
    experience?: string
    portfolioUrl?: string
  }): Promise<boolean> => {
    if (data.motivation.length < 50) {
      showError('Мотивация должна содержать минимум 50 символов')
      return false
    }

    setSubmitting(true)
    try {
      await api.post<{ message: string; application: AuthorApplication }>('/author/apply', data)
      showSuccess('Заявка успешно отправлена')
      await fetchApplication()
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка отправки заявки'
      showError(message)
      return false
    } finally {
      setSubmitting(false)
    }
  }, [showError, showSuccess, fetchApplication])

  const resetApplication = useCallback(() => {
    setApplication(null)
  }, [])

  useEffect(() => {
    fetchApplication()
  }, [fetchApplication])

  return {
    application,
    loading,
    submitting,
    fetchApplication,
    submitApplication,
    resetApplication,
  }
}
