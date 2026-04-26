import { useState } from 'react'
import { Box, Title, Grid, Paper, Text, Group, Select, Flex, Button, Modal, Input, Anchor } from '@mantine/core'
import { Plus, Settings, BarChart } from 'lucide-react'
import { KakeboStats } from '@/components/kakebo/KakeboStats'
import { KakeboForm } from '@/components/kakebo/KakeboForm'
import { KakeboList } from '@/components/kakebo/KakeboList'
import { KakeboReflection } from '@/components/kakebo/KakeboReflection'
import { CategoryManager } from '@/components/kakebo/CategoryManager'
import { FixedExpensesManager } from '@/components/kakebo/FixedExpensesManager'
import { MonthlyGoalCard } from '@/components/kakebo/MonthlyGoalCard'
import { BudgetEquation } from '@/components/kakebo/BudgetEquation'
import { useKakeboMonth, useKakeboSettings, useKakeboReflection } from '@/hooks/useKakebo'

export function KakeboPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [settingsModalOpened, setSettingsModalOpened] = useState(false)
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1

  const { data, isLoading, refetch } = useKakeboMonth(year, month)
  const settingsMutation = useKakeboSettings()
  const reflectionQuery = useKakeboReflection(year, month)
  const [tempMonthLimit, setTempMonthLimit] = useState(data?.settings.monthLimit?.toString() || '')

  const handleSaveSettings = () => {
    const limit = tempMonthLimit ? parseFloat(tempMonthLimit) : null
    settingsMutation.mutate({ monthLimit: limit })
    setSettingsModalOpened(false)
  }

  const isOverLimit = data?.settings.monthLimit && data.summary.totalSpent > (data.settings.monthLimit || 0)
  const remainingLimit = data?.settings.monthLimit 
    ? data.settings.monthLimit - data.summary.totalSpent 
    : null
  const limitPercent = data?.settings.monthLimit && data.settings.monthLimit > 0
    ? Math.min((data.summary.totalSpent / data.settings.monthLimit) * 100, 100)
    : 0

  return (
    <Box p="md">
      <Flex justify="space-between" align="center" mb="lg">
        <Group gap="md">
          <Title order={1}>Kakebo — Учёт условных единиц</Title>
          <Anchor href="/tools/kakebo/dashboard" target="_blank" size="sm" c="blue">
            <Group gap="xs">
              <BarChart size={16} />
              <Text size="sm">Дашборд ↗</Text>
            </Group>
          </Anchor>
        </Group>
        <Group>
          <Input
            type="month"
            value={`${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}`}
            onChange={(e) => {
              const [y, m] = e.currentTarget.value.split('-').map(Number)
              setCurrentDate(new Date(y, m - 1))
              setTempMonthLimit(data?.settings.monthLimit?.toString() || '')
            }}
            style={{ width: 200 }}
          />
          <Button
            leftSection={<Settings size={16} />}
            onClick={() => {
              setTempMonthLimit(data?.settings.monthLimit?.toString() || '')
              setSettingsModalOpened(true)
            }}
          >
            Лимит
          </Button>
        </Group>
      </Flex>

      {/* Статистика */}
      <Grid mb="lg">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <KakeboStats
            title="Потрачено"
            value={data?.summary.totalSpent || 0}
            subtitle={
              data?.settings.monthLimit 
                ? `Лимит: ${data.settings.monthLimit} у.е. | Осталось: ${remainingLimit?.toFixed(0) || 0} у.е.`
                : 'Лимит не установлен'
            }
            color={isOverLimit ? 'red' : data?.settings.monthLimit ? 'green' : 'gray'}
            percent={limitPercent}
            showProgress={!!data?.settings.monthLimit}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <KakeboStats
            title="Дней с записями"
            value={`${data?.summary.daysWithEntries || 0}/${data?.summary.daysInMonth || 0}`}
            color="blue"
          />
        </Grid.Col>
      </Grid>

      {/* Цель на месяц */}
      <MonthlyGoalCard key={`goal-${year}-${month}`} year={year} month={month} onRefresh={refetch} />

      {/* Бюджетное уравнение */}
      <BudgetEquation key={`budget-${year}-${month}`} year={year} month={month} />

      {/* Форма добавления */}
      <Paper p="md" mb="md" withBorder>
        <Group mb="sm">
          <Plus size={20} />
          <Text fw={500}>Добавить запись</Text>
        </Group>
        <KakeboForm onSuccess={() => refetch()} />
      </Paper>

      {/* Список трат */}
      <KakeboList entries={data?.entries || []} isLoading={isLoading} onRefresh={refetch} />

      {/* Фиксированные траты */}
      <Box mt="lg">
        <FixedExpensesManager />
      </Box>

      {/* Управление категориями */}
      <Box mt="lg">
        <CategoryManager />
      </Box>

      {/* Рефлексия */}
      {reflectionQuery.data && (
        <KakeboReflection
          reflection={reflectionQuery.data}
        />
      )}

      {/* Modal настроек */}
      <Modal
        opened={settingsModalOpened}
        onClose={() => setSettingsModalOpened(false)}
        title="Настройки месячного лимита"
        centered
      >
        <Group gap="sm" mt="md">
          <Select
            label="Месячный лимит (у.е.)"
            data={[
              { value: '1000', label: '1000 у.е.' },
              { value: '2000', label: '2000 у.е.' },
              { value: '5000', label: '5000 у.е.' },
              { value: '10000', label: '10000 у.е.' },
            ]}
            value={tempMonthLimit}
            onChange={(value) => setTempMonthLimit(value ?? '')}
            clearable
            placeholder="Без лимита"
            w="100%"
          />
        </Group>
        <Group justify="flex-end" mt="md">
          <Button variant="subtle" onClick={() => setSettingsModalOpened(false)}>
            Отмена
          </Button>
          <Button onClick={handleSaveSettings} loading={settingsMutation.isPending}>
            Сохранить
          </Button>
        </Group>
      </Modal>
    </Box>
  )
}

export default KakeboPage
