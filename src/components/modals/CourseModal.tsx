// src/components/modals/CourseModal.tsx
/**
 * Модальное окно создания/редактирования курса
 */

import { useEffect } from 'react'
import {
  Modal, Stack, TextInput, Textarea, Select, NumberInput,
  Checkbox, MultiSelect, Group, Button
} from '@mantine/core'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Course, Tag } from '@/types'

// Схема валидации
const CourseSchema = z.object({
  title: z.string().min(3, 'Минимум 3 символа').max(255, 'Максимум 255 символов'),
  slug: z.string().min(3, 'Минимум 3 символа').max(100, 'Максимум 100 символов'),
  description: z.string().max(2000, 'Максимум 2000 символов').optional(),
  coverImage: z.string().url('Неверный URL').optional().or(z.literal('')),
  difficultyLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  duration: z.number().min(0).optional(),
  isPremium: z.boolean(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  tagIds: z.array(z.string()).optional(),
})

type CourseFormData = z.infer<typeof CourseSchema>

interface CourseModalProps {
  opened: boolean
  onClose: () => void
  course: Course | null
  tags: Tag[]
  onSave: (data: CourseFormData) => Promise<void>
  loading?: boolean
}

export function CourseModal({ opened, onClose, course, tags, onSave, loading }: CourseModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
  } = useForm<CourseFormData>({
    resolver: zodResolver(CourseSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      coverImage: '',
      difficultyLevel: 'BEGINNER',
      duration: 0,
      isPremium: false,
      status: 'DRAFT',
      tagIds: [],
    },
  })

  // Сброс формы при открытии/изменении курса
  useEffect(() => {
    if (opened) {
      reset({
        title: course?.title || '',
        slug: course?.slug || '',
        description: course?.description || '',
        coverImage: course?.coverImage || '',
        difficultyLevel: course?.difficultyLevel || 'BEGINNER',
        duration: course?.duration || 0,
        isPremium: course?.isPremium || false,
        status: (course?.status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') || 'DRAFT',
        tagIds: course?.tags?.map(t => t.id) || [],
      })
    }
  }, [opened, course, reset])

  // Автогенерация slug из title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    register('title').onChange(e)
    if (!course) {
      const slug = e.target.value
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
      setValue('slug', slug)
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={course ? 'Редактировать курс' : 'Создать курс'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSave)}>
        <Stack gap="md">
          <TextInput
            label="Название"
            required
            {...register('title')}
            onChange={handleTitleChange}
            error={errors.title?.message}
          />
          <TextInput
            label="Slug (URL)"
            required
            {...register('slug')}
            error={errors.slug?.message}
            description="URL-идентификатор курса"
          />
          <Textarea
            label="Описание"
            rows={3}
            {...register('description')}
            error={errors.description?.message}
          />
          <TextInput
            label="URL обложки"
            {...register('coverImage')}
            error={errors.coverImage?.message}
          />
          <Group grow>
            <Controller
              name="difficultyLevel"
              control={control}
              render={({ field }) => (
                <Select
                  label="Уровень сложности"
                  data={[
                    { value: 'BEGINNER', label: 'Начинающий' },
                    { value: 'INTERMEDIATE', label: 'Средний' },
                    { value: 'ADVANCED', label: 'Продвинутый' },
                  ]}
                  {...field}
                  error={errors.difficultyLevel?.message}
                />
              )}
            />
            <Controller
              name="duration"
              control={control}
              render={({ field }) => (
                <NumberInput
                  label="Длительность (мин)"
                  {...field}
                  min={0}
                  error={errors.duration?.message}
                />
              )}
            />
          </Group>
          <Group grow>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  label="Статус"
                  data={[
                    { value: 'DRAFT', label: 'Черновик' },
                    { value: 'PUBLISHED', label: 'Опубликован' },
                    { value: 'ARCHIVED', label: 'Архив' },
                  ]}
                  {...field}
                  error={errors.status?.message}
                />
              )}
            />
            <Controller
              name="isPremium"
              control={control}
              render={({ field }) => (
                <Checkbox
                  label="Премиум курс"
                  checked={field.value}
                  onChange={field.onChange}
                  mt="xl"
                />
              )}
            />
          </Group>
          <Controller
            name="tagIds"
            control={control}
            render={({ field }) => (
              <MultiSelect
                label="Теги"
                data={tags.map(t => ({ value: t.id, label: t.name }))}
                {...field}
                error={errors.tagIds?.message}
              />
            )}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" loading={loading}>
              {course ? 'Сохранить' : 'Создать'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
