import { Paper, Text, Stack, Progress, Group, rem } from '@mantine/core'

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
    <Paper p={{ base: 'xs', md: 'md' }} withBorder radius="md" style={{ borderLeft: `4px solid var(--mantine-color-${color}-6)` }}>
      <Stack gap="xs">
        <Text c="dimmed" size="xs" fw={500}>
          {title}
        </Text>
        <Text size="xl" fw={700} c={color} style={{ fontSize: rem(20) }}>
          {typeof value === 'number' ? `${value.toFixed(0)} у.е.` : value}
        </Text>
        {subtitle && (
          <Text c="dimmed" size="xs" lineClamp={2}>
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
              flex={1}
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
