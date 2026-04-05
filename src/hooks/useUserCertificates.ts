// src/hooks/useUserCertificates.ts
import { useState, useEffect, useCallback } from 'react'
import { APP_CONFIG } from '../constants'

export interface Certificate {
  id: string
  certificateNumber: string
  issuedAt: string
  imageUrl?: string
  pdfUrl?: string
  course: {
    id: string
    title: string
    slug: string
  }
}

interface UseUserCertificatesResponse {
  items: Certificate[]
  loading: boolean
  error: string | null
  fetchCertificates: () => Promise<void>
}

export function useUserCertificates(): UseUserCertificatesResponse {
  const [items, setItems] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCertificates = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${APP_CONFIG.apiUrl}/user/certificates`, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Не удалось загрузить сертификаты')
      }

      const data = await response.json()
      setItems(data.items || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCertificates()
  }, [fetchCertificates])

  return {
    items,
    loading,
    error,
    fetchCertificates
  }
}
