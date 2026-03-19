// src/pages/author/AuthorLessonsPage.tsx
/**
 * Страница списка уроков автора
 * Использует переиспользуемые компоненты: StatusBadge, LoadingState, EmptyState, ConfirmDialog
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Group,
  Title,
  Text,
  Button,
  Card,
  Table,
  TextInput,
  Select,
  Pagination,
  ActionIcon,
  Menu,
  Badge,
  Stack,
  ThemeIcon,
} from '@mantine/core'
import { Plus, Search, MoreVertical, Pencil, Trash2, Eye, Clock, FileText, Video, Headphones, HelpCircle, Calculator } from 'lucide-react'
import { useAuthorLessons, type AuthorLesson } from '@/hooks/useAuthorLessons'
import { StatusBadge, LoadingState, EmptyState, ConfirmDialog } from '@/components/common'
import { 
  AUTHOR_LESSON_STATUSES, 
  AUTHOR_LESSON_TYPES,
  AUTHOR_EMPTY_STATES,
} from '@/constants/author'
import { LESSON_TYPE_LABELS } from '@/constants/lessonTypes'

// Иконки типов уроков
const LESSON_ICONS = {
  ARTICLE: FileText,
  VIDEO: Video,
  AUDIO: Headphones,
  QUIZ: HelpCircle,
  CALCULATOR: Calculator,
} as const

// Строка таблицы урока
function LessonRow({ 
  lesson, 
  onEdit, 
  onDelete 
}: { 
  lesson: AuthorLesson
  onEdit: () => void
  onDelete: () => void 
}) {
  const Icon = LESSON_ICONS[lesson.lessonType as keyof typeof LESSON_ICONS] || FileText
  
  return (
    <Table.Tr>
      <Table.Td>
        <Group gap="sm">
          <ThemeIcon variant="light" color="blue" radius="md" size="lg">
            <Icon size={18} />
          </ThemeIcon>
          <div>
            <Text fw={500} lineClamp={1}>
              {lesson.title}
            </Text>
            {lesson.module && (
              <Text size="xs" c="dimmed">
                {lesson.module.course.title} → {lesson.module.title}
              </Text>
            )}
          </div>
        </Group>
      </Table.Td>
      
      <Table.Td>
        <Badge variant="light" color="gray">
          {LESSON_TYPE_LABELS[lesson.lessonType as keyof typeof LESSON_TYPE_LABELS] || lesson.lessonType}
        </Badge>
      </Table.Td>
      
      <Table.Td>
        <StatusBadge status={lesson.status} type="content" size="sm" />
      </Table.Td>
      
      <Table.Td>
        <Group gap="xs">
          <Eye size={14} />
          <Text size="sm">{lesson.viewsCount.toLocaleString()}</Text>
        </Group>
      </Table.Td>
      
      <Table.Td>
        {lesson.duration && (
          <Group gap="xs">
            <Clock size={14} />
            <Text size="sm">{lesson.duration} мин</Text>
          </Group>
        )}
      </Table.Td>
      
      <Table.Td>
        <Group gap="xs">
          {lesson.isPremium && (
            <Badge size="sm" variant="light" color="yellow">
              Премиум
            </Badge>
          )}
          {lesson.tags.slice(0, 2).map((tag) => (
            <Badge key={tag.id} size="sm" variant="light">
              {tag.name}
            </Badge>
          ))}
        </Group>
      </Table.Td>
      
      <Table.Td>
        <Menu>
          <Menu.Target>
            <ActionIcon variant="subtle">
              <MoreVertical size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<Pencil size={14} />} onClick={onEdit}>
              Редактировать
            </Menu.Item>
            <Menu.Item 
              color="red" 
              leftSection={<Trash2 size={14} />} 
              onClick={onDelete}
            >
              Удалить
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  )
}

export function AuthorLessonsPage() {
  const navigate = useNavigate()
  const {
    lessons,
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
    deleteLesson,
  } = useAuthorLessons()

  // Диалог удаления
  const [deleteConfirm, setDeleteConfirm] = useState<{
    opened: boolean
    lesson: AuthorLesson | null
  }>({ opened: false, lesson: null })

  const handleDelete = async () => {
    if (deleteConfirm.lesson) {
      await deleteLesson(deleteConfirm.lesson.id)
      setDeleteConfirm({ opened: false, lesson: null })
    }
  }

  return (
    <Stack gap="lg">
      {/* Заголовок */}
      <Group justify="space-between">
        <div>
          <Title order={2}>Мои уроки</Title>
          <Text c="dimmed" size="sm">
            Управляйте вашими уроками
          </Text>
        </div>
        <Button
          component={Link}
          to="/author/lessons/new"
          leftSection={<Plus size={16} />}
        >
          Создать урок
        </Button>
      </Group>

      {/* Фильтры */}
      <Card withBorder p="md">
        <Group>
          <TextInput
            placeholder="Поиск уроков..."
            leftSection={<Search size={16} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Тип"
            data={AUTHOR_LESSON_TYPES}
            value={typeFilter}
            onChange={(v) => setTypeFilter(v || '')}
            w={150}
            clearable
          />
          <Select
            placeholder="Статус"
            data={AUTHOR_LESSON_STATUSES}
            value={statusFilter}
            onChange={(v) => setStatusFilter(v || '')}
            w={180}
            clearable
          />
        </Group>
      </Card>

      {/* Контент */}
      {loading ? (
        <LoadingState text="Загрузка уроков..." />
      ) : lessons.length === 0 ? (
        <EmptyState
          message={AUTHOR_EMPTY_STATES.lessons.title}
          description={AUTHOR_EMPTY_STATES.lessons.description}
          action={{
            label: AUTHOR_EMPTY_STATES.lessons.action,
            onClick: () => navigate('/author/lessons/new')
          }}
        />
      ) : (
        <>
          <Card withBorder padding={0}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Урок</Table.Th>
                  <Table.Th>Тип</Table.Th>
                  <Table.Th>Статус</Table.Th>
                  <Table.Th>Просмотры</Table.Th>
                  <Table.Th>Длительность</Table.Th>
                  <Table.Th>Теги</Table.Th>
                  <Table.Th></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {lessons.map((lesson) => (
                  <LessonRow
                    key={lesson.id}
                    lesson={lesson}
                    onEdit={() => navigate(`/author/lessons/${lesson.id}`)}
                    onDelete={() => setDeleteConfirm({ opened: true, lesson })}
                  />
                ))}
              </Table.Tbody>
            </Table>
          </Card>

          {totalPages > 1 && (
            <Group justify="center">
              <Pagination
                total={totalPages}
                value={page}
                onChange={setPage}
              />
            </Group>
          )}
        </>
      )}

      {/* Диалог подтверждения */}
      <ConfirmDialog
        opened={deleteConfirm.opened}
        onClose={() => setDeleteConfirm({ opened: false, lesson: null })}
        onConfirm={handleDelete}
        title="Удалить урок?"
        message={`Урок "${deleteConfirm.lesson?.title}" будет удалён без возможности восстановления.`}
        confirmLabel="Удалить"
        color="red"
      />
    </Stack>
  )
}
