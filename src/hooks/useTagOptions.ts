// src/hooks/useTagOptions.ts
/**
 * Хук для получения списка тегов (публичный)
 * Используется в формах для выбора тегов
 */

import { useState, useCallback, useEffect } from 'react'
import { api } from '@/services'
import type { Tag } from '@/types'
import { useNotification } from './useNotification'

interface UseTagOptionsReturn {
  tags: Tag[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useTagOptions(): UseTagOptionsReturn {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { showError } = useNotification()

  const fetchTags = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Публичный endpoint - не требует авторизации
      const result = await api.get<{ items: Tag[] }>('/tags')
      setTags(result.items || [])
    } catch (err) {
      const message = 'Ошибка загрузки тегов'
      setError(message)
      showError(message)
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => {
    fetchTags()
  }, [fetchTags])

  return {
    tags,
    loading,
    error,
    refresh: fetchTags,
  }
}
