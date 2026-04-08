/**
 * Кнопка для скачивания сертификата в PDF
 */

import { Button, LoadingOverlay } from '@mantine/core'
import { Award } from 'lucide-react'
import { usePrintReport, type CertificateData } from '@/hooks/usePrintReport'

interface CertificateButtonProps {
  data: CertificateData
  variant?: 'filled' | 'light' | 'subtle' | 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export function CertificateButton({
  data,
  variant = 'filled',
  size = 'md',
  fullWidth = false,
}: CertificateButtonProps) {
  const { generateCertificate, isGenerating } = usePrintReport()

  const handleClick = async () => {
    try {
      const filename = `certificate-${data.courseTitle.toLowerCase().replace(/\s+/g, '-')}.pdf`
      await generateCertificate(data, filename)
    } catch (error) {
      console.error('Failed to generate certificate:', error)
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <LoadingOverlay visible={isGenerating} zIndex={1000} overlayProps={{ blur: 2 }} />
      <Button
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        leftSection={<Award size={18} />}
        onClick={handleClick}
        disabled={isGenerating}
        color="yellow"
      >
        {isGenerating ? 'Создание сертификата...' : 'Скачать сертификат'}
      </Button>
    </div>
  )
}
