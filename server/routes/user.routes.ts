// server/routes/user.routes.ts
import { Hono } from 'hono'
import { prisma } from '../db'
import { AppError } from '../lib/errors'
import type { FavoriteWhereInput, ContextWithSession } from '../types'

const user = new Hono()

// Вспомогательная функция для получения профиля из сессии
async function getProfileFromSession(c: ContextWithSession) {
  const cookie = c.req.header('Cookie')
  const sessionMatch = cookie?.match(/session=([^;]+)/)
  
  if (!sessionMatch?.[1]) {
    throw new AppError(401, 'Не авторизован', 'UNAUTHORIZED')
  }

  const session = await prisma.session.findUnique({
    where: { sessionToken: sessionMatch[1], expires: { gt: new Date() } },
    include: {
      user: {
        include: { profile: true }
      }
    }
  })

  if (!session || !session.user.profile) {
    throw new AppError(401, 'Сессия истекла', 'SESSION_EXPIRED')
  }

  return { user: session.user, profile: session.user.profile }
}

// === GET /user/me — текущий пользователь ===
user.get('/me', async (c) => {
  try {
    const { user, profile } = await getProfileFromSession(c)

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profile: {
          id: profile.id,
          nickname: profile.nickname,
          displayName: profile.displayName,
          avatarUrl: profile.avatarUrl,
          bio: profile.bio,
          website: profile.website,
          telegram: profile.telegram,
          youtube: profile.youtube
        }
      }
    })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Get user error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === PATCH /user/profile — обновление профиля ===
user.patch('/profile', async (c) => {
  try {
    const { profile } = await getProfileFromSession(c)
    const body = await c.req.json()

    const { displayName, bio, website, telegram, youtube } = body

    const updated = await prisma.profile.update({
      where: { id: profile.id },
      data: {
        displayName: displayName || profile.displayName,
        bio: bio ?? profile.bio,
        website: website ?? profile.website,
        telegram: telegram ?? profile.telegram,
        youtube: youtube ?? profile.youtube
      }
    })

    return c.json({
      message: 'Профиль обновлён',
      profile: {
        id: updated.id,
        nickname: updated.nickname,
        displayName: updated.displayName,
        avatarUrl: updated.avatarUrl,
        bio: updated.bio,
        website: updated.website,
        telegram: updated.telegram,
        youtube: updated.youtube
      }
    })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Update profile error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === GET /user/profile/:nickname — публичный профиль ===
user.get('/profile/:nickname', async (c) => {
  try {
    const nickname = c.req.param('nickname')

    const profile = await prisma.profile.findUnique({
      where: { nickname },
      include: {
        user: {
          select: { firstName: true, lastName: true, role: true, createdAt: true }
        },
        _count: { select: { courses: true, lessons: true } }
      }
    })

    if (!profile) {
      throw new AppError(404, 'Профиль не найден', 'PROFILE_NOT_FOUND')
    }

    return c.json({
      profile: {
        id: profile.id,
        nickname: profile.nickname,
        displayName: profile.displayName,
        avatarUrl: profile.avatarUrl,
        bio: profile.bio,
        website: profile.website,
        telegram: profile.telegram,
        youtube: profile.youtube,
        totalViews: profile.totalViews,
        subscribers: profile.subscribers,
        createdAt: profile.createdAt,
        user: profile.user,
        _count: profile._count
      }
    })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Get public profile error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === GET /user/history — история просмотров ===
user.get('/history', async (c) => {
  try {
    const { profile } = await getProfileFromSession(c)
    const page = Math.max(1, parseInt(c.req.query('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(c.req.query('limit') || '20')))
    const skip = (page - 1) * limit

    const [items, total] = await Promise.all([
      prisma.history.findMany({
        where: { 
          profileId: profile.id,
          historableType: 'LESSON'
        },
        skip,
        take: limit,
        orderBy: { viewedAt: 'desc' }
      }),
      prisma.history.count({ 
        where: { 
          profileId: profile.id,
          historableType: 'LESSON'
        } 
      })
    ])

    // Получаем уроки отдельно
    const lessonIds = items.map(h => h.historableId)
    const lessons = await prisma.lesson.findMany({
      where: {
        id: { in: lessonIds },
        deletedAt: null 
      },
      select: {
        id: true,
        title: true,
        slug: true,
        lessonType: true,
        duration: true,
        coverImage: true,
        module: {
          select: {
            id: true,
            title: true,
            course: { select: { id: true, title: true, slug: true } }
          }
        }
      }
    })

    const lessonsMap = new Map(lessons.map(l => [l.id, l]))

    return c.json({
      items: items.map(h => ({
        id: h.id,
        watchedSeconds: h.watchedSeconds,
        completed: h.completed,
        viewedAt: h.viewedAt,
        lesson: lessonsMap.get(h.historableId) || null
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Get history error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === POST /user/history — добавить в историю ===
user.post('/history', async (c) => {
  try {
    const { profile } = await getProfileFromSession(c)
    const { lessonId, watchedSeconds, completed } = await c.req.json()

    const history = await prisma.history.upsert({
      where: {
        profileId_historableType_historableId: {
          profileId: profile.id,
          historableType: 'LESSON',
          historableId: lessonId
        }
      },
      update: {
        watchedSeconds: watchedSeconds ?? undefined,
        completed: completed ?? undefined,
        viewedAt: new Date()
      },
      create: {
        profileId: profile.id,
        historableType: 'LESSON',
        historableId: lessonId,
        watchedSeconds,
        completed: completed ?? false
      }
    })

    return c.json({ message: 'История обновлена', history })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Add history error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === GET /user/favorites — избранное ===
user.get('/favorites', async (c) => {
  try {
    const { profile } = await getProfileFromSession(c)
    const page = Math.max(1, parseInt(c.req.query('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(c.req.query('limit') || '20')))
    const skip = (page - 1) * limit
    const collection = c.req.query('collection')

    const where: FavoriteWhereInput = { profileId: profile.id }
    if (collection) where.collection = collection

    const [items, total] = await Promise.all([
      prisma.favorite.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          lesson: {
            select: {
              id: true,
              title: true,
              slug: true,
              lessonType: true,
              duration: true,
              coverImage: true,
              module: {
                select: {
                  id: true,
                  title: true,
                  course: { select: { id: true, title: true, slug: true } }
                }
              }
            }
          }
        }
      }),
      prisma.favorite.count({ where })
    ])

    return c.json({
      items: items.map(f => ({
        id: f.id,
        note: f.note,
        collection: f.collection,
        createdAt: f.createdAt,
        lesson: f.lesson
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Get favorites error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === POST /user/favorites — добавить в избранное ===
user.post('/favorites', async (c) => {
  try {
    const { profile } = await getProfileFromSession(c)
    const { lessonId, note, collection } = await c.req.json()

    const favorite = await prisma.favorite.create({
      data: {
        profileId: profile.id,
        lessonId,
        note,
        collection
      }
    })

    return c.json({ message: 'Добавлено в избранное', favorite }, 201)
  } catch (error: unknown) {
    const prismaError = error as { code?: string }
    if (prismaError.code === 'P2002') {
      return c.json({ error: 'Уже в избранном' }, 400)
    }
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Add favorite error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === DELETE /user/favorites/:id — удалить из избранного ===
user.delete('/favorites/:id', async (c) => {
  try {
    const { profile } = await getProfileFromSession(c)
    const id = c.req.param('id')

    const favorite = await prisma.favorite.findFirst({
      where: { id, profileId: profile.id }
    })

    if (!favorite) {
      throw new AppError(404, 'Не найдено в избранном', 'FAVORITE_NOT_FOUND')
    }

    await prisma.favorite.delete({ where: { id } })

    return c.json({ message: 'Удалено из избранного' })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Delete favorite error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === GET /user/progress/courses — прогресс по курсам ===
user.get('/progress/courses', async (c) => {
  try {
    const { profile } = await getProfileFromSession(c)

    const progress = await prisma.courseProgress.findMany({
      where: { profileId: profile.id } as const,
      orderBy: { lastViewedAt: 'desc' },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true,
            lessonsCount: true,
            modulesCount: true
          }
        }
      }
    })

    return c.json({
      items: progress.map(p => ({
        id: p.id,
        status: p.status,
        progressPercent: p.progressPercent,
        completedLessons: p.completedLessons,
        totalLessons: p.totalLessons,
        startedAt: p.startedAt,
        completedAt: p.completedAt,
        lastViewedAt: p.lastViewedAt,
        course: p.course
      }))
    })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Get course progress error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === GET /user/progress/lessons/:id — прогресс по уроку ===
user.get('/progress/lessons/:id', async (c) => {
  try {
    const { profile } = await getProfileFromSession(c)
    const lessonId = c.req.param('id')

    const progress = await prisma.lessonProgress.findUnique({
      where: {
        profileId_lessonId: { profileId: profile.id, lessonId }
      }
    })

    if (!progress) {
      return c.json({ progress: null })
    }

    return c.json({
      progress: {
        id: progress.id,
        status: progress.status,
        progressPercent: progress.progressPercent,
        lastPosition: progress.lastPosition,
        quizScore: progress.quizScore,
        quizCompleted: progress.quizCompleted,
        startedAt: progress.startedAt,
        completedAt: progress.completedAt,
        lastViewedAt: progress.lastViewedAt
      }
    })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Get lesson progress error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === POST /user/progress/lessons/:id — обновить прогресс урока ===
user.post('/progress/lessons/:id', async (c) => {
  try {
    const { profile } = await getProfileFromSession(c)
    const lessonId = c.req.param('id')
    const { progressPercent, lastPosition, quizScore, quizCompleted, completed } = await c.req.json()

    const progress = await prisma.lessonProgress.upsert({
      where: {
        profileId_lessonId: { profileId: profile.id, lessonId }
      },
      update: {
        progressPercent: progressPercent ?? undefined,
        lastPosition: lastPosition ?? undefined,
        quizScore: quizScore ?? undefined,
        quizCompleted: quizCompleted ?? undefined,
        status: completed ? 'completed' : 'in_progress',
        completedAt: completed ? new Date() : undefined,
        lastViewedAt: new Date()
      },
      create: {
        profileId: profile.id,
        lessonId,
        progressPercent: progressPercent ?? 0,
        lastPosition,
        quizScore,
        quizCompleted: quizCompleted ?? false,
        status: completed ? 'completed' : 'in_progress',
        startedAt: new Date(),
        completedAt: completed ? new Date() : undefined
      }
    })

    return c.json({ message: 'Прогресс обновлён', progress })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Update lesson progress error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === GET /user/certificates — сертификаты ===
user.get('/certificates', async (c) => {
  try {
    const { profile } = await getProfileFromSession(c)

    const certificates = await prisma.certificate.findMany({
      where: { profileId: profile.id },
      orderBy: { issuedAt: 'desc' },
      include: {
        course: {
          select: { id: true, title: true, slug: true, coverImage: true }
        }
      }
    })

    return c.json({
      items: certificates.map(cert => ({
        id: cert.id,
        certificateNumber: cert.certificateNumber,
        issuedAt: cert.issuedAt,
        completedAt: cert.completedAt,
        imageUrl: cert.imageUrl,
        pdfUrl: cert.pdfUrl,
        course: cert.course
      }))
    })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Get certificates error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export default user
