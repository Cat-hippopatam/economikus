// src/pages/author/AuthorCourseFormPage.tsx
/**
 * Страница создания/редактирования курса автора
 * Использует переиспользуемые компоненты: LoadingState, StatusBadge
 * Использует принципы оптимизации: единая точка изменения (константы)
 */

import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Stack,
  Title,
  Text,
  TextInput,
  Textarea,
  Select,
  Switch,
  Button,
  Group,
  Card,
  Image,
  Badge,
  MultiSelect,
  Grid,
} from '@mantine/core'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, ArrowLeft, Upload, Eye } from 'lucide-react'
import { useAuthorCourse } from '@/hooks/useAuthorCourse'
import { LoadingState } from '@/components/common'
import { useTagOptions } from '@/hooks/useTagOptions'
import { COURSE_STATUSES } from '@/constants'
import { DIFFICULTY_OPTIONS } from '@/constants/difficulty'

// Схема валидации
const CourseSchema = z.object({
  title: z.string().min(3, 'Название должно содержать минимум 3 символа').max(200),
  slug: z.string().min(3, 'URL должен содержать минимум 3 символа').max(100).regex(/^[a-z0-9-]+$/, 'Только латинские буквы, цифры и дефисы'),
  description: z.string().max(2000).optional(),
  coverImage: z.string().optional(),
  difficultyLevel: z.string().optional(),
  isPremium: z.boolean(),
  status: z.string(),
  tags: z.array(z.string()).optional(),
})

type CourseFormValues = z.infer<typeof CourseSchema>

// Генерация slug из названия
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function AuthorCourseFormPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id

  const { course, loading, saving, fetchCourse, saveCourse, uploadCover } = useAuthorCourse()
  const { tags } = useTagOptions()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(CourseSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      coverImage: '',
      difficultyLevel: '',
      isPremium: false,
      status: 'DRAFT',
      tags: [],
    },
  })

  const coverImage = watch('coverImage')
  const title = watch('title')

  // Загрузка курса при редактировании
  useEffect(() => {
    if (isEdit && id) {
      fetchCourse(id)
    }
  }, [isEdit, id])

  // Заполнение формы после загрузки курса
  useEffect(() => {
    if (course && isEdit) {
      reset({
        title: course.title,
        slug: course.slug,
        description: course.description || '',
        coverImage: course.coverImage || '',
        difficultyLevel: course.difficultyLevel || '',
        isPremium: course.isPremium,
        status: course.status,
        tags: course.tags || [],
      })
    }
  }, [course, isEdit])

  // Автогенерация slug при изменении названия (только при создании)
  useEffect(() => {
    if (!isEdit && title && title.length > 3) {
      const currentSlug = watch('slug')
      if (!currentSlug || currentSlug === generateSlug(watch('title'))) {
        setValue('slug', generateSlug(title))
      }
    }
  }, [title, isEdit])

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = await uploadCover(file)
      if (url) {
        setValue('coverImage', url)
      }
    }
  }

  const onSubmit = async (data: CourseFormValues) => {
    const courseData = {
      title: data.title,
      slug: data.slug,
      description: data.description || null,
      coverImage: data.coverImage || null,
      difficultyLevel: data.difficultyLevel || null,
      isPremium: data.isPremium,
      status: data.status,
      tags: data.tags || [],
    }
    const success = await saveCourse(courseData, id)
    if (success) {
      navigate('/author/courses')
    }
  }

  // Подготовка тегов для MultiSelect
  const tagOptions = tags.map((tag) => ({
    value: tag.id,
    label: tag.name,
  }))

  if (loading) {
    return <LoadingState text="Загрузка курса..." />
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="lg">
        {/* Заголовок */}
        <Group justify="space-between">
          <Group>
            <Button
              variant="subtle"
              leftSection={<ArrowLeft size={16} />}
              onClick={() => navigate('/author/courses')}
            >
              Назад
            </Button>
            <Title order={2}>
              {isEdit ? 'Редактирование курса' : 'Создание курса'}
            </Title>
          </Group>
          <Group>
            <Button
              variant="light"
              leftSection={<Eye size={16} />}
              onClick={() => id && navigate(`/courses/${watch('slug')}`)}
              disabled={!isEdit}
            >
              Предпросмотр
            </Button>
            <Button
              type="submit"
              leftSection={<Save size={16} />}
              loading={saving}
            >
              {isEdit ? 'Сохранить' : 'Создать'}
            </Button>
          </Group>
        </Group>

        <Grid>
          {/* Основные поля */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap="md">
              <Card withBorder padding="md">
                <Stack gap="md">
                  <Text fw={500}>Основная информация</Text>
                  
                  <TextInput
                    label="Название курса"
                    placeholder="Например: Основы инвестирования"
                    required
                    {...register('title')}
                    error={errors.title?.message}
                  />

                  <TextInput
                    label="URL-адрес (slug)"
                    placeholder="osnovy-investirovaniya"
                    description="Используется в URL курса"
                    required
                    {...register('slug')}
                    error={errors.slug?.message}
                  />

                  <Textarea
                    label="Описание"
                    placeholder="Опишите, чему научится студент после прохождения курса"
                    minRows={4}
                    maxRows={8}
                    {...register('description')}
                    error={errors.description?.message}
                  />
                </Stack>
              </Card>

              <Card withBorder padding="md">
                <Stack gap="md">
                  <Text fw={500}>Настройки</Text>
                  
                  <Grid>
                    <Grid.Col span={6}>
                      <Controller
                        name="difficultyLevel"
                        control={control}
                        render={({ field }) => (
                          <Select
                            label="Уровень сложности"
                            placeholder="Выберите уровень"
                            data={DIFFICULTY_OPTIONS}
                            value={field.value || null}
                            onChange={(value) => field.onChange(value || null)}
                            clearable
                          />
                        )}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <Select
                            label="Статус"
                            placeholder="Выберите статус"
                            data={COURSE_STATUSES}
                            value={field.value || 'DRAFT'}
                            onChange={(value) => field.onChange(value || 'DRAFT')}
                            required
                          />
                        )}
                      />
                    </Grid.Col>
                  </Grid>

                  <Controller
                    name="tags"
                    control={control}
                    render={({ field }) => (
                      <MultiSelect
                        label="Теги"
                        placeholder="Выберите теги"
                        data={tagOptions}
                        value={field.value || []}
                        onChange={(value) => field.onChange(value)}
                        searchable
                        clearable
                        maxValues={5}
                      />
                    )}
                  />

                  <Switch
                    label="Премиум курс"
                    description="Доступен только по подписке"
                    {...register('isPremium')}
                  />
                </Stack>
              </Card>
            </Stack>
          </Grid.Col>

          {/* Обложка */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card withBorder padding="md">
              <Stack gap="md">
                <Text fw={500}>Обложка курса</Text>
                
                {coverImage ? (
                  <div style={{ position: 'relative' }}>
                    <Image
                      src={coverImage}
                      alt="Обложка курса"
                      radius="md"
                      style={{ aspectRatio: '16/9', objectFit: 'cover' }}
                    />
                    <Button
                      size="xs"
                      variant="danger"
                      style={{ position: 'absolute', top: 8, right: 8 }}
                      onClick={() => setValue('coverImage', '')}
                    >
                      Удалить
                    </Button>
                  </div>
                ) : (
                  <label style={{ cursor: 'pointer' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      style={{ display: 'none' }}
                    />
                    <Card
                      withBorder
                      padding="xl"
                      style={{
                        borderStyle: 'dashed',
                        textAlign: 'center',
                        aspectRatio: '16/9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Stack gap="xs" align="center">
                        <Upload size={32} style={{ opacity: 0.5 }} />
                        <Text size="sm" c="dimmed">
                          Нажмите для загрузки
                        </Text>
                        <Text size="xs" c="dimmed">
                          PNG, JPG до 2MB
                        </Text>
                      </Stack>
                    </Card>
                  </label>
                )}

                {watch('isPremium') && (
                  <Badge color="yellow" variant="light">
                    Премиум курс
                  </Badge>
                )}
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </Stack>
    </form>
  )
}
