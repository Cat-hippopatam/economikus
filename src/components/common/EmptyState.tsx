// src/components/common/EmptyState.tsx
/**
 * Компонент пустого состояния
 */

import { Center, Box, Text, Button } from '@mantine/core'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  message: string
  description?: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ 
  message, 
  description, 
  icon, 
  action 
}: EmptyStateProps) {
  return (
    <Center py="xl">
      <Box ta="center">
        <Box mb="md" style={{ opacity: 0.5 }}>
          {icon || <Inbox size={48} />}
        </Box>
        <Text c="dimmed" size="lg">{message}</Text>
        {description && (
          <Text c="dimmed" size="sm" mt="xs">{description}</Text>
        )}
        {action && (
          <Button mt="md" variant="light" onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </Box>
    </Center>
  )
}
