// src/pages/author/AuthorCoursesPage.tsx
/**
 * Страница списка курсов автора
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
  SimpleGrid,
  TextInput,
  Select,
  Pagination,
  ActionIcon,
  Menu,
  Badge,
  Stack,
} from '@mantine/core'
import { Plus, Search, MoreVertical, Pencil, Trash2, Eye, Layers } from 'lucide-react'
import { useAuthorCourses, type AuthorCourse } from '@/hooks/useAuthorCourses'
import { StatusBadge, LoadingState, EmptyState, ConfirmDialog, MediaImage } from '@/components/common'
import { AUTHOR_COURSE_STATUSES, AUTHOR_EMPTY_STATES } from '@/constants/author'
import { DIFFICULTY_LABELS } from '@/constants/difficulty'

// Карточка курса автора
function CourseCard({ 
  course, 
  onEdit, 
  onModules,
  onDelete 
}: { 
  course: AuthorCourse
  onEdit: () => void
  onModules: () => void
  onDelete: () => void 
}) {
  return (
    <Card withBorder shadow="sm" radius="md" padding={0}>
      {/* Обложка */}
      <Card.Section>
        <MediaImage
          src={course.coverImage}
          mediaType="course"
          alt={course.title}
          style={{
            width: '100%',
            height: 140,
            objectFit: 'cover',
          }}
        />
      </Card.Section>

      <Stack gap="xs" p="md">
        {/* Заголовок и статус */}
        <Group justify="space-between" wrap="nowrap">
          <Text fw={600} lineClamp={1} style={{ flex: 1 }}>
            {course.title}
          </Text>
          <StatusBadge status={course.status} type="content" size="sm" />
        </Group>

        {/* Описание */}
        {course.description && (
          <Text size="sm" c="dimmed" lineClamp={2}>
            {course.description}
          </Text>
        )}

        {/* Мета-информация */}
        <Group gap="xs">
          <Badge size="sm" variant="light">
            {course.lessonsCount} уроков
          </Badge>
          {course.difficultyLevel && (
            <Badge size="sm" variant="light" color="gray">
              {DIFFICULTY_LABELS[course.difficultyLevel as keyof typeof DIFFICULTY_LABELS] || course.difficultyLevel}
            </Badge>
          )}
          {course.isPremium && (
            <Badge size="sm" variant="light" color="yellow">
              Премиум
            </Badge>
          )}
        </Group>

        {/* Статистика и действия */}
        <Group justify="space-between" mt="xs">
          <Group gap="xs">
            <Eye size={14} />
            <Text size="sm" c="dimmed">
              {course.viewsCount.toLocaleString()}
            </Text>
          </Group>

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
              <Menu.Item leftSection={<Layers size={14} />} onClick={onModules}>
                Модули
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
        </Group>
      </Stack>
    </Card>
  )
}

export function AuthorCoursesPage() {
  const navigate = useNavigate()
  const {
    courses,
    loading,
    page,
    setPage,
    totalPages,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    deleteCourse,
  } = useAuthorCourses()

  // Диалог удаления
  const [deleteConfirm, setDeleteConfirm] = useState<{
    opened: boolean
    course: AuthorCourse | null
  }>({ opened: false, course: null })

  const handleDelete = async () => {
    if (deleteConfirm.course) {
      await deleteCourse(deleteConfirm.course.id)
      setDeleteConfirm({ opened: false, course: null })
    }
  }

  return (
    <Stack gap="lg">
      {/* Заголовок */}
      <Group justify="space-between">
        <div>
          <Title order={2}>Мои курсы</Title>
          <Text c="dimmed" size="sm">
            Управляйте вашими курсами
          </Text>
        </div>
        <Button
          component={Link}
          to="/author/courses/new"
          leftSection={<Plus size={16} />}
        >
          Создать курс
        </Button>
      </Group>

      {/* Фильтры */}
      <Card withBorder p="md">
        <Group>
          <TextInput
            placeholder="Поиск курсов..."
            leftSection={<Search size={16} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Статус"
            data={AUTHOR_COURSE_STATUSES}
            value={statusFilter}
            onChange={(v) => setStatusFilter(v || '')}
            w={180}
            clearable
          />
        </Group>
      </Card>

      {/* Контент */}
      {loading ? (
        <LoadingState text="Загрузка курсов..." />
      ) : courses.length === 0 ? (
        <EmptyState
          message={AUTHOR_EMPTY_STATES.courses.title}
          description={AUTHOR_EMPTY_STATES.courses.description}
          action={{
            label: AUTHOR_EMPTY_STATES.courses.action,
            onClick: () => navigate('/author/courses/new')
          }}
        />
      ) : (
        <>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEdit={() => navigate(`/author/courses/${course.id}`)}
                onModules={() => navigate(`/author/courses/${course.id}/modules`)}
                onDelete={() => setDeleteConfirm({ opened: true, course })}
              />
            ))}
          </SimpleGrid>

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

      {/* Диалог удаления */}
      <ConfirmDialog
        opened={deleteConfirm.opened}
        onClose={() => setDeleteConfirm({ opened: false, course: null })}
        onConfirm={handleDelete}
        title="Удалить курс?"
        message={`Курс "${deleteConfirm.course?.title}" будет удалён без возможности восстановления.`}
        confirmLabel="Удалить"
        color="red"
      />
    </Stack>
  )
}
