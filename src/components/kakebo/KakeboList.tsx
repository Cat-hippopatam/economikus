import { useState } from 'react'
import { Box, Table, Text, Paper, Group, Badge, TextInput, ActionIcon, Button, Modal, NumberInput, Switch, Stack, SimpleGrid } from '@mantine/core'
import { Search, Pencil, Trash2, Calendar, Download } from 'lucide-react'
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

  const exportToCSV = () => {
    if (filteredEntries.length === 0) {
      alert('Нет данных для экспорта')
      return
    }

    const headers = ['Дата', 'Категория', 'Описание', 'Сумма (у.е.)', 'Тип']
    const csvRows = [headers.join(',')]

    filteredEntries.forEach((entry) => {
      const info = getCategoryInfo(entry)
      const type = entry.isNecessary ? 'Необходимо' : 'Необязательно'
      const date = new Date(entry.date).toLocaleDateString('ru-RU')
      
      const row = [
        `"${date}"`,
        `"${info.label}"`,
        `"${entry.description.replace(/"/g, '""')}"`,
        entry.amount.toFixed(2),
        `"${type}"`
      ]
      csvRows.push(row.join(','))
    })

    const csvContent = csvRows.join('\r\n')
    
    // Добавляем BOM для корректного отображения кириллицы в Excel
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    
    const year = new Date().getFullYear()
    const month = String(new Date().getMonth() + 1).padStart(2, '0')
    
    // Создаём ссылку и инициируем скачивание
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.href = url
    link.download = `kakebo_${year}_${month}.csv`
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
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
    <Paper p={{ base: 'sm', md: 'md' }} withBorder>
      <Group justify="space-between" mb="sm">
        <Group gap="sm">
          <Text fw={500} size="sm">Траты за месяц</Text>
          <TextInput
            placeholder="Поиск..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
            leftSection={<Search size={14} />}
            w={{ base: 120, sm: 200, md: 250 }}
            size="sm"
          />
        </Group>
        <Button
          variant="light"
          size="xs"
          leftSection={<Download size={14} />}
          onClick={exportToCSV}
          disabled={filteredEntries.length === 0}
          visibleFrom="sm"
        >
          Экспорт CSV
        </Button>
        <ActionIcon
          variant="light"
          size="sm"
          onClick={exportToCSV}
          disabled={filteredEntries.length === 0}
          hiddenFrom="sm"
        >
          <Download size={16} />
        </ActionIcon>
      </Group>

      {/* Таблица для десктопа с горизонтальным скроллом */}
      <Box visibleFrom="md">
        <div style={{ overflowX: 'auto', width: '100%', maxWidth: '100%' }}>
          <Table 
            highlightOnHover 
            stickyHeader
            withTableBorder={false}
            style={{ minWidth: 600, display: 'table' }}
          >
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ minWidth: 80, padding: '8px' }}><Calendar size={14} /></Table.Th>
              <Table.Th style={{ minWidth: 100, padding: '8px' }}>Категория</Table.Th>
              <Table.Th style={{ minWidth: 150, padding: '8px' }}>Описание</Table.Th>
              <Table.Th style={{ minWidth: 80, padding: '8px' }}>Сумма</Table.Th>
              <Table.Th style={{ minWidth: 100, padding: '8px' }}>Тип</Table.Th>
              <Table.Th style={{ minWidth: 80, padding: '8px' }}>Действия</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredEntries.map((entry) => (
              <Table.Tr key={entry.id}>
                <Table.Td style={{ padding: '8px' }}>{new Date(entry.date).toLocaleDateString('ru-RU')}</Table.Td>
                <Table.Td style={{ padding: '8px' }}>
                  {(() => {
                    const info = getCategoryInfo(entry)
                    return (
                      <Badge style={{ backgroundColor: info.color, color: 'white' }} size="xs">
                        {info.label}
                      </Badge>
                    )
                  })()}
                </Table.Td>
                <Table.Td style={{ padding: '8px' }}>
                  <Text size="xs" lineClamp={2}>{entry.description}</Text>
                </Table.Td>
                <Table.Td style={{ padding: '8px' }} fw={700}>{entry.amount.toFixed(2)} у.е.</Table.Td>
                <Table.Td style={{ padding: '8px' }}>
                  <Badge variant={entry.isNecessary ? 'light' : 'filled'} color={entry.isNecessary ? 'green' : 'orange'} size="xs">
                    {entry.isNecessary ? 'Необходимо' : 'Необязательно'}
                  </Badge>
                </Table.Td>
                <Table.Td style={{ padding: '8px' }}>
                  <Group gap="xs" justify="flex-end">
                    <ActionIcon onClick={() => handleEdit(entry)} variant="light" size="xs">
                      <Pencil size={14} />
                    </ActionIcon>
                    <ActionIcon
                      onClick={() => {
                        setEntryToDelete(entry.id)
                        setDeleteModalOpened(true)
                      }}
                      color="red"
                      variant="light"
                      size="xs"
                    >
                      <Trash2 size={14} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        </div>
      </Box>

      {/* Карточки для мобильных */}
      <SimpleGrid cols={1} spacing="xs" hiddenFrom="md">
        {filteredEntries.map((entry) => (
          <Paper key={entry.id} p="xs" withBorder radius="sm">
            <Stack gap="xs">
              <Group justify="space-between" align="flex-start">
                <Group gap="xs">
                  <Calendar size={14} color="var(--mantine-color-blue-6)" />
                  <Text size="xs">{new Date(entry.date).toLocaleDateString('ru-RU')}</Text>
                </Group>
                {(() => {
                  const info = getCategoryInfo(entry)
                  return (
                    <Badge style={{ backgroundColor: info.color, color: 'white' }} size="xs">
                      {info.label}
                    </Badge>
                  )
                })()}
              </Group>
              <Text size="sm" fw={500} lineClamp={2}>{entry.description}</Text>
              <Group justify="space-between" align="center" mt="xs">
                <Stack gap={0}>
                  <Text size="xs" c="dimmed">Сумма</Text>
                  <Text size="md" fw={700}>{entry.amount.toFixed(2)} у.е.</Text>
                </Stack>
                <Stack gap={0}>
                  <Text size="xs" c="dimmed">Тип</Text>
                  <Badge variant={entry.isNecessary ? 'light' : 'filled'} color={entry.isNecessary ? 'green' : 'orange'} size="xs">
                    {entry.isNecessary ? 'Необходимо' : 'Необязательно'}
                  </Badge>
                </Stack>
                <Group gap="xs">
                  <ActionIcon onClick={() => handleEdit(entry)} variant="light" size="xs">
                    <Pencil size={14} />
                  </ActionIcon>
                  <ActionIcon
                    onClick={() => {
                      setEntryToDelete(entry.id)
                      setDeleteModalOpened(true)
                    }}
                    color="red"
                    variant="light"
                    size="xs"
                  >
                    <Trash2 size={14} />
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
      <Group gap="xs" wrap="wrap" mb="md">
        <CategorySelector
          value={formData.categoryId || null}
          onChange={(v) => setFormData({ ...formData, categoryId: v })}
          placeholder="Категория"
        />
      </Group>
      <TextInput
        label="Описание"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.currentTarget.value })}
        mb="md"
        size="sm"
      />
      <Stack gap="xs">
        <Group gap="xs" wrap="wrap">
          <NumberInput
            label="Сумма (у.е.)"
            value={formData.amount}
            onChange={(v) => setFormData({ ...formData, amount: v as number })}
            style={{ flex: 1, minWidth: 120 }}
            size="sm"
            min={0}
          />
          <Switch
            label="Необязательно"
            checked={formData.isNecessary}
            onChange={(e) => setFormData({ ...formData, isNecessary: e.currentTarget.checked })}
            style={{ flex: 1, minWidth: 120 }}
            size="sm"
          />
        </Group>
        <Group justify="flex-end" mt="xs">
          <Button variant="subtle" onClick={onCancel} size="sm">
            Отмена
          </Button>
          <Button onClick={handleSave} size="sm">
            Сохранить
          </Button>
        </Group>
      </Stack>
    </Box>
  )
}
