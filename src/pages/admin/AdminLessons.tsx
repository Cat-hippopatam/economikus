import { useEffect, useState } from 'react'
import {
  Box, Button, Card, Group, Text, Badge, Table, TextInput,
  Select, Pagination, Modal, Textarea, NumberInput, Checkbox,
  MultiSelect, ActionIcon, Menu, Skeleton, Alert, Stack
} from '@mantine/core'
import { Plus, Search, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { useDisclosure } from '@mantine/hooks'
import { api } from '@/lib/api'

interface Lesson {
  id: string
  title: string
  slug: string
  lessonType: string
  status: string
  isPremium: boolean
  duration: number
  module: { id: string; title: string; course: { id: string; title: string } } | null
  tags: { id: string; name: string; color: string }[]
}

interface Tag {
  id: string
  name: string
  slug: string
  color: string
}

const typeLabels: Record<string, string> = {
  ARTICLE: 'Статья',
  VIDEO: 'Видео',
  AUDIO: 'Аудио',
  QUIZ: 'Тест',
  CALCULATOR: 'Калькулятор'
}

const statusColors: Record<string, string> = {
  DRAFT: 'gray',
  PUBLISHED: 'green',
  ARCHIVED: 'red'
}

const statusLabels: Record<string, string> = {
  DRAFT: 'Черновик',
  PUBLISHED: 'Опубликован',
  ARCHIVED: 'Архив'
}

export function AdminLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [opened, { open, close }] = useDisclosure(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [saving, setSaving] = useState(false)

  // Form state
  const [formTitle, setFormTitle] = useState('')
  const [formSlug, setFormSlug] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formLessonType, setFormLessonType] = useState<string>('ARTICLE')
  const [formDuration, setFormDuration] = useState<number | undefined>(0)
  const [formIsPremium, setFormIsPremium] = useState(false)
  const [formStatus, setFormStatus] = useState<string>('DRAFT')
  const [formTagIds, setFormTagIds] = useState<string[]>([])

  useEffect(() => {
    fetchLessons()
    fetchTags()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, statusFilter, typeFilter])

  const fetchLessons = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', '10')
      if (search) params.append('search', search)
      if (statusFilter) params.append('status', statusFilter)
      if (typeFilter) params.append('lessonType', typeFilter)

      const res = await api.get(`/admin/lessons?${params}`)
      setLessons(res.data.items)
      setTotalPages(res.data.pagination.totalPages)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTags = async () => {
    try {
      const res = await api.get('/tags')
      setTags(res.data.items)
    } catch (error) {
      console.error(error)
    }
  }

  const openCreateModal = () => {
    setEditingLesson(null)
    setFormTitle('')
    setFormSlug('')
    setFormDescription('')
    setFormLessonType('ARTICLE')
    setFormDuration(0)
    setFormIsPremium(false)
    setFormStatus('DRAFT')
    setFormTagIds([])
    open()
  }

  const openEditModal = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setFormTitle(lesson.title)
    setFormSlug(lesson.slug)
    setFormDescription(lesson.description || '')
    setFormLessonType(lesson.lessonType)
    setFormDuration(lesson.duration)
    setFormIsPremium(lesson.isPremium)
    setFormStatus(lesson.status)
    setFormTagIds(lesson.tags.map(t => t.id))
    open()
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const data = {
        title: formTitle,
        slug: formSlug,
        description: formDescription,
        lessonType: formLessonType,
        duration: formDuration,
        isPremium: formIsPremium,
        status: formStatus,
        tagIds: formTagIds
      }

      if (editingLesson) {
        await api.patch(`/admin/lessons/${editingLesson.id}`, data)
      } else {
        await api.post('/admin/lessons', data)
      }

      close()
      fetchLessons()
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } }
      alert(err.response?.data?.error || 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить урок?')) return
    try {
      await api.delete(`/admin/lessons/${id}`)
      fetchLessons()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Box>
      <Group justify="space-between" mb="lg">
        <Text size="xl" fw={700}>Уроки</Text>
        <Button leftSection={<Plus size={16} />} onClick={openCreateModal}>
          Создать урок
        </Button>
      </Group>

      <Card shadow="xs" padding="md" radius="md" withBorder mb="lg">
        <Group>
          <TextInput
            placeholder="Поиск по названию..."
            leftSection={<Search size={16} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Тип"
            data={[
              { value: '', label: 'Все типы' },
              { value: 'ARTICLE', label: 'Статья' },
              { value: 'VIDEO', label: 'Видео' },
              { value: 'AUDIO', label: 'Аудио' },
              { value: 'QUIZ', label: 'Тест' }
            ]}
            value={typeFilter}
            onChange={setTypeFilter}
            clearable
            w={150}
          />
          <Select
            placeholder="Статус"
            data={[
              { value: '', label: 'Все' },
              { value: 'DRAFT', label: 'Черновики' },
              { value: 'PUBLISHED', label: 'Опубликованные' }
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            clearable
            w={180}
          />
        </Group>
      </Card>

      {loading ? (
        <Stack gap="sm">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} height={60} radius="md" />
          ))}
        </Stack>
      ) : lessons.length === 0 ? (
        <Alert color="gray">Уроки не найдены</Alert>
      ) : (
        <Card shadow="xs" padding={0} radius="md" withBorder>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Название</Table.Th>
                <Table.Th>Тип</Table.Th>
                <Table.Th>Курс / Модуль</Table.Th>
                <Table.Th>Статус</Table.Th>
                <Table.Th>Длительность</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {lessons.map((lesson) => (
                <Table.Tr key={lesson.id}>
                  <Table.Td>
                    <Text fw={500}>{lesson.title}</Text>
                    <Text size="xs" c="dimmed">{lesson.slug}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="light">{typeLabels[lesson.lessonType]}</Badge>
                  </Table.Td>
                  <Table.Td>
                    {lesson.module ? (
                      <Text size="sm">
                        {lesson.module.course.title} / {lesson.module.title}
                      </Text>
                    ) : (
                      <Text c="dimmed" size="sm">—</Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Badge color={statusColors[lesson.status]}>
                      {statusLabels[lesson.status]}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{lesson.duration} мин</Table.Td>
                  <Table.Td>
                    <Menu>
                      <Menu.Target>
                        <ActionIcon variant="subtle">
                          <MoreVertical size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item leftSection={<Pencil size={14} />} onClick={() => openEditModal(lesson)}>
                          Редактировать
                        </Menu.Item>
                        <Menu.Item color="red" leftSection={<Trash2 size={14} />} onClick={() => handleDelete(lesson.id)}>
                          Удалить
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      )}

      {totalPages > 1 && (
        <Group justify="center" mt="lg">
          <Pagination total={totalPages} value={page} onChange={setPage} />
        </Group>
      )}

      <Modal
        opened={opened}
        onClose={close}
        title={editingLesson ? 'Редактировать урок' : 'Создать урок'}
        size="lg"
      >
        <Stack gap="md">
          <TextInput
            label="Название"
            required
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />
          <TextInput
            label="Slug (URL)"
            required
            value={formSlug}
            onChange={(e) => setFormSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
          />
          <Textarea
            label="Описание"
            rows={2}
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
          />
          <Group grow>
            <Select
              label="Тип урока"
              data={[
                { value: 'ARTICLE', label: 'Статья' },
                { value: 'VIDEO', label: 'Видео' },
                { value: 'AUDIO', label: 'Аудио' },
                { value: 'QUIZ', label: 'Тест' }
              ]}
              value={formLessonType}
              onChange={(v) => setFormLessonType(v || 'ARTICLE')}
            />
            <NumberInput
              label="Длительность (мин)"
              value={formDuration}
              onChange={(v) => setFormDuration(Number(v))}
              min={0}
            />
          </Group>
          <Group grow>
            <Select
              label="Статус"
              data={[
                { value: 'DRAFT', label: 'Черновик' },
                { value: 'PUBLISHED', label: 'Опубликован' }
              ]}
              value={formStatus}
              onChange={(v) => setFormStatus(v || 'DRAFT')}
            />
            <Checkbox
              label="Премиум урок"
              checked={formIsPremium}
              onChange={(e) => setFormIsPremium(e.currentTarget.checked)}
              mt="xl"
            />
          </Group>
          <MultiSelect
            label="Теги"
            data={tags.map(t => ({ value: t.id, label: t.name }))}
            value={formTagIds}
            onChange={setFormTagIds}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={close}>Отмена</Button>
            <Button onClick={handleSave} loading={saving}>
              {editingLesson ? 'Сохранить' : 'Создать'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  )
}
