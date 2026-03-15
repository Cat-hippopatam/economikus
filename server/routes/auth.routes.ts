// server/routes/auth.routes.ts
import { Hono } from 'hono'
import { hash, compare } from 'bcryptjs'
import { prisma } from '../db'
import { AppError } from '../lib/errors'
import { RegisterSchema, LoginSchema } from '../../src/shared/types'
import crypto from 'crypto'

const auth = new Hono()

// === POST /auth/register ===
auth.post('/register', async (c) => {
  try {
    const body = await c.req.json()
    const result = RegisterSchema.safeParse(body)
    
    if (!result.success) {
      return c.json({ 
        error: 'Validation failed', 
        details: result.error.errors.map(e => ({ field: e.path.join('.'), message: e.message })) 
      }, 400)
    }
    
    const { email, firstName, lastName, password, nickname } = result.data

    // Проверка уникальности
    const [existingEmail, existingNickname] = await Promise.all([
      prisma.user.findUnique({ where: { email } }),
      prisma.profile.findUnique({ where: { nickname } })
    ])
    
    if (existingEmail) throw new AppError(400, 'Email уже зарегистрирован', 'EMAIL_EXISTS')
    if (existingNickname) throw new AppError(400, 'Никнейм уже занят', 'NICKNAME_EXISTS')

    // Хэширование пароля
    const passwordHash = await hash(password, 12)

    // Транзакция: User + Profile
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email, firstName, lastName, passwordHash, role: 'USER', emailVerified: new Date() }
      })
      const profile = await tx.profile.create({
        data: {
          userId: user.id,
          nickname,
          displayName: `${firstName} ${lastName}`.trim(),
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName)}+${encodeURIComponent(lastName)}&background=random`
        }
      })
      return { user, profile }
    })

    return c.json({
      message: 'User created successfully',
      user: {
        id: newUser.user.id,
        email: newUser.user.email,
        firstName: newUser.user.firstName,
        lastName: newUser.user.lastName,
        role: newUser.user.role,
        profile: {
          id: newUser.profile.id,
          nickname: newUser.profile.nickname,
          displayName: newUser.profile.displayName,
          avatarUrl: newUser.profile.avatarUrl
        }
      }
    }, 201)

  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Registration error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === POST /auth/login ===
auth.post('/login', async (c) => {
  try {
    const body = await c.req.json()
    const result = LoginSchema.safeParse(body)
    
    if (!result.success) {
      return c.json({ 
        error: 'Validation failed', 
        details: result.error.errors.map(e => ({ field: e.path.join('.'), message: e.message })) 
      }, 400)
    }
    
    const { email, password } = result.data

    // Поиск пользователя
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: { select: { id: true, nickname: true, displayName: true, avatarUrl: true } } }
    })

    if (!user || !user.passwordHash) {
      throw new AppError(401, 'Неверный email или пароль', 'INVALID_CREDENTIALS')
    }

    // Проверка пароля
    const isValid = await compare(password, user.passwordHash)
    if (!isValid || user.isBlocked) {
      throw new AppError(401, 'Неверный email или пароль', 'INVALID_CREDENTIALS')
    }

    // Обновление last_login_at
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    })

    // Создаём сессию вручную (простая реализация без JWT для начала)
    const session = await prisma.session.create({
      data: {
        sessionToken: crypto.randomUUID(),
        userId: user.id,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 дней
      }
    })

    // Устанавливаем куки
    c.header('Set-Cookie', `session=${session.sessionToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${30 * 24 * 60 * 60}`)

    return c.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profile: user.profile ? {
          id: user.profile.id,
          nickname: user.profile.nickname,
          displayName: user.profile.displayName,
          avatarUrl: user.profile.avatarUrl
        } : undefined
      }
    })

  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Login error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === POST /auth/logout ===
auth.post('/logout', async (c) => {
  const cookie = c.req.header('Cookie')
  const sessionMatch = cookie?.match(/session=([^;]+)/)
  
  if (sessionMatch?.[1]) {
    await prisma.session.deleteMany({ where: { sessionToken: sessionMatch[1] } })
  }
  
  c.header('Set-Cookie', 'session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0')
  return c.json({ message: 'Logged out successfully' })
})

// === GET /auth/me — проверка сессии ===
auth.get('/me', async (c) => {
  const cookie = c.req.header('Cookie')
  const sessionMatch = cookie?.match(/session=([^;]+)/)
  
  if (!sessionMatch?.[1]) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const session = await prisma.session.findUnique({
    where: { sessionToken: sessionMatch[1], expires: { gt: new Date() } },
    include: {
      user: {
        include: {
          profile: { select: { id: true, nickname: true, displayName: true, avatarUrl: true, bio: true } }
        }
      }
    }
  })

  if (!session) {
    return c.json({ error: 'Session expired' }, 401)
  }

  return c.json({
    user: {
      id: session.user.id,
      email: session.user.email,
      firstName: session.user.firstName,
      lastName: session.user.lastName,
      role: session.user.role,
      profile: session.user.profile
    }
  })
})

export default auth