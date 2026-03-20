/**
 * Страница конкретного калькулятора
 */

import { useParams, Link } from 'react-router-dom'
import {
  Container,
  Title,
  Text,
  Breadcrumbs,
  Anchor,
  Box,
  Paper,
  Stack,
  Button,
  Group,
} from '@mantine/core'
import { ChevronLeft, Calculator } from 'lucide-react'
import { CompoundInterestCalculator, LoanCalculator, MortgageCalculator } from '@/components/calculators'

// Маппинг компонентов калькуляторов
const CALCULATOR_COMPONENTS: Record<string, React.ComponentType> = {
  'compound-interest': CompoundInterestCalculator,
  'loan': LoanCalculator,
  'mortgage': MortgageCalculator,
}

// Мета-данные калькуляторов
const CALCULATOR_META: Record<string, { title: string; description: string }> = {
  'compound-interest': {
    title: 'Калькулятор сложного процента',
    description: 'Рассчитайте, как ваши инвестиции растут с течением времени благодаря реинвестированию процентов.',
  },
  'loan': {
    title: 'Кредитный калькулятор',
    description: 'Рассчитайте ежемесячный платёж и переплату по кредиту.',
  },
  'mortgage': {
    title: 'Ипотечный калькулятор',
    description: 'Полный расчёт ипотеки с учётом налоговых вычетов и материнского капитала.',
  },
}

export default function CalculatorPage() {
  const { slug } = useParams<{ slug: string }>()
  
  const CalculatorComponent = slug ? CALCULATOR_COMPONENTS[slug] : null
  const meta = slug ? CALCULATOR_META[slug] : null

  if (!CalculatorComponent || !meta) {
    return (
      <Container size="lg" py="xl">
        <Paper p="xl" withBorder ta="center">
          <Stack gap="md" align="center">
            <Calculator size={48} />
            <Title order={2}>Калькулятор не найден</Title>
            <Text c="dimmed">Такой калькулятор не существует или находится в разработке</Text>
            <Button component={Link} to="/calculators" variant="light">
              Все калькуляторы
            </Button>
          </Stack>
        </Paper>
      </Container>
    )
  }

  return (
    <Box>
      {/* Шапка */}
      <Box
        style={{
          background: 'linear-gradient(135deg, #264653 0%, #2A9D8F 100%)',
          padding: '40px 0 30px',
          color: '#fff',
        }}
      >
        <Container size="lg">
          <Stack gap="md">
            {/* Хлебные крошки */}
            <Breadcrumbs separator="→" c="white">
              <Anchor component={Link} to="/" c="white" style={{ opacity: 0.8 }}>
                Главная
              </Anchor>
              <Anchor component={Link} to="/calculators" c="white" style={{ opacity: 0.8 }}>
                Калькуляторы
              </Anchor>
              <Text c="white">{meta.title}</Text>
            </Breadcrumbs>

            <Group justify="space-between" align="flex-start">
              <Box>
                <Title order={1}>{meta.title}</Title>
                <Text style={{ opacity: 0.9 }} mt="xs">{meta.description}</Text>
              </Box>
              <Button
                component={Link}
                to="/calculators"
                variant="subtle"
                color="gray"
                leftSection={<ChevronLeft size={16} />}
                style={{ color: '#fff' }}
              >
                Все калькуляторы
              </Button>
            </Group>
          </Stack>
        </Container>
      </Box>

      {/* Контент */}
      <Container size="lg" py="xl">
        <CalculatorComponent />
      </Container>
    </Box>
  )
}
