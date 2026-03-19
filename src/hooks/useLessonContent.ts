// src/hooks/useLessonContent.ts
/**
 * Хук для управления контентом урока
 */

import { useState, useCallback, useEffect } from 'react'
import { useNotification } from '@/hooks'
import { api } from '@/services'

export interface TextContent {
  id: string
  body: string
  wordCount: number | null
  readingTime: number | null
}

export interface VideoContent {
  id: string
  videoUrl: string
  provider: string
  duration: number
}

export interface AudioContent {
  id: string
  audioUrl: string
  duration: number
}

export interface QuizContent {
  id: string
  questions: QuizQuestion[]
  passingScore: number
  attemptsAllowed: number | null
}

export interface QuizQuestion {
  id: string
  text: string
  options: QuizOption[]
  correctOptionId: string
}

export interface QuizOption {
  id: string
  text: string
}

interface LessonContent {
  lessonType: string
  textContent: TextContent | null
  videoContent: VideoContent | null
  audioContent: AudioContent | null
  quizContent: QuizContent | null
}

interface UseLessonContentReturn {
  content: LessonContent | null
  loading: boolean
  saving: boolean
  fetchContent: () => Promise<void>
  saveTextContent: (body: string) => Promise<boolean>
  saveVideoContent: (data: { videoUrl: string; provider?: string; duration?: number }) => Promise<boolean>
  saveAudioContent: (data: { audioUrl: string; duration?: number }) => Promise<boolean>
  saveQuizContent: (data: { questions: QuizQuestion[]; passingScore?: number; attemptsAllowed?: number }) => Promise<boolean>
}

export function useLessonContent(lessonId: string | undefined): UseLessonContentReturn {
  const [content, setContent] = useState<LessonContent | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const { showError, showSuccess } = useNotification()

  const fetchContent = useCallback(async () => {
    if (!lessonId) return
    
    setLoading(true)
    try {
      const data = await api.get<LessonContent>(`/author/lessons/${lessonId}/content`)
      setContent(data)
    } catch (error) {
      showError('Ошибка загрузки контента')
    } finally {
      setLoading(false)
    }
  }, [lessonId, showError])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  const saveTextContent = useCallback(async (body: string): Promise<boolean> => {
    if (!lessonId) return false
    
    setSaving(true)
    try {
      const data = await api.post<{ content: TextContent }>(`/author/lessons/${lessonId}/content/text`, { body })
      setContent(prev => prev ? { ...prev, textContent: data.content, lessonType: 'ARTICLE' } : null)
      showSuccess('Текст сохранён')
      return true
    } catch (error) {
      showError('Ошибка сохранения текста')
      return false
    } finally {
      setSaving(false)
    }
  }, [lessonId, showError, showSuccess])

  const saveVideoContent = useCallback(async (data: { videoUrl: string; provider?: string; duration?: number }): Promise<boolean> => {
    if (!lessonId) return false
    
    setSaving(true)
    try {
      const result = await api.post<{ content: VideoContent }>(`/author/lessons/${lessonId}/content/video`, data)
      setContent(prev => prev ? { ...prev, videoContent: result.content, lessonType: 'VIDEO' } : null)
      showSuccess('Видео сохранено')
      return true
    } catch (error) {
      showError('Ошибка сохранения видео')
      return false
    } finally {
      setSaving(false)
    }
  }, [lessonId, showError, showSuccess])

  const saveAudioContent = useCallback(async (data: { audioUrl: string; duration?: number }): Promise<boolean> => {
    if (!lessonId) return false
    
    setSaving(true)
    try {
      const result = await api.post<{ content: AudioContent }>(`/author/lessons/${lessonId}/content/audio`, data)
      setContent(prev => prev ? { ...prev, audioContent: result.content, lessonType: 'AUDIO' } : null)
      showSuccess('Аудио сохранено')
      return true
    } catch (error) {
      showError('Ошибка сохранения аудио')
      return false
    } finally {
      setSaving(false)
    }
  }, [lessonId, showError, showSuccess])

  const saveQuizContent = useCallback(async (data: { questions: QuizQuestion[]; passingScore?: number; attemptsAllowed?: number }): Promise<boolean> => {
    if (!lessonId) return false
    
    setSaving(true)
    try {
      const result = await api.post<{ content: QuizContent }>(`/author/lessons/${lessonId}/content/quiz`, data)
      setContent(prev => prev ? { ...prev, quizContent: result.content, lessonType: 'QUIZ' } : null)
      showSuccess('Тест сохранён')
      return true
    } catch (error) {
      showError('Ошибка сохранения теста')
      return false
    } finally {
      setSaving(false)
    }
  }, [lessonId, showError, showSuccess])

  return {
    content,
    loading,
    saving,
    fetchContent,
    saveTextContent,
    saveVideoContent,
    saveAudioContent,
    saveQuizContent,
  }
}
