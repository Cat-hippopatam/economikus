// server/middleware/auth.ts
/**
 * Middleware для проверки авторизации и ролей
 */

import type { MiddlewareHandler, Context } from 'hono'
import { prisma } from '../db'
import { AppError } from '../lib/errors'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'USER' | 'AUTHOR' | 'MODERATOR' | 'ADMIN'
  isBlocked: boolean
}

interface Profile {
  id: string
  nickname: string
  displayName: string
  avatarUrl: string | null
  bio?: string | null
}

declare module 'hono' {
  interface ContextVariableMap {
    user: User
    profile: Profile | null
  }
}

function extractSessionToken(c: Context): string | null {
  const cookie = c.req.header('Cookie')
  if (!cookie) return null
  const match = cookie.match(/session=([^;]+)/)
  return match ? match[1] : null
}

async function getSessionData(sessionToken: string) {
  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: {
      user: {
        include: {
          profile: {
            select: { id: true, nickname: true, displayName: true, avatarUrl: true, bio: true }
          }
        }
      }
    }
  })

  if (!session) return null
  if (session.expires < new Date()) {
    await prisma.session.delete({ where: { id: session.id } })
    return null
  }
  if (session.user.isBlocked) return null

  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      firstName: session.user.firstName,
      lastName: session.user.lastName,
      role: session.user.role,
      isBlocked: session.user.isBlocked,
    },
    profile: session.user.profile
  }
}

export const requireAuth: MiddlewareHandler = async (c, next) => {
  const sessionToken = extractSessionToken(c)
  if (!sessionToken) throw new AppError(401, 'Требуется авторизация', 'UNAUTHORIZED')

  const sessionData = await getSessionData(sessionToken)
  if (!sessionData) {
    c.header('Set-Cookie', 'session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0')
    throw new AppError(401, 'Сессия истекла', 'SESSION_EXPIRED')
  }

  c.set('user', sessionData.user)
  c.set('profile', sessionData.profile)
  await next()
}

export const requireRole = (...roles: string[]): MiddlewareHandler => {
  return async (c, next) => {
    const user = c.get('user')
    if (!user || !roles.includes(user.role)) {
      throw new AppError(403, 'Доступ запрещён', 'FORBIDDEN')
    }
    await next()
  }
}

export const requireAdmin: MiddlewareHandler = async (c, next) => {
  const sessionToken = extractSessionToken(c)
  if (!sessionToken) throw new AppError(401, 'Требуется авторизация', 'UNAUTHORIZED')

  const sessionData = await getSessionData(sessionToken)
  if (!sessionData) {
    c.header('Set-Cookie', 'session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0')
    throw new AppError(401, 'Сессия истекла', 'SESSION_EXPIRED')
  }
  if (sessionData.user.role !== 'ADMIN') {
    throw new AppError(403, 'Доступ запрещён. Требуются права администратора', 'FORBIDDEN')
  }

  c.set('user', sessionData.user)
  c.set('profile', sessionData.profile)
  await next()
}

export const requireModerator: MiddlewareHandler = async (c, next) => {
  const sessionToken = extractSessionToken(c)
  if (!sessionToken) throw new AppError(401, 'Требуется авторизация', 'UNAUTHORIZED')

  const sessionData = await getSessionData(sessionToken)
  if (!sessionData) {
    c.header('Set-Cookie', 'session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0')
    throw new AppError(401, 'Сессия истекла', 'SESSION_EXPIRED')
  }
  if (!['MODERATOR', 'ADMIN'].includes(sessionData.user.role)) {
    throw new AppError(403, 'Доступ запрещён. Требуются права модератора', 'FORBIDDEN')
  }

  c.set('user', sessionData.user)
  c.set('profile', sessionData.profile)
  await next()
}

export const optionalAuth: MiddlewareHandler = async (c, next) => {
  const sessionToken = extractSessionToken(c)
  if (sessionToken) {
    const sessionData = await getSessionData(sessionToken)
    if (sessionData) {
      c.set('user', sessionData.user)
      c.set('profile', sessionData.profile)
    }
  }
  await next()
}

export function getCurrentUser(c: Context): User { return c.get('user') }
export function getCurrentProfile(c: Context): Profile | null { return c.get('profile') }
export function isAuthenticated(c: Context): boolean { return !!c.get('user') }
