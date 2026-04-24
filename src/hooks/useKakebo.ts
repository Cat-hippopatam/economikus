import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { kakeboService } from '@/services/kakebo.service'
import { notifications } from '@mantine/notifications'
import type { KakeboEntry, KakeboReflection } from '@/types/kakebo'

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
      notifications.show({
        title: 'Готово',
        message: 'Настройки обновлены',
        color: 'green'
      })
    },
    onError: (error) => {
      notifications.show({
        title: 'Ошибка',
        message: error.message,
        color: 'red'
      })
    }
  })
}

export function useAddKakeboEntry() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: kakeboService.createEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kakebo'] })
      notifications.show({
        title: 'Готово',
        message: 'Запись добавлена',
        color: 'green'
      })
    },
    onError: (error) => {
      notifications.show({
        title: 'Ошибка',
        message: error.message,
        color: 'red'
      })
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
      notifications.show({
        title: 'Готово',
        message: 'Запись обновлена',
        color: 'green'
      })
    }
  })
}

export function useDeleteKakeboEntry() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: kakeboService.deleteEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kakebo'] })
      notifications.show({
        title: 'Готово',
        message: 'Запись удалена',
        color: 'green'
      })
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
      notifications.show({
        title: 'Готово',
        message: 'Рефлексия сохранена',
        color: 'green'
      })
    }
  })
}
