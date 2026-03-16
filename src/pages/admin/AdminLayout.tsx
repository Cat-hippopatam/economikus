import { ReactNode, useEffect, useState } from 'react'
import { AppShell, NavLink, Box, Text, Avatar, Menu, Group, Badge } from '@mantine/core'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { LogOut, User, Settings } from 'lucide-react'
import { api } from '@/lib/api'
import { ADMIN_NAV_LINKS, APP_CONFIG, COLORS } from '@/constants'

interface AdminLayoutProps {
  children?: ReactNode
}

interface Profile {
  id: string
  nickname: string
  displayName: string
  avatarUrl: string | null
  role: string
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    api.get('/user/me').then(res => {
      if (res.data.user.role !== 'ADMIN') {
        navigate('/')
      } else {
        setProfile({
          id: res.data.user.profile.id,
          nickname: res.data.user.profile.nickname,
          displayName: res.data.user.profile.displayName,
          avatarUrl: res.data.user.profile.avatarUrl,
          role: res.data.user.role
        })
      }
    }).catch(() => {
      navigate('/login')
    })
  }, [navigate])

  const handleLogout = async () => {
    await api.post('/auth/logout')
    navigate('/login')
  }

  return (
    <AppShell
      padding="md"
      navbar={{
        width: { base: collapsed ? 80 : 240 },
        breakpoint: 'sm',
        collapsed: { mobile: collapsed }
      }}
      header={{ height: 60 }}
    >
      <AppShell.Header p="sm" bg="gray.0">
        <Group justify="space-between" h="100%">
          <Group>
            <Text fw={700} size="lg" c="blue.6">
              {APP_CONFIG.name} Admin
            </Text>
            <Badge color="orange" variant="light" size="sm">
              Админ-панель
            </Badge>
          </Group>

          {profile && (
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Group style={{ cursor: 'pointer' }}>
                  <Avatar src={profile.avatarUrl} alt={profile.displayName} radius="xl" size="sm" />
                  <Text size="sm">{profile.displayName}</Text>
                </Group>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<User size={14} />} onClick={() => navigate('/profile')}>
                  Мой профиль
                </Menu.Item>
                <Menu.Item leftSection={<Settings size={14} />} onClick={() => navigate('/')}>
                  На сайт
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item color="red" leftSection={<LogOut size={14} />} onClick={handleLogout}>
                  Выйти
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="xs" bg="gray.0">
        <Box component="nav" py="sm">
          {ADMIN_NAV_LINKS.map((item) => {
            const IconComponent = item.icon
            return (
              <NavLink
                key={item.to}
                label={!collapsed ? item.label : ''}
                leftSection={<IconComponent size={20} />}
                active={location.pathname === item.to}
                onClick={() => navigate(item.to)}
                variant="filled"
                styles={{
                  root: { borderRadius: 8, marginBottom: 4 },
                }}
              />
            )
          })}
        </Box>

        <Box mt="auto" p="xs">
          <NavLink
            label={!collapsed ? 'Свернуть' : ''}
            leftSection={<Settings size={20} />}
            onClick={() => setCollapsed(!collapsed)}
            variant="subtle"
          />
        </Box>
      </AppShell.Navbar>

      <AppShell.Main bg="gray.1">
        {children || <Outlet />}
      </AppShell.Main>
    </AppShell>
  )
}
