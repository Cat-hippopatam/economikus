/**
 * Страница каталога калькуляторов
 */

import { Link } from 'react-router-dom'
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Paper,
  Group,
  ThemeIcon,
  Badge,
  Stack,
  TextInput,
  Select,
  Box,
  Card,
} from '@mantine/core'
import { 
  Calculator, 
  TrendingUp, 
  CreditCard, 
  Building, 
  Search,
  Percent,
  PiggyBank,
  Coins,
} from 'lucide-react'
import { useState } from 'react'
import type { CalculatorMeta, CalculatorType } from '@/types/calculator'

// Мета-данные калькуляторов
const CALCULATORS: CalculatorMeta[] = [
  {
    id: 'compound-interest',
    slug: 'compound-interest',
    title: 'Сложный процент',
    description: 'Рассчитайте доходность инвестиций с учётом реинвестирования процентов. Узнайте, как время и капитализация влияют на ваш капитал.',
    icon: 'TrendingUp',
    category: 'investment',
    tags: ['инвестиции', 'накопления', 'вклады'],
  },
  {
    id: 'loan',
    slug: 'loan',
    title: 'Кредитный калькулятор',
    description: 'Рассчитайте ежемесячный платёж, переплату и полный график платежей по кредиту. Сравните аннуитетную и дифференцированную схемы.',
    icon: 'CreditCard',
    category: 'credit',
    tags: ['кредит', 'потребительский кредит', 'платежи'],
  },
  {
    id: 'mortgage',
    slug: 'mortgage',
    title: 'Ипотечный калькулятор',
    description: 'Полный расчёт ипотеки: ежемесячный платёж, налоговые вычеты, материнский капитал. Узнайте, какой доход нужен для одобрения.',
    icon: 'Building',
    category: 'credit',
    tags: ['ипотека', 'недвижимость', 'налоговые вычеты'],
  },
]

// Маппинг иконок
const ICON_MAP: Record<string, typeof Calculator> = {
  TrendingUp,
  CreditCard,
  Building,
  Percent,
  PiggyBank,
  Coins,
}

// Цвета категорий
const CATEGORY_COLORS: Record<string, string> = {
  investment: 'teal',
  credit: 'blue',
  tax: 'green',
  other: 'gray',
}

const CATEGORY_LABELS: Record<string, string> = {
  investment: 'Инвестиции',
  credit: 'Кредиты',
  tax: 'Налоги',
  other: 'Другое',
}

export default function CalculatorsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string | null>(null)

  // Фильтрация
  const filteredCalculators = CALCULATORS.filter(calc => {
    const matchesSearch = search === '' || 
      calc.title.toLowerCase().includes(search.toLowerCase()) ||
      calc.description.toLowerCase().includes(search.toLowerCase()) ||
      calc.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    
    const matchesCategory = !category || calc.category === category
    
    return matchesSearch && matchesCategory
  })

  return (
    <Box>
      {/* Hero секция */}
      <Box
        style={{
          background: 'linear-gradient(135deg, #264653 0%, #2A9D8F 100%)',
          padding: '60px 0',
          color: '#fff',
        }}
      >
        <Container size="lg">
          <Stack gap="md" align="center">
            <ThemeIcon size={60} variant="light" color="teal">
              <Calculator size={32} />
            </ThemeIcon>
            <Title order={1} ta="center">Финансовые калькуляторы</Title>
            <Text size="lg" ta="center" style={{ opacity: 0.9, maxWidth: 600 }}>
              Рассчитайте доходность инвестиций, платежи по кредитам и ипотеке. 
              Принимайте взвешенные финансовые решения.
            </Text>
          </Stack>
        </Container>
      </Box>

      {/* Каталог */}
      <Container size="lg" py="xl">
        <Stack gap="xl">
          {/* Фильтры */}
          <Paper p="md" withBorder>
            <Group>
              <TextInput
                placeholder="Поиск калькулятора..."
                leftSection={<Search size={16} />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ flex: 1 }}
              />
              <Select
                placeholder="Категория"
                value={category}
                onChange={setCategory}
                data={[
                  { value: '', label: 'Все категории' },
                  ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label })),
                ]}
                clearable
                w={200}
              />
            </Group>
          </Paper>

          {/* Список калькуляторов */}
          {filteredCalculators.length === 0 ? (
            <Paper p="xl" withBorder ta="center">
              <Text c="dimmed">Калькуляторы не найдены</Text>
            </Paper>
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
              {filteredCalculators.map((calc) => {
                const Icon = ICON_MAP[calc.icon] || Calculator
                
                return (
                  <Card
                    key={calc.id}
                    component={Link}
                    to={`/calculators/${calc.slug}`}
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    withBorder
                    style={{ 
                      cursor: 'pointer',
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                    styles={{
                      root: {
                        ':hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        },
                      },
                    }}
                  >
                    <Stack gap="md">
                      <Group justify="space-between">
                        <ThemeIcon size={48} variant="light" color={CATEGORY_COLORS[calc.category]}>
                          <Icon size={24} />
                        </ThemeIcon>
                        <Badge color={CATEGORY_COLORS[calc.category]} variant="light">
                          {CATEGORY_LABELS[calc.category]}
                        </Badge>
                      </Group>
                      
                      <Box>
                        <Text fw={600} size="lg" mb="xs">{calc.title}</Text>
                        <Text size="sm" c="dimmed" lineClamp={3}>
                          {calc.description}
                        </Text>
                      </Box>

                      <Group gap="xs">
                        {calc.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} size="sm" variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </Group>
                    </Stack>
                  </Card>
                )
              })}
            </SimpleGrid>
          )}

          {/* Информация */}
          <Paper p="lg" withBorder bg="gray.0">
            <Group gap="md">
              <ThemeIcon size={48} variant="light" color="blue">
                <Calculator size={24} />
              </ThemeIcon>
              <Box style={{ flex: 1 }}>
                <Text fw={600} mb="xs">Как пользоваться калькуляторами?</Text>
                <Text size="sm" c="dimmed">
                  Выберите нужный калькулятор, введите параметры и мгновенно получите результат. 
                  Все расчёты выполняются в вашем браузере — ваши данные не отправляются на сервер.
                </Text>
              </Box>
            </Group>
          </Paper>
        </Stack>
      </Container>
    </Box>
  )
}
