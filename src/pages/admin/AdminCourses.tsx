import { useEffect, useState } from 'react'
import {
  Box, Button, Card, Group, Text, Badge, Table, TextInput,
  Select, Pagination, Modal, Textarea, NumberInput, Checkbox,
  MultiSelect, ActionIcon, Menu, Skeleton, Alert, Stack
} from '@mantine/core'
import { Plus, Search, MoreVertical, Pencil, Trash2, Eye } from 'lucide-react'
import { useDisclosure } from '@mantine/hooks'
import { api } from '@/lib/api'

interface Course {
  id: string
  title: string
  slug: string
  status: string
  difficultyLevel: string
  isPremium: boolean
  viewsCount: number
  modulesCount: number
  author: { id: string; nickname: string; displayName: string }
  tags: { id: string; name: string; color: string }[]
  _count?: { modules: number; progress: number }
}

interface Tag {
  id: string
  name: string
  slug: string
  color: string
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

const difficultyLabels: Record<string, string> = {
  BEGINNER: 'Начинающий',
  INTERMEDIATE: 'Средний',
  ADVANCED: 'Продвинутый'
}

export function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [opened, { open, close }] = useDisclosure(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [saving, setSaving] = useState(false)

  // Form state
  const [formTitle, setFormTitle] = useState('')
  const [formSlug, setFormSlug] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formCoverImage, setFormCoverImage] = useState('')
  const [formDifficulty, setFormDifficulty] = useState<string>('BEGINNER')
  const [formDuration, setFormDuration] = useState<number | undefined>(0)
  const [formIsPremium, setFormIsPremium] = useState(false)
  const [formStatus, setFormStatus] = useState<string>('DRAFT')
  const [formTagIds, setFormTagIds] = useState<string[]>([])

  useEffect(() => {
    fetchCourses()
    fetchTags()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, statusFilter])

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', '10')
      if (search) params.append('search', search)
      if (statusFilter) params.append('status', statusFilter)

      const res = await api.get(`/admin/courses?${params}`)
      setCourses(res.data.items)
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
    setEditingCourse(null)
    setFormTitle('')
    setFormSlug('')
    setFormDescription('')
    setFormCoverImage('')
    setFormDifficulty('BEGINNER')
    setFormDuration(0)
    setFormIsPremium(false)
    setFormStatus('DRAFT')
    setFormTagIds([])
    open()
  }

  const openEditModal = (course: Course) => {
    setEditingCourse(course)
    setFormTitle(course.title)
    setFormSlug(course.slug)
    setFormDescription(course.description || '')
    setFormCoverImage(course.coverImage || '')
    setFormDifficulty(course.difficultyLevel)
    setFormDuration(course.duration)
    setFormIsPremium(course.isPremium)
    setFormStatus(course.status)
    setFormTagIds(course.tags.map(t => t.id))
    open()
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const data = {
        title: formTitle,
        slug: formSlug,
        description: formDescription,
        coverImage: formCoverImage,
        difficultyLevel: formDifficulty,
        duration: formDuration,
        isPremium: formIsPremium,
        status: formStatus,
        tagIds: formTagIds
      }

      if (editingCourse) {
        await api.patch(`/admin/courses/${editingCourse.id}`, data)
      } else {
        await api.post('/admin/courses', data)
      }

      close()
      fetchCourses()
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } }
      alert(err.response?.data?.error || 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить курс?')) return
    try {
      await api.delete(`/admin/courses/${id}`)
      fetchCourses()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Box>
      <Group justify="space-between" mb="lg">
        <Text size="xl" fw={700}>Курсы</Text>
        <Button leftSection={<Plus size={16} />} onClick={openCreateModal}>
          Создать курс
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
            placeholder="Статус"
            data={[
              { value: '', label: 'Все' },
              { value: 'DRAFT', label: 'Черновики' },
              { value: 'PUBLISHED', label: 'Опубликованные' },
              { value: 'ARCHIVED', label: 'Архив' }
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            clearable
            w={200}
          />
        </Group>
      </Card>

      {loading ? (
        <Stack gap="sm">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} height={60} radius="md" />
          ))}
        </Stack>
      ) : courses.length === 0 ? (
        <Alert color="gray">Курсы не найдены</Alert>
      ) : (
        <Card shadow="xs" padding={0} radius="md" withBorder>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Название</Table.Th>
                <Table.Th>Статус</Table.Th>
                <Table.Th>Уровень</Table.Th>
                <Table.Th>Модули</Table.Th>
                <Table.Th>Просмотры</Table.Th>
                <Table.Th>Премиум</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {courses.map((course) => (
                <Table.Tr key={course.id}>
                  <Table.Td>
                    <Text fw={500}>{course.title}</Text>
                    <Text size="xs" c="dimmed">{course.slug}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={statusColors[course.status]}>
                      {statusLabels[course.status]}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="light">
                      {difficultyLabels[course.difficultyLevel]}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{course._count?.modules || course.modulesCount}</Table.Td>
                  <Table.Td>{course.viewsCount}</Table.Td>
                  <Table.Td>
                    {course.isPremium && <Badge color="yellow">Премиум</Badge>}
                  </Table.Td>
                  <Table.Td>
                    <Menu>
                      <Menu.Target>
                        <ActionIcon variant="subtle">
                          <MoreVertical size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item leftSection={<Eye size={14} />}>
                          Просмотр
                        </Menu.Item>
                        <Menu.Item leftSection={<Pencil size={14} />} onClick={() => openEditModal(course)}>
                          Редактировать
                        </Menu.Item>
                        <Menu.Item color="red" leftSection={<Trash2 size={14} />} onClick={() => handleDelete(course.id)}>
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
        title={editingCourse ? 'Редактировать курс' : 'Создать курс'}
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
            rows={3}
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
          />
          <TextInput
            label="URL обложки"
            value={formCoverImage}
            onChange={(e) => setFormCoverImage(e.target.value)}
          />
          <Group grow>
            <Select
              label="Уровень сложности"
              data={[
                { value: 'BEGINNER', label: 'Начинающий' },
                { value: 'INTERMEDIATE', label: 'Средний' },
                { value: 'ADVANCED', label: 'Продвинутый' }
              ]}
              value={formDifficulty}
              onChange={(v) => setFormDifficulty(v || 'BEGINNER')}
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
                { value: 'PUBLISHED', label: 'Опубликован' },
                { value: 'ARCHIVED', label: 'Архив' }
              ]}
              value={formStatus}
              onChange={(v) => setFormStatus(v || 'DRAFT')}
            />
            <Checkbox
              label="Премиум курс"
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
              {editingCourse ? 'Сохранить' : 'Создать'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  )
}
