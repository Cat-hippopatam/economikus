// server/lib/auth.ts
// Временная заглушка для совместимости - полная версия требует установки @auth/prisma-adapter
import { prisma } from '../db'
import { compare } from 'bcryptjs'

// Типы для JWT токена
interface JWTPayload {
  id?: string
  role?: string
  profile?: {
    id: string
    nickname: string
    displayName: string
  }
  name?: string
}

// Типы для сессии
interface SessionUser {
  id: string
  role: string
  profile?: {
    id: string
    nickname: string
    displayName: string
  }
}

// Заглушки для auth - полная реализация требует установки @auth/prisma-adapter
export const handlers = {
  GET: () => new Response('Auth endpoint'),
  POST: () => new Response('Auth endpoint')
}

export async function auth(): Promise<JWTPayload | null> {
  return null
}

export async function signIn(): Promise<void> {}

export async function signOut(): Promise<void> {}

// Функция авторизации (используется напрямую в auth.routes.ts)
export async function authorizeUser(email: string, password: string): Promise<{
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  profile?: {
    id: string
    nickname: string
    displayName: string
  }
} | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true }
  })

  if (!user || !user.passwordHash) {
    return null
  }

  const isValid = await compare(password, user.passwordHash)
  
  if (!isValid || user.isBlocked) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    profile: user.profile ? {
      id: user.profile.id,
      nickname: user.profile.nickname,
      displayName: user.profile.displayName
    } : undefined
  }
}