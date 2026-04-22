// src/hooks/useAuthorLesson.ts
/**
 * Хук для управления одним уроком автора (создание/редактирование)
 */

import { useState, useCallback } from 'react'
import { useNotification } from '@/hooks'
import { api } from '@/services'

export interface AuthorLessonFormData {
  title: string
  slug: string
  description: string | null
  lessonType: string
  moduleId: string | null
  coverImage: string | null
  duration: number | null
  isPremium: boolean
  status: string
  tags: string[]
}

interface LessonFromAPI {
  id: string
  title: string
  slug: string
  description: string | null
  lessonType: string
  moduleId: string | null
  coverImage: string | null
  duration: number | null
  isPremium: boolean
  status: string
  tags: Array<{ id: string; name: string; slug: string; color: string | null }>
}

interface UseAuthorLessonReturn {
  lesson: AuthorLessonFormData | null
  loading: boolean
  saving: boolean
  error: string | null
  fetchLesson: (id: string) => Promise<void>
  saveLesson: (data: AuthorLessonFormData, id?: string) => Promise<boolean>
  uploadCover: (file: File) => Promise<string | null>
}

export function useAuthorLesson(): UseAuthorLessonReturn {
  const [lesson, setLesson] = useState<AuthorLessonFormData | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { showError, showSuccess } = useNotification()

  const fetchLesson = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.get<{ lesson: LessonFromAPI }>(`/author/lessons/${id}`)
      // Маппинг данных
      setLesson({
        title: data.lesson.title,
        slug: data.lesson.slug,
        description: data.lesson.description,
        lessonType: data.lesson.lessonType,
        moduleId: data.lesson.moduleId,
        coverImage: data.lesson.coverImage,
        duration: data.lesson.duration,
        isPremium: data.lesson.isPremium,
        status: data.lesson.status,
        tags: data.lesson.tags?.map(t => t.id) || [],
      })
    } catch (err) {
      const message = 'Ошибка загрузки урока'
      setError(message)
      showError(message)
    } finally {
      setLoading(false)
    }
  }, [showError])

  const saveLesson = useCallback(async (data: AuthorLessonFormData, id?: string): Promise<boolean> => {
    setSaving(true)
    setError(null)
    try {
      const payload = {
        title: data.title,
        slug: data.slug,
        description: data.description,
        lessonType: data.lessonType,
        moduleId: data.moduleId,
        coverImage: data.coverImage,
        duration: data.duration,
        isPremium: data.isPremium,
        status: data.status,
        tags: data.tags,
      }

      if (id) {
        await api.patch(`/author/lessons/${id}`, payload)
        showSuccess('Урок обновлён')
      } else {
        await api.post('/author/lessons', payload)
        showSuccess('Урок создан')
      }
      return true
    } catch (err: unknown) {
      const message = id ? 'Ошибка обновления урока' : 'Ошибка создания урока'
      setError(message)
      showError(message)
      console.error('Lesson save error:', err)
      return false
    } finally {
      setSaving(false)
    }
  }, [showError, showSuccess])

  const uploadCover = useCallback(async (file: File): Promise<string | null> => {
    // Проверка размера (макс 5MB для обложек)
    if (file.size > 5 * 1024 * 1024) {
      showError('Размер файла не должен превышать 5MB')
      return null
    }

    // Проверка типа
    if (!file.type.startsWith('image/')) {
      showError('Выберите изображение')
      return null
    }

    try {
      // Создаём FormData для загрузки файла
      const formData = new FormData()
      formData.append('cover', file)

      const response = await api.post<{ coverUrl: string }>('/author/lessons/upload-cover', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return response.coverUrl
    } catch (err: any) {
      console.error('Cover upload error:', err)
      showError(err?.message || 'Ошибка загрузки изображения')
      return null
    }
  }, [showError])

  return {
    lesson,
    loading,
    saving,
    error,
    fetchLesson,
    saveLesson,
    uploadCover,
  }
}
