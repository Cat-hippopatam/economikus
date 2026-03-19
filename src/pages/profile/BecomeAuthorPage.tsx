// src/pages/profile/BecomeAuthorPage.tsx
/**
 * Страница подачи заявки на статус автора
 * Рефакторинг: использует useAuthorApplication, StatusBadge, LoadingState
 * Защита роутов через ProtectedRoute в App.tsx
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container, Paper, Title, Text, Stack, Textarea, TextInput, Button, Group, Alert, Card, ThemeIcon, List,
} from '@mantine/core'
import { Check, AlertCircle, Clock, X, FileText, Youtube, GraduationCap, Award } from 'lucide-react'
import { useAuth } from '@/hooks'
import { useAuthorApplication } from '@/hooks/useAuthorApplication'
import { LoadingState, StatusBadge } from '@/components/common'

// Статические данные вынесены в константы - единая точка изменения
const AUTHOR_BENEFITS = [
  { icon: GraduationCap, color: 'blue', text: 'Создавайте курсы и уроки' },
  { icon: FileText, color: 'green', text: 'Публикуйте статьи и видео' },
  { icon: Youtube, color: 'orange', text: 'Получайте просмотры и подписчиков' },
  { icon: Award, color: 'grape', text: 'Выдавайте сертификаты за курсы' },
] as const

export function BecomeAuthorPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { application, loading, submitting, submitApplication, resetApplication } = useAuthorApplication()
  
  const [motivation, setMotivation] = useState('')
  const [experience, setExperience] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')

  // Если пользователь уже автор
  if (user?.role === 'AUTHOR' || user?.role === 'MODERATOR' || user?.role === 'ADMIN') {
    return (
      <Container size="md" py="xl">
        <Paper p="xl" ta="center">
          <ThemeIcon size={60} radius="xl" color="green" mb="md">
            <Check size={30} />
          </ThemeIcon>
          <Title order={2} mb="sm">Вы уже автор!</Title>
          <Text c="dimmed" mb="lg">У вас есть доступ к созданию курсов и уроков</Text>
          <Button onClick={() => navigate('/author/dashboard')}>Перейти в панель автора</Button>
        </Paper>
      </Container>
    )
  }

  if (loading) {
    return <LoadingState text="Загрузка..." />
  }

  // Заявка на рассмотрении
  if (application?.status === 'PENDING') {
    return (
      <Container size="md" py="xl">
        <Paper p="xl" ta="center">
          <ThemeIcon size={60} radius="xl" color="orange" mb="md">
            <Clock size={30} />
          </ThemeIcon>
          <Title order={2} mb="sm">Заявка на рассмотрении</Title>
          <Text c="dimmed" mb="lg">
            Ваша заявка была отправлена {new Date(application.createdAt).toLocaleDateString('ru-RU')}. 
            Мы рассмотрим её в ближайшее время.
          </Text>
          <Group justify="center" mb="md">
            <StatusBadge status="PENDING" type="application" />
          </Group>
          <Alert 
            icon={<Clock size={16} />} 
            title="Обычно рассмотрение занимает 1-3 дня" 
            color="blue" 
            variant="light"
          >
            Вы получите уведомление на email когда заявка будет рассмотрена
          </Alert>
        </Paper>
      </Container>
    )
  }

  // Заявка отклонена
  if (application?.status === 'REJECTED') {
    return (
      <Container size="md" py="xl">
        <Paper p="xl">
          <Group justify="center" mb="md">
            <ThemeIcon size={60} radius="xl" color="red">
              <X size={30} />
            </ThemeIcon>
          </Group>
          <Title order={2} ta="center" mb="sm">Заявка отклонена</Title>
          <Text c="dimmed" ta="center" mb="lg">К сожалению, ваша заявка была отклонена</Text>
          
          <Group justify="center" mb="md">
            <StatusBadge status="REJECTED" type="application" />
          </Group>
          
          {application.rejectionReason && (
            <Alert 
              icon={<AlertCircle size={16} />} 
              title="Причина" 
              color="red" 
              variant="light" 
              mb="lg"
            >
              {application.rejectionReason}
            </Alert>
          )}
          
          <Text ta="center" mb="md">Вы можете подать новую заявку, учтя замечания</Text>
          <Group justify="center">
            <Button onClick={resetApplication}>Подать новую заявку</Button>
          </Group>
        </Paper>
      </Container>
    )
  }

  // Форма подачи заявки
  const handleSubmit = async () => {
    const success = await submitApplication({ motivation, experience, portfolioUrl })
    if (success) {
      setMotivation('')
      setExperience('')
      setPortfolioUrl('')
    }
  }

  return (
    <Container size="md" py="xl">
      <Title order={2} mb="md">Станьте автором</Title>
      <Text c="dimmed" mb="xl">
        Заполните форму ниже, чтобы получить статус автора и возможность публиковать курсы
      </Text>
      
      <Stack gap="xl">
        {/* Преимущества */}
        <Card withBorder p="md">
          <Title order={4} mb="md">Что даёт статус автора?</Title>
          <List spacing="sm" center>
            {AUTHOR_BENEFITS.map((benefit, index) => (
              <List.Item 
                key={index}
                icon={
                  <ThemeIcon color={benefit.color} radius="xl" size={24}>
                    <benefit.icon size={14} />
                  </ThemeIcon>
                }
              >
                {benefit.text}
              </List.Item>
            ))}
          </List>
        </Card>

        {/* Форма */}
        <Paper withBorder p="lg" radius="md">
          <Stack gap="md">
            <Textarea 
              label="Почему вы хотите стать автором?" 
              description="Расскажите о вашей мотивации (минимум 50 символов)" 
              placeholder="Я хочу делиться знаниями с другими..." 
              value={motivation} 
              onChange={(e) => setMotivation(e.target.value)} 
              minRows={4} 
              required 
              error={motivation.length > 0 && motivation.length < 50 ? 'Минимум 50 символов' : null} 
            />
            <Textarea 
              label="Опыт в преподавании" 
              description="Расскажите о вашем опыте (необязательно)" 
              placeholder="Я преподавал в университете..." 
              value={experience} 
              onChange={(e) => setExperience(e.target.value)} 
              minRows={3} 
            />
            <TextInput 
              label="Ссылка на портфолио" 
              description="Ссылка на ваши работы или профиль (необязательно)" 
              placeholder="https://..." 
              value={portfolioUrl} 
              onChange={(e) => setPortfolioUrl(e.target.value)} 
            />
            <Group justify="flex-end" mt="md">
              <Button 
                onClick={handleSubmit} 
                loading={submitting} 
                disabled={motivation.length < 50}
              >
                Отправить заявку
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  )
}
