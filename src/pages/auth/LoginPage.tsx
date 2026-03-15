// src/pages/auth/LoginPage.tsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { 
  TextInput, PasswordInput, Button, Stack, Title, Text, 
  Paper, Alert, Checkbox, Group, Divider 
} from '@mantine/core'
import { AlertCircle } from 'lucide-react'
import { LoginSchema, type LoginInput, type ErrorResponse } from '../../shared/types'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [serverError, setServerError] = useState<string | null>(null)
  const successMessage = (location.state as { message?: string })?.message

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '', remember: false }
  })

  const loginMutation = useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      })
      
      if (!response.ok) {
        const error: ErrorResponse = await response.json()
        throw new Error(error.message || error.error || 'Ошибка входа')
      }
      return await response.json()
    },
    onSuccess: () => {
      navigate('/profile', { replace: true })
    },
    onError: (error: Error) => {
      setServerError(error.message)
    }
  })

  const onSubmit = async (data: LoginInput) => {
    setServerError(null)
    await loginMutation.mutateAsync(data)
  }

  return (
    <Paper 
      withBorder 
      shadow="md" 
      p="xl" 
      radius="md" 
      style={{ width: '100%', maxWidth: 420 }}
    >
      <Title order={2} ta="center" mb="xs" c="#264653">
        Вход в аккаунт
      </Title>
      <Text c="dimmed" size="sm" ta="center" mb="xl">
        Продолжите обучение на Economikus
      </Text>

      {successMessage && (
        <Alert color="green" variant="light" mb="md">
          {successMessage}
        </Alert>
      )}
      
      {serverError && (
        <Alert 
          icon={<AlertCircle size={16} />} 
          color="red" 
          variant="light" 
          mb="md"
        >
          {serverError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          <TextInput 
            label="Email" 
            placeholder="you@example.com" 
            type="email" 
            autoComplete="email" 
            error={errors.email?.message} 
            {...register('email')} 
            required 
          />
          <PasswordInput 
            label="Пароль" 
            placeholder="••••••••" 
            autoComplete="current-password" 
            error={errors.password?.message} 
            {...register('password')} 
            required 
          />
          <Group justify="space-between">
            <Checkbox label="Запомнить меня" {...register('remember')} />
            <Text 
              component="a" 
              href="/forgot-password" 
              size="sm" 
              c="#2A9D8F" 
              style={{ textDecoration: 'none' }}
            >
              Забыли пароль?
            </Text>
          </Group>
          <Button 
            type="submit" 
            fullWidth 
            size="md" 
            loading={isSubmitting || loginMutation.isPending}
            style={{ backgroundColor: '#2A9D8F' }}
          >
            Войти
          </Button>
        </Stack>
      </form>

      <Divider my="lg" />
      <Text ta="center" size="sm">
        Нет аккаунта?{' '}
        <Link 
          to="/register" 
          style={{ textDecoration: 'none', color: '#2A9D8F' }}
        >
          Зарегистрироваться
        </Link>
      </Text>
    </Paper>
  )
}
