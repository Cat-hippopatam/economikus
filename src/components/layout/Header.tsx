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
 Divider,
 Modal,
 Textarea
} from '@mantine/core'
import { useForm } from 'react-hook-form'
import { useDisclosure } from '@mantine/hooks'
import { 
 BookOpen, 
 User, 
 LogOut, 
 Settings, 
 ChevronDown,
 PenTool,
 Trash2
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
 const [deletionModalOpened, { open: openDeletionModal, close: closeDeletionModal }] = useDisclosure(false)
 const [user, setUser] = useState<UserData | null>(null)
 const [scrolled, setScrolled] = useState(false)
 const [submitting, setSubmitting] = useState(false)

 const { register, handleSubmit, reset } = useForm<{ reason: string }>()

 const handleSubmitDeletion = async (data: { reason: string }) => {
 setSubmitting(true)
 try {
 const res = await fetch('/api/user/account-deletion', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 credentials: 'include',
 body: JSON.stringify(data)
 })
     
 if (res.ok) {
 closeDeletionModal()
 reset()
 alert('Заявка на удаление аккаунта подана. Мы свяжемся с вами по email.')
 } else {
 const response = await res.json()
 alert(response.error || 'Ошибка при подаче заявки')
 }
 } catch {
 alert('Ошибка соединения')
 } finally {
 setSubmitting(false)
 }
 }

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

 {/* Навигация - десктоп (только для больших экранов) */}
<Group gap="xs" visibleFrom="lg">
 {NAV_LINKS.filter(link => 
 ['/catalog', '/calculators', '/info'].includes(link.to)
 ).map((link) => {
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

 {/* Меню "Ещё" - только для больших экранов (Group уже ограничивает) */}
<Menu position="bottom-end" shadow="md" width={180}>
<Menu.Target>
<Button 
 variant="subtle" 
 style={{ color: COLORS.secondary }}
 rightSection={<ChevronDown size={14} />}
 >
 Ещё
</Button>
</Menu.Target>
<Menu.Dropdown>
 {NAV_LINKS.filter(link => 
 ['/tools', '/postulates'].includes(link.to)
 ).map((link) => {
 const IconComponent = link.icon
 return (
<Menu.Item 
 key={link.to}
 component={Link}
 to={link.to}
 leftSection={<IconComponent size={16} />}
 >
 {link.label}
</Menu.Item>
 )
 })}
</Menu.Dropdown>
</Menu>
</Group>

 {/* Кнопки входа/регистрации - видны только на больших экранах */}
<Group gap="xs" visibleFrom="lg">
 {user ? (
<Menu position="bottom-end" shadow="md" width={200}>
<Menu.Target>
<Button 
 variant="subtle" 
 style={{ padding: '4px8px' }}
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
 leftSection={<Trash2 size={16} />}
 color="red"
 onClick={openDeletionModal}
 >
 Отказаться от условий
</Menu.Item>
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
     
 {/* Бургер меню - для экранов меньше lg */}
<Burger 
 opened={opened} 
 onClick={toggle} 
 hiddenFrom="lg"
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

 {/* Модальное окно удаления аккаунта */}
<Modal
 opened={deletionModalOpened}
 onClose={closeDeletionModal}
 title={<Text fw={600} size="lg">Отказ от условий использования</Text>}
 centered
 >
<Text size="sm" c="dimmed" mb="md">
 Вы собираетесь подать заявку на удаление вашего аккаунта. 
 После подачи заявки администратор свяжется с вами по email для подтверждения.
</Text>
<Text size="sm" c="dimmed" mb="md">
 При удалении аккаунта будут удалены:
</Text>
<Text size="sm" component="ul" pl="md" c="dimmed">
<li>Ваш профиль и все данные</li>
<li>История обучения</li>
<li>Избранное</li>
<li>Сертификаты</li>
<li>Комментарии и реакции</li>
</Text>
        
<form onSubmit={handleSubmit(handleSubmitDeletion)}>
<Textarea
 label="Причина (необязательно)"
 placeholder="Почему вы решили удалить аккаунт?"
 {...register('reason')}
 mb="md"
 />
          
<Group justify="flex-end">
<Button variant="subtle" onClick={closeDeletionModal}>
 Отмена
</Button>
<Button 
 type="submit" 
 color="red" 
 loading={submitting}
 >
 Подать заявку
</Button>
</Group>
</form>
</Modal>
</header>
 )
}
