import { Paper, Text, Stack } from '@mantine/core'

interface KakeboStatsProps {
  title: string
  value: number | string
  subtitle?: string
  color?: string
}

export function KakeboStats({ title, value, subtitle, color = 'gray' }: KakeboStatsProps) {
  return (
    <Paper p="md" withBorder radius="md" style={{ borderLeft: `4px solid var(--mantine-color-${color}-6)` }}>
      <Stack gap="xs">
        <Text c="dimmed" size="sm" fw={500}>
          {title}
        </Text>
        <Text size="xl" fw={700} c={color}>
          {typeof value === 'number' ? `${value.toFixed(0)} у.е.` : value}
        </Text>
        {subtitle && (
          <Text c="dimmed" size="xs">
            {subtitle}
          </Text>
        )}
      </Stack>
    </Paper>
  )
}
