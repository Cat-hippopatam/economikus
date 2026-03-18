// src/pages/admin/AdminUsers.tsx
/**
 * Страница управления пользователями
 * Рефакторинг: использует UserModal, useUserList, RoleBadge, ConfirmDialog
 */

import { useState } from 'react'
import {
  Box, Card, Group, Text, Badge, Table, TextInput,
  Select, Pagination, ActionIcon, Menu, Avatar, Skeleton, Alert, Stack
} from '@mantine/core'
import { Search, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { UserModal } from '@/components/modals'
import { RoleBadge } from '@/components/common'
import { ConfirmDialog } from '@/components/common'
import { useUserList } from '@/hooks'
import type { UserInput } from '@/types'

export function AdminUsers() {
  const {
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
  } = useUserList()

  // Состояние для диалога подтверждения удаления
  const [deleteConfirm, setDeleteConfirm] = useState<{
    opened: boolean
    userId: string | null
    userName: string
  }>({ opened: false, userId: null, userName: '' })

  const confirmDelete = (user: { id: string; displayName: string }) => {
    setDeleteConfirm({ opened: true, userId: user.id, userName: user.displayName })
  }

  const executeDelete = async () => {
    if (deleteConfirm.userId) {
      await handleDelete(deleteConfirm.userId)
      setDeleteConfirm({ opened: false, userId: null, userName: '' })
    }
  }

  const onSave = async (data: UserInput) => {
    await handleSave(data)
  }

  return (
    <Box>
      <Group justify="space-between" mb="lg">
        <Text size="xl" fw={700}>Пользователи</Text>
      </Group>

      <Card shadow="xs" padding="md" radius="md" withBorder mb="lg">
        <Group>
          <TextInput
            placeholder="Поиск по имени или email..."
            leftSection={<Search size={16} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Роль"
            data={[
              { value: '', label: 'Все роли' },
              { value: 'USER', label: 'Пользователи' },
              { value: 'AUTHOR', label: 'Авторы' },
              { value: 'ADMIN', label: 'Админы' },
            ]}
            value={roleFilter}
            onChange={(v) => setRoleFilter(v || null)}
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
      ) : users.length === 0 ? (
        <Alert color="gray">Пользователи не найдены</Alert>
      ) : (
        <Card shadow="xs" padding={0} radius="md" withBorder>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Пользователь</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Роль</Table.Th>
                <Table.Th>Контент</Table.Th>
                <Table.Th>Дата регистрации</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {users.map((user) => (
                <Table.Tr key={user.id}>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar src={user.avatarUrl} alt={user.displayName} radius="xl" size="sm" />
                      <div>
                        <Text fw={500}>{user.displayName}</Text>
                        <Text size="xs" c="dimmed">@{user.nickname}</Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{user.email}</Text>
                  </Table.Td>
                  <Table.Td>
                    <RoleBadge role={user.role} />
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Badge variant="light" size="sm">
                        {user._count?.courses || 0} курсов
                      </Badge>
                      <Badge variant="light" size="sm">
                        {user._count?.lessons || 0} уроков
                      </Badge>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ru') : '—'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Menu>
                      <Menu.Target>
                        <ActionIcon variant="subtle">
                          <MoreVertical size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item leftSection={<Pencil size={14} />} onClick={() => openEdit(user)}>
                          Редактировать
                        </Menu.Item>
                        <Menu.Item color="red" leftSection={<Trash2 size={14} />} onClick={() => confirmDelete({ id: user.id, displayName: user.displayName })}>
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

      {/* Модальное окно редактирования */}
      <UserModal
        opened={modalOpened}
        onClose={closeModal}
        user={editingUser}
        onSave={onSave}
        loading={saving}
      />

      {/* Диалог подтверждения удаления */}
      <ConfirmDialog
        opened={deleteConfirm.opened}
        onClose={() => setDeleteConfirm({ opened: false, userId: null, userName: '' })}
        onConfirm={executeDelete}
        title="Удалить пользователя?"
        message={`Пользователь "${deleteConfirm.userName}" будет удалён. Это действие нельзя отменить.`}
        confirmLabel="Удалить"
        color="red"
      />
    </Box>
  )
}
