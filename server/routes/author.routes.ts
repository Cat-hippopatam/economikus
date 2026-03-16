// server/routes/author.routes.ts
import { Hono } from 'hono'
import { prisma } from '../db'
import { requireAuth, getCurrentProfile, getCurrentUser } from '../middleware/auth'
import { AppError } from '../lib/errors'

const author = new Hono()

// Все роуты требуют авторизации
author.use('*', requireAuth)

// === GET /author/application — получить текущую заявку ===
author.get('/application', async (c) => {
  const profile = getCurrentProfile(c)
  if (!profile) throw new AppError(401, 'Профиль не найден')

  const application = await prisma.authorApplication.findFirst({
    where: { profileId: profile.id },
    orderBy: { createdAt: 'desc' },
    include: {
      reviewer: { select: { id: true, nickname: true, displayName: true } }
    }
  })

  return c.json({ application })
})

// === POST /author/apply — подать заявку на статус автора ===
author.post('/apply', async (c) => {
  const profile = getCurrentProfile(c)
  const user = getCurrentUser(c)
  if (!profile) throw new AppError(401, 'Профиль не найден')

  // Проверяем, что пользователь ещё не автор
  if (user.role === 'AUTHOR' || user.role === 'MODERATOR' || user.role === 'ADMIN') {
    throw new AppError(400, 'Вы уже имеете статус автора или выше')
  }

  // Проверяем, нет ли уже pending заявки
  const existingPending = await prisma.authorApplication.findFirst({
    where: { profileId: profile.id, status: 'PENDING' }
  })
  if (existingPending) {
    throw new AppError(400, 'У вас уже есть заявка на рассмотрении')
  }

  const { motivation, experience, portfolioUrl } = await c.req.json()

  if (!motivation || motivation.trim().length < 50) {
    throw new AppError(400, 'Мотивация должна содержать минимум 50 символов')
  }

  const application = await prisma.authorApplication.create({
    data: {
      profileId: profile.id,
      motivation: motivation.trim(),
      experience: experience?.trim() || null,
      portfolioUrl: portfolioUrl?.trim() || null,
    }
  })

  return c.json({ message: 'Заявка успешно отправлена', application }, 201)
})

// === GET /author/my-content — контент автора (заглушка) ===
author.get('/my-content', async (c) => {
  const profile = getCurrentProfile(c)
  const user = getCurrentUser(c)
  
  if (!profile) throw new AppError(401, 'Профиль не найден')
  if (user.role !== 'AUTHOR' && user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
    throw new AppError(403, 'Доступ только для авторов')
  }

  // Получаем курсы и уроки автора
  const [courses, lessons] = await Promise.all([
    prisma.course.findMany({
      where: { authorProfileId: profile.id, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { _count: { select: { modules: true, progress: true } } }
    }),
    prisma.lesson.findMany({
      where: { authorProfileId: profile.id, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { module: { select: { id: true, title: true, course: { select: { id: true, title: true } } } } }
    })
  ])

  // Статистика
  const stats = await prisma.profile.findUnique({
    where: { id: profile.id },
    select: { totalViews: true, subscribers: true }
  })

  return c.json({
    stats: {
      totalViews: stats?.totalViews || 0,
      subscribers: stats?.subscribers || 0,
      coursesCount: courses.length,
      lessonsCount: lessons.length
    },
    courses: courses.map(c => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      status: c.status,
      viewsCount: c.viewsCount,
      modulesCount: c._count.modules,
      studentsCount: c._count.progress,
      createdAt: c.createdAt
    })),
    lessons: lessons.map(l => ({
      id: l.id,
      title: l.title,
      slug: l.slug,
      status: l.status,
      viewsCount: l.viewsCount,
      course: l.module?.course,
      createdAt: l.createdAt
    }))
  })
})

// === GET /author/stats — статистика автора ===
author.get('/stats', async (c) => {
  const profile = getCurrentProfile(c)
  const user = getCurrentUser(c)
  
  if (!profile) throw new AppError(401, 'Профиль не найден')
  if (user.role !== 'AUTHOR' && user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
    throw new AppError(403, 'Доступ только для авторов')
  }

  const [coursesCount, lessonsCount, totalViews, totalStudents] = await Promise.all([
    prisma.course.count({ where: { authorProfileId: profile.id, deletedAt: null } }),
    prisma.lesson.count({ where: { authorProfileId: profile.id, deletedAt: null } }),
    prisma.course.aggregate({
      where: { authorProfileId: profile.id, deletedAt: null },
      _sum: { viewsCount: true }
    }),
    prisma.courseProgress.count({
      where: { course: { authorProfileId: profile.id } }
    })
  ])

  return c.json({
    coursesCount,
    lessonsCount,
    totalViews: totalViews._sum.viewsCount || 0,
    totalStudents
  })
})

export default author
