// server/routes/admin.routes.ts
import { Hono } from 'hono'
import { prisma } from '../db'
import { AppError } from '../lib/errors'

const admin = new Hono()

// Middleware: проверка прав админа
async function requireAdmin(c: { req: { header: (name: string) => string | undefined } }) {
  const sessionToken = c.req.header('Cookie')?.match(/session=([^;]+)/)?.[1]
  
  if (!sessionToken) {
    throw new AppError(401, 'Не авторизован', 'UNAUTHORIZED')
  }

  const session = await prisma.session.findUnique({
    where: { token: sessionToken },
    include: { profile: true }
  })

  if (!session || session.expiresAt < new Date()) {
    throw new AppError(401, 'Сессия истекла', 'SESSION_EXPIRED')
  }

  if (session.profile.role !== 'ADMIN') {
    throw new AppError(403, 'Доступ запрещён', 'FORBIDDEN')
  }

  return { profile: session.profile }
}

// === DASHBOARD ===
admin.get('/stats', async (c) => {
  try {
    await requireAdmin(c)

    const [
      usersCount,
      coursesCount,
      lessonsCount,
      publishedCourses,
      publishedLessons,
      totalViews,
      premiumUsers
    ] = await Promise.all([
      prisma.profile.count(),
      prisma.course.count({ where: { deletedAt: null } }),
      prisma.lesson.count({ where: { deletedAt: null } }),
      prisma.course.count({ where: { deletedAt: null, status: 'PUBLISHED' } }),
      prisma.lesson.count({ where: { deletedAt: null, status: 'PUBLISHED' } }),
      prisma.course.aggregate({ _sum: { viewsCount: true } }),
      prisma.subscription.count({ where: { status: 'ACTIVE' } })
    ])

    return c.json({
      usersCount,
      coursesCount,
      lessonsCount,
      publishedCourses,
      publishedLessons,
      totalViews: totalViews._sum.viewsCount || 0,
      premiumUsers
    })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Admin stats error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === USERS ===
admin.get('/users', async (c) => {
  try {
    await requireAdmin(c)
    
    const page = Math.max(1, parseInt(c.req.query('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(c.req.query('limit') || '20')))
    const search = c.req.query('search')
    const role = c.req.query('role')
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (search) {
      where.OR = [
        { email: { contains: search } },
        { nickname: { contains: search } },
        { displayName: { contains: search } }
      ]
    }
    if (role) where.role = role

    const [items, total] = await Promise.all([
      prisma.profile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          nickname: true,
          displayName: true,
          avatarUrl: true,
          bio: true,
          role: true,
          createdAt: true,
          _count: { select: { courses: true, lessons: true } }
        }
      }),
      prisma.profile.count({ where })
    ])

    return c.json({
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Admin users error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

admin.patch('/users/:id', async (c) => {
  try {
    await requireAdmin(c)
    
    const id = c.req.param('id')
    const { role, displayName, bio } = await c.req.json()

    const user = await prisma.profile.update({
      where: { id },
      data: { role, displayName, bio }
    })

    return c.json(user)
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Admin update user error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

admin.delete('/users/:id', async (c) => {
  try {
    await requireAdmin(c)
    
    const id = c.req.param('id')

    await prisma.profile.delete({ where: { id } })

    return c.json({ message: 'Пользователь удалён' })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Admin delete user error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === COURSES ===
admin.get('/courses', async (c) => {
  try {
    await requireAdmin(c)
    
    const page = Math.max(1, parseInt(c.req.query('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(c.req.query('limit') || '20')))
    const status = c.req.query('status')
    const search = c.req.query('search')
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = { deletedAt: null }
    if (status) where.status = status
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ]
    }

    const [items, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, nickname: true, displayName: true } },
          tags: { include: { tag: true } },
          _count: { select: { modules: true, progress: true } }
        }
      }),
      prisma.course.count({ where })
    ])

    return c.json({
      items: items.map(course => ({
        ...course,
        tags: course.tags.map(t => t.tag)
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Admin courses error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

admin.post('/courses', async (c) => {
  try {
    const { profile } = await requireAdmin(c)
    
    const {
      title, slug, description, coverImage,
      difficultyLevel, duration, isPremium, status,
      tagIds
    } = await c.req.json()

    const existing = await prisma.course.findUnique({ where: { slug } })
    if (existing) {
      return c.json({ error: 'Курс с таким slug уже существует' }, 400)
    }

    const course = await prisma.course.create({
      data: {
        title,
        slug,
        description,
        coverImage,
        difficultyLevel: difficultyLevel || 'BEGINNER',
        duration: duration || 0,
        lessonsCount: 0,
        modulesCount: 0,
        isPremium: isPremium || false,
        status: status || 'DRAFT',
        authorId: profile.id,
        tags: tagIds ? {
          create: tagIds.map((tagId: string) => ({ tagId }))
        } : undefined
      },
      include: { tags: { include: { tag: true } } }
    })

    return c.json(course, 201)
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Admin create course error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

admin.patch('/courses/:id', async (c) => {
  try {
    await requireAdmin(c)
    
    const id = c.req.param('id')
    const {
      title, slug, description, coverImage,
      difficultyLevel, duration, isPremium, status,
      tagIds
    } = await c.req.json()

    if (slug) {
      const existing = await prisma.course.findFirst({
        where: { slug, NOT: { id } }
      })
      if (existing) {
        return c.json({ error: 'Курс с таким slug уже существует' }, 400)
      }
    }

    if (tagIds !== undefined) {
      await prisma.courseTag.deleteMany({ where: { courseId: id } })
      if (tagIds.length > 0) {
        await prisma.courseTag.createMany({
          data: tagIds.map((tagId: string) => ({ courseId: id, tagId }))
        })
      }
    }

    const course = await prisma.course.update({
      where: { id },
      data: {
        title, slug, description, coverImage,
        difficultyLevel, duration, isPremium, status
      },
      include: {
        author: { select: { id: true, nickname: true, displayName: true } },
        tags: { include: { tag: true } },
        modules: { orderBy: { sortOrder: 'asc' } }
      }
    })

    return c.json({ ...course, tags: course.tags.map(t => t.tag) })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Admin update course error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

admin.delete('/courses/:id', async (c) => {
  try {
    await requireAdmin(c)
    const id = c.req.param('id')
    await prisma.course.update({ where: { id }, data: { deletedAt: new Date() } })
    return c.json({ message: 'Курс удалён' })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Admin delete course error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === MODULES ===
admin.get('/modules', async (c) => {
  try {
    await requireAdmin(c)
    const courseId = c.req.query('courseId')
    if (!courseId) return c.json({ error: 'courseId обязателен' }, 400)

    const modules = await prisma.module.findMany({
      where: { courseId, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { lessons: true } } }
    })

    return c.json({ items: modules })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Admin modules error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

admin.post('/modules', async (c) => {
  try {
    await requireAdmin(c)
    const { courseId, title, description, sortOrder } = await c.req.json()

    const maxOrder = await prisma.module.findFirst({
      where: { courseId, deletedAt: null },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true }
    })

    const module = await prisma.module.create({
      data: {
        courseId,
        title,
        description,
        sortOrder: sortOrder ?? (maxOrder?.sortOrder ?? 0) + 1,
        lessonsCount: 0,
        duration: 0
      }
    })

    await prisma.course.update({
      where: { id: courseId },
      data: { modulesCount: { increment: 1 } }
    })

    return c.json(module, 201)
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Admin create module error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

admin.patch('/modules/:id', async (c) => {
  try {
    await requireAdmin(c)
    const id = c.req.param('id')
    const { title, description, sortOrder } = await c.req.json()

    const module = await prisma.module.update({
      where: { id },
      data: { title, description, sortOrder }
    })

    return c.json(module)
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Admin update module error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

admin.delete('/modules/:id', async (c) => {
  try {
    await requireAdmin(c)
    const id = c.req.param('id')

    const module = await prisma.module.findUnique({ where: { id } })
    if (!module) return c.json({ error: 'Модуль не найден' }, 404)

    await prisma.module.update({ where: { id }, data: { deletedAt: new Date() } })
    await prisma.course.update({
      where: { id: module.courseId },
      data: { modulesCount: { decrement: 1 } }
    })

    return c.json({ message: 'Модуль удалён' })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Admin delete module error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === LESSONS ===
admin.get('/lessons', async (c) => {
  try {
    await requireAdmin(c)
    const page = Math.max(1, parseInt(c.req.query('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(c.req.query('limit') || '20')))
    const moduleId = c.req.query('moduleId')
    const status = c.req.query('status')
    const search = c.req.query('search')
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = { deletedAt: null }
    if (moduleId) where.moduleId = moduleId
    if (status) where.status = status
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ]
    }

    const [items, total] = await Promise.all([
      prisma.lesson.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, nickname: true, displayName: true } },
          module: { select: { id: true, title: true, course: { select: { id: true, title: true } } } },
          tags: { include: { tag: true } }
        }
      }),
      prisma.lesson.count({ where })
    ])

    return c.json({
      items: items.map(l => ({ ...l, tags: l.tags.map(t => t.tag) })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Admin lessons error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

admin.post('/lessons', async (c) => {
  try {
    const { profile } = await requireAdmin(c)
    const { moduleId, title, slug, description, lessonType, duration, isPremium, status, sortOrder, tagIds } = await c.req.json()

    const existing = await prisma.lesson.findUnique({ where: { slug } })
    if (existing) return c.json({ error: 'Урок с таким slug уже существует' }, 400)

    const maxOrder = await prisma.lesson.findFirst({
      where: { moduleId, deletedAt: null },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true }
    })

    const lesson = await prisma.lesson.create({
      data: {
        moduleId, title, slug, description,
        lessonType: lessonType || 'ARTICLE',
        duration: duration || 0,
        isPremium: isPremium || false,
        status: status || 'DRAFT',
        sortOrder: sortOrder ?? (maxOrder?.sortOrder ?? 0) + 1,
        authorId: profile.id,
        tags: tagIds ? { create: tagIds.map((tagId: string) => ({ tagId })) } : undefined
      },
      include: { tags: { include: { tag: true } } }
    })

    await prisma.module.update({
      where: { id: moduleId },
      data: { lessonsCount: { increment: 1 } }
    })

    return c.json(lesson, 201)
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Admin create lesson error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

admin.patch('/lessons/:id', async (c) => {
  try {
    await requireAdmin(c)
    const id = c.req.param('id')
    const { title, slug, description, lessonType, duration, isPremium, status, sortOrder, moduleId, tagIds } = await c.req.json()

    if (slug) {
      const existing = await prisma.lesson.findFirst({ where: { slug, NOT: { id } } })
      if (existing) return c.json({ error: 'Урок с таким slug уже существует' }, 400)
    }

    if (tagIds !== undefined) {
      await prisma.lessonTag.deleteMany({ where: { lessonId: id } })
      if (tagIds.length > 0) {
        await prisma.lessonTag.createMany({ data: tagIds.map((tagId: string) => ({ lessonId: id, tagId })) })
      }
    }

    const lesson = await prisma.lesson.update({
      where: { id },
      data: { title, slug, description, lessonType, duration, isPremium, status, sortOrder, moduleId },
      include: {
        author: { select: { id: true, nickname: true, displayName: true } },
        module: { select: { id: true, title: true, course: { select: { id: true, title: true } } } },
        tags: { include: { tag: true } }
      }
    })

    return c.json({ ...lesson, tags: lesson.tags.map(t => t.tag) })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Admin update lesson error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

admin.delete('/lessons/:id', async (c) => {
  try {
    await requireAdmin(c)
    const id = c.req.param('id')

    const lesson = await prisma.lesson.findUnique({ where: { id } })
    if (!lesson) return c.json({ error: 'Урок не найден' }, 404)

    await prisma.lesson.update({ where: { id }, data: { deletedAt: new Date() } })
    await prisma.module.update({
      where: { id: lesson.moduleId },
      data: { lessonsCount: { decrement: 1 } }
    })

    return c.json({ message: 'Урок удалён' })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Admin delete lesson error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === LESSON CONTENT ===
admin.get('/lessons/:id/content', async (c) => {
  try {
    await requireAdmin(c)
    const id = c.req.param('id')

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      select: {
        lessonType: true,
        textContent: true,
        videoContent: true,
        audioContent: true,
        quizContent: { include: { questions: { orderBy: { order: 'asc' } } } }
      }
    })

    if (!lesson) return c.json({ error: 'Урок не найден' }, 404)

    return c.json(lesson)
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Admin lesson content error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

admin.patch('/lessons/:id/content', async (c) => {
  try {
    await requireAdmin(c)
    const id = c.req.param('id')
    const { lessonType, textContent, videoContent, audioContent, quizContent } = await c.req.json()

    const lesson = await prisma.lesson.findUnique({ where: { id } })
    if (!lesson) return c.json({ error: 'Урок не найден' }, 404)

    // Удаляем старый контент при смене типа
    if (lesson.lessonType !== lessonType) {
      await Promise.all([
        prisma.textContent.deleteMany({ where: { lessonId: id } }),
        prisma.videoContent.deleteMany({ where: { lessonId: id } }),
        prisma.audioContent.deleteMany({ where: { lessonId: id } }),
        prisma.quizContent.deleteMany({ where: { lessonId: id } })
      ])
    }

    // Создаём контент
    switch (lessonType) {
      case 'ARTICLE':
        if (textContent) {
          await prisma.textContent.upsert({
            where: { lessonId: id },
            update: textContent,
            create: { lessonId: id, ...textContent }
          })
        }
        break
      case 'VIDEO':
        if (videoContent) {
          await prisma.videoContent.upsert({
            where: { lessonId: id },
            update: videoContent,
            create: { lessonId: id, ...videoContent }
          })
        }
        break
      case 'AUDIO':
        if (audioContent) {
          await prisma.audioContent.upsert({
            where: { lessonId: id },
            update: audioContent,
            create: { lessonId: id, ...audioContent }
          })
        }
        break
      case 'QUIZ':
        if (quizContent) {
          await prisma.quizQuestion.deleteMany({ where: { quizId: quizContent.id } })
          const quiz = await prisma.quizContent.upsert({
            where: { lessonId: id },
            update: { title: quizContent.title, description: quizContent.description },
            create: { lessonId: id, title: quizContent.title, description: quizContent.description }
          })
          if (quizContent.questions?.length > 0) {
            await prisma.quizQuestion.createMany({
              data: quizContent.questions.map((q: Record<string, unknown>, i: number) => ({
                quizId: quiz.id,
                order: i + 1,
                question: q.question as string,
                type: q.type as string,
                options: q.options,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation as string,
                points: (q.points as number) || 1
              }))
            })
          }
        }
        break
    }

    const updated = await prisma.lesson.update({
      where: { id },
      data: { lessonType },
      include: {
        textContent: true,
        videoContent: true,
        audioContent: true,
        quizContent: { include: { questions: { orderBy: { order: 'asc' } } } }
      }
    })

    return c.json(updated)
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Admin update lesson content error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === TAGS ===
admin.get('/tags', async (c) => {
  try {
    await requireAdmin(c)
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { courses: true, lessons: true } } }
    })
    return c.json({ items: tags })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Admin tags error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

admin.post('/tags', async (c) => {
  try {
    await requireAdmin(c)
    const { name, slug, color } = await c.req.json()

    const existing = await prisma.tag.findUnique({ where: { slug } })
    if (existing) return c.json({ error: 'Тег с таким slug уже существует' }, 400)

    const tag = await prisma.tag.create({
      data: { name, slug, color: color || '#3B82F6' }
    })

    return c.json(tag, 201)
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Admin create tag error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

admin.patch('/tags/:id', async (c) => {
  try {
    await requireAdmin(c)
    const id = c.req.param('id')
    const { name, slug, color } = await c.req.json()

    if (slug) {
      const existing = await prisma.tag.findFirst({ where: { slug, NOT: { id } } })
      if (existing) return c.json({ error: 'Тег с таким slug уже существует' }, 400)
    }

    const tag = await prisma.tag.update({ where: { id }, data: { name, slug, color } })
    return c.json(tag)
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Admin update tag error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

admin.delete('/tags/:id', async (c) => {
  try {
    await requireAdmin(c)
    const id = c.req.param('id')
    await prisma.tag.delete({ where: { id } })
    return c.json({ message: 'Тег удалён' })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Admin delete tag error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export default admin
