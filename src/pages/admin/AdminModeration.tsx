import { useEffect, useState } from 'react'
import {
  Box, Card, Group, Text, Badge, Table, Button, Tabs,
  Modal, Textarea, Avatar, Skeleton,
  Alert, Stack, Pagination
} from '@mantine/core'
import { Check, X, AlertTriangle, MessageSquare, FileText } from 'lucide-react'
import { api } from '@/lib/api'

interface Comment {
  id: string
  text: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  author: {
    id: string
    nickname: string
    displayName: string
    avatarUrl: string | null
  }
  commentableType: 'COURSE' | 'LESSON'
  commentableId: string
  course?: { id: string; title: string }
  lesson?: { id: string; title: string }
}

interface ContentItem {
  id: string
  title: string
  type: 'COURSE' | 'LESSON'
  status: 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED'
  author: {
    id: string
    nickname: string
    displayName: string
    avatarUrl: string | null
  }
  createdAt: string
}

type ModerationTab = 'comments' | 'content' | 'reports'

export function AdminModeration() {
  const [activeTab, setActiveTab] = useState<ModerationTab>('comments')
  const [comments, setComments] = useState<Comment[]>([])
  const [content, setContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [rejectModal, setRejectModal] = useState<{ opened: boolean; id: string; type: 'comment' | 'content' } | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => {
    if (activeTab === 'comments') fetchComments()
    else if (activeTab === 'content') fetchContent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, page])

  const fetchComments = async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/moderation/comments', {
        params: { page, limit: 20, status: 'PENDING' }
      })
      setComments(res.data.items)
      setTotalPages(res.data.pagination.totalPages)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchContent = async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/moderation/content', {
        params: { page, limit: 20, status: 'PENDING_REVIEW' }
      })
      setContent(res.data.items)
      setTotalPages(res.data.pagination.totalPages)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveComment = async (id: string) => {
    try {
      await api.patch(`/admin/moderation/comments/${id}`, { status: 'APPROVED' })
      fetchComments()
    } catch (error) {
      console.error(error)
    }
  }

  const handleRejectComment = async (id: string) => {
    try {
      await api.patch(`/admin/moderation/comments/${id}`, { 
        status: 'REJECTED',
        reason: rejectReason 
      })
      setRejectModal(null)
      setRejectReason('')
      fetchComments()
    } catch (error) {
      console.error(error)
    }
  }

  const handleApproveContent = async (id: string, type: 'COURSE' | 'LESSON') => {
    try {
      await api.patch(`/admin/${type.toLowerCase()}s/${id}`, { status: 'PUBLISHED' })
      fetchContent()
    } catch (error) {
      console.error(error)
    }
  }

  const handleRejectContent = async (id: string, type: 'COURSE' | 'LESSON') => {
    try {
      await api.patch(`/admin/${type.toLowerCase()}s/${id}`, { 
        status: 'DRAFT',
        rejectionReason: rejectReason 
      })
      setRejectModal(null)
      setRejectReason('')
      fetchContent()
    } catch (error) {
      console.error(error)
    }
  }

  const statusColors: Record<string, string> = {
    PENDING: 'yellow',
    PENDING_REVIEW: 'yellow',
    APPROVED: 'green',
    PUBLISHED: 'green',
    REJECTED: 'red',
    DRAFT: 'gray'
  }

  const statusLabels: Record<string, string> = {
    PENDING: 'На модерации',
    PENDING_REVIEW: 'На проверке',
    APPROVED: 'Одобрен',
    PUBLISHED: 'Опубликован',
    REJECTED: 'Отклонён',
    DRAFT: 'Черновик'
  }

  return (
    <Box>
      <Group justify="space-between" mb="lg">
        <Text size="xl" fw={700}>Модерация</Text>
        <Group gap="xs">
          <Badge color="yellow" variant="light" size="lg">
            {comments.length} комментариев
          </Badge>
          <Badge color="orange" variant="light" size="lg">
            {content.length} контента
          </Badge>
        </Group>
      </Group>

      <Tabs value={activeTab} onChange={(v) => { setActiveTab(v as ModerationTab); setPage(1) }}>
        <Tabs.List>
          <Tabs.Tab value="comments" leftSection={<MessageSquare size={16} />}>
            Комментарии
          </Tabs.Tab>
          <Tabs.Tab value="content" leftSection={<FileText size={16} />}>
            Контент
          </Tabs.Tab>
          <Tabs.Tab value="reports" leftSection={<AlertTriangle size={16} />}>
            Жалобы
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="comments" pt="lg">
          {loading ? (
            <Stack gap="sm">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} height={80} radius="md" />
              ))}
            </Stack>
          ) : comments.length === 0 ? (
            <Alert color="green" icon={<Check size={16} />}>
              Все комментарии проверены!
            </Alert>
          ) : (
            <Stack gap="sm">
              {comments.map((comment) => (
                <Card key={comment.id} shadow="xs" padding="md" radius="md" withBorder>
                  <Group justify="space-between" wrap="nowrap">
                    <Group wrap="nowrap">
                      <Avatar 
                        src={comment.author?.avatarUrl} 
                        radius="xl" 
                        size="md"
                        color="blue"
                      >
                        {comment.author?.displayName?.[0] || '?'}
                      </Avatar>
                      <Box>
                        <Group gap="xs">
                          <Text fw={500}>{comment.author?.displayName || 'Неизвестно'}</Text>
                          <Badge color={statusColors[comment.status]} size="sm">
                            {statusLabels[comment.status]}
                          </Badge>
                        </Group>
                        <Text size="xs" c="dimmed">
                          {new Date(comment.createdAt).toLocaleString('ru')}
                        </Text>
                      </Box>
                    </Group>
                    <Group gap="xs">
                      <Button
                        size="xs"
                        color="green"
                        variant="light"
                        leftSection={<Check size={14} />}
                        onClick={() => handleApproveComment(comment.id)}
                      >
                        Одобрить
                      </Button>
                      <Button
                        size="xs"
                        color="red"
                        variant="light"
                        leftSection={<X size={14} />}
                        onClick={() => setRejectModal({ opened: true, id: comment.id, type: 'comment' })}
                      >
                        Отклонить
                      </Button>
                    </Group>
                  </Group>
                  <Text mt="sm" size="sm">
                    {comment.text}
                  </Text>
                </Card>
              ))}
            </Stack>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="content" pt="lg">
          {loading ? (
            <Stack gap="sm">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} height={60} radius="md" />
              ))}
            </Stack>
          ) : content.length === 0 ? (
            <Alert color="green" icon={<Check size={16} />}>
              Весь контент проверен!
            </Alert>
          ) : (
            <Card shadow="xs" padding={0} radius="md" withBorder>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Название</Table.Th>
                    <Table.Th>Автор</Table.Th>
                    <Table.Th>Тип</Table.Th>
                    <Table.Th>Статус</Table.Th>
                    <Table.Th>Дата</Table.Th>
                    <Table.Th></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {content.map((item) => (
                    <Table.Tr key={item.id}>
                      <Table.Td>
                        <Text fw={500}>{item.title}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Avatar 
                            src={item.author?.avatarUrl} 
                            radius="xl" 
                            size="sm" 
                            color="blue"
                          >
                            {item.author?.displayName?.[0] || '?'}
                          </Avatar>
                          <Text size="sm">{item.author?.displayName || 'Неизвестно'}</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Badge variant="light">
                          {item.type === 'COURSE' ? 'Курс' : 'Урок'}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={statusColors[item.status]}>
                          {statusLabels[item.status]}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">
                          {new Date(item.createdAt).toLocaleDateString('ru')}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Button
                            size="xs"
                            color="green"
                            variant="light"
                            onClick={() => handleApproveContent(item.id, item.type)}
                          >
                            Опубликовать
                          </Button>
                          <Button
                            size="xs"
                            color="red"
                            variant="light"
                            onClick={() => setRejectModal({ opened: true, id: item.id, type: 'content' })}
                          >
                            Отклонить
                          </Button>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Card>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="reports" pt="lg">
          <Alert color="gray" icon={<AlertTriangle size={16} />}>
            Система жалоб будет реализована в следующей версии
          </Alert>
        </Tabs.Panel>
      </Tabs>

      {totalPages > 1 && (
        <Group justify="center" mt="lg">
          <Pagination total={totalPages} value={page} onChange={setPage} />
        </Group>
      )}

      <Modal
        opened={rejectModal?.opened || false}
        onClose={() => { setRejectModal(null); setRejectReason('') }}
        title="Причина отклонения"
      >
        <Stack gap="md">
          <Textarea
            placeholder="Укажите причину отклонения..."
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <Group justify="flex-end">
            <Button variant="subtle" onClick={() => { setRejectModal(null); setRejectReason('') }}>
              Отмена
            </Button>
            <Button 
              color="red"
              onClick={() => {
                if (rejectModal?.type === 'comment') {
                  handleRejectComment(rejectModal.id)
                } else if (rejectModal?.type === 'content') {
                  handleRejectContent(rejectModal.id, 'COURSE') // TODO: передать правильный тип
                }
              }}
            >
              Отклонить
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  )
}
