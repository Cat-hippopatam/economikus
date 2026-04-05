// src/components/profile/SubscriptionsTab.tsx
import { useState } from 'react'
import { Stack, Card, Group, Text, Badge, Button, Modal, Stack as MantineStack } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { CreditCard, Plus, AlertCircle } from 'lucide-react'
import { LoadingState, EmptyState, ErrorState } from '../common'
import { useUserSubscriptions } from '../../hooks'

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'green',
  PAST_DUE: 'yellow',
  CANCELED: 'red',
  EXPIRED: 'gray',
}

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Активна',
  PAST_DUE: 'Просрочена',
  CANCELED: 'Отменена',
  EXPIRED: 'Истекла',
}

const PLAN_LABELS: Record<string, string> = {
  premium_monthly: 'Премиум (месяц)',
  premium_annual: 'Премиум (год)',
}

export function SubscriptionsTab() {
  const { items, loading, error, fetchSubscriptions, cancelSubscription } = useUserSubscriptions()
  const [cancelModal, { open: openCancelModal, close: closeCancelModal }] = useDisclosure(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  if (loading) {
    return <LoadingState text="Загрузка подписок..." />
  }

  if (error) {
    return <ErrorState title="Ошибка" message={error} onRetry={fetchSubscriptions} />
  }

  const handleCancelClick = (id: string) => {
    setSelectedId(id)
    openCancelModal()
  }

  const handleCancelConfirm = async () => {
    if (selectedId) {
      try {
        await cancelSubscription(selectedId)
      } catch {
        // Ошибка обрабатывается в хуке
      }
    }
    closeCancelModal()
    setSelectedId(null)
  }

  return (
    <>
      {items.length === 0 ? (
        <EmptyState
          title="Нет активных подписок"
          description="Оформите подписку, чтобы получить доступ к премиум-контенту"
          icon={<CreditCard size={40} />}
        />
      ) : (
        <Stack gap="md">
          {items.map((subscription) => (
            <Card key={subscription.id} withBorder padding="md" radius="md">
              <Group justify="space-between">
                <Group gap="md">
                  <CreditCard size={24} style={{ color: 'var(--mantine-color-blue-6)' }} />
                  <Stack gap={4}>
                    <Group gap="xs">
                      <Text fw={600}>
                        {PLAN_LABELS[subscription.planType] || subscription.planType}
                      </Text>
                      <Badge color={STATUS_COLORS[subscription.status]} variant="light">
                        {STATUS_LABELS[subscription.status]}
                      </Badge>
                    </Group>
                    <Group gap="xs">
                      <Text size="sm" c="dimmed">
                        {subscription.price} {subscription.currency}/мес
                      </Text>
                      {subscription.autoRenew && (
                        <Badge size="xs" variant="outline">
                          Автопродление
                        </Badge>
                      )}
                    </Group>
                  </Stack>
                </Group>
                
                {subscription.status === 'ACTIVE' && (
                  <Button
                    variant="subtle"
                    color="red"
                    size="xs"
                    onClick={() => handleCancelClick(subscription.id)}
                  >
                    Отменить
                  </Button>
                )}
              </Group>
            </Card>
          ))}
          
          <Button
            variant="light"
            leftSection={<Plus size={16} />}
            style={{ alignSelf: 'flex-start' }}
          >
            Оформить подписку
          </Button>
        </Stack>
      )}
      
      <Modal
        opened={cancelModal}
        onClose={closeCancelModal}
        title="Отмена подписки"
        size="sm"
      >
        <MantineStack>
          <Group gap="sm">
            <AlertCircle size={24} color="var(--mantine-color-yellow-6)" />
            <Text>Вы уверены, что хотите отменить подписку?</Text>
          </Group>
          <Group justify="flex-end">
            <Button variant="subtle" onClick={closeCancelModal}>
              Оставить
            </Button>
            <Button color="red" onClick={handleCancelConfirm}>
              Отменить подписку
            </Button>
          </Group>
        </MantineStack>
      </Modal>
    </>
  )
}
