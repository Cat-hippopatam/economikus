import { Hono } from 'hono'
import { z } from 'zod'
import { prisma } from '../db'
import { requireAuth, getCurrentProfile } from '../middleware/auth'
import { AppError } from '../lib/errors'
import { CategoryType } from '@prisma/client'
import {
  generateFixedExpensesForMonth,
  createFutureEntriesForFixedExpense,
  deleteFutureEntriesForFixedExpense,
} from '../services/kakebo.service'

const kakebo = new Hono()

// Middleware для всех kakebo-роутов
kakebo.use('*', requireAuth)

// ==================== Zod схемы валидации ====================

// Устаревшая схема для совместимости
const KakeboEntrySchema = z.object({
  date: z.string().refine(val => !isNaN(Date.parse(val)), 'Неверная дата'),
  categoryId: z.union([
    z.string().uuid('Неверный ID категории'),
    z.string().refine(val => /^sys-(life|culture|extra|unexpected)$/.test(val), 'Неверный ID категории'),
  ]).optional().nullable(),
  description: z.string().min(1, 'Описание обязательно').max(500, 'Слишком длинно'),
  amount: z.number().positive('Сумма должна быть больше 0'),
  isNecessary: z.boolean().optional().default(false),
})

// Старая схема с enum для fallback
const KakeboEntrySchemaLegacy = z.object({
  date: z.string().refine(val => !isNaN(Date.parse(val)), 'Неверная дата'),
  category: z.enum(['LIFE', 'CULTURE', 'EXTRA', 'UNEXPECTED']),
  description: z.string().min(1, 'Описание обязательно').max(500, 'Слишком длинно'),
  amount: z.number().positive('Сумма должна быть больше 0'),
  isNecessary: z.boolean().optional().default(false),
})

const KakeboSettingsSchema = z.object({
  monthLimit: z.number().positive().optional().nullable(),
  income: z.number().positive().optional(),
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

// НОВЫЕ схемы для v2.0
const KakeboCategorySchema = z.object({
  name: z.string().min(1, 'Название обязательно').max(255, 'Слишком длинно'),
  parentId: z.string().uuid().optional().nullable(),
  isFixed: z.boolean().optional().default(false),
  isEssential: z.boolean().optional().default(true),
  icon: z.string().max(50).optional().nullable(),
  color: z.string().max(7).optional().nullable(),
})

const KakeboMonthlyGoalSchema = z.object({
  year: z.number(),
  month: z.number().min(1).max(12),
  promise: z.string().max(1000, 'Слишком длинно'),
  targetSave: z.number().nonnegative('Не может быть отрицательным'),
  achieved: z.boolean().optional().default(false),
})

const KakeboFixedExpenseSchema = z.object({
  categoryId: z.string().uuid('Неверный ID категории'),
  description: z.string().min(1, 'Описание обязательно').max(255, 'Слишком длинно'),
  amount: z.number().positive('Сумма должна быть больше 0'),
  dayOfMonth: z.number().min(1).max(31, 'День месяца от 1 до 31'),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
})

const KakeboMonthlyBudgetSchema = z.object({
  income: z.number().nonnegative('Не может быть отрицательным'),
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

  // Получаем записи с категориями
  const entries = await prisma.kakeboEntry.findMany({
    where: {
      profileId: profile.id,
      year,
      month
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          type: true,
          icon: true,
          color: true,
        },
      },
    },
    orderBy: { date: 'desc' }
  })

  // Агрегация
  const totalSpent = entries.reduce((sum, e) => sum + e.amount, 0)
  const daysWithEntries = new Set(entries.map(e => e.date.toISOString().split('T')[0])).size
  const daysInMonth = new Date(year, month, 0).getDate()

  const byCategory = entries.reduce((acc, e) => {
    const categoryName = e.category?.name || 'Unknown'
    acc[categoryName] = (acc[categoryName] || 0) + e.amount
    return acc
  }, {} as Record<string, number>)

  return c.json({
    settings: { 
      monthLimit: settings?.monthLimit ?? null,
      income: settings?.income ?? null 
    },
    entries: entries.map(e => ({
      id: e.id,
      date: e.date.toISOString(),
      categoryId: e.categoryId,
      category: e.category ? {
        id: e.category.id,
        name: e.category.name,
        type: e.category.type,
        icon: e.category.icon,
        color: e.category.color,
      } : null,
      categoryOld: e.categoryOld, // для совместимости
      description: e.description,
      amount: e.amount,
      isNecessary: e.isNecessary,
      isAutoGenerated: e.isAutoGenerated,
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
  
  // Сначала пробуем старую схему с category enum (для обратной совместимости)
  let parsed = KakeboEntrySchemaLegacy.safeParse(body)
  let data: any = null
  
  if (parsed.success) {
    // Преобразуем старую схему в новую
    const legacyData = parsed.data
    const categoryMap: Record<string, string> = {
      'LIFE': 'sys-life',
      'CULTURE': 'sys-culture',
      'EXTRA': 'sys-extra',
      'UNEXPECTED': 'sys-unexpected',
    }
    data = {
      categoryId: categoryMap[legacyData.category],
      category: legacyData.category,
      date: legacyData.date,
      description: legacyData.description,
      amount: legacyData.amount,
      isNecessary: legacyData.isNecessary,
    }
  } else {
    // Если не прошло, пробуем новую схему с categoryId
    // Очищаем categoryId от пустых строк перед валидацией
    const cleanedBody = {
      ...body,
      categoryId: body.categoryId === '' ? null : body.categoryId,
    }
    parsed = KakeboEntrySchema.safeParse(cleanedBody)
    if (!parsed.success) {
      throw new AppError(400, `Ошибка валидации: ${parsed.error.message}`)
    }
    data = parsed.data
  }

  const dateObj = new Date(data.date)

  const entry = await prisma.kakeboEntry.create({
    data: {
      profileId: profile.id,
      date: dateObj,
      year: dateObj.getFullYear(),
      month: dateObj.getMonth() + 1,
      categoryId: data.categoryId || null,
      categoryOld: data.category || 'LIFE',
      description: data.description,
      amount: data.amount,
      isNecessary: data.isNecessary,
    },
  })

  return c.json({ message: 'Запись создана', entry }, 201)
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

  // Преобразуем дату в Date объект если она есть
  const updateData: any = parsed.data
  if (updateData.date) {
    updateData.date = new Date(updateData.date)
  }

  const entry = await prisma.kakeboEntry.update({
    where: { id },
    data: updateData
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

// ==================== НОВЫЕ ЭНДПОИНТЫ v2.0 ====================

// ==================== GET /api/kakebo/categories ====================
// Получить все категории пользователя (системные + свои)
kakebo.get('/categories', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(401, 'Требуется авторизация')

  const typeFilter = c.req.query('type') as 'SYSTEM' | 'CUSTOM' | undefined
  const includeChildren = c.req.query('includeChildren') === 'true'

  const where: any = {
    OR: [
      { profileId: null }, // системные
      { profileId: profile.id }, // пользовательские
    ],
  }

  // Проверка: typeFilter должен быть валидным enum значением
  if (typeFilter && (typeFilter === 'SYSTEM' || typeFilter === 'CUSTOM')) {
    where.type = typeFilter
  }

  const categories = await prisma.kakeboCategory.findMany({
    where,
    include: includeChildren ? {
      children: {
        select: {
          id: true,
          name: true,
          type: true,
          parentId: true,
          isFixed: true,
          isEssential: true,
          icon: true,
          color: true,
          order: true,
        },
      },
    } : undefined,
    orderBy: { order: 'asc' },
  })

  return c.json({ categories })
})

// ==================== POST /api/kakebo/categories ====================
// Создать категорию
kakebo.post('/categories', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(401, 'Требуется авторизация')

  const body = await c.req.json()
  const parsed = KakeboCategorySchema.safeParse(body)

  if (!parsed.success) {
    throw new AppError(400, `Ошибка валидации: ${parsed.error.message}`)
  }

  const { name, parentId, isFixed, isEssential, icon, color } = parsed.data

  // Проверка уникальности имени
  const existing = await prisma.kakeboCategory.findFirst({
    where: {
      profileId: profile.id,
      name,
    },
  })

  if (existing) {
    throw new AppError(409, 'Категория с таким именем уже существует', 'CONFLICT')
  }

  // Проверка родительской категории (если указана)
  if (parentId) {
    const parent = await prisma.kakeboCategory.findFirst({
      where: {
        id: parentId,
        OR: [
          { profileId: null },
          { profileId: profile.id },
        ],
      },
    })

    if (!parent) {
      throw new AppError(404, 'Родительская категория не найдена', 'NOT_FOUND')
    }
  }

  const category = await prisma.kakeboCategory.create({
    data: {
      profileId: profile.id,
      name,
      type: CategoryType.CUSTOM,
      parentId,
      isFixed,
      isEssential,
      icon,
      color,
      order: 0,
    },
  })

  return c.json({ message: 'Категория создана', category }, 201)
})

// ==================== PUT /api/kakebo/categories/:id ====================
// Обновить категорию
kakebo.put('/categories/:id', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(401, 'Требуется авторизация')

  const id = c.req.param('id')
  const body = await c.req.json()
  const parsed = KakeboCategorySchema.partial().safeParse(body)

  if (!parsed.success) {
    throw new AppError(400, `Ошибка валидации: ${parsed.error.message}`)
  }

  // Проверка существования и принадлежности
  const existing = await prisma.kakeboCategory.findFirst({
    where: {
      id,
      OR: [
        { profileId: null },
        { profileId: profile.id },
      ],
    },
  })

  if (!existing) {
    throw new AppError(404, 'Категория не найдена', 'NOT_FOUND')
  }

  // SYSTEM категории нельзя переименовывать
  if (existing.type === CategoryType.SYSTEM && parsed.data.name) {
    throw new AppError(403, 'SYSTEM категории нельзя переименовывать', 'FORBIDDEN')
  }

  // Проверка уникальности нового имени (если меняется)
  if (parsed.data.name && parsed.data.name !== existing.name) {
    const duplicate = await prisma.kakeboCategory.findFirst({
      where: {
        profileId: profile.id,
        name: parsed.data.name,
        id: { not: id },
      },
    })

    if (duplicate) {
      throw new AppError(409, 'Категория с таким именем уже существует', 'CONFLICT')
    }
  }

  const category = await prisma.kakeboCategory.update({
    where: { id },
    data: parsed.data,
  })

  return c.json({ message: 'Категория обновлена', category })
})

// ==================== DELETE /api/kakebo/categories/:id ====================
// Удалить категорию (каскадно с записями)
kakebo.delete('/categories/:id', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(401, 'Требуется авторизация')

  const id = c.req.param('id')

  // Проверка существования и принадлежности
  const existing = await prisma.kakeboCategory.findFirst({
    where: {
      id,
      OR: [
        { profileId: null },
        { profileId: profile.id },
      ],
    },
  })

  if (!existing) {
    throw new AppError(404, 'Категория не найдена', 'NOT_FOUND')
  }

  // SYSTEM категории нельзя удалять
  if (existing.type === CategoryType.SYSTEM) {
    throw new AppError(403, 'SYSTEM категории нельзя удалять', 'FORBIDDEN')
  }

  // Получаем количество записей для уведомления
  const entriesCount = await prisma.kakeboEntry.count({
    where: { categoryId: id },
  })

  // Удаляем категорию (каскадно удалятся и записи благодаря onDelete: Cascade в схеме)
  await prisma.kakeboCategory.delete({
    where: { id },
  })

  return c.json({
    message: 'Категория удалена',
    entriesDeleted: entriesCount > 0 ? entriesCount : undefined
  })
})

// ==================== GET /api/kakebo/goals ====================
// Получить цель на месяц
kakebo.get('/goals', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(401, 'Требуется авторизация')

  const year = parseInt(c.req.query('year') || new Date().getFullYear().toString())
  const month = parseInt(c.req.query('month') || (new Date().getMonth() + 1).toString())

  const goal = await prisma.kakeboMonthlyGoal.findUnique({
    where: { profileId_year_month: { profileId: profile.id, year, month } },
  })

  return c.json({ goal })
})

// ==================== POST /api/kakebo/goals ====================
// Создать/обновить цель на месяц
kakebo.post('/goals', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(401, 'Требуется авторизация')

  const body = await c.req.json()
  const parsed = KakeboMonthlyGoalSchema.safeParse(body)

  if (!parsed.success) {
    throw new AppError(400, `Ошибка валидации: ${parsed.error.message}`)
  }

  const { year, month, promise, targetSave, achieved } = parsed.data

  const goal = await prisma.kakeboMonthlyGoal.upsert({
    where: { profileId_year_month: { profileId: profile.id, year, month } },
    create: { profileId: profile.id, year, month, promise, targetSave, achieved },
    update: { promise, targetSave, achieved },
  })

  return c.json({ message: 'Цель сохранена', goal })
})

// ==================== GET /api/kakebo/fixed-expenses ====================
// Получить все активные фиксированные траты пользователя
kakebo.get('/fixed-expenses', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(401, 'Требуется авторизация')

  const isActive = c.req.query('isActive')
  const categoryId = c.req.query('categoryId')

  const where: any = {
    profileId: profile.id,
  }

  if (isActive !== undefined) {
    where.isActive = isActive === 'true'
  }

  if (categoryId) {
    where.categoryId = categoryId
  }

  const fixedExpenses = await prisma.kakeboFixedExpense.findMany({
    where,
    include: {
      category: {
        select: {
          id: true,
          name: true,
          icon: true,
        },
      },
    },
    orderBy: { dayOfMonth: 'asc' },
  })

  return c.json({ fixedExpenses })
})

// ==================== POST /api/kakebo/fixed-expenses ====================
// Создать фиксированную трату
kakebo.post('/fixed-expenses', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(401, 'Требуется авторизация')

  const body = await c.req.json()
  const parsed = KakeboFixedExpenseSchema.safeParse(body)

  if (!parsed.success) {
    throw new AppError(400, `Ошибка валидации: ${parsed.error.message}`)
  }

  const { categoryId, description, amount, dayOfMonth, startDate, endDate, notes } = parsed.data

  // Проверка категории
  const category = await prisma.kakeboCategory.findFirst({
    where: {
      id: categoryId,
      OR: [
        { profileId: null },
        { profileId: profile.id },
      ],
    },
  })

  if (!category) {
    throw new AppError(404, 'Категория не найдена', 'NOT_FOUND')
  }

  const fixedExpense = await prisma.kakeboFixedExpense.create({
    data: {
      profileId: profile.id,
      categoryId,
      description,
      amount,
      dayOfMonth,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      notes,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          icon: true,
        },
      },
    },
  })

  // Создать автоматические записи на 4 месяца вперёд
  await createFutureEntriesForFixedExpense(
    fixedExpense.id,
    profile.id,
    categoryId,
    description,
    amount,
    category.isEssential,
    dayOfMonth
  )

  return c.json({ message: 'Фиксированная трата создана', fixedExpense }, 201)
})

// ==================== PUT /api/kakebo/fixed-expenses/:id ====================
// Обновить фиксированную трату
kakebo.put('/fixed-expenses/:id', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(401, 'Требуется авторизация')

  const id = c.req.param('id')
  const body = await c.req.json()
  const parsed = KakeboFixedExpenseSchema.partial().safeParse(body)

  if (!parsed.success) {
    throw new AppError(400, `Ошибка валидации: ${parsed.error.message}`)
  }

  // Проверка существования и принадлежности
  const existing = await prisma.kakeboFixedExpense.findFirst({
    where: {
      id,
      profileId: profile.id,
    },
  })

  if (!existing) {
    throw new AppError(404, 'Фиксированная трата не найдена', 'NOT_FOUND')
  }

  const fixedExpense = await prisma.kakeboFixedExpense.update({
    where: { id },
    data: {
      ...parsed.data,
      startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : undefined,
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : undefined,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          icon: true,
        },
      },
    },
  })

  return c.json({ message: 'Фиксированная трата обновлена', fixedExpense })
})

// ==================== DELETE /api/kakebo/fixed-expenses/:id ====================
// Удалить фиксированную трату
kakebo.delete('/fixed-expenses/:id', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(401, 'Требуется авторизация')

  const id = c.req.param('id')

  // Проверка существования и принадлежности
  const existing = await prisma.kakeboFixedExpense.findFirst({
    where: {
      id,
      profileId: profile.id,
    },
  })

  if (!existing) {
    throw new AppError(404, 'Фиксированная трата не найдена', 'NOT_FOUND')
  }

  // Получить данные фиксированной траты перед удалением
  const expenseData = await prisma.kakeboFixedExpense.findUnique({
    where: { id },
    select: { categoryId: true, dayOfMonth: true },
  })

  await prisma.kakeboFixedExpense.delete({
    where: { id },
  })

  // Удалить автоматические будущие записи
  if (expenseData) {
    await deleteFutureEntriesForFixedExpense(
      profile.id,
      expenseData.categoryId,
      expenseData.dayOfMonth
    )
  }

  return c.json({ message: 'Фиксированная трата удалена' })
})

// ==================== GET /api/kakebo/budget/:year/:month ====================
// Получить бюджет и расчёт уравнения
kakebo.get('/budget/:year/:month', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(401, 'Требуется авторизация')

  const year = parseInt(c.req.param('year'))
  const month = parseInt(c.req.param('month'))

  // Получаем бюджет
  const budget = await prisma.kakeboMonthlyBudget.findUnique({
    where: { profileId_year_month: { profileId: profile.id, year, month } },
  })

  // Получаем цель по сбережениям
  const goal = await prisma.kakeboMonthlyGoal.findUnique({
    where: { profileId_year_month: { profileId: profile.id, year, month } },
  })

  // Получаем все записи за месяц
  const entries = await prisma.kakeboEntry.findMany({
    where: {
      profileId: profile.id,
      year,
      month,
      categoryId: { not: null },
    },
    include: {
      category: true,
    },
  })

  // Расчёт
  const income = budget?.income || 0
  const fixedExpenses = entries
    .filter(e => e.category?.isFixed)
    .reduce((sum, e) => sum + e.amount, 0)
  const savingGoal = goal?.targetSave || 0
  const remaining = income - fixedExpenses - savingGoal
  const spentOnVariable = entries
    .filter(e => !e.category?.isFixed)
    .reduce((sum, e) => sum + e.amount, 0)
  const remainingToSpend = remaining - spentOnVariable
  const isOverBudget = remainingToSpend < 0

  return c.json({
    budget: budget || { profileId: profile.id, year, month, income: 0 },
    calculation: {
      income,
      fixedExpenses,
      savingGoal,
      remaining,
      spentOnVariable,
      remainingToSpend,
      isOverBudget,
    },
    warning: isOverBudget
      ? `Вы превысили бюджет на нефиксированные траты на ${Math.abs(remainingToSpend).toFixed(0)} у.е.`
      : null,
  })
})

// ==================== POST /api/kakebo/generate ====================
// Сгенерировать записи из фиксированных трат для указанного месяца
kakebo.post('/generate', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(401, 'Требуется авторизация')

  const body = await c.req.json()
  const year = z.number().int().min(1900).max(2100).parse(body.year)
  const month = z.number().int().min(1).max(12).parse(body.month)

  const result = await generateFixedExpensesForMonth(profile.id, year, month)

  return c.json({
    message: 'Генерация завершена',
    result,
  })
})

// ==================== PUT /api/kakebo/budget/:year/:month ====================
// Обновить бюджет (доход)
kakebo.put('/budget/:year/:month', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(401, 'Требуется авторизация')

  const year = parseInt(c.req.param('year'))
  const month = parseInt(c.req.param('month'))
  const body = await c.req.json()
  const parsed = KakeboMonthlyBudgetSchema.safeParse(body)

  if (!parsed.success) {
    throw new AppError(400, `Ошибка валидации: ${parsed.error.message}`)
  }

  const { income } = parsed.data

  const budget = await prisma.kakeboMonthlyBudget.upsert({
    where: { profileId_year_month: { profileId: profile.id, year, month } },
    create: { profileId: profile.id, year, month, income },
    update: { income },
  })

  // Пересчитать уравнение
  const goal = await prisma.kakeboMonthlyGoal.findUnique({
    where: { profileId_year_month: { profileId: profile.id, year, month } },
  })

  const entries = await prisma.kakeboEntry.findMany({
    where: {
      profileId: profile.id,
      year,
      month,
      categoryId: { not: null },
    },
    include: { category: true },
  })

  const fixedExpenses = entries
    .filter(e => e.category?.isFixed)
    .reduce((sum, e) => sum + e.amount, 0)
  const savingGoal = goal?.targetSave || 0
  const remaining = income - fixedExpenses - savingGoal
  const spentOnVariable = entries
    .filter(e => !e.category?.isFixed)
    .reduce((sum, e) => sum + e.amount, 0)
  const remainingToSpend = remaining - spentOnVariable

  return c.json({
    message: 'Бюджет обновлён',
    budget,
    calculation: {
      income,
      fixedExpenses,
      savingGoal,
      remaining,
      spentOnVariable,
      remainingToSpend,
      isOverBudget: remainingToSpend < 0,
    },
  })
})

export default kakebo
