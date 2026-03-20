/**
 * Страница аналитики автора
 * Версия 1.0 - базовая статистика с возможностью масштабирования
 * TODO: Добавить графики (Recharts), фильтры по датам, экспорт
 */

import { useState, useEffect } from 'react'
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Card,
  Group,
  ThemeIcon,
  Progress,
  Stack,
  Badge,
  Table,
  ScrollArea,
  Paper,
  Divider,
} from '@mantine/core'
import {
  Eye,
  Users,
  BookOpen,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { LoadingState, StatusBadge } from '@/components/common'
import { api } from '@/services'
import { CONTENT_STATUS, LESSON_TYPE_LABELS } from '@/constants'

// Типы для аналитики
interface AnalyticsOverview {
  totalCourses: number
  totalLessons: number
  totalViews: number
  totalStudents: number
  completedCourses: number
}

interface CoursesByStatus {
  DRAFT: number
  PENDING_REVIEW: number
  PUBLISHED: number
  ARCHIVED: number
}

interface LessonsByStatus {
  DRAFT: number
  PENDING_REVIEW: number
  PUBLISHED: number
}

interface LessonsByType {
  ARTICLE: number
  VIDEO: number
  AUDIO: number
  QUIZ: number
}

interface TopCourse {
  id: string
  title: string
  slug: string
  viewsCount: number
  studentsCount: number
  modulesCount: number
}

interface TopLesson {
  id: string
  title: string
  lessonType: string
  viewsCount: number
}

interface RecentActivity {
  type: 'course' | 'lesson'
  id: string
  title: string
  status: string
  createdAt: string
}

interface AnalyticsData {
  overview: AnalyticsOverview
  coursesByStatus: CoursesByStatus
  lessonsByStatus: LessonsByStatus
  lessonsByType: LessonsByType
  topCourses: TopCourse[]
  topLessons: TopLesson[]
  recentActivity: RecentActivity[]
}

// Конфигурация карточек статистики
const OVERVIEW_CONFIG = [
  { key: 'totalViews', label: 'Просмотры', icon: Eye, color: 'blue' },
  { key: 'totalStudents', label: 'Студенты', icon: Users, color: 'green' },
  { key: 'totalCourses', label: 'Курсы', icon: BookOpen, color: 'orange' },
  { key: 'totalLessons', label: 'Уроки', icon: FileText, color: 'grape' },
] as const

export function AuthorAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const result = await api.get<AnalyticsData>('/author/analytics')
      setData(result)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingState centered text="Загрузка аналитики..." />
  }

  if (!data) {
    return (
      <Container size="lg" py="xl">
        <Paper p="xl" ta="center">
          <AlertCircle size={48} style={{ opacity: 0.3 }} />
          <Text c="dimmed" mt="md">Не удалось загрузить аналитику</Text>
        </Paper>
      </Container>
    )
  }

  const { overview, coursesByStatus, lessonsByStatus, lessonsByType, topCourses, topLessons, recentActivity } = data

  // Подсчёт процентов для прогресс-баров
  const totalCoursesForStatus = Object.values(coursesByStatus).reduce((a, b) => a + b, 0)
  const totalLessonsForStatus = Object.values(lessonsByStatus).reduce((a, b) => a + b, 0)
  const totalLessonsForType = Object.values(lessonsByType).reduce((a, b) => a + b, 0)

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Аналитика</Title>
          <Text c="dimmed">Статистика вашего контента</Text>
        </div>
      </Group>

      {/* Общая статистика */}
      <SimpleGrid cols={{ base: 2, md: 4 }} mb="xl">
        {OVERVIEW_CONFIG.map((config) => {
          const Icon = config.icon
          const value = overview[config.key as keyof AnalyticsOverview]
          return (
            <Card key={config.key} withBorder p="md">
              <Group justify="space-between">
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
                    {config.label}
                  </Text>
                  <Text size="xl" fw={700}>
                    {typeof value === 'number' ? value.toLocaleString() : value}
                  </Text>
                </div>
                <ThemeIcon size="lg" radius="md" color={config.color} variant="light">
                  <Icon size={20} />
                </ThemeIcon>
              </Group>
            </Card>
          )
        })}
      </SimpleGrid>

      {/* Две колонки: Курсы и Уроки по статусам */}
      <SimpleGrid cols={{ base: 1, md: 2 }} mb="xl">
        {/* Курсы по статусам */}
        <Card withBorder p="md">
          <Group justify="space-between" mb="md">
            <Text fw={500}>Курсы по статусам</Text>
            <Badge>{totalCoursesForStatus}</Badge>
          </Group>
          <Stack gap="xs">
            {Object.entries(coursesByStatus).map(([status, count]) => {
              const percent = totalCoursesForStatus > 0 ? (count / totalCoursesForStatus) * 100 : 0
              const statusConfig = CONTENT_STATUS[status as keyof typeof CONTENT_STATUS]
              return (
                <div key={status}>
                  <Group justify="space-between" mb={4}>
                    <Text size="sm">{statusConfig?.label || status}</Text>
                    <Text size="sm" c="dimmed">{count}</Text>
                  </Group>
                  <Progress 
                    value={percent} 
                    color={statusConfig?.color || 'gray'} 
                    size="sm" 
                  />
                </div>
              )
            })}
          </Stack>
        </Card>

        {/* Уроки по статусам */}
        <Card withBorder p="md">
          <Group justify="space-between" mb="md">
            <Text fw={500}>Уроки по статусам</Text>
            <Badge>{totalLessonsForStatus}</Badge>
          </Group>
          <Stack gap="xs">
            {Object.entries(lessonsByStatus).map(([status, count]) => {
              const percent = totalLessonsForStatus > 0 ? (count / totalLessonsForStatus) * 100 : 0
              const statusConfig = CONTENT_STATUS[status as keyof typeof CONTENT_STATUS]
              return (
                <div key={status}>
                  <Group justify="space-between" mb={4}>
                    <Text size="sm">{statusConfig?.label || status}</Text>
                    <Text size="sm" c="dimmed">{count}</Text>
                  </Group>
                  <Progress 
                    value={percent} 
                    color={statusConfig?.color || 'gray'} 
                    size="sm" 
                  />
                </div>
              )
            })}
          </Stack>
        </Card>
      </SimpleGrid>

      {/* Уроки по типам */}
      <Card withBorder p="md" mb="xl">
        <Group justify="space-between" mb="md">
          <Text fw={500}>Уроки по типам</Text>
          <Badge>{totalLessonsForType}</Badge>
        </Group>
        <SimpleGrid cols={{ base: 2, md: 4 }}>
          {Object.entries(lessonsByType).map(([type, count]) => {
            const percent = totalLessonsForType > 0 ? (count / totalLessonsForType) * 100 : 0
            return (
              <div key={type}>
                <Group justify="space-between" mb={4}>
                  <Text size="sm">{LESSON_TYPE_LABELS[type] || type}</Text>
                  <Text size="sm" c="dimmed">{count}</Text>
                </Group>
                <Progress value={percent} size="sm" />
              </div>
            )
          })}
        </SimpleGrid>
      </Card>

      {/* Топ контент */}
      <SimpleGrid cols={{ base: 1, md: 2 }} mb="xl">
        {/* Топ курсы */}
        <Card withBorder p="md">
          <Text fw={500} mb="md">Топ курсы по просмотрам</Text>
          {topCourses.length === 0 ? (
            <Text c="dimmed" size="sm">Нет данных</Text>
          ) : (
            <ScrollArea h={200}>
              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Курс</Table.Th>
                    <Table.Th ta="right">Просмотры</Table.Th>
                    <Table.Th ta="right">Студенты</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {topCourses.map((course, index) => (
                    <Table.Tr key={course.id}>
                      <Table.Td>
                        <Text size="sm" lineClamp={1}>
                          {index + 1}. {course.title}
                        </Text>
                      </Table.Td>
                      <Table.Td ta="right">
                        <Text size="sm">{course.viewsCount}</Text>
                      </Table.Td>
                      <Table.Td ta="right">
                        <Text size="sm">{course.studentsCount}</Text>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          )}
        </Card>

        {/* Топ уроки */}
        <Card withBorder p="md">
          <Text fw={500} mb="md">Топ уроки по просмотрам</Text>
          {topLessons.length === 0 ? (
            <Text c="dimmed" size="sm">Нет данных</Text>
          ) : (
            <ScrollArea h={200}>
              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Урок</Table.Th>
                    <Table.Th>Тип</Table.Th>
                    <Table.Th ta="right">Просмотры</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {topLessons.map((lesson, index) => (
                    <Table.Tr key={lesson.id}>
                      <Table.Td>
                        <Text size="sm" lineClamp={1}>
                          {index + 1}. {lesson.title}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge size="sm" variant="light">
                          {LESSON_TYPE_LABELS[lesson.lessonType] || lesson.lessonType}
                        </Badge>
                      </Table.Td>
                      <Table.Td ta="right">
                        <Text size="sm">{lesson.viewsCount}</Text>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          )}
        </Card>
      </SimpleGrid>

      {/* Последняя активность */}
      <Card withBorder p="md">
        <Text fw={500} mb="md">Последняя активность</Text>
        {recentActivity.length === 0 ? (
          <Text c="dimmed" size="sm">Нет данных</Text>
        ) : (
          <ScrollArea h={200}>
            <Table striped>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Тип</Table.Th>
                  <Table.Th>Название</Table.Th>
                  <Table.Th>Статус</Table.Th>
                  <Table.Th>Дата</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {recentActivity.map((item) => (
                  <Table.Tr key={`${item.type}-${item.id}`}>
                    <Table.Td>
                      <Badge size="sm" color={item.type === 'course' ? 'blue' : 'orange'} variant="light">
                        {item.type === 'course' ? 'Курс' : 'Урок'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" lineClamp={1}>{item.title}</Text>
                    </Table.Td>
                    <Table.Td>
                      <StatusBadge status={item.status} type="content" size="sm" />
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {new Date(item.createdAt).toLocaleDateString('ru-RU')}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        )}
      </Card>

      {/* TODO placeholder для будущих графиков */}
      <Divider my="xl" />
      <Paper p="xl" ta="center" withBorder>
        <TrendingUp size={32} style={{ opacity: 0.3 }} />
        <Text c="dimmed" size="sm" mt="sm">
          Графики и детальная аналитика будут добавлены в следующей версии
        </Text>
      </Paper>
    </Container>
  )
}
