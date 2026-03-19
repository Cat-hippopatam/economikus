// src/components/author/AuthorLayout.tsx
/**
 * Layout для панели автора с боковой навигацией
 * Переиспользует паттерны из AdminLayout
 */

import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { 
  AppShell, 
  Burger, 
  Group, 
  Text, 
  NavLink as MantineNavLink,
  ScrollArea,
  ActionIcon,
  Tooltip,
  Badge,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { 
  ChevronRight, 
  User,
} from 'lucide-react'
import { AUTHOR_NAVIGATION, AUTHOR_LINKS } from '@/constants/author'
import { useAuth } from '@/hooks'
import type { LucideIcon } from 'lucide-react'

// Стиль для активной ссылки
const getNavLinkStyles = (isActive: boolean) => ({
  root: {
    borderRadius: '8px',
    marginBottom: '4px',
    backgroundColor: isActive ? 'var(--mantine-color-blue-0)' : 'transparent',
    '&:hover': {
      backgroundColor: isActive ? 'var(--mantine-color-blue-0)' : 'var(--mantine-color-gray-0)',
    },
  },
  label: {
    fontWeight: isActive ? 600 : 400,
    color: isActive ? 'var(--mantine-color-blue-7)' : 'inherit',
  },
})

export function AuthorLayout() {
  const [opened, { toggle }] = useDisclosure()
  const location = useLocation()
  const { user, profile } = useAuth()

  // Проверка активной ссылки
  const isActive = (path: string) => {
    if (path === '/author/dashboard') {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ 
        width: 260, 
        breakpoint: 'sm', 
        collapsed: { mobile: !opened } 
      }}
      padding="md"
    >
      {/* Header */}
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Text fw={700} size="lg">
              Панель автора
            </Text>
          </Group>
          
          <Group gap="xs">
            <Tooltip label="Мой профиль">
              <ActionIcon
                variant="light"
                size="lg"
                component="a"
                href={`/user/${profile?.nickname}`}
              >
                <User size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </AppShell.Header>

      {/* Sidebar */}
      <AppShell.Navbar p="md">
        <AppShell.Section grow component={ScrollArea}>
          {/* Профиль */}
          <Group mb="lg" p="sm" style={{ borderRadius: '8px', backgroundColor: 'var(--mantine-color-gray-0)' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Text size="sm" fw={500} truncate>
                {profile?.displayName || user?.email}
              </Text>
              <Badge size="xs" color="blue" variant="light" mt={4}>
                Автор
              </Badge>
            </div>
          </Group>

          {/* Основная навигация */}
          <Text size="xs" c="dimmed" fw={500} mb="xs" px="sm">
            МЕНЮ
          </Text>
          
          {AUTHOR_NAVIGATION.map((item) => {
            const Icon = item.icon as LucideIcon
            const active = isActive(item.path)
            
            return (
              <MantineNavLink
                key={item.path}
                component={NavLink}
                to={item.path}
                label={item.label}
                leftSection={<Icon size={18} />}
                rightSection={active ? <ChevronRight size={14} /> : null}
                active={active}
                styles={getNavLinkStyles(active)}
              />
            )
          })}

          {/* Дополнительные ссылки */}
          <Text size="xs" c="dimmed" fw={500} mt="xl" mb="xs" px="sm">
            ДОПОЛНИТЕЛЬНО
          </Text>
          
          <MantineNavLink
            component={NavLink}
            to={AUTHOR_LINKS.settings.path}
            label={AUTHOR_LINKS.settings.label}
            leftSection={<AUTHOR_LINKS.settings.icon size={18} />}
            styles={getNavLinkStyles(false)}
          />
        </AppShell.Section>
      </AppShell.Navbar>

      {/* Main content */}
      <AppShell.Main bg="gray.0">
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
