// src/pages/profile/ProfilePage.tsx
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Container,
  Paper,
  Avatar,
  Text,
  Title,
  Badge,
  Group,
  Stack,
  Tabs,
  Card,
  SimpleGrid,
  Button,
  Skeleton,
  ActionIcon,
  Tooltip,
} from '@mantine/core'
import {
  User,
  Calendar,
  BookOpen,
  FileText,
  Award,
  Send,
  Youtube,
  Link as LinkIcon,
  Edit,
  CreditCard,
  Lightbulb,
  Info,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { ProgressTab, HistoryTab, FavoritesTab, CertificatesTab, SubscriptionPaymentTab, DevelopingTab } from '../../components/profile'
import { APP_CONFIG, COLORS } from '../../constants'

interface Profile {
  id: string
  nickname: string
  displayName: string
  avatarUrl: string | null
  coverImage: string | null
  bio: string | null
  website: string | null
  telegram: string | null
  youtube: string | null
  totalViews: number
  subscribers: number
  createdAt: string
  user: { id: string; role: string }
}

interface ProfileCounts {
  courses: number
  lessons: number
  certificates: number
}

interface Course {
  id: string
  title: string
  slug: string
  coverImage: string | null
  difficultyLevel: string
  viewsCount: number
  lessonsCount: number
}

export function ProfilePage() {
  const { nickname } = useParams<{ nickname: string }>()
  const { profile: currentUserProfile } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [counts, setCounts] = useState<ProfileCounts>({ courses: 0, lessons: 0, certificates: 0 })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('about')

  // Получаем параметр tab из URL при загрузке
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tabParam = params.get('tab')
    if (tabParam) {
      setActiveTab(tabParam)
    }
  }, [nickname])

  const isOwnProfile = currentUserProfile?.nickname === nickname
  const [coverImageError, setCoverImageError] = useState(false)

  useEffect(() => {
    if (nickname) fetchProfile()
  }, [nickname])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${APP_CONFIG.apiUrl}/user/profile/${nickname}`)
      if (!response.ok) throw new Error('Профиль не найден')
      const data = await response.json()
      setProfile(data.profile)
      setCourses(data.courses || [])
      setCounts(data.counts || { courses: 0, lessons: 0, certificates: 0 })
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = { ADMIN: 'red', MODERATOR: 'orange', AUTHOR: 'blue', USER: 'gray' }
    const labels: Record<string, string> = { ADMIN: 'Администратор', MODERATOR: 'Модератор', AUTHOR: 'Автор', USER: 'Пользователь' }
    return <Badge color={colors[role] || 'gray'} variant="light">{labels[role] || role}</Badge>
  }

  if (loading) {
    return (
      <Container size="lg" py="xl">
        <Skeleton height={200} radius="md" mb="xl" />
        <Group>
          <Skeleton height={100} width={100} radius="xl" />
          <Stack>
            <Skeleton height={24} width={200} />
            <Skeleton height={16} width={150} />
          </Stack>
        </Group>
      </Container>
    )
  }

  if (!profile) {
    return (
      <Container size="lg" py="xl">
        <Paper p="xl" ta="center">
          <Text size="xl" c="dimmed">Пользователь не найден</Text>
          <Button component={Link} to="/" mt="md">На главную</Button>
        </Paper>
      </Container>
    )
  }

  // Обработчик ошибки загрузки обложки
  const handleCoverError = () => {
    setCoverImageError(true)
  }

  // Определяем background для обложки
  const coverBackground = coverImageError || !profile.coverImage
    ? `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`
    : `url(${profile.coverImage})`

  return (
    <Container size="lg" py="xl">
      <Paper 
        shadow="sm" 
        radius="md" 
        style={{ 
          height: 200, 
          backgroundImage: coverBackground, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          position: 'relative', 
          marginBottom: 0 
        }}
        onError={handleCoverError}
      >
        {isOwnProfile && (
          <Tooltip label="Редактировать профиль">
            <ActionIcon component={Link} to="/profile/settings" variant="white" size="lg" style={{ position: 'absolute', top: 16, right: 16 }}><Edit size={18} /></ActionIcon>
          </Tooltip>
        )}
      </Paper>

      <Paper p="lg" radius="md" shadow="sm">
        <Group gap="lg" align="flex-start">
          <Avatar src={profile.avatarUrl} size={100} radius="xl" style={{ border: '4px solid white', marginTop: -60 }}><User size={40} /></Avatar>
          <Stack gap="xs" style={{ flex: 1 }}>
            <Group><Title order={2}>{profile.displayName}</Title>{getRoleBadge(profile.user.role)}</Group>
            <Text c="dimmed" size="sm">@{profile.nickname}</Text>
            {profile.bio && <Text size="sm" mt="xs">{profile.bio}</Text>}
            <Group gap="xs" mt="xs">
              {profile.website && <Button component="a" href={profile.website} target="_blank" variant="subtle" size="xs" leftSection={<LinkIcon size={14} />}>Сайт</Button>}
              {profile.telegram && <Button component="a" href={`https://t.me/${profile.telegram.replace('@', '')}`} target="_blank" variant="subtle" size="xs" leftSection={<Send size={14} />}>Telegram</Button>}
              {profile.youtube && <Button component="a" href={profile.youtube} target="_blank" variant="subtle" size="xs" leftSection={<Youtube size={14} />}>YouTube</Button>}
            </Group>
            <Group gap="lg" mt="md">
              <Group gap={4}><Calendar size={16} style={{ color: COLORS.muted }} /><Text size="sm" c="dimmed">На платформе с {new Date(profile.createdAt).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}</Text></Group>
              <Group gap={4}><BookOpen size={16} style={{ color: COLORS.muted }} /><Text size="sm" c="dimmed">{counts.courses} курсов</Text></Group>
              <Group gap={4}><FileText size={16} style={{ color: COLORS.muted }} /><Text size="sm" c="dimmed">{counts.lessons} уроков</Text></Group>
            </Group>
          </Stack>
          <Stack align="flex-end" gap="xs">
            <Text size="lg" fw={700}>{profile.totalViews.toLocaleString()}</Text>
            <Text size="sm" c="dimmed">просмотров</Text>
          </Stack>
        </Group>
      </Paper>

      <Paper mt="xl" radius="md" shadow="sm">
        <Tabs value={activeTab} onChange={(v) => {
          setActiveTab(v || 'about')
          // Обновляем URL без перезагрузки
          const url = new URL(window.location.href)
          if (v && v !== 'about') {
            url.searchParams.set('tab', v)
          } else {
            url.searchParams.delete('tab')
          }
          navigate(url.pathname + url.search, { replace: true })
        }}>
          <Tabs.List>
            <Tabs.Tab value="about" leftSection={<User size={16} />}>О себе</Tabs.Tab>
            {isOwnProfile && <Tabs.Tab value="progress" leftSection={<BookOpen size={16} />}>Мой прогресс</Tabs.Tab>}
            {isOwnProfile && <Tabs.Tab value="history" leftSection={<FileText size={16} />}>История</Tabs.Tab>}
            {isOwnProfile && <Tabs.Tab value="favorites" leftSection={<Award size={16} />}>Избранное</Tabs.Tab>}
            {profile.user.role === 'AUTHOR' && <Tabs.Tab value="courses" leftSection={<BookOpen size={16} />}>Курсы ({counts.courses})</Tabs.Tab>}
            <Tabs.Tab value="certificates" leftSection={<Award size={16} />}>Сертификаты ({counts.certificates})</Tabs.Tab>
            {isOwnProfile && <Tabs.Tab value="subscriptions" leftSection={<CreditCard size={16} />}>Подписки</Tabs.Tab>}
            {isOwnProfile && <Tabs.Tab value="postulates" leftSection={<Lightbulb size={16} />}>Постулаты</Tabs.Tab>}
            <Tabs.Tab value="info" leftSection={<Info size={16} />}>Информация</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="about" p="lg">
            <Stack gap="md">
              <Text>{profile.bio || 'Пользователь пока не добавил информацию о себе.'}</Text>
              {isOwnProfile && profile.user.role === 'USER' && (
                <Card withBorder p="md" mt="md">
                  <Group justify="space-between">
                    <Stack gap={4}><Text fw={500}>Станьте автором!</Text><Text size="sm" c="dimmed">Создавайте курсы и делитесь знаниями</Text></Stack>
                    <Button component={Link} to="/become-author" variant="light">Подать заявку</Button>
                  </Group>
                </Card>
              )}
            </Stack>
          </Tabs.Panel>
          <Tabs.Panel value="courses" p="lg">
            {courses.length === 0 ? <Text c="dimmed" ta="center" py="xl">Автор пока не создал ни одного курса</Text> : (
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                {courses.map((course) => {
                  const difficultyLabels: Record<string, string> = {
                    BEGINNER: 'Начинающий',
                    INTERMEDIATE: 'Средний',
                    ADVANCED: 'Продвинутый'
                  }
                  return (
                    <Card key={course.id} component={Link} to={`/courses/${course.slug}`} withBorder radius="md" style={{ textDecoration: 'none' }}>
                      <Group justify="space-between" mb="xs"><Text fw={500} lineClamp={1}>{course.title}</Text><Badge>{difficultyLabels[course.difficultyLevel] || course.difficultyLevel}</Badge></Group>
                      <Text size="sm" c="dimmed">{course.lessonsCount} уроков • {course.viewsCount} просмотров</Text>
                    </Card>
                  )
                })}
              </SimpleGrid>
            )}
          </Tabs.Panel>
          <Tabs.Panel value="certificates" p="lg">
            {isOwnProfile ? (
              <CertificatesTab />
            ) : (
              <Text c="dimmed" ta="center" py="xl">Сертификаты скрыты</Text>
            )}
          </Tabs.Panel>
          
          {/* Приватные вкладки - только для своего профиля */}
          {isOwnProfile && (
            <>
              <Tabs.Panel value="progress" p="lg">
                <ProgressTab />
              </Tabs.Panel>
              <Tabs.Panel value="history" p="lg">
                <HistoryTab />
              </Tabs.Panel>
              <Tabs.Panel value="favorites" p="lg">
                <FavoritesTab />
              </Tabs.Panel>
              <Tabs.Panel value="subscriptions" p="lg">
                <SubscriptionPaymentTab />
              </Tabs.Panel>
              <Tabs.Panel value="postulates" p="lg">
                <DevelopingTab 
                  title="Постулаты" 
                  description="Раздел с основными принципами и постулатами финансовой грамотности. Здесь вы найдёте фундаментальные законы управления личными финансами."
                />
              </Tabs.Panel>
              <Tabs.Panel value="info" p="lg">
                <DevelopingTab 
                  title="Информация" 
                  description="Информация о платформе Экономикус, команде проекта и контакты для связи. Узнайте больше о нашей миссии и целях."
                />
              </Tabs.Panel>
            </>
          )}
        </Tabs>
      </Paper>
    </Container>
  )
}
