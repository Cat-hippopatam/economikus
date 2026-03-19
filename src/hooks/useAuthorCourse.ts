// src/hooks/useAuthorCourse.ts
/**
 * Хук для управления одним курсом автора (создание/редактирование)
 */

import { useState, useCallback } from 'react'
import { useNotification } from '@/hooks'
import { api } from '@/services'

export interface AuthorCourseFormData {
  title: string
  slug: string
  description: string | null
  coverImage: string | null
  difficultyLevel: string | null
  isPremium: boolean
  status: string
  tags: string[]
}

interface CourseFromAPI {
  id: string
  title: string
  slug: string
  description: string | null
  coverImage: string | null
  difficultyLevel: string | null
  isPremium: boolean
  status: string
  tags: Array<{ id: string; name: string; slug: string; color: string | null }>
}

interface UseAuthorCourseReturn {
  course: AuthorCourseFormData | null
  loading: boolean
  saving: boolean
  error: string | null
  fetchCourse: (id: string) => Promise<void>
  saveCourse: (data: AuthorCourseFormData, id?: string) => Promise<boolean>
  uploadCover: (file: File) => Promise<string | null>
}

export function useAuthorCourse(): UseAuthorCourseReturn {
  const [course, setCourse] = useState<AuthorCourseFormData | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { showError, showSuccess } = useNotification()

  const fetchCourse = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.get<{ course: CourseFromAPI }>(`/author/courses/${id}`)
      // Маппинг данных: tags из объектов в массив id
      setCourse({
        title: data.course.title,
        slug: data.course.slug,
        description: data.course.description,
        coverImage: data.course.coverImage,
        difficultyLevel: data.course.difficultyLevel,
        isPremium: data.course.isPremium,
        status: data.course.status,
        tags: data.course.tags?.map(t => t.id) || [],
      })
    } catch (err) {
      const message = 'Ошибка загрузки курса'
      setError(message)
      showError(message)
    } finally {
      setLoading(false)
    }
  }, [showError])

  const saveCourse = useCallback(async (data: AuthorCourseFormData, id?: string): Promise<boolean> => {
    setSaving(true)
    setError(null)
    try {
      const payload = {
        title: data.title,
        slug: data.slug,
        description: data.description,
        coverImage: data.coverImage,
        difficultyLevel: data.difficultyLevel,
        isPremium: data.isPremium,
        status: data.status,
        tags: data.tags,
      }

      if (id) {
        await api.patch(`/author/courses/${id}`, payload)
        showSuccess('Курс обновлён')
      } else {
        await api.post('/author/courses', payload)
        showSuccess('Курс создан')
      }
      return true
    } catch (err: unknown) {
      const message = id ? 'Ошибка обновления курса' : 'Ошибка создания курса'
      setError(message)
      showError(message)
      console.error('Course save error:', err)
      return false
    } finally {
      setSaving(false)
    }
  }, [showError, showSuccess])

  const uploadCover = useCallback(async (file: File): Promise<string | null> => {
    // Проверка размера (макс 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showError('Размер файла не должен превышать 2MB')
      return null
    }

    // Проверка типа
    if (!file.type.startsWith('image/')) {
      showError('Выберите изображение')
      return null
    }

    try {
      const reader = new FileReader()
      
      return new Promise((resolve) => {
        reader.onload = async (e) => {
          const dataUrl = e.target?.result as string
          // Проверка размера после конвертации в base64
          if (dataUrl.length > 65535) {
            showError('Изображение слишком большое после конвертации')
            resolve(null)
            return
          }
          resolve(dataUrl)
        }
        reader.onerror = () => {
          showError('Ошибка чтения файла')
          resolve(null)
        }
        reader.readAsDataURL(file)
      })
    } catch (err) {
      showError('Ошибка загрузки изображения')
      return null
    }
  }, [showError])

  return {
    course,
    loading,
    saving,
    error,
    fetchCourse,
    saveCourse,
    uploadCover,
  }
}
