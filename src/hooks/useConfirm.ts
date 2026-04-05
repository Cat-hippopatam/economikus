// src/hooks/useConfirm.ts
/**
 * Хук для диалогов подтверждения
 */

import { useState, useCallback } from 'react'

interface UseConfirmOptions {
  onConfirm: () => Promise<void> | void
  title?: string
  message?: string
}

interface UseConfirmReturn {
  opened: boolean
  loading: boolean
  open: () => void
  close: () => void
  confirm: () => Promise<void>
  title: string | undefined
  message: string | undefined
}

export function useConfirm(options: UseConfirmOptions): UseConfirmReturn {
  const { onConfirm, title, message } = options
  
  const [opened, setOpened] = useState(false)
  const [loading, setLoading] = useState(false)

  const open = useCallback(() => {
    setOpened(true)
  }, [])

  const close = useCallback(() => {
    setOpened(false)
  }, [])

  const confirm = useCallback(async () => {
    setLoading(true)
    try {
      await onConfirm()
      close()
    } finally {
      setLoading(false)
    }
  }, [onConfirm, close])

  return {
    opened,
    loading,
    open,
    close,
    confirm,
    title,
    message,
  }
}

/**
 * Хук для подтверждения с ID (для удаления и т.д.)
 */
interface UseConfirmWithIdOptions {
  onConfirm: (id: string) => Promise<void> | void
  title?: string
  message?: string
}

interface UseConfirmWithIdReturn {
  opened: boolean
  loading: boolean
  targetId: string | null
  open: (id: string) => void
  close: () => void
  confirm: () => Promise<void>
  title: string | undefined
  message: string | undefined
}

export function useConfirmWithId(options: UseConfirmWithIdOptions): UseConfirmWithIdReturn {
  const { onConfirm, title, message } = options
  
  const [opened, setOpened] = useState(false)
  const [loading, setLoading] = useState(false)
  const [targetId, setTargetId] = useState<string | null>(null)

  const open = useCallback((id: string) => {
    setTargetId(id)
    setOpened(true)
  }, [])

  const close = useCallback(() => {
    setOpened(false)
    setTargetId(null)
  }, [])

  const confirm = useCallback(async () => {
    if (!targetId) return
    
    setLoading(true)
    try {
      await onConfirm(targetId)
      close()
    } finally {
      setLoading(false)
    }
  }, [targetId, onConfirm, close])

  return {
    opened,
    loading,
    targetId,
    open,
    close,
    confirm,
    title,
    message,
  }
}
