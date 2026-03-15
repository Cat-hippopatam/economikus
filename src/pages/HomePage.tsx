// src/pages/HomePage.tsx
import { 
  Container, 
  Title, 
  Text, 
  Button, 
  Group, 
  Stack,
  Paper,
  Grid,
  Box
} from '@mantine/core'
import { Link } from 'react-router-dom'
import { BookOpen, Users, Award, TrendingUp } from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: BookOpen,
      title: 'Интерактивные курсы',
      description: 'Учитесь в удобном темпе с видеоуроками, статьями и тестами'
    },
    {
      icon: TrendingUp,
      title: 'Практические навыки',
      description: 'Реальные кейсы и калькуляторы для принятия решений'
    },
    {
      icon: Users,
      title: 'Сообщество',
      description: 'Общайтесь с единомышленниками и экспертами'
    },
    {
      icon: Award,
      title: 'Сертификаты',
      description: 'Получайте документы о прохождении курсов'
    }
  ]

  return (
    <Box>
      {/* Hero секция */}
      <Box 
        style={{ 
          background: 'linear-gradient(135deg, #264653 0%, #2A9D8F 100%)',
          padding: '80px 0',
          color: '#fff'
        }}
      >
        <Container size="lg">
          <Stack align="center" gap="xl">
            <Title order={1} size="3rem" ta="center">
              Научитесь управлять финансами
            </Title>
            <Text size="xl" ta="center" maw={600} style={{ opacity: 0.9 }}>
              Образовательная платформа для тех, кто хочет разобраться в инвестициях, 
              планировании бюджета и финансовой грамотности
            </Text>
            <Group gap="md">
              <Button 
                size="lg" 
                component={Link}
                to="/catalog"
                style={{ 
                  backgroundColor: '#F4A261',
                  color: '#264653'
                }}
              >
                Начать обучение
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                component={Link}
                to="/register"
                style={{ 
                  borderColor: '#fff',
                  color: '#fff'
                }}
              >
                Создать аккаунт
              </Button>
            </Group>
          </Stack>
        </Container>
      </Box>

      {/* Features секция */}
      <Container size="lg" py="xl">
        <Title order={2} ta="center" mb="xl" c="#264653">
          Почему Экономикус?
        </Title>
        <Grid>
          {features.map((feature, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6, md: 3 }}>
              <Paper 
                shadow="sm" 
                p="lg" 
                radius="md"
                style={{ height: '100%' }}
              >
                <feature.icon size={32} color="#2A9D8F" />
                <Title order={4} mt="md" mb="xs" c="#264653">
                  {feature.title}
                </Title>
                <Text size="sm" c="dimmed">
                  {feature.description}
                </Text>
              </Paper>
            </Grid.Col>
          ))}
        </Grid>
      </Container>

      {/* CTA секция */}
      <Box 
        style={{ 
          backgroundColor: '#F8F6F3',
          padding: '60px 0'
        }}
      >
        <Container size="lg">
          <Paper 
            shadow="sm" 
            p="xl" 
            radius="md"
            style={{ 
              background: 'linear-gradient(135deg, #2A9D8F 0%, #264653 100%)',
              color: '#fff'
            }}
          >
            <Stack align="center" gap="md">
              <Title order={3} ta="center">
                Готовы начать свой путь к финансовой грамотности?
              </Title>
              <Text ta="center" maw={500} style={{ opacity: 0.9 }}>
                Присоединяйтесь к тысячам пользователей, которые уже учатся на Экономикусе
              </Text>
              <Button 
                size="lg"
                component={Link}
                to="/register"
                style={{ 
                  backgroundColor: '#F4A261',
                  color: '#264653'
                }}
              >
                Зарегистрироваться бесплатно
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </Box>
  )
}
