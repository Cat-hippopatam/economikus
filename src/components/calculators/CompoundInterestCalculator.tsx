/**
 * Калькулятор сложного процента
 */

import { useState, useMemo } from 'react'
import {
  Paper,
  Stack,
  Group,
  Text,
  NumberInput,
  Slider,
  Select,
  Button,
  Box,
  SimpleGrid,
  ThemeIcon,
  Table,
  ScrollArea,
  SegmentedControl,
} from '@mantine/core'
import { TrendingUp, PiggyBank, Percent, Calendar, RefreshCw } from 'lucide-react'
import { 
  calculateCompoundInterest, 
  formatCurrency, 
  formatPercent 
} from '@/utils/calculators'
import { AreaChart, DonutChart } from '@/components/charts'
import { PrintButton } from '@/components/print'
import type { CompoundInterestParams } from '@/types/calculator'

const ICON_SIZE = 18

export function CompoundInterestCalculator() {
  const [params, setParams] = useState<CompoundInterestParams>({
    principal: 100000,
    monthlyContribution: 10000,
    annualRate: 12,
    years: 10,
    compoundFrequency: 'monthly',
  })

  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table')

  const result = useMemo(() => calculateCompoundInterest(params), [params])

  // Данные для графиков
  const areaChartData = useMemo(() => {
    let cumulativeInterest = 0
    return result.yearlyBreakdown.map((row) => {
      cumulativeInterest += row.interest
      return {
        year: row.year,
        endBalance: row.endBalance,
        totalContributions: row.year === 1 
          ? params.principal + row.contribution 
          : result.yearlyBreakdown[row.year - 2].endBalance + row.contribution,
        interest: cumulativeInterest,
      }
    })
  }, [result, params.principal])

  const donutChartData = useMemo(() => [
    { name: 'Ваши взносы', value: result.totalContributions, color: '#264653' },
    { name: 'Доход от процентов', value: result.totalInterest, color: '#2A9D8F' },
  ], [result])

  // Данные для PDF-отчёта
  const reportData = useMemo(() => ({
    title: 'Калькулятор сложного процента',
    subtitle: 'Расчёт инвестиций с капитализацией процентов',
    date: new Date().toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    params: {
      'Начальная сумма': formatCurrency(params.principal),
      'Ежемесячный взнос': formatCurrency(params.monthlyContribution),
      'Годовая доходность': `${params.annualRate}%`,
      'Срок инвестирования': `${params.years} лет`,
      'Капитализация': params.compoundFrequency === 'monthly' ? 'Ежемесячно' 
        : params.compoundFrequency === 'quarterly' ? 'Ежеквартально' : 'Ежегодно',
    },
    results: {
      'Итоговая сумма': formatCurrency(result.finalAmount),
      'Ваши взносы': formatCurrency(result.totalContributions),
      'Доход от процентов': formatCurrency(result.totalInterest),
      'Доходность': formatPercent((result.finalAmount / result.totalContributions - 1) * 100),
    },
    tableData: result.yearlyBreakdown.map(row => ({
      label: `Год ${row.year}`,
      values: [
        formatCurrency(row.startBalance),
        formatCurrency(row.contribution),
        formatCurrency(row.interest),
        formatCurrency(row.endBalance),
      ],
    })),
    tableHeaders: ['Год', 'Начало года', 'Взносы', 'Проценты', 'Конец года'],
  }), [params, result])

  const handleReset = () => {
    setParams({
      principal: 100000,
      monthlyContribution: 10000,
      annualRate: 12,
      years: 10,
      compoundFrequency: 'monthly',
    })
  }

  return (
    <Stack gap="xl">
      {/* Ввод параметров */}
      <Paper p="lg" withBorder>
        <Stack gap="lg">
          <Group justify="space-between">
            <Text fw={600} size="lg">Параметры инвестирования</Text>
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
            {/* Начальная сумма */}
            <Box>
              <Group gap="xs" mb="xs">
                <PiggyBank size={ICON_SIZE} />
                <Text size="sm" fw={500}>Начальная сумма</Text>
              </Group>
              <NumberInput
                value={params.principal}
                onChange={(value) => setParams({ ...params, principal: Number(value) || 0 })}
                min={0}
                max={100000000}
                step={10000}
                thousandSeparator=" "
                suffix=" ₽"
              />
              <Slider
                value={params.principal}
                onChange={(value) => setParams({ ...params, principal: value })}
                min={0}
                max={5000000}
                step={10000}
                mt="xs"
              />
            </Box>

            {/* Ежемесячный взнос */}
            <Box>
              <Group gap="xs" mb="xs">
                <TrendingUp size={ICON_SIZE} />
                <Text size="sm" fw={500}>Ежемесячный взнос</Text>
              </Group>
              <NumberInput
                value={params.monthlyContribution}
                onChange={(value) => setParams({ ...params, monthlyContribution: Number(value) || 0 })}
                min={0}
                max={1000000}
                step={1000}
                thousandSeparator=" "
                suffix=" ₽"
              />
              <Slider
                value={params.monthlyContribution}
                onChange={(value) => setParams({ ...params, monthlyContribution: value })}
                min={0}
                max={500000}
                step={1000}
                mt="xs"
              />
            </Box>

            {/* Годовая ставка */}
            <Box>
              <Group gap="xs" mb="xs">
                <Percent size={ICON_SIZE} />
                <Text size="sm" fw={500}>Годовая доходность</Text>
              </Group>
              <NumberInput
                value={params.annualRate}
                onChange={(value) => setParams({ ...params, annualRate: Number(value) || 0 })}
                min={0}
                max={100}
                step={0.5}
                decimalScale={1}
                suffix=" %"
              />
              <Slider
                value={params.annualRate}
                onChange={(value) => setParams({ ...params, annualRate: value })}
                min={0}
                max={50}
                step={0.5}
                mt="xs"
              />
            </Box>

            {/* Срок */}
            <Box>
              <Group gap="xs" mb="xs">
                <Calendar size={ICON_SIZE} />
                <Text size="sm" fw={500}>Срок инвестирования</Text>
              </Group>
              <NumberInput
                value={params.years}
                onChange={(value) => setParams({ ...params, years: Number(value) || 1 })}
                min={1}
                max={50}
                suffix=" лет"
              />
              <Slider
                value={params.years}
                onChange={(value) => setParams({ ...params, years: value })}
                min={1}
                max={30}
                step={1}
                mt="xs"
              />
            </Box>
          </SimpleGrid>

          {/* Частота капитализации */}
          <Box>
            <Text size="sm" fw={500} mb="xs">Капитализация процентов</Text>
            <Select
              value={params.compoundFrequency}
              onChange={(value) => setParams({ ...params, compoundFrequency: value as CompoundInterestParams['compoundFrequency'] })}
              data={[
                { value: 'monthly', label: 'Ежемесячно' },
                { value: 'quarterly', label: 'Ежеквартально' },
                { value: 'annually', label: 'Ежегодно' },
              ]}
            />
          </Box>
        </Stack>
      </Paper>

      {/* Результаты */}
      <Paper p="lg" withBorder style={{ background: 'linear-gradient(135deg, #264653 0%, #2A9D8F 100%)' }}>
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
          <Box ta="center" c="white">
            <Text size="sm" style={{ opacity: 0.8 }}>Итоговая сумма</Text>
            <Text size="xl" fw={700}>{formatCurrency(result.finalAmount)}</Text>
          </Box>
          <Box ta="center" c="white">
            <Text size="sm" style={{ opacity: 0.8 }}>Ваши взносы</Text>
            <Text size="xl" fw={700}>{formatCurrency(result.totalContributions)}</Text>
          </Box>
          <Box ta="center" c="white">
            <Text size="sm" style={{ opacity: 0.8 }}>Доход от процентов</Text>
            <Text size="xl" fw={700} c="#F4A261">{formatCurrency(result.totalInterest)}</Text>
          </Box>
        </SimpleGrid>
      </Paper>

      {/* Детализация по годам */}
      <Paper p="lg" withBorder>
        <Group justify="space-between" mb="md">
          <Text fw={600} size="lg">Динамика по годам</Text>
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
          <ScrollArea>
            <Table striped highlightOnHover miw={600}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Год</Table.Th>
                  <Table.Th>Начало года</Table.Th>
                  <Table.Th>Взносы за год</Table.Th>
                  <Table.Th>Проценты</Table.Th>
                  <Table.Th>Конец года</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {result.yearlyBreakdown.map((row) => (
                  <Table.Tr key={row.year}>
                    <Table.Td fw={500}>{row.year}</Table.Td>
                    <Table.Td>{formatCurrency(row.startBalance)}</Table.Td>
                    <Table.Td>{formatCurrency(row.contribution)}</Table.Td>
                    <Table.Td c="teal">{formatCurrency(row.interest)}</Table.Td>
                    <Table.Td fw={600}>{formatCurrency(row.endBalance)}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        ) : (
          <Stack gap="xl">
            {/* График роста капитала */}
            <Box>
              <Text size="sm" fw={500} mb="md">Рост капитала</Text>
              <AreaChart
                data={areaChartData}
                xKey="year"
                lines={[
                  { key: 'endBalance', name: 'Общий баланс', color: '#2A9D8F' },
                  { key: 'totalContributions', name: 'Ваши взносы', color: '#264653' },
                  { key: 'interest', name: 'Накопленные проценты', color: '#F4A261' },
                ]}
                height={300}
              />
            </Box>

            {/* Круговая диаграмма */}
            <Box>
              <Text size="sm" fw={500} mb="md">Соотношение взносов и дохода</Text>
              <DonutChart
                data={donutChartData}
                height={280}
                innerRadius={50}
                outerRadius={90}
              />
            </Box>
          </Stack>
        )}
      </Paper>

      {/* Информация */}
      <Paper p="md" withBorder bg="gray.0">
        <Group gap="md">
          <ThemeIcon size="lg" variant="light" color="blue">
            <TrendingUp size={ICON_SIZE} />
          </ThemeIcon>
          <Box style={{ flex: 1 }}>
            <Text size="sm" fw={500}>Как это работает?</Text>
            <Text size="xs" c="dimmed">
              Сложный процент — это начисление процентов на проценты. 
              Чем чаще капитализация и дольше срок, тем больше доход. 
              При доходности {params.annualRate}% за {params.years} лет вы получите {formatPercent((result.finalAmount / result.totalContributions - 1) * 100)} доходности.
            </Text>
          </Box>
        </Group>
      </Paper>

      {/* Кнопка печати */}
      <Group justify="center">
        <PrintButton 
          data={reportData} 
          filename="compound-interest-report.pdf"
          size="md"
        />
      </Group>
    </Stack>
  )
}
