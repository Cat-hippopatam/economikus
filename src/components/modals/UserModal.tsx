// src/components/modals/UserModal.tsx
/**
 * Модальное окно редактирования пользователя
 */

import { useEffect } from 'react'
import {
  Modal, Stack, TextInput, Textarea, Select, Group, Button, Avatar, Text
} from '@mantine/core'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { User } from '@/types'

// Схема валидации
const UserSchema = z.object({
  displayName: z.string().min(2, 'Минимум 2 символа').max(100, 'Максимум 100 символов'),
  bio: z.string().max(500, 'Максимум 500 символов').optional(),
  role: z.enum(['USER', 'AUTHOR', 'ADMIN']),
})

type UserFormData = z.infer<typeof UserSchema>

interface UserModalProps {
  opened: boolean
  onClose: () => void
  user: User | null
  onSave: (data: UserFormData) => Promise<void>
  loading?: boolean
}

export function UserModal({ opened, onClose, user, onSave, loading }: UserModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      displayName: '',
      bio: '',
      role: 'USER',
    },
  })

  // Сброс формы при открытии/изменении пользователя
  useEffect(() => {
    if (opened && user) {
      reset({
        displayName: user.displayName || '',
        bio: user.bio || '',
        role: (user.role as 'USER' | 'AUTHOR' | 'ADMIN') || 'USER',
      })
    }
  }, [opened, user, reset])

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Редактировать пользователя"
      size="md"
    >
      <form onSubmit={handleSubmit(onSave)}>
        <Stack gap="md">
          {/* Информация о пользователе */}
          {user && (
            <Group>
              <Avatar src={user.avatarUrl} alt={user.displayName} radius="xl" size="lg" />
              <div>
                <Text fw={500}>{user.displayName}</Text>
                <Text size="sm" c="dimmed">@{user.nickname}</Text>
                <Text size="xs" c="dimmed">{user.email}</Text>
              </div>
            </Group>
          )}

          <TextInput
            label="Имя"
            required
            {...register('displayName')}
            error={errors.displayName?.message}
          />
          <Textarea
            label="О себе"
            rows={2}
            {...register('bio')}
            error={errors.bio?.message}
          />
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                label="Роль"
                data={[
                  { value: 'USER', label: 'Пользователь' },
                  { value: 'AUTHOR', label: 'Автор' },
                  { value: 'ADMIN', label: 'Админ' },
                ]}
                {...field}
                error={errors.role?.message}
              />
            )}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" loading={loading}>
              Сохранить
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
