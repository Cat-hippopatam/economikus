// src/pages/admin/AdminLessons.tsx
/**
 * Страница управления уроками
 * Рефакторинг: использует LessonModal, useLessonList, StatusBadge, ConfirmDialog
 */

import { useState } from 'react'
import {
  Box, Button, Card, Group, Text, Badge, Table, TextInput,
  Select, Pagination, ActionIcon, Menu, Skeleton, Alert, Stack
} from '@mantine/core'
import { Plus, Search, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { LessonModal } from '@/components/modals'
import { StatusBadge } from '@/components/common'
import { ConfirmDialog } from '@/components/common'
import { useLessonList } from '@/hooks'
import { LESSON_TYPE_LABELS } from '@/constants'
import type { LessonInput } from '@/types'

export function AdminLessons() {
  const {
    lessons,
    tags,
    loading,
    page,
    setPage,
    totalPages,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    modalOpened,
    editingLesson,
    saving,
    openCreate,
    openEdit,
    closeModal,
    handleSave,
    handleDelete,
  } = useLessonList()

  // Состояние для диалога подтверждения удаления
  const [deleteConfirm, setDeleteConfirm] = useState<{
    opened: boolean
    lessonId: string | null
    lessonTitle: string
  }>({ opened: false, lessonId: null, lessonTitle: '' })

  const confirmDelete = (lesson: { id: string; title: string }) => {
    setDeleteConfirm({ opened: true, lessonId: lesson.id, lessonTitle: lesson.title })
  }

  const executeDelete = async () => {
    if (deleteConfirm.lessonId) {
      await handleDelete(deleteConfirm.lessonId)
      setDeleteConfirm({ opened: false, lessonId: null, lessonTitle: '' })
    }
  }

  const onSave = async (data: LessonInput) => {
    await handleSave(data)
  }

  return (
    <Box>
      <Group justify="space-between" mb="lg">
        <Text size="xl" fw={700}>Уроки</Text>
        <Button leftSection={<Plus size={16} />} onClick={openCreate}>
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
              { value: 'QUIZ', label: 'Тест' },
              { value: 'CALCULATOR', label: 'Калькулятор' },
            ]}
            value={typeFilter}
            onChange={(v) => setTypeFilter(v || null)}
            clearable
            w={150}
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
                    <Badge variant="light">
                      {LESSON_TYPE_LABELS[lesson.lessonType as keyof typeof LESSON_TYPE_LABELS] || lesson.lessonType}
                    </Badge>
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
                    <StatusBadge
                      status={lesson.status}
                      type="content"
                    />
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
                        <Menu.Item leftSection={<Pencil size={14} />} onClick={() => openEdit(lesson)}>
                          Редактировать
                        </Menu.Item>
                        <Menu.Item color="red" leftSection={<Trash2 size={14} />} onClick={() => confirmDelete({ id: lesson.id, title: lesson.title })}>
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
      <LessonModal
        opened={modalOpened}
        onClose={closeModal}
        lesson={editingLesson}
        tags={tags}
        onSave={onSave}
        loading={saving}
      />

      {/* Диалог подтверждения удаления */}
      <ConfirmDialog
        opened={deleteConfirm.opened}
        onClose={() => setDeleteConfirm({ opened: false, lessonId: null, lessonTitle: '' })}
        onConfirm={executeDelete}
        title="Удалить урок?"
        message={`Урок "${deleteConfirm.lessonTitle}" будет удалён. Это действие нельзя отменить.`}
        confirmLabel="Удалить"
        color="red"
      />
    </Box>
  )
}
