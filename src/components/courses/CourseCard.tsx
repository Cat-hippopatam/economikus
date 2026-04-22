// src/components/courses/CourseCard.tsx
/**
 * Карточка курса для каталога
 */

import { Card, Text, Badge, Group, Stack, Box, ThemeIcon } from '@mantine/core'
import { Clock, BookOpen, Crown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Course } from '@/types'
import { DIFFICULTY_CONFIG } from '@/constants'
import { MediaImage } from '../common/MediaImage'

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  const navigate = useNavigate()
  const difficulty = DIFFICULTY_CONFIG[course.difficultyLevel] || DIFFICULTY_CONFIG.BEGINNER

  const handleClick = () => {
    // Перенаправляем на профиль автора с активной вкладкой подписок
    if (course.author?.nickname) {
      navigate(`/user/${course.author.nickname}?tab=subscriptions`)
    } else {
      navigate(`/courses/${course.slug}`)
    }
  }

  return (
    <Card
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
      onClick={handleClick}
      style={{
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = ''
      }}
    >
      {/* Обложка */}
      <Box
        style={{
          height: 160,
          borderRadius: 8,
          overflow: 'hidden',
          marginBottom: 12,
          position: 'relative',
        }}
      >
        <MediaImage
          src={course.coverImage}
          mediaType="course"
          alt={course.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Премиум бейдж */}
        {course.isPremium && (
          <Badge
            color="yellow"
            variant="filled"
            leftSection={<Crown size={12} />}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          >
            Премиум
          </Badge>
        )}
      </Box>

      {/* Контент */}
      <Stack gap="xs" style={{ flex: 1 }}>
        {/* Уровень сложности */}
        <Badge color={difficulty.color} variant="light" size="sm" w="fit-content">
          {difficulty.label}
        </Badge>

        {/* Заголовок */}
        <Text fw={600} size="lg" lineClamp={2}>
          {course.title}
        </Text>

        {/* Описание */}
        {course.description && (
          <Text size="sm" c="dimmed" lineClamp={2}>
            {course.description}
          </Text>
        )}

        {/* Теги */}
        {course.tags && course.tags.length > 0 && (
          <Group gap={4}>
            {course.tags.slice(0, 3).map((tag) => (
              <Badge key={tag.id} size="sm" variant="outline" color="gray">
                {tag.name}
              </Badge>
            ))}
          </Group>
        )}

        {/* Мета-информация */}
        <Group justify="space-between" mt="auto" pt="sm">
          <Group gap="xs">
            <ThemeIcon size="sm" variant="light" color="blue">
              <BookOpen size={14} />
            </ThemeIcon>
            <Text size="sm" c="dimmed">
              {course.lessonsCount || 0} уроков
            </Text>
          </Group>

          {course.duration && (
            <Group gap={4}>
              <Clock size={14} color="var(--mantine-color-dimmed)" />
              <Text size="sm" c="dimmed">
                {Math.round(course.duration / 60)} ч
              </Text>
            </Group>
          )}
        </Group>

        {/* Автор */}
        {course.author && (
          <Group gap="xs">
            <Text size="sm" c="dimmed">
              {course.author?.displayName || course.author?.nickname || 'Неизвестно'}
            </Text>
          </Group>
        )}
      </Stack>
    </Card>
  )
}
