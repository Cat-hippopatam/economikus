// src/services/auth.service.ts
/**
 * Сервис аутентификации
 */

import { api } from './api'
import type { RegisterInput, LoginInput, AuthResponse } from '@/types'

export const AuthService = {
  /**
   * Регистрация
   */
  register: (data: RegisterInput) => 
    api.post<AuthResponse>('/auth/register', data),

  /**
   * Вход
   */
  login: (data: LoginInput) => 
    api.post<AuthResponse>('/auth/login', data),

  /**
   * Выход
   */
  logout: () => 
    api.post('/auth/logout'),

  /**
   * Текущий пользователь
   */
  me: () => 
    api.get<AuthResponse>('/auth/me'),
}
