// server/routes/courses.routes.ts
import { Hono } from 'hono'
import { prisma } from '../db'
import { AppError } from '../lib/errors'
import type { CourseWhereInput } from '../types'

const courses = new Hono()

// === GET /courses — список курсов с пагинацией и фильтрами ===
courses.get('/', async (c) => {
  try {
    const page = Math.max(1, parseInt(c.req.query('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(c.req.query('limit') || '20')))
    const skip = (page - 1) * limit

    // Фильтры
    const status = c.req.query('status') as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | null
    const difficulty = c.req.query('difficulty') as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | null
    const tag = c.req.query('tag')
    const search = c.req.query('search')
    const isPremium = c.req.query('isPremium')
    const sort = c.req.query('sort') || 'created_at_desc'

    // Построение where
    const where: CourseWhereInput = { deletedAt: null }
    
    if (status) where.status = status
    if (difficulty) where.difficultyLevel = difficulty
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

    // Сортировка
    let orderBy: { createdAt: 'asc' | 'desc' } | { viewsCount: 'desc' } | { title: 'asc' } = { createdAt: 'desc' }
    switch (sort) {
      case 'created_at_asc':
        orderBy = { createdAt: 'asc' }
        break
      case 'popular':
        orderBy = { viewsCount: 'desc' }
        break
      case 'title_asc':
        orderBy = { title: 'asc' }
        break
    }

    const [items, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          author: {
            select: { id: true, nickname: true, displayName: true, avatarUrl: true }
          },
          tags: {
            include: { tag: { select: { id: true, name: true, slug: true, color: true } } }
          },
          modules: {
            include: {
              _count: { select: { lessons: { where: { deletedAt: null, status: 'PUBLISHED' } } } }
            }
          },
          _count: { select: { modules: true, progress: true } }
        }
      }),
      prisma.course.count({ where })
    ])

    return c.json({
      items: items.map(course => {
        // Вычисляем реальное количество уроков из модулей
        const actualLessonsCount = course.modules.reduce((sum, m) => sum + (m._count?.lessons || 0), 0)
        
        return {
          id: course.id,
          title: course.title,
          slug: course.slug,
          description: course.description,
          coverImage: course.coverImage,
          difficultyLevel: course.difficultyLevel,
          duration: course.duration,
          lessonsCount: actualLessonsCount,
          modulesCount: course.modules.length,
          status: course.status,
          isPremium: course.isPremium,
          viewsCount: course.viewsCount,
          likesCount: course.likesCount,
          publishedAt: course.publishedAt,
          createdAt: course.createdAt,
          author: course.author,
          tags: course.tags.map(t => t.tag),
          _count: course._count
        }
      }),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get courses error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === GET /courses/:slug — детальная страница курса ===
courses.get('/:slug', async (c) => {
  try {
    const slug = c.req.param('slug')
    const includeUnpublished = c.req.query('includeUnpublished') === 'true'

    const course = await prisma.course.findUnique({
      where: { slug, deletedAt: null },
      include: {
        author: {
          select: { id: true, nickname: true, displayName: true, avatarUrl: true, bio: true }
        },
        tags: {
          include: { tag: { select: { id: true, name: true, slug: true, color: true } } }
        },
        modules: {
          orderBy: { sortOrder: 'asc' },
          include: {
            lessons: {
              where: includeUnpublished 
                ? { deletedAt: null } 
                : { deletedAt: null, status: 'PUBLISHED' },
              orderBy: { sortOrder: 'asc' },
              select: {
                id: true,
                title: true,
                slug: true,
                lessonType: true,
                duration: true,
                isPremium: true,
                sortOrder: true,
                status: true,
              }
            },
            _count: { select: { lessons: true } }
          }
        },
        _count: { select: { modules: true, progress: true } }
      }
    })

    if (!course) {
      throw new AppError(404, 'Курс не найден', 'COURSE_NOT_FOUND')
    }

    // Увеличиваем счётчик просмотров (только для опубликованных)
    if (!includeUnpublished) {
      await prisma.course.update({
        where: { id: course.id },
        data: { viewsCount: { increment: 1 } }
      })
    }

    // Вычисляем реальное количество уроков
    const actualLessonsCount = course.modules.reduce((sum, m) => sum + m.lessons.length, 0)

    return c.json({
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      coverImage: course.coverImage,
      difficultyLevel: course.difficultyLevel,
      duration: course.duration,
      lessonsCount: actualLessonsCount,
      modulesCount: course.modules.length,
      status: course.status,
      isPremium: course.isPremium,
      viewsCount: course.viewsCount + (includeUnpublished ? 0 : 1),
      likesCount: course.likesCount,
      publishedAt: course.publishedAt,
      createdAt: course.createdAt,
      author: course.author,
      tags: course.tags.map(t => t.tag),
      modules: course.modules.map(m => ({
        id: m.id,
        title: m.title,
        description: m.description,
        sortOrder: m.sortOrder,
        lessonsCount: m.lessons.length,
        duration: m.duration,
        isPublished: m.isPublished,
        lessons: m.lessons,
        _count: m._count
      })),
      _count: course._count
    })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Get course error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === GET /courses/:slug/lessons/:lessonSlug — урок с контентом ===
courses.get('/:slug/lessons/:lessonSlug', async (c) => {
  try {
    const slug = c.req.param('slug')
    const lessonSlug = c.req.param('lessonSlug')

    const lesson = await prisma.lesson.findFirst({
      where: { 
        slug: lessonSlug,
        deletedAt: null,
        status: 'PUBLISHED',
        module: {
          course: { slug, deletedAt: null }
        }
      },
      include: {
        module: {
          select: {
            id: true,
            title: true,
            sortOrder: true,
            course: {
              select: { id: true, title: true, slug: true }
            }
          }
        },
        textContent: true,
        videoContent: true,
        audioContent: true,
        quizContent: true,
      }
    })

    if (!lesson) {
      throw new AppError(404, 'Урок не найден', 'LESSON_NOT_FOUND')
    }

    // Формируем контент в зависимости от типа
    let content = null
    switch (lesson.lessonType) {
      case 'ARTICLE':
        content = lesson.textContent ? {
          type: 'text',
          body: lesson.textContent.body,
        } : null
        break
      case 'VIDEO':
        content = lesson.videoContent ? {
          type: 'video',
          videoUrl: lesson.videoContent.videoUrl,
          platform: lesson.videoContent.platform,
          body: lesson.videoContent.description,
        } : null
        break
      case 'AUDIO':
        content = lesson.audioContent ? {
          type: 'audio',
          audioUrl: lesson.audioContent.audioUrl,
          body: lesson.audioContent.description,
        } : null
        break
      case 'QUIZ':
        content = lesson.quizContent ? {
          type: 'quiz',
          questions: lesson.quizContent.questions,
          passingScore: lesson.quizContent.passingScore,
        } : null
        break
    }

    return c.json({
      id: lesson.id,
      title: lesson.title,
      slug: lesson.slug,
      description: lesson.description,
      lessonType: lesson.lessonType,
      duration: lesson.duration,
      isPremium: lesson.isPremium,
      sortOrder: lesson.sortOrder,
      status: lesson.status,
      content,
      module: lesson.module
    })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Get lesson error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === GET /courses/:slug/modules — модули курса с уроками ===
courses.get('/:slug/modules', async (c) => {
  try {
    const slug = c.req.param('slug')

    const course = await prisma.course.findUnique({
      where: { slug, deletedAt: null },
      select: { id: true }
    })

    if (!course) {
      throw new AppError(404, 'Курс не найден', 'COURSE_NOT_FOUND')
    }

    const modules = await prisma.module.findMany({
      where: { courseId: course.id, isPublished: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        lessons: {
          where: { deletedAt: null, status: 'PUBLISHED' },
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            title: true,
            slug: true,
            lessonType: true,
            duration: true,
            isPremium: true,
            sortOrder: true
          }
        }
      }
    })

    return c.json({
      modules: modules.map(m => ({
        id: m.id,
        title: m.title,
        description: m.description,
        sortOrder: m.sortOrder,
        lessonsCount: m.lessonsCount,
        duration: m.duration,
        lessons: m.lessons
      }))
    })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Get course modules error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === GET /courses/:slug/modules/:moduleId — модуль с уроками ===
courses.get('/:slug/modules/:moduleId', async (c) => {
  try {
    const slug = c.req.param('slug')
    const moduleId = c.req.param('moduleId')

    const module = await prisma.module.findFirst({
      where: { 
        id: moduleId,
        course: { slug, deletedAt: null },
        isPublished: true 
      },
      include: {
        course: {
          select: { id: true, title: true, slug: true }
        },
        lessons: {
          where: { deletedAt: null, status: 'PUBLISHED' },
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            lessonType: true,
            duration: true,
            isPremium: true,
            sortOrder: true,
            coverImage: true
          }
        }
      }
    })

    if (!module) {
      throw new AppError(404, 'Модуль не найден', 'MODULE_NOT_FOUND')
    }

    return c.json({
      id: module.id,
      title: module.title,
      description: module.description,
      sortOrder: module.sortOrder,
      lessonsCount: module.lessonsCount,
      duration: module.duration,
      course: module.course,
      lessons: module.lessons
    })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Get module error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export default courses
