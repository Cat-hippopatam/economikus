import { useState } from 'react'
import { Box, Table, Text, Paper, Group, Badge, TextInput, ActionIcon, Button, Modal, NumberInput, Switch, Stack, SimpleGrid, ScrollArea } from '@mantine/core'
import { Search, Pencil, Trash2, Calendar } from 'lucide-react'
import { useDeleteKakeboEntry, useUpdateKakeboEntry } from '@/hooks/useKakebo'
import { CategorySelector } from './CategorySelector'
import type { KakeboEntry } from '@/types/kakebo'

const CATEGORY_COLORS: Record<string, string> = {
  LIFE: 'blue',
  CULTURE: 'green',
  EXTRA: 'orange',
  UNEXPECTED: 'red',
}

const CATEGORY_LABELS: Record<string, string> = {
  LIFE: 'Жизнь',
  CULTURE: 'Культура',
  EXTRA: 'Дополнительное',
  UNEXPECTED: 'Непредвиденное',
}

const getCategoryInfo = (entry: KakeboEntry) => {
  if (entry.category?.name) {
    return {
      label: entry.category.name,
      color: entry.category.color || 'blue',
    }
  }
  if (entry.categoryOld) {
    return {
      label: CATEGORY_LABELS[entry.categoryOld] || entry.categoryOld,
      color: CATEGORY_COLORS[entry.categoryOld] || 'gray',
    }
  }
  return { label: 'Без категории', color: 'gray' }
}

interface KakeboListProps {
  entries: KakeboEntry[]
  isLoading: boolean
  onRefresh: () => void
}

export function KakeboList({ entries, isLoading, onRefresh }: KakeboListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [editingEntry, setEditingEntry] = useState<KakeboEntry | null>(null)
  const [deleteModalOpened, setDeleteModalOpened] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null)

  const deleteMutation = useDeleteKakeboEntry()
  const updateMutation = useUpdateKakeboEntry()

  const filteredEntries = entries.filter(
    (entry) =>
      entry.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = () => {
    if (entryToDelete) {
      deleteMutation.mutate(entryToDelete, {
        onSuccess: () => {
          setDeleteModalOpened(false)
          setEntryToDelete(null)
          onRefresh()
        }
      })
    }
  }

  const handleEdit = (entry: KakeboEntry) => {
    setEditingEntry(entry)
  }

  const handleUpdate = (data: Partial<KakeboEntry>) => {
    if (editingEntry) {
      updateMutation.mutate(
        { id: editingEntry.id, data },
        { onSuccess: () => setEditingEntry(null) }
      )
    }
  }

  if (isLoading) {
    return <Text ta="center" c="dimmed">Загрузка...</Text>
  }

  if (entries.length === 0) {
    return (
      <Paper p="md" withBorder>
        <Text ta="center" c="dimmed">
          Записей за этот месяц пока нет. Добавьте первую!
        </Text>
      </Paper>
    )
  }

  return (
    <Paper p="md" withBorder>
      <Group justify="space-between" mb="sm">
        <Text fw={500}>Траты за месяц</Text>
        <TextInput
          placeholder="Поиск..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
          leftSection={<Search size={16} />}
          w={{ base: 150, sm: 250 }}
        />
      </Group>

      {/* Таблица для десктопа */}
      <ScrollArea h={{ base: 'auto', lg: 400 }} type="auto">
        <Table highlightOnHover stickyHeader visibleFrom="lg">
          <Table.Thead>
            <Table.Tr>
              <Table.Th><Calendar size={16} /></Table.Th>
              <Table.Th>Категория</Table.Th>
              <Table.Th>Описание</Table.Th>
              <Table.Th>Сумма</Table.Th>
              <Table.Th>Тип</Table.Th>
              <Table.Th>Действия</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredEntries.map((entry) => (
              <Table.Tr key={entry.id}>
                <Table.Td>{new Date(entry.date).toLocaleDateString('ru-RU')}</Table.Td>
                <Table.Td>
                  {(() => {
                    const info = getCategoryInfo(entry)
                    return (
                      <Badge style={{ backgroundColor: info.color, color: 'white' }}>
                        {info.label}
                      </Badge>
                    )
                  })()}
                </Table.Td>
                <Table.Td>{entry.description}</Table.Td>
                <Table.Td fw={700}>{entry.amount.toFixed(2)} у.е.</Table.Td>
                <Table.Td>
                  <Badge variant={entry.isNecessary ? 'light' : 'filled'} color={entry.isNecessary ? 'green' : 'orange'}>
                    {entry.isNecessary ? 'Необходимо' : 'Необязательно'}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs" justify="flex-end">
                    <ActionIcon onClick={() => handleEdit(entry)} variant="light">
                      <Pencil size={16} />
                    </ActionIcon>
                    <ActionIcon
                      onClick={() => {
                        setEntryToDelete(entry.id)
                        setDeleteModalOpened(true)
                      }}
                      color="red"
                      variant="light"
                    >
                      <Trash2 size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      {/* Карточки для мобильных */}
      <SimpleGrid cols={1} spacing="sm" hiddenFrom="lg">
        {filteredEntries.map((entry) => (
          <Paper key={entry.id} p="sm" withBorder>
            <Stack gap="xs">
              <Group justify="space-between">
                <Group gap="xs">
                  <Calendar size={16} color="var(--mantine-color-blue-6)" />
                  <Text size="sm">{new Date(entry.date).toLocaleDateString('ru-RU')}</Text>
                </Group>
                {(() => {
                  const info = getCategoryInfo(entry)
                  return (
                    <Badge style={{ backgroundColor: info.color, color: 'white' }} size="sm">
                      {info.label}
                    </Badge>
                  )
                })()}
              </Group>
              <Text size="md" fw={500}>{entry.description}</Text>
              <Group justify="space-between" align="flex-end">
                <Stack gap={0}>
                  <Text size="xs" c="dimmed">Сумма</Text>
                  <Text size="lg" fw={700}>{entry.amount.toFixed(2)} у.е.</Text>
                </Stack>
                <Stack gap={0}>
                  <Text size="xs" c="dimmed">Тип</Text>
                  <Badge variant={entry.isNecessary ? 'light' : 'filled'} color={entry.isNecessary ? 'green' : 'orange'} size="sm">
                    {entry.isNecessary ? 'Необходимо' : 'Необязательно'}
                  </Badge>
                </Stack>
                <Group gap="xs">
                  <ActionIcon onClick={() => handleEdit(entry)} variant="light">
                    <Pencil size={16} />
                  </ActionIcon>
                  <ActionIcon
                    onClick={() => {
                      setEntryToDelete(entry.id)
                      setDeleteModalOpened(true)
                    }}
                    color="red"
                    variant="light"
                  >
                    <Trash2 size={16} />
                  </ActionIcon>
                </Group>
              </Group>
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>

      <Group justify="flex-end" mt="sm">
        <Text size="sm" c="dimmed">
          Всего записей: {filteredEntries.length}
        </Text>
      </Group>

      {/* Modal редактирования */}
      <Modal
        opened={!!editingEntry}
        onClose={() => setEditingEntry(null)}
        title="Редактировать запись"
        centered
      >
        {editingEntry && (
          <EditEntryForm entry={editingEntry} onUpdate={handleUpdate} onCancel={() => setEditingEntry(null)} />
        )}
      </Modal>

      {/* Modal удаления */}
      <Modal
        opened={deleteModalOpened}
        onClose={() => {
          setDeleteModalOpened(false)
          setEntryToDelete(null)
        }}
        title="Удалить запись"
        centered
      >
        <Text mb="md">Вы уверены, что хотите удалить эту запись?</Text>
        <Group justify="flex-end">
          <Button variant="subtle" onClick={() => {
            setDeleteModalOpened(false)
            setEntryToDelete(null)
          }}>
            Отмена
          </Button>
          <Button color="red" onClick={handleDelete} loading={deleteMutation.isPending}>
            Удалить
          </Button>
        </Group>
      </Modal>
    </Paper>
  )
}

// Подкомпонент формы редактирования
function EditEntryForm({
  entry,
  onUpdate,
  onCancel
}: {
  entry: KakeboEntry
  onUpdate: (data: Partial<KakeboEntry>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<Partial<KakeboEntry>>({
    date: entry.date.split('T')[0],
    categoryId: entry.categoryId || null,
    categoryOld: entry.categoryOld,
    description: entry.description,
    amount: entry.amount,
    isNecessary: entry.isNecessary,
  })

  const handleSave = () => {
    onUpdate(formData)
  }

  return (
    <Box>
      <Group gap="sm" mb="md">
        <CategorySelector
          value={formData.categoryId || null}
          onChange={(v) => setFormData({ ...formData, categoryId: v })}
        />
      </Group>
      <TextInput
        label="Описание"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.currentTarget.value })}
        mb="md"
      />
      <NumberInput
        label="Сумма"
        value={formData.amount}
        onChange={(v) => setFormData({ ...formData, amount: v as number })}
        mb="md"
      />
      <Switch
        label="Необязательно"
        checked={formData.isNecessary}
        onChange={(e) => setFormData({ ...formData, isNecessary: e.currentTarget.checked })}
        mb="md"
      />
      <Group justify="flex-end">
        <Button variant="subtle" onClick={onCancel}>
          Отмена
        </Button>
        <Button onClick={handleSave}>
          Сохранить
        </Button>
      </Group>
    </Box>
  )
}
