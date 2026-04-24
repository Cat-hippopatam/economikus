import { api } from './api'
import type { KakeboMonthData, KakeboEntry, KakeboSettings, KakeboReflection } from '@/types/kakebo'

export const kakeboService = {
  /**
   * Получить данные за месяц
   */
  getMonth: (year: number, month: number): Promise<KakeboMonthData> =>
    api.get(`/kakebo?year=${year}&month=${month}`),

  /**
   * Создать запись
   */
  createEntry: (data: Partial<KakeboEntry>): Promise<{ message: string; entry: KakeboEntry }> =>
    api.post('/kakebo', data),

  /**
   * Обновить запись
   */
  updateEntry: (id: string, data: Partial<KakeboEntry>): Promise<{ message: string; entry: KakeboEntry }> =>
    api.put(`/kakebo/${id}`, data),

  /**
   * Удалить запись
   */
  deleteEntry: (id: string): Promise<{ message: string }> =>
    api.delete(`/kakebo/${id}`),

  /**
   * Обновить настройки
   */
  updateSettings: (data: Partial<KakeboSettings>): Promise<{ message: string; settings: KakeboSettings }> =>
    api.put('/kakebo/settings', data),

  /**
   * Получить рефлексию
   */
  getReflection: (year: number, month: number): Promise<{ reflection: KakeboReflection | null }> =>
    api.get(`/kakebo/reflection?year=${year}&month=${month}`),

  /**
   * Сохранить рефлексию
   */
  saveReflection: (data: KakeboReflection): Promise<{ message: string; reflection: KakeboReflection }> =>
    api.post('/kakebo/reflection', data),
}
