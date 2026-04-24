import { Hono } from 'hono'
import { z } from 'zod'
import { prisma } from '../db'
import { requireAuth, getCurrentProfile } from '../middleware/auth'
import { AppError } from '../lib/errors'

const kakebo = new Hono()

// Middleware для всех kakebo-роутов
kakebo.use('*', requireAuth)

// Zod схемы валидации
const KakeboEntrySchema = z.object({
  date: z.string().refine(val => !isNaN(Date.parse(val)), 'Неверная дата'),
  category: z.enum(['LIFE', 'CULTURE', 'EXTRA', 'UNEXPECTED']),
  description: z.string().min(1, 'Описание обязательно').max(500, 'Слишком длинно'),
  amount: z.number().positive('Сумма должна быть больше 0'),
  isNecessary: z.boolean().optional().default(false),
})

const KakeboSettingsSchema = z.object({
  monthLimit: z.number().positive().optional().nullable(),
})

const KakeboReflectionSchema = z.object({
  year: z.number(),
  month: z.number().min(1).max(12),
  unnecessarySpent: z.number().optional(),
  moneyAtStart: z.number().optional(),
  plannedToSave: z.number().optional(),
  actuallySaved: z.number().optional(),
  improvements: z.string().max(1000).optional(),
})

// ==================== GET /api/kakebo ====================
// Получить данные за месяц
kakebo.get('/', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(401, 'Требуется авторизация')

  const year = parseInt(c.req.query('year') || new Date().getFullYear().toString())
  const month = parseInt(c.req.query('month') || (new Date().getMonth() + 1).toString())

  // Получаем настройки
  const settings = await prisma.kakeboSettings.findUnique({
    where: { profileId: profile.id }
  })

  // Получаем записи
  const entries = await prisma.kakeboEntry.findMany({
    where: {
      profileId: profile.id,
      year,
      month
    },
    orderBy: { date: 'desc' }
  })

  // Агрегация
  const totalSpent = entries.reduce((sum, e) => sum + e.amount, 0)
  const daysWithEntries = new Set(entries.map(e => e.date.toISOString().split('T')[0])).size
  const daysInMonth = new Date(year, month, 0).getDate()

  const byCategory = entries.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount
    return acc
  }, {} as Record<string, number>)

  return c.json({
    settings: { monthLimit: settings?.monthLimit ?? null },
    entries: entries.map(e => ({
      id: e.id,
      date: e.date.toISOString(),
      category: e.category,
      description: e.description,
      amount: e.amount,
      isNecessary: e.isNecessary
    })),
    summary: {
      totalSpent,
      daysInMonth,
      daysWithEntries,
      byCategory
    }
  })
})

// ==================== POST /api/kakebo ====================
// Создать запись
kakebo.post('/', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(401, 'Требуется авторизация')

  const body = await c.req.json()
  const parsed = KakeboEntrySchema.safeParse(body)

  if (!parsed.success) {
    throw new AppError(400, 'Ошибка валидации', 'VALIDATION_ERROR', parsed.error)
  }

  const { date, category, description, amount, isNecessary } = parsed.data
  const dateObj = new Date(date)

  const entry = await prisma.kakeboEntry.create({
    data: {
      profileId: profile.id,
      date: dateObj,
      year: dateObj.getFullYear(),
      month: dateObj.getMonth() + 1,
      category,
      description,
      amount,
      isNecessary
    }
  })

  return c.json({ message: 'Запись создана', entry }, 201)
})

// ==================== PUT /api/kakebo/:id ====================
// Обновить запись
kakebo.put('/:id', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(401, 'Требуется авторизация')

  const id = c.req.param('id')
  const body = await c.req.json()

  // Проверка существования и принадлежности
  const existing = await prisma.kakeboEntry.findFirst({
    where: { id, profileId: profile.id }
  })
  if (!existing) throw new AppError(404, 'Запись не найдена')

  const parsed = KakeboEntrySchema.partial().safeParse(body)
  if (!parsed.success) throw new AppError(400, 'Ошибка валидации')

  const entry = await prisma.kakeboEntry.update({
    where: { id },
    data: parsed.data
  })

  return c.json({ message: 'Запись обновлена', entry })
})

// ==================== DELETE /api/kakebo/:id ====================
// Удалить запись
kakebo.delete('/:id', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(401, 'Требуется авторизация')

  const id = c.req.param('id')

  // Проверка принадлежности
  const existing = await prisma.kakeboEntry.findFirst({
    where: { id, profileId: profile.id }
  })
  if (!existing) throw new AppError(404, 'Запись не найдена')

  await prisma.kakeboEntry.delete({ where: { id } })

  return c.json({ message: 'Запись удалена' })
})

// ==================== PUT /api/kakebo/settings ====================
// Обновить настройки
kakebo.put('/settings', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(401, 'Требуется авторизация')

  const body = await c.req.json()
  const parsed = KakeboSettingsSchema.safeParse(body)

  if (!parsed.success) throw new AppError(400, 'Ошибка валидации')

  const settings = await prisma.kakeboSettings.upsert({
    where: { profileId: profile.id },
    create: { profileId: profile.id, ...parsed.data },
    update: parsed.data
  })

  return c.json({ message: 'Настройки обновлены', settings })
})

// ==================== GET /api/kakebo/reflection ====================
// Получить рефлексию за месяц
kakebo.get('/reflection', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(401, 'Требуется авторизация')

  const year = parseInt(c.req.query('year') || new Date().getFullYear().toString())
  const month = parseInt(c.req.query('month') || (new Date().getMonth() + 1).toString())

  const reflection = await prisma.kakeboReflection.findUnique({
    where: { profileId_year_month: { profileId: profile.id, year, month } }
  })

  return c.json({ reflection })
})

// ==================== POST /api/kakebo/reflection ====================
// Сохранить рефлексию
kakebo.post('/reflection', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(401, 'Требуется авторизация')

  const body = await c.req.json()
  const parsed = KakeboReflectionSchema.safeParse(body)

  if (!parsed.success) throw new AppError(400, 'Ошибка валидации')

  const reflection = await prisma.kakeboReflection.upsert({
    where: { profileId_year_month: { profileId: profile.id, year: parsed.data.year, month: parsed.data.month } },
    create: { profileId: profile.id, ...parsed.data },
    update: parsed.data
  })

  return c.json({ message: 'Рефлексия сохранена', reflection })
})

export default kakebo
