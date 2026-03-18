// src/hooks/useTagList.ts
/**
 * Хук для управления списком тегов
 */

import { useState, useCallback, useEffect } from 'react'
import { TagService } from '@/services'
import type { Tag, TagInput } from '@/types'
import { useNotification } from './useNotification'

interface UseTagListReturn {
  tags: Tag[]
  loading: boolean
  modalOpened: boolean
  editingTag: Tag | null
  saving: boolean
  openCreate: () => void
  openEdit: (tag: Tag) => void
  closeModal: () => void
  handleSave: (data: TagInput) => Promise<void>
  handleDelete: (id: string) => Promise<void>
  refresh: () => Promise<void>
}

export function useTagList(): UseTagListReturn {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpened, setModalOpened] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [saving, setSaving] = useState(false)
  const { showError, showSuccess } = useNotification()

  // Загрузка тегов
  const fetchTags = useCallback(async () => {
    setLoading(true)
    try {
      const result = await TagService.getAdmin()
      setTags(result.items)
    } catch (error) {
      console.error(error)
      showError('Ошибка загрузки тегов')
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => {
    fetchTags()
  }, [fetchTags])

  // Открыть модалку создания
  const openCreate = useCallback(() => {
    setEditingTag(null)
    setModalOpened(true)
  }, [])

  // Открыть модалку редактирования
  const openEdit = useCallback((tag: Tag) => {
    setEditingTag(tag)
    setModalOpened(true)
  }, [])

  // Закрыть модалку
  const closeModal = useCallback(() => {
    setModalOpened(false)
    setEditingTag(null)
  }, [])

  // Сохранить тег
  const handleSave = useCallback(async (data: TagInput) => {
    setSaving(true)
    try {
      if (editingTag) {
        await TagService.update(editingTag.id, data)
        showSuccess('Тег обновлён')
      } else {
        await TagService.create(data)
        showSuccess('Тег создан')
      }
      closeModal()
      fetchTags()
    } catch (error) {
      showError('Ошибка сохранения тега')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }, [editingTag, closeModal, fetchTags, showError, showSuccess])

  // Удалить тег
  const handleDelete = useCallback(async (id: string) => {
    try {
      await TagService.delete(id)
      showSuccess('Тег удалён')
      fetchTags()
    } catch (error) {
      showError('Ошибка удаления тега')
      console.error(error)
    }
  }, [fetchTags, showError, showSuccess])

  return {
    tags,
    loading,
    modalOpened,
    editingTag,
    saving,
    openCreate,
    openEdit,
    closeModal,
    handleSave,
    handleDelete,
    refresh: fetchTags,
  }
}
