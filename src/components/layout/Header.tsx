// src/components/layout/Header.tsx
import { Link } from 'react-router-dom'
import { 
  Group, 
  Button, 
  Container, 
  Menu, 
  Text, 
  Avatar, 
  Burger, 
  Drawer, 
  Stack, 
  Divider 
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { 
  BookOpen, 
  User, 
  LogOut, 
  Settings, 
  ChevronDown,
  PenTool
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { NAV_LINKS, APP_CONFIG, COLORS } from '@/constants'

interface UserData {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  profile?: {
    nickname: string
    displayName: string
    avatarUrl: string
  }
}

export function Header() {
  const [opened, { toggle, close }] = useDisclosure(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => data?.user ? setUser(data.user) : null)
      .catch(() => setUser(null))
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { 
      method: 'POST', 
      credentials: 'include' 
    })
    setUser(null)
    window.location.href = '/'
  }

  return (
    <header 
      style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100,
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : '#fff',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: `1px solid ${COLORS.border}`,
        transition: 'all 0.2s ease'
      }}
    >
      <Container size="lg">
        <Group h={60} justify="space-between">
          {/* Логотип */}
          <Link 
            to="/" 
            style={{ 
              textDecoration: 'none', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8 
            }}
          >
            <BookOpen size={28} color={COLORS.primary} />
            <Text 
              fw={700} 
              size="xl" 
              style={{ color: COLORS.secondary }}
            >
              {APP_CONFIG.name}
            </Text>
          </Link>

          {/* Навигация - десктоп */}
          <Group gap="sm" visibleFrom="sm">
            {NAV_LINKS.map((link) => {
              const IconComponent = link.icon
              return (
                <Button 
                  key={link.to}
                  variant="subtle" 
                  component={Link} 
                  to={link.to}
                  leftSection={<IconComponent size={18} />}
                  style={{ color: COLORS.secondary }}
                >
                  {link.label}
                </Button>
              )
            })}
          </Group>

          {/* Пользовательское меню - десктоп */}
          <Group visibleFrom="sm">
            {user ? (
              <Menu position="bottom-end" shadow="md" width={200}>
                <Menu.Target>
                  <Button 
                    variant="subtle" 
                    style={{ padding: '4px 8px' }}
                  >
                    <Group gap="xs">
                      <Avatar 
                        src={user.profile?.avatarUrl} 
                        size="sm" 
                        radius="xl"
                        alt={user.profile?.displayName || user.firstName}
                      >
                        {user.firstName[0]}
                      </Avatar>
                      <Text size="sm" style={{ color: COLORS.secondary }}>
                        {user.profile?.displayName || `${user.firstName} ${user.lastName}`}
                      </Text>
                      <ChevronDown size={16} />
                    </Group>
                  </Button>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>Аккаунт</Menu.Label>
                  <Menu.Item 
                    leftSection={<User size={16} />}
                    component={Link}
                    to={`/user/${user.profile?.nickname || 'me'}`}
                  >
                    Мой профиль
                  </Menu.Item>
                  <Menu.Item 
                    leftSection={<Settings size={16} />}
                    component={Link}
                    to="/profile/settings"
                  >
                    Настройки
                  </Menu.Item>
                  
                  {user.role === 'USER' && (
                    <Menu.Item 
                      leftSection={<PenTool size={16} />}
                      component={Link}
                      to="/become-author"
                    >
                      Стать автором
                    </Menu.Item>
                  )}
                  
                  {(user.role === 'AUTHOR' || user.role === 'ADMIN' || user.role === 'MODERATOR') && (
                    <Menu.Item 
                      leftSection={<PenTool size={16} />}
                      component={Link}
                      to="/author/dashboard"
                    >
                      Панель автора
                    </Menu.Item>
                  )}
                  
                  {user.role === 'ADMIN' && (
                    <>
                      <Menu.Divider />
                      <Menu.Label>Администрирование</Menu.Label>
                      <Menu.Item 
                        leftSection={<Settings size={16} />}
                        component={Link}
                        to="/admin"
                      >
                        Админ-панель
                      </Menu.Item>
                    </>
                  )}
                  
                  <Menu.Divider />
                  <Menu.Item 
                    leftSection={<LogOut size={16} />}
                    color="red"
                    onClick={handleLogout}
                  >
                    Выйти
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Group gap="xs">
                <Button 
                  variant="subtle" 
                  component={Link} 
                  to="/login"
                  style={{ color: COLORS.secondary }}
                >
                  Войти
                </Button>
                <Button 
                  component={Link} 
                  to="/register"
                  style={{ 
                    backgroundColor: COLORS.primary, 
                    color: '#fff' 
                  }}
                >
                  Регистрация
                </Button>
              </Group>
            )}
          </Group>
              
          {/* Мобильное меню */}
          <Burger 
            opened={opened} 
            onClick={toggle} 
            hiddenFrom="sm"
            size="sm"
          />
        </Group>
      </Container>

      {/* Drawer для мобильного меню */}
      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        size="100%"
        padding="md"
        title={
          <Text fw={700} size="lg">Меню</Text>
        }
      >
        <Stack gap="md">
          {/* Навигация */}
          {NAV_LINKS.map((link) => {
            const IconComponent = link.icon
            return (
              <Button
                key={link.to}
                variant="subtle"
                component={Link}
                to={link.to}
                onClick={close}
                leftSection={<IconComponent size={18} />}
                fullWidth
                justify="flex-start"
              >
                {link.label}
              </Button>
            )
          })}
          
          <Divider />
          
          {/* Пользователь */}
          {user ? (
            <>
              <Group>
                <Avatar 
                  src={user.profile?.avatarUrl} 
                  size="md" 
                  radius="xl"
                >
                  {user.firstName[0]}
                </Avatar>
                <div>
                  <Text fw={500}>
                    {user.profile?.displayName || `${user.firstName} ${user.lastName}`}
                  </Text>
                  <Text size="sm" c="dimmed">{user.email}</Text>
                </div>
              </Group>
              
              <Button
                variant="subtle"
                component={Link}
                to={`/user/${user.profile?.nickname || 'me'}`}
                onClick={close}
                leftSection={<User size={18} />}
                fullWidth
                justify="flex-start"
              >
                Мой профиль
              </Button>
              <Button
                variant="subtle"
                component={Link}
                to="/profile/settings"
                onClick={close}
                leftSection={<Settings size={18} />}
                fullWidth
                justify="flex-start"
              >
                Настройки
              </Button>
              
              {user.role === 'USER' && (
                <Button
                  variant="subtle"
                  component={Link}
                  to="/become-author"
                  onClick={close}
                  leftSection={<PenTool size={18} />}
                  fullWidth
                  justify="flex-start"
                >
                  Стать автором
                </Button>
              )}
              
              {(user.role === 'AUTHOR' || user.role === 'ADMIN' || user.role === 'MODERATOR') && (
                <Button
                  variant="subtle"
                  component={Link}
                  to="/author/dashboard"
                  onClick={close}
                  leftSection={<PenTool size={18} />}
                  fullWidth
                  justify="flex-start"
                >
                  Панель автора
                </Button>
              )}
              
              <Button
                variant="subtle"
                color="red"
                onClick={() => { handleLogout(); close(); }}
                leftSection={<LogOut size={18} />}
                fullWidth
                justify="flex-start"
              >
                Выйти
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="subtle"
                component={Link}
                to="/login"
                onClick={close}
                fullWidth
              >
                Войти
              </Button>
              <Button
                component={Link}
                to="/register"
                onClick={close}
                fullWidth
                style={{ backgroundColor: COLORS.primary, color: '#fff' }}
              >
                Регистрация
              </Button>
            </>
          )}
        </Stack>
      </Drawer>
    </header>
  )
}
