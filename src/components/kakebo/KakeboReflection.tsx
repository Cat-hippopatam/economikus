import { useState } from 'react'
import { Box, Paper, Title, Group, TextInput, Textarea, Button, Modal, Card, Text, SimpleGrid } from '@mantine/core'
import { Brain } from 'lucide-react'
import { useSaveKakeboReflection } from '@/hooks/useKakebo'
import type { KakeboReflection as ReflectionType } from '@/types/kakebo'

interface KakeboReflectionProps {
  reflection: ReflectionType | null
  onRefresh: () => void
}

export function KakeboReflection({ reflection, onRefresh }: KakeboReflectionProps) {
  const [modalOpened, setModalOpened] = useState(false)
  const [formData, setFormData] = useState<Partial<ReflectionType>>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    moneyAtStart: reflection?.moneyAtStart || 0,
    plannedToSave: reflection?.plannedToSave || 0,
    actuallySaved: reflection?.actuallySaved || 0,
    unnecessarySpent: reflection?.unnecessarySpent || 0,
    improvements: reflection?.improvements || '',
  })

  const saveMutation = useSaveKakeboReflection()

  const handleOpen = () => {
    setFormData({
      year: reflection?.year || new Date().getFullYear(),
      month: reflection?.month || new Date().getMonth() + 1,
      moneyAtStart: reflection?.moneyAtStart || 0,
      plannedToSave: reflection?.plannedToSave || 0,
      actuallySaved: reflection?.actuallySaved || 0,
      unnecessarySpent: reflection?.unnecessarySpent || 0,
      improvements: reflection?.improvements || '',
    })
    setModalOpened(true)
  }

  const handleSave = () => {
    saveMutation.mutate(formData as ReflectionType, { onSuccess: () => setModalOpened(false) })
  }

  const savingsRate = formData.moneyAtStart && formData.actuallySaved
    ? ((formData.actuallySaved / formData.moneyAtStart) * 100).toFixed(1)
    : '0.0'

  return (
    <Paper p="md" withBorder mt="md">
      <Group justify="space-between">
        <Group>
          <Brain size={24} />
          <Title order={3}>Рефлексия месяца</Title>
        </Group>
        <Button onClick={handleOpen}>
          {reflection ? 'Редактировать' : 'Заполнить'}
        </Button>
      </Group>

      {reflection && (
        <Card p="md" mt="md" withBorder>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
            <Card.Section>
              <Text size="sm" c="dimmed">Начало месяца</Text>
              <Text fw={700}>{reflection.moneyAtStart?.toFixed(0)} у.е.</Text>
            </Card.Section>
            <Card.Section>
              <Text size="sm" c="dimmed">Планировалось отложить</Text>
              <Text fw={700}>{reflection.plannedToSave?.toFixed(0)} у.е.</Text>
            </Card.Section>
            <Card.Section>
              <Text size="sm" c="dimmed">Реально отложено</Text>
              <Text fw={700} c="green">{reflection.actuallySaved?.toFixed(0)} у.е.</Text>
            </Card.Section>
            <Card.Section>
              <Text size="sm" c="dimmed">Бесполезные траты</Text>
              <Text fw={700} c="orange">{reflection.unnecessarySpent?.toFixed(0)} у.е.</Text>
            </Card.Section>
          </SimpleGrid>
          {reflection.improvements && (
            <Textarea
              label="Что можно улучшить"
              value={reflection.improvements}
              readOnly
              mt="md"
              minRows={3}
            />
          )}
          <Group justify="flex-end" mt="sm">
            <Text size="xs" c="dimmed">
              Коэффициент сбережения: {savingsRate}%
            </Text>
          </Group>
        </Card>
      )}

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Рефлексия месяца"
        centered
        size="lg"
      >
        <Box>
          <SimpleGrid cols={2} spacing="md">
            <TextInput
              label="Сколько денег было в начале месяца"
              type="number"
              value={formData.moneyAtStart}
              onChange={(e) => setFormData({ ...formData, moneyAtStart: parseFloat(e.currentTarget.value) || 0 })}
            />
            <TextInput
              label="Сколько планировали отложить"
              type="number"
              value={formData.plannedToSave}
              onChange={(e) => setFormData({ ...formData, plannedToSave: parseFloat(e.currentTarget.value) || 0 })}
            />
            <TextInput
              label="Сколько реально отложили"
              type="number"
              value={formData.actuallySaved}
              onChange={(e) => setFormData({ ...formData, actuallySaved: parseFloat(e.currentTarget.value) || 0 })}
            />
            <TextInput
              label="Сколько потратили впустую"
              type="number"
              value={formData.unnecessarySpent}
              onChange={(e) => setFormData({ ...formData, unnecessarySpent: parseFloat(e.currentTarget.value) || 0 })}
            />
          </SimpleGrid>
          <Textarea
            label="Что можно улучшить в следующем месяце"
            value={formData.improvements}
            onChange={(e) => setFormData({ ...formData, improvements: e.currentTarget.value })}
            minRows={4}
            mt="md"
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={() => setModalOpened(false)}>
              Отмена
            </Button>
            <Button onClick={handleSave} loading={saveMutation.isPending}>
              Сохранить
            </Button>
          </Group>
        </Box>
      </Modal>
    </Paper>
  )
}
