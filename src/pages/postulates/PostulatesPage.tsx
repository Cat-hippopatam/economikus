// src/pages/postulates/PostulatesPage.tsx
import { Container, Title, Text, Stack, Card, ThemeIcon, Group, Badge, SimpleGrid, Divider } from '@mantine/core'
import { Lightbulb, TrendingUp, PiggyBank, Shield, Target, Clock, Percent, Calculator } from 'lucide-react'

interface Postulate {
  id: string
  title: string
  icon: typeof Lightbulb
  description: string
  examples: string[]
}

const POSTULATES: Postulate[] = [
  {
    id: '1',
    title: 'Доходы должны превышать расходы',
    icon: TrendingUp,
    description: 'Это фундаментальное правило финансового благополучия. Прежде чем инвестировать или копить, убедитесь, что вы тратите меньше, чем зарабатываете.',
    examples: [
      'Ведите бюджет и отслеживайте расходы',
      'Откладывайте минимум 10-20% от дохода',
      'Избегайте импульсивных покупок'
    ]
  },
  {
    id: '2',
    title: 'Начните инвестировать как можно раньше',
    icon: Clock,
    description: 'Время — ваш главный союзник в инвестициях. Благодаря сложному проценту, даже небольшие суммы, вложенные рано, могут вырасти в значительный капитал.',
    examples: [
      'Начните с малого — даже 1000₽ в месяц имеют значение',
      'Используйте налоговые вычеты (ИИС)',
      'Регулярность важнее суммы'
    ]
  },
  {
    id: '3',
    title: 'Диверсификация — ключ к снижению рисков',
    icon: Shield,
    description: 'Не кладите все яйца в одну корзину. Распределение инвестиций между разными активами снижает риски и повышает стабильность портфеля.',
    examples: [
      'Инвестируйте в разные классы активов',
      'Распределяйте по секторам экономики',
      'Учитывайте валютную диверсификацию'
    ]
  },
  {
    id: '4',
    title: 'Определите финансовые цели',
    icon: Target,
    description: 'Чёткие цели помогают принимать правильные финансовые решения. Без цели сложно понять, сколько нужно откладывать и какие инструменты использовать.',
    examples: [
      'Запишите конкретные суммы и сроки',
      'Разделите цели на краткосрочные и долгосрочные',
      'Пересматривайте цели ежегодно'
    ]
  },
  {
    id: '5',
    title: 'Создайте финансовую подушку безопасности',
    icon: PiggyBank,
    description: 'Прежде чем инвестировать, накопите резервный фонд. Это защитит вас от непредвиденных расходов и необходимости продавать активы в убыток.',
    examples: [
      'Начните с 3-6 месяцев расходов',
      'Храните в ликвидной форме (депозит)',
      'Пополняйте фонд регулярно'
    ]
  },
  {
    id: '6',
    title: 'Следите за инфляцией',
    icon: Percent,
    description: 'Инфляция «съедает» ваши деньги, если они просто лежат на счёте. Чтобы сохранить и приумножить капитал, нужно побеждать инфляцию.',
    examples: [
      'Держите часть средств в активах с доходностью выше инфляции',
      'Индексируйте свои инвестиции',
      'Учитывайте инфляцию при планировании'
    ]
  }
]

export default function PostulatesPage() {
  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Заголовок */}
        <Stack gap="xs">
          <Title order={1}>Финансовые постулаты</Title>
          <Text c="dimmed" size="lg">
            6 фундаментальных принципов управления личными финансами
          </Text>
        </Stack>

        {/* Введение */}
        <Card withBorder padding="lg" radius="md" bg="blue.0">
          <Group gap="md">
            <ThemeIcon size={48} radius="xl" variant="filled" color="blue">
              <Lightbulb size={24} />
            </ThemeIcon>
            <Stack gap={4}>
              <Text fw={500}>Почему это важно?</Text>
              <Text size="sm" c="dimmed">
                Эти принципы проверены временем и работают вне зависимости от экономической ситуации. 
                Следуя им, вы сможете достичь финансовой независимости.
              </Text>
            </Stack>
          </Group>
        </Card>

        {/* Постулаты */}
        <Stack gap="lg">
          {POSTULATES.map((postulate, idx) => (
            <Card key={postulate.id} withBorder padding="lg" radius="md">
              <Stack gap="md">
                <Group gap="md">
                  <ThemeIcon size="xl" radius="xl" variant="light" color="blue">
                    <postulate.icon size={24} />
                  </ThemeIcon>
                  <Stack gap={4}>
                    <Group gap="xs">
                      <Badge color="blue" variant="outline">#{idx + 1}</Badge>
                      <Title order={3}>{postulate.title}</Title>
                    </Group>
                  </Stack>
                </Group>
                
                <Text>{postulate.description}</Text>
                
                <Divider />
                
                <Stack gap="xs">
                  <Text fw={500} size="sm">Как применять:</Text>
                  {postulate.examples.map((example, i) => (
                    <Group key={i} gap="xs" align="flex-start">
                      <Text size="sm" c="blue">•</Text>
                      <Text size="sm" c="dimmed">{example}</Text>
                    </Group>
                  ))}
                </Stack>
              </Stack>
            </Card>
          ))}
        </Stack>

        {/* Связанные инструменты */}
        <Card withBorder padding="lg" radius="md">
          <Stack gap="md">
            <Title order={3}>Связанные инструменты</Title>
            <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="md">
              <Card withBorder padding="sm" radius="md" component="a" href="/calculators/compound-interest" style={{ textDecoration: 'none' }}>
                <Stack align="center" gap="xs">
                  <ThemeIcon size="lg" variant="light" color="green">
                    <Calculator size={18} />
                  </ThemeIcon>
                  <Text size="sm" fw={500} ta="center">Сложный процент</Text>
                </Stack>
              </Card>
              <Card withBorder padding="sm" radius="md" component="a" href="/calculators/loan" style={{ textDecoration: 'none' }}>
                <Stack align="center" gap="xs">
                  <ThemeIcon size="lg" variant="light" color="red">
                    <Percent size={18} />
                  </ThemeIcon>
                  <Text size="sm" fw={500} ta="center">Кредитный калькулятор</Text>
                </Stack>
              </Card>
              <Card withBorder padding="sm" radius="md" component="a" href="/tools" style={{ textDecoration: 'none' }}>
                <Stack align="center" gap="xs">
                  <ThemeIcon size="lg" variant="light" color="blue">
                    <PiggyBank size={18} />
                  </ThemeIcon>
                  <Text size="sm" fw={500} ta="center">Все инструменты</Text>
                </Stack>
              </Card>
            </SimpleGrid>
          </Stack>
        </Card>
      </Stack>
    </Container>
  )
}
