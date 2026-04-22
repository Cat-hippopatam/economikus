// src/pages/lessons/LessonPage.tsx
/**
 * Страница урока с навигацией по модулям
 */

import { useParams, Link } from 'react-router-dom'
import {
  Paper,
  Title,
  Text,
  Group,
  Stack,
  Container,
  Badge,
  Box,
  Button,
  Skeleton,
  ThemeIcon,
  Divider,
  ScrollArea,
  List,
  ActionIcon,
  Tooltip,
  Code,
  Blockquote,
  Table,
} from '@mantine/core'
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Crown,
  FileText,
  Video,
  Headphones,
  HelpCircle,
  Menu,
  X,
  Calculator,
  Heart,
} from 'lucide-react'
import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useLesson } from '@/hooks/useLesson'
import { useLessonAccess } from '@/hooks/useLessonAccess'
import { useAuth } from '@/hooks/useAuth'
import { useUserFavorites } from '@/hooks/useUserFavorites'

import { APP_CONFIG } from '@/constants'
import { CompoundInterestCalculator, LoanCalculator, MortgageCalculator } from '@/components/calculators'

// Иконка типа урока
const LessonTypeIcon = ({ type, size = 16 }: { type: string; size?: number }) => {
  const iconMap: Record<string, typeof FileText> = {
    ARTICLE: FileText,
    VIDEO: Video,
    AUDIO: Headphones,
    QUIZ: HelpCircle,
    CALCULATOR: Calculator,
  }
  const Icon = iconMap[type] || FileText
  return <Icon size={size} />
}

// Найти предыдущий/следующий урок
function findAdjacentLessons(
  modules: { id: string; title: string; sortOrder: number; lessons: { id: string; slug: string; title: string; sortOrder: number }[] }[],
  currentLessonId: string
) {
  const allLessons: { moduleId: string; moduleTitle: string; lesson: { id: string; slug: string; title: string } }[] = []
  
  modules
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .forEach(module => {
      module.lessons
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .forEach(lesson => {
          allLessons.push({
            moduleId: module.id,
            moduleTitle: module.title,
            lesson: lesson,
          })
        })
    })

  const currentIndex = allLessons.findIndex(l => l.lesson.id === currentLessonId)
  
  return {
    prev: currentIndex > 0 ? allLessons[currentIndex - 1] : null,
    next: currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null,
    currentModule: currentIndex >= 0 ? allLessons[currentIndex]?.moduleTitle : null,
  }
}

// Компонент для рендеринга Markdown
function MarkdownRenderer({ content }: { content: string }) {
  return (
    <Box 
      className="markdown-content" 
      style={{
        lineHeight: 1.8,
        fontSize: '1rem',
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <Title order={1} mt="xl" mb="md">{children}</Title>,
          h2: ({ children }) => <Title order={2} mt="lg" mb="md">{children}</Title>,
          h3: ({ children }) => <Title order={3} mt="md" mb="sm">{children}</Title>,
          h4: ({ children }) => <Title order={4} mt="sm" mb="xs">{children}</Title>,
          p: ({ children }) => <Text mb="md" style={{ lineHeight: 1.8 }}>{children}</Text>,
          ul: ({ children }) => <List listStyleType="disc" mb="md" ml="lg">{children}</List>,
          ol: ({ children }) => <List type="ordered" mb="md" ml="lg">{children}</List>,
          li: ({ children }) => <List.Item style={{ marginBottom: 4 }}>{children}</List.Item>,
          blockquote: ({ children }) => (
            <Blockquote color="blue" icon={null} mt="md" mb="md">
              {children}
            </Blockquote>
          ),
          code: ({ className, children }) => {
            const match = /language-(\w+)/.exec(className || '')
            const isInline = !match
            return isInline ? (
              <Code>{children}</Code>
            ) : (
              <Box
                component="pre"
                bg="gray.9"
                c="gray.1"
                p="md"
                style={{ overflow: 'auto', fontSize: '0.875rem', borderRadius: 8 }}
                mb="md"
              >
                <Code block color="gray.1">
                  {String(children).replace(/\n$/, '')}
                </Code>
              </Box>
            )
          },
          table: ({ children }) => (
            <Box style={{ overflowX: 'auto', marginBottom: 16 }}>
              <Table striped withTableBorder>
                {children}
              </Table>
            </Box>
          ),
          thead: ({ children }) => <Table.Thead>{children}</Table.Thead>,
          tbody: ({ children }) => <Table.Tbody>{children}</Table.Tbody>,
          tr: ({ children }) => <Table.Tr>{children}</Table.Tr>,
          th: ({ children }) => <Table.Th>{children}</Table.Th>,
          td: ({ children }) => <Table.Td>{children}</Table.Td>,
          a: ({ href, children }) => (
            <Text component="a" href={href} target="_blank" rel="noopener noreferrer" c="blue" style={{ textDecoration: 'underline' }}>
              {children}
            </Text>
          ),
          img: ({ src, alt }) => (
            <Box component="img" src={src} alt={alt} style={{ maxWidth: '100%', borderRadius: 8, marginBottom: 16 }} />
          ),
          hr: () => <Divider my="lg" />,
          strong: ({ children }) => <Text component="strong" fw={700} span>{children}</Text>,
          em: ({ children }) => <Text component="em" fs="italic" span>{children}</Text>,
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  )
}

// Рендер контента урока
function LessonContent({ lesson }: { lesson: any }) {
  const content = lesson.content

  if (!content) {
    return (
      <Paper p="xl" withBorder>
        <Text c="dimmed">Содержимое урока недоступно</Text>
      </Paper>
    )
  }

  switch (content.type) {
    case 'text':
      return (
        <Paper p="xl" withBorder>
          <Stack gap="md">
            <Group>
              <FileText size={20} />
              <Text fw={500}>Текстовый урок</Text>
            </Group>
            <Divider />
            {content.body ? (
              <MarkdownRenderer content={content.body} />
            ) : (
              <Text c="dimmed">Текст отсутствует</Text>
            )}
          </Stack>
        </Paper>
      )

    case 'video':
      return (
        <Paper p="xl" withBorder>
          <Stack gap="md">
            <Group>
              <Video size={20} />
              <Text fw={500}>Видеоурок</Text>
            </Group>
            <Divider />
            {content.videoUrl && (
              <Box style={{ position: 'relative', paddingTop: '56.25%' }}>
                {content.platform === 'youtube' && (
                  <iframe
                    src={content.videoUrl.replace('watch?v=', 'embed/')}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    allowFullScreen
                  />
                )}
                {content.platform === 'rutube' && (
                  <iframe
                    src={content.videoUrl.replace('rutube.ru/video/', 'rutube.ru/play/embed/')}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    allowFullScreen
                  />
                )}
                {content.platform === 'vimeo' && (
                  <iframe
                    src={content.videoUrl.replace('vimeo.com/', 'player.vimeo.com/video/')}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    allowFullScreen
                  />
                )}
                {!['youtube', 'rutube', 'vimeo'].includes(content.platform) && (
                  <video 
                    src={content.videoUrl} 
                    controls 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  />
                )}
              </Box>
            )}
            {content.body && (
              <Box mt="md">
                <MarkdownRenderer content={content.body} />
              </Box>
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
              <Text fw={500}>Аудиоурок</Text>
            </Group>
            <Divider />
            {content.audioUrl && (
              <audio controls src={content.audioUrl} style={{ width: '100%' }} />
            )}
            {content.body && (
              <Box mt="md">
                <MarkdownRenderer content={content.body} />
              </Box>
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
              {content.passingScore && (
                <Badge variant="light">Проходной балл: {content.passingScore}%</Badge>
              )}
            </Group>
            <Divider />
            {content.questions && content.questions.length > 0 ? (
              <Stack gap="lg">
                {content.questions.map((q: any, i: number) => (
                  <Paper key={i} p="md" withBorder>
                    <Text fw={500} mb="sm">{i + 1}. {q.question}</Text>
                    <List listStyleType="none" spacing="xs">
                      {q.options?.map((opt: string, j: number) => (
                        <List.Item key={j}>
                          <Group gap="xs">
                            <ThemeIcon size="sm" variant="light" color="gray">
                              {String.fromCharCode(65 + j)}
                            </ThemeIcon>
                            <Text size="sm">{opt}</Text>
                          </Group>
                        </List.Item>
                      ))}
                    </List>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Text c="dimmed">Вопросы не добавлены</Text>
            )}
          </Stack>
        </Paper>
      )

    case 'calculator':
      // Выбор калькулятора по slug урока или по типу в content
      const calculatorSlug = lesson.slug || content.calculatorType
      const CALCULATOR_MAP: Record<string, React.ComponentType> = {
        'compound-interest': CompoundInterestCalculator,
        'compound-interest-demo': CompoundInterestCalculator,
        'loan': LoanCalculator,
        'mortgage': MortgageCalculator,
      }
      const CalculatorComponent = calculatorSlug ? CALCULATOR_MAP[calculatorSlug] : undefined

      return CalculatorComponent ? (
        <Stack gap="lg">
          <Paper p="md" withBorder bg="blue.0">
            <Group gap="md">
              <ThemeIcon size="lg" variant="light" color="blue">
                <Calculator size={20} />
              </ThemeIcon>
              <Box style={{ flex: 1 }}>
                <Text fw={500}>Интерактивный калькулятор</Text>
                <Text size="sm" c="dimmed">Измените параметры и мгновенно получите результат</Text>
              </Box>
            </Group>
          </Paper>
          <CalculatorComponent />
          {content.body && (
            <Paper p="xl" withBorder>
              <MarkdownRenderer content={content.body} />
            </Paper>
          )}
        </Stack>
      ) : (
        <Paper p="xl" withBorder>
          <Stack gap="md" align="center">
            <Calculator size={48} />
            <Text c="dimmed">Калькулятор не найден</Text>
            <Button component={Link} to="/calculators" variant="light">
              Все калькуляторы
            </Button>
          </Stack>
        </Paper>
      )

    default:
      return <Text c="dimmed">Неизвестный тип контента</Text>
  }
}

// Боковая панель навигации
function Sidebar({
  modules,
  currentLessonId,
  courseSlug,
  isOpen,
  onClose,
}: {
  modules: any[]
  currentLessonId: string
  courseSlug: string
  isOpen: boolean
  onClose: () => void
}) {
  const content = (
    <Stack gap="md">
      <Group justify="space-between">
        <Text fw={500}>Содержание курса</Text>
        <ActionIcon variant="subtle" onClick={onClose}>
          <X size={18} />
        </ActionIcon>
      </Group>
      <Divider />
      <ScrollArea h="calc(100vh - 200px)">
        <Stack gap="md">
          {modules
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map(module => (
              <Box key={module.id}>
                <Text fw={500} size="sm" mb="xs">
                  {module.title}
                </Text>
                <Stack gap="xs">
                  {module.lessons
                    .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
                    .map((lesson: any) => {
                      const isActive = lesson.id === currentLessonId
                      const isCompleted = false // TODO: проверять прогресс
                      
                      return (
                        <Paper
                          key={lesson.id}
                          component={Link}
                          to={`/courses/${courseSlug}/lessons/${lesson.slug}`}
                          p="xs"
                          withBorder
                          style={{
                            cursor: 'pointer',
                            backgroundColor: isActive ? 'var(--mantine-color-blue-0)' : undefined,
                            borderColor: isActive ? 'var(--mantine-color-blue-5)' : undefined,
                            textDecoration: 'none',
                            display: 'block',
                          }}
                        >
                          <Group gap="xs" wrap="nowrap">
                            <ThemeIcon
                              size="sm"
                              variant={isCompleted ? 'filled' : 'light'}
                              color={isCompleted ? 'green' : 'gray'}
                            >
                              {isCompleted ? <Check size={12} /> : <LessonTypeIcon type={lesson.lessonType} size={12} />}
                            </ThemeIcon>
                            <Text size="sm" style={{ flex: 1 }} c={isActive ? 'blue' : undefined}>
                              {lesson.title}
                            </Text>
                            {lesson.isPremium && <Crown size={12} color="#F4A261" />}
                          </Group>
                        </Paper>
                      )
                    })}
                </Stack>
              </Box>
            ))}
        </Stack>
      </ScrollArea>
    </Stack>
  )

  return (
    <>
      {/* Мобильная версия - Drawer на весь экран */}
      <Box
        className="md:hidden"
        style={{
          position: 'fixed',
          top: 0,
          left: isOpen ? 0 : '-100%',
          width: '100%',
          height: '100vh',
          backgroundColor: 'white',
          zIndex: 1000,
          padding: 16,
          transition: 'left 0.3s ease',
          overflow: 'auto',
        }}
      >
        {content}
      </Box>

      {/* Затемнение фона для мобильного меню */}
      {isOpen && (
        <Box
          className="md:hidden"
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
          }}
        />
      )}

      {/* Десктопная версия - всегда видна только на экранах md и выше */}
      <Box className="hidden md:block">
        <Paper
          p="md"
          withBorder
          style={{
            position: 'sticky',
            top: 80,
            width: 280,
            flexShrink: 0,
          }}
        >
          {content}
        </Paper>
      </Box>
    </>
  )
}

export default function LessonPage() {
  const { courseSlug, lessonSlug } = useParams<{ courseSlug: string; lessonSlug: string }>()
  const { lesson, modules, progress, loading, error, markCompleted } = useLesson(courseSlug, lessonSlug)
  const { hasAccess, loading: accessLoading, error: accessError, course: courseInfo } = useLessonAccess(courseSlug)
  const { profile } = useAuth()
  const { items: favorites, fetchFavorites } = useUserFavorites()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  // Проверить, добавлен ли урок в избранное
  const isFavorite = lesson ? favorites.some(f => f.lesson?.id === lesson.id) : false

  // Загрузить избранное при загрузке страницы
  useEffect(() => {
    if (profile) {
      fetchFavorites()
    }
  }, [profile, fetchFavorites])

  // Обработчик добавления/удаления из избранного
  const handleToggleFavorite = async () => {
    if (!lesson || !profile) return
    
    setFavoriteLoading(true)
    try {
      if (isFavorite) {
        const favorite = favorites.find(f => f.lesson?.id === lesson.id)
        if (favorite) {
          await fetch(`${APP_CONFIG.apiUrl}/user/favorites/${favorite.id}`, {
            method: 'DELETE',
            credentials: 'include'
          })
        }
      } else {
        await fetch(`${APP_CONFIG.apiUrl}/user/favorites`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lessonId: lesson.id })
        })
      }
      await fetchFavorites()
    } catch (err) {
      console.error('Error toggling favorite:', err)
    } finally {
      setFavoriteLoading(false)
    }
  }

  // Найти предыдущий/следующий урок
  const adjacent = lesson ? findAdjacentLessons(modules, lesson.id) : { prev: null, next: null }

  // Отметить как пройденный при скролле вниз
  useEffect(() => {
    const handleScroll = () => {
      if (progress?.status === 'COMPLETED') return
      
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      if (scrollPercent > 80 && lesson && !progress) {
        markCompleted()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lesson, progress, markCompleted])

  if (loading || accessLoading) {
    return (
      <Container size="lg" py="xl">
        <Skeleton height={40} mb="md" />
        <Skeleton height={20} mb="xl" />
        <Skeleton height={300} radius="md" />
      </Container>
    )
  }

  // Проверка доступа к премиум курсу
  if (!hasAccess) {
    return (
      <Container size="lg" py="xl">
        <Paper p="xl" withBorder ta="center">
          <Stack align="center" gap="md">
            <Title order={2}>Доступ ограничен</Title>
            <Text c="dimmed">
              {accessError || 'Для просмотра этого урока необходима подписка'}
            </Text>
            <Text size="sm" c="dimmed">
              Курс: {courseInfo?.title}
            </Text>
            <Group justify="center" mt="md">
              <Button component={Link} to={`/courses/${courseSlug}`} variant="light">
                Вернуться к курсу
              </Button>
              {profile ? (
                <Button component={Link} to="/profile?tab=subscriptions" variant="filled">
                  Оформить подписку
                </Button>
              ) : (
                <Button component={Link} to="/login" variant="filled">
                  Войти для доступа
                </Button>
              )}
            </Group>
          </Stack>
        </Paper>
      </Container>
    )
  }

  if (error || !lesson) {
    return (
      <Container size="lg" py="xl">
        <Paper p="xl" withBorder>
          <Text c="red" ta="center">{error || 'Урок не найден'}</Text>
          <Group justify="center" mt="md">
            <Button component={Link} to={`/courses/${courseSlug}`} variant="light">
              Вернуться к курсу
            </Button>
          </Group>
        </Paper>
      </Container>
    )
  }

  return (
    <Box style={{ minHeight: '100vh' }}>
      {/* Шапка урока */}
      <Box
        style={{
          background: 'linear-gradient(135deg, #264653 0%, #2A9D8F 100%)',
          padding: '20px 0',
          color: '#fff',
          position: 'sticky',
          top: 60,
          zIndex: 100,
        }}
      >
        <Container size="lg">
          <Group justify="space-between">
            <Group gap="md">
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => setSidebarOpen(true)}
                className="md:hidden"
                style={{ color: '#fff' }}
              >
                <Menu size={20} />
              </ActionIcon>
              <Box>
                <Group gap="xs">
                  <LessonTypeIcon type={lesson.lessonType} size={20} />
                  <Text size="sm" style={{ opacity: 0.8 }}>
                    {lesson.module?.title}
                  </Text>
                </Group>
                <Title order={3}>{lesson.title}</Title>
              </Box>
            </Group>
            <Group>
              {progress?.status === 'COMPLETED' && (
                <Badge color="green" variant="filled" leftSection={<Check size={12} />}>
                  Пройден
                </Badge>
              )}
              {profile && (
                <Tooltip label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}>
                  <ActionIcon
                    variant="subtle"
                    color={isFavorite ? 'red' : 'gray'}
                    onClick={handleToggleFavorite}
                    loading={favoriteLoading}
                    style={{ color: '#fff' }}
                  >
                    <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                  </ActionIcon>
                </Tooltip>
              )}
              <Button
                component={Link}
                to={`/courses/${courseSlug}`}
                variant="subtle"
                color="gray"
                leftSection={<ChevronLeft size={16} />}
                style={{ color: '#fff' }}
              >
                К курсу
              </Button>
            </Group>
          </Group>
        </Container>
      </Box>

      {/* Сайдбар - вынесен отдельно для работы на мобильных */}
      <Sidebar
        modules={modules}
        currentLessonId={lesson.id}
        courseSlug={courseSlug || ''}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Основной контент */}
      <Container size="lg" py="xl">
        {/* Десктопная верстка - с Group */}
        <Box className="hidden md:block">
          <Group align="flex-start" gap="xl" wrap="nowrap">
            {/* Пустой блок вместо сайдбара, чтобы сохранить структуру */}
            <Box style={{ width: 280, flexShrink: 0, visibility: 'hidden' }} />

            <Box style={{ flex: 1 }}>
              <Stack gap="lg">
                {lesson.description && (
                  <Text c="dimmed">{lesson.description}</Text>
                )}
                <LessonContent lesson={lesson} />
                <Paper p="md" withBorder>
                  <Group justify="space-between">
                    {adjacent.prev ? (
                      <Button
                        component={Link}
                        to={`/courses/${courseSlug}/lessons/${adjacent.prev.lesson.slug}`}
                        variant="light"
                        leftSection={<ChevronLeft size={16} />}
                      >
                        <Box>
                          <Text size="xs" c="dimmed">Предыдущий урок</Text>
                          <Text size="sm">{adjacent.prev.lesson.title}</Text>
                        </Box>
                      </Button>
                    ) : (
                      <Box />
                    )}
                    
                    {adjacent.next ? (
                      <Button
                        component={Link}
                        to={`/courses/${courseSlug}/lessons/${adjacent.next.lesson.slug}`}
                        variant="light"
                        rightSection={<ChevronRight size={16} />}
                      >
                        <Box style={{ textAlign: 'right' }}>
                          <Text size="xs" c="dimmed">Следующий урок</Text>
                          <Text size="sm">{adjacent.next.lesson.title}</Text>
                        </Box>
                      </Button>
                    ) : (
                      <Button
                        component={Link}
                        to={`/courses/${courseSlug}`}
                        variant="filled"
                        color="green"
                      >
                        Завершить курс
                      </Button>
                    )}
                  </Group>
                </Paper>
              </Stack>
            </Box>
          </Group>
        </Box>

        {/* Мобильная верстка - без Group, контент на всю ширину */}
        <Box className="md:hidden">
          <Stack gap="lg">
            {lesson.description && (
              <Text c="dimmed">{lesson.description}</Text>
            )}
            <LessonContent lesson={lesson} />
            <Paper p="md" withBorder>
              <Group justify="space-between">
                {adjacent.prev ? (
                  <Button
                    component={Link}
                    to={`/courses/${courseSlug}/lessons/${adjacent.prev.lesson.slug}`}
                    variant="light"
                    leftSection={<ChevronLeft size={16} />}
                  >
                    <Box>
                      <Text size="xs" c="dimmed">Предыдущий урок</Text>
                      <Text size="sm">{adjacent.prev.lesson.title}</Text>
                    </Box>
                  </Button>
                ) : (
                  <Box />
                )}
                
                {adjacent.next ? (
                  <Button
                    component={Link}
                    to={`/courses/${courseSlug}/lessons/${adjacent.next.lesson.slug}`}
                    variant="light"
                    rightSection={<ChevronRight size={16} />}
                  >
                    <Box style={{ textAlign: 'right' }}>
                      <Text size="xs" c="dimmed">Следующий урок</Text>
                      <Text size="sm">{adjacent.next.lesson.title}</Text>
                    </Box>
                  </Button>
                ) : (
                  <Button
                    component={Link}
                    to={`/courses/${courseSlug}`}
                    variant="filled"
                    color="green"
                  >
                    Завершить курс
                  </Button>
                )}
              </Group>
            </Paper>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}
