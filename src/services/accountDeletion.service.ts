// src/services/accountDeletion.service.ts
/**
 * Сервис заявок на удаление аккаунта
 */

import { api } from './api'

export interface AccountDeletionRequest {
 id: string
 email: string
 reason: string | null
 status: 'PENDING' | 'COMPLETED' | 'REJECTED' | 'CANCELLED'
 rejectionReason: string | null
 createdAt: string
 processedAt: string | null
 profile: {
 id: string
 nickname: string
 displayName: string
 avatarUrl: string | null
 }
 processor: {
 id: string
 nickname: string
 displayName: string
 } | null
}

export interface DeletionStatus {
 hasPendingRequest: boolean
 requestId?: string
 status?: string
 createdAt?: string
}

export const AccountDeletionService = {
 /**
 * Подать заявку на удаление аккаунта
 */
 submitRequest: (reason?: string) =>
 api.post<{ message: string; requestId: string; status: string }>('/user/account-deletion', { reason }),

 /**
 * Проверить статус заявки
 */
 getStatus: () =>
 api.get<DeletionStatus>('/user/account-deletion/status'),

 /**
 * Отозвать заявку
 */
 cancelRequest: () =>
 api.delete<{ message: string }>('/user/account-deletion'),

 // === АДМИН ===

 /**
 * Получить список заявок (админ)
 */
 getAdminRequests: (params?: { page?: number; limit?: number; status?: string }) =>
 api.get<{ items: AccountDeletionRequest[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>('/admin/account-deletion-requests', params),

 /**
 * Выполнить заявку (удалить аккаунт)
 */
 completeRequest: (id: string) =>
 api.post<{ message: string }>(`/admin/account-deletion-requests/${id}/complete`),

 /**
 * Отклонить заявку
 */
 rejectRequest: (id: string, rejectionReason?: string) =>
 api.post<{ message: string }>(`/admin/account-deletion-requests/${id}/reject`, { rejectionReason }),
}
