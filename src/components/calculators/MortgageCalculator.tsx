/**
 * Ипотечный калькулятор
 */

import { useState, useMemo } from 'react'
import {
  Paper,
  Stack,
  Group,
  Text,
  NumberInput,
  Slider,
  SegmentedControl,
  Button,
  Divider,
  Box,
  SimpleGrid,
  ThemeIcon,
  Table,
  ScrollArea,
  Badge,
  Checkbox,
  Collapse,
  Alert,
} from '@mantine/core'
import { Building, Calculator, Percent, Calendar, RefreshCw, Home, PiggyBank, Coins } from 'lucide-react'
import { 
  calculateMortgage, 
  formatCurrency, 
  formatNumber, 
  formatPercent 
} from '@/utils/calculators'
import type { MortgageParams } from '@/types/calculator'

const ICON_SIZE = 18
const MATERNITY_CAPITAL_2024 = 586946

export function MortgageCalculator() {
  const [params, setParams] = useState<MortgageParams>({
    propertyValue: 5000000,
    downPayment: 1000000,
    annualRate: 8,
    termMonths: 240,
    type: 'annuity',
    useMaternityCapital: false,
    maternityCapitalAmount: MATERNITY_CAPITAL_2024,
  })

  const result = useMemo(() => calculateMortgage(params), [params])

  const handleReset = () => {
    setParams({
      propertyValue: 5000000,
      downPayment: 1000000,
      annualRate: 8,
      termMonths: 240,
      type: 'annuity',
      useMaternityCapital: false,
      maternityCapitalAmount: MATERNITY_CAPITAL_2024,
    })
  }

  const downPaymentPercent = (params.downPayment / params.propertyValue) * 100
  const loanAmount = params.useMaternityCapital 
    ? Math.max(0, params.propertyValue - params.downPayment - params.maternityCapitalAmount)
    : Math.max(0, params.propertyValue - params.downPayment)

  const formatTerm = (months: number) => {
    const years = Math.floor(months / 12)
    const m = months % 12
    if (years === 0) return `${m} мес.`
    if (m === 0) return `${years} ${years === 1 ? 'год' : years < 5 ? 'года' : 'лет'}`
    return `${years} ${years === 1 ? 'год' : years < 5 ? 'года' : 'лет'} ${m} мес.`
  }

  return (
    <Stack gap="xl">
      {/* Ввод параметров */}
      <Paper p="lg" withBorder>
        <Stack gap="lg">
          <Group justify="space-between">
            <Text fw={600} size="lg">Параметры ипотеки</Text>
            <Button 
              variant="subtle" 
              size="xs" 
              leftSection={<RefreshCw size={14} />}
              onClick={handleReset}
            >
              Сбросить
            </Button>
          </Group>

          {/* Стоимость недвижимости */}
          <Box>
            <Group gap="xs" mb="xs">
              <Building size={ICON_SIZE} />
              <Text size="sm" fw={500}>Стоимость недвижимости</Text>
            </Group>
            <NumberInput
              value={params.propertyValue}
              onChange={(value) => setParams({ ...params, propertyValue: Number(value) || 0 })}
              min={500000}
              max={100000000}
              step={100000}
              thousandSeparator=" "
              suffix=" ₽"
            />
            <Slider
              value={params.propertyValue}
              onChange={(value) => setParams({ ...params, propertyValue: value })}
              min={500000}
              max={30000000}
              step={100000}
              mt="xs"
            />
          </Box>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
            {/* Первоначальный взнос */}
            <Box>
              <Group gap="xs" mb="xs">
                <PiggyBank size={ICON_SIZE} />
                <Text size="sm" fw={500}>
                  Первоначальный взнос ({formatNumber(downPaymentPercent, 1)}%)
                </Text>
              </Group>
              <NumberInput
                value={params.downPayment}
                onChange={(value) => setParams({ ...params, downPayment: Number(value) || 0 })}
                min={0}
                max={params.propertyValue}
                step={50000}
                thousandSeparator=" "
                suffix=" ₽"
              />
              <Slider
                value={params.downPayment}
                onChange={(value) => setParams({ ...params, downPayment: value })}
                min={0}
                max={params.propertyValue * 0.9}
                step={10000}
                mt="xs"
              />
            </Box>

            {/* Годовая ставка */}
            <Box>
              <Group gap="xs" mb="xs">
                <Percent size={ICON_SIZE} />
                <Text size="sm" fw={500}>Годовая ставка</Text>
              </Group>
              <NumberInput
                value={params.annualRate}
                onChange={(value) => setParams({ ...params, annualRate: Number(value) || 0 })}
                min={0.1}
                max={30}
                step={0.1}
                decimalScale={1}
                suffix=" %"
              />
              <Slider
                value={params.annualRate}
                onChange={(value) => setParams({ ...params, annualRate: value })}
                min={0.1}
                max={25}
                step={0.1}
                mt="xs"
              />
            </Box>
          </SimpleGrid>

          {/* Срок кредита */}
          <Box>
            <Group gap="xs" mb="xs">
              <Calendar size={ICON_SIZE} />
              <Text size="sm" fw={500}>Срок ипотеки: {formatTerm(params.termMonths)}</Text>
            </Group>
            <Group align="flex-end" gap="md">
              <NumberInput
                value={params.termMonths}
                onChange={(value) => setParams({ ...params, termMonths: Number(value) || 1 })}
                min={12}
                max={360}
                suffix=" мес."
                style={{ flex: 1 }}
              />
              <Slider
                value={params.termMonths}
                onChange={(value) => setParams({ ...params, termMonths: value })}
                min={12}
                max={360}
                step={12}
                style={{ flex: 2 }}
              />
            </Group>
          </Box>

          {/* Тип платежа */}
          <Box>
            <Text size="sm" fw={500} mb="xs">Тип платежа</Text>
            <SegmentedControl
              value={params.type}
              onChange={(value) => setParams({ ...params, type: value as MortgageParams['type'] })}
              data={[
                { value: 'annuity', label: 'Аннуитетный' },
                { value: 'differentiated', label: 'Дифференцированный' },
              ]}
              fullWidth
            />
          </Box>

          {/* Материнский капитал */}
          <Paper p="md" withBorder bg="gray.0">
            <Group>
              <Checkbox
                checked={params.useMaternityCapital}
                onChange={(e) => setParams({ 
                  ...params, 
                  useMaternityCapital: e.currentTarget.checked 
                })}
                label={
                  <Group gap="xs">
                    <Coins size={ICON_SIZE} />
                    <Text size="sm" fw={500}>Использовать материнский капитал</Text>
                  </Group>
                }
              />
            </Group>
            <Collapse in={params.useMaternityCapital}>
              <Box mt="md">
                <NumberInput
                  label="Сумма материнского капитала"
                  value={params.maternityCapitalAmount}
                  onChange={(value) => setParams({ ...params, maternityCapitalAmount: Number(value) || 0 })}
                  thousandSeparator=" "
                  suffix=" ₽"
                  description={`В 2024 году: ${formatCurrency(MATERNITY_CAPITAL_2024)}`}
                />
              </Box>
            </Collapse>
          </Paper>
        </Stack>
      </Paper>

      {/* Информация о сумме кредита */}
      <Alert color="blue" icon={<Home size={ICON_SIZE} />}>
        <Group justify="space-between">
          <Text size="sm">Сумма кредита:</Text>
          <Text fw={600}>{formatCurrency(loanAmount)}</Text>
        </Group>
        {params.useMaternityCapital && (
          <Group justify="space-between" mt="xs">
            <Text size="sm" c="dimmed">С учётом материнского капитала</Text>
          </Group>
        )}
      </Alert>

      {/* Результаты */}
      <Paper p="lg" withBorder style={{ background: 'linear-gradient(135deg, #264653 0%, #2A9D8F 100%)' }}>
        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="lg">
          <Box ta="center" c="white">
            <Text size="sm" style={{ opacity: 0.8 }}>
              {params.type === 'annuity' ? 'Ежемесячный платёж' : 'Первый платёж'}
            </Text>
            <Text size="xl" fw={700}>{formatCurrency(result.monthlyPayment)}</Text>
          </Box>
          <Box ta="center" c="white">
            <Text size="sm" style={{ opacity: 0.8 }}>Переплата</Text>
            <Text size="xl" fw={700} c="#F4A261">{formatCurrency(result.totalInterest)}</Text>
          </Box>
          <Box ta="center" c="white">
            <Text size="sm" style={{ opacity: 0.8 }}>Рекомендуемый доход</Text>
            <Text size="xl" fw={700}>{formatCurrency(result.requiredIncome)}</Text>
          </Box>
          <Box ta="center" c="white">
            <Text size="sm" style={{ opacity: 0.8 }}>Налоговый вычет</Text>
            <Text size="xl" fw={700} c="#E9C46A">{formatCurrency(result.taxDeduction + result.interestDeduction)}</Text>
          </Box>
        </SimpleGrid>
      </Paper>

      {/* Налоговые вычеты */}
      <Paper p="lg" withBorder>
        <Text fw={600} size="lg" mb="md">Налоговые вычеты</Text>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          <Paper p="md" withBorder bg="gray.0">
            <Group justify="space-between">
              <Box>
                <Text size="sm" c="dimmed">Имущественный вычет</Text>
                <Text fw={600}>{formatCurrency(result.taxDeduction)}</Text>
              </Box>
              <ThemeIcon size="lg" variant="light" color="green">
                <Home size={ICON_SIZE} />
              </ThemeIcon>
            </Group>
            <Text size="xs" c="dimmed" mt="xs">
              13% от стоимости недвижимости (макс. 260 000 ₽)
            </Text>
          </Paper>
          <Paper p="md" withBorder bg="gray.0">
            <Group justify="space-between">
              <Box>
                <Text size="sm" c="dimmed">Вычет по процентам</Text>
                <Text fw={600}>{formatCurrency(result.interestDeduction)}</Text>
              </Box>
              <ThemeIcon size="lg" variant="light" color="blue">
                <Percent size={ICON_SIZE} />
              </ThemeIcon>
            </Group>
            <Text size="xs" c="dimmed" mt="xs">
              13% от уплаченных процентов (макс. 390 000 ₽)
            </Text>
          </Paper>
        </SimpleGrid>
      </Paper>

      {/* График платежей */}
      <Paper p="lg" withBorder>
        <Group justify="space-between" mb="md">
          <Text fw={600} size="lg">График платежей</Text>
          <Badge variant="light" color="gray">
            {params.termMonths} платежей
          </Badge>
        </Group>
        <ScrollArea h={300}>
          <Table striped highlightOnHover miw={500}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Месяц</Table.Th>
                <Table.Th>Платёж</Table.Th>
                <Table.Th>Основной долг</Table.Th>
                <Table.Th>Проценты</Table.Th>
                <Table.Th>Остаток</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {result.schedule.slice(0, 36).map((row) => (
                <Table.Tr key={row.month}>
                  <Table.Td fw={500}>{row.month}</Table.Td>
                  <Table.Td>{formatCurrency(row.payment)}</Table.Td>
                  <Table.Td>{formatCurrency(row.principal)}</Table.Td>
                  <Table.Td c="orange">{formatCurrency(row.interest)}</Table.Td>
                  <Table.Td>{formatCurrency(row.balance)}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          {params.termMonths > 36 && (
            <Text size="sm" c="dimmed" ta="center" mt="md">
              Показаны первые 36 месяцев из {params.termMonths}
            </Text>
          )}
        </ScrollArea>
      </Paper>

      {/* Информация */}
      <Paper p="md" withBorder bg="gray.0">
        <Group gap="md">
          <ThemeIcon size="lg" variant="light" color="blue">
            <Calculator size={ICON_SIZE} />
          </ThemeIcon>
          <Box style={{ flex: 1 }}>
            <Text size="sm" fw={500}>Важно знать</Text>
            <Text size="xs" c="dimmed">
              Минимальный первоначальный взнос — от 10% до 20% в зависимости от программы. 
              При взносе менее 20% может потребоваться страхование жизни и имущества. 
              Не забудьте про налоговые вычеты — они вернут вам до 650 000 ₽!
            </Text>
          </Box>
        </Group>
      </Paper>
    </Stack>
  )
}
