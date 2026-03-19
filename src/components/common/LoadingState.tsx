// src/components/common/LoadingState.tsx
/**
 * Компонент состояния загрузки
 */

import { Skeleton, Stack, Text, Center, Box } from '@mantine/core'

interface LoadingStateProps {
  rows?: number
  height?: number
  radius?: number | string
  text?: string
  centered?: boolean
}

export function LoadingState({ 
  rows = 5, 
  height = 60, 
  radius = 'md',
  text,
  centered = false
}: LoadingStateProps) {
  if (centered || text) {
    return (
      <Center py="xl">
        <Box ta="center">
          <Stack gap="sm" align="center">
            <Skeleton height={60} width={60} radius="xl" />
            {text && <Text c="dimmed">{text}</Text>}
          </Stack>
        </Box>
      </Center>
    )
  }

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
