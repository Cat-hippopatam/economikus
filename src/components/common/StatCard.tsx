// src/components/common/StatCard.tsx
/**
 * Простая карточка статистики
 */

import { Paper, Text, Group, ThemeIcon, Skeleton } from '@mantine/core'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value?: number | string
  icon?: LucideIcon
  color?: string
  loading?: boolean
  onClick?: () => void
}

export function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  color = 'blue',
  loading,
  onClick 
}: StatCardProps) {
  if (loading) {
    return <Skeleton height={100} radius="md" />
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
        <Text c="dimmed" size="xs" tt="uppercase" fw={500}>
          {label}
        </Text>
        {Icon && (
          <ThemeIcon variant="light" color={color} radius="md" size="lg">
            <Icon size={18} />
          </ThemeIcon>
        )}
      </Group>
      <Text size="xl" fw={700}>
        {typeof value === 'number' ? value.toLocaleString() : value ?? 0}
      </Text>
    </Paper>
  )
}
