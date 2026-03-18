// src/components/common/ColorIndicator.tsx
/**
 * Индикатор цвета (для тегов и т.д.)
 */

import { Box } from '@mantine/core'

interface ColorIndicatorProps {
  color: string
  size?: number
  radius?: number | string
}

export function ColorIndicator({ 
  color, 
  size = 16, 
  radius = 4 
}: ColorIndicatorProps) {
  return (
    <Box
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: color,
        flexShrink: 0,
      }}
    />
  )
}
