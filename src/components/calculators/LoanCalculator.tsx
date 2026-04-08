/**
 * Кредитный калькулятор
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
  Box,
  SimpleGrid,
  ThemeIcon,
  Table,
  ScrollArea,
  Badge,
} from '@mantine/core'
import { CreditCard, Calculator, Percent, Calendar, RefreshCw } from 'lucide-react'
import { 
  calculateLoan, 
  formatCurrency, 
  formatPercent 
} from '@/utils/calculators'
import { StackedBarChart, AreaChart } from '@/components/charts'
import { PrintButton } from '@/components/print'
import type { LoanParams } from '@/types/calculator'

const ICON_SIZE = 18

export function LoanCalculator() {
  const [params, setParams] = useState<LoanParams>({
    amount: 500000,
    annualRate: 15,
    termMonths: 36,
    type: 'annuity',
  })

  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table')

  const result = useMemo(() => calculateLoan(params), [params])

  // Данные для графиков - семплируем если слишком много месяцев
  const chartData = useMemo(() => {
    const maxPoints = 60
    const step = Math.max(1, Math.floor(result.schedule.length / maxPoints))
    return result.schedule.filter((_, i) => i % step === 0 || i === result.schedule.length - 1)
  }, [result])

  const stackedBarData = useMemo(() => {
    return chartData.map(row => ({
      month: row.month,
      principal: row.principal,
      interest: row.interest,
    }))
  }, [chartData])

  const handleReset = () => {
    setParams({
      amount: 500000,
      annualRate: 15,
      termMonths: 36,
      type: 'annuity',
    })
  }

  const formatTerm = (months: number) => {
    const years = Math.floor(months / 12)
    const m = months % 12
    if (years === 0) return `${m} мес.`
    if (m === 0) return `${years} ${years === 1 ? 'год' : years < 5 ? 'года' : 'лет'}`
    return `${years} ${years === 1 ? 'год' : years < 5 ? 'года' : 'лет'} ${m} мес.`
  }

  // Данные для PDF-отчёта
  const reportData = useMemo(() => ({
    title: 'Кредитный калькулятор',
    subtitle: params.type === 'annuity' ? 'Аннуитетный платёж' : 'Дифференцированный платёж',
    date: new Date().toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    params: {
      'Сумма кредита': formatCurrency(params.amount),
      'Годовая ставка': `${params.annualRate}%`,
      'Срок кредита': formatTerm(params.termMonths),
      'Тип платежа': params.type === 'annuity' ? 'Аннуитетный' : 'Дифференцированный',
    },
    results: {
      [params.type === 'annuity' ? 'Ежемесячный платёж' : 'Первый платёж']: formatCurrency(result.monthlyPayment),
      'Общая сумма выплат': formatCurrency(result.totalPayment),
      'Переплата по процентам': formatCurrency(result.totalInterest),
      'Переплата': formatPercent(result.overpaymentPercent),
    },
    tableData: result.schedule.slice(0, 24).map(row => ({
      label: `Месяц ${row.month}`,
      values: [
        formatCurrency(row.payment),
        formatCurrency(row.principal),
        formatCurrency(row.interest),
        formatCurrency(row.balance),
      ],
    })),
    tableHeaders: ['Месяц', 'Платёж', 'Основной долг', 'Проценты', 'Остаток'],
  }), [params, result, formatTerm])

  return (
    <Stack gap="xl">
      {/* Ввод параметров */}
      <Paper p="lg" withBorder>
        <Stack gap="lg">
          <Group justify="space-between">
            <Text fw={600} size="lg">Параметры кредита</Text>
            <Button 
              variant="subtle" 
              size="xs" 
              leftSection={<RefreshCw size={14} />}
              onClick={handleReset}
            >
              Сбросить
            </Button>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
            {/* Сумма кредита */}
            <Box>
              <Group gap="xs" mb="xs">
                <CreditCard size={ICON_SIZE} />
                <Text size="sm" fw={500}>Сумма кредита</Text>
              </Group>
              <NumberInput
                value={params.amount}
                onChange={(value) => setParams({ ...params, amount: Number(value) || 0 })}
                min={10000}
                max={100000000}
                step={10000}
                thousandSeparator=" "
                suffix=" ₽"
              />
              <Slider
                value={params.amount}
                onChange={(value) => setParams({ ...params, amount: value })}
                min={10000}
                max={10000000}
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
                max={60}
                step={0.1}
                decimalScale={1}
                suffix=" %"
              />
              <Slider
                value={params.annualRate}
                onChange={(value) => setParams({ ...params, annualRate: value })}
                min={0.1}
                max={50}
                step={0.1}
                mt="xs"
              />
            </Box>
          </SimpleGrid>

          {/* Срок кредита */}
          <Box>
            <Group gap="xs" mb="xs">
              <Calendar size={ICON_SIZE} />
              <Text size="sm" fw={500}>Срок кредита: {formatTerm(params.termMonths)}</Text>
            </Group>
            <Group align="flex-end" gap="md">
              <NumberInput
                value={params.termMonths}
                onChange={(value) => setParams({ ...params, termMonths: Number(value) || 1 })}
                min={1}
                max={360}
                suffix=" мес."
                style={{ flex: 1 }}
              />
              <Slider
                value={params.termMonths}
                onChange={(value) => setParams({ ...params, termMonths: value })}
                min={6}
                max={120}
                step={6}
                style={{ flex: 2 }}
              />
            </Group>
          </Box>

          {/* Тип платежа */}
          <Box>
            <Text size="sm" fw={500} mb="xs">Тип платежа</Text>
            <SegmentedControl
              value={params.type}
              onChange={(value) => setParams({ ...params, type: value as LoanParams['type'] })}
              data={[
                { value: 'annuity', label: 'Аннуитетный' },
                { value: 'differentiated', label: 'Дифференцированный' },
              ]}
              fullWidth
            />
            <Text size="xs" c="dimmed" mt="xs">
              {params.type === 'annuity' ? 'Платёж фиксирован на весь срок кредита' : 'Платёж уменьшается каждый месяц, первый платёж больше'}
            </Text>
          </Box>
        </Stack>
      </Paper>

      {/* Результаты */}
      <Paper p="lg" withBorder style={{ background: 'linear-gradient(135deg, #264653 0%, #2A9D8F 100%)' }}>
        <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="lg">
          <Box ta="center" c="white">
            <Text size="sm" style={{ opacity: 0.8 }}>
              {params.type === 'annuity' ? 'Ежемесячный платёж' : 'Первый платёж'}
            </Text>
            <Text size="xl" fw={700}>{formatCurrency(result.monthlyPayment)}</Text>
          </Box>
          <Box ta="center" c="white">
            <Text size="sm" style={{ opacity: 0.8 }}>Общая сумма выплат</Text>
            <Text size="xl" fw={700}>{formatCurrency(result.totalPayment)}</Text>
          </Box>
          <Box ta="center" c="white">
            <Text size="sm" style={{ opacity: 0.8 }}>Переплата по процентам</Text>
            <Text size="xl" fw={700} c="#F4A261">{formatCurrency(result.totalInterest)}</Text>
          </Box>
          <Box ta="center" c="white">
            <Text size="sm" style={{ opacity: 0.8 }}>Переплата</Text>
            <Text size="xl" fw={700} c="#E76F51">{formatPercent(result.overpaymentPercent)}</Text>
          </Box>
        </SimpleGrid>
      </Paper>

      {/* График платежей */}
      <Paper p="lg" withBorder>
        <Group justify="space-between" mb="md">
          <Group gap="sm">
            <Text fw={600} size="lg">График платежей</Text>
            <Badge variant="light" color="gray">
              {params.termMonths} платежей
            </Badge>
          </Group>
          <SegmentedControl
            value={viewMode}
            onChange={(value) => setViewMode(value as 'table' | 'chart')}
            data={[
              { value: 'table', label: 'Таблица' },
              { value: 'chart', label: 'График' },
            ]}
            size="sm"
          />
        </Group>

        {viewMode === 'table' ? (
          <ScrollArea h={400}>
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
                {result.schedule.slice(0, 60).map((row) => (
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
            {params.termMonths > 60 && (
              <Text size="sm" c="dimmed" ta="center" mt="md">
                Показаны первые 60 месяцев из {params.termMonths}
              </Text>
            )}
          </ScrollArea>
        ) : (
          <Stack gap="xl">
            {/* Структура платежей */}
            <Box>
              <Text size="sm" fw={500} mb="md">Структура платежей (основной долг vs проценты)</Text>
              <StackedBarChart
                data={stackedBarData}
                xKey="month"
                bars={[
                  { dataKey: 'principal', name: 'Основной долг', color: '#2A9D8F' },
                  { dataKey: 'interest', name: 'Проценты', color: '#E76F51' },
                ]}
                height={300}
                formatX={(v) => `М${v}`}
              />
            </Box>

            {/* Остаток долга */}
            <Box>
              <Text size="sm" fw={500} mb="md">Остаток задолженности</Text>
              <AreaChart
                data={chartData}
                xKey="month"
                lines={[
                  { key: 'balance', name: 'Остаток долга', color: '#264653' },
                ]}
                height={250}
                formatX={(v) => `М${v}`}
              />
            </Box>
          </Stack>
        )}
      </Paper>

      {/* Информация */}
      <Paper p="md" withBorder bg="gray.0">
        <Group gap="md">
          <ThemeIcon size="lg" variant="light" color="blue">
            <Calculator size={ICON_SIZE} />
          </ThemeIcon>
          <Box style={{ flex: 1 }}>
            <Text size="sm" fw={500}>Совет</Text>
            <Text size="xs" c="dimmed">
              {params.type === 'annuity' 
                ? 'При аннуитетном платеже переплата больше, но сумма фиксирована. Удобно для планирования бюджета.'
                : 'При дифференцированном платеже переплата меньше, но первые платежи выше. Выгоднее при досрочном погашении.'}
            </Text>
          </Box>
        </Group>
      </Paper>

      {/* Кнопка печати */}
      <Group justify="center">
        <PrintButton 
          data={reportData} 
          filename="loan-report.pdf"
          size="md"
        />
      </Group>
    </Stack>
  )
}
