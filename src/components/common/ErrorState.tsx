// src/components/common/ErrorState.tsx
/**
 * Компонент состояния ошибки
 */

import { Center, Box, Text, Button, Alert } from '@mantine/core'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorStateProps {
  message: string
  description?: string
  onRetry?: () => void
}

export function ErrorState({ message, description, onRetry }: ErrorStateProps) {
  return (
    <Center py="xl">
      <Box ta="center" maw={400}>
        <AlertCircle size={48} style={{ opacity: 0.5, color: 'var(--mantine-color-red-6)' }} />
        <Text c="red" size="lg" mt="md">{message}</Text>
        {description && (
          <Text c="dimmed" size="sm" mt="xs">{description}</Text>
        )}
        {onRetry && (
          <Button 
            mt="md" 
            variant="light" 
            color="red"
            leftSection={<RefreshCw size={16} />}
            onClick={onRetry}
          >
            Попробовать снова
          </Button>
        )}
      </Box>
    </Center>
  )
}

/**
 * Inline ошибка
 */
export function ErrorAlert({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <Alert 
      color="red" 
      variant="light" 
      icon={<AlertCircle size={16} />}
      title="Ошибка"
    >
      {message}
      {onRetry && (
        <Button size="xs" variant="subtle" color="red" mt="xs" onClick={onRetry}>
          Попробовать снова
        </Button>
      )}
    </Alert>
  )
}
