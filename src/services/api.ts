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

    // Подготавливаем заголовки
    const headers: Record<string, string> = {}
    
    // Добавляем Content-Type только если это не FormData
    // Для FormData браузер сам установит boundary
    const isFormData = init.body instanceof FormData
    if (!isFormData) {
      headers['Content-Type'] = 'application/json'
    }
    
    // Объединяем с кастомными заголовками (они имеют приоритет)
    Object.assign(headers, init.headers)

    // Выполняем запрос
    const response = await fetch(url, {
      ...init,
      credentials: 'include',
      headers,
    })

    // Обрабатываем ответ
    if (!response.ok) {
      const errorData: any = await response.json().catch(() => ({
        error: 'Неизвестная ошибка',
        status: response.status,
      }))
      throw new ApiErrorClass(
        errorData.error || 'Неизвестная ошибка',
        errorData.message || errorData.error,
        errorData.code,
        response.status,
        errorData.details
      )
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

  delete<T>(endpoint: string, config?: { params?: Record<string, string | number | boolean | undefined>; body?: unknown }): Promise<T> {
    const { params, body, ...rest } = config || {}
    const headers: Record<string, string> = {}
    if (body) {
      headers['Content-Type'] = 'application/json'
    }
    return this.request<T>(endpoint, { 
      method: 'DELETE',
      ...rest,
      body: body ? JSON.stringify(body) : undefined,
      headers,
      params
    })
  }
}

/**
 * Класс ошибки API
 */
export class ApiErrorClass extends Error {
  error: string
  code?: string
  status?: number
  details?: any
  
  constructor(error: string, message?: string, code?: string, status?: number, details?: any) {
    super(message || error)
    this.name = 'ApiError'
    this.error = error
    this.code = code
    this.status = status
    this.details = details
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
