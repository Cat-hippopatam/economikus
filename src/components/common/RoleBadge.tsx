// src/components/common/RoleBadge.tsx
/**
 * Бейдж роли пользователя
 */

import { Badge } from '@mantine/core'
import { ROLE_COLORS, ROLE_LABELS } from '@/constants'

interface RoleBadgeProps {
  role: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'light' | 'filled' | 'outline'
}

export function RoleBadge({ role, size = 'md', variant = 'light' }: RoleBadgeProps) {
  const color = ROLE_COLORS[role as keyof typeof ROLE_COLORS] || 'gray'
  const label = ROLE_LABELS[role as keyof typeof ROLE_LABELS] || role

  return (
    <Badge color={color} size={size} variant={variant}>
      {label}
    </Badge>
  )
}
