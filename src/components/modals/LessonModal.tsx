// src/components/modals/LessonModal.tsx
/**
 * Модальное окно создания/редактирования урока
 */

import { useEffect } from 'react'
import {
  Modal, Stack, TextInput, Textarea, Select, NumberInput,
  Checkbox, MultiSelect, Group, Button
} from '@mantine/core'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Lesson, Tag } from '@/types'

// Схема валидации
const LessonSchema = z.object({
  title: z.string().min(3, 'Минимум 3 символа').max(255, 'Максимум 255 символов'),
  slug: z.string().min(3, 'Минимум 3 символа').max(100, 'Максимум 100 символов'),
  description: z.string().max(2000, 'Максимум 2000 символов').optional(),
  lessonType: z.enum(['ARTICLE', 'VIDEO', 'AUDIO', 'QUIZ', 'CALCULATOR']),
  duration: z.number().min(0).optional(),
  isPremium: z.boolean(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  tagIds: z.array(z.string()).optional(),
})

type LessonFormData = z.infer<typeof LessonSchema>

interface LessonModalProps {
  opened: boolean
  onClose: () => void
  lesson: Lesson | null
  tags: Tag[]
  onSave: (data: LessonFormData) => Promise<void>
  loading?: boolean
}

export function LessonModal({ opened, onClose, lesson, tags, onSave, loading }: LessonModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
  } = useForm<LessonFormData>({
    resolver: zodResolver(LessonSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      lessonType: 'ARTICLE',
      duration: 0,
      isPremium: false,
      status: 'DRAFT',
      tagIds: [],
    },
  })

  // Сброс формы при открытии/изменении урока
  useEffect(() => {
    if (opened) {
      reset({
        title: lesson?.title || '',
        slug: lesson?.slug || '',
        description: lesson?.description || '',
        lessonType: (lesson?.lessonType as 'ARTICLE' | 'VIDEO' | 'AUDIO' | 'QUIZ' | 'CALCULATOR') || 'ARTICLE',
        duration: lesson?.duration || 0,
        isPremium: lesson?.isPremium || false,
        status: (lesson?.status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') || 'DRAFT',
        tagIds: lesson?.tags?.map(t => t.id) || [],
      })
    }
  }, [opened, lesson, reset])

  // Автогенерация slug из title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    register('title').onChange(e)
    if (!lesson) {
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
      title={lesson ? 'Редактировать урок' : 'Создать урок'}
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
            description="URL-идентификатор урока"
          />
          <Textarea
            label="Описание"
            rows={2}
            {...register('description')}
            error={errors.description?.message}
          />
          <Group grow>
            <Controller
              name="lessonType"
              control={control}
              render={({ field }) => (
                <Select
                  label="Тип урока"
                  data={[
                    { value: 'ARTICLE', label: 'Статья' },
                    { value: 'VIDEO', label: 'Видео' },
                    { value: 'AUDIO', label: 'Аудио' },
                    { value: 'QUIZ', label: 'Тест' },
                    { value: 'CALCULATOR', label: 'Калькулятор' },
                  ]}
                  {...field}
                  error={errors.lessonType?.message}
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
                  label="Премиум урок"
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
              {lesson ? 'Сохранить' : 'Создать'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
