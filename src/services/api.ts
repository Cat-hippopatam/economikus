// src/services/api.ts
/**
 * Базовый API сервис
 */

import type { PaginatedResponse, ApiError } from '@/types'

// Базовый URL
const BASE_URL = '/api'

// Конфигурация запроса
interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
}

/**
 * Класс для работы с API
 */
class ApiService {
  private baseUrl: string

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl
  }

  /**
   * Выполнить запрос
   */
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { params, ...init } = config
    
    // Формируем URL с параметрами
    let url = `${this.baseUrl}${endpoint}`
    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, String(value))
        }
      })
      const queryString = searchParams.toString()
      if (queryString) {
        url += `?${queryString}`
      }
    }

    // Выполняем запрос
    const response = await fetch(url, {
      ...init,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...init.headers,
      },
    })

    // Обрабатываем ответ
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        error: 'Неизвестная ошибка',
        status: response.status,
      }))
      throw new ApiErrorClass(error.error, error.message, error.code, response.status)
    }

    // Для пустых ответов (204 No Content)
    if (response.status === 204) {
      return {} as T
    }

    return response.json()
  }

  // HTTP методы
  get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params })
  }

  post<T>(endpoint: string, data?: unknown, config?: { headers?: Record<string, string> }): Promise<T> {
    const isFormData = data instanceof FormData
    return this.request<T>(endpoint, {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
      headers: isFormData ? config?.headers : { 'Content-Type': 'application/json', ...config?.headers },
    })
  }

  patch<T>(endpoint: string, data?: unknown, config?: { headers?: Record<string, string> }): Promise<T> {
    const isFormData = data instanceof FormData
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: isFormData ? data : JSON.stringify(data),
      headers: isFormData ? config?.headers : { 'Content-Type': 'application/json', ...config?.headers },
    })
  }

  put<T>(endpoint: string, data?: unknown, config?: { headers?: Record<string, string> }): Promise<T> {
    const isFormData = data instanceof FormData
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: isFormData ? data : JSON.stringify(data),
      headers: isFormData ? config?.headers : { 'Content-Type': 'application/json', ...config?.headers },
    })
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

/**
 * Класс ошибки API
 */
export class ApiErrorClass extends Error {
  error: string
  code?: string
  status?: number
  
  constructor(error: string, message?: string, code?: string, status?: number) {
    super(message || error)
    this.name = 'ApiError'
    this.error = error
    this.code = code
    this.status = status
  }
}

// Экспорт singleton
export const api = new ApiService()

// Хелперы для пагинации
export function getPaginationParams(page: number = 1, limit: number = 10) {
  return { page, limit }
}

// Типы
export type { PaginatedResponse, ApiError }
