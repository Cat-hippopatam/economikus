// src/components/profile/HistoryTab.tsx
import { Link } from 'react-router-dom'
import { Stack, Card, Group, Text, Badge, Button } from '@mantine/core'
import { PlayCircle, FileText, Clock } from 'lucide-react'
import { LoadingState, EmptyState, ErrorState } from '../common'
import { useUserHistory } from '../../hooks'

const TYPE_ICONS: Record<string, typeof PlayCircle> = {
  LESSON: PlayCircle,
  STANDALONE_ARTICLE: FileText,
}

const TYPE_LABELS: Record<string, string> = {
  LESSON: 'Урок',
  STANDALONE_ARTICLE: 'Статья',
}

export function HistoryTab() {
  const { items, loading, error, fetchHistory } = useUserHistory()

  if (loading) {
    return <LoadingState text="Загрузка истории..." />
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchHistory} />
  }

  if (items.length === 0) {
    return (
      <EmptyState
        message="История пуста"
        description="Просмотренные уроки появятся здесь"
        icon={<PlayCircle size={40} />}
      />
    )
  }

  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return '—'
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Stack gap="md">
      {items.map((item) => {
        const Icon = TYPE_ICONS[item.historableType] || PlayCircle
        const courseSlug = item.lesson?.module?.course?.slug
        const lessonSlug = item.lesson?.slug
        
        return (
          <Card key={item.id} withBorder padding="md" radius="md">
            <Group justify="space-between">
              <Group gap="md">
                <Icon size={24} style={{ color: 'var(--mantine-color-blue-6)' }} />
                <Stack gap={4}>
                  <Group gap="xs">
                    <Badge size="sm" variant="light">
                      {TYPE_LABELS[item.historableType]}
                    </Badge>
                    {item.completed && (
                      <Badge size="sm" color="green" variant="light">
                        Завершено
                      </Badge>
                    )}
                  </Group>
                  <Text fw={500}>
                    {item.lesson?.title || 'Урок'}
                  </Text>
                  {item.lesson?.module?.course?.title && (
                    <Text size="xs" c="dimmed">
                      Курс: {item.lesson.module.course.title}
                    </Text>
                  )}
                </Stack>
              </Group>
              
              <Group gap="md">
                <Stack align="flex-end" gap={4}>
                  <Group gap={4}>
                    <Clock size={14} style={{ color: 'var(--mantine-color-gray-6)' }} />
                    <Text size="xs" c="dimmed">
                      {formatDuration(item.watchedSeconds)}
                    </Text>
                  </Group>
                  <Text size="xs" c="dimmed">
                    {new Date(item.viewedAt).toLocaleString('ru-RU')}
                  </Text>
                </Stack>
                
                {courseSlug && lessonSlug && (
                  <Button 
                    component={Link} 
                    to={`/courses/${courseSlug}/lessons/${lessonSlug}`}
                    variant="light" 
                    size="xs"
                  >
                    Открыть
                  </Button>
                )}
              </Group>
            </Group>
          </Card>
        )
      })}
    </Stack>
  )
}
