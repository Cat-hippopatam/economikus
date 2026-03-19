// src/pages/author/AuthorDashboardPage.tsx
/**
 * Панель автора
 * Рефакторинг: использует StatCard, LoadingState, переиспользуемые компоненты
 * Защита роутов через ProtectedRoute в App.tsx
 */

import { useState, useEffect } from 'react'
import {
  Container,
  Paper,
  Title,
  Text,
  Group,
  SimpleGrid,
  Card,
  ThemeIcon,
  Button,
} from '@mantine/core'
import {
  Eye,
  Users,
  BookOpen,
  FileText,
  Plus,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatCardsGrid } from '@/components/cards'
import { LoadingState } from '@/components/common'
import { api } from '@/services'

interface AuthorStats {
  coursesCount: number
  lessonsCount: number
  totalViews: number
  totalStudents: number
}

// Статические данные вынесены в константы - единая точка изменения
const STATS_CONFIG = [
  { key: 'totalViews', label: 'Просмотры', icon: Eye, color: 'blue' },
  { key: 'totalStudents', label: 'Студенты', icon: Users, color: 'green' },
  { key: 'coursesCount', label: 'Курсы', icon: BookOpen, color: 'orange' },
  { key: 'lessonsCount', label: 'Уроки', icon: FileText, color: 'grape' },
]

const QUICK_ACTIONS = [
  { to: '/author/courses', icon: BookOpen, color: 'blue', title: 'Мои курсы', description: 'Управление курсами и модулями' },
  { to: '/author/lessons', icon: FileText, color: 'orange', title: 'Мои уроки', description: 'Создание и редактирование уроков' },
]

export function AuthorDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<AuthorStats | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const data = await api.get<AuthorStats>('/author/stats')
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingState centered text="Загрузка статистики..." />
  }

  // Преобразуем статистику в формат для StatCardsGrid
  const statsValues: Record<string, number> = stats ? {
    totalViews: stats.totalViews,
    totalStudents: stats.totalStudents,
    coursesCount: stats.coursesCount,
    lessonsCount: stats.lessonsCount,
  } : {}

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Панель автора</Title>
          <Text c="dimmed">Управляйте вашим контентом</Text>
        </div>
        <Button component={Link} to="/author/courses/new" leftSection={<Plus size={16} />}>
          Создать курс
        </Button>
      </Group>

      {/* Статистика - переиспользуемые StatCard */}
      <SimpleGrid cols={{ base: 2, md: 4 }} mb="xl">
        <StatCardsGrid
          configs={STATS_CONFIG}
          values={statsValues}
        />
      </SimpleGrid>

      {/* Быстрые действия */}
      <Title order={4} mb="md">Быстрые действия</Title>
      <SimpleGrid cols={{ base: 1, md: 2 }} mb="xl">
        {QUICK_ACTIONS.map((action) => (
          <Card
            key={action.to}
            component={Link}
            to={action.to}
            withBorder
            p="lg"
            style={{ cursor: 'pointer', textDecoration: 'none' }}
          >
            <Group>
              <ThemeIcon size="xl" radius="md" color={action.color}>
                <action.icon size={24} />
              </ThemeIcon>
              <div>
                <Text fw={500}>{action.title}</Text>
                <Text size="sm" c="dimmed">{action.description}</Text>
              </div>
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      <Paper withBorder p="xl" ta="center">
        <Text c="dimmed">
          Панель автора находится в разработке. Скоро здесь появится больше функций!
        </Text>
      </Paper>
    </Container>
  )
}
