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
} from '@mantine/core'
import { TrendingUp, PiggyBank, Percent, Calendar, RefreshCw } from 'lucide-react'
import { 
  calculateCompoundInterest, 
  formatCurrency, 
  formatPercent 
} from '@/utils/calculators'
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

  const result = useMemo(() => calculateCompoundInterest(params), [params])

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
        <Text fw={600} size="lg" mb="md">Динамика по годам</Text>
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
    </Stack>
  )
}
