// server/routes/progress.routes.ts
/**
 * Роуты для отслеживания прогресса обучения
 */

import { Hono } from 'hono'
import { prisma } from '../db'
import { requireAuth } from '../middleware/auth'
import { AppError } from '../lib/errors'

const progress = new Hono()

// Все роуты требуют авторизации
progress.use('/*', requireAuth)

// === GET /progress/courses/:courseId — прогресс по курсу ===
progress.get('/courses/:courseId', async (c) => {
  try {
    const courseId = c.req.param('courseId')
    const user = c.get('user')

    const courseProgress = await prisma.courseProgress.findUnique({
      where: {
        profileId_courseId: {
          profileId: user.id,
          courseId
        }
      }
    })

    return c.json(courseProgress || { status: 'NOT_STARTED', progressPercent: 0 })
  } catch (error) {
    console.error('Get course progress error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === POST /progress/courses/:courseId/start — начать курс ===
progress.post('/courses/:courseId/start', async (c) => {
  try {
    const courseId = c.req.param('courseId')
    const user = c.get('user')

    // Проверяем существование курса
    const course = await prisma.course.findUnique({
      where: { id: courseId, deletedAt: null }
    })

    if (!course) {
      throw new AppError(404, 'Курс не найден', 'COURSE_NOT_FOUND')
    }

    // Создаём или обновляем прогресс
    const progressData = await prisma.courseProgress.upsert({
      where: {
        profileId_courseId: {
          profileId: user.id,
          courseId
        }
      },
      create: {
        profileId: user.id,
        courseId,
        status: 'IN_PROGRESS',
        progressPercent: 0
      },
      update: {
        status: 'IN_PROGRESS',
        lastViewedAt: new Date()
      }
    })

    return c.json(progressData)
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Start course error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === GET /progress/lessons/:lessonId — прогресс урока ===
progress.get('/lessons/:lessonId', async (c) => {
  try {
    const lessonId = c.req.param('lessonId')
    const user = c.get('user')

    const lessonProgress = await prisma.lessonProgress.findUnique({
      where: {
        profileId_lessonId: {
          profileId: user.id,
          lessonId
        }
      }
    })

    return c.json(lessonProgress || { status: 'NOT_STARTED', progressPercent: 0 })
  } catch (error) {
    console.error('Get lesson progress error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === POST /progress/lessons/:lessonId/complete — завершить урок ===
progress.post('/lessons/:lessonId/complete', async (c) => {
  try {
    const lessonId = c.req.param('lessonId')
    const user = c.get('user')

    // Проверяем существование урока
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId, deletedAt: null },
      include: {
        module: {
          select: { courseId: true }
        }
      }
    })

    if (!lesson) {
      throw new AppError(404, 'Урок не найден', 'LESSON_NOT_FOUND')
    }

    // Создаём или обновляем прогресс урока
    const lessonProgress = await prisma.lessonProgress.upsert({
      where: {
        profileId_lessonId: {
          profileId: user.id,
          lessonId
        }
      },
      create: {
        profileId: user.id,
        lessonId,
        status: 'COMPLETED',
        completedAt: new Date()
      },
      update: {
        status: 'COMPLETED',
        completedAt: new Date()
      }
    })

    // Обновляем прогресс курса
    await updateCourseProgress(user.id, lesson.module.courseId)

    return c.json(lessonProgress)
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Complete lesson error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === PATCH /progress/lessons/:lessonId — обновить прогресс ===
progress.patch('/lessons/:lessonId', async (c) => {
  try {
    const lessonId = c.req.param('lessonId')
    const user = c.get('user')
    const body = await c.req.json()
    const { progressPercent, lastPosition, status } = body

    // Проверяем существование урока
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId, deletedAt: null }
    })

    if (!lesson) {
      throw new AppError(404, 'Урок не найден', 'LESSON_NOT_FOUND')
    }

    // Создаём или обновляем прогресс
    const lessonProgress = await prisma.lessonProgress.upsert({
      where: {
        profileId_lessonId: {
          profileId: user.id,
          lessonId
        }
      },
      create: {
        profileId: user.id,
        lessonId,
        status: status || 'IN_PROGRESS',
        progressPercent: progressPercent || 0,
        lastPosition: lastPosition || 0,
        startedAt: new Date()
      },
      update: {
        status: status || 'IN_PROGRESS',
        progressPercent: progressPercent ?? undefined,
        lastPosition: lastPosition ?? undefined
      }
    })

    return c.json(lessonProgress)
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Update lesson progress error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Вспомогательная функция для обновления прогресса курса
async function updateCourseProgress(profileId: string, courseId: string) {
  // Получаем все опубликованные уроки курса
  const modules = await prisma.module.findMany({
    where: { courseId, isPublished: true },
    include: {
      lessons: {
        where: { deletedAt: null, status: 'PUBLISHED' },
        select: { id: true }
      }
    }
  })

  const allLessonIds = modules.flatMap(m => m.lessons.map(l => l.id))
  const totalLessons = allLessonIds.length

  if (totalLessons === 0) return

  // Получаем количество пройденных уроков
  const completedLessons = await prisma.lessonProgress.count({
    where: {
      profileId,
      lessonId: { in: allLessonIds },
      status: 'COMPLETED'
    }
  })

  const progressPercent = Math.round((completedLessons / totalLessons) * 100)
  const status = progressPercent === 100 ? 'COMPLETED' : progressPercent > 0 ? 'IN_PROGRESS' : 'NOT_STARTED'

  await prisma.courseProgress.upsert({
    where: {
      profileId_courseId: {
        profileId,
        courseId
      }
    },
    create: {
      profileId,
      courseId,
      status,
      progressPercent,
      completedLessons
    },
    update: {
      status,
      progressPercent,
      completedLessons,
      lastViewedAt: new Date()
    }
  })
}

export default progress
