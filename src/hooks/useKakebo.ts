import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { kakeboService } from '@/services/kakebo.service'
import type { KakeboEntry } from '@/types/kakebo'

// Простая система уведомлений через console
const notify = (title: string, message: string, color: 'green' | 'red' = 'green') => {
  console.log(`[${color.toUpperCase()}] ${title}: ${message}`)
}

export function useKakeboMonth(year: number, month: number) {
  return useQuery({
    queryKey: ['kakebo', year, month],
    queryFn: () => kakeboService.getMonth(year, month),
    staleTime: 1000 * 60 * 5, // 5 минут
  })
}

export function useKakeboSettings() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: kakeboService.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kakebo'] })
      notify('Готово', 'Настройки обновлены', 'green')
    },
    onError: (error: any) => {
      notify('Ошибка', error.message || 'Не удалось обновить настройки', 'red')
    }
  })
}

export function useAddKakeboEntry() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: kakeboService.createEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kakebo'] })
      queryClient.invalidateQueries({ queryKey: ['kakebo', 'budget'] })
      notify('Готово', 'Запись добавлена', 'green')
    },
    onError: (error: any) => {
      notify('Ошибка', error.message || 'Не удалось добавить запись', 'red')
    }
  })
}

export function useUpdateKakeboEntry() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<KakeboEntry> }) =>
      kakeboService.updateEntry(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kakebo'] })
      notify('Готово', 'Запись обновлена', 'green')
    }
  })
}

export function useDeleteKakeboEntry() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: kakeboService.deleteEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kakebo'] })
      notify('Готово', 'Запись удалена', 'green')
    }
  })
}

export function useKakeboReflection(year: number, month: number) {
  return useQuery({
    queryKey: ['kakebo', 'reflection', year, month],
    queryFn: () => kakeboService.getReflection(year, month),
    select: (data) => data.reflection
  })
}

export function useSaveKakeboReflection() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: kakeboService.saveReflection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kakebo', 'reflection'] })
      notify('Готово', 'Рефлексия сохранена', 'green')
    }
  })
}

// ==================== v2.0 Новые хуки ====================

/**
 * Хук для управления категориями
 */
export function useKakeboCategories(params?: { type?: 'SYSTEM' | 'CUSTOM'; includeChildren?: boolean }) {
  return useQuery({
    queryKey: ['kakebo', 'categories', params],
    queryFn: () => kakeboService.getCategories(params),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: kakeboService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kakebo', 'categories'] })
      notify('Готово', 'Категория создана', 'green')
    },
    onError: (error: any) => {
      notify('Ошибка', error.message || 'Не удалось создать категорию', 'red')
    }
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<any> }) =>
      kakeboService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kakebo', 'categories'] })
      notify('Готово', 'Категория обновлена', 'green')
    }
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      kakeboService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kakebo', 'categories'] })
      notify('Готово', 'Категория удалена', 'green')
    },
    onError: (error: any) => {
      notify('Ошибка', error.message || 'Не удалось удалить категорию', 'red')
    }
  })
}

/**
 * Хук для управления целями на месяц
 */
export function useKakeboGoal(year: number, month: number) {
  return useQuery({
    queryKey: ['kakebo', 'goal', year, month],
    queryFn: () => kakeboService.getGoal(year, month),
    select: (data) => data.goal,
    staleTime: 1000 * 60 * 5,
  })
}

export function useSaveKakeboGoal() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: kakeboService.saveGoal,
    onSuccess: (_, variables) => {
      // Инвалидируем конкретный месяц
      queryClient.invalidateQueries({ queryKey: ['kakebo', 'goal', variables.year, variables.month] })
      // Также инвалидируем бюджет т.к. там используется savingGoal
      queryClient.invalidateQueries({ queryKey: ['kakebo', 'budget', variables.year, variables.month] })
      notify('Готово', 'Цель сохранена', 'green')
    },
    onError: (error: any) => {
      notify('Ошибка', error.message || 'Не удалось сохранить цель', 'red')
    }
  })
}

/**
 * Хук для управления фиксированными тратами
 */
export function useKakeboFixedExpenses(params?: { isActive?: boolean; categoryId?: string }) {
  return useQuery({
    queryKey: ['kakebo', 'fixed-expenses', params],
    queryFn: () => kakeboService.getFixedExpenses(params),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateFixedExpense() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: kakeboService.createFixedExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kakebo', 'fixed-expenses'] })
      queryClient.invalidateQueries({ queryKey: ['kakebo', 'budget'] })
      queryClient.invalidateQueries({ queryKey: ['kakebo'] })
      notify('Готово', 'Фиксированная трата создана', 'green')
    },
    onError: (error: any) => {
      notify('Ошибка', error.message || 'Не удалось создать фиксированную трату', 'red')
    }
  })
}

export function useUpdateFixedExpense() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<any> }) =>
      kakeboService.updateFixedExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kakebo', 'fixed-expenses'] })
      queryClient.invalidateQueries({ queryKey: ['kakebo', 'budget'] })
      queryClient.invalidateQueries({ queryKey: ['kakebo'] })
      notify('Готово', 'Фиксированная трата обновлена', 'green')
    }
  })
}

export function useDeleteFixedExpense() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: kakeboService.deleteFixedExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kakebo', 'fixed-expenses'] })
      queryClient.invalidateQueries({ queryKey: ['kakebo', 'budget'] })
      queryClient.invalidateQueries({ queryKey: ['kakebo'] })
      notify('Готово', 'Фиксированная трата удалена', 'green')
    }
  })
}

/**
 * Хук для управления бюджетом
 */
export function useKakeboBudget(year: number, month: number) {
  return useQuery({
    queryKey: ['kakebo', 'budget', year, month],
    queryFn: () => kakeboService.getBudget(year, month),
    staleTime: 1000 * 60 * 5,
  })
}

export function useUpdateKakeboBudget() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ year, month, data }: { year: number; month: number; data: Partial<any> }) =>
      kakeboService.updateBudget(year, month, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kakebo', 'budget'] })
      notify('Готово', 'Бюджет обновлён', 'green')
    }
  })
}

/**
 * Хук для генерации записей из фиксированных трат
 */
export function useGenerateKakeboEntries() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ year, month }: { year: number; month: number }) =>
      kakeboService.generateEntries(year, month),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['kakebo', variables.year, variables.month] })
      notify('Готово', 'Записи сгенерированы', 'green')
    },
    onError: (error: any) => {
      notify('Ошибка', error.message || 'Не удалось сгенерировать записи', 'red')
    }
  })
}
