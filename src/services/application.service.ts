// src/services/application.service.ts
/**
 * Сервис заявок на статус автора
 */

import { api } from './api'
import type { Application, ApplicationInput, PaginatedResponse } from '@/types'

export const ApplicationService = {
  // === ПОЛЬЗОВАТЕЛЬ ===

  /**
   * Получить свою заявку
   */
  getMy: () =>
    api.get<{ application: Application | null }>('/author/application'),

  /**
   * Подать заявку
   */
  apply: (data: ApplicationInput) =>
    api.post<{ message: string; application: Application }>('/author/apply', data),

  // === АДМИН ===

  /**
   * Получить список заявок
   */
  getAll: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get<PaginatedResponse<Application>>('/admin/applications', params),

  /**
   * Одобрить заявку
   */
  approve: (id: string) =>
    api.patch<{ message: string }>(`/admin/applications/${id}`, { action: 'approve' }),

  /**
   * Отклонить заявку
   */
  reject: (id: string, rejectionReason: string) =>
    api.patch<{ message: string }>(`/admin/applications/${id}`, { 
      action: 'reject', 
      rejectionReason 
    }),
}
