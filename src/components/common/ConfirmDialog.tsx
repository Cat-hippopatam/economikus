// src/components/common/ConfirmDialog.tsx
/**
 * Диалог подтверждения
 */

import { Modal, Button, Group, Text, Stack } from '@mantine/core'
import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  opened: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  color?: string
  loading?: boolean
  danger?: boolean
}

export function ConfirmDialog({
  opened,
  onClose,
  onConfirm,
  title = 'Подтверждение',
  message,
  confirmLabel = 'Подтвердить',
  cancelLabel = 'Отмена',
  color = 'blue',
  loading = false,
  danger = false,
}: ConfirmDialogProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} centered size="sm">
      <Stack gap="md">
        {danger && (
          <Group>
            <AlertTriangle size={24} style={{ color: 'var(--mantine-color-red-6)' }} />
            <Text>{message}</Text>
          </Group>
        )}
        {!danger && <Text>{message}</Text>}
        
        <Group justify="flex-end" mt="md">
          <Button variant="subtle" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button 
            color={danger ? 'red' : color} 
            onClick={onConfirm} 
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
