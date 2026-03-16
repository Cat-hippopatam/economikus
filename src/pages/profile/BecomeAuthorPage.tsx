// src/pages/profile/BecomeAuthorPage.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container, Paper, Title, Text, Stack, Textarea, TextInput, Button, Group, Alert, Skeleton, Card, ThemeIcon, List,
} from '@mantine/core'
import { Check, AlertCircle, Clock, X, FileText, Youtube, GraduationCap, Award } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { APP_CONFIG } from '../../constants'

interface Application {
  id: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  motivation: string
  experience: string | null
  portfolioUrl: string | null
  rejectionReason: string | null
  createdAt: string
  reviewedAt: string | null
  reviewer: { id: string; nickname: string; displayName: string } | null
}

export function BecomeAuthorPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [application, setApplication] = useState<Application | null>(null)
  const [motivation, setMotivation] = useState('')
  const [experience, setExperience] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetchApplication()
  }, [user])

  const fetchApplication = async () => {
    try {
      const response = await fetch(`${APP_CONFIG.apiUrl}/author/application`, { credentials: 'include' })
      const data = await response.json()
      setApplication(data.application)
    } catch (error) {
      console.error('Error fetching application:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (motivation.length < 50) return
    try {
      setSubmitting(true)
      const response = await fetch(`${APP_CONFIG.apiUrl}/author/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ motivation, experience, portfolioUrl }),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Ошибка отправки')
      }
      await fetchApplication()
    } catch (error) {
      console.error('Error submitting application:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Container size="md" py="xl"><Skeleton height={400} radius="md" /></Container>

  if (user?.role === 'AUTHOR' || user?.role === 'MODERATOR' || user?.role === 'ADMIN') {
    return (
      <Container size="md" py="xl">
        <Paper p="xl" ta="center">
          <ThemeIcon size={60} radius="xl" color="green" mb="md"><Check size={30} /></ThemeIcon>
          <Title order={2} mb="sm">Вы уже автор!</Title>
          <Text c="dimmed" mb="lg">У вас есть доступ к созданию курсов и уроков</Text>
          <Button onClick={() => navigate('/author/dashboard')}>Перейти в панель автора</Button>
        </Paper>
      </Container>
    )
  }

  if (application?.status === 'PENDING') {
    return (
      <Container size="md" py="xl">
        <Paper p="xl" ta="center">
          <ThemeIcon size={60} radius="xl" color="orange" mb="md"><Clock size={30} /></ThemeIcon>
          <Title order={2} mb="sm">Заявка на рассмотрении</Title>
          <Text c="dimmed" mb="lg">Ваша заявка была отправлена {new Date(application.createdAt).toLocaleDateString('ru-RU')}. Мы рассмотрим её в ближайшее время.</Text>
          <Alert icon={<Clock size={16} />} title="Обычно рассмотрение занимает 1-3 дня" color="blue" variant="light">Вы получите уведомление на email когда заявка будет рассмотрена</Alert>
        </Paper>
      </Container>
    )
  }

  if (application?.status === 'REJECTED') {
    return (
      <Container size="md" py="xl">
        <Paper p="xl">
          <Group justify="center" mb="md"><ThemeIcon size={60} radius="xl" color="red"><X size={30} /></ThemeIcon></Group>
          <Title order={2} ta="center" mb="sm">Заявка отклонена</Title>
          <Text c="dimmed" ta="center" mb="lg">К сожалению, ваша заявка была отклонена</Text>
          {application.rejectionReason && <Alert icon={<AlertCircle size={16} />} title="Причина" color="red" variant="light" mb="lg">{application.rejectionReason}</Alert>}
          <Text ta="center" mb="md">Вы можете подать новую заявку, учтя замечания</Text>
          <Group justify="center"><Button onClick={() => setApplication(null)}>Подать новую заявку</Button></Group>
        </Paper>
      </Container>
    )
  }

  return (
    <Container size="md" py="xl">
      <Title order={2} mb="md">Станьте автором</Title>
      <Text c="dimmed" mb="xl">Заполните форму ниже, чтобы получить статус автора и возможность публиковать курсы</Text>
      <Stack gap="xl">
        <Card withBorder p="md">
          <Title order={4} mb="md">Что даёт статус автора?</Title>
          <List spacing="sm" center>
            <List.Item icon={<ThemeIcon color="blue" radius="xl" size={24}><GraduationCap size={14} /></ThemeIcon>}>Создавайте курсы и уроки</List.Item>
            <List.Item icon={<ThemeIcon color="green" radius="xl" size={24}><FileText size={14} /></ThemeIcon>}>Публикуйте статьи и видео</List.Item>
            <List.Item icon={<ThemeIcon color="orange" radius="xl" size={24}><Youtube size={14} /></ThemeIcon>}>Получайте просмотры и подписчиков</List.Item>
            <List.Item icon={<ThemeIcon color="grape" radius="xl" size={24}><Award size={14} /></ThemeIcon>}>Выдавайте сертификаты за курсы</List.Item>
          </List>
        </Card>
        <Paper withBorder p="lg" radius="md">
          <Stack gap="md">
            <Textarea label="Почему вы хотите стать автором?" description="Расскажите о вашей мотивации (минимум 50 символов)" placeholder="Я хочу делиться знаниями с другими..." value={motivation} onChange={(e) => setMotivation(e.target.value)} minRows={4} required error={motivation.length > 0 && motivation.length < 50 ? 'Минимум 50 символов' : null} />
            <Textarea label="Опыт в преподавании" description="Расскажите о вашем опыте (необязательно)" placeholder="Я преподавал в университете..." value={experience} onChange={(e) => setExperience(e.target.value)} minRows={3} />
            <TextInput label="Ссылка на портфолио" description="Ссылка на ваши работы или профиль (необязательно)" placeholder="https://..." value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} />
            <Group justify="flex-end" mt="md"><Button onClick={handleSubmit} loading={submitting} disabled={motivation.length < 50}>Отправить заявку</Button></Group>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  )
}
