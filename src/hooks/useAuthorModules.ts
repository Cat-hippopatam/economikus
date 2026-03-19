// src/hooks/useAuthorModules.ts
/**
 * Хук для получения списка модулей автора (для выбора в форме урока)
 */

import { useState, useCallback, useEffect } from 'react'
import { useNotification } from '@/hooks'
import { api } from '@/services'

export interface AuthorModule {
  id: string
  title: string
  courseId: string
  course: {
    id: string
    title: string
  }
}

interface UseAuthorModulesReturn {
  modules: AuthorModule[]
  loading: boolean
  refresh: () => Promise<void>
}

export function useAuthorModules(): UseAuthorModulesReturn {
  const [modules, setModules] = useState<AuthorModule[]>([])
  const [loading, setLoading] = useState(true)
  const { showError } = useNotification()

  const fetchModules = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.get<{ modules: AuthorModule[] }>('/author/modules')
      setModules(data.modules)
    } catch (error) {
      showError('Ошибка загрузки модулей')
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => {
    fetchModules()
  }, [fetchModules])

  return {
    modules,
    loading,
    refresh: fetchModules,
  }
}
