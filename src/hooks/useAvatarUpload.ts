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

// Константы - единая точка изменения
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

export function useAvatarUpload(): UseAvatarUploadReturn {
  const [uploading, setUploading] = useState(false)
  const { showError, showSuccess } = useNotification()
  const { refreshProfile } = useAuth()

  // Загрузить аватар
  const uploadAvatar = useCallback(async (file: File): Promise<string | null> => {
    console.log('[useAvatarUpload] Starting upload:', file.name, file.size, file.type)
    
    // Валидация типа файла
    if (!ALLOWED_TYPES.includes(file.type)) {
      showError('Разрешены только JPG, PNG, GIF, WebP')
      return null
    }

    // Валидация размера файла
    if (file.size > MAX_FILE_SIZE) {
      showError('Максимальный размер файла: 2MB')
      return null
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      console.log('[useAvatarUpload] FormData created, sending request...')

      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      console.log('[useAvatarUpload] Response status:', response.status)

      const data = await response.json()
      console.log('[useAvatarUpload] Response data:', data)
      
      if (!response.ok) {
        throw new Error(data.error || 'Ошибка загрузки')
      }
      
      // Обновляем профиль
      await refreshProfile?.()
      console.log('[useAvatarUpload] Profile refreshed')
      
      showSuccess('Аватар обновлён')
      return data.avatarUrl
    } catch (error) {
      console.error('[useAvatarUpload] Error:', error)
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
      const response = await fetch('/api/user/avatar', {
        method: 'DELETE',
        credentials: 'include',
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Ошибка удаления')
      }
      
      await refreshProfile?.()
      showSuccess('Аватар удалён')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка удаления аватара'
      showError(message)
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
