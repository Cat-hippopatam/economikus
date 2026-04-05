import { useEffect, useState } from 'react'
import { Grid, Paper, Text, Group, ThemeIcon, Skeleton, Card, Badge } from '@mantine/core'
import { Users, BookOpen, GraduationCap, Eye, Crown, Check } from 'lucide-react'
import { api } from '@/lib/api'

interface Stats {
  usersCount: number
  coursesCount: number
  lessonsCount: number
  publishedCourses: number
  publishedLessons: number
  totalViews: number
  premiumUsers: number
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/stats')
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const statCards = [
    {
      label: 'Пользователей',
      value: stats?.usersCount || 0,
      icon: Users,
      color: 'blue'
    },
    {
      label: 'Курсов',
      value: stats?.coursesCount || 0,
      icon: BookOpen,
      color: 'green',
      badge: stats ? `${stats.publishedCourses} опубликовано` : null
    },
    {
      label: 'Уроков',
      value: stats?.lessonsCount || 0,
      icon: GraduationCap,
      color: 'violet',
      badge: stats ? `${stats.publishedLessons} опубликовано` : null
    },
    {
      label: 'Просмотров',
      value: stats?.totalViews || 0,
      icon: Eye,
      color: 'orange'
    },
    {
      label: 'Премиум',
      value: stats?.premiumUsers || 0,
      icon: Crown,
      color: 'yellow'
    }
  ]

  return (
    <div>
      <Text size="xl" fw={700} mb="lg">Дашборд</Text>

      <Grid>
        {statCards.map((stat, index) => (
          <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
            {loading ? (
              <Skeleton height={120} radius="md" />
            ) : (
              <Paper shadow="xs" p="md" radius="md" withBorder>
                <Group justify="space-between" mb="xs">
                  <Text c="dimmed" size="sm">{stat.label}</Text>
                  <ThemeIcon variant="light" color={stat.color} radius="xl" size="lg">
                    <stat.icon size={18} />
                  </ThemeIcon>
                </Group>
                <Text size="xl" fw={700}>{stat.value.toLocaleString()}</Text>
                {stat.badge && (
                  <Badge color="green" variant="light" size="sm" mt="xs">
                    <Check size={12} style={{ marginRight: 4 }} />
                    {stat.badge}
                  </Badge>
                )}
              </Paper>
            )}
          </Grid.Col>
        ))}
      </Grid>

      <Grid mt="xl">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="xs" padding="lg" radius="md" withBorder>
            <Text fw={600} mb="md">Быстрые действия</Text>
            <Group>
              <Badge 
                color="blue" 
                variant="light" 
                size="lg"
                style={{ cursor: 'pointer' }}
                onClick={() => window.location.href = '/admin/courses'}
              >
                + Новый курс
              </Badge>
              <Badge 
                color="green" 
                variant="light" 
                size="lg"
                style={{ cursor: 'pointer' }}
                onClick={() => window.location.href = '/admin/lessons'}
              >
                + Новый урок
              </Badge>
              <Badge 
                color="violet" 
                variant="light" 
                size="lg"
                style={{ cursor: 'pointer' }}
                onClick={() => window.location.href = '/admin/tags'}
              >
                + Новый тег
              </Badge>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="xs" padding="lg" radius="md" withBorder>
            <Text fw={600} mb="md">Статус системы</Text>
            <Group>
              <Badge color="green" variant="light" size="lg">
                База данных: OK
              </Badge>
              <Badge color="green" variant="light" size="lg">
                API: OK
              </Badge>
            </Group>
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  )
}
