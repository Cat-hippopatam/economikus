// src/pages/admin/AdminCourses.tsx
/**
 * Страница управления курсами
 * Рефакторинг: использует CourseModal, useCourseList, StatusBadge, ConfirmDialog
 */

import { useState } from 'react'
import {
  Box, Button, Card, Group, Text, Badge, Table, TextInput,
  Select, Pagination, ActionIcon, Menu, Skeleton, Alert, Stack
} from '@mantine/core'
import { Plus, Search, MoreVertical, Pencil, Trash2, Eye } from 'lucide-react'
import { CourseModal } from '@/components/modals'
import { StatusBadge } from '@/components/common'
import { ConfirmDialog } from '@/components/common'
import { useCourseList } from '@/hooks'
import { DIFFICULTY_LABELS } from '@/constants'
import type { CourseInput } from '@/types'

export function AdminCourses() {
  const {
    courses,
    tags,
    loading,
    page,
    setPage,
    totalPages,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    modalOpened,
    editingCourse,
    saving,
    openCreate,
    openEdit,
    closeModal,
    handleSave,
    handleDelete,
  } = useCourseList()

  // Состояние для диалога подтверждения удаления
  const [deleteConfirm, setDeleteConfirm] = useState<{
    opened: boolean
    courseId: string | null
    courseTitle: string
  }>({ opened: false, courseId: null, courseTitle: '' })

  const confirmDelete = (course: { id: string; title: string }) => {
    setDeleteConfirm({ opened: true, courseId: course.id, courseTitle: course.title })
  }

  const executeDelete = async () => {
    if (deleteConfirm.courseId) {
      await handleDelete(deleteConfirm.courseId)
      setDeleteConfirm({ opened: false, courseId: null, courseTitle: '' })
    }
  }

  const onSave = async (data: CourseInput) => {
    await handleSave(data)
  }

  return (
    <Box>
      <Group justify="space-between" mb="lg">
        <Text size="xl" fw={700}>Курсы</Text>
        <Button leftSection={<Plus size={16} />} onClick={openCreate}>
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
              { value: 'ARCHIVED', label: 'Архив' },
            ]}
            value={statusFilter}
            onChange={(v) => setStatusFilter(v || null)}
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
                    <StatusBadge
                      status={course.status}
                      type="content"
                    />
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="light">
                      {DIFFICULTY_LABELS[course.difficultyLevel] || course.difficultyLevel}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{course._count?.modules || course.modulesCount || 0}</Table.Td>
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
                        <Menu.Item leftSection={<Pencil size={14} />} onClick={() => openEdit(course)}>
                          Редактировать
                        </Menu.Item>
                        <Menu.Item color="red" leftSection={<Trash2 size={14} />} onClick={() => confirmDelete({ id: course.id, title: course.title })}>
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

      {/* Модальное окно создания/редактирования */}
      <CourseModal
        opened={modalOpened}
        onClose={closeModal}
        course={editingCourse}
        tags={tags}
        onSave={onSave}
        loading={saving}
      />

      {/* Диалог подтверждения удаления */}
      <ConfirmDialog
        opened={deleteConfirm.opened}
        onClose={() => setDeleteConfirm({ opened: false, courseId: null, courseTitle: '' })}
        onConfirm={executeDelete}
        title="Удалить курс?"
        message={`Курс "${deleteConfirm.courseTitle}" будет удалён. Это действие нельзя отменить.`}
        confirmLabel="Удалить"
        color="red"
      />
    </Box>
  )
}
