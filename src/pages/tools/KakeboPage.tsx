import { useState } from 'react'
import { 
  Box, 
  Title, 
  Paper, 
  Text, 
  Group, 
  Select, 
  Button, 
  Modal, 
  Input, 
  Anchor,
  Collapse,
  ActionIcon,
  SimpleGrid
} from '@mantine/core'
import { Plus, Settings, BarChart, ChevronUp, ChevronDown } from 'lucide-react'
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
  const [filtersExpanded, setFiltersExpanded] = useState(false)
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
    <Box p={{ base: 'sm', md: 'md' }}>
      {/* Заголовок и фильтры */}
      <Paper p={{ base: 'xs', sm: 'sm' }} mb="md" withBorder>
        <Group justify="space-between" align="flex-start">
          {/* Заголовок */}
          <Box>
            <Group gap="xs">
              <Title order={3} m={0}>Kakebo</Title>
              <Anchor 
                href="/tools/kakebo/dashboard" 
                target="_blank" 
                size="xs" 
                c="blue"
                style={{ textDecoration: 'none' }}
              >
                <Group gap="xs">
                  <BarChart size={14} />
                  <Text size="xs">Дашборд ↗</Text>
                </Group>
              </Anchor>
            </Group>
            <Text size="xs" c="dimmed" mt="xs">
              Учёт условных единиц
            </Text>
          </Box>

          {/* Кнопки на десктопе */}
          <Group visibleFrom="md">
            <Input
              type="month"
              value={`${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}`}
              onChange={(e) => {
                const [y, m] = e.currentTarget.value.split('-').map(Number)
                setCurrentDate(new Date(y, m - 1))
                setTempMonthLimit(data?.settings.monthLimit?.toString() || '')
              }}
              style={{ width: 180 }}
              size="sm"
            />
            <Button
              leftSection={<Settings size={16} />}
              onClick={() => {
                setTempMonthLimit(data?.settings.monthLimit?.toString() || '')
                setSettingsModalOpened(true)
              }}
              size="sm"
            >
              Лимит
            </Button>
          </Group>

          {/* Кнопка-бургер для мобильных */}
          <Group hiddenFrom="md">
            <ActionIcon
              variant="light"
              onClick={() => setFiltersExpanded(!filtersExpanded)}
              size="md"
            >
              {filtersExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </ActionIcon>
          </Group>
        </Group>

        {/* Фильтры для мобильных (сворачиваемые) */}
        <Collapse in={filtersExpanded} mt="sm">
          <Group gap="xs" wrap="wrap">
            <Input
              type="month"
              value={`${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}`}
              onChange={(e) => {
                const [y, m] = e.currentTarget.value.split('-').map(Number)
                setCurrentDate(new Date(y, m - 1))
                setTempMonthLimit(data?.settings.monthLimit?.toString() || '')
              }}
              style={{ width: '100%' }}
              size="sm"
            />
            <Button
              fullWidth
              leftSection={<Settings size={16} />}
              onClick={() => {
                setTempMonthLimit(data?.settings.monthLimit?.toString() || '')
                setSettingsModalOpened(true)
              }}
              size="sm"
            >
              Лимит
            </Button>
          </Group>
        </Collapse>
      </Paper>

      {/* Статистика */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs" mb="md">
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
        <KakeboStats
          title="Дней с записями"
          value={`${data?.summary.daysWithEntries || 0}/${data?.summary.daysInMonth || 0}`}
          color="blue"
        />
      </SimpleGrid>

      {/* Цель на месяц */}
      <MonthlyGoalCard key={`goal-${year}-${month}`} year={year} month={month} onRefresh={refetch} />

      {/* Бюджетное уравнение */}
      <BudgetEquation key={`budget-${year}-${month}`} year={year} month={month} />

      {/* Форма добавления */}
      <Paper p={{ base: 'sm', md: 'md' }} mb="md" withBorder>
        <Group mb="sm" gap="xs">
          <Plus size={18} />
          <Text fw={500} size="sm">Добавить запись</Text>
        </Group>
        <KakeboForm onSuccess={() => refetch()} />
      </Paper>

      {/* Список трат */}
      <KakeboList entries={data?.entries || []} isLoading={isLoading} onRefresh={refetch} />

      {/* Фиксированные траты */}
      <Box mt={{ base: 'md', md: 'xl' }}>
        <FixedExpensesManager />
      </Box>

      {/* Управление категориями */}
      <Box mt={{ base: 'md', md: 'xl' }}>
        <CategoryManager />
      </Box>

      {/* Рефлексия */}
      {reflectionQuery.data && (
        <Box mt={{ base: 'md', md: 'xl' }}>
          <KakeboReflection
            reflection={reflectionQuery.data}
          />
        </Box>
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
