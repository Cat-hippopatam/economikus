// src/hooks/useUserList.ts
/**
 * Хук для управления списком пользователей
 */

import { useState, useCallback, useEffect } from 'react'
import { UserService } from '@/services'
import type { User, UserInput } from '@/types'
import { useNotification } from './useNotification'

interface UseUserListReturn {
  users: User[]
  loading: boolean
  page: number
  setPage: (page: number) => void
  totalPages: number
  search: string
  setSearch: (search: string) => void
  roleFilter: string | null
  setRoleFilter: (role: string | null) => void
  modalOpened: boolean
  editingUser: User | null
  saving: boolean
  openEdit: (user: User) => void
  closeModal: () => void
  handleSave: (data: UserInput) => Promise<void>
  handleDelete: (id: string) => Promise<void>
  refresh: () => Promise<void>
}

export function useUserList(): UseUserListReturn {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string | null>(null)
  const [modalOpened, setModalOpened] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [saving, setSaving] = useState(false)
  const { showError, showSuccess } = useNotification()

  // Загрузка пользователей
  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = {
        page: page.toString(),
        limit: '10',
      }
      if (search) params.search = search
      if (roleFilter) params.role = roleFilter

      const result = await UserService.getAdmin(params)
      setUsers(result.items)
      setTotalPages(result.pagination.totalPages)
    } catch (error) {
      console.error(error)
      showError('Ошибка загрузки пользователей')
    } finally {
      setLoading(false)
    }
  }, [page, search, roleFilter, showError])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Открыть модалку редактирования
  const openEdit = useCallback((user: User) => {
    setEditingUser(user)
    setModalOpened(true)
  }, [])

  // Закрыть модалку
  const closeModal = useCallback(() => {
    setModalOpened(false)
    setEditingUser(null)
  }, [])

  // Сохранить пользователя
  const handleSave = useCallback(async (data: UserInput) => {
    if (!editingUser) return
    
    setSaving(true)
    try {
      await UserService.update(editingUser.id, data)
      showSuccess('Пользователь обновлён')
      closeModal()
      fetchUsers()
    } catch (error) {
      showError('Ошибка сохранения пользователя')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }, [editingUser, closeModal, fetchUsers, showError, showSuccess])

  // Удалить пользователя
  const handleDelete = useCallback(async (id: string) => {
    try {
      await UserService.delete(id)
      showSuccess('Пользователь удалён')
      fetchUsers()
    } catch (error) {
      showError('Ошибка удаления пользователя')
      console.error(error)
    }
  }, [fetchUsers, showError, showSuccess])

  return {
    users,
    loading,
    page,
    setPage,
    totalPages,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    modalOpened,
    editingUser,
    saving,
    openEdit,
    closeModal,
    handleSave,
    handleDelete,
    refresh: fetchUsers,
  }
}
