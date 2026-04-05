// src/components/common/StatusBadge.tsx
/**
 * Переиспользуемый бейдж статуса
 */

import { Badge } from '@mantine/core'
import { STATUS_CONFIG, type StatusType } from '@/constants/status'

interface StatusBadgeProps {
  status: string
  type?: StatusType
  size?: 'sm' | 'md' | 'lg'
  variant?: 'light' | 'filled' | 'outline'
}

interface StatusConfig {
  color: string
  label: string
}

export function StatusBadge({ 
  status, 
  type = 'content', 
  size = 'md',
  variant = 'light' 
}: StatusBadgeProps) {
  // Получаем конфиг для нужного типа
  const typeConfig = STATUS_CONFIG[type] as Record<string, StatusConfig>
  // Ищем статус в конфиге
  const config = typeConfig?.[status]
  
  if (!config) {
    return <Badge size={size}>{status}</Badge>
  }

  return (
    <Badge color={config.color} size={size} variant={variant}>
      {config.label}
    </Badge>
  )
}
