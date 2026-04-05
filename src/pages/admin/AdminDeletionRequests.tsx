// src/pages/admin/AdminDeletionRequests.tsx
import { useState, useEffect } from 'react'
import {
 Paper, Title, Text, Stack, Group, Badge, Button, Table, Avatar, Modal, Textarea, Notification, Skeleton, ActionIcon, Tooltip, Pagination, Alert,
} from '@mantine/core'
import { Check, X, Clock, Eye, Trash2, AlertTriangle } from 'lucide-react'
import { APP_CONFIG } from '../../constants'

interface DeletionRequest {
 id: string
 email: string
 reason: string | null
 status: 'PENDING' | 'COMPLETED' | 'REJECTED' | 'CANCELLED'
 rejectionReason: string | null
 createdAt: string
 processedAt: string | null
 profile: { id: string; nickname: string; displayName: string; avatarUrl: string | null }
 processor: { id: string; nickname: string; displayName: string } | null
}

export function AdminDeletionRequests() {
 const [requests, setRequests] = useState<DeletionRequest[]>([])
 const [loading, setLoading] = useState(true)
 const [page, setPage] = useState(1)
 const [totalPages, setTotalPages] = useState(1)
 const [statusFilter, setStatusFilter] = useState<string>('')
 const [selectedRequest, setSelectedRequest] = useState<DeletionRequest | null>(null)
 const [modalOpened, setModalOpened] = useState(false)
 const [rejectionReason, setRejectionReason] = useState('')
 const [processing, setProcessing] = useState(false)
 const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
 const [confirmDeleteOpened, setConfirmDeleteOpened] = useState(false)

 useEffect(() => { fetchRequests() }, [page, statusFilter])

 const fetchRequests = async () => {
 try {
 setLoading(true)
 const params = new URLSearchParams({ page: String(page), limit: '20' })
 if (statusFilter) params.append('status', statusFilter)
 const response = await fetch(`${APP_CONFIG.apiUrl}/admin/account-deletion-requests?${params}`, { credentials: 'include' })
 const data = await response.json()
 setRequests(data.items)
 setTotalPages(data.pagination.totalPages)
 } catch (error) {
 console.error('Error fetching requests:', error)
 } finally {
 setLoading(false)
 }
 }

 const handleComplete = async (id: string) => {
 try {
 setProcessing(true)
 const response = await fetch(`${APP_CONFIG.apiUrl}/admin/account-deletion-requests/${id}/complete`, {
 method: 'POST',
 credentials: 'include',
 })
 if (!response.ok) throw new Error('Ошибка')
 setNotification({ type: 'success', message: 'Аккаунт удалён' })
 setConfirmDeleteOpened(false)
 setModalOpened(false)
 fetchRequests()
 } catch {
 setNotification({ type: 'error', message: 'Ошибка при удалении аккаунта' })
 } finally {
 setProcessing(false)
 }
 }

 const handleReject = async (id: string) => {
 try {
 setProcessing(true)
 const response = await fetch(`${APP_CONFIG.apiUrl}/admin/account-deletion-requests/${id}/reject`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 credentials: 'include',
 body: JSON.stringify({ rejectionReason }),
 })
 if (!response.ok) throw new Error('Ошибка')
 setNotification({ type: 'success', message: 'Заявка отклонена' })
 setModalOpened(false)
 fetchRequests()
 } catch {
 setNotification({ type: 'error', message: 'Ошибка при отклонении' })
 } finally {
 setProcessing(false)
 }
 }

 const getStatusBadge = (status: string) => {
 switch (status) {
 case 'PENDING': return<Badge color="yellow" leftSection={<Clock size={12} />}>На рассмотрении</Badge>
 case 'COMPLETED': return<Badge color="green" leftSection={<Check size={12} />}>Выполнено</Badge>
 case 'REJECTED': return<Badge color="red" leftSection={<X size={12} />}>Отклонено</Badge>
 case 'CANCELLED': return<Badge color="gray" leftSection={<X size={12} />}>Отозвано</Badge>
 default: return<Badge>{status}</Badge>
 }
 }

 return (
<Stack gap="md">
 {notification && (
<Notification 
 icon={notification.type === 'success' ?<Check size={16} /> :<X size={16} />} 
 color={notification.type === 'success' ? 'green' : 'red'} 
 onClose={() => setNotification(null)}
 >
 {notification.message}
</Notification>
 )}
      
<Group justify="space-between">
<Title order={2}>Заявки на удаление аккаунтов</Title>
<Group>
<Button variant={statusFilter === '' ? 'filled' : 'light'} size="xs" onClick={() => { setStatusFilter(''); setPage(1) }}>Все</Button>
<Button variant={statusFilter === 'PENDING' ? 'filled' : 'light'} size="xs" color="yellow" onClick={() => { setStatusFilter('PENDING'); setPage(1) }}>На рассмотрении</Button>
<Button variant={statusFilter === 'COMPLETED' ? 'filled' : 'light'} size="xs" color="green" onClick={() => { setStatusFilter('COMPLETED'); setPage(1) }}>Выполнено</Button>
<Button variant={statusFilter === 'REJECTED' ? 'filled' : 'light'} size="xs" color="red" onClick={() => { setStatusFilter('REJECTED'); setPage(1) }}>Отклонено</Button>
</Group>
</Group>
      
<Paper withBorder>
 {loading ? (
<Stack p="md">{[...Array(5)].map((_, i) =><Skeleton key={i} height={50} />)}</Stack>
 ) : requests.length ===0 ? (
<Text p="xl" ta="center" c="dimmed">Нет заявок</Text>
 ) : (
<Table striped highlightOnHover>
<Table.Thead>
<Table.Tr>
<Table.Th>Пользователь</Table.Th>
<Table.Th>Email</Table.Th>
<Table.Th>Причина</Table.Th>
<Table.Th>Статус</Table.Th>
<Table.Th>Дата</Table.Th>
<Table.Th>Действия</Table.Th>
</Table.Tr>
</Table.Thead>
<Table.Tbody>
 {requests.map((req) => (
<Table.Tr key={req.id}>
<Table.Td>
<Group gap="xs">
<Avatar src={req.profile.avatarUrl} size="sm" radius="xl" />
<div>
<Text size="sm" fw={500}>{req.profile.displayName}</Text>
<Text size="xs" c="dimmed">@{req.profile.nickname}</Text>
</div>
</Group>
</Table.Td>
<Table.Td><Text size="sm">{req.email}</Text></Table.Td>
<Table.Td><Text size="sm" lineClamp={2}>{req.reason || 'Не указана'}</Text></Table.Td>
<Table.Td>{getStatusBadge(req.status)}</Table.Td>
<Table.Td><Text size="sm">{new Date(req.createdAt).toLocaleDateString('ru-RU')}</Text></Table.Td>
<Table.Td>
<Tooltip label="Просмотр">
<ActionIcon variant="light" onClick={() => { setSelectedRequest(req); setRejectionReason(''); setModalOpened(true) }}>
<Eye size={16} />
</ActionIcon>
</Tooltip>
</Table.Td>
</Table.Tr>
 ))}
</Table.Tbody>
</Table>
 )}
</Paper>
      
 {totalPages >1 &&<Group justify="center"><Pagination value={page} onChange={setPage} total={totalPages} /></Group>}
      
 {/* Модальное окно просмотра заявки */}
<Modal opened={modalOpened} onClose={() => setModalOpened(false)} title="Заявка на удаление аккаунта" size="lg">
 {selectedRequest && (
<Stack gap="md">
<Group>
<Avatar src={selectedRequest.profile.avatarUrl} size="lg" radius="xl" />
<div>
<Text fw={500}>{selectedRequest.profile.displayName}</Text>
<Text size="sm" c="dimmed">@{selectedRequest.profile.nickname}</Text>
<Text size="sm" c="dimmed">{selectedRequest.email}</Text>
</div>
 {getStatusBadge(selectedRequest.status)}
</Group>
            
<div>
<Text fw={500} mb="xs">Причина:</Text>
<Text size="sm">{selectedRequest.reason || 'Не указана'}</Text>
</div>
            
<div>
<Text fw={500} mb="xs">Дата подачи:</Text>
<Text size="sm">{new Date(selectedRequest.createdAt).toLocaleString('ru-RU')}</Text>
</div>
            
 {selectedRequest.processedAt && (
<div>
<Text fw={500} mb="xs">Дата обработки:</Text>
<Text size="sm">{new Date(selectedRequest.processedAt).toLocaleString('ru-RU')}</Text>
</div>
 )}
            
 {selectedRequest.processor && (
<Text size="sm" c="dimmed">Обработал: {selectedRequest.processor.displayName} (@selectedRequest.processor.nickname)</Text>
 )}
            
 {selectedRequest.status === 'PENDING' && (
 <>
<Alert icon={<AlertTriangle size={16} />} title="Внимание!" color="red" variant="light">
 При выполнении заявки аккаунт пользователя будет удалён безвозвратно вместе со всеми данными.
</Alert>
                
<Textarea 
 label="Причина отклонения (если отклоняете заявку)" 
 placeholder="Укажите причину..." 
 value={rejectionReason} 
 onChange={(e) => setRejectionReason(e.target.value)} 
 rows={3} 
 />
                
<Group justify="flex-end">
<Button 
 color="red" 
 onClick={() => handleReject(selectedRequest.id)} 
 loading={processing}
 disabled={!rejectionReason.trim()}
 >
 Отклонить заявку
</Button>
<Button 
 color="red" 
 variant="filled"
 leftSection={<Trash2 size={16} />}
 onClick={() => setConfirmDeleteOpened(true)}
 loading={processing}
 >
 Удалить аккаунт
</Button>
</Group>
 </>
 )}
            
 {selectedRequest.rejectionReason && (
<div>
<Text fw={500} mb="xs" c="red">Причина отклонения:</Text>
<Text size="sm">{selectedRequest.rejectionReason}</Text>
</div>
 )}
</Stack>
 )}
</Modal>
      
 {/* Модальное окно подтверждения удаления */}
<Modal opened={confirmDeleteOpened} onClose={() => setConfirmDeleteOpened(false)} title="Подтверждение удаления" size="md" centered>
<Stack gap="md">
<Alert icon={<AlertTriangle size={20} />} title="Опасная операция" color="red">
 Вы собираетесь удалить аккаунт пользователя<strong>{selectedRequest?.profile?.displayName}</strong> (@selectedRequest?.profile?.nickname).
</Alert>
<Text size="sm">Будут удалены:</Text>
<Text size="sm" component="ul" pl="md">
<li>Профиль пользователя</li>
<li>История обучения</li>
<li>Избранное</li>
<li>Сертификаты</li>
<li>Комментарии и реакции</li>
<li>Все данные связанные с аккаунтом</li>
</Text>
<Text size="sm" c="red" fw={500}>Это действие необратимо!</Text>
<Group justify="flex-end">
<Button variant="subtle" onClick={() => setConfirmDeleteOpened(false)}>Отмена</Button>
<Button color="red" onClick={() => selectedRequest && handleComplete(selectedRequest.id)} loading={processing}>
 Да, удалить аккаунт
</Button>
</Group>
</Stack>
</Modal>
</Stack>
 )
}
