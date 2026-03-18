// src/pages/author/AuthorDashboardPage.tsx
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
  Skeleton,
} from '@mantine/core'
import {
  Eye,
  Users,
  BookOpen,
  FileText,
  Plus,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { APP_CONFIG } from '../../constants'

interface Stats {
  coursesCount: number
  lessonsCount: number
  totalViews: number
  totalStudents: number
}

export function AuthorDashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    if (user.role !== 'AUTHOR' && user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
      navigate('/become-author')
      return
    }
    fetchStats()
  }, [user])

  const fetchStats = async () => {
    try {
      const response = await fetch(`${APP_CONFIG.apiUrl}/author/stats`, {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Container size="lg" py="xl">
        <Skeleton height={200} radius="md" />
      </Container>
    )
  }

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

      <SimpleGrid cols={{ base: 2, md: 4 }} mb="xl">
        <Card withBorder p="md">
          <Group justify="space-between">
            <div>
              <Text c="dimmed" size="xs" tt="uppercase" fw={500}>Просмотры</Text>
              <Text fw={700} size="xl">{stats?.totalViews.toLocaleString() || 0}</Text>
            </div>
            <ThemeIcon size="lg" radius="md" variant="light" color="blue">
              <Eye size={20} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card withBorder p="md">
          <Group justify="space-between">
            <div>
              <Text c="dimmed" size="xs" tt="uppercase" fw={500}>Студенты</Text>
              <Text fw={700} size="xl">{stats?.totalStudents.toLocaleString() || 0}</Text>
            </div>
            <ThemeIcon size="lg" radius="md" variant="light" color="green">
              <Users size={20} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card withBorder p="md">
          <Group justify="space-between">
            <div>
              <Text c="dimmed" size="xs" tt="uppercase" fw={500}>Курсы</Text>
              <Text fw={700} size="xl">{stats?.coursesCount || 0}</Text>
            </div>
            <ThemeIcon size="lg" radius="md" variant="light" color="orange">
              <BookOpen size={20} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card withBorder p="md">
          <Group justify="space-between">
            <div>
              <Text c="dimmed" size="xs" tt="uppercase" fw={500}>Уроки</Text>
              <Text fw={700} size="xl">{stats?.lessonsCount || 0}</Text>
            </div>
            <ThemeIcon size="lg" radius="md" variant="light" color="grape">
              <FileText size={20} />
            </ThemeIcon>
          </Group>
        </Card>
      </SimpleGrid>

      <Title order={4} mb="md">Быстрые действия</Title>
      <SimpleGrid cols={{ base: 1, md: 2 }} mb="xl">
        <Card
          component={Link}
          to="/author/courses"
          withBorder
          p="lg"
          style={{ cursor: 'pointer', textDecoration: 'none' }}
        >
          <Group>
            <ThemeIcon size="xl" radius="md" color="blue">
              <BookOpen size={24} />
            </ThemeIcon>
            <div>
              <Text fw={500}>Мои курсы</Text>
              <Text size="sm" c="dimmed">Управление курсами и модулями</Text>
            </div>
          </Group>
        </Card>

        <Card
          component={Link}
          to="/author/lessons"
          withBorder
          p="lg"
          style={{ cursor: 'pointer', textDecoration: 'none' }}
        >
          <Group>
            <ThemeIcon size="xl" radius="md" color="orange">
              <FileText size={24} />
            </ThemeIcon>
            <div>
              <Text fw={500}>Мои уроки</Text>
              <Text size="sm" c="dimmed">Создание и редактирование уроков</Text>
            </div>
          </Group>
        </Card>
      </SimpleGrid>

      <Paper withBorder p="xl" ta="center">
        <Text c="dimmed">
          Панель автора находится в разработке. Скоро здесь появится больше функций!
        </Text>
      </Paper>
    </Container>
  )
}
