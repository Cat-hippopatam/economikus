// server/routes/comments.routes.ts
import { Hono } from 'hono'
import { prisma } from '../db'
import { AppError } from '../lib/errors'
import type { ContextWithSession } from '../types'

const comments = new Hono()

// Вспомогательная функция для получения профиля из сессии
async function getProfileFromSession(c: ContextWithSession) {
  const cookie = c.req.header('Cookie')
  const sessionMatch = cookie?.match(/session=([^;]+)/)
  
  if (!sessionMatch?.[1]) {
    throw new AppError(401, 'Не авторизован', 'UNAUTHORIZED')
  }

  const session = await prisma.session.findUnique({
    where: { sessionToken: sessionMatch[1], expires: { gt: new Date() } },
    include: { user: { include: { profile: true } } }
  })

  if (!session || !session.user.profile) {
    throw new AppError(401, 'Сессия истекла', 'SESSION_EXPIRED')
  }

  return session.user.profile
}

// === GET /comments — список комментариев ===
comments.get('/', async (c) => {
  try {
    const type = c.req.query('type') as 'COURSE' | 'LESSON' | null
    const id = c.req.query('id')
    const page = Math.max(1, parseInt(c.req.query('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(c.req.query('limit') || '20')))
    const skip = (page - 1) * limit

    if (!type || !id) {
      throw new AppError(400, 'Не указан тип или ID контента', 'MISSING_PARAMS')
    }

    const where = {
      commentableType: type,
      commentableId: id,
      deletedAt: null,
      status: 'APPROVED' as const
    }

    const [items, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { id: true, nickname: true, displayName: true, avatarUrl: true }
          }
        }
      }),
      prisma.comment.count({ where })
    ])

    return c.json({
      items: items.map(comment => ({
        id: comment.id,
        text: comment.text,
        likesCount: comment.likesCount,
        createdAt: comment.createdAt,
        author: comment.author
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Get comments error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === POST /comments — добавить комментарий ===
comments.post('/', async (c) => {
  try {
    const profile = await getProfileFromSession(c)
    const { type, id, text } = await c.req.json()

    if (!['COURSE', 'LESSON'].includes(type)) {
      throw new AppError(400, 'Неверный тип контента', 'INVALID_TYPE')
    }

    if (!text || text.trim().length < 1) {
      throw new AppError(400, 'Комментарий не может быть пустым', 'EMPTY_COMMENT')
    }

    if (text.length > 2000) {
      throw new AppError(400, 'Комментарий слишком длинный (макс. 2000 символов)', 'COMMENT_TOO_LONG')
    }

    const comment = await prisma.comment.create({
      data: {
        commentableType: type,
        commentableId: id,
        authorProfileId: profile.id,
        text: text.trim(),
        status: 'APPROVED' // Авто-одобрение, можно изменить на PENDING для модерации
      },
      include: {
        author: {
          select: { id: true, nickname: true, displayName: true, avatarUrl: true }
        }
      }
    })

    return c.json({
      message: 'Комментарий добавлен',
      comment: {
        id: comment.id,
        text: comment.text,
        likesCount: comment.likesCount,
        createdAt: comment.createdAt,
        author: comment.author
      }
    }, 201)
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Create comment error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === PATCH /comments/:id — редактировать комментарий ===
comments.patch('/:id', async (c) => {
  try {
    const profile = await getProfileFromSession(c)
    const id = c.req.param('id')
    const { text } = await c.req.json()

    const comment = await prisma.comment.findFirst({
      where: { id, authorProfileId: profile.id, deletedAt: null }
    })

    if (!comment) {
      throw new AppError(404, 'Комментарий не найден', 'COMMENT_NOT_FOUND')
    }

    if (!text || text.trim().length < 1) {
      throw new AppError(400, 'Комментарий не может быть пустым', 'EMPTY_COMMENT')
    }

    const updated = await prisma.comment.update({
      where: { id },
      data: { text: text.trim() },
      include: {
        author: {
          select: { id: true, nickname: true, displayName: true, avatarUrl: true }
        }
      }
    })

    return c.json({
      message: 'Комментарий обновлён',
      comment: {
        id: updated.id,
        text: updated.text,
        likesCount: updated.likesCount,
        createdAt: updated.createdAt,
        author: updated.author
      }
    })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Update comment error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === DELETE /comments/:id — удалить комментарий ===
comments.delete('/:id', async (c) => {
  try {
    const profile = await getProfileFromSession(c)
    const id = c.req.param('id')

    const comment = await prisma.comment.findFirst({
      where: { id, authorProfileId: profile.id, deletedAt: null }
    })

    if (!comment) {
      throw new AppError(404, 'Комментарий не найден', 'COMMENT_NOT_FOUND')
    }

    // Soft delete
    await prisma.comment.update({
      where: { id },
      data: { deletedAt: new Date() }
    })

    return c.json({ message: 'Комментарий удалён' })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Delete comment error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export default comments
