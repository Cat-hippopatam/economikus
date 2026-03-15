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
  Calculator,
  Folder
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface User {
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
  const [user, setUser] = useState<User | null>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Проверяем авторизацию при загрузке
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

  const navLinks = [
    { to: '/catalog', label: 'Каталог', icon: Folder },
    { to: '/courses', label: 'Курсы', icon: BookOpen },
    { to: '/calculators', label: 'Калькуляторы', icon: Calculator },
  ]

  return (
    <header 
      style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100,
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : '#fff',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: '1px solid #E9ECEF',
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
            <BookOpen size={28} color="#2A9D8F" />
            <Text 
              fw={700} 
              size="xl" 
              style={{ color: '#264653' }}
            >
              Экономикус
            </Text>
          </Link>

          {/* Навигация - десктоп */}
          <Group gap="sm" visibleFrom="sm">
            {navLinks.map((link) => (
              <Button
                key={link.to}
                variant="subtle"
                component={Link}
                to={link.to}
                leftSection={<link.icon size={18} />}
                style={{ color: '#264653' }}
              >
                {link.label}
              </Button>
            ))}
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
                      <Text size="sm" style={{ color: '#264653' }}>
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
                    to="/profile"
                  >
                    Профиль
                  </Menu.Item>
                  <Menu.Item 
                    leftSection={<Settings size={16} />}
                    component={Link}
                    to="/profile/settings"
                  >
                    Настройки
                  </Menu.Item>
                  
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
                  style={{ color: '#264653' }}
                >
                  Войти
                </Button>
                <Button 
                  component={Link} 
                  to="/register"
                  style={{ 
                    backgroundColor: '#2A9D8F', 
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
          {navLinks.map((link) => (
            <Button
              key={link.to}
              variant="subtle"
              component={Link}
              to={link.to}
              onClick={close}
              leftSection={<link.icon size={18} />}
              fullWidth
              justify="flex-start"
            >
              {link.label}
            </Button>
          ))}
          
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
                to="/profile"
                onClick={close}
                leftSection={<User size={18} />}
                fullWidth
                justify="flex-start"
              >
                Профиль
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
                style={{ backgroundColor: '#2A9D8F', color: '#fff' }}
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
