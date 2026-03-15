import { useEffect, useState } from 'react'
import {
  Box, Card, Group, Text, Badge, Table, TextInput,
  Select, Pagination, ActionIcon, Menu, Modal, Textarea,
  Avatar, Skeleton, Alert, Stack
} from '@mantine/core'
import { Search, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { api } from '@/lib/api'

interface User {
  id: string
  nickname: string
  displayName: string
  email: string
  avatarUrl: string | null
  bio: string | null
  role: string
  createdAt: string
  _count?: { courses: number; lessons: number }
}

const roleColors: Record<string, string> = {
  USER: 'gray',
  AUTHOR: 'blue',
  ADMIN: 'red'
}

const roleLabels: Record<string, string> = {
  USER: 'Пользователь',
  AUTHOR: 'Автор',
  ADMIN: 'Админ'
}

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string | null>(null)
  const [opened, setOpened] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [saving, setSaving] = useState(false)

  // Form state
  const [formDisplayName, setFormDisplayName] = useState('')
  const [formBio, setFormBio] = useState('')
  const [formRole, setFormRole] = useState<string>('USER')

  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, roleFilter])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', '10')
      if (search) params.append('search', search)
      if (roleFilter) params.append('role', roleFilter)

      const res = await api.get(`/admin/users?${params}`)
      setUsers(res.data.items)
      setTotalPages(res.data.pagination.totalPages)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const openEditModal = (user: User) => {
    setEditingUser(user)
    setFormDisplayName(user.displayName)
    setFormBio(user.bio || '')
    setFormRole(user.role)
    setOpened(true)
  }

  const handleSave = async () => {
    if (!editingUser) return
    setSaving(true)
    try {
      await api.patch(`/admin/users/${editingUser.id}`, {
        displayName: formDisplayName,
        bio: formBio,
        role: formRole
      })
      setOpened(false)
      fetchUsers()
    } catch (error) {
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить пользователя?')) return
    try {
      await api.delete(`/admin/users/${id}`)
      fetchUsers()
    } catch (error) {
      console.error(error)
    }
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
              { value: 'ADMIN', label: 'Админы' }
            ]}
            value={roleFilter}
            onChange={setRoleFilter}
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
                    <Badge color={roleColors[user.role]}>
                      {roleLabels[user.role]}
                    </Badge>
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
                      {new Date(user.createdAt).toLocaleDateString('ru')}
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
                        <Menu.Item leftSection={<Pencil size={14} />} onClick={() => openEditModal(user)}>
                          Редактировать
                        </Menu.Item>
                        <Menu.Item color="red" leftSection={<Trash2 size={14} />} onClick={() => handleDelete(user.id)}>
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

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Редактировать пользователя"
      >
        <Stack gap="md">
          <TextInput
            label="Имя"
            value={formDisplayName}
            onChange={(e) => setFormDisplayName(e.target.value)}
          />
          <Textarea
            label="О себе"
            rows={2}
            value={formBio}
            onChange={(e) => setFormBio(e.target.value)}
          />
          <Select
            label="Роль"
            data={[
              { value: 'USER', label: 'Пользователь' },
              { value: 'AUTHOR', label: 'Автор' },
              { value: 'ADMIN', label: 'Админ' }
            ]}
            value={formRole}
            onChange={(v) => setFormRole(v || 'USER')}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={() => setOpened(false)}>Отмена</Button>
            <Button onClick={handleSave} loading={saving}>Сохранить</Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  )
}
