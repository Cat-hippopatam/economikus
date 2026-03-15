// src/pages/auth/RegisterPage.tsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import { 
  TextInput, PasswordInput, Button, Stack, Title, Text, 
  Paper, Alert, Checkbox, Group, Box, Divider 
} from '@mantine/core'
import { AlertCircle, Check } from 'lucide-react'
import { RegisterSchema, type RegisterInput, type ErrorResponse } from '../../shared/types'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '', 
      firstName: '', 
      lastName: '', 
      password: '', 
      nickname: '', 
      acceptTerms: false
    }
  })

  const password = watch('password')

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterInput) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      })
      
      if (!response.ok) {
        const error: ErrorResponse = await response.json()
        throw new Error(error.message || error.error || 'Ошибка регистрации')
      }
      return await response.json()
    },
    onSuccess: () => {
      navigate('/login', { 
        state: { message: 'Регистрация успешна! Теперь войдите в аккаунт.' },
        replace: true 
      })
    },
    onError: (error: Error) => {
      setServerError(error.message)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  })

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null)
    await registerMutation.mutateAsync(data)
  }

  return (
    <Paper 
      withBorder 
      shadow="md" 
      p="xl" 
      radius="md" 
      style={{ width: '100%', maxWidth: 480 }}
    >
      <Title order={2} ta="center" mb="xs" c="#264653">
        Создать аккаунт
      </Title>
      <Text c="dimmed" size="sm" ta="center" mb="xl">
        Начните обучение финансам бесплатно
      </Text>

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
          <Group grow gap="md">
            <TextInput 
              label="Имя" 
              placeholder="Иван" 
              autoComplete="given-name" 
              error={errors.firstName?.message} 
              {...register('firstName')} 
              required 
            />
            <TextInput 
              label="Фамилия" 
              placeholder="Иванов" 
              autoComplete="family-name" 
              error={errors.lastName?.message} 
              {...register('lastName')} 
              required 
            />
          </Group>
          <TextInput 
            label="Никнейм" 
            placeholder="ivan_petrov" 
            description="Латинские буквы, цифры, подчёркивание" 
            error={errors.nickname?.message} 
            {...register('nickname')} 
            required 
          />
          <PasswordInput 
            label="Пароль" 
            placeholder="••••••••" 
            autoComplete="new-password" 
            error={errors.password?.message} 
            {...register('password')} 
            required 
          />
          
          {password && (
            <Box pl="xs">
              <Text size="xs" c={/[A-Z]/.test(password) ? 'green' : 'dimmed'}>
                <Check size={12} style={{ marginRight: 4 }} />
                Заглавная буква
              </Text>
              <Text size="xs" c={/[a-z]/.test(password) ? 'green' : 'dimmed'}>
                <Check size={12} style={{ marginRight: 4 }} />
                Строчная буква
              </Text>
              <Text size="xs" c={/[0-9]/.test(password) ? 'green' : 'dimmed'}>
                <Check size={12} style={{ marginRight: 4 }} />
                Цифра
              </Text>
            </Box>
          )}

          <Checkbox 
            label={
              <Text size="sm">
                Я принимаю{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer">
                  условия использования
                </a>
                {' '}и{' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer">
                  политику конфиденциальности
                </a>
              </Text>
            } 
            error={errors.acceptTerms?.message} 
            {...register('acceptTerms')} 
          />

          <Button 
            type="submit" 
            fullWidth 
            size="md" 
            loading={isSubmitting || registerMutation.isPending}
            style={{ backgroundColor: '#2A9D8F' }}
          >
            Зарегистрироваться
          </Button>
        </Stack>
      </form>

      <Divider my="lg" />
      <Text ta="center" size="sm">
        Уже есть аккаунт?{' '}
        <Link to="/login" style={{ textDecoration: 'none', color: '#2A9D8F' }}>
          Войти
        </Link>
      </Text>
    </Paper>
  )
}
