import { Paper, Text, Stack, Progress, Group } from '@mantine/core'

interface KakeboStatsProps {
  title: string
  value: number | string
  subtitle?: string
  color?: string
  percent?: number
  showProgress?: boolean
}

export function KakeboStats({ title, value, subtitle, color = 'gray', percent = 0, showProgress = false }: KakeboStatsProps) {
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
        {showProgress && (
          <Group gap="xs" align="center" style={{ marginTop: 8 }}>
            <Progress 
              value={percent} 
              size="sm" 
              color={percent > 100 ? 'red' : percent > 80 ? 'orange' : 'green'}
              radius="sm"
            />
            <Text size="xs" fw={600} style={{ minWidth: 40 }}>
              {percent.toFixed(0)}%
            </Text>
          </Group>
        )}
      </Stack>
    </Paper>
  )
}
