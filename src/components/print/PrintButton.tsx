/**
 * Кнопка для скачивания отчёта в PDF
 */

import { Button, LoadingOverlay } from '@mantine/core'
import { FileDown, FileText } from 'lucide-react'
import { usePrintReport, type ReportData } from '@/hooks/usePrintReport'

interface PrintButtonProps {
  data: ReportData
  filename?: string
  variant?: 'filled' | 'light' | 'subtle' | 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export function PrintButton({
  data,
  filename = 'report.pdf',
  variant = 'light',
  size = 'sm',
  fullWidth = false,
}: PrintButtonProps) {
  const { generatePDF, isGenerating } = usePrintReport()

  const handleClick = async () => {
    try {
      await generatePDF(data, filename)
    } catch (error) {
      console.error('Failed to generate PDF:', error)
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <LoadingOverlay visible={isGenerating} zIndex={1000} overlayProps={{ blur: 2 }} />
      <Button
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        leftSection={variant === 'filled' ? <FileText size={16} /> : <FileDown size={16} />}
        onClick={handleClick}
        disabled={isGenerating}
      >
        {isGenerating ? 'Создание PDF...' : 'Скачать отчёт'}
      </Button>
    </div>
  )
}
