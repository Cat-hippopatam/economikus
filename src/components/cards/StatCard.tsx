// src/components/cards/StatCard.tsx
/**
 * Карточка статистики для дашборда
 */

import { Paper, Text, Group, ThemeIcon, Badge, Skeleton } from '@mantine/core'
import { Check } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface StatCardConfig {
  key: string
  label: string
  icon: LucideIcon
  color: string
  badge?: string
}

interface StatCardProps {
  config: StatCardConfig
  value?: number
  loading?: boolean
  onClick?: () => void
}

export function StatCard({ config, value, loading, onClick }: StatCardProps) {
  const Icon = config.icon

  if (loading) {
    return <Skeleton height={120} radius="md" />
  }

  return (
    <Paper
      shadow="xs"
      p="md"
      radius="md"
      withBorder
      style={onClick ? { cursor: 'pointer' } : undefined}
      onClick={onClick}
    >
      <Group justify="space-between" mb="xs">
        <Text c="dimmed" size="sm">{config.label}</Text>
        <ThemeIcon variant="light" color={config.color} radius="xl" size="lg">
          <Icon size={18} />
        </ThemeIcon>
      </Group>
      <Text size="xl" fw={700}>
        {value?.toLocaleString() || 0}
      </Text>
      {config.badge && (
        <Badge color="green" variant="light" size="sm" mt="xs">
          <Check size={12} style={{ marginRight: 4 }} />
          {config.badge}
        </Badge>
      )}
    </Paper>
  )
}

/**
 * Группа карточек статистики
 */
interface StatCardsGridProps {
  configs: StatCardConfig[]
  values?: Record<string, number>
  loading?: boolean
  onCardClick?: (key: string) => void
}

export function StatCardsGrid({ 
  configs, 
  values, 
  loading,
  onCardClick 
}: StatCardsGridProps) {
  return (
    <>
      {configs.map((config) => (
        <StatCard
          key={config.key}
          config={config}
          value={values?.[config.key]}
          loading={loading}
          onClick={onCardClick ? () => onCardClick(config.key) : undefined}
        />
      ))}
    </>
  )
}
