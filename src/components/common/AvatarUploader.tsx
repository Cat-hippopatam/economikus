// src/components/common/AvatarUploader.tsx
/**
 * Компонент загрузки аватара
 */

import { useState } from 'react'
import { Group, Avatar, Stack, Text, FileInput, ActionIcon, Tooltip } from '@mantine/core'
import { User, Upload, Trash2 } from 'lucide-react'
import { useAvatarUpload } from '@/hooks'

interface AvatarUploaderProps {
  currentAvatar?: string | null
  size?: number
  onUploadSuccess?: (url: string) => void
}

// Константы - единая точка изменения
const ACCEPTED_TYPES = 'image/jpeg,image/png,image/gif,image/webp'
const HELPER_TEXT = 'JPG, PNG, GIF, WebP. Макс 2MB'

export function AvatarUploader({ 
  currentAvatar, 
  size = 80,
  onUploadSuccess 
}: AvatarUploaderProps) {
  const { uploading, uploadAvatar, deleteAvatar } = useAvatarUpload()
  const [preview, setPreview] = useState<string | null>(null)

  // Обработчик выбора файла
  const handleFileChange = async (file: File | null) => {
    if (!file) return

    // Показываем превью
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    // Загружаем
    const url = await uploadAvatar(file)
    if (url) {
      onUploadSuccess?.(url)
    }
    setPreview(null)
  }

  // Обработчик удаления
  const handleDelete = async () => {
    if (confirm('Удалить аватар?')) {
      await deleteAvatar()
    }
  }

  const displayUrl = preview || currentAvatar

  return (
    <Group>
      <Avatar 
        src={displayUrl} 
        size={size} 
        radius="xl"
      >
        <User size={size * 0.5} />
      </Avatar>
      
      <Stack gap={4}>
        <Text size="sm" fw={500}>Аватар</Text>
        
        <Group gap="xs">
          <FileInput
            placeholder="Выбрать"
            accept={ACCEPTED_TYPES}
            leftSection={<Upload size={14} />}
            onChange={handleFileChange}
            disabled={uploading}
            style={{ width: 150 }}
            size="xs"
          />
          
          {currentAvatar && (
            <Tooltip label="Удалить">
              <ActionIcon 
                variant="light" 
                color="red" 
                onClick={handleDelete}
                loading={uploading}
                size="md"
              >
                <Trash2 size={14} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
        
        <Text size="xs" c="dimmed">
          {HELPER_TEXT}
        </Text>
      </Stack>
    </Group>
  )
}
