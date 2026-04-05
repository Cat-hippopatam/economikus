// src/pages/admin/AdminContentModerationPage.tsx
/**
 * Страница модерации контента уроков
 * Позволяет админу просматривать контент до публикации
 */

import { useState, useEffect } from 'react'
import {
  Container,
  Title,
  Text,
  Paper,
  Stack,
  Group,
  Button,
  Select,
  Badge,
  Box,
  Accordion,
  List,
  ThemeIcon,
  Skeleton,
  Divider,
  ScrollArea,
  Code,
  Card,
  Grid,
} from '@mantine/core'
import {
  FileText,
  Video,
  Headphones,
  HelpCircle,
  Check,
  X,
  Eye,
  BookOpen,
  AlertCircle,
} from 'lucide-react'
import { StatusBadge } from '@/components/common'
import { api } from '@/services'

interface ContentData {
  lesson: {
    id: string
    title: string
    slug: string
    lessonType: 'ARTICLE' | 'VIDEO' | 'AUDIO' | 'QUIZ'
    status: string
    module?: {
      id: string
      title: string
      course: { id: string; title: string; slug: string }
    }
    author?: { id: string; nickname: string; displayName: string }
  }
  content: {
    type: 'text' | 'video' | 'audio' | 'quiz'
    body?: string
    videoUrl?: string
    platform?: string
    audioUrl?: string
    questions?: any[]
    passingScore?: number
  } | null
}

// Иконка типа урока
const LessonTypeIcon = ({ type }: { type: string }) => {
  const iconMap: Record<string, typeof FileText> = {
    ARTICLE: FileText,
    VIDEO: Video,
    AUDIO: Headphones,
    QUIZ: HelpCircle,
  }
  const Icon = iconMap[type] || FileText
  return <Icon size={18} />
}

export function AdminContentModerationPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [modules, setModules] = useState<any[]>([])
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null)
  const [contentData, setContentData] = useState<ContentData | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingContent, setLoadingContent] = useState(false)

  // Загрузка курсов
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      try {
        const result = await api.get<{ items: any[] }>('/admin/courses?limit=100')
        setCourses(result.items)
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  // Загрузка модулей при выборе курса
  useEffect(() => {
    if (!selectedCourse) {
      setModules([])
      setSelectedLesson(null)
      setContentData(null)
      return
    }

    const fetchModules = async () => {
      try {
        // Загружаем модули с уроками
        const result = await api.get<{ items: any[] }>(`/admin/modules?courseId=${selectedCourse}`)
        setModules(result.items)
      } catch (error) {
        console.error('Error fetching modules:', error)
      }
    }
    fetchModules()
  }, [selectedCourse])

  // Загрузка контента урока
  useEffect(() => {
    if (!selectedLesson) {
      setContentData(null)
      return
    }

    const fetchContent = async () => {
      setLoadingContent(true)
      try {
        const result = await api.get<ContentData>(`/admin/lessons/${selectedLesson}/content`)
        setContentData(result)
      } catch (error) {
        console.error('Error fetching content:', error)
      } finally {
        setLoadingContent(false)
      }
    }
    fetchContent()
  }, [selectedLesson])

  // Обновление статуса урока
  const handleStatusChange = async (newStatus: 'PUBLISHED' | 'REJECTED') => {
    if (!selectedLesson) return
    
    try {
      await api.patch(`/admin/lessons/${selectedLesson}`, { status: newStatus })
      
      // Обновляем модули (чтобы обновить статус урока в списке)
      setModules(prev => prev.map(module => ({
        ...module,
        lessons: module.lessons?.map((l: any) => 
          l.id === selectedLesson ? { ...l, status: newStatus } : l
        )
      })))

      // Обновляем contentData
      if (contentData) {
        setContentData({
          ...contentData,
          lesson: { ...contentData.lesson, status: newStatus }
        })
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  // Рендер контента
  const renderContent = () => {
    if (!contentData || !contentData.content) {
      return (
        <Paper p="xl" withBorder>
          <Group gap="sm">
            <AlertCircle size={20} color="var(--mantine-color-gray-6)" />
            <Text c="dimmed">Контент не добавлен</Text>
          </Group>
        </Paper>
      )
    }

    const { content } = contentData

    switch (content.type) {
      case 'text':
        return (
          <Paper p="xl" withBorder>
            <Stack gap="md">
              <Group>
                <FileText size={20} />
                <Text fw={500}>Текстовый контент</Text>
              </Group>
              <Divider />
              <ScrollArea h={400}>
                <Box style={{ whiteSpace: 'pre-wrap' }}>
                  {content.body || 'Текст отсутствует'}
                </Box>
              </ScrollArea>
            </Stack>
          </Paper>
        )

      case 'video':
        return (
          <Paper p="xl" withBorder>
            <Stack gap="md">
              <Group>
                <Video size={20} />
                <Text fw={500}>Видео контент</Text>
              </Group>
              <Divider />
              <Group>
                <Text c="dimmed">Платформа:</Text>
                <Badge>{content.platform || 'Не указана'}</Badge>
              </Group>
              <Group>
                <Text c="dimmed">URL:</Text>
                <Code>{content.videoUrl || 'Не указан'}</Code>
              </Group>
              {content.videoUrl && (
                <Text size="sm" c="dimmed">
                  Для просмотра видео перейдите по ссылке выше
                </Text>
              )}
            </Stack>
          </Paper>
        )

      case 'audio':
        return (
          <Paper p="xl" withBorder>
            <Stack gap="md">
              <Group>
                <Headphones size={20} />
                <Text fw={500}>Аудио контент</Text>
              </Group>
              <Divider />
              <Group>
                <Text c="dimmed">URL:</Text>
                <Code>{content.audioUrl || 'Не указан'}</Code>
              </Group>
              {content.audioUrl && (
                <audio controls src={content.audioUrl} style={{ width: '100%' }} />
              )}
            </Stack>
          </Paper>
        )

      case 'quiz':
        return (
          <Paper p="xl" withBorder>
            <Stack gap="md">
              <Group>
                <HelpCircle size={20} />
                <Text fw={500}>Тест</Text>
              </Group>
              <Divider />
              <Group>
                <Text c="dimmed">Проходной балл:</Text>
                <Badge>{content.passingScore || 0}%</Badge>
              </Group>
              <Text fw={500} mt="md">Вопросы:</Text>
              {content.questions && content.questions.length > 0 ? (
                <Accordion variant="separated">
                  {content.questions.map((q: any, i: number) => (
                    <Accordion.Item key={i} value={`question-${i}`}>
                      <Accordion.Control>
                        <Group>
                          <Badge>{i + 1}</Badge>
                          <Text>{q.question}</Text>
                        </Group>
                      </Accordion.Control>
                      <Accordion.Panel>
                        <List listStyleType="none" spacing="xs">
                          {q.options?.map((opt: string, j: number) => (
                            <List.Item key={j}>
                              <Group gap="xs">
                                <ThemeIcon 
                                  size="sm" 
                                  color={j === q.correctIndex ? 'green' : 'gray'}
                                  variant={j === q.correctIndex ? 'filled' : 'light'}
                                >
                                  {j === q.correctIndex ? <Check size={12} /> : String.fromCharCode(65 + j)}
                                </ThemeIcon>
                                <Text>{opt}</Text>
                              </Group>
                            </List.Item>
                          ))}
                        </List>
                      </Accordion.Panel>
                    </Accordion.Item>
                  ))}
                </Accordion>
              ) : (
                <Text c="dimmed">Вопросы не добавлены</Text>
              )}
            </Stack>
          </Paper>
        )

      default:
        return <Text c="dimmed">Неизвестный тип контента</Text>
    }
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Group justify="space-between">
          <div>
            <Title order={2}>Модерация контента</Title>
            <Text c="dimmed">Просмотр и проверка контента уроков</Text>
          </div>
        </Group>

        <Grid>
          {/* Выбор курса и урока */}
          <Grid.Col span={4}>
            <Paper p="md" withBorder>
              <Stack gap="md">
                <Select
                  label="Выберите курс"
                  placeholder="Выберите курс"
                  data={courses.map(c => ({ value: c.id, label: c.title }))}
                  value={selectedCourse}
                  onChange={setSelectedCourse}
                  searchable
                  clearable
                />

                {selectedCourse && modules.length > 0 && (
                  <Box mt="md">
                    <Text size="sm" c="dimmed" mb="xs">Модули и уроки:</Text>
                    <ScrollArea h={400}>
                      <Stack gap="md">
                        {modules.map(module => (
                          <Box key={module.id}>
                            <Group gap="xs" mb="xs">
                              <BookOpen size={14} />
                              <Text size="sm" fw={500}>{module.title}</Text>
                              <Badge size="sm" variant="light">
                                {module.lessons?.length || 0} уроков
                              </Badge>
                            </Group>
                            <Stack gap="xs" pl="md">
                              {module.lessons?.map((lesson: any) => (
                                <Card
                                  key={lesson.id}
                                  padding="xs"
                                  withBorder
                                  style={{
                                    cursor: 'pointer',
                                    backgroundColor: selectedLesson === lesson.id ? 'var(--mantine-color-blue-0)' : undefined,
                                  }}
                                  onClick={() => setSelectedLesson(lesson.id)}
                                >
                                  <Group justify="space-between">
                                    <Group gap="xs">
                                      <LessonTypeIcon type={lesson.lessonType} />
                                      <Text size="sm">{lesson.title}</Text>
                                    </Group>
                                    <StatusBadge status={lesson.status} type="content" size="sm" />
                                  </Group>
                                </Card>
                              ))}
                              {(!module.lessons || module.lessons.length === 0) && (
                                <Text size="sm" c="dimmed" pl="sm">Нет уроков</Text>
                              )}
                            </Stack>
                          </Box>
                        ))}
                      </Stack>
                    </ScrollArea>
                  </Box>
                )}

                {selectedCourse && modules.length === 0 && !loading && (
                  <Text size="sm" c="dimmed" ta="center" mt="md">
                    В курсе нет модулей
                  </Text>
                )}
              </Stack>
            </Paper>
          </Grid.Col>

          {/* Просмотр контента */}
          <Grid.Col span={8}>
            {loadingContent ? (
              <Stack gap="md">
                <Skeleton height={40} />
                <Skeleton height={300} />
              </Stack>
            ) : selectedLesson && contentData ? (
              <Stack gap="md">
                {/* Информация об уроке */}
                <Paper p="md" withBorder>
                  <Group justify="space-between">
                    <div>
                      <Group gap="xs">
                        <LessonTypeIcon type={contentData.lesson.lessonType} />
                        <Title order={4}>{contentData.lesson.title}</Title>
                      </Group>
                      {contentData.lesson.module && (
                        <Text size="sm" c="dimmed">
                          {contentData.lesson.module.course.title} → {contentData.lesson.module.title}
                        </Text>
                      )}
                    </div>
                    <Group>
                      <StatusBadge status={contentData.lesson.status} type="content" />
                    </Group>
                  </Group>
                </Paper>

                {/* Контент */}
                {renderContent()}

                {/* Действия модерации */}
                <Paper p="md" withBorder>
                  <Group justify="space-between">
                    <Text fw={500}>Действия модерации:</Text>
                    <Group>
                      <Button
                        variant="light"
                        color="green"
                        leftSection={<Check size={16} />}
                        onClick={() => handleStatusChange('PUBLISHED')}
                        disabled={contentData.lesson.status === 'PUBLISHED'}
                      >
                        Опубликовать
                      </Button>
                      <Button
                        variant="light"
                        color="red"
                        leftSection={<X size={16} />}
                        onClick={() => handleStatusChange('REJECTED')}
                        disabled={contentData.lesson.status === 'REJECTED'}
                      >
                        Отклонить
                      </Button>
                    </Group>
                  </Group>
                </Paper>
              </Stack>
            ) : (
              <Paper p="xl" withBorder style={{ height: 400 }}>
                <Stack align="center" justify="center" h="100%">
                  <Eye size={48} color="var(--mantine-color-gray-4)" />
                  <Text c="dimmed" ta="center">
                    Выберите курс и урок для просмотра контента
                  </Text>
                </Stack>
              </Paper>
            )}
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  )
}

