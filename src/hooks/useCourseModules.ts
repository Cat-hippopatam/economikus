// src/hooks/useCourseModules.ts
/**
 * Хук для управления модулями курса
 */

import { useState, useCallback, useEffect } from 'react'
import { useNotification } from '@/hooks'
import { api } from '@/services'

export interface CourseModule {
  id: string
  title: string
  description: string | null
  sortOrder: number
  lessonsCount: number
}

interface CourseWithModules {
  id: string
  title: string
  modules: CourseModule[]
}

interface UseCourseModulesReturn {
  courses: CourseWithModules[]
  loading: boolean
  saving: boolean
  fetchModules: () => Promise<void>
  createModule: (courseId: string, data: { title: string; description?: string }) => Promise<boolean>
  updateModule: (id: string, data: { title?: string; description?: string }) => Promise<boolean>
  deleteModule: (id: string) => Promise<boolean>
  reorderModules: (courseId: string, moduleIds: string[]) => Promise<boolean>
}

export function useCourseModules(_courseId?: string): UseCourseModulesReturn {
  const [courses, setCourses] = useState<CourseWithModules[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { showError, showSuccess } = useNotification()

  const fetchModules = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.get<{ courses: CourseWithModules[] }>('/author/modules')
      setCourses(data.courses)
    } catch (error) {
      showError('Ошибка загрузки модулей')
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => {
    fetchModules()
  }, [fetchModules])

  const createModule = useCallback(async (courseId: string, data: { title: string; description?: string }): Promise<boolean> => {
    setSaving(true)
    try {
      const newModule = await api.post<{ module: CourseModule }>('/author/modules', {
        courseId,
        title: data.title,
        description: data.description,
      })
      setCourses(prev => prev.map(course => {
        if (course.id === courseId) {
          return {
            ...course,
            modules: [...course.modules, { ...newModule.module, lessonsCount: 0 }]
          }
        }
        return course
      }))
      showSuccess('Модуль создан')
      return true
    } catch (error) {
      showError('Ошибка создания модуля')
      return false
    } finally {
      setSaving(false)
    }
  }, [showError, showSuccess])

  const updateModule = useCallback(async (id: string, data: { title?: string; description?: string }): Promise<boolean> => {
    setSaving(true)
    try {
      const updated = await api.patch<{ module: CourseModule }>(`/author/modules/${id}`, data)
      setCourses(prev => prev.map(course => ({
        ...course,
        modules: course.modules.map(m => m.id === id ? { ...m, ...updated.module } : m)
      })))
      showSuccess('Модуль обновлён')
      return true
    } catch (error) {
      showError('Ошибка обновления модуля')
      return false
    } finally {
      setSaving(false)
    }
  }, [showError, showSuccess])

  const deleteModule = useCallback(async (id: string): Promise<boolean> => {
    setSaving(true)
    try {
      await api.delete(`/author/modules/${id}`)
      setCourses(prev => prev.map(course => ({
        ...course,
        modules: course.modules.filter(m => m.id !== id)
      })))
      showSuccess('Модуль удалён')
      return true
    } catch (error) {
      showError('Ошибка удаления модуля')
      return false
    } finally {
      setSaving(false)
    }
  }, [showError, showSuccess])

  const reorderModules = useCallback(async (courseId: string, moduleIds: string[]): Promise<boolean> => {
    try {
      await api.post('/author/modules/reorder', { courseId, moduleIds })
      setCourses(prev => prev.map(course => {
        if (course.id === courseId) {
          const orderMap = new Map(moduleIds.map((id, index) => [id, index]))
          return {
            ...course,
            modules: [...course.modules].sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0))
          }
        }
        return course
      }))
      showSuccess('Порядок обновлён')
      return true
    } catch (error) {
      showError('Ошибка изменения порядка')
      return false
    }
  }, [showError, showSuccess])

  return {
    courses,
    loading,
    saving,
    fetchModules,
    createModule,
    updateModule,
    deleteModule,
    reorderModules,
  }
}
