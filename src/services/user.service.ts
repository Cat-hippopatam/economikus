// src/services/user.service.ts
/**
 * Сервис пользователя
 */

import { api } from './api'
import type { 
  User, 
  Profile, 
  ProfileInput, 
  PasswordChangeInput,
  PaginatedResponse,
  UserWithStats,
  UserInput
} from '@/types'

export const UserService = {
  // === ПРОФИЛЬ ===

  /**
   * Получить свой профиль
   */
  getMe: () => 
    api.get<{ user: User }>('/user/me'),

  /**
   * Обновить профиль
   */
  updateProfile: (data: ProfileInput) => 
    api.patch<{ message: string; profile: Profile }>('/user/profile', data),

  /**
   * Сменить пароль
   */
  changePassword: (data: PasswordChangeInput) => 
    api.patch<{ message: string }>('/user/password', data),

  /**
   * Получить публичный профиль
   */
  getPublicProfile: (nickname: string) => 
    api.get<{ profile: Profile; courses: unknown[] }>(`/user/profile/${nickname}`),

  // === АДМИН ===

  /**
   * Получить список пользователей (админ)
   */
  getAdmin: (params?: { page?: number; limit?: number; search?: string; role?: string }) =>
    api.get<PaginatedResponse<UserWithStats>>('/admin/users', params),

  /**
   * Получить список пользователей (публичный)
   */
  getAll: (params?: { page?: number; limit?: number; search?: string; role?: string }) =>
    api.get<PaginatedResponse<UserWithStats>>('/admin/users', params),

  /**
   * Обновить пользователя (админ)
   */
  update: (id: string, data: UserInput) =>
    api.patch<User>(`/admin/users/${id}`, data),

  /**
   * Удалить пользователя (админ)
   */
  delete: (id: string) =>
    api.delete(`/admin/users/${id}`),
}
