// src/pages/author/AuthorLessonFormPage.tsx
/**
 * Страница создания/редактирования урока автора
 */

import { useEffect, useState } from 'react'
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
  NumberInput,
  Tabs,
  Paper,
} from '@mantine/core'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, ArrowLeft, Upload, FileText, Eye } from 'lucide-react'
import { useAuthorLesson } from '@/hooks/useAuthorLesson'
import { useCourseModules } from '@/hooks/useCourseModules'
import { useLessonContent, type QuizQuestion } from '@/hooks/useLessonContent'
import { LoadingState, MarkdownContent } from '@/components/common'
import { useTagOptions } from '@/hooks/useTagOptions'
import { AUTHOR_LESSON_STATUSES_SELECT, AUTHOR_LESSON_TYPES } from '@/constants/author'

// Схема валидации
const LessonSchema = z.object({
  title: z.string().min(3, 'Название должно содержать минимум 3 символа').max(200),
  slug: z.string().min(3, 'URL должен содержать минимум 3 символа').max(100).regex(/^[a-z0-9-]+$/, 'Только латинские буквы, цифры и дефисы'),
  description: z.string().max(2000).optional(),
  lessonType: z.string().min(1, 'Выберите тип урока'),
  moduleId: z.string().nullable().optional(),
  coverImage: z.string().optional(),
  duration: z.number().min(0).max(600).nullable().optional(),
  isPremium: z.boolean(),
  status: z.string(),
  tags: z.array(z.string()).optional(),
})

type LessonFormValues = z.infer<typeof LessonSchema>

// Генерация slug из названия
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Компонент редактирования текстового контента
function TextContentEditor({ 
  initialContent, 
  onSave, 
  saving 
}: { 
  initialContent: string
  onSave: (body: string) => Promise<boolean>
  saving: boolean 
}) {
  const [body, setBody] = useState(initialContent)
  const [preview, setPreview] = useState(false)
  const wordCount = body.trim().split(/\s+/).filter(w => w.length > 0).length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  const handleSave = async () => {
    await onSave(body)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        setBody(content)
      }
      reader.readAsText(file)
    }
  }

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Text fw={500}>Текст урока (Markdown)</Text>
        <Group gap="xs">
          <Button
            size="xs"
            variant={preview ? 'filled' : 'light'}
            leftSection={<Eye size={14} />}
            onClick={() => setPreview(!preview)}
          >
            {preview ? 'Редактировать' : 'Предпросмотр'}
          </Button>
          <label>
            <input
              type="file"
              accept=".md,.txt"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <Button size="xs" variant="light" component="span">
              Загрузить .md
            </Button>
          </label>
        </Group>
      </Group>

      {preview ? (
        <Card withBorder padding="md" style={{ minHeight: 400 }}>
          <MarkdownContent content={body} />
        </Card>
      ) : (
        <Textarea
          placeholder="# Заголовок урока

Напишите содержание урока в формате Markdown...

## Пример кода

```javascript
const example = 'Hello, World!'
console.log(example)
```

## Списки

- Пункт 1
- Пункт 2
- Пункт 3

## Таблицы

| Столбец 1 | Столбец 2 |
|----------|----------|
| Значение | Значение |
"
          minRows={20}
          maxRows={40}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          autosize
          styles={{
            input: {
              fontFamily: 'monospace',
              fontSize: '14px',
              lineHeight: '1.6',
            }
          }}
        />
      )}
      
      <Group justify="space-between">
        <Group gap="md">
          <Text size="sm" c="dimmed">
            {wordCount} слов
          </Text>
          <Text size="sm" c="dimmed">
            ~{readingTime} мин чтения
          </Text>
          <Text size="sm" c="dimmed">
            Markdown поддерживается
          </Text>
        </Group>
        <Button onClick={handleSave} loading={saving} disabled={!body.trim()}>
          Сохранить текст
        </Button>
      </Group>
    </Stack>
  )
}

// Компонент редактирования видео контента
function VideoContentEditor({ 
  initialUrl, 
  onSave, 
  saving 
}: {
  initialUrl: string
  onSave: (data: { videoUrl: string }) => Promise<boolean>
  saving: boolean 
}) {
  const [videoUrl, setVideoUrl] = useState(initialUrl)

  const handleSave = async () => {
    await onSave({ videoUrl })
  }

  return (
    <Stack gap="md">
      <TextInput
        label="Ссылка на видео"
        placeholder="https://youtube.com/watch?v=..."
        description="Поддерживаются YouTube, RuTube, Vimeo"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />
      {videoUrl && (
        <Text size="sm" c="dimmed">
          Провайдер определится автоматически
        </Text>
      )}
      <Group justify="flex-end">
        <Button onClick={handleSave} loading={saving} disabled={!videoUrl.trim()}>
          Сохранить видео
        </Button>
      </Group>
    </Stack>
  )
}

// Компонент редактирования аудио контента
function AudioContentEditor({ 
  initialUrl, 
  onSave, 
  saving 
}: { 
  initialUrl: string
  onSave: (data: { audioUrl: string }) => Promise<boolean>
  saving: boolean 
}) {
  const [audioUrl, setAudioUrl] = useState(initialUrl)

  const handleSave = async () => {
    await onSave({ audioUrl })
  }

  return (
    <Stack gap="md">
      <TextInput
        label="Ссылка на аудио"
        placeholder="https://example.com/audio.mp3"
        description="Прямая ссылка на аудиофайл"
        value={audioUrl}
        onChange={(e) => setAudioUrl(e.target.value)}
      />
      <Group justify="flex-end">
        <Button onClick={handleSave} loading={saving} disabled={!audioUrl.trim()}>
          Сохранить аудио
        </Button>
      </Group>
    </Stack>
  )
}

// Компонент редактирования теста
function QuizContentEditor({ 
  initialQuestions, 
  initialPassingScore,
  onSave, 
  saving 
}: { 
  initialQuestions: QuizQuestion[]
  initialPassingScore: number
  onSave: (data: { questions: QuizQuestion[]; passingScore: number }) => Promise<boolean>
  saving: boolean 
}) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(initialQuestions.length > 0 ? initialQuestions : [])
  const [passingScore, setPassingScore] = useState(initialPassingScore)

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: `q-${Date.now()}`,
      text: '',
      options: [
        { id: `o-${Date.now()}-1`, text: '' },
        { id: `o-${Date.now()}-2`, text: '' },
      ],
      correctOptionId: '',
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (index: number, updates: Partial<QuizQuestion>) => {
    setQuestions(prev => prev.map((q, i) => i === index ? { ...q, ...updates } : q))
  }

  const removeQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index))
  }

  const addOption = (questionIndex: number) => {
    const newOption = { id: `o-${Date.now()}`, text: '' }
    setQuestions(prev => prev.map((q, i) => 
      i === questionIndex 
        ? { ...q, options: [...q.options, newOption] }
        : q
    ))
  }

  const updateOption = (questionIndex: number, optionIndex: number, text: string) => {
    setQuestions(prev => prev.map((q, i) => 
      i === questionIndex 
        ? { 
            ...q, 
            options: q.options.map((o, oi) => oi === optionIndex ? { ...o, text } : o)
          }
        : q
    ))
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    setQuestions(prev => prev.map((q, i) => 
      i === questionIndex 
        ? { ...q, options: q.options.filter((_, oi) => oi !== optionIndex) }
        : q
    ))
  }

  const handleSave = async () => {
    await onSave({ questions, passingScore })
  }

  return (
    <Stack gap="md">
      {questions.map((question, qIndex) => (
        <Card key={question.id} withBorder padding="md">
          <Stack gap="sm">
            <Group justify="space-between">
              <Text fw={500}>Вопрос {qIndex + 1}</Text>
              <Button 
                size="xs" 
                variant="subtle" 
                color="red"
                onClick={() => removeQuestion(qIndex)}
              >
                Удалить
              </Button>
            </Group>
            <TextInput
              placeholder="Текст вопроса"
              value={question.text}
              onChange={(e) => updateQuestion(qIndex, { text: e.target.value })}
            />
            <Stack gap="xs">
              <Text size="sm" c="dimmed">Варианты ответов:</Text>
              {question.options.map((option, oIndex) => (
                <Group key={option.id} gap="xs">
                  <Button
                    size="xs"
                    variant={question.correctOptionId === option.id ? 'filled' : 'subtle'}
                    color={question.correctOptionId === option.id ? 'green' : 'gray'}
                    onClick={() => updateQuestion(qIndex, { correctOptionId: option.id })}
                  >
                    ✓
                  </Button>
                  <TextInput
                    placeholder={`Вариант ${oIndex + 1}`}
                    value={option.text}
                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                    style={{ flex: 1 }}
                  />
                  {question.options.length > 2 && (
                    <Button
                      size="xs"
                      variant="subtle"
                      color="red"
                      onClick={() => removeOption(qIndex, oIndex)}
                    >
                      ×
                    </Button>
                  )}
                </Group>
              ))}
              <Button size="xs" variant="light" onClick={() => addOption(qIndex)}>
                + Добавить вариант
              </Button>
            </Stack>
          </Stack>
        </Card>
      ))}
      
      <Button variant="light" onClick={addQuestion} fullWidth>
        + Добавить вопрос
      </Button>

      <NumberInput
        label="Проходной балл (%)"
        value={passingScore}
        onChange={(v) => setPassingScore(Number(v) || 70)}
        min={1}
        max={100}
      />

      <Group justify="flex-end">
        <Button 
          onClick={handleSave} 
          loading={saving} 
          disabled={questions.length === 0 || questions.some(q => !q.text || q.options.length < 2 || !q.correctOptionId)}
        >
          Сохранить тест
        </Button>
      </Group>
    </Stack>
  )
}

export function AuthorLessonFormPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id

  const { lesson, loading, saving, fetchLesson, saveLesson, uploadCover } = useAuthorLesson()
  const { courses } = useCourseModules(undefined)
  const { tags } = useTagOptions()
  const {
    content, 
    saving: contentSaving, 
    saveTextContent, 
    saveVideoContent, 
    saveAudioContent, 
    saveQuizContent 
  } = useLessonContent(id)

  const [activeTab, setActiveTab] = useState<string | null>('settings')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<LessonFormValues>({
    resolver: zodResolver(LessonSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      lessonType: '',
      moduleId: null,
      coverImage: '',
      duration: null,
      isPremium: false,
      status: 'DRAFT',
      tags: [],
    },
  })

  const coverImage = watch('coverImage')
  const title = watch('title')

  // Загрузка урока при редактировании
  useEffect(() => {
    if (isEdit && id) {
      fetchLesson(id)
    }
  }, [isEdit, id])

  // Заполнение формы после загрузки урока
  useEffect(() => {
    if (lesson && isEdit) {
      reset({
        title: lesson.title,
        slug: lesson.slug,
        description: lesson.description || '',
        lessonType: lesson.lessonType,
        moduleId: lesson.moduleId,
        coverImage: lesson.coverImage || '',
        duration: lesson.duration,
        isPremium: lesson.isPremium,
        status: lesson.status,
        tags: lesson.tags || [],
      })
    }
  }, [lesson, isEdit])

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

  const onSubmit = async (data: LessonFormValues) => {
    const lessonData = {
      title: data.title,
      slug: data.slug,
      description: data.description || null,
      lessonType: data.lessonType,
      moduleId: data.moduleId || null,
      coverImage: data.coverImage || null,
      duration: data.duration || null,
      isPremium: data.isPremium,
      status: data.status,
      tags: data.tags || [],
    }
    const success = await saveLesson(lessonData, id)
    if (success) {
      navigate('/author/lessons')
    }
  }

  if (loading && isEdit) {
    return <LoadingState text="Загрузка урока..." />
  }

  return (
    <Stack gap="lg">
      {/* Заголовок */}
      <Group justify="space-between">
        <Group>
          <Button
            variant="subtle"
            leftSection={<ArrowLeft size={16} />}
            onClick={() => navigate('/author/lessons')}
          >
            Назад
          </Button>
          <Title order={2}>
            {isEdit ? 'Редактирование урока' : 'Создание урока'}
          </Title>
        </Group>
        <Group>
          <Button
            type="submit"
            form="lesson-form"
            leftSection={<Save size={16} />}
            loading={saving}
            onClick={handleSubmit(onSubmit)}
          >
            {isEdit ? 'Сохранить' : 'Создать'}
          </Button>
        </Group>
      </Group>

      {/* Вкладки */}
      {isEdit ? (
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="settings" leftSection={<FileText size={16} />}>
              Настройки
            </Tabs.Tab>
            <Tabs.Tab value="content" leftSection={<FileText size={16} />}>
              Контент
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="settings" pt="lg">
            <SettingsForm
              register={register}
              errors={errors}
              control={control}
              watch={watch}
              setValue={setValue}
              courses={courses}
              tags={tags}
              coverImage={coverImage}
              handleCoverUpload={handleCoverUpload}
              onSubmit={handleSubmit(onSubmit)}
            />
          </Tabs.Panel>

          <Tabs.Panel value="content" pt="lg">
            <Stack gap="md">
              <Paper p="md" withBorder>
                <Group gap="md">
                  <Text fw={500}>Тип контента:</Text>
                  <Badge size="lg" variant="light">
                    {lesson?.lessonType === 'ARTICLE' && 'Статья'}
                    {lesson?.lessonType === 'VIDEO' && 'Видео'}
                    {lesson?.lessonType === 'AUDIO' && 'Аудио'}
                    {lesson?.lessonType === 'QUIZ' && 'Тест'}
                    {lesson?.lessonType === 'CALCULATOR' && 'Калькулятор'}
                    {!lesson?.lessonType && 'Не указан'}
                  </Badge>
                </Group>
              </Paper>

              {!lesson?.lessonType && (
                <Paper p="xl" withBorder>
                  <Text c="dimmed" ta="center">
                    Сначала укажите тип урока во вкладке «Настройки»
                  </Text>
                </Paper>
              )}

              {lesson?.lessonType === 'ARTICLE' && (
                <Card withBorder padding="md">
                  <TextContentEditor
                    initialContent={content?.textContent?.body || ''}
                    onSave={saveTextContent}
                    saving={contentSaving}
                  />
                </Card>
              )}

              {lesson?.lessonType === 'VIDEO' && (
                <Card withBorder padding="md">
                  <VideoContentEditor
                    initialUrl={content?.videoContent?.videoUrl || ''}
                    onSave={saveVideoContent}
                    saving={contentSaving}
                  />
                </Card>
              )}

              {lesson?.lessonType === 'AUDIO' && (
                <Card withBorder padding="md">
                  <AudioContentEditor
                    initialUrl={content?.audioContent?.audioUrl || ''}
                    onSave={saveAudioContent}
                    saving={contentSaving}
                  />
                </Card>
              )}

              {lesson?.lessonType === 'QUIZ' && (
                <Card withBorder padding="md">
                  <QuizContentEditor
                    initialQuestions={content?.quizContent?.questions || []}
                    initialPassingScore={content?.quizContent?.passingScore || 70}
                    onSave={saveQuizContent}
                    saving={contentSaving}
                  />
                </Card>
              )}
            </Stack>
          </Tabs.Panel>
        </Tabs>
      ) : (
        <SettingsForm
          register={register}
          errors={errors}
          control={control}
          watch={watch}
          setValue={setValue}
          courses={courses}
          tags={tags}
          coverImage={coverImage}
          handleCoverUpload={handleCoverUpload}
          onSubmit={handleSubmit(onSubmit)}
        />
      )}
    </Stack>
  )
}

// Компонент формы настроек
function SettingsForm({
  register,
  errors,
  control,
  watch,
  setValue,
  courses,
  tags,
  coverImage,
  handleCoverUpload,
  onSubmit,
}: {
  register: any
  errors: any
  control: any
  watch: any
  setValue: any
  courses: Array<{ id: string; title: string; modules: Array<{ id: string; title: string }> }>
  tags: Array<{ id: string; name: string }>
  coverImage: string | undefined
  handleCoverUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: () => void
}) {
  // Группируем модули по курсам для Select
  const moduleSelectData = courses.map(course => ({
    group: course.title,
    items: course.modules.map(m => ({
      value: m.id,
      label: m.title,
    })),
  }))

  return (
    <form id="lesson-form" onSubmit={onSubmit}>
      <Grid>
        {/* Основные поля */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="md">
            <Card withBorder padding="md">
              <Stack gap="md">
                <Text fw={500}>Основная информация</Text>
                
                <TextInput
                  label="Название урока"
                  placeholder="Например: Введение в инвестирование"
                  required
                  {...register('title')}
                  error={errors.title?.message}
                />

                <TextInput
                  label="URL-адрес (slug)"
                  placeholder="vvedenie-v-investirovanie"
                  description="Используется в URL урока"
                  required
                  {...register('slug')}
                  error={errors.slug?.message}
                />

                <Textarea
                  label="Описание"
                  placeholder="О чём этот урок"
                  minRows={3}
                  maxRows={6}
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
                      name="lessonType"
                      control={control}
                      render={({ field }) => (
                        <Select
                          label="Тип урока"
                          placeholder="Выберите тип"
                          data={AUTHOR_LESSON_TYPES.filter(t => t.value !== '')}
                          value={field.value || null}
                          onChange={(value) => field.onChange(value || '')}
                          required
                        />
                      )}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Controller
                      name="moduleId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          label="Модуль"
                          placeholder="Выберите модуль (опционально)"
                          data={moduleSelectData}
                          value={field.value || null}
                          onChange={(value) => field.onChange(value || null)}
                          clearable
                          searchable
                        />
                      )}
                    />
                  </Grid.Col>
                </Grid>

                <Grid>
                  <Grid.Col span={6}>
                    <Controller
                      name="duration"
                      control={control}
                      render={({ field }) => (
                        <NumberInput
                          label="Длительность (минуты)"
                          placeholder="15"
                          min={0}
                          max={600}
                          value={field.value ?? undefined}
                          onChange={(value) => field.onChange(value === '' ? undefined : Number(value))}
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
                          data={AUTHOR_LESSON_STATUSES_SELECT}
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
                      data={tags.map((tag: { id: string; name: string }) => ({ value: tag.id, label: tag.name }))}
                      value={field.value || []}
                      onChange={(value) => field.onChange(value)}
                      searchable
                      clearable
                      maxValues={5}
                    />
                  )}
                />

                <Switch
                  label="Премиум урок"
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
              <Text fw={500}>Обложка урока</Text>
              
              {coverImage ? (
                <div style={{ position: 'relative' }}>
                  <Image
                    src={coverImage}
                    alt="Обложка урока"
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
                  Премиум урок
                </Badge>
              )}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </form>
  )
}
