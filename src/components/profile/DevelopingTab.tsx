// src/components/profile/DevelopingTab.tsx
import { Stack, Card, Text, ThemeIcon, Group } from '@mantine/core'
import { Construction } from 'lucide-react'

interface DevelopingTabProps {
  title: string
  description?: string
}

export function DevelopingTab({ title, description }: DevelopingTabProps) {
  return (
    <Card withBorder padding="xl" radius="md">
      <Stack gap="lg" align="center">
        <ThemeIcon 
          size={80} 
          radius="xl" 
          variant="light" 
          color="yellow"
        >
          <Construction size={40} />
        </ThemeIcon>
        
        <Stack gap="xs" align="center">
          <Text size="xl" fw={600} ta="center">
            {title}
          </Text>
          <Text c="dimmed" ta="center" maw={400}>
            {description || 'Этот раздел находится в разработке. Скоро здесь появится новый контент!'}
          </Text>
        </Stack>
        
        <Card withBorder padding="md" radius="md" bg="gray.0">
          <Stack gap="xs">
            <Text size="sm" fw={500} c="dimmed">Что скоро будет:</Text>
            <Group gap="xs">
              <Text size="sm">•</Text>
              <Text size="sm">Интересные материалы</Text>
            </Group>
            <Group gap="xs">
              <Text size="sm">•</Text>
              <Text size="sm">Полезные инструменты</Text>
            </Group>
            <Group gap="xs">
              <Text size="sm">•</Text>
              <Text size="sm">Эксклюзивный контент</Text>
            </Group>
          </Stack>
        </Card>
      </Stack>
    </Card>
  )
}
