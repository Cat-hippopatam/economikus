// src/hooks/useCourseList.ts
/**
 * Хук для управления списком курсов
 */

import { useState, useCallback, useEffect } from 'react'
import { CourseService, TagService } from '@/services'
import type { Course, Tag, CourseInput } from '@/types'
import { useNotification } from './useNotification'

interface UseCourseListReturn {
  courses: Course[]
  tags: Tag[]
  loading: boolean
  page: number
  setPage: (page: number) => void
  totalPages: number
  search: string
  setSearch: (search: string) => void
  statusFilter: string | null
  setStatusFilter: (status: string | null) => void
  modalOpened: boolean
  editingCourse: Course | null
  saving: boolean
  openCreate: () => void
  openEdit: (course: Course) => void
  closeModal: () => void
  handleSave: (data: CourseInput) => Promise<void>
  handleDelete: (id: string) => Promise<void>
  refresh: () => Promise<void>
}

export function useCourseList(): UseCourseListReturn {
  const [courses, setCourses] = useState<Course[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [modalOpened, setModalOpened] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [saving, setSaving] = useState(false)
  const { showError, showSuccess } = useNotification()

  // Загрузка курсов
  const fetchCourses = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = {
        page: page.toString(),
        limit: '10',
      }
      if (search) params.search = search
      if (statusFilter) params.status = statusFilter

      const result = await CourseService.getAdmin(params)
      setCourses(result.items)
      setTotalPages(result.pagination.totalPages)
    } catch (error) {
      console.error(error)
      showError('Ошибка загрузки курсов')
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter, showError])

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
    fetchCourses()
  }, [fetchCourses])

  useEffect(() => {
    fetchTags()
  }, [fetchTags])

  // Открыть модалку создания
  const openCreate = useCallback(() => {
    setEditingCourse(null)
    setModalOpened(true)
  }, [])

  // Открыть модалку редактирования
  const openEdit = useCallback((course: Course) => {
    setEditingCourse(course)
    setModalOpened(true)
  }, [])

  // Закрыть модалку
  const closeModal = useCallback(() => {
    setModalOpened(false)
    setEditingCourse(null)
  }, [])

  // Сохранить курс
  const handleSave = useCallback(async (data: CourseInput) => {
    setSaving(true)
    try {
      if (editingCourse) {
        await CourseService.update(editingCourse.id, data)
        showSuccess('Курс обновлён')
      } else {
        await CourseService.create(data)
        showSuccess('Курс создан')
      }
      closeModal()
      fetchCourses()
    } catch (error) {
      showError('Ошибка сохранения курса')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }, [editingCourse, closeModal, fetchCourses, showError, showSuccess])

  // Удалить курс
  const handleDelete = useCallback(async (id: string) => {
    try {
      await CourseService.delete(id)
      showSuccess('Курс удалён')
      fetchCourses()
    } catch (error) {
      showError('Ошибка удаления курса')
      console.error(error)
    }
  }, [fetchCourses, showError, showSuccess])

  return {
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
    refresh: fetchCourses,
  }
}
