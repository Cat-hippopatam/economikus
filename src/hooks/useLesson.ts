// src/hooks/useLesson.ts
/**
 * Хук для страницы урока
 */

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/services'
import { APP_CONFIG } from '../constants'

interface LessonContent {
  type: 'text' | 'video' | 'audio' | 'quiz'
  body?: string
  videoUrl?: string
  platform?: string
  audioUrl?: string
  questions?: any[]
  passingScore?: number
}

interface Lesson {
  id: string
  title: string
  slug: string
  description?: string
  lessonType: 'ARTICLE' | 'VIDEO' | 'AUDIO' | 'QUIZ'
  duration?: number
  isPremium?: boolean
  sortOrder?: number
  status?: string
  content?: LessonContent
  module: {
    id: string
    title: string
    sortOrder: number
    course: {
      id: string
      title: string
      slug: string
    }
  }
}

interface ModuleWithLessons {
  id: string
  title: string
  sortOrder: number
  lessons: {
    id: string
    title: string
    slug: string
    lessonType: string
    duration?: number
    isPremium?: boolean
    sortOrder: number
  }[]
}

interface LessonProgress {
  id: string
  status: string
  progressPercent: number
  lastPosition?: number
  completedAt?: string
  quizScore?: number
}

interface UseLessonReturn {
  lesson: Lesson | null
  modules: ModuleWithLessons[]
  progress: LessonProgress | null
  loading: boolean
  error: string | null
  markCompleted: () => Promise<void>
  updateProgress: (timeSpent: number) => Promise<void>
}

export function useLesson(courseSlug: string | undefined, lessonSlug: string | undefined): UseLessonReturn {
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [modules, setModules] = useState<ModuleWithLessons[]>([])
  const [progress, setProgress] = useState<LessonProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLesson = useCallback(async () => {
    if (!courseSlug || !lessonSlug) {
      setError('Урок не указан')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Получаем урок с контентом
      const lessonData = await api.get<Lesson>(`/courses/${courseSlug}/lessons/${lessonSlug}`)
      setLesson(lessonData)

      // Получаем структуру курса (модули с уроками)
      const courseData = await api.get<{ modules: ModuleWithLessons[] }>(`/courses/${courseSlug}`)
      setModules(courseData.modules || [])

      // Получаем прогресс
      try {
        const progressData = await api.get<LessonProgress>(`/progress/lessons/${lessonData.id}`)
        setProgress(progressData)
      } catch {
        // Прогресс не найден - это нормально
        setProgress(null)
      }

      // Записываем в историю (в фоне, не блокируем загрузку)
      try {
        await fetch(`${APP_CONFIG.apiUrl}/user/history`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            lessonId: lessonData.id,
            watchedSeconds: 0,
            completed: false
          })
        })
      } catch (historyErr) {
        console.error('Error recording history:', historyErr)
      }
    } catch (err) {
      console.error('Error fetching lesson:', err)
      setError('Урок не найден')
    } finally {
      setLoading(false)
    }
  }, [courseSlug, lessonSlug])

  useEffect(() => {
    fetchLesson()
  }, [fetchLesson])

  const markCompleted = async () => {
    if (!lesson) return

    try {
      const progressData = await api.post<LessonProgress>(`/progress/lessons/${lesson.id}/complete`)
      setProgress(progressData)
    } catch (err) {
      console.error('Error marking lesson as completed:', err)
    }
  }

  const updateProgress = async (progressPercent: number, lastPosition?: number) => {
    if (!lesson) return

    try {
      const progressData = await api.patch<LessonProgress>(`/progress/lessons/${lesson.id}`, { 
        progressPercent, 
        lastPosition 
      })
      setProgress(progressData)
    } catch (err) {
      console.error('Error updating progress:', err)
    }
  }

  return {
    lesson,
    modules,
    progress,
    loading,
    error,
    markCompleted,
    updateProgress,
  }
}
