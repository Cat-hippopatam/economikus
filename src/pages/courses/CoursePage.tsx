// src/pages/courses/CoursePage.tsx
/**
 * Детальная страница курса
 */

import { useParams, Link } from 'react-router-dom'
import {
  Container,
  Title,
  Text,
  Badge,
  Group,
  Stack,
  Paper,
  Box,
  Button,
  Skeleton,
  ThemeIcon,
  Divider,
  Accordion,
  List,
  Grid,
} from '@mantine/core'
import {
  Clock,
  BookOpen,
  Users,
  Play,
  Check,
  Crown,
  ArrowLeft,
  FileText,
  Video,
  Headphones,
  HelpCircle,
} from 'lucide-react'
import { LoadingState } from '@/components/common'
import { useCourseDetail } from '@/hooks/useCourseDetail'
import { DIFFICULTY_CONFIG, LESSON_TYPE_ICONS } from '@/constants'
import type { Module } from '@/types'

// Иконка типа урока
const LessonTypeIcon = ({ type }: { type: string }) => {
  const iconMap: Record<string, typeof FileText> = {
    ARTICLE: FileText,
    VIDEO: Video,
    AUDIO: Headphones,
    QUIZ: HelpCircle,
  }
  const Icon = iconMap[type] || FileText
  return <Icon size={16} />
}

// Компонент модуля
function ModuleItem({ module, index }: { module: Module; index: number }) {
  const lessons = (module as Module & { lessons: any[] }).lessons || []

  return (
    <Accordion.Item value={module.id}>
      <Accordion.Control>
        <Group justify="space-between">
          <Group>
            <Badge color="teal" variant="light">
              Модуль {index + 1}
            </Badge>
            <Text fw={500}>{module.title}</Text>
          </Group>
          <Group gap="xs">
            <Text size="sm" c="dimmed">
              {lessons.length} уроков
            </Text>
            {module.duration && (
              <>
                <Text size="sm" c="dimmed">•</Text>
                <Text size="sm" c="dimmed">
                  {Math.round(module.duration / 60)} ч
                </Text>
              </>
            )}
          </Group>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        {lessons.length === 0 ? (
          <Text c="dimmed" size="sm">В модуле пока нет уроков</Text>
        ) : (
          <List listStyleType="none" spacing="xs">
            {lessons.map((lesson, i) => (
              <List.Item key={lesson.id}>
                <Group gap="sm" p="xs" style={{ borderRadius: 8, cursor: 'pointer' }}>
                  <ThemeIcon size="sm" variant="light" color="gray">
                    <LessonTypeIcon type={lesson.lessonType} />
                  </ThemeIcon>
                  <Text size="sm" style={{ flex: 1 }}>
                    {lesson.title}
                  </Text>
                  {lesson.isPremium && (
                    <Crown size={14} color="#F4A261" />
                  )}
                  {lesson.duration && (
                    <Text size="xs" c="dimmed">
                      {Math.round(lesson.duration / 60)} мин
                    </Text>
                  )}
                </Group>
              </List.Item>
            ))}
          </List>
        )}
      </Accordion.Panel>
    </Accordion.Item>
  )
}

export default function CoursePage() {
  const { slug } = useParams<{ slug: string }>()
  const { course, modules, loading, error } = useCourseDetail(slug)

  if (loading) {
    return (
      <Container size="lg" py="xl">
        <Skeleton height={300} radius="md" mb="xl" />
        <Skeleton height={40} mb="md" />
        <Skeleton height={20} mb="xl" />
        <Skeleton height={200} radius="md" />
      </Container>
    )
  }

  if (error || !course) {
    return (
      <Container size="lg" py="xl">
        <Paper p="xl" withBorder>
          <Text c="red" ta="center">{error || 'Курс не найден'}</Text>
          <Group justify="center" mt="md">
            <Button component={Link} to="/catalog" variant="light">
              Вернуться в каталог
            </Button>
          </Group>
        </Paper>
      </Container>
    )
  }

  const difficulty = DIFFICULTY_CONFIG[course.difficultyLevel] || DIFFICULTY_CONFIG.BEGINNER

  // Найти первый урок для кнопки "Начать обучение"
  const firstLesson = modules.length > 0 && modules[0].lessons && modules[0].lessons.length > 0
    ? modules[0].lessons[0]
    : null

  const startLearningUrl = firstLesson 
    ? `/courses/${course.slug}/lessons/${firstLesson.slug}`
    : null

  return (
    <Box>
      {/* Hero секция */}
      <Box
        style={{
          background: 'linear-gradient(135deg, #264653 0%, #2A9D8F 100%)',
          padding: '60px 0',
          color: '#fff',
        }}
      >
        <Container size="lg">
          <Group mb="md">
            <Button
              component={Link}
              to="/catalog"
              variant="subtle"
              color="gray"
              leftSection={<ArrowLeft size={16} />}
              style={{ color: '#fff' }}
            >
              Назад к каталогу
            </Button>
          </Group>

          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Stack gap="md">
                <Group gap="xs">
                  <Badge color={difficulty.color} variant="filled">
                    {difficulty.label}
                  </Badge>
                  {course.isPremium && (
                    <Badge color="yellow" variant="filled" leftSection={<Crown size={12} />}>
                      Премиум
                    </Badge>
                  )}
                </Group>

                <Title order={1}>{course.title}</Title>

                {course.description && (
                  <Text size="lg" style={{ opacity: 0.9 }}>
                    {course.description}
                  </Text>
                )}

                <Group gap="lg">
                  <Group gap="xs">
                    <BookOpen size={18} />
                    <Text>{course.lessonsCount || 0} уроков</Text>
                  </Group>
                  <Group gap="xs">
                    <Clock size={18} />
                    <Text>
                      {course.duration ? `${Math.round(course.duration / 60)} часов` : 'Длительность не указана'}
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <Users size={18} />
                    <Text>{course._count?.progress || 0} студентов</Text>
                  </Group>
                </Group>

                {course.author && (
                  <Group gap="sm" mt="md">
                    <Text style={{ opacity: 0.8 }}>Автор:</Text>
                    <Text fw={500}>
                      {course.author.displayName || course.author.nickname}
                    </Text>
                  </Group>
                )}

                <Group mt="lg">
                  {startLearningUrl ? (
                    <Button
                      component={Link}
                      to={startLearningUrl}
                      size="lg"
                      color="#F4A261"
                      leftSection={<Play size={18} />}
                    >
                      Начать обучение
                    </Button>
                  ) : (
                    <Button size="lg" color="#F4A261" disabled>
                      Уроки добавляются
                    </Button>
                  )}
                </Group>
              </Stack>
            </Grid.Col>

            {course.coverImage && (
              <Grid.Col span={{ base: 12, md: 4 }}>
                <img
                  src={course.coverImage}
                  alt={course.title}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                  style={{
                    width: '100%',
                    borderRadius: 12,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                  }}
                />
              </Grid.Col>
            )}
          </Grid>
        </Container>
      </Box>

      {/* Контент */}
      <Container size="lg" py="xl">
        <Grid gutter="xl">
          {/* Основной контент */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            {/* Теги */}
            {course.tags && course.tags.length > 0 && (
              <Group gap="xs" mb="xl">
                {course.tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="light"
                    color={tag.color || 'gray'}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </Group>
            )}

            {/* Программа курса */}
            <Paper shadow="xs" p="lg" radius="md" withBorder>
              <Title order={3} mb="md">
                Программа курса
              </Title>

              {modules.length === 0 ? (
                <Text c="dimmed">Программа курса формируется...</Text>
              ) : (
                <Accordion variant="separated" radius="md">
                  {modules.map((module, index) => (
                    <ModuleItem key={module.id} module={module} index={index} />
                  ))}
                </Accordion>
              )}
            </Paper>
          </Grid.Col>

          {/* Сайдбар */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper shadow="xs" p="lg" radius="md" withBorder style={{ position: 'sticky', top: 80 }}>
              <Stack gap="md">
                <Title order={4}>Информация о курсе</Title>

                <Divider />

                <Group justify="space-between">
                  <Text c="dimmed">Уровень</Text>
                  <Badge color={difficulty.color}>{difficulty.label}</Badge>
                </Group>

                <Group justify="space-between">
                  <Text c="dimmed">Уроков</Text>
                  <Text fw={500}>{course.lessonsCount || 0}</Text>
                </Group>

                <Group justify="space-between">
                  <Text c="dimmed">Модулей</Text>
                  <Text fw={500}>{course.modulesCount || modules.length}</Text>
                </Group>

                {course.duration && (
                  <Group justify="space-between">
                    <Text c="dimmed">Длительность</Text>
                    <Text fw={500}>{Math.round(course.duration / 60)} часов</Text>
                  </Group>
                )}

                <Group justify="space-between">
                  <Text c="dimmed">Студентов</Text>
                  <Text fw={500}>{course._count?.progress || 0}</Text>
                </Group>

                <Group justify="space-between">
                  <Text c="dimmed">Просмотров</Text>
                  <Text fw={500}>{course.viewsCount || 0}</Text>
                </Group>

                <Divider />

                {startLearningUrl ? (
                  <Button
                    component={Link}
                    to={startLearningUrl}
                    size="lg"
                    color="te"
                    fullWidth
                    leftSection={<Play size={18} />}
                  >
                    Начать обучение
                  </Button>
                ) : (
                  <Button size="lg" color="te" fullWidth disabled>
                    Уроки добавляются
                  </Button>
                )}

                {course.isPremium && (
                  <Text size="xs" c="dimmed" ta="center">
                    Курс доступен по подписке
                  </Text>
                )}
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  )
}
