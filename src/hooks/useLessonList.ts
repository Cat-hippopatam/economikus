// src/hooks/useLessonList.ts
/**
 * Хук для управления списком уроков
 */

import { useState, useCallback, useEffect } from 'react'
import { LessonService, TagService } from '@/services'
import type { Lesson, Tag, LessonInput } from '@/types'
import { useNotification } from './useNotification'

interface UseLessonListReturn {
  lessons: Lesson[]
  tags: Tag[]
  loading: boolean
  page: number
  setPage: (page: number) => void
  totalPages: number
  search: string
  setSearch: (search: string) => void
  statusFilter: string | null
  setStatusFilter: (status: string | null) => void
  typeFilter: string | null
  setTypeFilter: (type: string | null) => void
  modalOpened: boolean
  editingLesson: Lesson | null
  saving: boolean
  openCreate: () => void
  openEdit: (lesson: Lesson) => void
  closeModal: () => void
  handleSave: (data: LessonInput) => Promise<void>
  handleDelete: (id: string) => Promise<void>
  refresh: () => Promise<void>
}

export function useLessonList(): UseLessonListReturn {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [modalOpened, setModalOpened] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [saving, setSaving] = useState(false)
  const { showError, showSuccess } = useNotification()

  // Загрузка уроков
  const fetchLessons = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = {
        page: page.toString(),
        limit: '10',
      }
      if (search) params.search = search
      if (statusFilter) params.status = statusFilter
      if (typeFilter) params.lessonType = typeFilter

      const result = await LessonService.getAdmin(params)
      setLessons(result.items)
      setTotalPages(result.pagination.totalPages)
    } catch (error) {
      console.error(error)
      showError('Ошибка загрузки уроков')
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter, typeFilter, showError])

  // Загрузка тегов
  const fetchTags = useCallback(async () => {
    try {
      const result = await TagService.getAll()
      setTags(result.items)
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    fetchLessons()
  }, [fetchLessons])

  useEffect(() => {
    fetchTags()
  }, [fetchTags])

  // Открыть модалку создания
  const openCreate = useCallback(() => {
    setEditingLesson(null)
    setModalOpened(true)
  }, [])

  // Открыть модалку редактирования
  const openEdit = useCallback((lesson: Lesson) => {
    setEditingLesson(lesson)
    setModalOpened(true)
  }, [])

  // Закрыть модалку
  const closeModal = useCallback(() => {
    setModalOpened(false)
    setEditingLesson(null)
  }, [])

  // Сохранить урок
  const handleSave = useCallback(async (data: LessonInput) => {
    setSaving(true)
    try {
      if (editingLesson) {
        await LessonService.update(editingLesson.id, data)
        showSuccess('Урок обновлён')
      } else {
        await LessonService.create(data)
        showSuccess('Урок создан')
      }
      closeModal()
      fetchLessons()
    } catch (error) {
      showError('Ошибка сохранения урока')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }, [editingLesson, closeModal, fetchLessons, showError, showSuccess])

  // Удалить урок
  const handleDelete = useCallback(async (id: string) => {
    try {
      await LessonService.delete(id)
      showSuccess('Урок удалён')
      fetchLessons()
    } catch (error) {
      showError('Ошибка удаления урока')
      console.error(error)
    }
  }, [fetchLessons, showError, showSuccess])

  return {
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
    refresh: fetchLessons,
  }
}
