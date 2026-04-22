// server/routes/tags.routes.ts
import { Hono } from 'hono'
import { prisma } from '../db'
import { AppError } from '../lib/errors'

const tags = new Hono()

// === GET /tags — список всех тегов ===
tags.get('/', async (c) => {
  try {
    const items = await prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { courses: true, lessons: true } }
      }
    })

    return c.json({
      items: items.map(tag => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        color: tag.color,
        _count: tag._count
      }))
    })
  } catch (error) {
    console.error('Get tags error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === GET /tags/:slug/courses — курсы по тегу ===
tags.get('/:slug/courses', async (c) => {
  try {
    const slug = c.req.param('slug')
    const page = Math.max(1, parseInt(c.req.query('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(c.req.query('limit') || '20')))
    const skip = (page - 1) * limit

    const tag = await prisma.tag.findUnique({ where: { slug } })
    if (!tag) {
      throw new AppError(404, 'Тег не найден', 'TAG_NOT_FOUND')
    }

    const [items, total] = await Promise.all([
      prisma.course.findMany({
        where: {
          deletedAt: null,
          status: 'PUBLISHED',
          tags: { some: { tagId: tag.id } }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, nickname: true, displayName: true, avatarUrl: true } },
          _count: { select: { modules: true } }
        }
      }),
      prisma.course.count({
        where: {
          deletedAt: null,
          status: 'PUBLISHED',
          tags: { some: { tagId: tag.id } }
        }
      })
    ])

    return c.json({
      tag: { id: tag.id, name: tag.name, slug: tag.slug, color: tag.color },
      items: items.map(course => ({
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        coverImage: course.coverImage,
        difficultyLevel: course.difficultyLevel,
        lessonsCount: course.lessonsCount,
        isPremium: course.isPremium,
        viewsCount: course.viewsCount,
        author: course.author,
        _count: course._count
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode as any)
    }
    console.error('Get courses by tag error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === GET /tags/:slug/lessons — уроки по тегу ===
tags.get('/:slug/lessons', async (c) => {
  try {
    const slug = c.req.param('slug')
    const page = Math.max(1, parseInt(c.req.query('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(c.req.query('limit') || '20')))
    const skip = (page - 1) * limit

    const tag = await prisma.tag.findUnique({ where: { slug } })
    if (!tag) {
      throw new AppError(404, 'Тег не найден', 'TAG_NOT_FOUND')
    }

    const [items, total] = await Promise.all([
      prisma.lesson.findMany({
        where: {
          deletedAt: null,
          status: 'PUBLISHED',
          tags: { some: { tagId: tag.id } }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, nickname: true, displayName: true, avatarUrl: true } },
          module: { select: { id: true, title: true, course: { select: { id: true, title: true, slug: true } } } }
        }
      }),
      prisma.lesson.count({
        where: {
          deletedAt: null,
          status: 'PUBLISHED',
          tags: { some: { tagId: tag.id } }
        }
      })
    ])

    return c.json({
      tag: { id: tag.id, name: tag.name, slug: tag.slug, color: tag.color },
      items: items.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        slug: lesson.slug,
        description: lesson.description,
        lessonType: lesson.lessonType,
        duration: lesson.duration,
        coverImage: lesson.coverImage,
        isPremium: lesson.isPremium,
        viewsCount: lesson.viewsCount,
        author: lesson.author,
        module: lesson.module
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode as any)
    }
    console.error('Get lessons by tag error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export default tags


