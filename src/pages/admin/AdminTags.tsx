import { useEffect, useState } from 'react'
import {
  Box, Button, Card, Group, Text, Badge, Table, TextInput,
  ActionIcon, Modal, Stack, ColorInput
} from '@mantine/core'
import { IconPlus, IconEdit, IconTrash } from '@mantine/icons'
import { useDisclosure } from '@mantine/hooks'
import { api } from '@/lib/api'

interface Tag {
  id: string
  name: string
  slug: string
  color: string
  _count?: { courses: number; lessons: number }
}

export function AdminTags() {
  const [tags, setTags] = useState<Tag[]>([])
  const [opened, { open, close }] = useDisclosure(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [saving, setSaving] = useState(false)

  // Form state
  const [formName, setFormName] = useState('')
  const [formSlug, setFormSlug] = useState('')
  const [formColor, setFormColor] = useState('#3B82F6')

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      const res = await api.get('/admin/tags')
      setTags(res.data.items)
    } catch (error) {
      console.error(error)
    }
  }

  const openCreateModal = () => {
    setEditingTag(null)
    setFormName('')
    setFormSlug('')
    setFormColor('#3B82F6')
    open()
  }

  const openEditModal = (tag: Tag) => {
    setEditingTag(tag)
    setFormName(tag.name)
    setFormSlug(tag.slug)
    setFormColor(tag.color)
    open()
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const data = {
        name: formName,
        slug: formSlug,
        color: formColor
      }

      if (editingTag) {
        await api.patch(`/admin/tags/${editingTag.id}`, data)
      } else {
        await api.post('/admin/tags', data)
      }

      close()
      fetchTags()
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } }
      alert(err.response?.data?.error || 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить тег?')) return
    try {
      await api.delete(`/admin/tags/${id}`)
      fetchTags()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Box>
      <Group justify="space-between" mb="lg">
        <Text size="xl" fw={700}>Теги</Text>
        <Button leftSection={<IconPlus size={16} />} onClick={openCreateModal}>
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
            {tags.map((tag) => (
              <Table.Tr key={tag.id}>
                <Table.Td>
                  <Group gap="xs">
                    <div style={{ width: 16, height: 16, borderRadius: 4, backgroundColor: tag.color }} />
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
                    <ActionIcon variant="subtle" onClick={() => openEditModal(tag)}>
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(tag.id)}>
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      <Modal
        opened={opened}
        onClose={close}
        title={editingTag ? 'Редактировать тег' : 'Создать тег'}
      >
        <Stack gap="md">
          <TextInput
            label="Название"
            required
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
          <TextInput
            label="Slug"
            required
            value={formSlug}
            onChange={(e) => setFormSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
          />
          <ColorInput
            label="Цвет"
            value={formColor}
            onChange={setFormColor}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={close}>Отмена</Button>
            <Button onClick={handleSave} loading={saving}>
              {editingTag ? 'Сохранить' : 'Создать'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  )
}
