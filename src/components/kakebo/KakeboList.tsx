import { useState } from 'react'
import { Box, Table, Text, Paper, Group, Badge, TextInput, ActionIcon, Button, Modal, NumberInput, Select, Switch } from '@mantine/core'
import { useState } from 'react'
import { Box, Table, Text, Paper, Group, Badge, TextInput, ActionIcon, Button, Modal, NumberInput, Select, Switch } from '@mantine/core'
import { Search, Pencil, Trash2, Calendar } from 'lucide-react'
import { useDeleteKakeboEntry, useUpdateKakeboEntry } from '@/hooks/useKakebo'
import type { KakeboEntry, KakeboCategory } from '@/types/kakebo'

const CATEGORY_COLORS: Record<KakeboCategory, string> = {
  LIFE: 'blue',
  CULTURE: 'green',
  EXTRA: 'orange',
  UNEXPECTED: 'red',
}

const CATEGORY_LABELS: Record<KakeboCategory, string> = {
  LIFE: 'Жизнь',
  CULTURE: 'Культура',
  EXTRA: 'Дополнительное',
  UNEXPECTED: 'Непредвиденное',
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
          w={250}
        />
      </Group>

      <Table highlightOnHover stickyHeader>
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
                <Badge color={CATEGORY_COLORS[entry.category]}>
                  {CATEGORY_LABELS[entry.category]}
                </Badge>
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
    category: entry.category,
    description: entry.description,
    amount: entry.amount,
    isNecessary: entry.isNecessary,
  })

  const handleSave = () => {
    onUpdate(formData)
  }

  return (
    <Box>
      <Select
        label="Категория"
        data={Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label }))}
        value={formData.category}
        onChange={(v) => setFormData({ ...formData, category: v as KakeboCategory })}
        mb="md"
      />
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
