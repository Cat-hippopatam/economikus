import { Link } from 'react-router-dom'
import { Container, Title, Text, Button, Stack, Group } from '@mantine/core'
import { Home, ArrowLeft, Search } from 'lucide-react'
import { COLORS } from '../constants'

export function NotFoundPage() {
  return (
    <Container size="md" py={80}>
      <Stack align="center" gap="xl">
        {/* Большой номер 404 */}
        <Title 
          order={1} 
          style={{ 
            fontSize: '180px', 
            fontWeight: 800,
            lineHeight: 1,
            background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404
        </Title>

        <Stack align="center" gap="sm">
          <Title order={2} ta="center">Страница не найдена</Title>
          <Text c="dimmed" size="lg" ta="center" maw={400}>
            Извините, запрашиваемая страница не существует или была перемещена.
          </Text>
        </Stack>

        <Group gap="md" mt="md">
          <Button 
            component={Link} 
            to="/" 
            size="lg" 
            leftSection={<Home size={20} />}
            style={{
              background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
            }}
          >
            На главную
          </Button>
          <Button 
            component={Link} 
            to="/catalog" 
            size="lg" 
            variant="light"
            leftSection={<Search size={20} />}
          >
            Каталог курсов
          </Button>
        </Group>

        {/* Полезные ссылки */}
        <Stack gap="xs" mt="xl" align="center">
          <Text size="sm" c="dimmed">Также можете посетить:</Text>
          <Group gap="lg">
            <Text 
              component={Link} 
              to="/calculators" 
              c="teal" 
              style={{ textDecoration: 'none' }}
            >
              Калькуляторы
            </Text>
            <Text 
              component={Link} 
              to="/user/economikus" 
              c="teal" 
              style={{ textDecoration: 'none' }}
            >
              Об авторе
            </Text>
          </Group>
        </Stack>

        <Button 
          component={Link} 
          to="-1" 
          variant="subtle" 
          leftSection={<ArrowLeft size={16} />}
          mt="md"
        >
          Вернуться назад
        </Button>
      </Stack>
    </Container>
  )
}

export default NotFoundPage
