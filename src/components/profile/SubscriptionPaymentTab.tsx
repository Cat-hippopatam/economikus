// src/components/profile/SubscriptionPaymentTab.tsx
import { useState } from 'react'
import { Stack, Card, Group, Text, Badge, Button, SimpleGrid, Modal, Stack as MantineStack } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Check, Crown, AlertCircle } from 'lucide-react'
import { LoadingState, ErrorState } from '../common'
import { useUserSubscriptions } from '../../hooks'
import { COLORS } from '../../constants'

interface Plan {
  id: string
  name: string
  price: number
  period: string
  features: string[]
  recommended?: boolean
}

const PLANS: Plan[] = [
  {
    id: 'premium_monthly',
    name: 'Премиум',
    price: 299,
    period: 'месяц',
    features: [
      'Доступ ко всем платным курсам',
      'Безлимитные сертификаты',
      'Приоритетная поддержка',
      'Обучающие материалы'
    ]
  },
  {
    id: 'premium_annual',
    name: 'Премиум Год',
    price: 2490,
    period: 'год',
    recommended: true,
    features: [
      'Все возможности месячного плана',
      'Экономия 30%',
      'Ранний доступ к новым курсам',
      'Персональные консультации'
    ]
  }
]

const PLAN_LABELS: Record<string, string> = {
  premium_monthly: 'Премиум (месяц)',
  premium_annual: 'Премиум (год)',
  ACTIVE: 'Активна',
  PAST_DUE: 'Просрочена',
  CANCELED: 'Отменена',
  EXPIRED: 'Истекла'
}

export function SubscriptionPaymentTab() {
  const { items: subscriptions, loading, error, fetchSubscriptions, createSubscription, cancelSubscription } = useUserSubscriptions()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [confirmModal, { open: openConfirmModal, close: closeConfirmModal }] = useDisclosure(false)
  const [processing, setProcessing] = useState(false)

  const activeSubscription = subscriptions.find(sub => sub.status === 'ACTIVE')

  const handleSubscribe = async () => {
    if (!selectedPlan) return
    
    setProcessing(true)
    try {
      await createSubscription(selectedPlan)
      closeConfirmModal()
      setSelectedPlan(null)
    } catch (err) {
      console.error('Error creating subscription:', err)
    } finally {
      setProcessing(false)
    }
  }

  const handleCancel = async () => {
    if (!activeSubscription) return
    
    setProcessing(true)
    try {
      await cancelSubscription(activeSubscription.id)
      closeConfirmModal()
    } catch (err) {
      console.error('Error canceling subscription:', err)
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return <LoadingState text="Загрузка подписки..." />
  }

  if (error) {
    return <ErrorState title="Ошибка" message={error} onRetry={fetchSubscriptions} />
  }

  return (
    <>
      <Stack gap="lg">
        {/* Текущая подписка */}
        {activeSubscription ? (
          <Card withBorder padding="lg" radius="md" style={{ borderColor: 'var(--mantine-color-green-5)' }}>
            <Group justify="space-between">
              <Group gap="md">
                <Crown size={32} color="var(--mantine-color-yellow-6)" />
                <Stack gap={4}>
                  <Group gap="xs">
                    <Text fw={600} size="lg">{PLAN_LABELS[activeSubscription.planType]}</Text>
                    <Badge color="green" variant="light">Активна</Badge>
                  </Group>
                  <Text size="sm" c="dimmed">
                    {activeSubscription.price} {activeSubscription.currency}/мес
                    {activeSubscription.autoRenew && ' • Автопродление включено'}
                  </Text>
                </Stack>
              </Group>
              <Button variant="subtle" color="red" onClick={openConfirmModal}>
                Отменить подписку
              </Button>
            </Group>
          </Card>
        ) : (
          <Card withBorder padding="lg" radius="md">
            <Stack gap="md" align="center">
              <AlertCircle size={40} color="var(--mantine-color-yellow-6)" />
              <Text ta="center" fw={500}>У вас нет активной подписки</Text>
              <Text ta="center" size="sm" c="dimmed">
                Оформите подписку, чтобы получить доступ к платным курсам и материалам
              </Text>
            </Stack>
          </Card>
        )}

        {/* Выбор тарифов */}
        <Text fw={600} size="lg" mt="md">Доступные тарифы</Text>
        
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          {PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id
            const isCurrentPlan = activeSubscription?.planType === plan.id
            
            return (
              <Card 
                key={plan.id}
                withBorder 
                padding="lg" 
                radius="md"
                style={{ 
                  borderColor: isSelected ? COLORS.primary : undefined,
                  background: plan.recommended ? `linear-gradient(135deg, ${COLORS.primary}10 0%, ${COLORS.secondary}10 100%)` : undefined
                }}
              >
                <Stack gap="md">
                  <Group justify="space-between">
                    <Group gap="xs">
                      <Text fw={600}>{plan.name}</Text>
                      {plan.recommended && (
                        <Badge color="yellow" variant="filled" size="sm">Выгодно</Badge>
                      )}
                    </Group>
                    {isCurrentPlan && (
                      <Badge color="green" variant="light">Текущий</Badge>
                    )}
                  </Group>
                  
                  <Group gap={4} align="baseline">
                    <Text size="xl" fw={700}>{plan.price}</Text>
                    <Text size="sm" c="dimmed">₽ / {plan.period}</Text>
                  </Group>
                  
                  <Stack gap={4}>
                    {plan.features.map((feature, idx) => (
                      <Group key={idx} gap="xs">
                        <Check size={14} color="var(--mantine-color-green-6)" />
                        <Text size="sm">{feature}</Text>
                      </Group>
                    ))}
                  </Stack>
                  
                  {isCurrentPlan ? (
                    <Button variant="light" disabled>
                      Текущий тариф
                    </Button>
                  ) : activeSubscription ? (
                    <Button 
                      variant={isSelected ? 'filled' : 'light'}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      {isSelected ? 'Выбрано' : 'Перейти'}
                    </Button>
                  ) : (
                    <Button 
                      variant={isSelected ? 'filled' : 'light'}
                      onClick={() => {
                        setSelectedPlan(plan.id)
                        openConfirmModal()
                      }}
                    >
                      Оформить
                    </Button>
                  )}
                </Stack>
              </Card>
            )
          })}
        </SimpleGrid>

        {/* Информация */}
        <Card withBorder padding="md" radius="md" mt="md">
          <Stack gap="xs">
            <Text fw={500} size="sm">Информация о подписке</Text>
            <Text size="sm" c="dimmed">
              • Подписка даёт доступ к премиум-курсам и материалам
            </Text>
            <Text size="sm" c="dimmed">
              • Вы можете отменить подписку в любое время
            </Text>
            <Text size="sm" c="dimmed">
              • При отмене доступ сохраняется до конца оплаченного периода
            </Text>
          </Stack>
        </Card>
      </Stack>

      {/* Модальное окно подтверждения */}
      <Modal opened={confirmModal} onClose={closeConfirmModal} title="Подтверждение" size="sm">
        <MantineStack>
          {activeSubscription ? (
            <>
              <Text>Вы уверены, что хотите отменить подписку?</Text>
              <Text size="sm" c="dimmed">
                Доступ к премиум-контенту сохранится до конца оплаченного периода.
              </Text>
            </>
          ) : (
            <>
              <Text>Оформить подписку на тариф "{PLANS.find(p => p.id === selectedPlan)?.name}"?</Text>
              <Text size="sm" c="dimmed">
                Стоимость: {PLANS.find(p => p.id === selectedPlan)?.price} ₽
              </Text>
            </>
          )}
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={closeConfirmModal} disabled={processing}>
              Отмена
            </Button>
            {activeSubscription ? (
              <Button color="red" onClick={handleCancel} loading={processing}>
                Отменить подписку
              </Button>
            ) : (
              <Button onClick={handleSubscribe} loading={processing}>
                Оформить подписку
              </Button>
            )}
          </Group>
        </MantineStack>
      </Modal>
    </>
  )
}
