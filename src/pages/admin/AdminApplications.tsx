// src/pages/admin/AdminApplications.tsx
import { useState, useEffect } from 'react'
import {
  Paper, Title, Text, Stack, Group, Badge, Button, Table, Avatar, Modal, Textarea, Notification, Skeleton, ActionIcon, Tooltip, Pagination,
} from '@mantine/core'
import { Check, X, Clock, Eye, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { APP_CONFIG } from '../../constants'

interface Application {
  id: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  motivation: string
  experience: string | null
  portfolioUrl: string | null
  rejectionReason: string | null
  createdAt: string
  reviewedAt: string | null
  profile: { id: string; nickname: string; displayName: string; avatarUrl: string | null }
  reviewer: { id: string; nickname: string; displayName: string } | null
}

export function AdminApplications() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [modalOpened, setModalOpened] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [processing, setProcessing] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => { fetchApplications() }, [page, statusFilter])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (statusFilter) params.append('status', statusFilter)
      const response = await fetch(`${APP_CONFIG.apiUrl}/admin/applications?${params}`, { credentials: 'include' })
      const data = await response.json()
      setApplications(data.items)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      setProcessing(true)
      const response = await fetch(`${APP_CONFIG.apiUrl}/admin/applications/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ action: 'approve' }),
      })
      if (!response.ok) throw new Error('Ошибка')
      setNotification({ type: 'success', message: 'Заявка одобрена' })
      setModalOpened(false)
      fetchApplications()
    } catch (error) {
      setNotification({ type: 'error', message: 'Ошибка при одобрении' })
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async (id: string) => {
    if (!rejectionReason.trim()) { setNotification({ type: 'error', message: 'Укажите причину отклонения' }); return }
    try {
      setProcessing(true)
      const response = await fetch(`${APP_CONFIG.apiUrl}/admin/applications/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ action: 'reject', rejectionReason }),
      })
      if (!response.ok) throw new Error('Ошибка')
      setNotification({ type: 'success', message: 'Заявка отклонена' })
      setModalOpened(false)
      fetchApplications()
    } catch (error) {
      setNotification({ type: 'error', message: 'Ошибка при отклонении' })
    } finally {
      setProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <Badge color="yellow" leftSection={<Clock size={12} />}>На рассмотрении</Badge>
      case 'APPROVED': return <Badge color="green" leftSection={<Check size={12} />}>Одобрено</Badge>
      case 'REJECTED': return <Badge color="red" leftSection={<X size={12} />}>Отклонено</Badge>
      default: return <Badge>{status}</Badge>
    }
  }

  return (
    <Stack gap="md">
      {notification && <Notification icon={notification.type === 'success' ? <Check size={16} /> : <X size={16} />} color={notification.type === 'success' ? 'green' : 'red'} onClose={() => setNotification(null)}>{notification.message}</Notification>}
      <Group justify="space-between">
        <Title order={2}>Заявки авторов</Title>
        <Group>
          <Button variant={statusFilter === '' ? 'filled' : 'light'} size="xs" onClick={() => { setStatusFilter(''); setPage(1) }}>Все</Button>
          <Button variant={statusFilter === 'PENDING' ? 'filled' : 'light'} size="xs" color="yellow" onClick={() => { setStatusFilter('PENDING'); setPage(1) }}>На рассмотрении</Button>
          <Button variant={statusFilter === 'APPROVED' ? 'filled' : 'light'} size="xs" color="green" onClick={() => { setStatusFilter('APPROVED'); setPage(1) }}>Одобрено</Button>
          <Button variant={statusFilter === 'REJECTED' ? 'filled' : 'light'} size="xs" color="red" onClick={() => { setStatusFilter('REJECTED'); setPage(1) }}>Отклонено</Button>
        </Group>
      </Group>
      <Paper withBorder>
        {loading ? <Stack p="md">{[...Array(5)].map((_, i) => <Skeleton key={i} height={50} />)}</Stack> :
          applications.length === 0 ? <Text p="xl" ta="center" c="dimmed">Нет заявок</Text> :
          <Table striped highlightOnHover>
            <Table.Thead><Table.Tr><Table.Th>Пользователь</Table.Th><Table.Th>Мотивация</Table.Th><Table.Th>Статус</Table.Th><Table.Th>Дата</Table.Th><Table.Th>Действия</Table.Th></Table.Tr></Table.Thead>
            <Table.Tbody>
              {applications.map((app) => (
                <Table.Tr key={app.id}>
                  <Table.Td><Group gap="xs"><Avatar src={app.profile.avatarUrl} size="sm" radius="xl" /><div><Text size="sm" fw={500}>{app.profile.displayName}</Text><Text size="xs" c="dimmed">@{app.profile.nickname}</Text></div></Group></Table.Td>
                  <Table.Td><Text size="sm" lineClamp={2}>{app.motivation}</Text></Table.Td>
                  <Table.Td>{getStatusBadge(app.status)}</Table.Td>
                  <Table.Td><Text size="sm">{new Date(app.createdAt).toLocaleDateString('ru-RU')}</Text></Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Tooltip label="Просмотр"><ActionIcon variant="light" onClick={() => { setSelectedApplication(app); setRejectionReason(''); setModalOpened(true) }}><Eye size={16} /></ActionIcon></Tooltip>
                      <Tooltip label="Профиль"><ActionIcon component={Link} to={`/user/${app.profile.nickname}`} variant="light"><ExternalLink size={16} /></ActionIcon></Tooltip>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        }
      </Paper>
      {totalPages > 1 && <Group justify="center"><Pagination value={page} onChange={setPage} total={totalPages} /></Group>}
      <Modal opened={modalOpened} onClose={() => setModalOpened(false)} title="Заявка на статус автора" size="lg">
        {selectedApplication && (
          <Stack gap="md">
            <Group><Avatar src={selectedApplication.profile.avatarUrl} size="lg" radius="xl" /><div><Text fw={500}>{selectedApplication.profile.displayName}</Text><Text size="sm" c="dimmed">@{selectedApplication.profile.nickname}</Text></div>{getStatusBadge(selectedApplication.status)}</Group>
            <div><Text fw={500} mb="xs">Мотивация:</Text><Text size="sm">{selectedApplication.motivation}</Text></div>
            {selectedApplication.experience && <div><Text fw={500} mb="xs">Опыт:</Text><Text size="sm">{selectedApplication.experience}</Text></div>}
            {selectedApplication.portfolioUrl && <div><Text fw={500} mb="xs">Портфолио:</Text><Button component="a" href={selectedApplication.portfolioUrl} target="_blank" variant="light" size="xs">Открыть ссылку</Button></div>}
            {selectedApplication.status === 'PENDING' && (
              <>
                <Textarea label="Причина отклонения (если отклоняете)" placeholder="Укажите причину..." value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} rows={3} />
                <Group justify="flex-end">
                  <Button color="red" onClick={() => handleReject(selectedApplication.id)} loading={processing} disabled={!rejectionReason.trim()}>Отклонить</Button>
                  <Button color="green" onClick={() => handleApprove(selectedApplication.id)} loading={processing}>Одобрить</Button>
                </Group>
              </>
            )}
            {selectedApplication.rejectionReason && <div><Text fw={500} mb="xs" c="red">Причина отклонения:</Text><Text size="sm">{selectedApplication.rejectionReason}</Text></div>}
            {selectedApplication.reviewer && <Text size="sm" c="dimmed">Рассмотрел: {selectedApplication.reviewer.displayName} ({selectedApplication.reviewer.nickname})</Text>}
          </Stack>
        )}
      </Modal>
    </Stack>
  )
}
