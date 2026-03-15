// server/routes/reactions.routes.ts
import { Hono } from 'hono'
import { prisma } from '../db'
import { AppError } from '../lib/errors'
import type { ContextWithSession } from '../types'

const reactions = new Hono()

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

// === GET /reactions — получить реакции для контента ===
reactions.get('/', async (c) => {
  try {
    const type = c.req.query('type') as 'COURSE' | 'LESSON' | 'COMMENT' | null
    const id = c.req.query('id')

    if (!type || !id) {
      return c.json({ likes: 0, dislikes: 0, userReaction: null })
    }

    const [likes, dislikes] = await Promise.all([
      prisma.reaction.count({
        where: { reactionableType: type, reactionableId: id, type: 'LIKE' }
      }),
      prisma.reaction.count({
        where: { reactionableType: type, reactionableId: id, type: 'DISLIKE' }
      })
    ])

    // Проверяем реакцию пользователя
    let userReaction = null
    try {
      const profile = await getProfileFromSession(c)
      const reaction = await prisma.reaction.findUnique({
        where: {
          profileId_reactionableType_reactionableId: {
            profileId: profile.id,
            reactionableType: type,
            reactionableId: id
          }
        }
      })
      userReaction = reaction?.type || null
    } catch {
      // Пользователь не авторизован — игнорируем
    }

    return c.json({ likes, dislikes, userReaction })
  } catch (error) {
    console.error('Get reactions error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === POST /reactions — поставить/изменить реакцию ===
reactions.post('/', async (c) => {
  try {
    const profile = await getProfileFromSession(c)
    const { type, reactionType } = await c.req.json()
    // type: 'COURSE' | 'LESSON' | 'COMMENT'
    // reactionType: 'LIKE' | 'DISLIKE'

    if (!['COURSE', 'LESSON', 'COMMENT'].includes(type)) {
      throw new AppError(400, 'Неверный тип контента', 'INVALID_TYPE')
    }

    if (!['LIKE', 'DISLIKE'].includes(reactionType)) {
      throw new AppError(400, 'Неверный тип реакции', 'INVALID_REACTION')
    }

    const body = await c.req.json()
    const reactionableId = body.id

    // Проверяем существование реакции
    const existing = await prisma.reaction.findUnique({
      where: {
        profileId_reactionableType_reactionableId: {
          profileId: profile.id,
          reactionableType: type,
          reactionableId
        }
      }
    })

    if (existing) {
      if (existing.type === reactionType) {
        // Удаляем реакцию, если та же самая
        await prisma.reaction.delete({ where: { id: existing.id } })
        
        // Обновляем счётчик
        if (type === 'COURSE') {
          await prisma.course.update({
            where: { id: reactionableId },
            data: { likesCount: { decrement: reactionType === 'LIKE' ? 1 : 0 } }
          })
        } else if (type === 'LESSON') {
          await prisma.lesson.update({
            where: { id: reactionableId },
            data: { likesCount: { decrement: reactionType === 'LIKE' ? 1 : 0 } }
          })
        }

        return c.json({ message: 'Реакция удалена', reaction: null })
      } else {
        // Меняем тип реакции
        const updated = await prisma.reaction.update({
          where: { id: existing.id },
          data: { type: reactionType }
        })
        return c.json({ message: 'Реакция изменена', reaction: updated })
      }
    }

    // Создаём новую реакцию
    const reaction = await prisma.reaction.create({
      data: {
        profileId: profile.id,
        reactionableType: type,
        reactionableId,
        type: reactionType
      }
    })

    // Обновляем счётчик
    if (type === 'COURSE') {
      await prisma.course.update({
        where: { id: reactionableId },
        data: { likesCount: { increment: reactionType === 'LIKE' ? 1 : 0 } }
      })
    } else if (type === 'LESSON') {
      await prisma.lesson.update({
        where: { id: reactionableId },
        data: { likesCount: { increment: reactionType === 'LIKE' ? 1 : 0 } }
      })
    }

    return c.json({ message: 'Реакция добавлена', reaction }, 201)
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Create reaction error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// === DELETE /reactions — удалить реакцию ===
reactions.delete('/', async (c) => {
  try {
    const profile = await getProfileFromSession(c)
    const { type, id } = await c.req.json()

    const reaction = await prisma.reaction.findUnique({
      where: {
        profileId_reactionableType_reactionableId: {
          profileId: profile.id,
          reactionableType: type,
          reactionableId: id
        }
      }
    })

    if (!reaction) {
      throw new AppError(404, 'Реакция не найдена', 'REACTION_NOT_FOUND')
    }

    await prisma.reaction.delete({ where: { id: reaction.id } })

    // Обновляем счётчик
    if (type === 'COURSE') {
      await prisma.course.update({
        where: { id },
        data: { likesCount: { decrement: reaction.type === 'LIKE' ? 1 : 0 } }
      })
    } else if (type === 'LESSON') {
      await prisma.lesson.update({
        where: { id },
        data: { likesCount: { decrement: reaction.type === 'LIKE' ? 1 : 0 } }
      })
    }

    return c.json({ message: 'Реакция удалена' })
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ error: error.message, code: error.code }, error.statusCode)
    }
    console.error('Delete reaction error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export default reactions
