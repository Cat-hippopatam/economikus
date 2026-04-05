// src/components/profile/FavoritesTab.tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Stack, Card, Group, Text, Badge, ActionIcon, Button, Image, Modal, ThemeIcon } from '@mantine/core'
import { Heart, Trash2, BookOpen, Video, Headphones, FileText, Calculator, Lock } from 'lucide-react'
import { LoadingState, EmptyState, ErrorState } from '../common'
import { useUserFavorites, useAuth } from '../../hooks'
import { APP_CONFIG, COLORS } from '../../constants'

const LESSON_TYPE_ICONS: Record<string, typeof BookOpen> = {
  ARTICLE: FileText,
  VIDEO: Video,
  AUDIO: Headphones,
  QUIZ: FileText,
  CALCULATOR: Calculator,
}

const LESSON_TYPE_LABELS: Record<string, string> = {
  ARTICLE: 'Статья',
  VIDEO: 'Видео',
  AUDIO: 'Аудио',
  QUIZ: 'Тест',
  CALCULATOR: 'Калькулятор',
}

export function FavoritesTab() {
  const { items, loading, error, fetchFavorites, removeFavorite } = useUserFavorites()
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [accessModal, setAccessModal] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<{ title: string; courseSlug: string } | null>(null)
  const [checkingAccess, setCheckingAccess] = useState(false)

  if (loading) {
    return <LoadingState text="Загрузка избранного..." />
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchFavorites} />
  }

  if (items.length === 0) {
    return (
      <EmptyState
        message="Избранное пусто"
        description="Добавляйте уроки в избранное, чтобы не потерять их"
        icon={<Heart size={40} />}
      />
    )
  }

  const handleRemove = async (id: string) => {
    try {
      await removeFavorite(id)
    } catch {
      // Ошибка обрабатывается в хуке
    }
  }

  const handleLessonClick = async (
    e: React.MouseEvent, 
    courseSlug: string, 
    lessonTitle: string, 
    lessonSlug: string
  ) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!profile) {
      navigate(`/courses/${courseSlug}/lessons/${lessonSlug}`)
      return
    }

    setCheckingAccess(true)
    setSelectedLesson({ title: lessonTitle, courseSlug })

    try {
      const response = await fetch(`${APP_CONFIG.apiUrl}/subscriptions/check-access`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        
        if (data.hasAccess) {
          navigate(`/courses/${courseSlug}/lessons/${lessonSlug}`)
        } else {
          setAccessModal(true)
        }
      } else {
        navigate(`/courses/${courseSlug}/lessons/${lessonSlug}`)
      }
    } catch {
      navigate(`/courses/${courseSlug}/lessons/${lessonSlug}`)
    } finally {
      setCheckingAccess(false)
    }
  }

  return (
    <>
      <Stack gap="md">
        {items.map((favorite) => {
          const Icon = LESSON_TYPE_ICONS[favorite.lesson.lessonType] || BookOpen
          const courseSlug = favorite.lesson.module?.course?.slug || ''
          
          return (
            <Card key={favorite.id} withBorder padding="md" radius="md">
              <Group justify="space-between" wrap="nowrap">
                <Group gap="md" wrap="nowrap" style={{ flex: 1 }}>
                  {favorite.lesson.coverImage ? (
                    <Image
                      src={favorite.lesson.coverImage}
                      w={80}
                      h={60}
                      radius="md"
                      fit="cover"
                    />
                  ) : (
                    <Group
                      justify="center"
                      style={{
                        width: 80,
                        height: 60,
                        background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
                        borderRadius: 8
                      }}
                    >
                      <Icon size={24} color="white" />
                    </Group>
                  )}
                  
                  <Stack gap={4} style={{ flex: 1 }}>
                    <Group gap="xs">
                      <Badge size="sm" variant="light">
                        {LESSON_TYPE_LABELS[favorite.lesson.lessonType]}
                      </Badge>
                      {favorite.lesson.duration && (
                        <Text size="xs" c="dimmed">
                          {Math.floor(favorite.lesson.duration / 60)} мин
                        </Text>
                      )}
                    </Group>
                    <Text fw={500} lineClamp={1}>
                      {favorite.lesson.title}
                    </Text>
                    {favorite.note && (
                      <Text size="sm" c="dimmed" lineClamp={1}>
                        {favorite.note}
                      </Text>
                    )}
                  </Stack>
                </Group>
                
                <Group gap="xs">
                  <Button
                    variant="light"
                    size="xs"
                    onClick={(e) => handleLessonClick(
                      e, 
                      courseSlug, 
                      favorite.lesson.title,
                      favorite.lesson.slug
                    )}
                    loading={checkingAccess && selectedLesson?.title === favorite.lesson.title}
                  >
                    Открыть
                  </Button>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => handleRemove(favorite.id)}
                  >
                    <Trash2 size={16} />
                  </ActionIcon>
                </Group>
              </Group>
            </Card>
          )
        })}
      </Stack>

      {accessModal && (
        <Modal 
          opened={accessModal} 
          onClose={() => setAccessModal(false)} 
          title="Доступ ограничен" 
          size="sm"
        >
          <Stack gap="md">
            <Group justify="center">
              <ThemeIcon size={48} radius="xl" color="yellow">
                <Lock size={24} />
              </ThemeIcon>
            </Group>
            <Text ta="center">
              Для просмотра урока <Text component="span" fw={500}>&#34;{selectedLesson?.title}&#34;</Text> необходима подписка.
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              Оформите подписку, чтобы получить доступ ко всем премиум-урокам.
            </Text>
            <Group justify="center" mt="md">
              <Button variant="subtle" onClick={() => setAccessModal(false)}>
                Закрыть
              </Button>
              <Button 
                component={Link} 
                to="/profile?tab=subscriptions" 
                onClick={() => setAccessModal(false)}
              >
                Оформить подписку
              </Button>
            </Group>
          </Stack>
        </Modal>
      )}
    </>
  )
}
