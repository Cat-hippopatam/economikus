// src/services/course.service.ts
/**
 * Сервис курсов
 */

import { api } from './api'
import type { Course, CourseInput, Module, PaginatedResponse } from '@/types'

export const CourseService = {
  // === ПУБЛИЧНЫЕ ===

  /**
   * Получить список курсов
   */
  getAll: (params?: { page?: number; limit?: number; search?: string; status?: string }) =>
    api.get<PaginatedResponse<Course>>('/courses', params),

  /**
   * Получить курс по slug
   */
  getBySlug: (slug: string) =>
    api.get<Course>(`/courses/${slug}`),

  /**
   * Получить модули курса
   */
  getModules: (slug: string) =>
    api.get<{ modules: Module[] }>(`/courses/${slug}/modules`),

  // === АДМИН ===

  /**
   * Создать курс
   */
  create: (data: CourseInput) =>
    api.post<Course>('/admin/courses', data),

  /**
   * Обновить курс
   */
  update: (id: string, data: Partial<CourseInput>) =>
    api.patch<Course>(`/admin/courses/${id}`, data),

  /**
   * Удалить курс
   */
  delete: (id: string) =>
    api.delete(`/admin/courses/${id}`),

  /**
   * Получить список курсов (админ)
   */
  getAdmin: (params?: { page?: number; limit?: number; search?: string; status?: string }) =>
    api.get<PaginatedResponse<Course>>('/admin/courses', params),
}
