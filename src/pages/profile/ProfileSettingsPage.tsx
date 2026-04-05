// src/pages/profile/ProfileSettingsPage.tsx
/**
 * Страница настроек профиля
 * Рефакторинг: использует AvatarUploader, ProtectedRoute
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container, Paper, Title, Stack, TextInput, Textarea, Button, Group, Text, Tabs, PasswordInput, Notification, Skeleton,
} from '@mantine/core'
import { Check, X } from 'lucide-react'
import { useAuth } from '@/hooks'
import { APP_CONFIG } from '@/constants'
import { AvatarUploader } from '@/components/common'

export function ProfileSettingsPage() {
  const navigate = useNavigate()
  const { user, profile, loading: authLoading, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [website, setWebsite] = useState('')
  const [telegram, setTelegram] = useState('')
  const [youtube, setYoutube] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Перенаправление неавторизованных пользователей
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true })
    }
  }, [authLoading, user, navigate])

  // Загрузка данных профиля
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '')
      setBio(profile.bio || '')
      setWebsite(profile.website || '')
      setTelegram(profile.telegram || '')
      setYoutube(profile.youtube || '')
      setLoading(false)
    }
  }, [profile])

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      setNotification(null)
      const response = await fetch(`${APP_CONFIG.apiUrl}/user/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ displayName, bio, website, telegram, youtube }),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Ошибка сохранения')
      }
      await refreshProfile?.()
      setNotification({ type: 'success', message: 'Профиль успешно обновлён' })
    } catch (error) {
      setNotification({ type: 'error', message: error instanceof Error ? error.message : 'Ошибка сохранения' })
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setNotification({ type: 'error', message: 'Пароли не совпадают' })
      return
    }
    if (newPassword.length < 6) {
      setNotification({ type: 'error', message: 'Пароль должен быть минимум 6 символов' })
      return
    }
    try {
      setSaving(true)
      setNotification(null)
      const response = await fetch(`${APP_CONFIG.apiUrl}/user/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Ошибка смены пароля')
      }
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setNotification({ type: 'success', message: 'Пароль успешно изменён' })
    } catch (error) {
      setNotification({ type: 'error', message: error instanceof Error ? error.message : 'Ошибка смены пароля' })
    } finally {
      setSaving(false)
    }
  }

  // Состояние загрузки
  if (authLoading || loading) {
    return (
      <Container size="md" py="xl">
        <Skeleton height={400} radius="md" />
      </Container>
    )
  }

  // Неавторизованный (редирект)
  if (!user || !profile) {
    return null
  }

  return (
    <Container size="md" py="xl">
      <Title order={2} mb="xl">Настройки профиля</Title>
      {notification && (
        <Notification 
          icon={notification.type === 'success' ? <Check /> : <X />} 
          color={notification.type === 'success' ? 'green' : 'red'} 
          onClose={() => setNotification(null)} 
          mb="md"
        >
          {notification.message}
        </Notification>
      )}
      <Paper p="lg" radius="md" withBorder>
        <Tabs defaultValue="profile">
          <Tabs.List mb="lg">
            <Tabs.Tab value="profile">Профиль</Tabs.Tab>
            <Tabs.Tab value="password">Пароль</Tabs.Tab>
            <Tabs.Tab value="notifications">Уведомления</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="profile">
            <Stack gap="md">
              {/* Загрузка аватара */}
              <AvatarUploader
                currentAvatar={profile.avatarUrl}
                size={80}
                onUploadSuccess={() => {
                  setNotification({ type: 'success', message: 'Аватар обновлён' })
                }}
              />
              
              <TextInput
                label="Отображаемое имя"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Ваше имя"
              />
              <Textarea
                label="О себе"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Расскажите о себе..."
                rows={4}
              />
              <TextInput
                label="Сайт"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://example.com"
              />
              <TextInput
                label="Telegram"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                placeholder="@username"
              />
              <TextInput
                label="YouTube"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder="https://youtube.com/@username"
              />
              <Group justify="flex-end" mt="md">
                <Button onClick={handleSaveProfile} loading={saving}>Сохранить изменения</Button>
              </Group>
            </Stack>
          </Tabs.Panel>
          <Tabs.Panel value="password">
            <Stack gap="md" maw={400}>
              <PasswordInput
                label="Текущий пароль"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <PasswordInput
                label="Новый пароль"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <PasswordInput
                label="Подтвердите новый пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button onClick={handleChangePassword} loading={saving} mt="md">Изменить пароль</Button>
            </Stack>
          </Tabs.Panel>
          <Tabs.Panel value="notifications">
            <Text c="dimmed">Настройки уведомлений будут добавлены позже</Text>
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Container>
  )
}
