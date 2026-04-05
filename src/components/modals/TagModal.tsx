// src/components/modals/TagModal.tsx
/**
 * Модальное окно создания/редактирования тега
 */

import React from 'react'
import { Modal, Stack, TextInput, ColorInput, Group, Button } from '@mantine/core'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Tag } from '@/types'

// Схема валидации
const TagSchema = z.object({
  name: z.string().min(2, 'Минимум 2 символа').max(50, 'Максимум 50 символов'),
  slug: z.string().min(2, 'Минимум 2 символа').max(50, 'Максимум 50 символов'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Неверный формат цвета'),
})

type TagFormData = z.infer<typeof TagSchema>

interface TagModalProps {
  opened: boolean
  onClose: () => void
  tag: Tag | null
  onSave: (data: TagFormData) => Promise<void>
  loading?: boolean
}

export function TagModal({ opened, onClose, tag, onSave, loading }: TagModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<TagFormData>({
    resolver: zodResolver(TagSchema),
    defaultValues: {
      name: '',
      slug: '',
      color: '#3B82F6',
    },
  })

  // Сброс формы при открытии/изменении тега
  React.useEffect(() => {
    if (opened) {
      reset({
        name: tag?.name || '',
        slug: tag?.slug || '',
        color: tag?.color || '#3B82F6',
      })
    }
  }, [opened, tag, reset])

  // Автогенерация slug из name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    register('name').onChange(e)
    if (!tag) {
      const slug = e.target.value
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
      reset({ ...watch(), slug })
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={tag ? 'Редактировать тег' : 'Создать тег'}
    >
      <form onSubmit={handleSubmit(onSave)}>
        <Stack gap="md">
          <TextInput
            label="Название"
            required
            {...register('name')}
            onChange={handleNameChange}
            error={errors.name?.message}
          />
          <TextInput
            label="Slug"
            required
            {...register('slug')}
            error={errors.slug?.message}
            description="URL-идентификатор тега"
          />
          <ColorInput
            label="Цвет"
            {...register('color')}
            error={errors.color?.message}
            onChange={(value) => setValue('color', value)}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" loading={loading}>
              {tag ? 'Сохранить' : 'Создать'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
