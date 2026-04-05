// src/hooks/useLessonAccess.ts
/**
 * Хук для проверки доступа к уроку (премиум/бесплатный)
 */

import { useState, useEffect, useCallback } from 'react'
import { APP_CONFIG } from '../constants'

interface SubscriptionCheck {
  hasAccess: boolean
  planType: string | null
  status: string | null
  expiresAt: string | null
}

interface CourseInfo {
  id: string
  title: string
  slug: string
  isPremium: boolean
}

interface UseLessonAccessReturn {
  hasAccess: boolean
  loading: boolean
  error: string | null
  checkAccess: () => Promise<void>
  course: CourseInfo | null
}

export function useLessonAccess(courseSlug: string | undefined): UseLessonAccessReturn {
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [course, setCourse] = useState<CourseInfo | null>(null)

  const checkAccess = useCallback(async () => {
    if (!courseSlug) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Получаем данные курса
      const courseResponse = await fetch(
        `${APP_CONFIG.apiUrl}/courses/${courseSlug}`,
        { credentials: 'include' }
      )

      if (!courseResponse.ok) {
        throw new Error('Курс не найден')
      }

      const courseData = await courseResponse.json()
      
      // Проверяем, является ли курс премиум
      const isPremium = courseData.isPremium || courseData.price > 0 || courseData.subscriptionRequired
      
      setCourse({
        id: courseData.id,
        title: courseData.title,
        slug: courseData.slug,
        isPremium: isPremium
      })

      // Если курс не премиум - доступ открыт
      if (!isPremium) {
        setHasAccess(true)
        setLoading(false)
        return
      }

      // Если курс премиум - проверяем подписку
      const subResponse = await fetch(
        `${APP_CONFIG.apiUrl}/subscriptions/check-access`,
        { credentials: 'include' }
      )

      if (!subResponse.ok) {
        setHasAccess(false)
        setError('Необходима подписка')
        setLoading(false)
        return
      }

      const subData: SubscriptionCheck = await subResponse.json()
      
      if (subData.hasAccess) {
        setHasAccess(true)
      } else {
        setHasAccess(false)
        setError('Для доступа к этому курсу необходима подписка')
      }
    } catch (err) {
      console.error('Error checking access:', err)
      setError('Ошибка проверки доступа')
      setHasAccess(false)
    } finally {
      setLoading(false)
    }
  }, [courseSlug])

  useEffect(() => {
    checkAccess()
  }, [checkAccess])

  return {
    hasAccess,
    loading,
    error,
    checkAccess,
    course
  }
}
