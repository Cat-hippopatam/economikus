import { api } from './api'
import type {
  KakeboMonthData,
  KakeboEntry,
  KakeboSettings,
  KakeboReflection,
  KakeboCategory,
  KakeboMonthlyGoal,
  KakeboFixedExpense,
  KakeboMonthlyBudget,
  KakeboBudgetCalculation,
} from '@/types/kakebo'

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

  // ==================== v2.0 Новые эндпоинты ====================

  /**
   * Получить все категории
   */
  getCategories: (params?: { type?: 'SYSTEM' | 'CUSTOM'; includeChildren?: boolean }): Promise<{ categories: KakeboCategory[] }> =>
    api.get('/kakebo/categories' + (params ? `?type=${params.type}&includeChildren=${params.includeChildren}` : '')),

  /**
   * Создать категорию
   */
  createCategory: (data: Partial<KakeboCategory>): Promise<{ message: string; category: KakeboCategory }> =>
    api.post('/kakebo/categories', data),

  /**
   * Обновить категорию
   */
  updateCategory: (id: string, data: Partial<KakeboCategory>): Promise<{ message: string; category: KakeboCategory }> =>
    api.put(`/kakebo/categories/${id}`, data),

  /**
   * Удалить категорию
   */
  deleteCategory: (id: string): Promise<{ message: string }> =>
    api.delete(`/kakebo/categories/${id}`),

  /**
   * Получить цель на месяц
   */
  getGoal: (year: number, month: number): Promise<{ goal: KakeboMonthlyGoal | null }> =>
    api.get(`/kakebo/goals?year=${year}&month=${month}`),

  /**
   * Сохранить цель на месяц
   */
  saveGoal: (data: KakeboMonthlyGoal): Promise<{ message: string; goal: KakeboMonthlyGoal }> =>
    api.post('/kakebo/goals', data),

  /**
   * Получить фиксированные траты
   */
  getFixedExpenses: (params?: { isActive?: boolean; categoryId?: string }): Promise<{ fixedExpenses: KakeboFixedExpense[] }> =>
    api.get('/kakebo/fixed-expenses' + (params ? `?isActive=${params.isActive}&categoryId=${params.categoryId}` : '')),

  /**
   * Создать фиксированную трату
   */
  createFixedExpense: (data: Partial<KakeboFixedExpense>): Promise<{ message: string; fixedExpense: KakeboFixedExpense }> =>
    api.post('/kakebo/fixed-expenses', data),

  /**
   * Обновить фиксированную трату
   */
  updateFixedExpense: (id: string, data: Partial<KakeboFixedExpense>): Promise<{ message: string; fixedExpense: KakeboFixedExpense }> =>
    api.put(`/kakebo/fixed-expenses/${id}`, data),

  /**
   * Удалить фиксированную трату
   */
  deleteFixedExpense: (id: string): Promise<{ message: string }> =>
    api.delete(`/kakebo/fixed-expenses/${id}`),

  /**
   * Получить бюджет и расчёт уравнения
   */
  getBudget: (year: number, month: number): Promise<{
    budget: KakeboMonthlyBudget
    calculation: KakeboBudgetCalculation
    warning: string | null
  }> =>
    api.get(`/kakebo/budget/${year}/${month}`),

  /**
   * Обновить бюджет
   */
  updateBudget: (year: number, month: number, data: Partial<KakeboMonthlyBudget>): Promise<{
    message: string
    budget: KakeboMonthlyBudget
    calculation: KakeboBudgetCalculation
  }> =>
    api.put(`/kakebo/budget/${year}/${month}`, data),

  /**
   * Сгенерировать записи из фиксированных трат
   */
  generateEntries: (year: number, month: number): Promise<{ message: string; result: { created: number; skipped: number; errors: string[] } }> =>
    api.post('/kakebo/generate', { year, month }),
}
