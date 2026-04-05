// src/pages/author/AuthorCourseModulesPage.tsx
/**
 * Страница управления модулями курса
 */

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Stack,
  Title,
  Text,
  Button,
  Card,
  Group,
  TextInput,
  Textarea,
  Modal,
  ActionIcon,
  Badge,
  Select,
} from '@mantine/core'
import { Plus, GripVertical, Pencil, Trash2, ArrowLeft, BookOpen } from 'lucide-react'
import { useCourseModules, type CourseModule } from '@/hooks/useCourseModules'
import { LoadingState, EmptyState, ConfirmDialog } from '@/components/common'
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'

// Карточка модуля
function ModuleCard({ 
  module, 
  index,
  onEdit, 
  onDelete 
}: { 
  module: CourseModule
  index: number
  onEdit: () => void
  onDelete: () => void 
}) {
  return (
    <Draggable draggableId={module.id} index={index}>
      {(provided, snapshot) => (
        <Card
          withBorder
          padding="md"
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.8 : 1,
          }}
        >
          <Group justify="space-between" align="flex-start">
            <Group gap="sm" style={{ flex: 1 }}>
              <div {...provided.dragHandleProps}>
                <GripVertical size={20} style={{ cursor: 'grab', color: 'var(--mantine-color-gray-5)' }} />
              </div>
              <div>
                <Text fw={500}>#{index + 1}</Text>
                <Text size="lg" fw={600} mt={4}>
                  {module.title}
                </Text>
                {module.description && (
                  <Text size="sm" c="dimmed" mt={4} lineClamp={2}>
                    {module.description}
                  </Text>
                )}
              </div>
            </Group>
            <Group gap="xs">
              <Badge size="sm" variant="light">
                {module.lessonsCount} уроков
              </Badge>
              <ActionIcon variant="subtle" onClick={onEdit}>
                <Pencil size={16} />
              </ActionIcon>
              <ActionIcon 
                variant="subtle" 
                color="red" 
                onClick={onDelete}
                disabled={module.lessonsCount > 0}
              >
                <Trash2 size={16} />
              </ActionIcon>
            </Group>
          </Group>
        </Card>
      )}
    </Draggable>
  )
}

export function AuthorCourseModulesPage() {
  const navigate = useNavigate()
  const { id: courseId } = useParams<{ id: string }>()
  
  const {
    courses,
    loading,
    saving,
    createModule,
    updateModule,
    deleteModule,
    reorderModules,
  } = useCourseModules(courseId)

  // Модальное окно создания/редактирования
  const [modalOpened, setModalOpened] = useState(false)
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null)
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courseId || '')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  // Диалог удаления
  const [deleteConfirm, setDeleteConfirm] = useState<{
    opened: boolean
    module: CourseModule | null
    courseId: string | null
  }>({ opened: false, module: null, courseId: null })

  // Выбранный курс для просмотра модулей
  const [selectedCourseForView, setSelectedCourseForView] = useState<string>(courseId || '')

  const openCreateModal = (forCourseId?: string) => {
    setEditingModule(null)
    setSelectedCourseId(forCourseId || courseId || courses[0]?.id || '')
    setTitle('')
    setDescription('')
    setModalOpened(true)
  }

  const openEditModal = (module: CourseModule, forCourseId: string) => {
    setEditingModule(module)
    setSelectedCourseId(forCourseId)
    setTitle(module.title)
    setDescription(module.description || '')
    setModalOpened(true)
  }

  const handleSave = async () => {
    if (!title.trim() || !selectedCourseId) return

    let success = false
    if (editingModule) {
      success = await updateModule(editingModule.id, { title, description })
    } else {
      success = await createModule(selectedCourseId, { title, description })
    }

    if (success) {
      setModalOpened(false)
      setTitle('')
      setDescription('')
    }
  }

  const handleDelete = async () => {
    if (deleteConfirm.module) {
      await deleteModule(deleteConfirm.module.id)
      setDeleteConfirm({ opened: false, module: null, courseId: null })
    }
  }

  const handleDragEnd = (result: DropResult, courseId: string) => {
    if (!result.destination) return

    const course = courses.find(c => c.id === courseId)
    if (!course) return

    const newOrder = [...course.modules]
    const [removed] = newOrder.splice(result.source.index, 1)
    newOrder.splice(result.destination.index, 0, removed)

    const moduleIds = newOrder.map(m => m.id)
    reorderModules(courseId, moduleIds)
  }

  // Выбранный курс для просмотра
  const currentCourse = courses.find(c => c.id === (selectedCourseForView || courseId))

  if (loading) {
    return <LoadingState text="Загрузка модулей..." />
  }

  return (
    <Stack gap="lg">
      {/* Заголовок */}
      <Group justify="space-between">
        <Group>
          <Button
            variant="subtle"
            leftSection={<ArrowLeft size={16} />}
            onClick={() => navigate('/author/courses')}
          >
            Назад к курсам
          </Button>
          <Title order={2}>Модули курсов</Title>
        </Group>
        <Button
          leftSection={<Plus size={16} />}
          onClick={() => openCreateModal()}
          disabled={courses.length === 0}
        >
          Добавить модуль
        </Button>
      </Group>

      {/* Выбор курса */}
      {courses.length > 0 && (
        <Select
          placeholder="Выберите курс"
          data={courses.map(c => ({ value: c.id, label: c.title }))}
          value={selectedCourseForView || courseId || courses[0]?.id}
          onChange={(v) => setSelectedCourseForView(v || '')}
        />
      )}

      {/* Подсказка */}
      <Card withBorder padding="sm" bg="blue.0">
        <Group gap="sm">
          <BookOpen size={20} style={{ color: 'var(--mantine-color-blue-6)' }} />
          <Text size="sm" c="blue.7">
            Перетаскивайте модули для изменения порядка. Создавайте модули для каждого курса, затем добавляйте уроки к модулям.
          </Text>
        </Group>
      </Card>

      {/* Список модулей */}
      {!currentCourse || currentCourse.modules.length === 0 ? (
        <EmptyState
          message="Нет модулей"
          description={courses.length === 0 ? "Сначала создайте курс" : "Создайте первый модуль для структурирования курса"}
          action={courses.length > 0 ? {
            label: 'Создать модуль',
            onClick: () => openCreateModal()
          } : undefined}
        />
      ) : (
        <DragDropContext onDragEnd={(result) => handleDragEnd(result, currentCourse.id)}>
          <Droppable droppableId={`modules-${currentCourse.id}`}>
            {(provided) => (
              <Stack gap="md" ref={provided.innerRef} {...provided.droppableProps}>
                <Title order={4}>{currentCourse.title}</Title>
                {currentCourse.modules.map((module, index) => (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    index={index}
                    onEdit={() => openEditModal(module, currentCourse.id)}
                    onDelete={() => setDeleteConfirm({ opened: true, module, courseId: currentCourse.id })}
                  />
                ))}
                {provided.placeholder}
              </Stack>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Модальное окно создания/редактирования */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={editingModule ? 'Редактировать модуль' : 'Новый модуль'}
      >
        <Stack gap="md">
          {!editingModule && (
            <Select
              label="Курс"
              placeholder="Выберите курс"
              data={courses.map(c => ({ value: c.id, label: c.title }))}
              value={selectedCourseId}
              onChange={(v) => setSelectedCourseId(v || '')}
              required
            />
          )}
          <TextInput
            label="Название модуля"
            placeholder="Например: Введение в инвестирование"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            label="Описание"
            placeholder="О чём этот модуль"
            minRows={3}
            maxRows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={() => setModalOpened(false)}>
              Отмена
            </Button>
            <Button onClick={handleSave} loading={saving} disabled={!title.trim() || !selectedCourseId}>
              {editingModule ? 'Сохранить' : 'Создать'}
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Диалог удаления */}
      <ConfirmDialog
        opened={deleteConfirm.opened}
        onClose={() => setDeleteConfirm({ opened: false, module: null, courseId: null })}
        onConfirm={handleDelete}
        title="Удалить модуль?"
        message={`Модуль "${deleteConfirm.module?.title}" будет удалён. Это действие нельзя отменить.`}
        confirmLabel="Удалить"
        color="red"
      />
    </Stack>
  )
}
