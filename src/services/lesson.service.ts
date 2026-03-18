// src/services/lesson.service.ts
/**
 * Сервис уроков
 */

import { api } from './api'
import type { Lesson, LessonInput, PaginatedResponse } from '@/types'

export const LessonService = {
  // === ПУБЛИЧНЫЕ ===

  /**
   * Получить список уроков
   */
  getAll: (params?: { page?: number; limit?: number; search?: string; lessonType?: string }) =>
    api.get<PaginatedResponse<Lesson>>('/lessons', params),

  /**
   * Получить урок по slug
   */
  getBySlug: (slug: string) =>
    api.get<Lesson>(`/lessons/${slug}`),

  // === АДМИН ===

  /**
   * Создать урок
   */
  create: (data: LessonInput) =>
    api.post<Lesson>('/admin/lessons', data),

  /**
   * Обновить урок
   */
  update: (id: string, data: Partial<LessonInput>) =>
    api.patch<Lesson>(`/admin/lessons/${id}`, data),

  /**
   * Удалить урок
   */
  delete: (id: string) =>
    api.delete(`/admin/lessons/${id}`),

  /**
   * Получить список уроков (админ)
   */
  getAdmin: (params?: { page?: number; limit?: number; search?: string; lessonType?: string; status?: string }) =>
    api.get<PaginatedResponse<Lesson>>('/admin/lessons', params),
}
