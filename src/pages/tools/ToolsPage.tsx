// src/pages/tools/ToolsPage.tsx
import { Link } from 'react-router-dom'
import { Container, Title, Text, SimpleGrid, Card, Group, ThemeIcon, Stack, Button, Badge } from '@mantine/core'
import { Calculator, TrendingUp, PiggyBank, Percent, DollarSign, Wrench, ArrowRight, Home, Wallet } from 'lucide-react'

interface Tool {
  id: string
  title: string
  description: string
  icon: typeof Calculator
  link: string
  status: 'ready' | 'coming'
  category: string
}

const TOOLS: Tool[] = [
  {
    id: 'compound-interest',
    title: 'Калькулятор сложного процента',
    description: 'Рассчитайте доходность с учётом капитализации процентов',
    icon: TrendingUp,
    link: '/calculators/compound-interest',
    status: 'ready',
    category: 'Инвестиции'
  },
  {
    id: 'loan',
    title: 'Кредитный калькулятор',
    description: 'Рассчитайте ежемесячные платежи и переплату по кредиту',
    icon: DollarSign,
    link: '/calculators/loan',
    status: 'ready',
    category: 'Кредиты'
  },
  {
    id: 'mortgage',
    title: 'Ипотечный калькулятор',
    description: 'Рассчитайте платежи по ипотеке с учётом первоначального взноса',
    icon: Home,
    link: '/calculators/mortgage',
    status: 'ready',
    category: 'Недвижимость'
  },
  {
    id: 'savings',
    title: 'Калькулятор накоплений',
    description: 'Планируйте достижение финансовых целей',
    icon: PiggyBank,
    link: '/calculators/savings',
    status: 'coming',
    category: 'Накопления'
  },
  {
    id: 'roi',
    title: 'ROI калькулятор',
    description: 'Оцените окупаемость инвестиций',
    icon: Percent,
    link: '/calculators/roi',
    status: 'coming',
    category: 'Инвестиции'
  },
  {
    id: 'budget',
    title: 'Бюджет',
    description: 'Управление личным бюджетом',
    icon: Wallet,
    link: '/tools/budget',
    status: 'coming',
    category: 'Бюджет'
  }
]

// Дополнительные инструменты (пока в разработке)
const ADDITIONAL_TOOLS = [
  { title: 'Конвертер валют', description: 'Курсы валют и конвертация', coming: true },
  { title: 'Страховой калькулятор', description: 'Расчёт стоимости страховки', coming: true },
  { title: 'Налоговый калькулятор', description: 'Расчёт налогов и вычетов', coming: true },
  { title: 'Пенсионный калькулятор', description: 'Настройте пенсионные накопления', coming: true },
]

export default function ToolsPage() {
  const readyTools = TOOLS.filter(t => t.status === 'ready')

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Заголовок */}
        <Stack gap="xs">
          <Title order={1}>Финансовые инструменты</Title>
          <Text c="dimmed" size="lg">
            Коллекция калькуляторов и инструментов для управления личными финансами
          </Text>
        </Stack>

        {/* Доступные инструменты */}
        <Stack gap="md">
          <Title order={2}>Калькуляторы</Title>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            {readyTools.map((tool) => (
              <Card 
                key={tool.id} 
                component={Link} 
                to={tool.link} 
                withBorder 
                padding="lg" 
                radius="md"
                style={{ textDecoration: 'none', transition: 'transform 0.2s' }}
              >
                <Stack gap="sm">
                  <Group justify="space-between">
                    <ThemeIcon size="lg" variant="light" color="blue">
                      <tool.icon size={20} />
                    </ThemeIcon>
                    <Badge size="sm" variant="light">{tool.category}</Badge>
                  </Group>
                  <Text fw={500}>{tool.title}</Text>
                  <Text size="sm" c="dimmed">{tool.description}</Text>
                  <Button 
                    variant="light" 
                    size="xs" 
                    rightSection={<ArrowRight size={14} />}
                    style={{ alignSelf: 'flex-start' }}
                  >
                    Открыть
                  </Button>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>

        {/* Скоро */}
        <Stack gap="md">
          <Title order={2}>Скоро</Title>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
            {ADDITIONAL_TOOLS.map((tool, idx) => (
              <Card key={idx} withBorder padding="md" radius="md" bg="gray.0">
                <Stack gap="xs">
                  <Group gap="xs">
                    <Wrench size={16} color="var(--mantine-color-gray-5)" />
                    <Text fw={500} size="sm">{tool.title}</Text>
                  </Group>
                  <Text size="xs" c="dimmed">{tool.description}</Text>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>

        {/* Ссылка на калькуляторы */}
        <Card withBorder padding="lg" radius="md" bg="blue.0">
          <Group justify="space-between" align="center">
            <Stack gap={4}>
              <Text fw={500}>Нужно больше калькуляторов?</Text>
              <Text size="sm" c="dimmed">Перейдите в раздел калькуляторов для полного списка</Text>
            </Stack>
            <Button component={Link} to="/calculators" variant="filled">
              Все калькуляторы
            </Button>
          </Group>
        </Card>
      </Stack>
    </Container>
  )
}

