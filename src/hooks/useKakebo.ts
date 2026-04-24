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
