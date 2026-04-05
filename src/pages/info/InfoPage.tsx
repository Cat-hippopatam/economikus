// src/pages/info/InfoPage.tsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Container, Title, Text, Stack, Card, Group, ThemeIcon, SimpleGrid, Badge, Divider } from '@mantine/core'
import { Mail, MapPin, Send, Clock, Users, Award, TrendingUp } from 'lucide-react'

interface NewsItem {
  id: string
  title: string
  excerpt: string
  date: string
  category: string
}

const NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Запуск нового раздела "Инструменты"',
    excerpt: 'Мы добавили новые финансовые калькуляторы для удобного планирования вашего бюджета',
    date: '24.03.2026',
    category: 'Обновления'
  },
  {
    id: '2',
    title: 'Новые курсы по инвестициям',
    excerpt: 'Добавлены курсы для начинающих инвесторов с практическими примерами',
    date: '20.03.2026',
    category: 'Курсы'
  },
  {
    id: '3',
    title: 'Улучшение мобильной версии',
    excerpt: 'Теперь учиться на телефоне стало ещё удобнее - оптимизированы все страницы',
    date: '15.03.2026',
    category: 'Обновления'
  }
]

const TEAM = [
  { name: 'Альберт', role: 'Основатель и CEO', description: 'Финансовый аналитик с 6-летним опытом' },
  { name: 'Василий', role: 'Руководитель образовательных программ', description: 'Преподаватель экономики' },
  { name: 'Роман', role: 'Технический директор', description: 'Full-stack разработчик' },
  { name: 'Алексей', role: 'Контент-менеджер', description: 'Специалист по финансовой грамотности' }
]

export default function InfoPage() {
  const location = useLocation()

  // Прокрутка к секции при переходе с хешем
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [location])

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* О платформе */}
        <Stack gap="xs" id="about">
          <Title order={1}>О платформе Экономикус</Title>
          <Text c="dimmed" size="lg">
            Образовательная платформа для изучения финансов и инвестиций
          </Text>
        </Stack>

        <Card withBorder padding="xl" radius="md">
          <Stack gap="lg">
            <Text>
              <Text component="span" fw={700}>Экономикус</Text> — это современная образовательная платформа, 
              созданная для того, чтобы сделать финансовые знания доступными каждому. Мы предлагаем 
              качественные курсы, калькуляторы и инструменты для управления личными финансами.
            </Text>
            <Text>
              Наша миссия — помочь людям разобраться в сложных финансовых вопросах и научить 
              принимать правильные решения в управлении деньгами.
            </Text>
            
            <Divider my="sm" />
            
            <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
              <Stack align="center" gap={4}>
                <ThemeIcon size="lg" variant="light" color="blue">
                  <Users size={20} />
                </ThemeIcon>
                <Text fw={700} size="xl">10,000+</Text>
                <Text size="sm" c="dimmed">Студентов</Text>
              </Stack>
              <Stack align="center" gap={4}>
                <ThemeIcon size="lg" variant="light" color="green">
                  <Award size={20} />
                </ThemeIcon>
                <Text fw={700} size="xl">50+</Text>
                <Text size="sm" c="dimmed">Курсов</Text>
              </Stack>
              <Stack align="center" gap={4}>
                <ThemeIcon size="lg" variant="light" color="yellow">
                  <TrendingUp size={20} />
                </ThemeIcon>
                <Text fw={700} size="xl">1000+</Text>
                <Text size="sm" c="dimmed">Сертификатов</Text>
              </Stack>
              <Stack align="center" gap={4}>
                <ThemeIcon size="lg" variant="light" color="grape">
                  <Clock size={20} />
                </ThemeIcon>
                <Text fw={700} size="xl">24/7</Text>
                <Text size="sm" c="dimmed">Доступ</Text>
              </Stack>
            </SimpleGrid>
          </Stack>
        </Card>

        {/* Новости */}
        <Stack gap="md" id="news">
          <Group justify="space-between">
            <Title order={2}>Новости</Title>
            <Badge variant="light">Обновления платформы</Badge>
          </Group>
          
          <Stack gap="md">
            {NEWS.map((item) => (
              <Card key={item.id} withBorder padding="md" radius="md">
                <Group justify="space-between" align="flex-start">
                  <Stack gap={4} style={{ flex: 1 }}>
                    <Group gap="xs">
                      <Badge size="sm" variant="light">{item.category}</Badge>
                      <Text size="xs" c="dimmed">{item.date}</Text>
                    </Group>
                    <Text fw={500}>{item.title}</Text>
                    <Text size="sm" c="dimmed">{item.excerpt}</Text>
                  </Stack>
                </Group>
              </Card>
            ))}
          </Stack>
        </Stack>

        {/* Команда */}
        <Stack gap="md" id="team">
          <Title order={2}>Команда</Title>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {TEAM.map((member, idx) => (
              <Card key={idx} withBorder padding="md" radius="md">
                <Group gap="md">
                  <ThemeIcon size="xl" radius="xl" variant="light" color="blue">
                    <Users size={20} />
                  </ThemeIcon>
                  <Stack gap={2}>
                    <Text fw={500}>{member.name}</Text>
                    <Text size="sm" c="blue">{member.role}</Text>
                    <Text size="sm" c="dimmed">{member.description}</Text>
                  </Stack>
                </Group>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>

        {/* Контакты */}
        <Stack gap="md" id="contacts">
          <Title order={2}>Контакты</Title>
          <Card withBorder padding="lg" radius="md">
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
              <Stack align="center" gap="xs">
                <ThemeIcon size="lg" variant="light" color="blue">
                  <Mail size={20} />
                </ThemeIcon>
                <Text fw={500}>Email</Text>
                <Text size="sm" c="dimmed">hello@economikus.ru</Text>
              </Stack>
              <Stack align="center" gap="xs">
                <ThemeIcon size="lg" variant="light" color="green">
                  <Send size={20} />
                </ThemeIcon>
                <Text fw={500}>Telegram</Text>
                <Text size="sm" c="dimmed">@economikus</Text>
              </Stack>
              <Stack align="center" gap="xs">
                <ThemeIcon size="lg" variant="light" color="red">
                  <MapPin size={20} />
                </ThemeIcon>
                <Text fw={500}>Адрес</Text>
                <Text size="sm" c="dimmed">Москва, Россия</Text>
              </Stack>
            </SimpleGrid>
          </Card>
        </Stack>
      </Stack>
    </Container>
  )
}
