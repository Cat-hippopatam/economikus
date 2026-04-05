// src/components/profile/ProgressTab.tsx
import { Link } from 'react-router-dom'
import { Stack, Card, Group, Text, Progress, Badge, Button } from '@mantine/core'
import { BookOpen, Clock, CheckCircle } from 'lucide-react'
import { LoadingState, EmptyState, ErrorState } from '../common'
import { useUserProgress } from '../../hooks'

const STATUS_COLORS: Record<string, string> = {
  not_started: 'gray',
  in_progress: 'blue',
  completed: 'green',
}

const STATUS_LABELS: Record<string, string> = {
  not_started: 'Не начат',
  in_progress: 'В процессе',
  completed: 'Завершён',
}

export function ProgressTab() {
  const { items, loading, error, fetchProgress } = useUserProgress()

  if (loading) {
    return <LoadingState text="Загрузка прогресса..." />
  }

  if (error) {
    return <ErrorState title="Ошибка" message={error} onRetry={fetchProgress} />
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Нет данных о прогрессе"
        description="Начните изучать курсы, чтобы отслеживать свой прогресс"
        icon={<BookOpen size={40} />}
      />
    )
  }

  return (
    <Stack gap="md">
      {items.map((progress) => (
        <Card key={progress.id} withBorder padding="md" radius="md">
          <Group justify="space-between" mb="sm">
            <Text fw={600} size="lg" lineClamp={1}>
              {progress.course.title}
            </Text>
            <Badge color={STATUS_COLORS[progress.status]} variant="light">
              {STATUS_LABELS[progress.status]}
            </Badge>
          </Group>
          
          <Group gap="xl" mb="sm">
            <Group gap={4}>
              <CheckCircle size={16} style={{ color: 'var(--mantine-color-green-6)' }} />
              <Text size="sm" c="dimmed">
                {progress.completedLessons} из {progress.totalLessons} уроков
              </Text>
            </Group>
            <Group gap={4}>
              <Clock size={16} style={{ color: 'var(--mantine-color-gray-6)' }} />
              <Text size="sm" c="dimmed">
                Последний визит: {new Date(progress.lastViewedAt).toLocaleDateString('ru-RU')}
              </Text>
            </Group>
          </Group>
          
          <Progress 
            value={progress.progressPercent} 
            size="md" 
            radius="xl"
            color={progress.progressPercent === 100 ? 'green' : 'blue'}
          />
          
          <Group justify="space-between" mt="sm">
            <Text size="sm" fw={500}>
              {progress.progressPercent}% завершено
            </Text>
            <Button 
              component={Link} 
              to={`/courses/${progress.course.slug}`}
              variant="light" 
              size="xs"
            >
              Продолжить
            </Button>
          </Group>
        </Card>
      ))}
    </Stack>
  )
}
