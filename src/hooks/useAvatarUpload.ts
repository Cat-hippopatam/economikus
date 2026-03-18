// src/hooks/useAvatarUpload.ts
/**
 * Хук для загрузки аватара пользователя
 */

import { useState, useCallback } from 'react'
import { useNotification } from './useNotification'
import { useAuth } from './useAuth'

interface UseAvatarUploadReturn {
  uploading: boolean
  uploadAvatar: (file: File) => Promise<string | null>
  deleteAvatar: () => Promise<void>
}

export function useAvatarUpload(): UseAvatarUploadReturn {
  const [uploading, setUploading] = useState(false)
  const { showError, showSuccess } = useNotification()
  const { refreshProfile } = useAuth()

  // Загрузить аватар
  const uploadAvatar = useCallback(async (file: File): Promise<string | null> => {
    // Валидация файла
    if (!file.type.startsWith('image/')) {
      showError('Выберите изображение')
      return null
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      showError('Максимальный размер файла: 5MB')
      return null
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Ошибка загрузки')
      }

      const data = await response.json()
      
      // Обновляем профиль
      await refreshProfile?.()
      
      showSuccess('Аватар обновлён')
      return data.avatarUrl
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка загрузки'
      showError(message)
      return null
    } finally {
      setUploading(false)
    }
  }, [showError, showSuccess, refreshProfile])

  // Удалить аватар
  const deleteAvatar = useCallback(async () => {
    setUploading(true)
    try {
      await fetch('/api/user/avatar', {
        method: 'DELETE',
        credentials: 'include',
      })
      
      await refreshProfile?.()
      showSuccess('Аватар удалён')
    } catch (error) {
      showError('Ошибка удаления аватара')
    } finally {
      setUploading(false)
    }
  }, [showError, showSuccess, refreshProfile])

  return {
    uploading,
    uploadAvatar,
    deleteAvatar,
  }
}
