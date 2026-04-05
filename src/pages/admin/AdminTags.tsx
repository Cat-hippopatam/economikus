// src/pages/admin/AdminTags.tsx
/**
 * Страница управления тегами
 * Рефакторинг: использует TagModal, useTagList, ColorIndicator, ConfirmDialog
 */

import { useState } from 'react'
import { Box, Button, Group, Text, Badge, Table, ActionIcon, Card } from '@mantine/core'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { TagModal } from '@/components/modals'
import { ColorIndicator } from '@/components/common'
import { ConfirmDialog } from '@/components/common'
import { useTagList } from '@/hooks'
import type { TagInput } from '@/types'

export function AdminTags() {
  const {
    tags,
    loading,
    modalOpened,
    editingTag,
    saving,
    openCreate,
    openEdit,
    closeModal,
    handleSave,
    handleDelete,
  } = useTagList()

  // Состояние для диалога подтверждения удаления
  const [deleteConfirm, setDeleteConfirm] = useState<{
    opened: boolean
    tagId: string | null
    tagName: string
  }>({ opened: false, tagId: null, tagName: '' })

  const confirmDelete = (tag: { id: string; name: string }) => {
    setDeleteConfirm({ opened: true, tagId: tag.id, tagName: tag.name })
  }

  const executeDelete = async () => {
    if (deleteConfirm.tagId) {
      await handleDelete(deleteConfirm.tagId)
      setDeleteConfirm({ opened: false, tagId: null, tagName: '' })
    }
  }

  const onSave = async (data: TagInput) => {
    await handleSave(data)
  }

  return (
    <Box>
      <Group justify="space-between" mb="lg">
        <Text size="xl" fw={700}>Теги</Text>
        <Button leftSection={<Plus size={16} />} onClick={openCreate}>
          Создать тег
        </Button>
      </Group>

      <Card shadow="xs" padding={0} radius="md" withBorder>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Тег</Table.Th>
              <Table.Th>Slug</Table.Th>
              <Table.Th>Курсы</Table.Th>
              <Table.Th>Уроки</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {loading ? (
              <Table.Tr>
                <Table.Td colSpan={5} style={{ textAlign: 'center', padding: 40 }}>
                  <Text c="dimmed">Загрузка...</Text>
                </Table.Td>
              </Table.Tr>
            ) : tags.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={5} style={{ textAlign: 'center', padding: 40 }}>
                  <Text c="dimmed">Нет тегов</Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              tags.map((tag) => (
                <Table.Tr key={tag.id}>
                  <Table.Td>
                    <Group gap="xs">
                      <ColorIndicator color={tag.color} size={16} />
                      <Text fw={500}>{tag.name}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text c="dimmed">{tag.slug}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="light">{tag._count?.courses || 0}</Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="light">{tag._count?.lessons || 0}</Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon variant="subtle" onClick={() => openEdit(tag)}>
                        <Pencil size={16} />
                      </ActionIcon>
                      <ActionIcon 
                        variant="subtle" 
                        color="red" 
                        onClick={() => confirmDelete({ id: tag.id, name: tag.name })}
                      >
                        <Trash2 size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Card>

      {/* Модальное окно создания/редактирования */}
      <TagModal
        opened={modalOpened}
        onClose={closeModal}
        tag={editingTag}
        onSave={onSave}
        loading={saving}
      />

      {/* Диалог подтверждения удаления */}
      <ConfirmDialog
        opened={deleteConfirm.opened}
        onClose={() => setDeleteConfirm({ opened: false, tagId: null, tagName: '' })}
        onConfirm={executeDelete}
        title="Удалить тег?"
        message={`Тег "${deleteConfirm.tagName}" будет удалён. Это действие нельзя отменить.`}
        confirmLabel="Удалить"
        color="red"
      />
    </Box>
  )
}

