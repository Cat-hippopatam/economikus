import { Box, Image, type ImageProps } from '@mantine/core'
import { useState } from 'react'

// Типы медиа для разных placeholder'ов
export type MediaType = 'avatar' | 'cover' | 'course' | 'lesson' | 'certificate' | 'default'

interface MediaImageProps extends Omit<ImageProps, 'alt'> {
  /** Тип медиа для выбора placeholder'а */
  mediaType?: MediaType
  /** Размер placeholder'а (для иконок) */
  placeholderSize?: number
  /** Дополнительный класс для кастомизации */
  className?: string
  /** Альтернативный текст */
  alt?: string
}

// Градиенты по умолчанию для разных типов
const DEFAULT_GRADIENTS: Record<MediaType, string> = {
  avatar: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  cover: 'linear-gradient(135deg, #264653 0%, #2A9D8F 100%)',
  course: 'linear-gradient(135deg, #264653 0%, #2A9D8F 100%)',
  lesson: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  certificate: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
  default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
}

// SVG иконки для разных типов
const PLACEHOLDER_ICONS: Record<MediaType, React.ReactNode> = {
  avatar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  cover: (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  course: (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  ),
  lesson: (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  certificate: (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
}

/**
 * Универсальный компонент для отображения медиа-изображений с fallback
 * Автоматически показывает placeholder при ошибке загрузки или отсутствии изображения
 */
export function MediaImage({
  src,
  mediaType = 'default',
  placeholderSize = 48,
  className,
  style,
  alt = 'Media',
  ...props
}: MediaImageProps) {
  const [hasError, setHasError] = useState(false)

  // Если изображения нет или произошла ошибка - показываем placeholder
  if (!src || hasError) {
    return (
      <Box
        className={className}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: DEFAULT_GRADIENTS[mediaType],
          ...style,
        }}
        {...props}
      >
        <Box
          style={{
            width: placeholderSize,
            height: placeholderSize,
            opacity: 0.5,
          }}
        >
          {PLACEHOLDER_ICONS[mediaType]}
        </Box>
      </Box>
    )
  }

  // Если изображение есть - рендерим его с обработкой ошибки
  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={() => setHasError(true)}
      {...props}
    />
  )
}
