// src/pages/profile/ProfilePage.tsx
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
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
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
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
  _count: { courses: number; lessons: number; certificates: number }
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
  const [profile, setProfile] = useState<Profile | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('about')

  const isOwnProfile = currentUserProfile?.nickname === nickname

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

  const [coverImageError, setCoverImageError] = useState(false)

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
              <Group gap={4}><BookOpen size={16} style={{ color: COLORS.muted }} /><Text size="sm" c="dimmed">{profile._count.courses} курсов</Text></Group>
              <Group gap={4}><FileText size={16} style={{ color: COLORS.muted }} /><Text size="sm" c="dimmed">{profile._count.lessons} уроков</Text></Group>
            </Group>
          </Stack>
          <Stack align="flex-end" gap="xs">
            <Text size="lg" fw={700}>{profile.totalViews.toLocaleString()}</Text>
            <Text size="sm" c="dimmed">просмотров</Text>
          </Stack>
        </Group>
      </Paper>

      <Paper mt="xl" radius="md" shadow="sm">
        <Tabs value={activeTab} onChange={(v) => setActiveTab(v || 'about')}>
          <Tabs.List>
            <Tabs.Tab value="about" leftSection={<User size={16} />}>О себе</Tabs.Tab>
            {profile.user.role === 'AUTHOR' && <Tabs.Tab value="courses" leftSection={<BookOpen size={16} />}>Курсы ({profile._count.courses})</Tabs.Tab>}
            <Tabs.Tab value="certificates" leftSection={<Award size={16} />}>Сертификаты ({profile._count.certificates})</Tabs.Tab>
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
                {courses.map((course) => (
                  <Card key={course.id} component={Link} to={`/courses/${course.slug}`} withBorder radius="md" style={{ textDecoration: 'none' }}>
                    <Group justify="space-between" mb="xs"><Text fw={500} lineClamp={1}>{course.title}</Text><Badge>{course.difficultyLevel}</Badge></Group>
                    <Text size="sm" c="dimmed">{course.lessonsCount} уроков • {course.viewsCount} просмотров</Text>
                  </Card>
                ))}
              </SimpleGrid>
            )}
          </Tabs.Panel>
          <Tabs.Panel value="certificates" p="lg"><Text c="dimmed" ta="center" py="xl">Сертификаты пока не получены</Text></Tabs.Panel>
        </Tabs>
      </Paper>
    </Container>
  )
}
