// src/components/common/LoadingState.tsx
/**
 * Компонент состояния загрузки
 */

import { Skeleton, Stack } from '@mantine/core'

interface LoadingStateProps {
  rows?: number
  height?: number
  radius?: number | string
}

export function LoadingState({ 
  rows = 5, 
  height = 60, 
  radius = 'md' 
}: LoadingStateProps) {
  return (
    <Stack gap="sm">
      {[...Array(rows)].map((_, i) => (
        <Skeleton key={i} height={height} radius={radius} />
      ))}
    </Stack>
  )
}

/**
 * Компонент загрузки карточки
 */
export function LoadingCard({ height = 120 }: { height?: number }) {
  return <Skeleton height={height} radius="md" />
}

/**
 * Компонент загрузки таблицы
 */
export function LoadingTable({ rows = 5 }: { rows?: number }) {
  return <LoadingState rows={rows} height={60} />
}
