// src/components/auth/ProtectedRoute.tsx
/**
 * Компонент защиты роутов
 * Проверяет авторизацию и роли пользователей
 */

import { Navigate, useLocation } from 'react-router-dom'
import { Container, Center, Loader, Stack, Text } from '@mantine/core'
import { useAuth } from '@/hooks'
import type { Role } from '@/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  roles?: Role[] // Если указаны, проверяет роль пользователя
  redirectTo?: string // Куда перенаправить неавторизованного
}

export function ProtectedRoute({ 
  children, 
  roles, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Показываем загрузку
  if (loading) {
    return (
      <Container size="md" py="xl">
        <Center>
          <Stack align="center" gap="md">
            <Loader size="lg" />
            <Text c="dimmed">Загрузка...</Text>
          </Stack>
        </Center>
      </Container>
    )
  }

  // Неавторизованный пользователь
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // Проверка роли (если указаны требуемые роли)
  if (roles && roles.length > 0) {
    if (!roles.includes(user.role)) {
      return <Navigate to="/403" replace />
    }
  }

  return <>{children}</>
}
