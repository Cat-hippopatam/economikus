// server/routes/lessons.routes.ts
import { Hono } from 'hono'
import { prisma } from '../db'
import { AppError } from '../lib/errors'
import type { LessonWhereInput } from '../types'

const lessons = new Hono()

// === GET /lessons — список уроков с пагинацией и фильтрами ===
lessons.get('/', async (c) => {
  try {
    const page = Math.max(1, parseInt(c.req.query('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(c.req.query('limit') || '20')))
    const skip = (page - 1) * limit

    const status = c.req.query('status') as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | null
    const lessonType = c.req.query('lessonType') as 'ARTICLE' | 'VIDEO' | 'AUDIO' | 'QUIZ' | null
    const tag = c.req.query('tag')
    const search = c.req.query('search')
    const isPremium = c.req.query('isPremium')

    const where: LessonWhereInput = { deletedAt: null }
    
    if (status) where.status = status
    if (lessonType) where.lessonType = lessonType
    if (isPremium !== undefined) where.isPremium = isPremium === 'true'
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ]
    }
    if (tag) {
      where.tags = { some: { tag: { slug: tag } } }
    }

    const [items, total] = await Promise.all([
      prisma.lesson.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { id: true, nickname: true, displayName: true, avatarUrl: true }
          },
          module: {
            select: { 
              id: true, 
              title: true, 
              course: { select: { id: true, title: true, slug: true } }
            }
          },
          tags: {
            include: { tag: { select: { id: true, name: true, slug: true, color: true } } }
          },
          _count: { select: { favorites: true, progress: true } }
        }
      }),
      prisma.lesson.count({ where })
    ])

    return c.json({
      items: items.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        slug: lesson.slug,
        description: lesson.description,
        lessonType: lesson.lessonType,
        duration: lesson.duration,
        coverImage: lesson.coverImage,
        isPremium: lesson.isPremium,
        status: lesson.status,
        viewsCount: lesson.viewsCount,
        likesCount: lesson.likesCount,
        publishedAt: lesson.publishedAt,
        createdAt: lesson.createdAt,
        author: lesson.author,
        module: lesson.module,
        tags: lesson.tags.map(t => t.tag),
        _count: lesson._count
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get lessons error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === GET /lessons/:slug — детальная страница урока ===
lessons.get('/:slug', async (c) => {
  try {
    const slug = c.req.param('slug')

    const lesson = await prisma.lesson.findUnique({
      where: { slug, deletedAt: null, status: 'PUBLISHED' },
      include: {
        author: {
          select: { id: true, nickname: true, displayName: true, avatarUrl: true, bio: true }
        },
        module: {
          include: {
            course: { select: { id: true, title: true, slug: true } }
          }
        },
        tags: {
          include: { tag: { select: { id: true, name: true, slug: true, color: true } } }
        },
        textContent: true,
        videoContent: true,
        audioContent: true,
        quizContent: true
      }
    })

    if (!lesson) {
      throw new AppError(404, 'Урок не найден', 'LESSON_NOT_FOUND')
    }

    // Увеличиваем счётчик просмотров
    await prisma.lesson.update({
      where: { id: lesson.id },
      data: { viewsCount: { increment: 1 } }
    })

    const response: Record<string, unknown> = {
      id: lesson.id,
      title: lesson.title,
      slug: lesson.slug,
      description: lesson.description,
      lessonType: lesson.lessonType,
      duration: lesson.duration,
      coverImage: lesson.coverImage,
      isPremium: lesson.isPremium,
      viewsCount: lesson.viewsCount + 1,
      likesCount: lesson.likesCount,
      publishedAt: lesson.publishedAt,
      createdAt: lesson.createdAt,
      author: lesson.author,
      module: lesson.module,
      tags: lesson.tags.map(t => t.tag)
    }

    // Добавляем контент в зависимости от типа
    if (lesson.textContent) {
      response.content = {
        type: 'text',
        body: lesson.textContent.body,
        wordCount: lesson.textContent.wordCount,
        readingTime: lesson.textContent.readingTime
      }
    } else if (lesson.videoContent) {
      response.content = {
        type: 'video',
        videoUrl: lesson.videoContent.videoUrl,
        provider: lesson.videoContent.provider,
        duration: lesson.videoContent.duration,
        qualities: lesson.videoContent.qualities,
        subtitles: lesson.videoContent.subtitles
      }
    } else if (lesson.audioContent) {
      response.content = {
        type: 'audio',
        audioUrl: lesson.audioContent.audioUrl,
        duration: lesson.audioContent.duration
      }
    } else if (lesson.quizContent) {
      response.content = {
        type: 'quiz',
        questions: lesson.quizContent.questions,
        passingScore: lesson.quizContent.passingScore,
        attemptsAllowed: lesson.quizContent.attemptsAllowed
      }
    }

    return c.json(response)
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode as any)
    }
    console.error('Get lesson error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === GET /lessons/:slug/content — контент урока ===
lessons.get('/:slug/content', async (c) => {
  try {
    const slug = c.req.param('slug')

    const lesson = await prisma.lesson.findUnique({
      where: { slug, deletedAt: null, status: 'PUBLISHED' },
      select: {
        id: true,
        lessonType: true,
        textContent: true,
        videoContent: true,
        audioContent: true,
        quizContent: true
      }
    })

    if (!lesson) {
      throw new AppError(404, 'Урок не найден', 'LESSON_NOT_FOUND')
    }

    let content: Record<string, unknown> | null = null

    if (lesson.textContent) {
      content = {
        type: 'text',
        body: lesson.textContent.body,
        wordCount: lesson.textContent.wordCount,
        readingTime: lesson.textContent.readingTime
      }
    } else if (lesson.videoContent) {
      content = {
        type: 'video',
        videoUrl: lesson.videoContent.videoUrl,
        provider: lesson.videoContent.provider,
        duration: lesson.videoContent.duration,
        qualities: lesson.videoContent.qualities,
        subtitles: lesson.videoContent.subtitles
      }
    } else if (lesson.audioContent) {
      content = {
        type: 'audio',
        audioUrl: lesson.audioContent.audioUrl,
        duration: lesson.audioContent.duration
      }
    } else if (lesson.quizContent) {
      content = {
        type: 'quiz',
        questions: lesson.quizContent.questions,
        passingScore: lesson.quizContent.passingScore,
        attemptsAllowed: lesson.quizContent.attemptsAllowed
      }
    }

    return c.json({ content })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode as any)
    }
    console.error('Get lesson content error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export default lessons


