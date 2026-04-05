// src/hooks/useCourseDetail.ts
/**
 * Хук для детальной страницы курса
 */

import { useState, useEffect, useCallback } from 'react'
import { CourseService } from '@/services'
import type { Course, Module } from '@/types'

interface UseCourseDetailReturn {
  course: Course | null
  modules: Module[]
  loading: boolean
  error: string | null
}

export function useCourseDetail(slug: string | undefined): UseCourseDetailReturn {
  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCourse = useCallback(async () => {
    if (!slug) {
      setError('Курс не указан')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Получаем курс с модулями и уроками
      const courseData = await CourseService.getBySlug(slug)
      setCourse(courseData)
      
      // Модули уже включены в ответ API
      setModules(courseData.modules || [])
    } catch (err) {
      console.error('Error fetching course:', err)
      setError('Курс не найден')
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    fetchCourse()
  }, [fetchCourse])

  return {
    course,
    modules,
    loading,
    error,
  }
}
